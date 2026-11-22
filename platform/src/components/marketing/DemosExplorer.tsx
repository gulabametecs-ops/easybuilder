"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowRight, ArrowUpRight, Check, Clock, Play, Search, ChevronDown,
  GraduationCap, House, UtensilsCrossed, Stethoscope, Factory, Dumbbell, HeartHandshake, CalendarDays, LayoutGrid, Building2,
  type LucideIcon,
} from "lucide-react";
import { VerticalIcon } from "./VerticalIcon";
import { DemoVerticalPanel, previewUrl } from "./DemoVerticalPanel";
import { DemoConceptPreview } from "./DemoConceptPreview";
import { DemoLiveStage } from "./DemoLiveStage";
import { mkt } from "@/lib/marketingTheme";

export type DemoDesign = {
  id: string;
  name: string;
  blurb: string;
  tagline: string;
  font: string;
  header: string;
  hero: string | null;
  colors: {
    primary: string;
    primaryDark: string;
    secondary: string;
    accent: string;
    dark: string;
    light: string;
    text: string;
    heading: string;
  };
};

export type DemoSector = {
  id: string;
  name: string;
  tagline: string;
  icon: string;
  status: string;
  category: string;
  accent: string;
  image: string;
  /** Hand-checked sector photos (hero first) for previews. */
  photos?: string[];
  /** First few service titles of the template, for preview cards. */
  services?: string[];
  description: string;
  look?: string;
  /** Public demo tenant origin, e.g. http://demo-coaching.localhost:3000 */
  demoUrl?: string | null;
  designs: DemoDesign[];
};

export type DemoCategory = { name: string; image: string; count: number };

export type ActiveInfo = {
  siteUrl: string;
  adminUrl: string;
  expiresAt: string;
  minutesLeft: number;
  adminUsername?: string;
  adminPassword?: string;
};

type Props = {
  categories: DemoCategory[];
  sectors: DemoSector[];
  activeByVertical: Record<string, ActiveInfo>;
  focusVertical?: string;
  expired?: boolean;
  /** Design to preselect for focusVertical (e.g. coming back from /demos/start). */
  initialDesign?: string;
  /** Open the live stage straight away when focusVertical's demo is active. */
  autoLive?: boolean;
};

// Separate details page: name/phone/email + OTP, then back here with the live stage open.
export const demoStartUrl = (vertical: string, design?: string) =>
  `/demos/start?vertical=${encodeURIComponent(vertical)}${design ? `&design=${encodeURIComponent(design)}` : ""}`;

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--mkt-accent-2)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--mkt-bg)]";

function included(s: DemoSector): string[] {
  if (s.id === "social-foundation")
    return ["Six grassroots program areas + leadership team", "Live events with reports, gallery and documents", "Volunteer applications inbox in admin", `${s.designs.length} colour skins, mobile-ready`];
  if (s.id === "ngo-charity")
    return ["Causes, impact stats, 80G donate page", "Volunteer enquiry + event gallery", "Admin for pages, services, gallery & SEO", `${s.designs.length} switchable designs, mobile-ready`];
  return [`Ready-made ${s.name} website with real content`, "Admin panel — edit pages, services, gallery & SEO", "Enquiry & lead capture built in", `${s.designs.length} switchable designs, mobile-ready`];
}

