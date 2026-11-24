"use client";

import { useState, useTransition } from "react";
import { ShoppingCart, MessageCircle, Mail, Trash2, X, CheckCircle2, IndianRupee, Clock3, Copy, Package } from "lucide-react";
import { sendAbandonedReminder, deleteAbandoned } from "@/lib/actions/abandonedCarts";
import { inr, optionText, orderLabel, waLink, type OrderItem } from "@/lib/store";
import { Badge, Card, EmptyState, PageHeader, StatCard } from "../ui";

type Cart = {
  id: string; token: string; name: string; phone: string; email: string; subtotal: number; recovered: boolean; items: OrderItem[];
  updatedAt: string; reminderSentAt: string | null; order: { id: string; orderNo: number; total: number } | null;
};

const ago = (iso: string) => {
  const m = Math.round((Date.now() - Date.parse(iso)) / 60_000);
  if (m < 60) return `${Math.max(1, m)} min ago`;
  if (m < 48 * 60) return `${Math.round(m / 60)} h ago`;
  return `${Math.round(m / 1440)} days ago`;
};

export function AbandonedManager({ carts, bizName, siteBase, demo }: { carts: Cart[]; bizName: string; siteBase: string; demo: boolean }) {
  const [tab, setTab] = useState<"open" | "recovered">("open");
  const [pending, start] = useTransition();
  const [flash, setFlash] = useState<{ ok: boolean; text: string } | null>(null);
  const open = carts.filter((c) => !c.recovered);
  const recovered = carts.filter((c) => c.recovered);
  const list = tab === "open" ? open : recovered;
  const openValue = open.reduce((n, c) => n + c.subtotal, 0);
  const recoveredValue = recovered.reduce((n, c) => n + (c.order?.total ?? c.subtotal), 0);
  const rate = carts.length ? Math.round((recovered.length / carts.length) * 100) : 0;

  const run = (fn: () => Promise<{ ok: boolean; message?: string; error?: string }>) =>
    start(async () => {
      const r = await fn().catch((e: unknown) => ({ ok: false, error: e instanceof Error ? e.message : "Failed" }));
      setFlash(r.ok ? { ok: true, text: ("message" in r && r.message) || "Done." } : { ok: false, text: ("error" in r && r.error) || "Failed" });
    });

  return (
    <div className={`space-y-4 ${pending ? "opacity-80" : ""}`}>
      <PageHeader icon={<ShoppingCart />} title="Abandoned checkouts" subtitle="Shoppers who entered their phone or email at checkout but didn't order. Nudge them back with one tap." />
      {demo && <p className="rounded-xl bg-violet-50 dark:bg-violet-500/10 text-violet-700 dark:text-violet-300 text-xs px-3 py-2">Demo: start a checkout on your store, type a phone number, then leave — it shows up here. Email reminders are simulated in the demo.</p>}
      {flash && (
        <p role="status" className={`flex items-start justify-between gap-3 rounded-xl text-sm px-3.5 py-2.5 ${flash.ok ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-300" : "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300"}`}>
          <span>{flash.text}</span><button type="button" onClick={() => setFlash(null)} aria-label="Dismiss"><X className="w-4 h-4" /></button>
        </p>
      )}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Waiting to recover" value={open.length} hint="checkouts" icon={<ShoppingCart />} tone="amber" />
        <StatCard label="Value left in carts" value={inr(openValue)} icon={<IndianRupee />} tone="rose" />
        <StatCard label="Recovered sales" value={inr(recoveredValue)} hint={`${recovered.length} orders`} icon={<CheckCircle2 />} tone="green" />
        <StatCard label="Recovery rate" value={`${rate}%`} icon={<Clock3 />} tone="violet" />
      </div>
      <div className="flex gap-2">
        {(["open", "recovered"] as const).map((t) => (
          <button key={t} type="button" onClick={() => setTab(t)} className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${tab === t ? "admin-grad shadow-sm" : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:border-lime-400"}`}>
            {t === "open" ? "Not recovered" : "Recovered"} <span className="opacity-70">{t === "open" ? open.length : recovered.length}</span>
          </button>
        ))}
      </div>

      {list.length === 0 ? (
        <Card><EmptyState icon={<ShoppingCart />} title={tab === "open" ? "No abandoned checkouts" : "Nothing recovered yet"} hint={tab === "open" ? "When a shopper types their phone or email at checkout and leaves, you'll see their cart here." : "Carts that turn into orders (after your reminder or on their own) show up here."} /></Card>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {list.map((c) => {
            const link = `${siteBase}/cart?restore=${c.token}`;
            const first = c.name.split(" ")[0] || "there";
            const msg = `Hi ${first}! You left ${c.items.length === 1 ? c.items[0].name : `${c.items.length} items`} in your cart at ${bizName}. Complete your order here: ${link}`;
            return (
              <Card key={c.id} className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-extrabold text-slate-900 dark:text-white truncate">{c.name || c.phone || c.email}</p>
                    <p className="text-xs text-slate-500 truncate">{[c.phone, c.email].filter(Boolean).join(" · ")} · {ago(c.updatedAt)}</p>
                  </div>
                  <span className="text-right shrink-0">
                    <span className="block text-lg font-extrabold tabular-nums text-slate-900 dark:text-white">{inr(c.subtotal)}</span>
                    {c.recovered ? <Badge tone="green">{c.order ? `order ${orderLabel(c.order.orderNo)}` : "recovered"}</Badge> : c.reminderSentAt ? <Badge tone="blue">reminded</Badge> : null}
                  </span>
                </div>
                <ul className="space-y-1.5">
                  {c.items.slice(0, 4).map((i, k) => (
                    <li key={k} className="flex items-center gap-2.5 text-xs text-slate-600 dark:text-slate-300">
                      <span className="w-8 h-8 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 flex items-center justify-center">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        {i.image ? <img src={i.image} alt="" className="w-full h-full object-cover" /> : <Package className="w-3.5 h-3.5 text-slate-400" />}
                      </span>
                      <span className="flex-1 min-w-0 truncate">{i.name}{Object.keys(i.options ?? {}).length ? ` (${optionText(i.options)})` : ""} × {i.qty}</span>
                      <span className="tabular-nums">{inr(i.price * i.qty)}</span>
                    </li>
                  ))}
                  {c.items.length > 4 && <li className="text-xs text-slate-400">+{c.items.length - 4} more</li>}
                </ul>
                {!c.recovered && (
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    {c.phone && <a href={waLink(c.phone, msg)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 text-sm font-semibold"><MessageCircle className="w-4 h-4" /> WhatsApp</a>}
                    {c.email && <button type="button" disabled={pending} onClick={() => run(() => sendAbandonedReminder(c.id))} className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 px-3.5 py-2 text-sm font-semibold hover:border-lime-400"><Mail className="w-4 h-4" /> {c.reminderSentAt ? "Email again" : "Email reminder"}</button>}
                    <button type="button" onClick={() => { void navigator.clipboard?.writeText(link); setFlash({ ok: true, text: "Cart link copied — anyone with it can refill this cart." }); }} className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-lime-600"><Copy className="w-3.5 h-3.5" /> Copy cart link</button>
                    <button type="button" disabled={pending} onClick={() => { if (confirm("Remove this checkout from the list?")) run(() => deleteAbandoned(c.id)); }} className="ml-auto p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10" aria-label="Remove"><Trash2 className="w-4 h-4" /></button>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
