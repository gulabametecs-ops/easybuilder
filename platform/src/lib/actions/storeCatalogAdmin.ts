"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { demoVisibleWhere } from "@/lib/demoSession";
import { adminOrders, customersFrom } from "@/lib/storeAdmin";
import { mapProduct, optionText, slugifyProduct } from "@/lib/store";
import { toCsv } from "@/lib/csv";
import { PRODUCT_CSV_HEADER, productCsvRows, type ImportDraft } from "@/lib/productCsv";
import { requireTenantId, getDemoSessionId, ownedWhere } from "./guard";
import { saveProduct } from "./store";

// Store admin: collections, review moderation, customer blocking, CSV import/export. Sandbox-aware.

type Done = { ok: true } | { ok: false; error: string };
const DEMO_RO = "Sample data is read-only in the demo — create your own to try this.";

// ─── Collections ─────────────────────────────────────────────────────────────
const CollectionSchema = z.object({
  id: z.string().max(40).optional(),
  title: z.string().trim().min(1, "Title is required").max(120),
  slug: z.string().trim().max(80).default(""),
  description: z.string().trim().max(2000).default(""),
  image: z.string().trim().max(2000).refine((v) => v === "" || /^(https?:\/\/|\/(?!\/))/i.test(v), "Image must be a link").default(""),
  productIds: z.array(z.string().min(1).max(40)).max(500).default([]),
  published: z.boolean().default(true),
});
export type CollectionInput = z.input<typeof CollectionSchema>;

function revalidateCollections(slug?: string) {
  revalidatePath("/admin/collections");
  revalidatePath("/collections");
  if (slug) revalidatePath(`/collections/${slug}`);
  revalidatePath("/");
}

export async function saveCollection(input: CollectionInput): Promise<{ ok: true; id: string; slug: string } | { ok: false; error: string }> {
  const tenantId = await requireTenantId({ demoOk: true });
  const p = CollectionSchema.safeParse(input);
  if (!p.success) return { ok: false, error: p.error.issues[0].message };
  const { id, ...d } = p.data;
  const base = slugifyProduct(d.slug || d.title);
  const taken = new Set((await db.collection.findMany({ where: { tenantId, slug: { startsWith: base }, ...(id ? { NOT: { id } } : {}) }, select: { slug: true } })).map((r) => r.slug));
  let slug = base;
  for (let n = 2; taken.has(slug); n++) slug = `${base}-${n}`;
  const data = { ...d, slug, productIds: JSON.stringify([...new Set(d.productIds)]) };
  if (id) {
    const res = await db.collection.updateMany({ where: await ownedWhere(id, tenantId), data });
    if (!res.count) return { ok: false, error: DEMO_RO };
    revalidateCollections(slug);
    return { ok: true, id, slug };
  }
  const max = await db.collection.aggregate({ where: { tenantId }, _max: { order: true } });
  const row = await db.collection.create({ data: { tenantId, ...data, order: (max._max.order ?? 0) + 1, demoSessionId: await getDemoSessionId() } });
  revalidateCollections(slug);
  return { ok: true, id: row.id, slug };
}

export async function deleteCollection(id: string): Promise<Done> {
  const tenantId = await requireTenantId({ demoOk: true });
  const res = await db.collection.deleteMany({ where: await ownedWhere(z.string().max(40).parse(id), tenantId) });
  revalidateCollections();
  return res.count ? { ok: true } : { ok: false, error: DEMO_RO };
}

/** New order of collections (ids top to bottom). */
export async function reorderCollections(ids: string[]): Promise<Done> {
  const tenantId = await requireTenantId({ demoOk: true });
  const list = z.array(z.string().max(40)).max(200).parse(ids);
  const demoSessionId = await getDemoSessionId();
  for (const [order, id] of list.entries()) {
    await db.collection.updateMany({ where: { id, tenantId, ...(demoSessionId ? { demoSessionId } : {}) }, data: { order } });
  }
  revalidateCollections();
  return { ok: true };
}

// ─── Reviews ─────────────────────────────────────────────────────────────────
export async function setReviewStatus(ids: string[], status: "approved" | "hidden" | "pending"): Promise<Done> {
  const tenantId = await requireTenantId({ demoOk: true });
  const s = z.enum(["approved", "hidden", "pending"]).parse(status);
  const list = z.array(z.string().max(40)).max(500).parse(ids);
  const demoSessionId = await getDemoSessionId();
  const res = await db.productReview.updateMany({ where: { tenantId, id: { in: list }, ...(demoSessionId ? { demoSessionId } : {}) }, data: { status: s } });
  revalidatePath("/admin/reviews");
  revalidatePath("/product/[slug]", "page");
  revalidatePath("/shop");
  return res.count ? { ok: true } : { ok: false, error: DEMO_RO };
}

export async function deleteReviews(ids: string[]): Promise<Done> {
  const tenantId = await requireTenantId({ demoOk: true });
  const list = z.array(z.string().max(40)).max(500).parse(ids);
  const demoSessionId = await getDemoSessionId();
  const res = await db.productReview.deleteMany({ where: { tenantId, id: { in: list }, ...(demoSessionId ? { demoSessionId } : {}) } });
  revalidatePath("/admin/reviews");
  revalidatePath("/product/[slug]", "page");
  return res.count ? { ok: true } : { ok: false, error: DEMO_RO };
}

// ─── Customers ───────────────────────────────────────────────────────────────
export async function setCustomerBlocked(id: string, blocked: boolean): Promise<Done> {
  const tenantId = await requireTenantId({ demoOk: true });
  const res = await db.storeCustomer.updateMany({ where: await ownedWhere(z.string().max(40).parse(id), tenantId), data: { blocked: blocked === true } });
  revalidatePath("/admin/customers");
  return res.count ? { ok: true } : { ok: false, error: DEMO_RO };
}

