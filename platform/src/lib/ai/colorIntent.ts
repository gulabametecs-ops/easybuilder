// Colour-only refine requests ("make it blue", "change the colour theme") are handled
// instantly on the client — no AI round-trip, no invalid JSON, no rate limits.

type Palette = { name: string; primary: string; secondary: string };

// primary = vivid accent for buttons; secondary = very dark shade for hero/footer/headings.
const PALETTES: Record<string, Palette> = {
  blue: { name: "Blue", primary: "#2563eb", secondary: "#0f172a" },
  navy: { name: "Navy", primary: "#3b82f6", secondary: "#0b1b3a" },
  red: { name: "Red", primary: "#dc2626", secondary: "#1c0a0a" },
  maroon: { name: "Maroon", primary: "#be123c", secondary: "#2a0a14" },
  green: { name: "Green", primary: "#16a34a", secondary: "#052e16" },
  lime: { name: "Lime", primary: "#65a30d", secondary: "#0f2942" },
  teal: { name: "Teal", primary: "#0d9488", secondary: "#042f2e" },
  orange: { name: "Orange", primary: "#ea580c", secondary: "#1c1917" },
  yellow: { name: "Gold", primary: "#ca8a04", secondary: "#1c1917" },
  gold: { name: "Gold", primary: "#b8862e", secondary: "#1c1917" },
  purple: { name: "Purple", primary: "#7c3aed", secondary: "#1e1b4b" },
  violet: { name: "Violet", primary: "#8b5cf6", secondary: "#1e1b4b" },
  pink: { name: "Pink", primary: "#db2777", secondary: "#2a0a1f" },
  brown: { name: "Brown", primary: "#a16207", secondary: "#1c1410" },
  black: { name: "Black", primary: "#18181b", secondary: "#09090b" },
  grey: { name: "Grey", primary: "#475569", secondary: "#0f172a" },
  gray: { name: "Grey", primary: "#475569", secondary: "#0f172a" },
};
// Mood words without a colour name ("darker, premium style").
const MOODS: [RegExp, Palette][] = [
  [/\b(dark|darker|premium|luxury|luxurious|royal|rich|elegant|classy)\b/, { name: "premium dark (black & gold)", primary: "#c9a227", secondary: "#0a0a0f" }],
  [/\b(fresh|bright|light|lighter|vibrant|cheerful)\b/, { name: "fresh bright", primary: "#0ea5e9", secondary: "#0f172a" }],
  [/\b(calm|soft|pastel|minimal|clean)\b/, { name: "calm minimal", primary: "#0d9488", secondary: "#134e4a" }],
];
const ROTATION = ["blue", "teal", "purple", "orange", "red", "green", "navy", "pink"];

const COLOUR_WORD = /\b(colou?rs?|theme|palette|shade|tone)\b/i;
// Anything about content/structure goes to the AI instead.
const CONTENT_WORD = /\b(section|page|text|headline|heading|title|image|photo|add|remove|delete|faq|testimonial|pricing|gallery|button|menu|logo|font)\b/i;

export type ColorIntent = Palette;

/**
 * Returns a palette when the request is only about colours, else null.
 * `currentPrimary` lets "change the colour theme" rotate to a different palette.
 */
export function detectColorIntent(text: string, currentPrimary = ""): ColorIntent | null {
  const t = text.toLowerCase().trim();
  if (t.length > 120 || CONTENT_WORD.test(t)) return null;

  const named = Object.keys(PALETTES).find((k) => new RegExp(`\\b${k}\\b`).test(t));
  if (named && (COLOUR_WORD.test(t) || /\b(make|change|use|switch|turn)\b/.test(t) || t.split(/\s+/).length <= 3)) {
    return PALETTES[named];
  }
  if (!named) {
    const mood = MOODS.find(([re]) => re.test(t));
    if (mood && (COLOUR_WORD.test(t) || /\b(style|look|feel|design)\b/.test(t))) return mood[1];
  }
  if (!named && COLOUR_WORD.test(t)) {
    // No colour named: rotate to the next palette that differs from the current one.
    const cur = currentPrimary.toLowerCase();
    const idx = ROTATION.findIndex((k) => PALETTES[k].primary === cur);
    return PALETTES[ROTATION[(idx + 1) % ROTATION.length]];
  }
  return null;
}
