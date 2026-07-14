"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Inbox,
  CalendarClock,
  Palette,
  FileStack,
  Wrench,
  Images,
  Search,
  Receipt,
  Settings,
  ExternalLink,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { logoutAction } from "@/lib/actions/auth";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/leads", label: "Leads", icon: Inbox },
  { href: "/admin/appointments", label: "Appointments", icon: CalendarClock },
  { href: "/admin/appearance", label: "Appearance", icon: Palette },
  { href: "/admin/pages", label: "Pages & Sections", icon: FileStack },
  { href: "/admin/services", label: "Services", icon: Wrench },
  { href: "/admin/gallery", label: "Gallery", icon: Images },
  { href: "/admin/seo", label: "SEO", icon: Search },
  { href: "/admin/billing", label: "Billing", icon: Receipt },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function Sidebar({ bizName }: { bizName: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile top bar */}
      <div className="lg:hidden flex items-center justify-between bg-slate-900 text-white px-4 h-14">
        <span className="font-bold truncate">{bizName}</span>
        <button onClick={() => setOpen((v) => !v)} aria-label="Menu">
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      <aside
        className={`${open ? "block" : "hidden"} lg:block fixed lg:static inset-y-0 left-0 z-30 w-64 bg-slate-900 text-slate-300 flex flex-col`}
      >
        <div className="h-16 flex items-center gap-2 px-5 border-b border-white/10">
          <div className="w-9 h-9 rounded-lg bg-lime-400 text-slate-900 font-extrabold flex items-center justify-center text-sm">
            {bizName.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()}
          </div>
          <span className="font-bold text-white truncate">{bizName}</span>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {NAV.map((item) => {
            const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  active ? "bg-lime-400 text-slate-900" : "hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon className="w-4.5 h-4.5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-white/10 space-y-1">
          <a
            href="/"
            target="_blank"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm hover:bg-white/10 hover:text-white"
          >
            <ExternalLink className="w-4.5 h-4.5" />
            View Live Site
          </a>
          <form action={logoutAction}>
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm hover:bg-white/10 hover:text-white">
              <LogOut className="w-4.5 h-4.5" />
              Sign out
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}
