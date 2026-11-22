"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useHtmlDark } from "@/lib/useHtmlDark";
import { LayoutDashboard, Inbox, CreditCard, Building2, Settings, LogOut, Menu, X, ShieldCheck, BarChart3, Ticket, Sun, Moon, Gift, Wallet } from "lucide-react";
import { superLogout } from "@/lib/actions/superAuth";
import { BrandLogo, BrandMark } from "@/components/BrandLogo";

const NAV = [
  { href: "/super", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/super/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/super/clients", label: "Clients", icon: Building2 },
  { href: "/super/orders", label: "Orders & Payments", icon: CreditCard },
  { href: "/super/enquiries", label: "Enquiries", icon: Inbox },
  { href: "/super/demo-leads", label: "Demo leads", icon: ShieldCheck },
  { href: "/super/coupons", label: "Coupons", icon: Ticket },
  { href: "/super/referrals", label: "Referrals", icon: Gift },
  { href: "/super/payouts", label: "Payouts", icon: Wallet },
  { href: "/super/settings", label: "Settings", icon: Settings },
];

export function SuperSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const dark = useHtmlDark(true);
  const toggleTheme = () => {
    const n = !dark;
    document.documentElement.classList.toggle("dark", n);
    try { localStorage.setItem("theme", n ? "dark" : "light"); } catch {}
  };
  return (
    <>
      <div className="lg:hidden flex items-center justify-between bg-slate-900 text-white px-4 h-14">
        <span className="flex items-center gap-2 font-bold"><BrandMark size={24} id="spx-sm" /> Super Admin</span>
        <button onClick={() => setOpen((v) => !v)}>{open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}</button>
      </div>
      <aside className={`${open ? "block" : "hidden"} lg:block fixed lg:static inset-y-0 left-0 z-30 w-64 bg-slate-900 text-slate-300 flex flex-col`}>
        <div className="h-16 flex items-center gap-2 px-5 border-b border-white/10">
          <BrandLogo size={24} onDark />
          <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-lime-300">
            <ShieldCheck className="h-3 w-3" /> Super
          </span>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV.map((n) => {
            const active = n.exact ? pathname === n.href : pathname.startsWith(n.href);
            const Icon = n.icon;
            return (
              <Link key={n.href} href={n.href} onClick={() => setOpen(false)} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${active ? "bg-lime-400 text-slate-900" : "hover:bg-white/10 hover:text-white"}`}>
                <Icon className="w-4.5 h-4.5" /> {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-white/10 space-y-1">
          <button onClick={toggleTheme} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm hover:bg-white/10 hover:text-white">
            {dark ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />} {dark ? "Light mode" : "Dark mode"}
          </button>
          <form action={superLogout}>
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm hover:bg-white/10 hover:text-white"><LogOut className="w-4.5 h-4.5" /> Sign out</button>
          </form>
        </div>
      </aside>
    </>
  );
}
