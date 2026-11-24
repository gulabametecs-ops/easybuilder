import { randomBytes } from "node:crypto";
import { db } from "./db";
import { escapeHtml } from "./sanitizeHtml";
import { inr, orderLabel, orderSummaryText, type OrderItem } from "./store";
import { restoreStock } from "./storeCatalog";
import { PAYMENT_HOLD_MINUTES } from "./checkout";
import { addTimeline, notifyCustomer, notifyOwners } from "./fulfilment";
import { createRazorpayRefund } from "./razorpay";
import { storeRazorpayKeys } from "./checkoutServer";

// Store payments (server): paid/failed transitions shared by the browser callback, the webhook and
// the demo simulator; payment-hold expiry; refunds.
//
// Stock decision: online orders RESERVE stock when the order is created (same transaction as COD),
// so two shoppers can't pay for the last unit. Unpaid online orders are cancelled and their stock +
// coupon use released after PAYMENT_HOLD_MINUTES (swept before each new checkout of that store and
// by the daily job). Every transition is a conditional updateMany, so a payment landing at the same
// moment as the sweep is safe: whichever writes first wins, and a payment that arrives after the
// hold expired re-takes the stock and reopens the order (flagged for the owner).

const parseItems = (raw: string): OrderItem[] => {
  try {
    const v = JSON.parse(raw || "[]");
    return Array.isArray(v) ? v.filter((i) => i && i.productId) : [];
  } catch {
    return [];
  }
};

/** Owner "new order" email + customer confirmation (real stores only). */
export async function announceOrder(orderId: string): Promise<void> {
  const o = await db.storeOrder.findUnique({ where: { id: orderId }, include: { tenant: { select: { name: true } } } });
  if (!o || o.demoSessionId) return;
  const summary = orderSummaryText({ bizName: o.tenant.name, orderNo: o.orderNo, items: parseItems(o.items), subtotal: o.subtotal, shipping: o.shipping, discount: o.discount, codFee: o.codFee, total: o.total, paymentMethod: o.paymentMethod, customerName: o.customerName, phone: o.phone, address: [o.address, o.addressLine2].filter(Boolean).join(", "), city: o.city, pincode: o.pincode });
  const paid = o.paymentStatus === "paid" ? " (paid online)" : "";
  await notifyOwners(o.tenantId, `New order ${orderLabel(o.orderNo)} — ${inr(o.total)}${paid}`, `<p>New order <strong>${orderLabel(o.orderNo)}</strong> on <strong>${escapeHtml(o.tenant.name)}</strong> — ${inr(o.total)}${paid}</p><pre style="font-family:inherit">${escapeHtml(summary)}</pre><p>Open Admin → Orders to confirm it.</p>`);
  await notifyCustomer(o.id, "placed");
}

export type PaidResult = { ok: true; already: boolean; reopened: boolean } | { ok: false; error: string };

/** Mark an order paid (idempotent). Reopens + re-reserves stock if the hold had already expired. */
export async function markOrderPaid(orderId: string, p: { paymentId: string; paymentRef?: string; source: string }): Promise<PaidResult> {
  const o = await db.storeOrder.findUnique({ where: { id: orderId } });
  if (!o) return { ok: false, error: "Order not found." };
  if (o.paymentStatus === "paid" || o.paymentStatus === "refunded") return { ok: true, already: true, reopened: false };
  const base = { paymentStatus: "paid", paymentId: p.paymentId.slice(0, 100), ...(p.paymentRef ? { paymentRef: p.paymentRef } : {}) };
  const res = await db.$transaction(async (tx) => {
    const open = await tx.storeOrder.updateMany({
      where: { id: o.id, paymentStatus: { notIn: ["paid", "refunded"] }, status: { not: "cancelled" } },
      data: { ...base, timeline: addTimeline(o.timeline, "payment_paid", `Payment received (${p.source}) · ${p.paymentId}`) },
    });
    if (open.count) return "paid" as const;
    const late = await tx.storeOrder.updateMany({
      where: { id: o.id, paymentStatus: { notIn: ["paid", "refunded"] }, status: "cancelled" },
      data: { ...base, status: "new", cancelReason: "", timeline: addTimeline(o.timeline, "payment_paid", `Payment received after the ${PAYMENT_HOLD_MINUTES}-min hold expired (${p.source}) · ${p.paymentId} — order reopened; please check stock`) },
    });
    if (!late.count) return "already" as const;
    if (!o.demoSessionId) await restoreStock(tx, parseItems(o.items), -1); // ponytail: unguarded re-take — may oversell; the owner is told to check
    return "reopened" as const;
  });
  if (res === "already") return { ok: true, already: true, reopened: false };
  if (!o.demoSessionId) {
    await announceOrder(o.id);
    if (res === "reopened") await notifyOwners(o.tenantId, `Check stock — order ${orderLabel(o.orderNo)} paid late`, `<p>Order <b>${orderLabel(o.orderNo)}</b> was paid after its payment hold expired, so it was reopened and its stock taken again. Please confirm the items are still available, or refund it from Admin → Orders.</p>`);
  }
  return { ok: true, already: false, reopened: res === "reopened" };
}

