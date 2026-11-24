import crypto from "node:crypto";
import { getRazorpayKeys } from "./platformConfig";

// Razorpay REST integration via fetch (no SDK dependency). Keys come from the
// super-admin settings (DB), falling back to env vars. When both keys are set,
// live payments are enabled; otherwise checkout runs in mock mode.

export async function razorpayEnabled(): Promise<boolean> {
  const { keyId, keySecret } = await getRazorpayKeys();
  return Boolean(keyId && keySecret);
}

export async function razorpayKeyId(): Promise<string> {
  return (await getRazorpayKeys()).keyId;
}

// Creates a Razorpay order for the given amount (in paise). Returns the order id.
export async function createRazorpayOrderWithKeys(
  amountPaise: number,
  receipt: string,
  keyId: string,
  keySecret: string,
  notes?: Record<string, string>,
): Promise<{ id: string }> {
  const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
  const res = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Basic ${auth}` },
    body: JSON.stringify({ amount: amountPaise, currency: "INR", receipt, payment_capture: 1, ...(notes ? { notes } : {}) }),
  });
  if (!res.ok) throw new Error(`Razorpay order creation failed (${res.status})`);
  return (await res.json()) as { id: string };
}

export function verifyRazorpaySignatureWithSecret(
  orderId: string,
  paymentId: string,
  signature: string,
  keySecret: string,
): boolean {
  const expected = crypto.createHmac("sha256", keySecret).update(`${orderId}|${paymentId}`).digest("hex");
  try {
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
  } catch {
    return false;
  }
}

/** Webhook body signature: HMAC-SHA256(rawBody, webhookSecret) hex in the X-Razorpay-Signature header. */
export function verifyRazorpayWebhook(body: string, signature: string, secret: string): boolean {
  if (!secret || !signature) return false;
  const expected = crypto.createHmac("sha256", secret).update(body).digest("hex");
  try {
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
  } catch {
    return false;
  }
}

/** Refund (part of) a captured payment. `amountPaise` omitted = full refund. */
export async function createRazorpayRefund(
  paymentId: string,
  amountPaise: number | undefined,
  keyId: string,
  keySecret: string,
  notes: Record<string, string> = {},
): Promise<{ id: string; amount: number; status: string }> {
  const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
  const res = await fetch(`https://api.razorpay.com/v1/payments/${encodeURIComponent(paymentId)}/refund`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Basic ${auth}` },
    body: JSON.stringify({ ...(amountPaise ? { amount: amountPaise } : {}), notes }),
    signal: AbortSignal.timeout(15_000),
  });
  const json = (await res.json().catch(() => ({}))) as { id?: string; amount?: number; status?: string; error?: { description?: string } };
  if (!res.ok || !json.id) throw new Error(json.error?.description || `Razorpay refund failed (${res.status})`);
  return { id: json.id, amount: json.amount ?? amountPaise ?? 0, status: json.status ?? "processed" };
}

export async function createRazorpayOrder(amountPaise: number, receipt: string): Promise<{ id: string }> {
  const { keyId, keySecret } = await getRazorpayKeys();
  return createRazorpayOrderWithKeys(amountPaise, receipt, keyId, keySecret);
}

// Verifies the payment signature returned by Razorpay Checkout.
export async function verifyRazorpaySignature(orderId: string, paymentId: string, signature: string): Promise<boolean> {
  const { keySecret } = await getRazorpayKeys();
  return verifyRazorpaySignatureWithSecret(orderId, paymentId, signature, keySecret);
}
