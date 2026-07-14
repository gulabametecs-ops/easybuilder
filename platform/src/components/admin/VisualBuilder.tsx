"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { ChevronUp, ChevronDown, Eye, EyeOff, Trash2, Plus, Pencil, Paintbrush, RefreshCw, ExternalLink, Monitor, Smartphone, X } from "lucide-react";
import { toggleSection, deleteSection, moveSection, addSection } from "@/lib/actions/content";
import { SECTION_META } from "@/lib/sectionDefaults";
import { SectionContentEditor } from "./SectionContentEditor";
import { SectionStyleEditor } from "./SectionStyleEditor";

type Section = { id: string; type: string; visible: boolean; content: string; style: string };
const typeLabel = (t: string) => SECTION_META.find((m) => m.type === t)?.label ?? t;

export function VisualBuilder({ pageId, previewPath, sections }: { pageId: string; previewPath: string; sections: Section[] }) {
  const [pending, start] = useTransition();
  const [selected, setSelected] = useState<string | null>(null);
  const [tab, setTab] = useState<"content" | "design">("content");
  const [adding, setAdding] = useState(false);
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const src = `${previewPath}${previewPath.includes("?") ? "&" : "?"}__edit=1`;

  // reload the preview whenever the section data changes
  const sig = sections.map((s) => `${s.id}:${s.visible}:${s.content.length}:${s.style.length}`).join("|");
  const firstRef = useRef(true);
  useEffect(() => {
    if (firstRef.current) { firstRef.current = false; return; }
    try { iframeRef.current?.contentWindow?.location.reload(); } catch { /* cross-origin guard */ }
  }, [sig]);

  // receive selection clicks from the preview iframe
  useEffect(() => {
    const onMsg = (e: MessageEvent) => {
      const d = e.data;
      if (!d || !d.__builder) return;
      if (d.type === "select" && d.id) { setSelected(d.id); setTab("content"); }
    };
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, []);

  const highlightInPreview = (id: string) => {
    try { iframeRef.current?.contentWindow?.postMessage({ __builderCmd: true, type: "highlight", id }, "*"); } catch { /* ignore */ }
  };

  const selectSection = (id: string) => {
    setSelected((cur) => (cur === id ? null : id));
    setTab("content");
    highlightInPreview(id);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 h-[calc(100vh-13rem)] min-h-[520px]">
      {/* ── Live preview ─────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden bg-slate-100 dark:bg-slate-800">
        <div className="flex items-center gap-2 px-3 py-2 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
          <span className="text-xs font-medium text-slate-500">Live preview</span>
          <span className="text-xs text-slate-400 hidden sm:inline">— click any section to edit it</span>
          <div className="ml-auto flex items-center gap-1">
            <button onClick={() => setDevice("desktop")} className={`p-1.5 rounded ${device === "desktop" ? "bg-lime-100 text-lime-700" : "text-slate-400 hover:text-slate-700"}`} title="Desktop"><Monitor className="w-4 h-4" /></button>
            <button onClick={() => setDevice("mobile")} className={`p-1.5 rounded ${device === "mobile" ? "bg-lime-100 text-lime-700" : "text-slate-400 hover:text-slate-700"}`} title="Mobile"><Smartphone className="w-4 h-4" /></button>
            <button onClick={() => iframeRef.current?.contentWindow?.location.reload()} className="p-1.5 rounded text-slate-400 hover:text-slate-700" title="Refresh"><RefreshCw className="w-4 h-4" /></button>
            <a href={previewPath} target="_blank" className="p-1.5 rounded text-slate-400 hover:text-slate-700" title="Open in new tab"><ExternalLink className="w-4 h-4" /></a>
          </div>
        </div>
        <div className="flex-1 overflow-auto flex justify-center bg-slate-200 dark:bg-slate-950 p-0 sm:p-3">
          <iframe
            ref={iframeRef}
            src={src}
            title="Preview"
            className={`bg-white shadow-lg transition-all ${device === "mobile" ? "w-[390px]" : "w-full"} h-full rounded`}
          />
        </div>
      </div>

      {/* ── Sections panel ───────────────────────────────────────── */}
      <div className={`lg:w-[400px] flex flex-col rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 overflow-hidden ${pending ? "opacity-70" : ""}`}>
        <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <h3 className="font-semibold text-slate-900 dark:text-white text-sm">Sections</h3>
          <button onClick={() => setAdding((a) => !a)} className="inline-flex items-center gap-1 text-sm font-medium text-lime-600 hover:text-lime-700">
            <Plus className="w-4 h-4" /> Add
          </button>
        </div>

        {adding && (
          <div className="p-3 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 max-h-64 overflow-auto">
            <div className="grid grid-cols-1 gap-1.5">
              {SECTION_META.map((m) => (
                <button key={m.type} onClick={() => { setAdding(false); start(() => addSection(pageId, m.type)); }}
                  className="text-left p-2 rounded-lg border border-slate-200 dark:border-slate-600 hover:border-lime-500 hover:bg-lime-50 dark:hover:bg-slate-700">
                  <p className="font-medium text-slate-800 dark:text-slate-100 text-sm">{m.label}</p>
                  <p className="text-xs text-slate-400">{m.description}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex-1 overflow-auto p-3 space-y-2">
          {sections.length === 0 && <p className="text-sm text-slate-400 text-center py-8">No sections yet. Click “Add”.</p>}
          {sections.map((s, i) => (
            <div key={s.id} className={`rounded-lg border ${selected === s.id ? "border-lime-500 ring-1 ring-lime-500/30" : "border-slate-200 dark:border-slate-700"}`}>
              <div className="flex items-center gap-2 p-2.5">
                <div className="flex flex-col">
                  <button disabled={i === 0} onClick={() => start(() => moveSection(s.id, "up"))} className="text-slate-400 hover:text-slate-700 disabled:opacity-30"><ChevronUp className="w-4 h-4" /></button>
                  <button disabled={i === sections.length - 1} onClick={() => start(() => moveSection(s.id, "down"))} className="text-slate-400 hover:text-slate-700 disabled:opacity-30"><ChevronDown className="w-4 h-4" /></button>
                </div>
                <button onClick={() => selectSection(s.id)} className="flex-1 text-left">
                  <p className="font-medium text-slate-900 dark:text-white text-sm">{typeLabel(s.type)}</p>
                  <p className="text-xs text-slate-400">{s.visible ? "Visible" : "Hidden"}</p>
                </button>
                <button onClick={() => { setSelected(s.id); setTab("content"); highlightInPreview(s.id); }} className={`p-1.5 rounded ${selected === s.id && tab === "content" ? "bg-lime-100 text-lime-700" : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200"}`} title="Edit content"><Pencil className="w-4 h-4" /></button>
                <button onClick={() => { setSelected(s.id); setTab("design"); highlightInPreview(s.id); }} className={`p-1.5 rounded ${selected === s.id && tab === "design" ? "bg-lime-100 text-lime-700" : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200"}`} title="Design"><Paintbrush className="w-4 h-4" /></button>
                <button onClick={() => start(() => toggleSection(s.id))} className="p-1.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200" title="Show/hide">
                  {s.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
                <button onClick={() => { if (confirm("Delete this section?")) start(() => deleteSection(s.id)); }} className="p-1.5 rounded bg-red-50 text-red-600 hover:bg-red-100" title="Delete"><Trash2 className="w-4 h-4" /></button>
              </div>

              {selected === s.id && (
                <div className="border-t border-slate-100 dark:border-slate-700 p-3 bg-slate-50 dark:bg-slate-800">
                  <div className="flex items-center gap-2 mb-3">
                    <button onClick={() => setTab("content")} className={`text-xs font-semibold px-3 py-1.5 rounded-full ${tab === "content" ? "bg-slate-900 text-white" : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300"}`}>Content</button>
                    <button onClick={() => setTab("design")} className={`text-xs font-semibold px-3 py-1.5 rounded-full ${tab === "design" ? "bg-slate-900 text-white" : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300"}`}>Design</button>
                    <button onClick={() => setSelected(null)} className="ml-auto text-slate-400 hover:text-slate-700"><X className="w-4 h-4" /></button>
                  </div>
                  {tab === "content"
                    ? <SectionContentEditor id={s.id} type={s.type} content={s.content} />
                    : <SectionStyleEditor id={s.id} style={s.style} />}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
