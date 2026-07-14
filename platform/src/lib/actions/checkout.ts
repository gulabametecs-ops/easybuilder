"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { createTenantFromTemplate } from "@/lib/provision";
import { getDuration, priceFor, subscriptionEndFromDuration, resolveTier } from "@/lib/plans";
import { getPlatformConfig } from "@/lib/platformConfig";
import { getVertical } from "@/lib/verticals";
import { ROOT_DOMAIN } from "@/lib/domains";
import { razorpayEnabled, razorpayKeyId, createRazorpayOrder, verifyRazorpaySignature } from "@/lib/razorpay";
import { validateCoupon, redeemCoupon } from "@/lib/actions/coupons";
import { assignInvoiceNo } from "@/lib/invoice";

const RESERVED = new Set(["www", "admin", "api", "app", "mail", "ftp", "root", "demo", "super", "dashboard", "static", "assets", "cdn"]);

export type CheckoutState =
  | { status: "idle" }
  | { status: "error"; message: string }
  | { status: "enquiry"; message: string }
  | { status: "razorpay"; dbOrderId: string; rzpOrderId: string; keyId: string; amount: number; name: string; email: string; phone: string; planLabel: string }
  | { status: "success"; url: string; adminUrl: string; email: string; planLabel: string };

const schema = z.object({
  vertical: z.string().min(1),
  tier: z.string().min(1),
  duration: z.string().min(1),
  businessName: z.string().min(2, "Business name is too short"),
  subdomain: z.string().min(3).max(32).regex(/^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/, "Invalid subdomain"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().min(7, "Enter a valid phone"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function paymentMode(): Promise<"razorpay" | "mock"> {
  return (await razorpayEnabled()) ? "razorpay" : "mock";
}

const proto = () => (ROOT_DOMAIN.includes("localhost") ? "http" : "https");
const liveUrl = (subdomain: string) => `${proto()}://${subdomain}.${ROOT_DOMAIN}`;

// Finds a free subdomain, appending -1, -2… if the requested one is taken.
async function freeSubdomain(desired: string): Promise<string> {
  if (!(await db.tenant.findUnique({ where: { subdomain: desired } }))) return desired;
  for (let i = 1; i < 100; i++) {
    const candidate = `${desired}${i}`;
    if (!(await db.tenant.findUnique({ where: { subdomain: candidate } }))) return candidate;
  }
  return `${desired}-${Date.now().toString().slice(-5)}`;
}

// Provisions a tenant from a paid order. Fully idempotent and collision-safe:
// the customer ALWAYS ends up live once they've paid.
async function provisionForOrder(
  orderId: string,
): Promise<{ ok: true; url: string; adminUrl: string; email: string; planLabel: string } | { ok: false; message: string }> {
  const order = await db.order.findUnique({ where: { id: orderId } });
  if (!order) return { ok: false, message: "Order not found." };

  const [tierId, durId] = order.plan.split("-");
  const tier = resolveTier(tierId, "{}");
  const duration = getDuration(durId);
  const vertical = getVertical(order.vertical);
  if (!tier || !duration || !vertical) return { ok: false, message: "This order's plan is invalid. Please contact support." };
  const planLabel = `${tier.name} · ${duration.label}`;

  // Already provisioned — return the existing link (idempotent).
  if (order.status === "provisioned" && order.tenantId) {
    const t = await db.tenant.findUnique({ where: { id: order.tenantId } });
    const sub = t?.subdomain ?? order.subdomain;
    return { ok: true, url: liveUrl(sub), adminUrl: `${liveUrl(sub)}/admin/login`, email: order.email, planLabel };
  }

  // Subdomain already taken? If it belongs to THIS customer (double-submit),
  // treat it as already done — no password needed. Otherwise pick a free variant.
  let subdomain = order.subdomain;
  const existing = await db.tenant.findUnique({ where: { subdomain: order.subdomain } });
  if (existing) {
    const owner = await db.user.findFirst({ where: { tenantId: existing.id } });
    if (owner?.email?.toLowerCase() === order.email.toLowerCase()) {
      await db.order.update({ where: { id: order.id }, data: { status: "provisioned", tenantId: existing.id, provisionError: "" } });
      await assignInvoiceNo(order.id).catch(() => {});
      return { ok: true, url: liveUrl(subdomain), adminUrl: `${liveUrl(subdomain)}/admin/login`, email: order.email, planLabel };
    }
    subdomain = await freeSubdomain(order.subdomain);
  }

  // Fresh provisioning needs the saved password.
  if (!order.passwordHash) return { ok: false, message: "This order has no saved password. Use “Set password & provision” to recover it." };

  try {
    const tenant = await createTenantFromTemplate({
      businessName: order.customerName,
      subdomain,
      ownerEmail: order.email,
      ownerPasswordHash: order.passwordHash,
      vertical: order.vertical,
      plan: tierId,
      status: "active",
      subscriptionEndsAt: subscriptionEndFromDuration(duration, order.createdAt.getTime()),
    });
    await db.order.update({ where: { id: order.id }, data: { status: "provisioned", tenantId: tenant.id, subdomain, provisionError: "" } });
    await assignInvoiceNo(order.id).catch(() => {});
    return { ok: true, url: liveUrl(subdomain), adminUrl: `${liveUrl(subdomain)}/admin/login`, email: order.email, planLabel };
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    console.error(`[provision] order ${order.id} failed:`, message);
    await db.order.update({ where: { id: order.id }, data: { provisionError: message.slice(0, 300) } }).catch(() => {});
    return { ok: false, message: "We couldn't set up your site automatically. Our team has been notified — please contact support and we'll fix it right away." };
  }
}

// Super-admin / recovery entry point: retry provisioning a paid-but-stuck order.
// For legacy orders with no saved password, a temporary one can be supplied.
export async function retryProvisionForOrder(orderId: string, tempPassword?: string) {
  if (tempPassword && tempPassword.length >= 6) {
    const order = await db.order.findUnique({ where: { id: orderId } });
    if (order && !order.passwordHash) {
      await db.order.update({ where: { id: orderId }, data: { passwordHash: await bcrypt.hash(tempPassword, 10) } });
    }
  }
  const res = await provisionForOrder(orderId);
  revalidatePath("/super/orders");
  return res;
}

export async function subscribe(_prev: CheckoutState, formData: FormData): Promise<CheckoutState> {
  const raw = {
    vertical: formData.get("vertical")?.toString() ?? "",
    tier: formData.get("tier")?.toString() ?? "",
    duration: formData.get("duration")?.toString() ?? "",
    businessName: formData.get("businessName")?.toString() ?? "",
    subdomain: (formData.get("subdomain")?.toString() ?? "").toLowerCase().trim(),
    email: formData.get("email")?.toString() ?? "",
    phone: formData.get("phone")?.toString() ?? "",
    password: formData.get("password")?.toString() ?? "",
  };

  const cfg = await getPlatformConfig();
  const vertical = getVertical(raw.vertical);
  const tier = resolveTier(raw.tier, cfg.planOverrides);
  const duration = getDuration(raw.duration);
  if (!vertical || !tier || !duration) return { status: "error", message: "Please choose a sector, plan and duration." };
  const planLabel = `${tier.name} · ${duration.label}`;
  let amount = priceFor(tier, duration);

  // Coming-soon sectors: capture an enquiry.
  if (vertical.status !== "live") {
    if (!raw.businessName || !raw.email || !raw.phone) return { status: "error", message: "Please fill your name, email and phone." };
    await db.platformLead.create({
      data: { name: raw.businessName, email: raw.email, phone: raw.phone, company: raw.businessName, vertical: vertical.id, type: "signup", message: `Interested in ${vertical.name} — ${planLabel}` },
    });
    return { status: "enquiry", message: `Thanks! ${vertical.name} template is coming soon — we'll contact you to set it up.` };
  }

  const parsed = schema.safeParse(raw);
  if (!parsed.success) return { status: "error", message: parsed.error.issues[0]?.message ?? "Invalid input" };
  if (RESERVED.has(parsed.data.subdomain)) return { status: "error", message: "That subdomain is reserved." };
  if (await db.tenant.findUnique({ where: { subdomain: parsed.data.subdomain } })) {
    return { status: "error", message: `"${parsed.data.subdomain}" is already taken.` };
  }

  // Apply a discount coupon if one was entered and is valid.
  const couponCode = formData.get("coupon")?.toString() ?? "";
  const coupon = await validateCoupon(couponCode);
  if (coupon.valid) amount = Math.round(amount * (1 - coupon.percentOff / 100));

  const rzpOn = await razorpayEnabled();

  // Create the order record. The chosen admin password is stored as a bcrypt
  // hash so provisioning can run (and be retried) without re-entering it.
  const order = await db.order.create({
    data: {
      customerName: parsed.data.businessName,
      email: parsed.data.email,
      phone: parsed.data.phone,
      company: parsed.data.businessName,
      vertical: vertical.id,
      subdomain: parsed.data.subdomain,
      plan: `${tier.id}-${duration.id}`,
      amount,
      gateway: rzpOn ? "razorpay" : "mock",
      status: "created",
      passwordHash: await bcrypt.hash(parsed.data.password, 10),
    },
  });
  if (coupon.valid) await redeemCoupon(coupon.code);

  // Real gateway: create a Razorpay order and hand off to the client checkout.
  if (rzpOn) {
    try {
      const rzp = await createRazorpayOrder(amount, order.id);
      await db.order.update({ where: { id: order.id }, data: { gatewayOrderId: rzp.id } });
      return { status: "razorpay", dbOrderId: order.id, rzpOrderId: rzp.id, keyId: await razorpayKeyId(), amount, name: parsed.data.businessName, email: parsed.data.email, phone: parsed.data.phone, planLabel };
    } catch {
      return { status: "error", message: "Could not start payment. Please try again." };
    }
  }

  // Mock: mark paid + provision immediately.
  await db.order.update({ where: { id: order.id }, data: { status: "paid", gatewayPayId: `mock_${order.id.slice(-8)}` } });
  const res = await provisionForOrder(order.id);
  if (!res.ok) return { status: "error", message: res.message };
  return { status: "success", url: res.url, adminUrl: res.adminUrl, email: res.email, planLabel };
}

// Called by the client after Razorpay Checkout succeeds. Verifies the signature,
// marks the order paid, and provisions the tenant.
export async function verifyPayment(input: {
  dbOrderId: string;
  rzpOrderId: string;
  rzpPaymentId: string;
  signature: string;
}): Promise<CheckoutState> {
  if (!(await verifyRazorpaySignature(input.rzpOrderId, input.rzpPaymentId, input.signature))) {
    await db.order.updateMany({ where: { id: input.dbOrderId }, data: { status: "failed" } });
    return { status: "error", message: "Payment verification failed. If you were charged, contact support." };
  }
  await db.order.update({ where: { id: input.dbOrderId }, data: { status: "paid", gatewayPayId: input.rzpPaymentId } });
  const res = await provisionForOrder(input.dbOrderId);
  if (!res.ok) return { status: "error", message: res.message };
  return { status: "success", url: res.url, adminUrl: res.adminUrl, email: res.email, planLabel: res.planLabel };
}
