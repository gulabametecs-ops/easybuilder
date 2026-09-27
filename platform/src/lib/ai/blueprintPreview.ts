import type { WebsiteBlueprint } from "./blueprintSchema";
import { designToTheme, resolvePageSections, slugify } from "./hydrate";
import { canonicalPageSlug } from "./completeHome";
import type { HeaderConfig, FooterConfig } from "@/lib/config";
import type { RenderContext } from "@/components/site/SectionRenderer";
import { placeholderImage, IMAGE_SLOTS } from "@/lib/img";

export type PreviewSection = {
  id: string;
  type: string;
  content: string;
  style: string;
  visible: boolean;
};

function ctaForType(type: string | undefined): { label: string; href: string } {
  const t = (type ?? "").toLowerCase();
  if (/ngo|charity|nonprofit|foundation/.test(t)) return { label: "Donate", href: "/contact" };
  if (/restaurant|cafe|hotel/.test(t)) return { label: "Book a table", href: "/booking" };
  if (/clinic|hospital|health/.test(t)) return { label: "Book appointment", href: "/appointment" };
  return { label: "Contact us", href: "/contact" };
}

export function blueprintHeader(blueprint: WebsiteBlueprint): HeaderConfig {
  const name = blueprint.website.name;
  const seen = new Set<string>();
  const nav: HeaderConfig["nav"] = [];
  for (const p of blueprint.pages) {
    const slug = canonicalPageSlug(p.slug || p.name, p.name);
    const href = slug === "home" ? "/" : `/${slug}`;
    if (seen.has(href)) continue;
    seen.add(href);
    nav.push({ label: p.name, href });
  }
  return {
    design: "classic",
    logoText: name,
    logoImage: blueprint.website.logoImage ?? "",
    announcement: { show: false, text: "", link: "" },
    topbar: { show: false, address: "", phones: [], email: "", social: {} },
    nav,
    cta: ctaForType(blueprint.website.type),
  };
}

export function blueprintFooter(blueprint: WebsiteBlueprint): FooterConfig {
  const name = blueprint.website.name;
  const header = blueprintHeader(blueprint);
  const links = header.nav;
  return {
    about: blueprint.website.description || `${name} — official website`,
    columns: [
      { title: "Quick links", links },
      { title: "Explore", links: links.slice(0, 6) },
    ],
    serviceAreas: [],
    contact: { phones: [], email: "", address: "" },
    social: {},
    copyright: `© ${new Date().getFullYear()} ${name}. All rights reserved.`,
  };
}

export function blueprintToPreview(blueprint: WebsiteBlueprint, pageSlug = "home") {
  const theme = designToTheme(blueprint.design);
  const page =
    blueprint.pages.find((p) => canonicalPageSlug(p.slug || p.name, p.name) === pageSlug) ??
    blueprint.pages.find((p) => canonicalPageSlug(p.slug || p.name, p.name) === "home") ??
    blueprint.pages[0];

  const sections: PreviewSection[] = resolvePageSections(page, blueprint.design).map((s, i) => ({
    id: `ai-preview-${i}`,
    type: s.type,
    content: s.content,
    style: s.style,
    visible: true,
  }));

  const header = blueprintHeader(blueprint);
  const footer = blueprintFooter(blueprint);

  const servicesByCategory = new Map<string, { id: string; category: string; title: string; description: string; image: string; slug?: string }[]>();
  for (const [i, s] of (blueprint.services ?? []).entries()) {
    const cat = s.category || "Services";
    const row = {
      id: `svc-${i}`,
      category: cat,
      title: s.title,
      description: s.description,
      image: placeholderImage(IMAGE_SLOTS.service.w, IMAGE_SLOTS.service.h),
      slug: slugify(s.title),
    };
    const list = servicesByCategory.get(cat) ?? [];
    list.push(row);
    servicesByCategory.set(cat, list);
  }

  const ctx: RenderContext = {
    servicesByCategory,
    galleryByCategory: new Map(),
    serviceOptions: [...servicesByCategory.keys()],
    footer,
    phones: header.topbar.phones,
    notices: [],
  };

  return { theme, header, footer, sections, ctx, pageName: page.name };
}

export function compactBlueprintSummary(blueprint: WebsiteBlueprint): string {
  return blueprint.pages
    .map((p) => `${p.name}(${p.sections?.map((s) => s.sectionType).join(",") ?? ""})`)
    .join("; ");
}

export function blueprintStats(blueprint: WebsiteBlueprint) {
  const pages = blueprint.pages.map((p) => {
    const slug = canonicalPageSlug(p.slug || p.name, p.name);
    const sections = resolvePageSections(p, blueprint.design);
    return {
      name: p.name,
      slug,
      sectionCount: sections.length,
      sectionTypes: sections.map((s) => s.type),
    };
  });
  const totalSections = pages.reduce((n, p) => n + p.sectionCount, 0);
  return { pages, totalSections };
}
