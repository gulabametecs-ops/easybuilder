"use client";

import { useActionState, useState } from "react";
import {
  Search, Globe, BarChart3, MapPin, Gauge, CheckCircle2, XCircle, Info,
  Rocket, Circle, ExternalLink, Copy, Check, AlertCircle, Eye,
} from "lucide-react";
import { saveSeo } from "@/lib/actions/appearance";
import { submitToIndexNow, type IndexState } from "@/lib/actions/seoIndex";
import { ImageInput } from "./ImageInput";
import { AdminWorkspace, fieldCls, labelCls } from "./AdminWorkspace";
import type { SeoConfig } from "@/lib/config";

const BUSINESS_TYPES = [
  "LocalBusiness", "Restaurant", "Store", "MedicalBusiness", "Dentist", "HealthClub",
  "ProfessionalService", "HomeAndConstructionBusiness", "EducationalOrganization",
  "Electrician", "Plumber", "GeneralContractor",
];

const TABS = [
  { id: "score", label: "Score", hint: "Health", icon: Gauge },
  { id: "meta", label: "Meta", hint: "Title & share", icon: Globe },
  { id: "track", label: "Track", hint: "Analytics", icon: BarChart3 },
  { id: "local", label: "Local", hint: "Maps", icon: MapPin },
  { id: "index", label: "Index", hint: "Google", icon: Rocket },
] as const;

type TabId = (typeof TABS)[number]["id"];

