import { ArrowUp, Sparkles } from "lucide-react";
import { mkt } from "@/lib/marketingTheme";

// Landing-page entry to the AI builder. A plain GET form — no JS needed — that
// hands the prompt to /ai-builder, where the full chat-style builder runs.
const IDEAS = ["NGO for child education", "Gym with membership plans", "Pharmacy with home delivery", "Webinar & workshop booking"];

export function AiPromptTeaser() {
  return (
    <section id="ai-builder" className="scroll-mt-16 relative isolate overflow-hidden border-y border-[var(--mkt-border)] bg-[var(--mkt-bg-alt)]">
      <div className="absolute inset-0 -z-10 mkt-hero-wash opacity-60" aria-hidden />
      <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 sm:py-20">
        <span className={mkt.badge}>
          <Sparkles className="h-3.5 w-3.5" /> AI Website Builder
        </span>
        <h2 className={`${mkt.h2} mt-5`}>
          Describe it. <span className="text-[var(--mkt-accent-text)]">AI builds it.</span>
        </h2>
        <p className={`mx-auto mt-3 max-w-xl text-[15px] leading-relaxed ${mkt.muted}`}>
          Type what your business needs — get a complete multi-page website with live preview and admin panel in seconds.
        </p>
        <form
          action="/ai-builder"
          className="mt-8 flex items-end gap-2 rounded-3xl border border-[var(--mkt-border-strong)] bg-[var(--mkt-surface)] p-2.5 text-left shadow-xl shadow-slate-900/10 transition focus-within:border-lime-500/60 focus-within:ring-4 focus-within:ring-lime-500/10"
        >
          <textarea
            name="prompt"
            rows={2}
            required
            minLength={8}
            placeholder="e.g. A play school in Pune with programs, fees, gallery and admission enquiry…"
            aria-label="Describe your website"
            className="min-h-[3.25rem] flex-1 resize-none bg-transparent px-3 py-2 text-[15px] text-[var(--mkt-text)] placeholder:text-[var(--mkt-text-muted)] outline-none"
          />
          <button
            type="submit"
            aria-label="Start building"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-lime-500 text-slate-950 shadow-md shadow-lime-600/30 transition hover:bg-lime-400"
          >
            <ArrowUp className="h-5 w-5" strokeWidth={2.5} />
          </button>
        </form>
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          {IDEAS.map((idea) => (
            <a
              key={idea}
              href={`/ai-builder?prompt=${encodeURIComponent(`Create a website for a ${idea}.`)}`}
              className="rounded-full border border-[var(--mkt-border)] bg-[var(--mkt-surface)] px-3.5 py-1.5 text-xs font-medium text-[var(--mkt-text-secondary)] transition hover:border-lime-500/50 hover:text-[var(--mkt-text)]"
            >
              {idea}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
