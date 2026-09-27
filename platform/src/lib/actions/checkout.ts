"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { createTenantFromTemplate } from "@/lib/provision";
import { getDuration, priceFor, subscriptionEndFromDuration, resolveTier } from "@/lib/plans";
import { getPlatformConfig } from "@/lib/platformConfig";
import { getVertical } from "@/lib/verticals";
import { isDesignId } from "@/lib/designs";
import { ROOT_DOMAIN } from "@/lib/domains";
import { razorpayEnabled, razorpayKeyId, createRazorpayOrder, verifyRazorpaySignature } from "@/lib/razorpay";
import { validateCoupon } from "@/lib/actions/coupons";
import { assignInvoiceNo } from "@/lib/invoice";
import { getSuperSession } from "@/lib/superAuth";
import { getAuthedSession } from "@/lib/auth";
import { rateLimit } from "@/lib/rateLimit";
import { normalizeBlueprint } from "@/lib/ai/normalizeBlueprint";
import { applyBlueprint } from "@/lib/ai/applyBlueprint";

const RESERVED = new Set(["www", "admin", "api", "app", "mail", "ftp", "root", "demo", "super", "dashboard", "static", "assets", "cdn"]);

function sanitizeAiBlueprint(raw: string): string {
  if (!raw || raw === "{}") return "{}";
  if (raw.length > 120_000) return "{}";
  try {
    const parsed = normalizeBlueprint(JSON.parse(raw));
    return parsed ? JSON.stringify(parsed) : "{}";
  } catch {
    return "{}";
  }
}

async function applyOrderAiBlueprint(tenantId: string, aiBlueprint: string) {
  if (!aiBlueprint || aiBlueprint === "{}") return;
  try {
    const blueprint = normalizeBlueprint(JSON.parse(aiBlueprint));
    if (!blueprint) return;
    await applyBlueprint({ tenantId, blueprint, mode: "overwrite" });
    if (blueprint.website.name) {
      await db.tenant.update({ where: { id: tenantId }, data: { name: blueprint.website.name } });
    }
  } catch (e) {
    console.error("[provision] AI blueprint apply failed:", e);
  }
}

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

// Marks a coupon as used after a successful order. Not exported: every export of a
// "use server" file is a public endpoint, and this one would let anyone burn coupons.
async function redeemCoupon(code: string): Promise<void> {
  const c = code.trim().toUpperCase();
  if (!c) return;
  await db.coupon.updateMany({ where: { code: c, active: true }, data: { usedCount: { increment: 1 } } });
}

// Mock checkout marks orders paid for free — local dev only unless explicitly opted in.
const mockPaymentsAllowed = () => process.env.NODE_ENV !== "production" || process.env.ALLOW_MOCK_PAYMENTS === "1";

export async function paymentMode(): Promise<"razorpay" | "mock"> {
  return (await razorpayEnabled()) ? "razorpay" : "mock";
}

const proto = () => (ROOT_DOMAIN.includes("localhost") ? "http" : "https");
const liveUrl = (subdomain: string) => `${proto()}://${subdomain}.${ROOT_DOMAIN}`;

async function freeSubdomain(desired: string): Promise<string> {
  if (!(await db.tenant.findUnique({ where: { subdomain: desired } }))) return desired;
  for (let i = 1; i < 100; i++) {
    const candidate = `${desired}${i}`;
    if (!(await db.tenant.findUnique({ where: { subdomain: candidate } }))) return candidate;
  }
  return `${desired}-${Date.now().toString().slice(-5)}`;
}

async function applyCouponIfAny(orderId: string, couponCode: string) {
  if (!couponCode) return;
  const check = await validateCoupon(couponCode);
  if (check.valid) await redeemCoupon(check.code);
  // Clear so a retry can't double-redeem.
  await db.order.update({ where: { id: orderId }, data: { couponCode: "" } }).catch(() => {});
}

