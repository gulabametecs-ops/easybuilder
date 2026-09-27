import { getAuthedSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { getPlatformConfig } from "@/lib/platformConfig";
import { serviceLimitForPlan } from "@/lib/plans";
import { ServicesManager } from "@/components/admin/ServicesManager";
import { getDemoSessionId } from "@/lib/actions/guard";
import { demoVisibleWhere } from "@/lib/demoSession";

export const metadata = { title: "Services" };

export default async function ServicesPage() {
  const authed = await getAuthedSession();
  if (!authed) return null;

  const demoId = await getDemoSessionId();
  const [services, cfg] = await Promise.all([
    db.service.findMany({ where: demoVisibleWhere(authed.tenant.id, demoId), orderBy: [{ category: "asc" }, { order: "asc" }] }),
    getPlatformConfig(),
  ]);
  const categories = Array.from(new Set(services.map((s) => s.category)));
  const limit = serviceLimitForPlan(authed.tenant.plan, cfg.planOverrides);

  return (
    <div className="admin-full-bleed flex flex-col flex-1 min-h-0">
      <ServicesManager services={services} categories={categories} limit={limit} count={services.length} />
    </div>
  );
}
