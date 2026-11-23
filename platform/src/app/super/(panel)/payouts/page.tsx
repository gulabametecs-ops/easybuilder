import Link from "next/link";
import { Ban, CheckCircle2, Download, Hourglass, Wallet } from "lucide-react";
import { db } from "@/lib/db";
import { formatINR } from "@/lib/plans";
import { maskAccount } from "@/lib/referral";
import { PageHeader, Card, EmptyState } from "@/components/admin/ui";
import { Kpi, Chips, Who, Pill, tbl, thead, th, tbody, tr, td } from "@/components/super/kit";
import { PayoutActions } from "@/components/super/PayoutActions";

export const metadata = { title: "Payouts" };

const TONE: Record<string, "blue" | "green" | "red"> = { requested: "blue", paid: "green", rejected: "red" };

export default async function PayoutsPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const { status } = await searchParams;
  const filter = status === "paid" || status === "rejected" || status === "all" ? status : "requested";
  const [rows, totals] = await Promise.all([
    db.referralWithdrawal.findMany({
      where: filter === "all" ? {} : { status: filter },
      orderBy: { createdAt: filter === "requested" ? "asc" : "desc" },
      take: 300,
      include: { tenant: { select: { name: true, subdomain: true } } },
    }),
    db.referralWithdrawal.groupBy({ by: ["status"], _sum: { amount: true, netAmount: true }, _count: true }),
  ]);
  const t = (s: string) => totals.find((x) => x.status === s);
  const showTds = rows.some((r) => r.tdsAmount > 0);

  return (
    <>
      <PageHeader
        title="Referral payouts"
        subtitle="Withdrawal requests from customers. Transfer the net amount, then mark paid with the UTR."
        icon={<Wallet />}
        action={<Link href="/super/export?type=payouts" className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 hover:border-lime-400 hover:text-lime-600 dark:border-white/10 dark:bg-slate-900 dark:text-slate-200"><Download className="h-4 w-4" /> Export CSV</Link>}
      />
      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
        <Kpi label="Open requests" value={t("requested")?._count ?? 0} hint={formatINR(t("requested")?._sum.netAmount ?? 0) + " to pay"} icon={<Hourglass />} tone={t("requested")?._count ? "amber" : "slate"} href="/super/payouts?status=requested" />
        <Kpi label="Paid out" value={formatINR(t("paid")?._sum.netAmount ?? 0)} hint={`${t("paid")?._count ?? 0} payouts`} icon={<CheckCircle2 />} tone="green" href="/super/payouts?status=paid" />
        <Kpi label="Rejected" value={t("rejected")?._count ?? 0} icon={<Ban />} tone="red" href="/super/payouts?status=rejected" />
      </div>
      <Chips items={["requested", "paid", "rejected", "all"].map((s) => ({ href: `/super/payouts?status=${s}`, label: s === "requested" ? "Open" : s, active: filter === s, count: s === "all" ? totals.reduce((n, x) => n + x._count, 0) : t(s)?._count ?? 0 }))} />
      <Card className="overflow-hidden">
        {rows.length === 0 ? <EmptyState icon={<Wallet />} title={filter === "requested" ? "No open requests" : "Nothing here"} hint="Withdrawal requests from referring customers show up here." /> : (
          <div className="overflow-x-auto">
            <table className={tbl}>
              <thead className={thead}>
                <tr>
                  <th className={th}>Customer</th>
                  <th className={th}>{showTds ? "Gross / TDS / Net" : "Amount"}</th>
                  <th className={th}>Pay to</th>
                  <th className={th}>Status</th>
                  <th className={th}>Requested</th>
                  <th className={th}>Actions</th>
                </tr>
              </thead>
              <tbody className={tbody}>
                {rows.map((w) => (
                  <tr key={w.id} className={`${tr} align-top`}>
                    <td className={td}><Who name={w.tenant.name} sub={w.tenant.subdomain} /></td>
                    <td className={`${td} whitespace-nowrap`}>
                      {showTds ? (
                        <>
                          <span>{formatINR(w.amount)} − {formatINR(w.tdsAmount)} ({w.tdsPct}%)</span><br />
                          <span className="font-bold text-slate-900 dark:text-white">= {formatINR(w.netAmount)}</span>
                        </>
                      ) : <span className="font-bold text-slate-900 dark:text-white">{formatINR(w.netAmount)}</span>}
                    </td>
                    <td className={td}>
                      {w.method === "upi" ? <>UPI <span className="font-mono">{w.upiId}</span></> : <>{w.accountName}<br /><span className="font-mono">{maskAccount(w.accountNumber)}</span> · {w.ifsc}</>}
                      {w.pan ? <><br /><span className="text-xs text-slate-400">PAN {w.pan}</span></> : <><br /><span className="text-xs text-amber-600">No PAN</span></>}
                      {w.status === "requested" && w.method === "bank" && (
                        <details className="text-xs mt-1"><summary className="cursor-pointer text-lime-600">Full account no.</summary><span className="font-mono">{w.accountNumber}</span></details>
                      )}
                    </td>
                    <td className={td}>
                      <Pill tone={TONE[w.status] ?? "slate"}>{w.status === "requested" ? "open" : w.status}</Pill>
                      {w.reference && <p className="text-xs text-slate-400 mt-1">UTR {w.reference}</p>}
                      {w.rejectReason && <p className="text-xs text-red-500 mt-1 max-w-[200px]">{w.rejectReason}</p>}
                    </td>
                    <td className={`${td} whitespace-nowrap text-slate-400`}>{w.createdAt.toLocaleDateString("en-IN")}</td>
                    <td className={td}>{w.status === "requested" ? <PayoutActions id={w.id} /> : <span className="text-xs text-slate-400">{w.processedAt?.toLocaleDateString("en-IN")}</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </>
  );
}
