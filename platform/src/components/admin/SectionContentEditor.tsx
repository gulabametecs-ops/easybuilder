"use client";

import { createContext, useContext, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, ChevronUp, ChevronDown, ChevronRight, Copy, GripVertical } from "lucide-react";
import { updateSectionContent } from "@/lib/actions/content";
import { SECTION_DEFAULTS } from "@/lib/sectionDefaults";
import { defaultTheme } from "@/lib/template";
import type { ThemeConfig } from "@/lib/config";
import type { FieldStyle } from "@/lib/fieldStyle";
import { websiteFieldDefaults } from "@/lib/fieldStyle";
import { ImageInput } from "./ImageInput";
import { FieldStyleButton } from "./FieldStyleButton";
import { IconPicker } from "./IconPicker";
import { PURPOSES } from "@/lib/property";

type Json = Record<string, unknown>;
type SiteColors = ThemeConfig["colors"];

const SiteColorsCtx = createContext<SiteColors>(defaultTheme.colors);
const PersistCtx = createContext<() => Promise<void>>(async () => {});

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
  image: "Background image",
  bgColor: "Banner colour",
  imageOpacity: "Image opacity",
  overlayOpacity: "Colour overlay",
  items: "Items / cards",
  members: "Team members",
  groups: "Price groups",
};

function label(key: string) {
  return LABELS[key] ?? key.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase());
}

const inputCls = "w-full rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 px-3 py-2 text-sm outline-none focus:border-lime-500 focus:ring-2 focus:ring-lime-500/20";

const isImageKey = (k: string) => k === "image" || k.toLowerCase().endsWith("image") || k === "favicon" || k === "ogImage";
const isCodeKey = (k: string) => k === "customHtml" || k === "html" || k === "code" || k === "mapEmbed";
const isLongKey = (k: string) => k === "description" || k === "text" || k === "a" || k === "note" || k === "subtitle" || k === "body";
const isMetaKey = (k: string) => k === "__styles" || k === "__style" || k.startsWith("__");

/** Fields that get a paintbrush (text look). */
function isTextStyleable(k: string, value: unknown) {
  if (isMetaKey(k) || isImageKey(k) || isCodeKey(k)) return false;
  if (k === "variant" || k === "icon" || k === "buttonHref" || k === "mapEmbed" || k === "targetDate") return false;
  if (k.toLowerCase().endsWith("opacity") || k === "bgColor" || k.toLowerCase().endsWith("color")) return false;
  if (typeof value === "boolean" || typeof value === "number") return false;
  if (typeof value === "string") return true;
  if (Array.isArray(value) && value.every((x) => typeof x === "string")) return true;
  return false;
}

/** List-of-cards fields get card styling on the group + each item. */
function isCardListKey(k: string, value: unknown) {
  return Array.isArray(value) && value.length >= 0 && (value.length === 0 || (typeof value[0] === "object" && value[0] !== null));
}

function blankFrom(sample: unknown): unknown {
  if (Array.isArray(sample)) return [];
  if (sample && typeof sample === "object") {
    const out: Json = {};
    for (const [k, v] of Object.entries(sample as Json)) {
      if (isMetaKey(k)) continue;
      out[k] = blankFrom(v);
    }
    return out;
  }
  if (typeof sample === "number") return sample;
  if (typeof sample === "boolean") return sample;
  return "";
}

