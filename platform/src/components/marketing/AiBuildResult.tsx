"use client";

import Link from "next/link";
import {
  ArrowRight,
  Check,
  ExternalLink,
  Layout,
  Layers,
  Play,
  ShoppingBag,
  Sparkles,
} from "lucide-react";
import type { WebsiteBlueprint } from "@/lib/ai/blueprintSchema";
import { blueprintStats } from "@/lib/ai/blueprintPreview";
import { mkt } from "@/lib/marketingTheme";
import { TIERS } from "@/lib/plans";

type Props = {
  blueprint: WebsiteBlueprint;
  questions: string[];
  onFullPreview: () => void;
  onPersist: () => void;
  onReset: () => void;
};

export function AiBuildResultSummary({ blueprint, questions, onFullPreview }: Omit<Props, "onPersist" | "onReset">) {
  const stats = blueprintStats(blueprint);
  const style = blueprint.design?.style?.trim();

  return (
    <div className="space-y-6 ai-result-enter">
      {/* Success banner */}
      <div className="relative overflow-hidden rounded-2xl border border-lime-500/35 bg-gradient-to-br from-lime-500/15 via-emerald-500/8 to-transparent p-5 sm:p-6">
        <div className="absolute top-0 right-0 w-40 h-40 bg-lime-400/20 rounded-full blur-3xl pointer-events-none" aria-hidden />
        <div className="relative flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex items-start gap-3 min-w-0">
            <span className="ai-build-success flex items-center justify-center w-12 h-12 rounded-2xl bg-lime-500 text-slate-950 shadow-lg shadow-lime-500/30 shrink-0">
              <Check className="w-6 h-6" strokeWidth={2.5} />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-lime-700 dark:text-lime-400 mb-1">
                Build complete
              </p>
              <h3 className="text-xl sm:text-2xl font-bold text-[var(--mkt-text)] tracking-tight">
                {blueprint.website.name}
              </h3>
              {blueprint.website.description && (
                <p className={`text-sm mt-1 max-w-xl ${mkt.muted}`}>{blueprint.website.description}</p>
              )}
              <div className="flex flex-wrap gap-2 mt-3">
                <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-[var(--mkt-surface)] border border-[var(--mkt-border)]">
                  <Layout className="w-3.5 h-3.5 text-lime-600" />
                  {stats.pages.length} pages
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-[var(--mkt-surface)] border border-[var(--mkt-border)]">
                  <Layers className="w-3.5 h-3.5 text-lime-600" />
                  {stats.totalSections} sections
                </span>
                {style && (
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[var(--mkt-surface)] border border-[var(--mkt-border)] capitalize">
                    {style} design
                  </span>
                )}
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onFullPreview}
            className={`${mkt.btnSecondary} ${mkt.btnPrimarySm} shrink-0`}
          >
            <ExternalLink className="w-4 h-4" /> Full preview
          </button>
        </div>
      </div>

      {/* Pages breakdown */}
      <div className="rounded-xl border border-[var(--mkt-border)] bg-[var(--mkt-surface-muted)]/60 p-4 sm:p-5">
        <p className="text-sm font-semibold text-[var(--mkt-text)] mb-3 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-lime-600" />
          What we built for you
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {stats.pages.map((p) => (
            <div
              key={p.slug}
              className="flex items-start gap-2.5 rounded-xl border border-[var(--mkt-border)] bg-[var(--mkt-surface)] px-3 py-2.5"
            >
              <span className="w-6 h-6 rounded-full bg-lime-500/15 flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-3.5 h-3.5 text-lime-600" />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[var(--mkt-text)] truncate">{p.name}</p>
                <p className="text-[11px] text-[var(--mkt-text-muted)]">
                  {p.sectionCount} section{p.sectionCount !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {questions.length > 0 && (
        <div className="rounded-xl border border-amber-500/25 bg-amber-500/8 p-4 space-y-2">
          <p className="text-sm font-semibold text-[var(--mkt-text)]">Info you can add later in admin</p>
          <ul className="text-xs text-amber-800 dark:text-amber-200 space-y-1 list-disc pl-4">
            {questions.map((q) => (
              <li key={q}>{q}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export function AiBuildResultActions({ onPersist, onReset }: Pick<Props, "onPersist" | "onReset">) {
  return (
    <div className="space-y-4 ai-result-enter" style={{ animationDelay: "120ms" }}>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="rounded-2xl border-2 border-lime-500/40 bg-lime-500/5 p-5 sm:p-6 flex flex-col">
          <div className="flex items-center gap-2 text-lime-700 dark:text-lime-400 font-semibold text-sm mb-2">
            <ShoppingBag className="w-4 h-4" />
            Buy & launch your site
          </div>
          <p className={`text-sm ${mkt.muted} flex-1`}>
            Pick a plan — your exact AI design goes live on your domain with admin panel, hosting & support.
          </p>
          <div className="flex flex-wrap gap-2 mt-4 mb-4">
            {TIERS.map((t) => (
              <Link
                key={t.id}
                href={`/subscribe?from=ai&tier=${t.id}`}
                onClick={onPersist}
                className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition ${
                  t.popular
                    ? "border-lime-500 bg-lime-500 text-white hover:bg-lime-600"
                    : "border-[var(--mkt-border)] bg-[var(--mkt-surface)] hover:border-lime-500/40"
                }`}
              >
                {t.name}
              </Link>
            ))}
          </div>
          <Link
            href="/subscribe?from=ai"
            onClick={onPersist}
            className={`${mkt.btnPrimary} py-3 justify-center`}
          >
            Choose plan & checkout
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="rounded-2xl border border-[var(--mkt-border)] bg-[var(--mkt-surface-muted)]/50 p-5 sm:p-6 flex flex-col">
          <div className="flex items-center gap-2 text-[var(--mkt-text)] font-semibold text-sm mb-2">
            <Play className="w-4 h-4 text-lime-600" />
            Just explore the platform
          </div>
          <p className={`text-sm ${mkt.muted} flex-1`}>
            Not ready to buy? Try a live sector demo — see the admin panel, editor and features. Your AI design stays saved.
          </p>
          <Link
            href="/demos"
            onClick={onPersist}
            className={`${mkt.btnSecondary} py-3 justify-center mt-4`}
          >
            Browse live demos
            <ArrowRight className="w-4 h-4" />
          </Link>
          <p className={`text-[11px] text-center mt-3 ${mkt.muted}`}>
            No payment needed for demo
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onReset}
        className={`w-full text-sm ${mkt.muted} hover:text-[var(--mkt-text)] py-2`}
      >
        ← Start over with a new prompt
      </button>
    </div>
  );
}
