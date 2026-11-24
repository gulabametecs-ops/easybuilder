import Link from "next/link";
import { redirect } from "next/navigation";
import { ExternalLink, Rocket, Megaphone } from "lucide-react";
import { getAuthedSession } from "@/lib/auth";
import { getCurrentTenant } from "@/lib/tenant";
import { ROOT_DOMAIN } from "@/lib/domains";
import { getPlatformConfig } from "@/lib/platformConfig";
import { checkAdminAccess } from "@/lib/subscription";
import { getActiveDemoSessionForTenant, isDemoSubdomain, demoVisibleWhere } from "@/lib/demoSession";
import { db } from "@/lib/db";
import { Sidebar, AdminPageTitle } from "@/components/admin/Sidebar";
import { ThemeToggle } from "@/components/marketing/ThemeToggle";
import { DemoTimerBar } from "@/components/site/DemoTimerBar";
import { PageIntro } from "@/components/PageIntro";
import { isStoreVertical } from "@/lib/store";

export const metadata = { title: "Admin" };

const proto = ROOT_DOMAIN.includes("localhost") ? "http" : "https";

export default async function DashLayout({ children }: { children: React.ReactNode }) {
  const tenant = await getCurrentTenant();
  const authed = await getAuthedSession();
  const demoSession =
    tenant && isDemoSubdomain(tenant.subdomain) ? await getActiveDemoSessionForTenant(tenant) : null;

  // Demo tenants: require temporary admin login (shown after OTP on /demos).
  if (!authed) {
    if (tenant && isDemoSubdomain(tenant.subdomain) && demoSession) {
      redirect("/admin/login");
    }
    redirect("/admin/login");
  }

  // Demo without OTP session: bounce to marketing demos.
  if (tenant && isDemoSubdomain(tenant.subdomain) && !demoSession) {
    const root = ROOT_DOMAIN.includes("localhost") ? "http" : "https";
    const host = ROOT_DOMAIN.includes("localhost") ? "localhost:3000" : ROOT_DOMAIN;
    redirect(`${root}://${host}/demos?expired=1`);
  }

  const access = checkAdminAccess(authed.tenant);
  // Demo sandboxes stay usable even if the seed tenant subscription is odd.
  if (!access.allowed && !demoSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 px-6 text-center">
        <div className="max-w-md bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-xl font-bold text-slate-900">
            {access.reason === "suspended" ? "Account suspended" : "Subscription expired"}
          </h1>
          <p className="text-slate-500 mt-2 text-sm">
            {access.reason === "suspended"
              ? "Your account has been suspended. Please contact platform support."
              : "Your plan has expired past the grace period. Contact support to restore access."}
          </p>
        </div>
      </div>
    );
  }

  const upgradeUrl = `${proto}://${ROOT_DOMAIN}/#pricing`;
  const planLabel = demoSession ? "demo" : authed.tenant.plan;
  const platform = await getPlatformConfig();

  const demoId = demoSession?.id ?? null;
  const scope = demoVisibleWhere(authed.tenant.id, demoId);
  const [newLeads, pendingAppts, newVolunteers, newOrders] = await Promise.all([
    db.lead.count({ where: { ...scope, status: "new" } }),
    db.appointment.count({ where: { ...scope, status: "pending" } }),
    db.volunteer.count({ where: { ...scope, status: "new" } }),
    isStoreVertical(authed.tenant.vertical) ? db.storeOrder.count({ where: { ...scope, status: "new", NOT: { paymentMethod: "online", paymentStatus: { in: ["pending", "failed"] } } } }) : 0,
  ]);

  return (
    <div className="admin-brand min-h-screen bg-slate-50 dark:bg-slate-950 lg:flex lg:h-screen lg:overflow-hidden">
      <PageIntro />
      <Sidebar
        bizName={authed.tenant.name}
        userName={authed.session.name}
        userEmail={authed.session.email}
        newLeads={newLeads}
        pendingAppts={pendingAppts}
        newVolunteers={newVolunteers}
        newOrders={newOrders}
        vertical={authed.tenant.vertical}
      />
      <div className="flex-1 min-w-0 flex flex-col min-h-0 admin-shell">
        {demoSession?.expiresAt && <DemoTimerBar expiresAt={demoSession.expiresAt.toISOString()} link={{ href: "/", label: "View website" }} />}
        {access.expired && !demoSession && (
          <div className="bg-amber-500 text-amber-950 text-sm px-5 sm:px-8 py-2.5 flex items-center justify-between gap-3 shrink-0">
            <span className="font-medium">Your subscription has expired. Renew now to keep your site online.</span>
            <a href="/admin/billing" className="shrink-0 rounded-md bg-amber-950 text-white px-3 py-1 text-xs font-semibold">Renew</a>
          </div>
        )}
        {platform.broadcastShow && platform.broadcastText && (
          <div className="bg-slate-900 text-white text-sm px-5 sm:px-8 py-2.5 flex items-center gap-2 shrink-0">
            <Megaphone className="w-4 h-4 text-violet-300 shrink-0" />
            <span>{platform.broadcastText}</span>
          </div>
        )}
        <header className="sticky top-0 z-20 bg-white/80 dark:bg-slate-950/80 backdrop-blur border-b border-slate-200/80 dark:border-white/10 px-4 sm:px-8 h-14 sm:h-16 flex items-center justify-between gap-3 shrink-0">
          <AdminPageTitle />
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <span className="hidden md:inline-flex items-center gap-1.5 rounded-full border border-slate-200 dark:border-white/10 px-2.5 py-1 text-[11px] font-semibold text-slate-600 dark:text-slate-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> <span className="capitalize">{planLabel}</span> plan
            </span>
            <ThemeToggle className="w-9 h-9 rounded-xl flex items-center justify-center border border-slate-200 dark:border-white/10 text-slate-600 dark:text-amber-300 hover:border-lime-400 hover:text-lime-600 transition-colors" />
            <a href="/" target="_blank" rel="noreferrer" title="View site" className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-white/10 px-2.5 sm:px-3 py-1.5 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:border-lime-400 hover:text-lime-600">
              <ExternalLink className="w-4 h-4" /> <span className="hidden sm:inline">View site</span>
            </a>
            {!demoSession && (
              <a href={upgradeUrl} target="_blank" rel="noreferrer" className="admin-grad inline-flex items-center gap-1.5 rounded-xl px-2.5 sm:px-3.5 py-1.5 text-sm font-semibold shadow-md shadow-blue-600/20 hover:opacity-90">
                <Rocket className="w-4 h-4" /> <span className="hidden sm:inline">Upgrade</span>
              </a>
            )}
            {demoSession && (
              <Link href={`${proto}://${ROOT_DOMAIN.includes("localhost") ? "localhost:3000" : ROOT_DOMAIN}/subscribe?vertical=${demoSession.vertical}`} className="admin-grad inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-sm font-semibold shadow-md shadow-blue-600/20 hover:opacity-90 whitespace-nowrap">
                <Rocket className="w-4 h-4 hidden sm:block" /> Get this site
              </Link>
            )}
          </div>
        </header>
        <main className="p-4 sm:p-8 max-w-6xl mx-auto w-full flex-1 min-h-0 overflow-auto has-[.admin-full-bleed]:max-w-none has-[.admin-full-bleed]:px-3 sm:has-[.admin-full-bleed]:px-4 has-[.admin-full-bleed]:py-3 has-[.admin-full-bleed]:overflow-hidden has-[.admin-full-bleed]:flex has-[.admin-full-bleed]:flex-col">
          {children}
        </main>
      </div>
    </div>
  );
}
