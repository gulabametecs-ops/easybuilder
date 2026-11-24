// Checkout maths (pure, client-safe): coupon rules, discount allocation, GST split, order totals.
// The server recomputes all of this from the DB (lib/checkoutServer.ts) — never trust browser amounts.

export type CouponType = "percent" | "flat" | "freeship";

export type CouponLike = {
  code: string;
  type: string;
  value: number;
  minOrder: number;
  maxDiscount: number;
  startsAt: Date | null;
  endsAt: Date | null;
  usageLimit: number;
  perCustomerLimit: number;
  used: number;
  firstOrderOnly: boolean;
  active: boolean;
};

export type CouponContext = {
  subtotal: number;
  now?: Date;
  /** Non-cancelled orders by this shopper (email/phone) that used this code; null = shopper unknown yet. */
  customerUses?: number | null;
  /** Non-cancelled orders by this shopper (any code); null = shopper unknown yet. */
  priorOrders?: number | null;
};

export type CouponResult = { ok: true; code: string; discount: number; freeShip: boolean; label: string } | { ok: false; error: string };

export const normCode = (code: string) => String(code ?? "").trim().toUpperCase().replace(/\s+/g, "").slice(0, 40);

const inr = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;

export function couponLabel(c: Pick<CouponLike, "type" | "value" | "maxDiscount">): string {
  if (c.type === "freeship") return "Free delivery";
  if (c.type === "flat") return `${inr(c.value)} off`;
  return `${c.value}% off${c.maxDiscount > 0 ? ` (up to ${inr(c.maxDiscount)})` : ""}`;
}

/** Is this coupon usable for this cart/shopper? Discount is on the item subtotal (never below 0). */
export function validateCoupon(c: CouponLike | null | undefined, ctx: CouponContext): CouponResult {
  if (!c || !c.active) return { ok: false, error: "This code isn't valid." };
  const now = ctx.now ?? new Date();
  if (c.startsAt && now < c.startsAt) return { ok: false, error: "This code isn't active yet." };
  if (c.endsAt && now > c.endsAt) return { ok: false, error: "This code has expired." };
  if (c.usageLimit > 0 && c.used >= c.usageLimit) return { ok: false, error: "This code has reached its usage limit." };
  if (c.minOrder > 0 && ctx.subtotal < c.minOrder) return { ok: false, error: `Add ${inr(c.minOrder - ctx.subtotal)} more to use ${c.code} (min. order ${inr(c.minOrder)}).` };
  if (c.firstOrderOnly && (ctx.priorOrders ?? 0) > 0) return { ok: false, error: "This code is only for your first order." };
  if (c.perCustomerLimit > 0 && (ctx.customerUses ?? 0) >= c.perCustomerLimit) return { ok: false, error: c.perCustomerLimit === 1 ? "You've already used this code." : `You've already used this code ${c.perCustomerLimit} times.` };
  const label = couponLabel(c);
  if (c.type === "freeship") return { ok: true, code: c.code, discount: 0, freeShip: true, label };
  let discount = c.type === "flat" ? c.value : Math.floor((ctx.subtotal * Math.min(100, Math.max(0, c.value))) / 100);
  if (c.type === "percent" && c.maxDiscount > 0) discount = Math.min(discount, c.maxDiscount);
  discount = Math.max(0, Math.min(Math.round(discount), ctx.subtotal));
  if (discount <= 0) return { ok: false, error: "This code doesn't apply to your cart." };
  return { ok: true, code: c.code, discount, freeShip: false, label };
}

/**
 * Split `discount` across `amounts` in proportion, in whole rupees, summing exactly to the discount
 * (largest-remainder). Used for GST (tax on the discounted price) and the invoice.
 */
export function allocateDiscount(amounts: number[], discount: number): number[] {
  const total = amounts.reduce((a, b) => a + b, 0);
  const d = Math.max(0, Math.min(Math.round(discount), total));
  if (!d || !total) return amounts.map(() => 0);
  const raw = amounts.map((a) => (a * d) / total);
  const out = raw.map(Math.floor);
  let left = d - out.reduce((a, b) => a + b, 0);
  const order = raw.map((r, i) => [r - Math.floor(r), i] as const).sort((a, b) => b[0] - a[0]);
  for (const [, i] of order) {
    if (left <= 0) break;
    out[i] += 1;
    left -= 1;
  }
  return out;
}

/** GST included in a tax-inclusive amount at `rate`% (unrounded). */
export const includedGst = (amount: number, rate: number) => (rate > 0 ? (amount * rate) / (100 + rate) : 0);

export type TotalsInput = {
  lines: { amount: number; gstRate: number }[]; // amount = unit price × qty (GST inclusive)
  discount: number;
  shipping: number;
  codFee: number;
};
export type Totals = { subtotal: number; discount: number; shipping: number; codFee: number; tax: number; total: number; lineTax: number[] };

/**
 * total = subtotal − discount + shipping + COD fee. Prices are GST-inclusive: tax per line is on the
 * line amount after its share of the discount; delivery/COD charges carry the highest item rate
 * (same rule as the invoice). `tax` is informational (already inside the total), rounded to ₹.
 */
export function computeTotals(t: TotalsInput): Totals {
  const amounts = t.lines.map((l) => Math.max(0, Math.round(l.amount)));
  const subtotal = amounts.reduce((a, b) => a + b, 0);
  const discount = Math.max(0, Math.min(Math.round(t.discount), subtotal));
  const shipping = Math.max(0, Math.round(t.shipping));
  const codFee = Math.max(0, Math.round(t.codFee));
  const alloc = allocateDiscount(amounts, discount);
  const lineTax = t.lines.map((l, i) => includedGst(amounts[i] - alloc[i], l.gstRate));
  const maxRate = Math.max(0, ...t.lines.map((l) => l.gstRate));
  const tax = Math.round(lineTax.reduce((a, b) => a + b, 0) + includedGst(shipping + codFee, maxRate));
  return { subtotal, discount, shipping, codFee, tax, total: subtotal - discount + shipping + codFee, lineTax };
}

/** A short, readable random code ("SAVE-7KQ2"). */
export function generateCode(prefix = ""): string {
  const abc = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < 6; i++) s += abc[Math.floor(Math.random() * abc.length)];
  return normCode(prefix ? `${prefix}${s}` : s);
}

/** Payment hold for online orders: unpaid after this many minutes → cancelled + stock released. */
export const PAYMENT_HOLD_MINUTES = 30;
