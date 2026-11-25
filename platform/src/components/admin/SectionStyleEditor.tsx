"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AlignLeft, AlignCenter, AlignRight, RotateCcw, Check } from "lucide-react";
import { updateSectionStyle } from "@/lib/actions/content";
import type { SectionStyle, SectionType, ThemeConfig } from "@/lib/config";
import { SECTION_LAYOUTS } from "@/lib/sectionDefaults";

const WIDTHS = [
  { v: "narrow", label: "Narrow" },
  { v: "normal", label: "Normal" },
  { v: "wide", label: "Wide" },
  { v: "full", label: "Full" },
] as const;

// Blocks whose card grid carries `.sec-cols` (see site/sections) — "cards per row" works there.
const COLS_TYPES = new Set([
  "stats", "gallery", "steps", "team", "eventList", "testimonials", "features",
  "toppers", "downloads", "pricingPlans", "productGrid", "productCategories",
]);

type SiteColors = ThemeConfig["colors"];

const inputCls = "w-full rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-800 px-3 py-2 text-sm outline-none focus:border-lime-500";
const chip = (active: boolean) =>
  `flex-1 inline-flex items-center justify-center gap-1 rounded-lg border px-2 py-2 text-xs font-semibold transition ${
    active
      ? "border-lime-500 bg-lime-500/10 text-lime-700 dark:text-lime-300"
      : "border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:border-slate-300"
  }`;

