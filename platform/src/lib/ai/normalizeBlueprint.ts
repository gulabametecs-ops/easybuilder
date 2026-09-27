import { isAllowedSectionType } from "./builderRegistry";
import { PAGE_TEMPLATES } from "@/lib/pageTemplates";
import { websiteBlueprintSchema, type WebsiteBlueprint } from "./blueprintSchema";

const VALID_TEMPLATES = new Set(PAGE_TEMPLATES.map((t) => t.id));

const SECTION_ALIASES: Record<string, string> = {
  services: "serviceCategories",
  service: "serviceCategories",
  servicecategories: "serviceCategories",
  contact: "contactForm",
  contactus: "contactForm",
  contactform: "contactForm",
  pricing: "pricingPlans",
  prices: "pricingPlans",
  plans: "pricingPlans",
  pricingplans: "pricingPlans",
  menu: "priceList",
  pricelist: "priceList",
  portfolio: "gallery",
  photos: "gallery",
  donate: "cta",
  donation: "cta",
  volunteer: "cta",
  hours: "openingHours",
  openinghours: "openingHours",
  booking: "appointmentForm",
  appointment: "appointmentForm",
  form: "contactForm",
  quote: "quoteForm",
  reviews: "testimonials",
  testimonial: "testimonials",
  team: "team",
  faculty: "team",
  doctors: "team",
  aboutus: "about",
  heroBanner: "hero",
  herosection: "hero",
  notices: "noticeBoard",
  noticeboard: "noticeBoard",
  results: "toppers",
  toppers: "toppers",
  mapembed: "map",
  location: "map",
  html: "richText",
  text: "richText",
};

function clip(value: unknown, max: number, fallback = ""): string {
  if (typeof value === "number") return String(value).slice(0, max);
  if (typeof value !== "string") return fallback;
  const t = value.trim();
  return t.length > max ? t.slice(0, max) : t;
}

function asStyle(value: unknown): Record<string, unknown> | undefined {
  if (typeof value === "string") {
    const t = value.trim().toLowerCase();
    if (["default", "light", "dark", "primary"].includes(t)) return { background: t };
    return undefined;
  }
  return asRecord(value);
}

function asRecord(value: unknown): Record<string, unknown> | undefined {
  if (!value) return undefined;
  if (Array.isArray(value)) return undefined;
  if (typeof value === "string") {
    const t = value.trim();
    if (!t) return undefined;
    try {
      const parsed = JSON.parse(t);
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        return parsed as Record<string, unknown>;
      }
    } catch {
      /* use as heading */
    }
    return { heading: t.slice(0, 120) };
  }
  if (typeof value === "object") return value as Record<string, unknown>;
  return undefined;
}

function resolveSectionType(raw: unknown): string | null {
  const type = clip(raw, 60).replace(/[\s_-]+/g, "");
  if (!type) return null;
  const lower = type.toLowerCase();
  const aliased = SECTION_ALIASES[lower] ?? (typeof raw === "string" ? raw.trim() : type);
  if (isAllowedSectionType(aliased)) return aliased;
  if (isAllowedSectionType(lower)) return lower;
  return null;
}

function normalizeSection(raw: unknown) {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
  const s = raw as Record<string, unknown>;
  const sectionType = resolveSectionType(s.sectionType ?? s.type ?? s.section);
  if (!sectionType) return null;

  let imageIntent: { imageIntent?: string; alt?: string } | undefined;
  if (typeof s.imageIntent === "string") {
    imageIntent = { imageIntent: clip(s.imageIntent, 200) };
  } else if (s.imageIntent && typeof s.imageIntent === "object") {
    const img = s.imageIntent as Record<string, unknown>;
    imageIntent = {
      imageIntent: clip(img.imageIntent ?? img.keywords ?? img.query, 200) || undefined,
      alt: clip(img.alt, 200) || undefined,
    };
  }

  const styleRaw = asStyle(s.style);
  return {
    sectionType,
    variant: clip(s.variant, 40) || undefined,
    style: styleRaw,
    content: asRecord(s.content),
    imageIntent,
  };
}

