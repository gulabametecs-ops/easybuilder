import type { WebsiteBlueprint } from "./blueprintSchema";

// Client-safe (SubscribeFlow imports inferVerticalId) — no template imports here; sample
// products for a catalogue the AI left empty are added server-side (publicPlan).
//
// Does the visitor want an ONLINE STORE (sell products, cart, checkout) or a services/info site?
// Plain "shop"/"store" isn't enough — a barber shop, coffee shop or medical store is a service
// business. We need an e-commerce signal (online selling, cart, COD, e-commerce…).

const STRONG: RegExp[] = [
  /\be-?\s?commerce\b/,
  /\bonline\s+(store|shop|shopping|boutique|dukaan|dukan|business of selling|sales?)\b/,
  /\b(web\s?store|webshop|d2c|shopify|woocommerce)\b/,
  /\b(add to cart|shopping cart|cart|checkout|cash on delivery|cod orders?)\b/,
  /\b(sell|selling|sells)\b[^.\n]{0,60}\b(online|on (my|our|the) (website|site))\b/,
  /\bonline\b[^.\n]{0,40}\b(sell|selling|bechna|bechne|bechte|bikri)\b/,
  /\b(products?|items?|saman|maal)\b[^.\n]{0,40}\b(online\s+(order|bech\w*|sell\w*|khareed\w*)|bechna|bechne|ghar baithe)\b/,
  /\b(buy|order)\s+(products?|online)\b[^.\n]{0,30}\b(deliver|delivery|ship|shipping)\b/,
  /\bproduct (catalog|catalogue|listing)s?\b[^.\n]{0,40}\b(price|cart|buy|order)/,
];

/** Store sector → words that point to it. Order = tie-break priority. */
const SECTOR_WORDS: [vertical: string, words: RegExp][] = [
  ["grocery-store", /\b(grocer(y|ies)|kirana|vegetables?|fruits?|supermarket|provision store|ration|dairy|atta|organic food|daily essentials|sabzi)\b/g],
  ["fashion-store", /\b(cloth(es|ing)?|apparel|fashion|sarees?|kurtas?|kurtis?|dress(es)?|boutique|garments?|t-?shirts?|jeans|ethnic wear|lehengas?|footwear|shoes|jewel(le)?ry|handbags?)\b/g],
  ["electronics-store", /\b(electronics?|mobiles?|phones?|gadgets?|headphones?|earbuds|laptops?|chargers?|smart ?watch(es)?|mobile accessories|computer accessories)\b/g],
  ["beauty-store", /\b(beauty|cosmetics?|make-?up|skin ?care|lipsticks?|perfumes?|fragrances?|serums?)\b/g],
  ["home-decor-store", /\b(furniture|d[eé]cor|sofas?|home furnishings?|lamps?|rugs?|curtains?|interiors? products)\b/g],
  ["gifts-store", /\b(gifts?|gifting|handmade|handicrafts?|crafts?|candles?|hampers?|pottery|ceramics?|artisan)\b/g],
];

export type StoreIntent = { isStore: boolean; vertical: string | null };

export function detectStoreIntent(text: string): StoreIntent {
  const t = ` ${text.toLowerCase()} `;
  if (!STRONG.some((re) => re.test(t))) return { isStore: false, vertical: null };
  return { isStore: true, vertical: storeSector(t) };
}

/** Closest store sector for the text; the general store when nothing specific matches. */
export function storeSector(text: string): string {
  const t = text.toLowerCase();
  let best = "online-store";
  let bestScore = 0;
  for (const [vertical, re] of SECTOR_WORDS) {
    const score = t.match(re)?.length ?? 0;
    if (score > bestScore) [best, bestScore] = [vertical, score];
  }
  return best;
}

/** True when a blueprint (already enriched) is an online store. */
export function isStoreBlueprint(bp: { website?: { type?: string } }): boolean {
  return /\be-?commerce\b|\bonline (store|shop)\b/.test((bp.website?.type ?? "").toLowerCase());
}

export const STORE_TYPE = "ecommerce store";

const STORE_PAGES = [
  { name: "Home", slug: "home" },
  { name: "Shop", slug: "shop" },
  { name: "About", slug: "about" },
  { name: "Contact", slug: "contact" },
];

const STORE_QUESTIONS = [
  "Product photos, prices and stock",
  "UPI ID for payments",
  "WhatsApp number for orders",
  "Delivery areas & charges",
  "Return / exchange policy",
];

type Page = WebsiteBlueprint["pages"][number];
type Product = NonNullable<WebsiteBlueprint["products"]>[number];

const shopSections = (): NonNullable<Page["sections"]> => [
  { sectionType: "banner", content: { title: "Shop", titleHighlight: "All Products", subtitle: "Cash on delivery and UPI available." } },
  { sectionType: "productGrid", content: { eyebrow: "", title: "", titleHighlight: "", subtitle: "", showFilters: true, limit: 0, buttonLabel: "", buttonHref: "" } },
];

/**
 * Turn any blueprint into a working store: a Shop page with the live product grid, store
 * questions and the AI's catalogue (cleaned).
 * Extra pages the visitor asked for (lookbook, wholesale, blog…) are kept as-is.
 */
export function storeifyBlueprint(bp: WebsiteBlueprint): WebsiteBlueprint {
  const pages = bp.pages.map((p) => ({ ...p }));
  const isShop = (p: Page) => /^(shop|store|products?|catalog(ue)?|collections?)$/.test(p.slug);
  const shop = pages.find(isShop);
  if (shop) {
    shop.slug = "shop";
    if (!shop.sections?.some((s) => s.sectionType === "productGrid")) {
      shop.sections = [...shopSections(), ...(shop.sections ?? []).filter((s) => s.sectionType !== "banner" && s.sectionType !== "serviceCategories")];
      shop.pageTemplateId = undefined;
    }
  }
  for (const seed of STORE_PAGES) {
    if (pages.some((p) => p.slug === seed.slug || (seed.slug === "shop" && isShop(p)))) continue;
    pages.push({ name: seed.name, slug: seed.slug, pageTemplateId: seed.slug === "about" ? "about" : seed.slug === "contact" ? "contact" : undefined, showInNav: true, published: true, sections: seed.slug === "shop" ? shopSections() : [] });
  }
  // Home first, Shop second — the order shoppers expect in the menu.
  const order = (p: Page) => (p.slug === "home" ? 0 : p.slug === "shop" ? 1 : 2);
  pages.sort((a, b) => order(a) - order(b));

  const products: Product[] = (bp.products ?? []).filter((p) => p.name && p.price > 0);

  const seen = new Set<string>();
  const questions = [...(bp.questions ?? []), ...STORE_QUESTIONS].filter((q) => {
    const k = q.trim().toLowerCase();
    if (!k || seen.has(k)) return false;
    seen.add(k);
    return true;
  }).slice(0, 6);

  return { ...bp, website: { ...bp.website, type: STORE_TYPE }, pages: pages.slice(0, 10), products: products.slice(0, 30), questions };
}
