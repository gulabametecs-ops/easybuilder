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
export async function createRazorpayOrder(amountPaise: number, receipt: string): Promise<{ id: string }> {
  const { keyId, keySecret } = await getRazorpayKeys();
  const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");

  const res = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Basic ${auth}` },
    body: JSON.stringify({ amount: amountPaise, currency: "INR", receipt, payment_capture: 1 }),
  });
  if (!res.ok) throw new Error(`Razorpay order creation failed (${res.status})`);
  return (await res.json()) as { id: string };
}

// Verifies the payment signature returned by Razorpay Checkout.
export async function verifyRazorpaySignature(orderId: string, paymentId: string, signature: string): Promise<boolean> {
  const { keySecret } = await getRazorpayKeys();
  const expected = crypto.createHmac("sha256", keySecret).update(`${orderId}|${paymentId}`).digest("hex");
  try {
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
  } catch {
    return false;
  }
}
