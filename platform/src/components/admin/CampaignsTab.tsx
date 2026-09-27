"use client";

import { useMemo, useState, useTransition } from "react";
import {
  Plus, Trash2, Pencil, X, Copy, Check, ExternalLink, Rocket, Play, Pause, CheckCheck,
  Target, Sparkles, MapPin, Users, Search, ChevronDown, ChevronUp,
} from "lucide-react";
import { createCampaign, updateCampaign, updateCampaignMetrics, setCampaignStatus, deleteCampaign } from "@/lib/actions/marketing";
import { suggestHeadlines, suggestAdTexts, suggestInterests } from "@/lib/adSuggest";
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

export function CampaignsTab({ campaigns, siteUrl, services, bizName, vertical }: { campaigns: Campaign[]; siteUrl: string; services: string[]; bizName: string; vertical: string }) {
  const [pending, start] = useTransition();
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [platformFilter, setPlatformFilter] = useState("all");

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
    <div className={pending ? "opacity-70" : ""}>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-4">
        <Stat label="Campaigns" value={String(campaigns.length)} />
        <Stat label="Active" value={String(active)} />
        <Stat label="Total spend" value={inr(totalSpend)} />
        <Stat label="Leads / cost" value={totalLeads ? `${totalLeads} · ${inr(Math.round(totalSpend / totalLeads))}` : "—"} />
      </div>

      {!adding ? (
        <button onClick={() => setAdding(true)} className="mb-4 inline-flex items-center gap-2 rounded-lg bg-lime-500 text-white px-4 py-2.5 text-sm font-semibold hover:bg-lime-600">
          <Plus className="w-4 h-4" /> New campaign
        </button>
      ) : (
        <Card className="p-4 sm:p-5 mb-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-slate-900 dark:text-white">New ad campaign</h3>
            <button type="button" onClick={() => setAdding(false)} aria-label="Close"><X className="w-4 h-4 text-slate-400" /></button>
          </div>
          <form action={(fd) => { start(() => createCampaign(fd)); setAdding(false); }} className="space-y-4">
            <CampaignFields siteUrl={siteUrl} services={services} bizName={bizName} vertical={vertical} />
            <button className="rounded-lg bg-slate-900 dark:bg-lime-500 dark:text-slate-900 text-white text-sm font-semibold px-5 py-2.5 hover:opacity-90">Create campaign</button>
          </form>
        </Card>
      )}

      {campaigns.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-2 mb-3">
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
        <div className="rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 p-10 text-center">
          <p className="text-sm font-semibold text-slate-800 dark:text-white">No campaigns yet</p>
          <p className="text-xs text-slate-400 mt-1 mb-3">Create one to target an audience and launch ads on Google, Meta or Instagram.</p>
          <button type="button" onClick={() => setAdding(true)} className="text-sm font-semibold text-lime-600 hover:underline">Create first campaign</button>
        </div>
      ) : filtered.length === 0 ? (
        <p className="text-xs text-slate-400 py-6 text-center">No campaigns match your filters.</p>
      ) : (
        <div className="space-y-3">
          {filtered.map((c) => (
            <Card key={c.id} className="p-4 sm:p-5">
              {editing === c.id ? (
                <form action={(fd) => { start(() => updateCampaign(fd)); setEditing(null); }} className="space-y-4">
                  <input type="hidden" name="id" value={c.id} />
                  <CampaignFields siteUrl={siteUrl} services={services} bizName={bizName} vertical={vertical} c={c} />
                  <div className="flex gap-2">
                    <button className="rounded-lg bg-slate-900 text-white text-sm font-semibold px-4 py-2">Save</button>
                    <button type="button" onClick={() => setEditing(null)} className="rounded-lg border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 text-sm px-4 py-2">Cancel</button>
                  </div>
                </form>
              ) : (
                <CampaignCard
                  c={c}
                  siteUrl={siteUrl}
                  onEdit={() => setEditing(c.id)}
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

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 px-3 py-2.5">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">{label}</p>
      <p className="text-lg font-extrabold text-slate-900 dark:text-white mt-0.5">{value}</p>
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

function CampaignFields({ siteUrl, services, bizName, vertical, c }: { siteUrl: string; services: string[]; bizName: string; vertical: string; c?: Campaign }) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState(c?.name ?? "");
  const [platform, setPlatform] = useState(c?.platform ?? "google");
  const [objective, setObjective] = useState(c?.objective ?? "leads");
  const [service, setService] = useState(c?.service ?? "");
  const [adImage, setAdImage] = useState(c?.adImage ?? "");
  const [gender, setGender] = useState(c?.gender ?? "all");
  const [age, setAge] = useState<[number, number]>([c?.ageMin ?? 18, c?.ageMax ?? 65]);
  const [interests, setInterests] = useState<string[]>(c ? jparse(c.interests) : []);
  const [locations, setLocations] = useState<string[]>(c ? jparse(c.locations) : []);
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

function AdPreview({ platform, image, headline, adText, bizName, host, objective, service }: { platform: string; image: string; headline: string; adText: string; bizName: string; host: string; objective: string; service: string }) {
  const H = headline || (service ? `${service} — Special Offer!` : "Your headline appears here");
  const T = adText || "Your ad description shows here — write something that grabs attention.";
  const initial = (bizName || "B").charAt(0).toUpperCase();
  const cta = ctaLabel(objective);
  const Img = ({ ratio }: { ratio: string }) => (
    <div className={`${ratio} bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 overflow-hidden`}>
      {image
        // eslint-disable-next-line @next/next/no-img-element
        ? <img src={image} alt="" className="w-full h-full object-cover" />
        : <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">Ad image</div>}
    </div>
  );

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
        <Img ratio="aspect-video" />
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
      <Img ratio={insta ? "aspect-square" : "aspect-[1.91/1]"} />
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

function CampaignCard({ c, siteUrl, onEdit, onStatus, onDelete, onMetrics }: { c: Campaign; siteUrl: string; onEdit: () => void; onStatus: (s: string) => void; onDelete: () => void; onMetrics: (fd: FormData) => void }) {
  const [showMetrics, setShowMetrics] = useState(false);
  const p = PLATFORMS[c.platform] ?? PLATFORMS.local;
  const base = c.targetUrl || `${siteUrl}/contact`;
  const utm = `${base}${base.includes("?") ? "&" : "?"}utm_source=${c.platform}&utm_medium=${p.medium}&utm_campaign=${slug(c.name)}`;
  const cpc = c.clicks ? "₹" + (c.spend / c.clicks).toFixed(1) : "—";
  const cpl = c.leads ? "₹" + Math.round(c.spend / c.leads) : "—";
  const interests = jparse(c.interests);
  const locations = jparse(c.locations);
  const audience = `${c.gender === "all" ? "All" : c.gender[0].toUpperCase() + c.gender.slice(1)} · ${c.ageMin}–${c.ageMax} yrs`;

  return (
    <div>
      <div className="flex flex-wrap items-start gap-2 mb-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5 mb-1">
            <h3 className="font-bold text-slate-900 dark:text-white">{c.name}</h3>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${p.cls}`}>{p.label}</span>
            {c.service && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-lime-100 text-lime-700 dark:bg-lime-500/20 dark:text-lime-300">{c.service}</span>}
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${STATUS_CLS[c.status] ?? STATUS_CLS.draft}`}>{c.status}</span>
          </div>
          <p className="text-xs text-slate-400 capitalize">{c.objective}{c.budget ? ` · ${inr(c.budget)}` : ""}</p>
        </div>
        <div className="flex items-center gap-1 shrink-0">
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

      {(c.spend > 0 || c.clicks > 0 || c.leads > 0) && !showMetrics && (
        <p className="text-[11px] text-slate-400 mb-1">Spend {inr(c.spend)} · {c.clicks} clicks · {c.leads} leads · CPC {cpc} · CPL {cpl}</p>
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
