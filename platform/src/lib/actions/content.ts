"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { requireAuth, requireTenantId, getDemoWriteContext, persistDemoOverlay, getDemoSessionId } from "./guard";
import {
  patchSectionOverlay,
  addOverlaySection,
  setSectionOrderOverlay,
  applySectionsOverlay,
} from "@/lib/demoOverlay";
import { SECTION_DEFAULTS } from "@/lib/sectionDefaults";
import { limitError, releaseMediaIn } from "@/lib/usage";
import { getPageTemplate } from "@/lib/pageTemplates";
import type { SectionType } from "@/lib/config";

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "page";
}

// ─── Pages ───────────────────────────────────────────────────────────────────
export type LimitResult = { error: string } | undefined;

const DEMO_PAGES_MSG = "Adding new pages is part of the full version — buy a plan to unlock it. You can edit every existing page in this demo.";

export async function createPage(formData: FormData): Promise<LimitResult> {
  if (await getDemoSessionId()) return { error: DEMO_PAGES_MSG };
  const { tenant } = await requireAuth();
  const tenantId = tenant.id;
  const over = await limitError(tenant, "pages");
  if (over) return { error: over };
  const title = (formData.get("title")?.toString() ?? "").trim() || "New Page";
  let slug = slugify(formData.get("slug")?.toString() || title);

  // ensure unique slug
  const existing = await db.page.findFirst({ where: { tenantId, slug } });
  if (existing) slug = `${slug}-${Date.now().toString().slice(-4)}`;

  const tpl = getPageTemplate(formData.get("type")?.toString() ?? "blank");
  const sections = tpl.sections.map((t, i) => ({ type: t, order: i, content: JSON.stringify(SECTION_DEFAULTS[t] ?? {}) }));

  const published = formData.get("published") !== "off";
  const showInNav = formData.get("showInNav") !== "off";
  const seoTitle = (formData.get("seoTitle")?.toString() ?? "").trim();
  const seoDescription = (formData.get("seoDescription")?.toString() ?? "").trim();
  const noindex = formData.get("noindex") === "on";

  const max = await db.page.aggregate({ where: { tenantId }, _max: { order: true } });
  const page = await db.page.create({
    data: {
      tenantId,
      slug,
      title,
      isSystem: false,
      published,
      showInNav,
      seoTitle: seoTitle || title,
      seoDescription,
      noindex,
      order: (max._max.order ?? 0) + 1,
      sections: { create: sections },
    },
  });
  revalidatePath("/admin/pages");
  redirect(`/admin/pages/${page.id}`);
}

export async function updatePageMeta(formData: FormData) {
  const tenantId = await requireTenantId();
  const id = formData.get("id")?.toString() ?? "";
  const title = (formData.get("title")?.toString() ?? "").trim();
  const published = formData.get("published") === "on";
  const showInNav = formData.get("showInNav") === "on";
  const seoTitle = (formData.get("seoTitle")?.toString() ?? "").trim();
  const seoDescription = (formData.get("seoDescription")?.toString() ?? "").trim();
  const seoImage = (formData.get("seoImage")?.toString() ?? "").trim();
  const noindex = formData.get("noindex") === "on";
  await db.page.updateMany({ where: { id, tenantId }, data: { title, published, showInNav, seoTitle, seoDescription, seoImage, noindex } });
  revalidatePath("/admin/pages");
  revalidatePath(`/admin/pages/${id}`);
}

export async function deletePage(id: string) {
  const tenantId = await requireTenantId();
  // System pages are protected from deletion.
  const page = await db.page.findFirst({ where: { id, tenantId, isSystem: false }, include: { sections: true } });
  await db.page.deleteMany({ where: { id, tenantId, isSystem: false } });
  await releaseMediaIn(tenantId, page);
  revalidatePath("/admin/pages");
}

