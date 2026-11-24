"use client";

import { useState, useTransition } from "react";
import { TicketPercent, Plus, X, Trash2, Pencil, Copy, WandSparkles, Truck, Percent, IndianRupee, CalendarClock, Users } from "lucide-react";
import { saveCoupon, setCouponActive, deleteCoupon, type CouponInput } from "@/lib/actions/storeCoupons";
import { couponLabel, generateCode } from "@/lib/checkout";
import { inr } from "@/lib/store";
import { Badge, Card, EmptyState, PageHeader, StatCard, btnPrimary, btnSecondary } from "../ui";

type Coupon = {
  id: string; code: string; type: string; value: number; minOrder: number; maxDiscount: number; startsAt: string; endsAt: string;
  usageLimit: number; perCustomerLimit: number; used: number; firstOrderOnly: boolean; active: boolean; mine: boolean;
  stats: { orders: number; discount: number; revenue: number };
};

const input = "w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3.5 py-2.5 text-sm outline-none focus:border-lime-500 focus:ring-4 focus:ring-lime-500/15 transition";
const lbl = "block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1";
const day = (iso: string) => new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
// <input type="datetime-local"> wants local "YYYY-MM-DDTHH:mm".
const toLocal = (iso: string) => {
  if (!iso) return "";
  const d = new Date(iso);
  return new Date(d.getTime() - d.getTimezoneOffset() * 60_000).toISOString().slice(0, 16);
};

function state(c: Coupon): { label: string; tone: "green" | "amber" | "slate" | "red" | "blue" } {
  const now = Date.now();
  if (!c.active) return { label: "Off", tone: "slate" };
  if (c.startsAt && Date.parse(c.startsAt) > now) return { label: "Scheduled", tone: "blue" };
  if (c.endsAt && Date.parse(c.endsAt) < now) return { label: "Expired", tone: "red" };
  if (c.usageLimit > 0 && c.used >= c.usageLimit) return { label: "Used up", tone: "amber" };
  return { label: "Active", tone: "green" };
}

