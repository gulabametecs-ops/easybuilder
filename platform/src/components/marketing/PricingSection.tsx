"use client";

import { useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { TIERS, DURATIONS, priceFor, perMonth, formatINR, type Tier } from "@/lib/plans";
import { MarketingSection } from "./MarketingSection";
import { SectionHeader } from "./SectionHeader";
import { mkt } from "@/lib/marketingTheme";

export function PricingSection({ tiers = TIERS }: { tiers?: Tier[] }) {
  const [durId, setDurId] = useState("1y");
  const duration = DURATIONS.find((d) => d.id === durId)!;

  return (
    <MarketingSection id="pricing" variant="default">
      <SectionHeader
        eyebrow={<p className={mkt.eyebrow}>Plans for every stage</p>}
        title="Simple, transparent pricing"
        description="Choose a plan — switch the duration to see the price. Longer plans cost less per month."
      />

      <div className="flex justify-center mb-10 sm:mb-12">
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

      <div className="grid md:grid-cols-3 gap-5 lg:gap-6 items-stretch">
        {tiers.map((t) => {
          const total = priceFor(t, duration);
          const monthly = perMonth(t, duration);
          const href = `/subscribe?tier=${t.id}&duration=${durId}`;

          return (
            <div
              key={t.id}
              className={`relative flex flex-col rounded-2xl p-6 sm:p-7 border transition-all duration-300 ${
                t.popular
                  ? "border-lime-500 bg-[var(--mkt-surface)] shadow-xl shadow-lime-500/15 md:scale-[1.02] z-10"
                  : `${mkt.card} ${mkt.cardHover}`
              }`}
            >
              {t.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-bold tracking-wider uppercase px-3 py-1 rounded-full bg-lime-500 text-slate-950">
                  Most popular
                </span>
              )}

              <div>
                <h3 className="font-bold text-xl text-[var(--mkt-text)]">{t.name}</h3>
                <p className={`text-sm mt-1 ${mkt.muted}`}>{t.tagline}</p>
              </div>

              <div className="mt-5 pb-6 border-b border-black/5 dark:border-white/10">
                <p className="flex items-baseline flex-wrap gap-x-1">
                    <span className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--mkt-text)]">
                    {formatINR(total)}
                  </span>
                  <span className={`text-sm ${mkt.muted}`}>/ {duration.label.toLowerCase()}</span>
                </p>
                <p className="text-sm text-slate-400 mt-1.5">~ {formatINR(monthly)} per month</p>
              </div>

              <Link
                href={href}
                className={`mt-6 block text-center rounded-xl px-5 py-3 font-semibold text-sm transition ${
                  t.popular
                    ? "bg-lime-500 text-slate-950 hover:bg-lime-400 shadow-sm shadow-lime-500/20"
                    : "border border-black/15 dark:border-white/20 text-slate-800 dark:text-white hover:border-lime-500/40 hover:bg-lime-500/5"
                }`}
              >
                Choose {t.name}
              </Link>

              <ul className="mt-6 space-y-3 flex-1">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-slate-600 dark:text-slate-300">
                    <Check className="w-4 h-4 text-lime-500 mt-0.5 shrink-0" strokeWidth={2.5} />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      <p className={`text-center text-sm mt-10 ${mkt.muted}`}>
        All plans include website + admin panel. GST extra where applicable.{" "}
        <Link href="/terms" className="text-lime-600 dark:text-lime-400 hover:underline">View terms</Link>
      </p>
    </MarketingSection>
  );
}
