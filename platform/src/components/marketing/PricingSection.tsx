"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";
import { TIERS, DURATIONS, priceFor, perMonth, formatINR, type Tier } from "@/lib/plans";
import { MarketingSection } from "./MarketingSection";
import { SectionHeader } from "./SectionHeader";
import { mkt } from "@/lib/marketingTheme";

export function PricingSection({ tiers = TIERS }: { tiers?: Tier[] }) {
  const [durId, setDurId] = useState("1y");
  const duration = DURATIONS.find((d) => d.id === durId)!;
  const lifetime = duration.months === null;

  return (
    <MarketingSection id="pricing" variant="default">
      <SectionHeader
        title="Simple pricing, everything included"
        description="Website, admin panel, hosting and SSL in every plan. Pay longer, save more."
      />

      {/* Billing period — one line; swipes on small screens instead of wrapping */}
      <div className="mb-10 flex justify-center">
        <div className="max-w-full overflow-x-auto scrollbar-none">
          <div role="tablist" aria-label="Billing period" className="inline-flex gap-1 rounded-full border border-[var(--mkt-border)] bg-[var(--mkt-surface-muted)] p-1">
            {DURATIONS.map((d) => {
              const active = durId === d.id;
              return (
                <button
                  key={d.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setDurId(d.id)}
                  className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition ${
                    active
                      ? "bg-[var(--mkt-surface)] text-[var(--mkt-text)] shadow-sm ring-1 ring-[var(--mkt-border)]"
                      : "text-[var(--mkt-text-muted)] hover:text-[var(--mkt-text)]"
                  }`}
                >
                  {d.label}
                  {d.discountPct > 0 && (
                    <span className="ml-1.5 rounded-full bg-[var(--mkt-accent-soft)] px-1.5 py-0.5 text-[10px] font-bold text-[var(--mkt-accent-text)]">
                      −{d.discountPct}%
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-5xl items-stretch gap-5 md:grid-cols-3">
        {tiers.map((t) => {
          const total = priceFor(t, duration);
          const monthly = perMonth(t, duration);
          const gross = duration.months ? t.monthlyBase * duration.months : total;
          const href = `/subscribe?tier=${t.id}&duration=${durId}`;

          return (
            <div
              key={t.id}
              className={`relative flex flex-col rounded-2xl border p-6 transition-shadow ${
                t.popular
                  ? "border-[var(--mkt-accent)] bg-[var(--mkt-surface)] shadow-xl shadow-[var(--mkt-accent)]/10 ring-1 ring-[var(--mkt-accent)]"
                  : "border-[var(--mkt-border)] bg-[var(--mkt-surface)] shadow-[var(--mkt-card-shadow)] hover:shadow-md"
              }`}
            >
              {t.popular && (
                <span className="absolute -top-3 left-6 rounded-full bg-[var(--mkt-accent)] px-3 py-1 text-[11px] font-bold text-[var(--mkt-accent-on)]">
                  Most popular
                </span>
              )}

              <h3 className="text-lg font-bold text-[var(--mkt-text)]">{t.name}</h3>
              <p className={`mt-1 text-sm ${mkt.muted}`}>{t.tagline}</p>

              <div className="mt-6">
                {lifetime ? (
                  <>
                    <p className="flex items-baseline gap-1.5">
                      <span className="text-3xl font-bold tracking-tight text-[var(--mkt-text)]">{formatINR(total)}</span>
                    </p>
                    <p className={`mt-1 text-sm ${mkt.muted}`}>One-time payment · yours for life</p>
                  </>
                ) : (
                  <>
                    <p className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold tracking-tight text-[var(--mkt-text)]">{formatINR(monthly)}</span>
                      <span className={`text-sm ${mkt.muted}`}>/month</span>
                    </p>
                    <p className={`mt-1 flex flex-wrap items-center gap-x-2 text-sm ${mkt.muted}`}>
                      {duration.months === 1 ? (
                        <span>Billed monthly</span>
                      ) : (
                        <>
                          <span>
                            {formatINR(total)} billed every {duration.label.toLowerCase()}
                          </span>
                          {gross > total && <span className="line-through opacity-60">{formatINR(gross)}</span>}
                        </>
                      )}
                    </p>
                  </>
                )}
              </div>

              <Link
                href={href}
                className={`mt-6 inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition ${
                  t.popular
                    ? "bg-[var(--mkt-accent)] text-[var(--mkt-accent-on)] hover:bg-[var(--mkt-accent-hover)]"
                    : "border border-[var(--mkt-border-strong)] text-[var(--mkt-text)] hover:border-[var(--mkt-accent)]/60 hover:bg-[var(--mkt-accent-soft)]"
                }`}
              >
                Get {t.name} <ArrowRight className="h-4 w-4" />
              </Link>

              <div className="mt-6 border-t border-[var(--mkt-border)] pt-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-[var(--mkt-text-muted)]">What&apos;s included</p>
                <ul className="mt-3 space-y-2.5">
                  {t.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-[var(--mkt-text-secondary)]">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--mkt-accent)]" strokeWidth={2.5} />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>

      <p className={`mt-8 text-center text-sm ${mkt.muted}`}>
        Prices in INR · GST extra where applicable ·{" "}
        <Link href="/terms" className="font-medium text-[var(--mkt-accent-text)] hover:underline">Terms</Link>
        {" · "}
        <a href="#contact" className="font-medium text-[var(--mkt-accent-text)] hover:underline">Need help choosing?</a>
      </p>
    </MarketingSection>
  );
}
