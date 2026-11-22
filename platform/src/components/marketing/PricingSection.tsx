"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Check, ArrowRight, Minus, HardDrive, Rocket, Briefcase, Crown, FileUp, FileText, Wrench, Image as ImageIcon,
  Users, Sparkles, ShieldCheck, Receipt, Lock, ChevronDown, type LucideIcon,
} from "lucide-react";
import { TIERS, DURATIONS, LIMIT_KEYS, LIMIT_LABELS, priceFor, perMonth, formatINR, formatLimit, type Tier, type Duration } from "@/lib/plans";
import type { PlanLimits } from "@/lib/plans";
import { MarketingSection } from "./MarketingSection";
import { SectionHeader } from "./SectionHeader";
import { mkt } from "@/lib/marketingTheme";

// Limits shown on each card (the compare table shows all of them).
const CARD_LIMITS = ["storageMb", "pages", "services", "gallery", "users"] as const;

const LIMIT_ICONS: Record<keyof PlanLimits, LucideIcon> = {
  storageMb: HardDrive,
  uploadMb: FileUp,
  pages: FileText,
  services: Wrench,
  gallery: ImageIcon,
  users: Users,
  aiEdits: Sparkles,
};

const TIER_ICONS: Record<string, LucideIcon> = { starter: Rocket, professional: Briefcase, premium: Crown };

// Feature rows for the compare table — keep in sync with what the product enforces.
const COMPARE_FEATURES: { label: string; has: (t: Tier) => boolean }[] = [
  { label: "Ready website + full admin panel", has: () => true },
  { label: "Free subdomain with SSL", has: () => true },
  { label: "Unlimited leads, enquiries & bookings", has: () => true },
  { label: "Theme, colours, fonts & SEO tools", has: () => true },
  { label: "No platform ads or branding on your site", has: () => true },
  { label: "Connect your own custom domain", has: (t) => t.customDomain },
  { label: "Priority support", has: (t) => t.id !== "starter" },
  { label: "Dedicated account manager", has: (t) => t.id === "premium" },
  { label: "24×7 support", has: (t) => t.id === "premium" },
];

function Yes() {
  return (
    <span className="mx-auto flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400" aria-label="Included">
      <Check className="h-3 w-3" strokeWidth={3} />
    </span>
  );
}
function No() {
  return <Minus className="mx-auto h-4 w-4 text-[var(--mkt-text-muted)] opacity-40" aria-label="Not included" />;
}

