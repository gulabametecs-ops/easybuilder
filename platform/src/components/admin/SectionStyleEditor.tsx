"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AlignLeft, AlignCenter, AlignRight, RotateCcw, Check } from "lucide-react";
import { updateSectionStyle } from "@/lib/actions/content";
import type { SectionStyle, ThemeConfig } from "@/lib/config";

const SPACING = [
  { v: "default", label: "Normal" },
  { v: "none", label: "None" },
  { v: "sm", label: "Small" },
  { v: "lg", label: "Large" },
];

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
  style,
  siteColors,
  onSaved,
}: {
  id: string;
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

  const set = (patch: Partial<SectionStyle>) => {
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

  const align = st.align ?? "center";
  const usingSiteColors = !st.accentColor && !st.textColor;

  const BACKGROUNDS: { v: NonNullable<SectionStyle["background"]>; label: string; color: string }[] = [
    { v: "default", label: "Website", color: "#ffffff" },
    { v: "light", label: "Light", color: colors.light },
    { v: "primary", label: "Brand", color: colors.primary },
    { v: "dark", label: "Dark", color: colors.dark },
  ];

  const hasCardCustom = !!(st.cardBg || st.cardText || st.cardBorderColor || st.cardBorderWidth != null || st.cardRadius || st.cardShadow || st.cardSize);

  return (
    <div className="space-y-4">
      {/* Layout — most used */}
      <section className="rounded-xl border border-slate-200 dark:border-slate-700 p-3 space-y-3">
        <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Layout</p>

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

        <div className="grid grid-cols-2 gap-3">
          <Field label="Space above">
            <select className={inputCls} value={st.spacingTop ?? "default"} onChange={(e) => set({ spacingTop: e.target.value as SectionStyle["spacingTop"] })}>
              {SPACING.map((s) => <option key={s.v} value={s.v}>{s.label}</option>)}
            </select>
          </Field>
          <Field label="Space below">
            <select className={inputCls} value={st.spacingBottom ?? "default"} onChange={(e) => set({ spacingBottom: e.target.value as SectionStyle["spacingBottom"] })}>
              {SPACING.map((s) => <option key={s.v} value={s.v}>{s.label}</option>)}
            </select>
          </Field>
        </div>
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
          {pending ? "Saving..." : "Save style"}
        </button>
        {saved && <span className="text-sm text-green-600 font-medium">Saved ✓</span>}
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
