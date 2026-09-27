"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight, Phone, Star, Wrench, Droplets, Paintbrush,
  MapPin, Mail, Camera, MessageSquare, Clock, Palette, Inbox,
  FileStack, Images, CalendarClock, Search, LayoutDashboard,
  Megaphone, ScrollText, Rocket, Receipt, Settings,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { stockImg } from "@/lib/img";

export function MarketingHero({ startPrice }: { startPrice: string }) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setOn(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <section className="relative isolate overflow-hidden bg-[var(--mkt-bg)]">
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="mkt-hero-wash absolute inset-0" />
        <div className="absolute inset-0 opacity-[0.35] dark:opacity-[0.08] [background-image:radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:28px_28px] [mask-image:radial-gradient(ellipse_at_70%_40%,black_15%,transparent_72%)]" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 lg:pt-28 pb-16 sm:pb-20">
        <div className="grid lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] gap-10 xl:gap-12 items-center">
          {/* Left — admin features aligned */}
          <div className="text-center lg:text-left max-w-xl mx-auto lg:mx-0">
            <p
              className={`inline-flex items-center gap-2 text-sm font-medium text-lime-700 dark:text-lime-400 transition duration-500 ${
                on ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
              }`}
            >
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-lime-500 animate-pulse" />
              Full admin panel for every client site
            </p>

            <h1
              className={`mt-4 text-[clamp(2.1rem,4vw,3rem)] font-bold tracking-[-0.035em] leading-[1.05] text-slate-900 dark:text-white transition duration-500 delay-75 ${
                on ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
              }`}
            >
              Your business website,{" "}
              <span className="text-lime-600 dark:text-lime-400">live in minutes.</span>
            </h1>

            <p
              className={`mt-3 text-lg sm:text-xl font-semibold tracking-tight text-slate-800 dark:text-slate-100 transition duration-500 delay-100 ${
                on ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
              }`}
            >
              Build, edit and run client websites from one admin.
            </p>

            <p
              className={`mt-3 text-[15px] leading-relaxed text-slate-600 dark:text-slate-400 max-w-md mx-auto lg:mx-0 transition duration-500 delay-150 ${
                on ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
              }`}
            >
              Dashboard, leads, appointments, appearance, pages, services, gallery, notices, results, SEO, marketing, billing and settings — all in one admin.
            </p>

            <ul
              className={`mt-6 grid sm:grid-cols-2 gap-2.5 text-left max-w-lg mx-auto lg:mx-0 transition duration-500 delay-200 ${
                on ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
              }`}
            >
              {[
                { icon: LayoutDashboard, t: "Dashboard & analytics" },
                { icon: Inbox, t: "Leads & appointments" },
                { icon: Palette, t: "Appearance & pages builder" },
                { icon: Wrench, t: "Services, gallery & notices" },
                { icon: ScrollText, t: "Results publishing" },
                { icon: Rocket, t: "SEO & marketing campaigns" },
              ].map(({ icon: Icon, t }) => (
                <li key={t} className="flex items-center gap-2.5 text-sm text-slate-700 dark:text-slate-300">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-lime-500/15 text-lime-700 dark:bg-lime-400/10 dark:text-lime-400">
                    <Icon className="w-3.5 h-3.5" strokeWidth={2.25} />
                  </span>
                  {t}
                </li>
              ))}
            </ul>

            <div
              className={`mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-3 transition duration-500 delay-250 ${
                on ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
              }`}
            >
              <Link
                href="/subscribe"
                className="inline-flex items-center gap-2 rounded-lg bg-lime-500 text-slate-950 font-semibold px-5 py-3 text-sm hover:bg-lime-400 transition shadow-sm shadow-lime-500/25"
              >
                Start from {startPrice}
                <ArrowRight className="w-4 h-4" strokeWidth={2.25} />
              </Link>
              <Link
                href="/demos"
                className="inline-flex items-center gap-2 rounded-lg border border-[var(--mkt-border-strong)] bg-[var(--mkt-surface)] text-[var(--mkt-text)] font-medium px-5 py-3 text-sm hover:bg-lime-500/5 hover:border-lime-500/40 transition shadow-sm"
              >
                Explore live demos
              </Link>
            </div>

            <p
              className={`mt-6 text-sm text-slate-500 dark:text-slate-500 transition duration-500 delay-300 ${
                on ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
              }`}
            >
              Billing · Settings · Custom domain · No code required
            </p>
          </div>

          {/* Right — desktop-only desktop browser build */}
          <div
            className={`hidden lg:block relative w-full max-w-[560px] xl:max-w-[600px] ml-auto transition duration-700 delay-150 ${
              on ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <DesktopBuildAnimation />
          </div>
        </div>
      </div>
    </section>
  );
}

const PHASES = [
  "blank", "shell", "sidebar", "canvas", "hero", "services", "gallery", "reviews", "cta", "live", "reset",
] as const;
type Phase = (typeof PHASES)[number];

const TEMPLATES = [
  {
    name: "Bright Homes",
    sector: "Home services",
    domain: "brighthomes.site",
    heroTitle: "Crafted care for every home.",
    heroSub: "Licensed pros. Book online in under a minute.",
    cta: "Get a free quote",
    accent: "lime" as const,
    heroImg: stockImg("homeservice electrician", 640, 360),
    services: [
      { icon: Wrench, label: "Electrical", desc: "Wiring & installs", tone: "from-amber-400 to-orange-500" },
      { icon: Droplets, label: "Plumbing", desc: "Same-day fixes", tone: "from-sky-400 to-blue-500" },
      { icon: Paintbrush, label: "Painting", desc: "Premium finish", tone: "from-emerald-400 to-lime-500" },
    ],
    gallery: [
      { src: stockImg("electrician wiring", 280, 180), caption: "Kitchen rewire" },
      { src: stockImg("plumbing plumber", 180, 180), caption: "Leak fix" },
      { src: stockImg("painting paint", 180, 180), caption: "Fresh walls" },
      { src: stockImg("interior furniture", 180, 180), caption: "Fit-out" },
    ],
    review: {
      name: "Rahul M.",
      role: "Homeowner · Delhi",
      text: "Booked in 2 minutes. Team arrived the same day.",
      avatar: stockImg("portrait professional", 64, 64),
    },
    lead: { name: "Aisha Khan", note: "Quote · Painting" },
  },
  {
    name: "CarePlus Clinic",
    sector: "Healthcare",
    domain: "careplus.clinic",
    heroTitle: "Care that feels personal.",
    heroSub: "Consult specialists — open slots today.",
    cta: "Book a visit",
    accent: "teal" as const,
    heroImg: stockImg("doctor hospital", 640, 360),
    services: [
      { icon: Phone, label: "General", desc: "Checkups", tone: "from-teal-400 to-emerald-500" },
      { icon: Star, label: "Dental", desc: "Smile care", tone: "from-cyan-400 to-sky-500" },
      { icon: Camera, label: "Skin", desc: "Dermatology", tone: "from-rose-400 to-orange-400" },
    ],
    gallery: [
      { src: stockImg("hospital doctor", 280, 180), caption: "Consultation" },
      { src: stockImg("dentist", 180, 180), caption: "Dental" },
      { src: stockImg("skin therapy", 180, 180), caption: "Skin care" },
      { src: stockImg("eyecare", 180, 180), caption: "Eye check" },
    ],
    review: {
      name: "Dr. Anita",
      role: "Patient · Mumbai",
      text: "Easy booking. Reminder came before my slot.",
      avatar: stockImg("doctor professional", 64, 64),
    },
    lead: { name: "Vikram S.", note: "Appointment · Dental" },
  },
];

const BUILDER_SECTIONS = [
  { id: "hero", label: "Hero", phase: "hero" as Phase },
  { id: "services", label: "Services", phase: "services" as Phase },
  { id: "gallery", label: "Gallery", phase: "gallery" as Phase },
  { id: "reviews", label: "Reviews", phase: "reviews" as Phase },
  { id: "cta", label: "CTA", phase: "cta" as Phase },
];

const ADMIN_NAV: { label: string; items: { icon: LucideIcon; label: string; badge?: number }[] }[] = [
  {
    label: "Overview",
    items: [
      { icon: LayoutDashboard, label: "Dashboard" },
      { icon: Inbox, label: "Leads", badge: 3 },
      { icon: CalendarClock, label: "Appointments", badge: 1 },
    ],
  },
  {
    label: "Website",
    items: [
      { icon: Palette, label: "Appearance" },
      { icon: FileStack, label: "Pages & Sections" },
      { icon: Wrench, label: "Services" },
      { icon: Images, label: "Gallery" },
      { icon: Megaphone, label: "Notices" },
      { icon: ScrollText, label: "Results" },
    ],
  },
  {
    label: "Grow",
    items: [
      { icon: Search, label: "SEO" },
      { icon: Rocket, label: "Marketing" },
    ],
  },
  {
    label: "Account",
    items: [
      { icon: Receipt, label: "Billing" },
      { icon: Settings, label: "Settings" },
    ],
  },
];

function atLeast(phase: Phase, name: Phase) {
  return PHASES.indexOf(phase) >= PHASES.indexOf(name);
}

function DesktopBuildAnimation() {
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [cycle, setCycle] = useState(0);
  const canvasRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<Partial<Record<string, HTMLDivElement>>>({});
  const phase = PHASES[phaseIdx];
  const tpl = TEMPLATES[cycle % TEMPLATES.length];
  const lime = tpl.accent === "lime";

  useEffect(() => {
    // Preload every template image so the template switch never pops in half-loaded.
    for (const t of TEMPLATES) {
      for (const src of [t.heroImg, t.review.avatar, ...t.gallery.map((g) => g.src)]) new Image().src = src;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const id = requestAnimationFrame(() => setPhaseIdx(PHASES.indexOf("live")));
      return () => cancelAnimationFrame(id);
    }
    const delays = [500, 700, 800, 700, 1200, 1100, 1100, 1000, 1000, 2800, 900];
    let i = 0;
    let timer: ReturnType<typeof setTimeout>;
    let alive = true;
    const tick = () => {
      timer = setTimeout(() => {
        if (!alive) return;
        i += 1;
        if (i >= PHASES.length) {
          // Shell + sidebar stay up — go straight to building the next site.
          i = PHASES.indexOf("canvas");
          setCycle((c) => c + 1);
        }
        setPhaseIdx(i);
        tick();
      }, delays[i] ?? 700);
    };
    tick();
    return () => { alive = false; clearTimeout(timer); };
  }, []);

  const show = (name: Phase) => atLeast(phase, name) && phase !== "reset";
  // After the first loop the browser shell + sidebar stay mounted; only the site content swaps.
  const chrome = (name: Phase) => cycle > 0 || show(name);
  const building = phase !== "live" && phase !== "blank" && phase !== "reset" && phase !== "shell" && phase !== "sidebar" && phase !== "canvas";
  const activeSection = BUILDER_SECTIONS.find((s) => s.phase === phase)?.id;

  const buildSteps = PHASES.length - 3;
  const buildProgress = Math.min(100, Math.round((Math.max(0, phaseIdx - 1) / buildSteps) * 100));

  useEffect(() => {
    if (!activeSection || !canvasRef.current) return;
    const el = sectionRefs.current[activeSection];
    if (!el) return;
    const parent = canvasRef.current;
    const top = el.offsetTop - parent.offsetTop - 8;
    parent.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
  }, [activeSection, phaseIdx]);

  const isNavActive = (label: string) => {
    if (label === "Pages & Sections" && building) return true;
    if (label === "Leads" && phase === "live") return true;
    return false;
  };

  return (
    <div className="relative w-full">
      <div className="mkt-builder-ambient" aria-hidden />

      <div
        className={`relative mkt-builder-frame transition-[opacity,transform,filter] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          chrome("shell") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <div className="mkt-builder-edge" aria-hidden />

        <div className="relative mkt-glass-builder rounded-[0.94rem] overflow-hidden">
          {/* Desktop browser chrome */}
          <div className="relative z-[1] flex items-center gap-2 h-9 px-3 border-b border-white/40 dark:border-white/10 bg-white/40 dark:bg-white/[0.03] backdrop-blur-sm">
            <div className="flex gap-1.5 shrink-0">
              <i className="w-2 h-2 rounded-full bg-[#ff5f57]" />
              <i className="w-2 h-2 rounded-full bg-[#febc2e]" />
              <i className="w-2 h-2 rounded-full bg-[#28c840]" />
            </div>
            <div className="flex-1 flex justify-center min-w-0 px-2">
              <div className="h-[22px] w-full max-w-[280px] rounded-md bg-white/70 dark:bg-white/5 ring-1 ring-slate-200/60 dark:ring-white/10 flex items-center justify-center gap-1.5 px-2">
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${phase === "live" ? "bg-lime-500" : "bg-amber-400 animate-pulse"}`} />
                <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                  {show("canvas") ? `https://${tpl.domain}` : "standardsaas.app/builder"}
                </span>
              </div>
            </div>
            <span className={`text-[9px] font-bold uppercase tracking-wider shrink-0 px-1.5 py-0.5 rounded ${
              phase === "live"
                ? "bg-lime-500/20 text-lime-700 dark:text-lime-400"
                : "bg-amber-500/15 text-amber-700 dark:text-amber-400"
            }`}>
              {phase === "live" ? "Live" : `${buildProgress}%`}
            </span>
          </div>

          <div
            className={`relative z-[1] h-0.5 bg-slate-200/50 dark:bg-white/5 transition-opacity duration-500 ${
              phase !== "live" && phase !== "blank" && phase !== "reset" ? "opacity-100" : "opacity-0"
            }`}
          >
            <div
              className="h-full origin-left bg-gradient-to-r from-lime-400 to-emerald-400 transition-transform duration-700 ease-out"
              style={{ transform: `scaleX(${buildProgress / 100})` }}
            />
          </div>

          <div className="relative z-[1] grid grid-cols-[148px_1fr] min-h-[400px] xl:min-h-[420px] items-stretch">
            {/* Full admin sidebar — matches real panel */}
            <MagicIn show={chrome("sidebar")} from="left" delay={0} className="h-full min-h-0">
              <aside className="h-full min-h-[400px] xl:min-h-[420px] border-r border-white/30 dark:border-white/10 bg-white/40 dark:bg-black/30 backdrop-blur-sm flex flex-col">
                <div className="px-2 pt-2 pb-1.5 border-b border-slate-200/40 dark:border-white/8">
                  <div className="flex items-center gap-1.5">
                    <span className={`w-5 h-5 rounded-md shrink-0 ${lime ? "bg-lime-400" : "bg-teal-400"}`} />
                    <div className="min-w-0">
                      <p className="text-[9px] font-bold text-slate-900 dark:text-white truncate leading-none">{tpl.name}</p>
                      <p className="text-[6px] text-slate-400 mt-0.5 uppercase tracking-wider">Admin panel</p>
                    </div>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto px-1.5 py-1.5 space-y-2 min-h-0">
                  {ADMIN_NAV.map((group, gi) => (
                    <div key={group.label}>
                      <p className="text-[6px] font-bold uppercase tracking-[0.14em] text-slate-400 px-1 mb-0.5">
                        {group.label}
                      </p>
                      <div className="space-y-0.5">
                        {group.items.map((item, ii) => {
                          const Icon = item.icon;
                          const active = isNavActive(item.label);
                          const delay = gi * 80 + ii * 35;
                          return (
                            <div
                              key={item.label}
                              className={`flex items-center justify-between gap-1 rounded px-1.5 py-[3px] text-[7.5px] font-semibold leading-tight ${
                                active
                                  ? "bg-lime-500/20 text-lime-800 dark:text-lime-300"
                                  : "text-slate-600 dark:text-slate-400"
                              }`}
                              style={{
                                opacity: chrome("sidebar") ? 1 : 0,
                                transform: chrome("sidebar") ? "translateX(0)" : "translateX(-5px)",
                                transition: `opacity 0.45s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.45s cubic-bezier(0.16,1,0.3,1) ${delay}ms, background-color 0.4s ease, color 0.4s ease`,
                              }}
                            >
                              <span className="flex items-center gap-1 min-w-0">
                                <Icon className="w-2.5 h-2.5 shrink-0" strokeWidth={2.25} />
                                <span className="truncate">{item.label}</span>
                              </span>
                              {item.badge != null && item.badge > 0 && (
                                <span className="shrink-0 min-w-[14px] h-[14px] px-0.5 rounded-full bg-lime-500 text-slate-950 text-[6px] font-bold flex items-center justify-center">
                                  {item.badge}
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="shrink-0 px-1.5 py-1.5 border-t border-slate-200/50 dark:border-white/8 bg-white/30 dark:bg-black/20">
                  <p className="text-[6px] font-bold uppercase tracking-[0.14em] text-slate-400 px-1 mb-0.5">Page sections</p>
                  {BUILDER_SECTIONS.map((s) => {
                    const done = atLeast(phase, s.phase) && phase !== "reset";
                    const current = activeSection === s.id;
                    return (
                      <div
                        key={s.id}
                        className={`flex items-center justify-between rounded px-1.5 py-[3px] text-[7.5px] font-medium mb-0.5 last:mb-0 transition-colors duration-300 ${
                          current
                            ? "bg-white/90 dark:bg-white/10 text-slate-900 dark:text-white ring-1 ring-lime-400/55"
                            : done
                              ? "text-slate-600 dark:text-slate-300"
                              : "text-slate-400 dark:text-slate-600"
                        }`}
                      >
                        <span>{s.label}</span>
                        <span className={`w-1.5 h-1.5 rounded-full bg-lime-500 shrink-0 transition-[opacity,transform] duration-300 ${done ? "opacity-100 scale-100" : "opacity-0 scale-50"}`} />
                      </div>
                    );
                  })}
                </div>
              </aside>
            </MagicIn>

            {/* Premium website canvas */}
            <div className="relative bg-slate-200/25 dark:bg-black/20 overflow-hidden min-h-[400px] xl:min-h-[420px]">
              <div
                className={`absolute inset-0 transition-opacity duration-500 ${
                  show("canvas") && !show("hero") ? "opacity-100" : "opacity-0"
                }`}
              >
                <div className="absolute inset-2.5 rounded-lg border border-dashed border-slate-300/70 dark:border-white/10 bg-[linear-gradient(to_right,rgba(148,163,184,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.1)_1px,transparent_1px)] bg-[size:14px_14px] flex items-center justify-center">
                  <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500">Assembling premium site…</p>
                </div>
              </div>

              <div className={`relative h-full min-h-[400px] xl:min-h-[420px] ${show("canvas") ? "opacity-100" : "opacity-0"} transition-opacity duration-700`}>
                <div className="absolute inset-2 rounded-lg overflow-hidden mkt-site-premium ring-1 ring-slate-200/70 dark:ring-white/10 shadow-[0_8px_30px_-12px_rgba(15,23,42,0.35)] flex flex-col">
                  {/* Promo strip */}
                  <MagicIn show={show("hero")} from="top" delay={0}>
                    <div className={`h-[18px] flex items-center justify-center gap-1.5 text-[7px] font-semibold tracking-wide ${
                      lime ? "bg-slate-950 text-lime-300" : "bg-slate-950 text-teal-300"
                    }`}>
                      <Clock className="w-2.5 h-2.5" />
                      Same-day service · Book in 60 seconds · Licensed & insured
                    </div>
                  </MagicIn>

                  {/* Nav */}
                  <MagicIn show={show("hero")} from="top" delay={40}>
                    <div className="flex items-center justify-between px-3 h-10 border-b border-slate-100 dark:border-white/8 bg-white/95 dark:bg-[#0d1210]/95 backdrop-blur-sm">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className={`w-5 h-5 rounded-md shrink-0 shadow-sm ${lime ? "bg-lime-400" : "bg-teal-400"}`} />
                        <div className="min-w-0">
                          <p className="text-[10px] font-bold text-slate-900 dark:text-white leading-none truncate">{tpl.name}</p>
                          <p className="text-[7px] text-slate-400 mt-0.5 uppercase tracking-[0.12em]">{tpl.sector}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3.5 text-[9px] font-semibold text-slate-400">
                        <span className="text-slate-800 dark:text-white">Home</span>
                        <span>Services</span>
                        <span>Gallery</span>
                        <span>Reviews</span>
                        <span>Contact</span>
                      </div>
                      <div className={`h-6 px-2.5 rounded-md text-[8px] font-bold flex items-center text-slate-950 shrink-0 shadow-sm ${lime ? "bg-lime-400" : "bg-teal-400"}`}>
                        {tpl.cta}
                      </div>
                    </div>
                  </MagicIn>

                  <div className="flex-1 relative min-h-0">
                    <div
                      className={`absolute right-2 top-2 z-20 flex items-center gap-1 rounded-full bg-slate-950/90 text-lime-300 text-[7px] font-bold px-2 py-0.5 shadow-lg pointer-events-none transition-[opacity,transform] duration-300 ${
                        building && activeSection ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1"
                      }`}
                    >
                      <span className="w-1 h-1 rounded-full bg-lime-400 animate-pulse" />
                      Adding {BUILDER_SECTIONS.find((s) => s.id === activeSection)?.label ?? "section"}
                    </div>
                    <div ref={canvasRef} className="h-full overflow-y-auto overflow-x-hidden scroll-smooth mkt-preview-scroll">

                    {/* Hero */}
                    <MagicIn show={show("hero")} from="left" delay={50}>
                      <div
                        ref={(el) => { if (el) sectionRefs.current.hero = el; }}
                        className={`relative grid grid-cols-[1.15fr_0.95fr] transition-shadow duration-500 ${
                          activeSection === "hero" && building ? "mkt-section-active" : ""
                        }`}
                      >
                        <div className={`px-3.5 py-3.5 flex flex-col justify-center ${
                          lime
                            ? "bg-gradient-to-br from-[#ecfccb] via-[#bef264] to-[#4ade80]"
                            : "bg-gradient-to-br from-[#ccfbf1] via-[#5eead4] to-[#a3e635]"
                        }`}>
                          <div className="inline-flex items-center gap-1 w-fit rounded-full bg-slate-950/10 px-1.5 py-0.5 mb-1">
                            <Star className="w-2 h-2 text-slate-900 fill-slate-900" />
                            <span className="text-[7px] font-bold text-slate-900/80">4.9 · 2,400+ jobs</span>
                          </div>
                          <p className="text-[14px] font-bold text-slate-950 tracking-tight leading-[1.15]">{tpl.heroTitle}</p>
                          <p className="mt-1 text-[9px] text-slate-900/65 leading-snug max-w-[13rem]">{tpl.heroSub}</p>
                          <div className="mt-2.5 flex gap-1.5">
                            <div className="h-6 px-2.5 rounded-md bg-slate-950 text-white text-[8px] font-bold flex items-center shadow-sm">{tpl.cta}</div>
                            <div className="h-6 px-2.5 rounded-md bg-white/70 text-slate-900 text-[8px] font-bold flex items-center backdrop-blur-sm">
                              <Phone className="w-2.5 h-2.5 mr-1" /> Call now
                            </div>
                          </div>
                        </div>
                        <div className="relative m-2 rounded-lg overflow-hidden ring-1 ring-black/10 shadow-md">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={tpl.heroImg} alt="" className="absolute inset-0 w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent" />
                          <div className="absolute bottom-1.5 left-1.5 right-1.5 flex items-end justify-between">
                            <div className="rounded bg-white/90 backdrop-blur-sm px-1.5 py-0.5 text-[7px] font-bold text-slate-800">Verified pros</div>
                            <div className="rounded bg-slate-950/80 px-1.5 py-0.5 text-[7px] font-bold text-white">4.9 ★</div>
                          </div>
                        </div>
                      </div>
                    </MagicIn>

                    {/* Trust strip */}
                    <MagicIn show={show("services")} from="top" delay={10}>
                      <div className="grid grid-cols-3 gap-px bg-slate-100 dark:bg-white/5 border-y border-slate-100 dark:border-white/5">
                        {[
                          { v: "2.4k+", l: "Jobs done" },
                          { v: "45 min", l: "Avg reply" },
                          { v: "100%", l: "Insured" },
                        ].map((s) => (
                          <div key={s.l} className="bg-white dark:bg-[#0d1210] px-2 py-1.5 text-center">
                            <p className="text-[10px] font-bold text-slate-900 dark:text-white leading-none">{s.v}</p>
                            <p className="text-[7px] text-slate-400 mt-0.5">{s.l}</p>
                          </div>
                        ))}
                      </div>
                    </MagicIn>

                    {/* Services */}
                    <MagicIn show={show("services")} from="right" delay={40}>
                      <div
                        ref={(el) => { if (el) sectionRefs.current.services = el; }}
                        className={`px-2.5 py-2 transition-shadow duration-500 ${activeSection === "services" && building ? "mkt-section-active" : ""}`}
                      >
                        <div className="flex items-center justify-between mb-1.5 px-0.5">
                          <p className="text-[9px] font-bold text-slate-800 dark:text-slate-100">Our services</p>
                          <p className="text-[7px] font-semibold text-slate-400">All managed in admin</p>
                        </div>
                        <div className="grid grid-cols-3 gap-1.5">
                          {tpl.services.map((s, i) => {
                            const Icon = s.icon;
                            return (
                              <div
                                key={s.label}
                                className="rounded-lg bg-slate-50 dark:bg-white/[0.04] p-2 ring-1 ring-slate-200/70 dark:ring-white/10"
                                style={{
                                  transition: `transform 0.6s cubic-bezier(0.16,1,0.3,1) ${70 + i * 70}ms, opacity 0.6s cubic-bezier(0.16,1,0.3,1) ${70 + i * 70}ms`,
                                  transform: show("services") ? "translateY(0)" : "translateY(10px)",
                                  opacity: show("services") ? 1 : 0,
                                }}
                              >
                                <div className={`w-5 h-5 rounded-md bg-gradient-to-br ${s.tone} flex items-center justify-center mb-1.5 shadow-sm`}>
                                  <Icon className="w-2.5 h-2.5 text-white" />
                                </div>
                                <p className="text-[9px] font-bold text-slate-800 dark:text-white leading-none">{s.label}</p>
                                <p className="text-[7px] text-slate-500 dark:text-slate-400 mt-0.5">{s.desc}</p>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </MagicIn>

                    {/* Gallery */}
                    <MagicIn show={show("gallery")} from="left" delay={25}>
                      <div
                        ref={(el) => { if (el) sectionRefs.current.gallery = el; }}
                        className={`px-2.5 pb-1.5 transition-shadow duration-500 ${activeSection === "gallery" && building ? "mkt-section-active" : ""}`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <p className="text-[9px] font-bold text-slate-800 dark:text-slate-100">Featured work</p>
                          <p className={`text-[8px] font-semibold ${lime ? "text-lime-600 dark:text-lime-400" : "text-teal-600 dark:text-teal-400"}`}>View gallery</p>
                        </div>
                        <div className="grid grid-cols-4 gap-1">
                          {tpl.gallery.map((g, i) => (
                            <div
                              key={g.caption}
                              className={`relative rounded-md overflow-hidden ring-1 ring-black/5 shadow-sm ${i === 0 ? "col-span-2 aspect-[2.1/1]" : "aspect-square"}`}
                              style={{
                                transition: `transform 0.6s cubic-bezier(0.16,1,0.3,1) ${i * 60}ms, opacity 0.6s cubic-bezier(0.16,1,0.3,1) ${i * 60}ms`,
                                transform: show("gallery") ? "scale(1)" : "scale(0.9)",
                                opacity: show("gallery") ? 1 : 0,
                              }}
                            >
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={g.src} alt={g.caption} className="absolute inset-0 w-full h-full object-cover" />
                              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/75 to-transparent px-1.5 py-1">
                                <p className="text-[7px] font-semibold text-white truncate">{g.caption}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </MagicIn>

                    {/* Review + CTA */}
                    <div className="grid grid-cols-2 gap-1.5 px-2.5 pb-1.5">
                      <MagicIn show={show("reviews")} from="right" delay={20}>
                        <div
                          ref={(el) => { if (el) sectionRefs.current.reviews = el; }}
                          className={`rounded-lg bg-slate-950 p-2.5 flex gap-2 items-start h-full shadow-sm transition-shadow duration-500 ${
                            activeSection === "reviews" && building ? "mkt-section-active" : ""
                          }`}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={tpl.review.avatar} alt="" className="w-6 h-6 rounded-full object-cover shrink-0 ring-2 ring-lime-400/50" />
                          <div className="min-w-0">
                            <div className="flex gap-0.5 mb-1">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star key={i} className="w-2 h-2 text-lime-400 fill-lime-400" />
                              ))}
                            </div>
                            <p className="text-[8px] text-white/90 italic leading-snug">“{tpl.review.text}”</p>
                            <p className="text-[7px] text-white/40 mt-1">{tpl.review.name} · {tpl.review.role}</p>
                          </div>
                        </div>
                      </MagicIn>

                      <MagicIn show={show("cta")} from="left" delay={20}>
                        <div
                          ref={(el) => { if (el) sectionRefs.current.cta = el; }}
                          className={`rounded-lg px-2.5 py-2.5 flex flex-col justify-center h-full shadow-sm ${
                            lime ? "bg-lime-400" : "bg-teal-400"
                          } transition-shadow duration-500 ${activeSection === "cta" && building ? "mkt-section-active" : ""}`}
                        >
                          <p className="text-[10px] font-bold text-slate-950 leading-tight">Ready when you are</p>
                          <p className="text-[7px] text-slate-800/70 mt-0.5">Free quote · Instant reply · Admin inbox</p>
                          <div className="mt-2 h-5 w-fit px-2 rounded-md bg-slate-950 text-white text-[7px] font-bold flex items-center">{tpl.cta}</div>
                        </div>
                      </MagicIn>
                    </div>

                    {/* Footer */}
                    <MagicIn show={show("cta")} from="bottom" delay={40}>
                      <div className="border-t border-white/5 px-2.5 py-1.5 flex items-center justify-between gap-2 bg-slate-950">
                        <div className="flex items-center gap-x-3 text-[7px] text-white/50">
                          <span className="inline-flex items-center gap-0.5"><Phone className="w-2 h-2" /> +91 98765 43210</span>
                          <span className="inline-flex items-center gap-0.5"><Mail className="w-2 h-2" /> hello@{tpl.domain}</span>
                          <span className="inline-flex items-center gap-0.5"><MapPin className="w-2 h-2" /> Delhi NCR</span>
                        </div>
                        <p className="text-[7px] text-white/30">© {tpl.name}</p>
                      </div>
                    </MagicIn>
                    </div>
                  </div>
                </div>
              </div>

              <div
                className={`absolute right-3 top-10 z-30 w-36 rounded-lg mkt-glass-toast p-2 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  phase === "live" ? "opacity-100 translate-x-0 scale-100" : "opacity-0 translate-x-4 scale-90"
                }`}
              >
                <div className="flex items-center gap-1 mb-0.5">
                  <MessageSquare className="w-2.5 h-2.5 text-lime-600 dark:text-lime-400" />
                  <p className="text-[8px] font-bold text-lime-700 dark:text-lime-400">New lead</p>
                </div>
                <p className="text-[9px] font-semibold text-slate-800 dark:text-white">{tpl.lead.name}</p>
                <p className="text-[7px] text-slate-500 dark:text-slate-400">{tpl.lead.note} · Just now</p>
              </div>

              <BuildCursor phase={phase} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MagicIn({
  show, from, delay = 0, className = "", children,
}: {
  show: boolean;
  from: "left" | "right" | "top" | "bottom";
  delay?: number;
  className?: string;
  children: React.ReactNode;
}) {
  const hidden =
    from === "left" ? "translateX(-12px)"
      : from === "right" ? "translateX(12px)"
        : from === "top" ? "translateY(-6px)"
          : "translateY(8px)";

  return (
    <div
      className={className}
      style={{
        transition: `transform 0.8s cubic-bezier(0.22,1,0.36,1) ${delay}ms, opacity 0.6s ease-out ${delay}ms`,
        transform: show ? "translate(0,0)" : hidden,
        opacity: show ? 1 : 0,
      }}
    >
      {children}
    </div>
  );
}

function BuildCursor({ phase }: { phase: Phase }) {
  const map: Record<Phase, { x: string; y: string; click?: boolean }> = {
    blank: { x: "50%", y: "45%" },
    shell: { x: "40%", y: "10%" },
    sidebar: { x: "10%", y: "32%", click: true },
    canvas: { x: "55%", y: "40%" },
    hero: { x: "35%", y: "28%", click: true },
    services: { x: "70%", y: "48%", click: true },
    gallery: { x: "45%", y: "62%", click: true },
    reviews: { x: "38%", y: "78%", click: true },
    cta: { x: "78%", y: "78%", click: true },
    live: { x: "88%", y: "22%" },
    reset: { x: "50%", y: "50%" },
  };
  const p = map[phase];
  // Full-size layer translated by % of itself == % of the canvas, so the move stays on the GPU.
  return (
    <div
      className="absolute inset-0 z-40 pointer-events-none transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
      style={{ transform: `translate(${p.x}, ${p.y})` }}
    >
      <div className="relative w-fit drop-shadow-md">
        <svg key={phase} width="14" height="14" viewBox="0 0 24 24" className={p.click ? "mkt-click" : ""}>
          <path d="M5 3l14 8.5-6.2 1.4L10 21 5 3z" className="fill-slate-900 dark:fill-white" />
        </svg>
        {p.click && <span key={`r-${phase}`} className="absolute -left-0.5 -top-0.5 w-3 h-3 rounded-full border border-lime-400/70 mkt-ripple" />}
      </div>
    </div>
  );
}
