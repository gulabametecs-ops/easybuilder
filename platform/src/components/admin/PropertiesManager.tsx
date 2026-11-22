"use client";

import { useRef, useState, useTransition } from "react";
import { Plus, Trash2, Building2, Star, Copy, Eye, EyeOff, CheckCircle2, Search, Home, KeyRound, BedDouble, HardHat, Paperclip, X } from "lucide-react";
import { saveProperty, deleteProperty, duplicateProperty, setPropertyFlag, setPropertyStatus, type PropertyInput } from "@/lib/actions/properties";
import { AMENITIES, FURNISHING, PROPERTY_TYPES, PURPOSES, STATUSES, formatPrice, priceLabel, purposeLabel, type FloorPlan, type PublicProperty } from "@/lib/property";
import { ImageInput } from "./ImageInput";
import { AdminWorkspace } from "./AdminWorkspace";
import { Badge, EmptyState, btnPrimary } from "./ui";
import { BrandSpinner } from "@/components/BrandLogo";

export type AdminProperty = PublicProperty & { published: boolean };
type Form = Required<Omit<PropertyInput, "id" | "floorPlans" | "gender">> & { id?: string; gender: string; floorPlans: FloorPlan[] };
type StrKey = { [K in keyof Form]-?: Form[K] extends string ? K : never }[keyof Form];

const input = "w-full rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-800 px-3 py-2 text-sm outline-none focus:border-lime-500";
const label = "text-xs font-semibold text-slate-500 uppercase tracking-wide";
const h3 = "text-sm font-bold text-slate-900 dark:text-white";

const STATUS_TONE = { available: "green", "under-offer": "amber", sold: "red", rented: "blue" } as const;

function blank(): Form {
  return {
    title: "", slug: "", purpose: "sale", propertyType: "apartment", status: "available", price: 0, priceNote: "", deposit: 0, maintenance: 0,
    bhk: "", areaSqft: 0, furnishing: "", bathrooms: 0, floor: "", facing: "", parking: "", availableFrom: "", possession: "", rera: "",
    sharing: "", foodIncluded: false, gender: "", locality: "", city: "", address: "", mapUrl: "", summary: "", description: "",
    highlights: [], amenities: [], coverImage: "", gallery: [], floorPlans: [], brochureUrl: "", videoUrl: "", featured: false, published: true,
  };
}

