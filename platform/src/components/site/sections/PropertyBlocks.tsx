"use client";

import { useActionState, useMemo, useState } from "react";
import Link from "next/link";
import { Icon } from "../Icon";
import { ImageSlot } from "../ImageSlot";
import { PrivacyConsent } from "../PrivacyConsent";
import { submitLead, type FormState } from "@/lib/actions/site";
import type { SectionContentMap } from "@/lib/config";
import { headingStylesFrom, readContentStyles, textStyleProps } from "@/lib/fieldStyle";
import { PURPOSES, emi, formatPrice, priceLabel, purposeLabel, type PropertyPurpose, type PublicProperty } from "@/lib/property";
import { cardSize } from "./cardGrid";

const RADIUS_LG = "rounded-[calc(var(--site-radius)*1.6)]";
const CHIP = "inline-flex items-center gap-1 rounded-full bg-[var(--site-surface)] ring-1 ring-inset ring-[var(--site-line)] px-2.5 py-1 text-[11px] font-medium";
const STATUS_LABEL: Record<string, string> = { sold: "Sold", rented: "Rented out", "under-offer": "Under offer" };

/** Chips under the title, by purpose. */
function cardChips(p: PublicProperty): string[] {
  const area = p.areaSqft > 0 ? `${p.areaSqft.toLocaleString("en-IN")} sq.ft` : "";
  if (p.purpose === "pg") return [p.sharing, p.foodIncluded ? "Food included" : "", p.gender];
  if (p.purpose === "project") return [p.bhk, area, p.possession && `Possession ${p.possession}`, p.rera ? "RERA registered" : ""];
  return [p.bhk, area, p.furnishing];
}

