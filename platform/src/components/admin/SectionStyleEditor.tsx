"use client";

import { useState, useTransition } from "react";
import { updateSectionStyle } from "@/lib/actions/content";
import type { SectionStyle } from "@/lib/config";

const inputCls = "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-lime-500";

const SPACING = [
  { v: "default", label: "Normal" },
  { v: "none", label: "None" },
  { v: "sm", label: "Small" },
  { v: "lg", label: "Large" },
];
const BACKGROUNDS = [
  { v: "default", label: "Default" },
  { v: "light", label: "Light grey" },
  { v: "dark", label: "Dark" },
  { v: "primary", label: "Brand colour" },
];

export function SectionStyleEditor({ id, style }: { id: string; style: string }) {
  const initial: SectionStyle = (() => { try { return JSON.parse(style); } catch { return {}; } })();
  const [st, setSt] = useState<SectionStyle>(initial);
  const [pending, start] = useTransition();
  const [saved, setSaved] = useState(false);
  const set = (patch: Partial<SectionStyle>) => { setSt((s) => ({ ...s, ...patch })); setSaved(false); };
  const save = () => start(async () => { await updateSectionStyle(id, JSON.stringify(st)); setSaved(true); });

  return (
    <div className="space-y-4">
      <Field label="Background">
        <select className={inputCls} value={st.background ?? "default"} onChange={(e) => set({ background: e.target.value as SectionStyle["background"] })}>
          {BACKGROUNDS.map((b) => <option key={b.v} value={b.v}>{b.label}</option>)}
        </select>
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
      <Field label="Anchor ID (for menu links, e.g. #contact)">
        <input className={inputCls} value={st.anchorId ?? ""} onChange={(e) => set({ anchorId: e.target.value.replace(/[^a-zA-Z0-9-_]/g, "") })} placeholder="contact" />
      </Field>
      <label className="flex items-center gap-2 text-sm text-slate-600">
        <input type="checkbox" checked={!!st.hideOnMobile} onChange={(e) => set({ hideOnMobile: e.target.checked })} className="rounded" /> Hide on mobile
      </label>
      <Field label="Custom CSS class (advanced)">
        <input className={inputCls} value={st.customClass ?? ""} onChange={(e) => set({ customClass: e.target.value })} placeholder="my-class" />
      </Field>
      <div className="flex items-center gap-3">
        <button onClick={save} disabled={pending} className="rounded-lg bg-slate-900 text-white text-sm font-semibold px-4 py-2 hover:bg-slate-800 disabled:opacity-60">
          {pending ? "Saving..." : "Save design"}
        </button>
        {saved && <span className="text-sm text-green-600">Saved ✓</span>}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="block text-xs font-medium text-slate-500 mb-1">{label}</span>{children}</label>;
}
