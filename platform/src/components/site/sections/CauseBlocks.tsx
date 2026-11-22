"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { Icon } from "../Icon";
import { ImageSlot } from "../ImageSlot";
import { DonateBox } from "../DonateBox";
import type { SectionContentMap } from "@/lib/config";
import type { PublicPayments } from "@/lib/payments";
import { headingStylesFrom, readContentStyles, textStyleProps } from "@/lib/fieldStyle";
import { compactINR, progressPct, timeLeftLabel, type ImpactTier, type PublicCause } from "@/lib/cause";
import { cardSize } from "./cardGrid";

const RADIUS_LG = "rounded-[calc(var(--site-radius)*1.6)]";

/** Theme-primary bar that fills from 0 when it scrolls into view. */
export function CauseProgress({ pct, className = "h-2.5" }: { pct: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => {
      if (e?.isIntersecting) { setOn(true); io.disconnect(); }
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={`w-full rounded-full bg-primary/15 overflow-hidden ${className}`} role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
      <div className="h-full rounded-full bg-primary transition-[width] duration-[1200ms] ease-out" style={{ width: on ? `${Math.max(pct, pct > 0 ? 2 : 0)}%` : "0%" }} />
    </div>
  );
}

/** "12 days left" / "Last day" / "Ended" / "Ongoing". */
export function CauseCard({ c }: { c: PublicCause }) {
  const pct = progressPct(c);
  const done = c.status === "completed";
  const paused = c.status === "paused";
  const href = `/causes/${c.slug}`;
  return (
    <article className="card sec-card site-lift overflow-hidden flex flex-col group h-full">
      <Link href={href} className="relative overflow-hidden block" tabIndex={-1} aria-hidden>
        <ImageSlot src={c.coverImage} alt={c.title} w={800} h={500} className={`w-full aspect-[16/10] transition-transform duration-500 group-hover:scale-105 ${paused ? "grayscale" : ""}`} />
        <div className="absolute top-3 left-3 right-3 flex flex-wrap gap-1.5">
          {c.category && <span className="rounded-full bg-white/95 text-slate-800 text-[11px] font-semibold px-3 py-1 shadow">{c.category}</span>}
          {c.urgent && !done && !paused && (
            <span className="rounded-full bg-red-600 text-white text-[11px] font-bold uppercase tracking-wide px-3 py-1 shadow inline-flex items-center gap-1"><Icon name="zap" className="w-3 h-3" />Urgent</span>
          )}
        </div>
        {(done || paused) && (
          <div className="absolute inset-0 bg-slate-950/55 flex items-center justify-center">
            <span className={`rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wide shadow ${done ? "bg-primary text-white" : "bg-white text-slate-900"}`}>
              {done ? "Goal reached" : "Paused"}
            </span>
          </div>
        )}
      </Link>
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-bold text-lg leading-snug line-clamp-2">
          <Link href={href} className="hover:text-primary transition-colors">{c.title}</Link>
        </h3>
        {c.summary && <p className="text-sm site-muted mt-1.5 line-clamp-2">{c.summary}</p>}

        <div className="mt-4">
          <div className="flex items-baseline justify-between gap-3 text-sm mb-2">
            <p className="min-w-0">
              <span className="font-extrabold text-primary tabular-nums">{compactINR(c.raised)}</span>
              {c.goalAmount > 0 && <span className="site-muted"> raised of {compactINR(c.goalAmount)}</span>}
              {!c.goalAmount && <span className="site-muted"> raised</span>}
            </p>
            {c.goalAmount > 0 && <span className="font-bold tabular-nums shrink-0">{pct}%</span>}
          </div>
          <CauseProgress pct={c.goalAmount ? pct : 100} />
          <div className="flex items-center justify-between gap-3 text-xs site-muted mt-2.5">
            <span className="inline-flex items-center gap-1"><Icon name="users" className="w-3.5 h-3.5" />{c.donors.toLocaleString("en-IN")} {c.donors === 1 ? "donor" : "donors"}</span>
            <span className="inline-flex items-center gap-1"><Icon name="clock" className="w-3.5 h-3.5" />{timeLeftLabel(c)}</span>
          </div>
        </div>

        <div className="mt-auto pt-5 flex items-center gap-3">
          {!paused && (
            <Link href={`${href}#donate`} className="btn-primary inline-flex items-center justify-center gap-1.5 px-5 py-2.5 text-sm font-semibold flex-1">
              <Icon name="heart" className="w-4 h-4" /> {done ? "Keep supporting" : "Donate"}
            </Link>
          )}
          <Link href={href} className={`inline-flex items-center gap-1 text-primary text-sm font-semibold ${paused ? "" : "shrink-0"}`}>
            Read story <Icon name="arrow" className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </article>
  );
}

export function CauseCards({ list }: { list: PublicCause[] }) {
  const size = cardSize(list.length, 24);
  return (
    <div className="flex flex-wrap justify-center gap-6">
      {list.map((c) => <div key={c.id} className={size.className} style={size.style}><CauseCard c={c} /></div>)}
    </div>
  );
}

export function CauseListBlock({ c, causes }: { c: SectionContentMap["causeList"]; causes?: PublicCause[] }) {
  const fs = readContentStyles(c);
  const hs = headingStylesFrom(c);
  const fixed = c.category && c.category !== "all" ? c.category.trim().toLowerCase() : "";
  const base = useMemo(
    () => (causes ?? []).filter((x) =>
      (!fixed || x.category.trim().toLowerCase() === fixed)
      && (!c.featuredOnly || x.featured)
      && (c.showCompleted || x.status === "active")),
    [causes, fixed, c.featuredOnly, c.showCompleted],
  );
  const categories = [...new Set(base.map((x) => x.category.trim()).filter(Boolean))];
  const [tab, setTab] = useState("");
  const limit = c.limit && c.limit > 0 ? c.limit : 6;
  const list = base.filter((x) => !tab || x.category.trim() === tab).slice(0, limit);
  const pill = (on: boolean) => `rounded-full px-4 py-2 text-sm font-semibold transition-colors ${on ? "bg-primary text-white" : "bg-[var(--site-surface)] ring-1 ring-inset ring-[var(--site-line)] hover:text-primary"}`;

  return (
    <section className="site-sec py-20 sm:py-28 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="sec-heading">
          {c.eyebrow && <p className="site-eyebrow mb-5" {...textStyleProps(hs.eyebrow)}>{c.eyebrow}</p>}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold" {...textStyleProps(hs.title)}>
            {c.title}{" "}
            {c.titleHighlight && <span className="text-primary" {...textStyleProps(hs.titleHighlight)}>{c.titleHighlight}</span>}
          </h2>
        </div>
        {c.subtitle && <p className="text-center site-muted -mt-8 mb-12 max-w-2xl mx-auto" {...textStyleProps(fs.subtitle)}>{c.subtitle}</p>}

        {c.showFilters && !fixed && categories.length > 1 && (
          <div className="mb-10 flex flex-wrap justify-center gap-2" role="tablist">
            <button type="button" role="tab" aria-selected={!tab} className={pill(!tab)} onClick={() => setTab("")}>All</button>
            {categories.map((x) => (
              <button key={x} type="button" role="tab" aria-selected={tab === x} className={pill(tab === x)} onClick={() => setTab(x)}>{x}</button>
            ))}
          </div>
        )}

        {list.length === 0 ? (
          <p className="text-center site-muted">{c.emptyText || "New causes will appear here once they are published."}</p>
        ) : (
          <CauseCards list={list} />
        )}
      </div>
    </section>
  );
}

// ─── Detail page widgets ─────────────────────────────────────────────────────

/**
 * Two-column detail body: server-rendered `before`/`after` around the impact tiers, sticky donate card.
 * Tiers live here because picking one presets the DonateBox amount.
 */
export function CauseDonateLayout({
  cause, payments, orgName, before, after,
}: {
  cause: Pick<PublicCause, "id" | "title" | "status" | "impactTiers">;
  payments: PublicPayments;
  orgName: string;
  before: ReactNode;
  after: ReactNode;
}) {
  const tiers = cause.impactTiers;
  const [amount, setAmount] = useState(tiers[0]?.amount ?? 1000);
  const [picked, setPicked] = useState<number | null>(null);
  const paused = cause.status === "paused";
  const done = cause.status === "completed";

  const pick = (t: ImpactTier, i: number) => {
    setPicked(i);
    setAmount(t.amount);
    if (window.matchMedia("(max-width: 1023px)").matches) document.getElementById("donate")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="grid lg:grid-cols-[minmax(0,1fr)_400px] gap-8 lg:gap-10 items-start">
      <div className="min-w-0 space-y-10">
        {before}
        {tiers.length > 0 && (
          <section>
            <h2 className="text-xl font-bold mb-1">Your impact</h2>
            <p className="text-sm site-muted mb-4">{paused ? "What a gift makes possible." : "Pick an amount — we'll set it in the donation box."}</p>
            <div className="grid sm:grid-cols-2 gap-3">
              {tiers.map((t, i) => {
                const on = picked === i;
                return (
                  <button
                    key={`${t.amount}-${i}`}
                    type="button"
                    disabled={paused}
                    aria-pressed={on}
                    onClick={() => pick(t, i)}
                    className={`${RADIUS_LG} text-left p-4 sm:p-5 ring-2 transition-all flex gap-3 items-start min-w-0 disabled:cursor-default ${on ? "ring-[var(--c-primary)] bg-primary/5 shadow-[var(--site-shadow-lg)]" : "ring-[var(--site-line)] bg-[var(--site-surface)] enabled:hover:ring-[var(--c-primary)]/50"}`}
                  >
                    <span className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center ${on ? "bg-primary text-white" : "bg-primary/10 text-primary"}`}>
                      <Icon name={on ? "check" : "heart"} className="w-4 h-4" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-xl font-extrabold text-primary tabular-nums">₹{t.amount.toLocaleString("en-IN")}</span>
                      <span className="block text-sm mt-0.5 break-words">{t.label}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </section>
        )}
        {after}
      </div>

      <aside id="donate" className="lg:sticky lg:top-24 min-w-0 scroll-mt-24">
        {paused ? (
          <div className={`${RADIUS_LG} bg-[var(--site-surface)] ring-1 ring-[var(--site-line)] p-6`}>
            <h3 className="font-bold text-lg">Donations are paused</h3>
            <p className="text-sm site-muted mt-2">This cause isn&apos;t accepting donations right now. Please check our other causes or contact us to help in another way.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {done && (
              <div className="rounded-xl bg-primary text-white px-4 py-3 text-sm font-semibold flex items-center gap-2">
                <Icon name="check" className="w-4 h-4 shrink-0" /> Goal reached — thank you!
              </div>
            )}
            <DonateBox
              payments={payments}
              orgName={orgName}
              causeId={cause.id}
              suggested={amount}
              presets={tiers.length ? tiers.map((t) => t.amount).slice(0, 4) : undefined}
              label={done ? "Keep supporting" : `Donate to ${cause.title}`}
            />
          </div>
        )}
      </aside>
    </div>
  );
}

export function CauseShare({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);
  const btn = "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold";
  return (
    <div className="flex flex-wrap gap-2">
      <a
        href="https://wa.me/"
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => { e.currentTarget.href = `https://wa.me/?text=${encodeURIComponent(`${title} — please support: ${window.location.href.split("#")[0]}`)}`; }}
        className={`${btn} bg-green-500 hover:bg-green-600 text-white`}
      >
        <Icon name="whatsapp" className="w-4 h-4" /> Share on WhatsApp
      </a>
      <button
        type="button"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(window.location.href.split("#")[0]);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          } catch { /* clipboard blocked — nothing to do */ }
        }}
        className={`${btn} ring-1 ring-inset ring-[var(--site-line)] hover:text-primary`}
      >
        <Icon name={copied ? "check" : "layers"} className="w-4 h-4 text-primary" /> {copied ? "Link copied" : "Copy link"}
      </button>
    </div>
  );
}
