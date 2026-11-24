"use server";

import { randomBytes } from "node:crypto";
import { z } from "zod";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { getCurrentTenant } from "@/lib/tenant";
import { rateLimit } from "@/lib/rateLimit";
import { getActiveDemoSessionForTenant, isDemoSubdomain } from "@/lib/demoSession";
import { MAX_QTY, orderItemFrom, orderSummaryText, waLink, type PaymentMethod } from "@/lib/store";
import { decrementStock, OutOfStockError, catalogLines } from "@/lib/storeCatalog";
import { getStoreCustomer } from "@/lib/storeCustomer";
import { addTimeline, newTrackToken } from "@/lib/fulfilment";
import { computeCheckout, last10, storeRazorpayKeys } from "@/lib/checkoutServer";
import { normCode } from "@/lib/checkout";
import type { ShippingQuote } from "@/lib/shipping";
import { createRazorpayOrderWithKeys, verifyRazorpaySignatureWithSecret } from "@/lib/razorpay";
import { announceOrder, markOrderPaid, markPaymentFailed, releaseExpiredHolds } from "@/lib/storePayments";

// Public checkout for store sites. Prices, shipping, coupons, tax and stock are recomputed from the DB.

const Lines = z
  .array(z.object({ productId: z.string().min(1).max(40), variantId: z.string().max(40).nullish(), qty: z.number().int().min(1).max(MAX_QTY), options: z.record(z.string().max(60), z.string().max(80)).default({}) }))
  .min(1, "Your cart is empty.")
  .max(50);
const Token = z.string().regex(/^[\w-]{16,64}$/);
const METHODS = ["online", "cod", "upi", "whatsapp"] as const;

async function ip() {
  return (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
}

/** Tenant + its demo sandbox (null on real stores). Demo stores need a live sandbox. */
async function storeCtx() {
  const tenant = await getCurrentTenant();
  if (!tenant) return { error: "Store not found." } as const;
  const isDemo = isDemoSubdomain(tenant.subdomain);
  const demo = isDemo ? await getActiveDemoSessionForTenant(tenant) : null;
  if (isDemo && !demo) return { error: "This demo has ended." } as const;
  return { tenant, demoId: demo?.id ?? null } as const;
}

// ─── Live summary ───────────────────────────────────────────────────────────
const QuoteSchema = z.object({
  lines: Lines,
  pincode: z.string().max(10).default(""),
  state: z.string().max(80).default(""),
  paymentMethod: z.string().max(20).default(""),
  couponCode: z.string().max(40).default(""),
  email: z.string().max(200).default(""),
  phone: z.string().max(20).default(""),
});

export type CheckoutSummary = {
  ok: true;
  subtotal: number;
  discount: number;
  shipping: number;
  codFee: number;
  tax: number;
  total: number;
  quote: ShippingQuote | null;
  place: { city: string; state: string } | null;
  coupon: { code: string; label: string; freeShip: boolean } | null;
  couponError: string;
  methods: PaymentMethod[];
  minOrder: number;
};
export type QuoteResult = CheckoutSummary | { ok: false; error: string };

export async function quoteCheckout(input: z.input<typeof QuoteSchema>): Promise<QuoteResult> {
  const ctx = await storeCtx();
  if ("error" in ctx) return { ok: false, error: ctx.error! };
  if (!rateLimit(`quote:${ctx.tenant.id}:${await ip()}`, 240, 10 * 60_000).ok) return { ok: false, error: "Too many requests — please wait a minute." };
  const p = QuoteSchema.safeParse(input);
  if (!p.success) return { ok: false, error: p.error.issues[0]?.message ?? "Please check your cart." };
  const c = await computeCheckout(ctx.tenant.id, ctx.demoId, p.data);
  if (!c.ok) return { ok: false, error: c.error };
  const t = c.totals;
  return {
    ok: true, subtotal: t.subtotal, discount: t.discount, shipping: t.shipping, codFee: t.codFee, tax: t.tax, total: t.total, quote: c.quote, place: c.place ? { city: c.place.city, state: c.place.state } : null,
    coupon: c.coupon?.ok ? { code: c.coupon.code, label: c.coupon.label, freeShip: c.coupon.freeShip } : null,
    couponError: c.coupon && !c.coupon.ok ? c.coupon.error : "",
    methods: c.methods, minOrder: c.settings.minOrder,
  };
}

// ─── Place order ────────────────────────────────────────────────────────────
const OrderSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(120),
  phone: z.string().trim().regex(/^[+\d][\d\s-]{6,18}$/, "Please enter a valid phone number").refine((v) => last10(v).length === 10, "Please enter a 10-digit mobile number"),
  email: z.union([z.literal(""), z.string().trim().email("Enter a valid email").max(200)]).default(""),
  address: z.string().trim().min(5, "Please enter your house no. and street").max(500),
  addressLine2: z.string().trim().max(300).default(""),
  city: z.string().trim().min(2, "Please enter your city").max(120),
  state: z.string().trim().max(80).default(""),
  pincode: z.string().trim().regex(/^[1-9]\d{5}$/, "Pincode must be 6 digits"),
  note: z.string().trim().max(500).default(""),
  paymentMethod: z.enum(METHODS),
  couponCode: z.string().trim().max(40).default(""),
  cartToken: z.string().max(64).default(""),
  lines: Lines,
});

