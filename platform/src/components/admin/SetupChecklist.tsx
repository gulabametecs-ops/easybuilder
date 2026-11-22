import Link from "next/link";
import { CheckCircle2, Circle, ChevronRight, X, ListChecks } from "lucide-react";
import { setSetupChecklistHidden } from "@/lib/actions/dashboard";
import type { ChecklistItem } from "@/lib/setupChecklist";

// Dashboard "Getting started" card. `collapsed` renders just the link that brings it back.
export function SetupChecklist({ items, canDismiss, collapsed }: { items: ChecklistItem[]; canDismiss: boolean; collapsed?: boolean }) {
  const done = items.filter((i) => i.done).length;

  if (collapsed) {
    return canDismiss ? (
      <form action={setSetupChecklistHidden.bind(null, false)}>
        <button type="submit" className="inline-flex items-center gap-1 text-slate-500 hover:text-lime-600">
          <ListChecks className="w-3.5 h-3.5" /> Setup {done}/{items.length}
        </button>
      </form>
    ) : null;
  }

  const pct = Math.round((done / items.length) * 100);
  return (
    <section className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 sm:p-5" aria-labelledby="setup-title">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-lime-600">Getting started</p>
          <h2 id="setup-title" className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
            {done} of {items.length} done. Finish setting up your website
          </h2>
        </div>
        {canDismiss && (
          <form action={setSetupChecklistHidden.bind(null, true)}>
            <button type="submit" title="Hide checklist" aria-label="Hide checklist" className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-slate-200">
              <X className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>
      <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 mt-3 mb-4 overflow-hidden" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label="Setup progress">
        <div className="h-full bg-lime-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
      </div>
      <ul className="grid sm:grid-cols-2 gap-1.5">
        {items.map((c) => (
          <li key={c.id}>
            <Link
              href={c.href}
              className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 border transition ${
                c.done
                  ? "border-transparent bg-slate-50 dark:bg-slate-800/40"
                  : "border-slate-200 dark:border-slate-700 hover:border-lime-400"
              }`}
            >
              {c.done ? <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> : <Circle className="w-4 h-4 text-slate-300 shrink-0" />}
              <span className="min-w-0 flex-1">
                <span className={`block text-sm ${c.done ? "text-slate-400 line-through" : "font-semibold text-slate-800 dark:text-slate-100"}`}>{c.label}</span>
                {!c.done && <span className="block text-[11px] text-slate-400 truncate">{c.hint}</span>}
              </span>
              {!c.done && <ChevronRight className="w-4 h-4 text-slate-300 shrink-0" />}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