export function PropertyCard({ p }: { p: PublicProperty }) {
  const status = STATUS_LABEL[p.status];
  const closed = p.status === "sold" || p.status === "rented";
  const short = PURPOSES.find((x) => x.id === p.purpose)?.short ?? p.purpose;
  const where = [p.locality, p.city].filter(Boolean).join(" · ");
  return (
    <Link href={`/properties/${p.slug}`} className={`card sec-card site-lift overflow-hidden flex flex-col group h-full ${closed ? "opacity-70" : ""}`}>
      <div className="relative overflow-hidden">
        <ImageSlot src={p.coverImage} alt={p.title} w={800} h={500} className={`w-full aspect-[16/10] transition-transform duration-500 group-hover:scale-105 ${closed ? "grayscale" : ""}`} />
        <div className="absolute top-3 left-3 flex gap-1.5">
          <span className="rounded-full bg-primary text-white text-[11px] font-semibold px-3 py-1 shadow">{short}</span>
          {p.featured && <span className="rounded-full bg-white/95 text-slate-800 text-[11px] font-semibold px-3 py-1 shadow inline-flex items-center gap-1"><Icon name="star" className="w-3 h-3 text-amber-500" />Featured</span>}
        </div>
        {status && (
          <span className={`absolute top-3 right-3 rounded-full text-[11px] font-bold uppercase tracking-wide px-3 py-1 shadow ${closed ? "bg-slate-900/85 text-white" : "bg-amber-400 text-slate-900"}`}>{status}</span>
        )}
      </div>
      <div className="p-5 flex flex-col flex-1">
        <p className="text-2xl font-extrabold text-primary tabular-nums">{priceLabel(p)}</p>
        <h3 className="font-bold text-lg leading-snug mt-1 group-hover:text-primary transition-colors line-clamp-2">{p.title}</h3>
        {where && <p className="text-sm site-muted mt-1 inline-flex items-center gap-1"><Icon name="map-pin" className="w-3.5 h-3.5 shrink-0" />{where}</p>}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {cardChips(p).filter(Boolean).map((t) => <span key={t} className={CHIP}>{t}</span>)}
        </div>
        <span className="mt-auto pt-4 inline-flex items-center gap-1.5 text-primary text-sm font-semibold">
          View details <Icon name="arrow" className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}

export function PropertyCards({ list }: { list: PublicProperty[] }) {
  const size = cardSize(list.length, 24);
  return (
    <div className="flex flex-wrap justify-center gap-6">
      {list.map((p) => <div key={p.id} className={size.className} style={size.style}><PropertyCard p={p} /></div>)}
    </div>
  );
}

// Budget buckets (₹). Sale/project in lakh/crore, rent/PG per month.
const BUDGETS: Record<"buy" | "rent", { id: string; label: string; min: number; max: number }[]> = {
  buy: [
    { id: "b1", label: "Under ₹50 Lakh", min: 0, max: 50_00_000 },
    { id: "b2", label: "₹50 Lakh – 1 Cr", min: 50_00_000, max: 1_00_00_000 },
    { id: "b3", label: "₹1 – 2 Cr", min: 1_00_00_000, max: 2_00_00_000 },
    { id: "b4", label: "Above ₹2 Cr", min: 2_00_00_000, max: Infinity },
  ],
  rent: [
    { id: "r1", label: "Under ₹10,000/mo", min: 0, max: 10_000 },
    { id: "r2", label: "₹10,000 – 25,000/mo", min: 10_000, max: 25_000 },
    { id: "r3", label: "₹25,000 – 50,000/mo", min: 25_000, max: 50_000 },
    { id: "r4", label: "Above ₹50,000/mo", min: 50_000, max: Infinity },
  ],
};
const budgetKind = (p: string) => (p === "sale" || p === "project" ? "buy" : p === "rent" || p === "pg" ? "rent" : null);

const INPUT = "rounded-full border border-[var(--site-line)] bg-[var(--site-surface)] px-4 py-2 text-sm outline-none focus:border-[var(--c-primary)] min-w-0";

export function PropertyListBlock({ c, properties }: { c: SectionContentMap["propertyList"]; properties?: PublicProperty[] }) {
  const fs = readContentStyles(c);
  const hs = headingStylesFrom(c);
  const fixed = c.purpose && c.purpose !== "all" ? c.purpose : "";
  const base = useMemo(
    () => (properties ?? []).filter((p) => (!fixed || p.purpose === fixed) && (!c.featuredOnly || p.featured)),
    [properties, fixed, c.featuredOnly],
  );
  const purposes = PURPOSES.filter((x) => base.some((p) => p.purpose === x.id));
  const bhks = [...new Set(base.map((p) => p.bhk).filter(Boolean))].sort();

  const [tab, setTab] = useState("");
  const [bhk, setBhk] = useState("");
  const [budget, setBudget] = useState("");
  const [q, setQ] = useState("");
  const [sort, setSort] = useState("new");

  const activePurpose = fixed || tab;
  const kind = budgetKind(activePurpose);
  const limit = c.limit && c.limit > 0 ? c.limit : 9;

  const list = useMemo(() => {
    const range = kind ? BUDGETS[kind].find((b) => b.id === budget) : undefined;
    const needle = q.trim().toLowerCase();
    const out = base.filter((p) =>
      (!tab || p.purpose === tab)
      && (!bhk || p.bhk === bhk)
      && (!range || (p.price >= range.min && p.price < range.max))
      && (!needle || `${p.locality} ${p.city} ${p.title}`.toLowerCase().includes(needle)));
    if (sort === "low") out.sort((a, b) => a.price - b.price);
    if (sort === "high") out.sort((a, b) => b.price - a.price);
    return out.slice(0, limit);
  }, [base, tab, bhk, budget, q, sort, kind, limit]);

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

        {c.showFilters && base.length > 0 && (
          <div className={`mb-10 ${RADIUS_LG} bg-light ring-1 ring-[var(--site-line)] p-4 sm:p-5 space-y-4`}>
            {!fixed && purposes.length > 1 && (
              <div className="flex flex-wrap gap-2" role="tablist">
                <button type="button" className={pill(!tab)} onClick={() => { setTab(""); setBudget(""); }}>All</button>
                {purposes.map((x) => (
                  <button key={x.id} type="button" className={pill(tab === x.id)} onClick={() => { setTab(x.id); setBudget(""); }}>{x.short}</button>
                ))}
              </div>
            )}
            {bhks.length > 1 && (
              <div className="flex flex-wrap gap-2">
                {bhks.map((b) => (
                  <button key={b} type="button" className={`${pill(bhk === b)} !px-3 !py-1.5 !text-xs`} onClick={() => setBhk(bhk === b ? "" : b)}>{b}</button>
                ))}
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search locality or city" className={INPUT} aria-label="Search locality" />
              <select value={budget} onChange={(e) => setBudget(e.target.value)} className={INPUT} aria-label="Budget" disabled={!kind}>
                <option value="">{kind ? "Any budget" : "Pick Buy / Rent for budget"}</option>
                {kind && BUDGETS[kind].map((b) => <option key={b.id} value={b.id}>{b.label}</option>)}
              </select>
              <select value={sort} onChange={(e) => setSort(e.target.value)} className={INPUT} aria-label="Sort">
                <option value="new">Newest first</option>
                <option value="low">Price: low to high</option>
                <option value="high">Price: high to low</option>
              </select>
            </div>
          </div>
        )}

        {list.length === 0 ? (
          <p className="text-center site-muted">{base.length ? "No listings match these filters." : c.emptyText || "New listings will appear here once they are published."}</p>
        ) : (
          <PropertyCards list={list} />
        )}
      </div>
    </section>
  );
}

// ─── Detail page widgets ─────────────────────────────────────────────────────

export function PropertyGallery({ images, title }: { images: string[]; title: string }) {
  const [i, setI] = useState(0);
  if (!images.length) return <ImageSlot w={1400} h={875} showBadge className={`w-full aspect-[16/10] ${RADIUS_LG}`} />;
  const go = (d: number) => setI((i + d + images.length) % images.length);
  return (
    <div className="space-y-3">
      <div className={`relative overflow-hidden ${RADIUS_LG} ring-1 ring-[var(--site-line)] bg-slate-100`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={images[i]} alt={`${title} — photo ${i + 1}`} className="w-full aspect-[16/10] object-cover" />
        {images.length > 1 && (
          <>
            <button type="button" aria-label="Previous photo" onClick={() => go(-1)} className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 text-slate-800 shadow flex items-center justify-center">
              <Icon name="arrow" className="w-4 h-4 rotate-180" />
            </button>
            <button type="button" aria-label="Next photo" onClick={() => go(1)} className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 text-slate-800 shadow flex items-center justify-center">
              <Icon name="arrow" className="w-4 h-4" />
            </button>
            <span className="absolute bottom-3 right-3 rounded-full bg-black/60 text-white text-xs px-2.5 py-1 tabular-nums">{i + 1} / {images.length}</span>
          </>
        )}
      </div>
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((src, k) => (
            <button key={src} type="button" onClick={() => setI(k)} aria-label={`Show photo ${k + 1}`}
              className={`shrink-0 w-20 sm:w-24 aspect-[4/3] rounded-lg overflow-hidden ring-2 ${k === i ? "ring-[var(--c-primary)]" : "ring-transparent opacity-70 hover:opacity-100"}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

const FIELD = "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-[var(--c-primary)] focus:ring-2 focus:ring-[var(--c-primary)]/20";
const initial: FormState = { ok: false, message: "" };

/** Site-visit / enquiry form → normal Lead (service = property title). Plus WhatsApp + Call. */
export function PropertyEnquiry({ title, purpose, phone, whatsapp }: { title: string; purpose: PropertyPurpose; phone?: string; whatsapp?: string }) {
  const [state, dispatch, pending] = useActionState(submitLead, initial);
  const tel = (phone || "").replace(/[^\d+]/g, "").slice(0, 20);
  // wa.me needs digits with country code; ponytail: bare 10-digit numbers are assumed Indian (+91).
  const waDigits = (whatsapp?.match(/wa\.me\/(\d+)/)?.[1] || whatsapp?.match(/phone=(\d+)/)?.[1] || tel.replace(/\D/g, ""));
  const waNum = waDigits.length === 10 ? `91${waDigits}` : waDigits;

  return (
    <div className={`${RADIUS_LG} bg-[var(--site-surface)] ring-1 ring-[var(--site-line)] shadow-[var(--site-shadow-lg)] p-5 sm:p-6`}>
      <h3 className="font-bold text-lg">{purpose === "pg" ? "Book a visit" : "Schedule a site visit"}</h3>
      <p className="text-sm site-muted mt-1 mb-4">Share your details and we&apos;ll call you back.</p>
      {state.ok ? (
        <div className="rounded-xl bg-green-50 border border-green-200 p-6 text-center">
          <Icon name="check" className="w-7 h-7 text-primary mx-auto mb-2" />
          <p className="text-green-800 font-medium text-sm">{state.message}</p>
        </div>
      ) : (
        <form
          className="space-y-3"
          action={(fd) => {
            const visit = String(fd.get("visitDate") || "");
            const note = String(fd.get("note") || "");
            fd.set("service", title);
            fd.set("message", [`Interested in: ${purposeLabel(purpose)}`, visit && `Preferred visit date: ${visit}`, note].filter(Boolean).join("\n"));
            dispatch(fd);
          }}
        >
          <input name="name" required placeholder="Your name" className={FIELD} />
          <input name="phone" required type="tel" placeholder="Mobile number" className={FIELD} />
          <input name="email" type="email" placeholder="Email (optional)" className={FIELD} />
          <label className="block">
            <span className="block text-xs font-medium text-slate-500 mb-1">Preferred visit date</span>
            <input name="visitDate" type="date" className={FIELD} />
          </label>
          <textarea name="note" rows={3} placeholder="Message (optional)" className={FIELD} defaultValue={`I'm interested in ${title}.`} />
          {state.message && <p className="text-sm text-red-600">{state.message}</p>}
          <button type="submit" disabled={pending} className="btn-primary w-full inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold disabled:opacity-60">
            {pending ? "Sending..." : "Request a call back"}
            {!pending && <Icon name="arrow" className="w-4 h-4" />}
          </button>
          <PrivacyConsent />
        </form>
      )}
      {(waNum || tel) && (
        <div className="grid grid-cols-2 gap-2 mt-4">
          {waNum && (
            <a
              href={`https://wa.me/${waNum}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => { e.currentTarget.href = `https://wa.me/${waNum}?text=${encodeURIComponent(`Hi, I'm interested in ${title} (${window.location.href})`)}`; }}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-500 hover:bg-green-600 text-white px-3 py-3 text-sm font-semibold"
            >
              <Icon name="whatsapp" className="w-4 h-4" /> WhatsApp
            </a>
          )}
          {tel && (
            <a href={`tel:${tel}`} className={`inline-flex items-center justify-center gap-2 rounded-xl ring-1 ring-inset ring-[var(--site-line)] px-3 py-3 text-sm font-semibold hover:text-primary ${waNum ? "" : "col-span-2"}`}>
              <Icon name="phone" className="w-4 h-4 text-primary" /> Call
            </a>
          )}
        </div>
      )}
    </div>
  );
}

export function EmiCalculator({ price }: { price: number }) {
  const [loan, setLoan] = useState(Math.round(price * 0.8));
  const [rate, setRate] = useState(8.5);
  const [years, setYears] = useState(20);
  const monthly = emi(loan, rate, years);
  const total = monthly * years * 12;
  const num = (v: string) => Math.max(0, Number(v) || 0);
  return (
    <div className={`${RADIUS_LG} bg-light ring-1 ring-[var(--site-line)] p-5 sm:p-6`}>
      <div className="grid sm:grid-cols-3 gap-3">
        <label className="block text-sm"><span className="block text-xs font-semibold site-muted mb-1">Loan amount (₹)</span>
          <input type="number" min={0} step={10000} value={loan} onChange={(e) => setLoan(num(e.target.value))} className={FIELD} /></label>
        <label className="block text-sm"><span className="block text-xs font-semibold site-muted mb-1">Interest rate (% p.a.)</span>
          <input type="number" min={0} max={30} step={0.05} value={rate} onChange={(e) => setRate(num(e.target.value))} className={FIELD} /></label>
        <label className="block text-sm"><span className="block text-xs font-semibold site-muted mb-1">Tenure (years)</span>
          <input type="number" min={1} max={40} value={years} onChange={(e) => setYears(num(e.target.value))} className={FIELD} /></label>
      </div>
      <div className="mt-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wider site-muted font-semibold">Monthly EMI</p>
          <p className="text-3xl font-extrabold text-primary tabular-nums">₹{monthly.toLocaleString("en-IN")}</p>
        </div>
        <p className="text-sm site-muted">Total interest {formatPrice(Math.max(0, total - loan))} · Loan {formatPrice(loan)}</p>
      </div>
    </div>
  );
}
