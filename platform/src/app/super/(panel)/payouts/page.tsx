import Link from "next/link";
import { Download } from "lucide-react";
import { db } from "@/lib/db";
import { formatINR } from "@/lib/plans";
import { maskAccount } from "@/lib/referral";
import { PageHeader, Card, Badge, EmptyState, StatCard } from "@/components/admin/ui";
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
        action={<Link href="/super/export?type=payouts" className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 text-sm font-semibold px-4 py-2 hover:bg-white"><Download className="w-4 h-4" /> CSV</Link>}
      />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
        <StatCard label="Open requests" value={t("requested")?._count ?? 0} hint={formatINR(t("requested")?._sum.netAmount ?? 0) + " to pay"} />
        <StatCard label="Paid out" value={formatINR(t("paid")?._sum.netAmount ?? 0)} hint={`${t("paid")?._count ?? 0} payouts`} />
        <StatCard label="Rejected" value={t("rejected")?._count ?? 0} />
      </div>
      <div className="flex gap-2 mb-3 text-sm">
        {["requested", "paid", "rejected", "all"].map((s) => (
          <Link key={s} href={`/super/payouts?status=${s}`} className={`rounded-full px-3 py-1 font-medium capitalize ${filter === s ? "bg-slate-900 text-white" : "bg-white border border-slate-200 text-slate-600"}`}>{s === "requested" ? "Open" : s}</Link>
        ))}
      </div>
      <Card>
        {rows.length === 0 ? <EmptyState title="Nothing here" hint="Withdrawal requests show up here." /> : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-slate-400 border-b border-slate-100">
                <tr>
                  <th className="p-4 font-medium">Customer</th>
                  <th className="p-4 font-medium">{showTds ? "Gross / TDS / Net" : "Amount"}</th>
                  <th className="p-4 font-medium">Pay to</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium">Requested</th>
                  <th className="p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rows.map((w) => (
                  <tr key={w.id} className="align-top">
                    <td className="p-4 font-medium text-slate-900">{w.tenant.name}<br /><span className="text-slate-400 font-normal">{w.tenant.subdomain}</span></td>
                    <td className="p-4 whitespace-nowrap">
                      {showTds ? (
                        <>
                          <span className="text-slate-600">{formatINR(w.amount)} − {formatINR(w.tdsAmount)} ({w.tdsPct}%)</span><br />
                          <span className="font-semibold text-slate-900">= {formatINR(w.netAmount)}</span>
                        </>
                      ) : <span className="font-semibold text-slate-900">{formatINR(w.netAmount)}</span>}
                    </td>
                    <td className="p-4 text-slate-600">
                      {w.method === "upi" ? <>UPI <span className="font-mono">{w.upiId}</span></> : <>{w.accountName}<br /><span className="font-mono">{maskAccount(w.accountNumber)}</span> · {w.ifsc}</>}
                      {w.pan ? <><br /><span className="text-xs text-slate-400">PAN {w.pan}</span></> : <><br /><span className="text-xs text-amber-600">No PAN</span></>}
                      {w.status === "requested" && w.method === "bank" && (
                        <details className="text-xs mt-1"><summary className="cursor-pointer text-lime-600">Full account no.</summary><span className="font-mono">{w.accountNumber}</span></details>
                      )}
                    </td>
                    <td className="p-4">
                      <Badge tone={TONE[w.status] ?? "slate"}>{w.status}</Badge>
                      {w.reference && <p className="text-xs text-slate-400 mt-1">UTR {w.reference}</p>}
                      {w.rejectReason && <p className="text-xs text-red-500 mt-1 max-w-[200px]">{w.rejectReason}</p>}
                    </td>
                    <td className="p-4 text-slate-400 whitespace-nowrap">{w.createdAt.toLocaleDateString("en-IN")}</td>
                    <td className="p-4">{w.status === "requested" ? <PayoutActions id={w.id} /> : <span className="text-xs text-slate-400">{w.processedAt?.toLocaleDateString("en-IN")}</span>}</td>
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