export function SeoManager({
  seo,
  siteUrl,
  bizName,
  sitemapUrl,
}: {
  seo: SeoConfig;
  siteUrl: string;
  bizName: string;
  sitemapUrl: string;
}) {
  const [tab, setTab] = useState<TabId>("meta");
  const [f, setF] = useState<SeoConfig>(seo);
  const set = (k: keyof SeoConfig, v: string | boolean) => setF((s) => ({ ...s, [k]: v }));
  const host = siteUrl.replace(/^https?:\/\//, "");

  const checks = [
    { ok: f.title.length >= 10 && f.title.length <= 65, label: "Title length (10–65)" },
    { ok: f.description.length >= 50 && f.description.length <= 165, label: "Meta description (50–165)" },
    { ok: !!f.keywords, label: "Keywords added" },
    { ok: !!f.ogImage, label: "Social share image" },
    { ok: !!f.favicon, label: "Favicon set" },
    { ok: !!(f.gaId || f.gtmId), label: "Analytics connected" },
    { ok: !!f.googleVerification, label: "Search Console verified" },
    { ok: f.indexable !== false, label: "Visible to search engines" },
    { ok: f.localBusiness && !!(f.geoLat && f.geoLng), label: "Local business + location" },
    { ok: !!(f.ratingValue && f.ratingCount), label: "Star rating (rich results)" },
  ];
  const score = Math.round((checks.filter((c) => c.ok).length / checks.length) * 100);
  const tone = score >= 80 ? "text-emerald-600" : score >= 50 ? "text-amber-500" : "text-rose-500";
  const bar = score >= 80 ? "bg-emerald-500" : score >= 50 ? "bg-amber-500" : "bg-rose-500";

  return (
    <form action={saveSeo} className="flex flex-col flex-1 min-h-0">
      <AdminWorkspace
        title="SEO"
        titleIcon={<Search className="w-4 h-4 text-lime-600 shrink-0" />}
        tabs={[...TABS]}
        tab={tab}
        onTabChange={(id) => setTab(id as TabId)}
        toolbar={
          <button type="submit" className="rounded-md bg-lime-500 text-white text-xs font-bold px-3 py-1.5 hover:bg-lime-600">
            Save
          </button>
        }
        aside={
          <div className="flex flex-col flex-1 min-h-0">
            <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2 shrink-0">
              <Eye className="w-3.5 h-3.5 text-lime-600" />
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">Live preview</p>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Google</p>
                <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-3 bg-white dark:bg-slate-950">
                  <p className="text-[11px] text-slate-500 truncate">{host}</p>
                  <p className="text-[#1a0dab] dark:text-blue-400 text-base leading-snug line-clamp-2 mt-0.5">{f.title || bizName}</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mt-0.5">
                    {f.description || "Add a meta description to control what shows here."}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Social share</p>
                <div className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                  <div className="aspect-[1.91/1] bg-slate-100 dark:bg-slate-800">
                    {f.ogImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={f.ogImage} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs px-4 text-center">
                        Add OG image (1200×630)
                      </div>
                    )}
                  </div>
                  <div className="p-2.5 bg-slate-50 dark:bg-slate-800/80">
                    <p className="text-[10px] text-slate-400 uppercase truncate">{host}</p>
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-100 truncate">{f.title || bizName}</p>
                    <p className="text-[10px] text-slate-500 line-clamp-1">{f.description}</p>
                  </div>
                </div>
              </div>
              <div className="rounded-xl border border-slate-100 dark:border-slate-800 p-3 flex items-center gap-3">
                <div className="relative w-12 h-12 shrink-0">
                  <svg viewBox="0 0 36 36" className="w-12 h-12 -rotate-90">
                    <circle cx="18" cy="18" r="15.9" fill="none" className="stroke-slate-200 dark:stroke-slate-700" strokeWidth="3" />
                    <circle cx="18" cy="18" r="15.9" fill="none" className={tone.replace("text-", "stroke-")} strokeWidth="3" strokeDasharray={`${score} 100`} strokeLinecap="round" />
                  </svg>
                  <span className={`absolute inset-0 flex items-center justify-center text-xs font-extrabold ${tone}`}>{score}</span>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-800 dark:text-white">SEO score</p>
                  <p className="text-[10px] text-slate-400">{checks.filter((c) => c.ok).length}/{checks.length} checks passed</p>
                </div>
              </div>
            </div>
          </div>
        }
      >
        {/* Always submitted — tabs only edit local state */}
        <SeoHiddenFields f={f} />

        {tab === "score" && (
          <div className="space-y-4 max-w-xl">
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16 shrink-0">
                <svg viewBox="0 0 36 36" className="w-16 h-16 -rotate-90">
                  <circle cx="18" cy="18" r="15.9" fill="none" className="stroke-slate-200 dark:stroke-slate-700" strokeWidth="3" />
                  <circle cx="18" cy="18" r="15.9" fill="none" className={tone.replace("text-", "stroke-")} strokeWidth="3" strokeDasharray={`${score} 100`} strokeLinecap="round" />
                </svg>
                <span className={`absolute inset-0 flex items-center justify-center font-extrabold ${tone}`}>{score}</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">SEO health</p>
                <p className="text-xs text-slate-500">
                  {score >= 80 ? "Strong basics — keep content fresh." : score >= 50 ? "Good start — finish the checklist." : "Complete the checklist to rank better."}
                </p>
                <div className="mt-2 h-1.5 w-36 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div className={`h-full ${bar} rounded-full`} style={{ width: `${score}%` }} />
                </div>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-2">
              {checks.map((c) => (
                <button
                  key={c.label}
                  type="button"
                  onClick={() => {
                    if (!c.ok) {
                      if (c.label.includes("Analytics") || c.label.includes("Search Console") || c.label.includes("Visible")) setTab("track");
                      else if (c.label.includes("Local") || c.label.includes("Star")) setTab("local");
                      else setTab("meta");
                    }
                  }}
                  className="flex items-center gap-2 text-left rounded-xl border border-slate-100 dark:border-slate-800 px-3 py-2.5 hover:border-lime-300 transition"
                >
                  {c.ok ? <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> : <XCircle className="w-4 h-4 text-slate-300 shrink-0" />}
                  <span className={`text-xs ${c.ok ? "text-slate-600 dark:text-slate-300" : "text-slate-400"}`}>{c.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {tab === "meta" && (
          <div className="space-y-3 max-w-xl">
            <label className="block">
              <span className={labelCls}>Meta title</span>
              <input value={f.title} onChange={(e) => set("title", e.target.value)} className={fieldCls} maxLength={70} />
              <span className="text-[10px] text-slate-400">{f.title.length}/70 — keep under 60</span>
            </label>
            <label className="block">
              <span className={labelCls}>Meta description</span>
              <textarea value={f.description} onChange={(e) => set("description", e.target.value)} rows={3} className={fieldCls} maxLength={200} />
              <span className="text-[10px] text-slate-400">{f.description.length}/200 — aim 140–160</span>
            </label>
            <label className="block">
              <span className={labelCls}>Keywords (comma separated)</span>
              <input value={f.keywords} onChange={(e) => set("keywords", e.target.value)} className={fieldCls} placeholder="plumber in delhi, electrician near me" />
            </label>
            <div className="flex flex-wrap gap-1">
              {[`${bizName}`, `${bizName} near me`, "best", "contact", "services"].slice(0, 4).map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => {
                    const cur = f.keywords.split(",").map((x) => x.trim()).filter(Boolean);
                    if (!cur.includes(k)) set("keywords", [...cur, k].join(", "));
                  }}
                  className="text-[10px] font-semibold rounded-full border border-slate-200 dark:border-slate-600 px-2 py-0.5 text-slate-600 dark:text-slate-300 hover:border-lime-400"
                >
                  + {k}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className={labelCls}>Favicon</span>
                <ImageInput value={f.favicon} onChange={(v) => set("favicon", v)} aspect="aspect-square" />
              </div>
              <div>
                <span className={labelCls}>OG image (1200×630)</span>
                <ImageInput value={f.ogImage} onChange={(v) => set("ogImage", v)} aspect="aspect-video" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className={labelCls}>Twitter / X handle</span>
                <input value={f.twitterHandle} onChange={(e) => set("twitterHandle", e.target.value)} className={fieldCls} placeholder="@yourbusiness" />
              </label>
              <label className="block">
                <span className={labelCls}>OG type</span>
                <select value={f.ogType || "website"} onChange={(e) => set("ogType", e.target.value)} className={fieldCls}>
                  <option value="website">Website</option>
                  <option value="article">Article / Blog</option>
                  <option value="profile">Profile</option>
                </select>
              </label>
            </div>
          </div>
        )}

        {tab === "track" && (
          <div className="space-y-3 max-w-xl">
            <label className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300 rounded-xl border border-slate-100 dark:border-slate-800 px-3 py-2.5">
              <input type="checkbox" checked={f.indexable} onChange={(e) => set("indexable", e.target.checked)} className="rounded" />
              Allow search engines to index this site
            </label>
            {!f.indexable && (
              <p className="text-[11px] text-amber-600 flex items-center gap-1"><Info className="w-3.5 h-3.5" /> Site is hidden from Google until you turn this on.</p>
            )}
            <label className="block">
              <span className={labelCls}>Google Search Console verification</span>
              <input value={f.googleVerification} onChange={(e) => set("googleVerification", e.target.value)} className={fieldCls} placeholder='content="…" value only' />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="block"><span className={labelCls}>GA4</span><input value={f.gaId} onChange={(e) => set("gaId", e.target.value)} className={fieldCls} placeholder="G-XXXXXXXXXX" /></label>
              <label className="block"><span className={labelCls}>Tag Manager</span><input value={f.gtmId} onChange={(e) => set("gtmId", e.target.value)} className={fieldCls} placeholder="GTM-XXXXXX" /></label>
              <label className="block"><span className={labelCls}>Meta Pixel</span><input value={f.fbPixelId} onChange={(e) => set("fbPixelId", e.target.value)} className={fieldCls} placeholder="1234567890" /></label>
              <label className="block"><span className={labelCls}>Clarity</span><input value={f.clarityId} onChange={(e) => set("clarityId", e.target.value)} className={fieldCls} placeholder="abcdefghij" /></label>
              <label className="block sm:col-span-2"><span className={labelCls}>Bing verification</span><input value={f.bingVerification} onChange={(e) => set("bingVerification", e.target.value)} className={fieldCls} /></label>
            </div>
            <label className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
              <input type="checkbox" checked={f.robotsFollow !== false} onChange={(e) => set("robotsFollow", e.target.checked)} className="rounded" />
              Allow following links (recommended)
            </label>
          </div>
        )}

        {tab === "local" && (
          <div className="space-y-3 max-w-xl">
            <p className="text-xs text-slate-500">Structured data for Google rich results — uses your contact details automatically.</p>
            <label className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300 rounded-xl border border-slate-100 dark:border-slate-800 px-3 py-2.5">
              <input type="checkbox" checked={f.localBusiness} onChange={(e) => set("localBusiness", e.target.checked)} className="rounded" />
              Enable local business schema
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className={labelCls}>Business type</span>
                <select value={f.businessType} onChange={(e) => set("businessType", e.target.value)} className={fieldCls}>
                  {BUSINESS_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </label>
              <label className="block"><span className={labelCls}>Price range</span><input value={f.priceRange} onChange={(e) => set("priceRange", e.target.value)} className={fieldCls} placeholder="₹₹" /></label>
              <label className="block"><span className={labelCls}>Latitude</span><input value={f.geoLat} onChange={(e) => set("geoLat", e.target.value)} className={fieldCls} placeholder="28.6139" /></label>
              <label className="block"><span className={labelCls}>Longitude</span><input value={f.geoLng} onChange={(e) => set("geoLng", e.target.value)} className={fieldCls} placeholder="77.2090" /></label>
              <label className="block"><span className={labelCls}>Star rating</span><input value={f.ratingValue} onChange={(e) => set("ratingValue", e.target.value)} className={fieldCls} placeholder="4.8" /></label>
              <label className="block"><span className={labelCls}>Review count</span><input value={f.ratingCount} onChange={(e) => set("ratingCount", e.target.value)} className={fieldCls} placeholder="120" /></label>
            </div>
            <label className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
              <input type="checkbox" checked={f.faqSchema !== false} onChange={(e) => set("faqSchema", e.target.checked)} className="rounded" />
              Auto FAQ rich results
            </label>
          </div>
        )}

        {tab === "index" && (
          <IndexingBody siteUrl={siteUrl} sitemapUrl={sitemapUrl} verified={!!f.googleVerification} />
        )}
      </AdminWorkspace>
    </form>
  );
}

function SeoHiddenFields({ f }: { f: SeoConfig }) {
  return (
    <div className="hidden" aria-hidden>
      <input type="hidden" name="title" value={f.title} />
      <input type="hidden" name="description" value={f.description} />
      <input type="hidden" name="keywords" value={f.keywords} />
      <input type="hidden" name="favicon" value={f.favicon} />
      <input type="hidden" name="ogImage" value={f.ogImage} />
      <input type="hidden" name="twitterHandle" value={f.twitterHandle} />
      <input type="hidden" name="ogType" value={f.ogType || "website"} />
      <input type="hidden" name="googleVerification" value={f.googleVerification} />
      <input type="hidden" name="gaId" value={f.gaId} />
      <input type="hidden" name="gtmId" value={f.gtmId} />
      <input type="hidden" name="fbPixelId" value={f.fbPixelId} />
      <input type="hidden" name="clarityId" value={f.clarityId} />
      <input type="hidden" name="bingVerification" value={f.bingVerification} />
      <input type="hidden" name="businessType" value={f.businessType} />
      <input type="hidden" name="priceRange" value={f.priceRange} />
      <input type="hidden" name="geoLat" value={f.geoLat} />
      <input type="hidden" name="geoLng" value={f.geoLng} />
      <input type="hidden" name="ratingValue" value={f.ratingValue} />
      <input type="hidden" name="ratingCount" value={f.ratingCount} />
      {f.indexable && <input type="hidden" name="indexable" value="on" />}
      {f.robotsFollow !== false && <input type="hidden" name="robotsFollow" value="on" />}
      {f.localBusiness && <input type="hidden" name="localBusiness" value="on" />}
      {f.faqSchema !== false && <input type="hidden" name="faqSchema" value="on" />}
    </div>
  );
}

function Copyable({ text }: { text: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      onClick={() => { navigator.clipboard?.writeText(text); setDone(true); setTimeout(() => setDone(false), 1500); }}
      className="inline-flex items-center gap-1 rounded-lg border border-slate-200 dark:border-slate-600 px-2 py-1 text-[10px] font-semibold hover:bg-slate-50 dark:hover:bg-slate-800"
    >
      {done ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
      {done ? "Copied" : "Copy"}
    </button>
  );
}

function IndexingBody({ siteUrl, sitemapUrl, verified }: { siteUrl: string; sitemapUrl: string; verified: boolean }) {
  const gsc = "https://search.google.com/search-console";
  const inspect = `https://search.google.com/search-console/inspect?resource_id=${encodeURIComponent(siteUrl)}`;

  return (
    <div className="space-y-2 max-w-xl">
      <p className="text-xs text-slate-500 mb-2">Get your site into search results — follow these steps.</p>

      <div className="rounded-xl border border-slate-100 dark:border-slate-800 p-3 flex gap-3">
        {verified ? <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" /> : <Circle className="w-5 h-5 text-slate-300 shrink-0 mt-0.5" />}
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-slate-800 dark:text-white">1. Verify Search Console</p>
          <p className="text-xs text-slate-500 mt-0.5">Add your site, copy the HTML-tag code, paste it under Track → Google verification, then Save.</p>
          <a href={gsc} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-lime-600 hover:underline">Open GSC <ExternalLink className="w-3 h-3" /></a>
        </div>
      </div>

      <div className="rounded-xl border border-slate-100 dark:border-slate-800 p-3 flex gap-3">
        <Circle className="w-5 h-5 text-slate-300 shrink-0 mt-0.5" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-slate-800 dark:text-white">2. Submit sitemap</p>
          <p className="text-xs text-slate-500 mt-0.5">In GSC → Sitemaps, paste and submit:</p>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <code className="flex-1 min-w-0 text-[10px] rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2 py-1.5 break-all text-slate-800 dark:text-slate-100">{sitemapUrl}</code>
            <Copyable text={sitemapUrl} />
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            <a href={sitemapUrl} target="_blank" rel="noreferrer" className="text-[11px] font-semibold text-lime-600 hover:underline inline-flex items-center gap-1">Open sitemap.xml <ExternalLink className="w-3 h-3" /></a>
            <a href={`${siteUrl}/robots.txt`} target="_blank" rel="noreferrer" className="text-[11px] font-semibold text-lime-600 hover:underline inline-flex items-center gap-1">Open robots.txt <ExternalLink className="w-3 h-3" /></a>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-100 dark:border-slate-800 p-3 flex gap-3">
        <Rocket className="w-5 h-5 text-lime-600 shrink-0 mt-0.5" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-slate-800 dark:text-white">3. Instant IndexNow</p>
          <p className="text-xs text-slate-500 mt-0.5">Notify Bing, Yandex &amp; partners about all pages now.</p>
          <IndexNowButton />
        </div>
      </div>

      <div className="rounded-xl border border-slate-100 dark:border-slate-800 p-3 flex gap-3">
        <Circle className="w-5 h-5 text-slate-300 shrink-0 mt-0.5" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-slate-800 dark:text-white">4. Request Google indexing</p>
          <p className="text-xs text-slate-500 mt-0.5">Paste a page URL in GSC → Request indexing for fastest Google pickup.</p>
          <a href={inspect} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-lime-600 hover:underline">URL Inspection <ExternalLink className="w-3 h-3" /></a>
        </div>
      </div>
    </div>
  );
}

function IndexNowButton() {
  const [state, action, pending] = useActionState(submitToIndexNow, { ok: false, message: "" } as IndexState);
  return (
    <div className="mt-2">
      <button
        type="button"
        disabled={pending}
        onClick={() => { void action(new FormData()); }}
        className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 text-white text-xs font-bold px-3 py-2 hover:bg-slate-800 disabled:opacity-60"
      >
        <Rocket className="w-3.5 h-3.5" /> {pending ? "Submitting…" : "Submit site"}
      </button>
      {state.message && (
        <p className={`text-[11px] flex items-center gap-1 mt-2 ${state.ok ? "text-emerald-600" : "text-amber-600"}`}>
          {state.ok ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
          {state.message}
        </p>
      )}
    </div>
  );
}
