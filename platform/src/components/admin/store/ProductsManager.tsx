"use client";

import { useMemo, useState, useTransition } from "react";
import { Package, Plus, Search, Star, Eye, EyeOff, Trash2, X, ArrowLeft, ImagePlus, AlertTriangle, ExternalLink, Layers } from "lucide-react";
import { saveProduct, deleteProducts, setProductsFlag, setProductStock, type ProductInput } from "@/lib/actions/store";
import { discountPct, inr, productHref, totalStock, variantMatrix, type PublicProduct, type VariantDraft } from "@/lib/store";
import { ImageInput } from "../ImageInput";
import { Card, EmptyState, PageHeader, btnPrimary, btnSecondary, Badge } from "../ui";
import { CsvExportButton } from "./CsvExportButton";
import { ProductCsvImport } from "./ProductCsvImport";

export type AdminProduct = PublicProduct & { published: boolean; mine: boolean };

const input = "w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3.5 py-2.5 text-sm outline-none focus:border-lime-500 focus:ring-4 focus:ring-lime-500/15 transition";
const cellInput = "w-full min-w-0 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-2 py-1.5 text-sm tabular-nums outline-none focus:border-lime-500";
const lbl = "block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1";
const check = "flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200";

export function ProductsManager({ products, lowStockAt, demo }: { products: AdminProduct[]; lowStockAt: number; demo: boolean }) {
  const [pending, start] = useTransition();
  const [editing, setEditing] = useState<AdminProduct | "new" | null>(null);
  const [importing, setImporting] = useState(false);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("");
  const [view, setView] = useState<"all" | "live" | "draft" | "low">("all");
  const [sel, setSel] = useState<Set<string>>(new Set());
  const categories = useMemo(() => [...new Set(products.map((p) => p.category).filter(Boolean))].sort(), [products]);

  const needle = q.trim().toLowerCase();
  const isLow = (p: AdminProduct) => p.trackStock && !p.allowBackorder && totalStock(p) <= lowStockAt;
  const list = products.filter((p) =>
    (!cat || p.category === cat)
    && (view === "all" || (view === "live" && p.published) || (view === "draft" && !p.published) || (view === "low" && isLow(p)))
    && (!needle || [p.name, p.category, p.badge, p.sku, ...p.tags, ...p.variants.map((v) => v.sku)].join(" ").toLowerCase().includes(needle)));
  const lowCount = products.filter(isLow).length;

  const run = (fn: () => Promise<{ ok: boolean; error?: string } | unknown>) =>
    start(async () => {
      try {
        const r = (await fn()) as { ok?: boolean; error?: string } | undefined;
        if (r && r.ok === false && r.error) alert(r.error);
      } catch (e) {
        alert(e instanceof Error ? e.message : "Something went wrong");
      }
    });
  const toggleSel = (id: string) => setSel((s) => { const n = new Set(s); if (n.has(id)) n.delete(id); else n.add(id); return n; });
  const ids = [...sel];

  if (editing) {
    return (
      <ProductForm
        product={editing === "new" ? null : editing}
        categories={categories}
        onClose={() => setEditing(null)}
        onSave={async (data) => {
          const r = await saveProduct(data);
          if (r.ok) setEditing(null);
          return r.ok ? null : r.error;
        }}
      />
    );
  }
  if (importing) return <ProductCsvImport onClose={() => setImporting(false)} />;

  const tab = (id: typeof view, label: string, n?: number) => (
    <button type="button" onClick={() => setView(id)} className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${view === id ? "admin-grad shadow-sm" : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:border-lime-400"}`}>
      {label}{n != null && <span className="ml-1 opacity-70">{n}</span>}
    </button>
  );

  return (
    <div className={`space-y-4 ${pending ? "opacity-70 pointer-events-none" : ""}`}>
      <PageHeader
        icon={<Package />}
        title="Products"
        subtitle={`${products.length} products · ${products.filter((p) => p.published).length} live on your store`}
        action={
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => setImporting(true)} className={btnSecondary}>Import CSV</button>
            <CsvExportButton kind="products" />
            <button type="button" onClick={() => setEditing("new")} className={btnPrimary}><Plus className="w-4 h-4" /> Add product</button>
          </div>
        }
      />
      {demo && <p className="rounded-xl bg-violet-50 dark:bg-violet-500/10 text-violet-700 dark:text-violet-300 text-xs px-3 py-2">Demo: sample products are read-only. Add your own product to try editing, stock and bulk actions.</p>}

      <Card className="p-3 sm:p-4 space-y-3">
        <div className="flex flex-col sm:flex-row gap-2">
          <label className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, SKU or tag…" className={`${input} pl-9`} />
          </label>
          <select value={cat} onChange={(e) => setCat(e.target.value)} className={`${input} sm:w-56`} aria-label="Category">
            <option value="">All categories</option>
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {tab("all", "All", products.length)}
          {tab("live", "Live", products.filter((p) => p.published).length)}
          {tab("draft", "Drafts", products.filter((p) => !p.published).length)}
          {tab("low", "Low stock", lowCount)}
        </div>
      </Card>

      {sel.size > 0 && (
        <div className="sticky top-0 z-10 flex flex-wrap items-center gap-2 rounded-2xl admin-grad px-4 py-2.5 shadow-lg">
          <span className="text-sm font-bold">{sel.size} selected</span>
          <button type="button" className="rounded-lg bg-white/15 hover:bg-white/25 px-3 py-1.5 text-xs font-semibold" onClick={() => run(async () => { const r = await setProductsFlag(ids, "published", true); setSel(new Set()); return r; })}>Publish</button>
          <button type="button" className="rounded-lg bg-white/15 hover:bg-white/25 px-3 py-1.5 text-xs font-semibold" onClick={() => run(async () => { const r = await setProductsFlag(ids, "published", false); setSel(new Set()); return r; })}>Unpublish</button>
          <button type="button" className="rounded-lg bg-white/15 hover:bg-white/25 px-3 py-1.5 text-xs font-semibold" onClick={() => { if (confirm(`Delete ${sel.size} product(s)? This cannot be undone.`)) run(async () => { const r = await deleteProducts(ids); setSel(new Set()); return r; }); }}>Delete</button>
          <button type="button" className="ml-auto p-1 rounded-lg hover:bg-white/15" onClick={() => setSel(new Set())} aria-label="Clear selection"><X className="w-4 h-4" /></button>
        </div>
      )}

      <Card className="overflow-hidden">
        {list.length === 0 ? (
          products.length === 0 ? (
            <EmptyState icon={<Package />} title="No products yet" hint="Add your first product with photos, price and stock — or import a CSV. It appears on your Shop page instantly." action={<button type="button" onClick={() => setEditing("new")} className={btnPrimary}><Plus className="w-4 h-4" /> Add first product</button>} />
          ) : <p className="text-center text-sm text-slate-400 py-12">No products match.</p>
        ) : (
          <ul className="divide-y divide-slate-100 dark:divide-white/5">
            <li className="hidden md:grid grid-cols-[2rem_1fr_7rem_7rem_8rem] gap-3 px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              <input type="checkbox" aria-label="Select all" checked={list.every((p) => sel.has(p.id))} onChange={(e) => setSel(e.target.checked ? new Set(list.map((p) => p.id)) : new Set())} />
              <span>Product</span><span>Price</span><span>Stock</span><span className="text-right">Actions</span>
            </li>
            {list.map((p) => {
              const low = isLow(p);
              const stock = totalStock(p);
              return (
                <li key={p.id} className="grid grid-cols-[2rem_1fr_auto] md:grid-cols-[2rem_1fr_7rem_7rem_8rem] items-center gap-3 px-4 py-3 hover:bg-slate-50/70 dark:hover:bg-white/[0.02]">
                  <input type="checkbox" aria-label={`Select ${p.name}`} checked={sel.has(p.id)} onChange={() => toggleSel(p.id)} />
                  <button type="button" onClick={() => setEditing(p)} className="flex items-center gap-3 min-w-0 text-left">
                    <span className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 flex items-center justify-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      {p.images[0] ? <img src={p.images[0]} alt="" className="w-full h-full object-cover" /> : <Package className="w-5 h-5 text-slate-300" />}
                    </span>
                    <span className="min-w-0">
                      <span className="flex items-center gap-1.5 min-w-0">
                        {p.featured && <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400 shrink-0" />}
                        <span className="font-semibold text-sm text-slate-900 dark:text-white truncate">{p.name}</span>
                      </span>
                      <span className="flex flex-wrap items-center gap-1.5 mt-0.5">
                        {p.category && <span className="text-xs text-slate-500">{p.category}</span>}
                        {p.sku && <span className="text-[11px] font-mono text-slate-400">{p.sku}</span>}
                        {!p.published && <Badge tone="amber">Draft</Badge>}
                        {p.variants.length > 0 ? <Badge tone="violet">{p.variants.length} variants</Badge> : p.options.length > 0 && <Badge tone="slate">{p.options.map((o) => o.name).join(" · ")}</Badge>}
                        <span className="md:hidden text-xs font-bold text-slate-700 dark:text-slate-200">{inr(p.price)}</span>
                        <span className={`md:hidden text-xs font-semibold ${low ? "text-rose-600" : "text-slate-500"}`}>· {p.trackStock ? `${stock} in stock` : "not tracked"}</span>
                      </span>
                    </span>
                  </button>
                  <span className="hidden md:block">
                    <span className="block text-sm font-bold text-slate-900 dark:text-white tabular-nums">{inr(p.price)}</span>
                    {discountPct(p) > 0 && <span className="text-[11px] text-emerald-600 font-semibold">{discountPct(p)}% off {inr(p.mrp)}</span>}
                  </span>
                  <span className="hidden md:flex items-center gap-1.5">
                    {!p.trackStock ? (
                      <span className="text-xs text-slate-400">Not tracked</span>
                    ) : p.variants.length ? (
                      <button type="button" onClick={() => setEditing(p)} title="Edit stock per variant" className={`inline-flex items-center gap-1 text-sm font-semibold tabular-nums ${low ? "text-rose-600" : "text-slate-700 dark:text-slate-200"} hover:text-lime-600`}>
                        <Layers className="w-3.5 h-3.5" /> {stock}
                      </button>
                    ) : (
                      <input
                        type="number" min={0} defaultValue={p.stock} aria-label={`Stock for ${p.name}`} disabled={demo && !p.mine}
                        onBlur={(e) => { const n = Math.max(0, Math.floor(Number(e.target.value) || 0)); if (n !== p.stock) run(() => setProductStock(p.id, n)); }}
                        className={`w-16 rounded-lg border px-2 py-1 text-sm tabular-nums bg-transparent ${low ? "border-rose-300 text-rose-600" : "border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200"}`}
                      />
                    )}
                    {low && <AlertTriangle className="w-4 h-4 text-rose-500" aria-label="Low stock" />}
                  </span>
                  <span className="flex items-center justify-end gap-0.5">
                    <IconBtn title={p.published ? "Unpublish" : "Publish"} onClick={() => run(() => setProductsFlag([p.id], "published", !p.published))}>{p.published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}</IconBtn>
                    <IconBtn title={p.featured ? "Remove from bestsellers" : "Show in bestsellers"} onClick={() => run(() => setProductsFlag([p.id], "featured", !p.featured))}><Star className={`w-4 h-4 ${p.featured ? "text-amber-500 fill-amber-400" : ""}`} /></IconBtn>
                    <a href={productHref(p.slug)} target="_blank" rel="noreferrer" title="View on store" className="hidden sm:inline-flex p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"><ExternalLink className="w-4 h-4" /></a>
                    <IconBtn title="Delete" danger onClick={() => { if (confirm(`Delete "${p.name}"?`)) run(() => deleteProducts([p.id])); }}><Trash2 className="w-4 h-4" /></IconBtn>
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </Card>
    </div>
  );
}

function IconBtn({ title, onClick, danger, children }: { title: string; onClick: () => void; danger?: boolean; children: React.ReactNode }) {
  return (
    <button type="button" title={title} aria-label={title} onClick={onClick} className={`p-2 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 ${danger ? "hover:text-rose-500" : "hover:text-slate-700 dark:hover:text-slate-200"}`}>
      {children}
    </button>
  );
}

type Form = Required<Omit<ProductInput, "id" | "variants">> & { variants: VariantDraft[] };

function initialForm(product: AdminProduct | null): Form {
  const options = product?.options ?? [];
  // Older products have options but no variant rows: start each combination at the shared stock.
  const variants: VariantDraft[] = product?.variants.length
    ? product.variants
    : variantMatrix(options).map((v) => ({ ...v, stock: product?.stock ?? 0 }));
  return {
    name: product?.name ?? "", slug: product?.slug ?? "", category: product?.category ?? "", price: product?.price ?? 0, mrp: product?.mrp ?? 0,
    images: product?.images ?? [], description: product?.description ?? "", stock: product?.stock ?? 10, options,
    badge: product?.badge ?? "", featured: product?.featured ?? false, published: product?.published ?? true,
    sku: product?.sku ?? "", weightGrams: product?.weightGrams ?? 0, hsn: product?.hsn ?? "", gstRate: product?.gstRate ?? 0, tags: product?.tags ?? [],
    trackStock: product?.trackStock ?? true, allowBackorder: product?.allowBackorder ?? false, seoTitle: product?.seoTitle ?? "", seoDescription: product?.seoDescription ?? "",
    variants,
  };
}

function ProductForm({ product, categories, onClose, onSave }: { product: AdminProduct | null; categories: string[]; onClose: () => void; onSave: (d: ProductInput) => Promise<string | null> }) {
  const [f, setF] = useState<Form>(() => initialForm(product));
  const [tagText, setTagText] = useState(() => (product?.tags ?? []).join(", "));
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const set = <K extends keyof Form>(k: K, v: Form[K]) => setF((x) => ({ ...x, [k]: v }));
  const num = (k: "price" | "mrp" | "stock" | "weightGrams") => (
    <input type="number" min={0} inputMode="numeric" value={f[k] || ""} onChange={(e) => set(k, Math.max(0, Math.floor(Number(e.target.value) || 0)))} className={input} />
  );
  const off = discountPct({ price: f.price, mrp: f.mrp });
  const options = f.options.filter((o) => o.name.trim() && o.values.length);
  const matrix = variantMatrix(options, f.variants);
  const setOptions = (next: Form["options"]) => setF((x) => ({ ...x, options: next, variants: variantMatrix(next.filter((o) => o.name.trim() && o.values.length), x.variants) }));
  const setVariant = (title: string, patch: Partial<VariantDraft>) => set("variants", matrix.map((v) => (v.title === title ? { ...v, ...patch } : v)));
  const setAll = (patch: Partial<VariantDraft>) => set("variants", matrix.map((v) => ({ ...v, ...patch })));

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        setBusy(true);
        setError("");
        const err = await onSave({ ...f, id: product?.id, options, variants: matrix }).catch((x) => (x instanceof Error ? x.message : "Save failed"));
        setBusy(false);
        if (err) setError(err);
      }}
      className="space-y-4 max-w-6xl"
    >
      <div className="flex items-center justify-between gap-3">
        <button type="button" onClick={onClose} className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-lime-600"><ArrowLeft className="w-4 h-4" /> All products</button>
        <div className="flex gap-2">
          <button type="button" onClick={onClose} className={btnSecondary}>Cancel</button>
          <button type="submit" disabled={busy} className={btnPrimary}>{busy ? "Saving…" : product ? "Save product" : "Add product"}</button>
        </div>
      </div>
      {error && <p className="rounded-xl bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-300 text-sm px-3 py-2" role="alert">{error}</p>}

      <div className="grid lg:grid-cols-[1fr_20rem] gap-4 items-start">
        <div className="space-y-4 min-w-0">
          <Card className="p-4 sm:p-5 space-y-3">
            <div><label className={lbl}>Product name *</label><input required value={f.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. Cotton Anarkali Kurta Set" className={input} /></div>
            <div><label className={lbl}>Description</label><textarea rows={5} value={f.description} onChange={(e) => set("description", e.target.value)} placeholder="Fabric, size guide, what's in the box, care instructions…" className={input} /></div>
          </Card>

          <Card className="p-4 sm:p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-bold text-slate-900 dark:text-white">Photos <span className="font-normal text-slate-400">({f.images.length}/8 · first is the cover)</span></p>
              {f.images.length < 8 && (
                <button type="button" onClick={() => set("images", [...f.images, ""])} className="inline-flex items-center gap-1 text-xs font-semibold text-lime-600 hover:underline"><ImagePlus className="w-4 h-4" /> Add photo</button>
              )}
            </div>
            {f.images.length === 0 ? (
              <button type="button" onClick={() => set("images", [""])} className="w-full rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 py-10 text-sm text-slate-500 hover:border-lime-400">
                <ImagePlus className="w-6 h-6 mx-auto mb-1 text-slate-400" /> Upload product photos (square works best)
              </button>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {f.images.map((src, i) => (
                  <div key={i} className="relative">
                    <ImageInput value={src} onChange={(u) => set("images", f.images.map((x, j) => (j === i ? u : x)))} aspect="aspect-square" />
                    <button type="button" onClick={() => set("images", f.images.filter((_, j) => j !== i))} aria-label="Remove photo" className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center shadow"><X className="w-3.5 h-3.5" /></button>
                    {i === 0 && <span className="absolute top-1.5 left-1.5 rounded-md bg-lime-500 text-white text-[10px] font-bold px-1.5 py-0.5">Cover</span>}
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card className="p-4 sm:p-5 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold text-slate-900 dark:text-white">Variants <span className="font-normal text-slate-400">(size, colour, shade…)</span></p>
              {f.options.length < 3 && <button type="button" onClick={() => setOptions([...f.options, { name: f.options.length ? "Colour" : "Size", values: [] }])} className="inline-flex items-center gap-1 text-xs font-semibold text-lime-600 hover:underline"><Plus className="w-4 h-4" /> Add option</button>}
            </div>
            {f.options.length === 0 && <p className="text-xs text-slate-400">No variants — shoppers add it straight to cart.</p>}
            {f.options.map((o, i) => (
              <div key={i} className="grid sm:grid-cols-[10rem_1fr_auto] gap-2 items-start">
                <input value={o.name} onChange={(e) => setOptions(f.options.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)))} placeholder="Option name" aria-label="Option name" className={input} />
                <input
                  defaultValue={o.values.join(", ")}
                  onChange={(e) => setOptions(f.options.map((x, j) => (j === i ? { ...x, values: [...new Set(e.target.value.split(",").map((v) => v.trim()).filter(Boolean))] } : x)))}
                  placeholder="Values, comma separated: S, M, L, XL" aria-label={`${o.name || "Option"} values`} className={input}
                />
                <button type="button" onClick={() => setOptions(f.options.filter((_, j) => j !== i))} className="p-2.5 rounded-xl text-slate-400 hover:text-rose-500" aria-label="Remove option"><Trash2 className="w-4 h-4" /></button>
              </div>
            ))}
            {matrix.length > 0 && (
              <div className="pt-2 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-xs font-bold text-slate-500 dark:text-slate-400">{matrix.length} variant{matrix.length === 1 ? "" : "s"} · price 0 = product price</p>
                  <div className="flex items-center gap-1.5 text-xs">
                    <span className="text-slate-400 whitespace-nowrap">Set all:</span>
                    <input type="number" min={0} placeholder="Price" aria-label="Set price for all variants" className={`${cellInput.replace("w-full ", "")} w-20`} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); setAll({ price: Math.max(0, Math.floor(Number(e.currentTarget.value) || 0)) }); } }} onBlur={(e) => { if (e.target.value) setAll({ price: Math.max(0, Math.floor(Number(e.target.value) || 0)) }); e.target.value = ""; }} />
                    <input type="number" min={0} placeholder="Stock" aria-label="Set stock for all variants" className={`${cellInput.replace("w-full ", "")} w-20`} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); setAll({ stock: Math.max(0, Math.floor(Number(e.currentTarget.value) || 0)) }); } }} onBlur={(e) => { if (e.target.value) setAll({ stock: Math.max(0, Math.floor(Number(e.target.value) || 0)) }); e.target.value = ""; }} />
                  </div>
                </div>
                <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
                  <table className="w-full text-sm min-w-[40rem]">
                    <thead className="text-[11px] uppercase tracking-wider text-slate-400 text-left">
                      <tr><th className="py-1.5 pr-2">Variant</th><th className="py-1.5 pr-2 w-24">Price ₹</th><th className="py-1.5 pr-2 w-24">MRP ₹</th><th className="py-1.5 pr-2 w-20">Stock</th><th className="py-1.5 pr-2 w-32">SKU</th><th className="py-1.5 w-28">Photo</th></tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                      {matrix.map((v) => (
                        <tr key={v.title}>
                          <td className="py-1.5 pr-2 font-semibold text-slate-800 dark:text-slate-100 whitespace-nowrap">{v.title}</td>
                          {(["price", "mrp", "stock"] as const).map((k) => (
                            <td key={k} className="py-1.5 pr-2">
                              <input type="number" min={0} inputMode="numeric" value={v[k] || ""} placeholder={k === "price" ? String(f.price || "") : k === "mrp" ? String(f.mrp || "") : "0"} aria-label={`${v.title} ${k}`} onChange={(e) => setVariant(v.title, { [k]: Math.max(0, Math.floor(Number(e.target.value) || 0)) })} className={cellInput} />
                            </td>
                          ))}
                          <td className="py-1.5 pr-2"><input value={v.sku} aria-label={`${v.title} SKU`} onChange={(e) => setVariant(v.title, { sku: e.target.value })} className={cellInput} /></td>
                          <td className="py-1.5">
                            <select value={v.image} aria-label={`${v.title} photo`} onChange={(e) => setVariant(v.title, { image: e.target.value })} className={cellInput}>
                              <option value="">Cover</option>
                              {f.images.filter(Boolean).map((src, i) => <option key={src + i} value={src}>Photo {i + 1}</option>)}
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </Card>

          <Card className="p-4 sm:p-5 space-y-3">
            <p className="text-sm font-bold text-slate-900 dark:text-white">Search engine listing</p>
            <div><label className={lbl}>SEO title <span className="font-normal">({f.seoTitle.length}/70)</span></label><input value={f.seoTitle} maxLength={120} onChange={(e) => set("seoTitle", e.target.value)} placeholder={f.name || "Defaults to the product name and price"} className={input} /></div>
            <div><label className={lbl}>SEO description <span className="font-normal">({f.seoDescription.length}/160)</span></label><textarea rows={2} maxLength={320} value={f.seoDescription} onChange={(e) => set("seoDescription", e.target.value)} placeholder="Defaults to the start of the description" className={input} /></div>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="p-4 sm:p-5 space-y-3">
            <p className="text-sm font-bold text-slate-900 dark:text-white">Pricing</p>
            <div className="grid grid-cols-2 gap-3">
              <div><label className={lbl}>Price (₹) *</label>{num("price")}</div>
              <div><label className={lbl}>MRP (₹)</label>{num("mrp")}</div>
            </div>
            {off > 0 && <p className="text-xs font-semibold text-emerald-600">Shows as {off}% off</p>}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={lbl}>GST %</label>
                <select value={f.gstRate} onChange={(e) => set("gstRate", Number(e.target.value))} className={input}>
                  {[0, 3, 5, 12, 18, 28].map((n) => <option key={n} value={n}>{n}%</option>)}
                </select>
              </div>
              <div><label className={lbl}>HSN code</label><input value={f.hsn} inputMode="numeric" maxLength={12} onChange={(e) => set("hsn", e.target.value.replace(/\D/g, ""))} placeholder="e.g. 6204" className={input} /></div>
            </div>
            <p className="text-[11px] text-slate-400">Prices include GST. HSN + GST print on invoices.</p>
          </Card>
          <Card className="p-4 sm:p-5 space-y-3">
            <p className="text-sm font-bold text-slate-900 dark:text-white">Inventory & shipping</p>
            <div><label className={lbl}>SKU</label><input value={f.sku} onChange={(e) => set("sku", e.target.value)} placeholder="e.g. KUR-ANK-01" className={input} /></div>
            {matrix.length === 0 ? <div><label className={lbl}>Stock (units)</label>{num("stock")}</div> : <p className="text-xs text-slate-500">Stock is set per variant: <strong>{matrix.reduce((n, v) => n + v.stock, 0)}</strong> in total.</p>}
            <div><label className={lbl}>Weight (grams)</label>{num("weightGrams")}</div>
            <label className={check}><input type="checkbox" checked={f.trackStock} onChange={(e) => set("trackStock", e.target.checked)} /> Track stock</label>
            <label className={check}><input type="checkbox" checked={f.allowBackorder} disabled={!f.trackStock} onChange={(e) => set("allowBackorder", e.target.checked)} /> Keep selling when out of stock</label>
          </Card>
          <Card className="p-4 sm:p-5 space-y-3">
            <p className="text-sm font-bold text-slate-900 dark:text-white">Organise</p>
            <div>
              <label className={lbl}>Category</label>
              <input list="product-cats" value={f.category} onChange={(e) => set("category", e.target.value)} placeholder="e.g. Women" className={input} />
              <datalist id="product-cats">{categories.map((c) => <option key={c} value={c} />)}</datalist>
            </div>
            <div>
              <label className={lbl}>Tags</label>
              <input value={tagText} onChange={(e) => { setTagText(e.target.value); set("tags", [...new Set(e.target.value.split(",").map((t) => t.trim().toLowerCase()).filter(Boolean))].slice(0, 30)); }} placeholder="cotton, festive, under-999" className={input} />
              {f.tags.length > 0 && <div className="flex flex-wrap gap-1 mt-1.5">{f.tags.map((t) => <Badge key={t} tone="blue">{t}</Badge>)}</div>}
            </div>
            <div><label className={lbl}>Badge</label><input value={f.badge} onChange={(e) => set("badge", e.target.value)} placeholder="Bestseller, New, Sale…" className={input} /></div>
            <div><label className={lbl}>URL slug</label><input value={f.slug} onChange={(e) => set("slug", e.target.value)} placeholder="auto from name" className={input} /></div>
            <label className={check}><input type="checkbox" checked={f.published} onChange={(e) => set("published", e.target.checked)} /> Live on the store</label>
            <label className={check}><input type="checkbox" checked={f.featured} onChange={(e) => set("featured", e.target.checked)} /> Show in bestsellers</label>
          </Card>
        </div>
      </div>
    </form>
  );
}
