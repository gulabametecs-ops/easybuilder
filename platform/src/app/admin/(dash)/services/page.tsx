import { getAuthedSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { getPlatformConfig } from "@/lib/platformConfig";
import { serviceLimitForPlan } from "@/lib/plans";
import { PageHeader } from "@/components/admin/ui";
import { ServicesManager } from "@/components/admin/ServicesManager";

export const metadata = { title: "Services" };

export default async function ServicesPage() {
  const authed = await getAuthedSession();
  if (!authed) return null;

  const [services, cfg] = await Promise.all([
    db.service.findMany({ where: { tenantId: authed.tenant.id }, orderBy: [{ category: "asc" }, { order: "asc" }] }),
    getPlatformConfig(),
  ]);
  const categories = Array.from(new Set(services.map((s) => s.category)));
  const limit = serviceLimitForPlan(authed.tenant.plan, cfg.planOverrides);

  return (
    <>
      <PageHeader
        title="Services"
        subtitle={`${services.length} services across ${categories.length} categories${limit > 0 ? ` · ${limit} max on your plan` : ""}`}
      />
      <ServicesManager services={services} categories={categories} limit={limit} count={services.length} />
    </>
  );
}
