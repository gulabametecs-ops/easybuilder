"use client";

import { useMemo, useRef, useState, useTransition } from "react";
import {
  Plus, Trash2, Pencil, X, Copy, Check, ExternalLink, Rocket, Play, Pause, CheckCheck,
  Target, Sparkles, MapPin, Users, Search, ChevronDown, ChevronUp, CopyPlus, CalendarDays, Wand2, IndianRupee,
} from "lucide-react";
import { createCampaign, updateCampaign, updateCampaignMetrics, setCampaignStatus, deleteCampaign } from "@/lib/actions/marketing";
import { suggestHeadlines, suggestAdTexts, suggestInterests } from "@/lib/adSuggest";
import { adTemplates, type AdTemplate } from "@/lib/adTemplates";
import { istToday, type UpcomingOccasion } from "@/lib/marketingIdeas";
import { ImageInput } from "./ImageInput";
import { Card } from "./ui";

export type Campaign = {
  id: string; name: string; platform: string; objective: string; service: string; adImage: string;
  headline: string; adText: string; targetUrl: string; budget: number; startDate: string; endDate: string;
  gender: string; ageMin: number; ageMax: number; interests: string; locations: string; radiusKm: number;
  status: string; spend: number; clicks: number; leads: number;
};

const inputCls = "w-full rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-3 py-2 text-sm outline-none focus:border-lime-500 placeholder:text-slate-400";
const lbl = "block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5";

