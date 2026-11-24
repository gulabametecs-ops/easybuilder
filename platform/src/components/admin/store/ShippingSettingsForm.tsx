"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Truck, MapPinned, Scale, Clock, Building2, Plug, CheckCircle2, Plus, Trash2, X, Calculator, KeyRound } from "lucide-react";
import { saveShippingSettings, testCourier, type CourierInput } from "@/lib/actions/shipping";
import { inr, type ShipZone, type ShippingSettings, type StoreSettings } from "@/lib/store";
import { INDIAN_STATES, etaDate, quoteShipping } from "@/lib/shipping";
import type { CourierPublic } from "@/lib/couriers";
import { Card, PageHeader, btnPrimary, btnSecondary } from "../ui";

const input = "w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3.5 py-2.5 text-sm outline-none focus:border-lime-500 focus:ring-4 focus:ring-lime-500/15 transition";
const lbl = "block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1";
const h = "flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white";

const toList = (s: string) => [...new Set(s.split(/[\s,]+/).map((x) => x.replace(/\D/g, "")).filter(Boolean))];
const newId = () => Math.random().toString(36).slice(2, 10);
const NE = ["Arunachal Pradesh", "Assam", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Sikkim", "Tripura", "Jammu and Kashmir", "Ladakh", "Andaman and Nicobar Islands", "Lakshadweep"];

function Num({ value, onChange, min = 0 }: { value: number; onChange: (n: number) => void; min?: number }) {
  return <input type="number" min={min} inputMode="numeric" value={value} onChange={(e) => onChange(Math.max(min, Math.floor(Number(e.target.value) || 0)))} className={input} />;
}

function Pins({ value, onChange, placeholder }: { value: string[]; onChange: (v: string[]) => void; placeholder: string }) {
  const [text, setText] = useState(value.join(", "));
  return <textarea rows={2} value={text} onChange={(e) => setText(e.target.value)} onBlur={() => { const l = toList(text); onChange(l); setText(l.join(", ")); }} placeholder={placeholder} className={`${input} font-mono text-xs`} />;
}

function Toggle({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className="inline-flex items-center gap-2.5 cursor-pointer text-sm font-semibold text-slate-700 dark:text-slate-200">
      <input type="checkbox" role="switch" checked={on} onChange={(e) => onChange(e.target.checked)} className="peer sr-only" />
      <span className="relative shrink-0 w-10 h-[22px] rounded-full bg-slate-300 dark:bg-slate-700 peer-checked:bg-lime-500 transition after:absolute after:top-0.5 after:left-0.5 after:w-[18px] after:h-[18px] after:rounded-full after:bg-white after:shadow after:transition peer-checked:after:translate-x-[18px] peer-focus-visible:ring-4 peer-focus-visible:ring-lime-500/30" />
      {label}
    </label>
  );
}

export function ShippingSettingsForm({ store, courier: savedCourier, demo }: { store: StoreSettings; courier: CourierPublic; demo: boolean }) {
  const [s, setS] = useState<ShippingSettings>(store.shipping);
  const [c, setC] = useState<CourierInput>({
    shiprocket: { email: savedCourier.shiprocket.email, password: "", pickupLocation: savedCourier.shiprocket.pickupLocation },
    delhivery: { token: "", pickupName: savedCourier.delhivery.pickupName, staging: savedCourier.delhivery.staging },
  });
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [test, setTest] = useState<Record<string, { ok: boolean; text: string } | undefined>>({});
  const set = <K extends keyof ShippingSettings>(k: K, v: ShippingSettings[K]) => { setS((x) => ({ ...x, [k]: v })); setMsg(null); };
  const setZone = (id: string, patch: Partial<ShipZone>) => set("zones", s.zones.map((z) => (z.id === id ? { ...z, ...patch } : z)));
  const addZone = (preset: Partial<ShipZone> = {}) =>
    set("zones", [...s.zones, { id: newId(), name: "New zone", states: [], pincodes: [], fee: store.shippingFee, freeAbove: 0, codAllowed: true, codFee: s.codFee, etaMin: s.etaMin, etaMax: s.etaMax, ...preset }]);
  const setPickup = (k: keyof ShippingSettings["pickup"], v: string) => set("pickup", { ...s.pickup, [k]: v });

  // Live calculator (pure quoteShipping on the unsaved settings).
  const [calc, setCalc] = useState({ pincode: "", state: "", subtotal: 600, weight: 500 });
  const quote = calc.pincode.length === 6 ? quoteShipping({ ...store, shipping: s }, { pincode: calc.pincode, state: calc.state, subtotal: calc.subtotal, weightGrams: calc.weight }) : null;

  const runTest = (p: "shiprocket" | "delhivery") =>
    start(async () => {
      const r = await testCourier(p, c).catch((e) => ({ ok: false as const, error: e instanceof Error ? e.message : "Test failed" }));
      setTest((t) => ({ ...t, [p]: r.ok ? { ok: true, text: r.message ?? "Connected." } : { ok: false, text: r.error } }));
    });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        start(async () => {
          const r = await saveShippingSettings(s, c).catch((x) => ({ ok: false as const, error: x instanceof Error ? x.message : "Save failed" }));
          setMsg(r.ok ? { ok: true, text: r.message ?? "Saved." } : { ok: false, text: r.error });
          if (r.ok) setC((x) => ({ shiprocket: { ...x.shiprocket, password: "" }, delhivery: { ...x.delhivery, token: "" } }));
        });
      }}
      className="space-y-4 max-w-5xl"
    >
      <PageHeader icon={<Truck />} title="Shipping & delivery" subtitle="Where you deliver, what it costs, how long it takes — and your courier partners." />
      {demo && <p className="rounded-xl bg-violet-50 dark:bg-violet-500/10 text-violet-700 dark:text-violet-300 text-xs px-3 py-2">Demo: changes are saved for this session only. Courier connections and bookings are simulated — nothing is sent to Shiprocket or Delhivery.</p>}

      <div className="grid lg:grid-cols-2 gap-4">
        <Card className="p-4 sm:p-5 space-y-4">
          <p className={h}><MapPinned className="w-4 h-4 text-lime-600" /> Delivery area</p>
          <div className="grid grid-cols-3 gap-1.5" role="radiogroup" aria-label="Delivery area">
            {([["india", "All India"], ["zones", "Only my zones"], ["local", "Local only"]] as const).map(([id, label]) => (
              <button key={id} type="button" role="radio" aria-checked={s.serviceArea === id} onClick={() => set("serviceArea", id)} className={`rounded-xl px-2 py-2.5 text-xs font-semibold border transition ${s.serviceArea === id ? "admin-grad border-transparent shadow-sm" : "border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:border-lime-400"}`}>{label}</button>
            ))}
          </div>
          <p className="text-xs text-slate-500">
            {s.serviceArea === "india" ? "Every Indian pincode. Zones below can change the rate, COD and delivery time for some areas." : s.serviceArea === "zones" ? "Only pincodes/states listed in your zones can order." : "Only the pincodes below can order — great for a local shop or kirana."}
          </p>
          {s.serviceArea === "local" && (
            <div><label className={lbl}>Pincodes you deliver to (full pincodes or prefixes)</label><Pins value={s.localPincodes} onChange={(v) => set("localPincodes", v)} placeholder="560038, 560008, 56010" /></div>
          )}
        </Card>

        <Card className="p-4 sm:p-5 space-y-4">
          <p className={h}><Scale className="w-4 h-4 text-lime-600" /> Rates</p>
          <p className="text-xs text-slate-500 rounded-lg bg-slate-50 dark:bg-white/[0.03] px-3 py-2">
            Default: {store.shippingFee ? inr(store.shippingFee) : "free"} per order{store.freeShippingAbove ? `, free above ${inr(store.freeShippingAbove)}` : ""} — change it in <Link href="/admin/store-settings" className="text-lime-600 font-semibold hover:underline">Store settings</Link>.
          </p>
          <div>
            <div className="flex items-center justify-between mb-1.5"><label className={lbl}>Weight slabs (replace the flat fee)</label>
              <button type="button" onClick={() => set("weightSlabs", [...s.weightSlabs, { upToGrams: (s.weightSlabs.at(-1)?.upToGrams ?? 0) + 500, fee: (s.weightSlabs.at(-1)?.fee ?? store.shippingFee) + 20 }])} className="text-xs font-semibold text-lime-600 inline-flex items-center gap-1"><Plus className="w-3.5 h-3.5" /> Add slab</button>
            </div>
            {s.weightSlabs.length === 0 ? <p className="text-xs text-slate-400">No slabs — every order pays the flat fee.</p> : (
              <div className="space-y-2">
                {s.weightSlabs.map((w, i) => (
                  <div key={i} className="grid grid-cols-[1fr_1fr_auto] gap-2 items-center">
                    <label className="text-xs text-slate-500">Up to (g)<Num value={w.upToGrams} min={1} onChange={(n) => set("weightSlabs", s.weightSlabs.map((x, j) => (j === i ? { ...x, upToGrams: n } : x)))} /></label>
                    <label className="text-xs text-slate-500">Fee (₹)<Num value={w.fee} onChange={(n) => set("weightSlabs", s.weightSlabs.map((x, j) => (j === i ? { ...x, fee: n } : x)))} /></label>
                    <button type="button" onClick={() => set("weightSlabs", s.weightSlabs.filter((_, j) => j !== i))} className="mt-4 p-2 text-slate-400 hover:text-rose-600" aria-label="Remove slab"><Trash2 className="w-4 h-4" /></button>
                  </div>
                ))}
                <p className="text-[11px] text-slate-400">Heavier than the last slab pays the last slab&apos;s fee. Free-delivery thresholds still apply.</p>
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className={lbl}>COD charge (₹)</label><Num value={s.codFee} onChange={(n) => set("codFee", n)} /></div>
            <div><label className={lbl}>Default item weight (g)</label><Num value={s.defaultWeightGrams} onChange={(n) => set("defaultWeightGrams", n)} /></div>
          </div>
        </Card>
      </div>

      <Card className="p-4 sm:p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className={h}><MapPinned className="w-4 h-4 text-lime-600" /> Shipping zones <span className="text-xs font-medium text-slate-400">({s.zones.length})</span></p>
          <div className="flex flex-wrap gap-2">
            {s.pickup.state && <button type="button" onClick={() => addZone({ name: `Within ${s.pickup.state}`, states: [s.pickup.state], etaMin: 1, etaMax: 3 })} className={btnSecondary}>+ My state</button>}
            <button type="button" onClick={() => addZone({ name: "North-East & remote", states: NE, fee: store.shippingFee + 50, etaMin: 5, etaMax: 9 })} className={btnSecondary}>+ North-East &amp; remote</button>
            <button type="button" onClick={() => addZone()} className={btnPrimary}><Plus className="w-4 h-4" /> Add zone</button>
          </div>
        </div>
        {s.zones.length === 0 && <p className="text-sm text-slate-500">No zones yet — everyone gets your default rate and delivery time. Add zones for a cheaper local rate, costlier remote areas, or to turn off COD somewhere.</p>}
        <div className="grid xl:grid-cols-2 gap-3">
          {s.zones.map((z) => (
            <div key={z.id} className="rounded-2xl border border-slate-200 dark:border-white/10 p-3.5 space-y-3">
              <div className="flex gap-2">
                <input value={z.name} onChange={(e) => setZone(z.id, { name: e.target.value })} aria-label="Zone name" className={`${input} font-semibold`} />
                <button type="button" onClick={() => set("zones", s.zones.filter((x) => x.id !== z.id))} className="p-2 text-slate-400 hover:text-rose-600" aria-label={`Delete zone ${z.name}`}><Trash2 className="w-4 h-4" /></button>
              </div>
              <div>
                <label className={lbl}>States</label>
                <div className="flex flex-wrap gap-1.5">
                  {z.states.map((st) => (
                    <span key={st} className="inline-flex items-center gap-1 rounded-full bg-lime-100 dark:bg-lime-500/15 text-lime-800 dark:text-lime-300 text-xs font-semibold pl-2.5 pr-1 py-0.5">
                      {st}<button type="button" onClick={() => setZone(z.id, { states: z.states.filter((x) => x !== st) })} aria-label={`Remove ${st}`} className="p-0.5"><X className="w-3 h-3" /></button>
                    </span>
                  ))}
                  <select value="" onChange={(e) => e.target.value && setZone(z.id, { states: [...z.states, e.target.value] })} aria-label="Add state" className="rounded-full border border-dashed border-slate-300 dark:border-slate-600 bg-transparent text-xs px-2 py-0.5 text-slate-500 dark:bg-slate-900">
                    <option value="">+ Add state</option>
                    {INDIAN_STATES.filter((x) => !z.states.includes(x)).map((x) => <option key={x}>{x}</option>)}
                  </select>
                </div>
              </div>
              <div><label className={lbl}>Pincodes / prefixes (win over states)</label><Pins value={z.pincodes} onChange={(v) => setZone(z.id, { pincodes: v })} placeholder="110, 4000, 560038" /></div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <label className="text-xs text-slate-500">Fee (₹)<Num value={z.fee} onChange={(n) => setZone(z.id, { fee: n })} /></label>
                <label className="text-xs text-slate-500">Free above (₹)<Num value={z.freeAbove} onChange={(n) => setZone(z.id, { freeAbove: n })} /></label>
                <label className="text-xs text-slate-500">Days min<Num value={z.etaMin} onChange={(n) => setZone(z.id, { etaMin: n })} /></label>
                <label className="text-xs text-slate-500">Days max<Num value={z.etaMax} onChange={(n) => setZone(z.id, { etaMax: n })} /></label>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Toggle on={z.codAllowed} onChange={(v) => setZone(z.id, { codAllowed: v })} label="COD allowed" />
                {z.codAllowed && <label className="flex items-center gap-2 text-xs text-slate-500">COD fee ₹<input type="number" min={0} value={z.codFee} onChange={(e) => setZone(z.id, { codFee: Math.max(0, Math.floor(Number(e.target.value) || 0)) })} className={`${input} w-24 py-1.5`} /></label>}
              </div>
              <p className="text-[11px] text-slate-400">Free above 0 = store default. With weight slabs on, the zone fee is added to the slab fee.</p>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid lg:grid-cols-2 gap-4">
        <Card className="p-4 sm:p-5 space-y-4">
          <p className={h}><Clock className="w-4 h-4 text-lime-600" /> Timing &amp; returns</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div><label className={lbl}>Dispatch in (days)</label><Num value={s.dispatchDays} onChange={(n) => set("dispatchDays", n)} /></div>
            <div><label className={lbl}>Transit min</label><Num value={s.etaMin} onChange={(n) => set("etaMin", n)} /></div>
            <div><label className={lbl}>Transit max</label><Num value={s.etaMax} onChange={(n) => set("etaMax", n)} /></div>
            <div><label className={lbl}>Return window</label><Num value={s.returnWindowDays} onChange={(n) => set("returnWindowDays", n)} /></div>
          </div>
          <p className="text-xs text-slate-500">Shoppers see “Delivers by {etaDate(s.dispatchDays + Math.max(s.etaMin, s.etaMax))}”. {s.returnWindowDays ? `Customers can request a return or exchange from their tracking page for ${s.returnWindowDays} days after delivery.` : "Online return requests are off."}</p>
        </Card>

        <Card className="p-4 sm:p-5 space-y-3">
          <p className={h}><Calculator className="w-4 h-4 text-lime-600" /> Try a pincode</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <label className="text-xs text-slate-500">Pincode<input value={calc.pincode} onChange={(e) => setCalc({ ...calc, pincode: e.target.value.replace(/\D/g, "").slice(0, 6) })} inputMode="numeric" placeholder="560038" className={input} /></label>
            <label className="text-xs text-slate-500">State<select value={calc.state} onChange={(e) => setCalc({ ...calc, state: e.target.value })} className={input}><option value="">—</option>{INDIAN_STATES.map((x) => <option key={x}>{x}</option>)}</select></label>
            <label className="text-xs text-slate-500">Cart ₹<Num value={calc.subtotal} onChange={(n) => setCalc({ ...calc, subtotal: n })} /></label>
            <label className="text-xs text-slate-500">Weight g<Num value={calc.weight} onChange={(n) => setCalc({ ...calc, weight: n })} /></label>
          </div>
          {quote && (
            <p className={`text-sm rounded-xl px-3 py-2 ${quote.serviceable ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-300" : "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300"}`}>
              {quote.serviceable
                ? <>{quote.zoneName ? <b>{quote.zoneName}: </b> : "Default rate: "}{quote.fee ? inr(quote.fee) : "Free delivery"} · {quote.etaDays[0]}–{quote.etaDays[1]} days · {quote.codAllowed ? `COD ${quote.codFee ? `+${inr(quote.codFee)}` : "free"}` : "No COD"}</>
                : quote.reason}
            </p>
          )}
          <p className="text-[11px] text-slate-400">Uses your unsaved changes. On the store the state is looked up from the pincode automatically.</p>
        </Card>
      </div>

      <Card className="p-4 sm:p-5 space-y-4">
        <p className={h}><Building2 className="w-4 h-4 text-lime-600" /> Pickup address &amp; GST invoice</p>
        <div className="grid sm:grid-cols-3 gap-3">
          <div><label className={lbl}>Contact name</label><input value={s.pickup.name} onChange={(e) => setPickup("name", e.target.value)} className={input} /></div>
          <div><label className={lbl}>Phone</label><input value={s.pickup.phone} onChange={(e) => setPickup("phone", e.target.value)} inputMode="tel" className={input} /></div>
          <div><label className={lbl}>Email</label><input value={s.pickup.email} onChange={(e) => setPickup("email", e.target.value)} type="email" className={input} /></div>
          <div className="sm:col-span-3"><label className={lbl}>Address</label><input value={s.pickup.address} onChange={(e) => setPickup("address", e.target.value)} placeholder="Shop / warehouse, street, area" className={input} /></div>
          <div><label className={lbl}>City</label><input value={s.pickup.city} onChange={(e) => setPickup("city", e.target.value)} className={input} /></div>
          <div><label className={lbl}>State</label><select value={s.pickup.state} onChange={(e) => setPickup("state", e.target.value)} className={input}><option value="">Select state</option>{INDIAN_STATES.map((x) => <option key={x}>{x}</option>)}</select></div>
          <div><label className={lbl}>Pincode</label><input value={s.pickup.pincode} onChange={(e) => setPickup("pincode", e.target.value.replace(/\D/g, "").slice(0, 6))} inputMode="numeric" className={input} /></div>
          <div><label className={lbl}>GSTIN (optional)</label><input value={s.gstin} onChange={(e) => set("gstin", e.target.value.toUpperCase())} placeholder="27ABCDE1234F1Z5" className={`${input} font-mono`} /></div>
          <div><label className={lbl}>Legal / registered name</label><input value={s.legalName} onChange={(e) => set("legalName", e.target.value)} className={input} /></div>
          <div><label className={lbl}>Invoice prefix</label><input value={s.invoicePrefix} onChange={(e) => set("invoicePrefix", e.target.value)} placeholder="INV-" className={input} /></div>
        </div>
        <p className="text-xs text-slate-500">Couriers pick up from this address. Invoices split GST into CGST + SGST when the customer is in {s.pickup.state || "your state"}, otherwise IGST — set HSN and GST % on each product.</p>
      </Card>

      <Card className="p-4 sm:p-5 space-y-4">
        <p className={h}><Plug className="w-4 h-4 text-lime-600" /> Delivery partners</p>
        <div className="grid lg:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-slate-200 dark:border-white/10 p-4 space-y-3">
            <div className="flex items-center justify-between"><p className="font-bold text-slate-900 dark:text-white">Shiprocket</p>{savedCourier.shiprocket.hasPassword && <span className="text-[11px] font-semibold text-emerald-600 inline-flex items-center gap-1"><KeyRound className="w-3 h-3" /> Saved</span>}</div>
            <p className="text-xs text-slate-500">Use an <b>API user</b> (Shiprocket → Settings → API → Create an API user), not your login.</p>
            <div><label className={lbl}>API user email</label><input value={c.shiprocket.email} onChange={(e) => setC({ ...c, shiprocket: { ...c.shiprocket, email: e.target.value } })} type="email" autoComplete="off" className={input} /></div>
            <div><label className={lbl}>API user password</label><input value={c.shiprocket.password} onChange={(e) => setC({ ...c, shiprocket: { ...c.shiprocket, password: e.target.value } })} type="password" autoComplete="new-password" placeholder={savedCourier.shiprocket.hasPassword ? "•••••••• (saved — leave blank to keep)" : ""} className={input} /></div>
            <div><label className={lbl}>Pickup location name (as in Shiprocket)</label><input value={c.shiprocket.pickupLocation} onChange={(e) => setC({ ...c, shiprocket: { ...c.shiprocket, pickupLocation: e.target.value } })} placeholder="Primary" className={input} /></div>
            <button type="button" disabled={pending} onClick={() => runTest("shiprocket")} className={btnSecondary}>Test connection</button>
            {test.shiprocket && <p className={`text-xs font-semibold ${test.shiprocket.ok ? "text-emerald-600" : "text-rose-600"}`} role="status">{test.shiprocket.text}</p>}
          </div>
          <div className="rounded-2xl border border-slate-200 dark:border-white/10 p-4 space-y-3">
            <div className="flex items-center justify-between"><p className="font-bold text-slate-900 dark:text-white">Delhivery</p>{savedCourier.delhivery.hasToken && <span className="text-[11px] font-semibold text-emerald-600 inline-flex items-center gap-1"><KeyRound className="w-3 h-3" /> Saved</span>}</div>
            <p className="text-xs text-slate-500">API token from Delhivery One → Settings → API setup. The warehouse must already be registered with Delhivery.</p>
            <div><label className={lbl}>API token</label><input value={c.delhivery.token} onChange={(e) => setC({ ...c, delhivery: { ...c.delhivery, token: e.target.value } })} type="password" autoComplete="new-password" placeholder={savedCourier.delhivery.hasToken ? "•••••••• (saved — leave blank to keep)" : ""} className={input} /></div>
            <div><label className={lbl}>Registered warehouse (pickup) name</label><input value={c.delhivery.pickupName} onChange={(e) => setC({ ...c, delhivery: { ...c.delhivery, pickupName: e.target.value } })} className={input} /></div>
            <Toggle on={c.delhivery.staging} onChange={(v) => setC({ ...c, delhivery: { ...c.delhivery, staging: v } })} label="Use staging (test) account" />
            <div><button type="button" disabled={pending} onClick={() => runTest("delhivery")} className={btnSecondary}>Test connection</button></div>
            {test.delhivery && <p className={`text-xs font-semibold ${test.delhivery.ok ? "text-emerald-600" : "text-rose-600"}`} role="status">{test.delhivery.text}</p>}
          </div>
        </div>
        <p className="text-xs text-slate-500">Credentials are stored on our server and never shown on your website. Ship any other way (India Post, DTDC, own staff) with “Self / other” on the order.</p>
      </Card>

      <div className="flex items-center gap-3 sticky bottom-0 py-3 bg-slate-50/90 dark:bg-slate-950/90 backdrop-blur">
        <button type="submit" disabled={pending} className={btnPrimary}>{pending ? "Saving…" : "Save shipping settings"}</button>
        {msg && <p className={`text-sm font-semibold inline-flex items-center gap-1.5 ${msg.ok ? "text-emerald-600" : "text-rose-600"}`} role="status">{msg.ok && <CheckCircle2 className="w-4 h-4" />}{msg.text}</p>}
      </div>
    </form>
  );
}