export type PlaceOrderInput = z.input<typeof OrderSchema>;
export type PayStart =
  | { mode: "razorpay"; keyId: string; orderId: string; amount: number; name: string; prefill: { name: string; email: string; contact: string } }
  | { mode: "demo"; amount: number };
export type PlaceOrderResult =
  | { ok: true; orderNo: number; token: string; total: number; paymentMethod: string; whatsappUrl: string; pay: PayStart | null }
  | { ok: false; error: string };

class CouponUsedUp extends Error {}

export async function placeStoreOrder(input: PlaceOrderInput): Promise<PlaceOrderResult> {
  const ctx = await storeCtx();
  if ("error" in ctx) return { ok: false, error: ctx.error! };
  const { tenant, demoId } = ctx;

  const rl = rateLimit(`order:${tenant.id}:${await ip()}`, 8, 15 * 60_000);
  if (!rl.ok) return { ok: false, error: `Too many orders. Please wait ${rl.retryAfterSec}s and try again.` };

  const parsed = OrderSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Please check your details." };
  const d = parsed.data;

  // Free stock held by abandoned online payments before pricing this one.
  await releaseExpiredHolds(tenant.id).catch(() => 0);

  const c = await computeCheckout(tenant.id, demoId, d);
  if (!c.ok) return { ok: false, error: c.error };
  if (!c.methods.includes(d.paymentMethod)) return { ok: false, error: "That payment option isn't available. Please choose another." };
  if (!c.quote?.serviceable) return { ok: false, error: c.quote?.reason ?? "Please enter a valid pincode." };
  if (d.paymentMethod === "cod" && !c.quote.codAllowed) return { ok: false, error: "Cash on delivery isn't available for this pincode. Please choose another payment option." };
  if (normCode(d.couponCode) && !c.coupon?.ok) return { ok: false, error: c.coupon && !c.coupon.ok ? c.coupon.error : "This code isn't valid." };
  const t = c.totals;
  const online = d.paymentMethod === "online";

  // Link the order to the shopper's account (signed in, else an account with the same email).
  const signedIn = await getStoreCustomer();
  if (signedIn?.blocked) return { ok: false, error: "This account can't place orders. Please contact the store." };
  const customerId = signedIn?.id
    ?? (d.email ? (await db.storeCustomer.findFirst({ where: { tenantId: tenant.id, email: d.email.toLowerCase(), ...(demoId ? { demoSessionId: demoId } : {}) }, select: { id: true } }))?.id : undefined)
    ?? null;

  // Online: open the gateway order first (authoritative amount in paise). Demo never touches Razorpay.
  let pay: PayStart | null = null;
  if (online) {
    if (demoId) pay = { mode: "demo", amount: t.total * 100 };
    else {
      const keys = await storeRazorpayKeys(tenant.id);
      if (!keys) return { ok: false, error: "Online payment isn't available right now. Please choose another option." };
      try {
        const rzp = await createRazorpayOrderWithKeys(t.total * 100, `st_${randomBytes(8).toString("hex")}`, keys.keyId, keys.keySecret, { store: tenant.subdomain });
        pay = { mode: "razorpay", keyId: keys.keyId, orderId: rzp.id, amount: t.total * 100, name: tenant.name, prefill: { name: d.name, email: d.email, contact: d.phone } };
      } catch {
        return { ok: false, error: "We couldn't start the online payment. Please try again or choose another option." };
      }
    }
  }

  const trackToken = newTrackToken();
  const placedNote = online ? "Order placed — waiting for online payment" : "Order placed";
  // Order numbers count up per store from 1001; retry if two orders race for the same number.
  let order: { id: string; orderNo: number } | null = null;
  for (let attempt = 0; attempt < 3 && !order; attempt++) {
    const last = await db.storeOrder.aggregate({ where: { tenantId: tenant.id }, _max: { orderNo: true } });
    try {
      order = await db.$transaction(async (tx) => {
        const created = await tx.storeOrder.create({
          data: {
            tenantId: tenant.id,
            orderNo: Math.max(1000, last._max.orderNo ?? 1000) + 1,
            customerName: d.name, phone: d.phone, email: d.email, address: d.address, addressLine2: d.addressLine2, city: d.city, state: c.state, pincode: d.pincode, note: d.note,
            items: JSON.stringify(c.lines.map(orderItemFrom)), subtotal: t.subtotal, shipping: t.shipping, discount: t.discount, codFee: t.codFee, tax: t.tax, total: t.total,
            couponCode: c.coupon?.ok ? c.coupon.code : "", weightGrams: c.weightGrams,
            paymentMethod: d.paymentMethod, paymentStatus: "pending", paymentRef: pay?.mode === "razorpay" ? pay.orderId : "",
            demoSessionId: demoId, customerId,
            trackToken, timeline: addTimeline("[]", "new", placedNote),
          },
          select: { id: true, orderNo: true },
        });
        // Coupon usage limit is enforced atomically with the order.
        if (c.couponId) {
          const row = await tx.storeCoupon.findUnique({ where: { id: c.couponId }, select: { usageLimit: true } });
          const r = await tx.storeCoupon.updateMany({ where: { id: c.couponId, ...(row?.usageLimit ? { used: { lt: row.usageLimit } } : {}) }, data: { used: { increment: 1 } } });
          if (!r.count) throw new CouponUsedUp("This code has just reached its usage limit. Please remove it and try again.");
        }
        // Stock goes down on real stores only — demo tenants are shared by every visitor.
        if (!demoId) await decrementStock(tx, c.lines);
        return created;
      });
    } catch (e) {
      if (e instanceof OutOfStockError || e instanceof CouponUsedUp) return { ok: false, error: e.message };
      if (attempt === 2) throw e;
    }
  }
  if (!order) return { ok: false, error: "Could not place the order. Please try again." };

  // Abandoned checkout → recovered (by this browser's cart, or the same shopper).
  const who = [...(d.cartToken ? [{ token: d.cartToken }] : []), { phone: last10(d.phone) }, ...(d.email ? [{ email: d.email }] : [])];
  await db.abandonedCart.updateMany({ where: { tenantId: tenant.id, recovered: false, demoSessionId: demoId, OR: who }, data: { recovered: true, orderId: order.id } }).catch(() => {});

  // Online orders are announced once paid (markOrderPaid); demo orders never email anyone.
  if (!online && !demoId) await announceOrder(order.id);

  const settings = c.settings;
  const summary = orderSummaryText({ bizName: tenant.name, orderNo: order.orderNo, items: c.items, ...t, paymentMethod: d.paymentMethod, customerName: d.name, phone: d.phone, address: [d.address, d.addressLine2].filter(Boolean).join(", "), city: d.city, pincode: d.pincode });
  revalidatePath("/admin/orders");
  return {
    ok: true,
    orderNo: order.orderNo,
    token: trackToken,
    total: t.total,
    paymentMethod: d.paymentMethod,
    whatsappUrl: settings.whatsappNumber ? waLink(settings.whatsappNumber, `Hi! I just placed this order:\n\n${summary}`) : "",
    pay,
  };
}

