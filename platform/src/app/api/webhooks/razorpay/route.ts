import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { db } from "@/lib/db";
import { getRazorpayKeys } from "@/lib/platformConfig";
import { provisionForOrder } from "@/lib/actions/checkout";

// Razorpay webhook — marks orders paid when the browser callback is missed.
// Configure the webhook URL in Razorpay dashboard → Settings → Webhooks:
//   https://yourdomain.com/api/webhooks/razorpay
// Events: payment.captured, order.paid

function verifyWebhookSignature(body: string, signature: string, secret: string): boolean {
  const expected = crypto.createHmac("sha256", secret).update(body).digest("hex");
  try {
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || "";
  const body = await request.text();
  const signature = request.headers.get("x-razorpay-signature") || "";

  // Prefer dedicated webhook secret; fall back to API key secret for simple setups.
  const { keySecret } = await getRazorpayKeys();
  const secret = webhookSecret || keySecret;
  if (!secret) {
    return NextResponse.json({ error: "Webhook not configured" }, { status: 503 });
  }
  if (!signature || !verifyWebhookSignature(body, signature, secret)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  let event: { event?: string; payload?: { payment?: { entity?: { id?: string; order_id?: string; status?: string } }; order?: { entity?: { id?: string; receipt?: string; status?: string } } } };
  try {
    event = JSON.parse(body);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const payment = event.payload?.payment?.entity;
  const orderEntity = event.payload?.order?.entity;
  const rzpOrderId = payment?.order_id || orderEntity?.id || "";
  const rzpPaymentId = payment?.id || "";
  const receipt = orderEntity?.receipt || "";

  if (!rzpOrderId && !receipt) {
    return NextResponse.json({ ok: true, skipped: true });
  }

  const order =
    (rzpOrderId ? await db.order.findFirst({ where: { gatewayOrderId: rzpOrderId } }) : null) ||
    (receipt ? await db.order.findUnique({ where: { id: receipt } }) : null);

  if (!order) {
    return NextResponse.json({ ok: true, skipped: "order_not_found" });
  }

  if (order.status === "provisioned" || order.status === "refunded") {
    return NextResponse.json({ ok: true, already: order.status });
  }

  // "authorized" is not money received — wait for capture.
  const paidEvents = new Set(["payment.captured", "order.paid"]);
  if (!event.event || !paidEvents.has(event.event)) {
    return NextResponse.json({ ok: true, ignored: event.event });
  }

  if (order.status === "created" || order.status === "failed") {
    await db.order.update({
      where: { id: order.id },
      data: {
        status: "paid",
        gatewayPayId: rzpPaymentId || order.gatewayPayId,
        gatewayOrderId: rzpOrderId || order.gatewayOrderId,
      },
    });
  }

  const res = await provisionForOrder(order.id);
  return NextResponse.json({ ok: res.ok, message: res.ok ? "provisioned" : res.message });
}
