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
  Megaphone,
  ScrollText,
  Search,
  Rocket,
  Receipt,
  Settings,
  ExternalLink,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { logoutAction } from "@/lib/actions/auth";

type NavItem = {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  exact?: boolean;
  badge?: number;
};

type NavGroup = { label: string; items: NavItem[] };

export function Sidebar({
  bizName,
  userName,
  userEmail,
  newLeads = 0,
  pendingAppts = 0,
}: {
  bizName: string;
  userName?: string;
  userEmail?: string;
  newLeads?: number;
  pendingAppts?: number;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const groups: NavGroup[] = [
    {
      label: "Overview",
      items: [
        { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
        { href: "/admin/leads", label: "Leads", icon: Inbox, badge: newLeads },
        { href: "/admin/appointments", label: "Appointments", icon: CalendarClock, badge: pendingAppts },
      ],
    },
    {
      label: "Website",
      items: [
        { href: "/admin/appearance", label: "Appearance", icon: Palette },
        { href: "/admin/pages", label: "Pages & Sections", icon: FileStack },
        { href: "/admin/services", label: "Services", icon: Wrench },
        { href: "/admin/gallery", label: "Gallery", icon: Images },
        { href: "/admin/notices", label: "Notices", icon: Megaphone },
        { href: "/admin/results", label: "Results", icon: ScrollText },
      ],
    },
    {
      label: "Grow",
      items: [
        { href: "/admin/seo", label: "SEO", icon: Search },
        { href: "/admin/marketing", label: "Marketing", icon: Rocket },
      ],
    },
    {
      label: "Account",
      items: [
        { href: "/admin/billing", label: "Billing", icon: Receipt },
        { href: "/admin/settings", label: "Settings", icon: Settings },
      ],
    },
  ];

  const initials = bizName
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "SS";

  return (
    <>
      {/* Mobile top bar */}
      <div className="lg:hidden flex items-center justify-between bg-slate-900 text-white px-4 h-14 shrink-0 relative z-40">
        <div className="flex items-center gap-2 min-w-0">
          <span className="w-8 h-8 rounded-lg bg-lime-400 text-slate-900 font-extrabold flex items-center justify-center text-xs shrink-0">
            {initials}
          </span>
          <span className="font-bold truncate">{bizName}</span>
        </div>
        <button type="button" onClick={() => setOpen((v) => !v)} aria-label="Menu" className="p-1.5 rounded-lg hover:bg-white/10">
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile backdrop */}
      {open && (
        <button
          type="button"
          aria-label="Close menu"
          className="lg:hidden fixed inset-0 z-30 bg-black/50"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`${
          open ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-40 w-64 bg-slate-900 text-slate-300 flex flex-col transition-transform duration-200 ease-out shadow-xl lg:shadow-none`}
      >
        <div className="h-16 flex items-center gap-2.5 px-4 border-b border-white/10 shrink-0">
          <div className="w-9 h-9 rounded-lg bg-lime-400 text-slate-900 font-extrabold flex items-center justify-center text-sm shrink-0">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="font-bold text-white truncate text-sm leading-tight">{bizName}</p>
            <p className="text-[10px] text-slate-500 truncate">Admin panel</p>
          </div>
        </div>

        <nav className="flex-1 px-2.5 py-3 overflow-y-auto overscroll-contain space-y-4">
          {groups.map((g) => (
            <div key={g.label}>
              <p className="px-2.5 mb-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                {g.label}
              </p>
              <div className="space-y-0.5">
                {g.items.map((item) => {
                  const active = item.exact
                    ? pathname === item.href
                    : pathname === item.href || pathname.startsWith(`${item.href}/`);
                  const Icon = item.icon;
                  const badge = item.badge && item.badge > 0 ? item.badge : 0;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                        active
                          ? "bg-lime-400 text-slate-900 shadow-sm"
                          : "text-slate-300 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span className="flex-1 truncate">{item.label}</span>
                      {badge > 0 && (
                        <span
                          className={`min-w-[1.25rem] h-5 px-1.5 rounded-full text-[10px] font-bold flex items-center justify-center ${
                            active ? "bg-slate-900 text-lime-300" : "bg-lime-500 text-slate-900"
                          }`}
                        >
                          {badge > 99 ? "99+" : badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="shrink-0 border-t border-white/10 p-2.5 space-y-1 pb-[max(0.625rem,env(safe-area-inset-bottom))]">
          {(userName || userEmail) && (
            <div className="px-2.5 py-2 rounded-lg bg-white/5 mb-1">
              <p className="text-xs font-semibold text-white truncate">{userName || "Admin"}</p>
              {userEmail && <p className="text-[10px] text-slate-500 truncate">{userEmail}</p>}
            </div>
          )}
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm text-slate-300 hover:bg-white/10 hover:text-white"
          >
            <ExternalLink className="w-4 h-4 shrink-0" />
            View live site
          </a>
          <form action={logoutAction}>
            <button
              type="submit"
              className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm text-slate-300 hover:bg-white/10 hover:text-white"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              Sign out
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}
