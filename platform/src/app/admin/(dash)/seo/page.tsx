import { getAuthedSession } from "@/lib/auth";
import { getTenantConfig } from "@/lib/tenant";
import { ROOT_DOMAIN } from "@/lib/domains";
import { db } from "@/lib/db";
import { SeoManager, type SiteCheck } from "@/components/admin/SeoManager";
import { siteIntegrations } from "@/lib/integrations";
import { auditPage } from "@/lib/seoAudit";

export const metadata = { title: "SEO" };

export default async function SeoPage() {
  const authed = await getAuthedSession();
  if (!authed) return null;
  const { tenant } = authed;
  const [config, rows] = await Promise.all([
    getTenantConfig(tenant.id, tenant.name),
    db.page.findMany({
      where: { tenantId: tenant.id },
      orderBy: { order: "asc" },
      select: {
        id: true, slug: true, title: true, seoTitle: true, seoDescription: true, focusKeyword: true, noindex: true, published: true,
        sections: { select: { type: true, content: true, visible: true }, orderBy: { order: "asc" } },
      },
    }),
  ]);
  const live = siteIntegrations(config.integrations, config.seo);
  const siteUrl = tenant.customDomain ? `https://${tenant.customDomain}` : `http://${tenant.subdomain}.${ROOT_DOMAIN}`;
  const pages = rows.map((p) => auditPage(p, { bizName: tenant.name, title: config.seo.title, description: config.seo.description }));
  const publicPages = pages.filter((p) => p.published && !p.noindex);

  const checks: SiteCheck[] = [
    { label: "Analytics connected", ok: Boolean(live.gaId || live.gtmId), hint: "Connect Google Analytics in Integrations", href: "/admin/integrations" },
    { label: "Search Console verified", ok: Boolean(live.verification.google), hint: "Add the Search Console code in Integrations", href: "/admin/integrations" },
    { label: "Contact page published", ok: pages.some((p) => p.published && /contact/.test(p.path)), hint: "Add a Contact page in Pages", href: "/admin/pages" },
    { label: "Every page has one main heading", ok: publicPages.every((p) => p.heroTitles === 1), hint: "See the Pages tab", tab: "pages" },
    { label: "No placeholder images", ok: publicPages.every((p) => !p.placeholderImages), hint: "Upload real photos in the page builder", tab: "pages" },
    { label: "Each page has its own description", ok: publicPages.every((p) => p.path === "/" || p.seoDescription), hint: "See the Pages tab", tab: "pages" },
    { label: "Custom domain connected", ok: Boolean(tenant.customDomain), hint: "Connect your own domain in Settings", href: "/admin/settings" },
    { label: "Sitemap & robots.txt live", ok: config.seo.indexable !== false, hint: "Allow indexing under Track", tab: "track" },
    { label: "Submitted for indexing", ok: Boolean(config.seo.indexNowAt), hint: "Submit under Index", tab: "index" },
  ];

  return (
    <div className="admin-full-bleed flex flex-col flex-1 min-h-0">
      <SeoManager
        seo={config.seo}
        siteUrl={siteUrl}
        bizName={tenant.name}
        sitemapUrl={`${siteUrl}/sitemap.xml`}
        searchConsoleVerified={Boolean(live.verification.google)}
        siteChecks={checks}
        pages={pages}
        contact={{ phone: config.header.topbar.phones[0] || config.footer.contact.phones?.[0] || "", address: config.header.topbar.address || config.footer.contact.address || "" }}
      />
    </div>
  );
}
