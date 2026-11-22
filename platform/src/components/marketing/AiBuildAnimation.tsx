"use client";

import { useEffect, useRef, useState } from "react";
import { Check } from "lucide-react";
import { BrandMark, BrandSpinner } from "@/components/BrandLogo";

// Lovable-style build log: deliberate, step-by-step, so the user sees what is being made.
// The AI call runs in parallel; the timeline holds on "Writing pages" until it returns,
// then plays the remaining steps and calls onFinished.
type Phase = { title: string; ms: number; logs: (pages: string[]) => string[] };

const PHASES: Phase[] = [
  { title: "Understanding your idea", ms: 2200, logs: () => ["Reading your prompt", "Detecting industry & audience", "Picking the right sections"] },
  { title: "Setting up the project", ms: 2600, logs: () => ["Created package.json", "Installed 214 packages · next · react · tailwind", "Configured SEO, sitemap & analytics"] },
  { title: "Designing the frontend", ms: 3000, logs: () => ["Generated colour palette & fonts", "Created components/Header.tsx", "Created components/Hero.tsx", "Created components/Footer.tsx"] },
  {
    title: "Writing pages & content",
    ms: 3600,
    logs: (pages) => (pages.length ? pages.map((p) => `Writing pages/${p.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`) : ["Drafting headlines", "Writing page content"]),
  },
  { title: "Connecting forms & admin", ms: 2400, logs: () => ["Wired contact & enquiry forms", "Added WhatsApp & call buttons", "Set up your admin panel"] },
  { title: "Optimising & launching", ms: 2000, logs: () => ["Optimised images", "Checked mobile layout", "Publishing preview"] },
];
const WRITE = 3; // holds here until the AI result arrives
const TOTAL = PHASES.reduce((s, p) => s + p.ms, 0);
const STARTS = PHASES.map((_, i) => PHASES.slice(0, i).reduce((s, p) => s + p.ms, 0));
const HOLD_AT = STARTS[WRITE] + PHASES[WRITE].ms * 0.6;
const TICK = 100;

