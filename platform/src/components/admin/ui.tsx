import type { ReactNode } from "react";

export function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{title}</h1>
        {subtitle && <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm ${className}`}>{children}</div>;
}

export function StatCard({ label, value, hint }: { label: string; value: string | number; hint?: string }) {
  return (
    <Card className="p-5">
      <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
      <p className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">{value}</p>
      {hint && <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{hint}</p>}
    </Card>
  );
}

const fieldInput = "w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3.5 py-2.5 text-sm outline-none focus:border-lime-500 focus:ring-2 focus:ring-lime-500/20";

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

export function SaveBar({ label = "Save changes" }: { label?: string }) {
  return (
    <div className="flex justify-end pt-2">
      <button type="submit" className="inline-flex items-center gap-2 rounded-lg bg-lime-500 text-white font-semibold px-5 py-2.5 text-sm hover:bg-lime-600">
        {label}
      </button>
    </div>
  );
}

export function Badge({ children, tone = "slate" }: { children: ReactNode; tone?: "slate" | "green" | "amber" | "blue" | "red" }) {
  const tones: Record<string, string> = {
    slate: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
    green: "bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400",
    amber: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400",
    blue: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400",
    red: "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400",
  };
  return <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${tones[tone]}`}>{children}</span>;
}

export function EmptyState({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="text-center py-16">
      <p className="text-slate-700 dark:text-slate-200 font-medium">{title}</p>
      {hint && <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">{hint}</p>}
    </div>
  );
}
