// Per-page SEO audit used by the admin SEO cockpit. Pure functions — no DB.
import { isPlaceholderSrc } from "./img";

export const TITLE_RANGE = [30, 60] as const;
export const DESC_RANGE = [70, 160] as const;

export type PageAuditInput = {
  id: string;
  slug: string;
  title: string;
  seoTitle: string;
  seoDescription: string;
  focusKeyword: string;
  noindex: boolean;
  published: boolean;
  sections: { type: string; content: string; visible: boolean }[];
};

export type PageAudit = {
  id: string;
  path: string;
  name: string;
  seoTitle: string;
  seoDescription: string;
  focusKeyword: string;
  noindex: boolean;
  published: boolean;
  effectiveTitle: string;
  effectiveDescription: string;
  heroTitles: number;
  placeholderImages: number;
  words: number;
  /** Lower-cased visible copy (capped) for live keyword density in the editor. */
  text: string;
  issues: string[];
  status: "good" | "warn" | "bad";
};

const HERO_TYPES = new Set(["hero", "banner", "imageBanner"]);
const SKIP_KEYS = /^(image|images|src|url|href|link|icon|video|style|layout|variant|color|bg|background)/i;

/** Walks section JSON collecting human-readable strings and counting placeholder images. */
function walk(v: unknown, key: string, out: { text: string[]; placeholders: number }) {
  if (typeof v === "string") {
    if (isPlaceholderSrc(v)) out.placeholders++;
    else if (!SKIP_KEYS.test(key) && !/^(https?:|\/|data:|#)/.test(v)) out.text.push(v.replace(/<[^>]*>/g, " "));
  } else if (Array.isArray(v)) {
    v.forEach((x) => walk(x, key, out));
  } else if (v && typeof v === "object") {
    for (const [k, x] of Object.entries(v)) walk(x, k, out);
  }
}

export function lengthStatus(len: number, [min, max]: readonly [number, number]): "good" | "short" | "long" | "empty" {
  if (!len) return "empty";
  if (len < min) return "short";
  if (len > max) return "long";
  return "good";
}

export function keywordStats(text: string, keyword: string) {
  const words = text.split(/\s+/).filter(Boolean).length;
  const k = keyword.trim().toLowerCase();
  if (!k || !words) return { words, count: 0, density: 0 };
  let count = 0;
  for (let i = text.indexOf(k); i !== -1; i = text.indexOf(k, i + k.length)) count++;
  const density = (count * k.split(/\s+/).length * 100) / words;
  return { words, count, density: Math.round(density * 10) / 10 };
}

/** Hints for a focus keyword: present in title / description / body, density sane. */
export function keywordHints(a: Pick<PageAudit, "effectiveTitle" | "effectiveDescription" | "text" | "path">, keyword: string): { ok: boolean; label: string }[] {
  const k = keyword.trim().toLowerCase();
  if (!k) return [];
  const { count, density } = keywordStats(a.text, k);
  return [
    { ok: a.effectiveTitle.toLowerCase().includes(k), label: "In page title" },
    { ok: a.effectiveDescription.toLowerCase().includes(k), label: "In meta description" },
    { ok: count > 0, label: `Used ${count}× in page copy` },
    { ok: density >= 0.5 && density <= 3, label: `Density ${density}% (aim 0.5–3%)` },
    { ok: a.path.toLowerCase().includes(k.split(/\s+/)[0]), label: "In URL" },
  ];
}

export function auditPage(p: PageAuditInput, site: { bizName: string; title: string; description: string }): PageAudit {
  const isHome = p.slug === "home";
  const visible = p.sections.filter((s) => s.visible);
  const acc = { text: [] as string[], placeholders: 0 };
  let heroTitles = 0;
  for (const s of visible) {
    let c: unknown = {};
    try { c = JSON.parse(s.content || "{}"); } catch { /* ignore broken section */ }
    if (HERO_TYPES.has(s.type) && c && typeof c === "object") {
      // banner/imageBanner: title; hero: titleTop/titleHighlight (or slides[0]).
      const h = c as { title?: unknown; titleTop?: unknown; titleHighlight?: unknown; slides?: { titleTop?: unknown }[] };
      if ([h.title, h.titleTop, h.titleHighlight, h.slides?.[0]?.titleTop].some((x) => typeof x === "string" && x.trim())) heroTitles++;
    }
    walk(c, "", acc);
  }
  const text = acc.text.join(" ").replace(/\s+/g, " ").trim().toLowerCase().slice(0, 20_000);
  const effectiveTitle = p.seoTitle || (isHome ? site.title || site.bizName : `${p.title} — ${site.bizName}`);
  const effectiveDescription = p.seoDescription || site.description;
  const words = text ? text.split(" ").length : 0;

  const issues: string[] = [];
  const t = lengthStatus(effectiveTitle.length, TITLE_RANGE);
  if (t !== "good") issues.push(`Title ${t === "long" ? "too long" : "too short"} (${effectiveTitle.length} chars, aim ${TITLE_RANGE[0]}–${TITLE_RANGE[1]})`);
  const d = lengthStatus(effectiveDescription.length, DESC_RANGE);
  if (d === "empty") issues.push("No meta description");
  else if (d !== "good") issues.push(`Description ${d === "long" ? "too long" : "too short"} (${effectiveDescription.length} chars, aim ${DESC_RANGE[0]}–${DESC_RANGE[1]})`);
  if (!p.seoDescription && !isHome) issues.push("Uses the site-wide description — write one for this page");
  if (heroTitles === 0) issues.push("No main heading (hero/banner title)");
  if (heroTitles > 1) issues.push(`${heroTitles} main headings — keep one per page`);
  if (acc.placeholders) issues.push(`${acc.placeholders} placeholder image${acc.placeholders > 1 ? "s" : ""}`);
  if (words < 120) issues.push(`Thin content (${words} words)`);
  if (p.noindex) issues.push("Hidden from search engines (noindex)");

  const serious = issues.filter((i) => /No meta|No main|noindex|too long|placeholder/.test(i)).length;
  const status = !issues.length ? "good" : serious >= 2 || !p.published ? "bad" : "warn";
  return {
    id: p.id,
    path: isHome ? "/" : `/${p.slug}`,
    name: p.title,
    seoTitle: p.seoTitle,
    seoDescription: p.seoDescription,
    focusKeyword: p.focusKeyword,
    noindex: p.noindex,
    published: p.published,
    effectiveTitle,
    effectiveDescription,
    heroTitles,
    placeholderImages: acc.placeholders,
    words,
    text,
    issues,
    status,
  };
}
