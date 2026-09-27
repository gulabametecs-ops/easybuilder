import { type WebsiteBlueprint } from "./blueprintSchema";

export type PublicPlanBrand = {
  companyName?: string;
  primaryColor?: string;
  secondaryColor?: string;
  logoImage?: string;
  heroImage?: string;
};

export function normalizeHexColor(raw?: string): string | undefined {
  if (!raw) return undefined;
  const t = raw.trim();
  if (/^#[0-9a-fA-F]{6}$/.test(t)) return t.toLowerCase();
  if (/^#[0-9a-fA-F]{3}$/.test(t)) {
    const r = t[1];
    const g = t[2];
    const b = t[3];
    return `#${r}${r}${g}${g}${b}${b}`.toLowerCase();
  }
  return undefined;
}

export function applyBrandToBlueprint(blueprint: WebsiteBlueprint, brand: PublicPlanBrand): WebsiteBlueprint {
  const name = brand.companyName?.trim() || blueprint.website.name;
  const primary = normalizeHexColor(brand.primaryColor);
  const secondary = normalizeHexColor(brand.secondaryColor);
  const next: WebsiteBlueprint = {
    ...blueprint,
    website: {
      ...blueprint.website,
      name,
      logoImage: brand.logoImage || blueprint.website.logoImage,
    },
    design: {
      ...blueprint.design,
      ...(primary ? { primaryColor: primary } : {}),
      ...(secondary ? { secondaryColor: secondary } : {}),
    },
  };

  if (brand.heroImage) {
    next.pages = next.pages.map((p) => {
      const slug = (p.slug || p.name || "").toLowerCase().replace(/[^a-z0-9]+/g, "-");
      if (slug !== "home" && slug !== "home-page" && slug !== "homepage") return p;
      const sections = (p.sections ?? []).map((s) =>
        s.sectionType === "hero"
          ? { ...s, content: { ...(s.content ?? {}), image: brand.heroImage } }
          : s,
      );
      return { ...p, sections };
    });
  }

  return next;
}
