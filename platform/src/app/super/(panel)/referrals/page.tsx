import Link from "next/link";
import { db } from "@/lib/db";
import { formatINR } from "@/lib/plans";
import { balances, commissionState, type CommissionView } from "@/lib/referral";
import { PageHeader, Card, Badge, EmptyState, StatCard } from "@/components/admin/ui";

export const metadata = { title: "Referrals" };

const TONE: Record<CommissionView, "amber" | "green" | "blue" | "slate" | "red"> = {
  pending: "amber", available: "green", requested: "blue", paid: "slate", reversed: "red",
};
const STATES = ["all", "pending", "available", "requested", "paid", "reversed"] as const;

export default async function SuperReferralsPage({ searchParams }: { searchParams: Promise<{ status?: string; referrer?: string }> }) {
  const sp = await searchParams;
  const status = (STATES as readonly string[]).includes(sp.status ?? "") ? (sp.status as (typeof STATES)[number]) : "all";
  const referrer = sp.referrer ?? "";
  const now = new Date();

  const stateWhere =
    status === "pending" ? { status: "earned", availableAt: { gt: now } }
      : status === "available" ? { status: "earned", availableAt: { lte: now } }
        : status === "all" ? {} : { status };

  const [all, rows, top, referredCount] = await Promise.all([
    db.referralCommission.findMany({ select: { status: true, availableAt: true, amount: true } }),
    db.referralCommission.findMany({
      where: { ...stateWhere, ...(referrer ? { referrerTenantId: referrer } : {}) },
      orderBy: { createdAt: "desc" },
      take: 300,
      include: { referrer: { select: { name: true, subdomain: true } } },
    }),
    db.referralCommission.groupBy({
      by: ["referrerTenantId"],
      where: { status: { not: "reversed" } },
      _sum: { amount: true },
      _count: true,
      orderBy: { _sum: { amount: "desc" } },
      take: 10,
    }),
    db.tenant.count({ where: { referredByTenantId: { not: null } } }),
  ]);
  const totals = balances(all, now);
  const names = new Map(
    (await db.tenant.findMany({ where: { id: { in: top.map((t) => t.referrerTenantId) } }, select: { id: true, name: true, subdomain: true } })).map((t) => [t.id, t]),
  );
  const href = (s: string, r = referrer) => `/super/referrals?status=${s}${r ? `&referrer=${r}` : ""}`;

  return (
    <>
      <PageHeader title="Referrals" subtitle={`${referredCount} referred customers · commissions are created when a referred order is paid.`} />
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-5">
        <StatCard label="Pending (hold)" value={formatINR(totals.pending)} />
        <StatCard label="Available" value={formatINR(totals.available)} />
        <StatCard label="Requested" value={formatINR(totals.requested)} />
        <StatCard label="Paid out" value={formatINR(totals.paid)} />
        <StatCard label="Reversed" value={formatINR(totals.reversed)} />
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <Card className="p-5 lg:col-span-1 h-fit">
          <p className="text-sm font-semibold text-slate-900 mb-3">Top referrers</p>
          {top.length === 0 ? <p className="text-sm text-slate-400">No referrals yet.</p> : (
            <ol className="space-y-2 text-sm">
              {top.map((t, i) => {
                const n = names.get(t.referrerTenantId);
                return (
                  <li key={t.referrerTenantId} className="flex items-center gap-2">
                    <span className="w-5 text-slate-400">{i + 1}.</span>
                    <Link href={href(status, t.referrerTenantId)} className="flex-1 min-w-0 truncate text-slate-800 hover:underline">{n?.name ?? "Deleted client"}</Link>
                    <span className="text-xs text-slate-400">{t._count}×</span>
                    <span className="font-semibold text-slate-900">{formatINR(t._sum.amount ?? 0)}</span>
                  </li>
                );
              })}
            </ol>
          )}
        </Card>

        <div className="lg:col-span-2">
          <div className="flex flex-wrap gap-2 mb-3 text-sm">
            {STATES.map((s) => (
              <Link key={s} href={href(s)} className={`rounded-full px-3 py-1 font-medium capitalize ${status === s ? "bg-slate-900 text-white" : "bg-white border border-slate-200 text-slate-600"}`}>{s}</Link>
            ))}
            {referrer && <Link href={href(status, "")} className="rounded-full px-3 py-1 font-medium bg-lime-100 text-lime-800">Referrer filter ✕</Link>}
          </div>
          <Card>
            {rows.length === 0 ? <EmptyState title="No commissions" /> : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="text-left text-slate-400 border-b border-slate-100">
                    <tr>
                      <th className="p-4 font-medium">Referrer</th>
                      <th className="p-4 font-medium">Referred</th>
                      <th className="p-4 font-medium">Order (excl. GST)</th>
                      <th className="p-4 font-medium">Commission</th>
                      <th className="p-4 font-medium">Status</th>
                      <th className="p-4 font-medium">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {rows.map((c) => {
                      const st = commissionState(c, now);
                      return (
                        <tr key={c.id}>
                          <td className="p-4 font-medium text-slate-900">{c.referrer.name}<br /><span className="text-slate-400 font-normal">{c.referrer.subdomain}</span></td>
                          <td className="p-4 text-slate-600">{c.referredName}</td>
                          <td className="p-4 text-slate-600">{formatINR(c.baseAmount)}</td>
                          <td className="p-4 font-semibold text-slate-900">{formatINR(c.amount)} <span className="text-xs font-normal text-slate-400">({c.ratePct}%)</span></td>
                          <td className="p-4"><Badge tone={TONE[st]}>{st}</Badge></td>
                          <td className="p-4 text-slate-400 whitespace-nowrap">{c.createdAt.toLocaleDateString("en-IN")}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>
      </div>
    </>
  );
}