/** Showroom: pick an industry on the left, switch designs in one click, preview on the right. */
// Category look in the sidebar accordion: icon + gradient tile.
const CAT_STYLE: Record<string, { icon: LucideIcon; from: string; to: string }> = {
  "Schools & Coaching": { icon: GraduationCap, from: "#3b82f6", to: "#6366f1" },
  "Home & Local Services": { icon: House, from: "#f59e0b", to: "#f97316" },
  "Food & Hospitality": { icon: UtensilsCrossed, from: "#ef4444", to: "#f97316" },
  Healthcare: { icon: Stethoscope, from: "#06b6d4", to: "#0ea5e9" },
  "Trade & Manufacturing": { icon: Factory, from: "#64748b", to: "#7c3aed" },
  "Real Estate & Property": { icon: Building2, from: "#0f2341", to: "#c5a253" },
  "Fitness & Wellness": { icon: Dumbbell, from: "#22c55e", to: "#14b8a6" },
  "Community & Non-profit": { icon: HeartHandshake, from: "#ec4899", to: "#a855f7" },
  "Events & Training": { icon: CalendarDays, from: "#8b5cf6", to: "#d946ef" },
};
const catStyle = (name: string) => CAT_STYLE[name] ?? { icon: LayoutGrid, from: "#64748b", to: "#334155" };

