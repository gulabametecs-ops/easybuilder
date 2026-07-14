"use client";

import { useState, useTransition } from "react";
import { Plus, Trash2, ChevronUp, ChevronDown } from "lucide-react";
import { updateSectionContent } from "@/lib/actions/content";
import { SECTION_DEFAULTS } from "@/lib/sectionDefaults";
import { ImageInput } from "./ImageInput";

type Json = Record<string, unknown>;

// ── friendly labels ──────────────────────────────────────────────────────────
const LABELS: Record<string, string> = {
  titleTop: "Title (line 1)",
  titleHighlight: "Title (highlighted)",
  customHtml: "Custom HTML",
  body: "Body paragraphs (one per line)",
  points: "Bullet points (one per line)",
  phones: "Phone numbers (one per line)",
  categories: "Categories shown (one per line)",
  serviceAreas: "Service areas (one per line)",
  primaryBtn: "Primary button",
  secondaryBtn: "Secondary button",
  buttonLabel: "Button label",
  buttonHref: "Button link",
  showSidebar: "Show sidebar",
  mapEmbed: "Google Maps embed URL",
  targetDate: "Target date & time",
};

function label(key: string) {
  return LABELS[key] ?? key.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase());
}

const inputCls = "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-lime-500 focus:ring-2 focus:ring-lime-500/20";

// common lucide icon names offered as suggestions for icon fields
const ICON_SUGGESTIONS = ["badge-check", "clock", "shield", "tag", "home", "users", "star", "heart", "phone", "mail", "map-pin", "check", "edit", "wrench", "truck", "award", "thumbs-up", "zap", "gift", "calendar", "book-open", "graduation-cap", "utensils", "stethoscope", "package", "factory"];

const isImageKey = (k: string) => k === "image" || k.toLowerCase().endsWith("image") || k === "favicon" || k === "ogImage";
const isCodeKey = (k: string) => k === "customHtml" || k === "html" || k === "code" || k === "mapEmbed";
const isLongKey = (k: string) => k === "description" || k === "text" || k === "a" || k === "note" || k === "subtitle" || k === "body";

// ── build a blank item from a template (keeps structure, clears text) ──────────
function blankFrom(sample: unknown): unknown {
  if (Array.isArray(sample)) return [];
  if (sample && typeof sample === "object") {
    const out: Json = {};
    for (const [k, v] of Object.entries(sample as Json)) out[k] = blankFrom(v);
    return out;
  }
  if (typeof sample === "number") return sample; // keep default number (e.g. rating 5)
  if (typeof sample === "boolean") return sample;
  return "";
}

// ─────────────────────────────────────────────────────────────────────────────
export function SectionContentEditor({ id, type, content }: { id: string; type: string; content: string }) {
  const defaults = (SECTION_DEFAULTS as Record<string, Json>)[type] ?? {};
  const parsed: Json = (() => { try { return JSON.parse(content); } catch { return {}; } })();
  // merge parsed over defaults so structure/templates are always present
  const initial: Json = { ...defaults, ...parsed };

  const [state, setState] = useState<Json>(initial);
  const [pending, start] = useTransition();
  const [saved, setSaved] = useState(false);

  const save = () => start(async () => { await updateSectionContent(id, JSON.stringify(state)); setSaved(true); });

  return (
    <div className="space-y-4">
      <ObjectEditor value={state} sample={defaults} onChange={(v) => { setState(v as Json); setSaved(false); }} />
      <div className="flex items-center gap-3 pt-1">
        <button onClick={save} disabled={pending} className="rounded-lg bg-slate-900 text-white text-sm font-semibold px-4 py-2 hover:bg-slate-800 disabled:opacity-60">
          {pending ? "Saving..." : "Save section"}
        </button>
        {saved && <span className="text-sm text-green-600">Saved ✓</span>}
      </div>
    </div>
  );
}

// ── an object: render each of its fields ──────────────────────────────────────
function ObjectEditor({ value, sample, onChange }: { value: Json; sample: Json; onChange: (v: Json) => void }) {
  const set = (k: string, v: unknown) => onChange({ ...value, [k]: v });
  return (
    <div className="space-y-4">
      {Object.keys(value).map((key) => (
        <FieldEditor key={key} k={key} value={value[key]} sample={(sample as Json)?.[key]} onChange={(v) => set(key, v)} />
      ))}
    </div>
  );
}

