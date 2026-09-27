"use client";

import { useMemo, useState } from "react";
import { Plus, Trash2, ChevronUp, ChevronDown, Link2, GripVertical } from "lucide-react";
import type { NavItem } from "@/lib/config";

const COMMON_PAGES = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact", href: "/contact" },
  { label: "Pricing", href: "/pricing" },
  { label: "FAQ", href: "/faq" },
  { label: "Blog", href: "/blog" },
];

function toLines(items: NavItem[]): string {
  return items
    .filter((n) => n.label.trim())
    .map((n) => `${n.label.trim()} | ${n.href.trim() || "#"}`)
    .join("\n");
}

/**
 * Graphical menu / quick-links editor.
 * Writes the classic "Label | /href" lines into a hidden input for existing form actions.
 */
export function NavLinksEditor({
  name,
  initial,
  title = "Menu links",
  hint = "Tap a chip to add a common page, or build your own list.",
}: {
  name: string;
  initial: NavItem[];
  title?: string;
  hint?: string;
}) {
  const [items, setItems] = useState<NavItem[]>(
    initial.length ? initial.map((n) => ({ ...n })) : [{ label: "", href: "/" }],
  );

  const payload = useMemo(() => toLines(items), [items]);

  const update = (i: number, patch: Partial<NavItem>) => {
    setItems((prev) => prev.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));
  };
  const remove = (i: number) => {
    setItems((prev) => (prev.length <= 1 ? [{ label: "", href: "/" }] : prev.filter((_, idx) => idx !== i)));
  };
  const add = (preset?: NavItem) => {
    setItems((prev) => [...prev, preset ?? { label: "", href: "/" }]);
  };
  const move = (i: number, dir: -1 | 1) => {
    setItems((prev) => {
      const j = i + dir;
      if (j < 0 || j >= prev.length) return prev;
      const next = [...prev];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  };

  const used = new Set(items.map((i) => i.href.toLowerCase()));

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
      <div className="px-3 py-2 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-700 flex items-center gap-2">
        <Link2 className="w-3.5 h-3.5 text-lime-600" />
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold text-slate-600 dark:text-slate-300">{title}</p>
          <p className="text-[10px] text-slate-400 truncate">{hint}</p>
        </div>
        <span className="text-[10px] font-semibold text-slate-400 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-full px-2 py-0.5">
          {items.filter((i) => i.label.trim()).length} links
        </span>
      </div>

      <div className="p-3 space-y-3">
        {/* Quick add chips */}
        <div className="flex flex-wrap gap-1.5">
          {COMMON_PAGES.map((p) => {
            const taken = used.has(p.href.toLowerCase());
            return (
              <button
                key={p.href}
                type="button"
                disabled={taken}
                onClick={() => add(p)}
                className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold transition ${
                  taken
                    ? "border-slate-100 text-slate-300 dark:border-slate-800 dark:text-slate-600 cursor-not-allowed"
                    : "border-lime-300/70 text-lime-700 bg-lime-500/10 hover:bg-lime-500/20 dark:text-lime-400"
                }`}
              >
                + {p.label}
              </button>
            );
          })}
        </div>

        {/* Link rows */}
        <div className="space-y-2">
          {items.map((item, i) => (
            <div
              key={i}
              className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/60 p-2.5 space-y-2"
            >
              <div className="flex items-center gap-1.5">
                <span className="text-slate-300 p-0.5 shrink-0" title="Order">
                  <GripVertical className="w-3.5 h-3.5" />
                </span>
                <span className="text-[10px] font-bold text-slate-400 w-5 shrink-0">#{i + 1}</span>
                <div className="flex items-center gap-0.5 ml-auto">
                  <button type="button" onClick={() => move(i, -1)} disabled={i === 0} className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30" title="Move up">
                    <ChevronUp className="w-3.5 h-3.5" />
                  </button>
                  <button type="button" onClick={() => move(i, 1)} disabled={i === items.length - 1} className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30" title="Move down">
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                  <button type="button" onClick={() => remove(i)} className="p-1 rounded-md text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30" title="Remove">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-2">
                <label className="block">
                  <span className="text-[10px] font-semibold text-slate-400 mb-0.5 block">Button text</span>
                  <input
                    value={item.label}
                    onChange={(e) => update(i, { label: e.target.value })}
                    placeholder="e.g. Home"
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-800 px-3 py-2 text-sm outline-none focus:border-lime-500"
                  />
                </label>
                <label className="block">
                  <span className="text-[10px] font-semibold text-slate-400 mb-0.5 block">Goes to page</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-400 text-xs shrink-0 pl-0.5">/</span>
                    <input
                      value={item.href === "/" ? "" : item.href.startsWith("/") ? item.href.slice(1) : item.href}
                      onChange={(e) => {
                        const raw = e.target.value.trim();
                        let href = "/";
                        if (raw) {
                          if (raw.startsWith("http://") || raw.startsWith("https://") || raw.startsWith("mailto:") || raw.startsWith("tel:")) {
                            href = raw;
                          } else {
                            href = raw.startsWith("/") ? raw : `/${raw}`;
                          }
                        }
                        update(i, { href });
                      }}
                      placeholder="about  or  classes"
                      className="w-full rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-800 px-3 py-2 text-sm outline-none focus:border-lime-500"
                    />
                  </div>
                </label>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() => add()}
          className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl border border-dashed border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 px-3 py-2.5 text-sm font-semibold hover:border-lime-500 hover:text-lime-600"
        >
          <Plus className="w-4 h-4" /> Add link
        </button>
      </div>

      <input type="hidden" name={name} value={payload} />
    </div>
  );
}
