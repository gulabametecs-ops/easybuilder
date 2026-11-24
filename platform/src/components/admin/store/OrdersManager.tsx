"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import {
  ShoppingBag, Search, Phone, MessageCircle, Printer, MapPin, X, CheckCircle2, Circle, Ban, IndianRupee, Truck, RefreshCw, FileText,
  Package, ExternalLink, Undo2, History, Tag,
} from "lucide-react";
import { refundStoreOrder, updateOrder } from "@/lib/actions/store";
import { courierDocument, prepareInvoices, refreshTracking, shipOrder } from "@/lib/actions/shipping";
import { ORDER_STATUSES, PAYMENT_LABEL, inr, optionText, orderLabel, waLink } from "@/lib/store";
import type { adminOrders } from "@/lib/storeAdmin";
import { Badge, Card, EmptyState, PageHeader, btnSecondary } from "../ui";

export type AdminOrder = Awaited<ReturnType<typeof adminOrders>>[number] & { suggestedWeight: number };
type Couriers = { shiprocket: boolean; delhivery: boolean };
type Patch = { status?: string; paymentStatus?: string; note?: string };

const TONE: Record<string, "violet" | "blue" | "amber" | "slate" | "green" | "red"> = {
  new: "violet", confirmed: "blue", packed: "amber", shipped: "slate", delivered: "green", cancelled: "red",
};
const PIPELINE = ORDER_STATUSES.filter((s) => s.id !== "cancelled");
const when = (iso: string) => new Date(iso).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" });
const run = async <T,>(fn: () => Promise<T>): Promise<T | { ok: false; error: string }> => {
  try { return await fn(); } catch (e) { return { ok: false as const, error: e instanceof Error ? e.message : "Something went wrong" }; }
};

export function openPrint(doc: "invoice" | "slip", ids: string[]) {
  window.open(`/admin/store-print?doc=${doc}&ids=${ids.join(",")}`, "_blank", "noopener");
}

