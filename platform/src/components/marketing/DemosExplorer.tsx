"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check, Clock, Search, SearchX, X } from "lucide-react";
import { VerticalIcon } from "./VerticalIcon";
import { DemoVerticalPanel, previewUrl } from "./DemoVerticalPanel";
import { DemoDesignThumb } from "./DemoDesignThumb";
import { mkt } from "@/lib/marketingTheme";

export type DemoDesign = {
  id: string;
  name: string;
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
  description: string;
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
};

const ALL = "All";
const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--mkt-bg)]";

export function DemosExplorer({ categories, sectors, activeByVertical, focusVertical, expired }: Props) {
  const [category, setCategory] = useState(ALL);
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(focusVertical ?? null);
  const [designBy, setDesignBy] = useState<Record<string, string>>({});
  const close = useCallback(() => setSelectedId(null), []); // stable: drawer effect depends on it

  const globalActive = useMemo(() => {
    const entry = Object.entries(activeByVertical)[0];
    if (!entry) return null;
    const sector = sectors.find((s) => s.id === entry[0]);
    return sector ? { sector, ...entry[1] } : null;
  }, [activeByVertical, sectors]);

  const q = query.trim().toLowerCase();
  const visible = sectors.filter(
    (s) =>
      (category === ALL || s.category === category) &&
      (!q || s.name.toLowerCase().includes(q) || s.tagline.toLowerCase().includes(q)),
  );
  const selected = sectors.find((s) => s.id === selectedId) ?? null;
  const liveCount = sectors.filter((s) => s.status === "live").length;

  const tabs = [{ name: ALL, image: "", count: sectors.length }, ...categories];

  return (
    <div className={`${mkt.container} py-10 sm:py-14`}>
      {globalActive && (
        <div className="mb-8 flex flex-col gap-4 rounded-2xl border border-lime-500/30 bg-lime-500/10 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-lime-500/20">
              <Clock className="h-5 w-5 text-lime-700 dark:text-lime-300" />
            </span>
            <div>
              <p className="font-semibold text-[var(--mkt-text)]">{globalActive.sector.name} demo is running</p>
              <p className={`mt-0.5 text-sm ${mkt.muted}`}>~{globalActive.minutesLeft} min left · preview any design</p>
            </div>
          </div>
          <div className="flex shrink-0 flex-wrap gap-2">
            <a
              href={previewUrl(globalActive.siteUrl, designBy[globalActive.sector.id] ?? "classic")}
              target="_blank"
              rel="noopener noreferrer"
              className={`${mkt.btnPrimary} ${mkt.btnPrimarySm} ${focusRing}`}
            >
              Open website <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
            <button
              type="button"
              onClick={() => setSelectedId(globalActive.sector.id)}
              className={`${mkt.btnSecondary} ${mkt.btnPrimarySm} ${focusRing}`}
            >
              Designs & admin
            </button>
          </div>
        </div>
      )}

      {expired && focusVertical && (
        <p className="mb-6 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-800 dark:text-amber-200">
          Your previous demo session ended. Request a new OTP to restart.
        </p>
      )}

      {/* Toolbar: category pills + search */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div
          role="tablist"
          aria-label="Filter by category"
          className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 [scrollbar-width:none]"
        >
          {tabs.map((t) => {
            const on = category === t.name;
            return (
              <button
                key={t.name}
                type="button"
                role="tab"
                aria-selected={on}
                onClick={() => setCategory(t.name)}
                className={`inline-flex shrink-0 items-center gap-2 rounded-full border py-1.5 pl-1.5 pr-3.5 text-sm font-medium transition-colors ${focusRing} ${
                  on
                    ? "border-transparent bg-[var(--mkt-text)] text-[var(--mkt-bg)]"
                    : "border-[var(--mkt-border)] bg-[var(--mkt-surface)] text-[var(--mkt-text-secondary)] hover:border-lime-500/40"
                }`}
              >
                {t.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={t.image} alt="" className="h-6 w-6 rounded-full object-cover" />
                ) : (
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-lime-500 text-[10px] font-bold text-slate-950">
                    {liveCount}
                  </span>
                )}
                {t.name}
                <span className={`text-xs tabular-nums ${on ? "opacity-70" : mkt.muted}`}>{t.count}</span>
              </button>
            );
          })}
        </div>

        <label className="relative block w-full lg:w-72">
          <span className="sr-only">Search sectors</span>
          <Search className={`pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 ${mkt.muted}`} />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search sectors…"
            className={`${mkt.input} rounded-full py-2.5 pl-10`}
          />
        </label>
      </div>

      {/* Grid */}
      {visible.length === 0 ? (
        <div className={`${mkt.cardSoft} mt-8 flex flex-col items-center px-6 py-16 text-center`}>
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--mkt-accent-soft)]">
            <SearchX className="h-6 w-6 text-[var(--mkt-accent-text)]" />
          </span>
          <p className="mt-4 font-semibold text-[var(--mkt-text)]">No sectors match{q ? ` “${query.trim()}”` : ""}</p>
          <p className={`mt-1 text-sm ${mkt.muted}`}>Try a different word, or tell us about your business.</p>
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setCategory(ALL);
              }}
              className={`${mkt.btnSecondary} ${mkt.btnPrimarySm} ${focusRing}`}
            >
              Clear filters
            </button>
            <Link href="/subscribe" className={`${mkt.btnPrimary} ${mkt.btnPrimarySm} ${focusRing}`}>
              Request my sector <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      ) : (
        <ul className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((s) => {
            const live = s.status === "live";
            const running = !!activeByVertical[s.id];
            return (
              <li key={s.id}>
                <button
                  type="button"
                  id={`demo-${s.id}`}
                  onClick={() => setSelectedId(s.id)}
                  aria-haspopup="dialog"
                  className={`group flex h-full w-full flex-col overflow-hidden text-left ${mkt.card} transition-transform duration-300 ease-out hover:border-lime-500/40 motion-safe:hover:-translate-y-1 ${focusRing}`}
                >
                  <div className="relative aspect-[16/10] w-full overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={s.image}
                      alt={`${s.name} website example`}
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out motion-safe:group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                    <span
                      className="absolute left-3 top-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white/90 shadow-sm backdrop-blur"
                      style={{ color: s.accent }}
                    >
                      <VerticalIcon name={s.icon} className="h-5 w-5" />
                    </span>
                    <span
                      className={`absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold backdrop-blur ${
                        live ? "bg-black/55 text-white" : "bg-white/85 text-slate-800"
                      }`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${live ? "bg-lime-400" : "bg-amber-500"}`} />
                      {running ? "Running" : live ? "Live" : "Coming soon"}
                    </span>
                    <span className="absolute bottom-3 left-3 flex -space-x-1.5" aria-hidden>
                      {s.designs.map((d) => (
                        <span
                          key={d.id}
                          className="h-4 w-4 rounded-full ring-2 ring-white/90"
                          style={{ background: d.colors.primary === d.colors.secondary ? d.colors.dark : d.colors.secondary }}
                        />
                      ))}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <p className={`text-[11px] font-semibold uppercase tracking-wider ${mkt.muted}`}>{s.category}</p>
                    <h3 className="mt-1 font-semibold text-[var(--mkt-text)]">{s.name}</h3>
                    <p className={`mt-1 text-sm ${mkt.muted}`}>{s.tagline}</p>
                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[var(--mkt-accent-text)]">
                      {live ? `Explore ${s.designs.length} designs` : "View details"}
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 motion-safe:group-hover:translate-x-1" />
                    </span>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {selected && (
        <DemoDrawer
          key={selected.id}
          sector={selected}
          active={activeByVertical[selected.id]}
          design={designBy[selected.id] ?? selected.designs[0]?.id ?? "classic"}
          onDesign={(id) => setDesignBy((m) => ({ ...m, [selected.id]: id }))}
          defaultOpen={focusVertical === selected.id && (!!expired || !activeByVertical[selected.id])}
          blockedBy={
            selected.status === "live" && globalActive && globalActive.sector.id !== selected.id
              ? globalActive.sector
              : undefined
          }
          onShowActive={setSelectedId}
          onClose={close}
        />
      )}
    </div>
  );
}

function DemoDrawer({
  sector,
  active,
  design,
  onDesign,
  defaultOpen,
  blockedBy,
  onShowActive,
  onClose,
}: {
  sector: DemoSector;
  active?: ActiveInfo;
  design: string;
  onDesign: (id: string) => void;
  defaultOpen: boolean;
  blockedBy?: DemoSector;
  onShowActive: (id: string) => void;
  onClose: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const live = sector.status === "live";
  const current = sector.designs.find((d) => d.id === design) ?? sector.designs[0];
  const titleId = `demo-drawer-${sector.id}`;

  // Escape closes, background scroll locked, focus moved in and restored on close.
  useEffect(() => {
    const prevFocus = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      prevFocus?.focus?.();
    };
  }, [onClose]);

  const included = [
    `Ready-made ${sector.name} website with real content`,
    "Admin panel — edit pages, services, gallery & SEO",
    "Enquiry & lead capture built in",
    `${sector.designs.length} switchable designs, mobile-ready`,
  ];

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-labelledby={titleId}>
      <div
        className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm transition-opacity duration-300 starting:opacity-0 motion-reduce:transition-none"
        onClick={onClose}
        aria-hidden
      />
      <div className="absolute inset-y-0 right-0 flex w-full max-w-2xl flex-col bg-[var(--mkt-bg)] shadow-2xl transition-[transform,opacity] duration-300 ease-out starting:translate-x-8 starting:opacity-0 motion-reduce:transition-none sm:border-l sm:border-[var(--mkt-border)]">
        {/* Header */}
        <div className="relative h-40 shrink-0 overflow-hidden sm:h-48">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={sector.image} alt="" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur transition-opacity hover:bg-black/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="absolute bottom-4 left-5 right-5 flex items-end gap-3">
            <span
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white shadow"
              style={{ color: sector.accent }}
            >
              <VerticalIcon name={sector.icon} className="h-6 w-6" />
            </span>
            <div className="min-w-0">
              <p className="text-xs font-medium text-white/75">
                {sector.category} · {live ? "Live demo" : "Coming soon"}
              </p>
              <h2 id={titleId} className="truncate text-xl font-bold text-white sm:text-2xl">
                {sector.name}
              </h2>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 space-y-8 overflow-y-auto overscroll-contain px-5 py-6 sm:px-7">
          <section>
            <p className="text-[var(--mkt-text-secondary)]">{sector.description}</p>
            <h3 className={`mt-5 text-xs font-semibold uppercase tracking-wider ${mkt.muted}`}>What&apos;s included</h3>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {included.map((t) => (
                <li key={t} className="flex items-start gap-2 text-sm text-[var(--mkt-text-secondary)]">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-lime-500" /> {t}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <div className="flex items-baseline justify-between gap-3">
              <h3 className="font-semibold text-[var(--mkt-text)]">Choose a design</h3>
              {current && <p className={`truncate text-xs ${mkt.muted}`}>{current.tagline}</p>}
            </div>
            <div role="radiogroup" aria-label="Design" className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {sector.designs.map((d) => {
                const on = d.id === current?.id;
                return (
                  <button
                    key={d.id}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    onClick={() => onDesign(d.id)}
                    className={`group rounded-xl border p-2 text-left transition-transform duration-200 motion-safe:hover:-translate-y-0.5 ${focusRing} ${
                      on
                        ? "border-lime-500 bg-[var(--mkt-accent-soft)] ring-1 ring-lime-500"
                        : "border-[var(--mkt-border)] bg-[var(--mkt-surface)] hover:border-lime-500/40"
                    }`}
                  >
                    <DemoDesignThumb design={d} />
                    <span className="mt-2 flex items-center justify-between gap-1 px-0.5">
                      <span className="text-sm font-semibold text-[var(--mkt-text)]">{d.name}</span>
                      {on && <Check className="h-4 w-4 text-lime-500" />}
                    </span>
                    <span className={`block px-0.5 text-[11px] ${mkt.muted}`}>
                      {d.font || "Template font"} · {d.header} header
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          <section>
            <h3 className="mb-3 font-semibold text-[var(--mkt-text)]">{live ? "Try it live" : "Coming soon"}</h3>
            {live ? (
              <DemoVerticalPanel
                vertical={sector}
                active={active}
                defaultOpen={defaultOpen}
                blocked={!!blockedBy && !active}
                blockedVerticalName={blockedBy?.name}
                blockedVerticalId={blockedBy?.id}
                designs={sector.designs}
                design={current?.id}
                onShowActive={onShowActive}
              />
            ) : (
              <div className={`${mkt.cardSoft} px-4 py-4 text-sm text-[var(--mkt-text-secondary)]`}>
                We&apos;re finishing the {sector.name} template. Leave an enquiry and we&apos;ll notify you the moment
                it&apos;s live — or build it with us early.
              </div>
            )}
          </section>
        </div>

        {/* Footer CTA */}
        <div className="flex shrink-0 flex-col gap-2 border-t border-[var(--mkt-border)] bg-[var(--mkt-surface)] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7">
          <p className={`text-sm ${mkt.muted}`}>
            {live && current ? (
              <>
                Selected: <span className="font-semibold text-[var(--mkt-text)]">{current.name}</span>
              </>
            ) : (
              "Get notified when it launches"
            )}
          </p>
          {live && current ? (
            <Link
              href={`/subscribe?vertical=${sector.id}&design=${current.id}`}
              className={`${mkt.btnPrimary} ${mkt.btnPrimaryMd} ${focusRing}`}
            >
              Use this design <ArrowRight className="h-4 w-4" />
            </Link>
          ) : (
            <Link href={`/subscribe?vertical=${sector.id}`} className={`${mkt.btnPrimary} ${mkt.btnPrimaryMd} ${focusRing}`}>
              Notify me / enquire <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
