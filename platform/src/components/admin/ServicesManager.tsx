"use client";

import { useState, useTransition } from "react";
import { Trash2, Plus, ChevronDown } from "lucide-react";
import { addService, updateService, deleteService } from "@/lib/actions/content";
import { Card } from "./ui";
import { ImageInput } from "./ImageInput";

type Service = { id: string; category: string; title: string; description: string; image: string };

const inputCls = "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-lime-500";

export function ServicesManager({ services, categories, limit = 0, count = 0 }: { services: Service[]; categories: string[]; limit?: number; count?: number }) {
  const [pending, start] = useTransition();
  const [open, setOpen] = useState<string | null>(null);
  const atLimit = limit > 0 && count >= limit;

  const grouped = new Map<string, Service[]>();
  for (const s of services) {
    if (!grouped.has(s.category)) grouped.set(s.category, []);
    grouped.get(s.category)!.push(s);
  }

  return (
    <div className={pending ? "opacity-70" : ""}>
      {/* Add / limit banner */}
      {atLimit ? (
        <Card className="p-5 mb-6">
          <p className="font-medium text-slate-900">You've reached your plan's limit of {limit} services.</p>
          <p className="text-sm text-slate-500 mt-1">Upgrade your plan to add more.</p>
          <a href="/admin/settings" className="inline-flex mt-3 rounded-lg bg-lime-500 text-white text-sm font-semibold px-4 py-2 hover:bg-lime-600">Upgrade plan</a>
        </Card>
      ) : (
      <Card className="p-5 mb-6">
        <p className="font-medium text-slate-900 mb-3">Add a service{limit > 0 ? ` (${count}/${limit} used)` : ""}</p>
        <form action={addService} className="grid sm:grid-cols-2 gap-3">
          <input name="category" list="cats" placeholder="Category (e.g. Plumbing)" required className={inputCls} />
          <datalist id="cats">{categories.map((c) => <option key={c} value={c} />)}</datalist>
          <input name="title" placeholder="Service title" required className={inputCls} />
          <input name="description" placeholder="Short description" className={inputCls + " sm:col-span-2"} />
          <div className="sm:col-span-2"><ImageInput name="image" label="Service image" aspect="aspect-[3/2]" /></div>
          <div className="sm:col-span-2">
            <button className="inline-flex items-center gap-2 rounded-lg bg-slate-900 text-white text-sm font-semibold px-4 py-2 hover:bg-slate-800"><Plus className="w-4 h-4" /> Add service</button>
          </div>
        </form>
      </Card>
      )}

      {/* List grouped */}
      <div className="space-y-6">
        {Array.from(grouped.entries()).map(([cat, items]) => (
          <div key={cat}>
            <h3 className="font-semibold text-slate-800 mb-2">{cat} <span className="text-slate-400 font-normal">({items.length})</span></h3>
            <div className="space-y-2">
              {items.map((s) => (
                <Card key={s.id}>
                  <div className="flex items-center gap-3 p-4">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-900">{s.title}</p>
                      {s.description && <p className="text-sm text-slate-400 truncate">{s.description}</p>}
                    </div>
                    <button onClick={() => setOpen(open === s.id ? null : s.id)} className="p-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200"><ChevronDown className="w-4 h-4" /></button>
                    <button onClick={() => { if (confirm("Delete service?")) start(() => deleteService(s.id)); }} className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100"><Trash2 className="w-4 h-4" /></button>
                  </div>
                  {open === s.id && (
                    <form action={updateService} className="border-t border-slate-100 p-4 bg-slate-50 grid sm:grid-cols-2 gap-3">
                      <input type="hidden" name="id" value={s.id} />
                      <input name="category" defaultValue={s.category} className={inputCls} />
                      <input name="title" defaultValue={s.title} className={inputCls} />
                      <input name="description" defaultValue={s.description} className={inputCls + " sm:col-span-2"} />
                      <div className="sm:col-span-2"><ImageInput name="image" defaultValue={s.image} label="Service image" aspect="aspect-[3/2]" /></div>
                      <div className="sm:col-span-2 flex justify-end">
                        <button className="rounded-lg bg-slate-900 text-white text-sm font-semibold px-4 py-2 hover:bg-slate-800">Save</button>
                      </div>
                    </form>
                  )}
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
