function str(v: unknown): string {
  return typeof v === "string" ? v.trim() : "";
}

function splitHeading(heading: string): { top: string; highlight: string } {
  const parts = heading.split(/\s*[—–|:]\s*/).map((p) => p.trim()).filter(Boolean);
  if (parts.length >= 2) return { top: parts[0], highlight: parts.slice(1).join(" ") };
  const words = heading.split(/\s+/);
  if (words.length > 3) {
    return { top: words.slice(0, Math.ceil(words.length / 2)).join(" "), highlight: words.slice(Math.ceil(words.length / 2)).join(" ") };
  }
  return { top: heading, highlight: "" };
}

function asBtn(v: unknown, fallbackHref: string, fallbackLabel = "Learn more"): { label: string; href: string } | undefined {
  if (typeof v === "string" && v.trim()) return { label: v.trim(), href: fallbackHref };
  if (!v || typeof v !== "object" || Array.isArray(v)) return undefined;
  const o = v as Record<string, unknown>;
  return {
    label: str(o.label ?? o.text ?? o.title) || fallbackLabel,
    href: str(o.href ?? o.link ?? o.url) || fallbackHref,
  };
}

/** Map Groq-style fields (heading, cta) onto builder section content. */
export function normalizeSectionContent(
  type: string,
  partial?: Record<string, unknown>,
): Record<string, unknown> {
  if (!partial) return {};
  const out: Record<string, unknown> = { ...partial };
  const heading = str(partial.heading ?? partial.title ?? partial.headline);
  const sub = str(partial.subheading ?? partial.subtitle ?? partial.description ?? partial.body);

  if (type === "hero") {
    if (heading && !str(partial.titleTop)) {
      const split = splitHeading(heading);
      out.titleTop = split.top;
      if (split.highlight && !str(partial.titleHighlight)) out.titleHighlight = split.highlight;
    }
    if (sub && !str(partial.description)) out.description = sub;
    const primary = asBtn(partial.primaryBtn ?? partial.cta ?? partial.primaryCta, "/contact", "Contact");
    if (primary) out.primaryBtn = primary;
    const secondary = asBtn(partial.secondaryBtn ?? partial.secondaryCta, "/about", "Learn more");
    if (secondary) out.secondaryBtn = secondary;
    if (partial.badge === undefined) out.badge = "";
  }

  if (type === "about") {
    if (heading && !str(partial.title)) {
      const split = splitHeading(heading);
      out.title = split.top;
      if (split.highlight) out.titleHighlight = split.highlight;
    }
    if (typeof partial.description === "string" && !partial.body) out.body = [partial.description];
    if (typeof partial.body === "string") out.body = [partial.body];
  }

  if (type === "cta") {
    if (heading && !str(partial.title)) out.title = heading;
    if (sub && !str(partial.highlight)) out.highlight = sub;
    const btn = asBtn(partial.cta ?? partial.button, "/contact");
    if (btn) {
      if (!str(partial.buttonLabel)) out.buttonLabel = btn.label;
      if (!str(partial.buttonHref)) out.buttonHref = btn.href;
    }
  }

  if (type === "serviceCategories" || type === "features") {
    if (heading && !str(partial.title)) {
      const split = splitHeading(heading);
      out.title = split.top;
      if (split.highlight) out.titleHighlight = split.highlight;
    }
  }

  return out;
}

// ─── List sections: the model invents its own field names ("menu", "dishes", "cost"…).
// Map them onto the real shapes so the site never falls back to "Item ₹0" placeholders.

const arr = (v: unknown): unknown[] => (Array.isArray(v) ? v : []);
const rec = (v: unknown): Record<string, unknown> => (v && typeof v === "object" && !Array.isArray(v) ? (v as Record<string, unknown>) : {});

function toPrice(v: unknown): string {
  if (typeof v === "number" && Number.isFinite(v)) return `₹${v.toLocaleString("en-IN")}`;
  const t = str(v);
  return /^\d[\d,]*(\.\d+)?$/.test(t) ? `₹${t}` : t;
}

function priceItem(v: unknown): { name: string; price: string; note: string } | null {
  if (typeof v === "string") return v.trim() ? { name: v.trim(), price: "", note: "" } : null;
  const o = rec(v);
  const name = str(o.name ?? o.title ?? o.item ?? o.dish ?? o.label ?? o.product);
  if (!name) return null;
  return { name, price: toPrice(o.price ?? o.cost ?? o.amount ?? o.rate ?? o.fee), note: str(o.note ?? o.description ?? o.desc ?? o.details) };
}

const ITEM_KEYS = ["items", "list", "dishes", "products", "entries", "menuItems", "prices"] as const;
const itemsOf = (o: Record<string, unknown>) => arr(ITEM_KEYS.map((k) => o[k]).find(Array.isArray));

/** Coerce AI list-section content (priceList, faq) into the shapes the site renders. */
export function coerceListContent(type: string, content?: Record<string, unknown>): Record<string, unknown> | undefined {
  if (!content) return content;
  const out: Record<string, unknown> = { ...content };
  const heading = str(content.heading ?? content.headline);
  if (heading && !str(content.title)) {
    const split = splitHeading(heading);
    out.title = split.top;
    if (split.highlight && !str(content.titleHighlight)) out.titleHighlight = split.highlight;
  }

  if (type === "priceList") {
    const rawGroups = arr(content.groups ?? content.categories ?? content.menu ?? content.sections);
    let groups = rawGroups
      .map((g) => {
        const o = rec(g);
        const items = itemsOf(o).map(priceItem).filter((i): i is NonNullable<typeof i> => !!i);
        return { category: str(o.category ?? o.name ?? o.title ?? o.label) || "Menu", items };
      })
      .filter((g) => g.items.length);
    if (!groups.length) {
      const flat = itemsOf(content).map(priceItem).filter((i): i is NonNullable<typeof i> => !!i);
      if (flat.length) groups = [{ category: str(content.category) || "Menu", items: flat }];
    }
    if (groups.length) out.groups = groups;
    else delete out.groups;
  }

  if (type === "faq") {
    const items = arr(content.items ?? content.faqs ?? content.questions)
      .map((v) => {
        const o = rec(v);
        const q = str(o.q ?? o.question ?? o.title);
        const a = str(o.a ?? o.answer ?? o.text);
        return q && a ? { q, a } : null;
      })
      .filter(Boolean);
    if (items.length) out.items = items;
  }
  return out;
}
