// Online store (e-commerce sectors): shared by admin, storefront, templates and AI. Client-safe (no DB imports).

/** Sectors that get the store admin (Products / Orders / Customers) and storefront cart. */
export const STORE_VERTICALS = [
  "fashion-store",
  "grocery-store",
  "electronics-store",
  "gifts-store",
  "beauty-store",
  "home-decor-store",
  "online-store",
];

export function isStoreVertical(vertical: string | null | undefined): boolean {
  return !!vertical && STORE_VERTICALS.includes(vertical);
}

// ─── Products ────────────────────────────────────────────────────────────────
export type ProductOption = { name: string; values: string[] };

/** One Size × Colour combination. `price`/`mrp` 0 = use the product's. */
export type PublicVariant = {
  id: string;
  title: string;
  options: Record<string, string>;
  sku: string;
  price: number;
  mrp: number;
  stock: number;
  image: string;
};

export type PublicProduct = {
  id: string;
  slug: string;
  name: string;
  category: string;
  price: number;
  mrp: number;
  images: string[];
  description: string;
  stock: number;
  options: ProductOption[];
  badge: string;
  featured: boolean;
  sku: string;
  tags: string[];
  weightGrams: number;
  hsn: string;
  gstRate: number;
  trackStock: boolean;
  allowBackorder: boolean;
  seoTitle: string;
  seoDescription: string;
  /** Empty for products without options (or older products whose options have no variant rows yet). */
  variants: PublicVariant[];
  /** Approved reviews: average (0 when none) and count. */
  rating: number;
  reviewCount: number;
};

type VariantRow = { id: string; title: string; options: string; sku: string; price: number; mrp: number; stock: number; image: string };
type ProductRow = Pick<PublicProduct, "id" | "slug" | "name" | "category" | "price" | "mrp" | "description" | "stock" | "badge" | "featured"> & {
  images: string;
  options: string;
} & Partial<Pick<PublicProduct, "sku" | "weightGrams" | "hsn" | "gstRate" | "trackStock" | "allowBackorder" | "seoTitle" | "seoDescription">> & {
  tags?: string;
  variants?: VariantRow[];
};

export function jsonList<T>(raw: string): T[] {
  try {
    const v = JSON.parse(raw || "[]");
    return Array.isArray(v) ? (v as T[]) : [];
  } catch {
    return [];
  }
}

function jsonRecord(raw: string): Record<string, string> {
  try {
    const v = JSON.parse(raw || "{}");
    return v && typeof v === "object" && !Array.isArray(v) ? (v as Record<string, string>) : {};
  } catch {
    return {};
  }
}

export function mapProduct(r: ProductRow, reviews?: { rating: number; count: number }): PublicProduct {
  return {
    id: r.id,
    slug: r.slug,
    name: r.name,
    category: r.category,
    price: r.price,
    mrp: r.mrp,
    images: jsonList<string>(r.images).filter((x) => typeof x === "string" && x),
    description: r.description,
    stock: r.stock,
    options: jsonList<ProductOption>(r.options).filter((o) => o && o.name && Array.isArray(o.values) && o.values.length),
    badge: r.badge,
    featured: r.featured,
    sku: r.sku ?? "",
    tags: jsonList<string>(r.tags ?? "[]").filter((x) => typeof x === "string" && x),
    weightGrams: r.weightGrams ?? 0,
    hsn: r.hsn ?? "",
    gstRate: r.gstRate ?? 0,
    trackStock: r.trackStock ?? true,
    allowBackorder: r.allowBackorder ?? false,
    seoTitle: r.seoTitle ?? "",
    seoDescription: r.seoDescription ?? "",
    variants: (r.variants ?? []).map((v) => ({ id: v.id, title: v.title, options: jsonRecord(v.options), sku: v.sku, price: v.price, mrp: v.mrp, stock: v.stock, image: v.image })),
    rating: reviews?.count ? Math.round(reviews.rating * 10) / 10 : 0,
    reviewCount: reviews?.count ?? 0,
  };
}

