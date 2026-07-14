import { Download } from "lucide-react";
import { db } from "@/lib/db";
import { formatINR } from "@/lib/plans";
import { verticalName, VERTICALS } from "@/lib/verticals";
import { PageHeader, StatCard, Card } from "@/components/admin/ui";

export const metadata = { title: "Analytics" };

export default async function AnalyticsPage() {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const [paidOrders, tenants] = await Promise.all([
    db.order.findMany({ where: { status: { in: ["paid", "provisioned"] } }, select: { amount: true, createdAt: true } }),
    db.tenant.findMany({ select: { createdAt: true, plan: true, vertical: true, status: true } }),
  ]);

  const revenue = paidOrders.reduce((s, o) => s + o.amount, 0);
  const monthRevenue = paidOrders.filter((o) => o.createdAt >= monthStart).reduce((s, o) => s + o.amount, 0);
  const activeClients = tenants.filter((t) => t.status === "active").length;
  const avgOrder = paidOrders.length ? Math.round(revenue / paidOrders.length) : 0;

  // Last 6 months buckets
  const months = Array.from({ length: 6 }, (_, i) => {
    const start = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    const end = new Date(now.getFullYear(), now.getMonth() - (5 - i) + 1, 1);
    return { label: start.toLocaleString("en", { month: "short" }), start, end };
  });
  const revByMonth = months.map((m) => paidOrders.filter((o) => o.createdAt >= m.start && o.createdAt < m.end).reduce((s, o) => s + o.amount, 0));
  const clientsByMonth = months.map((m) => tenants.filter((t) => t.createdAt >= m.start && t.createdAt < m.end).length);

  // Distributions
  const bySector = VERTICALS.map((v) => ({ label: v.name, count: tenants.filter((t) => t.vertical === v.id).length })).filter((x) => x.count > 0);
  const planCounts = new Map<string, number>();
  for (const t of tenants) planCounts.set(t.plan, (planCounts.get(t.plan) ?? 0) + 1);
  const byPlan = Array.from(planCounts.entries()).map(([label, count]) => ({ label, count }));

  return (
    <>
      <PageHeader
        title="Analytics"
        subtitle="Revenue, growth and breakdowns."
        action={
          <div className="flex gap-2">
            <a href="/super/export?type=clients" className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium hover:bg-slate-50"><Download className="w-4 h-4" /> Clients</a>
            <a href="/super/export?type=orders" className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium hover:bg-slate-50"><Download className="w-4 h-4" /> Orders</a>
            <a href="/super/export?type=leads" className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium hover:bg-slate-50"><Download className="w-4 h-4" /> Leads</a>
          </div>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total revenue" value={formatINR(revenue)} hint={`${paidOrders.length} paid`} />
        <StatCard label="This month" value={formatINR(monthRevenue)} />
        <StatCard label="Active clients" value={activeClients} />
        <StatCard label="Avg order value" value={formatINR(avgOrder)} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        <BarChart title="Revenue (last 6 months)" labels={months.map((m) => m.label)} values={revByMonth} format={(v) => formatINR(v)} />
        <BarChart title="New clients (last 6 months)" labels={months.map((m) => m.label)} values={clientsByMonth} format={(v) => String(v)} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <DistBars title="Clients by sector" items={bySector} />
        <DistBars title="Clients by plan" items={byPlan} />
      </div>
    </>
  );
}

// Vertical bar chart (dependency-free).
function BarChart({ title, labels, values, format }: { title: string; labels: string[]; values: number[]; format: (v: number) => string }) {
  const max = Math.max(1, ...values);
  return (
    <Card className="p-5">
      <h3 className="font-semibold text-slate-900 mb-4">{title}</h3>
      <div className="flex items-end gap-3 h-44">
        {values.map((v, i) => (
          <div key={i} className="flex-1 flex flex-col items-center justify-end gap-2">
            <span className="text-[10px] text-slate-500">{v > 0 ? format(v) : ""}</span>
            <div className="w-full rounded-t bg-lime-500/80" style={{ height: `${Math.max(2, (v / max) * 100)}%` }} />
            <span className="text-xs text-slate-400">{labels[i]}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

// Horizontal distribution bars.
function DistBars({ title, items }: { title: string; items: { label: string; count: number }[] }) {
  const max = Math.max(1, ...items.map((i) => i.count));
  return (
    <Card className="p-5">
      <h3 className="font-semibold text-slate-900 mb-4">{title}</h3>
      {items.length === 0 ? <p className="text-sm text-slate-400">No data yet.</p> : (
        <div className="space-y-3">
          {items.map((it) => (
            <div key={it.label}>
              <div className="flex justify-between text-sm mb-1"><span className="text-slate-600 capitalize">{it.label}</span><span className="text-slate-400">{it.count}</span></div>
              <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden"><div className="h-full bg-lime-500 rounded-full" style={{ width: `${(it.count / max) * 100}%` }} /></div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
