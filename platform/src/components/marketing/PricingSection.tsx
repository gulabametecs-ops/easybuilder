"use client";

import { useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { TIERS, DURATIONS, priceFor, perMonth, formatINR, type Tier } from "@/lib/plans";

export function PricingSection({ tiers = TIERS }: { tiers?: Tier[] }) {
  const [durId, setDurId] = useState("1y");
  const duration = DURATIONS.find((d) => d.id === durId)!;

  return (
    <section id="pricing" className="py-20 border-t border-black/5 dark:border-white/10 bg-slate-50 dark:bg-white/[0.02]">
      <div className="mx-auto max-w-6xl px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">Simple, transparent pricing</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Choose a plan — switch the duration to see the price. Longer = cheaper.</p>
        </div>

        {/* Duration toggle */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {DURATIONS.map((d) => (
            <button key={d.id} onClick={() => setDurId(d.id)}
              className={`rounded-full px-4 py-2 text-sm font-semibold border transition ${durId === d.id ? "border-lime-500 bg-lime-500/10 text-lime-700 dark:text-lime-300" : "border-black/10 dark:border-white/15 text-slate-600 dark:text-slate-300 hover:border-black/25 dark:hover:border-white/30"}`}>
              {d.label}{d.badge && <span className="ml-1 text-lime-600 dark:text-lime-400">{d.badge}</span>}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {tiers.map((t) => (
            <div key={t.id} className={`rounded-2xl p-6 border ${t.popular ? "border-lime-500 bg-lime-500/[0.04] dark:bg-lime-400/[0.06] shadow-lg" : "border-black/10 dark:border-white/10 bg-white dark:bg-white/[0.03]"}`}>
              {t.popular && <span className="text-xs font-semibold text-lime-600 dark:text-lime-300">MOST POPULAR</span>}
              <h3 className="text-slate-900 dark:text-white font-bold text-xl mt-1">{t.name}</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm">{t.tagline}</p>
              <p className="mt-4">
                <span className="text-4xl font-extrabold text-slate-900 dark:text-white">{formatINR(priceFor(t, duration))}</span>
                <span className="text-slate-500 dark:text-slate-400 text-sm"> / {duration.label.toLowerCase()}</span>
              </p>
              <p className="text-xs text-slate-400">≈ {formatINR(perMonth(t, duration))} per month</p>
              <Link href={`/subscribe?tier=${t.id}`} className={`mt-5 block text-center rounded-lg px-5 py-2.5 font-semibold text-sm ${t.popular ? "bg-lime-500 text-white hover:bg-lime-600" : "border border-black/15 dark:border-white/20 text-slate-800 dark:text-white hover:bg-black/5 dark:hover:bg-white/10"}`}>
                Choose {t.name}
              </Link>
              <ul className="mt-6 space-y-2.5">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
                    <Check className="w-4 h-4 text-lime-500 mt-0.5 shrink-0" /> {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
