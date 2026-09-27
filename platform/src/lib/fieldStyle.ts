import type { CSSProperties } from "react";

/** Per-field / per-card look — stored in content.__styles[field] or item.__style */
export type FieldStyle = {
  color?: string;
  fontSize?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl";
  fontWeight?: "normal" | "medium" | "semibold" | "bold" | "extrabold";
  align?: "left" | "center" | "right";
  italic?: boolean;
  underline?: boolean;
  uppercase?: boolean;
  letterSpacing?: "tight" | "normal" | "wide";
  lineHeight?: "tight" | "normal" | "relaxed";
  opacity?: number; // 0–100
  bg?: string;
  borderColor?: string;
  borderWidth?: number;
  radius?: "none" | "sm" | "md" | "lg" | "full";
  shadow?: "none" | "sm" | "md" | "lg";
  padding?: "sm" | "md" | "lg";
};

const FONT_SIZE: Record<NonNullable<FieldStyle["fontSize"]>, string> = {
  sm: "0.875rem",
  md: "1rem",
  lg: "1.125rem",
  xl: "1.25rem",
  "2xl": "1.5rem",
  "3xl": "1.875rem",
  "4xl": "2.25rem",
};

const FONT_WEIGHT: Record<NonNullable<FieldStyle["fontWeight"]>, string> = {
  normal: "400",
  medium: "500",
  semibold: "600",
  bold: "700",
  extrabold: "800",
};

const RADIUS: Record<NonNullable<FieldStyle["radius"]>, string> = {
  none: "0",
  sm: "0.5rem",
  md: "0.75rem",
  lg: "1.25rem",
  full: "9999px",
};

const SHADOW: Record<NonNullable<FieldStyle["shadow"]>, string> = {
  none: "none",
  sm: "0 1px 2px rgb(0 0 0 / 0.06)",
  md: "0 4px 14px rgb(0 0 0 / 0.08)",
  lg: "0 12px 28px rgb(0 0 0 / 0.12)",
};

const PAD: Record<NonNullable<FieldStyle["padding"]>, string> = {
  sm: "0.75rem",
  md: "1rem",
  lg: "1.5rem",
};

const TRACKING: Record<NonNullable<FieldStyle["letterSpacing"]>, string> = {
  tight: "-0.025em",
  normal: "0",
  wide: "0.08em",
};

const LEADING: Record<NonNullable<FieldStyle["lineHeight"]>, string> = {
  tight: "1.25",
  normal: "1.5",
  relaxed: "1.75",
};

export function isFieldStyleEmpty(s?: FieldStyle | null): boolean {
  if (!s) return true;
  return Object.values(s).every((v) => v === undefined || v === "" || v === null);
}

export function readContentStyles(content: unknown): Record<string, FieldStyle> {
  if (!content || typeof content !== "object") return {};
  const raw = (content as Record<string, unknown>).__styles;
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};
  return raw as Record<string, FieldStyle>;
}

export function readItemStyle(item: unknown): FieldStyle | undefined {
  if (!item || typeof item !== "object") return undefined;
  const s = (item as Record<string, unknown>).__style;
  if (!s || typeof s !== "object") return undefined;
  return s as FieldStyle;
}

/**
 * CSS vars + data-fs marker. globals.css applies them with !important
 * so they beat unlayered .text-primary / heading rules.
 * Also sets direct properties as a fallback when data-fs CSS can't run.
 */
export function textStyleCss(s?: FieldStyle | null): CSSProperties {
  if (!s || isFieldStyleEmpty(s)) return {};
  const out: CSSProperties & Record<string, string> = {};
  if (s.color) {
    out.color = s.color;
    out["--fs-color"] = s.color;
  }
  if (s.fontSize) {
    out.fontSize = FONT_SIZE[s.fontSize];
    out["--fs-size"] = FONT_SIZE[s.fontSize];
  }
  if (s.fontWeight) {
    out.fontWeight = FONT_WEIGHT[s.fontWeight] as unknown as number;
    out["--fs-weight"] = FONT_WEIGHT[s.fontWeight];
  }
  if (s.align) {
    out.textAlign = s.align;
    out["--fs-align"] = s.align;
  }
  if (s.italic === true) {
    out.fontStyle = "italic";
    out["--fs-style"] = "italic";
  } else if (s.italic === false) {
    out.fontStyle = "normal";
    out["--fs-style"] = "normal";
  }
  if (s.underline === true) {
    out.textDecoration = "underline";
    out["--fs-decoration"] = "underline";
  } else if (s.underline === false) {
    out.textDecoration = "none";
    out["--fs-decoration"] = "none";
  }
  if (s.uppercase === true) {
    out.textTransform = "uppercase";
    out["--fs-transform"] = "uppercase";
  } else if (s.uppercase === false) {
    out.textTransform = "none";
    out["--fs-transform"] = "none";
  }
  if (s.letterSpacing) {
    out.letterSpacing = TRACKING[s.letterSpacing];
    out["--fs-tracking"] = TRACKING[s.letterSpacing];
  }
  if (s.lineHeight) {
    out.lineHeight = LEADING[s.lineHeight];
    out["--fs-leading"] = LEADING[s.lineHeight];
  }
  if (s.opacity != null) {
    const o = String(Math.min(100, Math.max(0, s.opacity)) / 100);
    out.opacity = Number(o);
    out["--fs-opacity"] = o;
  }
  return out;
}

