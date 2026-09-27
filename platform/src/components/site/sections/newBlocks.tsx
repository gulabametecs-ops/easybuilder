"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Icon } from "../Icon";
import { IMAGE_SLOTS } from "@/lib/img";
import { ImageSlot } from "../ImageSlot";
import type { SectionContentMap } from "@/lib/config";
import { safeHref } from "@/lib/sanitizeHtml";
import { headingStylesFrom, textStyleProps, cardStyleCss, readContentStyles, readItemStyle, type FieldStyle } from "@/lib/fieldStyle";

const WRAP = "mx-auto px-4 sm:px-6";
const PANEL = "rounded-[calc(var(--site-radius)*1.6)] bg-[var(--site-surface)] ring-1 ring-[var(--site-line)] shadow-[var(--site-shadow-sm)]";

// ─── Hero slideshow (auto-rotating, multi-slide, each slide editable) ─────────
export function HeroSlideshowBlock({ c }: { c: SectionContentMap["hero"] }) {
  const fs = readContentStyles(c);
  const slides = c.slides && c.slides.length
    ? c.slides
    : [{ titleTop: c.titleTop, titleHighlight: c.titleHighlight, description: c.description, image: c.image, primaryBtn: c.primaryBtn, secondaryBtn: c.secondaryBtn }];
  const n = slides.length;
  const [i, setI] = useState(0);
  useEffect(() => {
    if (n <= 1) return;
    const t = setInterval(() => setI((x) => (x + 1) % n), 6000);
    return () => clearInterval(t);
  }, [n]);
  const go = (d: number) => setI((x) => (x + d + n) % n);
  const s = slides[i];
  const slide = s as typeof s & { __styles?: Record<string, FieldStyle> };
  const ss = slide.__styles ?? fs;
  return (
    <section className="site-on-dark relative bg-dark text-white overflow-hidden">
      {slides.map((sl, idx) => (
        <div key={idx} aria-hidden={idx !== i} className={`absolute inset-0 transition-opacity duration-1000 ${idx === i ? "opacity-100" : "opacity-0"}`}>
          <div className={`absolute inset-0 ${idx === i ? "site-kenburns" : ""}`}>
            <ImageSlot
              src={sl.image}
              w={IMAGE_SLOTS.hero.w}
              h={IMAGE_SLOTS.hero.h}
              className="w-full h-full"
              imgClassName="w-full h-full object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--c-dark)] via-[var(--c-dark)]/70 to-[var(--c-dark)]/40" />
        </div>
      ))}
      <div aria-hidden className="site-blob w-[36rem] h-[20rem] left-1/2 -translate-x-1/2 -bottom-40 opacity-25" />
      <div key={i} className={`relative ${WRAP} max-w-5xl py-28 sm:py-32 lg:py-44 text-center min-h-[520px] flex flex-col justify-center motion-safe:animate-[site-fade-up_0.7s_ease-out_both]`}>
        {c.badge && (
          <span className="self-center inline-flex items-center gap-2 rounded-full bg-white/10 ring-1 ring-inset ring-white/15 backdrop-blur px-3.5 py-1.5 mb-7 text-xs font-semibold tracking-wide" {...textStyleProps(fs.badge)}>
            <span className="h-2 w-2 rounded-full bg-primary" aria-hidden />
            {c.badge}
          </span>
        )}
        <h1 className="text-[2.6rem] leading-[1.05] sm:text-6xl lg:text-7xl font-extrabold text-white" {...textStyleProps(ss.titleTop)}>
          {s.titleTop}{" "}
          <span className="text-primary" {...textStyleProps(ss.titleHighlight)}>{s.titleHighlight}</span>
        </h1>
        {s.description && <p className="mt-6 text-white/75 text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto" {...textStyleProps(ss.description)}>{s.description}</p>}
        <div className="mt-9 flex flex-wrap gap-3 justify-center">
          {s.primaryBtn?.label && <Link href={safeHref(s.primaryBtn.href || "") || "#"} className="btn-primary inline-flex items-center gap-2 px-7 py-4 font-semibold">{s.primaryBtn.label} <Icon name="arrow" className="w-4 h-4" /></Link>}
          {s.secondaryBtn?.label && <Link href={safeHref(s.secondaryBtn.href || "") || "#"} className="btn-outline inline-flex items-center gap-2 px-7 py-4 font-semibold">{s.secondaryBtn.label}</Link>}
        </div>
      </div>
      {n > 1 && (
        <>
          <button aria-label="Previous" onClick={() => go(-1)} className="hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 ring-1 ring-inset ring-white/20 backdrop-blur hover:bg-white/20 items-center justify-center transition-colors"><Icon name="arrow" className="w-5 h-5 rotate-180" /></button>
          <button aria-label="Next" onClick={() => go(1)} className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 ring-1 ring-inset ring-white/20 backdrop-blur hover:bg-white/20 items-center justify-center transition-colors"><Icon name="arrow" className="w-5 h-5" /></button>
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 rounded-full bg-black/20 backdrop-blur px-3 py-2">
            {slides.map((_, idx) => <button key={idx} aria-label={`Slide ${idx + 1}`} aria-current={idx === i} onClick={() => setI(idx)} className={`h-1.5 rounded-full transition-all duration-300 ${idx === i ? "w-7 bg-primary" : "w-1.5 bg-white/50 hover:bg-white/80"}`} />)}
          </div>
        </>
      )}
    </section>
  );
}