// Duplicate a page (with all its sections) into a new custom page.
export async function duplicatePage(id: string): Promise<LimitResult> {
  if (await getDemoSessionId()) return { error: DEMO_PAGES_MSG };
  const { tenant } = await requireAuth();
  const tenantId = tenant.id;
  const over = await limitError(tenant, "pages");
  if (over) return { error: over };
  const src = await db.page.findFirst({ where: { id, tenantId }, include: { sections: { orderBy: { order: "asc" } } } });
  if (!src) throw new Error("Not found");
  let slug = `${src.slug}-copy`;
  if (await db.page.findFirst({ where: { tenantId, slug } })) slug = `${slug}-${Date.now().toString().slice(-4)}`;
  const max = await db.page.aggregate({ where: { tenantId }, _max: { order: true } });
  const page = await db.page.create({
    data: {
      tenantId,
      slug,
      title: `${src.title} (copy)`,
      isSystem: false,
      published: false,
      order: (max._max.order ?? 0) + 1,
      seoTitle: src.seoTitle,
      seoDescription: src.seoDescription,
      sections: { create: src.sections.map((s) => ({ type: s.type, order: s.order, visible: s.visible, content: s.content, style: s.style })) },
    },
  });
  revalidatePath("/admin/pages");
  redirect(`/admin/pages/${page.id}`);
}

// ─── Sections ────────────────────────────────────────────────────────────────
export type AddSectionOpts = {
  /** Insert position in the page's current section list (default: end). */
  index?: number;
  /** Restore a deleted section (Undo) — otherwise the block's defaults are used. */
  content?: string;
  style?: string;
  visible?: boolean;
};

export async function addSection(pageId: string, type: string, opts: AddSectionOpts = {}) {
  const t = type as SectionType;
  const content = opts.content && isJson(opts.content) ? opts.content : JSON.stringify(SECTION_DEFAULTS[t] ?? {});
  const style = opts.style && isJson(opts.style) ? opts.style : "{}";
  const visible = opts.visible ?? true;
  const demo = await getDemoWriteContext();
  if (demo) {
    // Sandbox: the new section lives only in this visitor's overlay.
    const page = await db.page.findFirst({ where: { id: pageId, tenantId: demo.tenantId } });
    if (!page) throw new Error("Not found");
    const current = (await demoPageSections(demo, pageId)).map((x) => x.id);
    const newId = `demo_${Date.now().toString(36)}`;
    let next = addOverlaySection(demo.overlay, newId, { pageId, type: t, order: 10_000, visible, content, style });
    const at = opts.index == null ? current.length : Math.max(0, Math.min(current.length, opts.index));
    next = setSectionOrderOverlay(next, pageId, [...current.slice(0, at), newId, ...current.slice(at)]);
    await persistDemoOverlay(demo.sessionId, next);
    revalidatePath(`/admin/pages/${pageId}`);
    return;
  }
  const tenantId = await requireTenantId();
  const page = await db.page.findFirst({ where: { id: pageId, tenantId } });
  if (!page) throw new Error("Not found");
  const siblings = await db.section.findMany({ where: { pageId }, orderBy: { order: "asc" }, select: { order: true } });
  const at = opts.index == null ? siblings.length : Math.max(0, Math.min(siblings.length, opts.index));
  let order = (siblings[siblings.length - 1]?.order ?? -1) + 1;
  if (at < siblings.length) {
    // Make room: shift everything from the insert point down by one.
    order = siblings[at].order;
    await db.section.updateMany({ where: { pageId, order: { gte: order } }, data: { order: { increment: 1 } } });
  }
  await db.section.create({ data: { pageId, type: t, order, visible, content, style } });
  revalidatePath(`/admin/pages/${pageId}`);
}

function isJson(raw: string) {
  try { JSON.parse(raw); return true; } catch { return false; }
}

/** Demo: a section may be a DB row or one added in this visitor's overlay. */
async function demoSection(demo: NonNullable<Awaited<ReturnType<typeof getDemoWriteContext>>>, id: string) {
  const added = demo.overlay.addedSections?.[id];
  if (added) {
    const page = await db.page.findFirst({ where: { id: added.pageId, tenantId: demo.tenantId } });
    if (!page) throw new Error("Not found");
    return { id, ...added, page };
  }
  return assertSectionOwned(id, demo.tenantId);
}

