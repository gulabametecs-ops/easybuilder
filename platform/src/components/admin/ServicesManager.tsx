"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Trash2, Plus, ArrowLeft, Wrench, Eye, ExternalLink,
  Search, ImageIcon, FileText, Tag, Sparkles,
} from "lucide-react";
import { addService, updateService, deleteService } from "@/lib/actions/content";
import { ImageInput } from "./ImageInput";
import { DevicePreviewFrame } from "./DevicePreviewFrame";

type Service = {
  id: string;
  category: string;
  title: string;
  description: string;
  image: string;
  slug: string;
  longDescription: string;
  seoTitle: string;
  seoDescription: string;
};

const inputCls =
  "w-full rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 px-3 py-2 text-sm outline-none focus:border-lime-500 focus:ring-2 focus:ring-lime-500/20";

export function ServicesManager({
  services: initial,
  categories,
  limit = 0,
  count = 0,
}: {
  services: Service[];
  categories: string[];
  limit?: number;
  count?: number;
}) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [items, setItems] = useState(initial);
  const [selected, setSelected] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [q, setQ] = useState("");
  const [previewHidden, setPreviewHidden] = useState(false);
  const [previewTick, setPreviewTick] = useState(0);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setItems(initial);
  }, [initial]);

  const atLimit = limit > 0 && count >= limit;
  const selectedService = items.find((s) => s.id === selected) ?? null;

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return items;
    return items.filter(
      (s) =>
        s.title.toLowerCase().includes(needle) ||
        s.category.toLowerCase().includes(needle) ||
        s.description.toLowerCase().includes(needle),
    );
  }, [items, q]);

  const grouped = useMemo(() => {
    const map = new Map<string, Service[]>();
    for (const s of filtered) {
      if (!map.has(s.category)) map.set(s.category, []);
      map.get(s.category)!.push(s);
    }
    return map;
  }, [filtered]);

  const previewPath = selectedService?.slug
    ? `/services/${selectedService.slug}?__edit=1&_r=${previewTick}`
    : `/?__edit=1&_r=${previewTick}`;

  const bumpPreview = () => setPreviewTick((t) => t + 1);

  return (
    <div className={`admin-full-bleed flex flex-col flex-1 min-h-0 ${pending ? "opacity-70 pointer-events-none" : ""}`}>
      <div className="flex flex-col xl:flex-row xl:items-stretch flex-1 min-h-0 gap-0">
        {/* Left panel */}
        <div
          className="w-full flex flex-col min-h-0 order-2 xl:order-1"
          style={previewHidden ? { flex: "1 1 auto", width: "100%" } : { width: 400, flex: "0 0 400px", minWidth: 300, maxWidth: "100%" }}
        >
          <div className="flex flex-col rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 overflow-hidden flex-1 min-h-0 h-full">
            {selectedService ? (
              <ServiceEditor
                key={selectedService.id}
                service={selectedService}
                categories={categories}
                saved={saved}
                onBack={() => { setSelected(null); setSaved(false); }}
                onShowPreview={() => setPreviewHidden(false)}
                previewHidden={previewHidden}
                onSaved={(next) => {
                  setItems((prev) => prev.map((s) => (s.id === next.id ? next : s)));
                  setSaved(true);
                  bumpPreview();
                  router.refresh();
                }}
                onDelete={() => {
                  start(async () => {
                    await deleteService(selectedService.id);
                    setItems((prev) => prev.filter((s) => s.id !== selectedService.id));
                    setSelected(null);
                    bumpPreview();
                    router.refresh();
                  });
                }}
              />
            ) : adding ? (
              <AddServicePanel
                categories={categories}
                onBack={() => setAdding(false)}
                onAdded={() => {
                  setAdding(false);
                  bumpPreview();
                  router.refresh();
                }}
              />
            ) : (
              <>
                <div className="px-3 py-2 border-b border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-800/40 shrink-0 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <Wrench className="w-4 h-4 text-lime-600 shrink-0" />
                      <p className="text-sm font-semibold text-slate-800 dark:text-white">Services</p>
                      <span className="text-xs text-slate-400">{items.length}{limit > 0 ? `/${limit}` : ""}</span>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {previewHidden && (
                        <button type="button" onClick={() => setPreviewHidden(false)} className="inline-flex items-center gap-1 rounded-md border border-slate-200 dark:border-slate-600 px-2 py-1.5 text-xs font-medium text-lime-600">
                          <Eye className="w-3.5 h-3.5" /> Preview
                        </button>
                      )}
                      {!atLimit && (
                        <button type="button" onClick={() => setAdding(true)} className="inline-flex items-center gap-1 rounded-md bg-lime-500 text-white text-xs font-semibold px-2.5 py-1.5 hover:bg-lime-600">
                          <Plus className="w-3.5 h-3.5" /> Add
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      value={q}
                      onChange={(e) => setQ(e.target.value)}
                      placeholder="Search services…"
                      className="w-full rounded-lg border border-slate-200 dark:border-slate-600 dark:bg-slate-800 pl-8 pr-3 py-1.5 text-sm outline-none focus:border-lime-500"
                    />
                  </div>
                </div>

                <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-2 space-y-3">
                  {atLimit && (
                    <div className="rounded-xl border border-amber-200 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-800 p-3 text-xs text-amber-800 dark:text-amber-200">
                      Plan limit reached ({limit}). <a href="/admin/settings" className="font-semibold underline">Upgrade</a> to add more.
                    </div>
                  )}

                  {items.length === 0 && (
                    <div className="text-center py-12 px-4">
                      <span className="inline-flex w-12 h-12 rounded-2xl bg-lime-500/15 text-lime-600 items-center justify-center mb-3">
                        <Wrench className="w-6 h-6" />
                      </span>
                      <p className="text-sm font-semibold text-slate-800 dark:text-white">No services yet</p>
                      <p className="text-xs text-slate-400 mt-1 mb-3">Add your first service to show on the website.</p>
                      {!atLimit && (
                        <button type="button" onClick={() => setAdding(true)} className="text-sm font-semibold text-lime-600 hover:underline">
                          Add first service
                        </button>
                      )}
                    </div>
                  )}

                  {Array.from(grouped.entries()).map(([cat, list]) => (
                    <div key={cat}>
                      <p className="px-1.5 mb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                        <Tag className="w-3 h-3" /> {cat} · {list.length}
                      </p>
                      <div className="space-y-1.5">
                        {list.map((s) => (
                          <button
                            key={s.id}
                            type="button"
                            onClick={() => { setSelected(s.id); setSaved(false); }}
                            className="w-full flex items-center gap-2.5 rounded-lg border border-slate-100 dark:border-slate-700/80 hover:border-lime-400/60 bg-white dark:bg-slate-900 px-2 py-2 text-left transition"
                          >
                            <span className="w-11 h-11 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shrink-0 flex items-center justify-center">
                              {s.image ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={s.image} alt="" className="w-full h-full object-cover" />
                              ) : (
                                <ImageIcon className="w-4 h-4 text-slate-300" />
                              )}
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="block text-sm font-medium text-slate-800 dark:text-slate-100 truncate leading-tight">{s.title}</span>
                              <span className="block text-[10px] text-slate-400 truncate">{s.description || "No description"}</span>
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}

                  {filtered.length === 0 && items.length > 0 && (
                    <p className="text-center text-xs text-slate-400 py-8">No matches for “{q}”</p>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {!previewHidden && <div className="hidden xl:block w-px bg-slate-200 dark:bg-slate-700 shrink-0 order-1 xl:order-2 self-stretch" />}

        {!previewHidden && (
          <div className="flex-1 min-w-0 min-h-[420px] xl:min-h-0 order-1 xl:order-3 flex flex-col">
            <DevicePreviewFrame
              src={previewPath}
              reloadKey={`${selected ?? "home"}:${previewTick}`}
              className="flex-1 min-h-0 h-[calc(100vh-8rem)]"
              onToggleHidden={() => setPreviewHidden(true)}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function ServiceEditor({
  service,
  categories,
  saved,
  onBack,
  onShowPreview,
  previewHidden,
  onSaved,
  onDelete,
}: {
  service: Service;
  categories: string[];
  saved: boolean;
  onBack: () => void;
  onShowPreview: () => void;
  previewHidden: boolean;
  onSaved: (s: Service) => void;
  onDelete: () => void;
}) {
  const [pending, start] = useTransition();
  const [form, setForm] = useState(service);

  useEffect(() => {
    setForm(service);
  }, [service]);

  const set = <K extends keyof Service>(k: K, v: Service[K]) => setForm((f) => ({ ...f, [k]: v }));

  const save = () => {
    start(async () => {
      const fd = new FormData();
      fd.set("id", form.id);
      fd.set("category", form.category);
      fd.set("title", form.title);
      fd.set("description", form.description);
      fd.set("image", form.image);
      fd.set("longDescription", form.longDescription);
      fd.set("seoTitle", form.seoTitle);
      fd.set("seoDescription", form.seoDescription);
      await updateService(fd);
      onSaved(form);
    });
  };

  return (
    <>
      <div className="px-3 py-2 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shrink-0 space-y-2">
        <div className="flex items-center gap-2">
          <button type="button" onClick={onBack} className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 shrink-0">
            <ArrowLeft className="w-3.5 h-3.5" /> Back
          </button>
          {previewHidden && (
            <button type="button" onClick={onShowPreview} className="inline-flex items-center gap-1 text-xs font-medium text-lime-600 shrink-0">
              <Eye className="w-3.5 h-3.5" /> Preview
            </button>
          )}
          <span className="w-7 h-7 rounded-md bg-lime-500/15 text-lime-600 flex items-center justify-center shrink-0">
            <Wrench className="w-3.5 h-3.5" />
          </span>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-slate-900 dark:text-white text-sm truncate">{form.title || "Untitled"}</h3>
            <p className="text-[10px] text-slate-400 truncate">{form.category}</p>
          </div>
          <button type="button" onClick={() => { if (confirm("Delete this service?")) onDelete(); }} className="p-1.5 rounded-md border border-red-200 text-red-500" title="Delete">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-3 space-y-4">
        <FieldCard icon={Tag} title="Basics">
          <label className="block">
            <span className="text-[10px] font-semibold text-slate-400 mb-1 block">Category</span>
            <input list="svc-cats" value={form.category} onChange={(e) => set("category", e.target.value)} className={inputCls} />
            <datalist id="svc-cats">{categories.map((c) => <option key={c} value={c} />)}</datalist>
          </label>
          <label className="block mt-3">
            <span className="text-[10px] font-semibold text-slate-400 mb-1 block">Title</span>
            <input value={form.title} onChange={(e) => set("title", e.target.value)} className={inputCls} />
          </label>
          <label className="block mt-3">
            <span className="text-[10px] font-semibold text-slate-400 mb-1 block">Short description</span>
            <textarea value={form.description} onChange={(e) => set("description", e.target.value)} rows={2} className={inputCls} />
          </label>
        </FieldCard>

        <FieldCard icon={ImageIcon} title="Image">
          <ImageInput value={form.image} onChange={(v) => set("image", v)} aspect="aspect-[3/2]" />
        </FieldCard>

        <FieldCard icon={FileText} title="Full details">
          <textarea
            value={form.longDescription}
            onChange={(e) => set("longDescription", e.target.value)}
            rows={5}
            placeholder="Shown on the service detail page"
            className={inputCls}
          />
        </FieldCard>

        <FieldCard icon={Sparkles} title="SEO">
          <label className="block">
            <span className="text-[10px] font-semibold text-slate-400 mb-1 block">SEO title</span>
            <input value={form.seoTitle} onChange={(e) => set("seoTitle", e.target.value)} placeholder="Blank = service title" className={inputCls} />
          </label>
          <label className="block mt-3">
            <span className="text-[10px] font-semibold text-slate-400 mb-1 block">Meta description</span>
            <input value={form.seoDescription} onChange={(e) => set("seoDescription", e.target.value)} className={inputCls} />
          </label>
          {form.slug && (
            <a href={`/services/${form.slug}`} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-lime-600 hover:underline">
              /services/{form.slug} <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </FieldCard>
      </div>

      <div className="shrink-0 border-t border-slate-200 dark:border-slate-700 p-3 bg-white dark:bg-slate-900 flex items-center gap-2">
        <button type="button" onClick={save} disabled={pending} className="flex-1 rounded-xl bg-lime-500 text-white text-sm font-bold py-2.5 hover:bg-lime-600 disabled:opacity-60">
          {pending ? "Saving…" : "Save & apply"}
        </button>
        {saved && <span className="text-xs font-medium text-green-600">Live ✓</span>}
      </div>
    </>
  );
}

function AddServicePanel({
  categories,
  onBack,
  onAdded,
}: {
  categories: string[];
  onBack: () => void;
  onAdded: () => void;
}) {
  const [pending, start] = useTransition();

  return (
    <>
      <div className="px-3 py-2 border-b border-slate-200 dark:border-slate-700 shrink-0 flex items-center gap-2">
        <button type="button" onClick={onBack} className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-800">
          <ArrowLeft className="w-3.5 h-3.5" /> Back
        </button>
        <p className="text-sm font-semibold text-slate-800 dark:text-white">New service</p>
      </div>
      <form
        className="flex-1 min-h-0 overflow-y-auto p-3 space-y-3"
        action={(fd) => {
          start(async () => {
            await addService(fd);
            onAdded();
          });
        }}
      >
        <label className="block">
          <span className="text-[10px] font-semibold text-slate-400 mb-1 block">Category</span>
          <input name="category" list="add-cats" placeholder="e.g. Plumbing" required className={inputCls} />
          <datalist id="add-cats">{categories.map((c) => <option key={c} value={c} />)}</datalist>
        </label>
        <label className="block">
          <span className="text-[10px] font-semibold text-slate-400 mb-1 block">Title</span>
          <input name="title" placeholder="Service name" required className={inputCls} />
        </label>
        <label className="block">
          <span className="text-[10px] font-semibold text-slate-400 mb-1 block">Short description</span>
          <input name="description" placeholder="One-line summary" className={inputCls} />
        </label>
        <ImageInput name="image" label="Service image" aspect="aspect-[3/2]" />
        <button type="submit" disabled={pending} className="w-full rounded-xl bg-lime-500 text-white text-sm font-bold py-2.5 hover:bg-lime-600 disabled:opacity-60 inline-flex items-center justify-center gap-1.5">
          <Plus className="w-4 h-4" /> {pending ? "Adding…" : "Add service"}
        </button>
      </form>
    </>
  );
}

function FieldCard({ icon: Ic, title, children }: { icon: typeof Tag; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
      <div className="px-3 py-2 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-700 flex items-center gap-2">
        <Ic className="w-3.5 h-3.5 text-lime-600" />
        <span className="text-xs font-bold text-slate-600 dark:text-slate-300">{title}</span>
      </div>
      <div className="p-3">{children}</div>
    </div>
  );
}
