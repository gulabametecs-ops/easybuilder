// Service "variety" options (Size, Colour, Finish…) stored as JSON on Service.options. Client-safe.
export type ServiceOption = { name: string; values: string[] };

const clip = (v: unknown, n: number) => (typeof v === "string" ? v.trim().slice(0, n) : "");

/** Parse + sanitise: max 6 groups × 30 values, short strings, no empties/duplicates. Never throws. */
export function parseServiceOptions(raw: unknown): ServiceOption[] {
  let v: unknown = raw;
  if (typeof raw === "string") {
    try { v = JSON.parse(raw || "[]"); } catch { return []; }
  }
  if (!Array.isArray(v)) return [];
  return v
    .slice(0, 6)
    .map((g) => {
      const name = clip((g as ServiceOption)?.name, 40);
      const values = Array.isArray((g as ServiceOption)?.values)
        ? [...new Set((g as ServiceOption).values.map((x) => clip(x, 60)).filter(Boolean))].slice(0, 30)
        : [];
      return { name, values };
    })
    .filter((g) => g.name && g.values.length);
}

/** "Size: Large · Finish: Matte" for enquiries / WhatsApp. */
export function describeSelection(sel: Record<string, string>): string {
  return Object.entries(sel).filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`).join(" · ");
}