// ─── Variants ────────────────────────────────────────────────────────────────
export type VariantDraft = Omit<PublicVariant, "id"> & { id?: string };

export const variantTitle = (options: Record<string, string>) => Object.values(options).join(" / ");

/**
 * Every combination of the option values (Size × Colour …), in option order. Existing variants
 * with the same combination keep their id/price/stock/SKU/image.
 */
export function variantMatrix(options: ProductOption[], existing: VariantDraft[] = []): VariantDraft[] {
  const opts = options.filter((o) => o.name.trim() && o.values.length);
  if (!opts.length) return [];
  let combos: Record<string, string>[] = [{}];
  for (const o of opts) combos = combos.flatMap((c) => [...new Set(o.values)].map((v) => ({ ...c, [o.name]: v })));
  return combos.map((options) => {
    const prev = existing.find((e) => sameOptions(e.options, options));
    return prev ? { ...prev, options, title: variantTitle(options) } : { options, title: variantTitle(options), sku: "", price: 0, mrp: 0, stock: 0, image: "" };
  });
}

function sameOptions(a: Record<string, string>, b: Record<string, string>) {
  const ka = Object.keys(a);
  return ka.length === Object.keys(b).length && ka.every((k) => a[k] === b[k]);
}

export function findVariant(p: Pick<PublicProduct, "variants">, options: Record<string, string>): PublicVariant | undefined {
  return p.variants.find((v) => sameOptions(v.options, options));
}

/** Effective price/MRP/stock/image of a product, or of one of its variants. */
export function variantView(p: PublicProduct, v?: PublicVariant | null) {
  if (!v) return { price: p.price, mrp: p.mrp, stock: p.stock, image: p.images[0] ?? "", sku: p.sku };
  return { price: v.price || p.price, mrp: v.mrp || (v.price ? 0 : p.mrp), stock: v.stock, image: v.image || p.images[0] || "", sku: v.sku || p.sku };
}

/** Units a shopper may buy (stock, unless stock isn't tracked or backorders are allowed). */
export function maxBuyable(p: Pick<PublicProduct, "trackStock" | "allowBackorder">, stock: number): number {
  return !p.trackStock || p.allowBackorder ? MAX_QTY : Math.max(0, Math.min(MAX_QTY, stock));
}

/** Total sellable stock shown in lists: sum of variants when the product has them. */
export const totalStock = (p: Pick<PublicProduct, "stock" | "variants">) => (p.variants.length ? p.variants.reduce((n, v) => n + Math.max(0, v.stock), 0) : p.stock);

/** Sold out = nothing buyable in any variant. */
export function isSoldOut(p: PublicProduct): boolean {
  if (!p.trackStock || p.allowBackorder) return false;
  return totalStock(p) <= 0;
}

/** Lowest effective price across variants ("From ₹499"). */
export function fromPrice(p: PublicProduct): number {
  return p.variants.length ? Math.min(...p.variants.map((v) => v.price || p.price)) : p.price;
}

export const productHref = (slug: string) => `/product/${slug}`;

export function inr(n: number): string {
  return `₹${Math.round(n).toLocaleString("en-IN")}`;
}

/** % off MRP, 0 when there's no real discount. */
export function discountPct(p: { price: number; mrp: number }): number {
  return p.mrp > p.price && p.price > 0 ? Math.round(((p.mrp - p.price) / p.mrp) * 100) : 0;
}

export function slugifyProduct(input: string): string {
  return input.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80) || "product";
}

// ─── Store settings (SiteConfig.store JSON) ──────────────────────────────────
export type StoreSettings = {
  shippingFee: number; // INR per order
  freeShippingAbove: number; // INR; 0 = never free
  minOrder: number; // INR; 0 = none
  codEnabled: boolean;
  upiEnabled: boolean;
  upiId: string;
  upiQrImage: string;
  whatsappEnabled: boolean;
  whatsappNumber: string; // digits, with country code (91…)
  checkoutNote: string; // shown above the checkout button (delivery time, returns…)
  lowStockAt: number; // dashboard "low stock" threshold
  shipping: ShippingSettings; // zones, slabs, ETA, pickup, invoice (see lib/shipping.ts)
};

