import Link from "next/link";
import { Eye, Inbox, CalendarClock, Percent, ShieldCheck } from "lucide-react";
import { getAuthedSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { getDemoSessionId } from "@/lib/actions/guard";
import { demoVisibleWhere } from "@/lib/demoSession";
import { lastDays } from "@/lib/analytics";
import { PageHeader, Card, EmptyState } from "@/components/admin/ui";

export const metadata = { title: "Analytics" };

type Props = { searchParams: Promise<{ range?: string }> };

const fmtDay = (k: string) => new Date(`${k}T00:00:00Z`).toLocaleDateString("en-IN", { day: "numeric", month: "short", timeZone: "UTC" });

export default async function AnalyticsPage({ searchParams }: Props) {
  const authed = await getAuthedSession();
  if (!authed) return null;
  const tenantId = authed.tenant.id;
  const range = (await searchParams).range === "7" ? 7 : 30;
  const days = lastDays(range);
  const since = new Date(`${days[0]}T00:00:00+05:30`); // same IST window as the chart
  const scope = demoVisibleWhere(tenantId, await getDemoSessionId());

  const [byDay, byPath, leads, appts] = await Promise.all([
    db.pageView.groupBy({ by: ["day"], where: { tenantId, day: { gte: days[0] } }, _sum: { views: true } }),
    db.pageView.groupBy({
      by: ["path"], where: { tenantId, day: { gte: days[0] } }, _sum: { views: true },
      orderBy: { _sum: { views: "desc" } }, take: 10,
    }),
    db.lead.count({ where: { ...scope, createdAt: { gte: since } } }),
    db.appointment.count({ where: { ...scope, createdAt: { gte: since } } }),
  ]);

  const perDay = new Map(byDay.map((r) => [r.day, r._sum.views ?? 0]));
  const series = days.map((d) => ({ day: d, views: perDay.get(d) ?? 0 }));
  const total = series.reduce((n, d) => n + d.views, 0);
  const max = Math.max(1, ...series.map((d) => d.views));
  const conversion = total > 0 ? ((leads / total) * 100).toFixed(1) : "0";
  const topMax = Math.max(1, ...byPath.map((r) => r._sum.views ?? 0));
  const isDemo = !!authed.session.demo;

  const stats = [
    { label: "Page views", value: total.toLocaleString("en-IN"), icon: Eye, accent: "text-lime-600 bg-lime-500/15" },
    { label: "Leads", value: leads, icon: Inbox, accent: "text-sky-600 bg-sky-500/15", href: "/admin/leads" },
    { label: "Appointments", value: appts, icon: CalendarClock, accent: "text-violet-600 bg-violet-500/15", href: "/admin/appointments" },
    { label: "Conversion", value: `${conversion}%`, icon: Percent, accent: "text-amber-600 bg-amber-500/15", hint: "leads ÷ page views" },
  ];

  const tab = (r: number) =>
    `px-3 py-1.5 rounded-lg text-xs font-semibold ${range === r ? "bg-lime-500 text-white" : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"}`;

  return (
    <>
      <PageHeader
        title="Analytics"
        subtitle="How many people visit your website, which pages they read, and how many get in touch."
        action={
          <div className="inline-flex gap-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-1">
            <Link href="/admin/analytics?range=7" className={tab(7)}>Last 7 days</Link>
            <Link href="/admin/analytics" className={tab(30)}>Last 30 days</Link>
          </div>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        {stats.map((s) => {
          const Ic = s.icon;
          const body = (
            <>
              <span className={`inline-flex w-9 h-9 rounded-xl items-center justify-center mb-2 ${s.accent}`}><Ic className="w-4 h-4" /></span>
              <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">{s.label}</p>
              <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-0.5">{s.value}</p>
              <p className="text-[10px] text-slate-400 mt-0.5">{s.hint ?? `Last ${range} days`}</p>
            </>
          );
          const cls = "rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4";
          return s.href ? (
            <Link key={s.label} href={s.href} className={`${cls} hover:border-lime-400 transition`}>{body}</Link>
          ) : (
            <div key={s.label} className={cls}>{body}</div>
          );
        })}
      </div>

      <Card className="p-4 sm:p-5 mb-5">
        <div className="flex items-baseline justify-between gap-2 mb-4">
          <p className="text-sm font-bold text-slate-900 dark:text-white">Visitors per day</p>
          <p className="text-[11px] text-slate-400">Peak {total ? max : 0} views/day</p>
        </div>
        {total === 0 ? (
          <EmptyState
            title={isDemo ? "Visitor stats aren't collected in demo sandboxes" : "No visits recorded yet"}
            hint={isDemo ? "On your own website, every visit shows up here." : "Share your website link to get your first visitors. Your own visits while signed in don't count."}
          />
        ) : (
          <>
            <div className="flex items-end gap-[2px] sm:gap-1 h-44" role="img" aria-label={`Page views per day over the last ${range} days, ${total} in total`}>
              {series.map((d) => (
                <div key={d.day} className="flex-1 h-full flex flex-col justify-end group relative" title={`${fmtDay(d.day)}: ${d.views} views`}>
                  <div
                    className="rounded-t bg-lime-500/80 group-hover:bg-lime-600 transition-colors min-h-[2px]"
                    style={{ height: `${(d.views / max) * 100}%` }}
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 mt-2 border-t border-slate-100 dark:border-slate-800 pt-2">
              <span>{fmtDay(days[0])}</span>
              {range === 30 && <span className="hidden sm:inline">{fmtDay(days[15])}</span>}
              <span>Today</span>
            </div>
          </>
        )}
      </Card>

      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 overflow-hidden">
          <p className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 text-sm font-bold text-slate-900 dark:text-white">Top pages</p>
          {byPath.length === 0 ? (
            <p className="p-6 text-center text-xs text-slate-400">No page views in this period</p>
          ) : (
            <ul className="divide-y divide-slate-100 dark:divide-slate-800">
              {byPath.map((r) => {
                const v = r._sum.views ?? 0;
                return (
                  <li key={r.path} className="px-4 py-2.5">
                    <div className="flex items-center justify-between gap-3 text-xs">
                      <a href={r.path} target="_blank" rel="noreferrer" className="font-medium text-slate-700 dark:text-slate-200 truncate hover:text-lime-600">
                        {r.path === "/" ? "Home page" : r.path}
                      </a>
                      <span className="font-bold text-slate-900 dark:text-white shrink-0">{v.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="mt-1.5 h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div className="h-full rounded-full bg-lime-500" style={{ width: `${(v / topMax) * 100}%` }} />
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>
        <Card className="p-4 h-fit">
          <p className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
            <ShieldCheck className="w-4 h-4 text-emerald-500" /> Privacy-friendly
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
            We count page views on our own servers. No cookies, no IP addresses and no tracking of individual visitors,
            so you don&apos;t need a cookie banner for this. Search-engine bots and your own visits while signed in are not counted.
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
            Want more detail? Add Google Analytics in <Link href="/admin/seo" className="font-semibold text-lime-600 hover:underline">SEO settings</Link>.
          </p>
        </Card>
      </div>
    </>
  );
}