export function SectionStyleEditor({
  id,
  type,
  style,
  siteColors,
  onSaved,
}: {
  id: string;
  type?: string;
  style: string;
  siteColors?: SiteColors;
  onSaved?: (style: string) => void;
}) {
  const router = useRouter();
  const colors: SiteColors = siteColors ?? {
    primary: "#7cb518",
    primaryDark: "#5c8a12",
    secondary: "#0f2942",
    accent: "#8bc34a",
    dark: "#0a1f33",
    light: "#f4f7ee",
    text: "#334155",
    heading: "#0f2942",
  };

  const initial: SectionStyle = (() => {
    try {
      return JSON.parse(style);
    } catch {
      return {};
    }
  })();
  const [st, setSt] = useState<SectionStyle>(initial);
  const [pending, start] = useTransition();
  const [saved, setSaved] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);

  const dirty = useRef(false);
  const set = (patch: Partial<SectionStyle>) => {
    dirty.current = true;
    setSt((s) => ({ ...s, ...patch }));
    setSaved(false);
  };
  const save = () => start(async () => {
    try {
      const raw = JSON.stringify(st);
      await updateSectionStyle(id, raw);
      onSaved?.(raw);
      router.refresh();
      setSaved(true);
    } catch (e) {
      console.error("Save section style failed", e);
      alert(e instanceof Error ? e.message : "Save failed — try again");
    }
  });

  // Auto-save shortly after the last change so the preview follows the controls.
  useEffect(() => {
    if (!dirty.current) return;
    const t = setTimeout(() => { dirty.current = false; save(); }, 700);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- save reads this render's st
  }, [st]);
  // Leaving the panel before the auto-save fired: save the last change anyway.
  const stRef = useRef(st);
  useEffect(() => { stRef.current = st; });
  useEffect(() => () => {
    if (dirty.current) void updateSectionStyle(id, JSON.stringify(stRef.current)).then(() => router.refresh()).catch(() => {});
  }, [id, router]);

  const align = st.align ?? "center";
  const usingSiteColors = !st.accentColor && !st.textColor;

  const BACKGROUNDS: { v: NonNullable<SectionStyle["background"]>; label: string; color: string }[] = [
    { v: "default", label: "Website", color: "#ffffff" },
    { v: "light", label: "Light", color: colors.light },
    { v: "primary", label: "Brand", color: colors.primary },
    { v: "dark", label: "Dark", color: colors.dark },
  ];

  const layouts = type ? SECTION_LAYOUTS[type as SectionType] : undefined;
  const hasCardCustom = !!(st.cardBg || st.cardText || st.cardBorderColor || st.cardBorderWidth != null || st.cardRadius || st.cardShadow || st.cardSize);

  return (
    <div className="space-y-4">
      {/* Layout — most used */}
      <section className="rounded-xl border border-slate-200 dark:border-slate-700 p-3 space-y-3">
        <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Layout</p>

        {layouts && (
          <Field label="Section layout">
            <select className={inputCls} value={st.layout && layouts.includes(st.layout) ? st.layout : layouts[0]} onChange={(e) => set({ layout: e.target.value === layouts[0] ? undefined : e.target.value })}>
              {layouts.map((l) => <option key={l} value={l}>{l[0].toUpperCase() + l.slice(1)}</option>)}
            </select>
          </Field>
        )}

        <Field label="Text & cards alignment">
          <div className="flex gap-2">
            <button type="button" onClick={() => set({ align: "left" })} className={chip(align === "left")}>
              <AlignLeft className="w-4 h-4" /> Left
            </button>
            <button type="button" onClick={() => set({ align: "center" })} className={chip(align === "center")}>
              <AlignCenter className="w-4 h-4" /> Center
            </button>
            <button type="button" onClick={() => set({ align: "right" })} className={chip(align === "right")}>
              <AlignRight className="w-4 h-4" /> Right
            </button>
          </div>
          <p className="text-[11px] text-slate-400 mt-1.5">Center also groups cards in the middle (not left empty space).</p>
        </Field>

        <Field label="Section background">
          <div className="grid grid-cols-4 gap-2">
            {BACKGROUNDS.map((b) => {
              const on = (st.background ?? "default") === b.v;
              return (
                <button
                  type="button"
                  key={b.v}
                  onClick={() => set({ background: b.v })}
                  className={`rounded-lg border-2 p-1.5 text-center ${on ? "border-lime-500" : "border-slate-200 dark:border-slate-600"}`}
                >
                  <span className="block h-7 rounded border border-black/5" style={{ background: b.color }} />
                  <span className="text-[10px] text-slate-500 mt-1 block">{b.label}</span>
                </button>
              );
            })}
          </div>
        </Field>

      </section>

      {/* Size — direct controls */}
      <section className="rounded-xl border border-slate-200 dark:border-slate-700 p-3 space-y-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Size &amp; spacing</p>
          <p className="text-[11px] text-slate-400">Tip: on the preview, drag the green &ldquo;Space below&rdquo; handle at the bottom of a selected section.</p>
        </div>
        <Field label="Section width">
          <div className="flex gap-1.5">
            {WIDTHS.map((w) => (
              <button key={w.v} type="button" onClick={() => set({ width: w.v === "normal" ? undefined : w.v })} className={chip((st.width ?? "normal") === w.v)}>
                {w.label}
              </button>
            ))}
          </div>
        </Field>
        {type && COLS_TYPES.has(type) && (
          <Field label="Cards per row (computer)">
            <div className="flex gap-1.5">
              {([undefined, 1, 2, 3, 4] as const).map((n) => (
                <button key={n ?? "auto"} type="button" onClick={() => set({ cols: n })} className={chip(st.cols === n)}>
                  {n ?? "Auto"}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-slate-400 mt-1.5">Tablets show up to 2, phones keep the block&apos;s own layout.</p>
          </Field>
        )}
        <PadSlider
          label="Space above"
          value={st.padTop}
          legacy={st.spacingTop}
          onChange={(v) => set({ padTop: v, spacingTop: undefined })}
        />
        <PadSlider
          label="Space below"
          value={st.padBottom}
          legacy={st.spacingBottom}
          onChange={(v) => set({ padBottom: v, spacingBottom: undefined })}
        />
      </section>

      {/* Cards — simple */}
      <section className="rounded-xl border border-slate-200 dark:border-slate-700 p-3 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Cards</p>
            <p className="text-[11px] text-slate-400">Team, features, reviews, services…</p>
          </div>
          {hasCardCustom && (
            <button
              type="button"
              onClick={() => set({
                cardBg: undefined, cardText: undefined, cardBorderColor: undefined,
                cardBorderWidth: undefined, cardRadius: undefined, cardShadow: undefined, cardSize: undefined,
              })}
              className="text-[11px] font-semibold text-slate-500 hover:text-red-500 inline-flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" /> Reset
            </button>
          )}
        </div>

        <Field label="Card size">
          <div className="flex gap-2">
            {([
              ["sm", "S"],
              ["md", "M"],
              ["lg", "L"],
            ] as const).map(([v, label]) => (
              <button key={v} type="button" onClick={() => set({ cardSize: v })} className={chip((st.cardSize ?? "md") === v)}>
                {label}
              </button>
            ))}
          </div>
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <ColorField
            label="Card colour"
            value={st.cardBg}
            fallback="#ffffff"
            onChange={(v) => set({ cardBg: v })}
          />
          <ColorField
            label="Text colour"
            value={st.cardText}
            fallback={colors.text}
            onChange={(v) => set({ cardText: v })}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <ColorField
            label="Border colour"
            value={st.cardBorderColor}
            fallback="#e2e8f0"
            onChange={(v) => set({ cardBorderColor: v })}
          />
          <Field label={`Border size — ${st.cardBorderWidth ?? 1}px`}>
            <input
              type="range"
              min={0}
              max={6}
              step={1}
              value={st.cardBorderWidth ?? 1}
              onChange={(e) => set({ cardBorderWidth: Number(e.target.value) })}
              className="w-full accent-lime-500 mt-2"
            />
          </Field>
        </div>

        <Field label="Corners">
          <div className="flex gap-2">
            {([
              ["none", "Square"],
              ["sm", "Soft"],
              ["md", "Round"],
              ["lg", "Large"],
            ] as const).map(([v, label]) => (
              <button key={v} type="button" onClick={() => set({ cardRadius: v })} className={chip((st.cardRadius ?? "md") === v)}>
                {label}
              </button>
            ))}
          </div>
        </Field>

        <Field label="Shadow">
          <div className="flex gap-2">
            {([
              ["none", "None"],
              ["sm", "Soft"],
              ["md", "Medium"],
              ["lg", "Strong"],
            ] as const).map(([v, label]) => (
              <button key={v} type="button" onClick={() => set({ cardShadow: v })} className={chip((st.cardShadow ?? "sm") === v)}>
                {label}
              </button>
            ))}
          </div>
        </Field>
      </section>

      {/* Colours — compact */}
      <section className="rounded-xl border border-slate-200 dark:border-slate-700 p-3 space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Section colours</p>
          <button
            type="button"
            onClick={() => set({ accentColor: "", textColor: "" })}
            className={`text-[11px] font-semibold inline-flex items-center gap-1 ${usingSiteColors ? "text-lime-600" : "text-slate-500 hover:text-lime-600"}`}
          >
            {usingSiteColors && <Check className="w-3 h-3" />} Website colours
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <ColorField label="Accent" value={st.accentColor} fallback={colors.primary} onChange={(v) => set({ accentColor: v })} />
          <ColorField label="Text" value={st.textColor} fallback={colors.text} onChange={(v) => set({ textColor: v })} />
        </div>
      </section>

      {/* More */}
      <section className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <button type="button" onClick={() => setMoreOpen((o) => !o)} className="w-full px-3 py-2.5 flex items-center justify-between text-left">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">More options</p>
          <span className="text-xs font-semibold text-lime-600">{moreOpen ? "Hide" : "Show"}</span>
        </button>
        {moreOpen && (
          <div className="px-3 pb-3 space-y-3 border-t border-slate-100 dark:border-slate-800 pt-3">
            <Field label="Menu link ID (e.g. team → #team)">
              <input
                className={inputCls}
                value={st.anchorId ?? ""}
                onChange={(e) => set({ anchorId: e.target.value.replace(/[^a-zA-Z0-9-_]/g, "") })}
                placeholder="team"
              />
            </Field>
            <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
              <input type="checkbox" checked={!!st.hideOnMobile} onChange={(e) => set({ hideOnMobile: e.target.checked })} className="rounded" />
              Hide on phones
            </label>
            <Field label="Custom CSS class">
              <input className={inputCls} value={st.customClass ?? ""} onChange={(e) => set({ customClass: e.target.value })} placeholder="optional" />
            </Field>
          </div>
        )}
      </section>

      <div className="sticky bottom-0 -mx-1 px-1 pt-3 pb-1 bg-gradient-to-t from-white via-white dark:from-slate-900 dark:via-slate-900 to-transparent flex items-center gap-3">
        <button type="button" onClick={save} disabled={pending} className="rounded-lg bg-lime-500 text-white text-sm font-semibold px-4 py-2.5 hover:bg-lime-600 disabled:opacity-60 shadow-sm">
          {pending ? "Saving..." : "Save now"}
        </button>
        {saved ? <span className="text-sm text-green-600 font-medium">Saved ✓</span> : <span className="text-[11px] text-slate-400">Changes save automatically</span>}
      </div>
    </div>
  );
}

// Approximate px of the old presets, so the slider starts where the section already is.
const PRESET_PX: Record<string, number> = { none: 0, sm: 24, default: 112, lg: 112 };

function PadSlider({ label, value, legacy, onChange }: { label: string; value?: number; legacy?: string; onChange: (v: number | undefined) => void }) {
  const auto = typeof value !== "number";
  const shown = auto ? PRESET_PX[legacy ?? "default"] ?? 112 : value;
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs font-medium text-slate-500">{label} — {auto ? (legacy && legacy !== "default" ? legacy : "auto") : `${value}px`}</span>
        {!auto && (
          <button type="button" onClick={() => onChange(undefined)} className="text-[11px] font-semibold text-slate-500 hover:text-lime-600 inline-flex items-center gap-1">
            <RotateCcw className="w-3 h-3" /> Auto
          </button>
        )}
      </div>
      <div className="flex items-center gap-2">
        <input
          type="range"
          min={0}
          max={240}
          step={4}
          value={shown}
          onChange={(e) => onChange(Number(e.target.value))}
          className={`w-full accent-lime-500 ${auto ? "opacity-60" : ""}`}
          aria-label={label}
        />
        <button type="button" onClick={() => onChange(Math.max(0, shown - 16))} className="w-7 h-7 shrink-0 rounded-md border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 text-sm font-bold" aria-label={`Less ${label}`}>−</button>
        <button type="button" onClick={() => onChange(Math.min(400, shown + 16))} className="w-7 h-7 shrink-0 rounded-md border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 text-sm font-bold" aria-label={`More ${label}`}>+</button>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs font-medium text-slate-500 mb-1.5">{label}</span>
      {children}
    </label>
  );
}

function ColorField({
  label,
  value,
  fallback,
  onChange,
}: {
  label: string;
  value?: string;
  fallback: string;
  onChange: (v: string) => void;
}) {
  const hex = value && /^#[0-9a-fA-F]{3,8}$/.test(value) ? value : fallback;
  return (
    <Field label={label}>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={hex}
          onChange={(e) => onChange(e.target.value)}
          className="h-9 w-11 rounded-lg border border-slate-300 cursor-pointer shrink-0"
        />
        {value ? (
          <button type="button" onClick={() => onChange("")} className="text-slate-400 hover:text-slate-700" title="Reset">
            <RotateCcw className="w-4 h-4" />
          </button>
        ) : (
          <span className="text-[10px] text-slate-400">Default</span>
        )}
      </div>
    </Field>
  );
}
