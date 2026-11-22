import Link from "next/link";
import {
  Inbox, CalendarClock, FileStack, Wrench, Search, Rocket, Globe,
  ArrowRight, Sparkles, AlertTriangle, Eye, QrCode, LifeBuoy, Plug,
} from "lucide-react";
import { getAuthedSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { ROOT_DOMAIN } from "@/lib/domains";
import { getTenantConfig } from "@/lib/tenant";
import { getDemoSessionId } from "@/lib/actions/guard";
import { demoVisibleWhere } from "@/lib/demoSession";
import { Badge } from "@/components/admin/ui";
import { PlanUsageCard } from "@/components/admin/PlanUsageCard";
import { SetupChecklist } from "@/components/admin/SetupChecklist";
import { getUsage, planFor } from "@/lib/usage";
import { buildChecklist } from "@/lib/setupChecklist";
import { lastDays } from "@/lib/analytics";
import { parseAdminPrefs } from "@/lib/adminPrefs";
import { getTemplate } from "@/lib/templates";
import { defaultTheme } from "@/lib/template";
import { DESIGNS, designTheme } from "@/lib/designs";

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
    leadCount, newLeads, apptCount, pendingAppts, serviceCount,
    galleryCount, views7, siteConfig,
    recentLeads, recentAppts,
    leads7, leads30, appts7, converted,
    config, usage, plan,
  ] = await Promise.all([
    db.lead.count({ where: scope }),
    db.lead.count({ where: { ...scope, status: "new" } }),
    db.appointment.count({ where: scope }),
    db.appointment.count({ where: { ...scope, status: "pending" } }),
    db.service.count({ where: scope }),
    db.galleryItem.count({ where: scope }),
    db.pageView.aggregate({ where: { tenantId, day: { gte: lastDays(7)[0] } }, _sum: { views: true } }),
    db.siteConfig.findUnique({ where: { tenantId }, select: { adminPrefs: true } }),
    db.lead.findMany({ where: scope, orderBy: { createdAt: "desc" }, take: 6 }),
    db.appointment.findMany({ where: scope, orderBy: { createdAt: "desc" }, take: 6 }),
    db.lead.count({ where: { ...scope, createdAt: { gte: day7 } } }),
    db.lead.count({ where: { ...scope, createdAt: { gte: day30 } } }),
    db.appointment.count({ where: { ...scope, createdAt: { gte: day7 } } }),
    db.lead.count({ where: { ...scope, status: "converted" } }),
    getTenantConfig(tenantId, tenant.name),
    getUsage(tenantId),
    planFor(tenant),
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

  const tpl = getTemplate(tenant.vertical);
  const tplHeader = tpl.header(tenant.name);
  const tplFooter = tpl.footer(tenant.name);
  const tplSeo = tpl.seo(tenant.name);
  const { header, footer, seo } = config;
  const checklist = buildChecklist({
    logoImage: header.logoImage ?? "",
    primaryColor: config.theme.colors?.primary ?? "",
    templatePrimaries: [defaultTheme, tpl.theme, ...DESIGNS.map((d) => designTheme(tpl.theme, d.id))].map((t) => t.colors.primary),
    services: serviceCount,
    gallery: galleryCount,
    phones: [...(header.topbar?.phones ?? []), ...(footer.contact?.phones ?? [])],
    email: header.topbar?.email || footer.contact?.email || "",
    templatePhones: [...tplHeader.topbar.phones, ...tplFooter.contact.phones],
    templateEmail: tplHeader.topbar.email,
    seoTitle: seo.title ?? "",
    seoDescription: seo.description ?? "",
    templateSeoTitle: tplSeo.title ?? "",
    templateSeoDescription: tplSeo.description ?? "",
    domainConnected: plan.tier?.customDomain ? !!(tenant.customDomain && tenant.domainStatus === "connected") : null,
    leads: leadCount,
  });
  const checklistHidden = !!parseAdminPrefs(siteConfig?.adminPrefs).setupChecklistHidden;
  const allDone = checklist.every((c) => c.done);
  const visitors7 = views7._sum.views ?? 0;

  const hourIST = Number(now.toLocaleString("en-IN", { hour: "numeric", hour12: false, timeZone: "Asia/Kolkata" }));
  const greeting = hourIST < 12 ? "Good morning" : hourIST < 17 ? "Good afternoon" : "Good evening";
  const card = "rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-slate-900 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_-12px_rgba(15,23,42,0.12)]";

  const stats = [
    { label: "Leads", value: leadCount, hint: `${newLeads} new`, href: "/admin/leads", icon: Inbox, accent: "from-blue-500 to-violet-500" },
    { label: "Appointments", value: apptCount, hint: `${pendingAppts} pending`, href: "/admin/appointments", icon: CalendarClock, accent: "from-sky-500 to-cyan-500" },
    { label: "Visitors this week", value: visitors7.toLocaleString("en-IN"), hint: "Page views · 7 days", href: "/admin/analytics", icon: Eye, accent: "from-violet-500 to-fuchsia-500" },
    { label: "Services", value: serviceCount, hint: "Offerings", href: "/admin/services", icon: Wrench, accent: "from-amber-500 to-orange-500" },
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
        { href: "/admin/share", label: "Share & QR", icon: QrCode },
    { href: "/admin/integrations", label: "Integrations", icon: Plug },
  ];

  return (
    <div className="space-y-5 max-w-6xl">
      {/* Welcome */}
      <div className="admin-grad relative overflow-hidden rounded-3xl shadow-xl shadow-blue-600/15">
        <div className="absolute -right-16 -top-16 w-56 h-56 rounded-full bg-white/10" aria-hidden />
        <div className="absolute right-24 -bottom-20 w-44 h-44 rounded-full bg-white/10" aria-hidden />
        <div className="relative p-5 sm:p-7 flex flex-wrap items-end justify-between gap-5">
          <div className="min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/75">{greeting}</p>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1 break-words">
              {session.name || "there"} 👋
            </h1>
            <p className="text-sm text-white/80 mt-1.5">
              {tenant.name} · {plan.tier?.name ?? tenant.plan} plan
              {expiry ? ` · renews ${expiry}` : ""}
            </p>
            {newLeads > 0 && (
              <Link href="/admin/leads" className="inline-flex items-center gap-1.5 mt-3 rounded-full bg-white/15 hover:bg-white/25 px-3 py-1 text-xs font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-300" /> {newLeads} new lead{newLeads === 1 ? "" : "s"} waiting <ArrowRight className="w-3 h-3" />
              </Link>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            <a
              href={liveUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl bg-white/95 text-blue-700 px-3.5 py-2 text-sm font-bold hover:bg-white/90 shadow-sm"
            >
              <Globe className="w-4 h-4" /> View live site
            </a>
            <Link
              href="/admin/pages"
              className="inline-flex items-center gap-1.5 rounded-xl bg-white/15 hover:bg-white/25 px-3.5 py-2 text-sm font-semibold"
            >
              <FileStack className="w-4 h-4" /> Edit website
            </Link>
          </div>
        </div>
      </div>
      {daysLeft !== null && daysLeft <= 14 && daysLeft > 0 && (
        <div className="rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 px-4 py-2.5 text-sm text-amber-800 dark:text-amber-200 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          Subscription ends in {daysLeft} day{daysLeft === 1 ? "" : "s"} — <Link href="/admin/billing" className="font-bold underline">renew now</Link>
        </div>
      )}

      {!allDone && !checklistHidden && <SetupChecklist items={checklist} canDismiss={!session.demo} />}

      <PlanUsageCard planName={plan.tier?.name ?? tenant.plan} limits={plan.limits} usage={usage} />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((s) => {
          const Ic = s.icon;
          return (
            <Link
              key={s.label}
              href={s.href}
              className={`${card} p-4 hover:-translate-y-0.5 hover:shadow-lg hover:border-lime-400/60 transition group`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`inline-flex w-10 h-10 rounded-xl items-center justify-center text-white bg-gradient-to-br shadow-sm ${s.accent}`}>
                  <Ic className="w-4 h-4" />
                </span>
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-lime-500 group-hover:translate-x-0.5 transition" />
              </div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">{s.label}</p>
              <p className="text-2xl sm:text-3xl tracking-tight font-extrabold text-slate-900 dark:text-white mt-0.5">{s.value}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">{s.hint}</p>
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {trends.map((t) => (
          <div key={t.label} className="rounded-2xl border border-slate-200/70 dark:border-white/10 bg-white/60 dark:bg-white/[0.03] px-4 py-3">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">{t.label}</p>
            <p className="text-lg font-extrabold text-slate-900 dark:text-white mt-0.5">{t.value}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        {/* Recent leads */}
        <div className={`${card} overflow-hidden`}>
          <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <p className="text-sm font-bold text-slate-900 dark:text-white">Recent leads</p>
            <Link href="/admin/leads" className="inline-flex items-center gap-1 text-xs font-semibold text-lime-600 hover:underline">View all <ArrowRight className="w-3 h-3" /></Link>
          </div>
          {recentLeads.length === 0 ? (
            <div className="p-8 text-center"><span className="inline-flex w-11 h-11 rounded-2xl bg-lime-500/12 text-lime-600 items-center justify-center mb-2"><Inbox className="w-5 h-5" /></span><p className="text-sm font-semibold text-slate-700 dark:text-slate-200">No leads yet</p><p className="text-xs text-slate-400 mt-0.5">Share your site to start getting enquiries.</p></div>
          ) : (
            <ul className="divide-y divide-slate-100 dark:divide-slate-800">
              {recentLeads.map((l) => (
                <li key={l.id} className="px-4 py-3 flex items-center gap-3">
                  <span className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 text-white text-xs font-bold flex items-center justify-center shrink-0">
                    {l.name.split(/\s+/).filter(Boolean).map((w) => w[0]).join("").slice(0, 2).toUpperCase() || "?"}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{l.name}</p>
                    <p className="text-xs text-slate-400 truncate">{l.service || "Enquiry"} · {l.phone}</p>
                  </div>
                  <Badge tone={l.status === "new" ? "violet" : l.status === "converted" ? "green" : l.status === "contacted" ? "amber" : "slate"}>{l.status}</Badge>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Recent appointments */}
        <div className={`${card} overflow-hidden`}>
          <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <p className="text-sm font-bold text-slate-900 dark:text-white">Appointments</p>
            <Link href="/admin/appointments" className="inline-flex items-center gap-1 text-xs font-semibold text-lime-600 hover:underline">View all <ArrowRight className="w-3 h-3" /></Link>
          </div>
          {recentAppts.length === 0 ? (
            <div className="p-8 text-center"><span className="inline-flex w-11 h-11 rounded-2xl bg-sky-500/12 text-sky-600 items-center justify-center mb-2"><CalendarClock className="w-5 h-5" /></span><p className="text-sm font-semibold text-slate-700 dark:text-slate-200">No bookings yet</p><p className="text-xs text-slate-400 mt-0.5">Appointment requests will appear here.</p></div>
          ) : (
            <ul className="divide-y divide-slate-100 dark:divide-slate-800">
              {recentAppts.map((a) => (
                <li key={a.id} className="px-4 py-3 flex items-center gap-3">
                  <span className="w-9 h-9 rounded-xl bg-sky-500/12 text-sky-600 flex items-center justify-center shrink-0">
                    <CalendarClock className="w-4 h-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{a.name}</p>
                    <p className="text-xs text-slate-400 truncate">{a.date || "—"} {a.time} · {a.service || "Booking"}</p>
                  </div>
                  <Badge tone={a.status === "pending" ? "amber" : a.status === "confirmed" ? "green" : "slate"}>{a.status}</Badge>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div className={`${card} p-4 sm:p-5`}>
        <div className="flex items-center justify-between gap-2 mb-3">
          <p className="text-sm font-bold text-slate-900 dark:text-white">Quick actions</p>
          <div className="flex items-center gap-3 text-[11px] font-semibold">
            {!allDone && checklistHidden && <SetupChecklist items={checklist} canDismiss={!session.demo} collapsed />}
            <Link href="/admin/help" className="inline-flex items-center gap-1 text-slate-500 hover:text-lime-600">
              <LifeBuoy className="w-3.5 h-3.5" /> Help
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {quick.map((q) => {
            const Ic = q.icon;
            return (
              <Link
                key={q.href}
                href={q.href}
                className="group flex flex-col items-center gap-2 rounded-2xl border border-slate-100 dark:border-white/10 px-2 py-3.5 text-center hover:border-lime-400/60 hover:bg-lime-50/50 dark:hover:bg-lime-500/5 transition"
              >
                <span className="inline-flex w-10 h-10 rounded-xl bg-lime-500/12 text-lime-600 items-center justify-center group-hover:scale-105 transition">
                  <Ic className="w-4 h-4" />
                </span>
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">{q.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