const PLATFORMS: Record<string, { label: string; launch: string; medium: string; cls: string; dot: string }> = {
  google: { label: "Google Ads", launch: "https://ads.google.com/aw/campaigns/new", medium: "cpc", cls: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300", dot: "bg-blue-500" },
  meta: { label: "Facebook", launch: "https://www.facebook.com/adsmanager/manage/campaigns", medium: "paid_social", cls: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300", dot: "bg-indigo-500" },
  instagram: { label: "Instagram", launch: "https://www.facebook.com/adsmanager/manage/campaigns", medium: "paid_social", cls: "bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300", dot: "bg-pink-500" },
  whatsapp: { label: "WhatsApp", launch: "https://business.whatsapp.com/", medium: "whatsapp", cls: "bg-green-100 text-green-700 dark:bg-emerald-900/40 dark:text-emerald-300", dot: "bg-green-500" },
  local: { label: "Local", launch: "", medium: "local", cls: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300", dot: "bg-amber-500" },
};
const OBJECTIVES = ["leads", "traffic", "awareness", "sales", "calls"];
const AGE_PRESETS: { label: string; min: number; max: number }[] = [
  { label: "All", min: 18, max: 65 }, { label: "18–24", min: 18, max: 24 }, { label: "25–34", min: 25, max: 34 }, { label: "35–44", min: 35, max: 44 }, { label: "45–60", min: 45, max: 60 }, { label: "60+", min: 60, max: 65 },
];
const RADII = [0, 5, 10, 25, 50];
const STATUS_CLS: Record<string, string> = {
  draft: "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-200",
  active: "bg-green-100 text-green-700 dark:bg-emerald-900/50 dark:text-emerald-300",
  paused: "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300",
  completed: "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300",
};

const slug = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "") || "campaign";
const inr = (v: number) => "₹" + v.toLocaleString("en-IN");
const jparse = (s: string): string[] => { try { const v = JSON.parse(s || "[]"); return Array.isArray(v) ? v : []; } catch { return []; } };
const fmtDate = (ymd: string) => (ymd ? new Date(`${ymd}T00:00:00Z`).toLocaleDateString("en-IN", { day: "numeric", month: "short", timeZone: "UTC" }) : "");

type Draft = { c: Partial<Campaign>; label: string; n: number };
const fromTemplate = (t: AdTemplate, n: number): Draft => ({ c: { ...t.draft, interests: JSON.stringify(t.draft.interests) }, label: `${t.emoji} ${t.title}`, n });

const GROUP_LABEL: Record<AdTemplate["group"], { label: string; cls: string }> = {
  sector: { label: "For your business", cls: "bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300" },
  festival: { label: "Festival", cls: "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300" },
  goal: { label: "Popular", cls: "bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300" },
};

export function CampaignsTab({ campaigns, siteUrl, services, bizName, vertical, occasions = [], startTemplate }: {
  campaigns: Campaign[]; siteUrl: string; services: string[]; bizName: string; vertical: string;
  occasions?: UpcomingOccasion[];
  /** Template id to open pre-filled (e.g. from a festival card on Start here). */
  startTemplate?: string;
}) {
  const [pending, start] = useTransition();
  const templates = useMemo(() => adTemplates({ vertical, bizName, services, occasions, today: istToday() }), [vertical, bizName, services, occasions]);
  const [draft, setDraft] = useState<Draft | null>(() => {
    const t = startTemplate ? templates.find((x) => x.id === startTemplate) : undefined;
    return t ? fromTemplate(t, 1) : null;
  });
  const [adding, setAdding] = useState(draft !== null);
  const formTop = useRef<HTMLDivElement>(null);
  const openDraft = (d: Draft | null) => {
    setDraft(d);
    setAdding(true);
    setMsg(null);
    requestAnimationFrame(() => formTop.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
  };
  const applyTemplate = (t: AdTemplate) => openDraft(fromTemplate(t, (draft?.n ?? 0) + 1));
  const duplicate = (c: Campaign) => {
    const { id: _id, spend: _s, clicks: _c, leads: _l, status: _st, ...rest } = c;
    openDraft({ c: { ...rest, name: `${c.name} (copy)` }, label: `Copy of “${c.name}”`, n: (draft?.n ?? 0) + 1 });
  };
  const [editing, setEditing] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [platformFilter, setPlatformFilter] = useState("all");
  const [msg, setMsg] = useState<{ ok: boolean; message: string } | null>(null);

  const totalSpend = campaigns.reduce((s, c) => s + c.spend, 0);
  const totalLeads = campaigns.reduce((s, c) => s + c.leads, 0);
  const active = campaigns.filter((c) => c.status === "active").length;

  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase();
    return campaigns.filter((c) => {
      if (statusFilter !== "all" && c.status !== statusFilter) return false;
      if (platformFilter !== "all" && c.platform !== platformFilter) return false;
      if (!qq) return true;
      return (
        c.name.toLowerCase().includes(qq) ||
        c.headline.toLowerCase().includes(qq) ||
        c.service.toLowerCase().includes(qq) ||
        (PLATFORMS[c.platform]?.label ?? "").toLowerCase().includes(qq)
      );
    });
  }, [campaigns, q, statusFilter, platformFilter]);

  return (
    <div className={`space-y-4 ${pending ? "opacity-70" : ""}`}>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <Stat icon={Rocket} tint="from-blue-500 to-violet-500" label="Campaigns" value={String(campaigns.length)} />
        <Stat icon={Play} tint="from-emerald-500 to-teal-500" label="Running now" value={String(active)} />
        <Stat icon={IndianRupee} tint="from-amber-500 to-orange-500" label="Total spend" value={inr(totalSpend)} />
        <Stat icon={Target} tint="from-fuchsia-500 to-pink-500" label="Leads · cost each" value={totalLeads ? `${totalLeads} · ${inr(Math.round(totalSpend / totalLeads))}` : "—"} />
      </div>

      <div ref={formTop} className="scroll-mt-4" />
      {msg && (
        <p role="status" className={`rounded-xl px-3 py-2 text-sm font-medium ${msg.ok ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300" : "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-300"}`}>{msg.message}</p>
      )}
      {adding ? (
        <Card className="p-4 sm:p-5">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="min-w-0">
              <h3 className="font-semibold text-slate-900 dark:text-white">New ad campaign</h3>
              {draft && (
                <p className="mt-1 inline-flex items-center gap-1.5 rounded-lg bg-violet-50 dark:bg-violet-500/10 text-violet-700 dark:text-violet-300 px-2.5 py-1 text-xs font-semibold">
                  <Wand2 className="w-3.5 h-3.5 shrink-0" /> {draft.label} filled in — check the 3 steps, change anything, then press Create.
                </p>
              )}
            </div>
            <button type="button" onClick={() => { setAdding(false); setDraft(null); }} aria-label="Close"><X className="w-4 h-4 text-slate-400" /></button>
          </div>
          <form action={(fd) => start(async () => { const r = await createCampaign(fd); setMsg(r); if (r.ok) { setAdding(false); setDraft(null); } })} className="space-y-4">
            <CampaignFields key={draft?.n ?? 0} siteUrl={siteUrl} services={services} bizName={bizName} vertical={vertical} c={draft?.c} />
            <button className="admin-grad rounded-xl text-sm font-semibold px-5 py-2.5 shadow-md shadow-blue-600/20 hover:opacity-90">Create campaign</button>
          </form>
        </Card>
      ) : (
        <TemplateGallery templates={templates} onUse={applyTemplate} onBlank={() => openDraft(null)} />
      )}

      {campaigns.length > 0 && (
        <div className="flex items-center justify-between gap-2 pt-1">
          <h3 className="text-sm font-bold text-slate-800 dark:text-white">Your campaigns</h3>
          <span className="text-[11px] text-slate-400">{filtered.length} of {campaigns.length}</span>
        </div>
      )}
      {campaigns.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search campaigns…"
              className={inputCls + " pl-9"}
            />
          </div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={inputCls + " sm:w-36"}>
            <option value="all">All status</option>
            <option value="draft">Draft</option>
            <option value="active">Active</option>
            <option value="paused">Paused</option>
            <option value="completed">Completed</option>
          </select>
          <select value={platformFilter} onChange={(e) => setPlatformFilter(e.target.value)} className={inputCls + " sm:w-40"}>
            <option value="all">All platforms</option>
            {Object.entries(PLATFORMS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
        </div>
      )}

      {campaigns.length === 0 ? (
        !adding && (
          <div className="rounded-2xl border border-dashed border-slate-300 dark:border-white/15 p-5 text-center">
            <p className="text-sm font-bold text-slate-800 dark:text-white">No campaigns yet</p>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">Pick a template above — we fill in the headline, text, audience and budget. You just check and press Create.</p>
          </div>
        )
      ) : filtered.length === 0 ? (
        <p className="text-xs text-slate-400 py-6 text-center">No campaigns match your filters.</p>
      ) : (
        <div className="space-y-3">
          {filtered.map((c) => (
            <Card key={c.id} className="p-4 sm:p-5">
              {editing === c.id ? (
                <form action={(fd) => start(async () => { const r = await updateCampaign(fd); setMsg(r); if (r.ok) setEditing(null); })} className="space-y-4">
                  <input type="hidden" name="id" value={c.id} />
                  <CampaignFields siteUrl={siteUrl} services={services} bizName={bizName} vertical={vertical} c={c} />
                  <div className="flex gap-2">
                    <button className="admin-grad rounded-xl text-sm font-semibold px-4 py-2 hover:opacity-90">Save</button>
                    <button type="button" onClick={() => setEditing(null)} className="rounded-lg border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 text-sm px-4 py-2">Cancel</button>
                  </div>
                </form>
              ) : (
                <CampaignCard
                  c={c}
                  siteUrl={siteUrl}
                  onEdit={() => setEditing(c.id)}
                  onDuplicate={() => duplicate(c)}
                  onStatus={(st) => start(() => setCampaignStatus(c.id, st))}
                  onDelete={() => { if (confirm(`Delete campaign "${c.name}"?`)) start(() => deleteCampaign(c.id)); }}
                  onMetrics={(fd) => start(() => updateCampaignMetrics(fd))}
                />
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function TemplateGallery({ templates, onUse, onBlank }: { templates: AdTemplate[]; onUse: (t: AdTemplate) => void; onBlank: () => void }) {
  const [all, setAll] = useState(false);
  const shown = all ? templates : templates.slice(0, 6);
  return (
    <section className="rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-100 dark:border-white/10 flex flex-wrap items-center gap-2.5">
        <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white flex items-center justify-center shrink-0"><Wand2 className="w-4 h-4" /></span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-slate-800 dark:text-white">Ready-made ad templates</p>
          <p className="text-[11px] text-slate-400">One click fills everything — text, audience, budget & dates</p>
        </div>
        <button type="button" onClick={onBlank} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-600 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800">
          <Plus className="w-3.5 h-3.5" /> Start blank
        </button>
      </div>
      <div className="p-3 grid gap-2.5 sm:grid-cols-2 xl:grid-cols-3">
        {shown.map((t) => {
          const p = PLATFORMS[t.draft.platform] ?? PLATFORMS.local;
          const g = GROUP_LABEL[t.group];
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => onUse(t)}
              className="group text-left rounded-xl border border-slate-200 dark:border-white/10 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800/40 p-3.5 hover:shadow-md hover:-translate-y-0.5 hover:border-blue-400/60 transition flex flex-col"
            >
              <div className="flex items-start gap-2.5">
                <span className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/10 flex items-center justify-center text-xl shrink-0" aria-hidden>{t.emoji}</span>
                <div className="min-w-0 flex-1">
                  <span className={`inline-block rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide ${g.cls}`}>{g.label}</span>
                  <p className="text-sm font-bold text-slate-800 dark:text-white mt-0.5 leading-snug">{t.title}</p>
                </div>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 flex-1">{t.why}</p>
              <p className="mt-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/10 px-2.5 py-1.5 text-[11px] font-semibold text-slate-700 dark:text-slate-200 line-clamp-1">“{t.draft.headline}”</p>
              <div className="mt-2.5 flex items-center justify-between gap-2 text-[11px]">
                <span className="inline-flex items-center gap-1.5 text-slate-500 dark:text-slate-400 min-w-0">
                  <span className={`w-2 h-2 rounded-full shrink-0 ${p.dot}`} /> <span className="truncate">{p.label} · ₹{t.perDay}/day</span>
                </span>
                <span className="shrink-0 font-bold text-blue-600 dark:text-blue-400 group-hover:underline">Use →</span>
              </div>
            </button>
          );
        })}
      </div>
      {templates.length > 6 && (
        <button type="button" onClick={() => setAll((v) => !v)} className="w-full border-t border-slate-100 dark:border-white/10 px-4 py-2.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:bg-slate-50 dark:hover:bg-white/5 inline-flex items-center justify-center gap-1">
          {all ? "Show fewer" : `Show all ${templates.length} templates`} <ChevronDown className={`w-3.5 h-3.5 transition ${all ? "rotate-180" : ""}`} />
        </button>
      )}
    </section>
  );
}

function Stat({ label, value, icon: Ic, tint }: { label: string; value: string; icon: React.ElementType; tint: string }) {
  return (
    <div className="rounded-xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-slate-900 px-3 py-2.5 shadow-sm min-w-0">
      <div className="flex items-center gap-1.5">
        <span className={`w-5 h-5 rounded-md bg-gradient-to-br ${tint} text-white flex items-center justify-center shrink-0`}><Ic className="w-3 h-3" /></span>
        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 truncate">{label}</p>
      </div>
      <p className="text-lg font-extrabold text-slate-900 dark:text-white mt-1 truncate">{value}</p>
    </div>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-3 py-1.5 text-xs font-semibold border transition ${
        active
          ? "border-lime-500 bg-lime-500/10 text-lime-700 dark:text-lime-300"
          : "border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:border-slate-300"
      }`}
    >
      {children}
    </button>
  );
}

function CampaignFields({ siteUrl, services, bizName, vertical, c }: { siteUrl: string; services: string[]; bizName: string; vertical: string; c?: Partial<Campaign> }) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState(c?.name ?? "");
  const [platform, setPlatform] = useState(c?.platform ?? "google");
  const [objective, setObjective] = useState(c?.objective ?? "leads");
  const [service, setService] = useState(c?.service ?? "");
  const [adImage, setAdImage] = useState(c?.adImage ?? "");
  const [gender, setGender] = useState(c?.gender ?? "all");
  const [age, setAge] = useState<[number, number]>([c?.ageMin ?? 18, c?.ageMax ?? 65]);
  const [interests, setInterests] = useState<string[]>(jparse(c?.interests ?? ""));
  const [locations, setLocations] = useState<string[]>(jparse(c?.locations ?? ""));
  const [radius, setRadius] = useState(c?.radiusKm ?? 0);
  const [budget, setBudget] = useState(c?.budget ?? 0);
  const [startDate, setStartDate] = useState(c?.startDate ?? "");
  const [endDate, setEndDate] = useState(c?.endDate ?? "");
  const [headline, setHeadline] = useState(c?.headline ?? "");
  const [adText, setAdText] = useState(c?.adText ?? "");
  const [targetUrl, setTargetUrl] = useState(c?.targetUrl || `${siteUrl}/contact`);
  const host = siteUrl.replace(/^https?:\/\//, "");
  const [locInput, setLocInput] = useState("");
  const [interestInput, setInterestInput] = useState("");
  const [headlineOpts, setHeadlineOpts] = useState<string[]>([]);

  const suggestedInterests = suggestInterests(service, vertical);
  const toggle = (list: string[], setList: (v: string[]) => void, val: string) => setList(list.includes(val) ? list.filter((x) => x !== val) : [...list, val]);
  const addLoc = () => { const v = locInput.trim(); if (v && !locations.includes(v)) setLocations([...locations, v]); setLocInput(""); };
  const addInterest = () => { const v = interestInput.trim(); if (v && !interests.includes(v)) setInterests([...interests, v]); setInterestInput(""); };

  const aiSuggest = () => {
    const hs = suggestHeadlines(service, bizName);
    setHeadlineOpts(hs);
    setHeadline(hs[0]);
    setAdText(suggestAdTexts(service, bizName)[0]);
    if (!interests.length) setInterests(suggestedInterests.slice(0, 4));
  };

  const steps = ["Basics", "Audience", "Creative"];
  const canCreate = name.trim().length > 0;

  return (
    <>
      {/* Always mounted so submit works from any step */}
      <input type="hidden" name="name" value={name} />
      <input type="hidden" name="platform" value={platform} />
      <input type="hidden" name="objective" value={objective} />
      <input type="hidden" name="service" value={service} />
      <input type="hidden" name="adImage" value={adImage} />
      <input type="hidden" name="gender" value={gender} />
      <input type="hidden" name="ageMin" value={age[0]} />
      <input type="hidden" name="ageMax" value={age[1]} />
      <input type="hidden" name="interests" value={JSON.stringify(interests)} />
      <input type="hidden" name="locations" value={JSON.stringify(locations)} />
      <input type="hidden" name="radiusKm" value={radius} />
      <input type="hidden" name="headline" value={headline} />
      <input type="hidden" name="adText" value={adText} />
      <input type="hidden" name="budget" value={budget} />
      <input type="hidden" name="startDate" value={startDate} />
      <input type="hidden" name="endDate" value={endDate} />
      <input type="hidden" name="targetUrl" value={targetUrl} />

      <div className="flex gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/60 mb-1">
        {steps.map((label, i) => (
          <button
            key={label}
            type="button"
            onClick={() => setStep(i)}
            className={`flex-1 rounded-lg px-2 py-1.5 text-xs font-bold transition ${
              step === i ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            }`}
          >
            {i + 1}. {label}
          </button>
        ))}
      </div>

      {!canCreate && step !== 0 && (
        <p className="text-[11px] text-amber-600 dark:text-amber-400">Add a campaign name in Basics before saving.</p>
      )}

      <div className="grid lg:grid-cols-[1fr_280px] gap-4 items-start">
        <div className="space-y-4 min-w-0">
          {step === 0 && (
            <>
              <label className="block"><span className={lbl}>Campaign name</span><input value={name} onChange={(e) => setName(e.target.value)} required placeholder="Diwali Offer 2026" className={inputCls} /></label>
              <div>
                <span className={lbl}>Advertise on</span>
                <div className="flex flex-wrap gap-2">{Object.entries(PLATFORMS).map(([k, v]) => (
                  <Chip key={k} active={platform === k} onClick={() => setPlatform(k)}>
                    <span className={`inline-block w-2 h-2 rounded-full ${v.dot} mr-1.5`} />{v.label}
                  </Chip>
                ))}</div>
              </div>
              <div>
                <span className={lbl}>Service / product</span>
                <div className="flex flex-wrap gap-2">
                  <Chip active={service === ""} onClick={() => setService("")}>All / Business</Chip>
                  {services.map((s) => <Chip key={s} active={service === s} onClick={() => setService(s)}>{s}</Chip>)}
                </div>
              </div>
              <div>
                <span className={lbl}>Goal</span>
                <div className="flex flex-wrap gap-2">{OBJECTIVES.map((o) => <Chip key={o} active={objective === o} onClick={() => setObjective(o)}>{o[0].toUpperCase() + o.slice(1)}</Chip>)}</div>
              </div>
              <div className="grid sm:grid-cols-3 gap-3">
                <label className="block"><span className={lbl}>Budget (₹)</span><input type="number" min={0} value={budget || ""} onChange={(e) => setBudget(Number(e.target.value) || 0)} placeholder="5000" className={inputCls} /></label>
                <label className="block"><span className={lbl}>Start</span><input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className={inputCls} /></label>
                <label className="block"><span className={lbl}>End</span><input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className={inputCls} /></label>
              </div>
              <BudgetHint budget={budget} startDate={startDate} endDate={endDate} onPick={setBudget} />
              <button type="button" onClick={() => setStep(1)} className="text-xs font-bold text-lime-700 dark:text-lime-400 hover:underline">Next: Audience →</button>
            </>
          )}

          {step === 1 && (
            <>
              <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-4 space-y-4 bg-slate-50/60 dark:bg-slate-800/40">
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5"><Users className="w-4 h-4 text-lime-600" /> Audience targeting</p>
                <div>
                  <span className={lbl}>Age group</span>
                  <div className="flex flex-wrap gap-2">{AGE_PRESETS.map((a) => <Chip key={a.label} active={age[0] === a.min && age[1] === a.max} onClick={() => setAge([a.min, a.max])}>{a.label}</Chip>)}</div>
                </div>
                <div>
                  <span className={lbl}>Gender</span>
                  <div className="flex flex-wrap gap-2">{["all", "male", "female"].map((g) => <Chip key={g} active={gender === g} onClick={() => setGender(g)}>{g[0].toUpperCase() + g.slice(1)}</Chip>)}</div>
                </div>
                <div>
                  <span className={lbl}>Interests</span>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {interests.map((i) => <Chip key={i} active onClick={() => toggle(interests, setInterests, i)}>{i} ✕</Chip>)}
                  </div>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {suggestedInterests.filter((i) => !interests.includes(i)).map((i) => <Chip key={i} active={false} onClick={() => setInterests([...interests, i])}>+ {i}</Chip>)}
                  </div>
                  <div className="flex gap-2">
                    <input value={interestInput} onChange={(e) => setInterestInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addInterest(); } }} placeholder="Add interest" className={inputCls + " max-w-xs"} />
                    <button type="button" onClick={addInterest} className="rounded-lg border border-slate-300 dark:border-slate-600 px-3 text-sm">Add</button>
                  </div>
                </div>
                <div>
                  <span className={lbl}>Locations</span>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {locations.map((l) => <Chip key={l} active onClick={() => setLocations(locations.filter((x) => x !== l))}><MapPin className="w-3 h-3 inline mr-1" />{l} ✕</Chip>)}
                  </div>
                  <div className="flex gap-2">
                    <input value={locInput} onChange={(e) => setLocInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addLoc(); } }} placeholder="e.g. Delhi, Karol Bagh" className={inputCls + " max-w-xs"} />
                    <button type="button" onClick={addLoc} className="rounded-lg border border-slate-300 dark:border-slate-600 px-3 text-sm">Add</button>
                  </div>
                </div>
                <div>
                  <span className={lbl}>Target radius</span>
                  <div className="flex flex-wrap gap-2">{RADII.map((r) => <Chip key={r} active={radius === r} onClick={() => setRadius(r)}>{r === 0 ? "No radius" : `${r} km`}</Chip>)}</div>
                </div>
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setStep(0)} className="text-xs font-bold text-slate-500 hover:underline">← Basics</button>
                <button type="button" onClick={() => setStep(2)} className="text-xs font-bold text-lime-700 dark:text-lime-400 hover:underline">Next: Creative →</button>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div>
                <span className={lbl}>Ad image</span>
                <div className="max-w-xs"><ImageInput value={adImage} onChange={setAdImage} aspect="aspect-video" /></div>
              </div>
              <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-4 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Ad copy</p>
                  <button type="button" onClick={aiSuggest} className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 dark:bg-lime-500 dark:text-slate-900 text-white text-xs font-bold px-3 py-1.5 hover:opacity-90">
                    <Sparkles className="w-3.5 h-3.5" /> Suggest
                  </button>
                </div>
                {headlineOpts.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {headlineOpts.map((h, i) => (
                      <button type="button" key={i} onClick={() => setHeadline(h)} className={`text-left text-xs rounded-lg border px-2.5 py-1.5 ${headline === h ? "border-lime-500 bg-lime-500/10" : "border-slate-200 dark:border-slate-600 hover:border-slate-300"}`}>{h}</button>
                    ))}
                  </div>
                )}
                <label className="block"><span className={lbl}>Headline</span><input value={headline} onChange={(e) => setHeadline(e.target.value)} placeholder="Get 20% Off This Week — Book Now!" className={inputCls} /></label>
                <label className="block"><span className={lbl}>Ad text</span><textarea value={adText} onChange={(e) => setAdText(e.target.value)} rows={3} placeholder="Describe your offer in a line or two." className={inputCls} /></label>
                <label className="block"><span className={lbl}>Landing page</span><input value={targetUrl} onChange={(e) => setTargetUrl(e.target.value)} className={inputCls} /></label>
              </div>
              <button type="button" onClick={() => setStep(1)} className="text-xs font-bold text-slate-500 hover:underline">← Audience</button>
            </>
          )}
        </div>

        <aside className="lg:sticky lg:top-4 space-y-3">
          <div>
            <p className="text-xs font-semibold text-slate-500 mb-2">Live ad preview</p>
            <AdPreview platform={platform} image={adImage} headline={headline} adText={adText} bizName={bizName} host={host} objective={objective} service={service} />
          </div>
          <ReachEstimate budget={budget} radius={radius} interests={interests} platform={platform} />
        </aside>
      </div>
    </>
  );
}

function ctaLabel(objective: string) {
  return objective === "calls" ? "Call Now" : objective === "sales" ? "Shop Now" : objective === "leads" ? "Book Now" : "Learn More";
}

function AdImg({ ratio, image }: { ratio: string; image: string }) {
  return (
    <div className={`${ratio} bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 overflow-hidden`}>
      {image
        // eslint-disable-next-line @next/next/no-img-element
        ? <img src={image} alt="" className="w-full h-full object-cover" />
        : <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">Ad image</div>}
    </div>
  );
}

function AdPreview({ platform, image, headline, adText, bizName, host, objective, service }: { platform: string; image: string; headline: string; adText: string; bizName: string; host: string; objective: string; service: string }) {
  const H = headline || (service ? `${service} — Special Offer!` : "Your headline appears here");
  const T = adText || "Your ad description shows here — write something that grabs attention.";
  const initial = (bizName || "B").charAt(0).toUpperCase();
  const cta = ctaLabel(objective);

  if (platform === "google") {
    return (
      <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 shadow-sm">
        <p className="text-xs text-slate-500 mb-1"><span className="font-bold text-slate-700 dark:text-slate-200">Ad</span> · {host}</p>
        <p className="text-[#1a0dab] dark:text-blue-400 text-lg leading-tight">{H}</p>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">{T}</p>
      </div>
    );
  }
  if (platform === "whatsapp" || platform === "local") {
    return (
      <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 overflow-hidden shadow-sm max-w-[300px]">
        <AdImg ratio="aspect-video" image={image} />
        <div className="p-3">
          <p className="font-bold text-slate-800 dark:text-slate-100 text-sm">{H}</p>
          <p className="text-sm text-slate-500 mt-0.5">{T}</p>
          <button type="button" className="mt-2 w-full rounded-lg bg-green-500 text-white text-sm font-semibold py-2">Message Us</button>
        </div>
      </div>
    );
  }
  const insta = platform === "instagram";
  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 overflow-hidden shadow-sm max-w-[320px]">
      <div className="flex items-center gap-2 p-3">
        <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-sm font-bold">{initial}</div>
        <div className="leading-tight">
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{bizName || "Your Business"}</p>
          <p className="text-[11px] text-slate-400">Sponsored</p>
        </div>
      </div>
      {!insta && <p className="px-3 pb-2 text-sm text-slate-700 dark:text-slate-200">{T}</p>}
      <AdImg ratio={insta ? "aspect-square" : "aspect-[1.91/1]"} image={image} />
      {insta ? (
        <div className="p-3">
          <p className="text-sm">
            <span className="font-semibold text-slate-800 dark:text-slate-100">{(bizName || "business").toLowerCase().replace(/\s+/g, "")}</span>{" "}
            <span className="text-slate-600 dark:text-slate-300">{H}</span>
          </p>
        </div>
      ) : (
        <div className="flex items-center justify-between gap-2 p-3 bg-slate-50 dark:bg-slate-800">
          <div className="min-w-0">
            <p className="text-[10px] uppercase text-slate-400 truncate">{host}</p>
            <p className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">{H}</p>
          </div>
          <button type="button" className="shrink-0 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-100 text-xs font-bold px-3 py-2">{cta}</button>
        </div>
      )}
    </div>
  );
}

function ReachEstimate({ budget, radius, interests, platform }: { budget: number; radius: number; interests: string[]; platform: string }) {
  if (!budget) {
    return <div className="rounded-xl border border-dashed border-slate-300 dark:border-slate-600 p-4 text-center text-xs text-slate-400">Add a budget to see estimated reach.</div>;
  }
  const perRupee = platform === "google" ? 3 : 8;
  const breadth = radius === 0 ? 1 : Math.min(1 + radius / 40, 1.6);
  const narrow = interests.length > 4 ? 0.85 : 1;
  const reachLo = Math.round(budget * perRupee * 0.7 * breadth * narrow);
  const reachHi = Math.round(budget * perRupee * 1.9 * breadth * narrow);
  const cplLo = platform === "google" ? 40 : 30;
  const cplHi = platform === "google" ? 160 : 110;
  const leadsLo = Math.max(1, Math.floor(budget / cplHi));
  const leadsHi = Math.max(2, Math.floor(budget / cplLo));
  const fmt = (n: number) => n.toLocaleString("en-IN");
  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-lime-50/50 dark:bg-slate-800/50 p-4">
      <p className="text-xs font-semibold text-slate-500 mb-3 flex items-center gap-1.5"><Target className="w-3.5 h-3.5 text-lime-600" /> Estimated results</p>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <p className="text-[11px] text-slate-400">Reach</p>
          <p className="text-lg font-extrabold text-slate-900 dark:text-white leading-tight">{fmt(reachLo)}–{fmt(reachHi)}</p>
        </div>
        <div>
          <p className="text-[11px] text-slate-400">Leads</p>
          <p className="text-lg font-extrabold text-lime-600 leading-tight">{leadsLo}–{leadsHi}</p>
        </div>
      </div>
      <p className="text-[10px] text-slate-400 mt-3">Rough estimate for ₹{fmt(budget)} — actual results vary.</p>
    </div>
  );
}

function BudgetHint({ budget, startDate, endDate, onPick }: { budget: number; startDate: string; endDate: string; onPick: (n: number) => void }) {
  const days = startDate && endDate ? Math.round((Date.parse(endDate) - Date.parse(startDate)) / 86_400_000) + 1 : 0;
  return (
    <div className="rounded-xl bg-slate-50 dark:bg-slate-800/50 px-3 py-2.5 text-xs text-slate-600 dark:text-slate-300 space-y-2">
      {budget > 0 && days > 0 && <p><b className="text-slate-800 dark:text-white">≈ {inr(Math.round(budget / days))}/day</b> for {days} day{days === 1 ? "" : "s"}.</p>}
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="text-slate-400">Quick budget:</span>
        {[1000, 2000, 5000, 10000].map((v) => (
          <button key={v} type="button" onClick={() => onPick(v)} className={`rounded-full border px-2.5 py-1 font-semibold ${budget === v ? "border-blue-500 bg-blue-500/10 text-blue-700 dark:text-blue-300" : "border-slate-200 dark:border-slate-600 hover:border-slate-300"}`}>{inr(v)}</button>
        ))}
      </div>
      <p className="text-[11px] text-slate-400">Tip: start with ₹200–500/day for one week. You pay Google/Facebook directly — we only help you plan and track.</p>
    </div>
  );
}

function CampaignCard({ c, siteUrl, onEdit, onDuplicate, onStatus, onDelete, onMetrics }: { c: Campaign; siteUrl: string; onEdit: () => void; onDuplicate: () => void; onStatus: (s: string) => void; onDelete: () => void; onMetrics: (fd: FormData) => void }) {
  const [showMetrics, setShowMetrics] = useState(false);
  const p = PLATFORMS[c.platform] ?? PLATFORMS.local;
  const base = c.targetUrl || `${siteUrl}/contact`;
  const utm = `${base}${base.includes("?") ? "&" : "?"}utm_source=${c.platform}&utm_medium=${p.medium}&utm_campaign=${slug(c.name)}`;
  const cpc = c.clicks ? "₹" + (c.spend / c.clicks).toFixed(1) : "—";
  const cpl = c.leads ? "₹" + Math.round(c.spend / c.leads) : "—";
  const interests = jparse(c.interests);
  const locations = jparse(c.locations);
  const rate = c.clicks ? ((c.leads / c.clicks) * 100).toFixed(1) + "%" : "—";
  const used = c.budget ? Math.min(100, Math.round((c.spend / c.budget) * 100)) : 0;
  const today = istToday();
  const daysLeft = c.endDate && c.endDate >= today ? Math.round((Date.parse(c.endDate) - Date.parse(today)) / 86_400_000) : null;
  const hasMetrics = c.spend > 0 || c.clicks > 0 || c.leads > 0;
  const audience = `${c.gender === "all" ? "All" : c.gender[0].toUpperCase() + c.gender.slice(1)} · ${c.ageMin}–${c.ageMax} yrs`;

  return (
    <div>
      <div className="flex flex-wrap items-start gap-2 mb-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5 mb-1">
            <h3 className="font-bold text-slate-900 dark:text-white">{c.name}</h3>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${p.cls}`}>{p.label}</span>
            {c.service && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-lime-100 text-lime-700 dark:bg-lime-500/20 dark:text-lime-300">{c.service}</span>}
            <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${STATUS_CLS[c.status] ?? STATUS_CLS.draft}`}><span className={`w-1.5 h-1.5 rounded-full bg-current ${c.status === "active" ? "animate-pulse" : ""}`} />{c.status}</span>
          </div>
          <p className="text-xs text-slate-400 flex flex-wrap items-center gap-x-2.5 gap-y-0.5">
            <span className="capitalize">Goal: {c.objective}</span>
            {c.budget > 0 && <span>Budget {inr(c.budget)}</span>}
            {(c.startDate || c.endDate) && (
              <span className="inline-flex items-center gap-1"><CalendarDays className="w-3 h-3" /> {fmtDate(c.startDate) || "…"} – {fmtDate(c.endDate) || "…"}</span>
            )}
            {daysLeft !== null && c.status === "active" && <span className="font-semibold text-emerald-600 dark:text-emerald-400">{daysLeft === 0 ? "Ends today" : `${daysLeft} day${daysLeft === 1 ? "" : "s"} left`}</span>}
          </p>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button type="button" onClick={onDuplicate} title="Duplicate" aria-label="Duplicate" className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 hover:opacity-80"><CopyPlus className="w-4 h-4" /></button>
          <button type="button" onClick={onEdit} title="Edit" className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 hover:opacity-80"><Pencil className="w-4 h-4" /></button>
          <button type="button" onClick={onDelete} title="Delete" className="p-1.5 rounded-lg bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-950/60"><Trash2 className="w-4 h-4" /></button>
        </div>
      </div>

      <div className="flex gap-3 mb-3">
        {c.adImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={c.adImage} alt="" className="w-24 h-16 rounded-lg object-cover border border-slate-200 dark:border-slate-700 shrink-0" />
        )}
        <div className="flex-1 min-w-0">
          {c.headline && <p className="font-semibold text-slate-800 dark:text-slate-100 text-sm">{c.headline}</p>}
          {c.adText && <p className="text-sm text-slate-500 line-clamp-2">{c.adText}</p>}
          <p className="text-xs text-slate-400 mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5">
            <span className="inline-flex items-center gap-1"><Users className="w-3 h-3" /> {audience}</span>
            {locations.length > 0 && (
              <span className="inline-flex items-center gap-1"><MapPin className="w-3 h-3" /> {locations.join(", ")}{c.radiusKm ? ` (+${c.radiusKm}km)` : ""}</span>
            )}
          </p>
          {interests.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {interests.slice(0, 5).map((i) => <span key={i} className="text-[10px] rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-200 px-2 py-0.5">{i}</span>)}
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-3">
        <code className="flex-1 min-w-[160px] rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-2 text-[11px] break-all text-slate-800 dark:text-slate-100">{utm}</code>
        <CopyMini text={utm} label="Copy link" />
        {(c.headline || c.adText) && <CopyMini text={`${c.headline}\n${c.adText}\n${utm}`} label="Copy ad" />}
        {p.launch && (
          <a href={p.launch} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 text-white text-xs font-bold px-3 py-2 hover:bg-slate-800">
            <Rocket className="w-3.5 h-3.5" /> Launch <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-1.5 mb-2">
        <StatusBtn active={c.status === "active"} onClick={() => onStatus("active")} icon={Play} label="Active" />
        <StatusBtn active={c.status === "paused"} onClick={() => onStatus("paused")} icon={Pause} label="Paused" />
        <StatusBtn active={c.status === "completed"} onClick={() => onStatus("completed")} icon={CheckCheck} label="Done" />
        <button
          type="button"
          onClick={() => setShowMetrics((v) => !v)}
          className="ml-auto inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
        >
          <Target className="w-3.5 h-3.5" /> Track results {showMetrics ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {hasMetrics && !showMetrics && (
        <div className="mt-1">
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
            {[["Spent", inr(c.spend)], ["Clicks", String(c.clicks)], ["Leads", String(c.leads)], ["Per click", cpc], ["Per lead", cpl], ["Click → lead", rate]].map(([k, v]) => (
              <div key={k} className="rounded-lg bg-slate-50 dark:bg-slate-800/60 px-2 py-1.5 min-w-0">
                <p className="text-[10px] text-slate-400 truncate">{k}</p>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">{v}</p>
              </div>
            ))}
          </div>
          {c.budget > 0 && (
            <div className="mt-2">
              <div className="flex justify-between text-[10px] text-slate-400 mb-1"><span>Budget used</span><span>{used}%</span></div>
              <div className="h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div className={`h-full rounded-full ${used >= 90 ? "bg-rose-500" : "admin-grad"}`} style={{ width: `${used}%` }} />
              </div>
            </div>
          )}
        </div>
      )}
      {!hasMetrics && c.status === "active" && !showMetrics && (
        <p className="text-[11px] text-slate-400 mt-1">💡 Once your ad runs, copy spend, clicks and leads from Google/Facebook into “Track results” to see what each lead costs.</p>
      )}

      {showMetrics && (
        <form action={onMetrics} className="rounded-lg border border-slate-200 dark:border-slate-700 p-3 mt-1">
          <input type="hidden" name="id" value={c.id} />
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 items-end">
            <label className="block"><span className={lbl}>Spend (₹)</span><input name="spend" type="number" min={0} defaultValue={c.spend || ""} className={inputCls} /></label>
            <label className="block"><span className={lbl}>Clicks</span><input name="clicks" type="number" min={0} defaultValue={c.clicks || ""} className={inputCls} /></label>
            <label className="block"><span className={lbl}>Leads</span><input name="leads" type="number" min={0} defaultValue={c.leads || ""} className={inputCls} /></label>
            <div className="text-xs text-slate-500"><p>CPC: <b className="text-slate-800 dark:text-slate-200">{cpc}</b></p><p>CPL: <b className="text-slate-800 dark:text-slate-200">{cpl}</b></p></div>
            <button className="rounded-lg bg-slate-900 text-white text-sm font-semibold px-3 py-2 hover:bg-slate-800">Save</button>
          </div>
        </form>
      )}
    </div>
  );
}

function StatusBtn({ active, onClick, icon: Ic, label }: { active: boolean; onClick: () => void; icon: React.ElementType; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold ${
        active ? "bg-slate-900 text-white dark:bg-lime-500 dark:text-slate-900" : "bg-slate-100 dark:bg-slate-700 text-slate-500 hover:opacity-80"
      }`}
    >
      <Ic className="w-3.5 h-3.5" /> {label}
    </button>
  );
}

function CopyMini({ text, label }: { text: string; label: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      onClick={() => { navigator.clipboard?.writeText(text); setDone(true); setTimeout(() => setDone(false), 1500); }}
      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 dark:border-slate-600 px-2.5 py-2 text-xs font-medium text-slate-600 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
    >
      {done ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />} {done ? "Copied" : label}
    </button>
  );
}