/** Demo: the page's sections as this visitor sees them (overlay applied, in order). */
async function demoPageSections(demo: NonNullable<Awaited<ReturnType<typeof getDemoWriteContext>>>, pageId: string) {
  const rows = await db.section.findMany({ where: { pageId, page: { tenantId: demo.tenantId } }, orderBy: { order: "asc" } });
  return applySectionsOverlay(rows, pageId, demo.overlay);
}

async function assertSectionOwned(id: string, tenantId: string) {
  const section = await db.section.findFirst({ where: { id, page: { tenantId } }, include: { page: true } });
  if (!section) throw new Error("Not found");
  return section;
}

export async function updateSectionContent(id: string, content: string) {
  try { JSON.parse(content); } catch { throw new Error("Invalid content"); }

  const demo = await getDemoWriteContext();
  if (demo) {
    const section = await demoSection(demo, id);
    const next = patchSectionOverlay(demo.overlay, id, { content });
    await persistDemoOverlay(demo.sessionId, next);
    revalidatePath(`/admin/pages/${section.pageId}`);
    revalidatePath("/");
    if (section.page.slug && section.page.slug !== "home") revalidatePath(`/${section.page.slug}`);
    return;
  }

  const tenantId = await requireTenantId({ demoOk: true });
  const section = await assertSectionOwned(id, tenantId);
  await db.section.update({ where: { id }, data: { content } });
  revalidatePath(`/admin/pages/${section.pageId}`);
  revalidatePath("/");
  if (section.page.slug && section.page.slug !== "home") revalidatePath(`/${section.page.slug}`);
}

export async function updateSectionStyle(id: string, style: string) {
  try { JSON.parse(style); } catch { throw new Error("Invalid style"); }

  const demo = await getDemoWriteContext();
  if (demo) {
    const section = await demoSection(demo, id);
    const next = patchSectionOverlay(demo.overlay, id, { style });
    await persistDemoOverlay(demo.sessionId, next);
    revalidatePath(`/admin/pages/${section.pageId}`);
    revalidatePath("/");
    if (section.page.slug && section.page.slug !== "home") revalidatePath(`/${section.page.slug}`);
    return;
  }

  const tenantId = await requireTenantId({ demoOk: true });
  const section = await assertSectionOwned(id, tenantId);
  await db.section.update({ where: { id }, data: { style } });
  revalidatePath(`/admin/pages/${section.pageId}`);
  revalidatePath("/");
  if (section.page.slug && section.page.slug !== "home") revalidatePath(`/${section.page.slug}`);
}

export async function toggleSection(id: string) {
  const demo = await getDemoWriteContext();
  if (demo) {
    const section = await demoSection(demo, id);
    const baseVisible = demo.overlay.sections?.[id]?.visible ?? section.visible;
    const next = patchSectionOverlay(demo.overlay, id, { visible: !baseVisible });
    await persistDemoOverlay(demo.sessionId, next);
    revalidatePath(`/admin/pages/${section.pageId}`);
    return;
  }

  const tenantId = await requireTenantId({ demoOk: true });
  const section = await assertSectionOwned(id, tenantId);
  await db.section.update({ where: { id }, data: { visible: !section.visible } });
  revalidatePath(`/admin/pages/${section.pageId}`);
}

export async function deleteSection(id: string) {
  const demo = await getDemoWriteContext();
  if (demo) {
    const { pageId } = await demoSection(demo, id);
    const next = patchSectionOverlay(demo.overlay, id, { deleted: true });
    await persistDemoOverlay(demo.sessionId, next);
    revalidatePath(`/admin/pages/${pageId}`);
    return;
  }

  const tenantId = await requireTenantId({ demoOk: true });
  const section = await assertSectionOwned(id, tenantId);
  await db.section.delete({ where: { id } });
  revalidatePath(`/admin/pages/${section.pageId}`);
}

