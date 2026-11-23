import Link from "next/link";
import { db } from "@/lib/db";
import { formatINR } from "@/lib/plans";
import { balances, commissionState, type CommissionView } from "@/lib/referral";
import { Ban, CheckCircle2, Clock, Gift, Send, Trophy, Wallet } from "lucide-react";
import { PageHeader, Card, EmptyState } from "@/components/admin/ui";
import { Kpi, Panel, Chips, Who, Avatar, Pill, tbl, thead, th, tbody, tr, td } from "@/components/super/kit";

export const metadata = { title: "Referrals" };

const TONE: Record<CommissionView, "amber" | "green" | "blue" | "violet" | "red"> = {
  pending: "amber", available: "green", requested: "blue", paid: "violet", reversed: "red",
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
      <PageHeader title="Referrals" subtitle={`${referredCount} referred customers · commissions are created when a referred order is paid.`} icon={<Gift />} />
      <div className="mb-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-5">
        <Kpi label="Pending (hold)" value={formatINR(totals.pending)} hint="In refund window" icon={<Clock />} tone="amber" href={href("pending")} />
        <Kpi label="Available" value={formatINR(totals.available)} hint="Can be withdrawn" icon={<CheckCircle2 />} tone="green" href={href("available")} />
        <Kpi label="Requested" value={formatINR(totals.requested)} hint="Awaiting payout" icon={<Send />} tone="blue" href="/super/payouts" />
        <Kpi label="Paid out" value={formatINR(totals.paid)} icon={<Wallet />} tone="violet" href={href("paid")} />
        <Kpi label="Reversed" value={formatINR(totals.reversed)} hint="Refunded orders" icon={<Ban />} tone="red" href={href("reversed")} />
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <Panel title="Top referrers" sub="By commission earned" icon={<Trophy />} className="h-fit lg:col-span-1">
          {top.length === 0 ? <p className="p-8 text-center text-sm text-slate-400">No referrals yet.</p> : (
            <ol className="divide-y divide-slate-100 text-sm dark:divide-white/5">
              {top.map((t, i) => {
                const n = names.get(t.referrerTenantId);
                const on = referrer === t.referrerTenantId;
                return (
                  <li key={t.referrerTenantId}>
                    <Link href={href(status, t.referrerTenantId)} className={`flex items-center gap-3 px-5 py-3 hover:bg-slate-50 dark:hover:bg-white/[0.03] ${on ? "bg-lime-500/5" : ""}`}>
                      <span className={`w-5 text-center text-xs font-bold ${i < 3 ? "text-amber-500" : "text-slate-400"}`}>{i + 1}</span>
                      <Avatar name={n?.name ?? "?"} size="sm" />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-semibold text-slate-800 dark:text-slate-100">{n?.name ?? "Deleted client"}</span>
                        <span className="block text-xs text-slate-400">{t._count} referral{t._count === 1 ? "" : "s"}</span>
                      </span>
                      <span className="font-bold text-slate-900 dark:text-white">{formatINR(t._sum.amount ?? 0)}</span>
                    </Link>
                  </li>
                );
              })}
            </ol>
          )}
        </Panel>

        <div className="lg:col-span-2">
          <Chips items={[...STATES.map((s) => ({ href: href(s), label: s, active: status === s })), ...(referrer ? [{ href: href(status, ""), label: `${names.get(referrer)?.name ?? "Referrer"} ✕`, active: false }] : [])]} />
          <Card className="overflow-hidden">
            {rows.length === 0 ? <EmptyState icon={<Gift />} title="No commissions" hint="Commissions appear when a referred customer pays." /> : (
              <div className="overflow-x-auto">
                <table className={tbl}>
                  <thead className={thead}>
                    <tr>
                      <th className={th}>Referrer</th>
                      <th className={th}>Referred</th>
                      <th className={th}>Order (excl. GST)</th>
                      <th className={th}>Commission</th>
                      <th className={th}>Status</th>
                      <th className={th}>Date</th>
                    </tr>
                  </thead>
                  <tbody className={tbody}>
                    {rows.map((c) => {
                      const st = commissionState(c, now);
                      return (
                        <tr key={c.id} className={tr}>
                          <td className={td}><Who name={c.referrer.name} sub={c.referrer.subdomain} /></td>
                          <td className={td}>{c.referredName || "—"}</td>
                          <td className={`${td} whitespace-nowrap`}>{formatINR(c.baseAmount)}</td>
                          <td className={`${td} whitespace-nowrap font-bold text-slate-900 dark:text-white`}>{formatINR(c.amount)} <span className="text-xs font-normal text-slate-400">({c.ratePct}%)</span></td>
                          <td className={td}><Pill tone={TONE[st]}>{st}</Pill></td>
                          <td className={`${td} whitespace-nowrap text-slate-400`}>{c.createdAt.toLocaleDateString("en-IN")}</td>
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
