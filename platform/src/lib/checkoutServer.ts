import { db } from "./db";
import { getStoreSettings } from "./storeServer";
import { catalogLines, type CatalogLineInput } from "./storeCatalog";
import { paymentMethods, priceCatalog, type CatalogLine, type OrderItem, type PaymentMethod, type StoreSettings } from "./store";
import { lookupPincode, quoteShipping, type PincodeInfo, type ShippingQuote } from "./shipping";
import { computeTotals, normCode, validateCoupon, type CouponResult, type Totals } from "./checkout";
import { parsePayments } from "./payments";
import { applyPaymentToggles, parseIntegrations } from "./integrations";

// Authoritative checkout pricing (server): DB prices → shipping quote → coupon → GST → total.
// Used by the live checkout summary and by placeStoreOrder, so both always agree.

export const last10 = (phone: string) => String(phone ?? "").replace(/\D/g, "").slice(-10);

/** The tenant's own Razorpay keys (null when not connected or switched off in Integrations). */
export async function storeRazorpayKeys(tenantId: string): Promise<{ keyId: string; keySecret: string; webhookSecret: string } | null> {
  const cfg = await db.siteConfig.findUnique({ where: { tenantId }, select: { payments: true, integrations: true } });
  const raw = parsePayments(cfg?.payments);
  const p = applyPaymentToggles(raw, parseIntegrations(cfg?.integrations));
  return p.razorpayKeyId && raw.razorpayKeySecret ? { keyId: p.razorpayKeyId, keySecret: raw.razorpayKeySecret, webhookSecret: raw.razorpayWebhookSecret } : null;
}

/** Online payment offered? Demo sandboxes always show it (simulated — no gateway call, no money). */
export async function onlineAvailable(tenantId: string, demoId: string | null): Promise<boolean> {
  return !!demoId || !!(await storeRazorpayKeys(tenantId));
}

const orderScope = (tenantId: string, demoId: string | null) => ({ tenantId, demoSessionId: demoId, status: { not: "cancelled" } });

/** Past (non-cancelled) orders by this shopper — matched by email or phone — overall and with `code`. */
export async function shopperHistory(tenantId: string, demoId: string | null, email: string, phone: string, code: string) {
  const who = [...(email ? [{ email }] : []), ...(last10(phone).length === 10 ? [{ phone: { contains: last10(phone) } }] : [])];
  if (!who.length) return null;
  const [priorOrders, customerUses] = await Promise.all([
    db.storeOrder.count({ where: { ...orderScope(tenantId, demoId), OR: who } }),
    code ? db.storeOrder.count({ where: { ...orderScope(tenantId, demoId), couponCode: code, OR: who } }) : 0,
  ]);
  return { priorOrders, customerUses };
}

export async function findCoupon(tenantId: string, demoId: string | null, code: string) {
  const c = normCode(code);
  if (!c) return null;
  return db.storeCoupon.findFirst({
    where: { tenantId, code: c, ...(demoId ? { OR: [{ demoSessionId: null }, { demoSessionId: demoId }] } : { demoSessionId: null }) },
  });
}

export type CheckoutInput = {
  lines: CatalogLineInput[];
  pincode?: string;
  state?: string;
  paymentMethod?: string;
  couponCode?: string;
  email?: string;
  phone?: string;
};

export type CheckoutCalc =
  | {
      ok: true;
      settings: StoreSettings;
      lines: CatalogLine[];
      items: OrderItem[];
      weightGrams: number;
      place: PincodeInfo | null;
      state: string;
      quote: ShippingQuote | null; // null until a 6-digit pincode is entered
      coupon: CouponResult | null; // null = no code entered
      couponId: string | null;
      totals: Totals;
      methods: PaymentMethod[];
    }
  | { ok: false; error: string; lines?: CatalogLine[] };

export async function computeCheckout(tenantId: string, demoId: string | null, input: CheckoutInput): Promise<CheckoutCalc> {
  const [settings, lines, online] = await Promise.all([
    getStoreSettings(tenantId, demoId),
    catalogLines(tenantId, input.lines, { demoSessionId: demoId }),
    onlineAvailable(tenantId, demoId),
  ]);
  const priced = priceCatalog(lines, settings); // availability, stock, min order
  if (!priced.ok) return { ok: false, error: priced.error, lines };
  const methods = paymentMethods(settings, online);
  const perUnit = settings.shipping.defaultWeightGrams || 500;
  const weightGrams = lines.reduce((n, l) => n + (l.weightGrams || perUnit) * l.qty, 0);

  const pin = String(input.pincode ?? "").replace(/\D/g, "");
  const place = /^[1-9]\d{5}$/.test(pin) ? await lookupPincode(pin) : null;
  // India Post's state wins over what the shopper typed (zones/GST depend on it).
  const state = place?.state || String(input.state ?? "").trim().slice(0, 80);
  const quote = pin.length === 6 ? quoteShipping(settings, { pincode: pin, state, subtotal: priced.subtotal, weightGrams, paymentMethod: input.paymentMethod }) : null;
  // Pincode lookup failed and we deliver by state: ask for the state instead of refusing.
  if (quote && !quote.serviceable && !place && !state && settings.shipping.serviceArea === "zones" && /^[1-9]\d{5}$/.test(pin)) quote.reason = "Please enter your state so we can check delivery.";

  let coupon: CouponResult | null = null;
  let couponId: string | null = null;
  const code = normCode(input.couponCode ?? "");
  if (code) {
    const row = await findCoupon(tenantId, demoId, code);
    const hist = row && (row.firstOrderOnly || row.perCustomerLimit > 0) ? await shopperHistory(tenantId, demoId, String(input.email ?? "").trim(), String(input.phone ?? ""), row.code) : null;
    coupon = validateCoupon(row, { subtotal: priced.subtotal, priorOrders: hist?.priorOrders ?? null, customerUses: hist?.customerUses ?? null });
    if (coupon.ok) couponId = row!.id;
  }
  const ok = coupon?.ok ? coupon : null;
  const shipping = quote?.serviceable ? (ok?.freeShip ? 0 : quote.fee) : 0;
  const codFee = quote?.serviceable && input.paymentMethod === "cod" && quote.codAllowed ? quote.codFee : 0;
  const totals = computeTotals({ lines: lines.map((l) => ({ amount: l.unitPrice * l.qty, gstRate: l.gstRate })), discount: ok?.discount ?? 0, shipping, codFee });
  return { ok: true, settings, lines, items: priced.items, weightGrams, place, state, quote, coupon, couponId, totals, methods };
}
