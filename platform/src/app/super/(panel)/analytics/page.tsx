import Link from "next/link";
import { BarChart3, Building2, Download, Filter, IndianRupee, Layers, Receipt, ShieldCheck, TrendingUp, UserPlus, Users } from "lucide-react";
import { db } from "@/lib/db";
import { NOT_DEMO_TENANT } from "@/lib/demoSession";
import { formatINR } from "@/lib/plans";
import { verticalName } from "@/lib/verticals";
import { buckets, contactMatcher, pctDelta, series } from "@/lib/superStats";
import { PageHeader } from "@/components/admin/ui";
import { Kpi, Panel, ColumnChart, AreaChart, HBars } from "@/components/super/kit";

export const metadata = { title: "Analytics" };

const RANGES = [
  { id: "30", label: "30 days", days: 30, unit: "day", count: 30 },
  { id: "90", label: "90 days", days: 90, unit: "week", count: 13 },
  { id: "180", label: "6 months", days: 180, unit: "month", count: 6 },
  { id: "365", label: "12 months", days: 365, unit: "month", count: 12 },
] as const;

export default async function AnalyticsPage({ searchParams }: { searchParams: Promise<{ range?: string }> }) {
  const sp = await searchParams;
  const range = RANGES.find((r) => r.id === sp.range) ?? RANGES[2];
  const now = new Date();
  const bs = buckets(range.unit, range.count, now);
  const from = bs[0].start;
  // Equal-length window right before, for trend arrows.
  const prevFrom = new Date(from.getTime() - (now.getTime() - from.getTime()));
  const inRange = (d: Date) => d >= from;
  const inPrev = (d: Date) => d >= prevFrom && d < from;

  const [paidOrders, tenants, leads, provisioned] = await Promise.all([
    db.order.findMany({ where: { status: { in: ["paid", "provisioned"] } }, select: { amount: true, createdAt: true, vertical: true, email: true, phone: true } }),
    db.tenant.findMany({ where: NOT_DEMO_TENANT, select: { createdAt: true, plan: true, vertical: true, status: true } }),
    db.platformLead.findMany({ where: { createdAt: { gte: prevFrom } }, select: { createdAt: true, type: true, verified: true, vertical: true, email: true, phone: true } }),
    db.order.findMany({ where: { status: "provisioned" }, select: { email: true, phone: true } }),
  ]);

  const sum = (rows: { amount: number }[]) => rows.reduce((s, o) => s + o.amount, 0);
  const revenue = sum(paidOrders);
  const periodOrders = paidOrders.filter((o) => inRange(o.createdAt));
  const periodRev = sum(periodOrders);
  const prevRev = sum(paidOrders.filter((o) => inPrev(o.createdAt)));
  const activeClients = tenants.filter((t) => t.status === "active").length;
  const newClients = tenants.filter((t) => inRange(t.createdAt)).length;
  const prevClients = tenants.filter((t) => inPrev(t.createdAt)).length;
  const periodLeads = leads.filter((l) => inRange(l.createdAt));
  const prevLeads = leads.filter((l) => inPrev(l.createdAt)).length;
  const avgOrder = periodOrders.length ? Math.round(periodRev / periodOrders.length) : 0;
  const avgAll = paidOrders.length ? Math.round(revenue / paidOrders.length) : 0;

  const labels = bs.map((b) => b.label);
  const revSeries = series(bs, periodOrders, (o) => o.createdAt, (o) => o.amount);
  const clientSeries = series(bs, tenants, (t) => t.createdAt);
  const leadSeries = series(bs, periodLeads, (l) => l.createdAt);

  // Funnel: demo leads in the period → OTP verified → bought (paid order with same contact) → site live.
  const demos = periodLeads.filter((l) => l.type === "demo");
  const verified = demos.filter((l) => l.verified);
  const bought = demos.filter(contactMatcher(paidOrders));
  const live = bought.filter(contactMatcher(provisioned));
  const funnel = [
    { label: "Demo requested", value: demos.length },
    { label: "OTP verified", value: verified.length },
    { label: "Ordered", value: bought.length },
    { label: "Site live", value: live.length },
  ];

  const tally = <T extends { vertical: string }>(rows: T[], val: (r: T) => number = () => 1) => {
    const m = new Map<string, number>();
    for (const r of rows) if (r.vertical) m.set(r.vertical, (m.get(r.vertical) ?? 0) + val(r));
    return [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8).map(([v, n]) => ({ label: verticalName(v), value: n }));
  };
  const planCounts = new Map<string, number>();
  for (const t of tenants) planCounts.set(t.plan, (planCounts.get(t.plan) ?? 0) + 1);
  const byPlan = [...planCounts.entries()].sort((a, b) => b[1] - a[1]).map(([label, value]) => ({ label, value }));

  const exportBtn = "inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:border-lime-400 hover:text-lime-600 dark:border-white/10 dark:bg-slate-900 dark:text-slate-200";

  return (
    <>
      <PageHeader
        title="Analytics"
        subtitle={`Revenue, growth and funnel · last ${range.label}`}
        icon={<BarChart3 />}
        action={
          <div className="flex flex-wrap gap-2">
            <a href="/super/export?type=clients" className={exportBtn}><Download className="h-4 w-4" /> Clients</a>
            <a href="/super/export?type=orders" className={exportBtn}><Download className="h-4 w-4" /> Orders</a>
            <a href="/super/export?type=leads" className={exportBtn}><Download className="h-4 w-4" /> Leads</a>
          </div>
        }
      />

      <div className="mb-6 inline-flex flex-wrap gap-1 rounded-2xl border border-slate-200 bg-white p-1 shadow-sm dark:border-white/10 dark:bg-slate-900">
        {RANGES.map((r) => (
          <Link
            key={r.id}
            href={`/super/analytics?range=${r.id}`}
            className={`rounded-xl px-3.5 py-1.5 text-sm font-semibold transition ${r.id === range.id ? "admin-grad shadow-md shadow-blue-600/20" : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"}`}
          >
            {r.label}
          </Link>
        ))}
      </div>

      <div className="mb-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <Kpi label="Revenue (period)" value={formatINR(periodRev)} delta={pctDelta(periodRev, prevRev)} hint={`${periodOrders.length} paid orders`} icon={<IndianRupee />} tone="blue" />
        <Kpi label="New clients" value={newClients} delta={pctDelta(newClients, prevClients)} hint={`vs ${prevClients} previous period`} icon={<UserPlus />} tone="violet" />
        <Kpi label="Leads" value={periodLeads.length} delta={pctDelta(periodLeads.length, prevLeads)} hint={`${demos.length} demo requests`} icon={<Users />} tone="amber" />
        <Kpi label="Avg order (period)" value={formatINR(avgOrder)} hint={`All-time ${formatINR(avgAll)}`} icon={<Receipt />} tone="green" />
        <Kpi label="Total revenue" value={formatINR(revenue)} hint={`${paidOrders.length} paid all-time`} icon={<TrendingUp />} tone="blue" />
        <Kpi label="Active clients" value={activeClients} hint={`of ${tenants.length} total`} icon={<Building2 />} tone="green" />
        <Kpi label="Demo → order" value={`${demos.length ? Math.round((bought.length / demos.length) * 100) : 0}%`} hint="In this period" icon={<ShieldCheck />} tone="red" />
        <Kpi label="Demo → verified" value={`${demos.length ? Math.round((verified.length / demos.length) * 100) : 0}%`} hint="OTP completion rate" icon={<Filter />} tone="slate" />
      </div>

      <div className="mb-6 grid gap-6 lg:grid-cols-2">
        <Panel title="Revenue" sub={`Paid & live orders · ${range.unit === "day" ? "daily" : range.unit === "week" ? "weekly" : "monthly"}`} icon={<IndianRupee />}>
          <div className="p-5"><ColumnChart labels={labels} values={revSeries} format={formatINR} /></div>
        </Panel>
        <Panel title="New clients" sub="Sites created" icon={<UserPlus />}>
          <div className="p-5"><ColumnChart labels={labels} values={clientSeries} /></div>
        </Panel>
      </div>

      <div className="mb-6 grid gap-6 lg:grid-cols-5">
        <Panel title="Leads trend" sub="Demo requests and enquiries" icon={<Users />} className="lg:col-span-3">
          <div className="p-5"><AreaChart id="an-leads" labels={labels} values={leadSeries} /></div>
        </Panel>
        <Panel title="Conversion funnel" sub="Demo leads created in this period" icon={<Filter />} className="lg:col-span-2">
          <div className="space-y-3 p-5">
            {funnel.map((s, i) => {
              const top = Math.max(1, funnel[0].value);
              const pct = Math.round((s.value / top) * 100);
              const step = i && funnel[i - 1].value ? Math.round((s.value / funnel[i - 1].value) * 100) : null;
              return (
                <div key={s.label}>
                  <div className="mb-1 flex items-baseline justify-between text-sm">
                    <span className="font-medium text-slate-700 dark:text-slate-200">{s.label}</span>
                    <span className="font-bold text-slate-900 dark:text-white">{s.value}{step != null && <span className="ml-1.5 text-xs font-medium text-slate-400">{step}% of prev.</span>}</span>
                  </div>
                  <div className="h-8 overflow-hidden rounded-lg bg-slate-100 dark:bg-white/5">
                    {s.value > 0 && (
                      <div className="flex h-full items-center rounded-lg bg-gradient-to-r from-[#2563ff] to-[#7c3aed] px-2 text-[11px] font-bold text-white" style={{ width: `${Math.max(8, pct)}%`, opacity: 1 - i * 0.15 }}>
                        {pct}%
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            <p className="pt-1 text-xs text-slate-400">&quot;Ordered&quot; = a paid order with the same phone or email.</p>
          </div>
        </Panel>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <Panel title="Clients by sector" icon={<Building2 />}><div className="p-5"><HBars items={tally(tenants)} /></div></Panel>
        <Panel title="Demo interest" sub="This period" icon={<ShieldCheck />}><div className="p-5"><HBars items={tally(demos)} /></div></Panel>
        <Panel title="Revenue by sector" sub="This period" icon={<IndianRupee />}><div className="p-5"><HBars items={tally(periodOrders, (o) => o.amount)} format={formatINR} /></div></Panel>
        <Panel title="Clients by plan" icon={<Layers />}><div className="p-5"><HBars items={byPlan} /></div></Panel>
      </div>
    </>
  );
}
