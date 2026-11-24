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
};

type ProductRow = Omit<PublicProduct, "images" | "options"> & { images: string; options: string };

function jsonList<T>(raw: string): T[] {
  try {
    const v = JSON.parse(raw || "[]");
    return Array.isArray(v) ? (v as T[]) : [];
  } catch {
    return [];
  }
}

export function mapProduct(r: ProductRow): PublicProduct {
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
  };
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
};

export function parseStoreSettings(raw: string | null | undefined): StoreSettings {
  try {
    return { ...DEFAULT_STORE, ...(JSON.parse(raw || "{}") as Partial<StoreSettings>) };
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

export type CartLine = { productId: string; qty: number; options: Record<string, string> };
export type OrderItem = { productId: string; slug: string; name: string; price: number; qty: number; options: Record<string, string>; image: string };

export const MAX_QTY = 20;

/**
 * Price a cart from DB products — never from client prices. Checks published/stock/options.
 * `products` must already be scoped to the tenant (and demo visibility).
 */
export function priceOrder(
  lines: CartLine[],
  products: PublicProduct[],
  s: StoreSettings,
): { ok: true; items: OrderItem[]; subtotal: number; shipping: number; total: number } | { ok: false; error: string } {
  if (!lines.length) return { ok: false, error: "Your cart is empty." };
  const byId = new Map(products.map((p) => [p.id, p]));
  const items: OrderItem[] = [];
  const qtyById = new Map<string, number>();
  for (const l of lines) {
    const p = byId.get(l.productId);
    if (!p) return { ok: false, error: "An item in your cart is no longer available. Please remove it and try again." };
    const qty = Math.floor(l.qty);
    if (!(qty >= 1 && qty <= MAX_QTY)) return { ok: false, error: `Quantity for ${p.name} must be 1–${MAX_QTY}.` };
    const options: Record<string, string> = {};
    for (const o of p.options) {
      const v = l.options?.[o.name];
      if (!v || !o.values.includes(v)) return { ok: false, error: `Please choose ${o.name} for ${p.name}.` };
      options[o.name] = v;
    }
    const total = (qtyById.get(p.id) ?? 0) + qty;
    if (total > p.stock) return { ok: false, error: p.stock > 0 ? `Only ${p.stock} left of ${p.name}.` : `${p.name} is out of stock.` };
    qtyById.set(p.id, total);
    items.push({ productId: p.id, slug: p.slug, name: p.name, price: p.price, qty, options, image: p.images[0] ?? "" });
  }
  const subtotal = items.reduce((n, i) => n + i.price * i.qty, 0);
  if (s.minOrder > 0 && subtotal < s.minOrder) return { ok: false, error: `Minimum order is ${inr(s.minOrder)}.` };
  const shipping = shippingFor(subtotal, s);
  return { ok: true, items, subtotal, shipping, total: subtotal + shipping };
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