function Heading({ eyebrow, title, highlight, content }: { eyebrow?: string; title: string; highlight?: string; content?: unknown }) {
  const styles = headingStylesFrom(content);
  return (
    <div className="sec-heading">
      {eyebrow && <p className="site-eyebrow mb-5" {...textStyleProps(styles.eyebrow)}>{eyebrow}</p>}
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold" {...textStyleProps(styles.title)}>
        {title} {highlight && <span className="text-primary" {...textStyleProps(styles.titleHighlight)}>{highlight}</span>}
      </h2>
    </div>
  );
}

// ─── Notice board (live updates: results, admissions, events, holidays) ───────
const NOTICE_CAT: Record<string, string> = {
  result: "bg-emerald-100 text-emerald-700",
  admission: "bg-blue-100 text-blue-700",
  event: "bg-amber-100 text-amber-700",
  holiday: "bg-rose-100 text-rose-700",
  exam: "bg-purple-100 text-purple-700",
  news: "bg-slate-100 text-slate-600",
};

type LiveNotice = { date: string; title: string; category: string; link: string; isNew: boolean; attachmentUrl?: string; attachmentName?: string };

export function NoticeBoardBlock({ c, liveNotices }: { c: SectionContentMap["noticeBoard"]; liveNotices?: LiveNotice[] }) {
  // Admin-managed notices take over as soon as any exist; otherwise the
  // template's own sample notices are shown.
  const source: LiveNotice[] = liveNotices && liveNotices.length ? liveNotices : (c.notices ?? []);
  const notices = c.limit && c.limit > 0 ? source.slice(0, c.limit) : source;
  const limited = !!(c.limit && source.length > c.limit);

  return (
    <section className="site-sec py-20 sm:py-28 bg-light">
      <div className={`${WRAP} max-w-4xl`}>
        <Heading eyebrow={c.eyebrow} title={c.title} highlight={c.titleHighlight} content={c} />
        <div className={`${PANEL} overflow-hidden`}>
          <div className="flex items-center gap-2.5 px-5 sm:px-6 py-4 text-white [background:linear-gradient(100deg,var(--c-dark),color-mix(in_srgb,var(--c-primary)_35%,var(--c-dark)))]">
            <span className="relative flex h-2.5 w-2.5">
              <span className="motion-safe:animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary" />
            </span>
            <span className="font-semibold text-sm tracking-wide">Latest Updates</span>
            <span className="ml-auto text-[10px] font-semibold uppercase tracking-wider bg-white/15 ring-1 ring-inset ring-white/15 rounded-full px-2.5 py-1">Notice Board</span>
          </div>
          {notices.length === 0 ? (
            <p className="site-muted px-5 py-12 text-center text-sm">No notices posted yet.</p>
          ) : (
            <ul className="divide-y divide-[var(--site-line)] max-h-[480px] overflow-auto">
              {notices.map((n, i) => {
                const parts = (n.date || "").split(" ");
                const cat = NOTICE_CAT[(n.category || "").toLowerCase()] ?? NOTICE_CAT.news;
                const href = n.link || n.attachmentUrl || "";
                const inner = (
                  <>
                    <div className="flex flex-col items-center justify-center rounded-[calc(var(--site-radius)*0.9)] bg-primary/10 ring-1 ring-inset ring-primary/15 w-14 h-14 shrink-0">
                      <span className="text-lg font-extrabold leading-none tabular-nums">{parts[0] || "•"}</span>
                      <span className="site-muted text-[9px] uppercase mt-1 tracking-wider font-semibold">{parts[1] || ""}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        {n.category && <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${cat}`}>{n.category}</span>}
                        {n.isNew && <span className="text-[10px] font-bold text-white bg-red-500 px-2 py-0.5 rounded-full motion-safe:animate-pulse">NEW</span>}
                        {n.attachmentUrl && <Icon name="clipboard" className="w-3.5 h-3.5 text-primary" />}
                      </div>
                      <p className="text-sm sm:text-[0.95rem] font-medium group-hover:text-primary transition-colors leading-snug">{n.title}</p>
                    </div>
                    {href && <Icon name="arrow" className="w-4 h-4 opacity-30 group-hover:opacity-100 group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" />}
                  </>
                );
                return (
                  <li key={i}>
                    {href ? (
                      <Link href={href} target={!n.link && n.attachmentUrl ? "_blank" : undefined} className="group flex items-center gap-4 px-5 sm:px-6 py-4 hover:bg-primary/[0.05] transition-colors">{inner}</Link>
                    ) : (
                      <div className="group flex items-center gap-4 px-5 sm:px-6 py-4">{inner}</div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
          {limited && (
            <Link href="/notices" className="flex items-center justify-center gap-1.5 py-4 text-sm font-semibold text-primary hover:bg-primary/[0.05] border-t border-[var(--site-line)] transition-colors">
              View all notices <Icon name="arrow" className="w-4 h-4" />
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}

// ─── Toppers / results showcase (medals, glassmorphism on dark) ───────────────
const MEDAL: Record<string, string> = { "1": "🥇", "2": "🥈", "3": "🥉" };

export function ToppersBlock({ c }: { c: SectionContentMap["toppers"] }) {
  const allCards = readContentStyles(c).items;
  return (
    <section className="site-on-dark py-20 sm:py-28 bg-dark text-white relative overflow-hidden">
      <div aria-hidden className="site-blob w-[30rem] h-[30rem] -top-48 left-[10%] opacity-30" />
      <div aria-hidden className="site-blob w-[26rem] h-[26rem] -bottom-48 right-[5%] opacity-20" />
      <div className={`relative ${WRAP} max-w-6xl`}>
        <Heading eyebrow={c.eyebrow} title={c.title} highlight={c.titleHighlight} content={c} />
        <div className="grid gap-5 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {(c.items ?? []).map((t, i) => {
            const row = t as typeof t & { __style?: FieldStyle; __styles?: Record<string, FieldStyle> };
            const fs = row.__styles ?? {};
            return (
              <div key={i} className="relative backdrop-blur p-7 text-center site-lift sec-card" style={cardStyleCss(readItemStyle(row) ?? allCards)}>
                <div className="absolute top-3 right-3 text-2xl">{MEDAL[t.rank] ?? (t.rank ? <span className="text-xs font-bold bg-primary text-white rounded-full px-2 py-1">#{t.rank}</span> : null)}</div>
                <div className="w-24 h-24 mx-auto rounded-full p-1 bg-gradient-to-br from-primary to-white/20">
                  <div className="w-full h-full rounded-full overflow-hidden bg-white/10">
                    <ImageSlot
                      src={t.image}
                      alt={t.name}
                      w={IMAGE_SLOTS.toppers.w}
                      h={IMAGE_SLOTS.toppers.h}
                      className="w-full h-full"
                      showBadge={false}
                    />
                  </div>
                </div>
                <p className="mt-5 font-bold text-lg text-[var(--card-text,#fff)]" {...textStyleProps(fs.name)}>{t.name}</p>
                <p className="site-muted text-xs mt-0.5" {...textStyleProps(fs.exam)}>{t.exam}</p>
                {t.score && <p className="mt-4 text-3xl font-extrabold tracking-tight tabular-nums text-primary" {...textStyleProps(fs.score)}>{t.score}</p>}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── Downloads / prospectus ───────────────────────────────────────────────────
export function DownloadsBlock({ c }: { c: SectionContentMap["downloads"] }) {
  const allCards = readContentStyles(c).items;
  return (
    <section className="site-sec py-20 sm:py-28">
      <div className={`${WRAP} max-w-6xl`}>
        <Heading eyebrow={c.eyebrow} title={c.title} highlight={c.titleHighlight} content={c} />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {(c.items ?? []).map((d, i) => {
            const row = d as typeof d & { __style?: FieldStyle; __styles?: Record<string, FieldStyle> };
            const fs = row.__styles ?? {};
            return (
              <div key={i} className="group p-7 site-lift flex flex-col sec-card" style={cardStyleCss(readItemStyle(row) ?? allCards)}>
                <div className="w-12 h-12 rounded-[calc(var(--site-radius)*0.9)] bg-primary/10 text-primary ring-1 ring-inset ring-primary/15 flex items-center justify-center mb-5 group-hover:bg-primary group-hover:text-white transition-colors">
                  <Icon name={d.icon || "book"} className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-lg" {...textStyleProps(fs.title)}>{d.title}</h3>
                {d.description && <p className="site-muted text-sm mt-2 flex-1 leading-relaxed" {...textStyleProps(fs.description)}>{d.description}</p>}
                {d.link ? (
                  <a href={safeHref(d.link) || "#"} target="_blank" rel="noopener" download className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:gap-2.5 transition-all">
                    Download <Icon name="arrow" className="w-4 h-4" />
                  </a>
                ) : (
                  <span className="site-muted mt-5 inline-block text-xs">Available soon</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── Pricing plans ────────────────────────────────────────────────────────────
export function PricingPlansBlock({ c }: { c: SectionContentMap["pricingPlans"] }) {
  const allCards = readContentStyles(c).plans;
  return (
    <section className="site-sec py-20 sm:py-28 bg-light">
      <div className={`${WRAP} max-w-7xl`}>
        <Heading eyebrow={c.eyebrow} title={c.title} highlight={c.titleHighlight} content={c} />
        <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto items-stretch">
          {(c.plans ?? []).map((p, i) => {
            const row = p as typeof p & { __style?: FieldStyle; __styles?: Record<string, FieldStyle> };
            const fs = row.__styles ?? {};
            return (
              <div
                key={i}
                className={`relative p-8 flex flex-col sec-card site-lift ${p.featured ? "md:-my-3 ring-2 ring-primary shadow-[0_24px_48px_-20px_color-mix(in_srgb,var(--c-primary)_45%,transparent)]" : ""}`}
                style={cardStyleCss(readItemStyle(row) ?? allCards)}
              >
                {p.featured && <span className="self-start rounded-full bg-primary text-white text-[10px] font-bold tracking-wider px-3 py-1 mb-4">MOST POPULAR</span>}
                <h3 className="text-lg font-semibold" {...textStyleProps(fs.name)}>{p.name}</h3>
                <div className="mt-4 mb-6 flex items-baseline gap-1">
                  <span className="text-5xl font-extrabold tracking-[-0.04em] tabular-nums text-[var(--card-text,var(--c-heading))]" {...textStyleProps(fs.price)}>{p.price}</span>
                  <span className="site-muted text-sm" {...textStyleProps(fs.period)}>{p.period}</span>
                </div>
                <ul className="space-y-3 flex-1 pt-6 border-t border-[var(--site-line)]">
                  {(p.features ?? []).filter(Boolean).map((f, j) => (
                    <li key={j} className="flex items-start gap-2.5 text-sm" {...textStyleProps(fs.features)}>
                      <span className="mt-0.5 w-[1.1rem] h-[1.1rem] rounded-full bg-primary/15 text-primary flex items-center justify-center shrink-0"><Icon name="check" className="w-3 h-3" strokeWidth={3} /></span> {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href={p.buttonHref || "#"}
                  className={`mt-8 text-center px-5 py-3.5 text-sm font-semibold ${p.featured ? "btn-primary" : "btn-ghost"}`}
                  {...textStyleProps(fs.buttonLabel)}
                >
                  {p.buttonLabel || "Choose"}
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── Opening hours ────────────────────────────────────────────────────────────
export function OpeningHoursBlock({ c }: { c: SectionContentMap["openingHours"] }) {
  const fs = readContentStyles(c);
  return (
    <section className="site-sec py-20 sm:py-28">
      <div className={`${WRAP} max-w-3xl`}>
        <Heading eyebrow={c.eyebrow} title={c.title} highlight={c.titleHighlight} content={c} />
        <div className={`${PANEL} overflow-hidden divide-y divide-[var(--site-line)]`}>
          {(c.days ?? []).map((d, i) => {
            const row = d as typeof d & { __styles?: Record<string, FieldStyle> };
            const t = row.__styles ?? {};
            const closed = /closed/i.test(d.hours);
            return (
              <div key={i} className="flex items-center justify-between gap-4 px-5 sm:px-7 py-4 hover:bg-primary/[0.04] transition-colors">
                <span className="font-medium flex items-center gap-3" {...textStyleProps(t.day)}>
                  <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0"><Icon name="clock" className="w-4 h-4" /></span>
                  {d.day}
                </span>
                <span className={`text-sm font-semibold tabular-nums rounded-full px-3 py-1 ${closed ? "bg-red-500/10 text-red-500" : "bg-primary/10 text-primary"}`} {...textStyleProps(t.hours)}>{d.hours}</span>
              </div>
            );
          })}
        </div>
        {c.note && <p className="site-muted text-center text-sm mt-5" {...textStyleProps(fs.note)}>{c.note}</p>}
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
  const hs = headingStylesFrom(c);
  const fs = readContentStyles(c);
  const box = (val: number, label: string) => (
    <div className="flex flex-col items-center">
      <span className="text-4xl sm:text-6xl font-extrabold tracking-[-0.04em] tabular-nums bg-white/[0.07] ring-1 ring-inset ring-white/15 backdrop-blur rounded-[calc(var(--site-radius)*1.2)] px-3 sm:px-5 py-3 sm:py-4 min-w-[68px] sm:min-w-[104px] text-center">{String(val).padStart(2, "0")}</span>
      <span className="text-[10px] sm:text-xs uppercase tracking-[0.16em] font-semibold mt-3 text-white/60">{label}</span>
    </div>
  );
  return (
    <section className="site-on-dark py-20 sm:py-28 bg-dark text-white text-center relative overflow-hidden">
      <div aria-hidden className="site-blob w-[36rem] h-[22rem] left-1/2 -translate-x-1/2 -top-40 opacity-30" />
      <div aria-hidden className="site-gridlines" />
      <div className={`relative ${WRAP} max-w-4xl`}>
        {c.eyebrow && <p className="site-eyebrow mb-5" {...textStyleProps(hs.eyebrow)}>{c.eyebrow}</p>}
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold" {...textStyleProps(hs.title)}>
          {c.title}{" "}
          <span className="text-primary" {...textStyleProps(hs.titleHighlight)}>{c.titleHighlight}</span>
        </h2>
        {c.subtitle && <p className="mt-4 text-lg text-white/70" {...textStyleProps(fs.subtitle)}>{c.subtitle}</p>}
        <div className="mt-10 flex items-start justify-center gap-2.5 sm:gap-5">
          {left ? (<>{box(left.d, "Days")}{box(left.h, "Hours")}{box(left.m, "Mins")}{box(left.s, "Secs")}</>)
            : <p className="text-white/50">{c.targetDate ? "Loading…" : "Set a target date in the editor."}</p>}
        </div>
        {c.buttonLabel && (
          <Link href={c.buttonHref || "#"} className="btn-primary inline-flex items-center gap-2 mt-10 px-7 py-4 text-sm font-semibold" {...textStyleProps(fs.buttonLabel)}>{c.buttonLabel} <Icon name="arrow" className="w-4 h-4" /></Link>
        )}
      </div>
    </section>
  );
}

// ─── Map ──────────────────────────────────────────────────────────────────────
export function MapBlock({ c }: { c: SectionContentMap["map"] }) {
  const fs = readContentStyles(c);
  return (
    <section className="site-sec py-20 sm:py-28">
      <div className={`${WRAP} max-w-7xl`}>
        <Heading eyebrow={c.eyebrow} title={c.title} highlight={c.titleHighlight} content={c} />
        {c.address && (
          <p className="-mt-6 mb-8 flex items-center justify-center" {...textStyleProps(fs.address)}>
            <span className="inline-flex items-center gap-2 rounded-full bg-[var(--site-surface)] ring-1 ring-[var(--site-line)] shadow-sm px-4 py-2 text-sm"><Icon name="map" className="w-4 h-4 text-primary shrink-0" /> {c.address}</span>
          </p>
        )}
        <div className={`${PANEL} overflow-hidden aspect-[4/3] sm:aspect-[16/7] bg-slate-100`}>
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
