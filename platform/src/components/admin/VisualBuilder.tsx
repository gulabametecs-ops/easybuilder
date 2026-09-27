"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import {
  Eye, EyeOff, Trash2, Plus, Pencil, Paintbrush, GripVertical,
  LayoutTemplate, LayoutGrid, AlignLeft, BarChart3, Images, ListOrdered, Megaphone, Users, Tag,
  Sparkles, Quote, HelpCircle, Play, MapPin, FileText, Mail, Bell, Trophy, Download, CreditCard,
  Clock, Type, Timer, PanelTop, CalendarClock, ArrowLeft, ChevronUp, ChevronDown, Copy,
  Layers, type LucideIcon,
} from "lucide-react";
import { toggleSection, deleteSection, moveSection, addSection, reorderSections, duplicateSection } from "@/lib/actions/content";
import { SECTION_META } from "@/lib/sectionDefaults";
import type { ThemeConfig } from "@/lib/config";
import { SectionContentEditor } from "./SectionContentEditor";
import { SectionStyleEditor } from "./SectionStyleEditor";
import { DevicePreviewFrame, type PreviewDevice } from "./DevicePreviewFrame";
import { SectionPicker } from "./SectionPicker";
import { AIBuilderPanel } from "./AIBuilderPanel";

type Section = { id: string; type: string; visible: boolean; content: string; style: string };
const typeLabel = (t: string) => SECTION_META.find((m) => m.type === t)?.label ?? t;

const SECTIONS_MIN = 280;
const SECTIONS_MAX = 480;

/** Editor stays compact so preview gets the real estate. */
function defaultSectionsW(rowWidth: number): number {
  return Math.min(SECTIONS_MAX, Math.max(SECTIONS_MIN, Math.round(rowWidth * 0.28)));
}

const SECTION_ICON: Record<string, LucideIcon> = {
  banner: PanelTop, hero: LayoutTemplate, about: AlignLeft, serviceCategories: LayoutGrid, stats: BarChart3,
  gallery: Images, steps: ListOrdered, cta: Megaphone, team: Users, priceList: Tag, features: Sparkles,
  testimonials: Quote, faq: HelpCircle, logos: Users, video: Play, imageBanner: Images, contactInfo: MapPin,
  quoteForm: FileText, contactForm: Mail, appointmentForm: CalendarClock, richText: Type, pricingPlans: CreditCard,
  openingHours: Clock, countdown: Timer, map: MapPin, noticeBoard: Bell, toppers: Trophy, downloads: Download,
};

