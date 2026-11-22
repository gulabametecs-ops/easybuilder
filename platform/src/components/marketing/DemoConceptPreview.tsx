"use client";

import { useEffect, useRef, useState } from "react";
import type { DemoDesign, DemoSector } from "./DemosExplorer";

const COPY: Record<string, { nav: string[]; cta: string; hero: string; sub: string; cards: string[] }> = {
  "ngo-charity": {
    nav: ["Causes", "Impact", "Get Involved", "Events", "Contact"],
    cta: "Donate Now",
    hero: "Every child deserves a chance to learn and grow.",
    sub: "Education, nutrition and healthcare — with 80G tax benefit on every gift.",
    cards: ["12,000 children supported", "80G tax exemption", "Volunteer with us"],
  },
  "social-foundation": {
    nav: ["About", "Initiatives", "Events", "Volunteer", "Contact"],
    cta: "Support Us",
    hero: "Health, skills and dignity — delivered on the ground.",
    sub: "Six grassroots programs. Public team. Live event reports.",
    cards: ["Health camps", "Financial literacy", "Livelihood skills"],
  },
  coaching: {
    nav: ["Courses", "Results", "Faculty", "Fees", "Free Demo"],
    cta: "Book Free Demo",
    hero: "Crack JEE, NEET, UPSC and SSC with expert faculty.",
    sub: "Small batches, weekly tests and a proven selection record.",
    cards: ["JEE / NEET", "UPSC & SSC", "Board tuition"],
  },
  school: {
    nav: ["About", "Academics", "Admissions", "Notices", "Contact"],
    cta: "Apply Now",
    hero: "A school where curiosity, character and results grow together.",
    sub: "CBSE curriculum, caring faculty and a campus your child will love.",
    cards: ["Academics", "Sports & arts", "Admissions open"],
  },
  "play-school": {
    nav: ["Programs", "Gallery", "Admissions", "Contact"],
    cta: "Book a Visit",
    hero: "A happy first school for ages 2 to 5.",
    sub: "Play-based learning, safe campus and warm teachers.",
    cards: ["Nursery", "LKG / UKG", "Day care"],
  },
  "primary-school": {
    nav: ["Academics", "Life at school", "Admissions", "Contact"],
    cta: "Enquire",
    hero: "Strong foundations for classes 1 to 5.",
    sub: "Activity-based learning with personal attention.",
    cards: ["English & maths", "Sports", "Transport"],
  },
  "education-consultancy": {
    nav: ["Destinations", "Services", "Success stories", "Contact"],
    cta: "Free counselling",
    hero: "Study in India or abroad — with a counsellor beside you.",
    sub: "University shortlists, visas and applications, handled end to end.",
    cards: ["Abroad", "In-India", "Visa support"],
  },
  "restaurant-hotel": {
    nav: ["Menu", "Reservations", "Gallery", "Contact"],
    cta: "Book a table",
    hero: "Food worth dressing up for.",
    sub: "Seasonal plates, warm service and a room for every occasion.",
    cards: ["Dining", "Private events", "Stay"],
  },
  "hospital-clinic": {
    nav: ["Departments", "Doctors", "Appointments", "Contact"],
    cta: "Book appointment",
    hero: "Care you can trust, close to home.",
    sub: "Specialists, diagnostics and 24×7 emergency support.",
    cards: ["OPD", "Lab & scans", "Emergency"],
  },
  "gym-fitness": {
    nav: ["Programs", "Trainers", "Timings", "Join"],
    cta: "Start free trial",
    hero: "Train hard. Feel better. Stay consistent.",
    sub: "Strength, cardio and classes with coaches who know your name.",
    cards: ["Gym floor", "Group classes", "Personal training"],
  },
  pharmacy: {
    nav: ["Medicines", "Upload Rx", "Lab tests", "Contact"],
    cta: "Order now",
    hero: "Medicines, prescriptions and lab tests — delivered.",
    sub: "Genuine stock, home delivery and a chemist you can call.",
    cards: ["Prescription", "OTC", "Lab tests"],
  },
  "wholesale-shop": {
    nav: ["Catalogue", "Bulk order", "About", "Contact"],
    cta: "Request quote",
    hero: "Wholesale prices. Reliable supply.",
    sub: "Stock for retailers — clear MOQs and fast dispatch.",
    cards: ["Grocery", "FMCG", "Bulk packs"],
  },
  manufacturing: {
    nav: ["Products", "Capacity", "Enquiry", "Contact"],
    cta: "Get a quote",
    hero: "Made to spec. Delivered on time.",
    sub: "Custom manufacturing and bulk orders for brands that need a factory partner.",
    cards: ["OEM", "Private label", "Export"],
  },
  "skill-learning": {
    nav: ["Classes", "Schedule", "Faculty", "Enroll"],
    cta: "Book a trial",
    hero: "Learn a skill you will actually use.",
    sub: "Karate, music, dance and more — small batches, real progress.",
    cards: ["Karate", "Music", "Dance"],
  },
  "home-services": {
    nav: ["Services", "Pricing", "Reviews", "Contact"],
    cta: "Get a quote",
    hero: "Electrician, plumber, carpenter — same-day help.",
    sub: "Trained technicians, clear prices, work guaranteed.",
    cards: ["Electrical", "Plumbing", "Painting"],
  },
  "events-training": {
    nav: ["Events", "Speakers", "Tickets", "Contact"],
    cta: "Register now",
    hero: "Learn from people who do the work.",
    sub: "Webinars, workshops and flagship conferences — book your seat.",
    cards: ["Webinars", "Workshops", "Corporate"],
  },
};