// Shipping & delivery (Admin → Shipping). Courier credentials are NOT here — they live under the
// server-only `courier` key of the same JSON, which parseStoreSettings strips (see lib/couriers.ts).
export type ShipZone = {
  id: string;
  name: string;
  states: string[]; // buyer state names (case-insensitive)
  pincodes: string[]; // pincode prefixes ("110", "4000") or full pincodes; beats a state match
  fee: number; // replaces the default delivery fee; with weight slabs it's added on top of the slab fee
  freeAbove: number; // 0 = use the store's "free delivery above"
  codAllowed: boolean;
  codFee: number;
  etaMin: number; // transit days (after dispatch)
  etaMax: number;
};
export type WeightSlab = { upToGrams: number; fee: number };
export type PickupAddress = { name: string; phone: string; email: string; address: string; city: string; state: string; pincode: string };
export type ShippingSettings = {
  serviceArea: "india" | "zones" | "local"; // everywhere · only listed zones · only local pincodes
  localPincodes: string[];
  weightSlabs: WeightSlab[]; // empty = flat fee
  codFee: number; // default COD charge
  dispatchDays: number; // processing time before handing to the courier
  etaMin: number; // default transit days
  etaMax: number;
  zones: ShipZone[];
  defaultWeightGrams: number; // per unit when a product has no weight
  returnWindowDays: number; // 0 = no returns from the track page
  pickup: PickupAddress; // seller / warehouse address (couriers + invoice)
  gstin: string;
  legalName: string;
  invoicePrefix: string;
};

export const DEFAULT_SHIPPING: ShippingSettings = {
  serviceArea: "india",
  localPincodes: [],
  weightSlabs: [],
  codFee: 0,
  dispatchDays: 1,
  etaMin: 2,
  etaMax: 5,
  zones: [],
  defaultWeightGrams: 500,
  returnWindowDays: 7,
  pickup: { name: "", phone: "", email: "", address: "", city: "", state: "", pincode: "" },
  gstin: "",
  legalName: "",
  invoicePrefix: "INV-",
};

export const DEFAULT_STORE: StoreSettings = {
  shippingFee: 49,
  freeShippingAbove: 499,
  minOrder: 0,
  codEnabled: true,
  upiEnabled: true,
  upiId: "",
  upiQrImage: "",
  whatsappEnabled: true,
  whatsappNumber: "",
  checkoutNote: "Delivery in 2–5 working days. Easy 7-day returns on unused items.",
  lowStockAt: 5,
  shipping: DEFAULT_SHIPPING,
};

export function parseStoreSettings(raw: string | null | undefined): StoreSettings {
  try {
    // `courier` holds partner secrets — never part of StoreSettings (this object reaches the browser).
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { courier, ...v } = JSON.parse(raw || "{}") as Partial<StoreSettings> & { courier?: unknown };
    const sh = { ...DEFAULT_SHIPPING, ...v.shipping };
    return { ...DEFAULT_STORE, ...v, shipping: { ...sh, pickup: { ...DEFAULT_SHIPPING.pickup, ...sh.pickup } } };
  } catch {
    return { ...DEFAULT_STORE };
  }
}

export type PaymentMethod = "cod" | "upi" | "whatsapp";

/** Methods the shopper can pick, given the settings (UPI needs an id, WhatsApp a number). */
export function paymentMethods(s: StoreSettings): PaymentMethod[] {
  const out: PaymentMethod[] = [];
  if (s.codEnabled) out.push("cod");
  if (s.upiEnabled && s.upiId.trim()) out.push("upi");
  if (s.whatsappEnabled && waDigits(s.whatsappNumber)) out.push("whatsapp");
  return out.length ? out : ["cod"];
}