// Duplicate a section right below the original.
export async function duplicateSection(id: string) {
  const demo = await getDemoWriteContext();
  if (demo) {
    const { pageId } = await demoSection(demo, id);
    const list = await demoPageSections(demo, pageId);
    const idx = list.findIndex((x) => x.id === id);
    const src = list[idx];
    if (!src) return;
    const newId = `demo_${Date.now().toString(36)}`;
    let next = addOverlaySection(demo.overlay, newId, { pageId, type: src.type, order: 10_000, visible: src.visible, content: src.content, style: src.style });
    const ids = list.map((x) => x.id);
    ids.splice(idx + 1, 0, newId);
    next = setSectionOrderOverlay(next, pageId, ids);
    await persistDemoOverlay(demo.sessionId, next);
    revalidatePath(`/admin/pages/${pageId}`);
    return;
  }

  const tenantId = await requireTenantId({ demoOk: true });
  const section = await assertSectionOwned(id, tenantId);
  await db.section.updateMany({ where: { pageId: section.pageId, order: { gt: section.order } }, data: { order: { increment: 1 } } });
  await db.section.create({
    data: { pageId: section.pageId, type: section.type, order: section.order + 1, visible: section.visible, content: section.content, style: section.style },
  });
  revalidatePath(`/admin/pages/${section.pageId}`);
}

// Reorder all sections of a page from a drag-and-drop ordering.
export async function reorderSections(pageId: string, orderedIds: string[]) {
  const demo = await getDemoWriteContext();
  if (demo) {
    const next = setSectionOrderOverlay(demo.overlay, pageId, orderedIds);
    await persistDemoOverlay(demo.sessionId, next);
    revalidatePath(`/admin/pages/${pageId}`);
    return;
  }

  const tenantId = await requireTenantId({ demoOk: true });
  const page = await db.page.findFirst({ where: { id: pageId, tenantId } });
  if (!page) return;
  await db.$transaction(orderedIds.map((id, i) => db.section.updateMany({ where: { id, pageId }, data: { order: i } })));
  revalidatePath(`/admin/pages/${pageId}`);
}

export async function moveSection(id: string, dir: "up" | "down") {
  const demo = await getDemoWriteContext();
  if (demo) {
    const { pageId } = await demoSection(demo, id);
    const ids = (await demoPageSections(demo, pageId)).map((x) => x.id);
    const idx = ids.indexOf(id);
    const swapIdx = dir === "up" ? idx - 1 : idx + 1;
    if (idx < 0 || swapIdx < 0 || swapIdx >= ids.length) return;
    [ids[idx], ids[swapIdx]] = [ids[swapIdx], ids[idx]];
    await persistDemoOverlay(demo.sessionId, setSectionOrderOverlay(demo.overlay, pageId, ids));
    revalidatePath(`/admin/pages/${pageId}`);
    return;
  }

  const tenantId = await requireTenantId({ demoOk: true });
  const section = await assertSectionOwned(id, tenantId);
  const siblings = await db.section.findMany({ where: { pageId: section.pageId }, orderBy: { order: "asc" } });
  const idx = siblings.findIndex((s) => s.id === id);
  const swapWith = dir === "up" ? siblings[idx - 1] : siblings[idx + 1];
  if (!swapWith) return;
  await db.$transaction([
    db.section.update({ where: { id: section.id }, data: { order: swapWith.order } }),
    db.section.update({ where: { id: swapWith.id }, data: { order: section.order } }),
  ]);
  revalidatePath(`/admin/pages/${section.pageId}`);
}

// ─── Services ────────────────────────────────────────────────────────────────
async function uniqueServiceSlug(tenantId: string, title: string, excludeId?: string): Promise<string> {
  const base = slugify(title || "service");
  let slug = base;
  let i = 1;
  while (await db.service.findFirst({ where: { tenantId, slug, ...(excludeId ? { NOT: { id: excludeId } } : {}) } })) {
    slug = `${base}-${i++}`;
  }
  return slug;
}