function normalizePage(raw: unknown, index: number) {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
  const p = raw as Record<string, unknown>;
  const name = clip(p.name ?? p.title ?? p.label, 120, index === 0 ? "Home" : `Page ${index + 1}`);
  if (!name) return null;
  const slugRaw = clip(p.slug ?? p.path ?? p.href, 80);
  const slug = slugRaw.replace(/^\/+/, "") || (index === 0 ? "home" : name.toLowerCase().replace(/[^a-z0-9]+/g, "-"));
  const sectionsIn = Array.isArray(p.sections) ? p.sections : [];
  const sections = sectionsIn.map(normalizeSection).filter((s): s is NonNullable<typeof s> => !!s);
  const tpl = clip(p.pageTemplateId ?? p.templateId ?? p.template, 40);
  return {
    name,
    slug: slug.slice(0, 80),
    pageTemplateId: tpl && VALID_TEMPLATES.has(tpl) ? tpl : undefined,
    showInNav: typeof p.showInNav === "boolean" ? p.showInNav : undefined,
    published: typeof p.published === "boolean" ? p.published : undefined,
    sections,
  };
}

function unwrap(raw: unknown): Record<string, unknown> | null {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
  const obj = raw as Record<string, unknown>;
  if (obj.website || obj.pages) return obj;
  if (obj.blueprint && typeof obj.blueprint === "object") return unwrap(obj.blueprint);
  if (obj.data && typeof obj.data === "object") return unwrap(obj.data);
  if (obj.plan && typeof obj.plan === "object") return unwrap(obj.plan);
  return obj;
}

/** Coerce messy Groq JSON into something Zod can accept. */
export function normalizeBlueprint(raw: unknown): WebsiteBlueprint | null {
  const root = unwrap(raw);
  if (!root) return null;

  const websiteIn =
    root.website && typeof root.website === "object" && !Array.isArray(root.website)
      ? (root.website as Record<string, unknown>)
      : {};

  const name = clip(websiteIn.name ?? root.name ?? "My Website", 120, "My Website");
  const pagesIn = Array.isArray(root.pages) ? root.pages : [];
  const pages = pagesIn
    .map(normalizePage)
    .filter((p): p is NonNullable<typeof p> => !!p)
    .slice(0, 12);
  if (pages.length === 0) {
    pages.push({
      name: "Home",
      slug: "home",
      pageTemplateId: "landing",
      showInNav: true,
      published: true,
      sections: [{ sectionType: "hero", variant: undefined, style: undefined, content: { heading: name }, imageIntent: undefined }],
    });
  }

  const servicesIn = Array.isArray(root.services) ? root.services : [];
  const services = servicesIn
    .filter((s) => s && typeof s === "object" && !Array.isArray(s))
    .slice(0, 40)
    .map((s) => {
      const row = s as Record<string, unknown>;
      return {
        category: clip(row.category, 80, "Services") || "Services",
        title: clip(row.title ?? row.name, 120, "Service") || "Service",
        description: clip(row.description ?? row.body, 500),
      };
    });

  const questionsIn = Array.isArray(root.questions) ? root.questions : [];
  const questions = questionsIn
    .map((q) => clip(typeof q === "object" && q && "q" in (q as object) ? (q as { q: unknown }).q : q, 200))
    .filter(Boolean)
    .slice(0, 8);

  const designIn =
    root.design && typeof root.design === "object" && !Array.isArray(root.design)
      ? (root.design as Record<string, unknown>)
      : undefined;

  const candidate = {
    website: {
      name,
      type: clip(websiteIn.type, 80) || undefined,
      description: clip(websiteIn.description ?? websiteIn.tagline, 500) || undefined,
      logoImage: clip(websiteIn.logoImage ?? websiteIn.logo, 2000) || undefined,
    },
    design: designIn
      ? {
          style: clip(designIn.style ?? designIn.theme, 80) || undefined,
          theme: clip(designIn.theme, 40) || undefined,
          primaryColor: clip(designIn.primaryColor ?? designIn.primary, 20) || undefined,
          secondaryColor: clip(designIn.secondaryColor ?? designIn.secondary, 20) || undefined,
          fontStyle: clip(designIn.fontStyle ?? designIn.font, 60) || undefined,
          borderRadius: clip(designIn.borderRadius, 20) || undefined,
          spacing: clip(designIn.spacing, 20) || undefined,
          animationLevel: clip(designIn.animationLevel, 20) || undefined,
        }
      : undefined,
    services: services.length ? services : undefined,
    pages,
    questions: questions.length ? questions : undefined,
  };

  const parsed = websiteBlueprintSchema.safeParse(candidate);
  return parsed.success ? parsed.data : null;
}
