"use server";

import { db } from "@/lib/db";
import { getCurrentTenant } from "@/lib/tenant";
import { parsePayments } from "@/lib/payments";
import { applyPaymentToggles, parseIntegrations } from "@/lib/integrations";
import { createRazorpayOrderWithKeys, verifyRazorpaySignatureWithSecret } from "@/lib/razorpay";
import { getActiveDemoSession } from "@/lib/demoSession";

function clean(v: unknown) {
  return (typeof v === "string" ? v : "").trim();
}

export async function startSiteDonation(input: {
  name: string;
  email: string;
  phone: string;
  amountInr: number;
  eventId?: string;
  causeId?: string;
  note?: string;
}): Promise<
  | { status: "razorpay"; donationId: string; rzpOrderId: string; keyId: string; amount: number }
  | { status: "upi"; donationId: string }
  | { status: "error"; message: string }
> {
  const tenant = await getCurrentTenant();
  if (!tenant) return { status: "error", message: "Site not found." };
  const amountInr = Math.round(Number(input.amountInr) || 0);
  if (amountInr < 1) return { status: "error", message: "Enter an amount of at least ₹1." };
  const name = clean(input.name) || "Supporter";
  const demo = await getActiveDemoSession();
  const causeId = clean(input.causeId);
  if (causeId) {
    const cause = await db.cause.findFirst({ where: { id: causeId, tenantId: tenant.id, published: true }, select: { status: true, demoSessionId: true } });
    // a demo visitor's cause is only theirs (same rule as getSiteCauses)
    if (!cause || (cause.demoSessionId && cause.demoSessionId !== demo?.id)) return { status: "error", message: "This cause is no longer available." };
    if (cause.status === "paused") return { status: "error", message: "Donations to this cause are paused right now." };
  }

  const cfg = await db.siteConfig.findUnique({ where: { tenantId: tenant.id } });
  // Razorpay switched off in Admin → Integrations behaves like "no keys" (UPI/bank fallback).
  const pay = applyPaymentToggles(parsePayments(cfg?.payments), parseIntegrations(cfg?.integrations));
  const amount = amountInr * 100;

  const donation = await db.siteDonation.create({
    data: {
      tenantId: tenant.id,
      eventId: clean(input.eventId),
      causeId,
      name,
      email: clean(input.email),
      phone: clean(input.phone),
      amount,
      note: clean(input.note),
      status: "created",
      gateway: pay.razorpayKeyId && pay.razorpayKeySecret ? "razorpay" : "upi",
      demoSessionId: demo?.id,
    },
  });

  if (pay.razorpayKeyId && pay.razorpayKeySecret) {
    try {
      const rzp = await createRazorpayOrderWithKeys(amount, donation.id, pay.razorpayKeyId, pay.razorpayKeySecret);
      await db.siteDonation.update({ where: { id: donation.id }, data: { gatewayOrderId: rzp.id } });
      return { status: "razorpay", donationId: donation.id, rzpOrderId: rzp.id, keyId: pay.razorpayKeyId, amount };
    } catch {
      return { status: "error", message: "Could not start Razorpay. Use UPI / QR instead." };
    }
  }

  return { status: "upi", donationId: donation.id };
}

export async function confirmSiteDonation(input: {
  donationId: string;
  rzpOrderId: string;
  rzpPaymentId: string;
  signature: string;
}): Promise<{ ok: boolean; message: string }> {
  const tenant = await getCurrentTenant();
  if (!tenant) return { ok: false, message: "Site not found." };
  const row = await db.siteDonation.findFirst({ where: { id: input.donationId, tenantId: tenant.id } });
  if (!row) return { ok: false, message: "Donation not found." };
  const cfg = await db.siteConfig.findUnique({ where: { tenantId: tenant.id } });
  const pay = parsePayments(cfg?.payments);
  if (!verifyRazorpaySignatureWithSecret(input.rzpOrderId, input.rzpPaymentId, input.signature, pay.razorpayKeySecret)) {
    return { ok: false, message: "Payment could not be verified." };
  }
  await db.siteDonation.update({
    where: { id: row.id },
    data: { status: "paid", gatewayPayId: input.rzpPaymentId, gatewayOrderId: input.rzpOrderId, gateway: "razorpay" },
  });
  return { ok: true, message: "Thank you. Your contribution was received." };
}
