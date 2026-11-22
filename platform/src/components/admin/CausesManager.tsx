"use client";

import { useState, useTransition } from "react";
import { Plus, Trash2, HandHeart, Star, Copy, Eye, EyeOff, CheckCircle2, Search, Flame, PauseCircle, Target } from "lucide-react";
import { saveCause, deleteCause, duplicateCause, setCauseFlag, setCauseStatus, type CauseInput } from "@/lib/actions/causes";
import { CAUSE_STATUSES, compactINR, daysLeft, progressPct, type CauseStatus, type CauseUpdate, type ImpactTier, type PublicCause } from "@/lib/cause";
import { ImageInput } from "./ImageInput";
import { AdminWorkspace } from "./AdminWorkspace";
import { Badge, EmptyState, btnPrimary } from "./ui";

export type AdminCause = PublicCause & {
  published: boolean;
  offlineRaised: number;
  offlineDonors: number;
  /** paid donations made on the website, INR */
  online: { amount: number; donors: number };
};
type Form = Required<Omit<CauseInput, "id" | "status" | "impactTiers" | "updates">> & {
  id?: string;
  status: CauseStatus;
  impactTiers: ImpactTier[];
  updates: CauseUpdate[];
};

const input = "w-full rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-800 px-3 py-2 text-sm outline-none focus:border-lime-500";
const label = "text-xs font-semibold text-slate-500 uppercase tracking-wide";
const h3 = "text-sm font-bold text-slate-900 dark:text-white";

const STATUS_TONE = { active: "green", completed: "blue", paused: "amber" } as const;

function blank(): Form {
  return {
    title: "", slug: "", category: "", summary: "", story: "", coverImage: "", gallery: [], goalAmount: 0, offlineRaised: 0, offlineDonors: 0,
    deadline: "", urgent: false, beneficiaries: "", location: "", impactTiers: [], updates: [], status: "active", featured: false, published: true,
  };
}

const toInt = (v: string) => Math.max(0, Math.min(2_000_000_000, Math.floor(Number(v) || 0)));

