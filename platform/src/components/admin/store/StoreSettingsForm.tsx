"use client";

import { useState, useTransition } from "react";
import { Store, Truck, Wallet, MessageCircle, CheckCircle2 } from "lucide-react";
import { saveStoreSettings } from "@/lib/actions/store";
import { inr, type StoreSettings } from "@/lib/store";
import { ImageInput } from "../ImageInput";
import { Card, PageHeader, btnPrimary } from "../ui";

const input = "w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3.5 py-2.5 text-sm outline-none focus:border-lime-500 focus:ring-4 focus:ring-lime-500/15 transition";
const lbl = "block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1";

function Toggle({ on, onChange, label, hint }: { on: boolean; onChange: (v: boolean) => void; label: string; hint: string }) {
  return (
    <label className="flex items-start justify-between gap-4 cursor-pointer">
      <span><span className="block text-sm font-semibold text-slate-900 dark:text-white">{label}</span><span className="block text-xs text-slate-500">{hint}</span></span>
      <input type="checkbox" role="switch" checked={on} onChange={(e) => onChange(e.target.checked)} className="peer sr-only" />
      <span className="relative shrink-0 w-11 h-6 rounded-full bg-slate-300 dark:bg-slate-700 peer-checked:bg-lime-500 transition after:absolute after:top-0.5 after:left-0.5 after:w-5 after:h-5 after:rounded-full after:bg-white after:shadow after:transition peer-checked:after:translate-x-5 peer-focus-visible:ring-4 peer-focus-visible:ring-lime-500/30" />
    </label>
  );
}

export function StoreSettingsForm({ initial, demo }: { initial: StoreSettings; demo: boolean }) {
  const [s, setS] = useState(initial);
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const set = <K extends keyof StoreSettings>(k: K, v: StoreSettings[K]) => { setS((x) => ({ ...x, [k]: v })); setMsg(null); };
  const num = (k: "shippingFee" | "freeShippingAbove" | "minOrder" | "lowStockAt") => (
    <input type="number" min={0} inputMode="numeric" value={s[k]} onChange={(e) => set(k, Math.max(0, Math.floor(Number(e.target.value) || 0)))} className={input} />
  );

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        start(async () => {
          const r = await saveStoreSettings(s).catch((x) => ({ ok: false as const, error: x instanceof Error ? x.message : "Save failed" }));
          setMsg(r.ok ? { ok: true, text: demo ? "Saved for this demo session." : "Store settings saved." } : { ok: false, text: r.error });
        });
      }}
      className="space-y-4 max-w-4xl"
    >
      <PageHeader icon={<Store />} title="Store settings" subtitle="Delivery charges, payment options and WhatsApp ordering for your online store." />

      <div className="grid lg:grid-cols-2 gap-4">
        <Card className="p-4 sm:p-5 space-y-4">
          <p className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white"><Truck className="w-4 h-4 text-lime-600" /> Delivery</p>
          <div className="grid grid-cols-2 gap-3">
            <div><label className={lbl}>Delivery fee (₹)</label>{num("shippingFee")}</div>
            <div><label className={lbl}>Free delivery above (₹)</label>{num("freeShippingAbove")}</div>
            <div><label className={lbl}>Minimum order (₹)</label>{num("minOrder")}</div>
            <div><label className={lbl}>Low-stock alert at</label>{num("lowStockAt")}</div>
          </div>
          <p className="text-xs text-slate-500 rounded-lg bg-slate-50 dark:bg-white/[0.03] px-3 py-2">
            Shoppers pay {s.shippingFee ? inr(s.shippingFee) : "no"} delivery{s.freeShippingAbove ? `, free on orders of ${inr(s.freeShippingAbove)} or more` : ""}{s.minOrder ? `. Minimum order ${inr(s.minOrder)}` : ""}.
          </p>
          <div><label className={lbl}>Checkout note</label><textarea rows={2} value={s.checkoutNote} onChange={(e) => set("checkoutNote", e.target.value)} placeholder="Delivery in 2–5 days. Easy 7-day returns." className={input} /></div>
        </Card>

        <Card className="p-4 sm:p-5 space-y-4">
          <p className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white"><Wallet className="w-4 h-4 text-lime-600" /> Payments</p>
          <Toggle on={s.codEnabled} onChange={(v) => set("codEnabled", v)} label="Cash on delivery" hint="Customer pays when the order arrives." />
          <Toggle on={s.upiEnabled} onChange={(v) => set("upiEnabled", v)} label="UPI" hint="Shows your UPI ID and a QR after the order is placed." />
          {s.upiEnabled && (
            <div className="grid sm:grid-cols-[1fr_8rem] gap-3 items-start">
              <div><label className={lbl}>UPI ID</label><input value={s.upiId} onChange={(e) => set("upiId", e.target.value)} placeholder="yourshop@okaxis" className={input} /><p className="text-[11px] text-slate-400 mt-1">Leave the QR empty — we generate one with the order amount.</p></div>
              <div><label className={lbl}>QR image (optional)</label><ImageInput value={s.upiQrImage} onChange={(u) => set("upiQrImage", u)} aspect="aspect-square" /></div>
            </div>
          )}
        </Card>

        <Card className="p-4 sm:p-5 space-y-4 lg:col-span-2">
          <p className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white"><MessageCircle className="w-4 h-4 text-emerald-600" /> WhatsApp orders</p>
          <Toggle on={s.whatsappEnabled} onChange={(v) => set("whatsappEnabled", v)} label="Order on WhatsApp" hint="Adds an 'Order on WhatsApp' option at checkout and an enquiry button on product pages." />
          <div className="max-w-sm"><label className={lbl}>WhatsApp number</label><input value={s.whatsappNumber} onChange={(e) => set("whatsappNumber", e.target.value)} placeholder="98765 43210" inputMode="tel" className={input} /></div>
        </Card>
      </div>

      <div className="flex items-center gap-3 sticky bottom-0 py-3 bg-slate-50/90 dark:bg-slate-950/90 backdrop-blur">
        <button type="submit" disabled={pending} className={btnPrimary}>{pending ? "Saving…" : "Save settings"}</button>
        {msg && <p className={`text-sm font-semibold inline-flex items-center gap-1.5 ${msg.ok ? "text-emerald-600" : "text-rose-600"}`} role="status">{msg.ok && <CheckCircle2 className="w-4 h-4" />}{msg.text}</p>}
      </div>
    </form>
  );
}
