"use client";

import Link from "next/link";
import { useEffect, useReducer, useState } from "react";
import { ArrowRight, Sparkles, Check, MessageCircle, TrendingUp, Search } from "lucide-react";
import { DemoConceptPreview } from "./DemoConceptPreview";
import type { DemoDesign, DemoSector } from "./DemosExplorer";

export type HeroShowcase = {
  word: string; // "gym"
  article: "a" | "an";
  city: string; // default city shown in the sentence
  brand: string; // preview business name suffix: "<city> <brand>"
  sector: DemoSector;
  design: DemoDesign;
};

const TRUST = ["No coding", "Admin panel included", "Live in 5 minutes"];
const TYPE_MS = 70;
const HOLD_TICKS = 46; // ~3.2s on a finished word before the next one
const BARS = [38, 52, 44, 70, 58, 86, 100];

type Typing = { i: number; n: number; hold: number };

/**
 * Mad-lib hero: "I run a [gym ▾] in [Jaipur]." Pick a business, type a city, and the
 * collage on the right becomes that business: website, Google result, phone enquiry
 * form, WhatsApp lead, admin stats — all in the business's own colours.
 */
export function MarketingHero({ startPrice, showcase }: { startPrice: string; showcase: HeroShowcase[] }) {
  const lens = showcase.map((s) => s.word.length);
  const [t, dispatch] = useReducer(
    (s: Typing, a: { type: "tick" } | { type: "pick"; i: number }): Typing => {
      if (a.type === "pick") return { i: a.i, n: lens[a.i], hold: 0 };
      if (s.n < lens[s.i]) return { ...s, n: s.n + 1 };
      if (s.hold < HOLD_TICKS) return { ...s, hold: s.hold + 1 };
      return { i: (s.i + 1) % lens.length, n: 0, hold: 0 };
    },
    { i: 0, n: lens[0], hold: 0 }, // SSR renders the full first word
  );
  const [auto, setAuto] = useState(true);
  const [city, setCity] = useState<string | null>(null); // null → the showcase's own city

  useEffect(() => {
    if (!auto || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => dispatch({ type: "tick" }), TYPE_MS);
    return () => window.clearInterval(id);
  }, [auto]);

  const cur = showcase[t.i];
  const typing = t.n < cur.word.length;
  const cityName = (city ?? cur.city).trim() || "Your city";
  const name = `${cityName} ${cur.brand}`;
  const host = `${name.toLowerCase().replace(/[^a-z0-9]+/g, "")}.sitepixl.com`;
  const sector = { ...cur.sector, name };
  const accent = cur.design.colors.primary;
  const stop = () => setAuto(false);

  return (
    <section className="mkt-hero-dark relative isolate overflow-hidden text-[var(--mkt-text)]">
      <div className="mkt-hero-grid pointer-events-none absolute inset-0 -z-10" aria-hidden />
      {/* Ambient colour follows the business on show */}
      <div
        className="pointer-events-none absolute -top-48 right-[-10%] -z-10 h-[620px] w-[620px] rounded-full opacity-30 blur-[120px] transition-[background-color] duration-1000"
        style={{ backgroundColor: accent }}
        aria-hidden
      />
      <div className="pointer-events-none absolute -left-40 top-24 -z-10 h-[460px] w-[460px] rounded-full bg-[var(--mkt-brand)] opacity-[0.13] blur-[120px]" aria-hidden />
      <div className="pointer-events-none absolute bottom-0 left-1/3 -z-10 h-[300px] w-[500px] rounded-full bg-[var(--mkt-brand-2)] opacity-10 blur-[120px]" aria-hidden />

      <div className="mx-auto grid max-w-[1320px] items-center gap-12 px-4 pb-16 pt-9 sm:px-6 sm:pt-12 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.12fr)] xl:gap-12 xl:pb-20 xl:pt-12">
        {/* Copy */}
        <div className="mx-auto w-full min-w-0 max-w-2xl text-center xl:mx-0 xl:max-w-none xl:text-left">
          <p className="inline-flex items-center gap-2 rounded-full border border-[var(--mkt-border)] bg-[var(--mkt-surface)]/80 py-1 pl-1 pr-3 text-xs font-medium text-[var(--mkt-text-secondary)] shadow-sm backdrop-blur">
            <span className="mkt-brand-grad rounded-full px-2 py-0.5 text-[11px] font-semibold">Try it</span>
            Pick your business below, type your city
          </p>

          <h1 className="font-display mt-6 text-[clamp(2rem,5.6vw,3.1rem)] xl:text-[clamp(2.9rem,3.6vw,3.75rem)] font-bold leading-[1.1] tracking-[-0.04em]">
            I run {cur.article}{" "}
            {/* Business word: switched by the "Try:" chips below (no dropdown). */}
            <span className="relative inline-flex items-baseline whitespace-nowrap">
              <span className="mkt-gradient-text relative">
                {cur.word.slice(0, t.n)}
                {auto && typing && <span className="ml-0.5 inline-block h-[0.8em] w-[3px] translate-y-[0.08em] animate-pulse bg-[var(--mkt-accent-2)] align-baseline" />}
              </span>
              {!typing && (
                <svg key={t.i} viewBox="0 0 300 20" preserveAspectRatio="none" className="pointer-events-none absolute -bottom-[0.12em] left-0 h-[0.26em] w-full" aria-hidden>
                  <path d="M3 15 C 70 5, 190 3, 297 11" fill="none" stroke={accent} strokeWidth="7" strokeLinecap="round" className="mkt-draw" />
                </svg>
              )}
            </span>
            <br />
            in{" "}
            {/* The invisible mirror sizes the input to its text exactly. */}
            <label className="relative inline-block border-b-[3px] border-dashed border-[var(--mkt-border-strong)] pb-0.5 transition focus-within:border-[var(--mkt-accent-2)]">
              <span className="sr-only">Your city</span>
              <span aria-hidden className="invisible whitespace-pre">{(city ?? cur.city) || "City"}</span>
              <input
                value={city ?? cur.city}
                onChange={(e) => setCity(e.target.value.slice(0, 18))}
                onFocus={(e) => {
                  stop();
                  e.target.select();
                }}
                placeholder="City"
                spellCheck={false}
                className="absolute inset-0 w-full bg-transparent p-0 text-[var(--mkt-text)] outline-none placeholder:text-[var(--mkt-text-muted)]"
              />
            </label>
            .
          </h1>

          <div className="-mx-4 mt-5 flex items-center gap-2 overflow-x-auto px-4 pb-1 [mask-image:linear-gradient(90deg,#000_82%,transparent)] [scrollbar-width:none] sm:mx-0 sm:[mask-image:none] sm:flex-wrap sm:justify-center sm:overflow-visible sm:px-0 xl:justify-start">
            <span className="shrink-0 text-xs font-medium text-[var(--mkt-text-muted)]">Try:</span>
            {showcase.slice(0, 6).map((s, n) => (
              <button
                key={s.sector.id}
                type="button"
                onClick={() => {
                  stop();
                  dispatch({ type: "pick", i: n });
                }}
                aria-pressed={n === t.i}
                className={`shrink-0 rounded-full border px-3 py-1 text-xs font-semibold capitalize transition ${
                  n === t.i
                    ? "border-transparent text-white shadow-sm"
                    : "border-[var(--mkt-border)] bg-[var(--mkt-surface)]/80 text-[var(--mkt-text-secondary)] hover:border-[var(--mkt-border-strong)]"
                }`}
                style={n === t.i ? { backgroundColor: accent } : undefined}
              >
                {s.word}
              </button>
            ))}
          </div>

          <p className="mx-auto mt-5 max-w-lg text-pretty text-[15px] leading-relaxed text-[var(--mkt-text-muted)] sm:text-base xl:mx-0">
            Get a ready-made website for your {cur.word} — with enquiries on WhatsApp, online bookings, Google-ready SEO and your own admin panel.
          </p>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-3 xl:justify-start">
            <Link
              href={`/subscribe?vertical=${cur.sector.id}&design=${cur.design.id}`}
              className="group inline-flex items-center gap-2 rounded-full bg-[var(--mkt-accent)] px-5 py-3 text-sm font-semibold text-[var(--mkt-accent-on)] shadow-[0_10px_30px_-10px_rgba(47,91,255,0.6)] transition hover:bg-[var(--mkt-accent-hover)]"
            >
              Get this website · from {startPrice}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" strokeWidth={2.25} />
            </Link>
            <Link
              href={`/demos?vertical=${cur.sector.id}`}
              className="inline-flex items-center gap-2 rounded-full border border-[var(--mkt-border-strong)] bg-[var(--mkt-surface)] px-5 py-3 text-sm font-semibold text-[var(--mkt-text)] shadow-sm transition hover:border-[var(--mkt-accent-2)]/50"
            >
              Open the live demo
            </Link>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[13px] text-[var(--mkt-text-muted)] xl:justify-start">
            {TRUST.map((x) => (
              <span key={x} className="inline-flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-[var(--mkt-accent-2)]" strokeWidth={2.5} />
                {x}
              </span>
            ))}
            <Link href="/ai-builder" className="inline-flex items-center gap-1.5 font-semibold text-[var(--mkt-accent-text)] hover:underline">
              <Sparkles className="h-3.5 w-3.5" /> or describe it to AI
            </Link>
          </div>
        </div>

        {/* Collage: everything the business gets, in its own colours */}
        <div className="relative mx-auto w-full min-w-0 max-w-3xl pb-6 pt-6 sm:pb-12 xl:h-[560px] xl:max-w-none xl:p-0">
          {/* soft brand glow behind the frame */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-6 top-16 bottom-10 -z-10 rounded-[40px] opacity-60 blur-3xl transition-[background] duration-700"
            style={{ background: `radial-gradient(60% 60% at 50% 45%, ${accent}55, transparent 70%)` }}
          />
          <div className="relative xl:absolute xl:left-4 xl:right-6 xl:top-12 xl:rotate-[-1.5deg]">
            <div className="rounded-[22px] bg-gradient-to-b from-[var(--mkt-border-strong)] to-[var(--mkt-border)] p-px shadow-[0_40px_100px_-30px_rgba(10,13,20,0.35)]">
              <div className="rounded-[21px] bg-[var(--mkt-surface)] p-1.5 sm:p-2">
                <DemoConceptPreview key={cur.sector.id} sector={sector} design={cur.design} bare />
              </div>
            </div>
          </div>

          {/* WhatsApp lead */}
          <div key={`wa-${t.i}`} className="mkt-pop absolute left-2 top-0 flex w-56 items-center gap-2.5 rounded-2xl border border-[var(--mkt-border)] bg-[var(--mkt-surface)]/95 p-2.5 shadow-xl backdrop-blur sm:-left-3 sm:w-64 sm:gap-3 sm:p-3 xl:left-0 xl:top-0" style={{ animationDelay: "0.15s" }}>
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#25d366] text-white sm:h-9 sm:w-9">
              <MessageCircle className="h-4.5 w-4.5" fill="currentColor" strokeWidth={0} />
            </span>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-[#128c7e]">WhatsApp · now</p>
              <p className="truncate text-[13px] font-semibold text-[var(--mkt-text)]">New enquiry from {cityName}</p>
            </div>
          </div>

          {/* Admin stats */}
          <div key={`st-${t.i}`} className="mkt-pop absolute -right-3 -top-2 hidden w-52 rounded-2xl md:block xl:right-0 xl:top-0 border border-[var(--mkt-border)] bg-[var(--mkt-surface)]/95 p-3.5 shadow-xl backdrop-blur" style={{ animationDelay: "0.3s" }}>
            <p className="flex items-center justify-between text-[11px] font-medium text-[var(--mkt-text-muted)]">
              Your admin · this week <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
            </p>
            <p className="mt-1 text-2xl font-bold tracking-tight text-[var(--mkt-text)]">
              24 <span className="text-sm font-semibold text-[var(--mkt-text-muted)]">enquiries</span>
            </p>
            <div className="mt-2.5 flex h-10 items-end gap-1.5">
              {BARS.map((h, k) => (
                <span key={k} className="flex-1 rounded-sm transition-[background-color] duration-700" style={{ height: `${h}%`, backgroundColor: accent, opacity: 0.35 + k * 0.1 }} />
              ))}
            </div>
          </div>

          {/* Google result */}
          <div key={`g-${t.i}`} className="mkt-pop absolute -left-3 bottom-0 hidden w-[19rem] rounded-2xl border border-black/5 bg-white p-4 text-left shadow-2xl sm:block xl:-left-8 xl:bottom-4" style={{ animationDelay: "0.45s" }}>
            <p className="flex items-center gap-1.5 text-[11px] text-slate-500">
              <Search className="h-3 w-3" /> {cur.word} in {cityName}
            </p>
            <div className="mt-2 flex items-center gap-2">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[9px] font-bold text-white transition-[background-color] duration-700" style={{ backgroundColor: accent }}>
                {name.slice(0, 2).toUpperCase()}
              </span>
              <div className="min-w-0 leading-tight">
                <p className="truncate text-[12px] font-medium text-slate-800">{name}</p>
                <p className="truncate text-[10.5px] text-slate-500">https://{host}</p>
              </div>
            </div>
            <p className="mt-1.5 truncate text-[15px] font-medium text-[#1a0dab]">
              {name} — Best {cur.word} in {cityName}
            </p>
            <p className="mt-1 flex items-center gap-1 text-[11px] text-slate-500">
              <span className="font-semibold text-slate-700">4.9</span>
              <span className="tracking-[-0.05em] text-[#f5a623]">★★★★★</span>
              <span>· 128 reviews · Open now</span>
            </p>
            <p className="mt-0.5 line-clamp-2 text-[12px] leading-snug text-slate-600">{cur.sector.tagline}</p>
          </div>

          {/* Phone: enquiry form */}
          <div key={`ph-${t.i}`} className="mkt-pop absolute -bottom-2 -right-3 hidden w-40 rounded-[30px] border-[6px] border-[#0a0d14] bg-white shadow-2xl sm:block md:w-44 xl:-bottom-2 xl:right-0" style={{ animationDelay: "0.6s" }}>
            <div className="mx-auto mt-1.5 h-1.5 w-12 rounded-full bg-[#0a0d14]" />
            <div className="mx-2 mt-2 flex items-center gap-1.5 rounded-xl px-2 py-1.5 text-white transition-[background-color] duration-700" style={{ backgroundColor: accent }}>
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-white/25 text-[8px] font-bold">{name.slice(0, 2).toUpperCase()}</span>
              <span className="truncate text-[10px] font-semibold">{name}</span>
            </div>
            <div className="space-y-1.5 px-3 pb-4 pt-3">
              <p className="text-[12px] font-bold text-slate-900">Book a free visit</p>
              <span className="block rounded-md border border-slate-200 px-2 py-1.5 text-[9.5px] text-slate-400">Your name</span>
              <span className="block rounded-md border border-slate-200 px-2 py-1.5 text-[9.5px] text-slate-400">Phone number</span>
              <span className="block rounded-md py-1.5 text-center text-[10px] font-semibold text-white transition-[background-color] duration-700" style={{ backgroundColor: accent }}>
                Send enquiry
              </span>
              <p className="pt-0.5 text-center text-[8.5px] text-slate-400">Lands in your admin + WhatsApp</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
