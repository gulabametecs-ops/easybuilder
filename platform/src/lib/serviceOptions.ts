// Service "variety" options (Size, Colour, Finish…) stored as JSON on Service.options. Client-safe.
// `colors` turns a group into colour swatches; `images` swaps the product photo when a value is picked.
export type ServiceOption = {
  name: string;
  values: string[];
  images?: Record<string, string>; // value → photo URL
  colors?: Record<string, string>; // value → #hex swatch
};

const clip = (v: unknown, n: number) => (typeof v === "string" ? v.trim().slice(0, n) : "");
const safeUrl = (v: unknown) => {
  const s = clip(v, 2000);
  return s.startsWith("/") || /^https:\/\//i.test(s) ? s : "";
};
const hex = (v: unknown) => (typeof v === "string" && /^#[0-9a-f]{3,8}$/i.test(v.trim()) ? v.trim() : "");

function pickMap(raw: unknown, values: string[], fn: (v: unknown) => string): Record<string, string> | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const out: Record<string, string> = {};
  for (const v of values) {
    const x = fn((raw as Record<string, unknown>)[v]);
    if (x) out[v] = x;
  }
  return Object.keys(out).length ? out : undefined;
}

/** Parse + sanitise: max 6 groups × 30 values, short strings, safe image URLs, hex colours. Never throws. */
export function parseServiceOptions(raw: unknown): ServiceOption[] {
  let v: unknown = raw;
  if (typeof raw === "string") {
    try { v = JSON.parse(raw || "[]"); } catch { return []; }
  }
  if (!Array.isArray(v)) return [];
  return v
    .slice(0, 6)
    .map((g) => {
      const o = g as ServiceOption;
      const name = clip(o?.name, 40);
      const values = Array.isArray(o?.values) ? [...new Set(o.values.map((x) => clip(x, 60)).filter(Boolean))].slice(0, 30) : [];
      const images = pickMap(o?.images, values, safeUrl);
      const colors = pickMap(o?.colors, values, hex);
      return { name, values, ...(images ? { images } : {}), ...(colors ? { colors } : {}) };
    })
    .filter((g) => g.name && g.values.length);
}

/** Common colour names → swatch, used when a colour group has no explicit hex. */
export const COLOR_NAMES: Record<string, string> = {
  steel: "#b8bec5", "stainless steel": "#b8bec5", silver: "#c0c4c8", black: "#1c1d20", "matte black": "#26272b",
  "graphite grey": "#4a4f55", graphite: "#4a4f55", grey: "#8a9098", gray: "#8a9098", white: "#f6f6f4", beige: "#d9c7a7",
  brown: "#6f4e37", gold: "#c9a24a", copper: "#b8734a", "rose gold": "#c98f7e", chrome: "#d4d8dc", "brushed steel": "#a8adb3",
  blue: "#2f5d8a", green: "#3f6b4f", red: "#a33a32", cream: "#efe6d2",
};
export const isColorGroup = (g: ServiceOption) => !!g.colors || /colou?r/i.test(g.name);
export const swatchOf = (g: ServiceOption, v: string) => g.colors?.[v] ?? COLOR_NAMES[v.toLowerCase()] ?? "";

/** "Size: Large · Finish: Matte" for enquiries / WhatsApp. */
export function describeSelection(sel: Record<string, string>): string {
  return Object.entries(sel).filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`).join(" · ");
}
