"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { releaseMediaIn } from "@/lib/usage";
import { requireTenantId, getDemoSessionId, ownedWhere } from "./guard";
import { AMENITIES, FURNISHING, PROPERTY_TYPES, PURPOSES, STATUSES, mapProperty } from "@/lib/property";

type Result = { ok: true; id: string; slug: string } | { ok: false; error: string };

const ids = <T extends { id: string }>(list: T[]) => list.map((x) => x.id) as [string, ...string[]];

const text = (max = 300) => z.string().trim().max(max).default("");
const int = z.number().int().min(0).max(2_000_000_000).default(0); // MySQL INT; ₹200 Cr ceiling
// Uploaded files are "/uploads/…" or https; blocks javascript: and friends.
const url = z.string().trim().max(2000).refine((v) => v === "" || /^(https?:\/\/|\/(?!\/))/i.test(v), "Must be a link (https://…)").default("");

const PropertySchema = z.object({
  id: z.string().max(40).optional(),
  title: z.string().trim().min(1, "Title is required").max(200),
  slug: text(120),
  purpose: z.enum(ids(PURPOSES)).default("sale"),
  propertyType: z.enum(ids(PROPERTY_TYPES)).default("apartment"),
  status: z.enum(ids(STATUSES)).default("available"),
  price: int,
  priceNote: text(60),
  deposit: int,
  maintenance: int,
  bhk: text(60),
  areaSqft: int,
  furnishing: z.enum(["", ...FURNISHING] as [string, ...string[]]).default(""),
  bathrooms: z.number().int().min(0).max(100).default(0),
  floor: text(60),
  facing: text(60),
  parking: text(120),
  availableFrom: text(60),
  possession: text(60),
  rera: text(120),
  sharing: text(120),
  foodIncluded: z.boolean().default(false),
  gender: z.string().refine((v) => ["", "boys", "girls", "co-living"].includes(v), "Invalid option").default(""),
  locality: text(160),
  city: text(120),
  address: text(500),
  mapUrl: url,
  summary: text(240),
  description: text(20_000),
  highlights: z.array(z.string().trim().max(200)).max(30).default([]),
  amenities: z.array(z.enum(ids(AMENITIES))).max(AMENITIES.length).default([]),
  coverImage: url,
  gallery: z.array(url).max(40).default([]),
  floorPlans: z.array(z.object({ label: text(120), image: url, area: text(60) })).max(20).default([]),
  brochureUrl: url,
  videoUrl: url,
  featured: z.boolean().default(false),
  published: z.boolean().default(true),
});

export type PropertyInput = z.input<typeof PropertySchema>;

function slugify(input: string) {
  return input.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80) || "property";
}

/** First free slug for the tenant (all rows, demo or not — the DB constraint is per tenant). */
async function uniqueSlug(tenantId: string, base: string, exceptId?: string) {
  const taken = new Set(
    (await db.property.findMany({
      where: { tenantId, slug: { startsWith: base }, ...(exceptId ? { NOT: { id: exceptId } } : {}) },
      select: { slug: true },
    })).map((r) => r.slug),
  );
  let slug = base;
  for (let n = 2; taken.has(slug); n++) slug = `${base}-${n}`;
  return slug;
}

function revalidate(slug?: string) {
  revalidatePath("/admin/properties");
  revalidatePath("/properties");
  if (slug) revalidatePath(`/properties/${slug}`);
  revalidatePath("/");
}

