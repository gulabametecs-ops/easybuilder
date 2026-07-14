"use client";

import { useTransition } from "react";
import { Trash2, Plus, ImageIcon } from "lucide-react";
import { addGalleryItem, deleteGalleryItem } from "@/lib/actions/content";
import { Card } from "./ui";
import { ImageInput } from "./ImageInput";

type Item = { id: string; category: string; image: string; caption: string };

const inputCls = "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-lime-500";

export function GalleryManager({ items, categories }: { items: Item[]; categories: string[] }) {
  const [pending, start] = useTransition();

  const grouped = new Map<string, Item[]>();
  for (const it of items) {
    if (!grouped.has(it.category)) grouped.set(it.category, []);
    grouped.get(it.category)!.push(it);
  }

  return (
    <div className={pending ? "opacity-70" : ""}>
      <Card className="p-5 mb-6">
        <p className="font-medium text-slate-900 mb-3">Add a photo</p>
        <form action={addGalleryItem} className="grid sm:grid-cols-2 gap-3">
          <input name="category" list="gcats" placeholder="Category" required className={inputCls} />
          <datalist id="gcats">{categories.map((c) => <option key={c} value={c} />)}</datalist>
          <input name="caption" placeholder="Caption (optional)" className={inputCls} />
          <div className="sm:col-span-2"><ImageInput name="image" label="Photo" aspect="aspect-square" /></div>
          <div className="sm:col-span-2">
            <button className="inline-flex items-center gap-2 rounded-lg bg-slate-900 text-white text-sm font-semibold px-4 py-2 hover:bg-slate-800"><Plus className="w-4 h-4" /> Add photo</button>
          </div>
        </form>
      </Card>

      <div className="space-y-6">
        {Array.from(grouped.entries()).map(([cat, list]) => (
          <div key={cat}>
            <h3 className="font-semibold text-slate-800 mb-2">{cat} <span className="text-slate-400 font-normal">({list.length})</span></h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
              {list.map((it) => (
                <div key={it.id} className="relative group rounded-lg overflow-hidden border border-slate-200 bg-white">
                  {it.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={it.image} alt={it.caption} className="w-full aspect-square object-cover" />
                  ) : (
                    <div className="w-full aspect-square flex items-center justify-center bg-slate-100 text-slate-400"><ImageIcon className="w-8 h-8" /></div>
                  )}
                  {it.caption && <p className="text-xs text-slate-500 p-1.5 truncate">{it.caption}</p>}
                  <button onClick={() => { if (confirm("Delete photo?")) start(() => deleteGalleryItem(it.id)); }} className="absolute top-1.5 right-1.5 p-1.5 rounded-lg bg-white/90 text-red-600 opacity-0 group-hover:opacity-100 shadow"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
