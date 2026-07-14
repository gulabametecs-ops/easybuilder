"use client";

import { useActionState, useState, useRef, useEffect } from "react";
import { subscribe, verifyPayment, type CheckoutState } from "@/lib/actions/checkout";
import { validateCoupon, type CouponResult } from "@/lib/actions/coupons";
import { TIERS, DURATIONS, getDuration, priceFor, perMonth, formatINR, type Tier } from "@/lib/plans";
import { Check, ArrowRight, ExternalLink, Loader2, Tag } from "lucide-react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare global { interface Window { Razorpay: any } }

const ROOT = process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? "localhost:3000";
const initial: CheckoutState = { status: "idle" };
const inputCls = "w-full rounded-lg border border-black/15 dark:border-white/15 bg-black/[0.02] dark:bg-white/5 px-4 py-3 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:border-lime-500";
const label = "block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2";
const card = "rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-white/[0.03]";

type V = { id: string; name: string; status: string };

export function SubscribeFlow({ verticals, defaultVertical, defaultTier, mock, tiers = TIERS }: { verticals: V[]; defaultVertical: string; defaultTier?: string; mock: boolean; tiers?: Tier[] }) {
  const [state, action, pending] = useActionState(subscribe, initial);
  const [finalState, setFinalState] = useState<CheckoutState | null>(null);
  const [paying, setPaying] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const [vertical, setVertical] = useState(defaultVertical || verticals[0]?.id);
  const [tierId, setTierId] = useState(defaultTier || "professional");
  const [durId, setDurId] = useState("1y");
  const [sub, setSub] = useState("");
  const [coupon, setCoupon] = useState("");
  const [couponRes, setCouponRes] = useState<CouponResult | null>(null);
  const [couponBusy, setCouponBusy] = useState(false);

  const view = finalState ?? state;
  const isLive = verticals.find((v) => v.id === vertical)?.status === "live";
  const tier = tiers.find((t) => t.id === tierId) ?? tiers[0];
  const duration = getDuration(durId)!;
  const total = priceFor(tier, duration);
  const discountPct = couponRes?.valid ? couponRes.percentOff : 0;
  const displayTotal = Math.round(total * (1 - discountPct / 100));

  async function applyCoupon() {
    setCouponBusy(true);
    setCouponRes(await validateCoupon(coupon));
    setCouponBusy(false);
  }

  // When the server hands off a Razorpay order, open the checkout popup.
  useEffect(() => {
    if (state.status !== "razorpay" || finalState) return;
    const s = state;
    if (typeof window === "undefined" || !window.Razorpay) {
      setFinalState({ status: "error", message: "Payment library failed to load. Please retry." });
      return;
    }
    setPaying(true);
    const rzp = new window.Razorpay({
      key: s.keyId,
      amount: s.amount,
      currency: "INR",
      order_id: s.rzpOrderId,
      name: "StandardSaaS",
      description: s.planLabel,
      prefill: { name: s.name, email: s.email, contact: s.phone },
      theme: { color: "#84cc16" },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      handler: async (resp: any) => {
        const res = await verifyPayment({
          dbOrderId: s.dbOrderId,
          rzpOrderId: resp.razorpay_order_id,
          rzpPaymentId: resp.razorpay_payment_id,
          signature: resp.razorpay_signature,
        });
        setPaying(false);
        setFinalState(res);
      },
      modal: { ondismiss: () => setPaying(false) },
    });
    rzp.open();
  }, [state, finalState]);

  if (view.status === "success") {
    return (
      <div className="rounded-2xl border border-lime-500/30 bg-lime-500/10 p-8 text-center max-w-lg mx-auto">
        <div className="w-14 h-14 rounded-full bg-lime-500/20 flex items-center justify-center mx-auto mb-4"><Check className="w-7 h-7 text-lime-600 dark:text-lime-400" /></div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Payment successful — you're live! 🎉</h2>
        <p className="text-slate-600 dark:text-slate-300 mt-2">{view.planLabel}</p>
        <div className="mt-6 space-y-3 text-left">
          <a href={view.url} className="flex items-center justify-between rounded-lg bg-black/[0.03] dark:bg-white/5 border border-black/10 dark:border-white/10 px-4 py-3 hover:bg-black/[0.06] dark:hover:bg-white/10"><span className="text-slate-600 dark:text-slate-300 text-sm">Your website</span><span className="text-lime-600 dark:text-lime-400 text-sm flex items-center gap-1">{view.url.replace(/^https?:\/\//, "")} <ExternalLink className="w-3.5 h-3.5" /></span></a>
          <a href={view.adminUrl} className="flex items-center justify-between rounded-lg bg-lime-500 text-white px-4 py-3 font-semibold hover:bg-lime-600"><span>Open your admin panel</span><ArrowRight className="w-4 h-4" /></a>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-4">Log in with <b className="text-slate-700 dark:text-slate-200">{view.email}</b> and your password.</p>
      </div>
    );
  }
  if (view.status === "enquiry") {
    return <div className="rounded-2xl border border-amber-400/40 bg-amber-400/10 p-8 text-center max-w-lg mx-auto"><h2 className="text-2xl font-bold text-slate-900 dark:text-white">Thanks for your interest!</h2><p className="text-amber-700 dark:text-amber-100 mt-2">{view.message}</p></div>;
  }

  return (
    <form ref={formRef} action={action} className="space-y-8">
      <input type="hidden" name="vertical" value={vertical} />
      <input type="hidden" name="tier" value={tierId} />
      <input type="hidden" name="duration" value={durId} />

      <div className="grid sm:grid-cols-2 gap-4">
        <label className="block">
          <span className={label}>Sector</span>
          <select value={vertical} onChange={(e) => setVertical(e.target.value)} className={inputCls}>
            {verticals.map((v) => <option key={v.id} value={v.id}>{v.name}{v.status !== "live" ? " (coming soon)" : ""}</option>)}
          </select>
        </label>
        <div>
          <span className={label}>Billing period</span>
          <div className="flex flex-wrap gap-2">
            {DURATIONS.map((d) => (
              <button type="button" key={d.id} onClick={() => setDurId(d.id)} className={`rounded-lg px-3 py-2 text-xs font-semibold border transition ${durId === d.id ? "border-lime-500 bg-lime-500/10 text-slate-900 dark:text-white" : "border-black/15 dark:border-white/15 text-slate-600 dark:text-slate-300 hover:border-black/30 dark:hover:border-white/30"}`}>
                {d.label}{d.badge && <span className="ml-1 text-lime-600 dark:text-lime-400">· {d.badge}</span>}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {tiers.map((t) => {
          const active = tierId === t.id;
          return (
            <button type="button" key={t.id} onClick={() => setTierId(t.id)} className={`text-left rounded-2xl border p-5 transition ${active ? "border-lime-500 bg-lime-500/[0.06] shadow-md" : "border-black/10 dark:border-white/10 bg-white dark:bg-white/[0.03] hover:border-black/25 dark:hover:border-white/25"}`}>
              <div className="flex items-center justify-between">
                <h3 className="text-slate-900 dark:text-white font-bold">{t.name}</h3>
                {t.popular && <span className="text-[10px] font-bold text-lime-600 dark:text-lime-300 bg-lime-500/10 px-2 py-0.5 rounded-full">POPULAR</span>}
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-xs">{t.tagline}</p>
              <p className="mt-3"><span className="text-2xl font-extrabold text-slate-900 dark:text-white">{formatINR(priceFor(t, duration))}</span><span className="text-slate-500 dark:text-slate-400 text-xs"> / {duration.label.toLowerCase()}</span></p>
              <p className="text-xs text-slate-400">≈ {formatINR(perMonth(t, duration))}/mo</p>
              <ul className="mt-4 space-y-1.5">
                {t.features.map((f) => <li key={f} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300"><Check className="w-3.5 h-3.5 text-lime-500 mt-0.5 shrink-0" /> {f}</li>)}
              </ul>
            </button>
          );
        })}
      </div>

      <div className={`p-6 ${card}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-slate-900 dark:text-white font-bold">Your details</h3>
          <div className="text-right">
            {discountPct > 0 && <span className="text-slate-400 line-through text-sm mr-2">{formatINR(total)}</span>}
            <span className="text-slate-900 dark:text-white font-bold text-lg">{formatINR(displayTotal)}</span>
          </div>
        </div>

        {/* Coupon */}
        <input type="hidden" name="coupon" value={couponRes?.valid ? couponRes.code : ""} />
        <div className="flex items-stretch gap-2 mb-3">
          <div className="flex-1 flex items-center rounded-lg border border-black/15 dark:border-white/15 bg-black/[0.02] dark:bg-white/5 px-3">
            <Tag className="w-4 h-4 text-slate-400" />
            <input value={coupon} onChange={(e) => { setCoupon(e.target.value.toUpperCase()); setCouponRes(null); }} placeholder="Coupon code" className="flex-1 bg-transparent px-2 py-2.5 text-sm text-slate-900 dark:text-white outline-none uppercase" />
          </div>
          <button type="button" onClick={applyCoupon} disabled={couponBusy || !coupon} className="rounded-lg border border-black/15 dark:border-white/15 px-4 text-sm font-semibold text-slate-700 dark:text-white hover:bg-black/5 dark:hover:bg-white/10 disabled:opacity-50">{couponBusy ? "…" : "Apply"}</button>
        </div>
        {couponRes && couponRes.message && <p className={`text-xs mb-3 ${couponRes.valid ? "text-lime-600 dark:text-lime-400" : "text-red-500"}`}>{couponRes.message}</p>}

        <div className="space-y-3">
          <input name="businessName" required placeholder="Business / your name *" className={inputCls} />
          {isLive && (
            <div className="flex items-stretch rounded-lg border border-black/15 dark:border-white/15 bg-black/[0.02] dark:bg-white/5 overflow-hidden focus-within:border-lime-500">
              <input name="subdomain" required value={sub} onChange={(e) => setSub(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))} placeholder="yoursite" className="flex-1 bg-transparent px-4 py-3 text-sm text-slate-900 dark:text-white outline-none" />
              <span className="flex items-center px-3 text-sm text-slate-500 dark:text-slate-400 bg-black/[0.03] dark:bg-white/5">.{ROOT}</span>
            </div>
          )}
          <div className="grid sm:grid-cols-2 gap-3">
            <input name="email" type="email" required placeholder="Email *" className={inputCls} />
            <input name="phone" required placeholder="Phone *" className={inputCls} />
          </div>
          {isLive && <input name="password" type="password" required minLength={6} placeholder="Admin password (min 6) *" className={inputCls} />}
        </div>
        {view.status === "error" && <p className="text-sm text-red-500 mt-3">{view.message}</p>}
        <button disabled={pending || paying} className="mt-5 w-full inline-flex items-center justify-center gap-2 rounded-lg bg-lime-500 text-white font-semibold px-6 py-3 hover:bg-lime-600 disabled:opacity-60">
          {pending || paying ? <><Loader2 className="w-4 h-4 animate-spin" /> {paying ? "Waiting for payment..." : "Processing..."}</> : isLive ? `Pay ${formatINR(displayTotal)} & launch` : "Send enquiry"}
          {!pending && !paying && <ArrowRight className="w-4 h-4" />}
        </button>
        {isLive && mock && <p className="text-xs text-amber-600 dark:text-amber-400/80 mt-2">⚠ Test mode — no real charge (add Razorpay keys to accept live payments).</p>}
        {isLive && !mock && <p className="text-xs text-slate-400 mt-2">🔒 Secure payment via Razorpay.</p>}
      </div>
    </form>
  );
}
