"use server";

import { z } from "zod";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { getCurrentTenant } from "@/lib/tenant";
import { rateLimit } from "@/lib/rateLimit";
import { escapeHtml } from "@/lib/sanitizeHtml";
import { getActiveDemoSessionForTenant, isDemoSubdomain } from "@/lib/demoSession";
import { getStoreSettings } from "@/lib/storeServer";
import { lookupPincode, quoteShipping, type ShippingQuote } from "@/lib/shipping";
import { orderLabel } from "@/lib/store";
import { addTimeline, ensureTrackToken, notifyCustomer, notifyOwners } from "@/lib/fulfilment";

// Public (storefront) actions: pincode check, order lookup for /track, return requests.

async function clientKey(kind: string, tenantId: string) {
  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  return `${kind}:${tenantId}:${ip}`;
}

export type PincodeCheckResult = { ok: true; quote: ShippingQuote; place: string } | { ok: false; error: string };

/** Delivery estimate for a pincode (used by PincodeCheck; subtotal/weight optional). */
export async function checkPincode(pincode: string, subtotal = 0, weightGrams = 0): Promise<PincodeCheckResult> {
  const tenant = await getCurrentTenant();
  if (!tenant) return { ok: false, error: "Store not found." };
  if (!rateLimit(await clientKey("pin", tenant.id), 40, 10 * 60_000).ok) return { ok: false, error: "Too many checks — please wait a minute." };
  const pin = String(pincode ?? "").replace(/\D/g, "");
  if (!/^[1-9]\d{5}$/.test(pin)) return { ok: false, error: "Please enter a valid 6-digit pincode." };
  const [settings, info] = await Promise.all([getStoreSettings(tenant.id), lookupPincode(pin)]);
  const quote = quoteShipping(settings, { pincode: pin, state: info?.state ?? "", subtotal: Math.max(0, Number(subtotal) || 0), weightGrams: Math.max(0, Number(weightGrams) || 0) });
  return { ok: true, quote, place: info ? [info.city, info.state].filter(Boolean).join(", ") : "" };
}

/** Order number + phone → the order's private track token. */
export async function findOrderForTracking(orderNo: string, phone: string): Promise<{ ok: true; token: string } | { ok: false; error: string }> {
  const tenant = await getCurrentTenant();
  if (!tenant) return { ok: false, error: "Store not found." };
  if (!rateLimit(await clientKey("track", tenant.id), 12, 15 * 60_000).ok) return { ok: false, error: "Too many attempts. Please try again in a few minutes." };
  const no = Number(String(orderNo ?? "").replace(/\D/g, ""));
  const digits = String(phone ?? "").replace(/\D/g, "").slice(-10);
  if (!no || digits.length < 10) return { ok: false, error: "Enter your order number and the 10-digit phone number used at checkout." };
  const demo = isDemoSubdomain(tenant.subdomain) ? await getActiveDemoSessionForTenant(tenant) : null;
  const o = await db.storeOrder.findFirst({
    where: { tenantId: tenant.id, orderNo: no, ...(demo ? { OR: [{ demoSessionId: null }, { demoSessionId: demo.id }] } : { demoSessionId: null }) },
    select: { id: true, phone: true, trackToken: true },
  });
  if (!o || o.phone.replace(/\D/g, "").slice(-10) !== digits) return { ok: false, error: "We couldn't find an order with that number and phone. Please check and try again." };
  return { ok: true, token: await ensureTrackToken(o) };
}

const ReturnSchema = z.object({
  token: z.string().min(16).max(64),
  reason: z.enum(["Damaged or defective", "Wrong item received", "Size or fit issue", "Not as described", "Changed my mind", "Other"]),
  details: z.string().trim().max(500).default(""),
  kind: z.enum(["return", "exchange"]).default("return"),
});
export type ReturnRequestInput = z.input<typeof ReturnSchema>;

export async function requestReturn(input: ReturnRequestInput): Promise<{ ok: true } | { ok: false; error: string }> {
  const tenant = await getCurrentTenant();
  if (!tenant) return { ok: false, error: "Store not found." };
  if (!rateLimit(await clientKey("return", tenant.id), 6, 15 * 60_000).ok) return { ok: false, error: "Too many requests. Please try again later." };
  const p = ReturnSchema.safeParse(input);
  if (!p.success) return { ok: false, error: "Please choose a reason for the return." };
  const o = await db.storeOrder.findFirst({ where: { tenantId: tenant.id, trackToken: p.data.token } });
  if (!o) return { ok: false, error: "Order not found." };
  if (o.status !== "delivered") return { ok: false, error: "Returns can be requested once the order is delivered." };
  if (o.returnStatus !== "none") return { ok: false, error: "A return has already been requested for this order." };
  const settings = await getStoreSettings(tenant.id, o.demoSessionId);
  const days = settings.shipping.returnWindowDays;
  const since = o.deliveredAt ?? o.updatedAt;
  if (!days || Date.now() - since.getTime() > days * 86_400_000) return { ok: false, error: days ? `The ${days}-day return window for this order has closed.` : "This store doesn't accept returns online — please contact them." };
  const reason = [p.data.kind === "exchange" ? "Exchange" : "Return", p.data.reason, p.data.details].filter(Boolean).join(": ");
  await db.storeOrder.update({ where: { id: o.id }, data: { returnStatus: "requested", returnReason: reason, timeline: addTimeline(o.timeline, "return_requested", reason) } });
  if (!o.demoSessionId) {
    await notifyCustomer(o.id, "return_requested");
    await notifyOwners(tenant.id, `Return requested — order ${orderLabel(o.orderNo)}`, `<p><b>${escapeHtml(o.customerName)}</b> (${escapeHtml(o.phone)}) requested a ${p.data.kind} for order <b>${orderLabel(o.orderNo)}</b>.</p><p>${escapeHtml(reason)}</p><p>Open Admin → Returns to approve or reject it.</p>`);
  }
  revalidatePath(`/track/${p.data.token}`);
  revalidatePath("/admin/returns");
  return { ok: true };
}
