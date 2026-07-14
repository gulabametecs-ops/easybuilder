import { headers } from "next/headers";
import { cache } from "react";
import { db } from "./db";
import { TENANT_HEADER, TENANT_KIND_HEADER } from "./domains";
import {
  parseJson,
  type ThemeConfig,
  type HeaderConfig,
  type FooterConfig,
  type SeoConfig,
} from "./config";
import { defaultTheme, defaultHeader, defaultFooter, defaultSeo } from "./template";

// Reads the tenant key/kind that the proxy attached to the request.
export async function getTenantKey(): Promise<{ key: string; kind: string } | null> {
  const h = await headers();
  const key = h.get(TENANT_HEADER);
  const kind = h.get(TENANT_KIND_HEADER);
  if (!key) return null;
  return { key, kind: kind ?? "subdomain" };
}

// Loads the tenant row for the current request (by subdomain or custom domain).
export const getCurrentTenant = cache(async () => {
  const info = await getTenantKey();
  if (!info) return null;
  if (info.kind === "custom") {
    return db.tenant.findUnique({ where: { customDomain: info.key } });
  }
  return db.tenant.findUnique({ where: { subdomain: info.key } });
});

export type TenantConfig = {
  theme: ThemeConfig;
  header: HeaderConfig;
  footer: FooterConfig;
  seo: SeoConfig;
  customCss: string;
};

// Loads + parses the site-wide config (theme/header/footer/seo) for a tenant.
export const getTenantConfig = cache(async (tenantId: string, bizName: string): Promise<TenantConfig> => {
  const cfg = await db.siteConfig.findUnique({ where: { tenantId } });
  return {
    theme: parseJson<ThemeConfig>(cfg?.theme, defaultTheme),
    header: parseJson<HeaderConfig>(cfg?.header, defaultHeader(bizName)),
    footer: parseJson<FooterConfig>(cfg?.footer, defaultFooter(bizName)),
    seo: parseJson<SeoConfig>(cfg?.seo, defaultSeo(bizName)),
    customCss: cfg?.customCss ?? "",
  };
});

// Loads a published page + its visible sections (ordered) for rendering.
export const getPageBySlug = cache(async (tenantId: string, slug: string) => {
  return db.page.findFirst({
    where: { tenantId, slug, published: true },
    include: { sections: { where: { visible: true }, orderBy: { order: "asc" } } },
  });
});

// Editor/preview: any page + ALL sections (incl. hidden/unpublished). Auth-gated by caller.
export const getPageForEditor = cache(async (tenantId: string, slug: string) => {
  return db.page.findFirst({
    where: { tenantId, slug },
    include: { sections: { orderBy: { order: "asc" } } },
  });
});

// Services grouped by category (ordered), for service sections & form dropdowns.
export const getServicesGrouped = cache(async (tenantId: string) => {
  const services = await db.service.findMany({
    where: { tenantId },
    orderBy: { order: "asc" },
  });
  const groups = new Map<string, typeof services>();
  for (const s of services) {
    if (!groups.has(s.category)) groups.set(s.category, []);
    groups.get(s.category)!.push(s);
  }
  return groups;
});

// Gallery grouped by category (ordered).
export const getGalleryGrouped = cache(async (tenantId: string) => {
  const items = await db.galleryItem.findMany({
    where: { tenantId },
    orderBy: { order: "asc" },
  });
  const groups = new Map<string, typeof items>();
  for (const g of items) {
    if (!groups.has(g.category)) groups.set(g.category, []);
    groups.get(g.category)!.push(g);
  }
  return groups;
});
