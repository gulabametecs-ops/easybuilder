import { headers } from "next/headers";
import { getAuthedSession } from "@/lib/auth";
import { getDemoSessionId } from "@/lib/actions/guard";
import { adminOrders } from "@/lib/storeAdmin";
import { getStoreSettings } from "@/lib/storeServer";
import { db } from "@/lib/db";
import { delhiveryReady, shiprocketReady } from "@/lib/couriers";
import { loadCourierCreds } from "@/lib/fulfilment";
import { OrdersManager } from "@/components/admin/store/OrdersManager";

export const metadata = { title: "Orders" };

export default async function OrdersPage() {
  const authed = await getAuthedSession();
  if (!authed) return null;
  const tenantId = authed.tenant.id;
  const demoId = await getDemoSessionId();
  const [orders, settings, products, creds, h] = await Promise.all([
    adminOrders(tenantId, demoId),
    getStoreSettings(tenantId, demoId),
    db.product.findMany({ where: { tenantId }, select: { id: true, weightGrams: true } }),
    loadCourierCreds(tenantId),
    headers(),
  ]);
  // Package weight suggestion: product weights × qty (store default for products without one).
  const weight = new Map(products.map((p) => [p.id, p.weightGrams]));
  const per = settings.shipping.defaultWeightGrams || 500;
  const withWeight = orders.map((o) => ({ ...o, suggestedWeight: o.items.reduce((n, i) => n + (weight.get(i.productId) || per) * i.qty, 0) }));
  const host = h.get("host") ?? "";
  const siteBase = `${host.includes("localhost") ? "http" : "https"}://${host}`;
  // Demo sandboxes always "have" both partners — bookings there are simulated, never sent.
  const couriers = demoId ? { shiprocket: true, delhivery: true } : { shiprocket: shiprocketReady(creds), delhivery: delhiveryReady(creds) };
  return <OrdersManager orders={withWeight} bizName={authed.tenant.name} demo={!!demoId} couriers={couriers} siteBase={siteBase} />;
}