export async function addService(formData: FormData): Promise<LimitResult> {
  const { tenant } = await requireAuth({ demoOk: true });
  const tenantId = tenant.id;
  const category = (formData.get("category")?.toString() ?? "").trim() || "General";
  const title = (formData.get("title")?.toString() ?? "").trim();
  if (!title) return;

  // Enforce the plan's service limit (demo tenants & legacy plans are unlimited).
  const over = await limitError(tenant, "services");
  if (over) return { error: over };
  const max = await db.service.aggregate({ where: { tenantId }, _max: { order: true } });
  const demoSessionId = await getDemoSessionId();
  await db.service.create({
    data: {
      tenantId,
      category,
      title,
      description: (formData.get("description")?.toString() ?? "").trim(),
      image: (formData.get("image")?.toString() ?? "").trim(),
      order: (max._max.order ?? 0) + 1,
      slug: await uniqueServiceSlug(tenantId, title),
      longDescription: (formData.get("longDescription")?.toString() ?? "").trim(),
      seoTitle: (formData.get("seoTitle")?.toString() ?? "").trim(),
      seoDescription: (formData.get("seoDescription")?.toString() ?? "").trim(),
      demoSessionId,
    },
  });
  revalidatePath("/admin/services");
  revalidatePath("/");
}

export async function updateService(formData: FormData) {
  const tenantId = await requireTenantId({ demoOk: true });
  const id = formData.get("id")?.toString() ?? "";
  const existing = await db.service.findFirst({ where: { id, tenantId } });
  if (!existing) return;
  const demoId = await getDemoSessionId();
  if (demoId && existing.demoSessionId !== demoId) return;
  const title = (formData.get("title")?.toString() ?? "").trim();
  const slug = existing.slug || (await uniqueServiceSlug(tenantId, title, id));
  await db.service.update({
    where: { id },
    data: {
      category: (formData.get("category")?.toString() ?? "").trim(),
      title,
      description: (formData.get("description")?.toString() ?? "").trim(),
      image: (formData.get("image")?.toString() ?? "").trim(),
      slug,
      longDescription: (formData.get("longDescription")?.toString() ?? "").trim(),
      seoTitle: (formData.get("seoTitle")?.toString() ?? "").trim(),
      seoDescription: (formData.get("seoDescription")?.toString() ?? "").trim(),
    },
  });
  revalidatePath("/admin/services");
  revalidatePath("/");
  if (slug) revalidatePath(`/services/${slug}`);
}

export async function deleteService(id: string) {
  const tenantId = await requireTenantId({ demoOk: true });
  const demoId = await getDemoSessionId();
  if (demoId) {
    const s = await db.service.findFirst({ where: { id, tenantId } });
    if (!s || s.demoSessionId !== demoId) return;
  }
  const existing = await db.service.findFirst({ where: { id, tenantId } });
  await db.service.deleteMany({ where: { id, tenantId } });
  if (!demoId) await releaseMediaIn(tenantId, existing);
  revalidatePath("/admin/services");
  revalidatePath("/");
  if (existing?.slug) revalidatePath(`/services/${existing.slug}`);
}

// ─── Gallery ─────────────────────────────────────────────────────────────────
export async function addGalleryItem(formData: FormData): Promise<LimitResult> {
  const { tenant } = await requireAuth({ demoOk: true });
  const tenantId = tenant.id;
  const over = await limitError(tenant, "gallery");
  if (over) return { error: over };
  const category = (formData.get("category")?.toString() ?? "").trim() || "General";
  const image = (formData.get("image")?.toString() ?? "").trim();
  if (!image) return { error: "Upload a photo or paste an image URL first." };
  const max = await db.galleryItem.aggregate({ where: { tenantId }, _max: { order: true } });
  const demoSessionId = await getDemoSessionId();
  await db.galleryItem.create({
    data: {
      tenantId,
      category,
      image,
      caption: (formData.get("caption")?.toString() ?? "").trim(),
      order: (max._max.order ?? 0) + 1,
      demoSessionId,
    },
  });
  revalidatePath("/admin/gallery");
  revalidatePath("/");
}

export async function deleteGalleryItem(id: string) {
  const tenantId = await requireTenantId({ demoOk: true });
  const demoId = await getDemoSessionId();
  if (demoId) {
    const g = await db.galleryItem.findFirst({ where: { id, tenantId } });
    if (!g || g.demoSessionId !== demoId) return;
  }
  const item = await db.galleryItem.findFirst({ where: { id, tenantId } });
  await db.galleryItem.deleteMany({ where: { id, tenantId } });
  if (!demoId) await releaseMediaIn(tenantId, item);
  revalidatePath("/admin/gallery");
  revalidatePath("/");
}
