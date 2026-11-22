import type { ReactNode } from "react";

export function PageHeader({
  title, subtitle, action, icon,
}: { title: string; subtitle?: string; action?: ReactNode; icon?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
      <div className="flex items-center gap-3 min-w-0">
        {icon && (
          <span className="admin-grad inline-flex w-11 h-11 rounded-2xl items-center justify-center shrink-0 shadow-lg shadow-blue-600/20 [&>svg]:w-5 [&>svg]:h-5">
            {icon}
          </span>
        )}
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">{title}</h1>
          {subtitle && <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {action}
    </div>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-white/10 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_-12px_rgba(15,23,42,0.12)] ${className}`}>
      {children}
    </div>
  );
}

const statTones = {
  brand: "bg-lime-500/12 text-lime-600",
  violet: "bg-violet-500/12 text-violet-600 dark:text-violet-400",
  green: "bg-emerald-500/12 text-emerald-600 dark:text-emerald-400",
  amber: "bg-amber-500/12 text-amber-600 dark:text-amber-400",
  sky: "bg-sky-500/12 text-sky-600 dark:text-sky-400",
  rose: "bg-rose-500/12 text-rose-600 dark:text-rose-400",
} as const;

export function StatCard({
  label, value, hint, icon, tone = "brand",
}: { label: string; value: string | number; hint?: string; icon?: ReactNode; tone?: keyof typeof statTones }) {
  return (
    <Card className="p-4 sm:p-5">
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
        {icon && (
          <span className={`inline-flex w-8 h-8 rounded-xl items-center justify-center shrink-0 [&>svg]:w-4 [&>svg]:h-4 ${statTones[tone]}`}>
            {icon}
          </span>
        )}
      </div>
      <p className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-1">{value}</p>
      {hint && <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{hint}</p>}
    </Card>
  );
}

const fieldInput = "w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3.5 py-2.5 text-sm outline-none focus:border-lime-500 focus:ring-4 focus:ring-lime-500/15 transition";

export function Field({
  label, name, defaultValue, type = "text", placeholder, hint,
}: { label: string; name: string; defaultValue?: string; type?: string; placeholder?: string; hint?: string }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">{label}</span>
      <input name={name} type={type} defaultValue={defaultValue} placeholder={placeholder} className={fieldInput} />
      {hint && <span className="block text-xs text-slate-400 dark:text-slate-500 mt-1">{hint}</span>}
    </label>
  );
}

export function TextArea({
  label, name, defaultValue, rows = 3, placeholder,
}: { label: string; name: string; defaultValue?: string; rows?: number; placeholder?: string }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">{label}</span>
      <textarea name={name} rows={rows} defaultValue={defaultValue} placeholder={placeholder} className={fieldInput} />
    </label>
  );
}

export { SaveBar } from "./SaveBar";

export function Badge({ children, tone = "slate" }: { children: ReactNode; tone?: "slate" | "green" | "amber" | "blue" | "red" | "violet" }) {
  const tones: Record<string, string> = {
    slate: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
    green: "bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400",
    amber: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400",
    blue: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400",
    red: "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400",
    violet: "bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300",
  };
  return <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${tones[tone]}`}>{children}</span>;
}

export function EmptyState({ title, hint, icon, action }: { title: string; hint?: string; icon?: ReactNode; action?: ReactNode }) {
  return (
    <div className="text-center py-14 px-4">
      {icon && (
        <span className="admin-grad inline-flex w-14 h-14 rounded-2xl items-center justify-center mb-4 shadow-lg shadow-blue-600/20 [&>svg]:w-6 [&>svg]:h-6">
          {icon}
        </span>
      )}
      <p className="text-base font-bold text-slate-800 dark:text-white">{title}</p>
      {hint && <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">{hint}</p>}
      {action && <div className="mt-4 flex justify-center">{action}</div>}
    </div>
  );
}

/** Primary/secondary button classes shared across the admin (use on <button> or <a>). */
export const btnPrimary =
  "admin-grad inline-flex items-center justify-center gap-1.5 rounded-xl text-sm font-semibold px-4 py-2 shadow-md shadow-blue-600/20 hover:opacity-90 hover:shadow-lg disabled:opacity-60 transition";
export const btnSecondary =
  "inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 text-sm font-semibold px-4 py-2 hover:border-lime-400 hover:text-lime-600 disabled:opacity-60 transition";
