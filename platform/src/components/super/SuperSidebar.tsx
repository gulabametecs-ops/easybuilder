"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { LayoutDashboard, Inbox, CreditCard, Building2, Settings, LogOut, Menu, X, ShieldCheck, BarChart3, Ticket, Gift, Wallet } from "lucide-react";
import { superLogout } from "@/lib/actions/superAuth";
import { BrandMark } from "@/components/BrandLogo";
import { ThemeToggle } from "@/components/marketing/ThemeToggle";

type NavItem = { href: string; label: string; icon: typeof LayoutDashboard; exact?: boolean };

const GROUPS: { label: string; items: NavItem[] }[] = [
  {
    label: "Overview",
    items: [
      { href: "/super", label: "Overview", icon: LayoutDashboard, exact: true },
      { href: "/super/analytics", label: "Analytics", icon: BarChart3 },
    ],
  },
  {
    label: "Business",
    items: [
      { href: "/super/clients", label: "Clients", icon: Building2 },
      { href: "/super/orders", label: "Orders & Payments", icon: CreditCard },
      { href: "/super/enquiries", label: "Enquiries", icon: Inbox },
      { href: "/super/demo-leads", label: "Demo leads", icon: ShieldCheck },
    ],
  },
  {
    label: "Growth",
    items: [
      { href: "/super/coupons", label: "Coupons", icon: Ticket },
      { href: "/super/referrals", label: "Referrals", icon: Gift },
      { href: "/super/payouts", label: "Payouts", icon: Wallet },
    ],
  },
  { label: "System", items: [{ href: "/super/settings", label: "Settings", icon: Settings }] },
];

const isActive = (pathname: string, item: NavItem) =>
  item.exact ? pathname === item.href : pathname === item.href || pathname.startsWith(`${item.href}/`);

/** Current page name for the top header (derived from the nav, so labels live in one place). */
export function SuperPageTitle() {
  const pathname = usePathname();
  let hit: { group: string; label: string } | undefined;
  for (const g of GROUPS) {
    const i = g.items.find((it) => isActive(pathname, it));
    if (i) hit = { group: g.label, label: i.label };
  }
  return (
    <div className="min-w-0">
      <p className="hidden sm:block text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">{hit?.group ?? "Super admin"}</p>
      <p className="text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate leading-tight">{hit?.label ?? "Super admin"}</p>
    </div>
  );
}

const linkCls = (active: boolean) =>
  `group flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-[13px] font-medium transition-colors ${
    active
      ? "bg-gradient-to-r from-[#2563ff] to-[#7c3aed] text-white font-semibold shadow-md shadow-blue-600/30"
      : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white"
  }`;
const iconCls = (active: boolean) =>
  `w-4 h-4 shrink-0 ${active ? "text-white" : "text-slate-400 dark:text-slate-500 group-hover:text-lime-600"}`;

export function SuperSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Drawer: close on Escape, and stop the page behind it from scrolling.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <>
      {/* Mobile top bar */}
      <div className="lg:hidden sticky top-0 flex items-center justify-between bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-white/10 px-4 h-14 shrink-0 z-40">
        <span className="flex items-center gap-2.5 font-bold text-sm text-slate-900 dark:text-white">
          <BrandMark size={22} id="spx-sm" /> Super Admin
        </span>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
          aria-expanded={open}
          className="p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {open && (
        <button
          type="button"
          aria-label="Close menu"
          className="lg:hidden fixed inset-0 z-[60] bg-slate-950/50 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`${
          open ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 fixed lg:sticky inset-y-0 lg:top-0 left-0 z-[61] lg:z-auto w-[17rem] lg:w-64 h-dvh lg:h-screen shrink-0 bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-white/10 flex flex-col transition-transform duration-200 ease-out shadow-2xl lg:shadow-none`}
      >
        <div className="px-4 pt-4 pb-3 shrink-0 flex items-center gap-2">
          <BrandMark size={24} />
          <span className="text-[15px] font-extrabold tracking-tight text-slate-900 dark:text-white">SitePixl</span>
          <span className="admin-grad inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide shadow-sm">
            <ShieldCheck className="h-3 w-3" /> Super
          </span>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="lg:hidden ml-auto p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-white/10"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <nav className="flex-1 px-3 py-2 overflow-y-auto overscroll-contain space-y-4">
          {GROUPS.map((g) => (
            <div key={g.label}>
              <p className="px-2.5 mb-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500">{g.label}</p>
              <div className="space-y-0.5">
                {g.items.map((item) => {
                  const active = isActive(pathname, item);
                  const Icon = item.icon;
                  return (
                    <Link key={item.href} href={item.href} onClick={() => setOpen(false)} aria-current={active ? "page" : undefined} className={linkCls(active)}>
                      <Icon className={iconCls(active)} />
                      <span className="flex-1 truncate">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="shrink-0 border-t border-slate-200 dark:border-white/10 p-3 flex items-center gap-2 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          <ThemeToggle className="w-9 h-9 rounded-xl flex items-center justify-center border border-slate-200 dark:border-white/10 text-slate-600 dark:text-amber-300 hover:border-lime-400 hover:text-lime-600 transition-colors" />
          <form action={superLogout} className="flex-1">
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 h-9 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/10 hover:text-rose-600 hover:border-rose-300 hover:bg-rose-50 dark:hover:bg-rose-500/10"
            >
              <LogOut className="w-4 h-4" /> Sign out
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}
