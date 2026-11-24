import { db } from "./db";
import { demoVisibleWhere } from "./demoSession";
import type { OrderItem } from "./store";
import { parseTimeline } from "./fulfilment";

// Server-side order reads for the store admin (orders, customers, dashboard).

export async function adminOrders(tenantId: string, demoId: string | null, take = 500) {
  const rows = await db.storeOrder.findMany({ where: demoVisibleWhere(tenantId, demoId), orderBy: { createdAt: "desc" }, take });
  return rows.map((r) => {
    let items: OrderItem[] = [];
    try {
      items = JSON.parse(r.items || "[]");
    } catch {
      /* keep empty */
    }
    return {
      id: r.id, orderNo: r.orderNo, customerName: r.customerName, phone: r.phone, email: r.email, address: r.address, city: r.city, pincode: r.pincode,
      items, subtotal: r.subtotal, shipping: r.shipping, discount: r.discount, total: r.total,
      paymentMethod: r.paymentMethod, paymentStatus: r.paymentStatus, status: r.status, note: r.note, createdAt: r.createdAt.toISOString(),
      // Fulfilment (shipping / returns / invoice)
      state: r.state, addressLine2: r.addressLine2, codFee: r.codFee, refundAmount: r.refundAmount, shippingProvider: r.shippingProvider, courier: r.courier,
      awb: r.awb, trackingUrl: r.trackingUrl, shipmentRef: r.shipmentRef, weightGrams: r.weightGrams, timeline: parseTimeline(r.timeline),
      cancelReason: r.cancelReason, returnStatus: r.returnStatus, returnReason: r.returnReason, invoiceNo: r.invoiceNo, trackToken: r.trackToken,
      deliveredAt: r.deliveredAt?.toISOString() ?? null,
    };
  });
}

export type Customer = { key: string; name: string; phone: string; email: string; city: string; orders: number; spent: number; last: string };

/** Customers derived from orders, grouped by phone (digits). Cancelled orders don't count toward spend. */
export function customersFrom(orders: Awaited<ReturnType<typeof adminOrders>>): Customer[] {
  const map = new Map<string, Customer>();
  for (const o of orders) {
    const key = o.phone.replace(/\D/g, "").slice(-10) || o.id;
    const c = map.get(key) ?? { key, name: o.customerName, phone: o.phone, email: o.email, city: o.city, orders: 0, spent: 0, last: o.createdAt };
    c.orders += 1;
    if (o.status !== "cancelled") c.spent += o.total;
    if (o.createdAt > c.last) c.last = o.createdAt;
    if (!c.email && o.email) c.email = o.email;
    map.set(key, c);
  }
  return [...map.values()].sort((a, b) => b.spent - a.spent);
}
