import { getAuthedSession } from "@/lib/auth";
import { getTenantConfig } from "@/lib/tenant";
import { db } from "@/lib/db";
import { AppearanceEditor } from "@/components/admin/AppearanceEditor";

export const metadata = { title: "Appearance" };

export default async function AppearancePage() {
  const authed = await getAuthedSession();
  if (!authed) return null;

  const [config, sc] = await Promise.all([
    getTenantConfig(authed.tenant.id, authed.tenant.name),
    db.siteConfig.findUnique({ where: { tenantId: authed.tenant.id }, select: { updatedAt: true } }),
  ]);
  const version = sc?.updatedAt?.toISOString() ?? "";

  return (
    <div className="admin-full-bleed flex flex-col flex-1 min-h-0">
      <AppearanceEditor
        theme={config.theme}
        header={config.header}
        footer={config.footer}
        customCss={config.customCss}
        version={version}
      />
    </div>
  );
}
