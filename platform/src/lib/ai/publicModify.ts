import { callGroqJson, GroqError, friendlyGroqError } from "./groq";
import { AI_SYSTEM_PROMPT } from "./prompts";
import { type WebsiteBlueprint } from "./blueprintSchema";
import { compactBlueprintSummary } from "./blueprintPreview";
import { canonicalPageSlug } from "./completeHome";
import { enrichBlueprint } from "./enrichBlueprint";
import { normalizeBlueprint } from "./normalizeBlueprint";

const MAX_PROMPT = 2000;

export type PublicModifyResult =
  | { ok: true; blueprint: WebsiteBlueprint }
  | { ok: false; error: string };

type Page = WebsiteBlueprint["pages"][number];

/**
 * What the model returns for a refine: only the parts that change. Regenerating the
 * whole blueprint for every tweak produced large, frequently-truncated JSON and
 * burned the Groq per-minute token budget in one or two edits.
 */
type BlueprintPatch = {
  website?: Partial<WebsiteBlueprint["website"]>;
  design?: WebsiteBlueprint["design"];
  services?: WebsiteBlueprint["services"];
  pages?: Page[];
  removePages?: string[];
};

const PATCH_INSTRUCTION = `Return ONE raw JSON object (no markdown) containing ONLY what changes:
{"design"?:{...},"website"?:{...},"services"?:[...],"pages"?:[<complete page objects you changed or added>],"removePages"?:["slug"]}

Rules:
- Colour / style / font changes: return only "design" (e.g. {"design":{"primaryColor":"#2563eb","secondaryColor":"#0f172a","style":"modern"}}). Do NOT return pages for these.
- primaryColor = accent for buttons & highlights (a vivid colour). secondaryColor = hero/footer background and headings — it MUST be a very dark shade (e.g. #0f172a, #1e1b4b, #052e16) so white text stays readable.
- Text or section changes: return only the affected page(s) in "pages", each COMPLETE with all its sections, keeping the same "slug".
- "Add a <something> section": add that section to an EXISTING page (the Home page unless the user names a page) and return that page. Only create a new page when the user explicitly says "page".
- New page: add it to "pages" with a new unique lowercase slug.
- Never return pages you did not change. Keep text fields under 120 characters.
- sectionType must be from the available section types (e.g. faq, testimonials, pricingPlans, priceList, gallery, contactForm).
- Menu / price list / rate card → sectionType "priceList" with content EXACTLY like:
  {"title":"Our","titleHighlight":"Menu","note":"","groups":[{"category":"Starters","items":[{"name":"Paneer Tikka","price":"₹280","note":"6 pcs"}]}]}
- FAQ content: {"title":"Frequently Asked","titleHighlight":"Questions","items":[{"q":"…","a":"…"}]}
- When the user asks for N items, return exactly N realistic items with prices in ₹, grouped into sensible categories.
- Words like "it / this / usme / isme / ispe" refer to the page given as "Current page".`;