export function PropertiesManager({ properties: initial, maxFileMb = 25 }: { properties: AdminProperty[]; maxFileMb?: number }) {
  const [pending, start] = useTransition();
  const [items, setItems] = useState(initial);
  const [editing, setEditing] = useState<AdminProperty | null | "new">(null);
  const [filter, setFilter] = useState("all");
  const [q, setQ] = useState("");
  // Re-sync when the server sends fresh data (adjust state during render, not in an effect).
  const [prevInitial, setPrevInitial] = useState(initial);
  if (prevInitial !== initial) {
    setPrevInitial(initial);
    setItems(initial);
  }

  const needle = q.trim().toLowerCase();
  const visible = items.filter(
    (p) => (filter === "all" || p.purpose === filter) && (!needle || `${p.title} ${p.locality} ${p.city} ${p.bhk}`.toLowerCase().includes(needle)),
  );
  const run = (fn: () => Promise<unknown>) => start(async () => { try { await fn(); } catch (e) { alert(e instanceof Error ? e.message : "Something went wrong"); } });
  const patch = (id: string, p: Partial<AdminProperty>) => setItems((list) => list.map((x) => (x.id === id ? { ...x, ...p } : x)));

  return (
    <div className={pending ? "opacity-70 pointer-events-none" : ""}>
      <AdminWorkspace
        title="Properties"
        subtitle="Listings for sale, rent, PG and new projects shown on /properties."
        titleIcon={<Building2 className="w-4 h-4 text-lime-600 shrink-0" />}
        tabs={[
          { id: "all", label: "All", icon: Building2 },
          { id: "sale", label: "Sale", icon: Home },
          { id: "rent", label: "Rent", icon: KeyRound },
          { id: "pg", label: "PG", icon: BedDouble },
          { id: "project", label: "Projects", icon: HardHat },
        ]}
        tab={filter}
        onTabChange={setFilter}
        toolbar={
          <button type="button" onClick={() => setEditing("new")} className="inline-flex items-center gap-1 rounded-md bg-lime-500 text-white text-xs font-semibold px-2.5 py-1.5 hover:bg-lime-600">
            <Plus className="w-3.5 h-3.5" /> Add property
          </button>
        }
      >
        {editing ? (
          <PropertyForm
            property={editing === "new" ? null : editing}
            maxFileMb={maxFileMb}
            onCancel={() => setEditing(null)}
            onSave={(data) =>
              new Promise<string | null>((resolve) =>
                start(async () => {
                  try {
                    const res = await saveProperty(data);
                    if (res.ok) setEditing(null);
                    resolve(res.ok ? null : res.error);
                  } catch (e) {
                    resolve(e instanceof Error ? e.message : "Save failed");
                  }
                }),
              )
            }
          />
        ) : (
          <>
            <div className="px-4 pt-3">
              <label className="relative block max-w-sm">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search title, locality, city…" className={`${input} pl-9`} />
              </label>
            </div>
            <ul className="divide-y divide-slate-100 dark:divide-slate-800">
              {visible.map((p) => {
                const closed = p.purpose === "rent" || p.purpose === "pg" ? "rented" : "sold";
                return (
                  <li key={p.id} className="flex flex-wrap sm:flex-nowrap items-center gap-3 px-4 py-3">
                    <button type="button" className="flex flex-1 items-center gap-3 text-left min-w-0" onClick={() => setEditing(p)}>
                      <span className="w-16 h-12 shrink-0 rounded-md overflow-hidden bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                        {p.coverImage ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={p.coverImage} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <Building2 className="w-5 h-5 text-slate-300" />
                        )}
                      </span>
                      <span className="min-w-0">
                        <span className="flex items-center gap-2 min-w-0">
                          {p.featured && <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400 shrink-0" />}
                          <span className="font-semibold text-slate-900 dark:text-white truncate">{p.title}</span>
                          {!p.published && <Badge tone="amber">Draft</Badge>}
                        </span>
                        <span className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500 mt-0.5">
                          <Badge tone="slate">{purposeLabel(p.purpose)}</Badge>
                          <span className="font-semibold text-slate-700 dark:text-slate-200">{priceLabel(p)}</span>
                          {(p.locality || p.city) && <span className="truncate">{[p.locality, p.city].filter(Boolean).join(", ")}</span>}
                          <Badge tone={STATUS_TONE[p.status]}>{STATUSES.find((s) => s.id === p.status)?.label}</Badge>
                        </span>
                      </span>
                    </button>
                    <span className="flex items-center gap-0.5 ml-auto">
                      <IconBtn title={p.published ? "Unpublish" : "Publish"} onClick={() => { patch(p.id, { published: !p.published }); run(() => setPropertyFlag(p.id, "published", !p.published)); }}>
                        {p.published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </IconBtn>
                      <IconBtn title={p.featured ? "Unfeature" : "Feature"} onClick={() => { patch(p.id, { featured: !p.featured }); run(() => setPropertyFlag(p.id, "featured", !p.featured)); }}>
                        <Star className={`w-4 h-4 ${p.featured ? "text-amber-500 fill-amber-400" : ""}`} />
                      </IconBtn>
                      <IconBtn
                        title={p.status === closed ? "Mark available" : `Mark ${closed}`}
                        onClick={() => { const s = p.status === closed ? "available" : closed; patch(p.id, { status: s }); run(() => setPropertyStatus(p.id, s)); }}
                      >
                        <CheckCircle2 className={`w-4 h-4 ${p.status === closed ? "text-lime-600" : ""}`} />
                      </IconBtn>
                      <IconBtn title="Duplicate" onClick={() => run(async () => { const r = await duplicateProperty(p.id); if (!r.ok) alert(r.error); })}>
                        <Copy className="w-4 h-4" />
                      </IconBtn>
                      <IconBtn title="Delete" danger onClick={() => { if (confirm(`Delete "${p.title}"? This cannot be undone.`)) run(() => deleteProperty(p.id)); }}>
                        <Trash2 className="w-4 h-4" />
                      </IconBtn>
                    </span>
                  </li>
                );
              })}
              {visible.length === 0 && (
                <li>
                  {filter === "all" && !needle ? (
                    <EmptyState icon={<Building2 />} title="No properties yet" hint="Add a flat, villa, PG or project — it appears on your /properties page." action={<button type="button" onClick={() => setEditing("new")} className={btnPrimary}><Plus className="w-4 h-4" /> Add first property</button>} />
                  ) : (
                    <p className="text-center text-xs text-slate-400 py-10">No matching properties.</p>
                  )}
                </li>
              )}
            </ul>
          </>
        )}
      </AdminWorkspace>
    </div>
  );
}