function copyFor(sector: DemoSector) {
  const base = COPY[sector.id] ?? {
    nav: ["About", "Services", "Gallery", "Contact"],
    cta: "Get in touch",
    hero: sector.name,
    sub: sector.tagline,
    cards: ["Quality work", "Fair prices", "Easy booking"],
  };
  // Cards show the business's real first services when we know them.
  return sector.services?.length === 3 ? { ...base, cards: sector.services } : base;
}

const DESKTOP_W = 1280;
const DESKTOP_H = 800;

/** Desktop-sized homepage mock, scaled to the left pane. */
export function DemoConceptPreview({
  sector,
  design,
  bare = false,
}: {
  sector: DemoSector;
  design: DemoDesign;
  /** Hide the "Desktop preview · X look" caption. */
  bare?: boolean;
}) {
  const c = design.colors;
  const copy = copyFor(sector);
  // Scale the 1280px mock to the frame width. (CSS scale() can't take cqw: length ÷ number isn't a number.)
  const box = useRef<HTMLDivElement>(null);
  const [k, setK] = useState(0);
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setK(e.contentRect.width / DESKTOP_W));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const darkHeader = design.header === "bold";
  const centered = design.header === "centered";
  const minimal = design.header === "minimal";
  const modern = design.header === "modern";
  const heroCentered = centered || design.hero === "centered" || design.hero === "minimal";
  const heroImg = sector.photos?.[0] || sector.image;
  const heroBg =
    design.hero === "gradient"
      ? `linear-gradient(135deg, ${c.dark} 0%, ${c.secondary} 55%, ${c.primary} 100%)`
      : design.hero === "split" || design.hero === "minimal" || design.hero === "centered"
        ? c.light
        : `linear-gradient(120deg, ${c.secondary}, ${c.primaryDark})`;

  return (
    <div className="flex h-full min-h-0 w-full flex-col justify-center">
      <div
        className="w-full"
        style={{
          containerType: "inline-size",
        }}
      >
        <div ref={box} className="relative w-full overflow-hidden rounded-2xl shadow-[0_24px_80px_rgba(0,0,0,0.45)] ring-1 ring-white/20" style={{ height: `calc(${DESKTOP_H} / ${DESKTOP_W} * 100cqw)` }}>
          <div
            className="absolute left-0 top-0 origin-top-left bg-white"
            style={{
              width: DESKTOP_W,
              height: DESKTOP_H,
              transform: `scale(${k})`,
              visibility: k ? "visible" : "hidden",
            }}
          >
            <DesktopChrome host={`${sector.name.toLowerCase().replace(/[^a-z0-9]+/g, "")}.sitepixl.com`} />

            <header
              className="flex h-[72px] items-center justify-between gap-6 px-10"
              style={darkHeader ? { background: c.dark } : { background: "#fff", boxShadow: "0 1px 0 rgba(0,0,0,0.06)" }}
            >
              {modern ? (
                <div className="flex w-full items-center justify-between rounded-full px-5 py-2.5 shadow-sm ring-1 ring-black/5" style={{ background: "#fff" }}>
                  <BrandMark sector={sector} color={c.heading} onDark={false} accent={c.primary} />
                  <Nav items={copy.nav} color={c.heading} />
                  <Cta label={copy.cta} bg={c.primary} />
                </div>
              ) : centered ? (
                <div className="flex w-full flex-col items-center gap-2">
                  <BrandMark sector={sector} color={c.heading} onDark={false} accent={c.primary} />
                  <Nav items={copy.nav} color={c.heading} />
                </div>
              ) : (
                <>
                  <BrandMark sector={sector} color={darkHeader ? "#fff" : c.heading} onDark={darkHeader} accent={c.primary} />
                  {!minimal && <Nav items={copy.nav} color={darkHeader ? "rgba(255,255,255,0.82)" : c.heading} />}
                  <Cta label={copy.cta} bg={c.primary} />
                </>
              )}
            </header>

            <div className="relative overflow-hidden" style={{ height: 488, background: heroBg }}>
              {design.hero === "split" ? (
                <div className="grid h-full grid-cols-2">
                  <HeroCopy copy={copy} ink={c.heading} cta={c.primary} />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={heroImg} alt="" className="h-full w-full object-cover" />
                </div>
              ) : (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={heroImg} alt="" className="absolute inset-0 h-full w-full object-cover" />
                  {/* premium scrim: a deep brand-tinted gradient keeps the photo vivid and the text crisp */}
                  <div
                    className="absolute inset-0"
                    style={{
                      background: heroCentered
                        ? `linear-gradient(180deg, ${c.dark}55 0%, ${c.dark}99 55%, ${c.dark}d9 100%)`
                        : `linear-gradient(90deg, ${c.dark}f0 0%, ${c.dark}b3 40%, ${c.dark}33 72%, transparent 100%)`,
                    }}
                  />
                  <HeroCopy copy={copy} ink="#fff" cta={c.primary} badge={sector.tagline} centered={heroCentered} />
                </>
              )}
            </div>

            <div className="grid grid-cols-3 gap-5 px-10 py-6" style={{ background: c.light, height: 204 }}>
              {copy.cards.map((card, i) => {
                const photo = sector.photos?.[i + 1];
                return (
                  <div
                    key={card}
                    className="flex overflow-hidden rounded-2xl bg-white"
                    style={{ boxShadow: "0 1px 2px rgba(15,23,42,0.06), 0 0 0 1px rgba(15,23,42,0.05), 0 12px 28px -14px rgba(15,23,42,0.25)" }}
                  >
                    {photo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={photo} alt="" className="h-full w-[42%] shrink-0 object-cover" />
                    ) : (
                      <span className="h-full w-[42%] shrink-0" style={{ background: `linear-gradient(135deg, ${i === 1 ? c.accent : c.primary}, ${c.dark})` }} />
                    )}
                    <div className="flex min-w-0 flex-col justify-center gap-2 px-5">
                      <span className="h-1 w-8 rounded-full" style={{ background: i === 1 ? c.accent : c.primary }} />
                      <span className="text-[18px] font-bold leading-snug" style={{ color: c.heading, fontFamily: "var(--font-mkt-display), inherit" }}>
                        {card}
                      </span>
                      <span className="text-[13px] font-semibold" style={{ color: c.primary }}>
                        View details →
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      {!bare && <p className="mt-3 text-center text-[11px] font-medium tracking-wide text-[var(--mkt-text-muted)]">
        Desktop preview · {design.name} look
      </p>}
    </div>
  );
}

function DesktopChrome({ host }: { host: string }) {
  return (
    <div className="flex h-9 items-center gap-3 border-b border-black/[0.06] bg-[#ecebe7] px-3">
      <span className="flex gap-1.5">
        <span className="h-[11px] w-[11px] rounded-full bg-[#ff5f57]" />
        <span className="h-[11px] w-[11px] rounded-full bg-[#febc2e]" />
        <span className="h-[11px] w-[11px] rounded-full bg-[#28c840]" />
      </span>
      <span className="mx-auto flex h-6 w-[420px] items-center justify-center rounded-md bg-white text-[11px] text-slate-500 shadow-sm">
        https://{host}
      </span>
    </div>
  );
}

function BrandMark({
  sector,
  color,
  onDark,
  accent,
}: {
  sector: DemoSector;
  color: string;
  onDark: boolean;
  accent?: string;
}) {
  return (
    <span className="flex min-w-0 items-center gap-2.5">
      <span
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[11px] font-black text-white"
        style={{ background: accent || color }}
      >
        {sector.name.replace(/[^A-Za-z]/g, "").slice(0, 2).toUpperCase()}
      </span>
      <span className="truncate text-[17px] font-bold tracking-tight" style={{ color: onDark ? "#fff" : color }}>
        {sector.name}
      </span>
    </span>
  );
}

function Nav({ items, color }: { items: string[]; color: string }) {
  return (
    <span className="flex items-center gap-6">
      {items.map((n) => (
        <span key={n} className="text-[14px] font-medium" style={{ color }}>
          {n}
        </span>
      ))}
    </span>
  );
}

function Cta({ label, bg }: { label: string; bg: string }) {
  return (
    <span className="shrink-0 rounded-full px-5 py-2 text-[13px] font-semibold text-white" style={{ background: bg }}>
      {label}
    </span>
  );
}

function HeroCopy({
  copy,
  ink,
  cta,
  badge,
  centered,
}: {
  copy: { hero: string; sub: string; cta: string };
  ink: string;
  cta: string;
  badge?: string;
  centered?: boolean;
}) {
  return (
    <div className={`relative flex h-full max-w-[680px] flex-col justify-center gap-5 px-14 ${centered ? "mx-auto items-center text-center" : "items-start"}`}>
      {badge && (
        <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-[12px] font-semibold uppercase tracking-[0.14em] text-white backdrop-blur">
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: cta }} />
          {badge}
        </span>
      )}
      <p className="text-[46px] font-extrabold leading-[1.08] tracking-[-0.02em]" style={{ color: ink, fontFamily: "var(--font-mkt-display), inherit", textShadow: "0 2px 24px rgba(0,0,0,0.25)" }}>
        {copy.hero}
      </p>
      <p className="max-w-[500px] text-[18px] leading-relaxed" style={{ color: ink, opacity: 0.85 }}>
        {copy.sub}
      </p>
      <span className="mt-1 flex gap-3">
        <span className="rounded-full px-7 py-3 text-[15px] font-semibold text-white shadow-lg" style={{ background: cta, boxShadow: `0 10px 30px -10px ${cta}` }}>
          {copy.cta}
        </span>
        <span className="rounded-full border border-white/40 px-7 py-3 text-[15px] font-semibold text-white backdrop-blur">Call now</span>
      </span>
    </div>
  );
}