/** Extend an existing tenant's subscription after a paid renew/upgrade order. */
async function applyRenewal(orderId: string): Promise<{ ok: true; url: string; adminUrl: string; email: string; planLabel: string } | { ok: false; message: string }> {
  const order = await db.order.findUnique({ where: { id: orderId } });
  if (!order || !order.tenantId) return { ok: false, message: "Renewal order is missing a tenant." };
  if (order.status !== "paid" && order.status !== "provisioned") {
    return { ok: false, message: "Order is not paid." };
  }

  const [tierId, durId] = order.plan.split("-");
  const cfg = await getPlatformConfig();
  const tier = resolveTier(tierId, cfg.planOverrides);
  const duration = getDuration(durId);
  if (!tier || !duration) return { ok: false, message: "Invalid plan on this order." };
  const planLabel = `${tier.name} · ${duration.label}`;

  if (order.status === "provisioned") {
    const t = await db.tenant.findUnique({ where: { id: order.tenantId } });
    const sub = t?.subdomain ?? order.subdomain;
    return { ok: true, url: liveUrl(sub), adminUrl: `${liveUrl(sub)}/admin/login`, email: order.email, planLabel };
  }

  const tenant = await db.tenant.findUnique({ where: { id: order.tenantId } });
  if (!tenant) return { ok: false, message: "Tenant not found." };

  const now = Date.now();
  const baseMs =
    tenant.subscriptionEndsAt && new Date(tenant.subscriptionEndsAt).getTime() > now
      ? new Date(tenant.subscriptionEndsAt).getTime()
      : now;
  const subscriptionEndsAt = subscriptionEndFromDuration(duration, baseMs);

  await db.tenant.update({
    where: { id: tenant.id },
    data: {
      plan: tierId,
      status: "active",
      subscriptionEndsAt,
      cancelledAt: null,
      cancelReason: "",
    },
  });

  await applyCouponIfAny(order.id, order.couponCode);
  await db.order.update({
    where: { id: order.id },
    data: { status: "provisioned", passwordHash: "", provisionError: "" },
  });
  await assignInvoiceNo(order.id).catch(() => {});

  return {
    ok: true,
    url: liveUrl(tenant.subdomain),
    adminUrl: `${liveUrl(tenant.subdomain)}/admin/login`,
    email: order.email,
    planLabel,
  };
}

// Provisions a tenant from a PAID order. Fully idempotent and collision-safe.
export async function provisionForOrder(
  orderId: string,
): Promise<{ ok: true; url: string; adminUrl: string; email: string; planLabel: string } | { ok: false; message: string }> {
  const order = await db.order.findUnique({ where: { id: orderId } });
  if (!order) return { ok: false, message: "Order not found." };

  // CRITICAL: never provision unpaid orders.
  if (order.status !== "paid" && order.status !== "provisioned") {
    return { ok: false, message: "Order is not paid." };
  }

  // Renew / upgrade path — extend existing tenant instead of creating a new one.
  if (order.kind === "renew" || order.kind === "upgrade") {
    return applyRenewal(orderId);
  }

  const [tierId, durId] = order.plan.split("-");
  const cfg = await getPlatformConfig();
  const tier = resolveTier(tierId, cfg.planOverrides);
  const duration = getDuration(durId);
  const vertical = getVertical(order.vertical);
  if (!tier || !duration || !vertical) return { ok: false, message: "This order's plan is invalid. Please contact support." };
  const planLabel = `${tier.name} · ${duration.label}`;

  if (order.status === "provisioned" && order.tenantId) {
    const t = await db.tenant.findUnique({ where: { id: order.tenantId } });
    const sub = t?.subdomain ?? order.subdomain;
    return { ok: true, url: liveUrl(sub), adminUrl: `${liveUrl(sub)}/admin/login`, email: order.email, planLabel };
  }

  let subdomain = order.subdomain;
  const existing = await db.tenant.findUnique({ where: { subdomain: order.subdomain } });
  if (existing) {
    const owner = await db.user.findFirst({ where: { tenantId: existing.id } });
    if (owner?.email?.toLowerCase() === order.email.toLowerCase()) {
      await applyCouponIfAny(order.id, order.couponCode);
      await db.order.update({
        where: { id: order.id },
        data: { status: "provisioned", tenantId: existing.id, provisionError: "", passwordHash: "" },
      });
      await assignInvoiceNo(order.id).catch(() => {});
      return { ok: true, url: liveUrl(subdomain), adminUrl: `${liveUrl(subdomain)}/admin/login`, email: order.email, planLabel };
    }
    subdomain = await freeSubdomain(order.subdomain);
  }

  if (!order.passwordHash) {
    return { ok: false, message: "This order has no saved password. Use “Set password & provision” to recover it." };
  }

  try {
    const tenant = await createTenantFromTemplate({
      businessName: order.customerName,
      subdomain,
      ownerEmail: order.email,
      ownerPasswordHash: order.passwordHash,
      vertical: order.vertical,
      design: order.design,
      plan: tierId,
      status: "active",
      subscriptionEndsAt: subscriptionEndFromDuration(duration, order.createdAt.getTime()),
    });
    await applyCouponIfAny(order.id, order.couponCode);
    await db.order.update({
      where: { id: order.id },
      data: { status: "provisioned", tenantId: tenant.id, subdomain, provisionError: "", passwordHash: "" },
    });
    await assignInvoiceNo(order.id).catch(() => {});
    await applyOrderAiBlueprint(tenant.id, order.aiBlueprint);
    return { ok: true, url: liveUrl(subdomain), adminUrl: `${liveUrl(subdomain)}/admin/login`, email: order.email, planLabel };
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    console.error(`[provision] order ${order.id} failed:`, message);
    await db.order.update({ where: { id: order.id }, data: { provisionError: message.slice(0, 300) } }).catch(() => {});
    return { ok: false, message: "We couldn't set up your site automatically. Our team has been notified — please contact support and we'll fix it right away." };
  }
}

