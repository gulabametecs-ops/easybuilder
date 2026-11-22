"use client";

import { useActionState, useState, useTransition } from "react";
import {
  Search, Globe, BarChart3, MapPin, Gauge, CheckCircle2, XCircle, Info,
  Rocket, Circle, ExternalLink, Copy, Check, AlertCircle, Eye, Puzzle,
  FileText, Monitor, Smartphone, ChevronRight, X,
} from "lucide-react";
import Link from "next/link";
import { saveSeo, savePageSeo } from "@/lib/actions/appearance";
import { DESC_RANGE, TITLE_RANGE, keywordHints, lengthStatus, type PageAudit } from "@/lib/seoAudit";
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
  { id: "pages", label: "Pages", hint: "Per page", icon: FileText },
  { id: "track", label: "Track", hint: "Analytics", icon: BarChart3 },
  { id: "local", label: "Local", hint: "Maps", icon: MapPin },
  { id: "index", label: "Index", hint: "Google", icon: Rocket },
] as const;

type TabId = (typeof TABS)[number]["id"];

export type SiteCheck = { label: string; ok: boolean; hint: string; href?: string; tab?: string };

const LEN_TONE = { good: "text-emerald-600", short: "text-amber-600", long: "text-rose-600", empty: "text-slate-400" } as const;
function LenHint({ len, range }: { len: number; range: readonly [number, number] }) {
  const st = lengthStatus(len, range);
  return (
    <span className={`text-[10px] ${LEN_TONE[st]}`}>
      {len} chars — {st === "good" ? "perfect" : st === "empty" ? "empty" : st === "short" ? "a bit short" : "too long, Google will cut it"} (aim {range[0]}–{range[1]})
    </span>
  );
}

