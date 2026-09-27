// ─────────────────────────────────────────────────────────────────────────────
// Design presets — every vertical template can be rendered in several distinct
// styles (palette, font, header/footer layout, hero layout, section rhythm, card
// look). A preset only re-dresses a template; content stays the same.
//
//   • Purchase: provision applies the chosen preset to the seeded site.
//   • Live demos: `?design=<id>` on a demo host previews it without touching data.
// ─────────────────────────────────────────────────────────────────────────────
import type { ThemeConfig, HeaderConfig, FooterConfig, SectionStyle } from "./config";

export type DesignId = "classic" | "modern" | "bold" | "elegant" | "minimal";

export type Design = {
  id: DesignId;
  name: string;
  tagline: string;
  font: string;
  header: NonNullable<HeaderConfig["design"]>;
  footer: NonNullable<FooterConfig["design"]>;
  /** Hero layout override; undefined keeps the template's own hero. */
  hero?: "split" | "centered" | "gradient" | "minimal" | "marquee" | "classic";
  radius: string;
  palette: (t: ThemeConfig["colors"]) => ThemeConfig["colors"];
  /** Card look applied to every content section. */
  cards: Pick<SectionStyle, "cardRadius" | "cardShadow" | "cardBorderWidth">;
  /** Background for the n-th content section (alternating rhythm). */
  rhythm: (n: number) => SectionStyle["background"];
};

export const DESIGNS: Design[] = [
  {
    id: "classic",
    name: "Original",
    tagline: "The template as designed — balanced and familiar",
    font: "",
    header: "classic",
    footer: "classic",
    radius: "",
    palette: (c) => c,
    cards: {},
    rhythm: () => undefined,
  },
  {
    id: "modern",
    name: "Modern",
    tagline: "Clean, airy and app-like with soft rounded cards",
    font: "Plus Jakarta Sans",
    header: "modern",
    footer: "modern",
    hero: "split",
    radius: "1rem",
    palette: (c) => ({ ...c, secondary: "#0f172a", dark: "#0f172a", light: "#f8fafc", text: "#475569", heading: "#0f172a" }),
    cards: { cardRadius: "lg", cardShadow: "sm" },
    rhythm: (n) => (n % 2 === 1 ? "light" : "default"),
  },
  {
    id: "bold",
    name: "Bold",
    tagline: "High-contrast, dark and energetic — makes a statement",
    font: "Sora",
    header: "bold",
    footer: "gradient",
    hero: "gradient",
    radius: "0.75rem",
    palette: (c) => ({ ...c, secondary: "#111827", dark: "#0b0f19", light: "#f1f5f9", text: "#374151", heading: "#0b0f19" }),
    cards: { cardRadius: "md", cardShadow: "lg" },
    rhythm: (n) => (n % 3 === 2 ? "dark" : n % 2 === 1 ? "light" : "default"),
  },
  {
    id: "elegant",
    name: "Elegant",
    tagline: "Refined serif type, warm tones and generous spacing",
    font: "Fraunces",
    header: "centered",
    footer: "centered",
    hero: "centered",
    radius: "0.375rem",
    palette: (c) => ({ ...c, secondary: "#292524", accent: "#b8862e", dark: "#1c1917", light: "#faf7f2", text: "#57534e", heading: "#1c1917" }),
    cards: { cardRadius: "sm", cardShadow: "none", cardBorderWidth: 1 },
    rhythm: (n) => (n % 2 === 1 ? "light" : "default"),
  },
  {
    id: "minimal",
    name: "Minimal",
    tagline: "Pared-back, typography-first — lets the content breathe",
    font: "DM Sans",
    header: "minimal",
    footer: "minimal",
    hero: "minimal",
    radius: "0.5rem",
    palette: (c) => ({ ...c, secondary: "#18181b", dark: "#18181b", light: "#fafafa", text: "#52525b", heading: "#18181b" }),
    cards: { cardRadius: "md", cardShadow: "none", cardBorderWidth: 1 },
    rhythm: () => undefined,
  },
];

export function getDesign(id: string | undefined | null): Design | undefined {
  return DESIGNS.find((d) => d.id === id);
}

export function isDesignId(id: unknown): id is DesignId {
  return typeof id === "string" && DESIGNS.some((d) => d.id === id);
}

// Sections that paint their own full-bleed background — never re-coloured.
const OWN_BACKGROUND = new Set(["hero", "banner", "cta", "imageBanner", "countdown", "stats", "video", "map"]);

export function designTheme(theme: ThemeConfig, id: string): ThemeConfig {
  const d = getDesign(id);
  if (!d || d.id === "classic") return theme;
  return { colors: d.palette(theme.colors), font: d.font || theme.font, radius: d.radius || theme.radius };
}

export function designHeader(header: HeaderConfig, id: string): HeaderConfig {
  const d = getDesign(id);
  return d && d.id !== "classic" ? { ...header, design: d.header } : header;
}

export function designFooter(footer: FooterConfig, id: string): FooterConfig {
  const d = getDesign(id);
  return d && d.id !== "classic" ? { ...footer, design: d.footer } : footer;
}

/**
 * Re-dress one page's sections. Works on both parsed seeds and DB rows (JSON
 * strings) via the two small adapters below. `index` counts content sections
 * only, so the alternating background rhythm stays even around heroes/CTAs.
 */
function dressSection<C extends { variant?: string }>(
  type: string,
  content: C,
  style: SectionStyle,
  index: number,
  d: Design,
): { content: C; style: SectionStyle } {
  if (d.id === "classic") return { content, style };
  let nextContent = content;
  // slideshow/custom heroes carry their own layout data — leave them alone.
  if (type === "hero" && d.hero && content.variant !== "slideshow" && content.variant !== "custom") {
    nextContent = { ...content, variant: d.hero };
  }
  const preset: SectionStyle = { ...d.cards };
  if (!OWN_BACKGROUND.has(type)) {
    const bg = d.rhythm(index);
    if (bg) preset.background = bg;
  }
  // Explicit per-section choices always win over the preset.
  return { content: nextContent, style: { ...preset, ...style } };
}

/** Rows as stored in the DB (content/style are JSON strings). */
export function designSections<S extends { type: string; content: string; style?: string | null }>(
  sections: S[],
  id: string,
): S[] {
  const d = getDesign(id);
  if (!d || d.id === "classic") return sections;
  let n = 0;
  return sections.map((s) => {
    const idx = OWN_BACKGROUND.has(s.type) ? 0 : n++;
    const content = safeParse(s.content) as { variant?: string };
    const style = safeParse(s.style ?? "{}") as SectionStyle;
    const out = dressSection(s.type, content, style, idx, d);
    return { ...s, content: JSON.stringify(out.content), style: JSON.stringify(out.style) };
  });
}

/** Parsed section seeds (provisioning) — same rules as designSections. */
export function designSeeds<S extends { type: string; content: unknown; style?: SectionStyle }>(sections: S[], id: string): S[] {
  const d = getDesign(id);
  if (!d || d.id === "classic") return sections;
  let n = 0;
  return sections.map((s) => {
    const idx = OWN_BACKGROUND.has(s.type) ? 0 : n++;
    const out = dressSection(s.type, (s.content ?? {}) as { variant?: string }, s.style ?? {}, idx, d);
    return { ...s, content: out.content, style: out.style };
  });
}

function safeParse(raw: string): Record<string, unknown> {
  try {
    const v = JSON.parse(raw || "{}");
    return v && typeof v === "object" ? v : {};
  } catch {
    return {};
  }
}
