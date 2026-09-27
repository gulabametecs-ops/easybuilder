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