export function SeoManager({
  seo,
  siteUrl,
  bizName,
  sitemapUrl,
  searchConsoleVerified,
  siteChecks,
  pages,
  contact,
}: {
  seo: SeoConfig;
  siteUrl: string;
  bizName: string;
  sitemapUrl: string;
  /** From Integrations (with legacy SEO fallback). */
  searchConsoleVerified: boolean;
  /** Server-computed checks over pages, integrations and domain. */
  siteChecks: SiteCheck[];
  pages: PageAudit[];
  contact: { phone: string; address: string };
}) {
  const [tab, setTab] = useState<TabId>("score");
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");
  const [f, setF] = useState<SeoConfig>(seo);
  const set = (k: keyof SeoConfig, v: string | boolean) => setF((s) => ({ ...s, [k]: v }));
  const host = siteUrl.replace(/^https?:\/\//, "");

  // Live (form) checks + server checks over pages / integrations / domain.
  const checks: SiteCheck[] = [
    { ok: lengthStatus(f.title.length, TITLE_RANGE) === "good", label: `Site title ${TITLE_RANGE[0]}–${TITLE_RANGE[1]} chars`, hint: "Edit under Meta", tab: "meta" },
    { ok: lengthStatus(f.description.length, DESC_RANGE) === "good", label: `Meta description ${DESC_RANGE[0]}–${DESC_RANGE[1]} chars`, hint: "Edit under Meta", tab: "meta" },
    { ok: !!f.keywords, label: "Keywords added", hint: "Edit under Meta", tab: "meta" },
    { ok: !!f.ogImage, label: "Social share image", hint: "Edit under Meta", tab: "meta" },
    { ok: !!f.favicon, label: "Favicon set", hint: "Edit under Meta", tab: "meta" },
    { ok: f.indexable !== false, label: "Visible to search engines", hint: "Turn on under Track", tab: "track" },
    { ok: f.localBusiness && !!(f.geoLat && f.geoLng), label: "Local business + location", hint: "Fill in under Local", tab: "local" },
    { ok: !!(f.ratingValue && f.ratingCount), label: "Star rating (rich results)", hint: "Fill in under Local", tab: "local" },
    ...siteChecks.filter((c) => c.label !== "Sitemap & robots.txt live"),
    { ...siteChecks.find((c) => c.label === "Sitemap & robots.txt live")!, ok: f.indexable !== false },
  ].filter((c) => c.label);
  const score = Math.round((checks.filter((c) => c.ok).length / checks.length) * 100);
  const tone = score >= 80 ? "text-emerald-600" : score >= 50 ? "text-amber-500" : "text-rose-500";
  const bar = score >= 80 ? "bg-emerald-500" : score >= 50 ? "bg-amber-500" : "bg-rose-500";

  return (
    <form action={saveSeo} className="flex flex-col flex-1 min-h-0">
      <AdminWorkspace
        title="SEO"
        subtitle="How your site appears on Google — titles, keywords and indexing."
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
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Google result</p>
                  <div className="flex rounded-lg bg-slate-100 dark:bg-slate-800 p-0.5">
                    {(["desktop", "mobile"] as const).map((d) => (
                      <button key={d} type="button" onClick={() => setDevice(d)} aria-label={`${d} preview`}
                        className={`rounded-md p-1 ${device === d ? "bg-white dark:bg-slate-700 shadow-sm text-slate-800 dark:text-white" : "text-slate-400"}`}>
                        {d === "desktop" ? <Monitor className="w-3.5 h-3.5" /> : <Smartphone className="w-3.5 h-3.5" />}
                      </button>
                    ))}
                  </div>
                </div>
                <GooglePreview device={device} host={host} path="" title={f.title || bizName} description={f.description} favicon={f.favicon} />
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
              {[...checks].sort((a, b) => Number(a.ok) - Number(b.ok)).map((c) => {
                const inner = (
                  <>
                    {c.ok ? <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> : <XCircle className="w-4 h-4 text-rose-400 shrink-0" />}
                    <span className="flex-1 min-w-0">
                      <span className={`block text-xs ${c.ok ? "text-slate-600 dark:text-slate-300" : "font-semibold text-slate-800 dark:text-slate-100"}`}>{c.label}</span>
                      {!c.ok && <span className="block text-[10px] text-slate-400">{c.hint}</span>}
                    </span>
                    {!c.ok && <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />}
                  </>
                );
                const cls = "flex items-center gap-2 text-left rounded-xl border border-slate-100 dark:border-slate-800 px-3 py-2.5 hover:border-lime-300 transition";
                return c.href && !c.ok ? (
                  <Link key={c.label} href={c.href} className={cls}>{inner}</Link>
                ) : (
                  <button key={c.label} type="button" onClick={() => { if (!c.ok && c.tab) setTab(c.tab as TabId); }} className={cls}>{inner}</button>
                );
              })}
            </div>
          </div>
        )}

        {tab === "meta" && (
          <div className="space-y-3 max-w-xl">
            <label className="block">
              <span className={labelCls}>Meta title</span>
              <input value={f.title} onChange={(e) => set("title", e.target.value)} className={fieldCls} maxLength={70} />
              <LenHint len={f.title.length} range={TITLE_RANGE} />
            </label>
            <label className="block">
              <span className={labelCls}>Meta description</span>
              <textarea value={f.description} onChange={(e) => set("description", e.target.value)} rows={3} className={fieldCls} maxLength={200} />
              <LenHint len={f.description.length} range={DESC_RANGE} />
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
            <Link
              href="/admin/integrations"
              className="flex items-center gap-3 rounded-xl border border-slate-100 dark:border-slate-800 px-3 py-3 hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors"
            >
              <Puzzle className="w-5 h-5 text-emerald-600 shrink-0" />
              <span className="flex-1 min-w-0">
                <span className="block text-sm font-semibold text-slate-800 dark:text-slate-100">Analytics &amp; verification</span>
                <span className="block text-[11px] text-slate-500">Google Analytics, Tag Manager, Meta Pixel, Clarity and Search Console / Bing verification now live in Integrations.</span>
              </span>
              <span className="text-xs font-semibold text-emerald-600 shrink-0">Manage in Integrations →</span>
            </Link>
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
              <label className="block col-span-2"><span className={labelCls}>Business name (as on Google)</span><input value={f.lbName ?? ""} onChange={(e) => set("lbName", e.target.value)} className={fieldCls} placeholder={bizName} /></label>
              <label className="block col-span-2"><span className={labelCls}>Address</span><input value={f.lbAddress ?? ""} onChange={(e) => set("lbAddress", e.target.value)} className={fieldCls} placeholder={contact.address || "Shop 4, MG Road, Pune 411001"} /></label>
              <label className="block"><span className={labelCls}>Phone</span><input value={f.lbPhone ?? ""} onChange={(e) => set("lbPhone", e.target.value)} className={fieldCls} placeholder={contact.phone || "+91 98765 43210"} /></label>
              <label className="block"><span className={labelCls}>Google Maps link</span><input value={f.mapUrl ?? ""} onChange={(e) => set("mapUrl", e.target.value)} className={fieldCls} placeholder="https://maps.app.goo.gl/…" /></label>
              <label className="block col-span-2">
                <span className={labelCls}>Opening hours (one per line)</span>
                <textarea value={f.openingHours ?? ""} onChange={(e) => set("openingHours", e.target.value)} rows={3} className={`${fieldCls} font-mono`} placeholder={"Mo-Sa 09:00-19:00\nSu 10:00-14:00"} />
                <span className="text-[10px] text-slate-400">Format: days + 24h times, e.g. <code>Mo-Fr 09:00-18:00</code>. Lines in another format are skipped.</span>
              </label>
            </div>
            <p className="text-[11px] text-slate-400">Blank name / address / phone use your header &amp; footer contact details. Emitted as schema.org JSON-LD on every page.</p>
            <label className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
              <input type="checkbox" checked={f.faqSchema !== false} onChange={(e) => set("faqSchema", e.target.checked)} className="rounded" />
              Auto FAQ rich results
            </label>
          </div>
        )}

        {tab === "index" && (
          <IndexingBody siteUrl={siteUrl} sitemapUrl={sitemapUrl} verified={searchConsoleVerified} indexNowAt={f.indexNowAt} />
        )}

        {tab === "pages" && <PagesTab pages={pages} host={host} />}
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
      <input type="hidden" name="businessType" value={f.businessType} />
      <input type="hidden" name="priceRange" value={f.priceRange} />
      <input type="hidden" name="geoLat" value={f.geoLat} />
      <input type="hidden" name="geoLng" value={f.geoLng} />
      <input type="hidden" name="ratingValue" value={f.ratingValue} />
      <input type="hidden" name="ratingCount" value={f.ratingCount} />
      <input type="hidden" name="lbName" value={f.lbName ?? ""} />
      <input type="hidden" name="lbAddress" value={f.lbAddress ?? ""} />
      <input type="hidden" name="lbPhone" value={f.lbPhone ?? ""} />
      <input type="hidden" name="mapUrl" value={f.mapUrl ?? ""} />
      <input type="hidden" name="openingHours" value={f.openingHours ?? ""} />
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

function IndexingBody({ siteUrl, sitemapUrl, verified, indexNowAt }: { siteUrl: string; sitemapUrl: string; verified: boolean; indexNowAt?: string }) {
  const gsc = "https://search.google.com/search-console";
  const inspect = `https://search.google.com/search-console/inspect?resource_id=${encodeURIComponent(siteUrl)}`;

  return (
    <div className="space-y-2 max-w-xl">
      <p className="text-xs text-slate-500 mb-2">Get your site into search results — follow these steps.</p>

      <div className="rounded-xl border border-slate-100 dark:border-slate-800 p-3 flex gap-3">
        {verified ? <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" /> : <Circle className="w-5 h-5 text-slate-300 shrink-0 mt-0.5" />}
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-slate-800 dark:text-white">1. Verify Search Console</p>
          <p className="text-xs text-slate-500 mt-0.5">Add your site in Search Console, copy the HTML-tag code and paste it in <Link href="/admin/integrations" className="font-semibold text-lime-600 hover:underline">Integrations → Google Search Console</Link>.</p>
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
          <p className="text-[11px] text-slate-400 mt-0.5">{indexNowAt ? `Last submitted ${new Date(indexNowAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}` : "Not submitted yet."}</p>
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

function GooglePreview({ device, host, path, title, description, favicon }: { device: "desktop" | "mobile"; host: string; path: string; title: string; description: string; favicon?: string }) {
  const mobile = device === "mobile";
  // Google truncates roughly by pixel width; character caps are a good approximation.
  const t = title.length > (mobile ? 78 : 60) ? `${title.slice(0, mobile ? 75 : 57)}…` : title;
  const d = description.length > (mobile ? 120 : 158) ? `${description.slice(0, mobile ? 117 : 155)}…` : description;
  return (
    <div className={`rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#202124] ${mobile ? "p-3 max-w-[300px] mx-auto shadow-sm" : "p-3"}`}>
      <div className="flex items-center gap-2">
        <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-700 grid place-items-center overflow-hidden shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {favicon ? <img src={favicon} alt="" className="w-4 h-4 object-contain" /> : <Globe className="w-3.5 h-3.5 text-slate-400" />}
        </span>
        <span className="min-w-0">
          <span className="block text-[11px] text-slate-800 dark:text-slate-200 truncate">{host.split(".")[0]}</span>
          <span className="block text-[10px] text-slate-500 truncate">https://{host}{path && path !== "/" ? ` › ${path.replace(/^\//, "")}` : ""}</span>
        </span>
      </div>
      <p className={`text-[#1a0dab] dark:text-[#8ab4f8] leading-snug mt-1.5 ${mobile ? "text-[15px]" : "text-lg"}`}>{t}</p>
      <p className={`text-slate-600 dark:text-[#bdc1c6] mt-0.5 ${mobile ? "text-[12px]" : "text-[13px]"}`}>
        {d || <span className="italic text-slate-400">Google will pick text from the page — add a description to control this.</span>}
      </p>
    </div>
  );
}

const PAGE_TONE = {
  good: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300",
  warn: "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300",
  bad: "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300",
} as const;

function PagesTab({ pages, host }: { pages: PageAudit[]; host: string }) {
  const [editId, setEditId] = useState<string | null>(null);
  const editing = pages.find((p) => p.id === editId) ?? null;
  const counts = { good: 0, warn: 0, bad: 0 };
  pages.forEach((p) => counts[p.status]++);
  if (!pages.length) return <p className="text-sm text-slate-500">No pages yet — create some under Pages.</p>;
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2 text-[11px] font-semibold">
        <span className={`rounded-full px-2.5 py-1 ${PAGE_TONE.good}`}>{counts.good} good</span>
        <span className={`rounded-full px-2.5 py-1 ${PAGE_TONE.warn}`}>{counts.warn} to improve</span>
        <span className={`rounded-full px-2.5 py-1 ${PAGE_TONE.bad}`}>{counts.bad} need attention</span>
      </div>
      <div className="rounded-xl border border-slate-100 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden">
        {pages.map((p) => (
          <div key={p.id} className="flex flex-col sm:flex-row sm:items-center gap-2 px-3 py-2.5 hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2 flex-wrap">
                {p.name}
                <span className="text-[10px] font-mono font-normal text-slate-400">{p.path}</span>
                {!p.published && <span className="text-[10px] font-semibold rounded bg-slate-100 dark:bg-slate-800 text-slate-500 px-1.5">Draft</span>}
                {p.noindex && <span className="text-[10px] font-semibold rounded bg-slate-100 dark:bg-slate-800 text-slate-500 px-1.5">noindex</span>}
              </p>
              <p className="text-[11px] text-slate-500 truncate">{p.effectiveTitle}</p>
              {p.issues.length > 0 && <p className="text-[10px] text-slate-400 truncate">{p.issues.slice(0, 2).join(" · ")}{p.issues.length > 2 ? ` · +${p.issues.length - 2} more` : ""}</p>}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {p.focusKeyword && <span className="text-[10px] rounded-full bg-lime-50 dark:bg-lime-950/40 text-lime-700 dark:text-lime-300 px-2 py-0.5 max-w-[10rem] truncate">🎯 {p.focusKeyword}</span>}
              <span className={`text-[10px] font-bold rounded-full px-2 py-0.5 ${PAGE_TONE[p.status]}`}>
                {p.status === "good" ? "Good" : p.status === "warn" ? `${p.issues.length} tip${p.issues.length > 1 ? "s" : ""}` : "Fix"}
              </span>
              <button type="button" onClick={() => setEditId(p.id)} className="rounded-lg border border-slate-200 dark:border-slate-700 px-2.5 py-1 text-[11px] font-semibold hover:border-lime-400">
                Quick edit
              </button>
            </div>
          </div>
        ))}
      </div>
      {editing && <PageEditor key={editing.id} page={editing} host={host} onClose={() => setEditId(null)} />}
    </div>
  );
}

function PageEditor({ page, host, onClose }: { page: PageAudit; host: string; onClose: () => void }) {
  const [v, setV] = useState({ seoTitle: page.seoTitle, seoDescription: page.seoDescription, focusKeyword: page.focusKeyword, noindex: page.noindex });
  const [msg, setMsg] = useState<{ ok: boolean; message: string } | null>(null);
  const [pending, start] = useTransition();
  const title = v.seoTitle || page.effectiveTitle;
  const desc = v.seoDescription || page.effectiveDescription;
  const hints = keywordHints({ effectiveTitle: title, effectiveDescription: desc, text: page.text, path: page.path }, v.focusKeyword);
  const noEnter = (e: React.KeyboardEvent) => { if (e.key === "Enter" && !(e.target instanceof HTMLTextAreaElement)) e.preventDefault(); };
  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true" aria-label={`SEO for ${page.name}`} onKeyDown={noEnter}>
      <button type="button" aria-label="Close" onClick={onClose} className="absolute inset-0 bg-slate-950/40" />
      <div className="relative w-full sm:max-w-md h-full bg-white dark:bg-slate-900 shadow-2xl flex flex-col">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
          <FileText className="w-4 h-4 text-lime-600" />
          <p className="font-semibold text-sm text-slate-900 dark:text-white flex-1 truncate">{page.name} <span className="font-mono text-[11px] text-slate-400">{page.path}</span></p>
          <button type="button" onClick={onClose} aria-label="Close" className="p-1 rounded text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"><X className="w-4 h-4" /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <GooglePreview device="desktop" host={host} path={page.path} title={title} description={desc} />
          <label className="block">
            <span className={labelCls}>SEO title</span>
            <input value={v.seoTitle} onChange={(e) => setV({ ...v, seoTitle: e.target.value })} maxLength={120} className={fieldCls} placeholder={page.effectiveTitle} />
            <LenHint len={title.length} range={TITLE_RANGE} />
          </label>
          <label className="block">
            <span className={labelCls}>Meta description</span>
            <textarea value={v.seoDescription} onChange={(e) => setV({ ...v, seoDescription: e.target.value })} maxLength={320} rows={3} className={fieldCls} placeholder={page.effectiveDescription || "Describe this page in one or two sentences."} />
            <LenHint len={desc.length} range={DESC_RANGE} />
          </label>
          <label className="block">
            <span className={labelCls}>Focus keyword</span>
            <input value={v.focusKeyword} onChange={(e) => setV({ ...v, focusKeyword: e.target.value })} maxLength={80} className={fieldCls} placeholder="e.g. plumber in pune" />
          </label>
          {hints.length > 0 && (
            <ul className="grid grid-cols-1 gap-1">
              {hints.map((h) => (
                <li key={h.label} className="flex items-center gap-1.5 text-[11px] text-slate-600 dark:text-slate-300">
                  {h.ok ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : <AlertCircle className="w-3.5 h-3.5 text-amber-500" />} {h.label}
                </li>
              ))}
            </ul>
          )}
          <label className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
            <input type="checkbox" checked={v.noindex} onChange={(e) => setV({ ...v, noindex: e.target.checked })} className="rounded" />
            Hide this page from search engines (noindex)
          </label>
          <div>
            <p className={labelCls}>Checks</p>
            {page.issues.length ? (
              <ul className="space-y-1">
                {page.issues.map((i) => <li key={i} className="text-[11px] text-slate-500 flex gap-1.5"><Info className="w-3.5 h-3.5 shrink-0 text-amber-500" /> {i}</li>)}
              </ul>
            ) : <p className="text-[11px] text-emerald-600">All page checks pass.</p>}
            <p className="text-[10px] text-slate-400 mt-1">{page.words} words on this page · checks refresh after saving.</p>
          </div>
        </div>
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
          {msg && <p className={`text-[11px] flex-1 ${msg.ok ? "text-emerald-600" : "text-rose-600"}`}>{msg.message}</p>}
          <button
            type="button"
            disabled={pending}
            onClick={() => start(async () => { const res = await savePageSeo({ id: page.id, ...v }); setMsg(res); })}
            className="ml-auto rounded-lg bg-lime-500 text-white text-xs font-bold px-4 py-2 hover:bg-lime-600 disabled:opacity-60"
          >
            {pending ? "Saving…" : "Save page SEO"}
          </button>
        </div>
      </div>
    </div>
  );
}
