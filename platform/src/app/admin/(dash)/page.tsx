import Link from "next/link";
import {
  Inbox, CalendarClock, FileStack, Wrench, Search, Rocket, Globe, Images,
  Megaphone, ArrowRight, Sparkles, CheckCircle2, Circle, AlertTriangle,
} from "lucide-react";
import { getAuthedSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { ROOT_DOMAIN } from "@/lib/domains";
import { getTenantConfig } from "@/lib/tenant";
import { getDemoSessionId } from "@/lib/actions/guard";
import { demoVisibleWhere } from "@/lib/demoSession";
import { Badge } from "@/components/admin/ui";

export default async function DashboardPage() {
  const authed = await getAuthedSession();
  if (!authed) return null;
  const { tenant, session } = authed;
  const tenantId = tenant.id;
  const demoId = await getDemoSessionId();
  const scope = demoVisibleWhere(tenantId, demoId);

  const now = new Date();
  const day7 = new Date(now.getTime() - 7 * 24 * 3600 * 1000);
  const day30 = new Date(now.getTime() - 30 * 24 * 3600 * 1000);

  const [
    leadCount, newLeads, apptCount, pendingAppts, pageCount, serviceCount,
    galleryCount, noticeCount, campaignCount,
    recentLeads, recentAppts,
    leads7, leads30, appts7, converted,
    config,
  ] = await Promise.all([
    db.lead.count({ where: scope }),
    db.lead.count({ where: { ...scope, status: "new" } }),
    db.appointment.count({ where: scope }),
    db.appointment.count({ where: { ...scope, status: "pending" } }),
    db.page.count({ where: { tenantId } }),
    db.service.count({ where: scope }),
    db.galleryItem.count({ where: scope }),
    db.notice.count({ where: scope }),
    db.campaign.count({ where: { tenantId } }),
    db.lead.findMany({ where: scope, orderBy: { createdAt: "desc" }, take: 6 }),
    db.appointment.findMany({ where: scope, orderBy: { createdAt: "desc" }, take: 6 }),
    db.lead.count({ where: { ...scope, createdAt: { gte: day7 } } }),
    db.lead.count({ where: { ...scope, createdAt: { gte: day30 } } }),
    db.appointment.count({ where: { ...scope, createdAt: { gte: day7 } } }),
    db.lead.count({ where: { ...scope, status: "converted" } }),
    getTenantConfig(tenantId, tenant.name),
  ]);

  const conversionRate = leadCount > 0 ? Math.round((converted / leadCount) * 100) : 0;
  const liveUrl = tenant.customDomain
    ? `https://${tenant.customDomain}`
    : `http://${tenant.subdomain}.${ROOT_DOMAIN}`;
  const expiry = tenant.subscriptionEndsAt
    ? new Date(tenant.subscriptionEndsAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
    : null;
  const daysLeft = tenant.subscriptionEndsAt
    ? Math.ceil((new Date(tenant.subscriptionEndsAt).getTime() - now.getTime()) / (24 * 3600 * 1000))
    : null;

  const seo = config.seo;
  const checklist = [
    { ok: !!seo.title && seo.title.length >= 10, label: "SEO title set", href: "/admin/seo" },
    { ok: !!seo.description && seo.description.length >= 50, label: "Meta description", href: "/admin/seo" },
            { ok: !!seo.ogImage, label: "Social share image", href: "/admin/seo" },
    { ok: !!seo.googleVerification || !!seo.gaId, label: "Analytics / Search Console", href: "/admin/seo" },
    { ok: !!(tenant.customDomain && tenant.domainStatus === "connected"), label: "Custom domain connected", href: "/admin/settings" },
    { ok: serviceCount > 0, label: "At least one service", href: "/admin/services" },
    { ok: galleryCount > 0, label: "Gallery photos added", href: "/admin/gallery" },
    { ok: (config.header?.nav?.length ?? 0) > 0, label: "Menu links configured", href: "/admin/appearance" },
  ];
  const checklistDone = checklist.filter((c) => c.ok).length;

  const stats = [
    { label: "Leads", value: leadCount, hint: `${newLeads} new`, href: "/admin/leads", icon: Inbox, accent: "text-lime-600 bg-lime-500/15" },
    { label: "Appointments", value: apptCount, hint: `${pendingAppts} pending`, href: "/admin/appointments", icon: CalendarClock, accent: "text-sky-600 bg-sky-500/15" },
    { label: "Pages", value: pageCount, hint: "Edit content", href: "/admin/pages", icon: FileStack, accent: "text-violet-600 bg-violet-500/15" },
    { label: "Services", value: serviceCount, hint: "Offerings", href: "/admin/services", icon: Wrench, accent: "text-amber-600 bg-amber-500/15" },
  ];

  const trends = [
    { label: "Leads · 7d", value: leads7 },
    { label: "Leads · 30d", value: leads30 },
    { label: "Appts · 7d", value: appts7 },
    { label: "Conversion", value: `${conversionRate}%` },
  ];

  const quick = [
    { href: "/admin/pages", label: "Edit pages", icon: FileStack },
    { href: "/admin/appearance", label: "Appearance", icon: Sparkles },
    { href: "/admin/seo", label: "SEO", icon: Search },
    { href: "/admin/marketing", label: "Marketing", icon: Rocket },
    { href: "/admin/notices", label: "Notices", icon: Megaphone },
    { href: "/admin/gallery", label: "Gallery", icon: Images },
  ];

  return (
    <div className="space-y-5 max-w-6xl">
      {/* Welcome */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-lime-500 via-lime-400 to-emerald-500" />
        <div className="p-4 sm:p-5 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-lime-600">Dashboard</p>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-0.5">
              Welcome, {session.name || "there"}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {tenant.name} · Plan {tenant.plan}
              {expiry ? ` · renews ${expiry}` : ""}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <a
              href={liveUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-600 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:border-lime-400"
            >
              <Globe className="w-3.5 h-3.5 text-lime-600" /> Live site
            </a>
            <Link
              href="/admin/billing"
              className="inline-flex items-center gap-1.5 rounded-xl bg-lime-500 text-white px-3 py-2 text-xs font-bold hover:bg-lime-600"
            >
              Billing <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
        {daysLeft !== null && daysLeft <= 14 && daysLeft > 0 && (
          <div className="mx-4 mb-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 px-3 py-2 text-xs text-amber-800 dark:text-amber-200 flex items-center gap-2">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
            Subscription ends in {daysLeft} day{daysLeft === 1 ? "" : "s"} — <Link href="/admin/billing" className="font-bold underline">renew now</Link>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((s) => {
          const Ic = s.icon;
          return (
            <Link
              key={s.label}
              href={s.href}
              className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 hover:border-lime-400 transition group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`inline-flex w-9 h-9 rounded-xl items-center justify-center ${s.accent}`}>
                  <Ic className="w-4 h-4" />
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-lime-500" />
              </div>
              <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">{s.label}</p>
              <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-0.5">{s.value}</p>
              <p className="text-[10px] text-slate-400 mt-0.5">{s.hint}</p>
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {trends.map((t) => (
          <div key={t.label} className="rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/40 px-3 py-3">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">{t.label}</p>
            <p className="text-lg font-extrabold text-slate-900 dark:text-white mt-0.5">{t.value}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        {/* Checklist */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-bold text-slate-900 dark:text-white">Setup checklist</p>
            <span className="text-[10px] font-bold text-lime-600">{checklistDone}/{checklist.length}</span>
          </div>
          <div className="h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 mb-3 overflow-hidden">
            <div className="h-full bg-lime-500 rounded-full" style={{ width: `${(checklistDone / checklist.length) * 100}%` }} />
          </div>
          <ul className="space-y-1.5">
            {checklist.map((c) => (
              <li key={c.label}>
                <Link href={c.href} className="flex items-center gap-2 text-xs rounded-lg px-2 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-800">
                  {c.ok ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> : <Circle className="w-3.5 h-3.5 text-slate-300 shrink-0" />}
                  <span className={c.ok ? "text-slate-500 dark:text-slate-400" : "text-slate-700 dark:text-slate-200 font-medium"}>{c.label}</span>
                </Link>
              </li>
            ))}
          </ul>
          <p className="text-[10px] text-slate-400 mt-3">{campaignCount} campaign(s) · {noticeCount} notice(s)</p>
        </div>

        {/* Recent leads */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 overflow-hidden lg:col-span-1">
          <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <p className="text-sm font-bold text-slate-900 dark:text-white">Recent leads</p>
            <Link href="/admin/leads" className="text-[11px] font-semibold text-lime-600 hover:underline">View all</Link>
          </div>
          {recentLeads.length === 0 ? (
            <p className="p-6 text-center text-xs text-slate-400">No leads yet</p>
          ) : (
            <ul className="divide-y divide-slate-100 dark:divide-slate-800">
              {recentLeads.map((l) => (
                <li key={l.id} className="px-4 py-2.5 flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">{l.name}</p>
                    <p className="text-[10px] text-slate-400 truncate">{l.phone} · {l.service || "Enquiry"}</p>
                  </div>
                  <Badge tone={l.status === "new" ? "green" : "slate"}>{l.status}</Badge>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Recent appointments */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <p className="text-sm font-bold text-slate-900 dark:text-white">Appointments</p>
            <Link href="/admin/appointments" className="text-[11px] font-semibold text-lime-600 hover:underline">View all</Link>
          </div>
          {recentAppts.length === 0 ? (
            <p className="p-6 text-center text-xs text-slate-400">No bookings yet</p>
          ) : (
            <ul className="divide-y divide-slate-100 dark:divide-slate-800">
              {recentAppts.map((a) => (
                <li key={a.id} className="px-4 py-2.5 flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">{a.name}</p>
                    <p className="text-[10px] text-slate-400 truncate">{a.date || "—"} {a.time} · {a.service || "Booking"}</p>
                  </div>
                  <Badge tone={a.status === "pending" ? "amber" : a.status === "confirmed" ? "green" : "slate"}>{a.status}</Badge>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4">
        <p className="text-sm font-bold text-slate-900 dark:text-white mb-3">Quick actions</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {quick.map((q) => {
            const Ic = q.icon;
            return (
              <Link
                key={q.href}
                href={q.href}
                className="flex flex-col items-center gap-1.5 rounded-xl border border-slate-100 dark:border-slate-800 px-2 py-3 text-center hover:border-lime-400 transition"
              >
                <span className="inline-flex w-8 h-8 rounded-lg bg-lime-500/15 text-lime-600 items-center justify-center">
                  <Ic className="w-4 h-4" />
                </span>
                <span className="text-[10px] font-bold text-slate-700 dark:text-slate-200">{q.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
