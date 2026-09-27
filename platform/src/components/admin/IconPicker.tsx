"use client";

import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { Icon, ICON_OPTIONS } from "@/components/site/Icon";

export function IconPicker({
  value,
  onChange,
  label = "Icon",
}: {
  value: string;
  onChange: (name: string) => void;
  label?: string;
}) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return ICON_OPTIONS;
    return ICON_OPTIONS.filter((n) => n.includes(needle) || n.replace(/-/g, " ").includes(needle));
  }, [q]);

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:border-lime-500"
        >
          <span className="w-8 h-8 rounded-lg bg-lime-500/10 text-lime-600 flex items-center justify-center shrink-0">
            <Icon name={value || "star"} className="w-4 h-4" />
          </span>
          {open ? "Close" : "Choose icon"}
        </button>
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"
            title="Clear"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {open && (
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-3 shadow-sm">
          <div className="relative mb-3">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search icons…"
              className="w-full rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-800 pl-9 pr-3 py-2 text-sm outline-none focus:border-lime-500"
              autoFocus
            />
          </div>
          <div className="grid grid-cols-5 sm:grid-cols-6 gap-1.5 max-h-56 overflow-y-auto">
            {filtered.map((name) => {
              const on = value === name;
              return (
                <button
                  key={name}
                  type="button"
                  title={name}
                  onClick={() => {
                    onChange(name);
                    setOpen(false);
                    setQ("");
                  }}
                  className={`aspect-square rounded-lg border flex items-center justify-center transition ${
                    on
                      ? "border-lime-500 bg-lime-500/15 text-lime-700 dark:text-lime-400"
                      : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-lime-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                  }`}
                >
                  <Icon name={name} className="w-5 h-5" />
                </button>
              );
            })}
            {filtered.length === 0 && (
              <p className="col-span-full text-center text-xs text-slate-400 py-6">No icons match</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
