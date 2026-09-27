import type { WebsiteBlueprint } from "./blueprintSchema";
import { slugify } from "./hydrate";
import { normalizeSectionContent } from "./mapSectionContent";

const SLUG_ALIASES: Record<string, string> = {
  "about-us": "about",
  aboutus: "about",
  "home-page": "home",
  homepage: "home",
  "our-programs": "programs",
  programmes: "programs",
  program: "programs",
  "getinvolved": "get-involved",
  "get-in-touch": "contact",
  "contact-us": "contact",
  contactus: "contact",
};

export function canonicalPageSlug(slug: string, name?: string): string {
  const raw = slugify(slug || name || "page");
  if (raw === "home" || slug === "home" || slug === "/") return "home";
  return SLUG_ALIASES[raw] ?? raw;
}

type HomeSection = NonNullable<WebsiteBlueprint["pages"][number]["sections"]>[number];

function filled(v: unknown): boolean {
  if (v == null) return false;
  if (typeof v === "string") return v.trim().length > 0;
  if (Array.isArray(v)) return v.length > 0;
  if (typeof v === "object") return Object.keys(v as object).length > 0;
  return true;
}

function pickHomeTypes(type: string): string[] {
  const t = type.toLowerCase();
  if (t.includes("restaurant") || t.includes("cafe") || t.includes("hotel")) {
    return ["hero", "about", "priceList", "gallery", "testimonials", "cta"];
  }
  if (t.includes("school") || t.includes("coaching") || t.includes("college")) {
    return ["hero", "about", "stats", "serviceCategories", "testimonials", "cta"];
  }
  if (t.includes("clinic") || t.includes("hospital") || t.includes("health")) {
    return ["hero", "about", "serviceCategories", "team", "cta"];
  }
  if (t.includes("agency") || t.includes("saas") || t.includes("studio")) {
    return ["hero", "features", "serviceCategories", "testimonials", "cta"];
  }
  if (t.includes("ngo") || t.includes("charity") || t.includes("nonprofit") || t.includes("foundation")) {
    return ["hero", "about", "serviceCategories", "stats", "testimonials", "cta"];
  }
  return ["hero", "about", "features", "serviceCategories", "testimonials", "cta"];
}

function industryCopy(bp: WebsiteBlueprint): Record<string, Record<string, unknown>> {
  const name = bp.website.name;
  const type = (bp.website.type ?? "").toLowerCase();
  const desc = bp.website.description || `${name} — welcome to our official website.`;
  const cats = [...new Set((bp.services ?? []).map((s) => s.category).filter(Boolean))];
  const isNgo = /ngo|charity|nonprofit|foundation|trust/.test(type) || /ngo|charity/.test(name.toLowerCase());

  const programs = cats.length ? cats : isNgo ? ["Education", "Community Outreach"] : ["Our Services"];

  return {
    hero: normalizeSectionContent("hero", {
      badge: isNgo ? "Education · Community · Hope" : "",
      titleTop: isNgo ? `Welcome to` : name,
      titleHighlight: isNgo ? name : "We're here to help",
      description: desc,
      primaryBtn: isNgo
        ? { label: "Donate", href: "/contact" }
        : { label: "Contact Us", href: "/contact" },
      secondaryBtn: isNgo
        ? { label: "Our Programs", href: "/programs" }
        : { label: "Learn more", href: "/about" },
      features: isNgo
        ? [
            { icon: "users", title: "Children first", text: "Classroom support and care." },
            { icon: "heart", title: "Community led", text: "Local teams on the ground." },
          ]
        : [
            { icon: "badge-check", title: "Trusted", text: "Clear communication." },
            { icon: "clock", title: "Responsive", text: "We reply when you reach out." },
          ],
    }),
    about: normalizeSectionContent("about", {
      eyebrow: "ABOUT US",
      title: "Who we",
      titleHighlight: "are",
      body: [desc, `Every page on this site is built for ${name}. Add your story, photos and contact details from Admin after you buy.`],
      points: isNgo ? ["Transparent work", "Local teams", "Child safety"] : ["Clear communication", "Quality delivery"],
      buttonLabel: "Read more",
      buttonHref: "/about",
    }),
    features: {
      items: [
        { icon: "badge-check", title: "Clear process", text: `How ${name} works with you, step by step.` },
        { icon: "users", title: "People first", text: "Friendly support when you reach out." },
        { icon: "star", title: "Proven results", text: "Share real outcomes from your work here." },
      ],
    },
    serviceCategories: {
      eyebrow: isNgo ? "OUR WORK" : "WHAT WE OFFER",
      title: isNgo ? "Programs that" : "Our",
      titleHighlight: isNgo ? "change lives" : "Services",
      categories: programs,
    },
    stats: {
      items: isNgo
        ? [
            { value: "500+", label: "Children supported", icon: "users" },
            { value: "20+", label: "Communities", icon: "home" },
            { value: "10+", label: "Years of work", icon: "clock" },
          ]
        : [
            { value: "100+", label: "Happy clients", icon: "users" },
            { value: "10+", label: "Years", icon: "clock" },
          ],
    },
    testimonials: {
      eyebrow: "STORIES",
      title: "What people",
      titleHighlight: "say",
      items: [
        {
          name: "Community member",
          role: isNgo ? "Parent" : "Client",
          text: `${name} made a real difference. Replace this with a genuine testimonial.`,
          rating: 5,
        },
      ],
    },
    gallery: { eyebrow: "GALLERY", title: "Moments from", titleHighlight: "our work" },
    priceList: {
      eyebrow: "MENU",
      title: "What we",
      titleHighlight: "serve",
      note: "Update prices from Admin.",
      groups: [{ category: "Popular", items: [{ name: "Signature dish", price: "₹0", note: "" }] }],
    },
    team: {
      eyebrow: "TEAM",
      title: "Meet our",
      titleHighlight: "people",
      members: [
        { name: "Team member", role: "Lead", image: "", note: "" },
        { name: "Team member", role: "Staff", image: "", note: "" },
      ],
    },
    cta: {
      title: isNgo ? "Support our mission" : `Work with ${name}`,
      highlight: isNgo ? "Donate or volunteer today" : "Get in touch",
      phones: [],
      buttonLabel: isNgo ? "Get involved" : "Contact us",
      buttonHref: isNgo ? "/get-involved" : "/contact",
    },
  };
}

