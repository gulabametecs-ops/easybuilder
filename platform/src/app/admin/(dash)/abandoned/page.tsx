import { headers } from "next/headers";
import { getAuthedSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { getDemoSessionId } from "@/lib/actions/guard";
import { jsonList, type OrderItem } from "@/lib/store";
import { AbandonedManager } from "@/components/admin/store/AbandonedManager";

export const metadata = { title: "Abandoned checkouts" };

export default async function AbandonedPage() {
  const authed = await getAuthedSession();
  if (!authed) return null;
  const demoId = await getDemoSessionId();
  const [rows, h] = await Promise.all([
    db.abandonedCart.findMany({ where: { tenantId: authed.tenant.id, demoSessionId: demoId }, orderBy: { updatedAt: "desc" }, take: 500 }),
    headers(),
  ]);
  const orderIds = rows.map((r) => r.orderId).filter((x): x is string => !!x);
  const orders = new Map((orderIds.length ? await db.storeOrder.findMany({ where: { id: { in: orderIds } }, select: { id: true, orderNo: true, total: true } }) : []).map((o) => [o.id, o]));
  const host = h.get("host") ?? "";
  const carts = rows.map((r) => ({
    id: r.id, token: r.token, name: r.name, phone: r.phone, email: r.email, subtotal: r.subtotal, recovered: r.recovered,
    items: jsonList<OrderItem>(r.items), updatedAt: r.updatedAt.toISOString(), reminderSentAt: r.reminderSentAt?.toISOString() ?? null,
    order: r.orderId ? orders.get(r.orderId) ?? null : null,
  }));
  return <AbandonedManager carts={carts} bizName={authed.tenant.name} siteBase={`${host.includes("localhost") ? "http" : "https"}://${host}`} demo={!!demoId} />;
}
