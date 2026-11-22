import Link from "next/link";
import { AlertTriangle, ArrowRight, Gauge } from "lucide-react";
import { formatBytes, formatLimit, type PlanLimits } from "@/lib/plans";

type Usage = { storageBytes: number; pages: number; services: number; gallery: number; users: number; aiEdits: number };

// "Plan & usage" meters. limits = null → unlimited plan (legacy / demo).
export function PlanUsageCard({ planName, limits, usage }: { planName: string; limits: PlanLimits | null; usage: Usage }) {
  const rows: { label: string; used: number; limit: number; fmt: (n: number) => string; href?: string }[] = [
    { label: "Storage", used: usage.storageBytes, limit: (limits?.storageMb ?? 0) * 1024 * 1024, fmt: formatBytes, href: "/admin/storage" },
    { label: "Custom pages", used: usage.pages, limit: limits?.pages ?? 0, fmt: String, href: "/admin/pages" },
    { label: "Services", used: usage.services, limit: limits?.services ?? 0, fmt: String, href: "/admin/services" },
    { label: "Gallery photos", used: usage.gallery, limit: limits?.gallery ?? 0, fmt: String, href: "/admin/gallery" },
    { label: "Logins", used: usage.users, limit: limits?.users ?? 0, fmt: String, href: "/admin/settings" },
    { label: "AI edits this month", used: usage.aiEdits, limit: limits?.aiEdits ?? 0, fmt: String },
  ];
  const worst = Math.max(0, ...rows.map((r) => (r.limit ? r.used / r.limit : 0)));

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <p className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Gauge className="w-4 h-4 text-lime-600" /> Plan &amp; usage
          <span className="rounded-full bg-lime-500/15 text-lime-700 dark:text-lime-300 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">{planName}</span>
        </p>
        <Link href="/admin/billing" className="inline-flex items-center gap-1 text-[11px] font-semibold text-lime-600 hover:underline">
          Upgrade <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {worst >= 0.8 && (
        <div className={`mb-3 rounded-xl border px-3 py-2 text-xs flex items-center gap-2 ${worst >= 1 ? "bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300" : "bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200"}`}>
          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
          {worst >= 1 ? "You've reached a plan limit — new items are blocked, existing content stays live." : "You're close to a plan limit."}{" "}
          <Link href="/admin/billing" className="font-bold underline">Upgrade</Link>
        </div>
      )}

      <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-3">
        {rows.map((r) => {
          const pct = r.limit ? Math.min(100, (r.used / r.limit) * 100) : 0;
          const bar = pct >= 100 ? "bg-red-500" : pct >= 80 ? "bg-amber-500" : "bg-lime-500";
          const label = r.href ? <Link href={r.href} className="hover:underline">{r.label}</Link> : r.label;
          return (
            <li key={r.label}>
              <div className="flex items-baseline justify-between gap-2 text-xs">
                <span className="font-medium text-slate-600 dark:text-slate-300">{label}</span>
                <span className={`tabular-nums ${pct >= 100 ? "text-red-600 font-semibold" : pct >= 80 ? "text-amber-600 font-semibold" : "text-slate-400"}`}>
                  {r.fmt(r.used)} / {r.limit ? r.fmt(r.limit) : formatLimit("pages", 0)}
                </span>
              </div>
              <div className="mt-1 h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div className={`h-full rounded-full ${r.limit ? bar : "bg-slate-200 dark:bg-slate-700"}`} style={{ width: `${r.limit ? pct : 100}%` }} />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
