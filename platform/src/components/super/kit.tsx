// Super-admin-only presentational pieces (server-safe, no hooks). Builds on components/admin/ui.
import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowDownRight, ArrowUpRight, ChevronRight } from "lucide-react";
import { Card } from "@/components/admin/ui";

/* ---------- table classes ---------- */
export const tbl = "w-full text-sm";
export const thead = "text-left text-[11px] uppercase tracking-wider text-slate-400 dark:text-slate-500 bg-slate-50/80 dark:bg-white/[0.03] border-b border-slate-100 dark:border-white/10";
export const th = "px-4 py-3 font-semibold whitespace-nowrap";
export const tbody = "divide-y divide-slate-100 dark:divide-white/5";
export const tr = "hover:bg-slate-50/70 dark:hover:bg-white/[0.03] transition-colors";
export const td = "px-4 py-3.5 text-slate-600 dark:text-slate-300";

/* ---------- avatar ---------- */
const GRADS = [
  "from-blue-500 to-violet-500",
  "from-emerald-500 to-teal-500",
  "from-amber-500 to-orange-500",
  "from-rose-500 to-pink-500",
  "from-sky-500 to-indigo-500",
  "from-fuchsia-500 to-purple-600",
];
export const initials = (name: string) =>
  name.trim().split(/\s+/).map((w) => w[0]).filter(Boolean).slice(0, 2).join("").toUpperCase() || "?";

export function Avatar({ name, size = "md" }: { name: string; size?: "sm" | "md" | "lg" }) {
  let h = 0;
  for (const c of name) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  const s = size === "sm" ? "h-8 w-8 text-[11px] rounded-lg" : size === "lg" ? "h-11 w-11 text-sm rounded-2xl" : "h-9 w-9 text-xs rounded-xl";
  return (
    <span className={`inline-flex shrink-0 items-center justify-center bg-gradient-to-br font-bold text-white shadow-sm ${GRADS[h % GRADS.length]} ${s}`} aria-hidden>
      {initials(name)}
    </span>
  );
}

/** Avatar + bold name + muted second line, for the first column of a table row or a list item. */
export function Who({ name, sub, href, extra }: { name: string; sub?: ReactNode; href?: string; extra?: ReactNode }) {
  const title = <span className="font-semibold text-slate-900 dark:text-white">{name}</span>;
  return (
    <div className="flex items-center gap-3 min-w-0">
      <Avatar name={name} />
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-1.5">{href ? <Link href={href} className="hover:text-lime-600 hover:underline">{title}</Link> : title}{extra}</div>
        {sub && <div className="truncate text-xs text-slate-400 dark:text-slate-500 max-w-[260px]">{sub}</div>}
      </div>
    </div>
  );
}

