import Link from "next/link";
import { statfs } from "node:fs/promises";
import {
  AlertTriangle, BarChart3, Building2, CalendarClock, CheckCircle2, CreditCard, ExternalLink, HardDrive, IndianRupee,
  Plus, Server, Settings, ShieldCheck, Sparkles, Ticket, TrendingUp, UserPlus, Wallet, Zap, Clock, Inbox,
} from "lucide-react";
import { db } from "@/lib/db";
import { formatBytes, formatINR } from "@/lib/plans";
import { verticalName } from "@/lib/verticals";
import { ADMIN_GRACE_DAYS } from "@/lib/subscription";
import { buckets, contactMatcher, pctDelta, series } from "@/lib/superStats";
import { Card } from "@/components/admin/ui";
import { Kpi, Panel, ViewAll, Hero, heroBtn, heroBtnSolid, ColumnChart, AreaChart, HBars, Avatar, Pill, ORDER_TONE, orderLabel, ago } from "@/components/super/kit";

const DAY = 86400000;

export default async function SuperOverview() {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const in7 = new Date(now.getTime() + 7 * DAY);
  const in30 = new Date(now.getTime() + 30 * DAY);
  const graceFrom = new Date(now.getTime() - ADMIN_GRACE_DAYS * DAY);
  const yearAgo = new Date(now.getFullYear(), now.getMonth() - 11, 1);
  const twoWeeksAgo = new Date(now.getTime() - 14 * DAY);
  const leadsFrom = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 29);

  const [
    paid, tenants, demoLeads, recentLeads, expiring, grace, stuck, unverified, payouts,
    recentOrders, recentTenants, recentLeadRows, unverifiedCount, storage, disk,
  ] = await Promise.all([
    db.order.findMany({ where: { status: { in: ["paid", "provisioned"] } }, select: { amount: true, createdAt: true, email: true, phone: true } }),
    db.tenant.findMany({ select: { createdAt: true, status: true, subscriptionEndsAt: true, vertical: true } }),
    db.platformLead.findMany({ where: { type: "demo" }, select: { createdAt: true, email: true, phone: true, vertical: true } }),
    db.platformLead.findMany({ where: { createdAt: { gte: leadsFrom } }, select: { createdAt: true } }),
    db.tenant.findMany({ where: { status: "active", subscriptionEndsAt: { gte: now, lte: in30 } }, orderBy: { subscriptionEndsAt: "asc" }, select: { id: true, name: true, subscriptionEndsAt: true } }),
    db.tenant.findMany({ where: { status: "active", subscriptionEndsAt: { gte: graceFrom, lt: now } }, orderBy: { subscriptionEndsAt: "asc" }, select: { id: true, name: true, subscriptionEndsAt: true } }),
    db.order.findMany({ where: { status: "paid" }, orderBy: { createdAt: "asc" }, select: { id: true, customerName: true, amount: true, createdAt: true } }),
    db.platformLead.findMany({ where: { type: "demo", status: "new", verified: false }, orderBy: { createdAt: "desc" }, take: 5, select: { id: true, name: true, createdAt: true } }),
    db.referralWithdrawal.aggregate({ where: { status: "requested" }, _count: true, _sum: { netAmount: true } }),
    db.order.findMany({ orderBy: { createdAt: "desc" }, take: 6, select: { id: true, customerName: true, amount: true, status: true, createdAt: true } }),
    db.tenant.findMany({ orderBy: { createdAt: "desc" }, take: 6, select: { id: true, name: true, vertical: true, createdAt: true } }),
    db.platformLead.findMany({ orderBy: { createdAt: "desc" }, take: 6, select: { id: true, name: true, type: true, vertical: true, createdAt: true } }),
    db.platformLead.count({ where: { type: "demo", status: "new", verified: false } }),
    db.mediaFile.aggregate({ _sum: { bytes: true } }),
    statfs(process.cwd()).catch(() => null),
  ]);

  // KPIs
  const sum = (rows: { amount: number }[]) => rows.reduce((s, o) => s + o.amount, 0);
  const revThis = sum(paid.filter((o) => o.createdAt >= monthStart));
  const revPrev = sum(paid.filter((o) => o.createdAt >= lastMonthStart && o.createdAt < monthStart));
  const active = tenants.filter((t) => t.status === "active" && (!t.subscriptionEndsAt || t.subscriptionEndsAt > now)).length;
  const newThis = tenants.filter((t) => t.createdAt >= monthStart).length;
  const newPrev = tenants.filter((t) => t.createdAt >= lastMonthStart && t.createdAt < monthStart).length;
  const weekAgo = new Date(now.getTime() - 7 * DAY);
  const demoWeek = demoLeads.filter((l) => l.createdAt >= weekAgo).length;
  const demoPrevWeek = demoLeads.filter((l) => l.createdAt >= twoWeeksAgo && l.createdAt < weekAgo).length;
  const bought = contactMatcher(paid);
  const converted = demoLeads.filter(bought).length;
  const conversion = demoLeads.length ? Math.round((converted / demoLeads.length) * 100) : 0;

  // Charts
  const months = buckets("month", 12, now);
  const revSeries = series(months, paid.filter((o) => o.createdAt >= yearAgo), (o) => o.createdAt, (o) => o.amount);
  const days = buckets("day", 30, now);
  const leadSeries = series(days, recentLeads, (l) => l.createdAt);

  // Sectors
  const tally = (rows: { vertical: string }[]) => {
    const m = new Map<string, number>();
    for (const r of rows) if (r.vertical) m.set(r.vertical, (m.get(r.vertical) ?? 0) + 1);
    return [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5).map(([v, n]) => ({ label: verticalName(v), value: n }));
  };

  // Activity feed
  type Ev = { at: Date; key: string; name: string; text: string; href: string; tone: "green" | "blue" | "violet" | "amber" | "slate" | "red"; tag: string };
  const feed: Ev[] = [
    ...recentOrders.map((o): Ev => ({ at: o.createdAt, key: `o${o.id}`, name: o.customerName, text: `Order · ${formatINR(o.amount)}`, href: `/super/orders?q=${encodeURIComponent(o.customerName)}`, tone: ORDER_TONE[o.status] ?? "slate", tag: orderLabel(o.status) })),
    ...recentTenants.map((t): Ev => ({ at: t.createdAt, key: `t${t.id}`, name: t.name, text: `New client · ${verticalName(t.vertical)}`, href: `/super/clients/${t.id}`, tone: "green", tag: "sign-up" })),
    ...recentLeadRows.map((l): Ev => ({ at: l.createdAt, key: `l${l.id}`, name: l.name, text: `${l.type === "demo" ? "Demo request" : "Enquiry"}${l.vertical ? ` · ${verticalName(l.vertical)}` : ""}`, href: l.type === "demo" ? "/super/demo-leads" : "/super/enquiries", tone: "blue", tag: l.type })),
  ].sort((a, b) => b.at.getTime() - a.at.getTime()).slice(0, 7);

  const exp7 = expiring.filter((t) => t.subscriptionEndsAt! <= in7).length;
  const daysLeft = (d: Date) => Math.max(0, Math.ceil((d.getTime() - now.getTime()) / DAY));
  const attention = expiring.length + grace.length + stuck.length + unverifiedCount + payouts._count;

  const totalBytes = storage._sum.bytes ?? 0;
  const diskTotal = disk ? disk.blocks * disk.bsize : 0;
  const diskFree = disk ? disk.bavail * disk.bsize : 0;
  const diskUsedPct = diskTotal ? Math.round((1 - diskFree / diskTotal) * 100) : 0;
  const hour = Number(now.toLocaleString("en-IN", { hour: "numeric", hour12: false, timeZone: "Asia/Kolkata" }));

  return (
    <>
      <Hero
        eyebrow={now.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Kolkata" })}
        title={`Good ${hour < 12 ? "morning" : hour < 17 ? "afternoon" : "evening"} 👋`}
        subtitle={attention ? <>You have <b>{attention}</b> {attention > 1 ? "items that need" : "item that needs"} attention today.</> : "All clear — nothing needs your attention right now."}
        icon={<Sparkles />}
      >
        <Link href="/super/clients/new" className={heroBtnSolid}><Plus className="h-4 w-4" /> Add client</Link>
        <Link href="/super/coupons" className={heroBtn}><Ticket className="h-4 w-4" /> Create coupon</Link>
        <Link href="/super/analytics" className={heroBtn}><BarChart3 className="h-4 w-4" /> Analytics</Link>
      </Hero>

      <div className="mb-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-5">
        <Kpi label="Revenue this month" value={formatINR(revThis)} delta={pctDelta(revThis, revPrev)} hint={`Last month ${formatINR(revPrev)}`} icon={<IndianRupee />} tone="blue" href="/super/orders" />
        <Kpi label="Active clients" value={active} hint={`of ${tenants.length} total`} icon={<Building2 />} tone="green" href="/super/clients?filter=active" />
        <Kpi label="New clients (month)" value={newThis} delta={pctDelta(newThis, newPrev)} hint={`Last month ${newPrev}`} icon={<UserPlus />} tone="violet" />
        <Kpi label="Demo leads (7 days)" value={demoWeek} delta={pctDelta(demoWeek, demoPrevWeek)} hint={`Prev. week ${demoPrevWeek}`} icon={<ShieldCheck />} tone="amber" href="/super/demo-leads" />
        <div className="col-span-2 lg:col-span-1">
          <Kpi label="Demo → order" value={`${conversion}%`} hint={`${converted} of ${demoLeads.length} demo leads bought`} icon={<TrendingUp />} tone="red" />
        </div>
      </div>

      <div className="mb-6 grid gap-6 lg:grid-cols-5">
        <Panel title="Revenue" sub="Paid & live orders · last 12 months" icon={<IndianRupee />} className="lg:col-span-3" action={<ViewAll href="/super/analytics">Details</ViewAll>}>
          <div className="p-5">
            <p className="mb-4 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">{formatINR(revSeries.reduce((a, b) => a + b, 0))} <span className="text-sm font-medium text-slate-400">in 12 months</span></p>
            <ColumnChart labels={months.map((m) => m.label)} values={revSeries} format={formatINR} />
          </div>
        </Panel>
        <Panel title="Leads" sub="All enquiries · last 30 days" icon={<Inbox />} className="lg:col-span-2" action={<ViewAll href="/super/enquiries" />}>
          <div className="p-5">
            <p className="mb-4 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">{recentLeads.length} <span className="text-sm font-medium text-slate-400">in 30 days</span></p>
            <AreaChart id="leads30" labels={days.map((d) => d.label)} values={leadSeries} />
          </div>
        </Panel>
      </div>

      <div className="mb-6 grid gap-6 lg:grid-cols-3 lg:items-start">
        <Panel title="Needs attention" sub={attention ? `${attention} open item${attention > 1 ? "s" : ""}` : "You're all caught up"} icon={<AlertTriangle />} className="lg:col-span-2">
          <div className="grid gap-px bg-slate-100 dark:bg-white/5 sm:grid-cols-2">
            <AttnBlock icon={<CalendarClock />} tone="amber" title="Licences expiring" count={expiring.length} hint={`${exp7} within 7 days · ${expiring.length} within 30`} href="/super/clients?filter=expiring">
              {expiring.slice(0, 3).map((t) => <AttnRow key={t.id} href={`/super/clients/${t.id}`} name={t.name} right={`${daysLeft(t.subscriptionEndsAt!)}d left`} urgent={t.subscriptionEndsAt! <= in7} />)}
            </AttnBlock>
            <AttnBlock icon={<Clock />} tone="red" title="Expired · in grace" count={grace.length} hint={`Admin still open for ${ADMIN_GRACE_DAYS} days after expiry`} href="/super/clients?filter=expired">
              {grace.slice(0, 3).map((t) => <AttnRow key={t.id} href={`/super/clients/${t.id}`} name={t.name} right={`${ADMIN_GRACE_DAYS - Math.floor((now.getTime() - t.subscriptionEndsAt!.getTime()) / DAY)}d grace`} urgent />)}
            </AttnBlock>
            <AttnBlock icon={<Zap />} tone="violet" title="Paid · not live" count={stuck.length} hint="Payment received but site not provisioned" href="/super/orders?status=paid">
              {stuck.slice(0, 3).map((o) => <AttnRow key={o.id} href="/super/orders?status=paid" name={o.customerName} right={formatINR(o.amount)} urgent />)}
            </AttnBlock>
            <AttnBlock icon={<ShieldCheck />} tone="blue" title="Unverified demo leads" count={unverifiedCount} hint="Requested a demo but never entered the OTP" href="/super/demo-leads?status=new">
              {unverified.slice(0, 3).map((l) => <AttnRow key={l.id} href="/super/demo-leads?status=new" name={l.name} right={ago(l.createdAt, now)} />)}
            </AttnBlock>
            <AttnBlock icon={<Wallet />} tone="green" title="Payout requests" count={payouts._count} hint={payouts._count ? `${formatINR(payouts._sum.netAmount ?? 0)} to transfer` : "No referral withdrawals waiting"} href="/super/payouts" wide />
          </div>
        </Panel>

        <Panel title="Recent activity" icon={<Zap />}>
          {feed.length === 0 ? <p className="p-8 text-center text-sm text-slate-400">Nothing yet.</p> : (
            <ul className="divide-y divide-slate-100 dark:divide-white/5">
              {feed.map((e) => (
                <li key={e.key}>
                  <Link href={e.href} className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50 dark:hover:bg-white/[0.03]">
                    <Avatar name={e.name} size="sm" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">{e.name}</p>
                      <p className="truncate text-xs text-slate-400 dark:text-slate-500">{e.text} · {ago(e.at, now)}</p>
                    </div>
                    <Pill tone={e.tone}>{e.tag}</Pill>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Panel title="Top sectors" sub="By clients" icon={<Building2 />}>
          <div className="p-5"><HBars items={tally(tenants)} empty="No clients yet." /></div>
        </Panel>
        <Panel title="Demo interest" sub="By sector requested" icon={<ShieldCheck />}>
          <div className="p-5"><HBars items={tally(demoLeads)} empty="No demo requests yet." /></div>
        </Panel>
        <div className="space-y-6">
          <Panel title="Storage" icon={<HardDrive />} action={<ViewAll href="/super/clients">Clients</ViewAll>}>
            <div className="space-y-4 p-5">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-slate-500 dark:text-slate-400"><HardDrive className="h-4 w-4" /> Client uploads</span>
                <span className="font-bold text-slate-900 dark:text-white">{formatBytes(totalBytes)}</span>
              </div>
              <div>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-slate-500 dark:text-slate-400"><Server className="h-4 w-4" /> Server disk</span>
                  <span className="font-bold text-slate-900 dark:text-white">{disk ? `${diskUsedPct}% used` : "—"}</span>
                </div>
                {disk ? (
                  <>
                    <div className="h-2.5 overflow-hidden rounded-full bg-slate-100 dark:bg-white/5">
                      <div className={`h-full rounded-full ${diskUsedPct > 85 ? "bg-rose-500" : diskUsedPct > 70 ? "bg-amber-500" : "bg-gradient-to-r from-[#2563ff] to-[#7c3aed]"}`} style={{ width: `${diskUsedPct}%` }} />
                    </div>
                    <p className="mt-1.5 text-xs text-slate-400">{formatBytes(diskFree)} free of {formatBytes(diskTotal)}</p>
                  </>
                ) : <p className="text-xs text-slate-400">Not available on this host.</p>}
              </div>
            </div>
          </Panel>
          <Card className="grid grid-cols-2 gap-2 p-3">
            {[
              { href: "/super/clients/new", label: "Add client", icon: Plus },
              { href: "/super/coupons", label: "Coupon", icon: Ticket },
              { href: "/super/settings", label: "Settings", icon: Settings },
              { href: "/", label: "View site", icon: ExternalLink, ext: true },
              { href: "/super/orders", label: "Orders", icon: CreditCard },
              { href: "/super/payouts", label: "Payouts", icon: CheckCircle2 },
            ].map((a) => {
              const cls = "flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-lime-500/10 hover:text-lime-600 dark:text-slate-200";
              const inner = <><a.icon className="h-4 w-4 text-lime-600 dark:text-lime-400" /> {a.label}</>;
              return a.ext
                ? <a key={a.label} href={a.href} target="_blank" rel="noreferrer" className={cls}>{inner}</a>
                : <Link key={a.label} href={a.href} className={cls}>{inner}</Link>;
            })}
          </Card>
        </div>
      </div>
    </>
  );
}

const ATTN_TONE = {
  amber: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  red: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
  violet: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
  blue: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  green: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
};

function AttnBlock({ icon, tone, title, count, hint, href, children, wide }: {
  icon: React.ReactNode; tone: keyof typeof ATTN_TONE; title: string; count: number; hint: string; href: string; children?: React.ReactNode; wide?: boolean;
}) {
  return (
    <div className={`bg-white p-4 dark:bg-slate-900 ${wide ? "sm:col-span-2" : ""}`}>
      <Link href={href} className="group flex items-center gap-3">
        <span className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl [&>svg]:h-4 [&>svg]:w-4 ${ATTN_TONE[tone]}`}>{icon}</span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-slate-900 group-hover:text-lime-600 dark:text-white">{title}</p>
          <p className="truncate text-xs text-slate-400 dark:text-slate-500">{hint}</p>
        </div>
        <span className={`text-xl font-extrabold ${count ? "text-slate-900 dark:text-white" : "text-slate-400/50"}`}>{count}</span>
      </Link>
      {children && <ul className="mt-2 space-y-0.5">{children}</ul>}
    </div>
  );
}

function AttnRow({ href, name, right, urgent }: { href: string; name: string; right: string; urgent?: boolean }) {
  return (
    <li>
      <Link href={href} className="flex items-center justify-between gap-2 rounded-lg px-2 py-1 text-xs hover:bg-slate-50 dark:hover:bg-white/5">
        <span className="truncate text-slate-600 dark:text-slate-300">{name}</span>
        <span className={`shrink-0 font-semibold ${urgent ? "text-rose-600 dark:text-rose-400" : "text-slate-400"}`}>{right}</span>
      </Link>
    </li>
  );
}