/** Super-admin only: retry provisioning a paid-but-stuck order. */
export async function retryProvisionForOrder(orderId: string, tempPassword?: string) {
  const superSession = await getSuperSession();
  if (!superSession) throw new Error("Unauthorized");

  const order = await db.order.findUnique({ where: { id: orderId } });
  if (!order) return { ok: false as const, message: "Order not found." };
  if (order.status !== "paid" && order.status !== "provisioned") {
    return { ok: false as const, message: "Only paid orders can be provisioned. Mark the order as paid first." };
  }

  if (tempPassword && tempPassword.length >= 6) {
    if (!order.passwordHash) {
      await db.order.update({ where: { id: orderId }, data: { passwordHash: await bcrypt.hash(tempPassword, 10) } });
    }
  }
  const res = await provisionForOrder(orderId);
  revalidatePath("/super/orders");
  return res;
}

/** Super-admin: mark an order paid (manual / bank transfer) then provision. */
export async function markPaidAndProvision(orderId: string) {
  const superSession = await getSuperSession();
  if (!superSession) throw new Error("Unauthorized");
  const order = await db.order.findUnique({ where: { id: orderId } });
  if (!order) return { ok: false as const, message: "Order not found." };
  if (order.status === "provisioned") return provisionForOrder(orderId);
  if (order.status === "refunded") return { ok: false as const, message: "Cannot provision a refunded order." };
  await db.order.update({
    where: { id: orderId },
    data: { status: "paid", gateway: order.gateway.startsWith("manual") ? order.gateway : "manual-super", gatewayPayId: order.gatewayPayId || `manual_${orderId.slice(-8)}` },
  });
  const res = await provisionForOrder(orderId);
  revalidatePath("/super/orders");
  return res;
}

