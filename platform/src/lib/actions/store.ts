"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { releaseMediaIn } from "@/lib/usage";
import { requireTenantId, getDemoSessionId, ownedWhere, getDemoWriteContext, persistDemoOverlay } from "./guard";
import { ORDER_STATUSES, parseStoreSettings, slugifyProduct, variantMatrix, variantTitle, waDigits, type OrderItem, type VariantDraft } from "@/lib/store";
import { restoreStock } from "@/lib/storeCatalog";
import { addTimeline, notifyCustomer } from "@/lib/fulfilment";

// Store admin (products, orders, store settings). Sandbox-aware: demo visitors create rows
// tagged with their session and can only change those; settings go to the demo overlay.

type Result = { ok: true; id: string; slug: string } | { ok: false; error: string };
type Done = { ok: true } | { ok: false; error: string };

const text = (max = 300) => z.string().trim().max(max).default("");
const money = z.number().int().min(0).max(100_000_000).default(0);
const url = z.string().trim().max(2000).refine((v) => v === "" || /^(https?:\/\/|\/(?!\/))/i.test(v), "Must be a link (https://…)");

const ProductSchema = z.object({
  id: z.string().max(40).optional(),
  name: z.string().trim().min(1, "Product name is required").max(200),
  slug: text(120),
  category: text(80),
  price: money.refine((n) => n > 0, "Price must be more than ₹0"),
  mrp: money,
  images: z.array(url).max(8).default([]),
  description: text(10_000),
  stock: z.number().int().min(0).max(1_000_000).default(0),
  options: z.array(z.object({ name: z.string().trim().min(1).max(40), values: z.array(z.string().trim().min(1).max(60)).min(1).max(30) })).max(3).default([]),
  badge: text(30),
  featured: z.boolean().default(false),
  published: z.boolean().default(true),
  sku: text(80),
  weightGrams: z.number().int().min(0).max(1_000_000).default(0),
  hsn: z.string().trim().max(12).regex(/^\d*$/, "HSN is digits only").default(""),
  gstRate: z.number().int().refine((n) => [0, 3, 5, 12, 18, 28].includes(n), "GST must be 0, 3, 5, 12, 18 or 28%").default(0),
  tags: z.array(z.string().trim().min(1).max(40)).max(30).default([]),
  trackStock: z.boolean().default(true),
  allowBackorder: z.boolean().default(false),
  seoTitle: text(120),
  seoDescription: text(320),
  variants: z.array(z.object({
    id: z.string().max(40).optional(),
    options: z.record(z.string().max(40), z.string().max(60)),
    sku: text(80),
    price: money,
    mrp: money,
    stock: z.number().int().min(0).max(1_000_000).default(0),
    image: url.default(""),
  })).max(300).default([]),
});
export type ProductInput = z.input<typeof ProductSchema>;

function revalidateStore(slug?: string) {
  revalidatePath("/admin/products");
  revalidatePath("/admin");
  revalidatePath("/shop");
  if (slug) revalidatePath(`/product/${slug}`);
  revalidatePath("/");
}

async function uniqueSlug(tenantId: string, base: string, exceptId?: string) {
  const taken = new Set(
    (await db.product.findMany({
      where: { tenantId, slug: { startsWith: base }, ...(exceptId ? { NOT: { id: exceptId } } : {}) },
      select: { slug: true },
    })).map((r) => r.slug),
  );
  let slug = base;
  for (let n = 2; taken.has(slug); n++) slug = `${base}-${n}`;
  return slug;
}

