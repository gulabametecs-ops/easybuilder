import { db } from "@/lib/db";
import { parseHost } from "@/lib/domains";
import { getTenantConfig } from "@/lib/tenant";
import { baseUrlFromHost } from "@/lib/seo";

// Per-tenant sitemap.xml listing published, indexable pages.
export async function GET(request: Request) {
  const host = request.headers.get("host");
  const info = parseHost(host);
  const baseUrl = baseUrlFromHost(host);

  if (info.kind === "marketing") {
    return xml([{ loc: `${baseUrl}/` }]);
  }

  const tenant = info.kind === "custom"
    ? await db.tenant.findUnique({ where: { customDomain: info.key } })
    : await db.tenant.findUnique({ where: { subdomain: info.key } });
  if (!tenant) return xml([]);

  const config = await getTenantConfig(tenant.id, tenant.name);
  if (config.seo.indexable === false) return xml([]);

  const pages = await db.page.findMany({
    where: { tenantId: tenant.id, published: true, noindex: false },
    orderBy: { order: "asc" },
    select: { slug: true, updatedAt: true },
  });

  const urls = pages.map((p) => ({
    loc: `${baseUrl}${p.slug === "home" ? "/" : `/${p.slug}`}`,
    lastmod: p.updatedAt.toISOString(),
  }));
  return xml(urls);
}

function xml(urls: { loc: string; lastmod?: string }[]) {
  const body =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    urls.map((u) => `  <url><loc>${u.loc}</loc>${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ""}</url>`).join("\n") +
    `\n</urlset>\n`;
  return new Response(body, { headers: { "content-type": "application/xml; charset=utf-8" } });
}