export function PricingSection({ tiers = TIERS, durations = DURATIONS }: { tiers?: Tier[]; durations?: Duration[] }) {
  const [durId, setDurId] = useState("1y");
  const duration = durations.find((d) => d.id === durId) ?? durations[0];
  const lifetime = duration.months === null;
  const href = (t: Tier) => `/subscribe?tier=${t.id}&duration=${durId}`;

  return (
    <MarketingSection id="pricing" variant="default">
      <SectionHeader
        title="Simple pricing, everything included"
        description="Website, admin panel, hosting and SSL in every plan. Pay longer, save more."
      />

      {/* Billing period — one line; swipes on small screens instead of wrapping */}
      <div className="mb-12 flex justify-center">
        <div className="max-w-full overflow-x-auto scrollbar-none">
          <div role="tablist" aria-label="Billing period" className="inline-flex gap-1 rounded-full border border-[var(--mkt-border)] bg-[var(--mkt-surface)] p-1 shadow-sm">
            {durations.map((d) => {
              const active = durId === d.id;
              return (
                <button
                  key={d.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setDurId(d.id)}
                  className={`inline-flex items-center whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition ${
                    active ? "mkt-brand-grad shadow-md" : "text-[var(--mkt-text-muted)] hover:bg-[var(--mkt-surface-muted)] hover:text-[var(--mkt-text)]"
                  }`}
                >
                  {d.label}
                  {d.discountPct > 0 && (
                    <span
                      className={`ml-1.5 rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                        active ? "bg-white/20 text-white" : "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                      }`}
                    >
                      −{d.discountPct}%
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-5xl items-stretch gap-6 md:grid-cols-3 md:gap-5">
        {tiers.map((t) => {
          const total = priceFor(t, duration);
          const monthly = perMonth(t, duration);
          const gross = duration.months ? t.monthlyBase * duration.months : total;
          const saved = gross - total;
          const Icon = TIER_ICONS[t.id] ?? Rocket;

          const card = (
            <div className="relative flex h-full flex-col rounded-[15px] bg-[var(--mkt-surface)] p-5 sm:p-6">
              {t.popular && (
                <span className="mkt-brand-grad absolute -top-3.5 left-1/2 inline-flex -translate-x-1/2 items-center gap-1 whitespace-nowrap rounded-full px-3 py-1 text-[11px] font-bold shadow-md">
                  <Sparkles className="h-3 w-3" /> Most popular
                </span>
              )}

              <div className="flex items-center gap-3">
                <span
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                    t.popular ? "mkt-brand-grad shadow-md" : "bg-[var(--mkt-surface-muted)] text-[var(--mkt-text)] ring-1 ring-[var(--mkt-border)]"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="text-lg font-bold leading-tight text-[var(--mkt-text)]">{t.name}</h3>
                  <p className={`text-xs ${mkt.muted}`}>{t.tagline}</p>
                </div>
              </div>

              <div className="mt-5">
                {lifetime ? (
                  <>
                    <p className="text-4xl font-extrabold tracking-tight text-[var(--mkt-text)]">{formatINR(total)}</p>
                    <p className={`mt-1 text-sm ${mkt.muted}`}>One-time payment · yours for life</p>
                  </>
                ) : (
                  <>
                    <p className="flex items-baseline gap-1">
                      <span className="text-4xl font-extrabold tracking-tight text-[var(--mkt-text)] tabular-nums">{formatINR(monthly)}</span>
                      <span className={`text-sm ${mkt.muted}`}>/month</span>
                    </p>
                    <p className={`mt-1 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[12.5px] ${mkt.muted}`}>
                      {duration.months === 1 ? (
                        "Billed monthly"
                      ) : (
                        <>
                          <span>
                            {formatINR(total)} / {duration.label.toLowerCase()}
                          </span>
                          {gross > total && <span className="line-through opacity-60">{formatINR(gross)}</span>}
                        </>
                      )}
                      {saved > 0 && (
                        <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
                          Save {formatINR(saved)}
                        </span>
                      )}
                    </p>
                  </>
                )}
              </div>

              <Link
                href={href(t)}
                className={`group mt-5 inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition ${
                  t.popular
                    ? "mkt-brand-grad shadow-[0_8px_24px_-8px_rgba(47,91,255,0.6)] hover:brightness-110"
                    : "border border-[var(--mkt-border-strong)] text-[var(--mkt-text)] hover:border-[var(--mkt-brand)] hover:text-[var(--mkt-brand)]"
                }`}
              >
                Get {t.name} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>

              <ul className="mt-5 divide-y divide-[var(--mkt-border)] rounded-xl border border-[var(--mkt-border)]">
                {CARD_LIMITS.map((k) => {
                  const LIcon = LIMIT_ICONS[k];
                  return (
                    <li key={k} className="flex items-center gap-2.5 px-3 py-1.5 text-[13px]">
                      <LIcon className="h-4 w-4 shrink-0 text-[var(--mkt-text-muted)]" />
                      <span className={mkt.muted}>{LIMIT_LABELS[k]}</span>
                      <span className="ml-auto font-bold tabular-nums text-[var(--mkt-text)]">{formatLimit(k, t.limits[k])}</span>
                    </li>
                  );
                })}
              </ul>

              {/* Folded by default so the three cards stay short; opens per card. */}
              <details className="group/inc mt-4">
                <summary className="flex cursor-pointer list-none items-center justify-between rounded-lg px-1 py-1.5 text-[12px] font-semibold uppercase tracking-wider text-[var(--mkt-text-muted)] transition hover:text-[var(--mkt-text)] [&::-webkit-details-marker]:hidden">
                  <span>
                    What&apos;s included <span className="ml-1 rounded-full bg-[var(--mkt-surface-muted)] px-1.5 py-0.5 text-[10px] normal-case tracking-normal">{t.features.length}</span>
                  </span>
                  <ChevronDown className="h-4 w-4 transition-transform group-open/inc:rotate-180" />
                </summary>
                <ul className="mt-2 space-y-2 px-1">
                  {t.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-[var(--mkt-text-secondary)]">
                      <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                        <Check className="h-2.5 w-2.5" strokeWidth={3.5} />
                      </span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </details>
            </div>
          );

          // Popular plan: gradient border + glow, lifted on desktop.
          return t.popular ? (
            <div key={t.id} className="mkt-brand-grad relative rounded-2xl p-px shadow-[0_24px_60px_-24px_rgba(47,91,255,0.55)] md:-translate-y-3">
              {card}
            </div>
          ) : (
            <div key={t.id} className="rounded-2xl border border-[var(--mkt-border)] shadow-[var(--mkt-card-shadow)] transition hover:-translate-y-0.5 hover:shadow-lg">
              {card}
            </div>
          );
        })}
      </div>

      <p className={`mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[13px] ${mkt.muted}`}>
        <span className="inline-flex items-center gap-1.5"><Lock className="h-3.5 w-3.5 text-emerald-600" /> Secure payments by Razorpay</span>
        <span className="inline-flex items-center gap-1.5"><Receipt className="h-3.5 w-3.5 text-emerald-600" /> GST invoice</span>
        <span className="inline-flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 text-emerald-600" /> Hosting & SSL included</span>
      </p>

      {/* Compare plans — folded by default (the cards already carry the key limits);
          scrolls sideways on small screens, first column stays put */}
      <details className="group mx-auto mt-10 max-w-5xl">
        <summary className="mx-auto flex w-fit cursor-pointer list-none items-center gap-2 rounded-full border border-[var(--mkt-border-strong)] bg-[var(--mkt-surface)] px-5 py-2.5 text-sm font-semibold text-[var(--mkt-text)] shadow-sm transition hover:border-[var(--mkt-brand)] hover:text-[var(--mkt-brand)] [&::-webkit-details-marker]:hidden">
          <span className="group-open:hidden">Compare all features</span>
          <span className="hidden group-open:inline">Hide comparison</span>
          <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
        </summary>
        <div className="mt-8 text-center">
          <h3 className="text-2xl font-bold tracking-tight text-[var(--mkt-text)]">Compare plans</h3>
          <p className={`mt-1 text-sm ${mkt.muted}`}>Every limit and feature, side by side · prices for {duration.label.toLowerCase()} billing</p>
        </div>
        <div className={`mt-6 overflow-x-auto ${mkt.card} p-0`}>
          <table className="w-full min-w-[620px] border-collapse text-sm">
            <thead>
              <tr>
                <th scope="col" className="sticky left-0 z-10 w-[38%] bg-[var(--mkt-surface)] px-5 py-5 text-left align-bottom">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[var(--mkt-text-muted)]">Plans</span>
                </th>
                {tiers.map((t) => {
                  const Icon = TIER_ICONS[t.id] ?? Rocket;
                  return (
                    <th
                      key={t.id}
                      scope="col"
                      className={`px-4 pb-5 pt-5 text-center align-bottom font-normal ${t.popular ? "rounded-t-xl bg-[var(--mkt-brand)]/[0.06]" : ""}`}
                    >
                      {t.popular && <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-[var(--mkt-brand)]">Most popular</span>}
                      <span className="inline-flex items-center gap-1.5 font-bold text-[var(--mkt-text)]">
                        <Icon className="h-4 w-4" /> {t.name}
                      </span>
                      <span className="mt-1 block text-xs tabular-nums text-[var(--mkt-text-muted)]">
                        {lifetime ? formatINR(priceFor(t, duration)) : `${formatINR(perMonth(t, duration))}/mo`}
                      </span>
                      <Link
                        href={href(t)}
                        className={`mt-3 inline-flex items-center justify-center rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                          t.popular ? "mkt-brand-grad hover:brightness-110" : "border border-[var(--mkt-border-strong)] text-[var(--mkt-text)] hover:border-[var(--mkt-brand)]"
                        }`}
                      >
                        Choose
                      </Link>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              <GroupRow label="Limits" tiers={tiers} />
              {LIMIT_KEYS.map((k) => {
                const LIcon = LIMIT_ICONS[k];
                return (
                  <tr key={k} className="group border-t border-[var(--mkt-border)]">
                    <th scope="row" className="sticky left-0 z-10 bg-[var(--mkt-surface)] px-5 py-3 text-left font-medium text-[var(--mkt-text-secondary)] group-hover:bg-[var(--mkt-surface-muted)]">
                      <span className="inline-flex items-center gap-2.5">
                        <LIcon className="h-4 w-4 text-[var(--mkt-text-muted)]" /> {LIMIT_LABELS[k]}
                      </span>
                    </th>
                    {tiers.map((t) => (
                      <td
                        key={t.id}
                        className={`px-4 py-3 text-center font-semibold tabular-nums text-[var(--mkt-text)] group-hover:bg-[var(--mkt-surface-muted)] ${t.popular ? "bg-[var(--mkt-brand)]/[0.06]" : ""}`}
                      >
                        {formatLimit(k, t.limits[k])}
                      </td>
                    ))}
                  </tr>
                );
              })}
              <GroupRow label="Features" tiers={tiers} />
              {COMPARE_FEATURES.map((f, i) => (
                <tr key={f.label} className="group border-t border-[var(--mkt-border)]">
                  <th scope="row" className="sticky left-0 z-10 bg-[var(--mkt-surface)] px-5 py-3 text-left font-medium text-[var(--mkt-text-secondary)] group-hover:bg-[var(--mkt-surface-muted)]">
                    {f.label}
                  </th>
                  {tiers.map((t) => (
                    <td
                      key={t.id}
                      className={`px-4 py-3 text-center group-hover:bg-[var(--mkt-surface-muted)] ${
                        t.popular ? `bg-[var(--mkt-brand)]/[0.06] ${i === COMPARE_FEATURES.length - 1 ? "rounded-b-xl" : ""}` : ""
                      }`}
                    >
                      {f.has(t) ? <Yes /> : <No />}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-5 flex gap-3.5 rounded-2xl border border-[var(--mkt-border)] bg-[var(--mkt-surface-muted)] p-4 text-sm sm:p-5">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--mkt-surface)] text-[var(--mkt-brand)] ring-1 ring-[var(--mkt-border)]">
            <HardDrive className="h-4 w-4" />
          </span>
          <p className={`leading-relaxed ${mkt.muted}`}>
            <span className="font-semibold text-[var(--mkt-text)]">What counts as storage?</span>{" "}Only the images, PDFs and documents you
            upload (each file up to your plan&apos;s max file size). Your website itself, leads, bookings and text are free. Custom pages are
            on top of the ready-made pages your site comes with. Going over after a downgrade never deletes anything — you just can&apos;t
            add more until you upgrade or free up space.
          </p>
        </div>
      </details>

      <p className={`mt-8 text-center text-sm ${mkt.muted}`}>
        Prices in INR · GST extra where applicable ·{" "}
        <Link href="/terms" className="font-medium text-[var(--mkt-accent-text)] hover:underline">Terms</Link>
        {" · "}
        <a href="#contact" className="font-medium text-[var(--mkt-accent-text)] hover:underline">Need help choosing?</a>
      </p>
    </MarketingSection>
  );
}

function GroupRow({ label, tiers }: { label: string; tiers: Tier[] }) {
  return (
    <tr className="border-t border-[var(--mkt-border)]">
      <th scope="rowgroup" className="sticky left-0 z-10 bg-[var(--mkt-surface-muted)] px-5 py-2 text-left text-[11px] font-bold uppercase tracking-wider text-[var(--mkt-text-muted)]">
        {label}
      </th>
      {tiers.map((t) => (
        <td key={t.id} className={`bg-[var(--mkt-surface-muted)] ${t.popular ? "bg-[var(--mkt-brand)]/[0.08]" : ""}`} />
      ))}
    </tr>
  );
}
