import { randomUUID } from "node:crypto";
import { db } from "@/lib/db";
import { getCurrentTenant } from "@/lib/tenant";
import { getSession } from "@/lib/auth";
import { isDemoSubdomain } from "@/lib/demoSession";
import { rateLimit } from "@/lib/rateLimit";
import { isBot, normalizePath, dayKey } from "@/lib/analytics";

// First-party page-view beacon (see components/site/PageViewBeacon.tsx).
// Stores ONLY an aggregate counter per tenant/day/path: no IP, cookie or UA is kept.
// The IP below is used for an in-memory rate limit and never written anywhere.
const done = () => new Response(null, { status: 204 });

// Only count paths that render a real page, so 404s and forged beacons can't add rows.
async function isRealPage(tenantId: string, path: string): Promise<boolean> {
  const slug = path === "/" ? "home" : path.slice(1);
  if (["notices", "result", "privacy"].includes(slug)) return true;
  const [, kind, item] = slug.match(/^(services|events|properties|causes)\/([^/]+)$/) ?? [];
  if (kind === "services") return (await db.service.count({ where: { tenantId, slug: item } })) > 0;
  if (kind === "events") return (await db.siteEvent.count({ where: { tenantId, slug: item } })) > 0;
  if (kind === "properties") return (await db.property.count({ where: { tenantId, slug: item, published: true } })) > 0;
  if (kind === "causes") return (await db.cause.count({ where: { tenantId, slug: item, published: true } })) > 0;
  return (await db.page.count({ where: { tenantId, slug, published: true } })) > 0;
}

export async function POST(request: Request) {
  const h = request.headers;
  if (isBot(h.get("user-agent"))) return done();
  const site = h.get("sec-fetch-site");
  if (site && site !== "same-origin") return done();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "local";
  if (!rateLimit(`pv:${ip}`, 60, 60_000).ok) return done();

  let path: string | null = null;
  try {
    path = normalizePath((JSON.parse(await request.text()) as { p?: unknown }).p);
  } catch {
    return done();
  }
  if (!path) return done();

  const tenant = await getCurrentTenant();
  if (!tenant || isDemoSubdomain(tenant.subdomain)) return done();
  // The owner/staff browsing their own site doesn't count.
  const session = await getSession();
  if (session?.tenantId === tenant.id) return done();

  if (!(await isRealPage(tenant.id, path))) return done();

  await db.$executeRaw`
    INSERT INTO PageView (id, tenantId, day, path, views)
    VALUES (${randomUUID()}, ${tenant.id}, ${dayKey()}, ${path}, 1)
    ON DUPLICATE KEY UPDATE views = views + 1`;
  return done();
}
