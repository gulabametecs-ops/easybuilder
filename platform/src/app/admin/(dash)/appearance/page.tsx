import { getAuthedSession } from "@/lib/auth";
import { getTenantConfig } from "@/lib/tenant";
import { PageHeader } from "@/components/admin/ui";
import { AppearanceEditor } from "@/components/admin/AppearanceEditor";

export const metadata = { title: "Appearance" };

export default async function AppearancePage() {
  const authed = await getAuthedSession();
  if (!authed) return null;

  const config = await getTenantConfig(authed.tenant.id, authed.tenant.name);

  return (
    <>
      <PageHeader title="Appearance" subtitle="Customize your theme, header, footer and SEO. Changes go live instantly." />
      <AppearanceEditor theme={config.theme} header={config.header} footer={config.footer} customCss={config.customCss} />
    </>
  );
}
