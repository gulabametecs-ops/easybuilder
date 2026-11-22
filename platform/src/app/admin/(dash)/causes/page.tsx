import { getAuthedSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { CausesManager } from "@/components/admin/CausesManager";
import { getDemoSessionId } from "@/lib/actions/guard";
import { demoVisibleWhere } from "@/lib/demoSession";
import { mapCause } from "@/lib/cause";

export const metadata = { title: "Causes" };

export default async function CausesAdminPage() {
  const authed = await getAuthedSession();
  if (!authed) return null;
  const demoId = await getDemoSessionId();
  const where = demoVisibleWhere(authed.tenant.id, demoId);
  const [rows, paid] = await Promise.all([
    db.cause.findMany({ where, orderBy: [{ featured: "desc" }, { order: "desc" }] }),
    db.siteDonation.groupBy({
      by: ["causeId"],
      where: { ...where, status: "paid", causeId: { not: "" } },
      _sum: { amount: true },
      _count: { _all: true },
    }),
  ]);
  // amount is in paise → ₹
  const online = new Map(paid.map((p) => [p.causeId, { amount: Math.round((p._sum.amount ?? 0) / 100), donors: p._count._all }]));
  const causes = rows.map((r) => {
    const o = online.get(r.id) ?? { amount: 0, donors: 0 };
    return { ...mapCause(r, o), published: r.published, offlineRaised: r.offlineRaised, offlineDonors: r.offlineDonors, online: o };
  });
  return (
    <div className="admin-full-bleed flex flex-col flex-1 min-h-0">
      <CausesManager causes={causes} />
    </div>
  );
}
