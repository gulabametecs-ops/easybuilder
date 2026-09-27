"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireTenantId, getDemoWriteContext, persistDemoOverlay } from "./guard";
import { patchSiteConfigOverlay } from "@/lib/demoOverlay";
import {
  parseJson,
  type ThemeConfig,
  type HeaderConfig,
  type FooterConfig,
  type SeoConfig,
  type NavItem,
} from "@/lib/config";
import { defaultTheme, defaultHeader, defaultFooter, defaultSeo } from "@/lib/template";
import { safeHref } from "@/lib/sanitizeHtml";

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
      if (!label) return null;
      return { label: label.slice(0, 80), href: safeHref(href || "#") || "#" };
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
  const demo = await getDemoWriteContext();
  const tenantId = demo ? demo.tenantId : await requireTenantId({ demoOk: true });
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
  if (demo) {
    const overlay = patchSiteConfigOverlay(demo.overlay, { theme: JSON.stringify(next) });
    await persistDemoOverlay(demo.sessionId, overlay);
    revalidatePath("/admin/appearance");
    return;
  }
  await db.siteConfig.update({ where: { tenantId }, data: { theme: JSON.stringify(next) } });
  revalidatePath("/admin/appearance");
}

export async function saveHeader(formData: FormData) {
  const demo = await getDemoWriteContext();
  const tenantId = demo ? demo.tenantId : await requireTenantId({ demoOk: true });
  const { header } = await loadConfig(tenantId, await tenantName(tenantId));
  const nav = navLines(formData, "nav");
  const next: HeaderConfig = {
    design: (s(formData, "design") as HeaderConfig["design"]) || header.design || "classic",
    logoText: s(formData, "logoText") || header.logoText,
    logoImage: s(formData, "logoImage"),
    announcement: {
      show: formData.get("announceShow") === "on",
      text: s(formData, "announceText").slice(0, 200),
      link: safeHref(s(formData, "announceLink")),
    },
    topbar: {
      show: formData.get("topbarShow") === "on",
      address: s(formData, "address"),
      phones: list(formData, "phones"),
      email: s(formData, "email"),
      social: {
        facebook: safeHref(s(formData, "facebook")),
        instagram: safeHref(s(formData, "instagram")),
        whatsapp: safeHref(s(formData, "whatsapp")),
      },
    },
    nav: nav.length ? nav : header.nav,
    cta: {
      label: s(formData, "ctaLabel") || header.cta.label,
      href: safeHref(s(formData, "ctaHref")) || safeHref(header.cta.href) || "/",
    },
  };
  if (demo) {
    const overlay = patchSiteConfigOverlay(demo.overlay, { header: JSON.stringify(next) });
    await persistDemoOverlay(demo.sessionId, overlay);
    revalidatePath("/admin/appearance");
    revalidatePath("/");
    return;
  }
  await db.siteConfig.update({ where: { tenantId }, data: { header: JSON.stringify(next) } });
  revalidatePath("/admin/appearance");
  revalidatePath("/");
}

export async function saveFooter(formData: FormData) {
  const demo = await getDemoWriteContext();
  const tenantId = demo ? demo.tenantId : await requireTenantId({ demoOk: true });
  const { footer } = await loadConfig(tenantId, await tenantName(tenantId));
  const next: FooterConfig = {
    design: (s(formData, "design") || footer.design || "classic") as FooterConfig["design"],
    about: s(formData, "about") || footer.about,
    columns: footer.columns, // column links edited via nav-style below
    serviceAreas: list(formData, "serviceAreas"),
    contact: {
      phones: list(formData, "cphones"),
      email: s(formData, "cemail"),
      address: s(formData, "caddress"),
    },
    social: {
      facebook: safeHref(s(formData, "ffacebook")),
      instagram: safeHref(s(formData, "finstagram")),
      whatsapp: safeHref(s(formData, "fwhatsapp")),
      location: safeHref(s(formData, "flocation")),
    },
    copyright: s(formData, "copyright") || footer.copyright,
  };
  // Optional: quick-links column edited as nav lines
  const quick = navLines(formData, "quickLinks");
  if (quick.length) {
    next.columns = footer.columns.map((c, i) => (i === 0 ? { ...c, links: quick } : c));
  }
  if (demo) {
    const overlay = patchSiteConfigOverlay(demo.overlay, { footer: JSON.stringify(next) });
    await persistDemoOverlay(demo.sessionId, overlay);
    revalidatePath("/admin/appearance");
    return;
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
    ogType: s(formData, "ogType") || "website",
    gaId: s(formData, "gaId"),
    gtmId: s(formData, "gtmId"),
    fbPixelId: s(formData, "fbPixelId"),
    clarityId: s(formData, "clarityId"),
    googleVerification: s(formData, "googleVerification"),
    bingVerification: s(formData, "bingVerification"),
    indexable: formData.get("indexable") === "on",
    robotsFollow: formData.get("robotsFollow") === "on",
    localBusiness: formData.get("localBusiness") === "on",
    businessType: s(formData, "businessType") || "LocalBusiness",
    priceRange: s(formData, "priceRange"),
    geoLat: s(formData, "geoLat"),
    geoLng: s(formData, "geoLng"),
    ratingValue: s(formData, "ratingValue"),
    ratingCount: s(formData, "ratingCount"),
    faqSchema: formData.get("faqSchema") === "on",
  };
  await db.siteConfig.update({ where: { tenantId }, data: { seo: JSON.stringify(next) } });
  revalidatePath("/admin/seo");
  revalidatePath("/admin/appearance");
}

// Site-wide custom CSS (advanced). Injected into every page of the site.
export async function saveCustomCss(formData: FormData) {
  const demo = await getDemoWriteContext();
  const tenantId = demo ? demo.tenantId : await requireTenantId({ demoOk: true });
  const { sanitizeCss } = await import("@/lib/sanitizeHtml");
  const css = sanitizeCss(formData.get("customCss")?.toString() ?? "");
  if (demo) {
    const overlay = patchSiteConfigOverlay(demo.overlay, { customCss: css });
    await persistDemoOverlay(demo.sessionId, overlay);
    revalidatePath("/admin/appearance");
    return;
  }
  await db.siteConfig.update({ where: { tenantId }, data: { customCss: css } });
  revalidatePath("/admin/appearance");
}
