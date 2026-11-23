import { redirect } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { getSuperSession } from "@/lib/superAuth";
import { SuperSidebar, SuperPageTitle } from "@/components/super/SuperSidebar";
import { ThemeToggle } from "@/components/marketing/ThemeToggle";
import { PageIntro } from "@/components/PageIntro";

export const metadata = { title: "Super Admin" };

export default async function SuperPanelLayout({ children }: { children: React.ReactNode }) {
  if (!(await getSuperSession())) redirect("/super/login");
  return (
    <div className="admin-brand min-h-screen bg-slate-50 dark:bg-slate-950 lg:flex">
      <SuperSidebar />
      <PageIntro />
      <div className="flex-1 min-w-0 admin-shell">
        <header className="sticky top-14 lg:top-0 z-20 bg-white/80 dark:bg-slate-950/80 backdrop-blur border-b border-slate-200/80 dark:border-white/10 px-4 sm:px-8 h-14 sm:h-16 flex items-center justify-between gap-3">
          <SuperPageTitle />
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <ThemeToggle className="w-9 h-9 rounded-xl flex items-center justify-center border border-slate-200 dark:border-white/10 text-slate-600 dark:text-amber-300 hover:border-lime-400 hover:text-lime-600 transition-colors" />
            <a href="/" target="_blank" rel="noreferrer" title="View site" className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-white/10 px-2.5 sm:px-3 py-1.5 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:border-lime-400 hover:text-lime-600">
              <ExternalLink className="w-4 h-4" /> <span className="hidden sm:inline">View site</span>
            </a>
          </div>
        </header>
        <main className="p-4 sm:p-8 max-w-6xl mx-auto">{children}</main>
      </div>
    </div>
  );
}
