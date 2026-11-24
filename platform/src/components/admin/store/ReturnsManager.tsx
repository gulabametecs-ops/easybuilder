"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Undo2, MessageCircle, X, Phone } from "lucide-react";
import { processReturn } from "@/lib/actions/shipping";
import { inr, optionText, orderLabel, waLink } from "@/lib/store";
import type { adminOrders } from "@/lib/storeAdmin";
import { Badge, Card, EmptyState, PageHeader, btnSecondary } from "../ui";

type Order = Awaited<ReturnType<typeof adminOrders>>[number];
const TABS = [
  { id: "requested", label: "Requested" },
  { id: "approved", label: "Approved" },
  { id: "received", label: "Received" },
  { id: "refunded", label: "Refunded" },
  { id: "rejected", label: "Rejected" },
] as const;
const TONE = { requested: "violet", approved: "blue", received: "amber", refunded: "green", rejected: "red" } as const;
const day = (iso: string | null) => (iso ? new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) : "—");

export function ReturnsManager({ orders, demo }: { orders: Order[]; demo: boolean }) {
  const [tab, setTab] = useState<string>("requested");
  const [pending, start] = useTransition();
  const [flash, setFlash] = useState<{ ok: boolean; text: string } | null>(null);
  const [refund, setRefund] = useState<Record<string, number>>({});
  const list = orders.filter((o) => o.returnStatus === tab);
  const count = (s: string) => orders.filter((o) => o.returnStatus === s).length;

  const act = (o: Order, next: "approved" | "rejected" | "received" | "refunded") =>
    start(async () => {
      if (next === "rejected" && !confirm(`Reject the return for ${orderLabel(o.orderNo)}?`)) return;
      const r = await processReturn(o.id, next, refund[o.id] ?? o.total).catch((e) => ({ ok: false as const, error: e instanceof Error ? e.message : "Failed" }));
      setFlash(r.ok ? { ok: true, text: r.message ?? "Updated." } : { ok: false, text: r.error });
    });

  return (
    <div className="space-y-4">
      <PageHeader icon={<Undo2 />} title="Returns" subtitle={`${count("requested")} waiting for review · customers request returns from their order tracking page`} />
      {demo && <p className="rounded-xl bg-violet-50 dark:bg-violet-500/10 text-violet-700 dark:text-violet-300 text-xs px-3 py-2">Demo: place an order, mark it delivered, then request a return from its tracking page to try this flow.</p>}
      {flash && (
        <p role="status" className={`flex items-start justify-between gap-3 rounded-xl text-sm px-3.5 py-2.5 ${flash.ok ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-300" : "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300"}`}>
          <span>{flash.text}</span><button type="button" onClick={() => setFlash(null)} aria-label="Dismiss"><X className="w-4 h-4" /></button>
        </p>
      )}
      <div className="flex gap-2 overflow-x-auto pb-0.5">
        {TABS.map((s) => (
          <button key={s.id} type="button" onClick={() => setTab(s.id)} className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${tab === s.id ? "admin-grad shadow-sm" : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:border-lime-400"}`}>
            {s.label} <span className="opacity-70">{count(s.id)}</span>
          </button>
        ))}
      </div>

      {list.length === 0 ? (
        <Card><EmptyState icon={<Undo2 />} title={orders.length ? "Nothing here" : "No return requests"} hint={orders.length ? "Try another tab." : "Delivered orders can be returned from the customer's tracking page within your return window (Shipping & delivery)."} /></Card>
      ) : (
        <div className={`grid gap-3 md:grid-cols-2 ${pending ? "opacity-70" : ""}`}>
          {list.map((o) => {
            const msg = `Hi ${o.customerName.split(" ")[0]}, about the return for your order ${orderLabel(o.orderNo)}: `;
            return (
              <Card key={o.id} className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-extrabold text-slate-900 dark:text-white">Order {orderLabel(o.orderNo)} <span className="font-semibold text-slate-400 text-sm">· {inr(o.total)}</span></p>
                    <p className="text-xs text-slate-500">{o.customerName} · delivered {day(o.deliveredAt)}</p>
                  </div>
                  <Badge tone={TONE[o.returnStatus as keyof typeof TONE] ?? "slate"}>{o.returnStatus}</Badge>
                </div>
                <p className="text-sm rounded-xl bg-amber-50 dark:bg-amber-500/10 text-amber-900 dark:text-amber-200 px-3 py-2">{o.returnReason || "No reason given"}</p>
                <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-0.5">
                  {o.items.map((i, k) => <li key={k}>{i.name}{Object.keys(i.options ?? {}).length ? ` (${optionText(i.options)})` : ""} × {i.qty} — {inr(i.price * i.qty)}</li>)}
                </ul>
                {o.returnStatus === "refunded" && <p className="text-sm font-semibold text-emerald-600">Refunded {inr(o.refundAmount)}</p>}
                <div className="flex flex-wrap items-center gap-2">
                  {o.returnStatus === "requested" && <>
                    <button type="button" disabled={pending} onClick={() => act(o, "approved")} className="admin-grad rounded-xl px-3.5 py-2 text-sm font-semibold shadow-md">Approve</button>
                    <button type="button" disabled={pending} onClick={() => act(o, "rejected")} className="rounded-xl px-3.5 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10">Reject</button>
                  </>}
                  {o.returnStatus === "approved" && <>
                    <button type="button" disabled={pending} onClick={() => act(o, "received")} className="admin-grad rounded-xl px-3.5 py-2 text-sm font-semibold shadow-md">Mark item received</button>
                    <button type="button" disabled={pending} onClick={() => act(o, "rejected")} className="rounded-xl px-3.5 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10">Reject</button>
                  </>}
                  {o.returnStatus === "received" && (
                    <div className="flex items-center gap-2">
                      <label className="text-xs text-slate-500 flex items-center gap-1">Refund ₹
                        <input type="number" min={1} max={o.total} value={refund[o.id] ?? o.total} onChange={(e) => setRefund({ ...refund, [o.id]: Math.max(0, Math.floor(Number(e.target.value) || 0)) })} className="w-24 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-2.5 py-1.5 text-sm" />
                      </label>
                      <button type="button" disabled={pending} onClick={() => act(o, "refunded")} className="admin-grad rounded-xl px-3.5 py-2 text-sm font-semibold shadow-md">Mark refunded</button>
                    </div>
                  )}
                  <a href={waLink(o.phone, msg)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:underline ml-auto"><MessageCircle className="w-3.5 h-3.5" /> WhatsApp</a>
                  <a href={`tel:${o.phone}`} className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:underline"><Phone className="w-3.5 h-3.5" /> Call</a>
                </div>
                {o.returnStatus === "received" && <p className="text-[11px] text-slate-400">Pay the refund by UPI/bank first, then record it here. Stock was added back when the item was received.</p>}
                <Link href="/admin/orders" className={`${btnSecondary} w-full !py-1.5 !text-xs`}>Open in Orders</Link>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
