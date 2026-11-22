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
import { parseBlocks, parseDocs, parseStringList as parseEventList, resolveEventKind, type EventBlock } from "./eventContent";
import { parsePayments, toPublicPayments, type PublicPayments } from "./payments";
import { mapProperty, type PublicProperty } from "./property";
import { mapCause, type PublicCause } from "./cause";
import { applyPaymentToggles, parseIntegrations, type IntegrationsConfig } from "./integrations";

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
  payments: PublicPayments;
  integrations: IntegrationsConfig;
};

// Loads + parses the site-wide config (theme/header/footer/seo) for a tenant.
export const getTenantConfig = cache(async (tenantId: string, bizName: string): Promise<TenantConfig> => {
  const cfg = await db.siteConfig.findUnique({ where: { tenantId } });
  const integrations = parseIntegrations(cfg?.integrations);
  return {
    theme: parseJson<ThemeConfig>(cfg?.theme, defaultTheme),
    header: parseJson<HeaderConfig>(cfg?.header, defaultHeader(bizName)),
    footer: parseJson<FooterConfig>(cfg?.footer, defaultFooter(bizName)),
    seo: parseJson<SeoConfig>(cfg?.seo, defaultSeo(bizName)),
    customCss: cfg?.customCss ?? "",
    resultConfig: cfg?.resultConfig ?? "{}",
    payments: applyPaymentToggles(toPublicPayments(parsePayments(cfg?.payments)), integrations),
    integrations,
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

function parseStringList(raw: string): string[] {
  try {
    const v = JSON.parse(raw || "[]");
    return Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];
  } catch {
    return [];
  }
}

export type PublicPerson = {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  groupName: string;
  experience: string;
  linkedin: string;
  instagram: string;
};

export type PublicEvent = {
  id: string;
  slug: string;
  title: string;
  activityName: string;
  shortDescription: string;
  programDescription: string;
  date: string;
  location: string;
  organizedBy: string;
  dignitaries: string;
  impact: string;
  coverImage: string;
  gallery: string[];
  objectives: string[];
  documents: { label: string; url: string }[];
  status: "upcoming" | "completed";
  mapUrl: string;
  venueNote: string;
  blocks: EventBlock[];
  enableDonate: boolean;
  donateAmount: number;
  donateLabel: string;
  showQr: boolean;
  qrImage: string;
  qrCaption: string;
};

function mapEvent(row: {
  id: string; slug: string; title: string; activityName: string; shortDescription: string;
  programDescription: string; date: string; location: string; organizedBy: string;
  dignitaries: string; impact: string; coverImage: string; gallery: string; objectives: string; documents: string;
  status?: string; mapUrl?: string; venueNote?: string; blocks?: string;
  enableDonate?: boolean; donateAmount?: number; donateLabel?: string;
  showQr?: boolean; qrImage?: string; qrCaption?: string;
}): PublicEvent {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    activityName: row.activityName,
    shortDescription: row.shortDescription,
    programDescription: row.programDescription,
    date: row.date,
    location: row.location,
    organizedBy: row.organizedBy,
    dignitaries: row.dignitaries,
    impact: row.impact,
    coverImage: row.coverImage,
    gallery: parseEventList(row.gallery),
    objectives: parseStringList(row.objectives),
    documents: parseDocs(row.documents),
    status: resolveEventKind(row.date, row.status || "auto"),
    mapUrl: row.mapUrl || "",
    venueNote: row.venueNote || "",
    blocks: parseBlocks(row.blocks || "[]"),
    enableDonate: !!row.enableDonate,
    donateAmount: row.donateAmount || 0,
    donateLabel: row.donateLabel || "",
    showQr: !!row.showQr,
    qrImage: row.qrImage || "",
    qrCaption: row.qrCaption || "",
  };
}

export const getSitePeople = cache(async (tenantId: string): Promise<PublicPerson[]> => {
  const { getActiveDemoSession } = await import("./demoSession");
  const demo = await getActiveDemoSession();
  const where = demo
    ? { tenantId, published: true, OR: [{ demoSessionId: null }, { demoSessionId: demo.id }] }
    : { tenantId, published: true };
  const rows = await db.person.findMany({ where, orderBy: { order: "asc" } });
  return rows.map((p) => ({
    id: p.id,
    name: p.name,
    role: p.role,
    bio: p.bio,
    image: p.image,
    groupName: p.groupName,
    experience: p.experience,
    linkedin: p.linkedin,
    instagram: p.instagram,
  }));
});

export const getSiteEvents = cache(async (tenantId: string): Promise<PublicEvent[]> => {
  const { getActiveDemoSession } = await import("./demoSession");
  const demo = await getActiveDemoSession();
  const where = demo
    ? { tenantId, published: true, OR: [{ demoSessionId: null }, { demoSessionId: demo.id }] }
    : { tenantId, published: true };
  const rows = await db.siteEvent.findMany({ where, orderBy: [{ date: "desc" }, { order: "asc" }] });
  return rows.map(mapEvent);
});

export const getSiteEventBySlug = cache(async (tenantId: string, slug: string): Promise<PublicEvent | null> => {
  const { getActiveDemoSession } = await import("./demoSession");
  const demo = await getActiveDemoSession();
  const where = demo
    ? { tenantId, slug, published: true, OR: [{ demoSessionId: null }, { demoSessionId: demo.id }] }
    : { tenantId, slug, published: true };
  const row = await db.siteEvent.findFirst({ where });
  return row ? mapEvent(row) : null;
});

// ─── Property listings (real-estate sectors) ─────────────────────────────────
async function propertyWhere(tenantId: string, extra: Record<string, unknown> = {}) {
  const { getActiveDemoSession } = await import("./demoSession");
  const demo = await getActiveDemoSession();
  return demo
    ? { tenantId, published: true, ...extra, OR: [{ demoSessionId: null }, { demoSessionId: demo.id }] }
    : { tenantId, published: true, ...extra };
}

export const getSiteProperties = cache(async (tenantId: string): Promise<PublicProperty[]> => {
  const rows = await db.property.findMany({
    where: await propertyWhere(tenantId),
    orderBy: [{ featured: "desc" }, { order: "asc" }, { createdAt: "desc" }],
  });
  return rows.map(mapProperty);
});

export const getSitePropertyBySlug = cache(async (tenantId: string, slug: string): Promise<PublicProperty | null> => {
  const row = await db.property.findFirst({ where: await propertyWhere(tenantId, { slug }) });
  return row ? mapProperty(row) : null;
});

// ─── NGO fundraising causes ─────────────────────────────────────────────────
// raised/donors = the NGO's offline figures + paid online donations tagged with the cause.
async function onlineTotals(tenantId: string, causeIds: string[]) {
  if (!causeIds.length) return new Map<string, { amount: number; donors: number }>();
  const rows = await db.siteDonation.groupBy({
    by: ["causeId"],
    where: { tenantId, status: "paid", causeId: { in: causeIds } },
    _sum: { amount: true },
    _count: { _all: true },
  });
  return new Map(rows.map((r) => [r.causeId, { amount: Math.round((r._sum.amount ?? 0) / 100), donors: r._count._all }]));
}

async function causeWhere(tenantId: string, extra: Record<string, unknown> = {}) {
  const { getActiveDemoSession } = await import("./demoSession");
  const demo = await getActiveDemoSession();
  return demo
    ? { tenantId, published: true, ...extra, OR: [{ demoSessionId: null }, { demoSessionId: demo.id }] }
    : { tenantId, published: true, ...extra };
}

export const getSiteCauses = cache(async (tenantId: string): Promise<PublicCause[]> => {
  const rows = await db.cause.findMany({
    where: await causeWhere(tenantId),
    orderBy: [{ featured: "desc" }, { urgent: "desc" }, { order: "asc" }, { createdAt: "desc" }],
  });
  const totals = await onlineTotals(tenantId, rows.map((r) => r.id));
  return rows.map((r) => mapCause(r, totals.get(r.id)));
});

export const getSiteCauseBySlug = cache(async (tenantId: string, slug: string): Promise<PublicCause | null> => {
  const row = await db.cause.findFirst({ where: await causeWhere(tenantId, { slug }) });
  if (!row) return null;
  const totals = await onlineTotals(tenantId, [row.id]);
  return mapCause(row, totals.get(row.id));
});
