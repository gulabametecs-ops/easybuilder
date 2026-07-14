"use client";

import { useState } from "react";
import { saveSeo } from "@/lib/actions/appearance";
import { Card, SaveBar } from "./ui";
import { ImageInput } from "./ImageInput";
import { Search, Share2, Globe, BarChart3, MapPin, Info } from "lucide-react";
import type { SeoConfig } from "@/lib/config";

const inputCls = "w-full rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-800 px-3.5 py-2.5 text-sm outline-none focus:border-lime-500";
const lbl = "block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1";

const BUSINESS_TYPES = ["LocalBusiness", "Restaurant", "Store", "MedicalBusiness", "Dentist", "HealthClub", "ProfessionalService", "HomeAndConstructionBusiness", "EducationalOrganization", "Electrician", "Plumber", "GeneralContractor"];

export function SeoManager({ seo, siteUrl, bizName }: { seo: SeoConfig; siteUrl: string; bizName: string }) {
  const [f, setF] = useState<SeoConfig>(seo);
  const set = (k: keyof SeoConfig, v: string | boolean) => setF((s) => ({ ...s, [k]: v }));
  const host = siteUrl.replace(/^https?:\/\//, "");

  return (
    <form action={saveSeo} className="space-y-6 max-w-3xl">
      {/* ── Live previews ─────────────────────────────── */}
      <Card className="p-6">
        <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2 mb-4"><Search className="w-5 h-5 text-lime-600" /> Search &amp; social preview</h3>

        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Google result</p>
        <div className="rounded-lg border border-slate-200 dark:border-slate-700 p-4 bg-white dark:bg-slate-900">
          <p className="text-xs text-slate-500">{host}</p>
          <p className="text-[#1a0dab] dark:text-blue-400 text-lg leading-tight truncate">{f.title || bizName}</p>
          <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">{f.description || "Add a meta description to control what shows here."}</p>
        </div>

        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mt-5 mb-2">Social share card</p>
        <div className="rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden max-w-md">
          <div className="aspect-[1.91/1] bg-slate-100 dark:bg-slate-800">
            {f.ogImage ? <img src={f.ogImage} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm">Add an Open Graph image (1200×630)</div>}
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-800">
            <p className="text-xs text-slate-400 uppercase">{host}</p>
            <p className="font-semibold text-slate-800 dark:text-slate-100 text-sm truncate">{f.title || bizName}</p>
            <p className="text-xs text-slate-500 line-clamp-1">{f.description}</p>
          </div>
        </div>
      </Card>

      {/* ── Basics ────────────────────────────────────── */}
      <Card className="p-6 space-y-4">
        <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2"><Globe className="w-5 h-5 text-lime-600" /> Meta &amp; sharing</h3>
        <label className="block"><span className={lbl}>Default meta title</span>
          <input name="title" value={f.title} onChange={(e) => set("title", e.target.value)} className={inputCls} maxLength={70} />
          <span className="text-xs text-slate-400">{f.title.length}/70 — keep under 60 for best results.</span>
        </label>
        <label className="block"><span className={lbl}>Meta description</span>
          <textarea name="description" value={f.description} onChange={(e) => set("description", e.target.value)} rows={3} className={inputCls} maxLength={200} />
          <span className="text-xs text-slate-400">{f.description.length}/200 — aim for 140–160.</span>
        </label>
        <label className="block"><span className={lbl}>Keywords (comma separated)</span>
          <input name="keywords" value={f.keywords} onChange={(e) => set("keywords", e.target.value)} className={inputCls} placeholder="plumber in delhi, electrician near me" />
        </label>
        <div className="grid sm:grid-cols-2 gap-4">
          <div><span className={lbl}>Favicon (browser tab icon)</span>
            <input type="hidden" name="favicon" value={f.favicon} />
            <ImageInput value={f.favicon} onChange={(v) => set("favicon", v)} aspect="aspect-square" />
          </div>
          <div><span className={lbl}>Open Graph image (1200×630)</span>
            <input type="hidden" name="ogImage" value={f.ogImage} />
            <ImageInput value={f.ogImage} onChange={(v) => set("ogImage", v)} aspect="aspect-video" />
          </div>
        </div>
        <label className="block"><span className={lbl}>Twitter / X handle</span>
          <input name="twitterHandle" value={f.twitterHandle} onChange={(e) => set("twitterHandle", e.target.value)} className={inputCls} placeholder="@yourbusiness" />
        </label>
      </Card>

      {/* ── Search engines / analytics ────────────────── */}
      <Card className="p-6 space-y-4">
        <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2"><BarChart3 className="w-5 h-5 text-lime-600" /> Search engines &amp; analytics</h3>
        <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
          <input type="checkbox" name="indexable" checked={f.indexable} onChange={(e) => set("indexable", e.target.checked)} className="rounded" />
          Allow search engines to index this website
        </label>
        {!f.indexable && <p className="text-xs text-amber-600 flex items-center gap-1"><Info className="w-3.5 h-3.5" /> Your site is hidden from Google. Turn this on when you&apos;re ready to go live.</p>}
        <label className="block"><span className={lbl}>Google Search Console — verification code</span>
          <input name="googleVerification" value={f.googleVerification} onChange={(e) => set("googleVerification", e.target.value)} className={inputCls} placeholder="Paste the content value of the meta tag" />
          <span className="text-xs text-slate-400">Search Console → “HTML tag” method → paste only the code inside content=&quot;…&quot;.</span>
        </label>
        <label className="block"><span className={lbl}>Google Analytics 4 — Measurement ID</span>
          <input name="gaId" value={f.gaId} onChange={(e) => set("gaId", e.target.value)} className={inputCls} placeholder="G-XXXXXXXXXX" />
          <span className="text-xs text-slate-400">Analytics will start tracking visitors automatically once added.</span>
        </label>
      </Card>

      {/* ── Local business structured data ────────────── */}
      <Card className="p-6 space-y-4">
        <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2"><MapPin className="w-5 h-5 text-lime-600" /> Local business (Google rich results)</h3>
        <p className="text-sm text-slate-500">Adds structured data so Google can show your business name, rating, hours and location. Uses your header/footer contact details automatically.</p>
        <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
          <input type="checkbox" name="localBusiness" checked={f.localBusiness} onChange={(e) => set("localBusiness", e.target.checked)} className="rounded" />
          Enable local business structured data
        </label>
        <div className="grid sm:grid-cols-2 gap-4">
          <label className="block"><span className={lbl}>Business type</span>
            <select name="businessType" value={f.businessType} onChange={(e) => set("businessType", e.target.value)} className={inputCls}>
              {BUSINESS_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </label>
          <label className="block"><span className={lbl}>Price range</span>
            <input name="priceRange" value={f.priceRange} onChange={(e) => set("priceRange", e.target.value)} className={inputCls} placeholder="₹₹" />
          </label>
          <label className="block"><span className={lbl}>Latitude (optional)</span>
            <input name="geoLat" value={f.geoLat} onChange={(e) => set("geoLat", e.target.value)} className={inputCls} placeholder="28.6139" />
          </label>
          <label className="block"><span className={lbl}>Longitude (optional)</span>
            <input name="geoLng" value={f.geoLng} onChange={(e) => set("geoLng", e.target.value)} className={inputCls} placeholder="77.2090" />
          </label>
        </div>
      </Card>

      <SaveBar label="Save SEO settings" />
    </form>
  );
}
