import { SECTION_META, SECTION_DEFAULTS } from "@/lib/sectionDefaults";
import { PAGE_TEMPLATES } from "@/lib/pageTemplates";
import type { SectionType } from "@/lib/config";

/** Section types the renderer supports (excludes unrendered `html`). */
export const BUILDER_SECTION_TYPES = SECTION_META.map((m) => m.type);

export type BuilderCapabilityRegistry = {
  sections: { type: SectionType; label: string; description: string }[];
  pageTemplates: { id: string; label: string; description: string; sections: SectionType[] }[];
  themeFields: string[];
  stylePresets: string[];
  sectionStyleFields: string[];
};

let cached: BuilderCapabilityRegistry | null = null;

export function getBuilderRegistry(): BuilderCapabilityRegistry {
  if (cached) return cached;
  cached = {
    sections: SECTION_META.map((m) => ({ type: m.type, label: m.label, description: m.description })),
    pageTemplates: PAGE_TEMPLATES.map((t) => ({
      id: t.id,
      label: t.label,
      description: t.description,
      sections: t.sections,
    })),
    themeFields: ["colors.primary", "colors.primaryDark", "colors.secondary", "colors.accent", "colors.dark", "colors.light", "colors.text", "colors.heading", "font", "radius"],
    stylePresets: ["modern", "minimal", "premium", "corporate", "saas", "luxury", "bold", "creative", "professional", "elegant", "dark", "light", "colorful"],
    sectionStyleFields: ["background", "spacingTop", "spacingBottom", "align", "accentColor", "cardBg"],
  };
  return cached;
}

/** Compact text sent to Groq — not full defaults JSON. */
export function registryPromptBlock(): string {
  const r = getBuilderRegistry();
  const sections = r.sections.map((s) => `- ${s.type}: ${s.label}`).join("\n");
  const pages = r.pageTemplates.map((p) => `- ${p.id}: ${p.label} [${p.sections.join(", ")}]`).join("\n");
  return `AVAILABLE SECTION TYPES (use exact type ids only):
${sections}

PAGE TEMPLATE PRESETS (optional pageTemplateId):
${pages}

SECTION STYLE backgrounds: default | light | dark | primary
SECTION STYLE spacingTop: none | sm | default | lg | xl`;
}

export function isAllowedSectionType(type: string): type is SectionType {
  return type in SECTION_DEFAULTS && type !== "html";
}
