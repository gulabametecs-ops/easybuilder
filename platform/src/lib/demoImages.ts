import { db } from "./db";
import { STOCK, isPlaceholderSrc } from "./img";
import { VERTICALS, categoryOf, getVertical } from "./verticals";
import { getTemplate } from "./templates";
import { VERTICAL_ICON_SVG } from "./verticalIconSvg";
import { DEMO_PHOTOS } from "./demoPhotoLibrary";
import { isStoreVertical } from "./store";
import { seedDemoOrders } from "./storeServer";

// DEMO WEBSITES ONLY: fill every empty image slot with a hand-checked Unsplash photo — first the
// curated per-sector library (demoPhotoLibrary.ts, service-matched where tagged), else the sector's
// stock photos — real portraits for people,
// and a generated SVG logo. Purchased sites never call this — their slots stay blank for the
// owner's own photos.

const PORTRAITS = {
  female: ["1494790108377-be9c29b29330", "1573496359142-b8d87734a5a2", "1580489944761-15a19d654956", "1531123897727-8f129e1688ce",
    "1544005313-94ddf0286df2", "1607746882042-944635dfe10e", "1534528741775-53994a69daeb", "1438761681033-6461ffad8d80"],
  male: ["1560250097-0b93528c311a", "1507003211169-0a1dd7228f2d", "1472099645785-5658abf4ff4e", "1519085360753-af0119f7cbe7",
    "1500648767791-00dcc994a43e", "1566492031773-4f4e44671857", "1506794778202-cad84cf45f1d"],
};

const url = (id: string, w: number, h: number) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&h=${h}&q=80`;
let refreshing = false; // when re-filling, photos this module placed earlier count as empty too
const empty = (v: unknown) =>
  typeof v !== "string" || !v.trim() || isPlaceholderSrc(v) || (refreshing && v.startsWith("https://images.unsplash.com/photo-"));

// The electrician photo's rule also matches the plain word "home" ("homes", "home-style
// meals", "home loans"), so it's kept for the two sectors it actually shows.
const ELECTRICIAN = "1621905251918-48416bd8575a";
const ELECTRICIAN_OK = new Set(["home-services", "electrical-wholesale"]);

/** Every curated photo id whose rule matches the text (not just the first). */
function stockIds(text: string, vertical = ""): string[] {
  return STOCK.filter(([re, id]) => re.test(text) && (id !== ELECTRICIAN || ELECTRICIAN_OK.has(vertical))).map(([, id]) => id);
}

// Listing photos for real-estate sites, by purpose (all hand-checked).
const VILLA = "1600596542815-ffad4c1539a9";
const APARTMENTS = "1460317442991-0ec209397118";
const SOCIETY = "1545324418-cc1a3fa10c00";
const SITE = "1504307651254-35680f356dfd";
const HOSTEL = "1555854877-bab0e564b8d5";
const OFFICE = "1497366754035-f200968a6e72";
const RE_LIBRARY = [...(DEMO_PHOTOS["real-estate-broker"] ?? []), ...(DEMO_PHOTOS["pg-hostel"] ?? []), ...(DEMO_PHOTOS["builder-developer"] ?? [])];
const byKind = (...kinds: string[]) => [...new Set(RE_LIBRARY.filter((p) => p.kind && kinds.includes(p.kind)).map((p) => p.id))];
function propertyPool(purpose: string, type: string): string[] {
  const lib =
    purpose === "pg" ? byKind("pg", "interior")
    : purpose === "project" ? byKind("apartment", "construction", "interior")
    : ["commercial", "office", "shop"].includes(type) ? byKind("office", "shop")
    : ["villa", "house", "plot"].includes(type) ? byKind("villa", "interior")
    : byKind("apartment", "interior");
  if (lib.length >= 2) return lib;
  return propertyPoolFallback(purpose, type);
}
function propertyPoolFallback(purpose: string, type: string): string[] {
  if (purpose === "pg") return [HOSTEL, SOCIETY];
  if (purpose === "project") return [APARTMENTS, SITE, SOCIETY];
  if (["commercial", "office", "shop"].includes(type)) return [OFFICE, APARTMENTS];
  if (["villa", "house", "plot"].includes(type)) return [VILLA, SOCIETY];
  return [APARTMENTS, SOCIETY, VILLA];
}

/**
 * On-topic photos for a sector: everything its own name, tagline and description match.
 * Sister sectors of the same category are only a fallback (they can be off-topic — a salad
 * on a gym, a seedling on a senior-care home).
 */
export function sectorPhotoIds(vertical: string): string[] {
  const curated = DEMO_PHOTOS[vertical];
  if (curated?.length) return curated.map((p) => p.id);
  const v = getVertical(vertical);
  const own = [...new Set(stockIds([v?.name, v?.tagline, v?.description].filter(Boolean).join(" · "), vertical))];
  if (own.length) return own;
  const cat = categoryOf(vertical);
  const sisters = VERTICALS.filter((x) => x.id !== vertical && categoryOf(x.id) === cat).flatMap((x) => stockIds(x.name, vertical));
  const ids = [...new Set(sisters)];
  return ids.length ? ids : ["1497366216548-37526070297c"];
}

// Indian first names: ending in a/i/ee/ya is usually female (Priya, Sunita, Meera, Anjali).
const MALE_EXCEPTIONS = /^(krishna|aditya|surya|chaitanya|shiva|rama|gopi|ravi|hari|sai|ali|bharathi?)$/i;
function portraitFor(name: string, i: number): string {
  const first = name.replace(/^(dr|mr|mrs|ms|prof|er|ca|adv)\.?\s+/i, "").split(/\s+/)[0] ?? "";
  const female = /(?:a|i|ee|ya)$/i.test(first) && !MALE_EXCEPTIONS.test(first) || /^(mrs|ms)\.?\s/i.test(name);
  const pool = female ? PORTRAITS.female : PORTRAITS.male;
  return url(pool[i % pool.length], 600, 600);
}

/** Business logo for a demo: gradient tile with the sector icon + the name, as an SVG data URI. */
export function demoLogo(name: string, vertical: string): string {
  const v = getVertical(vertical);
  const c = getTemplate(vertical).theme.colors;
  const icon = VERTICAL_ICON_SVG[v?.icon ?? ""] ?? VERTICAL_ICON_SVG.store ?? "";
  const font = getTemplate(vertical).theme.font || "Inter";
  const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const text = esc(name.length > 28 ? `${name.slice(0, 27)}…` : name);
  const w = Math.round(64 + text.length * 13.5);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="48" viewBox="0 0 ${w} 48">
<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c.primary}"/><stop offset="1" stop-color="${c.primaryDark || c.secondary}"/></linearGradient></defs>
<rect x="2" y="2" width="44" height="44" rx="12" fill="url(#g)"/>
<g transform="translate(12 12)" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${icon}</g>
<text x="58" y="31" font-family="'${esc(font)}', Inter, Arial, sans-serif" font-size="21" font-weight="700" fill="${c.heading || c.dark}" letter-spacing="-0.3">${text}</text>
</svg>`;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}