export function SectionContentEditor({
  id, type, content, onSaved, siteColors,
}: {
  id: string;
  type: string;
  content: string;
  onSaved?: (content: string) => void;
  siteColors?: SiteColors;
}) {
  const router = useRouter();
  const colors = siteColors ?? defaultTheme.colors;
  const defaults = (SECTION_DEFAULTS as Record<string, Json>)[type] ?? {};
  const parsed: Json = (() => { try { return JSON.parse(content); } catch { return {}; } })();
  const initial: Json = { ...defaults, ...parsed, __styles: { ...((defaults.__styles as Json) ?? {}), ...((parsed.__styles as Json) ?? {}) } };

  const [state, setState] = useState<Json>(initial);
  const stateRef = useRef(state);
  const [pending, start] = useTransition();
  const [saved, setSaved] = useState(false);
  const [dirty, setDirty] = useState(false);

  const commitLocal = (next: Json) => {
    stateRef.current = next;
    setState(next);
    setSaved(false);
    setDirty(true);
  };

  const persist = async () => {
    const next = { ...stateRef.current };
    const styles = next.__styles as Record<string, FieldStyle> | undefined;
    if (styles && Object.keys(styles).length === 0) delete next.__styles;
    const raw = JSON.stringify(next);
    await updateSectionContent(id, raw);
    onSaved?.(raw);
    router.refresh();
    setSaved(true);
    setDirty(false);
  };

  const save = () => start(async () => {
    try {
      await persist();
    } catch (e) {
      console.error("Save section content failed", e);
      alert(e instanceof Error ? e.message : "Save failed — try again");
    }
  });

  return (
    <SiteColorsCtx.Provider value={colors}>
      <PersistCtx.Provider value={persist}>
        <div className="space-y-4 pb-2">
          <p className="text-[11px] text-slate-400 -mt-1">
            Tap the <PaintHint /> icon — tweak style, then hit <span className="font-semibold text-slate-500">Apply</span> to put it live on the website.
          </p>
          <ObjectEditor value={state} sample={defaults} onChange={commitLocal} />
          <div className="sticky bottom-0 -mx-1 px-1 pt-3 pb-1 bg-gradient-to-t from-white via-white dark:from-slate-900 dark:via-slate-900 to-transparent flex items-center gap-3">
            <button type="button" onClick={save} disabled={pending} className="rounded-lg bg-lime-500 text-white text-sm font-semibold px-4 py-2.5 hover:bg-lime-600 disabled:opacity-60 shadow-sm">
              {pending ? "Saving..." : "Save all changes"}
            </button>
            {saved && <span className="text-sm text-green-600 font-medium">Saved ✓</span>}
            {dirty && !pending && <span className="text-xs font-medium text-amber-600">Unsaved changes</span>}
          </div>
        </div>
      </PersistCtx.Provider>
    </SiteColorsCtx.Provider>
  );
}

function PaintHint() {
  return <span className="inline-flex align-middle mx-0.5 p-0.5 rounded border border-lime-500/40 text-lime-600"><svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9.5 21a7.5 7.5 0 1 0 0-15 7.5 7.5 0 0 0 0 15Z"/><path d="M14 8.5 20.5 2"/><path d="m18 4 2 2"/></svg></span>;
}

function ObjectEditor({ value, sample, onChange }: { value: Json; sample: Json; onChange: (v: Json) => void }) {
  const styles = ((value.__styles as Record<string, FieldStyle>) ?? {});
  const set = (k: string, v: unknown) => onChange({ ...value, [k]: v });
  const setFieldStyle = (k: string, fs: FieldStyle | undefined) => {
    const next = { ...styles };
    if (!fs) delete next[k];
    else next[k] = fs;
    onChange({ ...value, __styles: next });
  };

  const keys = Object.keys(value).filter((k) => !isMetaKey(k));

  return (
    <div className="space-y-4">
      {keys.map((key) => (
        <FieldEditor
          key={key}
          k={key}
          value={value[key]}
          sample={(sample as Json)?.[key]}
          onChange={(v) => set(key, v)}
          fieldStyle={styles[key]}
          onFieldStyle={(fs) => setFieldStyle(key, fs)}
        />
      ))}
    </div>
  );
}

