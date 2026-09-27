import { SECTION_DEFAULTS } from "@/lib/sectionDefaults";
import { getPageTemplate } from "@/lib/pageTemplates";
import { IMAGE_SLOTS, placeholderImage } from "@/lib/img";
import type { SectionType, ThemeConfig, SectionStyle } from "@/lib/config";
import type { WebsiteBlueprint, blueprintSectionSchema } from "./blueprintSchema";
import { isAllowedSectionType } from "./builderRegistry";
import { z } from "zod";
import { defaultTheme } from "@/lib/template";
import { normalizeSectionContent } from "./mapSectionContent";

type BlueprintSection = z.infer<typeof blueprintSectionSchema>;

function fillEmptyImages(obj: Record<string, unknown>, type: SectionType) {
  const top = IMAGE_SLOTS[type] ?? { w: 800, h: 600 };
  const walk = (node: unknown, ctx: { slides?: boolean; items?: boolean }) => {
    if (Array.isArray(node)) {
      for (const item of node) walk(item, ctx);
      return;
    }
    if (!node || typeof node !== "object") return;
    const rec = node as Record<string, unknown>;
    for (const [k, v] of Object.entries(rec)) {
      if (k === "image" && typeof v === "string" && !v.trim()) {
        let slot = top;
        if (ctx.slides) slot = IMAGE_SLOTS.hero;
        else if (type === "team" && ctx.items) slot = IMAGE_SLOTS.team;
        else if (type === "toppers" && ctx.items) slot = IMAGE_SLOTS.toppers;
        rec[k] = placeholderImage(slot.w, slot.h);
      } else if (k === "slides") walk(v, { ...ctx, slides: true });
      else if (k === "items") walk(v, { ...ctx, items: true });
      else walk(v, ctx);
    }
  };
  walk(obj, {});
}

function asBtnRecord(v: unknown): Record<string, unknown> | undefined {
  if (!v || typeof v !== "object" || Array.isArray(v)) return undefined;
  return v as Record<string, unknown>;
}

function mergeNavBtn(base: unknown, overlay: unknown, fallbackHref: string): { label: string; href: string } {
  const b = asBtnRecord(base) ?? {};
  const o = asBtnRecord(overlay) ?? {};
  const label = String(o.label ?? b.label ?? "Learn more");
  const href = String(o.href ?? o.link ?? b.href ?? fallbackHref) || fallbackHref;
  return { label, href };
}

function mergeContent<T extends SectionType>(type: T, partial: Record<string, unknown> | undefined, imageIntent?: string): string {
  const mapped = normalizeSectionContent(type, partial);
  const base = { ...(SECTION_DEFAULTS[type] as Record<string, unknown>) };
  const merged = { ...base, ...mapped };
  if (type === "hero") {
    if (mapped.badge === "") merged.badge = "";
    merged.primaryBtn = mergeNavBtn(base.primaryBtn, mapped.primaryBtn, "/contact");
    merged.secondaryBtn = mergeNavBtn(base.secondaryBtn, mapped.secondaryBtn, "/about");
  }
  if (type === "cta" && (merged.buttonHref == null || merged.buttonHref === "")) {
    merged.buttonHref = "/contact";
  }
  fillEmptyImages(merged, type);
  void imageIntent;
  return JSON.stringify(merged);
}

export function designToTheme(design: WebsiteBlueprint["design"], base: ThemeConfig = defaultTheme): ThemeConfig {
  if (!design) return base;
  const next = { ...base, colors: { ...base.colors } };
  const style = (design.style ?? design.theme ?? "").toLowerCase();

  if (design.primaryColor) {
    next.colors.primary = design.primaryColor;
    next.colors.primaryDark = design.primaryColor;
    next.colors.accent = design.primaryColor;
  }
  if (design.secondaryColor) {
    next.colors.secondary = design.secondaryColor;
    next.colors.heading = design.secondaryColor;
    next.colors.dark = design.secondaryColor;
  }

  const lockPalette = !!(design.primaryColor || design.secondaryColor);
  if (!lockPalette && (style.includes("dark") || style.includes("luxury") || style.includes("premium"))) {
    next.colors.dark = "#0a0f0d";
    next.colors.light = "#141a16";
    next.colors.heading = "#f8fafc";
    next.colors.text = "#cbd5e1";
  }
  if (!lockPalette && (style.includes("light") || style.includes("minimal"))) {
    next.colors.light = "#f8faf6";
    next.colors.dark = "#1e293b";
    next.colors.text = "#475569";
    next.colors.heading = "#0f172a";
  }
  if (!design.primaryColor && (style.includes("gold") || style.includes("luxury"))) {
    next.colors.accent = "#d4af37";
    next.colors.primary = "#c9a227";
  }
  if (design.fontStyle) {
    const f = design.fontStyle.toLowerCase();
    if (f.includes("serif") || f.includes("elegant") || f.includes("luxury")) next.font = "Playfair Display";
    else if (f.includes("modern") || f.includes("saas")) next.font = "Inter";
    else if (f.includes("bold") || f.includes("corporate")) next.font = "Poppins";
  }
  if (design.borderRadius) next.radius = design.borderRadius;

  return next;
}

export function styleFromDesign(design: WebsiteBlueprint["design"]): Partial<SectionStyle> {
  const style = (design?.style ?? "").toLowerCase();
  if (style.includes("dark") || style.includes("premium") || style.includes("luxury")) {
    return { background: "dark" };
  }
  if (style.includes("light") || style.includes("minimal")) {
    return { background: "light" };
  }
  return {};
}

export function resolvePageSections(
  page: WebsiteBlueprint["pages"][number],
  design?: WebsiteBlueprint["design"],
): { type: SectionType; content: string; style: string }[] {
  const defaultStyle = styleFromDesign(design);
  const styleJson = JSON.stringify(defaultStyle);

  // Prefer the AI's own sections. Templates only fill pages that have no sections yet.
  const aiSections = page.sections ?? [];
  if (aiSections.length > 0) {
    const mapped = aiSections
      .filter((s) => isAllowedSectionType(s.sectionType))
      .map((s) => ({
        type: s.sectionType as SectionType,
        content: mergeContent(s.sectionType as SectionType, s.content, s.imageIntent?.imageIntent),
        style: JSON.stringify({ ...defaultStyle, ...(s.style ?? {}) }),
      }));
    if (mapped.length > 0) return mapped;
  }

  if (page.pageTemplateId) {
    const tpl = getPageTemplate(page.pageTemplateId);
    const aiSections = page.sections ?? [];
    return tpl.sections.map((type, i) => {
      const ai = aiSections.find((s) => s.sectionType === type) ?? aiSections[i];
      const content = mergeContent(type, ai?.content, ai?.imageIntent?.imageIntent);
      const style = JSON.stringify({ ...defaultStyle, ...(ai?.style ?? {}) });
      return { type, content, style };
    });
  }

  const sections = page.sections ?? [];
  return sections
    .filter((s) => isAllowedSectionType(s.sectionType))
    .map((s) => ({
      type: s.sectionType as SectionType,
      content: mergeContent(s.sectionType as SectionType, s.content, s.imageIntent?.imageIntent),
      style: JSON.stringify({ ...defaultStyle, ...(s.style ?? {}) }),
    }));
}

export function slugify(input: string): string {
  return input.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "page";
}
