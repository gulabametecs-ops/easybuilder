"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Icon } from "../Icon";
import type { SectionContentMap } from "@/lib/config";

function Heading({ eyebrow, title, highlight }: { eyebrow?: string; title: string; highlight?: string }) {
  return (
    <div className="text-center max-w-2xl mx-auto mb-12">
      {eyebrow && <p className="text-primary text-sm font-semibold tracking-wider uppercase mb-2">{eyebrow}</p>}
      <h2 className="text-3xl sm:text-4xl font-extrabold">
        {title} {highlight && <span className="text-primary">{highlight}</span>}
      </h2>
      <div className="h-1 w-16 bg-primary rounded-full mt-4 mx-auto" />
    </div>
  );
}

// ─── Pricing plans ────────────────────────────────────────────────────────────
export function PricingPlansBlock({ c }: { c: SectionContentMap["pricingPlans"] }) {
  return (
    <section className="py-16 sm:py-20 bg-light">
      <div className="mx-auto max-w-7xl px-4">
        <Heading eyebrow={c.eyebrow} title={c.title} highlight={c.titleHighlight} />
        <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
          {(c.plans ?? []).map((p, i) => (
            <div key={i} className={`rounded-2xl border p-7 flex flex-col ${p.featured ? "border-primary shadow-xl scale-[1.03] bg-white" : "border-slate-200 bg-white"}`}>
              {p.featured && <span className="self-start rounded-full bg-primary/15 text-primary text-xs font-bold px-3 py-1 mb-3">MOST POPULAR</span>}
              <h3 className="text-lg font-bold text-heading">{p.name}</h3>
              <div className="mt-3 mb-5">
                <span className="text-4xl font-extrabold text-heading">{p.price}</span>
                <span className="text-slate-400 text-sm">{p.period}</span>
              </div>
              <ul className="space-y-2.5 flex-1">
                {(p.features ?? []).filter(Boolean).map((f, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm text-slate-600">
                    <Icon name="check" className="w-4 h-4 text-primary mt-0.5 shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <Link href={p.buttonHref || "#"} className={`mt-6 text-center rounded-lg px-5 py-3 text-sm font-semibold ${p.featured ? "bg-primary text-white hover:opacity-90" : "border border-slate-300 text-slate-700 hover:bg-slate-50"}`}>
                {p.buttonLabel || "Choose"}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Opening hours ────────────────────────────────────────────────────────────
export function OpeningHoursBlock({ c }: { c: SectionContentMap["openingHours"] }) {
  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-3xl px-4">
        <Heading eyebrow={c.eyebrow} title={c.title} highlight={c.titleHighlight} />
        <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          {(c.days ?? []).map((d, i) => {
            const closed = /closed/i.test(d.hours);
            return (
              <div key={i} className={`flex items-center justify-between px-6 py-4 ${i % 2 ? "bg-slate-50" : "bg-white"}`}>
                <span className="font-medium text-heading flex items-center gap-2"><Icon name="clock" className="w-4 h-4 text-primary" /> {d.day}</span>
                <span className={`text-sm font-semibold ${closed ? "text-red-500" : "text-slate-600"}`}>{d.hours}</span>
              </div>
            );
          })}
        </div>
        {c.note && <p className="text-center text-sm text-slate-400 mt-4">{c.note}</p>}
      </div>
    </section>
  );
}

// ─── Countdown ────────────────────────────────────────────────────────────────
function useCountdown(target: string) {
  const [left, setLeft] = useState<{ d: number; h: number; m: number; s: number } | null>(null);
  useEffect(() => {
    if (!target) return;
    const end = new Date(target).getTime();
    if (isNaN(end)) return;
    const tick = () => {
      const diff = Math.max(0, end - Date.now());
      setLeft({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff / 3600000) % 24),
        m: Math.floor((diff / 60000) % 60),
        s: Math.floor((diff / 1000) % 60),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);
  return left;
}

export function CountdownBlock({ c }: { c: SectionContentMap["countdown"] }) {
  const left = useCountdown(c.targetDate);
  const box = (val: number, label: string) => (
    <div className="flex flex-col items-center">
      <span className="text-4xl sm:text-5xl font-extrabold tabular-nums bg-white/10 rounded-xl px-4 py-3 min-w-[76px] text-center">{String(val).padStart(2, "0")}</span>
      <span className="text-xs uppercase tracking-wider mt-2 text-white/70">{label}</span>
    </div>
  );
  return (
    <section className="py-16 sm:py-20 bg-secondary text-white text-center relative overflow-hidden">
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_50%_0%,var(--c-primary),transparent_55%)]" />
      <div className="relative mx-auto max-w-4xl px-4">
        {c.eyebrow && <p className="text-primary text-sm font-semibold tracking-wider uppercase mb-2">{c.eyebrow}</p>}
        <h2 className="text-3xl sm:text-4xl font-extrabold">{c.title} <span className="text-primary">{c.titleHighlight}</span></h2>
        {c.subtitle && <p className="mt-3 text-white/70">{c.subtitle}</p>}
        <div className="mt-8 flex items-center justify-center gap-3 sm:gap-5">
          {left ? (<>{box(left.d, "Days")}{box(left.h, "Hours")}{box(left.m, "Mins")}{box(left.s, "Secs")}</>)
            : <p className="text-white/50">{c.targetDate ? "Loading…" : "Set a target date in the editor."}</p>}
        </div>
        {c.buttonLabel && (
          <Link href={c.buttonHref || "#"} className="inline-block mt-8 rounded-lg bg-primary text-white px-7 py-3 text-sm font-semibold hover:opacity-90">{c.buttonLabel}</Link>
        )}
      </div>
    </section>
  );
}

// ─── Map ──────────────────────────────────────────────────────────────────────
export function MapBlock({ c }: { c: SectionContentMap["map"] }) {
  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4">
        <Heading eyebrow={c.eyebrow} title={c.title} highlight={c.titleHighlight} />
        {c.address && <p className="text-center text-slate-500 mb-6 flex items-center justify-center gap-2"><Icon name="map" className="w-4 h-4 text-primary" /> {c.address}</p>}
        <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm aspect-[16/7] bg-slate-100">
          {c.mapEmbed ? (
            <iframe src={c.mapEmbed} className="w-full h-full" loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Map" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm">Paste a Google Maps embed URL in the editor.</div>
          )}
        </div>
      </div>
    </section>
  );
}