function FieldEditor({
  k, value, sample, onChange, fieldStyle, onFieldStyle,
}: {
  k: string;
  value: unknown;
  sample: unknown;
  onChange: (v: unknown) => void;
  fieldStyle?: FieldStyle;
  onFieldStyle?: (fs: FieldStyle | undefined) => void;
}) {
  const colors = useContext(SiteColorsCtx);
  const persist = useContext(PersistCtx);
  const textOk = isTextStyleable(k, value);
  const cardList = isCardListKey(k, value);
  const styleBtn = (mode: "text" | "card" = "text") =>
    onFieldStyle ? (
      <FieldStyleButton
        value={fieldStyle}
        onChange={onFieldStyle}
        onApply={async () => { await persist(); }}
        defaults={websiteFieldDefaults(k, colors, mode)}
        mode={mode}
        title={`Style · ${label(k)}`}
      />
    ) : null;

  if (k === "variant") {
    return (
      <Labeled text="Layout">
        <select className={inputCls} value={String(value ?? "classic")} onChange={(e) => onChange(e.target.value)}>
          <option value="classic">Default — content left, image right</option>
          <option value="split">Split — image left, content right</option>
          <option value="centered">Centered — text over background image</option>
          <option value="marquee">Marquee — scrolling header + centered text</option>
          <option value="gradient">Gradient — bold gradient, centered (trending)</option>
          <option value="minimal">Minimal — clean light, centered (trending)</option>
          <option value="slideshow">Slideshow — auto-rotating slides (add your own)</option>
          <option value="custom">Custom — my own HTML</option>
        </select>
      </Labeled>
    );
  }
  if (k === "purpose" && (typeof value === "string" || value == null)) {
    return (
      <Labeled text="Show listings">
        <select className={inputCls} value={String(value || "all")} onChange={(e) => onChange(e.target.value)}>
          <option value="all">All purposes</option>
          {PURPOSES.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
        </select>
      </Labeled>
    );
  }
  if (isImageKey(k) && (typeof value === "string" || value == null)) {
    return <Labeled text={label(k)}><ImageInput value={String(value ?? "")} onChange={onChange} aspect="aspect-video" /></Labeled>;
  }
  if ((k === "bgColor" || k.toLowerCase().endsWith("color")) && (typeof value === "string" || value == null)) {
    const hex = String(value ?? "").trim();
    const swatch = /^#[0-9a-fA-F]{3,8}$/.test(hex) ? hex : "#1e293b";
    return (
      <Labeled text={label(k)}>
        <div className="flex items-center gap-2">
          <input type="color" value={swatch} onChange={(e) => onChange(e.target.value)} className="w-10 h-10 rounded-lg border border-slate-200 dark:border-slate-600 cursor-pointer bg-transparent shrink-0" />
          <input className={inputCls} value={hex} onChange={(e) => onChange(e.target.value)} placeholder="#1e293b (empty = website dark)" />
          {hex && <button type="button" onClick={() => onChange("")} className="text-xs font-medium text-slate-500 hover:text-red-500 shrink-0">Clear</button>}
        </div>
      </Labeled>
    );
  }
  if ((k === "imageOpacity" || k === "overlayOpacity" || k.toLowerCase().endsWith("opacity")) && (typeof value === "number" || value == null)) {
    const n = Math.min(100, Math.max(0, Number(value ?? 50)));
    return (
      <Labeled text={`${label(k)} — ${n}%`}>
        <input type="range" min={0} max={100} step={1} value={n} onChange={(e) => onChange(Number(e.target.value))} className="w-full accent-lime-500" />
      </Labeled>
    );
  }
  // icon — visual picker (not typed names)
  if ((k === "icon" || (k.toLowerCase().endsWith("icon") && k !== "favicon")) && (typeof value === "string" || value == null)) {
    return (
      <Labeled text={label(k)}>
        <IconPicker value={String(value ?? "")} onChange={onChange} />
      </Labeled>
    );
  }
  if (k === "targetDate" && (typeof value === "string" || value == null)) {
    return <Labeled text="Target date &amp; time"><input type="datetime-local" className={inputCls} value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} /></Labeled>;
  }
  if (k === "rating" && typeof value === "number") {
    return (
      <Labeled text="Rating (1–5)">
        <input type="number" min={1} max={5} className={inputCls} value={value} onChange={(e) => onChange(Number(e.target.value))} />
      </Labeled>
    );
  }
  if (Array.isArray(value) && value.every((x) => typeof x === "string")) {
    return (
      <Labeled text={label(k)} action={textOk ? styleBtn("text") : null}>
        <textarea className={inputCls} rows={Math.max(2, value.length)} value={(value as string[]).join("\n")}
          onChange={(e) => onChange(e.target.value.split("\n"))} />
      </Labeled>
    );
  }
  if (cardList) {
    const itemSample = (Array.isArray(sample) && sample.length ? sample[0] : (value as unknown[])[0] ?? {}) as Json;
    return (
      <ListEditor
        label={label(k)}
        items={value as Json[]}
        itemSample={itemSample}
        onChange={onChange}
        listStyle={fieldStyle}
        onListStyle={onFieldStyle}
      />
    );
  }
  if (value && typeof value === "object") {
    return (
      <div className="rounded-lg border border-slate-200 dark:border-slate-700 p-3 bg-slate-50/80 dark:bg-slate-800/40">
        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">{label(k)}</p>
        <ObjectEditor value={value as Json} sample={(sample as Json) ?? {}} onChange={(v) => onChange(v)} />
      </div>
    );
  }
  if (typeof value === "boolean") {
    return (
      <label className="flex items-center gap-2 text-sm text-slate-600">
        <input type="checkbox" checked={value} onChange={(e) => onChange(e.target.checked)} className="rounded" /> {label(k)}
      </label>
    );
  }
  if (typeof value === "number") {
    return <Labeled text={label(k)}><input type="number" className={inputCls} value={value} onChange={(e) => onChange(Number(e.target.value))} /></Labeled>;
  }
  const str = String(value ?? "");
  if (isCodeKey(k)) {
    return <Labeled text={label(k)}><textarea className={inputCls + " font-mono text-xs"} rows={5} value={str} onChange={(e) => onChange(e.target.value)} /></Labeled>;
  }
  const long = isLongKey(k) || str.length > 60;
  return (
    <Labeled text={label(k)} action={textOk ? styleBtn("text") : null}>
      {long
        ? <textarea className={inputCls} rows={3} value={str} onChange={(e) => onChange(e.target.value)} />
        : <input className={inputCls} value={str} onChange={(e) => onChange(e.target.value)} />}
    </Labeled>
  );
}

