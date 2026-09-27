import { getAuthedSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { getPlatformConfig } from "@/lib/platformConfig";
import { DURATIONS, resolveTiers } from "@/lib/plans";
import { BillingManager } from "@/components/admin/BillingManager";

export const metadata = { title: "Billing" };

export default async function BillingPage() {
  const authed = await getAuthedSession();
  if (!authed) return null;

  const [orders, cfg] = await Promise.all([
    db.order.findMany({ where: { tenantId: authed.tenant.id }, orderBy: { createdAt: "desc" } }),
    getPlatformConfig(),
  ]);
  const tiers = resolveTiers(cfg.planOverrides).map((t) => ({ id: t.id, name: t.name, monthlyBase: t.monthlyBase }));
  const durations = DURATIONS.map((d) => ({ id: d.id, label: d.label }));
  const canRenew = authed.session.role === "owner" || authed.session.role === "admin";

  return (
    <div className="admin-full-bleed flex flex-col flex-1 min-h-0">
      <BillingManager
        tiers={tiers}
        durations={durations}
        currentPlan={authed.tenant.plan}
        canRenew={canRenew}
        orders={orders.map((o) => ({
          id: o.id,
          invoiceNo: o.invoiceNo,
          createdAt: o.createdAt,
          amount: o.amount,
          status: o.status,
        }))}
      />
    </div>
  );
}
