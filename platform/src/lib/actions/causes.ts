"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { releaseMediaIn } from "@/lib/usage";
import { requireTenantId, getDemoSessionId, ownedWhere } from "./guard";
import { CAUSE_STATUSES } from "@/lib/cause";

type Result = { ok: true; id: string; slug: string } | { ok: false; error: string };

const STATUS_IDS = CAUSE_STATUSES.map((s) => s.id) as [string, ...string[]];
const text = (max = 300) => z.string().trim().max(max).default("");
const int = z.number().int().min(0).max(2_000_000_000).default(0); // MySQL INT; ₹200 Cr ceiling
// Uploaded files are "/uploads/…" or https; blocks javascript: and friends.
const url = z.string().trim().max(2000).refine((v) => v === "" || /^(https?:\/\/|\/(?!\/))/i.test(v), "Must be a link (https://…)").default("");
const date = z.string().trim().refine((v) => v === "" || /^\d{4}-\d{2}-\d{2}$/.test(v), "Use YYYY-MM-DD").default("");

const CauseSchema = z.object({
  id: z.string().max(40).optional(),
  title: z.string().trim().min(1, "Title is required").max(200),
  slug: text(120),
  category: text(80),
  summary: text(240),
  story: text(20_000),
  coverImage: url,
  gallery: z.array(url).max(40).default([]),
  goalAmount: int,
  offlineRaised: int,
  offlineDonors: int,
  deadline: date,
  urgent: z.boolean().default(false),
  beneficiaries: text(200),
  location: text(200),
  impactTiers: z.array(z.object({ amount: z.number().int().min(0).max(2_000_000_000), label: text(200) })).max(12).default([]),
  updates: z.array(z.object({ date, title: text(200), text: text(5000) })).max(100).default([]),
  status: z.enum(STATUS_IDS).default("active"),
  featured: z.boolean().default(false),
  published: z.boolean().default(true),
});

export type CauseInput = z.input<typeof CauseSchema>;

function slugify(input: string) {
  return input.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80) || "cause";
}

/** First free slug for the tenant (all rows, demo or not — the DB constraint is per tenant). */
async function uniqueSlug(tenantId: string, base: string, exceptId?: string) {
  const taken = new Set(
    (await db.cause.findMany({
      where: { tenantId, slug: { startsWith: base }, ...(exceptId ? { NOT: { id: exceptId } } : {}) },
      select: { slug: true },
    })).map((r) => r.slug),
  );
  let slug = base;
  for (let n = 2; taken.has(slug); n++) slug = `${base}-${n}`;
  return slug;
}

function revalidate(slug?: string) {
  revalidatePath("/admin/causes");
  revalidatePath("/causes");
  if (slug) revalidatePath(`/causes/${slug}`);
  revalidatePath("/");
}

export async function saveCause(input: CauseInput): Promise<Result> {
  const tenantId = await requireTenantId({ demoOk: true });
  const parsed = CauseSchema.safeParse(input);
  if (!parsed.success) {
    const i = parsed.error.issues[0];
    return { ok: false, error: `${i.path.join(".") || "Input"}: ${i.message}` };
  }
  const { id, slug: rawSlug, gallery, impactTiers, updates, ...rest } = parsed.data;
  const slug = await uniqueSlug(tenantId, slugify(rawSlug || rest.title), id);
  const data = {
    ...rest,
    slug,
    gallery: JSON.stringify(gallery.filter(Boolean)),
    impactTiers: JSON.stringify(impactTiers.filter((t) => t.amount > 0 && t.label).sort((a, b) => a.amount - b.amount)),
    updates: JSON.stringify(updates.filter((u) => u.title || u.text).sort((a, b) => b.date.localeCompare(a.date))),
  };

  let savedId = id;
  if (id) {
    const before = await db.cause.findFirst({ where: await ownedWhere(id, tenantId), select: { slug: true } });
    if (!before) return { ok: false, error: "Cause not found." };
    await db.cause.updateMany({ where: await ownedWhere(id, tenantId), data });
    if (before.slug !== slug) revalidatePath(`/causes/${before.slug}`);
  } else {
    const max = await db.cause.aggregate({ where: { tenantId }, _max: { order: true } });
    const row = await db.cause.create({
      data: { tenantId, ...data, order: (max._max.order ?? 0) + 1, demoSessionId: await getDemoSessionId() },
    });
    savedId = row.id;
  }
  revalidate(slug);
  return { ok: true, id: savedId!, slug };
}

export async function deleteCause(id: string) {
  const tenantId = await requireTenantId({ demoOk: true });
  const row = await db.cause.findFirst({ where: await ownedWhere(id, tenantId) });
  if (!row) return;
  await db.cause.deleteMany({ where: await ownedWhere(id, tenantId) });
  // isMediaReferenced scans causes, so files a duplicate still uses are kept.
  await releaseMediaIn(tenantId, row);
  revalidate(row.slug);
}

export async function duplicateCause(id: string): Promise<Result> {
  const tenantId = await requireTenantId({ demoOk: true });
  // Demo visitors may copy the template's sample rows too (the copy is theirs).
  const demoSessionId = await getDemoSessionId();
  const src = await db.cause.findFirst({
    where: { id, tenantId, ...(demoSessionId ? { OR: [{ demoSessionId: null }, { demoSessionId }] } : {}) },
  });
  if (!src) return { ok: false, error: "Cause not found." };
  const { id: _id, createdAt: _c, updatedAt: _u, ...rest } = src;
  void _id; void _c; void _u;
  const title = `${src.title} (copy)`.slice(0, 200);
  const slug = await uniqueSlug(tenantId, slugify(title));
  const max = await db.cause.aggregate({ where: { tenantId }, _max: { order: true } });
  // Offline totals belong to the original campaign; the copy starts at zero.
  const row = await db.cause.create({
    data: { ...rest, title, slug, published: false, featured: false, offlineRaised: 0, offlineDonors: 0, order: (max._max.order ?? 0) + 1, demoSessionId },
  });
  revalidate();
  return { ok: true, id: row.id, slug };
}

/** Quick toggle from the list (published / featured / urgent). */
export async function setCauseFlag(id: string, field: "published" | "featured" | "urgent", value: boolean) {
  const tenantId = await requireTenantId({ demoOk: true });
  if (field !== "published" && field !== "featured" && field !== "urgent") throw new Error("Bad field");
  const row = await db.cause.findFirst({ where: await ownedWhere(id, tenantId), select: { slug: true } });
  if (!row) return;
  await db.cause.updateMany({ where: await ownedWhere(id, tenantId), data: { [field]: value === true } });
  revalidate(row.slug);
}

export async function setCauseStatus(id: string, status: string) {
  const tenantId = await requireTenantId({ demoOk: true });
  const s = z.enum(STATUS_IDS).parse(status);
  const row = await db.cause.findFirst({ where: await ownedWhere(id, tenantId), select: { slug: true } });
  if (!row) return;
  await db.cause.updateMany({ where: await ownedWhere(id, tenantId), data: { status: s } });
  revalidate(row.slug);
}
