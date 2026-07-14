import type { CSSProperties } from "react";
import type { ThemeConfig } from "@/lib/config";

// Turns a tenant's ThemeConfig into inline CSS custom properties applied to the
// .site-root wrapper, so all child components inherit the tenant's palette.
export function themeToStyle(theme: ThemeConfig): CSSProperties {
  const c = theme.colors;
  return {
    ["--c-primary" as string]: c.primary,
    ["--c-primary-dark" as string]: c.primaryDark,
    ["--c-secondary" as string]: c.secondary,
    ["--c-accent" as string]: c.accent,
    ["--c-dark" as string]: c.dark,
    ["--c-light" as string]: c.light,
    ["--c-text" as string]: c.text,
    ["--c-heading" as string]: c.heading,
    ["--site-radius" as string]: theme.radius,
    ["--site-font" as string]: `"${theme.font}", ui-sans-serif, system-ui, sans-serif`,
  };
}

// Builds a Google Fonts stylesheet URL for the tenant's chosen font.
export function googleFontHref(font: string): string {
  const family = font.trim().replace(/\s+/g, "+");
  return `https://fonts.googleapis.com/css2?family=${family}:wght@300;400;500;600;700;800&display=swap`;
}
