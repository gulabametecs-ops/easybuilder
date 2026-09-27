"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import {
  Paintbrush, RotateCcw, X, Check,
  AlignLeft, AlignCenter, AlignRight,
  Italic, Underline, CaseSensitive,
} from "lucide-react";
import type { FieldStyle } from "@/lib/fieldStyle";
import { isFieldStyleEmpty, mergeFieldStyle } from "@/lib/fieldStyle";

type Mode = "text" | "card";

const SIZES: FieldStyle["fontSize"][] = ["sm", "md", "lg", "xl", "2xl", "3xl", "4xl"];
const WEIGHTS: { v: NonNullable<FieldStyle["fontWeight"]>; label: string }[] = [
  { v: "normal", label: "Aa" },
  { v: "medium", label: "Me" },
  { v: "semibold", label: "Se" },
  { v: "bold", label: "Bo" },
  { v: "extrabold", label: "Bl" },
];

function hexColor(c: string | undefined, fallback: string) {
  if (c && /^#[0-9a-fA-F]{3,8}$/.test(c)) {
    return c.length === 4 ? `#${c[1]}${c[1]}${c[2]}${c[2]}${c[3]}${c[3]}` : c.slice(0, 7);
  }
  return fallback;
}

function sameStyle(a?: FieldStyle, b?: FieldStyle) {
  return JSON.stringify(a ?? {}) === JSON.stringify(b ?? {});
}

const seg = (on: boolean) =>
  `flex-1 min-w-0 px-1.5 py-1.5 text-[11px] font-semibold transition ${
    on
      ? "bg-slate-900 text-white dark:bg-lime-500 dark:text-slate-900"
      : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
  }`;

const iconBtn = (on: boolean) =>
  `flex-1 inline-flex items-center justify-center rounded-lg py-2 transition ${
    on
      ? "bg-slate-900 text-white dark:bg-lime-500 dark:text-slate-900"
      : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
  }`;