function IconBtn({ title, onClick, danger, children }: { title: string; onClick: () => void; danger?: boolean; children: React.ReactNode }) {
  return (
    <button type="button" title={title} aria-label={title} onClick={onClick} className={`p-2 rounded-md text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 ${danger ? "hover:text-red-500" : "hover:text-slate-700 dark:hover:text-slate-200"}`}>
      {children}
    </button>
  );
}

function PropertyForm({ property, maxFileMb, onCancel, onSave }: { property: AdminProperty | null; maxFileMb: number; onCancel: () => void; onSave: (d: PropertyInput) => Promise<string | null> }) {
  const [f, setF] = useState<Form>(() => (property ? { ...blank(), ...property } : blank()));
  const [error, setError] = useState("");
  const set = <K extends keyof Form>(k: K, v: Form[K]) => setF((x) => ({ ...x, [k]: v }));
  const txt = (k: Exclude<StrKey, "id" | undefined>, placeholder?: string, type = "text") => (
    <input type={type} value={f[k] as string} onChange={(e) => set(k, e.target.value)} placeholder={placeholder} className={input} />
  );
  const num = (k: "price" | "deposit" | "maintenance" | "areaSqft" | "bathrooms", placeholder?: string) => (
    <input type="number" min={0} inputMode="numeric" value={f[k] || ""} onChange={(e) => set(k, Math.max(0, Math.floor(Number(e.target.value) || 0)))} placeholder={placeholder} className={input} />
  );
  const rentish = f.purpose === "rent" || f.purpose === "pg";

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        setError("");
        const err = await onSave({ ...f, id: property?.id });
        if (err) setError(err);
      }}
      className="p-4 space-y-8 max-w-3xl"
    >
      <section className="space-y-3">
        <h3 className={h3}>1. Basics</h3>
        <input required value={f.title} onChange={(e) => set("title", e.target.value)} placeholder="Title e.g. 3 BHK sea-facing flat in Bandra" className={input} />
        {txt("slug", "URL slug (optional)")}
        <div className="grid sm:grid-cols-3 gap-3">
          <Field l="Purpose">
            <select value={f.purpose} onChange={(e) => set("purpose", e.target.value as Form["purpose"])} className={input}>
              {PURPOSES.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
            </select>
          </Field>
          <Field l="Property type">
            <select value={f.propertyType} onChange={(e) => set("propertyType", e.target.value as Form["propertyType"])} className={input}>
              {PROPERTY_TYPES.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
            </select>
          </Field>
          <Field l="Status">
            <select value={f.status} onChange={(e) => set("status", e.target.value as Form["status"])} className={input}>
              {STATUSES.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
            </select>
          </Field>
        </div>
        <div className="flex flex-wrap gap-4 text-sm text-slate-600 dark:text-slate-300">
          <label className="flex items-center gap-2"><input type="checkbox" checked={f.featured} onChange={(e) => set("featured", e.target.checked)} /> Featured</label>
          <label className="flex items-center gap-2"><input type="checkbox" checked={f.published} onChange={(e) => set("published", e.target.checked)} /> Published on the website</label>
        </div>
        {txt("summary", "One-line summary for cards")}
        <textarea rows={5} value={f.description} onChange={(e) => set("description", e.target.value)} placeholder="Full description" className={input} />
        <span className={label}>Highlights</span>
        <ListEditor items={f.highlights} onChange={(v) => set("highlights", v)} placeholder="e.g. 5 min walk to metro" />
      </section>

      <section className="space-y-3">
        <h3 className={h3}>2. Price</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          <Field l={`Price (₹) · ${formatPrice(f.price)}`}>{num("price", "0 = price on request")}</Field>
          <Field l="Price note">{txt("priceNote", rentish ? "/month, /bed…" : "onwards, negotiable…")}</Field>
          {rentish && (
            <>
              <Field l={`Deposit (₹)${f.deposit ? ` · ${formatPrice(f.deposit)}` : ""}`}>{num("deposit")}</Field>
              <Field l={`Maintenance / month (₹)${f.maintenance ? ` · ${formatPrice(f.maintenance)}` : ""}`}>{num("maintenance")}</Field>
            </>
          )}
        </div>
      </section>

      <section className="space-y-3">
        <h3 className={h3}>3. Details</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <Field l="BHK / config">{txt("bhk", "2 BHK, 1 RK…")}</Field>
          <Field l="Area (sq ft)">{num("areaSqft")}</Field>
          <Field l="Furnishing">
            <select value={f.furnishing} onChange={(e) => set("furnishing", e.target.value)} className={input}>
              <option value="">—</option>
              {FURNISHING.map((x) => <option key={x} value={x}>{x}</option>)}
            </select>
          </Field>
          <Field l="Bathrooms">{num("bathrooms")}</Field>
          <Field l="Floor">{txt("floor", "5 of 12")}</Field>
          <Field l="Facing">{txt("facing", "East")}</Field>
          <Field l="Parking">{txt("parking", "1 covered")}</Field>
          <Field l="Available from">{txt("availableFrom", "Immediate or date")}</Field>
        </div>
        {f.purpose === "pg" && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <Field l="Sharing">{txt("sharing", "single, double, triple")}</Field>
            <Field l="For">
              <select value={f.gender} onChange={(e) => set("gender", e.target.value)} className={input}>
                <option value="">—</option>
                <option value="boys">Boys</option>
                <option value="girls">Girls</option>
                <option value="co-living">Co-living</option>
              </select>
            </Field>
            <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 sm:mt-5">
              <input type="checkbox" checked={f.foodIncluded} onChange={(e) => set("foodIncluded", e.target.checked)} /> Food included
            </label>
          </div>
        )}
        {(f.purpose === "project" || f.purpose === "sale") && (
          <div className="grid sm:grid-cols-2 gap-3">
            <Field l="Possession">{txt("possession", "Dec 2027 / Ready to move")}</Field>
            <Field l="RERA no.">{txt("rera")}</Field>
          </div>
        )}
      </section>

      <section className="space-y-3">
        <h3 className={h3}>4. Location</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          {txt("locality", "Locality e.g. Andheri West")}
          {txt("city", "City")}
        </div>
        <textarea rows={2} value={f.address} onChange={(e) => set("address", e.target.value)} placeholder="Full address" className={input} />
        {txt("mapUrl", "Google Maps link (optional)", "url")}
      </section>

      <section className="space-y-3">
        <h3 className={h3}>5. Amenities</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {AMENITIES.map((a) => (
            <label key={a.id} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
              <input
                type="checkbox"
                checked={f.amenities.includes(a.id)}
                onChange={(e) => set("amenities", e.target.checked ? [...f.amenities, a.id] : f.amenities.filter((x) => x !== a.id))}
              />
              {a.label}
            </label>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h3 className={h3}>6. Photos, plans & media</h3>
        <ImageInput label="Cover image" value={f.coverImage} onChange={(u) => set("coverImage", u)} />
        <span className={label}>Gallery</span>
        <div className="space-y-3">
          {f.gallery.map((u, i) => (
            <div key={i} className="flex items-start gap-2">
              <div className="flex-1"><ImageInput value={u} onChange={(v) => set("gallery", f.gallery.map((x, j) => (j === i ? v : x)))} /></div>
              <button type="button" className="mt-2 text-red-500" onClick={() => set("gallery", f.gallery.filter((_, j) => j !== i))} aria-label="Remove photo"><Trash2 className="w-4 h-4" /></button>
            </div>
          ))}
          <button type="button" onClick={() => set("gallery", [...f.gallery, ""])} className="text-sm font-medium text-lime-700">+ Add photo</button>
        </div>
        <span className={label}>Floor plans</span>
        <div className="space-y-3">
          {f.floorPlans.map((fp, i) => {
            const up = (p: Partial<FloorPlan>) => set("floorPlans", f.floorPlans.map((x, j) => (j === i ? { ...x, ...p } : x)));
            return (
              <div key={i} className="rounded-xl border border-slate-200 dark:border-slate-700 p-3 space-y-2">
                <div className="flex gap-2">
                  <input value={fp.label} onChange={(e) => up({ label: e.target.value })} placeholder="Label e.g. 2 BHK Type A" className={input} />
                  <input value={fp.area ?? ""} onChange={(e) => up({ area: e.target.value })} placeholder="Area e.g. 1,150 sq ft" className={`${input} max-w-[45%]`} />
                  <button type="button" className="text-red-500 shrink-0" onClick={() => set("floorPlans", f.floorPlans.filter((_, j) => j !== i))} aria-label="Remove plan"><Trash2 className="w-4 h-4" /></button>
                </div>
                <ImageInput value={fp.image} onChange={(image) => up({ image })} aspect="aspect-square" />
              </div>
            );
          })}
          <button type="button" onClick={() => set("floorPlans", [...f.floorPlans, { label: "", image: "", area: "" }])} className="text-sm font-medium text-lime-700">+ Add floor plan</button>
        </div>
        <Field l="Brochure (PDF)"><FileField value={f.brochureUrl} onChange={(v) => set("brochureUrl", v)} maxFileMb={maxFileMb} /></Field>
        <Field l="Video link">{txt("videoUrl", "YouTube / video URL", "url")}</Field>
      </section>

      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="flex gap-2 sticky bottom-0 bg-white/90 dark:bg-slate-900/90 py-2">
        <button type="submit" className="rounded-md bg-lime-500 text-white text-sm font-semibold px-3 py-2">Save property</button>
        <button type="button" onClick={onCancel} className="rounded-md border border-slate-200 dark:border-slate-600 text-sm px-3 py-2">Cancel</button>
      </div>
    </form>
  );
}

function Field({ l, children }: { l: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1">
      <span className={label}>{l}</span>
      {children}
    </label>
  );
}

function ListEditor({ items, onChange, placeholder }: { items: string[]; onChange: (v: string[]) => void; placeholder: string }) {
  return (
    <div className="space-y-2">
      {items.map((t, i) => (
        <div key={i} className="flex gap-2">
          <input value={t} onChange={(e) => onChange(items.map((x, j) => (j === i ? e.target.value : x)))} placeholder={placeholder} className={input} />
          <button type="button" className="text-red-500" onClick={() => onChange(items.filter((_, j) => j !== i))} aria-label="Remove"><X className="w-4 h-4" /></button>
        </div>
      ))}
      <button type="button" onClick={() => onChange([...items, ""])} className="text-sm font-medium text-lime-700">+ Add highlight</button>
    </div>
  );
}

/** Same /api/upload-file endpoint the events documents use; also accepts a pasted link. */
function FileField({ value, onChange, maxFileMb }: { value: string; onChange: (v: string) => void; maxFileMb: number }) {
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function add(file?: File) {
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload-file", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      onChange(data.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  }
  return (
    <span className="block space-y-1">
      <span className="flex flex-wrap gap-2">
        <input value={value} onChange={(e) => onChange(e.target.value)} placeholder="Upload a PDF or paste a link" className={`${input} flex-1 min-w-0`} />
        <button type="button" onClick={() => ref.current?.click()} disabled={busy} className="inline-flex items-center gap-2 rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm">
          {busy ? <BrandSpinner className="w-4 h-4" /> : <Paperclip className="w-4 h-4" />}
          {busy ? "Uploading…" : "Upload"}
        </button>
        <input ref={ref} type="file" className="hidden" accept=".pdf,application/pdf" onChange={(e) => { add(e.target.files?.[0]); e.target.value = ""; }} />
      </span>
      <span className="block text-xs text-slate-400">PDF · max {maxFileMb} MB</span>
      {error && <span className="block text-xs text-red-600">{error}</span>}
    </span>
  );
}
