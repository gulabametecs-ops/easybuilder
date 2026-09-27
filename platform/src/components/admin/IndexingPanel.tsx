"use client";

import { useActionState } from "react";
import { Rocket, CheckCircle2, Circle, ExternalLink, Copy, Check, AlertCircle } from "lucide-react";
import { useState } from "react";
import { submitToIndexNow, type IndexState } from "@/lib/actions/seoIndex";
import { Card } from "./ui";

const init: IndexState = { ok: false, message: "" };

function Copyable({ text }: { text: string }) {
  const [done, setDone] = useState(false);
  return <button type="button" onClick={() => { navigator.clipboard?.writeText(text); setDone(true); setTimeout(() => setDone(false), 1500); }} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 dark:border-slate-600 px-2.5 py-1.5 text-xs font-medium hover:bg-slate-50 dark:hover:bg-slate-800">{done ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />} {done ? "Copied" : "Copy"}</button>;
}

export function IndexingPanel({ siteUrl, sitemapUrl, verified }: { siteUrl: string; sitemapUrl: string; verified: boolean }) {
  const [state, action, pending] = useActionState(submitToIndexNow, init);
  const gsc = "https://search.google.com/search-console";
  const inspect = `https://search.google.com/search-console/inspect?resource_id=${encodeURIComponent(siteUrl)}`;

  return (
    <Card className="p-6 max-w-3xl">
      <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2 mb-1"><Rocket className="w-5 h-5 text-lime-600" /> Get on Google &amp; search engines</h3>
      <p className="text-sm text-slate-500 mb-5">Submit your website so it starts appearing in search results.</p>

      <ol className="space-y-5">
        {/* Step 1 */}
        <li className="flex gap-3">
          {verified ? <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 shrink-0" /> : <Circle className="w-5 h-5 text-slate-300 mt-0.5 shrink-0" />}
          <div className="flex-1">
            <p className="font-semibold text-slate-800 dark:text-slate-100 text-sm">1. Verify in Google Search Console {verified && <span className="text-green-600 text-xs font-bold">· code added ✓</span>}</p>
            <p className="text-sm text-slate-500 mt-0.5">Open Search Console, add your site, copy the <b>HTML tag</b> code and paste it in the field above (Google Search Console verification), then Save.</p>
            <a href={gsc} target="_blank" className="mt-2 inline-flex items-center gap-1.5 rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-1.5 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800">Open Search Console <ExternalLink className="w-3.5 h-3.5" /></a>
          </div>
        </li>

        {/* Step 2 */}
        <li className="flex gap-3">
          <Circle className="w-5 h-5 text-slate-300 mt-0.5 shrink-0" />
          <div className="flex-1">
            <p className="font-semibold text-slate-800 dark:text-slate-100 text-sm">2. Submit your sitemap</p>
            <p className="text-sm text-slate-500 mt-0.5">In Search Console → <b>Sitemaps</b>, paste this and click Submit:</p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <code className="flex-1 min-w-[180px] rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-1.5 text-xs break-all">{sitemapUrl}</code>
              <Copyable text={sitemapUrl} />
            </div>
          </div>
        </li>

        {/* Step 3 — IndexNow instant submit */}
        <li className="flex gap-3">
          <Rocket className="w-5 h-5 text-lime-600 mt-0.5 shrink-0" />
          <div className="flex-1">
            <p className="font-semibold text-slate-800 dark:text-slate-100 text-sm">3. Instant index — submit now</p>
            <p className="text-sm text-slate-500 mt-0.5">Instantly notify search engines (Bing, Yandex &amp; partners) about all your pages — right from here.</p>
            <form action={action} className="mt-2">
              <button disabled={pending} className="inline-flex items-center gap-2 rounded-lg bg-slate-900 text-white text-sm font-semibold px-4 py-2 hover:bg-slate-800 disabled:opacity-60"><Rocket className="w-4 h-4" /> {pending ? "Submitting…" : "Submit my site to search engines"}</button>
            </form>
            {state.message && <p className={`text-sm flex items-center gap-1.5 mt-2 ${state.ok ? "text-green-600" : "text-amber-600"}`}>{state.ok ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}{state.message}</p>}
          </div>
        </li>

        {/* Step 4 — Google request indexing */}
        <li className="flex gap-3">
          <Circle className="w-5 h-5 text-slate-300 mt-0.5 shrink-0" />
          <div className="flex-1">
            <p className="font-semibold text-slate-800 dark:text-slate-100 text-sm">4. Ask Google to index (fastest)</p>
            <p className="text-sm text-slate-500 mt-0.5">In Search Console, paste your page URL in the top search bar → <b>Request Indexing</b>. Google usually indexes within a day.</p>
            <a href={inspect} target="_blank" className="mt-2 inline-flex items-center gap-1.5 rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-1.5 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800">URL Inspection <ExternalLink className="w-3.5 h-3.5" /></a>
          </div>
        </li>
      </ol>
    </Card>
  );
}
