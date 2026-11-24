"use client";

import { useState, useTransition } from "react";
import { LayoutGrid, Plus, ArrowLeft, ArrowUp, ArrowDown, X, Search, Trash2, ExternalLink, Package, Eye, EyeOff } from "lucide-react";
import { saveCollection, deleteCollection, reorderCollections } from "@/lib/actions/storeCatalogAdmin";
import { inr } from "@/lib/store";
import { ImageInput } from "../ImageInput";
import { Card, EmptyState, PageHeader, btnPrimary, btnSecondary, Badge } from "../ui";

type AdminCollection = { id: string; slug: string; title: string; description: string; image: string; published: boolean; productIds: string[]; mine: boolean };
type SlimProduct = { id: string; name: string; category: string; price: number; image: string; published: boolean; tags: string[] };

const input = "w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3.5 py-2.5 text-sm outline-none focus:border-lime-500 focus:ring-4 focus:ring-lime-500/15 transition";
const lbl = "block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1";

function Thumb({ src }: { src: string }) {
  return (
    <span className="w-10 h-10 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 flex items-center justify-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {src ? <img src={src} alt="" className="w-full h-full object-cover" /> : <Package className="w-4 h-4 text-slate-300" />}
    </span>
  );
}

export function CollectionsManager({ collections, products, demo }: { collections: AdminCollection[]; products: SlimProduct[]; demo: boolean }) {
  const [editing, setEditing] = useState<AdminCollection | "new" | null>(null);
  const [pending, start] = useTransition();
  const byId = new Map(products.map((p) => [p.id, p]));

  const run = (fn: () => Promise<{ ok: boolean; error?: string }>) =>
    start(async () => {
      const r = await fn().catch((e: unknown) => ({ ok: false, error: e instanceof Error ? e.message : "Something went wrong" }));
      if (!r.ok && r.error) alert(r.error);
    });

  if (editing) return <CollectionForm c={editing === "new" ? null : editing} products={products} onClose={() => setEditing(null)} />;

  const move = (i: number, d: -1 | 1) => {
    const ids = collections.map((c) => c.id);
    [ids[i], ids[i + d]] = [ids[i + d], ids[i]];
    run(() => reorderCollections(ids));
  };

  return (
    <div className={`space-y-4 ${pending ? "opacity-70 pointer-events-none" : ""}`}>
      <PageHeader
        icon={<LayoutGrid />}
        title="Collections"
        subtitle="Hand-picked product groups — “Diwali gifts”, “Under ₹999” — each with its own page at /collections/…"
        action={<button type="button" onClick={() => setEditing("new")} className={btnPrimary}><Plus className="w-4 h-4" /> New collection</button>}
      />
      {demo && <p className="rounded-xl bg-violet-50 dark:bg-violet-500/10 text-violet-700 dark:text-violet-300 text-xs px-3 py-2">Demo: create your own collection to try editing and ordering.</p>}
      <Card className="overflow-hidden">
        {collections.length === 0 ? (
          <EmptyState icon={<LayoutGrid />} title="No collections yet" hint="Group products for a sale, a festival or a price band and link to it from your menu or home page." action={<button type="button" onClick={() => setEditing("new")} className={btnPrimary}><Plus className="w-4 h-4" /> Create a collection</button>} />
        ) : (
          <ul className="divide-y divide-slate-100 dark:divide-white/5">
            {collections.map((c, i) => {
              const items = c.productIds.map((id) => byId.get(id)).filter(Boolean) as SlimProduct[];
              return (
                <li key={c.id} className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50/70 dark:hover:bg-white/[0.02]">
                  <span className="flex flex-col">
                    <button type="button" disabled={i === 0} onClick={() => move(i, -1)} aria-label="Move up" className="p-0.5 text-slate-400 hover:text-slate-700 disabled:opacity-30"><ArrowUp className="w-3.5 h-3.5" /></button>
                    <button type="button" disabled={i === collections.length - 1} onClick={() => move(i, 1)} aria-label="Move down" className="p-0.5 text-slate-400 hover:text-slate-700 disabled:opacity-30"><ArrowDown className="w-3.5 h-3.5" /></button>
                  </span>
                  <button type="button" onClick={() => setEditing(c)} className="flex items-center gap-3 min-w-0 flex-1 text-left">
                    <Thumb src={c.image || items[0]?.image || ""} />
                    <span className="min-w-0">
                      <span className="block font-semibold text-sm text-slate-900 dark:text-white truncate">{c.title}</span>
                      <span className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
                        /collections/{c.slug} · {items.length} product{items.length === 1 ? "" : "s"}
                        {!c.published && <Badge tone="amber">Hidden</Badge>}
                      </span>
                    </span>
                  </button>
                  <span className="hidden sm:flex -space-x-2">{items.slice(0, 4).map((p) => <span key={p.id} className="ring-2 ring-white dark:ring-slate-900 rounded-lg"><Thumb src={p.image} /></span>)}</span>
                  <button type="button" title={c.published ? "Hide" : "Publish"} aria-label={c.published ? "Hide" : "Publish"} onClick={() => run(() => saveCollection({ ...c, published: !c.published }))} className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800">{c.published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}</button>
                  <a href={`/collections/${c.slug}`} target="_blank" rel="noreferrer" title="View on store" className="hidden sm:inline-flex p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"><ExternalLink className="w-4 h-4" /></a>
                  <button type="button" title="Delete" aria-label="Delete" onClick={() => { if (confirm(`Delete “${c.title}”? Products are not deleted.`)) run(() => deleteCollection(c.id)); }} className="p-2 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800"><Trash2 className="w-4 h-4" /></button>
                </li>
              );
            })}
          </ul>
        )}
      </Card>
    </div>
  );
}

