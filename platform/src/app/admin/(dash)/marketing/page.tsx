import { getAuthedSession } from "@/lib/auth";
import { getTenantConfig } from "@/lib/tenant";
import { db } from "@/lib/db";
import { ROOT_DOMAIN } from "@/lib/domains";
import { MarketingManager } from "@/components/admin/MarketingManager";
import { getDemoSessionId } from "@/lib/actions/guard";
import { demoVisibleWhere } from "@/lib/demoSession";

export const metadata = { title: "Marketing" };

export default async function MarketingPage() {
  const authed = await getAuthedSession();
  if (!authed) return null;
  const { tenant } = authed;

  const demoId = await getDemoSessionId();
  const [config, leads, campaigns, serviceRows] = await Promise.all([
    getTenantConfig(tenant.id, tenant.name),
    db.lead.findMany({
      where: demoVisibleWhere(tenant.id, demoId),
      orderBy: { createdAt: "desc" },
      select: { name: true, phone: true, email: true },
    }),
    db.campaign.findMany({ where: { tenantId: tenant.id }, orderBy: { createdAt: "desc" } }),
    db.service.findMany({ where: { tenantId: tenant.id }, orderBy: { order: "asc" }, select: { title: true } }),
  ]);

  const siteUrl = tenant.customDomain ? `https://${tenant.customDomain}` : `http://${tenant.subdomain}.${ROOT_DOMAIN}`;
  const ann = config.header.announcement ?? { show: false, text: "", link: "" };
  const services = Array.from(new Set(serviceRows.map((s) => s.title).filter(Boolean))).slice(0, 20);

  return (
    <div className="admin-full-bleed flex flex-col flex-1 min-h-0">
      <MarketingManager
        siteUrl={siteUrl}
        announcement={ann}
        leads={leads}
        bizName={tenant.name}
        services={services}
        vertical={tenant.vertical}
        canBlast={["owner", "admin"].includes(authed.session.role)}
        campaigns={campaigns.map((c) => ({
          id: c.id, name: c.name, platform: c.platform, objective: c.objective, service: c.service,
          adImage: c.adImage, headline: c.headline, adText: c.adText, targetUrl: c.targetUrl,
          budget: c.budget, startDate: c.startDate, endDate: c.endDate, gender: c.gender,
          ageMin: c.ageMin, ageMax: c.ageMax, interests: c.interests, locations: c.locations,
          radiusKm: c.radiusKm, status: c.status, spend: c.spend, clicks: c.clicks, leads: c.leads,
        }))}
      />
    </div>
  );
}