export async function subscribe(_prev: CheckoutState, formData: FormData): Promise<CheckoutState> {
  const rl = rateLimit(`checkout:${formData.get("email")?.toString() ?? "anon"}`, 8, 15 * 60_000);
  if (!rl.ok) return { status: "error", message: `Too many attempts. Try again in ${rl.retryAfterSec}s.` };

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

  if (vertical.status !== "live") {
    if (!raw.businessName || !raw.email || !raw.phone) return { status: "error", message: "Please fill your name, email and phone." };
    await db.platformLead.create({
      data: { name: raw.businessName, email: raw.email, phone: raw.phone, company: raw.businessName, vertical: vertical.id, type: "signup", message: `Interested in ${vertical.name} — ${planLabel}` },
    });
    return { status: "enquiry", message: `Thanks! ${vertical.name} template is coming soon — we'll contact you to set it up.` };
  }

  const parsed = schema.safeParse(raw);
  if (!parsed.success) return { status: "error", message: parsed.error.issues[0]?.message ?? "Invalid input" };
  if (RESERVED.has(parsed.data.subdomain) || parsed.data.subdomain.startsWith("ai-")) return { status: "error", message: "That subdomain is reserved." };
  if (await db.tenant.findUnique({ where: { subdomain: parsed.data.subdomain } })) {
    return { status: "error", message: `"${parsed.data.subdomain}" is already taken.` };
  }

  const aiBlueprint = sanitizeAiBlueprint(formData.get("aiBlueprint")?.toString() ?? "");
  const designRaw = formData.get("design")?.toString() ?? "";
  const design = isDesignId(designRaw) ? designRaw : "";

  const couponCode = (formData.get("coupon")?.toString() ?? "").trim().toUpperCase();
  const coupon = await validateCoupon(couponCode);
  if (couponCode && !coupon.valid) return { status: "error", message: coupon.message || "Invalid coupon." };
  if (coupon.valid) amount = Math.round(amount * (1 - coupon.percentOff / 100));

  const rzpOn = await razorpayEnabled();
  if (!rzpOn && !mockPaymentsAllowed()) return { status: "error", message: "Online payments are not set up yet. Please contact us." };

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
      couponCode: coupon.valid ? coupon.code : "",
      aiBlueprint,
      design,
      kind: "new",
    },
  });
  // Coupon is redeemed ONLY after payment succeeds (see provisionForOrder / applyCouponIfAny).

  if (rzpOn) {
    try {
      const rzp = await createRazorpayOrder(amount, order.id);
      await db.order.update({ where: { id: order.id }, data: { gatewayOrderId: rzp.id } });
      return { status: "razorpay", dbOrderId: order.id, rzpOrderId: rzp.id, keyId: await razorpayKeyId(), amount, name: parsed.data.businessName, email: parsed.data.email, phone: parsed.data.phone, planLabel };
    } catch {
      return { status: "error", message: "Could not start payment. Please try again." };
    }
  }

  await db.order.update({ where: { id: order.id }, data: { status: "paid", gatewayPayId: `mock_${order.id.slice(-8)}` } });
  const res = await provisionForOrder(order.id);
  if (!res.ok) return { status: "error", message: res.message };
  return { status: "success", url: res.url, adminUrl: res.adminUrl, email: res.email, planLabel };
}

export async function verifyPayment(input: {
  dbOrderId: string;
  rzpOrderId: string;
  rzpPaymentId: string;
  signature: string;
}): Promise<CheckoutState> {
  const order = await db.order.findUnique({ where: { id: input.dbOrderId } });
  if (!order) return { status: "error", message: "Order not found." };

  // Idempotent success if already provisioned.
  if (order.status === "provisioned") {
    const res = await provisionForOrder(order.id);
    if (!res.ok) return { status: "error", message: res.message };
    return { status: "success", url: res.url, adminUrl: res.adminUrl, email: res.email, planLabel: res.planLabel };
  }

  if (order.status === "paid") {
    const res = await provisionForOrder(order.id);
    if (!res.ok) return { status: "error", message: res.message };
    return { status: "success", url: res.url, adminUrl: res.adminUrl, email: res.email, planLabel: res.planLabel };
  }

  if (order.status !== "created") {
    return { status: "error", message: "This order can no longer be paid." };
  }

  if (order.gatewayOrderId && order.gatewayOrderId !== input.rzpOrderId) {
    return { status: "error", message: "Payment order mismatch." };
  }

  if (!(await verifyRazorpaySignature(input.rzpOrderId, input.rzpPaymentId, input.signature))) {
    await db.order.updateMany({ where: { id: input.dbOrderId, status: "created" }, data: { status: "failed" } });
    return { status: "error", message: "Payment verification failed. If you were charged, contact support." };
  }

  await db.order.update({
    where: { id: input.dbOrderId },
    data: { status: "paid", gatewayPayId: input.rzpPaymentId, gatewayOrderId: input.rzpOrderId },
  });
  const res = await provisionForOrder(input.dbOrderId);
  if (!res.ok) return { status: "error", message: res.message };
  return { status: "success", url: res.url, adminUrl: res.adminUrl, email: res.email, planLabel: res.planLabel };
}