/** Readable card title: first non-empty plain text field (name, title, q, label…). */
function itemTitle(item: Json): string {
  for (const [k, v] of Object.entries(item)) {
    if (isMetaKey(k) || isImageKey(k) || isCodeKey(k) || k === "icon" || k.toLowerCase().endsWith("href") || k === "link" || k === "url") continue;
    if (typeof v === "string" && v.trim()) return v.trim().replace(/<[^>]+>/g, "").slice(0, 60);
  }
  return "";
}

let listKeySeq = 0;
const newKey = () => `k${++listKeySeq}`;

function ListEditor({
  label: lbl, items, itemSample, onChange, listStyle, onListStyle,
}: {
  label: string;
  items: Json[];
  itemSample: Json;
  onChange: (v: Json[]) => void;
  listStyle?: FieldStyle;
  onListStyle?: (fs: FieldStyle | undefined) => void;
}) {
  const colors = useContext(SiteColorsCtx);
  const persist = useContext(PersistCtx);
  const cardDefaults = websiteFieldDefaults("items", colors, "card");

  // Stable keys per item (items have no ids) so reorders keep each card's open state + inputs.
  const [keys, setKeys] = useState<string[]>(() => items.map(newKey));
  const [open, setOpen] = useState<Set<string>>(() => new Set(items.length <= 2 ? keys : []));
  const [dragFrom, setDragFrom] = useState<number | null>(null);
  const [dragOver, setDragOver] = useState<number | null>(null);
  const liveKeys = keys.length === items.length ? keys : items.map((_, i) => keys[i] ?? newKey());
  if (keys.length !== items.length) setKeys(liveKeys); // list changed from outside

  // Apply the same edit to items and their keys.
  const apply = (nextItems: Json[], nextKeys: string[]) => {
    setKeys(nextKeys);
    onChange(nextItems);
  };
  const toggle = (k: string) => setOpen((o) => { const n = new Set(o); if (n.has(k)) n.delete(k); else n.add(k); return n; });
  const update = (i: number, v: Json) => onChange(items.map((it, idx) => (idx === i ? v : it)));
  const remove = (i: number) => apply(items.filter((_, idx) => idx !== i), liveKeys.filter((_, idx) => idx !== i));
  const moveTo = (from: number, to: number) => {
    if (to < 0 || to >= items.length || from === to) return;
    const ni = [...items]; const nk = [...liveKeys];
    const [it] = ni.splice(from, 1); const [k] = nk.splice(from, 1);
    ni.splice(to, 0, it); nk.splice(to, 0, k);
    apply(ni, nk);
  };
  const duplicate = (i: number) => {
    const k = newKey();
    const copy = JSON.parse(JSON.stringify(items[i])) as Json;
    apply([...items.slice(0, i + 1), copy, ...items.slice(i + 1)], [...liveKeys.slice(0, i + 1), k, ...liveKeys.slice(i + 1)]);
    setOpen((o) => new Set(o).add(k));
  };
  const add = () => {
    // Same fields as the last card (blank values), so new cards match what's already there.
    const k = newKey();
    apply([...items, blankFrom(items[items.length - 1] ?? itemSample) as Json], [...liveKeys, k]);
    setOpen((o) => new Set(o).add(k));
  };
  const allOpen = items.length > 0 && liveKeys.every((k) => open.has(k));

  const iconBtn = "p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30";

  return (
    <div className="rounded-lg border border-slate-100 dark:border-slate-700/80 bg-slate-50/40 dark:bg-slate-800/20 px-3 py-2.5">
      <div className="flex items-center justify-between gap-2 mb-2">
        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">{lbl} <span className="font-normal text-slate-400">· {items.length}</span></p>
        <div className="flex items-center gap-2">
          {items.length > 1 && (
            <button type="button" onClick={() => setOpen(allOpen ? new Set() : new Set(liveKeys))} className="text-[11px] font-semibold text-slate-500 hover:text-lime-600">
              {allOpen ? "Collapse all" : "Expand all"}
            </button>
          )}
          {onListStyle && (
            <FieldStyleButton
              value={listStyle}
              onChange={onListStyle}
              onApply={async () => { await persist(); }}
              defaults={cardDefaults}
              mode="card"
              title={`Style all · ${lbl}`}
            />
          )}
        </div>
      </div>
      {items.length > 1 && <p className="text-[11px] text-slate-400 -mt-1 mb-2">Drag <GripVertical className="inline w-3 h-3 -mt-0.5" /> to reorder · click a card to open it</p>}
      <div className="space-y-1.5">
        {items.map((item, i) => {
          const k = liveKeys[i];
          const isOpen = open.has(k);
          const itemStyle = item.__style as FieldStyle | undefined;
          const setItemStyle = (fs: FieldStyle | undefined) => {
            const next = { ...item };
            if (!fs) delete next.__style;
            else next.__style = fs;
            update(i, next);
          };
          const title = itemTitle(item);
          const showLine = dragFrom !== null && dragOver === i && dragFrom !== i;
          return (
            <div
              key={k}
              onDragOver={(e) => { if (dragFrom === null) return; e.preventDefault(); if (dragOver !== i) setDragOver(i); }}
              onDrop={(e) => { e.preventDefault(); if (dragFrom !== null) moveTo(dragFrom, i); setDragFrom(null); setDragOver(null); }}
              className={`rounded-lg border bg-white dark:bg-slate-900/50 transition ${
                showLine ? (dragFrom! < i ? "border-slate-200 dark:border-slate-700 shadow-[0_3px_0_0_#84cc16]" : "border-slate-200 dark:border-slate-700 shadow-[0_-3px_0_0_#84cc16]") : "border-slate-200 dark:border-slate-700"
              } ${dragFrom === i ? "opacity-40" : ""}`}
            >
              <div className="flex items-center gap-1 px-1.5 py-1.5">
                <span
                  draggable
                  onDragStart={(e) => { setDragFrom(i); e.dataTransfer.effectAllowed = "move"; e.dataTransfer.setData("text/plain", String(i)); }}
                  onDragEnd={() => { setDragFrom(null); setDragOver(null); }}
                  className="cursor-grab active:cursor-grabbing p-1 text-slate-300 hover:text-slate-500 shrink-0"
                  title="Drag to reorder"
                >
                  <GripVertical className="w-4 h-4" />
                </span>
                <button type="button" onClick={() => toggle(k)} className="flex-1 min-w-0 flex items-center gap-1.5 text-left py-0.5">
                  <ChevronRight className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform ${isOpen ? "rotate-90" : ""}`} />
                  <span className="text-[10px] font-semibold text-slate-400 shrink-0">{i + 1}</span>
                  <span className={`text-sm truncate ${title ? "font-medium text-slate-700 dark:text-slate-200" : "italic text-slate-400"}`}>{title || "Untitled item"}</span>
                </button>
                <div className="flex items-center shrink-0">
                  <FieldStyleButton
                    value={itemStyle}
                    onChange={setItemStyle}
                    onApply={async () => { await persist(); }}
                    defaults={cardDefaults}
                    mode="card"
                    title={`Style card ${i + 1}`}
                  />
                  <button type="button" onClick={() => moveTo(i, i - 1)} disabled={i === 0} className={iconBtn} title="Move up"><ChevronUp className="w-4 h-4" /></button>
                  <button type="button" onClick={() => moveTo(i, i + 1)} disabled={i === items.length - 1} className={iconBtn} title="Move down"><ChevronDown className="w-4 h-4" /></button>
                  <button type="button" onClick={() => duplicate(i)} className={iconBtn} title="Duplicate"><Copy className="w-3.5 h-3.5" /></button>
                  <button type="button" onClick={() => remove(i)} className="p-1 rounded text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30" title="Delete"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
              {isOpen && (
                <div className="px-3 pb-3 pt-1 border-t border-slate-100 dark:border-slate-800">
                  <ObjectEditor value={item} sample={itemSample} onChange={(v) => update(i, v)} />
                </div>
              )}
            </div>
          );
        })}
      </div>
      <button type="button" onClick={add} className="mt-2 w-full inline-flex items-center justify-center gap-1.5 rounded-lg border border-dashed border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 px-3 py-2 text-sm font-medium hover:border-lime-500 hover:text-lime-600">
        <Plus className="w-4 h-4" /> Add item
      </button>
    </div>
  );
}

function Labeled({ text, children, action }: { text: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="block rounded-lg border border-slate-100 dark:border-slate-700/80 bg-slate-50/40 dark:bg-slate-800/20 px-3 py-2.5">
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{text}</span>
        {action}
      </div>
      {children}
    </div>
  );
}
