"use client";

import { Check } from "lucide-react";
import { DemoDesignThumb, type DesignThumbModel } from "./DemoDesignThumb";
import { mkt } from "@/lib/marketingTheme";

export type DesignOption = DesignThumbModel & {
  blurb?: string;
  tagline?: string;
  font?: string;
};

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--mkt-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--mkt-bg)]";

const COLS = {
  drawer: "grid-cols-2",
  page: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5",
  checkout: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5",
} as const;

export function DesignPicker({
  designs,
  value,
  onChange,
  layout = "page",
  label = "Choose a design",
  hint,
}: {
  designs: DesignOption[];
  value: string;
  onChange: (id: string) => void;
  layout?: keyof typeof COLS | "bar";
  label?: string;
  hint?: string;
}) {
  const current = designs.find((d) => d.id === value) ?? designs[0];
  const line = (d: DesignOption) => d.blurb || d.tagline || "";

  if (layout === "bar") {
    return (
      <div role="radiogroup" aria-label={label} className="flex gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
        {designs.map((d) => {
          const on = d.id === current?.id;
          return (
            <button
              key={d.id}
              type="button"
              role="radio"
              aria-checked={on}
              onClick={() => onChange(d.id)}
              title={`${d.name} — ${line(d)}`}
              className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-left transition ${focusRing} ${
                on
                  ? "border-[var(--mkt-accent)] bg-[var(--mkt-accent-soft)] text-[var(--mkt-text)]"
                  : "border-[var(--mkt-border)] bg-[var(--mkt-surface)] text-[var(--mkt-text-muted)] hover:border-[var(--mkt-accent)]/40 hover:text-[var(--mkt-text)]"
              }`}
            >
              <span className="flex -space-x-0.5" aria-hidden>
                <span className="h-2.5 w-2.5 rounded-full ring-1 ring-white dark:ring-[var(--mkt-surface)]" style={{ background: d.colors.primary }} />
                <span className="h-2.5 w-2.5 rounded-full ring-1 ring-white dark:ring-[var(--mkt-surface)]" style={{ background: d.colors.secondary }} />
              </span>
              <span className="text-[11px] font-semibold">{d.name}</span>
              {on && <Check className="h-3 w-3 text-[var(--mkt-accent-text)]" strokeWidth={3} />}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <section>
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          {label ? <h3 className="text-base font-semibold text-[var(--mkt-text)] sm:text-lg">{label}</h3> : null}
          {hint && <p className={`mt-0.5 text-sm ${mkt.muted}`}>{hint}</p>}
        </div>
        {current && (
          <p className={`text-sm ${mkt.muted}`}>
            Selected: <span className="font-semibold text-[var(--mkt-text)]">{current.name}</span>
            {line(current) ? <span> · {line(current)}</span> : null}
          </p>
        )}
      </div>
      <div role="radiogroup" aria-label={label} className={`mt-4 grid gap-3 ${COLS[layout]}`}>
        {designs.map((d) => {
          const on = d.id === current?.id;
          return (
            <button
              key={d.id}
              type="button"
              role="radio"
              aria-checked={on}
              onClick={() => onChange(d.id)}
              className={`group rounded-2xl border p-2 text-left transition ${focusRing} ${
                on
                  ? "border-[var(--mkt-accent)] bg-[var(--mkt-accent-soft)] ring-2 ring-[var(--mkt-accent)]"
                  : "border-[var(--mkt-border)] bg-[var(--mkt-surface)] hover:-translate-y-0.5 hover:border-[var(--mkt-accent)]/45 hover:shadow-md"
              }`}
            >
              <div className="relative">
                <DemoDesignThumb design={d} compact={layout === "drawer" || layout === "checkout"} />
                {on && (
                  <span className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-full bg-[var(--mkt-accent)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[var(--mkt-accent-on)] shadow-sm">
                    <Check className="h-3 w-3" strokeWidth={3} /> Selected
                  </span>
                )}
              </div>
              <span className="mt-2.5 block px-1">
                <span className="flex items-center justify-between gap-1">
                  <span className="text-sm font-semibold text-[var(--mkt-text)]">{d.name}</span>
                </span>
                <span className={`mt-0.5 block text-xs leading-snug ${mkt.muted}`}>{line(d)}</span>
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
