"use client";

import { Check, Loader2 } from "lucide-react";

const STEPS = [
  "Understanding your idea",
  "Planning pages",
  "Writing content",
  "Applying design",
  "Almost ready",
];

export function AiBuildAnimation({
  siteName,
  pageNames = [],
  done = false,
}: {
  siteName?: string;
  pageNames?: string[];
  done?: boolean;
}) {
  const step = done ? STEPS.length - 1 : Math.min(3, pageNames.length);
  const progress = done ? 100 : 72;

  return (
    <div className="flex flex-col items-center justify-center min-h-[420px] px-6 py-10 text-center">
      <Loader2 className={`w-8 h-8 text-lime-500 mb-4 ${done ? "hidden" : "animate-spin"}`} />
      {done && (
        <span className="w-10 h-10 rounded-full bg-lime-500 text-slate-950 flex items-center justify-center mb-4">
          <Check className="w-5 h-5" strokeWidth={2.5} />
        </span>
      )}
      <p className="text-sm font-semibold text-[var(--mkt-text)]">
        {done ? "Website ready" : "Building your website…"}
      </p>
      {siteName && <p className="text-lg font-bold text-[var(--mkt-text)] mt-1">{siteName}</p>}
      <p className="text-xs text-[var(--mkt-text-muted)] mt-1">{STEPS[Math.min(step, STEPS.length - 1)]}</p>
      <div className="w-full max-w-xs h-1.5 rounded-full bg-[var(--mkt-surface-muted)] mt-4 overflow-hidden">
        <div className="h-full bg-lime-500 transition-all duration-500" style={{ width: `${progress}%` }} />
      </div>
      {pageNames.length > 0 && (
        <div className="flex flex-wrap justify-center gap-1.5 mt-5">
          {pageNames.map((p) => (
            <span key={p} className="text-[11px] px-2 py-0.5 rounded-full border border-[var(--mkt-border)] text-[var(--mkt-text-muted)]">
              {p}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