export async function saveProperty(input: PropertyInput): Promise<Result> {
  const tenantId = await requireTenantId({ demoOk: true });
  const parsed = PropertySchema.safeParse(input);
  if (!parsed.success) {
    const i = parsed.error.issues[0];
    return { ok: false, error: `${i.path.join(".") || "Input"}: ${i.message}` };
  }
  const { id, slug: rawSlug, highlights, amenities, gallery, floorPlans, ...rest } = parsed.data;
  const slug = await uniqueSlug(tenantId, slugify(rawSlug || rest.title), id);
  const data = {
    ...rest,
    slug,
    highlights: JSON.stringify(highlights.filter(Boolean)),
    amenities: JSON.stringify([...new Set(amenities)]),
    gallery: JSON.stringify(gallery.filter(Boolean)),
    floorPlans: JSON.stringify(floorPlans.filter((f) => f.label || f.image).map((f) => ({ label: f.label, image: f.image, ...(f.area ? { area: f.area } : {}) }))),
  };

  let savedId = id;
  if (id) {
    const before = await db.property.findFirst({ where: await ownedWhere(id, tenantId), select: { slug: true } });
    if (!before) return { ok: false, error: "Property not found." };
    await db.property.updateMany({ where: await ownedWhere(id, tenantId), data });
    if (before.slug !== slug) revalidatePath(`/properties/${before.slug}`);
  } else {
    const max = await db.property.aggregate({ where: { tenantId }, _max: { order: true } });
    const row = await db.property.create({
      data: { tenantId, ...data, order: (max._max.order ?? 0) + 1, demoSessionId: await getDemoSessionId() },
    });
    savedId = row.id;
  }
  revalidate(slug);
  return { ok: true, id: savedId!, slug };
}

export async function deleteProperty(id: string) {
  const tenantId = await requireTenantId({ demoOk: true });
  const row = await db.property.findFirst({ where: await ownedWhere(id, tenantId) });
  if (!row) return;
  await db.property.deleteMany({ where: await ownedWhere(id, tenantId) });
  // ponytail: usage.isMediaReferenced doesn't scan properties yet (out of this change's scope),
  // so keep files another property (e.g. a duplicate) still uses. Add property to isMediaReferenced to drop this.
  const others = JSON.stringify(
    await db.property.findMany({ where: { tenantId }, select: { coverImage: true, gallery: true, floorPlans: true, brochureUrl: true } }),
  );
  const urls = [row.coverImage, row.brochureUrl, ...mapProperty(row).gallery, ...mapProperty(row).floorPlans.map((f) => f.image)];
  await releaseMediaIn(tenantId, urls.filter((u) => u && !others.includes(u.split("/").pop() || u)));
  revalidate(row.slug);
}

export async function duplicateProperty(id: string): Promise<Result> {
  const tenantId = await requireTenantId({ demoOk: true });
  // Demo visitors may copy the template's sample rows too (the copy is theirs).
  const demoSessionId = await getDemoSessionId();
  const src = await db.property.findFirst({
    where: { id, tenantId, ...(demoSessionId ? { OR: [{ demoSessionId: null }, { demoSessionId }] } : {}) },
  });
  if (!src) return { ok: false, error: "Property not found." };
  const { id: _id, createdAt: _c, updatedAt: _u, ...rest } = src;
  void _id; void _c; void _u;
  const title = `${src.title} (copy)`.slice(0, 200);
  const slug = await uniqueSlug(tenantId, slugify(title));
  const max = await db.property.aggregate({ where: { tenantId }, _max: { order: true } });
  const row = await db.property.create({
    data: { ...rest, title, slug, published: false, featured: false, order: (max._max.order ?? 0) + 1, demoSessionId },
  });
  revalidate();
  return { ok: true, id: row.id, slug };
}

/** Quick toggle from the list (published / featured). */
export async function setPropertyFlag(id: string, field: "published" | "featured", value: boolean) {
  const tenantId = await requireTenantId({ demoOk: true });
  if (field !== "published" && field !== "featured") throw new Error("Bad field");
  const row = await db.property.findFirst({ where: await ownedWhere(id, tenantId), select: { slug: true } });
  if (!row) return;
  await db.property.updateMany({ where: await ownedWhere(id, tenantId), data: { [field]: value === true } });
  revalidate(row.slug);
}

export async function setPropertyStatus(id: string, status: string) {
  const tenantId = await requireTenantId({ demoOk: true });
  const s = z.enum(ids(STATUSES)).parse(status);
  const row = await db.property.findFirst({ where: await ownedWhere(id, tenantId), select: { slug: true } });
  if (!row) return;
  await db.property.updateMany({ where: await ownedWhere(id, tenantId), data: { status: s } });
  revalidate(row.slug);
}
