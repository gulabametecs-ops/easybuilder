import { getAuthedSession } from "@/lib/auth";
import { getTenantConfig } from "@/lib/tenant";
import { ROOT_DOMAIN } from "@/lib/domains";
import { PageHeader } from "@/components/admin/ui";
import { SeoManager } from "@/components/admin/SeoManager";

export const metadata = { title: "SEO" };

export default async function SeoPage() {
  const authed = await getAuthedSession();
  if (!authed) return null;
  const { tenant } = authed;
  const config = await getTenantConfig(tenant.id, tenant.name);
  const siteUrl = tenant.customDomain ? `https://${tenant.customDomain}` : `http://${tenant.subdomain}.${ROOT_DOMAIN}`;

  return (
    <>
      <PageHeader title="SEO" subtitle="Control how your website appears on Google and social media. Changes go live instantly." />
      <SeoManager seo={config.seo} siteUrl={siteUrl} bizName={tenant.name} />
    </>
  );
}