export function OrdersManager({ orders, bizName, demo, couriers, siteBase }: { orders: AdminOrder[]; bizName: string; demo: boolean; couriers: Couriers; siteBase: string }) {
  const [pending, start] = useTransition();
  const [tab, setTab] = useState("all");
  const [q, setQ] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);
  const [sel, setSel] = useState<Set<string>>(new Set());
  const [flash, setFlash] = useState<{ ok: boolean; text: string } | null>(null);
  const needle = q.trim().toLowerCase();
  const list = orders.filter((o) => (tab === "all" || o.status === tab) && (!needle || `${o.orderNo} ${o.customerName} ${o.phone} ${o.city} ${o.pincode} ${o.awb}`.toLowerCase().includes(needle)));
  const open = orders.find((o) => o.id === openId) ?? null;
  const count = (s: string) => orders.filter((o) => o.status === s).length;
  const selected = [...sel].filter((id) => orders.some((o) => o.id === id));

  const act = (fn: () => Promise<{ ok: boolean; error?: string; message?: string }>, okText?: string) =>
    start(async () => {
      const r = await run(fn);
      setFlash(r.ok ? { ok: true, text: ("message" in r && r.message) || okText || "Done." } : { ok: false, text: ("error" in r && r.error) || "Failed" });
    });

  const bulkStatus = (status: string) =>
    act(async () => {
      const errs: string[] = [];
      for (const id of selected) { const r = await updateOrder(id, { status }); if (!r.ok) errs.push(r.error); }
      setSel(new Set());
      return errs.length ? { ok: false, error: `${selected.length - errs.length} updated. ${errs[0]}` } : { ok: true, message: `${selected.length} order(s) marked ${status}.` };
    });

  const print = (doc: "invoice" | "slip", ids: string[]) =>
    start(async () => {
      if (doc === "invoice") { const r = await run(() => prepareInvoices(ids)); if (!r.ok) return setFlash({ ok: false, text: r.error }); }
      openPrint(doc, ids);
    });

  return (
    <div className="space-y-4">
      <PageHeader
        icon={<ShoppingBag />}
        title="Orders"
        subtitle={`${orders.length} orders · ${count("new")} waiting for confirmation`}
        action={(couriers.shiprocket || couriers.delhivery) && count("shipped") > 0 && (
          <button type="button" disabled={pending} onClick={() => act(() => refreshTracking())} className={btnSecondary}><RefreshCw className={`w-4 h-4 ${pending ? "animate-spin" : ""}`} /> Refresh tracking</button>
        )}
      />
      {demo && <p className="rounded-xl bg-violet-50 dark:bg-violet-500/10 text-violet-700 dark:text-violet-300 text-xs px-3 py-2">Demo: sample orders are read-only. Place a test order on your store (View site → add to cart → checkout) and manage it here. Courier bookings are simulated and no emails are sent.</p>}
      {flash && (
        <p role="status" className={`flex items-start justify-between gap-3 rounded-xl text-sm px-3.5 py-2.5 ${flash.ok ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-300" : "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300"}`}>
          <span>{flash.text}</span><button type="button" onClick={() => setFlash(null)} aria-label="Dismiss"><X className="w-4 h-4" /></button>
        </p>
      )}

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
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search order #, name, phone, pincode, AWB…" className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white pl-9 pr-3 py-2.5 text-sm outline-none focus:border-lime-500" />
        </label>
        {selected.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 rounded-xl bg-slate-50 dark:bg-white/[0.03] px-3 py-2">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200 mr-1">{selected.length} selected</span>
            <button type="button" disabled={pending} onClick={() => bulkStatus("confirmed")} className={bulkBtn}>Confirm</button>
            <button type="button" disabled={pending} onClick={() => bulkStatus("packed")} className={bulkBtn}><Package className="w-3.5 h-3.5" /> Mark packed</button>
            <button type="button" disabled={pending} onClick={() => bulkStatus("shipped")} className={bulkBtn}><Truck className="w-3.5 h-3.5" /> Mark shipped</button>
            <button type="button" disabled={pending} onClick={() => print("invoice", selected)} className={bulkBtn}><Printer className="w-3.5 h-3.5" /> Invoices</button>
            <button type="button" disabled={pending} onClick={() => print("slip", selected)} className={bulkBtn}><FileText className="w-3.5 h-3.5" /> Packing slips</button>
            <button type="button" onClick={() => setSel(new Set())} className="text-xs font-semibold text-slate-500 hover:underline ml-auto">Clear</button>
          </div>
        )}
      </Card>

      <div className={`grid gap-4 ${open ? "xl:grid-cols-[1fr_28rem]" : ""} items-start ${pending ? "opacity-80" : ""}`}>
        <Card className="overflow-hidden">
          {list.length === 0 ? (
            <EmptyState icon={<ShoppingBag />} title={orders.length ? "No orders here" : "No orders yet"} hint={orders.length ? "Try another status or search." : "Share your store link — orders from the website land here with the customer's address and payment choice."} />
          ) : (
            <ul className="divide-y divide-slate-100 dark:divide-white/5">
              <li className="px-4 py-2 flex items-center gap-3 bg-slate-50/60 dark:bg-white/[0.02]">
                <input type="checkbox" aria-label="Select all" checked={list.every((o) => sel.has(o.id))} onChange={(e) => setSel(e.target.checked ? new Set([...sel, ...list.map((o) => o.id)]) : new Set([...sel].filter((id) => !list.some((o) => o.id === id))))} className="w-4 h-4 accent-lime-600" />
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Select for bulk actions</span>
              </li>
              {list.map((o) => (
                <li key={o.id} className={`flex items-center gap-3 pl-4 hover:bg-slate-50/70 dark:hover:bg-white/[0.02] ${o.id === openId ? "bg-lime-50/60 dark:bg-lime-500/5" : ""}`}>
                  <input type="checkbox" aria-label={`Select order ${orderLabel(o.orderNo)}`} checked={sel.has(o.id)} onChange={(e) => { const n = new Set(sel); if (e.target.checked) n.add(o.id); else n.delete(o.id); setSel(n); }} className="w-4 h-4 accent-lime-600 shrink-0" />
                  <button type="button" onClick={() => setOpenId(o.id === openId ? null : o.id)} className="flex-1 min-w-0 text-left pr-4 py-3 flex items-center gap-3">
                    <span className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-violet-500 text-white text-[11px] font-extrabold flex items-center justify-center shrink-0">{orderLabel(o.orderNo)}</span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-sm text-slate-900 dark:text-white truncate">{o.customerName}</span>
                        <Badge tone={TONE[o.status] ?? "slate"}>{o.status}</Badge>
                        {o.returnStatus !== "none" && <Badge tone="amber">return {o.returnStatus}</Badge>}
                        {awaitingPay(o) && <Badge tone="amber">awaiting payment</Badge>}
                      </span>
                      <span className="block text-xs text-slate-500 truncate mt-0.5">
                        {o.items.reduce((n, i) => n + i.qty, 0)} item(s) · {PAYMENT_LABEL[o.paymentMethod] ?? o.paymentMethod}{o.paymentStatus === "paid" ? " · Paid" : o.paymentStatus === "refunded" ? " · Refunded" : ""}{o.couponCode ? ` · ${o.couponCode}` : ""} · {o.city || o.pincode}{o.awb ? ` · AWB ${o.awb}` : ""} · {when(o.createdAt)}
                      </span>
                    </span>
                    <span className="text-sm font-extrabold text-slate-900 dark:text-white tabular-nums">{inr(o.total)}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </Card>

        {open && (
          <OrderDetail
            key={open.id}
            o={open}
            bizName={bizName}
            couriers={couriers}
            siteBase={siteBase}
            pending={pending}
            onClose={() => setOpenId(null)}
            onPatch={(p) => act(() => updateOrder(open.id, p), "Order updated.")}
            onShip={(input) => act(() => shipOrder(open.id, input))}
            onPrint={(doc) => print(doc, [open.id])}
            onDoc={(kind) => start(async () => { const r = await run(() => courierDocument(open.id, kind)); if (r.ok) window.open(r.url, "_blank", "noopener"); else setFlash({ ok: false, text: r.error }); })}
            onRefresh={() => act(() => refreshTracking([open.id]))}
            onRefund={(amount, note) => act(() => refundStoreOrder(open.id, amount, note))}
          />
        )}
      </div>
    </div>
  );
}

const bulkBtn = "inline-flex items-center gap-1 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 px-2.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:border-lime-400 disabled:opacity-60";
const input = "w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3 py-2 text-sm outline-none focus:border-lime-500";
const lbl = "block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1";

type ShipForm = { provider: "manual" | "shiprocket" | "delhivery"; weightGrams: number; lengthCm: number; breadthCm: number; heightCm: number; courier: string; awb: string; trackingUrl: string };

const awaitingPay = (o: AdminOrder) => o.paymentMethod === "online" && (o.paymentStatus === "pending" || o.paymentStatus === "failed") && o.status !== "cancelled";

function OrderDetail({ o, bizName, couriers, siteBase, pending, onClose, onPatch, onShip, onPrint, onDoc, onRefresh, onRefund }: {
  o: AdminOrder; bizName: string; couriers: Couriers; siteBase: string; pending: boolean; onClose: () => void; onPatch: (p: Patch) => void;
  onShip: (f: ShipForm) => void; onPrint: (doc: "invoice" | "slip") => void; onDoc: (kind: "label" | "manifest") => void; onRefresh: () => void;
  onRefund: (amount: number, note: string) => void;
}) {
  const refundable = o.total - o.refundAmount;
  const gateway = o.paymentMethod === "online" && !!o.paymentId;
  const [refundOpen, setRefundOpen] = useState(false);
  const [refundAmt, setRefundAmt] = useState(refundable);
  const [refundNote, setRefundNote] = useState("");
  const step = PIPELINE.findIndex((s) => s.id === o.status);
  const cancelled = o.status === "cancelled";
  const next = !cancelled && step >= 0 && step < PIPELINE.length - 1 ? PIPELINE[step + 1] : null;
  const canShip = ["new", "confirmed", "packed"].includes(o.status);
  const [shipOpen, setShipOpen] = useState(false);
  const [f, setF] = useState<ShipForm>({ provider: couriers.shiprocket ? "shiprocket" : couriers.delhivery ? "delhivery" : "manual", weightGrams: o.weightGrams || o.suggestedWeight, lengthCm: 20, breadthCm: 15, heightCm: 10, courier: "", awb: "", trackingUrl: "" });
  const partner = o.shippingProvider !== "manual" && !!o.shipmentRef;
  const trackLink = o.trackToken ? `${siteBase}/track/${o.trackToken}` : `${siteBase}/track`;
  const first = o.customerName.split(" ")[0];
  const wa: { label: string; text: string }[] = [
    { label: "Order confirmed", text: `Hi ${first}, thank you for your order ${orderLabel(o.orderNo)} from ${bizName}! It's confirmed (total ${inr(o.total)}). Track it here: ${trackLink}` },
    { label: "Packed", text: `Hi ${first}, your order ${orderLabel(o.orderNo)} from ${bizName} is packed and will be dispatched soon.` },
    { label: "Shipped", text: `Hi ${first}, your order ${orderLabel(o.orderNo)} from ${bizName} has been shipped${o.courier ? ` via ${o.courier}` : ""}${o.awb ? ` (AWB ${o.awb})` : ""}. Track: ${o.trackingUrl || trackLink}` },
    { label: "Delivered", text: `Hi ${first}, your order ${orderLabel(o.orderNo)} has been delivered. We hope you love it! Any issue? Reply here or visit ${trackLink}` },
    { label: "Cancelled", text: `Hi ${first}, your order ${orderLabel(o.orderNo)} from ${bizName} has been cancelled${o.cancelReason ? ` (${o.cancelReason})` : ""}. Sorry for the inconvenience.` },
    { label: "Ask for review", text: `Hi ${first}, thanks for shopping with ${bizName}! We'd love to hear what you think of your order.` },
  ];
  const defaultWa = { new: 0, confirmed: 0, packed: 1, shipped: 2, delivered: 3, cancelled: 4 }[o.status] ?? 0;
  const [waIdx, setWaIdx] = useState(defaultWa);
  const set = <K extends keyof ShipForm>(k: K, v: ShipForm[K]) => setF((x) => ({ ...x, [k]: v }));
  const num = (k: "weightGrams" | "lengthCm" | "breadthCm" | "heightCm", label: string) => (
    <label><span className={lbl}>{label}</span><input type="number" min={1} inputMode="numeric" value={f[k] || ""} onChange={(e) => set(k, Math.max(0, Math.floor(Number(e.target.value) || 0)))} className={input} /></label>
  );

  return (
    <Card className="p-4 sm:p-5 space-y-5 xl:sticky xl:top-0">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs text-slate-400">{when(o.createdAt)}{o.invoiceNo ? ` · Invoice ${o.invoiceNo}` : ""}</p>
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
                <button type="button" disabled={pending} onClick={() => (s.id === "shipped" && canShip ? setShipOpen(true) : onPatch({ status: s.id }))} title={`Mark ${s.label}`} className="w-full group">
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
          {next && next.id !== "shipped" && <button type="button" disabled={pending} onClick={() => onPatch({ status: next.id })} className="admin-grad rounded-xl px-3.5 py-2 text-sm font-semibold shadow-md">Mark as {next.label}</button>}
          {canShip && <button type="button" onClick={() => setShipOpen((v) => !v)} className={next?.id === "shipped" ? "admin-grad inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-semibold shadow-md" : btnSecondary}><Truck className="w-4 h-4" /> Ship order</button>}
          {cancelled
            ? <button type="button" disabled={pending} onClick={() => onPatch({ status: "new", note: "Order restored" })} className={btnSecondary}>Restore order</button>
            : o.status !== "delivered" && (
              <button type="button" disabled={pending} onClick={() => {
                const reason = prompt("Cancel this order? Stock will be added back.\n\nReason (shown to the customer):", "Out of stock");
                if (reason !== null) onPatch({ status: "cancelled", note: reason || "Cancelled by store" });
              }} className="inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10"><Ban className="w-4 h-4" /> Cancel</button>
            )}
        </div>
        {cancelled && o.cancelReason && <p className="mt-2 text-xs text-rose-600">Cancelled: {o.cancelReason}</p>}
      </div>

      {shipOpen && canShip && (
        <form onSubmit={(e) => { e.preventDefault(); onShip(f); setShipOpen(false); }} className="rounded-2xl border border-lime-300/70 dark:border-lime-500/30 bg-lime-50/40 dark:bg-lime-500/5 p-3.5 space-y-3">
          <p className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white"><Truck className="w-4 h-4 text-lime-600" /> Ship this order</p>
          <div className="grid grid-cols-3 gap-1.5" role="radiogroup" aria-label="Delivery partner">
            {(["shiprocket", "delhivery", "manual"] as const).map((p) => {
              const ok = p === "manual" || couriers[p];
              return (
                <button key={p} type="button" role="radio" aria-checked={f.provider === p} disabled={!ok} onClick={() => set("provider", p)} title={ok ? "" : "Connect it in Shipping & delivery"}
                  className={`rounded-xl px-2 py-2 text-xs font-semibold border transition ${f.provider === p ? "admin-grad border-transparent" : "border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300"} disabled:opacity-40`}>
                  {p === "manual" ? "Self / other" : p === "shiprocket" ? "Shiprocket" : "Delhivery"}
                </button>
              );
            })}
          </div>
          {!couriers.shiprocket && !couriers.delhivery && <p className="text-[11px] text-slate-500">Connect Shiprocket or Delhivery in <Link href="/admin/shipping" className="text-lime-600 font-semibold hover:underline">Shipping &amp; delivery</Link> to book couriers from here.</p>}
          <div className="grid grid-cols-4 gap-2">{num("weightGrams", "Weight (g)")}{num("lengthCm", "L (cm)")}{num("breadthCm", "B (cm)")}{num("heightCm", "H (cm)")}</div>
          {f.provider === "manual" ? (
            <div className="grid sm:grid-cols-2 gap-2">
              <label><span className={lbl}>Courier</span><input value={f.courier} onChange={(e) => set("courier", e.target.value)} placeholder="DTDC, India Post, own delivery…" className={input} /></label>
              <label><span className={lbl}>Tracking no. / AWB</span><input value={f.awb} onChange={(e) => set("awb", e.target.value)} placeholder="e.g. D12345678" className={input} /></label>
              <label className="sm:col-span-2"><span className={lbl}>Tracking link (optional)</span><input value={f.trackingUrl} onChange={(e) => set("trackingUrl", e.target.value)} placeholder="https://…" className={input} /></label>
            </div>
          ) : (
            <p className="text-[11px] text-slate-500">We&apos;ll create the shipment, get an AWB and courier{f.provider === "shiprocket" ? ", and request pickup" : ""}. {o.paymentMethod === "cod" && o.paymentStatus !== "paid" ? `COD amount ${inr(o.total)} will be collected.` : "Prepaid shipment."}</p>
          )}
          <div className="flex gap-2">
            <button type="submit" disabled={pending} className="admin-grad rounded-xl px-3.5 py-2 text-sm font-semibold shadow-md disabled:opacity-60">{f.provider === "manual" ? "Mark as shipped" : `Book with ${f.provider === "shiprocket" ? "Shiprocket" : "Delhivery"}`}</button>
            <button type="button" onClick={() => setShipOpen(false)} className={btnSecondary}>Close</button>
          </div>
        </form>
      )}

      {(o.awb || o.courier) && (
        <div className="rounded-2xl border border-slate-200 dark:border-white/10 p-3.5 space-y-2 text-sm">
          <p className="flex items-center gap-2 font-bold text-slate-900 dark:text-white"><Truck className="w-4 h-4 text-lime-600" /> {o.courier || "Shipment"}</p>
          {o.awb && <p className="text-slate-600 dark:text-slate-300">AWB <span className="font-mono font-semibold">{o.awb}</span>{o.weightGrams ? <span className="text-slate-400"> · {o.weightGrams} g</span> : null}</p>}
          <div className="flex flex-wrap gap-2">
            {o.trackingUrl && <a href={o.trackingUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs font-semibold text-lime-600 hover:underline"><ExternalLink className="w-3.5 h-3.5" /> Courier tracking</a>}
            {partner && <button type="button" disabled={pending} onClick={() => onDoc("label")} className="inline-flex items-center gap-1 text-xs font-semibold text-lime-600 hover:underline"><Tag className="w-3.5 h-3.5" /> Shipping label</button>}
            {partner && o.shippingProvider === "shiprocket" && <button type="button" disabled={pending} onClick={() => onDoc("manifest")} className="inline-flex items-center gap-1 text-xs font-semibold text-lime-600 hover:underline"><FileText className="w-3.5 h-3.5" /> Manifest</button>}
            {partner && o.status === "shipped" && <button type="button" disabled={pending} onClick={onRefresh} className="inline-flex items-center gap-1 text-xs font-semibold text-lime-600 hover:underline"><RefreshCw className="w-3.5 h-3.5" /> Refresh tracking</button>}
          </div>
        </div>
      )}

      {o.returnStatus !== "none" && (
        <Link href="/admin/returns" className="flex items-center justify-between gap-2 rounded-2xl bg-amber-50 dark:bg-amber-500/10 text-amber-800 dark:text-amber-200 px-3.5 py-2.5 text-sm">
          <span className="flex items-center gap-2"><Undo2 className="w-4 h-4" /> Return {o.returnStatus}{o.returnReason ? ` — ${o.returnReason}` : ""}</span><span className="text-xs font-semibold">Manage →</span>
        </Link>
      )}

      <div className="rounded-2xl bg-slate-50 dark:bg-white/[0.03] p-3.5 space-y-1.5 text-sm">
        <p className="font-bold text-slate-900 dark:text-white">{o.customerName}</p>
        <p className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300"><Phone className="w-3.5 h-3.5" /><a href={`tel:${o.phone}`} className="hover:underline">{o.phone}</a>{o.email && <span className="text-slate-400 truncate">· {o.email}</span>}</p>
        <p className="flex items-start gap-1.5 text-slate-600 dark:text-slate-300"><MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0" />{[o.address, o.addressLine2, o.city, o.state, o.pincode].filter(Boolean).join(", ")}</p>
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
              <span className="block text-xs text-slate-500">{[optionText(i.options ?? {}), `${i.qty} × ${inr(i.price)}`].filter(Boolean).join(" · ")}</span>
            </span>
            <span className="text-sm font-bold tabular-nums text-slate-900 dark:text-white">{inr(i.qty * i.price)}</span>
          </li>
        ))}
      </ul>

      <div className="border-t border-slate-100 dark:border-white/10 pt-3 space-y-1 text-sm">
        <Row l="Subtotal" v={inr(o.subtotal)} />
        <Row l="Delivery" v={o.shipping ? inr(o.shipping) : "Free"} />
        {o.codFee > 0 && <Row l="COD charge" v={inr(o.codFee)} />}
        {o.discount > 0 && <Row l={`Discount${o.couponCode ? ` (${o.couponCode})` : ""}`} v={`−${inr(o.discount)}`} />}
        <div className="flex justify-between font-extrabold text-base text-slate-900 dark:text-white pt-1"><span>Total</span><span className="tabular-nums">{inr(o.total)}</span></div>
        {o.tax > 0 && <p className="text-[11px] text-slate-400 text-right">Incl. GST {inr(o.tax)}</p>}
        {o.refundAmount > 0 && <Row l="Refunded" v={`−${inr(o.refundAmount)}`} />}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1.5 rounded-2xl border border-slate-200 dark:border-white/10 px-3.5 py-2.5">
        <span className="text-sm">
          <span className="text-slate-500">{PAYMENT_LABEL[o.paymentMethod] ?? o.paymentMethod} · </span>
          <span className={`font-bold ${o.paymentStatus === "paid" ? "text-emerald-600" : o.paymentStatus === "refunded" ? "text-slate-500" : o.paymentStatus === "failed" ? "text-rose-600" : "text-amber-600"}`}>{o.paymentStatus === "paid" ? (o.refundAmount > 0 ? "Paid · partly refunded" : "Paid") : o.paymentStatus === "refunded" ? "Refunded" : o.paymentStatus === "failed" ? "Payment failed" : "Payment pending"}</span>
        </span>
        <span className="flex items-center gap-3">
          {o.paymentStatus !== "refunded" && o.paymentMethod !== "online" && !o.refundAmount && (
            <button type="button" disabled={pending} onClick={() => onPatch({ paymentStatus: o.paymentStatus === "paid" ? "pending" : "paid" })} className="inline-flex items-center gap-1 whitespace-nowrap text-xs font-semibold text-lime-600 hover:underline">
              <IndianRupee className="w-3.5 h-3.5" /> {o.paymentStatus === "paid" ? "Mark unpaid" : "Mark paid"}
            </button>
          )}
          {o.paymentStatus === "paid" && refundable > 0 && (
            <button type="button" onClick={() => setRefundOpen((v) => !v)} className="inline-flex items-center gap-1 whitespace-nowrap text-xs font-semibold text-rose-600 hover:underline"><Undo2 className="w-3.5 h-3.5" /> Refund</button>
          )}
        </span>
      </div>
      {awaitingPay(o) && <p className="text-xs rounded-xl bg-amber-50 dark:bg-amber-500/10 text-amber-800 dark:text-amber-200 px-3 py-2">Waiting for the customer to finish paying online. Stock is held for 30 minutes, then the order is cancelled automatically if unpaid.</p>}
      {o.paymentId && <p className="text-[11px] text-slate-400 -mt-3">Payment ref {o.paymentId}{o.paymentRef ? ` · ${o.paymentRef}` : ""}</p>}
      {refundOpen && o.paymentStatus === "paid" && refundable > 0 && (
        <form onSubmit={(e) => { e.preventDefault(); if (confirm(`${gateway ? "Refund" : "Record a refund of"} ${inr(refundAmt)}${gateway ? " to the customer via Razorpay" : ""}?`)) { onRefund(refundAmt, refundNote); setRefundOpen(false); } }} className="rounded-2xl border border-rose-200 dark:border-rose-500/30 bg-rose-50/40 dark:bg-rose-500/5 p-3.5 space-y-3">
          <p className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white"><Undo2 className="w-4 h-4 text-rose-500" /> {gateway ? "Refund via Razorpay" : "Record a refund"}</p>
          <div className="grid grid-cols-[8rem_1fr] gap-2">
            <label><span className={lbl}>Amount (₹)</span><input type="number" min={1} max={refundable} value={refundAmt || ""} onChange={(e) => setRefundAmt(Math.max(0, Math.min(refundable, Math.floor(Number(e.target.value) || 0))))} className={input} /></label>
            <label><span className={lbl}>Reason (optional)</span><input value={refundNote} onChange={(e) => setRefundNote(e.target.value)} maxLength={200} placeholder="Damaged item, out of stock…" className={input} /></label>
          </div>
          <button type="button" onClick={() => setRefundAmt(refundable)} className="text-xs font-semibold text-slate-500 hover:underline">Full amount ({inr(refundable)})</button>
          <p className="text-[11px] text-slate-500">{gateway ? "The money goes back to the customer's original UPI / card in 5–7 days." : "Pay the customer back by UPI / bank first — this only records it."}</p>
          <div className="flex gap-2">
            <button type="submit" disabled={pending || refundAmt < 1} className="rounded-xl bg-rose-600 hover:bg-rose-700 text-white px-3.5 py-2 text-sm font-semibold disabled:opacity-60">{gateway ? `Refund ${inr(refundAmt)}` : "Record refund"}</button>
            <button type="button" onClick={() => setRefundOpen(false)} className={btnSecondary}>Close</button>
          </div>
        </form>
      )}

      <div className="space-y-2">
        <div className="flex gap-2">
          <select value={waIdx} onChange={(e) => setWaIdx(Number(e.target.value))} aria-label="WhatsApp message" className={`${input} flex-1`}>
            {wa.map((m, i) => <option key={m.label} value={i}>{m.label}</option>)}
          </select>
          <a href={waLink(o.phone, wa[waIdx].text)} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 text-white px-3.5 py-2 text-sm font-semibold hover:bg-emerald-700 shrink-0"><MessageCircle className="w-4 h-4" /> WhatsApp</a>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button type="button" disabled={pending} onClick={() => onPrint("invoice")} className={btnSecondary}><Printer className="w-4 h-4" /> GST invoice</button>
          <button type="button" disabled={pending} onClick={() => onPrint("slip")} className={btnSecondary}><FileText className="w-4 h-4" /> Packing slip</button>
        </div>
        <a href={trackLink} target="_blank" rel="noreferrer" className="block text-center text-xs font-semibold text-slate-500 hover:text-lime-600">Customer tracking page ↗</a>
      </div>

      {o.timeline.length > 0 && (
        <div>
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 mb-2"><History className="w-3.5 h-3.5" /> Timeline</p>
          <ol className="relative border-l border-slate-200 dark:border-white/10 ml-1.5 space-y-3">
            {[...o.timeline].reverse().map((e, i) => (
              <li key={i} className="pl-4 relative">
                <span className={`absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full ${i === 0 ? "bg-lime-500" : "bg-slate-300 dark:bg-slate-600"}`} />
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 capitalize">{e.status.replace(/_/g, " ")}</p>
                {e.note && <p className="text-xs text-slate-500 break-words">{e.note}</p>}
                <p className="text-[11px] text-slate-400">{when(e.at)}</p>
              </li>
            ))}
          </ol>
        </div>
      )}
    </Card>
  );
}

function Row({ l, v }: { l: string; v: string }) {
  return <div className="flex justify-between text-slate-600 dark:text-slate-300"><span>{l}</span><span className="tabular-nums">{v}</span></div>;
}
