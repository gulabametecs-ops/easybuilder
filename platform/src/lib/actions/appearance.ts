"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireTenantId } from "./guard";
import {
  parseJson,
  type ThemeConfig,
  type HeaderConfig,
  type FooterConfig,
  type SeoConfig,
  type NavItem,
} from "@/lib/config";
import { defaultTheme, defaultHeader, defaultFooter, defaultSeo } from "@/lib/template";

function s(formData: FormData, key: string): string {
  return (formData.get(key)?.toString() ?? "").trim();
}
function list(formData: FormData, key: string): string[] {
  return s(formData, key)
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);
}
// Parses lines of "Label | /href" into NavItems.
function navLines(formData: FormData, key: string): NavItem[] {
  return s(formData, key)
    .split("\n")
    .map((line) => {
      const [label, href] = line.split("|").map((x) => x.trim());
      return label ? { label, href: href || "#" } : null;
    })
    .filter((x): x is NavItem => x !== null);
}

async function loadConfig(tenantId: string, bizName: string) {
  const cfg = await db.siteConfig.findUnique({ where: { tenantId } });
  return {
    cfg,
    theme: parseJson<ThemeConfig>(cfg?.theme, defaultTheme),
    header: parseJson<HeaderConfig>(cfg?.header, defaultHeader(bizName)),
    footer: parseJson<FooterConfig>(cfg?.footer, defaultFooter(bizName)),
    seo: parseJson<SeoConfig>(cfg?.seo, defaultSeo(bizName)),
  };
}

async function tenantName(tenantId: string) {
  const t = await db.tenant.findUnique({ where: { id: tenantId } });
  return t?.name ?? "Business";
}

export async function saveTheme(formData: FormData) {
  const tenantId = await requireTenantId();
  const { theme } = await loadConfig(tenantId, await tenantName(tenantId));
  const next: ThemeConfig = {
    colors: {
      primary: s(formData, "primary") || theme.colors.primary,
      primaryDark: s(formData, "primaryDark") || theme.colors.primaryDark,
      secondary: s(formData, "secondary") || theme.colors.secondary,
      accent: s(formData, "accent") || theme.colors.accent,
      dark: s(formData, "dark") || theme.colors.dark,
      light: s(formData, "light") || theme.colors.light,
      text: s(formData, "text") || theme.colors.text,
      heading: s(formData, "heading") || theme.colors.heading,
    },
    font: s(formData, "font") || theme.font,
    radius: s(formData, "radius") || theme.radius,
  };
  await db.siteConfig.update({ where: { tenantId }, data: { theme: JSON.stringify(next) } });
  revalidatePath("/admin/appearance");
}

export async function saveHeader(formData: FormData) {
  const tenantId = await requireTenantId();
  const { header } = await loadConfig(tenantId, await tenantName(tenantId));
  const nav = navLines(formData, "nav");
  const next: HeaderConfig = {
    logoText: s(formData, "logoText") || header.logoText,
    logoImage: s(formData, "logoImage"),
    announcement: {
      show: formData.get("announceShow") === "on",
      text: s(formData, "announceText"),
      link: s(formData, "announceLink"),
    },
    topbar: {
      show: formData.get("topbarShow") === "on",
      address: s(formData, "address"),
      phones: list(formData, "phones"),
      email: s(formData, "email"),
      social: {
        facebook: s(formData, "facebook"),
        instagram: s(formData, "instagram"),
        whatsapp: s(formData, "whatsapp"),
      },
    },
    nav: nav.length ? nav : header.nav,
    cta: { label: s(formData, "ctaLabel") || header.cta.label, href: s(formData, "ctaHref") || header.cta.href },
  };
  await db.siteConfig.update({ where: { tenantId }, data: { header: JSON.stringify(next) } });
  revalidatePath("/admin/appearance");
}

export async function saveFooter(formData: FormData) {
  const tenantId = await requireTenantId();
  const { footer } = await loadConfig(tenantId, await tenantName(tenantId));
  const next: FooterConfig = {
    about: s(formData, "about") || footer.about,
    columns: footer.columns, // column links edited via nav-style below
    serviceAreas: list(formData, "serviceAreas"),
    contact: {
      phones: list(formData, "cphones"),
      email: s(formData, "cemail"),
      address: s(formData, "caddress"),
    },
    social: {
      facebook: s(formData, "ffacebook"),
      instagram: s(formData, "finstagram"),
      whatsapp: s(formData, "fwhatsapp"),
      location: s(formData, "flocation"),
    },
    copyright: s(formData, "copyright") || footer.copyright,
  };
  // Optional: quick-links column edited as nav lines
  const quick = navLines(formData, "quickLinks");
  if (quick.length) {
    next.columns = footer.columns.map((c, i) => (i === 0 ? { ...c, links: quick } : c));
  }
  await db.siteConfig.update({ where: { tenantId }, data: { footer: JSON.stringify(next) } });
  revalidatePath("/admin/appearance");
}

export async function saveSeo(formData: FormData) {
  const tenantId = await requireTenantId();
  const { seo } = await loadConfig(tenantId, await tenantName(tenantId));
  const next: SeoConfig = {
    title: s(formData, "title") || seo.title,
    description: s(formData, "description") || seo.description,
    favicon: s(formData, "favicon"),
    ogImage: s(formData, "ogImage"),
    keywords: s(formData, "keywords"),
    twitterHandle: s(formData, "twitterHandle"),
    gaId: s(formData, "gaId"),
    googleVerification: s(formData, "googleVerification"),
    indexable: formData.get("indexable") === "on",
    localBusiness: formData.get("localBusiness") === "on",
    businessType: s(formData, "businessType") || "LocalBusiness",
    priceRange: s(formData, "priceRange"),
    geoLat: s(formData, "geoLat"),
    geoLng: s(formData, "geoLng"),
  };
  await db.siteConfig.update({ where: { tenantId }, data: { seo: JSON.stringify(next) } });
  revalidatePath("/admin/seo");
  revalidatePath("/admin/appearance");
}

// Site-wide custom CSS (advanced). Injected into every page of the site.
export async function saveCustomCss(formData: FormData) {
  const tenantId = await requireTenantId();
  const css = formData.get("customCss")?.toString() ?? "";
  await db.siteConfig.update({ where: { tenantId }, data: { customCss: css } });
  revalidatePath("/admin/appearance");
}
