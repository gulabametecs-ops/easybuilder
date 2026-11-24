import { DEFAULT_SHIPPING, type ShipZone, type StoreSettings, type WeightSlab } from "./store";

// Shipping quotes (pure, client-safe) + India Post pincode lookup. Used by checkout, PincodeCheck and admin.

export const INDIAN_STATES = [
  "Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chandigarh", "Chhattisgarh",
  "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir",
  "Jharkhand", "Karnataka", "Kerala", "Ladakh", "Lakshadweep", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya",
  "Mizoram", "Nagaland", "Odisha", "Puducherry", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal",
];

export type ShippingQuoteInput = { pincode: string; state?: string; subtotal: number; weightGrams: number; paymentMethod?: string };
export type ShippingQuote = {
  serviceable: boolean;
  fee: number; // delivery charge (0 = free); COD charge is separate
  codAllowed: boolean;
  codFee: number; // extra charge if the shopper picks COD (0 when COD isn't allowed)
  etaDays: [number, number]; // days from order to delivery (dispatch + transit)
  zoneName: string; // "" = store default rates
  reason?: string; // why not serviceable, or why the chosen COD isn't allowed
};

const normState = (s: string) => s.toLowerCase().replace(/&/g, "and").replace(/[^a-z]/g, "");

/** Longest pincode-prefix match wins; then the first zone listing the state. */
export function findZone(zones: ShipZone[], pincode: string, state = ""): ShipZone | null {
  let best: ShipZone | null = null;
  let bestLen = 0;
  for (const z of zones) {
    for (const p of z.pincodes) {
      const pre = p.replace(/\D/g, "");
      if (pre && pincode.startsWith(pre) && pre.length > bestLen) { best = z; bestLen = pre.length; }
    }
  }
  if (best) return best;
  const st = normState(state);
  return st ? zones.find((z) => z.states.some((s) => normState(s) === st)) ?? null : null;
}

export function matchesPincode(pincode: string, list: string[]): boolean {
  return list.some((p) => { const pre = p.replace(/\D/g, ""); return !!pre && pincode.startsWith(pre); });
}

/** Fee for the first slab that fits; heavier than every slab → the last (largest) slab's fee. */
export function slabFee(slabs: WeightSlab[], grams: number): number | null {
  if (!slabs.length) return null;
  const sorted = [...slabs].sort((a, b) => a.upToGrams - b.upToGrams);
  // ponytail: no per-kg surcharge past the last slab; add an "extra per 500 g" field if heavy orders get under-charged.
  return (sorted.find((s) => grams <= s.upToGrams) ?? sorted[sorted.length - 1]).fee;
}

/** total = subtotal + fee + (paymentMethod === "cod" ? codFee : 0) */
export function quoteShipping(settings: StoreSettings, q: ShippingQuoteInput): ShippingQuote {
  const sh = settings.shipping ?? DEFAULT_SHIPPING;
  const pin = String(q.pincode ?? "").replace(/\D/g, "");
  const no = (reason: string): ShippingQuote => ({ serviceable: false, fee: 0, codAllowed: false, codFee: 0, etaDays: [0, 0], zoneName: "", reason });
  if (!/^[1-9]\d{5}$/.test(pin)) return no("Please enter a valid 6-digit pincode.");
  if (sh.serviceArea === "local" && !matchesPincode(pin, sh.localPincodes)) return no("Sorry, we only deliver locally — this pincode is outside our delivery area.");
  const zone = findZone(sh.zones, pin, q.state);
  if (sh.serviceArea === "zones" && !zone) return no("Sorry, we don't deliver to this pincode yet.");

  const slab = slabFee(sh.weightSlabs, Math.max(0, q.weightGrams || 0));
  let fee = slab === null ? (zone ? zone.fee : settings.shippingFee) : slab + (zone?.fee ?? 0);
  const freeAbove = zone?.freeAbove || settings.freeShippingAbove;
  if (freeAbove > 0 && q.subtotal >= freeAbove) fee = 0;
  const codAllowed = settings.codEnabled && (zone ? zone.codAllowed : true);
  const dispatch = Math.max(0, sh.dispatchDays);
  const out: ShippingQuote = {
    serviceable: true,
    fee: Math.max(0, Math.round(fee)),
    codAllowed,
    codFee: codAllowed ? Math.max(0, zone ? zone.codFee : sh.codFee) : 0,
    etaDays: [dispatch + (zone?.etaMin ?? sh.etaMin), dispatch + Math.max(zone?.etaMax ?? sh.etaMax, zone?.etaMin ?? sh.etaMin)],
    zoneName: zone?.name ?? "",
  };
  if (q.paymentMethod === "cod" && !codAllowed) out.reason = "Cash on delivery isn't available for this pincode.";
  return out;
}

/** "Delivers by Thu, 28 Nov" style date for the upper ETA bound (skips nothing — couriers work most days). */
export function etaDate(days: number, from = new Date()): string {
  const d = new Date(from.getTime() + days * 86_400_000);
  return d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
}

// ─── India Post pincode lookup (server) ─────────────────────────────────────
export type PincodeInfo = { city: string; district: string; state: string };
const pinCache = new Map<string, PincodeInfo | null>();

/** City/district/state for an Indian pincode via api.postalpincode.in. Cached in memory, 4s timeout, never throws. */
export async function lookupPincode(pin: string): Promise<PincodeInfo | null> {
  const p = String(pin ?? "").replace(/\D/g, "");
  if (!/^[1-9]\d{5}$/.test(p)) return null;
  if (pinCache.has(p)) return pinCache.get(p)!;
  try {
    const res = await fetch(`https://api.postalpincode.in/pincode/${p}`, { signal: AbortSignal.timeout(4000), cache: "no-store" });
    if (!res.ok) return null; // don't cache outages
    const info = parsePostalResponse(await res.json());
    if (pinCache.size > 5000) pinCache.clear(); // ponytail: crude bound, an LRU if this ever matters
    pinCache.set(p, info);
    return info;
  } catch {
    return null;
  }
}

export function parsePostalResponse(json: unknown): PincodeInfo | null {
  const first = Array.isArray(json) ? (json[0] as { Status?: string; PostOffice?: { Block?: string; District?: string; State?: string }[] }) : null;
  const po = first?.Status === "Success" ? first.PostOffice?.[0] : undefined;
  if (!po?.State) return null;
  return { city: po.District || po.Block || "", district: po.District || "", state: po.State };
}
