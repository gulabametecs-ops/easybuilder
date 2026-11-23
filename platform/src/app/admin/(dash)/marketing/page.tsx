import { getAuthedSession } from "@/lib/auth";
import { getTenantConfig } from "@/lib/tenant";
import { db } from "@/lib/db";
import { ROOT_DOMAIN } from "@/lib/domains";
import { MarketingManager } from "@/components/admin/MarketingManager";
import { getDemoSessionId } from "@/lib/actions/guard";
import { demoVisibleWhere } from "@/lib/demoSession";
import { lastDays } from "@/lib/analytics";
import { VERTICALS } from "@/lib/verticals";
import { siteIntegrations } from "@/lib/integrations";
import { upcomingOccasions, istToday } from "@/lib/marketingIdeas";

export const metadata = { title: "Marketing" };

export default async function MarketingPage() {
  const authed = await getAuthedSession();
  if (!authed) return null;
  const { tenant } = authed;

  const demoId = await getDemoSessionId();
  const scope = demoVisibleWhere(tenant.id, demoId);
  const days14 = lastDays(14);
  const days30 = lastDays(30);
  const since7 = new Date(`${days14[7]}T00:00:00+05:30`); // same IST window as Analytics
  const [config, leads, campaigns, serviceRows, viewsByDay, topPaths, leads7, leadsTotal, converted] = await Promise.all([
    getTenantConfig(tenant.id, tenant.name),
    db.lead.findMany({
      where: demoVisibleWhere(tenant.id, demoId),
      orderBy: { createdAt: "desc" },
      select: { name: true, phone: true, email: true },
    }),
    db.campaign.findMany({ where: { tenantId: tenant.id }, orderBy: { createdAt: "desc" } }),
    db.service.findMany({ where: { tenantId: tenant.id }, orderBy: { order: "asc" }, select: { title: true } }),
    db.pageView.groupBy({ by: ["day"], where: { tenantId: tenant.id, day: { gte: days14[0] } }, _sum: { views: true } }),
    db.pageView.groupBy({
      by: ["path"], where: { tenantId: tenant.id, day: { gte: days30[0] } }, _sum: { views: true },
      orderBy: { _sum: { views: "desc" } }, take: 5,
    }),
    db.lead.count({ where: { ...scope, createdAt: { gte: since7 } } }),
    db.lead.count({ where: scope }),
    db.lead.count({ where: { ...scope, status: "converted" } }),
  ]);
  const thisWeek = new Set(days14.slice(7));
  let visits7 = 0, visitsPrev7 = 0;
  for (const r of viewsByDay) {
    if (thisWeek.has(r.day)) visits7 += r._sum.views ?? 0;
    else visitsPrev7 += r._sum.views ?? 0;
  }
  const insights = {
    visits7, visitsPrev7, leads7, leadsTotal, converted,
    topPages: topPaths.map((r) => ({ path: r.path, views: r._sum.views ?? 0 })),
  };
  const sector = VERTICALS.find((v) => v.id === tenant.vertical)?.name ?? "";

  const siteUrl = tenant.customDomain ? `https://${tenant.customDomain}` : `http://${tenant.subdomain}.${ROOT_DOMAIN}`;
  const ann = config.header.announcement ?? { show: false, text: "", link: "" };
  const si = siteIntegrations(config.integrations, config.seo);
  const reviewEntry = config.integrations.googleReviews;
  const reviewLink = reviewEntry?.enabled ? reviewEntry.values.url ?? "" : "";
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
        sector={sector}
        insights={insights}
        occasions={upcomingOccasions(istToday(), 3)}
        hasAnalytics={!!(si.gaId || si.gtmId || si.fbPixelId)}
        reviewLink={reviewLink}
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
