import { getAuthedSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { getDemoSessionId } from "@/lib/actions/guard";
import { demoVisibleWhere } from "@/lib/demoSession";
import { DiscountsManager } from "@/components/admin/store/DiscountsManager";

export const metadata = { title: "Discounts" };

export default async function DiscountsPage() {
  const authed = await getAuthedSession();
  if (!authed) return null;
  const tenantId = authed.tenant.id;
  const demoId = await getDemoSessionId();
  const [rows, usage] = await Promise.all([
    db.storeCoupon.findMany({ where: demoVisibleWhere(tenantId, demoId), orderBy: { createdAt: "desc" }, take: 500 }),
    db.storeOrder.groupBy({
      by: ["couponCode"],
      where: { ...demoVisibleWhere(tenantId, demoId), couponCode: { not: "" }, status: { not: "cancelled" } },
      _count: { _all: true },
      _sum: { discount: true, total: true },
    }),
  ]);
  const stats = new Map(usage.map((u) => [u.couponCode, { orders: u._count._all, discount: u._sum.discount ?? 0, revenue: u._sum.total ?? 0 }]));
  const coupons = rows.map((c) => ({
    id: c.id, code: c.code, type: c.type, value: c.value, minOrder: c.minOrder, maxDiscount: c.maxDiscount,
    startsAt: c.startsAt?.toISOString() ?? "", endsAt: c.endsAt?.toISOString() ?? "",
    usageLimit: c.usageLimit, perCustomerLimit: c.perCustomerLimit, used: c.used, firstOrderOnly: c.firstOrderOnly, active: c.active,
    mine: !demoId || c.demoSessionId === demoId,
    stats: stats.get(c.code) ?? { orders: 0, discount: 0, revenue: 0 },
  }));
  return <DiscountsManager coupons={coupons} demo={!!demoId} />;
}