export function CausesManager({ causes: initial }: { causes: AdminCause[] }) {
  const [pending, start] = useTransition();
  const [items, setItems] = useState(initial);
  const [editing, setEditing] = useState<AdminCause | null | "new">(null);
  const [filter, setFilter] = useState("all");
  const [q, setQ] = useState("");
  // Re-sync when the server sends fresh data (adjust state during render, not in an effect).
  const [prevInitial, setPrevInitial] = useState(initial);
  if (prevInitial !== initial) {
    setPrevInitial(initial);
    setItems(initial);
  }

  const categories = [...new Set(items.map((c) => c.category).filter(Boolean))];
  const needle = q.trim().toLowerCase();
  const visible = items.filter(
    (c) => (filter === "all" || c.status === filter) && (!needle || `${c.title} ${c.category} ${c.location}`.toLowerCase().includes(needle)),
  );
  const run = (fn: () => Promise<unknown>) => start(async () => { try { await fn(); } catch (e) { alert(e instanceof Error ? e.message : "Something went wrong"); } });
  const patch = (id: string, p: Partial<AdminCause>) => setItems((list) => list.map((x) => (x.id === id ? { ...x, ...p } : x)));

  return (
    <div className={pending ? "opacity-70 pointer-events-none" : ""}>
      <AdminWorkspace
        title="Causes"
        subtitle="Fundraising campaigns shown on /causes. Online donations add to the raised total automatically."
        titleIcon={<HandHeart className="w-4 h-4 text-lime-600 shrink-0" />}
        tabs={[
          { id: "all", label: "All", icon: HandHeart },
          { id: "active", label: "Active", icon: Flame },
          { id: "completed", label: "Goal reached", icon: Target },
          { id: "paused", label: "Paused", icon: PauseCircle },
        ]}
        tab={filter}
        onTabChange={setFilter}
        toolbar={
          <button type="button" onClick={() => setEditing("new")} className="inline-flex items-center gap-1 rounded-md bg-lime-500 text-white text-xs font-semibold px-2.5 py-1.5 hover:bg-lime-600">
            <Plus className="w-3.5 h-3.5" /> Add cause
          </button>
        }
      >
        {editing ? (
          <CauseForm
            cause={editing === "new" ? null : editing}
            categories={categories}
            onCancel={() => setEditing(null)}
            onSave={(data) =>
              new Promise<string | null>((resolve) =>
                start(async () => {
                  try {
                    const res = await saveCause(data);
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
                <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search title, category, location…" className={`${input} pl-9`} />
              </label>
            </div>
            <ul className="divide-y divide-slate-100 dark:divide-slate-800">
              {visible.map((c) => {
                const pct = progressPct(c);
                const days = daysLeft(c.deadline);
                const done = c.status === "completed";
                return (
                  <li key={c.id} className="flex flex-wrap sm:flex-nowrap items-center gap-3 px-4 py-3">
                    <button type="button" className="flex flex-1 items-center gap-3 text-left min-w-0" onClick={() => setEditing(c)}>
                      <span className="w-16 h-12 shrink-0 rounded-md overflow-hidden bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                        {c.coverImage ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={c.coverImage} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <HandHeart className="w-5 h-5 text-slate-300" />
                        )}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center gap-2 min-w-0">
                          {c.featured && <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400 shrink-0" />}
                          {c.urgent && <Flame className="w-3.5 h-3.5 text-red-500 shrink-0" aria-label="Urgent" />}
                          <span className="font-semibold text-slate-900 dark:text-white truncate">{c.title}</span>
                          {!c.published && <Badge tone="amber">Draft</Badge>}
                        </span>
                        <span className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500 mt-0.5">
                          {c.category && <Badge tone="slate">{c.category}</Badge>}
                          <Badge tone={STATUS_TONE[c.status]}>{CAUSE_STATUSES.find((s) => s.id === c.status)?.label}</Badge>
                          <span>{days === null ? "Ongoing" : days === 0 ? "Ended" : `${days} day${days === 1 ? "" : "s"} left`}</span>
                        </span>
                        <span className="flex items-center gap-2 mt-1.5 max-w-md">
                          <span className="h-1.5 flex-1 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                            <span className="block h-full bg-lime-500" style={{ width: `${pct}%` }} />
                          </span>
                          <span className="text-xs text-slate-600 dark:text-slate-300 whitespace-nowrap">
                            <b>{compactINR(c.raised)}</b>{c.goalAmount ? ` of ${compactINR(c.goalAmount)} · ${pct}%` : " raised"}
                          </span>
                        </span>
                      </span>
                    </button>
                    <span className="flex items-center gap-0.5 ml-auto">
                      <IconBtn title={c.published ? "Unpublish" : "Publish"} onClick={() => { patch(c.id, { published: !c.published }); run(() => setCauseFlag(c.id, "published", !c.published)); }}>
                        {c.published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </IconBtn>
                      <IconBtn title={c.featured ? "Unfeature" : "Feature"} onClick={() => { patch(c.id, { featured: !c.featured }); run(() => setCauseFlag(c.id, "featured", !c.featured)); }}>
                        <Star className={`w-4 h-4 ${c.featured ? "text-amber-500 fill-amber-400" : ""}`} />
                      </IconBtn>
                      <IconBtn title={c.urgent ? "Unmark urgent" : "Mark urgent"} onClick={() => { patch(c.id, { urgent: !c.urgent }); run(() => setCauseFlag(c.id, "urgent", !c.urgent)); }}>
                        <Flame className={`w-4 h-4 ${c.urgent ? "text-red-500" : ""}`} />
                      </IconBtn>
                      <IconBtn
                        title={done ? "Reopen (active)" : "Mark goal reached"}
                        onClick={() => { const s: CauseStatus = done ? "active" : "completed"; patch(c.id, { status: s }); run(() => setCauseStatus(c.id, s)); }}
                      >
                        <CheckCircle2 className={`w-4 h-4 ${done ? "text-lime-600" : ""}`} />
                      </IconBtn>
                      <IconBtn title="Duplicate" onClick={() => run(async () => { const r = await duplicateCause(c.id); if (!r.ok) alert(r.error); })}>
                        <Copy className="w-4 h-4" />
                      </IconBtn>
                      <IconBtn title="Delete" danger onClick={() => { if (confirm(`Delete "${c.title}"? This cannot be undone.`)) run(() => deleteCause(c.id)); }}>
                        <Trash2 className="w-4 h-4" />
                      </IconBtn>
                    </span>
                  </li>
                );
              })}
              {visible.length === 0 && (
                <li>
                  {filter === "all" && !needle ? (
                    <EmptyState icon={<HandHeart />} title="No causes yet" hint="Add a fundraising campaign — it appears on your /causes page with a donate button and progress bar." action={<button type="button" onClick={() => setEditing("new")} className={btnPrimary}><Plus className="w-4 h-4" /> Add first cause</button>} />
                  ) : (
                    <p className="text-center text-xs text-slate-400 py-10">No matching causes.</p>
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

function CauseForm({ cause, categories, onCancel, onSave }: { cause: AdminCause | null; categories: string[]; onCancel: () => void; onSave: (d: CauseInput) => Promise<string | null> }) {
  const [f, setF] = useState<Form>(() => {
    if (!cause) return blank();
    const { id, slug, title, category, summary, story, coverImage, gallery, goalAmount, offlineRaised, offlineDonors, deadline, urgent, beneficiaries, location, impactTiers, updates, status, featured, published } = cause;
    return { id, slug, title, category, summary, story, coverImage, gallery, goalAmount, offlineRaised, offlineDonors, deadline, urgent, beneficiaries, location, impactTiers, updates, status, featured, published };
  });
  const [error, setError] = useState("");
  const set = <K extends keyof Form>(k: K, v: Form[K]) => setF((x) => ({ ...x, [k]: v }));
  const online = cause?.online ?? { amount: 0, donors: 0 };
  const total = f.offlineRaised + online.amount;
  const upTier = (i: number, p: Partial<ImpactTier>) => set("impactTiers", f.impactTiers.map((x, j) => (j === i ? { ...x, ...p } : x)));
  const upUpdate = (i: number, p: Partial<CauseUpdate>) => set("updates", f.updates.map((x, j) => (j === i ? { ...x, ...p } : x)));

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        setError("");
        const err = await onSave({ ...f, id: cause?.id });
        if (err) setError(err);
      }}
      className="p-4 space-y-8 max-w-3xl"
    >
      <section className="space-y-3">
        <h3 className={h3}>1. Basics</h3>
        <input required value={f.title} onChange={(e) => set("title", e.target.value)} placeholder="Title e.g. Mid-day meals for 500 children" className={input} />
        <input value={f.slug} onChange={(e) => set("slug", e.target.value)} placeholder="URL slug (optional)" className={input} />
        <div className="grid sm:grid-cols-2 gap-3">
          <Field l="Category">
            <input list="cause-categories" value={f.category} onChange={(e) => set("category", e.target.value)} placeholder="Education, Health, Relief…" className={input} />
            <datalist id="cause-categories">
              {[...new Set([...categories, "Education", "Health", "Hunger", "Disaster relief", "Women empowerment", "Environment", "Animal welfare"])].map((c) => <option key={c} value={c} />)}
            </datalist>
          </Field>
          <Field l="Status">
            <select value={f.status} onChange={(e) => set("status", e.target.value as CauseStatus)} className={input}>
              {CAUSE_STATUSES.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
            </select>
          </Field>
        </div>
        <div className="flex flex-wrap gap-4 text-sm text-slate-600 dark:text-slate-300">
          <label className="flex items-center gap-2"><input type="checkbox" checked={f.featured} onChange={(e) => set("featured", e.target.checked)} /> Featured</label>
          <label className="flex items-center gap-2"><input type="checkbox" checked={f.urgent} onChange={(e) => set("urgent", e.target.checked)} /> Urgent</label>
          <label className="flex items-center gap-2"><input type="checkbox" checked={f.published} onChange={(e) => set("published", e.target.checked)} /> Published on the website</label>
        </div>
        <input value={f.summary} onChange={(e) => set("summary", e.target.value)} placeholder="One-line summary for cards" maxLength={240} className={input} />
        <textarea rows={8} value={f.story} onChange={(e) => set("story", e.target.value)} placeholder="The story — why this matters, who it helps, how the money is used. Separate paragraphs with a blank line." className={input} />
      </section>

      <section className="space-y-3">
        <h3 className={h3}>2. Goal & progress</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          <Field l={`Goal (₹)${f.goalAmount ? ` · ${compactINR(f.goalAmount)}` : ""}`}>
            <input type="number" min={0} inputMode="numeric" value={f.goalAmount || ""} onChange={(e) => set("goalAmount", toInt(e.target.value))} placeholder="0 = open-ended" className={input} />
          </Field>
          <Field l="Deadline">
            <input type="date" value={f.deadline} onChange={(e) => set("deadline", e.target.value)} className={input} />
          </Field>
          <Field l={`Raised offline (₹)${f.offlineRaised ? ` · ${compactINR(f.offlineRaised)}` : ""}`}>
            <input type="number" min={0} inputMode="numeric" value={f.offlineRaised || ""} onChange={(e) => set("offlineRaised", toInt(e.target.value))} placeholder="Cheques, cash, events…" className={input} />
          </Field>
          <Field l="Offline donors">
            <input type="number" min={0} inputMode="numeric" value={f.offlineDonors || ""} onChange={(e) => set("offlineDonors", toInt(e.target.value))} className={input} />
          </Field>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Raised online on your website: <b>₹{online.amount.toLocaleString("en-IN")}</b> from {online.donors} donor{online.donors === 1 ? "" : "s"}.
          {" "}Total shown publicly: <b>{compactINR(total)}</b>{f.goalAmount ? ` of ${compactINR(f.goalAmount)} (${progressPct({ raised: total, goalAmount: f.goalAmount })}%)` : ""}.
        </p>
        {!f.deadline && <p className="text-xs text-slate-400">No deadline — shown as “Ongoing”.</p>}
      </section>

      <section className="space-y-3">
        <h3 className={h3}>3. Impact tiers</h3>
        <p className="text-xs text-slate-500">Suggested amounts with what they achieve — shown as quick-pick donate buttons.</p>
        {f.impactTiers.map((t, i) => (
          <div key={i} className="flex gap-2 items-center">
            <span className="text-sm text-slate-500">₹</span>
            <input type="number" min={0} inputMode="numeric" value={t.amount || ""} onChange={(e) => upTier(i, { amount: toInt(e.target.value) })} placeholder="500" className={`${input} max-w-[8rem]`} />
            <input value={t.label} onChange={(e) => upTier(i, { label: e.target.value })} placeholder="feeds 20 children for a day" className={input} />
            <button type="button" className="text-red-500 shrink-0" onClick={() => set("impactTiers", f.impactTiers.filter((_, j) => j !== i))} aria-label="Remove tier"><Trash2 className="w-4 h-4" /></button>
          </div>
        ))}
        {f.impactTiers.length < 12 && (
          <button type="button" onClick={() => set("impactTiers", [...f.impactTiers, { amount: 0, label: "" }])} className="text-sm font-medium text-lime-700">+ Add tier</button>
        )}
      </section>

      <section className="space-y-3">
        <h3 className={h3}>4. Updates</h3>
        <p className="text-xs text-slate-500">Progress reports for donors. Newest first.</p>
        <button
          type="button"
          onClick={() => set("updates", [{ date: new Date().toISOString().slice(0, 10), title: "", text: "" }, ...f.updates])}
          className="text-sm font-medium text-lime-700"
        >
          + Add update
        </button>
        {f.updates.map((u, i) => (
          <div key={i} className="rounded-xl border border-slate-200 dark:border-slate-700 p-3 space-y-2">
            <div className="flex gap-2">
              <input type="date" value={u.date} onChange={(e) => upUpdate(i, { date: e.target.value })} className={`${input} max-w-[11rem]`} />
              <input value={u.title} onChange={(e) => upUpdate(i, { title: e.target.value })} placeholder="Title e.g. 200 kits delivered" className={input} />
              <button type="button" className="text-red-500 shrink-0" onClick={() => set("updates", f.updates.filter((_, j) => j !== i))} aria-label="Remove update"><Trash2 className="w-4 h-4" /></button>
            </div>
            <textarea rows={3} value={u.text} onChange={(e) => upUpdate(i, { text: e.target.value })} placeholder="What happened" className={input} />
          </div>
        ))}
      </section>

      <section className="space-y-3">
        <h3 className={h3}>5. Details</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          <Field l="Beneficiaries"><input value={f.beneficiaries} onChange={(e) => set("beneficiaries", e.target.value)} placeholder="1,200 children in 14 villages" className={input} /></Field>
          <Field l="Location"><input value={f.location} onChange={(e) => set("location", e.target.value)} placeholder="Barmer, Rajasthan" className={input} /></Field>
        </div>
      </section>

      <section className="space-y-3">
        <h3 className={h3}>6. Photos</h3>
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
      </section>

      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="flex gap-2 sticky bottom-0 bg-white/90 dark:bg-slate-900/90 py-2">
        <button type="submit" className="rounded-md bg-lime-500 text-white text-sm font-semibold px-3 py-2">Save cause</button>
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