/** Record a failed attempt (shopper can retry; the hold still expires on schedule). */
export async function markPaymentFailed(orderId: string, reason: string): Promise<void> {
  const o = await db.storeOrder.findUnique({ where: { id: orderId }, select: { id: true, timeline: true, paymentStatus: true } });
  if (!o || o.paymentStatus === "paid" || o.paymentStatus === "refunded") return;
  await db.storeOrder.updateMany({
    where: { id: o.id, paymentStatus: { in: ["pending", "failed"] } },
    data: { paymentStatus: "failed", timeline: addTimeline(o.timeline, "payment_failed", reason.slice(0, 200) || "Payment failed") },
  });
}

/** Cancel unpaid online orders past the hold: stock + coupon use go back. Returns how many were released. */
export async function releaseExpiredHolds(tenantId?: string): Promise<number> {
  const cutoff = new Date(Date.now() - PAYMENT_HOLD_MINUTES * 60_000);
  const rows = await db.storeOrder.findMany({
    where: { ...(tenantId ? { tenantId } : {}), paymentMethod: "online", paymentStatus: { in: ["pending", "failed"] }, status: "new", createdAt: { lt: cutoff } },
    select: { id: true, tenantId: true, items: true, timeline: true, couponCode: true, demoSessionId: true },
    take: 200,
  });
  let n = 0;
  for (const o of rows) {
    const done = await db.$transaction(async (tx) => {
      const r = await tx.storeOrder.updateMany({
        where: { id: o.id, paymentStatus: { in: ["pending", "failed"] }, status: "new" },
        data: { status: "cancelled", cancelReason: "Payment not completed", timeline: addTimeline(o.timeline, "cancelled", `Payment not completed within ${PAYMENT_HOLD_MINUTES} minutes — stock released`) },
      });
      if (!r.count) return false;
      if (!o.demoSessionId) await restoreStock(tx, parseItems(o.items), 1);
      if (o.couponCode) await tx.storeCoupon.updateMany({ where: { tenantId: o.tenantId, code: o.couponCode, used: { gt: 0 } }, data: { used: { decrement: 1 } } });
      return true;
    });
    if (done) n += 1;
  }
  return n;
}

/** Daily job entry. */
export async function runPaymentHoldSweep() {
  try {
    return { released: await releaseExpiredHolds() };
  } catch (e) {
    console.error("[storePayments] hold sweep", e);
    return { released: 0, error: true };
  }
}

export type RefundResult = { ok: true; message: string; refundAmount: number; full: boolean } | { ok: false; error: string };

/**
 * Refund `amount` (₹) of an order. Online orders with a Razorpay payment go through the gateway
 * (demo orders are simulated); other methods just record the refund (paid back by UPI/bank/cash).
 */
export async function refundOrder(orderId: string, amount: number, note = ""): Promise<RefundResult> {
  const o = await db.storeOrder.findUnique({ where: { id: orderId } });
  if (!o) return { ok: false, error: "Order not found." };
  const left = o.total - o.refundAmount;
  const amt = Math.round(amount);
  if (!(amt >= 1)) return { ok: false, error: "Enter the refund amount." };
  if (amt > left) return { ok: false, error: `You can refund at most ${inr(left)} on this order.` };
  const gateway = o.paymentMethod === "online" && !!o.paymentId;
  if (o.paymentMethod === "online" && o.paymentStatus !== "paid" && o.paymentStatus !== "refunded") return { ok: false, error: "This order hasn't been paid online — nothing to refund." };
  let ref = "";
  if (gateway) {
    if (o.demoSessionId) ref = `rfnd_DEMO${randomBytes(5).toString("hex")}`; // simulated — never calls Razorpay
    else {
      const keys = await storeRazorpayKeys(o.tenantId);
      if (!keys) return { ok: false, error: "Connect Razorpay in Integrations to refund online payments." };
      try {
        ref = (await createRazorpayRefund(o.paymentId, amt * 100, keys.keyId, keys.keySecret, { order: orderLabel(o.orderNo) })).id;
      } catch (e) {
        return { ok: false, error: e instanceof Error ? e.message : "Razorpay refund failed." };
      }
    }
  }
  const refundAmount = o.refundAmount + amt;
  const full = refundAmount >= o.total;
  const label = `${gateway ? `Refunded ${inr(amt)} via Razorpay${o.demoSessionId ? " (demo — simulated)" : ""} · ${ref}` : `Refund of ${inr(amt)} recorded`}${note ? ` — ${note}` : ""}`;
  await db.storeOrder.update({
    where: { id: o.id },
    data: { refundAmount: { increment: amt }, ...(full ? { paymentStatus: "refunded" } : {}), timeline: addTimeline(o.timeline, full ? "payment_refunded" : "payment_partially_refunded", label) },
  });
  return { ok: true, message: `${orderLabel(o.orderNo)}: ${label}.`, refundAmount, full };
}
