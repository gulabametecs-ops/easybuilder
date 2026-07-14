import { db } from "@/lib/db";
import { parseHost } from "@/lib/domains";
import { getTenantConfig } from "@/lib/tenant";
import { baseUrlFromHost } from "@/lib/seo";

// Per-host robots.txt. Bypasses the proxy (dot in path), so we resolve the
// tenant straight from the Host header here.
export async function GET(request: Request) {
  const host = request.headers.get("host");
  const info = parseHost(host);
  const baseUrl = baseUrlFromHost(host);

  // Marketing site — allow everything, hide app internals.
  if (info.kind === "marketing") {
    return text(`User-agent: *\nAllow: /\nDisallow: /super\nDisallow: /admin\nSitemap: ${baseUrl}/sitemap.xml\n`);
  }

  const tenant = info.kind === "custom"
    ? await db.tenant.findUnique({ where: { customDomain: info.key } })
    : await db.tenant.findUnique({ where: { subdomain: info.key } });
  if (!tenant) return text(`User-agent: *\nDisallow: /\n`);

  const config = await getTenantConfig(tenant.id, tenant.name);
  if (config.seo.indexable === false || tenant.status === "suspended") {
    return text(`User-agent: *\nDisallow: /\n`);
  }
  return text(`User-agent: *\nAllow: /\nDisallow: /admin\nSitemap: ${baseUrl}/sitemap.xml\n`);
}

function text(body: string) {
  return new Response(body, { headers: { "content-type": "text/plain; charset=utf-8" } });
}
