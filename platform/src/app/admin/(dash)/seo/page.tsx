import { getAuthedSession } from "@/lib/auth";
import { getTenantConfig } from "@/lib/tenant";
import { ROOT_DOMAIN } from "@/lib/domains";
import { SeoManager } from "@/components/admin/SeoManager";

export const metadata = { title: "SEO" };

export default async function SeoPage() {
  const authed = await getAuthedSession();
  if (!authed) return null;
  const { tenant } = authed;
  const config = await getTenantConfig(tenant.id, tenant.name);
  const siteUrl = tenant.customDomain ? `https://${tenant.customDomain}` : `http://${tenant.subdomain}.${ROOT_DOMAIN}`;

  return (
    <div className="admin-full-bleed flex flex-col flex-1 min-h-0">
      <SeoManager
        seo={config.seo}
        siteUrl={siteUrl}
        bizName={tenant.name}
        sitemapUrl={`${siteUrl}/sitemap.xml`}
      />
    </div>
  );
}
