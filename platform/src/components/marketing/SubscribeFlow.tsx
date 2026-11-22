"use client";

import { useActionState, useState, useRef } from "react";
import { subscribe, verifyPayment, type CheckoutState } from "@/lib/actions/checkout";
import { validateCoupon, type CouponResult } from "@/lib/actions/coupons";
import { TIERS, DURATIONS, priceFor, perMonth, formatINR, type Tier, type Duration } from "@/lib/plans";
import { Check, ArrowRight, ExternalLink, Tag, ShieldCheck, Globe, Sparkles } from "lucide-react";
import { mkt } from "@/lib/marketingTheme";
import { useAiDraftItem, clearAiDraft, AI_BLUEPRINT_KEY, AI_PROMPT_KEY } from "@/lib/ai/promptStorage";
import { inferVerticalId } from "@/lib/ai/enrichBlueprint";
import { DESIGNS, isDesignId } from "@/lib/designs";
import { DesignPicker } from "./DesignPicker";
import { LegalConsent } from "./LegalConsent";
import { BrandSpinner } from "@/components/BrandLogo";

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
  durations = DURATIONS,
  fromAi = false,
  defaultDesign,
  defaultReferral = "",
}: {
  verticals: V[];
  defaultVertical: string;
  defaultTier?: string;
  defaultDuration?: string;
  mock: boolean;
  tiers?: Tier[];
  durations?: Duration[];
  fromAi?: boolean;
  defaultDesign?: string;
  defaultReferral?: string;
}) {
  const [finalState, setFinalState] = useState<CheckoutState | null>(null);
  const [paying, setPaying] = useState(false);

  // Opened from the form action (not an effect) once the server returns a Razorpay order.
  function openRazorpay(s: Extract<CheckoutState, { status: "razorpay" }>) {
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
      name: "SitePixl",
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
  }

  const [state, action, pending] = useActionState(async (prev: CheckoutState, fd: FormData) => {
    setFinalState(null);
    const s = await subscribe(prev, fd);
    if (s.status === "razorpay") openRazorpay(s);
    return s;
  }, initial);
  const formRef = useRef<HTMLFormElement>(null);
  const [vertical, setVertical] = useState(defaultVertical || verticals[0]?.id);
  const [design, setDesign] = useState(isDesignId(defaultDesign) ? defaultDesign : "classic");
  const [tierId, setTierId] = useState(defaultTier || "professional");
  const [durId, setDurId] = useState(
    defaultDuration && durations.some((d) => d.id === defaultDuration) ? defaultDuration : "1y",
  );
  const [sub, setSub] = useState("");
  const [coupon, setCoupon] = useState("");
  const [couponRes, setCouponRes] = useState<CouponResult | null>(null);
  const [couponBusy, setCouponBusy] = useState(false);
  const [businessName, setBusinessName] = useState("");

  // AI draft from localStorage ("" until hydrated). Seed the editable fields once per draft,
  // adjusting state during render rather than in an effect.
  const aiBlueprint = useAiDraftItem(AI_BLUEPRINT_KEY) ?? "";
  const aiPrompt = useAiDraftItem(AI_PROMPT_KEY) ?? "";
  const [aiSiteName, setAiSiteName] = useState("");
  const seedKey = `${aiBlueprint}|${aiPrompt}|${defaultVertical}|${fromAi}`;
  const [seededKey, setSeededKey] = useState("");
  if (aiBlueprint && seededKey !== seedKey) {
    setSeededKey(seedKey);
    try {
      const bp = JSON.parse(aiBlueprint) as {
        website?: { name?: string; type?: string; description?: string };
        pages?: unknown;
      };
      const name = bp.website?.name?.trim() ?? "";
      if (name) {
        setAiSiteName(name);
        setBusinessName((prev) => prev || name);
      }
      const inferred = inferVerticalId(bp, aiPrompt);
      if (inferred && (!defaultVertical || defaultVertical === "home-services" || fromAi)) {
        setVertical(inferred);
      }
    } catch {
      /* ignore */
    }
  }

  const view = finalState ?? state;
  const selectedVertical = verticals.find((v) => v.id === vertical);
  const isLive = selectedVertical?.status === "live";
  const tier = tiers.find((t) => t.id === tierId) ?? tiers[0];
  const duration = durations.find((d) => d.id === durId) ?? durations[0];
  const total = priceFor(tier, duration);
  const discountPct = couponRes?.valid ? couponRes.percentOff : 0;
  const displayTotal = Math.round(total * (1 - discountPct / 100));

  async function applyCoupon() {
    setCouponBusy(true);
    setCouponRes(await validateCoupon(coupon));
    setCouponBusy(false);
  }


  if (view.status === "success") {
    clearAiDraft();
    return (
      <div className={`${mkt.card} border-[var(--mkt-accent)]/30 bg-[var(--mkt-accent-soft)] p-8 sm:p-10 text-center max-w-lg mx-auto`}>
        <div className="w-14 h-14 rounded-full bg-[var(--mkt-accent-soft)] flex items-center justify-center mx-auto mb-4">
          <Check className="w-7 h-7 text-[var(--mkt-accent-text)] dark:text-[var(--mkt-accent-text)]" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Payment successful — you&apos;re live!</h2>
        <p className={`${mkt.muted} mt-2`}>{view.planLabel}</p>
        <div className="mt-6 space-y-3 text-left">
          <a
            href={view.url}
            className={`flex items-center justify-between rounded-xl px-4 py-3 ${mkt.cardSoft} hover:border-[var(--mkt-accent)]/30 transition`}
          >
            <span className="text-slate-600 dark:text-slate-300 text-sm">Your website</span>
            <span className="text-[var(--mkt-accent-text)] dark:text-[var(--mkt-accent-text)] text-sm flex items-center gap-1">
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
        <div className={`${mkt.card} border-[var(--mkt-accent)]/40 bg-[var(--mkt-accent-soft)] p-4 sm:p-5 flex items-start gap-3`}>
          <span className="w-10 h-10 rounded-xl bg-[var(--mkt-accent-soft)] flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5 text-[var(--mkt-accent-text)] dark:text-[var(--mkt-accent-text)]" />
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
                className="inline-flex items-center gap-1.5 mt-2 text-sm font-medium text-[var(--mkt-accent-text)] dark:text-[var(--mkt-accent-text)] hover:underline"
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
          <span className="w-10 h-10 rounded-xl bg-[var(--mkt-accent-soft)] flex items-center justify-center shrink-0">
            <Globe className="w-5 h-5 text-[var(--mkt-accent-text)] dark:text-[var(--mkt-accent-text)]" />
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
          <div className="mt-6">
            <DesignPicker
              designs={DESIGNS.map((d) => ({
                id: d.id,
                name: d.name,
                blurb: d.blurb,
                tagline: d.tagline,
                header: d.header,
                hero: d.hero ?? null,
                colors: d.palette({
                  primary: "#b45309",
                  primaryDark: "#92400e",
                  secondary: "#171717",
                  accent: "#b45309",
                  dark: "#171717",
                  light: "#faf9f6",
                  text: "#525252",
                  heading: "#171717",
                }),
              }))}
              value={design}
              onChange={(id) => { if (isDesignId(id)) setDesign(id); }}
              layout="checkout"
              label="Choose a design"
              hint="Same pages — only the look changes. Preview on live demos, or restyle later in admin."
            />
            <p className={`mt-2 text-xs ${mkt.muted}`}>
              See them live on the{" "}
              <a href={`/demos?vertical=${vertical}`} className="text-[var(--mkt-accent-text)] hover:underline">
                demos
              </a>{" "}
              page.
            </p>
          </div>
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
            {durations.map((d) => {
              const active = durId === d.id;
              return (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => setDurId(d.id)}
                  className={`rounded-xl px-3 sm:px-4 py-2.5 text-xs sm:text-sm font-semibold transition-all ${
                    active
                      ? "bg-[var(--mkt-accent-soft)] text-[var(--mkt-accent-text)] dark:text-[var(--mkt-accent-text)] ring-1 ring-[var(--mkt-accent)]/40 shadow-sm"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-black/[0.03] dark:hover:bg-white/5"
                  }`}
                >
                  {d.label}
                  {d.badge && (
                    <span
                      className={`ml-1.5 text-[11px] sm:text-xs ${
                        active ? "text-[var(--mkt-accent-text)] dark:text-[var(--mkt-accent-text)]" : "text-[var(--mkt-accent-text)] dark:text-[var(--mkt-accent)]"
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
                    ? "border-[var(--mkt-accent)] bg-white dark:bg-white/[0.04] shadow-xl shadow-[var(--mkt-accent)]/10 ring-2 ring-[var(--mkt-accent)]/30 md:scale-[1.02] z-10"
                    : t.popular
                      ? "border-[var(--mkt-accent)]/50 bg-white dark:bg-white/[0.03] hover:border-[var(--mkt-accent)] hover:shadow-lg"
                      : `${mkt.card} hover:border-[var(--mkt-accent)]/25 hover:shadow-lg`
                }`}
              >
                {t.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-bold tracking-wider uppercase px-3 py-1 rounded-full bg-[var(--mkt-accent)] text-[var(--mkt-accent-on)]">
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
                      <Check className="w-4 h-4 text-[var(--mkt-accent)] mt-0.5 shrink-0" strokeWidth={2.5} />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <span
                  className={`mt-5 block text-center rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                    active
                      ? "bg-[var(--mkt-accent)] text-[var(--mkt-accent-on)]"
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
            <div className={`flex-1 flex items-center rounded-xl border border-black/12 dark:border-white/12 bg-black/[0.02] dark:bg-white/5 px-3 focus-within:border-[var(--mkt-accent)] focus-within:ring-2 focus-within:ring-[var(--mkt-accent)]/20 transition`}>
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
            <p className={`text-xs mb-4 ${couponRes.valid ? "text-[var(--mkt-accent-text)] dark:text-[var(--mkt-accent-text)]" : "text-red-500"}`}>
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
              <div className="flex items-stretch rounded-xl border border-black/12 dark:border-white/12 bg-black/[0.02] dark:bg-white/5 overflow-hidden focus-within:border-[var(--mkt-accent)] focus-within:ring-2 focus-within:ring-[var(--mkt-accent)]/20 transition">
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
                name="referralCode"
                defaultValue={defaultReferral}
                maxLength={16}
                placeholder="Referral code (optional)"
                className={`${mkt.input} uppercase`}
                autoComplete="off"
              />
            )}
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
                <BrandSpinner className="w-4 h-4" />
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
          <LegalConsent
            className="mt-3 text-center"
            lead={isLive ? "By paying you agree to our" : "By continuing you agree to our"}
          />
          {isLive && (
            <p className="mt-1 text-center text-xs text-[var(--mkt-text-muted)]">
              See our{" "}
              <a href="/refund" target="_blank" rel="noopener" className="underline underline-offset-2 hover:text-[var(--mkt-accent-text)]">
                Refund &amp; Cancellation Policy
              </a>
              .
            </p>
          )}

          {isLive && mock && (
            <p className="text-xs text-amber-600 dark:text-amber-400/80 mt-3">
              Test mode — no real charge. Add Razorpay keys for live payments.
            </p>
          )}
          {isLive && !mock && (
            <p className={`text-xs mt-3 flex items-center justify-center gap-1.5 ${mkt.muted}`}>
              <ShieldCheck className="w-3.5 h-3.5 text-[var(--mkt-accent)]" /> Secure payment via Razorpay
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
                <dd className="text-[var(--mkt-accent-text)] dark:text-[var(--mkt-accent-text)] font-medium text-right break-all">
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
                <span className="text-[var(--mkt-accent-text)] dark:text-[var(--mkt-accent-text)]">Coupon ({discountPct}% off)</span>
                <span className="text-[var(--mkt-accent-text)] dark:text-[var(--mkt-accent-text)]">−{formatINR(total - displayTotal)}</span>
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
                <Check className="w-3.5 h-3.5 text-[var(--mkt-accent)] shrink-0" />
                {t}
              </li>
            ))}
          </ul>
        </aside>
      </section>
    </form>
  );
}
