"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import {
  FileText, Rocket, Info, LayoutGrid, Images, Tag, HelpCircle, Users, Bell, Mail,
  Loader2, Plus, X, CalendarClock, Play, Timer, Trophy, Download, ListOrdered,
  ChevronRight, Check, Sparkles, type LucideIcon,
} from "lucide-react";
import { PAGE_TEMPLATES, TEMPLATE_CATEGORIES, type PageTemplate } from "@/lib/pageTemplates";
import { SECTION_META } from "@/lib/sectionDefaults";
import { createPage } from "@/lib/actions/content";
import { AIWebsiteGenerator } from "./AIBuilderPanel";

const ICON: Record<string, LucideIcon> = {
  file: FileText, rocket: Rocket, info: Info, grid: LayoutGrid, images: Images, tag: Tag,
  help: HelpCircle, users: Users, bell: Bell, mail: Mail, calendar: CalendarClock,
  filetext: FileText, play: Play, timer: Timer, trophy: Trophy, download: Download, list: Tag, steps: ListOrdered,
};

const sectionLabel = (t: string) => SECTION_META.find((m) => m.type === t)?.label ?? t;

function slugify(input: string) {
  return input.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "page";
}

export function PageCreator({ open: openProp, onOpenChange }: { open?: boolean; onOpenChange?: (v: boolean) => void } = {}) {
  const controlled = openProp !== undefined;
  const [innerOpen, setInnerOpen] = useState(false);
  const open = controlled ? openProp : innerOpen;
  const setOpen = (v: boolean) => {
    if (!controlled) setInnerOpen(v);
    onOpenChange?.(v);
  };

  const [mode, setMode] = useState<"template" | "ai">("template");
  const [step, setStep] = useState<1 | 2>(1);
  const [category, setCategory] = useState<"all" | PageTemplate["category"]>("all");
  const [selected, setSelected] = useState<PageTemplate>(PAGE_TEMPLATES[1]);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [showInNav, setShowInNav] = useState(true);
  const [published, setPublished] = useState(true);
  const [noindex, setNoindex] = useState(false);
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [showSeo, setShowSeo] = useState(false);
  const [pending, start] = useTransition();

  const filtered = useMemo(
    () => (category === "all" ? PAGE_TEMPLATES : PAGE_TEMPLATES.filter((t) => t.category === category)),
    [category],
  );

  useEffect(() => {
    if (!open) return;
    setMode("template");
    setStep(1);
    setCategory("all");
    setSelected(PAGE_TEMPLATES[1]);
    setTitle("");
    setSlug("");
    setSlugTouched(false);
    setShowInNav(true);
    setPublished(true);
    setNoindex(false);
    setSeoTitle("");
    setSeoDescription("");
    setShowSeo(false);
  }, [open]);

  useEffect(() => {
    if (!slugTouched) setSlug(slugify(title || selected.label));
  }, [title, selected, slugTouched]);

  const submit = () => {
    start(() => {
      const fd = new FormData();
      fd.set("title", title.trim() || selected.label);
      fd.set("slug", slug.trim() || slugify(title || selected.label));
      fd.set("type", selected.id);
      fd.set("published", published ? "on" : "off");
      fd.set("showInNav", showInNav ? "on" : "off");
      fd.set("noindex", noindex ? "on" : "off");
      fd.set("seoTitle", seoTitle.trim());
      fd.set("seoDescription", seoDescription.trim());
      return createPage(fd);
    });
  };

  return (
    <>
      {!controlled && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-lime-500 text-white text-sm font-semibold px-4 py-2.5 hover:bg-lime-600 shadow-sm"
        >
          <Plus className="w-4 h-4" /> Create page
        </button>
      )}

      {open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <button type="button" className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" aria-label="Close" onClick={() => setOpen(false)} />
          <div className="relative w-full sm:max-w-3xl max-h-[92vh] bg-white dark:bg-slate-900 rounded-t-2xl sm:rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col">
            {/* Header */}
            <div className="shrink-0 flex items-center justify-between gap-3 px-5 py-4 border-b border-slate-200 dark:border-slate-700">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Create a new page</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {mode === "ai"
                    ? "Describe your website — AI builds it with existing sections"
                    : step === 1
                      ? "Pick a ready-made layout or use AI"
                      : "Name it and set options"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-slate-400">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center ${step === 1 ? "bg-lime-500 text-white" : "bg-lime-500/20 text-lime-600"}`}>1</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center ${step === 2 ? "bg-lime-500 text-white" : "bg-slate-100 dark:bg-slate-800"}`}>2</span>
                </div>
                <button type="button" onClick={() => setOpen(false)} className="p-2 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto p-5">
              {mode === "ai" ? (
                <AIWebsiteGenerator onDone={() => setOpen(false)} />
              ) : step === 1 ? (
                <>
                  <div className="flex gap-2 mb-4">
                    <button
                      type="button"
                      onClick={() => setMode("template")}
                      className={`flex-1 rounded-xl border px-3 py-2.5 text-sm font-semibold transition ${
                        mode === "template"
                          ? "border-lime-500 bg-lime-500/10 text-lime-700 dark:text-lime-300"
                          : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
                      }`}
                    >
                      Templates
                    </button>
                    <button
                      type="button"
                      onClick={() => setMode("ai")}
                      className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 px-3 py-2.5 text-sm font-semibold transition inline-flex items-center justify-center gap-1.5 text-slate-600 dark:text-slate-300 hover:border-lime-500/40"
                    >
                      <Sparkles className="w-4 h-4" /> AI Website
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    <button
                      type="button"
                      onClick={() => setCategory("all")}
                      className={`rounded-full px-3 py-1 text-xs font-semibold transition ${category === "all" ? "bg-slate-900 text-white dark:bg-lime-500" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"}`}
                    >
                      All
                    </button>
                    {TEMPLATE_CATEGORIES.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setCategory(c.id)}
                        className={`rounded-full px-3 py-1 text-xs font-semibold transition ${category === c.id ? "bg-slate-900 text-white dark:bg-lime-500" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"}`}
                      >
                        {c.label}
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {filtered.map((t) => {
                      const Ic = ICON[t.icon] ?? FileText;
                      const on = selected.id === t.id;
                      return (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => setSelected(t)}
                          className={`text-left rounded-xl border p-3.5 transition ${
                            on
                              ? "border-lime-500 bg-lime-500/10 ring-1 ring-lime-500/40"
                              : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-900"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <span className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${on ? "bg-lime-500 text-white" : "bg-lime-500/10 text-lime-600"}`}>
                              <Ic className="w-5 h-5" />
                            </span>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <p className="font-semibold text-slate-900 dark:text-white text-sm">{t.label}</p>
                                {on && <Check className="w-4 h-4 text-lime-600 shrink-0" />}
                              </div>
                              <p className="text-xs text-slate-500 mt-0.5 leading-snug">{t.description}</p>
                              <p className="text-[10px] text-slate-400 mt-1.5">{t.sections.length} sections ready</p>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-3.5">
                    <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 mb-2">Included blocks — {selected.label}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {selected.sections.map((s) => (
                        <span key={s} className="rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-600 px-2 py-1 text-[11px] font-medium text-slate-600 dark:text-slate-300">
                          {sectionLabel(s)}
                        </span>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="space-y-4 max-w-lg">
                  <div className="flex items-center gap-3 rounded-xl border border-lime-500/30 bg-lime-500/10 px-3.5 py-3">
                    {(() => {
                      const Ic = ICON[selected.icon] ?? FileText;
                      return (
                        <span className="w-9 h-9 rounded-lg bg-lime-500 text-white flex items-center justify-center shrink-0">
                          <Ic className="w-4 h-4" />
                        </span>
                      );
                    })()}
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">{selected.label}</p>
                      <p className="text-xs text-slate-500">{selected.sections.length} blocks · change in step 1</p>
                    </div>
                    <button type="button" onClick={() => setStep(1)} className="ml-auto text-xs font-semibold text-lime-700 dark:text-lime-400 hover:underline shrink-0">
                      Change
                    </button>
                  </div>

                  <label className="block">
                    <span className="block text-xs font-medium text-slate-500 mb-1">Page name *</span>
                    <input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder={selected.label}
                      autoFocus
                      className="w-full rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-800 px-3.5 py-2.5 text-sm outline-none focus:border-lime-500"
                    />
                  </label>

                  <label className="block">
                    <span className="block text-xs font-medium text-slate-500 mb-1">URL path</span>
                    <div className="flex items-stretch rounded-lg border border-slate-300 dark:border-slate-600 overflow-hidden focus-within:border-lime-500">
                      <span className="px-3 flex items-center text-xs text-slate-400 bg-slate-50 dark:bg-slate-800 border-r border-slate-200 dark:border-slate-600">/</span>
                      <input
                        value={slug}
                        onChange={(e) => { setSlugTouched(true); setSlug(slugify(e.target.value)); }}
                        placeholder="about-us"
                        className="flex-1 px-3 py-2.5 text-sm outline-none dark:bg-slate-800"
                      />
                    </div>
                    <span className="block text-[11px] text-slate-400 mt-1">Live URL: /{slug || "page"}</span>
                  </label>

                  <div className="space-y-2.5 rounded-xl border border-slate-200 dark:border-slate-700 p-3.5">
                    <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">Visibility</p>
                    <label className="flex items-center gap-2.5 text-sm text-slate-700 dark:text-slate-200 cursor-pointer">
                      <input type="checkbox" checked={showInNav} onChange={(e) => setShowInNav(e.target.checked)} className="rounded border-slate-300 text-lime-500 focus:ring-lime-500" />
                      Show in website menu
                    </label>
                    <label className="flex items-center gap-2.5 text-sm text-slate-700 dark:text-slate-200 cursor-pointer">
                      <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} className="rounded border-slate-300 text-lime-500 focus:ring-lime-500" />
                      Publish immediately
                    </label>
                    <label className="flex items-center gap-2.5 text-sm text-slate-700 dark:text-slate-200 cursor-pointer">
                      <input type="checkbox" checked={noindex} onChange={(e) => setNoindex(e.target.checked)} className="rounded border-slate-300 text-lime-500 focus:ring-lime-500" />
                      Hide from Google (noindex)
                    </label>
                  </div>

                  <div className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setShowSeo((v) => !v)}
                      className="w-full flex items-center justify-between px-3.5 py-3 text-left text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60"
                    >
                      Google / SEO (optional)
                      <ChevronRight className={`w-4 h-4 text-slate-400 transition ${showSeo ? "rotate-90" : ""}`} />
                    </button>
                    {showSeo && (
                      <div className="px-3.5 pb-3.5 space-y-3 border-t border-slate-200 dark:border-slate-700 pt-3">
                        <label className="block">
                          <span className="block text-xs font-medium text-slate-500 mb-1">Google title</span>
                          <input
                            value={seoTitle}
                            onChange={(e) => setSeoTitle(e.target.value)}
                            placeholder={title || selected.label}
                            className="w-full rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-800 px-3 py-2 text-sm outline-none focus:border-lime-500"
                          />
                        </label>
                        <label className="block">
                          <span className="block text-xs font-medium text-slate-500 mb-1">Google description</span>
                          <textarea
                            value={seoDescription}
                            onChange={(e) => setSeoDescription(e.target.value)}
                            rows={2}
                            placeholder="Short description for search results"
                            className="w-full rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-800 px-3 py-2 text-sm outline-none focus:border-lime-500 resize-none"
                          />
                        </label>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="shrink-0 flex items-center justify-between gap-3 px-5 py-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-950/40">
              {mode === "ai" ? (
                <>
                  <button type="button" onClick={() => setMode("template")} className="text-sm font-medium text-slate-500 hover:text-slate-800 dark:hover:text-slate-200">
                    Use templates
                  </button>
                  <span />
                </>
              ) : step === 1 ? (
                <>
                  <button type="button" onClick={() => setOpen(false)} className="text-sm font-medium text-slate-500 hover:text-slate-800 dark:hover:text-slate-200">
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="inline-flex items-center gap-2 rounded-xl bg-lime-500 text-white text-sm font-semibold px-5 py-2.5 hover:bg-lime-600"
                  >
                    Continue <ChevronRight className="w-4 h-4" />
                  </button>
                </>
              ) : mode === "template" ? (
                <>
                  <button type="button" onClick={() => setStep(1)} className="text-sm font-medium text-slate-500 hover:text-slate-800 dark:hover:text-slate-200">
                    Back
                  </button>
                  <button
                    type="button"
                    disabled={pending}
                    onClick={submit}
                    className="inline-flex items-center gap-2 rounded-xl bg-lime-500 text-white text-sm font-semibold px-5 py-2.5 hover:bg-lime-600 disabled:opacity-60"
                  >
                    {pending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                    {pending ? "Creating…" : "Create & edit"}
                  </button>
                </>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
