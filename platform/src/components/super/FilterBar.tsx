"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, X } from "lucide-react";

export type FilterSelect = { name: string; label: string; value?: string; options: { value: string; label: string }[] };

/** GET search + dropdown filters for super admin lists; selects apply on change. */
export function FilterBar({ q, placeholder = "Search name, phone, email…", selects = [], hidden = {} }: {
  q?: string;
  placeholder?: string;
  selects?: FilterSelect[];
  hidden?: Record<string, string | undefined>;
}) {
  const path = usePathname();
  const active = !!q || selects.some((s) => s.value);
  const field = "h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none focus:border-lime-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100";
  return (
    <form method="get" className="mb-4 flex flex-wrap items-center gap-2">
      {Object.entries(hidden).map(([k, v]) => v && <input key={k} type="hidden" name={k} value={v} />)}
      <label className="relative min-w-[220px] flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input name="q" defaultValue={q} placeholder={placeholder} className={`${field} w-full pl-9`} />
      </label>
      {selects.map((s) => (
        <select key={s.name} name={s.name} defaultValue={s.value ?? ""} aria-label={s.label} onChange={(e) => e.currentTarget.form?.requestSubmit()} className={field}>
          <option value="">{s.label}: All</option>
          {s.options.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      ))}
      <button className="admin-grad h-10 rounded-xl px-4 text-sm font-semibold">Search</button>
      {active && (
        <Link href={path} className="inline-flex h-10 items-center gap-1 rounded-xl px-3 text-sm font-medium text-slate-500 hover:text-slate-800 dark:hover:text-slate-200">
          <X className="h-4 w-4" /> Clear
        </Link>
      )}
    </form>
  );
}
