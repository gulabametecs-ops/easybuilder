import Link from "next/link";
import { AlertTriangle, CalendarDays, CreditCard, Download, FileText, IndianRupee, RotateCcw } from "lucide-react";
import { db } from "@/lib/db";
import { formatINR } from "@/lib/plans";
import { verticalName } from "@/lib/verticals";
import { pctDelta } from "@/lib/superStats";
import { PageHeader, Card, EmptyState } from "@/components/admin/ui";
import { RefundButton } from "@/components/super/RefundButton";
import { RetryProvisionButton } from "@/components/super/RetryProvisionButton";
import { FilterBar } from "@/components/super/FilterBar";
import { Kpi, Who, Pill, ORDER_TONE, orderLabel, tbl, thead, th, tbody, tr, td } from "@/components/super/kit";

const STATUSES = ["created", "paid", "provisioned", "failed", "refunded"];

export const metadata = { title: "Orders & Payments" };

export default async function OrdersPage({ searchParams }: { searchParams: Promise<{ q?: string; status?: string }> }) {
  const sp = await searchParams;
  const q = sp.q?.trim();
  const status = STATUSES.find((s) => s === sp.status);
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const collected = { status: { in: ["paid", "provisioned"] } };

  const [orders, total, month, lastMonth, refunded, stuck] = await Promise.all([
    db.order.findMany({
      where: {
        ...(q ? { OR: [{ customerName: { contains: q } }, { email: { contains: q } }, { subdomain: { contains: q } }] } : {}),
        ...(status ? { status } : {}),
      },
      orderBy: { createdAt: "desc" },
    }),
    db.order.aggregate({ where: collected, _sum: { amount: true }, _count: true }),
    db.order.aggregate({ where: { ...collected, createdAt: { gte: monthStart } }, _sum: { amount: true }, _count: true }),
    db.order.aggregate({ where: { ...collected, createdAt: { gte: lastMonthStart, lt: monthStart } }, _sum: { amount: true } }),
    db.order.aggregate({ where: { status: "refunded" }, _sum: { amount: true }, _count: true }),
    db.order.count({ where: { status: "paid" } }),
  ]);
  const shown = orders.filter((o) => o.status === "paid" || o.status === "provisioned").reduce((s, o) => s + o.amount, 0);
  const csv = `/super/export?type=orders${q ? `&q=${encodeURIComponent(q)}` : ""}${status ? `&status=${status}` : ""}`;

  return (
    <>
      <PageHeader
        title="Orders & Payments"
        subtitle={`${orders.length} order${orders.length === 1 ? "" : "s"}${q || status ? " match" : ""} · ${formatINR(shown)} collected`}
        icon={<CreditCard />}
        action={
          <a href={csv} className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 hover:border-lime-400 hover:text-lime-600 dark:border-white/10 dark:bg-slate-900 dark:text-slate-200">
            <Download className="h-4 w-4" /> Export CSV
          </a>
        }
      />

      <div className="mb-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <Kpi label="Total collected" value={formatINR(total._sum.amount ?? 0)} hint={`${total._count} paid orders`} icon={<IndianRupee />} tone="blue" />
        <Kpi label="This month" value={formatINR(month._sum.amount ?? 0)} delta={pctDelta(month._sum.amount ?? 0, lastMonth._sum.amount ?? 0)} hint={`${month._count} orders`} icon={<CalendarDays />} tone="green" />
        <Kpi label="Refunded" value={formatINR(refunded._sum.amount ?? 0)} hint={`${refunded._count} refunds`} icon={<RotateCcw />} tone="violet" href="/super/orders?status=refunded" />
        <Kpi label="Stuck · not live" value={stuck} hint={stuck ? "Paid but not provisioned" : "All paid orders are live"} icon={<AlertTriangle />} tone={stuck ? "red" : "slate"} href="/super/orders?status=paid" />
      </div>

      <FilterBar
        q={sp.q}
        placeholder="Search customer, email, site…"
        selects={[{ name: "status", label: "Status", value: status, options: STATUSES.map((s) => ({ value: s, label: s === "paid" ? "paid · not live" : s })) }]}
      />
      <Card className="overflow-hidden">
        {orders.length === 0 ? <EmptyState icon={<CreditCard />} title={q || status ? "No matching orders" : "No orders yet"} hint="Subscriptions and payments appear here." /> : (
          <div className="overflow-x-auto">
            <table className={tbl}>
              <thead className={thead}>
                <tr>
                  <th className={th}>Customer</th>
                  <th className={th}>Sector · plan</th>
                  <th className={th}>Site</th>
                  <th className={`${th} text-right`}>Amount</th>
                  <th className={th}>Status</th>
                  <th className={th}>Date</th>
                  <th className={th}>Actions</th>
                </tr>
              </thead>
              <tbody className={tbody}>
                {orders.map((o) => {
                  const paid = o.status === "provisioned" || o.status === "paid";
                  const stuckRow = o.status === "paid" || o.status === "created"; // paid-not-live OR needs manual mark-paid
                  return (
                    <tr key={o.id} className={`${tr} ${o.status === "paid" ? "bg-amber-50/60 dark:bg-amber-500/[0.06]" : ""}`}>
                      <td className={td}><Who name={o.customerName} sub={o.email} /></td>
                      <td className={td}>
                        <span className="block whitespace-nowrap text-slate-700 dark:text-slate-200">{verticalName(o.vertical)}</span>
                        <span className="text-xs text-slate-400">{o.plan}{o.kind !== "new" ? ` · ${o.kind}` : ""}{o.couponCode ? ` · ${o.couponCode}` : ""}</span>
                      </td>
                      <td className={`${td} font-mono text-xs`}>{o.subdomain}</td>
                      <td className={`${td} whitespace-nowrap text-right font-bold text-slate-900 dark:text-white`}>{formatINR(o.amount)}</td>
                      <td className={td}>
                        <Pill tone={ORDER_TONE[o.status] ?? "slate"} pulse={o.status === "paid"}>{orderLabel(o.status)}</Pill>
                        {o.provisionError && <p className="mt-1 max-w-[220px] text-xs text-rose-500">{o.provisionError}</p>}
                      </td>
                      <td className={`${td} whitespace-nowrap text-slate-400`}>{new Date(o.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</td>
                      <td className={`${td} whitespace-nowrap`}>
                        <div className="flex items-center gap-3 text-sm">
                          {stuckRow && <RetryProvisionButton orderId={o.id} />}
                          {(paid || o.status === "refunded") && <Link href={`/super/invoice/${o.id}`} className="inline-flex items-center gap-1 font-medium text-lime-600 hover:underline"><FileText className="h-3.5 w-3.5" /> Invoice</Link>}
                          {paid && <RefundButton orderId={o.id} />}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </>
  );
}