export async function saveProduct(input: ProductInput): Promise<Result> {
  const tenantId = await requireTenantId({ demoOk: true });
  const parsed = ProductSchema.safeParse(input);
  if (!parsed.success) {
    const i = parsed.error.issues[0];
    return { ok: false, error: `${i.path.join(".") || "Input"}: ${i.message}` };
  }
  const { id, slug: rawSlug, images, options, tags, variants: rawVariants, ...rest } = parsed.data;
  if (rest.mrp && rest.mrp < rest.price) return { ok: false, error: "MRP can't be lower than the selling price." };
  // Keep only variants that match a real option combination (the editor sends the full matrix).
  const cleanOptions = options.map((o) => ({ name: o.name, values: [...new Set(o.values)] }));
  const matrix = variantMatrix(cleanOptions, rawVariants.map((v) => ({ ...v, title: "" })));
  const variants = rawVariants.length ? matrix.filter((m) => rawVariants.some((v) => variantTitle(v.options) === m.title)) : [];
  const badVariant = variants.find((v) => v.mrp && v.mrp < (v.price || rest.price));
  if (badVariant) return { ok: false, error: `${badVariant.title}: MRP can't be lower than the selling price.` };
  const slug = await uniqueSlug(tenantId, slugifyProduct(rawSlug || rest.name), id);
  const data = {
    ...rest,
    slug,
    images: JSON.stringify(images.filter(Boolean)),
    options: JSON.stringify(cleanOptions),
    tags: JSON.stringify([...new Set(tags.map((t) => t.toLowerCase()))]),
    // Variant products: the product row's stock mirrors the variant total (lists, low-stock, sorting).
    ...(variants.length ? { stock: variants.reduce((n, v) => n + v.stock, 0) } : {}),
  };
  let savedId = id;
  if (id) {
    const before = await db.product.findFirst({ where: await ownedWhere(id, tenantId), select: { slug: true } });
    if (!before) return { ok: false, error: "Sample products are read-only in the demo — add your own product to try editing." };
    await db.product.updateMany({ where: await ownedWhere(id, tenantId), data });
    if (before.slug !== slug) revalidatePath(`/product/${before.slug}`);
  } else {
    const max = await db.product.aggregate({ where: { tenantId }, _max: { order: true } });
    const row = await db.product.create({ data: { tenantId, ...data, order: (max._max.order ?? 0) + 1, demoSessionId: await getDemoSessionId() } });
    savedId = row.id;
  }
  await saveVariants(tenantId, savedId!, variants);
  revalidateStore(slug);
  return { ok: true, id: savedId!, slug };
}

/** Upsert the product's variants: matched ids are updated, new combos created, the rest removed. */
async function saveVariants(tenantId: string, productId: string, variants: VariantDraft[]) {
  const existing = new Set((await db.productVariant.findMany({ where: { productId, tenantId }, select: { id: true } })).map((r) => r.id));
  const keep = variants.filter((v) => v.id && existing.has(v.id)).map((v) => v.id!);
  await db.$transaction(async (tx) => {
    await tx.productVariant.deleteMany({ where: { productId, tenantId, id: { notIn: keep } } });
    for (const [order, v] of variants.entries()) {
      const data = { title: v.title, options: JSON.stringify(v.options), sku: v.sku, price: v.price, mrp: v.mrp, stock: v.stock, image: v.image, order };
      if (v.id && existing.has(v.id)) await tx.productVariant.update({ where: { id: v.id }, data });
      else await tx.productVariant.create({ data: { ...data, productId, tenantId } });
    }
  });
}

export async function deleteProducts(ids: string[]): Promise<Done> {
  const tenantId = await requireTenantId({ demoOk: true });
  const list = z.array(z.string().max(40)).max(500).parse(ids);
  const demoSessionId = await getDemoSessionId();
  const where = { tenantId, id: { in: list }, ...(demoSessionId ? { demoSessionId } : {}) };
  const rows = await db.product.findMany({ where, select: { images: true } });
  if (!rows.length) return { ok: false, error: demoSessionId ? "Sample products can't be deleted in the demo." : "Nothing to delete." };
  await db.product.deleteMany({ where });
  await releaseMediaIn(tenantId, rows.map((r) => r.images));
  revalidateStore();
  return { ok: true };
}

/** Publish / unpublish / feature one or many products. */
export async function setProductsFlag(ids: string[], field: "published" | "featured", value: boolean): Promise<Done> {
  const tenantId = await requireTenantId({ demoOk: true });
  if (field !== "published" && field !== "featured") return { ok: false, error: "Bad field" };
  const list = z.array(z.string().max(40)).max(500).parse(ids);
  const demoSessionId = await getDemoSessionId();
  const res = await db.product.updateMany({
    where: { tenantId, id: { in: list }, ...(demoSessionId ? { demoSessionId } : {}) },
    data: { [field]: value === true },
  });
  revalidateStore();
  return res.count ? { ok: true } : { ok: false, error: "Sample products are read-only in the demo — add your own to try this." };
}

export async function setProductStock(id: string, stock: number): Promise<Done> {
  const tenantId = await requireTenantId({ demoOk: true });
  const n = z.number().int().min(0).max(1_000_000).parse(stock);
  const res = await db.product.updateMany({ where: await ownedWhere(id, tenantId), data: { stock: n } });
  revalidateStore();
  return res.count ? { ok: true } : { ok: false, error: "Sample products are read-only in the demo." };
}

// ─── Orders ──────────────────────────────────────────────────────────────────
const STATUS_IDS = ORDER_STATUSES.map((s) => s.id) as [string, ...string[]];