export function FieldStyleButton({
  value,
  onChange,
  onApply,
  defaults,
  mode = "text",
  title = "Style",
}: {
  value?: FieldStyle;
  onChange: (next: FieldStyle | undefined) => void;
  /** Persist to the live website after Apply. */
  onApply?: (next: FieldStyle | undefined) => void | Promise<void>;
  defaults?: FieldStyle;
  mode?: Mode;
  title?: string;
}) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<FieldStyle | undefined>(value);
  const [pending, start] = useTransition();
  const [justSaved, setJustSaved] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  const active = !isFieldStyleEmpty(value);
  const dirty = !sameStyle(draft, value);
  const d = mergeFieldStyle(defaults, draft);

  useEffect(() => {
    if (open) {
      setDraft(value);
      setJustSaved(false);
    }
  }, [open, value]);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) {
        if (!dirty) setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open, dirty]);

  const patch = (p: Partial<FieldStyle>) => {
    setDraft((prev) => {
      const next = { ...(prev ?? {}), ...p };
      return isFieldStyleEmpty(next) ? undefined : next;
    });
    setJustSaved(false);
  };

  const apply = () => {
    const next = draft;
    onChange(next);
    start(async () => {
      try {
        await onApply?.(next);
        setJustSaved(true);
      } catch (e) {
        console.error(e);
        alert(e instanceof Error ? e.message : "Could not apply — try again");
      }
    });
  };

  const reset = () => {
    setDraft(undefined);
    setJustSaved(false);
  };

  return (
    <div className="relative shrink-0" ref={rootRef}>
      <button
        type="button"
        title={title}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen((o) => !o);
        }}
        className={`p-1.5 rounded-lg border transition ${
          active || open
            ? "border-lime-500 bg-lime-500/15 text-lime-700 dark:text-lime-400"
            : "border-slate-200 dark:border-slate-600 text-slate-400 hover:text-lime-600 hover:border-lime-400"
        }`}
      >
        <Paintbrush className="w-3.5 h-3.5" />
      </button>

      {open && (
        <div
          className="absolute right-0 top-full mt-1.5 z-40 w-[min(18.5rem,calc(100vw-1.5rem))] rounded-2xl border border-slate-200/80 dark:border-slate-600 bg-white dark:bg-slate-900 shadow-2xl shadow-slate-900/10 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header + live preview */}
          <div className="px-3.5 pt-3 pb-2.5 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{title}</p>
              <p
                className="mt-1.5 truncate text-base leading-tight"
                style={{
                  color: d.color,
                  fontWeight: d.fontWeight === "extrabold" ? 800 : d.fontWeight === "bold" ? 700 : d.fontWeight === "semibold" ? 600 : d.fontWeight === "medium" ? 500 : 400,
                  fontStyle: d.italic ? "italic" : undefined,
                  textDecoration: d.underline ? "underline" : undefined,
                  textTransform: d.uppercase ? "uppercase" : undefined,
                  opacity: (d.opacity ?? 100) / 100,
                }}
              >
                Preview Aa
              </p>
            </div>
            <div className="flex items-center gap-0.5 shrink-0">
              <button type="button" onClick={reset} className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30" title="Reset to website default">
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button type="button" onClick={() => { if (!dirty || confirm("Discard style changes?")) setOpen(false); }} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="p-3.5 space-y-3.5 max-h-[min(58vh,24rem)] overflow-y-auto">
            {/* Align */}
            <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-0.5">
              {([
                ["left", AlignLeft],
                ["center", AlignCenter],
                ["right", AlignRight],
              ] as const).map(([a, Ic]) => (
                <button key={a} type="button" onClick={() => patch({ align: a })} className={iconBtn(d.align === a)} title={a}>
                  <Ic className="w-4 h-4" />
                </button>
              ))}
            </div>

            {/* Colour */}
            <div className="flex items-center gap-2.5">
              <label className="relative w-10 h-10 rounded-xl border border-slate-200 dark:border-slate-600 overflow-hidden cursor-pointer shrink-0 shadow-inner">
                <span className="absolute inset-0" style={{ background: hexColor(d.color, "#0f2942") }} />
                <input
                  type="color"
                  value={hexColor(d.color, "#0f2942")}
                  onChange={(e) => patch({ color: e.target.value })}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </label>
              <input
                value={d.color ?? ""}
                onChange={(e) => patch({ color: e.target.value || undefined })}
                className="flex-1 min-w-0 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs font-mono outline-none focus:border-lime-500"
                placeholder="#000000"
              />
            </div>

            {/* Size */}
            <div>
              <p className="text-[10px] font-semibold text-slate-400 mb-1.5 uppercase tracking-wide">Size</p>
              <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-0.5 overflow-hidden">
                {SIZES.map((s) => (
                  <button key={s} type="button" onClick={() => patch({ fontSize: s })} className={seg(d.fontSize === s)}>
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Weight */}
            <div>
              <p className="text-[10px] font-semibold text-slate-400 mb-1.5 uppercase tracking-wide">Weight</p>
              <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-0.5">
                {WEIGHTS.map((w) => (
                  <button key={w.v} type="button" onClick={() => patch({ fontWeight: w.v })} className={seg(d.fontWeight === w.v)} title={w.v}>
                    {w.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Format */}
            <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-0.5 gap-0.5">
              <button type="button" onClick={() => patch({ italic: !d.italic })} className={iconBtn(!!d.italic)} title="Italic">
                <Italic className="w-3.5 h-3.5" />
              </button>
              <button type="button" onClick={() => patch({ underline: !d.underline })} className={iconBtn(!!d.underline)} title="Underline">
                <Underline className="w-3.5 h-3.5" />
              </button>
              <button type="button" onClick={() => patch({ uppercase: !d.uppercase })} className={iconBtn(!!d.uppercase)} title="Uppercase">
                <CaseSensitive className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Opacity */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Opacity</p>
                <span className="text-[10px] font-mono text-slate-500">{d.opacity ?? 100}%</span>
              </div>
              <input
                type="range"
                min={20}
                max={100}
                step={5}
                value={d.opacity ?? 100}
                onChange={(e) => {
                  const n = Number(e.target.value);
                  patch({ opacity: n >= 100 ? undefined : n });
                }}
                className="w-full accent-lime-500"
              />
            </div>

            {mode === "card" && (
              <div className="space-y-3 pt-1 border-t border-slate-100 dark:border-slate-800">
                <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Card</p>
                <div className="flex items-center gap-2">
                  <label className="relative w-9 h-9 rounded-lg border border-slate-200 overflow-hidden cursor-pointer shrink-0">
                    <span className="absolute inset-0" style={{ background: hexColor(d.bg, "#ffffff") }} />
                    <input type="color" value={hexColor(d.bg, "#ffffff")} onChange={(e) => patch({ bg: e.target.value })} className="absolute inset-0 opacity-0 cursor-pointer" />
                  </label>
                  <span className="text-xs text-slate-500">Fill</span>
                  <label className="relative w-9 h-9 rounded-lg border border-slate-200 overflow-hidden cursor-pointer shrink-0 ml-auto">
                    <span className="absolute inset-0" style={{ background: hexColor(d.borderColor, "#e2e8f0") }} />
                    <input type="color" value={hexColor(d.borderColor, "#e2e8f0")} onChange={(e) => patch({ borderColor: e.target.value })} className="absolute inset-0 opacity-0 cursor-pointer" />
                  </label>
                  <span className="text-xs text-slate-500">Border</span>
                </div>
                <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-0.5">
                  {(["none", "sm", "md", "lg", "full"] as const).map((r) => (
                    <button key={r} type="button" onClick={() => patch({ radius: r })} className={seg(d.radius === r)}>{r}</button>
                  ))}
                </div>
                <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-0.5">
                  {(["none", "sm", "md", "lg"] as const).map((sh) => (
                    <button key={sh} type="button" onClick={() => patch({ shadow: sh })} className={seg(d.shadow === sh)}>{sh}</button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Apply footer */}
          <div className="px-3.5 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/40 flex items-center gap-2">
            {justSaved && !dirty ? (
              <p className="flex-1 text-xs font-medium text-green-600 inline-flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Live on website
              </p>
            ) : (
              <p className="flex-1 text-[11px] text-slate-400">
                {dirty ? "Unsaved style changes" : "Matches saved style"}
              </p>
            )}
            <button
              type="button"
              disabled={pending}
              onClick={apply}
              className="inline-flex items-center gap-1.5 rounded-xl bg-lime-500 hover:bg-lime-600 disabled:opacity-50 text-white text-xs font-bold px-3.5 py-2 shadow-sm transition"
            >
              {pending ? "Saving…" : dirty ? "Apply" : "Apply to site"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
