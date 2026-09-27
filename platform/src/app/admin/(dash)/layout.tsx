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
import { Sidebar } from "@/components/admin/Sidebar";
import { ThemeToggle } from "@/components/marketing/ThemeToggle";
import { DemoTimerBar } from "@/components/site/DemoTimerBar";

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
  const [newLeads, pendingAppts] = await Promise.all([
    db.lead.count({ where: { ...scope, status: "new" } }),
    db.appointment.count({ where: { ...scope, status: "pending" } }),
  ]);

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 lg:flex lg:h-screen lg:overflow-hidden">
      <Sidebar
        bizName={authed.tenant.name}
        userName={authed.session.name}
        userEmail={authed.session.email}
        newLeads={newLeads}
        pendingAppts={pendingAppts}
      />
      <div className="flex-1 min-w-0 flex flex-col min-h-0 admin-shell">
        {demoSession?.expiresAt && <DemoTimerBar expiresAt={demoSession.expiresAt.toISOString()} />}
        {access.expired && !demoSession && (
          <div className="bg-amber-500 text-amber-950 text-sm px-5 sm:px-8 py-2.5 flex items-center justify-between gap-3 shrink-0">
            <span className="font-medium">Your subscription has expired. Renew now to keep your site online.</span>
            <a href="/admin/billing" className="shrink-0 rounded-md bg-amber-950 text-white px-3 py-1 text-xs font-semibold">Renew</a>
          </div>
        )}
        {platform.broadcastShow && platform.broadcastText && (
          <div className="bg-slate-900 text-white text-sm px-5 sm:px-8 py-2.5 flex items-center gap-2 shrink-0">
            <Megaphone className="w-4 h-4 text-lime-400 shrink-0" />
            <span>{platform.broadcastText}</span>
          </div>
        )}
        <div className="sticky top-0 z-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-5 sm:px-8 h-14 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <span className="hidden sm:inline">Plan:</span>
            <span className="font-semibold text-slate-800 dark:text-slate-100 capitalize">{planLabel}</span>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <a href="/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-1.5 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800">
              <ExternalLink className="w-4 h-4" /> <span className="hidden sm:inline">Preview site</span>
            </a>
            {!demoSession && (
              <a href={upgradeUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-lime-500 to-emerald-500 text-white px-3.5 py-1.5 text-sm font-semibold hover:opacity-90">
                <Rocket className="w-4 h-4" /> Upgrade plan
              </a>
            )}
            {demoSession && (
              <Link href={`${proto}://${ROOT_DOMAIN.includes("localhost") ? "localhost:3000" : ROOT_DOMAIN}/subscribe?vertical=${demoSession.vertical}`} className="inline-flex items-center gap-1.5 rounded-lg bg-lime-500 text-white px-3.5 py-1.5 text-sm font-semibold hover:bg-lime-600">
                Get this website
              </Link>
            )}
          </div>
        </div>
        <main className="p-5 sm:p-8 max-w-6xl mx-auto w-full flex-1 min-h-0 overflow-auto has-[.admin-full-bleed]:max-w-none has-[.admin-full-bleed]:px-3 sm:has-[.admin-full-bleed]:px-4 has-[.admin-full-bleed]:py-3 has-[.admin-full-bleed]:overflow-hidden has-[.admin-full-bleed]:flex has-[.admin-full-bleed]:flex-col">
          {children}
        </main>
      </div>
    </div>
  );
}