export const PAYMENT_LABEL: Record<string, string> = {
  cod: "Cash on delivery",
  upi: "UPI",
  whatsapp: "WhatsApp order",
  online: "Online",
};

// ─── Orders ──────────────────────────────────────────────────────────────────
export const ORDER_STATUSES = [
  { id: "new", label: "New" },
  { id: "confirmed", label: "Confirmed" },
  { id: "packed", label: "Packed" },
  { id: "shipped", label: "Shipped" },
  { id: "delivered", label: "Delivered" },
  { id: "cancelled", label: "Cancelled" },
] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number]["id"];

export const orderLabel = (n: number) => `#${n}`;

export type CartLine = { productId: string; variantId?: string | null; qty: number; options: Record<string, string> };
export type OrderItem = {
  productId: string;
  variantId?: string | null;
  slug: string;
  name: string;
  price: number;
  qty: number;
  options: Record<string, string>;
  image: string;
  sku?: string;
};

export const MAX_QTY = 20;

/** Authoritative cart line, priced from the DB (see lib/storeCatalog.ts). */
export type CatalogLine = {
  productId: string;
  variantId: string | null;
  slug: string;
  name: string;
  variantTitle: string;
  options: Record<string, string>;
  unitPrice: number;
  mrp: number;
  qty: number;
  image: string;
  sku: string;
  weightGrams: number;
  gstRate: number;
  hsn: string;
  /** False when the product is gone/unpublished, options are missing, the qty is invalid or stock is short. */
  available: boolean;
  /** Units this line can have (stock left after earlier lines of the same product/variant), capped at MAX_QTY. */
  maxQty: number;
  /** Shopper-facing reason when !available. */
  error: string;
  /** Whether stock is decremented for this line (trackStock). */
  trackStock: boolean;
  allowBackorder: boolean;
};

/**
 * Resolve cart lines against DB products (pure). Products with variant rows need a variant
 * (by variantId, else by options); products with options but no variant rows validate the options
 * and use product stock. Stock is shared across lines of the same product/variant.
 */
export function resolveCartLines(lines: CartLine[], products: PublicProduct[]): CatalogLine[] {
  const byId = new Map(products.map((p) => [p.id, p]));
  const used = new Map<string, number>();
  return lines.map((l) => {
    const qty = Math.floor(Number(l.qty) || 0);
    const p = byId.get(l.productId);
    if (!p) {
      return {
        productId: l.productId, variantId: l.variantId ?? null, slug: "", name: "", variantTitle: "", options: l.options ?? {}, unitPrice: 0, mrp: 0, qty, image: "",
        sku: "", weightGrams: 0, gstRate: 0, hsn: "", available: false, maxQty: 0, error: "An item in your cart is no longer available. Please remove it and try again.",
        trackStock: false, allowBackorder: false,
      };
    }
    let error = "";
    let variant: PublicVariant | undefined;
    const options: Record<string, string> = {};
    if (p.variants.length) {
      variant = (l.variantId && p.variants.find((v) => v.id === l.variantId)) || findVariant(p, l.options ?? {});
      if (variant) Object.assign(options, variant.options);
      else error = `Please choose ${p.options.map((o) => o.name).join(" / ") || "an option"} for ${p.name}.`;
    } else {
      for (const o of p.options) {
        const v = l.options?.[o.name];
        if (!v || !o.values.includes(v)) {
          error ||= `Please choose ${o.name} for ${p.name}.`;
          continue;
        }
        options[o.name] = v;
      }
    }
    const view = variantView(p, variant);
    const key = variant?.id ?? p.id;
    const left = maxBuyable(p, view.stock - (used.get(key) ?? 0));
    const maxQty = !p.trackStock || p.allowBackorder ? MAX_QTY : left;
    if (!error && !(qty >= 1 && qty <= MAX_QTY)) error = `Quantity for ${p.name} must be 1–${MAX_QTY}.`;
    if (!error && qty > maxQty) error = maxQty > 0 ? `Only ${maxQty} left of ${p.name}${variant ? ` (${variant.title})` : ""}.` : `${p.name}${variant ? ` (${variant.title})` : ""} is out of stock.`;
    if (!error) used.set(key, (used.get(key) ?? 0) + qty);
    return {
      productId: p.id, variantId: variant?.id ?? null, slug: p.slug, name: p.name, variantTitle: variant?.title ?? "", options,
      unitPrice: view.price, mrp: view.mrp, qty, image: view.image, sku: view.sku, weightGrams: p.weightGrams, gstRate: p.gstRate, hsn: p.hsn,
      available: !error, maxQty, error, trackStock: p.trackStock, allowBackorder: p.allowBackorder,
    };
  });
}

