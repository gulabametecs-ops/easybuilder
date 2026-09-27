"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Images, ImageIcon, Tag, ArrowLeft, Search } from "lucide-react";
import { addGalleryItem, deleteGalleryItem } from "@/lib/actions/content";
import { ImageInput } from "./ImageInput";
import { AdminSplitShell } from "./AdminSplitShell";

type Item = { id: string; category: string; image: string; caption: string };

const inputCls =
  "w-full rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-800 px-3 py-2 text-sm outline-none focus:border-lime-500";

export function GalleryManager({ items: initial, categories }: { items: Item[]; categories: string[] }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [items, setItems] = useState(initial);
  const [adding, setAdding] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [tick, setTick] = useState(0);

  useEffect(() => setItems(initial), [initial]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return items;
    return items.filter(
      (it) => it.category.toLowerCase().includes(needle) || it.caption.toLowerCase().includes(needle),
    );
  }, [items, q]);

  const grouped = useMemo(() => {
    const map = new Map<string, Item[]>();
    for (const it of filtered) {
      if (!map.has(it.category)) map.set(it.category, []);
      map.get(it.category)!.push(it);
    }
    return map;
  }, [filtered]);

  const selectedItem = items.find((i) => i.id === selected) ?? null;
  const bump = () => { setTick((t) => t + 1); router.refresh(); };

  return (
    <div className={pending ? "opacity-70 pointer-events-none" : ""}>
      <AdminSplitShell
        title="Gallery"
        titleIcon={<Images className="w-4 h-4 text-lime-600 shrink-0" />}
        countLabel={`${items.length}`}
        previewSrc={`/?__edit=1&_r=${tick}`}
        previewKey={`g:${tick}`}
        toolbar={
          !adding && !selectedItem ? (
            <button type="button" onClick={() => setAdding(true)} className="inline-flex items-center gap-1 rounded-md bg-lime-500 text-white text-xs font-semibold px-2.5 py-1.5 hover:bg-lime-600">
              <Plus className="w-3.5 h-3.5" /> Add
            </button>
          ) : undefined
        }
        headerExtra={
          !adding && !selectedItem ? (
            <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search photos…" className="w-full rounded-lg border border-slate-200 dark:border-slate-600 dark:bg-slate-800 pl-8 pr-3 py-1.5 text-sm outline-none focus:border-lime-500" />
              </div>
            </div>
          ) : undefined
        }
      >
        {adding ? (
          <div className="p-3 space-y-3">
            <button type="button" onClick={() => setAdding(false)} className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-800">
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>
            <p className="text-sm font-semibold text-slate-800 dark:text-white">Add photo</p>
            <form
              className="space-y-3"
              action={(fd) => {
                start(async () => {
                  await addGalleryItem(fd);
                  setAdding(false);
                  bump();
                });
              }}
            >
              <label className="block">
                <span className="text-[10px] font-semibold text-slate-400 mb-1 block">Category</span>
                <input name="category" list="gcats" placeholder="e.g. Campus" required className={inputCls} />
                <datalist id="gcats">{categories.map((c) => <option key={c} value={c} />)}</datalist>
              </label>
              <label className="block">
                <span className="text-[10px] font-semibold text-slate-400 mb-1 block">Caption</span>
                <input name="caption" placeholder="Optional" className={inputCls} />
              </label>
              <ImageInput name="image" label="Photo" aspect="aspect-square" />
              <button type="submit" className="w-full rounded-xl bg-lime-500 text-white text-sm font-bold py-2.5 hover:bg-lime-600 inline-flex items-center justify-center gap-1.5">
                <Plus className="w-4 h-4" /> Add photo
              </button>
            </form>
          </div>
        ) : selectedItem ? (
          <div className="p-3 space-y-3">
            <button type="button" onClick={() => setSelected(null)} className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-800">
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>
            <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 aspect-square flex items-center justify-center">
              {selectedItem.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={selectedItem.image} alt={selectedItem.caption} className="w-full h-full object-cover" />
              ) : (
                <ImageIcon className="w-10 h-10 text-slate-300" />
              )}
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800 dark:text-white">{selectedItem.caption || "Untitled photo"}</p>
              <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5"><Tag className="w-3 h-3" /> {selectedItem.category}</p>
            </div>
            <button
              type="button"
              onClick={() => {
                if (!confirm("Delete this photo?")) return;
                start(async () => {
                  await deleteGalleryItem(selectedItem.id);
                  setItems((prev) => prev.filter((i) => i.id !== selectedItem.id));
                  setSelected(null);
                  bump();
                });
              }}
              className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl border border-red-200 text-red-600 text-sm font-semibold py-2.5 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" /> Delete photo
            </button>
          </div>
        ) : (
          <div className="p-2 space-y-3">
            {items.length === 0 && (
              <div className="text-center py-12 px-4">
                <span className="inline-flex w-12 h-12 rounded-2xl bg-lime-500/15 text-lime-600 items-center justify-center mb-3">
                  <Images className="w-6 h-6" />
                </span>
                <p className="text-sm font-semibold text-slate-800 dark:text-white">No photos yet</p>
                <p className="text-xs text-slate-400 mt-1 mb-3">Add photos to show in your gallery section.</p>
                <button type="button" onClick={() => setAdding(true)} className="text-sm font-semibold text-lime-600 hover:underline">Add first photo</button>
              </div>
            )}
            {Array.from(grouped.entries()).map(([cat, list]) => (
              <div key={cat}>
                <p className="px-1.5 mb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                  <Tag className="w-3 h-3" /> {cat} · {list.length}
                </p>
                <div className="grid grid-cols-3 gap-1.5">
                  {list.map((it) => (
                    <button
                      key={it.id}
                      type="button"
                      onClick={() => setSelected(it.id)}
                      className="relative aspect-square rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 hover:border-lime-400 transition"
                    >
                      {it.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={it.image} alt={it.caption} className="w-full h-full object-cover" />
                      ) : (
                        <span className="flex items-center justify-center h-full"><ImageIcon className="w-5 h-5 text-slate-300" /></span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            ))}
            {filtered.length === 0 && items.length > 0 && (
              <p className="text-center text-xs text-slate-400 py-8">No matches for “{q}”</p>
            )}
          </div>
        )}
      </AdminSplitShell>
    </div>
  );
}