/** Merge a patch into the current blueprint; pages match by canonical slug. */
/** Relative luminance 0 (black) – 1 (white) of a #rrggbb colour. */
function luminance(hex: string): number {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return 0;
  const [r, g, b] = [0, 2, 4].map((i) => {
    const c = parseInt(m[1].slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function mergeBlueprintPatch(bp: WebsiteBlueprint, patch: BlueprintPatch, opts: { allowNewPages?: boolean } = {}): WebsiteBlueprint {
  const key = (p: Page) => canonicalPageSlug(p.slug || p.name, p.name);
  const remove = new Set((patch.removePages ?? []).map((s) => canonicalPageSlug(s)));
  remove.delete("home"); // never drop the home page

  const pages = bp.pages.filter((p) => !remove.has(key(p)));
  for (const next of patch.pages ?? []) {
    if (!next || typeof next !== "object" || !(next.slug || next.name)) continue;
    const i = pages.findIndex((p) => key(p) === key(next));
    if (i >= 0) pages[i] = { ...pages[i], ...next, sections: next.sections ?? pages[i].sections };
    else if (opts.allowNewPages !== false) pages.push(next);
  }

  return {
    ...bp,
    website: { ...bp.website, ...(patch.website ?? {}), name: patch.website?.name || bp.website.name },
    design: safeDesign(bp.design, patch.design),
    services: patch.services?.length ? patch.services : bp.services,
    pages,
  };
}

// secondaryColor paints the hero/footer behind white text — refuse light shades.
function safeDesign(current: WebsiteBlueprint["design"], next: WebsiteBlueprint["design"]): WebsiteBlueprint["design"] {
  const merged = { ...(current ?? {}), ...(next ?? {}) };
  if (next?.secondaryColor && luminance(next.secondaryColor) > 0.2) {
    merged.secondaryColor = current?.secondaryColor ?? "#0f172a";
  }
  return merged;
}

/**
 * Only the pages the request is likely about go to the model in full; the rest as a summary.
 * `current` = the page the visitor is looking at / last changed, so "add 10 items to it" works.
 */
function relevantPages(bp: WebsiteBlueprint, text: string, current?: string): Page[] {
  const lower = text.toLowerCase();
  const named = bp.pages.filter((p) => lower.includes(p.name.toLowerCase()) || (p.slug && lower.includes(p.slug.toLowerCase())));
  if (named.length) return named;
  const cur = current ? bp.pages.find((p) => canonicalPageSlug(p.slug || p.name, p.name) === canonicalPageSlug(current)) : undefined;
  const pointsAtIt = /\b(it|this|that|here|usme|isme|ispe|uspe|isko|usko|iske|uske|yaha|yahan|is page|this page)\b/.test(lower);
  if (cur && pointsAtIt && canonicalPageSlug(cur.slug || cur.name, cur.name) !== "home") return [cur];
  // Style-only requests need no page bodies at all.
  if (/\b(colou?r|theme|font|dark|light|style|palette)\b/.test(lower) && !/\b(section|page|add|remove|text|headline|title)\b/.test(lower)) return [];
  return bp.pages.filter((p) => canonicalPageSlug(p.slug || p.name, p.name) === "home");
}

/** Refine a marketing-site blueprint from a follow-up prompt (no tenant). */
export async function refinePublicBlueprint(
  blueprint: WebsiteBlueprint,
  changePrompt: string,
  currentPage?: string,
): Promise<PublicModifyResult> {
  const text = changePrompt.trim().slice(0, MAX_PROMPT);
  if (text.length < 3) return { ok: false, error: "Describe what you want to change." };

  const focus = relevantPages(blueprint, text, currentPage);

  try {
    const patch = await callGroqJson<BlueprintPatch>([
      { role: "system", content: AI_SYSTEM_PROMPT },
      {
        role: "user",
        content: `You are editing an existing website. Return only the changes.

Site: ${blueprint.website.name} (${blueprint.website.type ?? "business"})
Structure: ${compactBlueprintSummary(blueprint)}
Current design: ${JSON.stringify(blueprint.design ?? {})}
${currentPage ? `Current page: ${currentPage}\n` : ""}${focus.length ? `Pages you may need to edit (full JSON):\n${JSON.stringify(focus)}` : "No page content needed for this request."}

User requested change:
${text}

${PATCH_INSTRUCTION}`,
      },
    ]);

    // New pages only when the visitor actually asked for a page.
    const merged = normalizeBlueprint(mergeBlueprintPatch(blueprint, patch ?? {}, { allowNewPages: /\bpages?\b/i.test(text) }));
    if (!merged) {
      return { ok: false, error: "AI could not apply your changes. Try describing it differently." };
    }
    return { ok: true, blueprint: enrichBlueprint(merged, text) };
  } catch (e) {
    const msg =
      e instanceof GroqError && /valid website plan/.test(e.message)
        ? "That change was too big for one step — try naming the page, e.g. “add 10 items to the Menu price list”."
        : e instanceof GroqError
          ? friendlyGroqError(e)
          : "Update failed. Please try again.";
    return { ok: false, error: msg };
  }
}
