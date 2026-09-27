"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronDown, ChevronRight, ExternalLink, Play } from "lucide-react";
import { VerticalIcon } from "./VerticalIcon";
import { mkt } from "@/lib/marketingTheme";

type Sector = {
  id: string;
  name: string;
  tagline: string;
  icon: string;
  status: string;
  image: string;
  description?: string;
};
type Category = { name: string; image: string; count: number; sectors: Sector[] };

function sectorLabel(count: number) {
  return `${count} sector${count === 1 ? "" : "s"}`;
}

export function SectorExplorer({ categories }: { categories: Category[] }) {
  const [open, setOpen] = useState<string>(categories[0]?.name ?? "");
  const panelRef = useRef<HTMLDivElement>(null);
  const active = categories.find((c) => c.name === open) ?? categories[0] ?? null;

  useEffect(() => {
    if (!panelRef.current) return;
    panelRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [open]);

  if (!active) return null;

  const liveCount = active.sectors.filter((s) => s.status === "live").length;
  const soonCount = active.sectors.length - liveCount;

  return (
    <div>
      {/* Phones: swipeable row. sm+: grid, so every category is visible (no hidden overflow). */}
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 snap-x snap-mandatory scrollbar-none sm:grid sm:grid-cols-4 sm:overflow-visible sm:mx-0 sm:px-0">
        {categories.map((c) => {
          const isOpen = open === c.name;
          const live = c.sectors.filter((s) => s.status === "live").length;
          return (
            <button
              key={c.name}
              type="button"
              onClick={() => setOpen(c.name)}
              className={`group relative shrink-0 w-[160px] sm:w-auto snap-start overflow-hidden rounded-2xl text-left transition-all duration-300 ${
                isOpen
                  ? "ring-2 ring-lime-500 shadow-lg shadow-lime-500/15"
                  : "ring-1 ring-black/10 dark:ring-white/10 hover:ring-lime-500/40 hover:shadow-md"
              }`}
            >
              <div className="relative h-28">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={c.image}
                  alt={c.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                {live > 0 && (
                  <span className="absolute top-2 right-2 text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-lime-500 text-slate-950">
                    {live} live
                  </span>
                )}
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p className="text-white font-bold text-sm leading-tight line-clamp-2">{c.name}</p>
                  <p className="text-white/70 text-[11px] mt-1 flex items-center gap-0.5">
                    {sectorLabel(c.count)}
                    {isOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div ref={panelRef} className={`mt-6 sm:mt-8 ${mkt.card} overflow-hidden border-lime-500/20`}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-5 py-4 border-b border-[var(--mkt-border)] bg-[var(--mkt-accent-soft)]">
          <div>
            <h3 className="font-bold text-[var(--mkt-text)] text-lg">{active.name}</h3>
            <p className={`text-sm mt-0.5 ${mkt.muted}`}>
              {sectorLabel(active.count)}
              {liveCount > 0 && ` · ${liveCount} live`}
              {soonCount > 0 && ` · ${soonCount} soon`}
            </p>
          </div>
          <Link href="/demos" className={`${mkt.btnSecondary} px-4 py-2 text-sm font-semibold shrink-0`}>
            All demos <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {active.sectors.map((v) => {
              const live = v.status === "live";
              return (
                <article
                  key={v.id}
                  className={`group flex flex-col overflow-hidden rounded-xl ${mkt.card} ${mkt.cardHover}`}
                >
                  <div className="relative h-28 sm:h-32 shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={v.image} alt={v.name} className="absolute inset-0 w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
                    <span className="absolute top-2.5 left-2.5 w-8 h-8 rounded-lg flex items-center justify-center bg-white/95 text-slate-900 shadow-sm">
                      <VerticalIcon name={v.icon} className="w-4 h-4" />
                    </span>
                    <span
                      className={`absolute top-2.5 right-2.5 text-[9px] font-bold px-2 py-0.5 rounded-full ${
                        live ? "bg-lime-500 text-slate-950" : "bg-amber-400 text-slate-900"
                      }`}
                    >
                      {live ? "LIVE" : "SOON"}
                    </span>
                    <h4 className="absolute bottom-2.5 left-2.5 right-2.5 text-white font-bold text-sm">{v.name}</h4>
                  </div>

                  <div className="flex flex-col flex-1 p-4">
                    <p className={`text-xs ${mkt.muted}`}>{v.tagline}</p>
                    {v.description && (
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 line-clamp-2 flex-1">{v.description}</p>
                    )}

                    <div className="mt-4 flex flex-wrap gap-2">
                      {live && (
                        <Link
                          href={`/demos?vertical=${v.id}`}
                          className={`${mkt.btnSecondary} px-3 py-2 text-xs font-semibold`}
                        >
                          <Play className="w-3.5 h-3.5 text-lime-600 dark:text-lime-400" />
                          Try demo
                        </Link>
                      )}
                      <Link
                        href={`/subscribe?vertical=${v.id}`}
                        className={`inline-flex items-center gap-1.5 rounded-lg bg-lime-500 text-slate-950 px-3 py-2 text-xs font-semibold hover:bg-lime-400 transition`}
                      >
                        Get started
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