// ─── Online payment ─────────────────────────────────────────────────────────
async function orderByToken(token: string) {
  const ctx = await storeCtx();
  if ("error" in ctx) return { error: ctx.error! } as const;
  if (!Token.safeParse(token).success) return { error: "Order not found." } as const;
  const o = await db.storeOrder.findFirst({ where: { tenantId: ctx.tenant.id, trackToken: token } });
  if (!o) return { error: "Order not found." } as const;
  return { ctx, o } as const;
}

/** Razorpay Checkout success callback: verify the signature, then mark paid. */
export async function confirmStorePayment(input: { token: string; razorpayOrderId: string; razorpayPaymentId: string; signature: string }): Promise<{ ok: true } | { ok: false; error: string }> {
  const r = await orderByToken(input.token);
  if ("error" in r) return { ok: false, error: r.error! };
  const { o } = r;
  if (o.paymentMethod !== "online" || !o.paymentRef || o.paymentRef !== input.razorpayOrderId) return { ok: false, error: "Payment doesn't match this order." };
  const keys = await storeRazorpayKeys(o.tenantId);
  if (!keys || !verifyRazorpaySignatureWithSecret(input.razorpayOrderId, String(input.razorpayPaymentId ?? ""), String(input.signature ?? ""), keys.keySecret)) {
    return { ok: false, error: "We couldn't verify this payment. If money was deducted, it will be confirmed automatically or refunded." };
  }
  const res = await markOrderPaid(o.id, { paymentId: input.razorpayPaymentId, paymentRef: input.razorpayOrderId, source: "checkout" });
  revalidatePath("/admin/orders");
  return res.ok ? { ok: true } : res;
}

