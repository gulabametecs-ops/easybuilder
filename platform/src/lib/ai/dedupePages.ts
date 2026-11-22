import { slugify } from "./hydrate";

/** Page slugs/titles that mean the same page. The first page seen in a group wins. */
const SYNONYM_GROUPS: string[][] = [
  ["contact", "contact-us", "contactus", "get-in-touch"],
  ["book", "booking", "bookings", "book-now", "reservation", "reservations", "book-a-table", "table-booking", "appointment", "appointments", "book-appointment", "book-an-appointment"],
  ["about", "about-us", "aboutus", "our-story"],
  ["services", "our-services", "what-we-do"],
  ["gallery", "photos", "photo-gallery", "portfolio"],
  ["pricing", "plans", "fees", "fee-structure", "packages"],
];
const GROUP_OF = new Map(SYNONYM_GROUPS.flatMap((g, i) => g.map((s) => [s, `group:${i}`] as const)));

type Section = { sectionType: string; content?: Record<string, unknown> };
type Page = { name: string; slug: string; pageTemplateId?: string; sections?: Section[] };

const MAX_SECTIONS = 24; // blueprintPageSchema limit

function keysOf(p: Page): string[] {
  const slug = slugify(p.slug || p.name);
  const title = slugify(p.name);
  return [`slug:${slug}`, `title:${title}`, GROUP_OF.get(slug), GROUP_OF.get(title)].filter((k): k is string => !!k);
}

/** Rewrite "/dropped", "/dropped#x", "/dropped?y" anywhere in section content to the kept page. */
function rewriteLinks(value: unknown, redirects: Map<string, string>): unknown {
  if (typeof value === "string") {
    const m = /^\/([^/?#]+)\/?([?#].*)?$/.exec(value);
    const target = m && redirects.get(slugify(m[1]));
    return target ? `${target === "home" ? "/" : `/${target}`}${m![2] ?? ""}` : value;
  }
  if (Array.isArray(value)) return value.map((v) => rewriteLinks(v, redirects));
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, rewriteLinks(v, redirects)]));
  }
  return value;
}

/**
 * Drop near-duplicate pages (same slug, same title, or synonyms like "Reservations" vs "Book a Table").
 * Keeps the first page, appends the duplicate's sections of types it doesn't already have, and points
 * links to dropped slugs at the kept page.
 */
export function dedupePages<P extends Page>(pages: P[]): P[] {
  const kept: P[] = [];
  const owner = new Map<string, P>();
  const redirects = new Map<string, string>();

  for (const page of pages) {
    const keys = keysOf(page);
    const first = keys.map((k) => owner.get(k)).find(Boolean);
    if (!first) {
      kept.push(page);
      for (const k of keys) owner.set(k, page);
      continue;
    }
    // Duplicate: fold it into the first page.
    if (!first.pageTemplateId && !first.sections?.length) first.pageTemplateId = page.pageTemplateId;
    const have = new Set((first.sections ?? []).map((s) => s.sectionType));
    const extra = (page.sections ?? []).filter((s) => !have.has(s.sectionType));
    if (extra.length) first.sections = [...(first.sections ?? []), ...extra].slice(0, MAX_SECTIONS);
    for (const k of keys) if (!owner.has(k)) owner.set(k, first);
    const from = slugify(page.slug || page.name);
    const to = slugify(first.slug || first.name);
    if (from !== to) redirects.set(from, to);
  }

  if (redirects.size === 0) return kept;
  for (const p of kept) {
    if (p.sections) p.sections = p.sections.map((s) => (s.content ? { ...s, content: rewriteLinks(s.content, redirects) as Record<string, unknown> } : s));
  }
  return kept;
}
