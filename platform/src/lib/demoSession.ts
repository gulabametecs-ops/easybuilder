import { cookies } from "next/headers";
import { cache } from "react";
import { db } from "./db";
import { getPlatformConfig } from "./platformConfig";
import { getVertical, VERTICALS } from "./verticals";
import { SESSION_COOKIE } from "./auth";

export const DEMO_COOKIE = "demo_session";

export type DemoOverlay = {
  siteConfig?: {
    theme?: string;
    header?: string;
    footer?: string;
    seo?: string;
    customCss?: string;
  };
  sections?: Record<string, { content?: string; style?: string; visible?: boolean; deleted?: boolean }>;
  addedSections?: Record<
    string,
    { pageId: string; type: string; order: number; visible: boolean; content: string; style: string }
  >;
  sectionOrder?: Record<string, string[]>;
};

export function parseOverlay(raw: string): DemoOverlay {
  try {
    return JSON.parse(raw || "{}") as DemoOverlay;
  } catch {
    return {};
  }
}

export function isDemoSubdomain(subdomain: string): boolean {
  return VERTICALS.some((v) => v.demoSubdomain === subdomain);
}

export function verticalForDemoSubdomain(subdomain: string): string | null {
  const v = VERTICALS.find((x) => x.demoSubdomain === subdomain);
  return v?.id ?? null;
}

function cookieDomain(): string | undefined {
  const root = process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? "localhost:3000";
  if (root.includes("localhost")) return undefined;
  const host = root.split(":")[0];
  return `.${host}`;
}

export function demoCookieOptions(maxAgeSec: number) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: maxAgeSec,
    domain: cookieDomain(),
  };
}

export async function setDemoCookie(token: string, maxAgeSec: number) {
  const store = await cookies();
  store.set(DEMO_COOKIE, token, demoCookieOptions(maxAgeSec));
}

export async function clearDemoCookie() {
  const store = await cookies();
  store.set(DEMO_COOKIE, "", { ...demoCookieOptions(0), maxAge: 0 });
}

export async function getDemoTokenFromCookie(): Promise<string | null> {
  const store = await cookies();
  return store.get(DEMO_COOKIE)?.value ?? null;
}

/**
 * Delete all tenant DB rows created during this demo + clear overlay + kill credentials.
 * Safe to call multiple times.
 */
export async function cleanupDemoSessionData(sessionId: string) {
  await Promise.all([
    db.lead.deleteMany({ where: { demoSessionId: sessionId } }),
    db.appointment.deleteMany({ where: { demoSessionId: sessionId } }),
    db.notice.deleteMany({ where: { demoSessionId: sessionId } }),
    db.service.deleteMany({ where: { demoSessionId: sessionId } }),
    db.galleryItem.deleteMany({ where: { demoSessionId: sessionId } }),
  ]);

  await db.demoSession.update({
    where: { id: sessionId },
    data: {
      status: "expired",
      overlay: "{}",
      adminUsername: "",
      adminPassword: "",
      otpHash: "",
    },
  });

  try {
    const store = await cookies();
    store.set(DEMO_COOKIE, "", { ...demoCookieOptions(0), maxAge: 0 });
    store.set(SESSION_COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
  } catch {
    // cookies() may be unavailable outside a request
  }
}

/** Prisma where: seed rows (null) + this visitor's demo rows only. */
export function demoVisibleWhere(tenantId: string, demoSessionId: string | null | undefined) {
  if (!demoSessionId) return { tenantId };
  return {
    tenantId,
    OR: [{ demoSessionId: null }, { demoSessionId }],
  };
}

/** Load session by cookie token; auto-expire + cleanup stale sessions. */
export const getDemoSessionByToken = cache(async (token: string | null) => {
  if (!token) return null;
  const session = await db.demoSession.findUnique({ where: { token } });
  if (!session) return null;
  if (session.status === "active" && session.expiresAt && session.expiresAt.getTime() < Date.now()) {
    await cleanupDemoSessionData(session.id);
    return {
      ...session,
      status: "expired" as const,
      overlay: "{}",
      adminUsername: "",
      adminPassword: "",
    };
  }
  return session;
});

export async function getActiveDemoSession(): Promise<Awaited<ReturnType<typeof getDemoSessionByToken>> | null> {
  const token = await getDemoTokenFromCookie();
  const session = await getDemoSessionByToken(token);
  if (!session || session.status !== "active") return null;
  if (!session.expiresAt || session.expiresAt.getTime() < Date.now()) {
    await cleanupDemoSessionData(session.id);
    return null;
  }
  return session;
}

/** Active demo session that matches the current demo tenant's vertical. */
export async function getActiveDemoSessionForTenant(tenant: { subdomain: string; vertical: string }) {
  if (!isDemoSubdomain(tenant.subdomain)) return null;
  const session = await getActiveDemoSession();
  if (!session) return null;
  const expectedVertical = verticalForDemoSubdomain(tenant.subdomain) ?? tenant.vertical;
  if (session.vertical !== expectedVertical) return null;
  return session;
}

export async function demoDurationMs(): Promise<number> {
  const cfg = await getPlatformConfig();
  const mins = cfg.demoDurationMinutes ?? 10;
  return Math.max(1, mins) * 60 * 1000;
}

export async function trackDemoPageView(sessionId: string, slug: string) {
  const session = await db.demoSession.findUnique({ where: { id: sessionId } });
  if (!session) return;
  let pages: string[] = [];
  try {
    pages = JSON.parse(session.pagesViewed || "[]") as string[];
  } catch {
    pages = [];
  }
  if (!pages.includes(slug)) {
    pages.push(slug);
    await db.demoSession.update({ where: { id: session.id }, data: { pagesViewed: JSON.stringify(pages) } });
  }
}

export async function saveDemoOverlay(sessionId: string, overlay: DemoOverlay) {
  await db.demoSession.update({
    where: { id: sessionId },
    data: { overlay: JSON.stringify(overlay) },
  });
}

export async function loadDemoOverlay(sessionId: string): Promise<DemoOverlay> {
  const s = await db.demoSession.findUnique({ where: { id: sessionId }, select: { overlay: true } });
  return parseOverlay(s?.overlay ?? "{}");
}

export function demoSiteUrl(verticalId: string): string | null {
  const v = getVertical(verticalId);
  if (!v?.demoSubdomain) return null;
  const root = process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? "localhost:3000";
  const proto = root.includes("localhost") ? "http" : "https";
  return `${proto}://${v.demoSubdomain}.${root}`;
}

export function demosUnlockUrl(verticalId: string): string {
  return `/demos?vertical=${encodeURIComponent(verticalId)}`;
}

/** Sweep any active sessions past expiry (e.g. visitor never came back). */
export async function sweepExpiredDemoSessions() {
  const stale = await db.demoSession.findMany({
    where: { status: "active", expiresAt: { lt: new Date() } },
    select: { id: true },
    take: 50,
  });
  for (const s of stale) {
    await cleanupDemoSessionData(s.id);
  }
}
