import Link from "next/link";
import { redirect } from "next/navigation";
import { ExternalLink, Rocket } from "lucide-react";
import { getAuthedSession } from "@/lib/auth";
import { ROOT_DOMAIN } from "@/lib/domains";
import { getPlatformConfig } from "@/lib/platformConfig";
import { Sidebar } from "@/components/admin/Sidebar";
import { ThemeToggle } from "@/components/marketing/ThemeToggle";
import { Megaphone } from "lucide-react";

export const metadata = { title: "Admin" };

const proto = ROOT_DOMAIN.includes("localhost") ? "http" : "https";

export default async function DashLayout({ children }: { children: React.ReactNode }) {
  const authed = await getAuthedSession();
  if (!authed) redirect("/admin/login");

  const upgradeUrl = `${proto}://${ROOT_DOMAIN}/#pricing`;
  const planLabel = authed.tenant.plan;
  const platform = await getPlatformConfig();

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 lg:flex">
      <Sidebar bizName={authed.tenant.name} />
      <div className="flex-1 min-w-0 flex flex-col admin-shell">
        {platform.broadcastShow && platform.broadcastText && (
          <div className="bg-slate-900 text-white text-sm px-5 sm:px-8 py-2.5 flex items-center gap-2">
            <Megaphone className="w-4 h-4 text-lime-400 shrink-0" />
            <span>{platform.broadcastText}</span>
          </div>
        )}
        {/* Top bar: theme + live preview + plan / upgrade */}
        <div className="sticky top-0 z-20 bg-white border-b border-slate-200 px-5 sm:px-8 h-14 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span className="hidden sm:inline">Plan:</span>
            <span className="font-semibold text-slate-800 capitalize">{planLabel}</span>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <a href="/" target="_blank" className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
              <ExternalLink className="w-4 h-4" /> <span className="hidden sm:inline">Preview site</span>
            </a>
            <a href={upgradeUrl} target="_blank" className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-lime-500 to-emerald-500 text-white px-3.5 py-1.5 text-sm font-semibold hover:opacity-90">
              <Rocket className="w-4 h-4" /> Upgrade plan
            </a>
          </div>
        </div>
        <main className="p-5 sm:p-8 max-w-6xl mx-auto w-full">{children}</main>
      </div>
    </div>
  );
}