export function DiscountsManager({ coupons, demo }: { coupons: Coupon[]; demo: boolean }) {
  const [editing, setEditing] = useState<Coupon | "new" | null>(null);
  const [pending, start] = useTransition();
  const [flash, setFlash] = useState<{ ok: boolean; text: string } | null>(null);
  const live = coupons.filter((c) => state(c).label === "Active").length;
  const totalOrders = coupons.reduce((n, c) => n + c.stats.orders, 0);
  const totalDiscount = coupons.reduce((n, c) => n + c.stats.discount, 0);
  const totalRevenue = coupons.reduce((n, c) => n + c.stats.revenue, 0);

  const run = (fn: () => Promise<{ ok: boolean; error?: string }>, ok: string) =>
    start(async () => {
      const r = await fn().catch((e: unknown) => ({ ok: false, error: e instanceof Error ? e.message : "Something went wrong" }));
      setFlash(r.ok ? { ok: true, text: ok } : { ok: false, text: r.error ?? "Failed" });
    });

  return (
    <div className={`space-y-4 ${pending ? "opacity-80" : ""}`}>
      <PageHeader icon={<TicketPercent />} title="Discounts" subtitle="Coupon codes shoppers enter at checkout — % off, flat ₹ off or free delivery." action={<button type="button" onClick={() => setEditing("new")} className={btnPrimary}><Plus className="w-4 h-4" /> New discount</button>} />
      {demo && <p className="rounded-xl bg-violet-50 dark:bg-violet-500/10 text-violet-700 dark:text-violet-300 text-xs px-3 py-2">Demo: create a code here, then use it at your store&apos;s checkout to see it applied.</p>}
      {flash && (
        <p role="status" className={`flex items-start justify-between gap-3 rounded-xl text-sm px-3.5 py-2.5 ${flash.ok ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-300" : "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300"}`}>
          <span>{flash.text}</span><button type="button" onClick={() => setFlash(null)} aria-label="Dismiss"><X className="w-4 h-4" /></button>
        </p>
      )}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Active codes" value={live} hint={`${coupons.length} in total`} icon={<TicketPercent />} />
        <StatCard label="Orders with a code" value={totalOrders} icon={<Users />} tone="violet" />
        <StatCard label="Sales from codes" value={inr(totalRevenue)} icon={<IndianRupee />} tone="green" />
        <StatCard label="Discount given" value={inr(totalDiscount)} icon={<Percent />} tone="amber" />
      </div>

      {editing && <CouponForm key={editing === "new" ? "new" : editing.id} c={editing === "new" ? null : editing} pending={pending} onClose={() => setEditing(null)} onSave={(v) => start(async () => {
        const r = await saveCoupon(v).catch((e: unknown) => ({ ok: false as const, error: e instanceof Error ? e.message : "Failed" }));
        if (r.ok) { setEditing(null); setFlash({ ok: true, text: `${String(v.code).toUpperCase()} saved.` }); } else setFlash({ ok: false, text: r.error });
      })} />}

      <Card className="overflow-hidden">
        {coupons.length === 0 ? (
          <EmptyState icon={<TicketPercent />} title="No discount codes yet" hint="Create WELCOME10 for first orders, FREESHIP for free delivery, or a festive sale code with an end date." action={<button type="button" onClick={() => setEditing("new")} className={btnPrimary}><Plus className="w-4 h-4" /> Create a discount</button>} />
        ) : (
          <ul className="divide-y divide-slate-100 dark:divide-white/5">
            {coupons.map((c) => {
              const st = state(c);
              const Icon = c.type === "freeship" ? Truck : c.type === "flat" ? IndianRupee : Percent;
              const rules = [
                c.minOrder ? `Min. ${inr(c.minOrder)}` : "",
                c.firstOrderOnly ? "First order only" : "",
                c.perCustomerLimit ? `${c.perCustomerLimit}× per customer` : "",
                c.startsAt ? `From ${day(c.startsAt)}` : "",
                c.endsAt ? `Until ${day(c.endsAt)}` : "",
              ].filter(Boolean);
              return (
                <li key={c.id} className="flex flex-wrap sm:flex-nowrap items-center gap-3 px-4 py-3.5">
                  <span className="w-10 h-10 rounded-xl bg-lime-500/12 text-lime-600 inline-flex items-center justify-center shrink-0"><Icon className="w-4.5 h-4.5" /></span>
                  <div className="min-w-0 flex-1">
                    <p className="flex flex-wrap items-center gap-2">
                      <button type="button" onClick={() => { void navigator.clipboard?.writeText(c.code); setFlash({ ok: true, text: `${c.code} copied.` }); }} title="Copy code" className="font-mono font-extrabold text-slate-900 dark:text-white tracking-wide hover:text-lime-600 inline-flex items-center gap-1">{c.code}<Copy className="w-3 h-3 opacity-50" /></button>
                      <Badge tone={st.tone}>{st.label}</Badge>
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">{couponLabel(c)}{rules.length ? ` · ${rules.join(" · ")}` : ""}</p>
                  </div>
                  <div className="text-right text-xs text-slate-500 min-w-28">
                    <p className="font-bold text-slate-900 dark:text-white text-sm tabular-nums">{c.used}{c.usageLimit ? ` / ${c.usageLimit}` : ""} <span className="font-normal text-slate-400">uses</span></p>
                    <p className="tabular-nums">{inr(c.stats.revenue)} sales</p>
                  </div>
                  <div className="flex items-center gap-1 ml-auto">
                    <label className="relative inline-flex items-center cursor-pointer mr-1" title={c.active ? "Turn off" : "Turn on"}>
                      <input type="checkbox" className="sr-only peer" checked={c.active} disabled={!c.mine || pending} onChange={(e) => run(() => setCouponActive(c.id, e.target.checked), `${c.code} turned ${e.target.checked ? "on" : "off"}.`)} aria-label={`${c.code} active`} />
                      <span className="w-9 h-5 rounded-full bg-slate-300 dark:bg-slate-700 peer-checked:bg-lime-500 transition after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:w-4 after:h-4 after:rounded-full after:bg-white after:transition peer-checked:after:translate-x-4" />
                    </label>
                    <button type="button" disabled={!c.mine} onClick={() => setEditing(c)} className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40" aria-label={`Edit ${c.code}`}><Pencil className="w-4 h-4" /></button>
                    <button type="button" disabled={!c.mine || pending} onClick={() => { if (confirm(`Delete ${c.code}? Past orders keep their discount.`)) run(() => deleteCoupon(c.id), `${c.code} deleted.`); }} className="p-2 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 disabled:opacity-40" aria-label={`Delete ${c.code}`}><Trash2 className="w-4 h-4" /></button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </Card>
    </div>
  );
}

function CouponForm({ c, pending, onClose, onSave }: { c: Coupon | null; pending: boolean; onClose: () => void; onSave: (v: CouponInput) => void }) {
  const [v, setV] = useState({
    code: c?.code ?? "", type: (c?.type ?? "percent") as "percent" | "flat" | "freeship", value: c?.value ?? 10, minOrder: c?.minOrder ?? 0, maxDiscount: c?.maxDiscount ?? 0,
    startsAt: toLocal(c?.startsAt ?? ""), endsAt: toLocal(c?.endsAt ?? ""), usageLimit: c?.usageLimit ?? 0, perCustomerLimit: c?.perCustomerLimit ?? 1,
    firstOrderOnly: c?.firstOrderOnly ?? false, active: c?.active ?? true,
  });
  const set = <K extends keyof typeof v>(k: K, x: (typeof v)[K]) => setV((s) => ({ ...s, [k]: x }));
  const num = (k: "value" | "minOrder" | "maxDiscount" | "usageLimit" | "perCustomerLimit", label: string, hint?: string) => (
    <label><span className={lbl}>{label}</span><input type="number" min={0} inputMode="numeric" value={v[k] || ""} placeholder="0" onChange={(e) => set(k, Math.max(0, Math.floor(Number(e.target.value) || 0)))} className={input} />{hint && <span className="block text-[11px] text-slate-400 mt-1">{hint}</span>}</label>
  );
  const types = [
    { id: "percent", label: "% off", icon: Percent },
    { id: "flat", label: "₹ off", icon: IndianRupee },
    { id: "freeship", label: "Free delivery", icon: Truck },
  ] as const;
  return (
    <Card className="p-4 sm:p-5">
      <form onSubmit={(e) => { e.preventDefault(); onSave({ ...v, id: c?.id, startsAt: v.startsAt ? new Date(v.startsAt).toISOString() : "", endsAt: v.endsAt ? new Date(v.endsAt).toISOString() : "" }); }} className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">{c ? `Edit ${c.code}` : "New discount"}</h2>
          <button type="button" onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800" aria-label="Close"><X className="w-4 h-4" /></button>
        </div>
        <div className="grid sm:grid-cols-[1fr_auto] gap-2 items-end">
          <label><span className={lbl}>Code</span><input required value={v.code} onChange={(e) => set("code", e.target.value.toUpperCase().replace(/[^A-Z0-9_-]/g, ""))} maxLength={40} placeholder="WELCOME10" className={`${input} font-mono uppercase tracking-wide`} /></label>
          <button type="button" onClick={() => set("code", generateCode())} className={btnSecondary}><WandSparkles className="w-4 h-4" /> Generate</button>
        </div>
        <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Discount type">
          {types.map((t) => (
            <button key={t.id} type="button" role="radio" aria-checked={v.type === t.id} onClick={() => set("type", t.id)} className={`inline-flex items-center justify-center gap-1.5 rounded-xl px-2 py-2.5 text-sm font-semibold border transition ${v.type === t.id ? "admin-grad border-transparent shadow-sm" : "border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:border-lime-400"}`}>
              <t.icon className="w-4 h-4" /> {t.label}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {v.type !== "freeship" && num("value", v.type === "percent" ? "Percent off" : "Amount off (₹)")}
          {v.type === "percent" && num("maxDiscount", "Max discount (₹)", "0 = no cap")}
          {num("minOrder", "Minimum order (₹)", "0 = none")}
          {num("usageLimit", "Total uses", "0 = unlimited")}
          {num("perCustomerLimit", "Uses per customer", "by phone / email · 0 = unlimited")}
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          <label><span className={lbl}><CalendarClock className="inline w-3.5 h-3.5 mr-1" />Starts (optional)</span><input type="datetime-local" value={v.startsAt} onChange={(e) => set("startsAt", e.target.value)} className={input} /></label>
          <label><span className={lbl}><CalendarClock className="inline w-3.5 h-3.5 mr-1" />Ends (optional)</span><input type="datetime-local" value={v.endsAt} onChange={(e) => set("endsAt", e.target.value)} className={input} /></label>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-700 dark:text-slate-200">
          <label className="inline-flex items-center gap-2"><input type="checkbox" checked={v.firstOrderOnly} onChange={(e) => set("firstOrderOnly", e.target.checked)} className="w-4 h-4 accent-lime-600" /> First order only</label>
          <label className="inline-flex items-center gap-2"><input type="checkbox" checked={v.active} onChange={(e) => set("active", e.target.checked)} className="w-4 h-4 accent-lime-600" /> Active</label>
        </div>
        <p className="rounded-xl bg-slate-50 dark:bg-white/[0.03] px-3 py-2 text-xs text-slate-600 dark:text-slate-300">Preview: <b className="font-mono">{v.code || "CODE"}</b> — {couponLabel(v)}{v.minOrder ? ` on orders above ${inr(v.minOrder)}` : ""}.</p>
        <div className="flex gap-2">
          <button type="submit" disabled={pending} className={btnPrimary}>{c ? "Save changes" : "Create discount"}</button>
          <button type="button" onClick={onClose} className={btnSecondary}>Cancel</button>
        </div>
      </form>
    </Card>
  );
}
