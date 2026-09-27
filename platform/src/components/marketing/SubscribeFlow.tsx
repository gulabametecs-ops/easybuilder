"use client";

import { useActionState, useState, useRef, useEffect } from "react";
import { subscribe, verifyPayment, type CheckoutState } from "@/lib/actions/checkout";
import { validateCoupon, type CouponResult } from "@/lib/actions/coupons";
import { TIERS, DURATIONS, getDuration, priceFor, perMonth, formatINR, type Tier } from "@/lib/plans";
import { Check, ArrowRight, ExternalLink, Loader2, Tag, ShieldCheck, Globe, Sparkles } from "lucide-react";
import { mkt } from "@/lib/marketingTheme";
import { readAiDraft, clearAiDraft } from "@/lib/ai/promptStorage";
import { inferVerticalId } from "@/lib/ai/enrichBlueprint";
import { DESIGNS, isDesignId } from "@/lib/designs";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare global { interface Window { Razorpay: any } }

const ROOT = process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? "localhost:3000";
const initial: CheckoutState = { status: "idle" };
const label = "block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2";

type V = { id: string; name: string; status: string };

export function SubscribeFlow({
  verticals,
  defaultVertical,
  defaultTier,
  defaultDuration,
  mock,
  tiers = TIERS,
  fromAi = false,
  defaultDesign,
}: {
  verticals: V[];
  defaultVertical: string;
  defaultTier?: string;
  defaultDuration?: string;
  mock: boolean;
  tiers?: Tier[];
  fromAi?: boolean;
  defaultDesign?: string;
}) {
  const [state, action, pending] = useActionState(subscribe, initial);
  const [finalState, setFinalState] = useState<CheckoutState | null>(null);
  const [paying, setPaying] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const [vertical, setVertical] = useState(defaultVertical || verticals[0]?.id);
  const [design, setDesign] = useState(isDesignId(defaultDesign) ? defaultDesign : "classic");
  const [tierId, setTierId] = useState(defaultTier || "professional");
  const [durId, setDurId] = useState(
    defaultDuration && DURATIONS.some((d) => d.id === defaultDuration) ? defaultDuration : "1y",
  );
  const [sub, setSub] = useState("");
  const [coupon, setCoupon] = useState("");
  const [couponRes, setCouponRes] = useState<CouponResult | null>(null);
  const [couponBusy, setCouponBusy] = useState(false);
  const [aiBlueprint, setAiBlueprint] = useState("");
  const [aiSiteName, setAiSiteName] = useState("");
  const [businessName, setBusinessName] = useState("");

  useEffect(() => {
    const draft = readAiDraft();
    if (!draft?.blueprint) return;
    setAiBlueprint(draft.blueprint);
    try {
      const bp = JSON.parse(draft.blueprint) as {
        website?: { name?: string; type?: string; description?: string };
        pages?: unknown;
      };
      const name = bp.website?.name?.trim() ?? "";
      if (name) {
        setAiSiteName(name);
        setBusinessName((prev) => prev || name);
      }
      const inferred = inferVerticalId(bp, draft.prompt);
      if (inferred && (!defaultVertical || defaultVertical === "home-services" || fromAi)) {
        setVertical(inferred);
      }
    } catch {
      /* ignore */
    }
  }, [defaultVertical, fromAi]);

  const view = finalState ?? state;
  const selectedVertical = verticals.find((v) => v.id === vertical);
  const isLive = selectedVertical?.status === "live";
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
    clearAiDraft();
    return (
      <div className={`${mkt.card} border-lime-500/30 bg-lime-500/10 p-8 sm:p-10 text-center max-w-lg mx-auto`}>
        <div className="w-14 h-14 rounded-full bg-lime-500/20 flex items-center justify-center mx-auto mb-4">
          <Check className="w-7 h-7 text-lime-600 dark:text-lime-400" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Payment successful — you&apos;re live!</h2>
        <p className={`${mkt.muted} mt-2`}>{view.planLabel}</p>
        <div className="mt-6 space-y-3 text-left">
          <a
            href={view.url}
            className={`flex items-center justify-between rounded-xl px-4 py-3 ${mkt.cardSoft} hover:border-lime-500/30 transition`}
          >
            <span className="text-slate-600 dark:text-slate-300 text-sm">Your website</span>
            <span className="text-lime-600 dark:text-lime-400 text-sm flex items-center gap-1">
              {view.url.replace(/^https?:\/\//, "")} <ExternalLink className="w-3.5 h-3.5" />
            </span>
          </a>
          <a href={view.adminUrl} className={`flex items-center justify-between ${mkt.btnPrimary} px-4 py-3`}>
            <span>Open your admin panel</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
        <p className={`text-xs ${mkt.muted} mt-4`}>
          Log in with <b className="text-slate-700 dark:text-slate-200">{view.email}</b> and your password.
        </p>
      </div>
    );
  }

  if (view.status === "enquiry") {
    return (
      <div className="rounded-2xl border border-amber-400/40 bg-amber-400/10 p-8 text-center max-w-lg mx-auto">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Thanks for your interest!</h2>
        <p className="text-amber-700 dark:text-amber-100 mt-2">{view.message}</p>
      </div>
    );
  }

  return (
    <form ref={formRef} action={action} className="space-y-10">
      <input type="hidden" name="vertical" value={vertical} />
      <input type="hidden" name="tier" value={tierId} />
      <input type="hidden" name="duration" value={durId} />
      <input type="hidden" name="aiBlueprint" value={aiBlueprint} />
      <input type="hidden" name="design" value={aiBlueprint ? "" : design} />

      {aiSiteName && (
        <div className={`${mkt.card} border-lime-500/40 bg-lime-500/10 p-4 sm:p-5 flex items-start gap-3`}>
          <span className="w-10 h-10 rounded-xl bg-lime-500/20 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5 text-lime-600 dark:text-lime-400" />
          </span>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-slate-900 dark:text-white">
              {fromAi ? "Custom AI website selected" : "AI website plan ready"}
            </p>
            <p className={`text-sm mt-0.5 ${mkt.muted}`}>
              <strong className="text-slate-800 dark:text-slate-200">{aiSiteName}</strong>{" "}
              {fromAi
                ? "— your exact AI design will go live on your domain after payment."
                : "will be built automatically after payment."}
            </p>
            {fromAi && (
              <a
                href="/ai-preview"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 mt-2 text-sm font-medium text-lime-600 dark:text-lime-400 hover:underline"
              >
                <ExternalLink className="w-3.5 h-3.5" /> Preview again
              </a>
            )}
          </div>
        </div>
      )}

      {/* Sector */}
      <section className={`${mkt.card} p-5 sm:p-6`}>
        <div className="flex items-start gap-3 mb-4">
          <span className="w-10 h-10 rounded-xl bg-lime-500/15 flex items-center justify-center shrink-0">
            <Globe className="w-5 h-5 text-lime-600 dark:text-lime-400" />
          </span>
          <div>
            <h2 className="font-bold text-slate-900 dark:text-white">1. Choose your sector</h2>
            <p className={`text-sm mt-0.5 ${mkt.muted}`}>Your website template and default content depend on this.</p>
          </div>
        </div>
        <label className="block max-w-md">
          <span className={label}>Sector</span>
          <select value={vertical} onChange={(e) => setVertical(e.target.value)} className={mkt.input}>
            {verticals.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name}{v.status !== "live" ? " (coming soon)" : ""}
              </option>
            ))}
          </select>
        </label>
        {!isLive && selectedVertical && (
          <p className="mt-3 text-sm text-amber-700 dark:text-amber-300">
            {selectedVertical.name} is coming soon — submit an enquiry and we&apos;ll notify you when it launches.
          </p>
        )}
        {isLive && !aiBlueprint && (
          <fieldset className="mt-6">
            <legend className={label}>Design style</legend>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
              {DESIGNS.map((d) => (
                <label
                  key={d.id}
                  className={`cursor-pointer rounded-xl border p-3 transition ${
                    design === d.id
                      ? "border-lime-500 bg-lime-500/10 ring-1 ring-lime-500"
                      : "border-[var(--mkt-border)] hover:border-lime-500/50"
                  }`}
                >
                  <input type="radio" name="designPick" value={d.id} checked={design === d.id} onChange={() => setDesign(d.id)} className="sr-only" />
                  <span className="block text-sm font-semibold text-slate-900 dark:text-white">{d.name}</span>
                  <span className={`block text-[11px] leading-snug mt-0.5 ${mkt.muted}`}>{d.tagline}</span>
                </label>
              ))}
            </div>
            <p className={`mt-2 text-xs ${mkt.muted}`}>
              Preview every style on the <a href={`/demos?vertical=${vertical}`} className="text-lime-600 dark:text-lime-400 hover:underline">live demos</a> page. You can change colours, fonts and layouts anytime from your admin.
            </p>
          </fieldset>
        )}
      </section>

      {/* Duration */}
      <section>
        <div className="text-center mb-6">
          <h2 className="font-bold text-slate-900 dark:text-white text-lg">2. Billing period</h2>
          <p className={`text-sm mt-1 ${mkt.muted}`}>Longer plans cost less per month.</p>
        </div>
        <div className="flex justify-center">
          <div className={`inline-flex flex-wrap justify-center gap-2 p-1.5 rounded-2xl ${mkt.card}`}>
            {DURATIONS.map((d) => {
              const active = durId === d.id;
              return (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => setDurId(d.id)}
                  className={`rounded-xl px-3 sm:px-4 py-2.5 text-xs sm:text-sm font-semibold transition-all ${
                    active
                      ? "bg-lime-500/15 text-lime-800 dark:text-lime-300 ring-1 ring-lime-500/40 shadow-sm"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-black/[0.03] dark:hover:bg-white/5"
                  }`}
                >
                  {d.label}
                  {d.badge && (
                    <span
                      className={`ml-1.5 text-[11px] sm:text-xs ${
                        active ? "text-lime-700 dark:text-lime-400" : "text-lime-600 dark:text-lime-500"
                      }`}
                    >
                      {d.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Plans */}
      <section>
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="font-bold text-slate-900 dark:text-white text-lg">3. Pick a plan</h2>
          <p className={`text-sm mt-1 ${mkt.muted}`}>Website + admin panel included on every tier.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-5 lg:gap-6 items-stretch">
          {tiers.map((t) => {
            const active = tierId === t.id;
            const planTotal = priceFor(t, duration);
            const monthly = perMonth(t, duration);
            return (
              <button
                type="button"
                key={t.id}
                onClick={() => setTierId(t.id)}
                className={`relative flex flex-col text-left rounded-2xl p-6 sm:p-7 border transition-all duration-300 ${
                  active
                    ? "border-lime-500 bg-white dark:bg-white/[0.04] shadow-xl shadow-lime-500/10 ring-2 ring-lime-500/30 md:scale-[1.02] z-10"
                    : t.popular
                      ? "border-lime-500/50 bg-white dark:bg-white/[0.03] hover:border-lime-500 hover:shadow-lg"
                      : `${mkt.card} hover:border-lime-500/25 hover:shadow-lg`
                }`}
              >
                {t.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-bold tracking-wider uppercase px-3 py-1 rounded-full bg-lime-500 text-slate-950">
                    Most popular
                  </span>
                )}
                <div>
                  <h3 className="text-slate-900 dark:text-white font-bold text-xl">{t.name}</h3>
                  <p className={`text-sm mt-1 ${mkt.muted}`}>{t.tagline}</p>
                </div>
                <div className="mt-5 pb-5 border-b border-black/5 dark:border-white/10">
                  <p className="flex items-baseline flex-wrap gap-x-1">
                    <span className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
                      {formatINR(planTotal)}
                    </span>
                    <span className={`text-sm ${mkt.muted}`}>/ {duration.label.toLowerCase()}</span>
                  </p>
                  <p className="text-sm text-slate-400 mt-1.5">~ {formatINR(monthly)} per month</p>
                </div>
                <ul className="mt-5 space-y-2.5 flex-1">
                  {t.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-slate-600 dark:text-slate-300">
                      <Check className="w-4 h-4 text-lime-500 mt-0.5 shrink-0" strokeWidth={2.5} />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <span
                  className={`mt-5 block text-center rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                    active
                      ? "bg-lime-500 text-slate-950"
                      : "border border-black/15 dark:border-white/20 text-slate-700 dark:text-slate-200"
                  }`}
                >
                  {active ? "Selected" : `Choose ${t.name}`}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Checkout */}
      <section className="grid lg:grid-cols-5 gap-6 lg:gap-8 items-start">
        <div className={`lg:col-span-3 ${mkt.card} p-6 sm:p-7`}>
          <h2 className="font-bold text-slate-900 dark:text-white text-lg mb-1">4. Your details</h2>
          <p className={`text-sm mb-5 ${mkt.muted}`}>
            {isLive ? "We provision your site instantly after payment." : "We&apos;ll contact you about early access."}
          </p>

          <input type="hidden" name="coupon" value={couponRes?.valid ? couponRes.code : ""} />
          <div className="flex items-stretch gap-2 mb-4">
            <div className={`flex-1 flex items-center rounded-xl border border-black/12 dark:border-white/12 bg-black/[0.02] dark:bg-white/5 px-3 focus-within:border-lime-500 focus-within:ring-2 focus-within:ring-lime-500/20 transition`}>
              <Tag className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                value={coupon}
                onChange={(e) => {
                  setCoupon(e.target.value.toUpperCase());
                  setCouponRes(null);
                }}
                placeholder="Coupon code"
                className="flex-1 bg-transparent px-2 py-3 text-sm text-slate-900 dark:text-white outline-none uppercase"
              />
            </div>
            <button
              type="button"
              onClick={applyCoupon}
              disabled={couponBusy || !coupon}
              className={`${mkt.btnSecondary} px-4 text-sm font-semibold disabled:opacity-50`}
            >
              {couponBusy ? "…" : "Apply"}
            </button>
          </div>
          {couponRes?.message && (
            <p className={`text-xs mb-4 ${couponRes.valid ? "text-lime-600 dark:text-lime-400" : "text-red-500"}`}>
              {couponRes.message}
            </p>
          )}

          <div className="space-y-3">
            <input
              name="businessName"
              required
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="Business / your name *"
              className={mkt.input}
            />
            {isLive && (
              <div className="flex items-stretch rounded-xl border border-black/12 dark:border-white/12 bg-black/[0.02] dark:bg-white/5 overflow-hidden focus-within:border-lime-500 focus-within:ring-2 focus-within:ring-lime-500/20 transition">
                <input
                  name="subdomain"
                  required
                  value={sub}
                  onChange={(e) => setSub(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                  placeholder="yoursite"
                  className="flex-1 bg-transparent px-4 py-3 text-sm text-slate-900 dark:text-white outline-none"
                />
                <span className="flex items-center px-3 text-sm text-slate-500 dark:text-slate-400 border-l border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.03]">
                  .{ROOT}
                </span>
              </div>
            )}
            <div className="grid sm:grid-cols-2 gap-3">
              <input name="email" type="email" required placeholder="Email *" className={mkt.input} autoComplete="email" />
              <input name="phone" required placeholder="Phone *" className={mkt.input} autoComplete="tel" />
            </div>
            {isLive && (
              <input
                name="password"
                type="password"
                required
                minLength={6}
                placeholder="Admin password (min 6) *"
                className={mkt.input}
                autoComplete="new-password"
              />
            )}
          </div>

          {view.status === "error" && <p className="text-sm text-red-500 mt-4">{view.message}</p>}

          <button
            type="submit"
            disabled={pending || paying}
            className={`mt-6 w-full ${mkt.btnPrimary} py-3.5 text-sm disabled:opacity-60`}
          >
            {pending || paying ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {paying ? "Waiting for payment…" : "Processing…"}
              </>
            ) : isLive ? (
              <>
                Pay {formatINR(displayTotal)} &amp; launch
                <ArrowRight className="w-4 h-4" />
              </>
            ) : (
              <>
                Send enquiry
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          {isLive && mock && (
            <p className="text-xs text-amber-600 dark:text-amber-400/80 mt-3">
              Test mode — no real charge. Add Razorpay keys for live payments.
            </p>
          )}
          {isLive && !mock && (
            <p className={`text-xs mt-3 flex items-center justify-center gap-1.5 ${mkt.muted}`}>
              <ShieldCheck className="w-3.5 h-3.5 text-lime-500" /> Secure payment via Razorpay
            </p>
          )}
        </div>

        {/* Order summary */}
        <aside className={`lg:col-span-2 lg:sticky lg:top-24 ${mkt.cardSoft} p-6`}>
          <h3 className="font-bold text-slate-900 dark:text-white">Order summary</h3>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between gap-3">
              <dt className={mkt.muted}>Sector</dt>
              <dd className="text-slate-900 dark:text-white font-medium text-right">{selectedVertical?.name}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className={mkt.muted}>Plan</dt>
              <dd className="text-slate-900 dark:text-white font-medium">{tier.name}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className={mkt.muted}>Duration</dt>
              <dd className="text-slate-900 dark:text-white font-medium">{duration.label}</dd>
            </div>
            {isLive && sub && (
              <div className="flex justify-between gap-3">
                <dt className={mkt.muted}>Subdomain</dt>
                <dd className="text-lime-600 dark:text-lime-400 font-medium text-right break-all">
                  {sub}.{ROOT}
                </dd>
              </div>
            )}
          </dl>
          <div className="mt-5 pt-5 border-t border-black/10 dark:border-white/10">
            {discountPct > 0 && (
              <div className="flex justify-between text-sm mb-2">
                <span className={mkt.muted}>Subtotal</span>
                <span className="text-slate-400 line-through">{formatINR(total)}</span>
              </div>
            )}
            {discountPct > 0 && (
              <div className="flex justify-between text-sm mb-2">
                <span className="text-lime-600 dark:text-lime-400">Coupon ({discountPct}% off)</span>
                <span className="text-lime-600 dark:text-lime-400">−{formatINR(total - displayTotal)}</span>
              </div>
            )}
            <div className="flex justify-between items-baseline">
              <span className="font-semibold text-slate-900 dark:text-white">Total</span>
              <span className="text-2xl font-bold text-slate-900 dark:text-white">{formatINR(displayTotal)}</span>
            </div>
            <p className={`text-xs mt-1 ${mkt.muted}`}>~ {formatINR(perMonth(tier, duration))} / month</p>
          </div>
          <ul className="mt-5 space-y-2">
            {["Instant provisioning", "Free subdomain", "Full admin panel", "Cancel anytime"].map((t) => (
              <li key={t} className={`flex items-center gap-2 text-xs ${mkt.muted}`}>
                <Check className="w-3.5 h-3.5 text-lime-500 shrink-0" />
                {t}
              </li>
            ))}
          </ul>
        </aside>
      </section>
    </form>
  );
}
