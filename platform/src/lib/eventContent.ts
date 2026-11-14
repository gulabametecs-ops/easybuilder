export type EventDoc = { label: string; url: string };

export type EventBlock =
  | { type: "heading"; text: string }
  | { type: "text"; text: string }
  | { type: "image"; url: string; caption: string }
  | { type: "gallery"; urls: string[] }
  | { type: "document"; label: string; url: string }
  | { type: "qr"; image: string; caption: string }
  | { type: "html"; html: string };

export type EventStatusKind = "auto" | "upcoming" | "completed";

export function parseDocs(raw: string): EventDoc[] {
  try {
    const v = JSON.parse(raw || "[]") as unknown;
    if (!Array.isArray(v)) return [];
    return v
      .map((d) => {
        if (!d || typeof d !== "object") return null;
        const o = d as { label?: string; url?: string };
        if (!o.url) return null;
        return { label: o.label || "Document", url: o.url };
      })
      .filter((d): d is EventDoc => !!d);
  } catch {
    return [];
  }
}

export function parseStringList(raw: string): string[] {
  try {
    const v = JSON.parse(raw || "[]") as unknown;
    return Array.isArray(v) ? v.map(String).filter(Boolean) : [];
  } catch {
    return [];
  }
}

export function parseBlocks(raw: string): EventBlock[] {
  try {
    const v = JSON.parse(raw || "[]") as unknown;
    if (!Array.isArray(v)) return [];
    return v
      .map((b): EventBlock | null => {
        if (!b || typeof b !== "object") return null;
        const o = b as Record<string, unknown>;
        const type = String(o.type || "");
        if (type === "heading") return { type, text: String(o.text || "") };
        if (type === "text") return { type, text: String(o.text || "") };
        if (type === "image") return { type, url: String(o.url || ""), caption: String(o.caption || "") };
        if (type === "gallery") {
          const urls = Array.isArray(o.urls) ? o.urls.map(String).filter(Boolean) : [];
          return { type, urls };
        }
        if (type === "document") return { type, label: String(o.label || "Document"), url: String(o.url || "") };
        if (type === "qr") return { type, image: String(o.image || ""), caption: String(o.caption || "") };
        if (type === "html") return { type, html: String(o.html || "") };
        return null;
      })
      .filter((b): b is EventBlock => !!b);
  } catch {
    return [];
  }
}

export function resolveEventKind(date: string, status: string): "upcoming" | "completed" {
  if (status === "upcoming" || status === "completed") return status;
  if (!date) return "upcoming";
  const t = new Date(date).getTime();
  if (Number.isNaN(t)) return "upcoming";
  return t >= Date.now() - 24 * 3600 * 1000 ? "upcoming" : "completed";
}

export function mapsHref(location: string, mapUrl: string): string {
  const custom = (mapUrl || "").trim();
  if (custom) return custom;
  if (!location) return "";
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`;
}

export function formatEventDate(date: string): string {
  if (!date) return "";
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return date;
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
}
