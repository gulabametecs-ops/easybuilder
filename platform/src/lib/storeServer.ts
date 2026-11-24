import { cache } from "react";
import { db } from "./db";
import { getActiveDemoSession, loadDemoOverlay } from "./demoSession";
import { jsonList, mapProduct, parseStoreSettings, type OrderItem, type PublicProduct, type StoreSettings } from "./store";

// Server-only storefront reads. Demo sandboxes see seed rows + their own rows only.

async function productWhere(tenantId: string, extra: Record<string, unknown> = {}) {
  const demo = await getActiveDemoSession();
  return demo
    ? { tenantId, published: true, ...extra, OR: [{ demoSessionId: null }, { demoSessionId: demo.id }] }
    : { tenantId, published: true, ...extra };
}

async function reviewStats(tenantId: string, productIds?: string[]) {
  const demo = await getActiveDemoSession();
  const rows = await db.productReview.groupBy({
    by: ["productId"],
    where: { tenantId, status: "approved", ...(productIds ? { productId: { in: productIds } } : {}), ...(demo ? { OR: [{ demoSessionId: null }, { demoSessionId: demo.id }] } : { demoSessionId: null }) },
    _avg: { rating: true },
    _count: { _all: true },
  });
  return new Map(rows.map((r) => [r.productId, { rating: r._avg.rating ?? 0, count: r._count._all }]));
}

const withVariants = { variants: { orderBy: { order: "asc" as const } } };

export const getSiteProducts = cache(async (tenantId: string): Promise<PublicProduct[]> => {
  const [rows, stats] = await Promise.all([
    db.product.findMany({
      where: await productWhere(tenantId),
      orderBy: [{ featured: "desc" }, { order: "asc" }, { createdAt: "desc" }],
      include: withVariants,
    }),
    reviewStats(tenantId),
  ]);
  return rows.map((r) => mapProduct(r, stats.get(r.id)));
});

export const getSiteProductBySlug = cache(async (tenantId: string, slug: string): Promise<PublicProduct | null> => {
  const row = await db.product.findFirst({ where: await productWhere(tenantId, { slug }), include: withVariants });
  if (!row) return null;
  return mapProduct(row, (await reviewStats(tenantId, [row.id])).get(row.id));
});

/** Published products by id, in the given order (wishlist, recently viewed). */
export async function getSiteProductsByIds(tenantId: string, ids: string[]): Promise<PublicProduct[]> {
  const byId = new Map((await getSiteProducts(tenantId)).map((p) => [p.id, p]));
  return ids.map((id) => byId.get(id)).filter((p): p is PublicProduct => !!p);
}

export type PublicCollection = { id: string; slug: string; title: string; description: string; image: string; productIds: string[] };

export const getSiteCollections = cache(async (tenantId: string): Promise<PublicCollection[]> => {
  const demo = await getActiveDemoSession();
  const rows = await db.collection.findMany({
    where: { tenantId, published: true, ...(demo ? { OR: [{ demoSessionId: null }, { demoSessionId: demo.id }] } : { demoSessionId: null }) },
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });
  return rows.map((r) => ({ id: r.id, slug: r.slug, title: r.title, description: r.description, image: r.image, productIds: jsonList<string>(r.productIds) }));
});

/** Approved reviews for a product page, newest first. */
export async function getProductReviews(tenantId: string, productId: string) {
  const demo = await getActiveDemoSession();
  const rows = await db.productReview.findMany({
    where: { tenantId, productId, status: "approved", ...(demo ? { OR: [{ demoSessionId: null }, { demoSessionId: demo.id }] } : { demoSessionId: null }) },
    orderBy: { createdAt: "desc" },
    take: 100,
  });
  return rows.map((r) => ({ id: r.id, name: r.name, rating: r.rating, title: r.title, body: r.body, verified: r.verified, createdAt: r.createdAt.toISOString() }));
}
export type PublicReview = Awaited<ReturnType<typeof getProductReviews>>[number];

/** Store settings; a demo sandbox's edits live in its overlay (the demo tenant is shared). */
export const getStoreSettings = cache(async (tenantId: string, demoSessionId?: string | null): Promise<StoreSettings> => {
  const cfg = await db.siteConfig.findUnique({ where: { tenantId }, select: { store: true } });
  const id = demoSessionId === undefined ? (await getActiveDemoSession())?.id : demoSessionId;
  if (id) {
    const overlay = await loadDemoOverlay(id);
    if (overlay.siteConfig?.store) return parseStoreSettings(overlay.siteConfig.store);
  }
  return parseStoreSettings(cfg?.store);
});

/** Demo stores only: a handful of realistic orders so the dashboard isn't empty (seed rows, read-only for visitors). */
export async function seedDemoOrders(tenantId: string) {
  // Demo checkout shows every payment option; numbers are obviously fake (never on purchased sites).
  const cfg = await db.siteConfig.findUnique({ where: { tenantId }, select: { store: true } });
  if (cfg && (!cfg.store || cfg.store === "{}")) {
    await db.siteConfig.update({ where: { tenantId }, data: { store: JSON.stringify({ upiId: "demo-store@upi", whatsappNumber: "919999999999" }) } });
  }
  if (await db.storeOrder.count({ where: { tenantId } })) return;
  const products = (await db.product.findMany({ where: { tenantId }, orderBy: { order: "asc" }, take: 8 })).map((r) => mapProduct(r));
  if (!products.length) return;
  const people = [
    ["Ananya Sharma", "Pune", "411001"], ["Rohit Verma", "Jaipur", "302001"], ["Fatima Khan", "Lucknow", "226001"],
    ["Karthik Iyer", "Chennai", "600020"], ["Simran Kaur", "Ludhiana", "141001"], ["Arjun Nair", "Kochi", "682016"],
  ];
  const statuses = ["new", "new", "confirmed", "packed", "shipped", "delivered"];
  const methods = ["cod", "upi", "whatsapp", "cod", "upi", "cod"];
  for (const [i, [name, city, pincode]] of people.entries()) {
    const picks = [products[i % products.length], products[(i + 3) % products.length]].slice(0, i % 2 ? 2 : 1);
    const items: OrderItem[] = picks.map((p, j) => ({
      productId: p.id, slug: p.slug, name: p.name, price: p.price, qty: j ? 1 : 1 + (i % 2),
      options: Object.fromEntries(p.options.map((o) => [o.name, o.values[0]])), image: p.images[0] ?? "",
    }));
    const subtotal = items.reduce((n, x) => n + x.price * x.qty, 0);
    const shipping = subtotal >= 499 ? 0 : 49;
    await db.storeOrder.create({
      data: {
        tenantId, orderNo: 1001 + i, customerName: name, phone: `98${String(76543210 + i * 1111).slice(0, 8)}`,
        address: `${12 + i * 7}, Shanti Nagar`, city, pincode, items: JSON.stringify(items),
        subtotal, shipping, total: subtotal + shipping, paymentMethod: methods[i],
        paymentStatus: statuses[i] === "delivered" || methods[i] === "upi" ? "paid" : "pending", status: statuses[i],
        createdAt: new Date(Date.now() - (5 - i) * 26 * 3600_000),
      },
    });
  }
}