/** Walk a section's JSON and fill empty "image" fields (portraits inside team / toppers lists). */
function fillContent(node: unknown, next: () => string, portrait: (name: string) => string, inPeople = false): unknown {
  if (Array.isArray(node)) return node.map((n) => fillContent(n, next, portrait, inPeople));
  if (!node || typeof node !== "object") return node;
  const o = { ...(node as Record<string, unknown>) };
  for (const [k, v] of Object.entries(o)) {
    if (k === "image" && empty(v)) o[k] = inPeople ? portrait(String(o.name ?? "")) : next();
    else if (v && typeof v === "object") {
      const first = Array.isArray(v) ? v[0] : null;
      const toppers = k === "items" && !!first && typeof first === "object" && "exam" in first;
      o[k] = fillContent(v, next, portrait, inPeople || k === "members" || toppers);
    }
  }
  return o;
}

export async function fillDemoImages(tenantId: string, vertical: string, opts: { refresh?: boolean } = {}): Promise<void> {
  refreshing = !!opts.refresh;
  const ids = sectorPhotoIds(vertical);
  let n = 0;
  const pick = (w: number, h: number) => url(ids[n++ % ids.length], w, h);
  let p = 0;
  const portrait = (name: string) => portraitFor(name, p++);

  const tenant = await db.tenant.findUnique({ where: { id: tenantId }, select: { name: true, siteConfig: { select: { id: true, header: true } } } });
  if (!tenant) return;

  // Logo
  if (tenant.siteConfig) {
    const header = JSON.parse(tenant.siteConfig.header || "{}");
    if (empty(header.logoImage)) {
      header.logoImage = demoLogo(tenant.name, vertical);
      await db.siteConfig.update({ where: { id: tenant.siteConfig.id }, data: { header: JSON.stringify(header) } });
    }
  }

  // Page sections (hero, about, banners, image banners, slides, team, toppers…)
  const sections = await db.section.findMany({ where: { page: { tenantId } }, select: { id: true, content: true } });
  for (const s of sections) {
    let c: unknown;
    try {
      c = JSON.parse(s.content);
    } catch {
      continue;
    }
    const filled = JSON.stringify(fillContent(c, () => pick(1600, 900), portrait));
    if (filled !== s.content) await db.section.update({ where: { id: s.id }, data: { content: filled } });
  }

  // Rows with their own image fields
  // A service gets the photo tagged for it when the library has one, else the next sector photo.
  const curated = DEMO_PHOTOS[vertical] ?? [];
  const norm = (t: string) => t.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  const usedForService = new Set<string>();
  const photoForService = (title: string) => {
    const t = norm(title);
    const hit = curated.find((p) => !usedForService.has(p.id) && p.services?.some((x) => norm(x) === t))
      ?? curated.find((p) => !usedForService.has(p.id) && p.services?.some((x) => t.includes(norm(x)) || norm(x).includes(t)));
    if (!hit) return null;
    usedForService.add(hit.id);
    return url(hit.id, 800, 500);
  };
  for (const r of await db.service.findMany({ where: { tenantId }, select: { id: true, image: true, title: true }, orderBy: { order: "asc" } }))
    if (empty(r.image)) await db.service.update({ where: { id: r.id }, data: { image: photoForService(r.title) ?? pick(800, 500) } });
  for (const r of await db.galleryItem.findMany({ where: { tenantId }, select: { id: true, image: true } }))
    if (empty(r.image)) await db.galleryItem.update({ where: { id: r.id }, data: { image: pick(800, 800) } });
  for (const r of await db.person.findMany({ where: { tenantId }, select: { id: true, image: true, name: true }, orderBy: { order: "asc" } }))
    if (empty(r.image)) await db.person.update({ where: { id: r.id }, data: { image: portrait(r.name) } });

  const galleryOf = (raw: string, w: number, h: number) => {
    let g: unknown;
    try {
      g = JSON.parse(raw || "[]");
    } catch {
      g = [];
    }
    const list = Array.isArray(g) ? g.filter((x) => !empty(x)) : [];
    while (list.length < 3) list.push(pick(w, h));
    return JSON.stringify(list);
  };
  for (const r of await db.siteEvent.findMany({ where: { tenantId }, select: { id: true, coverImage: true, gallery: true } }))
    await db.siteEvent.update({
      where: { id: r.id },
      data: { coverImage: empty(r.coverImage) ? pick(1200, 720) : r.coverImage, gallery: galleryOf(r.gallery, 800, 600) },
    });
  let k = 0;
  for (const r of await db.property.findMany({ where: { tenantId }, select: { id: true, coverImage: true, gallery: true, purpose: true, propertyType: true }, orderBy: { order: "asc" } })) {
    const pool = propertyPool(r.purpose, r.propertyType);
    const at = (j: number, w: number, h: number) => url(pool[(k + j) % pool.length], w, h);
    let list: unknown[] = [];
    try {
      list = JSON.parse(r.gallery || "[]");
    } catch {
      /* treat as empty */
    }
    const keep = Array.isArray(list) ? list.filter((x) => !empty(x)) : [];
    const gallery = keep.length ? keep : [at(1, 1200, 800), at(2, 1200, 800), at(3, 1200, 800)];
    await db.property.update({
      where: { id: r.id },
      data: { coverImage: empty(r.coverImage) ? at(0, 1200, 800) : r.coverImage, gallery: JSON.stringify(gallery) },
    });
    k++;
  }
  for (const r of await db.cause.findMany({ where: { tenantId }, select: { id: true, coverImage: true } }))
    if (empty(r.coverImage)) await db.cause.update({ where: { id: r.id }, data: { coverImage: pick(1200, 750) } });

  // Store sectors: each sample product gets its own hand-checked photo, then a few sample orders.
  if (isStoreVertical(vertical)) {
    const photoOf = new Map((getTemplate(vertical).products?.("") ?? []).map((p) => [p.name, p.photo]));
    for (const r of await db.product.findMany({ where: { tenantId }, select: { id: true, name: true, images: true } })) {
      const photo = photoOf.get(r.name);
      if (photo && (r.images === "[]" || refreshing)) await db.product.update({ where: { id: r.id }, data: { images: JSON.stringify([url(photo, 900, 900)]) } });
    }
    // ponytail: orders are seeded here because this is the "demo sites only" hook every demo path already calls.
    await seedDemoOrders(tenantId);
  }
}