function defaultSection(type: string, copy: Record<string, Record<string, unknown>>): HomeSection {
  return {
    sectionType: type,
    content: copy[type] ?? {},
  };
}

function mergeHomeSections(existing: HomeSection[] | undefined, bp: WebsiteBlueprint): HomeSection[] {
  const type = bp.website.type ?? "";
  const required = pickHomeTypes(type);
  const copy = industryCopy(bp);
  const byType = new Map<string, HomeSection>();
  for (const s of existing ?? []) {
    if (!byType.has(s.sectionType)) byType.set(s.sectionType, s);
  }

  const out: HomeSection[] = required.map((t) => {
    const ai = byType.get(t);
    const base = copy[t] ?? {};
    if (!ai) return defaultSection(t, copy);
    const mappedAi = normalizeSectionContent(t, ai.content ?? {});
    const merged: Record<string, unknown> = { ...base };
    for (const [k, v] of Object.entries(mappedAi)) {
      if (filled(v)) merged[k] = v;
    }
    return {
      ...ai,
      sectionType: t,
      content: normalizeSectionContent(t, merged),
    };
  });

  for (const s of existing ?? []) {
    if (required.includes(s.sectionType)) continue;
    out.push({
      ...s,
      content: normalizeSectionContent(s.sectionType, s.content),
    });
  }

  return out.slice(0, 10);
}

function dedupePages(pages: WebsiteBlueprint["pages"]): WebsiteBlueprint["pages"] {
  const seen = new Map<string, WebsiteBlueprint["pages"][number]>();
  const out: WebsiteBlueprint["pages"] = [];
  for (const page of pages) {
    const slug = canonicalPageSlug(page.slug || page.name, page.name);
    const named = { ...page, slug: slug === "home" ? "home" : slug };
    if (seen.has(slug)) {
      const prev = seen.get(slug)!;
      if ((!prev.sections || prev.sections.length === 0) && named.sections?.length) {
        prev.sections = named.sections;
      }
      if (!prev.pageTemplateId && named.pageTemplateId) prev.pageTemplateId = named.pageTemplateId;
      continue;
    }
    seen.set(slug, named);
    out.push(named);
  }
  return out;
}

/** Full basic home + unique nav slugs. Fills gaps when the model returns a thin page. */
export function completeHomePage(blueprint: WebsiteBlueprint): WebsiteBlueprint {
  const pages = dedupePages(blueprint.pages);
  const home = pages.find((p) => canonicalPageSlug(p.slug || p.name, p.name) === "home");
  if (home) {
    home.slug = "home";
    home.sections = mergeHomeSections(home.sections, blueprint);
    home.pageTemplateId = undefined;
  }
  return { ...blueprint, pages };
}
