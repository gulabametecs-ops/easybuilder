import Link from "next/link";
import { AlertTriangle, BarChart3 } from "lucide-react";
import { db } from "@/lib/db";
import { formatINR } from "@/lib/plans";
import { verticalName } from "@/lib/verticals";
import { PageHeader, StatCard, Card, Badge, EmptyState } from "@/components/admin/ui";

export default async function SuperOverview() {
  const now = new Date();
  const in30 = new Date();
  in30.setDate(in30.getDate() + 30);

  const [enquiries, orders, paidOrders, clients, expiring, recentEnq, recentOrders] = await Promise.all([
    db.platformLead.count(),
    db.order.count(),
    db.order.findMany({ where: { status: { in: ["paid", "provisioned"] } } }),
    db.tenant.count(),
    db.tenant.count({ where: { status: "active", subscriptionEndsAt: { gte: now, lte: in30 } } }),
    db.platformLead.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
    db.order.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
  ]);
  const revenue = paidOrders.reduce((sum, o) => sum + o.amount, 0);

  return (
    <>
      <PageHeader
        title="Platform overview"
        subtitle="Everything happening across your SaaS."
        action={<Link href="/super/analytics" className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium hover:bg-slate-50"><BarChart3 className="w-4 h-4" /> Analytics</Link>}
      />

      {expiring > 0 && (
        <Link href="/super/clients?filter=expiring" className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 mb-6 hover:bg-amber-100">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
          <p className="text-sm text-amber-800"><b>{expiring}</b> client license{expiring > 1 ? "s" : ""} expiring in the next 30 days — review renewals →</p>
        </Link>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <StatCard label="Revenue" value={formatINR(revenue)} hint={`${paidOrders.length} paid`} />
        <StatCard label="Clients" value={clients} />
        <StatCard label="Expiring (30d)" value={expiring} />
        <StatCard label="Orders" value={orders} />
        <StatCard label="Enquiries" value={enquiries} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <div className="flex items-center justify-between p-5 border-b border-slate-100">
            <h2 className="font-semibold text-slate-900">Recent enquiries</h2>
            <Link href="/super/enquiries" className="text-sm text-lime-600 hover:underline">View all →</Link>
          </div>
          {recentEnq.length === 0 ? <EmptyState title="No enquiries yet" /> : (
            <ul className="divide-y divide-slate-100">
              {recentEnq.map((e) => (
                <li key={e.id} className="p-4">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-slate-900">{e.name}</span>
                    <Badge tone={e.type === "demo" ? "blue" : "green"}>{e.type}</Badge>
                    {e.vertical && <span className="text-xs text-slate-400">{verticalName(e.vertical)}</span>}
                  </div>
                  <p className="text-sm text-slate-500">{e.phone} · {e.email}{e.company ? ` · ${e.company}` : ""}</p>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card>
          <div className="flex items-center justify-between p-5 border-b border-slate-100">
            <h2 className="font-semibold text-slate-900">Recent orders</h2>
            <Link href="/super/orders" className="text-sm text-lime-600 hover:underline">View all →</Link>
          </div>
          {recentOrders.length === 0 ? <EmptyState title="No orders yet" /> : (
            <ul className="divide-y divide-slate-100">
              {recentOrders.map((o) => (
                <li key={o.id} className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-slate-900">{o.customerName} · {formatINR(o.amount)}</p>
                    <p className="text-sm text-slate-500">{verticalName(o.vertical)} · {o.plan} · {o.subdomain}</p>
                  </div>
                  <Badge tone={o.status === "provisioned" ? "green" : o.status === "paid" ? "blue" : o.status === "failed" ? "red" : "amber"}>{o.status}</Badge>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </>
  );
}
