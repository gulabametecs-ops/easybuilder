import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentTenant } from "@/lib/tenant";
import { verifyRazorpayWebhook } from "@/lib/razorpay";
import { storeRazorpayKeys } from "@/lib/checkoutServer";
import { markOrderPaid, markPaymentFailed } from "@/lib/storePayments";
import { addTimeline } from "@/lib/fulfilment";
import { inr } from "@/lib/store";

// Per-store Razorpay webhook (the store owner's own Razorpay account). Configure in
// Razorpay → Settings → Webhooks: https://<store domain>/api/store/razorpay-webhook
// Events: payment.captured, payment.failed, refund.processed. Secret = Integrations → Razorpay → Webhook secret.

type Entity = { id?: string; order_id?: string; payment_id?: string; amount?: number; amount_refunded?: number; error_description?: string };
type Event = { event?: string; payload?: { payment?: { entity?: Entity }; refund?: { entity?: Entity } } };

export async function POST(request: Request) {
  const tenant = await getCurrentTenant();
  if (!tenant) return NextResponse.json({ error: "Unknown store" }, { status: 404 });
  const keys = await storeRazorpayKeys(tenant.id);
  if (!keys?.webhookSecret) return NextResponse.json({ error: "Webhook not configured" }, { status: 503 });
  const body = await request.text();
  if (!verifyRazorpayWebhook(body, request.headers.get("x-razorpay-signature") ?? "", keys.webhookSecret)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }
  let ev: Event;
  try {
    ev = JSON.parse(body);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const pay = ev.payload?.payment?.entity;
  const refund = ev.payload?.refund?.entity;
  const rzpOrderId = pay?.order_id ?? "";
  const paymentId = pay?.id || refund?.payment_id || "";
  const order = rzpOrderId
    ? await db.storeOrder.findFirst({ where: { tenantId: tenant.id, paymentRef: rzpOrderId, demoSessionId: null } })
    : paymentId ? await db.storeOrder.findFirst({ where: { tenantId: tenant.id, paymentId, demoSessionId: null } }) : null;
  if (!order) return NextResponse.json({ ok: true, skipped: "order_not_found" });

  switch (ev.event) {
    case "payment.captured": {
      const r = await markOrderPaid(order.id, { paymentId, paymentRef: rzpOrderId, source: "webhook" });
      return NextResponse.json(r.ok ? { ok: true, already: r.already } : { ok: false, error: r.error });
    }
    case "payment.failed":
      await markPaymentFailed(order.id, `Payment attempt failed${pay?.error_description ? `: ${pay.error_description}` : ""}`);
      return NextResponse.json({ ok: true });
    case "refund.processed": {
      // payment.amount_refunded is cumulative (paise) — idempotent with refunds issued from the admin.
      // Without it, add this refund once (admin-issued refunds already logged their id in the timeline).
      const refunded = pay?.amount_refunded !== undefined
        ? Math.round(pay.amount_refunded / 100)
        : refund?.id && !order.timeline.includes(refund.id) ? order.refundAmount + Math.round((refund.amount ?? 0) / 100) : 0;
      if (refunded > order.refundAmount) {
        const full = refunded >= order.total;
        await db.storeOrder.updateMany({
          where: { id: order.id, refundAmount: { lt: refunded } },
          data: { refundAmount: refunded, ...(full ? { paymentStatus: "refunded" } : {}), timeline: addTimeline(order.timeline, full ? "payment_refunded" : "payment_partially_refunded", `Razorpay refund processed${refund?.id ? ` · ${refund.id}` : ""} — ${inr(refunded)} refunded in total`) },
        });
      }
      return NextResponse.json({ ok: true });
    }
    default:
      return NextResponse.json({ ok: true, ignored: ev.event });
  }
}
