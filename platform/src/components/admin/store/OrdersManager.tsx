"use client";

import { useState, useTransition } from "react";
import { ShoppingBag, Search, Phone, MessageCircle, Printer, MapPin, X, CheckCircle2, Circle, Ban, IndianRupee } from "lucide-react";
import { updateOrder } from "@/lib/actions/store";
import { ORDER_STATUSES, PAYMENT_LABEL, inr, optionText, orderLabel, waLink, type OrderItem } from "@/lib/store";
import { Badge, Card, EmptyState, PageHeader, btnSecondary } from "../ui";

export type AdminOrder = {
  id: string; orderNo: number; customerName: string; phone: string; email: string; address: string; city: string; pincode: string;
  items: OrderItem[]; subtotal: number; shipping: number; discount: number; total: number;
  paymentMethod: string; paymentStatus: string; status: string; note: string; createdAt: string;
};

const TONE: Record<string, "violet" | "blue" | "amber" | "slate" | "green" | "red"> = {
  new: "violet", confirmed: "blue", packed: "amber", shipped: "slate", delivered: "green", cancelled: "red",
};
const PIPELINE = ORDER_STATUSES.filter((s) => s.id !== "cancelled");
const when = (iso: string) => new Date(iso).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" });

export function OrdersManager({ orders, bizName, demo }: { orders: AdminOrder[]; bizName: string; demo: boolean }) {
  const [pending, start] = useTransition();
  const [tab, setTab] = useState("all");
  const [q, setQ] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);
  const needle = q.trim().toLowerCase();
  const list = orders.filter((o) => (tab === "all" || o.status === tab) && (!needle || `${o.orderNo} ${o.customerName} ${o.phone} ${o.city} ${o.pincode}`.toLowerCase().includes(needle)));
  const open = orders.find((o) => o.id === openId) ?? null;
  const count = (s: string) => orders.filter((o) => o.status === s).length;

  const patch = (o: AdminOrder, p: { status?: string; paymentStatus?: string }) =>
    start(async () => {
      try {
        const r = await updateOrder(o.id, p);
        if (!r.ok) alert(r.error);
      } catch (e) {
        alert(e instanceof Error ? e.message : "Something went wrong");
      }
    });

  return (
    <div className="space-y-4">
      <PageHeader icon={<ShoppingBag />} title="Orders" subtitle={`${orders.length} orders · ${count("new")} waiting for confirmation`} />
      {demo && <p className="rounded-xl bg-violet-50 dark:bg-violet-500/10 text-violet-700 dark:text-violet-300 text-xs px-3 py-2">Demo: sample orders are read-only. Place a test order on your store (View site → add to cart → checkout) and manage it here.</p>}

      <Card className="p-3 sm:p-4 space-y-3">
        <div className="flex gap-2 overflow-x-auto pb-0.5">
          {[{ id: "all", label: "All" }, ...ORDER_STATUSES].map((s) => (
            <button key={s.id} type="button" onClick={() => setTab(s.id)} className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${tab === s.id ? "admin-grad shadow-sm" : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:border-lime-400"}`}>
              {s.label} <span className="opacity-70">{s.id === "all" ? orders.length : count(s.id)}</span>
            </button>
          ))}
        </div>
        <label className="relative block">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search order #, name, phone, pincode…" className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white pl-9 pr-3 py-2.5 text-sm outline-none focus:border-lime-500" />
        </label>
      </Card>

      <div className={`grid gap-4 ${open ? "xl:grid-cols-[1fr_26rem]" : ""} items-start ${pending ? "opacity-70" : ""}`}>
        <Card className="overflow-hidden">
          {list.length === 0 ? (
            <EmptyState icon={<ShoppingBag />} title={orders.length ? "No orders here" : "No orders yet"} hint={orders.length ? "Try another status or search." : "Share your store link — orders from the website land here with the customer's address and payment choice."} />
          ) : (
            <ul className="divide-y divide-slate-100 dark:divide-white/5">
              {list.map((o) => (
                <li key={o.id}>
                  <button type="button" onClick={() => setOpenId(o.id === openId ? null : o.id)} className={`w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-slate-50/70 dark:hover:bg-white/[0.02] ${o.id === openId ? "bg-lime-50/60 dark:bg-lime-500/5" : ""}`}>
                    <span className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-violet-500 text-white text-[11px] font-extrabold flex items-center justify-center shrink-0">{orderLabel(o.orderNo)}</span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-slate-900 dark:text-white truncate">{o.customerName}</span>
                        <Badge tone={TONE[o.status] ?? "slate"}>{o.status}</Badge>
                      </span>
                      <span className="block text-xs text-slate-500 truncate mt-0.5">
                        {o.items.reduce((n, i) => n + i.qty, 0)} item(s) · {PAYMENT_LABEL[o.paymentMethod] ?? o.paymentMethod}{o.paymentStatus === "paid" ? " · Paid" : ""} · {o.city || o.pincode} · {when(o.createdAt)}
                      </span>
                    </span>
                    <span className="text-sm font-extrabold text-slate-900 dark:text-white tabular-nums">{inr(o.total)}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </Card>

        {open && <OrderDetail o={open} bizName={bizName} onClose={() => setOpenId(null)} onPatch={(p) => patch(open, p)} />}
      </div>
    </div>
  );
}

function OrderDetail({ o, bizName, onClose, onPatch }: { o: AdminOrder; bizName: string; onClose: () => void; onPatch: (p: { status?: string; paymentStatus?: string }) => void }) {
  const step = PIPELINE.findIndex((s) => s.id === o.status);
  const cancelled = o.status === "cancelled";
  const next = !cancelled && step >= 0 && step < PIPELINE.length - 1 ? PIPELINE[step + 1] : null;
  const statusMsg = `Hi ${o.customerName.split(" ")[0]}, your order ${orderLabel(o.orderNo)} from ${bizName} is now *${ORDER_STATUSES.find((s) => s.id === o.status)?.label}*. Total ${inr(o.total)}. Thank you for shopping with us!`;

  return (
    <Card className="p-4 sm:p-5 space-y-5 xl:sticky xl:top-0">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs text-slate-400">{when(o.createdAt)}</p>
          <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">Order {orderLabel(o.orderNo)}</h2>
        </div>
        <button type="button" onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800" aria-label="Close"><X className="w-4 h-4" /></button>
      </div>

      {/* Status pipeline */}
      <div>
        <ol className="flex items-center gap-1">
          {PIPELINE.map((s, i) => {
            const done = !cancelled && i <= step;
            return (
              <li key={s.id} className="flex-1 min-w-0">
                <button type="button" onClick={() => onPatch({ status: s.id })} title={`Mark ${s.label}`} className="w-full group">
                  <span className={`block h-1.5 rounded-full ${done ? "bg-gradient-to-r from-[#2563ff] to-[#7c3aed]" : "bg-slate-200 dark:bg-slate-700 group-hover:bg-lime-300"}`} />
                  <span className={`mt-1.5 flex items-center justify-center gap-1 text-[10px] font-semibold ${done ? "text-slate-800 dark:text-white" : "text-slate-400"}`}>
                    {done ? <CheckCircle2 className="w-3 h-3 text-emerald-500" /> : <Circle className="w-3 h-3" />}<span className="truncate">{s.label}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
        <div className="flex flex-wrap gap-2 mt-3">
          {next && <button type="button" onClick={() => onPatch({ status: next.id })} className="admin-grad rounded-xl px-3.5 py-2 text-sm font-semibold shadow-md">Mark as {next.label}</button>}
          {cancelled
            ? <button type="button" onClick={() => onPatch({ status: "new" })} className={btnSecondary}>Restore order</button>
            : <button type="button" onClick={() => { if (confirm("Cancel this order? Stock will be added back.")) onPatch({ status: "cancelled" }); }} className="inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10"><Ban className="w-4 h-4" /> Cancel</button>}
        </div>
      </div>

      <div className="rounded-2xl bg-slate-50 dark:bg-white/[0.03] p-3.5 space-y-1.5 text-sm">
        <p className="font-bold text-slate-900 dark:text-white">{o.customerName}</p>
        <p className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300"><Phone className="w-3.5 h-3.5" /><a href={`tel:${o.phone}`} className="hover:underline">{o.phone}</a>{o.email && <span className="text-slate-400 truncate">· {o.email}</span>}</p>
        <p className="flex items-start gap-1.5 text-slate-600 dark:text-slate-300"><MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0" />{[o.address, o.city, o.pincode].filter(Boolean).join(", ")}</p>
        {o.note && <p className="text-xs rounded-lg bg-amber-50 dark:bg-amber-500/10 text-amber-800 dark:text-amber-200 px-2.5 py-1.5">Note: {o.note}</p>}
      </div>

      <ul className="space-y-2.5">
        {o.items.map((i, k) => (
          <li key={k} className="flex items-center gap-3">
            <span className="w-11 h-11 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {i.image && <img src={i.image} alt="" className="w-full h-full object-cover" />}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">{i.name}</span>
              <span className="block text-xs text-slate-500">{[optionText(i.options), `${i.qty} × ${inr(i.price)}`].filter(Boolean).join(" · ")}</span>
            </span>
            <span className="text-sm font-bold tabular-nums text-slate-900 dark:text-white">{inr(i.qty * i.price)}</span>
          </li>
        ))}
      </ul>

      <div className="border-t border-slate-100 dark:border-white/10 pt-3 space-y-1 text-sm">
        <Row l="Subtotal" v={inr(o.subtotal)} />
        <Row l="Delivery" v={o.shipping ? inr(o.shipping) : "Free"} />
        {o.discount > 0 && <Row l="Discount" v={`−${inr(o.discount)}`} />}
        <div className="flex justify-between font-extrabold text-base text-slate-900 dark:text-white pt-1"><span>Total</span><span className="tabular-nums">{inr(o.total)}</span></div>
      </div>

      <div className="flex items-center justify-between gap-2 rounded-2xl border border-slate-200 dark:border-white/10 px-3.5 py-2.5">
        <span className="text-sm">
          <span className="text-slate-500">{PAYMENT_LABEL[o.paymentMethod] ?? o.paymentMethod} · </span>
          <span className={`font-bold ${o.paymentStatus === "paid" ? "text-emerald-600" : "text-amber-600"}`}>{o.paymentStatus === "paid" ? "Paid" : "Payment pending"}</span>
        </span>
        <button type="button" onClick={() => onPatch({ paymentStatus: o.paymentStatus === "paid" ? "pending" : "paid" })} className="inline-flex items-center gap-1 text-xs font-semibold text-lime-600 hover:underline">
          <IndianRupee className="w-3.5 h-3.5" /> {o.paymentStatus === "paid" ? "Mark unpaid" : "Mark paid"}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <a href={waLink(o.phone, statusMsg)} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 text-white px-3 py-2.5 text-sm font-semibold hover:bg-emerald-700"><MessageCircle className="w-4 h-4" /> WhatsApp</a>
        <button type="button" onClick={() => printInvoice(o, bizName)} className={btnSecondary}><Printer className="w-4 h-4" /> Invoice</button>
      </div>
    </Card>
  );
}

function Row({ l, v }: { l: string; v: string }) {
  return <div className="flex justify-between text-slate-600 dark:text-slate-300"><span>{l}</span><span className="tabular-nums">{v}</span></div>;
}

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);

/** Printable invoice in a new window (browser print → PDF). */
function printInvoice(o: AdminOrder, bizName: string) {
  const w = window.open("", "_blank", "width=820,height=900");
  if (!w) return alert("Allow pop-ups to print the invoice.");
  const rows = o.items.map((i) => `<tr><td>${esc(i.name)}${Object.keys(i.options).length ? `<br><small>${esc(optionText(i.options))}</small>` : ""}</td><td class="r">${i.qty}</td><td class="r">${inr(i.price)}</td><td class="r">${inr(i.qty * i.price)}</td></tr>`).join("");
  w.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>Invoice ${orderLabel(o.orderNo)}</title><style>
body{font:14px/1.5 system-ui,sans-serif;color:#0f172a;margin:40px}h1{margin:0;font-size:22px}.muted{color:#64748b}table{width:100%;border-collapse:collapse;margin-top:24px}
th,td{padding:10px 8px;border-bottom:1px solid #e2e8f0;text-align:left;vertical-align:top}th{font-size:12px;text-transform:uppercase;color:#64748b}.r{text-align:right}
.tot td{border:0;padding:4px 8px}.grand td{font-weight:800;font-size:16px;border-top:2px solid #0f172a}.top{display:flex;justify-content:space-between;gap:24px}
</style></head><body><div class="top"><div><h1>${esc(bizName)}</h1><p class="muted">Tax invoice / order receipt</p></div>
<div class="r"><b>Order ${orderLabel(o.orderNo)}</b><br><span class="muted">${esc(new Date(o.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }))}</span></div></div>
<p><b>Bill / ship to</b><br>${esc(o.customerName)} · ${esc(o.phone)}<br>${esc([o.address, o.city, o.pincode].filter(Boolean).join(", "))}</p>
<table><thead><tr><th>Item</th><th class="r">Qty</th><th class="r">Price</th><th class="r">Amount</th></tr></thead><tbody>${rows}</tbody></table>
<table><tbody class="tot"><tr><td class="r" style="width:80%">Subtotal</td><td class="r">${inr(o.subtotal)}</td></tr><tr><td class="r">Delivery</td><td class="r">${o.shipping ? inr(o.shipping) : "Free"}</td></tr>
<tr class="grand"><td class="r">Total</td><td class="r">${inr(o.total)}</td></tr></tbody></table>
<p class="muted">Payment: ${esc(PAYMENT_LABEL[o.paymentMethod] ?? o.paymentMethod)} — ${o.paymentStatus === "paid" ? "Paid" : "Pending"}</p>
<p class="muted">Thank you for shopping with ${esc(bizName)}!</p><script>window.onload=()=>window.print()</script></body></html>`);
  w.document.close();
}