export function AiBuildAnimation({
  siteName,
  pageNames = [],
  done = false,
  accent = "#2563ff",
  onFinished,
}: {
  siteName?: string;
  pageNames?: string[];
  /** the AI result is in */
  done?: boolean;
  accent?: string;
  onFinished?: () => void;
}) {
  const [t, setT] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const doneRef = useRef(done);
  useEffect(() => {
    doneRef.current = done;
  }, [done]);
  const finished = useRef(false);

  useEffect(() => {
    const id = window.setInterval(() => {
      setT((prev) => (!doneRef.current && prev >= HOLD_AT ? prev : Math.min(TOTAL, prev + TICK)));
      setElapsed((e) => (finished.current ? e : e + TICK));
    }, TICK);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if (t >= TOTAL && done && !finished.current) {
      finished.current = true;
      const id = window.setTimeout(() => onFinished?.(), 700);
      return () => window.clearTimeout(id);
    }
  }, [t, done, onFinished]);

  const phase = Math.min(PHASES.length - 1, STARTS.findLastIndex((s) => t >= s));
  const complete = t >= TOTAL && done;
  const pct = complete ? 100 : Math.min(99, Math.round((t / TOTAL) * 100));
  const holding = !done && t >= HOLD_AT;

  return (
    <div className="grid h-full min-h-[460px] gap-6 overflow-y-auto p-5 sm:p-7 lg:grid-cols-[minmax(0,330px)_minmax(0,1fr)] lg:gap-8">
      {/* Build log */}
      <div className="flex min-w-0 flex-col">
        <div className="flex items-center gap-3">
          <span className="spx-loader inline-flex">
            <BrandMark size={34} cursor={false} />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-[var(--mkt-text)]">{complete ? "Your website is ready" : "Building your website"}</p>
            {siteName && <p className="truncate text-xs text-[var(--mkt-text-muted)]">{siteName}</p>}
          </div>
          <span className="ml-auto rounded-full bg-[var(--mkt-surface-muted)] px-2 py-0.5 font-mono text-[11px] tabular-nums text-[var(--mkt-text-muted)]">
            {Math.floor(elapsed / 1000)}s
          </span>
        </div>
        <div className="mt-4 flex items-center gap-3">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[var(--mkt-surface-muted)]">
            <div
              className="relative h-full overflow-hidden rounded-full bg-gradient-to-r from-[#16b6ff] via-[#2563ff] to-[#7c3aed] transition-[width] duration-200 ease-linear"
              style={{ width: `${pct}%` }}
            >
              <span className="ai-bar-shine absolute inset-0" />
            </div>
          </div>
          <span className="w-9 text-right font-mono text-xs font-semibold tabular-nums text-[var(--mkt-text)]">{pct}%</span>
        </div>

        <ol className="mt-5 space-y-1">
          {PHASES.map((p, i) => {
            const state = complete || i < phase ? "done" : i === phase ? "active" : "todo";
            const logs = p.logs(pageNames);
            const local = t - STARTS[i];
            const shown = state === "done" ? logs.length : state === "active" ? Math.min(logs.length, 1 + Math.floor((local / p.ms) * logs.length)) : 0;
            return (
              <li key={p.title} className={`rounded-xl px-3 py-2 transition-colors ${state === "active" ? "bg-[var(--mkt-surface-muted)]" : ""}`}>
                <div className="flex items-center gap-2.5">
                  <span
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full transition ${
                      state === "done" ? "bg-emerald-500 text-white" : state === "active" ? "text-[var(--mkt-accent-2)]" : "border border-[var(--mkt-border-strong)]"
                    }`}
                  >
                    {state === "done" ? <Check className="h-3 w-3" strokeWidth={3} /> : state === "active" ? <BrandSpinner className="h-4 w-4" /> : null}
                  </span>
                  <span
                    className={`text-[13px] ${state === "todo" ? "text-[var(--mkt-text-muted)]" : "font-semibold text-[var(--mkt-text)]"}`}
                  >
                    {p.title}
                  </span>
                </div>
                {shown > 0 && state === "active" && (
                  <ul className="mt-1.5 space-y-1 pl-[30px] font-mono text-[11px] leading-relaxed text-[var(--mkt-text-muted)]">
                    {logs.slice(0, shown).map((l, k) => (
                      <li key={l} className="ai-log-line flex items-center gap-1.5">
                        <span className={k === shown - 1 ? "text-[var(--mkt-accent-2)]" : "text-emerald-500"}>{k === shown - 1 ? "›" : "✓"}</span>
                        {l}
                        {k === shown - 1 && <span className="ai-caret">▍</span>}
                      </li>
                    ))}
                    {holding && i === WRITE && <li className="ai-log-line text-[var(--mkt-text-muted)]">… AI is still writing, almost there</li>}
                  </ul>
                )}
              </li>
            );
          })}
        </ol>
      </div>

      {/* Live wireframe being assembled */}
      <div className="hidden min-w-0 items-center lg:flex">
        <div className="w-full overflow-hidden rounded-2xl border border-[var(--mkt-border)] bg-[var(--mkt-surface)] shadow-xl">
          <div className="flex items-center gap-1.5 border-b border-[var(--mkt-border)] bg-[var(--mkt-surface-muted)] px-3 py-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
            <span className="mx-auto max-w-[60%] truncate rounded-md bg-[var(--mkt-surface)] px-3 py-0.5 text-[10px] text-[var(--mkt-text-muted)]">
              {(siteName || "your-site").toLowerCase().replace(/[^a-z0-9]+/g, "")}.sitepixl.com
            </span>
          </div>
          <div className="space-y-3 p-4">
            <Block on={phase >= 2}>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <span className="h-5 w-5 rounded-md" style={{ background: accent }} />
                  <span className="h-2 w-20 rounded bg-[var(--mkt-border-strong)]" />
                </span>
                <span className="flex gap-2">
                  {[0, 1, 2, 3].map((k) => (
                    <span key={k} className="h-1.5 w-9 rounded bg-[var(--mkt-border)]" />
                  ))}
                  <span className="h-4 w-14 rounded-full" style={{ background: accent }} />
                </span>
              </div>
            </Block>
            <Block on={phase >= 2 && t - STARTS[2] > 1200}>
              <div className="rounded-xl p-5" style={{ background: `linear-gradient(135deg, ${accent}22, ${accent}0a)` }}>
                <span className="block h-3 w-3/5 rounded" style={{ background: `${accent}cc` }} />
                <span className="mt-2 block h-3 w-2/5 rounded bg-[var(--mkt-border-strong)]" />
                <span className="mt-3 block h-1.5 w-4/5 rounded bg-[var(--mkt-border)]" />
                <span className="mt-1.5 block h-1.5 w-3/5 rounded bg-[var(--mkt-border)]" />
                <span className="mt-4 flex gap-2">
                  <span className="h-5 w-20 rounded-full" style={{ background: accent }} />
                  <span className="h-5 w-16 rounded-full border border-[var(--mkt-border-strong)]" />
                </span>
              </div>
            </Block>
            <div className="grid grid-cols-3 gap-2.5">
              {[0, 1, 2].map((k) => (
                <Block key={k} on={phase > WRITE || (phase === WRITE && t - STARTS[WRITE] > 500 + k * 700)}>
                  <div className="rounded-lg border border-[var(--mkt-border)] p-2.5">
                    <span className="block h-6 w-6 rounded-md" style={{ background: `${accent}33` }} />
                    <span className="mt-2 block h-1.5 w-4/5 rounded bg-[var(--mkt-border-strong)]" />
                    <span className="mt-1 block h-1.5 w-3/5 rounded bg-[var(--mkt-border)]" />
                  </div>
                </Block>
              ))}
            </div>
            <Block on={phase >= 4}>
              <div className="flex items-center gap-3 rounded-lg border border-dashed border-[var(--mkt-border-strong)] p-2.5">
                <span className="h-5 flex-1 rounded bg-[var(--mkt-surface-muted)]" />
                <span className="h-5 flex-1 rounded bg-[var(--mkt-surface-muted)]" />
                <span className="h-5 w-16 rounded" style={{ background: accent }} />
                <span className="h-7 w-7 rounded-full bg-[#25d366]" />
              </div>
            </Block>
            <Block on={phase >= 5}>
              <div className="flex items-center justify-between rounded-lg bg-[#0b1020] px-3 py-2.5">
                <span className="h-1.5 w-24 rounded bg-white/30" />
                <span className="flex items-center gap-1.5 text-[10px] font-semibold text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> {complete ? "Live" : "Publishing"}
                </span>
              </div>
            </Block>
          </div>
        </div>
      </div>
    </div>
  );
}

// Off = faint dashed "blueprint" ghost of the block; on = the real block fades in.
function Block({ on, children }: { on: boolean; children: React.ReactNode }) {
  return (
    <div className="relative">
      <div className={`transition-all duration-700 ease-out ${on ? "translate-y-0 opacity-100 blur-0" : "translate-y-1 opacity-[0.12] blur-[1px] grayscale"}`}>
        {children}
      </div>
      {!on && <div className="ai-ghost pointer-events-none absolute inset-0 rounded-lg border border-dashed border-[var(--mkt-border-strong)]" />}
    </div>
  );
}

// ─── Refine: short "updating" overlay over the live preview ─────────────────────
// Holds on "Rewriting content" until the AI answers, then finishes and calls onFinished
// (the parent swaps in the new site and remounts the preview = auto refresh).
const UPDATE: { title: string; ms: number }[] = [
  { title: "Reading your request", ms: 900 },
  { title: "Rewriting content", ms: 1600 },
  { title: "Applying design", ms: 900 },
  { title: "Refreshing preview", ms: 700 },
];
const U_TOTAL = UPDATE.reduce((s, p) => s + p.ms, 0);
const U_STARTS = UPDATE.map((_, i) => UPDATE.slice(0, i).reduce((s, p) => s + p.ms, 0));
const U_HOLD = U_STARTS[1] + UPDATE[1].ms * 0.7;

export function AiUpdateOverlay({ request, done, onFinished }: { request: string; done: boolean; onFinished: () => void }) {
  const [t, setT] = useState(0);
  const doneRef = useRef(done);
  const fired = useRef(false);
  useEffect(() => {
    doneRef.current = done;
  }, [done]);
  useEffect(() => {
    const id = window.setInterval(() => setT((p) => (!doneRef.current && p >= U_HOLD ? p : Math.min(U_TOTAL, p + TICK))), TICK);
    return () => window.clearInterval(id);
  }, []);
  useEffect(() => {
    if (t >= U_TOTAL && done && !fired.current) {
      fired.current = true;
      onFinished();
    }
  }, [t, done, onFinished]);
  const step = Math.min(UPDATE.length - 1, U_STARTS.findLastIndex((s) => t >= s));
  const pct = Math.min(99, Math.round((t / U_TOTAL) * 100));
  return (
    <div className="ai-update absolute inset-0 z-20 grid place-items-center bg-[var(--mkt-bg)]/55 p-4 backdrop-blur-[3px]">
      <div className="w-full max-w-sm rounded-2xl border border-[var(--mkt-border)] bg-[var(--mkt-surface)] p-5 shadow-2xl">
        <div className="flex items-center gap-3">
          <span className="spx-loader inline-flex">
            <BrandMark size={30} cursor={false} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-[var(--mkt-text)]">Updating your website</p>
            <p className="truncate text-xs text-[var(--mkt-text-muted)]">“{request}”</p>
          </div>
          <span className="font-mono text-xs font-semibold tabular-nums text-[var(--mkt-text)]">{pct}%</span>
        </div>
        <div className="mt-3 h-1 overflow-hidden rounded-full bg-[var(--mkt-surface-muted)]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#16b6ff] via-[#2563ff] to-[#7c3aed] transition-[width] duration-200 ease-linear"
            style={{ width: `${pct}%` }}
          />
        </div>
        <ol className="mt-4 space-y-2">
          {UPDATE.map((u, i) => (
            <li key={u.title} className="flex items-center gap-2.5 text-[13px]">
              <span
                className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full ${
                  i < step ? "bg-emerald-500 text-white" : i === step ? "text-[var(--mkt-accent-2)]" : "border border-[var(--mkt-border-strong)]"
                }`}
              >
                {i < step ? <Check className="h-2.5 w-2.5" strokeWidth={3} /> : i === step ? <BrandSpinner className="h-3.5 w-3.5" /> : null}
              </span>
              <span className={i > step ? "text-[var(--mkt-text-muted)]" : "font-medium text-[var(--mkt-text)]"}>{u.title}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
