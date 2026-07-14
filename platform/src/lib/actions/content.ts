"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { requireTenantId } from "./guard";
import { SECTION_DEFAULTS } from "@/lib/sectionDefaults";
import { getPlatformConfig } from "@/lib/platformConfig";
import { serviceLimitForPlan } from "@/lib/plans";
import type { SectionType } from "@/lib/config";

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "page";
}

// ─── Pages ───────────────────────────────────────────────────────────────────
export async function createPage(formData: FormData) {
  const tenantId = await requireTenantId();
  const title = (formData.get("title")?.toString() ?? "").trim() || "New Page";
  let slug = slugify(formData.get("slug")?.toString() || title);

  // ensure unique slug
  const existing = await db.page.findFirst({ where: { tenantId, slug } });
  if (existing) slug = `${slug}-${Date.now().toString().slice(-4)}`;

  const max = await db.page.aggregate({ where: { tenantId }, _max: { order: true } });
  const page = await db.page.create({
    data: {
      tenantId,
      slug,
      title,
      isSystem: false,
      order: (max._max.order ?? 0) + 1,
      sections: { create: [{ type: "richText", order: 0, content: JSON.stringify(SECTION_DEFAULTS.richText) }] },
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
  await db.page.deleteMany({ where: { id, tenantId, isSystem: false } });
  revalidatePath("/admin/pages");
}

// Duplicate a page (with all its sections) into a new custom page.
export async function duplicatePage(id: string) {
  const tenantId = await requireTenantId();
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
export async function addSection(pageId: string, type: string) {
  const tenantId = await requireTenantId();
  const page = await db.page.findFirst({ where: { id: pageId, tenantId } });
  if (!page) throw new Error("Not found");
  const t = type as SectionType;
  const max = await db.section.aggregate({ where: { pageId }, _max: { order: true } });
  await db.section.create({
    data: {
      pageId,
      type: t,
      order: (max._max.order ?? -1) + 1,
      content: JSON.stringify(SECTION_DEFAULTS[t] ?? {}),
    },
  });
  revalidatePath(`/admin/pages/${pageId}`);
}

async function assertSectionOwned(id: string, tenantId: string) {
  const section = await db.section.findFirst({ where: { id, page: { tenantId } }, include: { page: true } });
  if (!section) throw new Error("Not found");
  return section;
}

export async function updateSectionContent(id: string, content: string) {
  const tenantId = await requireTenantId();
  const section = await assertSectionOwned(id, tenantId);
  // validate JSON
  try { JSON.parse(content); } catch { throw new Error("Invalid content"); }
  await db.section.update({ where: { id }, data: { content } });
  revalidatePath(`/admin/pages/${section.pageId}`);
}

export async function updateSectionStyle(id: string, style: string) {
  const tenantId = await requireTenantId();
  const section = await assertSectionOwned(id, tenantId);
  try { JSON.parse(style); } catch { throw new Error("Invalid style"); }
  await db.section.update({ where: { id }, data: { style } });
  revalidatePath(`/admin/pages/${section.pageId}`);
}

export async function toggleSection(id: string) {
  const tenantId = await requireTenantId();
  const section = await assertSectionOwned(id, tenantId);
  await db.section.update({ where: { id }, data: { visible: !section.visible } });
  revalidatePath(`/admin/pages/${section.pageId}`);
}

export async function deleteSection(id: string) {
  const tenantId = await requireTenantId();
  const section = await assertSectionOwned(id, tenantId);
  await db.section.delete({ where: { id } });
  revalidatePath(`/admin/pages/${section.pageId}`);
}

export async function moveSection(id: string, dir: "up" | "down") {
  const tenantId = await requireTenantId();
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
export async function addService(formData: FormData) {
  const tenantId = await requireTenantId();
  const category = (formData.get("category")?.toString() ?? "").trim() || "General";
  const title = (formData.get("title")?.toString() ?? "").trim();
  if (!title) return;

  // Enforce the plan's service limit (0 = unlimited).
  const [tenant, cfg] = await Promise.all([db.tenant.findUnique({ where: { id: tenantId } }), getPlatformConfig()]);
  const limit = serviceLimitForPlan(tenant?.plan ?? "", cfg.planOverrides);
  if (limit > 0 && (await db.service.count({ where: { tenantId } })) >= limit) {
    return; // at limit — the UI shows an upgrade prompt
  }
  const max = await db.service.aggregate({ where: { tenantId }, _max: { order: true } });
  await db.service.create({
    data: {
      tenantId,
      category,
      title,
      description: (formData.get("description")?.toString() ?? "").trim(),
      image: (formData.get("image")?.toString() ?? "").trim(),
      order: (max._max.order ?? 0) + 1,
    },
  });
  revalidatePath("/admin/services");
}

export async function updateService(formData: FormData) {
  const tenantId = await requireTenantId();
  const id = formData.get("id")?.toString() ?? "";
  await db.service.updateMany({
    where: { id, tenantId },
    data: {
      category: (formData.get("category")?.toString() ?? "").trim(),
      title: (formData.get("title")?.toString() ?? "").trim(),
      description: (formData.get("description")?.toString() ?? "").trim(),
      image: (formData.get("image")?.toString() ?? "").trim(),
    },
  });
  revalidatePath("/admin/services");
}

export async function deleteService(id: string) {
  const tenantId = await requireTenantId();
  await db.service.deleteMany({ where: { id, tenantId } });
  revalidatePath("/admin/services");
}

// ─── Gallery ─────────────────────────────────────────────────────────────────
export async function addGalleryItem(formData: FormData) {
  const tenantId = await requireTenantId();
  const category = (formData.get("category")?.toString() ?? "").trim() || "General";
  const image = (formData.get("image")?.toString() ?? "").trim();
  const max = await db.galleryItem.aggregate({ where: { tenantId }, _max: { order: true } });
  await db.galleryItem.create({
    data: {
      tenantId,
      category,
      image,
      caption: (formData.get("caption")?.toString() ?? "").trim(),
      order: (max._max.order ?? 0) + 1,
    },
  });
  revalidatePath("/admin/gallery");
}

export async function deleteGalleryItem(id: string) {
  const tenantId = await requireTenantId();
  await db.galleryItem.deleteMany({ where: { id, tenantId } });
  revalidatePath("/admin/gallery");
}