// ─── CSV ─────────────────────────────────────────────────────────────────────
export async function exportCsv(kind: "products" | "orders" | "customers"): Promise<{ ok: true; filename: string; csv: string } | { ok: false; error: string }> {
  const tenantId = await requireTenantId({ demoOk: true });
  const demoId = await getDemoSessionId();
  const day = new Date().toISOString().slice(0, 10);
  if (kind === "products") {
    const rows = await db.product.findMany({ where: demoVisibleWhere(tenantId, demoId), orderBy: [{ order: "asc" }], include: { variants: { orderBy: { order: "asc" } } } });
    return { ok: true, filename: `products-${day}.csv`, csv: toCsv(PRODUCT_CSV_HEADER, productCsvRows(rows.map((r) => ({ ...mapProduct(r), published: r.published })))) };
  }
  const orders = await adminOrders(tenantId, demoId, 10_000);
  if (kind === "orders") {
    return {
      ok: true, filename: `orders-${day}.csv`,
      csv: toCsv(
        ["order_no", "date", "status", "payment_method", "payment_status", "customer", "phone", "email", "address", "city", "pincode", "items", "subtotal", "shipping", "discount", "total", "note"],
        orders.map((o) => [
          o.orderNo, o.createdAt.slice(0, 19).replace("T", " "), o.status, o.paymentMethod, o.paymentStatus, o.customerName, o.phone, o.email, o.address, o.city, o.pincode,
          o.items.map((i) => `${i.name}${Object.keys(i.options ?? {}).length ? ` (${optionText(i.options)})` : ""}${i.sku ? ` [${i.sku}]` : ""} x${i.qty}`).join("; "),
          o.subtotal, o.shipping, o.discount, o.total, o.note,
        ]),
      ),
    };
  }
  if (kind === "customers") {
    const accounts = await db.storeCustomer.findMany({ where: { ...demoVisibleWhere(tenantId, demoId), lastLoginAt: { not: null } } });
    const fromOrders = customersFrom(orders);
    const seen = new Set<string>();
    const rows: unknown[][] = fromOrders.map((c) => {
      const acc = accounts.find((a) => (c.email && a.email === c.email.toLowerCase()) || (a.phone && a.phone.replace(/\D/g, "").slice(-10) === c.key));
      if (acc) seen.add(acc.id);
      return [c.name, c.phone, c.email || acc?.email || "", c.city, c.orders, c.spent, c.last.slice(0, 10), acc ? "yes" : "no", acc?.marketingOptIn ? "yes" : "no", acc?.blocked ? "yes" : "no"];
    });
    for (const a of accounts) if (!seen.has(a.id)) rows.push([a.name, a.phone, a.email, "", 0, 0, "", "yes", a.marketingOptIn ? "yes" : "no", a.blocked ? "yes" : "no"]);
    return { ok: true, filename: `customers-${day}.csv`, csv: toCsv(["name", "phone", "email", "city", "orders", "spent", "last_order", "account", "marketing_opt_in", "blocked"], rows) };
  }
  return { ok: false, error: "Unknown export" };
}

/** Create/update products from parsed CSV drafts (lib/productCsv). Matches by SKU, then handle (slug). */
export async function importProducts(drafts: ImportDraft[]): Promise<{ ok: true; created: number; updated: number; errors: string[] } | { ok: false; error: string }> {
  const tenantId = await requireTenantId({ demoOk: true });
  if (!Array.isArray(drafts) || drafts.length > 500) return { ok: false, error: "Import up to 500 products at a time." };
  const demoId = await getDemoSessionId();
  const existing = await db.product.findMany({
    where: demoId ? { tenantId, demoSessionId: demoId } : { tenantId },
    select: { id: true, slug: true, sku: true, variants: { select: { id: true, options: true } } },
  });
  let created = 0;
  let updated = 0;
  const errors: string[] = [];
  for (const d of drafts) {
    const match = (d.sku && existing.find((e) => e.sku && e.sku === d.sku)) || (d.handle && existing.find((e) => e.slug === d.handle)) || null;
    const variantId = (opts: Record<string, string>) =>
      match?.variants.find((v) => { try { const o = JSON.parse(v.options) as Record<string, string>; return Object.keys(o).length === Object.keys(opts).length && Object.entries(opts).every(([k, x]) => o[k] === x); } catch { return false; } })?.id;
    const r = await saveProduct({
      id: match?.id, name: d.name, slug: d.handle, category: d.category, price: d.price, mrp: d.mrp, images: d.images, description: d.description,
      stock: d.stock, options: d.options, badge: d.badge, featured: d.featured, published: d.published, sku: d.sku, weightGrams: d.weightGrams, hsn: d.hsn,
      gstRate: [0, 3, 5, 12, 18, 28].includes(d.gstRate) ? d.gstRate : 0, tags: d.tags, trackStock: d.trackStock, allowBackorder: d.allowBackorder,
      seoTitle: d.seoTitle, seoDescription: d.seoDescription,
      variants: d.variants.map((v) => ({ ...v, id: variantId(v.options) })),
    }).catch((e: unknown) => ({ ok: false as const, error: e instanceof Error ? e.message : "failed" }));
    if (!r.ok) errors.push(`Line ${d.row} (${d.name}): ${r.error}`);
    else if (match) updated++;
    else {
      created++;
      existing.push({ id: r.id, slug: r.slug, sku: d.sku, variants: [] });
    }
  }
  revalidatePath("/admin/products");
  return { ok: true, created, updated, errors };
}