export function textStyleProps(s?: FieldStyle | null): { style?: CSSProperties; "data-fs"?: string } {
  const style = textStyleCss(s);
  if (!Object.keys(style).length) return {};
  return { style, "data-fs": "1" };
}

/** Card / box CSS */
export function cardStyleCss(s?: FieldStyle | null): CSSProperties {
  if (!s || isFieldStyleEmpty(s)) return {};
  const out: CSSProperties = { ...textStyleCss(s) };
  if (s.bg) out.background = s.bg;
  if (s.borderColor) out.borderColor = s.borderColor;
  if (s.borderWidth != null) {
    out.borderWidth = s.borderWidth;
    out.borderStyle = "solid";
  }
  if (s.radius) out.borderRadius = RADIUS[s.radius];
  if (s.shadow) out.boxShadow = SHADOW[s.shadow];
  if (s.padding) out.padding = PAD[s.padding];
  if (s.align) out.textAlign = s.align;
  if (s.color) out.color = s.color;
  return out;
}

export function headingStylesFrom(content: unknown) {
  const s = readContentStyles(content);
  return {
    eyebrow: s.eyebrow,
    title: s.title,
    titleHighlight: s.titleHighlight,
  };
}

/** Site theme colours used to mirror live website look in the brush UI. */
export type FieldStyleColors = {
  primary: string;
  primaryDark?: string;
  secondary?: string;
  accent?: string;
  dark?: string;
  light?: string;
  text: string;
  heading: string;
};

/**
 * Website defaults for a content field — what the live site uses before any
 * brush override. Shown as the starting selection in FieldStyleButton.
 */
export function websiteFieldDefaults(
  fieldKey: string,
  colors: FieldStyleColors,
  mode: "text" | "card" = "text",
): FieldStyle {
  const k = fieldKey.toLowerCase();

  if (mode === "card") {
    return {
      color: colors.text,
      fontSize: "md",
      fontWeight: "normal",
      align: "left",
      bg: "#ffffff",
      borderColor: "#e2e8f0",
      borderWidth: 1,
      radius: "md",
      shadow: "sm",
      padding: "md",
    };
  }

  // Eyebrow / badge / accent labels → brand primary, small, uppercase
  if (
    k === "eyebrow" ||
    k === "badge" ||
    k === "titlehighlight" ||
    k.endsWith("highlight")
  ) {
    return {
      color: colors.primary,
      fontSize: k === "titlehighlight" || k.endsWith("highlight") ? "3xl" : "sm",
      fontWeight: k === "titlehighlight" || k.endsWith("highlight") ? "extrabold" : "semibold",
      uppercase: k === "eyebrow" || k === "badge",
      letterSpacing: k === "eyebrow" || k === "badge" ? "wide" : undefined,
      align: "center",
    };
  }

  // Main titles / names
  if (
    k === "title" ||
    k === "titletop" ||
    k === "name" ||
    k === "heading" ||
    k === "day" ||
    k === "question" ||
    k === "q"
  ) {
    return {
      color: colors.heading,
      fontSize: "3xl",
      fontWeight: "extrabold",
      align: "center",
    };
  }

  // Prices / stats
  if (k === "price" || k === "stat" || k === "number") {
    return {
      color: colors.heading,
      fontSize: "xl",
      fontWeight: "bold",
    };
  }

  // Big stat numbers (usually on dark bands)
  if (k === "value") {
    return {
      color: "#ffffff",
      fontSize: "3xl",
      fontWeight: "extrabold",
      align: "center",
    };
  }

  if (k === "label") {
    return {
      color: "#ffffff",
      fontSize: "sm",
      fontWeight: "normal",
      opacity: 60,
      align: "center",
    };
  }

  // Buttons / CTAs
  if (k === "buttonlabel" || k === "label" || k.endsWith("btn") || k.includes("button")) {
    return {
      color: colors.heading,
      fontSize: "md",
      fontWeight: "semibold",
    };
  }

  // Roles / meta
  if (k === "role" || k === "category" || k === "meta" || k === "caption") {
    return {
      color: colors.text,
      fontSize: "sm",
      fontWeight: "medium",
    };
  }

  // Body copy
  if (
    k === "description" ||
    k === "text" ||
    k === "subtitle" ||
    k === "body" ||
    k === "note" ||
    k === "a" ||
    k === "answer" ||
    k === "content"
  ) {
    return {
      color: colors.text,
      fontSize: "md",
      fontWeight: "normal",
      lineHeight: "relaxed",
      align: "left",
    };
  }

  // Generic string fields
  return {
    color: colors.text,
    fontSize: "md",
    fontWeight: "normal",
  };
}

/** Merge website defaults under saved overrides for brush UI display. */
export function mergeFieldStyle(
  defaults?: FieldStyle | null,
  value?: FieldStyle | null,
): FieldStyle {
  return { ...(defaults ?? {}), ...(value ?? {}) };
}