function CollectionForm({ c, products, onClose }: { c: AdminCollection | null; products: SlimProduct[]; onClose: () => void }) {
  const [f, setF] = useState({ title: c?.title ?? "", slug: c?.slug ?? "", description: c?.description ?? "", image: c?.image ?? "", published: c?.published ?? true, productIds: c?.productIds ?? [] });
  const [q, setQ] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const byId = new Map(products.map((p) => [p.id, p]));
  const picked = f.productIds.map((id) => byId.get(id)).filter(Boolean) as SlimProduct[];
  const needle = q.trim().toLowerCase();
  const pool = products.filter((p) => !f.productIds.includes(p.id) && (!needle || `${p.name} ${p.category} ${p.tags.join(" ")}`.toLowerCase().includes(needle))).slice(0, 60);
  const setIds = (ids: string[]) => setF((x) => ({ ...x, productIds: ids }));
  const move = (i: number, d: -1 | 1) => {
    const ids = [...f.productIds.filter((id) => byId.has(id))];
    if (i + d < 0 || i + d >= ids.length) return;
    [ids[i], ids[i + d]] = [ids[i + d], ids[i]];
    setIds(ids);
  };

  return (
    <form
      className="space-y-4 max-w-6xl"
      onSubmit={async (e) => {
        e.preventDefault();
        setBusy(true);
        setError("");
        const r = await saveCollection({ ...f, id: c?.id, productIds: picked.map((p) => p.id) }).catch((x: unknown) => ({ ok: false as const, error: x instanceof Error ? x.message : "Save failed" }));
        setBusy(false);
        if (r.ok) onClose();
        else setError(r.error);
      }}
    >
      <div className="flex items-center justify-between gap-3">
        <button type="button" onClick={onClose} className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-lime-600"><ArrowLeft className="w-4 h-4" /> All collections</button>
        <div className="flex gap-2">
          <button type="button" onClick={onClose} className={btnSecondary}>Cancel</button>
          <button type="submit" disabled={busy} className={btnPrimary}>{busy ? "Saving…" : c ? "Save collection" : "Create collection"}</button>
        </div>
      </div>
      {error && <p className="rounded-xl bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-300 text-sm px-3 py-2" role="alert">{error}</p>}
      <div className="grid lg:grid-cols-[1fr_20rem] gap-4 items-start">
        <div className="space-y-4 min-w-0">
          <Card className="p-4 sm:p-5 space-y-3">
            <div><label className={lbl}>Title *</label><input required value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} placeholder="e.g. Diwali Gifting" className={input} /></div>
            <div><label className={lbl}>Description</label><textarea rows={3} value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} placeholder="Shown at the top of the collection page" className={input} /></div>
          </Card>
          <Card className="p-4 sm:p-5 space-y-3">
            <p className="text-sm font-bold text-slate-900 dark:text-white">Products in this collection <span className="font-normal text-slate-400">({picked.length})</span></p>
            {picked.length === 0 ? <p className="text-xs text-slate-400">Pick products from the list below.</p> : (
              <ol className="space-y-1.5">
                {picked.map((p, i) => (
                  <li key={p.id} className="flex items-center gap-2 rounded-xl border border-slate-200 dark:border-white/10 px-2 py-1.5">
                    <span className="w-5 text-xs text-slate-400 tabular-nums text-right">{i + 1}</span>
                    <Thumb src={p.image} />
                    <span className="flex-1 min-w-0"><span className="block text-sm font-semibold text-slate-900 dark:text-white truncate">{p.name}</span><span className="text-xs text-slate-500">{inr(p.price)}{!p.published && " · draft"}</span></span>
                    <button type="button" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move up" className="p-1.5 text-slate-400 hover:text-slate-700 disabled:opacity-30"><ArrowUp className="w-4 h-4" /></button>
                    <button type="button" onClick={() => move(i, 1)} disabled={i === picked.length - 1} aria-label="Move down" className="p-1.5 text-slate-400 hover:text-slate-700 disabled:opacity-30"><ArrowDown className="w-4 h-4" /></button>
                    <button type="button" onClick={() => setIds(f.productIds.filter((x) => x !== p.id))} aria-label={`Remove ${p.name}`} className="p-1.5 text-slate-400 hover:text-rose-500"><X className="w-4 h-4" /></button>
                  </li>
                ))}
              </ol>
            )}
            <div className="pt-2 border-t border-slate-100 dark:border-white/5">
              <label className="relative block mb-2">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Find products to add…" className={`${input} pl-9`} />
              </label>
              <div className="grid sm:grid-cols-2 gap-1.5 max-h-80 overflow-y-auto">
                {pool.map((p) => (
                  <button key={p.id} type="button" onClick={() => setIds([...f.productIds, p.id])} className="flex items-center gap-2 rounded-xl px-2 py-1.5 text-left hover:bg-lime-50 dark:hover:bg-lime-500/10">
                    <Thumb src={p.image} />
                    <span className="flex-1 min-w-0"><span className="block text-sm text-slate-800 dark:text-slate-100 truncate">{p.name}</span><span className="text-xs text-slate-500">{p.category || "—"} · {inr(p.price)}</span></span>
                    <Plus className="w-4 h-4 text-lime-600 shrink-0" />
                  </button>
                ))}
                {pool.length === 0 && <p className="text-xs text-slate-400 py-2">No more products to add.</p>}
              </div>
            </div>
          </Card>
        </div>
        <div className="space-y-4">
          <Card className="p-4 sm:p-5 space-y-3">
            <p className="text-sm font-bold text-slate-900 dark:text-white">Cover image</p>
            <ImageInput value={f.image} onChange={(u) => setF({ ...f, image: u })} aspect="aspect-[4/3]" />
          </Card>
          <Card className="p-4 sm:p-5 space-y-3">
            <div><label className={lbl}>URL slug</label><input value={f.slug} onChange={(e) => setF({ ...f, slug: e.target.value })} placeholder="auto from title" className={input} /></div>
            <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200"><input type="checkbox" checked={f.published} onChange={(e) => setF({ ...f, published: e.target.checked })} /> Visible on the store</label>
            <p className="text-[11px] text-slate-400">Tip: show it on any page with a Product grid section — set its “collection” field to the slug.</p>
          </Card>
        </div>
      </div>
    </form>
  );
}
