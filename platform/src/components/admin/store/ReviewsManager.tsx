"use client";

import { useState, useTransition } from "react";
import { MessageSquareText, Star, Check, EyeOff, Trash2, BadgeCheck, ExternalLink } from "lucide-react";
import { setReviewStatus, deleteReviews } from "@/lib/actions/storeCatalogAdmin";
import { productHref } from "@/lib/store";
import { Card, EmptyState, PageHeader, StatCard, Badge } from "../ui";

type AdminReview = {
  id: string; name: string; rating: number; title: string; body: string; status: string; verified: boolean; createdAt: string; mine: boolean;
  product: { name: string; slug: string; image: string };
};

const TABS = [
  { id: "pending", label: "Pending" },
  { id: "approved", label: "Approved" },
  { id: "hidden", label: "Hidden" },
  { id: "all", label: "All" },
] as const;

export function Stars({ n, className = "w-4 h-4" }: { n: number; className?: string }) {
  return (
    <span className="inline-flex" aria-label={`${n} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => <Star key={i} className={`${className} ${i <= Math.round(n) ? "text-amber-500 fill-amber-400" : "text-slate-300 dark:text-slate-600"}`} />)}
    </span>
  );
}

export function ReviewsManager({ reviews, demo }: { reviews: AdminReview[]; demo: boolean }) {
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>(reviews.some((r) => r.status === "pending") ? "pending" : "all");
  const [pending, start] = useTransition();
  const list = reviews.filter((r) => tab === "all" || r.status === tab);
  const approved = reviews.filter((r) => r.status === "approved");
  const avg = approved.length ? approved.reduce((n, r) => n + r.rating, 0) / approved.length : 0;
  const run = (fn: () => Promise<{ ok: boolean; error?: string }>) =>
    start(async () => {
      const r = await fn().catch((e: unknown) => ({ ok: false, error: e instanceof Error ? e.message : "Something went wrong" }));
      if (!r.ok && r.error) alert(r.error);
    });
  const date = (iso: string) => new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

  return (
    <div className={`space-y-4 ${pending ? "opacity-70 pointer-events-none" : ""}`}>
      <PageHeader icon={<MessageSquareText />} title="Reviews" subtitle="Approve reviews before they show on your product pages. “Verified” = the reviewer has a delivered order." />
      {demo && <p className="rounded-xl bg-violet-50 dark:bg-violet-500/10 text-violet-700 dark:text-violet-300 text-xs px-3 py-2">Demo: write a review on any product page of the demo store, then moderate it here.</p>}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        <StatCard label="Waiting for approval" value={reviews.filter((r) => r.status === "pending").length} icon={<MessageSquareText />} tone="amber" />
        <StatCard label="Live reviews" value={approved.length} icon={<Check />} tone="green" />
        <StatCard label="Average rating" value={avg ? `${avg.toFixed(1)} ★` : "—"} icon={<Star />} tone="violet" />
      </div>
      <div className="flex gap-2 overflow-x-auto">
        {TABS.map((t) => {
          const n = t.id === "all" ? reviews.length : reviews.filter((r) => r.status === t.id).length;
          return (
            <button key={t.id} type="button" onClick={() => setTab(t.id)} className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${tab === t.id ? "admin-grad shadow-sm" : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:border-lime-400"}`}>
              {t.label}<span className="ml-1 opacity-70">{n}</span>
            </button>
          );
        })}
      </div>
      <Card className="overflow-hidden">
        {list.length === 0 ? (
          <EmptyState icon={<MessageSquareText />} title={reviews.length ? "Nothing here" : "No reviews yet"} hint="Shoppers can review any product from its page. New reviews wait here for your approval." />
        ) : (
          <ul className="divide-y divide-slate-100 dark:divide-white/5">
            {list.map((r) => (
              <li key={r.id} className="p-4 flex flex-col sm:flex-row gap-3">
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Stars n={r.rating} />
                    {r.title && <span className="font-semibold text-sm text-slate-900 dark:text-white">{r.title}</span>}
                    <Badge tone={r.status === "approved" ? "green" : r.status === "hidden" ? "slate" : "amber"}>{r.status}</Badge>
                    {r.verified && <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600"><BadgeCheck className="w-3.5 h-3.5" /> Verified buyer</span>}
                  </div>
                  <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-line">{r.body}</p>
                  <p className="text-xs text-slate-500">
                    {r.name} · {date(r.createdAt)} · on{" "}
                    <a href={productHref(r.product.slug)} target="_blank" rel="noreferrer" className="font-semibold hover:text-lime-600 inline-flex items-center gap-0.5">{r.product.name}<ExternalLink className="w-3 h-3" /></a>
                  </p>
                </div>
                <div className="flex sm:flex-col gap-1.5 shrink-0">
                  {r.status !== "approved" && <button type="button" onClick={() => run(() => setReviewStatus([r.id], "approved"))} className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 text-white px-3 py-1.5 text-xs font-semibold hover:bg-emerald-700"><Check className="w-3.5 h-3.5" /> Approve</button>}
                  {r.status !== "hidden" && <button type="button" onClick={() => run(() => setReviewStatus([r.id], "hidden"))} className="inline-flex items-center gap-1 rounded-lg border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 px-3 py-1.5 text-xs font-semibold hover:border-slate-400"><EyeOff className="w-3.5 h-3.5" /> Hide</button>}
                  <button type="button" onClick={() => { if (confirm("Delete this review?")) run(() => deleteReviews([r.id])); }} className="inline-flex items-center gap-1 rounded-lg text-rose-600 px-3 py-1.5 text-xs font-semibold hover:bg-rose-50 dark:hover:bg-rose-500/10"><Trash2 className="w-3.5 h-3.5" /> Delete</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
