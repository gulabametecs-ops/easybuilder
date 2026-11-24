import { cache } from "react";
import { db } from "./db";
import { getActiveDemoSession, loadDemoOverlay } from "./demoSession";
import { mapProduct, parseStoreSettings, type OrderItem, type PublicProduct, type StoreSettings } from "./store";

// Server-only storefront reads. Demo sandboxes see seed rows + their own rows only.

async function productWhere(tenantId: string, extra: Record<string, unknown> = {}) {
  const demo = await getActiveDemoSession();
  return demo
    ? { tenantId, published: true, ...extra, OR: [{ demoSessionId: null }, { demoSessionId: demo.id }] }
    : { tenantId, published: true, ...extra };
}

export const getSiteProducts = cache(async (tenantId: string): Promise<PublicProduct[]> => {
  const rows = await db.product.findMany({
    where: await productWhere(tenantId),
    orderBy: [{ featured: "desc" }, { order: "asc" }, { createdAt: "desc" }],
  });
  return rows.map(mapProduct);
});

export const getSiteProductBySlug = cache(async (tenantId: string, slug: string): Promise<PublicProduct | null> => {
  const row = await db.product.findFirst({ where: await productWhere(tenantId, { slug }) });
  return row ? mapProduct(row) : null;
});

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
  const products = (await db.product.findMany({ where: { tenantId }, orderBy: { order: "asc" }, take: 8 })).map(mapProduct);
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