/* ---------- status pill ---------- */
export type Tone = "green" | "blue" | "amber" | "red" | "slate" | "violet";
const PILL: Record<Tone, [string, string]> = {
  green: ["bg-emerald-50 text-emerald-700 ring-emerald-600/15 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-400/20", "bg-emerald-500"],
  blue: ["bg-blue-50 text-blue-700 ring-blue-600/15 dark:bg-blue-500/10 dark:text-blue-300 dark:ring-blue-400/20", "bg-blue-500"],
  amber: ["bg-amber-50 text-amber-700 ring-amber-600/20 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-400/20", "bg-amber-500"],
  red: ["bg-rose-50 text-rose-700 ring-rose-600/15 dark:bg-rose-500/10 dark:text-rose-300 dark:ring-rose-400/20", "bg-rose-500"],
  slate: ["bg-slate-100 text-slate-600 ring-slate-500/15 dark:bg-white/5 dark:text-slate-300 dark:ring-white/10", "bg-slate-400"],
  violet: ["bg-violet-50 text-violet-700 ring-violet-600/15 dark:bg-violet-500/10 dark:text-violet-300 dark:ring-violet-400/20", "bg-violet-500"],
};
export function Pill({ tone = "slate", children, pulse }: { tone?: Tone; children: ReactNode; pulse?: boolean }) {
  const [box, dot] = PILL[tone];
  return (
    <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ring-1 ring-inset ${box}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${dot} ${pulse ? "animate-pulse" : ""}`} />
      {children}
    </span>
  );
}

export const ORDER_TONE: Record<string, Tone> = { provisioned: "green", paid: "amber", created: "slate", failed: "red", refunded: "violet" };
export const orderLabel = (s: string) => (s === "paid" ? "paid · not live" : s === "provisioned" ? "live" : s);
export const LEAD_TONE: Record<string, Tone> = {
  new: "amber", verified: "blue", contacted: "blue", interested: "violet", converted: "green", "not interested": "slate", blocked: "red",
};

/* ---------- KPI card with trend ---------- */
const CHIP: Record<Tone, string> = {
  blue: "from-blue-500 to-indigo-500 shadow-blue-500/30",
  violet: "from-violet-500 to-fuchsia-500 shadow-violet-500/30",
  green: "from-emerald-500 to-teal-500 shadow-emerald-500/30",
  amber: "from-amber-500 to-orange-500 shadow-amber-500/30",
  red: "from-rose-500 to-pink-500 shadow-rose-500/30",
  slate: "from-slate-500 to-slate-700 shadow-slate-500/30",
};
export function Kpi({ label, value, icon, tone = "blue", delta, hint, href }: {
  label: string; value: ReactNode; icon: ReactNode; tone?: Tone; delta?: number | null; hint?: string; href?: string;
}) {
  const body = (
    <Card className={`relative h-full overflow-hidden p-4 sm:p-5 ${href ? "transition hover:-translate-y-0.5 hover:shadow-lg" : ""}`}>
      <div className={`pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br opacity-[0.08] ${CHIP[tone]}`} aria-hidden />
      <div className="flex items-start justify-between gap-2">
        <span className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-lg [&>svg]:h-5 [&>svg]:w-5 ${CHIP[tone]}`}>{icon}</span>
        {delta != null && (
          <span className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[11px] font-bold ${delta >= 0 ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300" : "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300"}`}>
            {delta >= 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
            {Math.abs(delta)}%
          </span>
        )}
      </div>
      <p className="mt-3 text-xs font-medium text-slate-500 dark:text-slate-400 sm:text-sm">{label}</p>
      <p className="mt-0.5 truncate text-xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-[1.7rem]">{value}</p>
      {hint && <p className="mt-1 truncate text-xs text-slate-400 dark:text-slate-500">{hint}</p>}
    </Card>
  );
  return href ? <Link href={href} className="block">{body}</Link> : body;
}

/* ---------- panel: card with a titled header ---------- */
export function Panel({ title, icon, action, children, className = "", sub }: {
  title: string; icon?: ReactNode; action?: ReactNode; children: ReactNode; className?: string; sub?: string;
}) {
  return (
    <Card className={`overflow-hidden ${className}`}>
      <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-4 dark:border-white/10">
        <div className="flex min-w-0 items-center gap-2.5">
          {icon && <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-lime-500/10 text-lime-600 dark:text-lime-400 [&>svg]:h-4 [&>svg]:w-4">{icon}</span>}
          <div className="min-w-0">
            <h2 className="truncate font-bold text-slate-900 dark:text-white">{title}</h2>
            {sub && <p className="truncate text-xs text-slate-400 dark:text-slate-500">{sub}</p>}
          </div>
        </div>
        {action}
      </div>
      {children}
    </Card>
  );
}
export function ViewAll({ href, children = "View all" }: { href: string; children?: ReactNode }) {
  return (
    <Link href={href} className="inline-flex shrink-0 items-center gap-0.5 text-xs font-semibold text-lime-600 hover:underline dark:text-lime-400">
      {children} <ChevronRight className="h-3.5 w-3.5" />
    </Link>
  );
}

/* ---------- gradient hero ---------- */
export function Hero({ eyebrow, title, subtitle, children, icon }: { eyebrow?: string; title: string; subtitle?: ReactNode; children?: ReactNode; icon?: ReactNode }) {
  return (
    <div className="admin-grad relative mb-6 overflow-hidden rounded-3xl p-5 shadow-xl shadow-blue-600/20 sm:p-7">
      <div className="pointer-events-none absolute -right-16 -top-24 h-72 w-72 rounded-full bg-white/10" aria-hidden />
      <div className="pointer-events-none absolute -bottom-24 right-40 h-56 w-56 rounded-full bg-white/[0.07]" aria-hidden />
      <div className="relative flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div className="flex min-w-0 items-center gap-4">
          {icon && <span className="hidden h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15 backdrop-blur sm:inline-flex [&>svg]:h-7 [&>svg]:w-7">{icon}</span>}
          <div className="min-w-0">
            {eyebrow && <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/70">{eyebrow}</p>}
            <h1 className="mt-1 text-2xl font-extrabold tracking-tight sm:text-3xl">{title}</h1>
            {subtitle && <div className="mt-1 text-sm text-white/80">{subtitle}</div>}
          </div>
        </div>
        {children && <div className="flex flex-wrap gap-2">{children}</div>}
      </div>
    </div>
  );
}
export const heroBtn = "inline-flex items-center gap-1.5 rounded-xl bg-white/15 px-3.5 py-2 text-sm font-semibold text-white ring-1 ring-inset ring-white/30 backdrop-blur hover:bg-white/25 transition";
export const heroBtnSolid = "inline-flex items-center gap-1.5 rounded-xl bg-white/95 px-3.5 py-2 text-sm font-semibold text-slate-950 shadow hover:bg-white/85 transition"; // /95 + slate-950 dodge the .admin-shell dark remaps

/* ---------- filter chips ---------- */
export function Chips({ items }: { items: { href: string; label: string; count?: number; active: boolean }[] }) {
  return (
    <div className="mb-4 flex flex-wrap gap-1.5">
      {items.map((c) => (
        <Link
          key={c.href}
          href={c.href}
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold capitalize transition ${
            c.active
              ? "admin-grad shadow-md shadow-blue-600/20"
              : "border border-slate-200 bg-white text-slate-600 hover:border-lime-400 hover:text-lime-600 dark:border-white/10 dark:bg-slate-900 dark:text-slate-300"
          }`}
        >
          {c.label}
          {c.count != null && <span className={`rounded-full px-1.5 text-[10px] ${c.active ? "bg-white/25" : "bg-slate-100 text-slate-500 dark:bg-white/10 dark:text-slate-400"}`}>{c.count}</span>}
        </Link>
      ))}
    </div>
  );
}

/* ---------- charts (dependency-free) ---------- */
/** Vertical column chart with gridlines; the last column is highlighted as "current". */
export function ColumnChart({ labels, values, format = String, height = "h-48" }: {
  labels: string[]; values: number[]; format?: (v: number) => string; height?: string;
}) {
  const max = Math.max(1, ...values);
  const every = Math.ceil(labels.length / 8); // thin the x labels on dense charts
  return (
    <div>
      <div className={`relative ${height}`}>
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="absolute inset-x-0 border-t border-dashed border-slate-100 dark:border-white/5" style={{ top: `${(i / 3) * 100}%` }} />
        ))}
        <div className="absolute inset-0 flex items-end gap-[3%]">
          {values.map((v, i) => (
            <div key={i} className="group relative flex h-full flex-1 items-end justify-center">
              <span className="pointer-events-none absolute -top-1 z-10 -translate-y-full whitespace-nowrap rounded-md bg-slate-900 px-1.5 py-0.5 text-[10px] font-semibold text-white opacity-0 transition group-hover:opacity-100 dark:bg-white dark:text-slate-900">
                {labels[i]}: {format(v)}
              </span>
              <div
                className={`w-full max-w-10 rounded-t-md transition-all ${i === values.length - 1 ? "bg-gradient-to-t from-[#2563ff] to-[#7c3aed]" : "bg-gradient-to-t from-blue-500/35 to-violet-500/35 group-hover:from-blue-500/60 group-hover:to-violet-500/60"}`}
                style={{ height: `${v > 0 ? Math.max(3, (v / max) * 100) : 1}%` }}
                title={`${labels[i]}: ${format(v)}`}
              />
            </div>
          ))}
        </div>
      </div>
      <div className="mt-2 flex gap-[3%]">
        {labels.map((l, i) => (
          <span key={i} className="flex-1 truncate text-center text-[10px] text-slate-400 dark:text-slate-500">{i % every === 0 || i === labels.length - 1 ? l : ""}</span>
        ))}
      </div>
    </div>
  );
}

/** SVG area/line chart. */
export function AreaChart({ labels, values, format = String, id }: { labels: string[]; values: number[]; format?: (v: number) => string; id: string }) {
  const max = Math.max(1, ...values);
  const n = values.length;
  const x = (i: number) => (n === 1 ? 50 : (i / (n - 1)) * 100);
  const y = (v: number) => 38 - (v / max) * 34;
  const line = values.map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(2)},${y(v).toFixed(2)}`).join(" ");
  const every = Math.ceil(labels.length / 7);
  return (
    <div>
      <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="h-44 w-full overflow-visible" role="img" aria-label="Trend chart">
        <defs>
          <linearGradient id={`${id}-f`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
          </linearGradient>
          <linearGradient id={`${id}-s`} x1="0" x2="1">
            <stop offset="0%" stopColor="#2563ff" />
            <stop offset="100%" stopColor="#7c3aed" />
          </linearGradient>
        </defs>
        {[4, 15.3, 26.7, 38].map((g) => <line key={g} x1="0" x2="100" y1={g} y2={g} className="stroke-slate-100 dark:stroke-white/5" strokeWidth="0.3" vectorEffect="non-scaling-stroke" />)}
        <path d={`${line} L100,40 L0,40 Z`} fill={`url(#${id}-f)`} />
        <path d={line} fill="none" stroke={`url(#${id}-s)`} strokeWidth="2.5" vectorEffect="non-scaling-stroke" strokeLinejoin="round" strokeLinecap="round" />
        {values.map((v, i) => (
          <rect key={i} x={x(i) - 50 / n} y="0" width={100 / n} height="40" fill="transparent">
            <title>{`${labels[i]}: ${format(v)}`}</title>
          </rect>
        ))}
      </svg>
      <div className="mt-2 flex justify-between">
        {labels.map((l, i) => (i % every === 0 || i === n - 1 ? <span key={i} className="text-[10px] text-slate-400 dark:text-slate-500">{l}</span> : null))}
      </div>
    </div>
  );
}

/** Horizontal ranked bars. */
export function HBars({ items, format = String, empty = "No data yet." }: { items: { label: string; value: number; sub?: string }[]; format?: (v: number) => string; empty?: string }) {
  const max = Math.max(1, ...items.map((i) => i.value));
  if (items.length === 0) return <p className="py-6 text-center text-sm text-slate-400">{empty}</p>;
  return (
    <ul className="space-y-3.5">
      {items.map((it) => (
        <li key={it.label}>
          <div className="mb-1.5 flex items-baseline justify-between gap-3 text-sm">
            <span className="truncate font-medium capitalize text-slate-700 dark:text-slate-200">{it.label}</span>
            <span className="shrink-0 font-semibold text-slate-900 dark:text-white">{format(it.value)}{it.sub && <span className="ml-1 text-xs font-normal text-slate-400">{it.sub}</span>}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-white/5">
            <div className="h-full rounded-full bg-gradient-to-r from-[#2563ff] to-[#7c3aed]" style={{ width: `${Math.max(2, (it.value / max) * 100)}%` }} />
          </div>
        </li>
      ))}
    </ul>
  );
}

/** Relative "3h ago" style label. */
export function ago(d: Date, now = new Date()): string {
  const s = Math.round((now.getTime() - d.getTime()) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  if (s < 86400 * 30) return `${Math.floor(s / 86400)}d ago`;
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}