export function VisualBuilder({
  pageId,
  previewPath,
  sections,
  siteColors,
}: {
  pageId: string;
  previewPath: string;
  sections: Section[];
  siteColors?: ThemeConfig["colors"];
}) {
  const [pending, start] = useTransition();
  const [selected, setSelected] = useState<string | null>(null);
  const [tab, setTab] = useState<"content" | "design">("content");
  const [pickerOpen, setPickerOpen] = useState(false);
  const [previewHidden, setPreviewHidden] = useState(false);
  const [sectionsW, setSectionsW] = useState(340);
  const [device, setDevice] = useState<PreviewDevice>("desktop");
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const rowRef = useRef<HTMLDivElement | null>(null);
  const dragging = useRef(false);
  const deviceRef = useRef<PreviewDevice>("desktop");
  const [previewTick, setPreviewTick] = useState(0);
  const [items, setItems] = useState(sections);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);
  const [aiOpen, setAiOpen] = useState(false);

  const baseSrc = `${previewPath}${previewPath.includes("?") ? "&" : "?"}__edit=1`;
  // Cache-bust so Next/browser cannot serve a stale preview after save
  const src = `${baseSrc}&_r=${previewTick}`;

  const applyDeviceLayout = (next: PreviewDevice) => {
    setDevice(next);
    deviceRef.current = next;
  };

  useEffect(() => {
    const row = rowRef.current;
    if (!row) return;
    setSectionsW(defaultSectionsW(row.clientWidth));
  }, []);

  useEffect(() => { setItems(sections); }, [sections]);

  // Hash content/style so colour-only edits (same string length) still refresh preview
  const hash = (s: string) => {
    let h = 0;
    for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
    return (h >>> 0).toString(36);
  };
  const sig = `${items.map((s) => `${s.id}:${s.visible}:${hash(s.content)}:${hash(s.style)}`).join("|")}:${previewTick}`;

  const onSectionSaved = (sectionId: string, patch: { content?: string; style?: string }) => {
    setItems((prev) => prev.map((s) => (s.id === sectionId ? { ...s, ...patch } : s)));
    setPreviewTick((t) => t + 1);
  };

  useEffect(() => {
    if (!selected) return;
    document.getElementById(`sec-row-${selected}`)?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [selected]);

  const onDrop = (target: number) => {
    const from = dragIndex;
    setDragIndex(null);
    setOverIndex(null);
    if (from === null || from === target) return;
    const next = [...items];
    const [moved] = next.splice(from, 1);
    next.splice(target, 0, moved);
    setItems(next);
    start(() => reorderSections(pageId, next.map((x) => x.id)));
  };

  useEffect(() => {
    const onMsg = (e: MessageEvent) => {
      const d = e.data;
      if (!d || !d.__builder) return;
      if (d.type === "select" && d.id) {
        setSelected(d.id);
        setTab("content");
        setSectionsW((w) => Math.max(w, 340));
      }
      if (d.type === "action" && d.id) {
        const id: string = d.id;
        switch (d.action) {
          case "up": start(() => moveSection(id, "up")); break;
          case "down": start(() => moveSection(id, "down")); break;
          case "toggle": start(() => toggleSection(id)); break;
          case "duplicate": start(() => duplicateSection(id)); break;
          case "delete": if (confirm("Remove this section?")) start(() => deleteSection(id)); break;
          case "edit": setSelected(id); setTab("content"); break;
          case "style": setSelected(id); setTab("design"); break;
        }
      }
    };
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, [start]);

  useEffect(() => {
    let raf = 0;
    let pendingX = 0;
    const flush = () => {
      raf = 0;
      if (!dragging.current || !rowRef.current) return;
      const rect = rowRef.current.getBoundingClientRect();
      const maxSections = Math.min(SECTIONS_MAX, rect.width - 520);
      // Round to 2px — avoids sub-pixel resize thrash into the preview scale loop
      const next = Math.round(Math.min(maxSections, Math.max(SECTIONS_MIN, pendingX - rect.left)) / 2) * 2;
      setSectionsW((w) => (w === next ? w : next));
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging.current) return;
      e.preventDefault();
      pendingX = e.clientX;
      if (!raf) raf = requestAnimationFrame(flush);
    };
    const onUp = () => {
      if (!dragging.current) return;
      dragging.current = false;
      if (raf) { cancelAnimationFrame(raf); raf = 0; flush(); }
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const selectSection = (id: string) => {
    setSelected(id);
    setTab("content");
    setSectionsW((w) => Math.max(w, 340));
    try { iframeRef.current?.contentWindow?.postMessage({ __builderCmd: true, type: "highlight", id }, "*"); } catch { /* ignore */ }
  };

  const closeEditor = () => {
    setSelected(null);
    try { iframeRef.current?.contentWindow?.postMessage({ __builderCmd: true, type: "deselect" }, "*"); } catch { /* ignore */ }
  };

  const selectedSection = items.find((s) => s.id === selected);
  const selectedIndex = selectedSection ? items.findIndex((s) => s.id === selectedSection.id) : -1;
  const SelectedIcon = selectedSection ? (SECTION_ICON[selectedSection.type] ?? LayoutTemplate) : LayoutTemplate;

  return (
    <div className={`flex flex-col flex-1 min-h-0 ${pending ? "opacity-70 pointer-events-none" : ""}`}>
      <div ref={rowRef} className="flex flex-col xl:flex-row xl:items-stretch flex-1 min-h-0 gap-0">
        <div
          className="vb-sections w-full flex flex-col min-h-0 order-2 xl:order-1"
          style={
            previewHidden
              ? { flex: "1 1 auto", width: "100%" }
              : { width: sectionsW, flex: `0 0 ${sectionsW}px`, minWidth: SECTIONS_MIN }
          }
        >
          <div className="flex flex-col rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 overflow-hidden flex-1 min-h-0 h-full">
            {selectedSection ? (
              <>
                <div className="px-3 py-2 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shrink-0 space-y-2">
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={closeEditor} className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 shrink-0">
                      <ArrowLeft className="w-3.5 h-3.5" /> Back
                    </button>
                    {previewHidden && (
                      <button
                        type="button"
                        onClick={() => setPreviewHidden(false)}
                        className="inline-flex items-center gap-1 text-xs font-medium text-lime-600 hover:text-lime-700 shrink-0"
                      >
                        <Eye className="w-3.5 h-3.5" /> Preview
                      </button>
                    )}
                    <span className="w-7 h-7 rounded-md bg-white dark:bg-slate-800 border border-lime-500/40 flex items-center justify-center text-lime-600 shrink-0">
                      <SelectedIcon className="w-3.5 h-3.5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-slate-900 dark:text-white text-sm truncate">{typeLabel(selectedSection.type)}</h3>
                      <p className="text-[10px] text-slate-400">#{selectedIndex + 1}/{items.length} · {selectedSection.visible ? "Visible" : "Hidden"}</p>
                    </div>
                    <div className="flex items-center gap-0.5 shrink-0">
                      <button type="button" disabled={selectedIndex <= 0} onClick={() => start(() => moveSection(selectedSection.id, "up"))} className="p-1.5 rounded-md border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-500 disabled:opacity-35" title="Up"><ChevronUp className="w-3.5 h-3.5" /></button>
                      <button type="button" disabled={selectedIndex >= items.length - 1} onClick={() => start(() => moveSection(selectedSection.id, "down"))} className="p-1.5 rounded-md border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-500 disabled:opacity-35" title="Down"><ChevronDown className="w-3.5 h-3.5" /></button>
                      <button type="button" onClick={() => start(() => duplicateSection(selectedSection.id))} className="p-1.5 rounded-md border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-500" title="Copy"><Copy className="w-3.5 h-3.5" /></button>
                      <button type="button" onClick={() => start(() => toggleSection(selectedSection.id))} className="p-1.5 rounded-md border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-500" title="Show/hide">{selectedSection.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}</button>
                      <button type="button" onClick={() => { if (confirm("Remove this section?")) { start(() => deleteSection(selectedSection.id)); closeEditor(); } }} className="p-1.5 rounded-md border border-red-200 text-red-500" title="Delete"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                  <div className="flex rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 p-0.5">
                    <button type="button" onClick={() => setTab("content")} className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md text-xs font-semibold transition ${tab === "content" ? "bg-slate-900 text-white dark:bg-lime-500 shadow-sm" : "text-slate-500"}`}>
                      <Pencil className="w-3.5 h-3.5" /> Content
                    </button>
                    <button type="button" onClick={() => setTab("design")} className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md text-xs font-semibold transition ${tab === "design" ? "bg-slate-900 text-white dark:bg-lime-500 shadow-sm" : "text-slate-500"}`}>
                      <Paintbrush className="w-3.5 h-3.5" /> Style
                    </button>
                  </div>
                </div>

                <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-3">
                  {tab === "content"
                    ? (
                      <SectionContentEditor
                        key={`c-${selectedSection.id}`}
                        id={selectedSection.id}
                        type={selectedSection.type}
                        content={selectedSection.content}
                        siteColors={siteColors}
                        onSaved={(content) => onSectionSaved(selectedSection.id, { content })}
                      />
                    )
                    : (
                      <SectionStyleEditor
                        key={`s-${selectedSection.id}`}
                        id={selectedSection.id}
                        style={selectedSection.style}
                        siteColors={siteColors}
                        onSaved={(style) => onSectionSaved(selectedSection.id, { style })}
                      />
                    )}
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center justify-between px-3 py-2 border-b border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-800/40 shrink-0 gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <Layers className="w-4 h-4 text-lime-600 shrink-0" />
                    <p className="text-sm font-semibold text-slate-800 dark:text-white">Sections</p>
                    <span className="text-xs text-slate-400">{items.length}</span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {previewHidden && (
                      <button
                        type="button"
                        onClick={() => setPreviewHidden(false)}
                        className="inline-flex items-center gap-1 rounded-md border border-slate-200 dark:border-slate-600 px-2 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800"
                      >
                        <Eye className="w-3.5 h-3.5" /> Preview
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setAiOpen((v) => !v)}
                      className={`inline-flex items-center gap-1 rounded-md text-xs font-semibold px-2.5 py-1.5 border ${
                        aiOpen
                          ? "bg-lime-500 text-slate-950 border-lime-500"
                          : "border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5" /> AI
                    </button>
                    <button type="button" onClick={() => setPickerOpen(true)} className="inline-flex items-center gap-1 rounded-md bg-lime-500 text-white text-xs font-semibold px-2.5 py-1.5 hover:bg-lime-600">
                      <Plus className="w-3.5 h-3.5" /> Add
                    </button>
                  </div>
                </div>

                {aiOpen && (
                  <div className="shrink-0 border-b border-slate-200 dark:border-slate-700 p-3 max-h-[45%] overflow-y-auto">
                    <AIBuilderPanel
                      pageId={pageId}
                      compact
                      onApplied={() => setPreviewTick((t) => t + 1)}
                    />
                  </div>
                )}

                <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-2 space-y-1.5">
                  {items.length === 0 && (
                    <div className="text-center py-10 px-3">
                      <p className="text-sm text-slate-400 mb-2">No sections yet</p>
                      <button type="button" onClick={() => setPickerOpen(true)} className="text-sm font-semibold text-lime-600 hover:underline">
                        Add first section
                      </button>
                    </div>
                  )}
                  {items.map((s, i) => {
                    const Ic = SECTION_ICON[s.type] ?? LayoutTemplate;
                    return (
                      <div
                        key={s.id}
                        id={`sec-row-${s.id}`}
                        onDragOver={(e) => { e.preventDefault(); if (overIndex !== i) setOverIndex(i); }}
                        onDrop={() => onDrop(i)}
                        className={`rounded-lg border transition border-slate-100 dark:border-slate-700/80 hover:border-slate-200 dark:hover:border-slate-600 ${
                          dragIndex === i ? "opacity-40" : ""
                        } ${overIndex === i && dragIndex !== null && dragIndex !== i ? "border-lime-400 border-dashed" : ""}`}
                      >
                        <div className="flex items-center gap-1.5 px-2 py-2">
                          <div
                            draggable
                            onDragStart={() => setDragIndex(i)}
                            onDragEnd={() => { setDragIndex(null); setOverIndex(null); }}
                            className="cursor-grab text-slate-300 hover:text-slate-500 p-0.5 shrink-0"
                            title="Drag to reorder"
                          >
                            <GripVertical className="w-3.5 h-3.5" />
                          </div>
                          <button type="button" onClick={() => selectSection(s.id)} className="flex items-center gap-2 flex-1 min-w-0 text-left">
                            <span className="w-7 h-7 rounded-md bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 flex items-center justify-center text-lime-600 shrink-0">
                              <Ic className="w-3.5 h-3.5" />
                            </span>
                            <span className="min-w-0">
                              <p className="text-sm font-medium text-slate-800 dark:text-slate-100 truncate leading-tight">{typeLabel(s.type)}</p>
                              <p className="text-[10px] text-slate-400">#{i + 1} · {s.visible ? "Visible" : "Hidden"}</p>
                            </span>
                          </button>
                          <div className="flex items-center shrink-0">
                            <button type="button" onClick={() => selectSection(s.id)} className="p-1.5 rounded text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800" title="Edit">
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button type="button" onClick={() => start(() => toggleSection(s.id))} className="p-1.5 rounded text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800" title="Show / hide">
                              {s.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                            </button>
                            <button type="button" onClick={() => { if (confirm("Remove this section?")) start(() => deleteSection(s.id)); }} className="p-1.5 rounded text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30" title="Delete">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>

        {!previewHidden && (
          <div
            className="hidden xl:flex w-2 shrink-0 cursor-col-resize items-stretch justify-center group order-2 relative z-10"
            onPointerDown={(e) => {
              e.preventDefault();
              dragging.current = true;
              document.body.style.cursor = "col-resize";
              document.body.style.userSelect = "none";
              (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
            }}
            title="Drag to resize"
          >
            <div className="w-1 my-8 rounded-full bg-slate-300 dark:bg-slate-600 group-hover:bg-lime-500 group-active:bg-lime-500 transition" />
          </div>
        )}

        {previewHidden ? null : (
          <div
            className="vb-preview min-w-0 flex flex-col min-h-0 order-1 xl:order-3 mb-2 xl:mb-0 h-[42vh] xl:h-auto"
            style={{ flex: "1 1 0%", minWidth: 0 }}
          >
            <DevicePreviewFrame
              src={src}
              reloadKey={sig}
              iframeRef={iframeRef}
              onToggleHidden={() => setPreviewHidden(true)}
              device={device}
              onDeviceChange={applyDeviceLayout}
              className="flex-1 min-h-0 h-full"
            />
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 1279px) {
          .vb-preview {
            width: 100% !important;
            max-width: 100% !important;
            flex: none !important;
            min-width: 0 !important;
          }
          .vb-sections {
            width: 100% !important;
            max-width: 100% !important;
            flex: 1 1 auto !important;
            min-width: 0 !important;
            min-height: 0 !important;
          }
        }
      `}</style>

      <SectionPicker
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onPick={(type) => start(() => addSection(pageId, type))}
      />
    </div>
  );
}