/** Order snapshot of an authoritative line (what StoreOrder.items stores). */
export const orderItemFrom = (l: CatalogLine): OrderItem => ({
  productId: l.productId, variantId: l.variantId, slug: l.slug, name: l.name, price: l.unitPrice, qty: l.qty, options: l.options, image: l.image, sku: l.sku,
});

/**
 * Price a cart from DB products — never from client prices. Checks published/stock/options/variants.
 * `products` must already be scoped to the tenant (and demo visibility).
 */
export function priceOrder(
  lines: CartLine[],
  products: PublicProduct[],
  s: StoreSettings,
): PricedOrder {
  return priceCatalog(resolveCartLines(lines, products), s);
}

export type PricedOrder = { ok: true; items: OrderItem[]; lines: CatalogLine[]; subtotal: number; shipping: number; total: number } | { ok: false; error: string };

/** Totals for already-resolved lines (from lib/storeCatalog catalogLines). */
export function priceCatalog(resolved: CatalogLine[], s: StoreSettings): PricedOrder {
  if (!resolved.length) return { ok: false, error: "Your cart is empty." };
  const bad = resolved.find((l) => !l.available);
  if (bad) return { ok: false, error: bad.error };
  const items = resolved.map(orderItemFrom);
  const subtotal = items.reduce((n, i) => n + i.price * i.qty, 0);
  if (s.minOrder > 0 && subtotal < s.minOrder) return { ok: false, error: `Minimum order is ${inr(s.minOrder)}.` };
  const shipping = shippingFor(subtotal, s);
  return { ok: true, items, lines: resolved, subtotal, shipping, total: subtotal + shipping };
}

export function shippingFor(subtotal: number, s: StoreSettings): number {
  if (s.freeShippingAbove > 0 && subtotal >= s.freeShippingAbove) return 0;
  return Math.max(0, s.shippingFee);
}

export function optionText(options: Record<string, string>): string {
  return Object.entries(options).map(([k, v]) => `${k}: ${v}`).join(", ");
}

// ─── WhatsApp / UPI helpers ──────────────────────────────────────────────────
export function waDigits(num: string): string {
  const d = (num || "").replace(/\D/g, "");
  if (d.length === 10) return `91${d}`;
  return d.length >= 11 ? d : "";
}

export function waLink(num: string, text: string): string {
  const d = waDigits(num);
  return `https://wa.me/${d}?text=${encodeURIComponent(text)}`;
}

export function orderSummaryText(o: {
  bizName: string;
  orderNo: number;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  paymentMethod: string;
  customerName: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
}): string {
  const lines = o.items.map((i) => `• ${i.name}${Object.keys(i.options).length ? ` (${optionText(i.options)})` : ""} × ${i.qty} = ${inr(i.price * i.qty)}`);
  return [
    `Order ${orderLabel(o.orderNo)} — ${o.bizName}`,
    ...lines,
    `Subtotal: ${inr(o.subtotal)}`,
    `Delivery: ${o.shipping ? inr(o.shipping) : "Free"}`,
    `Total: ${inr(o.total)} (${PAYMENT_LABEL[o.paymentMethod] ?? o.paymentMethod})`,
    "",
    `${o.customerName} · ${o.phone}`,
    [o.address, o.city, o.pincode].filter(Boolean).join(", "),
  ].join("\n");
}
