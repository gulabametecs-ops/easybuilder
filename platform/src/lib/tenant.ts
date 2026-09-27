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
  resultConfig: string;
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
    resultConfig: cfg?.resultConfig ?? "{}",
  };
});

export type SiteNotice = { date: string; title: string; category: string; link: string; isNew: boolean; isResult: boolean; attachmentUrl: string; attachmentName: string };

const MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
function fmtDate(d: Date): string {
  return `${String(d.getDate()).padStart(2, "0")} ${MON[d.getMonth()]} ${d.getFullYear()}`;
}

// The unified notice feed for the public site: admin notices PLUS every
// published result exam (each result is itself a notice that links to the
// result-search for that exam). Pinned first, then newest.
export const getSiteNotices = cache(async (tenantId: string): Promise<SiteNotice[]> => {
  const { getActiveDemoSession } = await import("./demoSession");
  const demo = await getActiveDemoSession();
  const noticeWhere = demo
    ? { tenantId, published: true, OR: [{ demoSessionId: null }, { demoSessionId: demo.id }] }
    : { tenantId, published: true };

  const [notices, exams] = await Promise.all([
    db.notice.findMany({ where: noticeWhere, orderBy: [{ pinned: "desc" }, { createdAt: "desc" }] }),
    db.resultExam.findMany({ where: { tenantId, published: true }, orderBy: { createdAt: "desc" } }),
  ]);
  const now = Date.now();
  const NEW_MS = 14 * 24 * 3600 * 1000;

  const manual = notices.map((n) => ({ date: n.date, title: n.title, category: n.category, link: n.link, isNew: n.pinned, isResult: false, attachmentUrl: n.attachmentUrl, attachmentName: n.attachmentName, pinned: n.pinned, ts: n.createdAt.getTime() }));
  const results = exams.map((e) => ({ date: fmtDate(e.createdAt), title: `${e.name} — Result Declared`, category: "Result", link: `/result?exam=${e.id}`, isNew: now - e.createdAt.getTime() < NEW_MS, isResult: true, attachmentUrl: "", attachmentName: "", pinned: false, ts: e.createdAt.getTime() }));

  const all = [...manual, ...results];
  all.sort((a, b) => Number(b.pinned) - Number(a.pinned) || b.ts - a.ts);
  return all.map(({ date, title, category, link, isNew, isResult, attachmentUrl, attachmentName }) => ({ date, title, category, link, isNew, isResult, attachmentUrl, attachmentName }));
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
  const { getActiveDemoSession } = await import("./demoSession");
  const demo = await getActiveDemoSession();
  const where = demo
    ? { tenantId, OR: [{ demoSessionId: null }, { demoSessionId: demo.id }] }
    : { tenantId };
  const services = await db.service.findMany({
    where,
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
  const { getActiveDemoSession } = await import("./demoSession");
  const demo = await getActiveDemoSession();
  const where = demo
    ? { tenantId, OR: [{ demoSessionId: null }, { demoSessionId: demo.id }] }
    : { tenantId };
  const items = await db.galleryItem.findMany({
    where,
    orderBy: { order: "asc" },
  });
  const groups = new Map<string, typeof items>();
  for (const g of items) {
    if (!groups.has(g.category)) groups.set(g.category, []);
    groups.get(g.category)!.push(g);
  }
  return groups;
});
