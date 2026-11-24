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
  HardDrive,
  Settings,
  ExternalLink,
  LogOut,
  Menu,
  X,
  Users,
  CalendarDays,
  HeartHandshake,
  Gift,
  BarChart3,
  QrCode,
  LifeBuoy,
  Building2,
  HandHeart,
  Plug,
  ShoppingBag,
  Package,
  UserRound,
  Store,
  Truck,
  Undo2,
  LayoutGrid,
  MessageSquareText,
} from "lucide-react";
import { sectorModules, type SectorModules } from "@/lib/adminNav";
import { BrandMark } from "@/components/BrandLogo";
import { useEffect, useState } from "react";
import { logoutAction } from "@/lib/actions/auth";

type NavItem = {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  exact?: boolean;
  badge?: number;
};

type NavGroup = { label: string; items: NavItem[] };

function navGroups(
  mods: SectorModules,
  { newLeads = 0, pendingAppts = 0, newVolunteers = 0, newOrders = 0 }: { newLeads?: number; pendingAppts?: number; newVolunteers?: number; newOrders?: number } = {},
): NavGroup[] {
  const show = (on: boolean) => <T,>(item: T): T[] => (on ? [item] : []);
  // Online stores sell products, not booked services — keep those pages reachable by URL only
  // (and still listed if something is waiting there).
  const services = !mods.store;
  return [
    {
      label: "Overview",
      items: [
        { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
        { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
        { href: "/admin/leads", label: "Leads", icon: Inbox, badge: newLeads },
        ...show(services || pendingAppts > 0)({ href: "/admin/appointments", label: "Appointments", icon: CalendarClock, badge: pendingAppts }),
        // Keep Volunteers visible if requests are waiting, whatever the sector.
        ...show(mods.volunteers || newVolunteers > 0)({ href: "/admin/volunteers", label: "Volunteers", icon: HeartHandshake, badge: newVolunteers }),
      ],
    },
    ...show(mods.store)({
      label: "Store",
      items: [
        { href: "/admin/orders", label: "Orders", icon: ShoppingBag, badge: newOrders },
        { href: "/admin/products", label: "Products", icon: Package },
        { href: "/admin/collections", label: "Collections", icon: LayoutGrid },
        { href: "/admin/reviews", label: "Reviews", icon: MessageSquareText },
        { href: "/admin/customers", label: "Customers", icon: UserRound },
        { href: "/admin/returns", label: "Returns", icon: Undo2 },
        { href: "/admin/shipping", label: "Shipping", icon: Truck },
        { href: "/admin/store-settings", label: "Store settings", icon: Store },
      ],
    }),
    {
      label: "Website",
      items: [
        { href: "/admin/appearance", label: "Appearance", icon: Palette },
        { href: "/admin/pages", label: "Pages & Sections", icon: FileStack },
        ...show(services)({ href: "/admin/services", label: "Services", icon: Wrench }),
        ...show(mods.properties)({ href: "/admin/properties", label: "Properties", icon: Building2 }),
        { href: "/admin/people", label: "People", icon: Users },
        ...show(mods.events)({ href: "/admin/events", label: "Events", icon: CalendarDays }),
        ...show(mods.causes)({ href: "/admin/causes", label: "Causes", icon: HandHeart }),
        { href: "/admin/gallery", label: "Gallery", icon: Images },
        ...show(mods.notices)({ href: "/admin/notices", label: "Notices", icon: Megaphone }),
        ...show(mods.results)({ href: "/admin/results", label: "Results", icon: ScrollText }),
      ],
    },
    {
      label: "Grow",
      items: [
        { href: "/admin/marketing", label: "Marketing", icon: Rocket },
        { href: "/admin/seo", label: "SEO", icon: Search },
        { href: "/admin/integrations", label: "Integrations", icon: Plug },
        { href: "/admin/share", label: "Share & QR", icon: QrCode },
      ],
    },
    {
      label: "Account",
      items: [
        { href: "/admin/billing", label: "Billing", icon: Receipt },
        { href: "/admin/referrals", label: "Refer & Earn", icon: Gift },
        { href: "/admin/storage", label: "Storage", icon: HardDrive },
        { href: "/admin/settings", label: "Settings", icon: Settings },
      ],
    },
  ];
}

const isActive = (pathname: string, item: { href: string; exact?: boolean }) =>
  item.exact ? pathname === item.href : pathname === item.href || pathname.startsWith(`${item.href}/`);

const ALL_MODS: SectorModules = { notices: true, results: true, volunteers: true, events: true, properties: true, causes: true, store: true };

/** Current page name for the top header (derived from the nav, so labels live in one place). */
export function AdminPageTitle() {
  const pathname = usePathname();
  // Store sites hide Services/Appointments, so look titles up in both menus.
  const items = [...navGroups(ALL_MODS), ...navGroups({ ...ALL_MODS, store: false })].flatMap((g) => g.items.map((i) => ({ label: i.label, href: i.href, exact: i.exact, group: g.label })));
  const hit =
    items.find((i) => isActive(pathname, i)) ??
    (pathname === "/admin/help" ? { label: "Help & support", group: "Support" } : null);
  return (
    <div className="min-w-0">
      <p className="hidden sm:block text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">{hit?.group ?? "Admin"}</p>
      <p className="text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate leading-tight">{hit?.label ?? "Admin"}</p>
    </div>
  );
}

export function Sidebar({
  bizName,
  userName,
  userEmail,
  newLeads = 0,
  pendingAppts = 0,
  newVolunteers = 0,
  newOrders = 0,
  vertical = "",
}: {
  bizName: string;
  /** Tenant sector — hides modules that don't apply (see sectorModules). */
  vertical?: string;
  userName?: string;
  userEmail?: string;
  newLeads?: number;
  pendingAppts?: number;
  newVolunteers?: number;
  newOrders?: number;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const groups = navGroups(sectorModules(vertical), { newLeads, pendingAppts, newVolunteers, newOrders });

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

  const initials = bizName
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "SS";

  const linkCls = (active: boolean) =>
    // Light: soft brand tint + left bar. Dark: blue→violet gradient pill.
    `group relative flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-[13px] font-medium transition-colors ${
      active
        ? "bg-lime-50 text-lime-700 font-semibold before:absolute before:left-0 before:top-1.5 before:bottom-1.5 before:w-[3px] before:rounded-r-full before:bg-gradient-to-b before:from-[#2563ff] before:to-[#7c3aed] dark:before:hidden dark:bg-gradient-to-r dark:from-[#2563ff] dark:to-[#7c3aed] dark:text-white dark:shadow-md dark:shadow-blue-600/30"
        : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white"
    }`;
  const iconCls = (active: boolean) =>
    `w-4 h-4 shrink-0 ${active ? "text-lime-600 dark:text-white" : "text-slate-400 dark:text-slate-500 group-hover:text-lime-600"}`;

  return (
    <>
      {/* Mobile top bar */}
      <div className="lg:hidden flex items-center justify-between bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-white/10 px-4 h-14 shrink-0 relative z-40">
        <div className="flex items-center gap-2.5 min-w-0">
          <BrandMark size={22} />
          <span className="font-bold truncate text-slate-900 dark:text-white text-sm">{bizName}</span>
        </div>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
          aria-expanded={open}
          className="relative p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          {!open && newLeads > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-950" />
          )}
        </button>
      </div>

      {/* Mobile backdrop */}
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
        } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-[61] w-[17rem] lg:w-64 bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-white/10 flex flex-col transition-transform duration-200 ease-out shadow-2xl lg:shadow-none`}
      >
        <div className="px-4 pt-4 pb-3 shrink-0 space-y-3">
          <div className="flex items-center gap-2">
            <BrandMark size={24} />
            <span className="text-[15px] font-extrabold tracking-tight text-slate-900 dark:text-white">SitePixl</span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="lg:hidden ml-auto p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-white/10"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-center gap-2.5 rounded-2xl border border-slate-200/80 dark:border-white/10 bg-slate-50 dark:bg-white/[0.03] p-2">
            <span className="admin-grad w-9 h-9 rounded-xl font-extrabold flex items-center justify-center text-xs shrink-0 shadow-sm">
              {initials}
            </span>
            <div className="min-w-0">
              <p className="font-bold text-slate-900 dark:text-white truncate text-sm leading-tight">{bizName}</p>
              <p className="text-[11px] text-slate-500 truncate">{vertical && sectorModules(vertical).store ? "Store admin" : "Business admin"}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 pb-3 overflow-y-auto overscroll-contain space-y-4">
          {groups.map((g) => (
            <div key={g.label}>
              <p className="px-2.5 mb-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500">
                {g.label}
              </p>
              <div className="space-y-0.5">
                {g.items.map((item) => {
                  const active = isActive(pathname, item);
                  const Icon = item.icon;
                  const badge = item.badge && item.badge > 0 ? item.badge : 0;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      aria-current={active ? "page" : undefined}
                      className={linkCls(active)}
                    >
                      <Icon className={iconCls(active)} />
                      <span className="flex-1 truncate">{item.label}</span>
                      {badge > 0 && (
                        <span
                          className={`min-w-[1.25rem] h-5 px-1.5 rounded-full text-[10px] font-bold flex items-center justify-center ${
                            active ? "bg-lime-500 text-white dark:bg-white/25" : "bg-lime-500 text-white"
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

        <div className="shrink-0 border-t border-slate-200 dark:border-white/10 p-3 space-y-0.5 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          <Link href="/admin/help" onClick={() => setOpen(false)} className={linkCls(pathname === "/admin/help")}>
            <LifeBuoy className={iconCls(pathname === "/admin/help")} />
            Help &amp; support
          </Link>
          <a href="/" target="_blank" rel="noreferrer" className={linkCls(false)}>
            <ExternalLink className={iconCls(false)} />
            View live site
          </a>
          <div className="flex items-center gap-2 px-2.5 pt-2.5 mt-1.5 border-t border-slate-100 dark:border-white/5">
            <span className="w-7 h-7 rounded-full bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-slate-200 text-[11px] font-bold flex items-center justify-center shrink-0">
              {(userName || userEmail || "A")[0].toUpperCase()}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-slate-800 dark:text-white truncate">{userName || "Admin"}</p>
              {userEmail && <p className="text-[10px] text-slate-500 truncate">{userEmail}</p>}
            </div>
            <form action={logoutAction}>
              <button
                type="submit"
                title="Sign out"
                aria-label="Sign out"
                className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </aside>
    </>
  );
}