export function DemosExplorer({ categories, sectors, activeByVertical, focusVertical, expired, initialDesign, autoLive }: Props) {
  const globalActive = useMemo(() => {
    const entry = Object.entries(activeByVertical)[0];
    if (!entry) return null;
    const sector = sectors.find((s) => s.id === entry[0]);
    return sector ? { sector, ...entry[1] } : null;
  }, [activeByVertical, sectors]);

  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(
    focusVertical ?? globalActive?.sector.id ?? sectors.find((s) => s.status === "live")?.id ?? sectors[0]?.id,
  );
  // Accordion: only one industry group open at a time — starts on the selected sector's group.
  const [openCat, setOpenCat] = useState<string | null>(() => sectors.find((s) => s.id === selectedId)?.category ?? null);
  const navRef = useRef<HTMLElement>(null);
  const [designBy, setDesignBy] = useState<Record<string, string>>(
    focusVertical && initialDesign ? { [focusVertical]: initialDesign } : {},
  );
  const [stage, setStage] = useState<ActiveInfo | null>(
    autoLive && focusVertical ? (activeByVertical[focusVertical] ?? null) : null,
  );
  const stageRef = useRef<HTMLElement>(null);

  const selected = sectors.find((s) => s.id === selectedId) ?? sectors[0];
  const current = selected.designs.find((d) => d.id === designBy[selected.id]) ?? selected.designs[0];
  const active = activeByVertical[selected.id];
  const live = selected.status === "live";
  const blockedBy = live && globalActive && globalActive.sector.id !== selected.id ? globalActive.sector : undefined;
  const setDesign = (id: string) => setDesignBy((m) => ({ ...m, [selected.id]: id }));

  const q = query.trim().toLowerCase();
  const groups = categories
    .map((c) => ({
      name: c.name,
      items: sectors.filter((s) => s.category === c.name && (!q || s.name.toLowerCase().includes(q) || s.tagline.toLowerCase().includes(q))),
    }))
    .filter((g) => g.items.length > 0);

  // Keyboard: 1–9 picks a design, ←/→ cycles (ignored while typing or in the live stage).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (stage || e.metaKey || e.ctrlKey || e.altKey) return;
      if ((e.target as HTMLElement).closest("input, textarea, select, [contenteditable]")) return;
      const ds = selected.designs;
      const i = ds.findIndex((d) => d.id === current.id);
      const n = /^[1-9]$/.test(e.key) ? +e.key - 1 : e.key === "ArrowRight" ? (i + 1) % ds.length : e.key === "ArrowLeft" ? (i - 1 + ds.length) % ds.length : -1;
      if (!ds[n]) return;
      e.preventDefault();
      setDesignBy((m) => ({ ...m, [selected.id]: ds[n].id }));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected, current, stage]);

  // Keep the selected industry visible inside the scrollable sidebar on first load.
  useEffect(() => {
    const nav = navRef.current;
    const el = nav?.querySelector<HTMLElement>("[aria-current='true']");
    if (nav && el) nav.scrollTop = Math.max(0, el.offsetTop - nav.offsetTop - 120);
  }, []);

  const pick = (id: string) => {
    setSelectedId(id);
    setOpenCat(sectors.find((s) => s.id === id)?.category ?? null);
    if (window.innerWidth < 1024) stageRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className={`${mkt.container} pb-20 pt-6`}>
      {globalActive && (
        <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/[0.07] px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-center gap-2.5 text-sm text-[var(--mkt-text)]">
            <Clock className="h-4 w-4 text-emerald-600" />
            <span>
              <b>{globalActive.sector.name}</b> demo is running · ~{globalActive.minutesLeft} min left
            </span>
          </p>
          <div className="flex shrink-0 gap-2">
            <a
              href={previewUrl(globalActive.siteUrl, designBy[globalActive.sector.id] ?? "classic")}
              target="_blank"
              rel="noopener noreferrer"
              className={`${mkt.btnSecondary} ${mkt.btnPrimarySm} ${focusRing}`}
            >
              Open website <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
            <button
              type="button"
              onClick={() => {
                setSelectedId(globalActive.sector.id);
                setOpenCat(globalActive.sector.category);
                setStage(globalActive);
              }}
              className={`${mkt.btnPrimary} ${mkt.btnPrimarySm} ${focusRing}`}
            >
              Open live demo
            </button>
          </div>
        </div>
      )}

      {expired && focusVertical && (
        <p className="mb-6 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-800 dark:text-amber-200">
          Your previous demo session ended. Request a new OTP below to restart.
        </p>
      )}

      <div className="grid gap-6 lg:grid-cols-[270px_minmax(0,1fr)] lg:gap-8">
        {/* Industry picker */}
        <aside className="lg:sticky lg:top-20 lg:self-start">
          <label className="relative hidden lg:block">
            <span className="sr-only">Search industries</span>
            <Search className={`pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 ${mkt.muted}`} />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`Search ${sectors.length} industries…`}
              className={`${mkt.input} rounded-full py-2.5 pl-10`}
            />
          </label>
          {/* Mobile: a native grouped select is the fastest picker */}
          <label className="block lg:hidden">
            <span className={`mb-1.5 block text-xs font-semibold uppercase tracking-wider ${mkt.muted}`}>Industry</span>
            <select value={selected.id} onChange={(e) => pick(e.target.value)} className={`${mkt.input} font-semibold`}>
              {categories.map((c) => (
                <optgroup key={c.name} label={c.name}>
                  {sectors
                    .filter((s) => s.category === c.name)
                    .map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                </optgroup>
              ))}
            </select>
          </label>
          <nav
            ref={navRef}
            aria-label="Industries"
            className="relative mt-4 hidden max-h-[calc(100vh/var(--mkt-zoom,1)-9.5rem)] space-y-2 overflow-y-auto overscroll-contain pb-4 pr-1 [scrollbar-width:thin] lg:block"
          >
            {groups.length === 0 && <p className={`px-2 text-sm ${mkt.muted}`}>No industry matches “{query.trim()}”.</p>}
            {groups.map((g) => {
              // While searching every matching group stays open.
              const open = !!q || openCat === g.name;
              const hasSelected = g.items.some((s) => s.id === selected.id);
              const { icon: CatIcon, from, to } = catStyle(g.name);
              return (
                <div
                  key={g.name}
                  className={`overflow-hidden rounded-2xl border transition-colors duration-300 ${
                    open ? "border-[var(--mkt-border)] bg-[var(--mkt-surface)] shadow-sm" : "border-transparent"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenCat(open && !q ? null : g.name)}
                    aria-expanded={open}
                    className={`flex w-full items-center gap-3 rounded-2xl px-2.5 py-2 text-left transition ${focusRing} ${
                      open ? "" : "hover:bg-[var(--mkt-surface-muted)]"
                    }`}
                  >
                    <span
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-white shadow-sm transition-transform duration-300"
                      style={{ backgroundImage: `linear-gradient(135deg, ${from}, ${to})`, transform: open ? "scale(1.06)" : undefined }}
                    >
                      <CatIcon className="h-4 w-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[13px] font-semibold text-[var(--mkt-text)]">{g.name}</span>
                      <span className={`block truncate text-[11px] ${mkt.muted}`}>
                        {g.items.length} {g.items.length === 1 ? "website" : "websites"}
                        {!open && hasSelected && <span className="text-[var(--mkt-accent-text)]"> · {selected.name}</span>}
                      </span>
                    </span>
                    <ChevronDown className={`h-4 w-4 shrink-0 transition-transform duration-300 ${mkt.muted} ${open ? "rotate-180" : ""}`} />
                  </button>
                  {/* grid-rows 0fr→1fr animates the height smoothly without measuring */}
                  <div className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                    <ul className="min-h-0 space-y-0.5 overflow-hidden px-1.5" inert={!open}>
                      {g.items.map((s, i) => {
                        const on = s.id === selected.id;
                        return (
                          <li key={s.id} className={i === g.items.length - 1 ? "pb-1.5" : undefined}>
                            <button
                              type="button"
                              onClick={() => pick(s.id)}
                              aria-current={on ? "true" : undefined}
                              className={`flex w-full items-center gap-2.5 rounded-xl px-2 py-1.5 text-left text-sm transition ${focusRing} ${
                                on
                                  ? "bg-[var(--mkt-text)] font-semibold text-[var(--mkt-bg)]"
                                  : "text-[var(--mkt-text-secondary)] hover:translate-x-0.5 hover:bg-[var(--mkt-surface-muted)] hover:text-[var(--mkt-text)]"
                              }`}
                            >
                              <span
                                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${on ? "bg-white/15" : "bg-[var(--mkt-surface-muted)]"}`}
                                style={on ? undefined : { color: s.accent }}
                              >
                                <VerticalIcon name={s.icon} className="h-3.5 w-3.5" />
                              </span>
                              <span className="min-w-0 flex-1 truncate">{s.name}</span>
                              {activeByVertical[s.id] && <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-500" title="Demo running" />}
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              );
            })}
          </nav>
        </aside>

        {/* Stage */}
        <section ref={stageRef} aria-labelledby="demo-title" className="min-w-0 scroll-mt-20">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex min-w-0 items-start gap-3">
              <span
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[var(--mkt-border)] bg-[var(--mkt-surface)]"
                style={{ color: selected.accent }}
              >
                <VerticalIcon name={selected.icon} className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <p className={`text-xs ${mkt.muted}`}>
                  {selected.category}
                  {live ? "" : " · Coming soon"}
                </p>
                <h2 id="demo-title" className="font-display text-xl text-[var(--mkt-text)] sm:text-2xl">
                  {selected.name}
                </h2>
                <p className={`mt-0.5 line-clamp-1 text-sm ${mkt.muted}`}>{selected.tagline}</p>
              </div>
            </div>
            <div className="flex shrink-0 flex-wrap gap-2">
              {active ? (
                <button type="button" onClick={() => setStage(active)} className={`${mkt.btnSecondary} ${mkt.btnPrimaryMd} ${focusRing}`}>
                  <Play className="h-4 w-4" /> Open live demo
                </button>
              ) : live ? (
                <Link href={demoStartUrl(selected.id, current.id)} className={`${mkt.btnSecondary} ${mkt.btnPrimaryMd} ${focusRing}`}>
                  <Play className="h-4 w-4" /> Try live with admin
                </Link>
              ) : null}
              <Link
                href={`/subscribe?vertical=${selected.id}${live ? `&design=${current.id}` : ""}`}
                className={`${mkt.btnPrimary} ${mkt.btnPrimaryMd} ${focusRing}`}
              >
                {live ? "Use this design" : "Notify me"} <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* One-click design switcher */}
          <div role="radiogroup" aria-label="Design" className="mt-5 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
            {selected.designs.map((d, i) => {
              const on = d.id === current.id;
              return (
                <button
                  key={d.id}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  onClick={() => setDesign(d.id)}
                  title={`${d.tagline} (press ${i + 1})`}
                  className={`flex shrink-0 items-center gap-2.5 rounded-full border py-1.5 pl-1.5 pr-3 text-sm transition ${focusRing} ${
                    on
                      ? "border-[var(--mkt-text)] bg-[var(--mkt-text)] font-semibold text-[var(--mkt-bg)]"
                      : "border-[var(--mkt-border)] bg-[var(--mkt-surface)] text-[var(--mkt-text-secondary)] hover:border-[var(--mkt-border-strong)]"
                  }`}
                >
                  <span className="flex -space-x-1">
                    {[d.colors.primary, d.colors.secondary, d.colors.accent].map((c, k) => (
                      <span key={k} className="h-5 w-5 rounded-full ring-2 ring-[var(--mkt-surface)]" style={{ background: c }} />
                    ))}
                  </span>
                  {d.name}
                  <kbd className={`hidden rounded border px-1 text-[10px] font-medium sm:inline ${on ? "border-white/25 opacity-70" : "border-[var(--mkt-border)] opacity-60"}`}>
                    {i + 1}
                  </kbd>
                </button>
              );
            })}
          </div>

          <div className="mt-4 rounded-2xl border border-[var(--mkt-border)] bg-[var(--mkt-surface-muted)] p-3 sm:p-5">
            {/* ponytail: static mock — the real site is OTP-gated, an iframe here would only show the gate */}
            <DemoConceptPreview key={selected.id} sector={selected} design={current} />
          </div>
          <p className={`mt-2 text-center text-xs ${mkt.muted}`}>
            {current.blurb} · Same pages and content in every design. Press <kbd className="font-semibold">←</kbd>{" "}
            <kbd className="font-semibold">→</kbd> to switch.
          </p>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <div className={`${mkt.card} p-5`}>
              <h3 className="font-semibold text-[var(--mkt-text)]">What you get</h3>
              <p className={`mt-1 text-sm ${mkt.muted}`}>{selected.description}</p>
              <ul className="mt-4 space-y-2">
                {included(selected).map((t) => (
                  <li key={t} className="flex items-start gap-2 text-sm text-[var(--mkt-text-secondary)]">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" /> {t}
                  </li>
                ))}
              </ul>
            </div>
            <div className={`${mkt.card} p-5`}>
              <h3 className="mb-3 font-semibold text-[var(--mkt-text)]">{live ? "Try the real site + admin" : "Coming soon"}</h3>
              {live && !active && !blockedBy ? (
                <div>
                  <p className={`text-sm leading-relaxed ${mkt.muted}`}>
                    Get a private 10-minute sandbox of this website with its full admin panel. Add a few details, verify with a
                    one-time code and you&apos;re in — no card needed.
                  </p>
                  <Link href={demoStartUrl(selected.id, current.id)} className={`mt-4 w-full ${mkt.btnPrimary} ${mkt.btnPrimaryMd} ${focusRing}`}>
                    <Play className="h-4 w-4" /> Start my free demo
                  </Link>
                </div>
              ) : live ? (
                <DemoVerticalPanel
                  key={selected.id}
                  vertical={selected}
                  active={active}
                  defaultOpen={focusVertical === selected.id && (!!expired || !active)}
                  blocked={!!blockedBy && !active}
                  blockedVerticalName={blockedBy?.name}
                  blockedVerticalId={blockedBy?.id}
                  designs={selected.designs}
                  design={current.id}
                  onShowActive={pick}
                  onActivated={setStage}
                />
              ) : (
                <p className="text-sm text-[var(--mkt-text-secondary)]">
                  We&apos;re finishing the {selected.name} template. Leave an enquiry and we&apos;ll notify you the moment it&apos;s live.
                </p>
              )}
            </div>
          </div>
        </section>
      </div>

      {stage && (
        <DemoLiveStage sector={selected} active={stage} design={current.id} onDesign={setDesign} onClose={() => setStage(null)} />
      )}
    </div>
  );
}