/** Re-open payment for an unpaid online order (Razorpay orders accept several attempts). */
export async function resumeStorePayment(token: string): Promise<{ ok: true; pay: PayStart } | { ok: false; error: string }> {
  const r = await orderByToken(token);
  if ("error" in r) return { ok: false, error: r.error! };
  const { o, ctx } = r;
  if (o.paymentMethod !== "online") return { ok: false, error: "This order isn't an online payment." };
  if (o.paymentStatus === "paid" || o.paymentStatus === "refunded") return { ok: false, error: "This order is already paid." };
  if (o.status === "cancelled") return { ok: false, error: "This order expired because payment wasn't completed. Please place it again." };
  if (o.demoSessionId) return { ok: true, pay: { mode: "demo", amount: o.total * 100 } };
  const keys = await storeRazorpayKeys(o.tenantId);
  if (!keys || !o.paymentRef) return { ok: false, error: "Online payment isn't available right now. Please contact the store." };
  return { ok: true, pay: { mode: "razorpay", keyId: keys.keyId, orderId: o.paymentRef, amount: o.total * 100, name: ctx.tenant.name, prefill: { name: o.customerName, email: o.email, contact: o.phone } } };
}

/** Checkout modal reported a failed attempt (informational; can only move pending → failed). */
export async function reportPaymentFailed(token: string, reason: string): Promise<void> {
  const r = await orderByToken(token);
  if ("error" in r || r.o.paymentMethod !== "online") return;
  if (!rateLimit(`payfail:${r.o.id}`, 10, 10 * 60_000).ok) return;
  await markPaymentFailed(r.o.id, `Payment attempt failed: ${String(reason ?? "").slice(0, 160)}`);
}

/** Demo sandboxes only: simulated payment result (no gateway, no money). */
export async function simulateDemoPayment(token: string, success: boolean): Promise<{ ok: true } | { ok: false; error: string }> {
  const r = await orderByToken(token);
  if ("error" in r) return { ok: false, error: r.error! };
  if (!r.ctx.demoId || r.o.demoSessionId !== r.ctx.demoId) return { ok: false, error: "Simulated payments are only available in the demo." };
  if (success) {
    const res = await markOrderPaid(r.o.id, { paymentId: `pay_DEMO${randomBytes(5).toString("hex")}`, source: "demo simulation" });
    return res.ok ? { ok: true } : res;
  }
  await markPaymentFailed(r.o.id, "Payment failed (demo simulation)");
  return { ok: true };
}

// ─── Abandoned checkouts ────────────────────────────────────────────────────
const DraftSchema = z.object({
  token: Token,
  name: z.string().trim().max(120).default(""),
  phone: z.string().trim().max(20).default(""),
  email: z.string().trim().max(200).default(""),
  lines: Lines,
});

/** Called (debounced) once the shopper has typed a phone or email at checkout. */
export async function saveCheckoutDraft(input: z.input<typeof DraftSchema>): Promise<void> {
  const ctx = await storeCtx();
  if ("error" in ctx) return;
  const p = DraftSchema.safeParse(input);
  if (!p.success) return;
  const d = p.data;
  const phone = last10(d.phone);
  const email = z.string().email().safeParse(d.email).success ? d.email.toLowerCase() : "";
  if (phone.length !== 10 && !email) return;
  if (!rateLimit(`draft:${ctx.tenant.id}:${await ip()}`, 40, 10 * 60_000).ok) return;
  const lines = (await catalogLines(ctx.tenant.id, d.lines, { demoSessionId: ctx.demoId })).filter((l) => l.productId && l.name);
  if (!lines.length) return;
  const items = JSON.stringify(lines.map(orderItemFrom));
  const subtotal = lines.reduce((n, l) => n + l.unitPrice * l.qty, 0);
  const data = { name: d.name, phone: phone.length === 10 ? phone : "", email, items, subtotal };
  const existing = await db.abandonedCart.findUnique({ where: { tenantId_token: { tenantId: ctx.tenant.id, token: d.token } }, select: { recovered: true, demoSessionId: true } });
  if (existing?.recovered || (existing && existing.demoSessionId !== ctx.demoId)) return;
  await db.abandonedCart.upsert({
    where: { tenantId_token: { tenantId: ctx.tenant.id, token: d.token } },
    update: data,
    create: { tenantId: ctx.tenant.id, token: d.token, demoSessionId: ctx.demoId, ...data },
  });
}