// ── one field: pick the right control by shape ────────────────────────────────
function FieldEditor({ k, value, sample, onChange }: { k: string; value: unknown; sample: unknown; onChange: (v: unknown) => void }) {
  // hero layout variant
  if (k === "variant") {
    return (
      <Labeled text="Layout">
        <select className={inputCls} value={String(value ?? "classic")} onChange={(e) => onChange(e.target.value)}>
          <option value="classic">Classic — content left, image right</option>
          <option value="split">Split — image left, content right</option>
          <option value="centered">Centered — text over full background</option>
          <option value="custom">Custom — my own HTML</option>
        </select>
      </Labeled>
    );
  }
  // image
  if (isImageKey(k) && (typeof value === "string" || value == null)) {
    return <Labeled text={label(k)}><ImageInput value={String(value ?? "")} onChange={onChange} aspect="aspect-video" /></Labeled>;
  }
  // icon (text with suggestions)
  if (k === "icon" && (typeof value === "string" || value == null)) {
    return (
      <Labeled text="Icon">
        <input className={inputCls} list="icon-suggestions" value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} placeholder="e.g. star" />
        <datalist id="icon-suggestions">{ICON_SUGGESTIONS.map((i) => <option key={i} value={i} />)}</datalist>
      </Labeled>
    );
  }
  // target date/time
  if (k === "targetDate" && (typeof value === "string" || value == null)) {
    return <Labeled text="Target date &amp; time"><input type="datetime-local" className={inputCls} value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} /></Labeled>;
  }
  // rating number
  if (k === "rating" && typeof value === "number") {
    return (
      <Labeled text="Rating (1–5)">
        <input type="number" min={1} max={5} className={inputCls} value={value} onChange={(e) => onChange(Number(e.target.value))} />
      </Labeled>
    );
  }
  // string[] -> one per line
  if (Array.isArray(value) && value.every((x) => typeof x === "string")) {
    return (
      <Labeled text={label(k)}>
        <textarea className={inputCls} rows={Math.max(2, value.length)} value={(value as string[]).join("\n")}
          onChange={(e) => onChange(e.target.value.split("\n"))} />
      </Labeled>
    );
  }
  // array of objects -> list editor
  if (Array.isArray(value)) {
    const itemSample = (Array.isArray(sample) && sample.length ? sample[0] : (value[0] ?? {})) as Json;
    return <ListEditor label={label(k)} items={value as Json[]} itemSample={itemSample} onChange={onChange} />;
  }
  // nested object (e.g. a button {label, href})
  if (value && typeof value === "object") {
    return (
      <div className="rounded-lg border border-slate-200 p-3 bg-white">
        <p className="text-xs font-semibold text-slate-500 mb-2">{label(k)}</p>
        <ObjectEditor value={value as Json} sample={(sample as Json) ?? {}} onChange={(v) => onChange(v)} />
      </div>
    );
  }
  // boolean
  if (typeof value === "boolean") {
    return (
      <label className="flex items-center gap-2 text-sm text-slate-600">
        <input type="checkbox" checked={value} onChange={(e) => onChange(e.target.checked)} className="rounded" /> {label(k)}
      </label>
    );
  }
  // number
  if (typeof value === "number") {
    return <Labeled text={label(k)}><input type="number" className={inputCls} value={value} onChange={(e) => onChange(Number(e.target.value))} /></Labeled>;
  }
  // strings
  const str = String(value ?? "");
  if (isCodeKey(k)) {
    return <Labeled text={label(k)}><textarea className={inputCls + " font-mono text-xs"} rows={5} value={str} onChange={(e) => onChange(e.target.value)} /></Labeled>;
  }
  const long = isLongKey(k) || str.length > 60;
  return (
    <Labeled text={label(k)}>
      {long ? <textarea className={inputCls} rows={3} value={str} onChange={(e) => onChange(e.target.value)} />
        : <input className={inputCls} value={str} onChange={(e) => onChange(e.target.value)} />}
    </Labeled>
  );
}

// ── list of objects: add / remove / reorder rows ──────────────────────────────
function ListEditor({ label: lbl, items, itemSample, onChange }: { label: string; items: Json[]; itemSample: Json; onChange: (v: Json[]) => void }) {
  const update = (i: number, v: Json) => onChange(items.map((it, idx) => (idx === i ? v : it)));
  const remove = (i: number) => onChange(items.filter((_, idx) => idx !== i));
  const add = () => onChange([...items, blankFrom(itemSample) as Json]);
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };
  return (
    <div>
      <p className="text-xs font-semibold text-slate-500 mb-2">{lbl}</p>
      <div className="space-y-3">
        {items.map((item, i) => (
          <div key={i} className="rounded-lg border border-slate-200 bg-white p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-400">Item {i + 1}</span>
              <div className="flex items-center gap-1">
                <button onClick={() => move(i, -1)} disabled={i === 0} className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30"><ChevronUp className="w-4 h-4" /></button>
                <button onClick={() => move(i, 1)} disabled={i === items.length - 1} className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30"><ChevronDown className="w-4 h-4" /></button>
                <button onClick={() => remove(i)} className="p-1 text-red-500 hover:text-red-700"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
            <ObjectEditor value={item} sample={itemSample} onChange={(v) => update(i, v)} />
          </div>
        ))}
      </div>
      <button onClick={add} className="mt-2 inline-flex items-center gap-1.5 rounded-lg border border-dashed border-slate-300 text-slate-600 px-3 py-1.5 text-sm font-medium hover:border-lime-500 hover:text-lime-600">
        <Plus className="w-4 h-4" /> Add item
      </button>
    </div>
  );
}

function Labeled({ text, children }: { text: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs font-medium text-slate-500 mb-1">{text}</span>
      {children}
    </label>
  );
}