/** In-admin renew / upgrade — creates a payment for the signed-in tenant. */
export type RenewState =
  | { status: "idle" }
  | { status: "error"; message: string }
  | { status: "razorpay"; dbOrderId: string; rzpOrderId: string; keyId: string; amount: number; name: string; email: string; phone: string; planLabel: string }
  | { status: "success"; message: string; planLabel: string };

export async function renewSubscription(_prev: RenewState, formData: FormData): Promise<RenewState> {
  const authed = await getAuthedSession();
  if (!authed) return { status: "error", message: "Unauthorized" };
  if (authed.session.role !== "owner" && authed.session.role !== "admin") {
    return { status: "error", message: "Only owners/admins can renew the plan." };
  }

  const rl = rateLimit(`renew:${authed.tenant.id}`, 10, 15 * 60_000);
  if (!rl.ok) return { status: "error", message: `Too many attempts. Try again in ${rl.retryAfterSec}s.` };

  const tierId = formData.get("tier")?.toString() ?? "";
  const durationId = formData.get("duration")?.toString() ?? "";
  const cfg = await getPlatformConfig();
  const tier = resolveTier(tierId, cfg.planOverrides);
  const duration = getDuration(durationId);
  if (!tier || !duration) return { status: "error", message: "Please choose a plan and duration." };

  const planLabel = `${tier.name} · ${duration.label}`;
  let amount = priceFor(tier, duration);
  const couponCode = (formData.get("coupon")?.toString() ?? "").trim().toUpperCase();
  const coupon = await validateCoupon(couponCode);
  if (couponCode && !coupon.valid) return { status: "error", message: coupon.message || "Invalid coupon." };
  if (coupon.valid) amount = Math.round(amount * (1 - coupon.percentOff / 100));

  const owner = await db.user.findFirst({ where: { tenantId: authed.tenant.id, role: "owner" } });
  const email = owner?.email ?? authed.session.email;
  const rzpOn = await razorpayEnabled();
  if (!rzpOn && !mockPaymentsAllowed()) return { status: "error", message: "Online payments are not set up yet. Please contact us." };
  const kind = tierId !== authed.tenant.plan ? "upgrade" : "renew";

  const order = await db.order.create({
    data: {
      customerName: authed.tenant.name,
      email,
      phone: "",
      company: authed.tenant.name,
      vertical: authed.tenant.vertical,
      subdomain: authed.tenant.subdomain,
      plan: `${tier.id}-${duration.id}`,
      amount,
      gateway: rzpOn ? "razorpay" : "mock",
      status: "created",
      couponCode: coupon.valid ? coupon.code : "",
      kind,
      tenantId: authed.tenant.id,
    },
  });

  if (rzpOn) {
    try {
      const rzp = await createRazorpayOrder(amount, order.id);
      await db.order.update({ where: { id: order.id }, data: { gatewayOrderId: rzp.id } });
      return {
        status: "razorpay",
        dbOrderId: order.id,
        rzpOrderId: rzp.id,
        keyId: await razorpayKeyId(),
        amount,
        name: authed.tenant.name,
        email,
        phone: "",
        planLabel,
      };
    } catch {
      return { status: "error", message: "Could not start payment. Please try again." };
    }
  }

  await db.order.update({ where: { id: order.id }, data: { status: "paid", gatewayPayId: `mock_${order.id.slice(-8)}` } });
  const res = await provisionForOrder(order.id);
  if (!res.ok) return { status: "error", message: res.message };
  revalidatePath("/admin/billing");
  revalidatePath("/admin/settings");
  return { status: "success", message: "Plan updated successfully.", planLabel };
}