export async function updateOrder(id: string, patch: { status?: string; paymentStatus?: string; note?: string }): Promise<Done> {
  const tenantId = await requireTenantId({ demoOk: true });
  const { note, ...data } = z
    .object({ status: z.enum(STATUS_IDS).optional(), paymentStatus: z.enum(["pending", "paid", "refunded"]).optional(), note: z.string().trim().max(300).default("") })
    .parse(patch);
  const before = await db.storeOrder.findFirst({ where: await ownedWhere(id, tenantId), select: { id: true, status: true, items: true, demoSessionId: true, timeline: true, paymentStatus: true } });
  if (!before) return { ok: false, error: "Sample orders are read-only in the demo — place a test order on your store to try the workflow." };
  // Every change lands in the order timeline (shown in admin + on the customer's track page).
  const changed = data.status && data.status !== before.status ? data.status : data.paymentStatus && data.paymentStatus !== before.paymentStatus ? `payment_${data.paymentStatus}` : "";
  const extra = !changed ? {} : {
    timeline: addTimeline(before.timeline, changed, note),
    ...(data.status === "cancelled" ? { cancelReason: note } : {}),
    ...(data.status === "delivered" ? { deliveredAt: new Date() } : {}),
  };
  await db.storeOrder.updateMany({ where: await ownedWhere(id, tenantId), data: { ...data, ...extra } });
  if (changed === "shipped" || changed === "delivered" || changed === "cancelled") await notifyCustomer(before.id, changed);
  // Cancelling puts the stock back (real stores only — demo orders never took stock).
  if (data.status && !before.demoSessionId && (data.status === "cancelled") !== (before.status === "cancelled")) {
    const items = (JSON.parse(before.items || "[]") as OrderItem[]).filter((i) => i && i.productId);
    const owned = new Set((await db.product.findMany({ where: { tenantId, id: { in: items.map((i) => i.productId) } }, select: { id: true } })).map((r) => r.id));
    await db.$transaction((tx) => restoreStock(tx, items.filter((i) => owned.has(i.productId)), data.status === "cancelled" ? 1 : -1));
  }
  revalidatePath("/admin/orders");
  revalidatePath("/admin");
  return { ok: true };
}

// ─── Store settings ──────────────────────────────────────────────────────────
const SettingsSchema = z.object({
  shippingFee: money,
  freeShippingAbove: money,
  minOrder: money,
  codEnabled: z.boolean(),
  upiEnabled: z.boolean(),
  upiId: z.string().trim().max(80).refine((v) => v === "" || /^[\w.-]{2,}@[a-z][\w.-]*$/i.test(v), "UPI ID looks like name@bank"),
  upiQrImage: url.default(""),
  whatsappEnabled: z.boolean(),
  whatsappNumber: z.string().trim().max(20).refine((v) => v === "" || !!waDigits(v), "Enter a 10-digit mobile number"),
  checkoutNote: text(300),
  lowStockAt: z.number().int().min(0).max(10_000),
});
export type StoreSettingsInput = z.input<typeof SettingsSchema>;

export async function saveStoreSettings(input: StoreSettingsInput): Promise<Done> {
  const tenantId = await requireTenantId({ demoOk: true });
  const parsed = SettingsSchema.safeParse(input);
  if (!parsed.success) {
    const i = parsed.error.issues[0];
    return { ok: false, error: `${i.path.join(".") || "Input"}: ${i.message}` };
  }
  const demo = await getDemoWriteContext();
  // Merge: the same JSON also holds shipping settings + courier credentials (Admin → Shipping).
  const prevRaw = demo?.overlay.siteConfig?.store ?? (await db.siteConfig.findUnique({ where: { tenantId }, select: { store: true } }))?.store;
  let prev: Record<string, unknown> = {};
  try { prev = JSON.parse(prevRaw || "{}") ?? {}; } catch { /* start fresh */ }
  const value = JSON.stringify({ ...prev, ...parsed.data, whatsappNumber: waDigits(parsed.data.whatsappNumber) });
  if (demo) {
    demo.overlay.siteConfig = { ...demo.overlay.siteConfig, store: value };
    await persistDemoOverlay(demo.sessionId, demo.overlay);
  } else {
    const cfg = await db.siteConfig.findUnique({ where: { tenantId }, select: { store: true } });
    const before = parseStoreSettings(cfg?.store).upiQrImage;
    await db.siteConfig.update({ where: { tenantId }, data: { store: value } });
    if (before && before !== parsed.data.upiQrImage) await releaseMediaIn(tenantId, [before]);
  }
  revalidatePath("/admin/store-settings");
  revalidatePath("/cart");
  return { ok: true };
}
