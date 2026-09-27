"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Pencil, ExternalLink, Home, Plus, Menu, Copy, Sparkles,
} from "lucide-react";
import { SECTION_META } from "@/lib/sectionDefaults";
import { Badge } from "./ui";
import { PageCreator } from "./PageCreator";
import { AIWebsiteModal } from "./AIWebsiteModal";
import { DeletePageButton } from "./PageRowActions";
import { duplicatePage } from "@/lib/actions/content";

type PageRow = {
  id: string;
  title: string;
  slug: string;
  published: boolean;
  showInNav: boolean;
  isSystem: boolean;
  sectionCount: number;
  sectionTypes: string[];
};

const labelOf = (t: string) => SECTION_META.find((m) => m.type === t)?.label ?? t;

/** Tiny stacked wireframe bars colored by section count — clearer than empty grey. */
function PageThumb({ types, home }: { types: string[]; home?: boolean }) {
  const rows = types.length > 0 ? types.slice(0, 5) : ["richText"];
  return (
    <div className={`relative h-32 overflow-hidden border-b border-slate-100 dark:border-slate-700 ${
      home
        ? "bg-gradient-to-br from-lime-500/20 via-slate-100 to-slate-50 dark:from-lime-500/15 dark:via-slate-800 dark:to-slate-900"
        : "bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900"
    }`}>
      <div className="absolute inset-x-4 top-4 bottom-4 flex flex-col gap-1.5">
        <div className="h-2 rounded-sm bg-slate-900/20 dark:bg-white/15 w-2/5" />
        {rows.map((t, i) => (
          <div
            key={`${t}-${i}`}
            className="rounded-sm bg-white dark:bg-slate-700/90 shadow-sm border border-slate-200/60 dark:border-slate-600/50"
            style={{ height: `${Math.max(10, 28 - i * 3)}px`, width: `${92 - i * 6}%` }}
            title={labelOf(t)}
          />
        ))}
      </div>
      {home && (
        <span className="absolute top-2.5 right-2.5 inline-flex items-center gap-1 rounded-full bg-lime-500 text-white text-[10px] font-bold px-2 py-0.5 shadow-sm">
          <Home className="w-3 h-3" /> Home
        </span>
      )}
    </div>
  );
}

export function PagesManager({ pages }: { pages: PageRow[] }) {
  const [createOpen, setCreateOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const published = pages.filter((p) => p.published).length;
  const drafts = pages.length - published;

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3.5">
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <p className="font-semibold text-slate-900 dark:text-white">{pages.length} pages</p>
          <span className="text-slate-300 dark:text-slate-600">·</span>
          <span className="text-slate-500">{published} live</span>
          {drafts > 0 && (
            <>
              <span className="text-slate-300 dark:text-slate-600">·</span>
              <span className="text-amber-600 dark:text-amber-400">{drafts} draft</span>
            </>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setAiOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl border border-lime-500/40 bg-lime-500/10 text-lime-800 dark:text-lime-300 text-sm font-semibold px-4 py-2.5 hover:bg-lime-500/15"
          >
            <Sparkles className="w-4 h-4" /> AI Website
          </button>
          <button
            type="button"
            onClick={() => setCreateOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-lime-500 text-white text-sm font-semibold px-4 py-2.5 hover:bg-lime-600 shadow-sm"
          >
            <Plus className="w-4 h-4" /> Create page
          </button>
        </div>
      </div>

      <PageCreator open={createOpen} onOpenChange={setCreateOpen} />
      <AIWebsiteModal open={aiOpen} onOpenChange={setAiOpen} />

      {/* Empty */}
      {pages.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/40 px-6 py-16 text-center">
          <p className="text-lg font-semibold text-slate-800 dark:text-white">No pages yet</p>
          <p className="text-sm text-slate-500 mt-1 mb-5">Create your first page from a ready-made layout.</p>
          <button
            type="button"
            onClick={() => setCreateOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-lime-500 text-white text-sm font-semibold px-4 py-2.5 hover:bg-lime-600"
          >
            <Plus className="w-4 h-4" /> Create page
          </button>
        </div>
      )}

      {/* Grid */}
      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {pages.map((p) => {
          const path = p.slug === "home" ? "/" : `/${p.slug}`;
          const isHome = p.slug === "home";
          return (
            <article
              key={p.id}
              className="group flex flex-col rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 overflow-hidden hover:border-lime-500/60 hover:shadow-lg transition"
            >
              <Link href={`/admin/pages/${p.id}`} className="block focus:outline-none">
                <PageThumb types={p.sectionTypes} home={isHome} />
              </Link>

              <div className="flex flex-col flex-1 p-4 gap-3">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <Link href={`/admin/pages/${p.id}`} className="min-w-0">
                      <h3 className="font-semibold text-slate-900 dark:text-white truncate group-hover:text-lime-700 dark:group-hover:text-lime-400 transition">
                        {p.title}
                      </h3>
                    </Link>
                    {p.published ? (
                      <Badge tone="green">Live</Badge>
                    ) : (
                      <Badge tone="amber">Draft</Badge>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-1 font-mono truncate">{path}</p>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {p.isSystem && <Badge tone="blue">System</Badge>}
                  {p.showInNav && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 text-[11px] font-medium">
                      <Menu className="w-3 h-3" /> In menu
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 text-[11px] font-medium">
                    {p.sectionCount} sections
                  </span>
                </div>

                {p.sectionTypes.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {p.sectionTypes.slice(0, 4).map((t) => (
                      <span key={t} className="rounded-md bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700 px-1.5 py-0.5 text-[10px] text-slate-500 dark:text-slate-400 truncate max-w-[7.5rem]">
                        {labelOf(t)}
                      </span>
                    ))}
                    {p.sectionCount > 4 && (
                      <span className="text-[10px] text-slate-400 self-center">+{p.sectionCount - 4}</span>
                    )}
                  </div>
                )}

                <div className="mt-auto flex items-center gap-1.5 pt-1">
                  <Link
                    href={`/admin/pages/${p.id}`}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-slate-900 dark:bg-lime-500 text-white text-sm font-semibold px-3 py-2.5 hover:bg-slate-800 dark:hover:bg-lime-600"
                  >
                    <Pencil className="w-3.5 h-3.5" /> Edit
                  </Link>
                  <a
                    href={path}
                    target="_blank"
                    className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-600 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800"
                    title="View live"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <form action={duplicatePage.bind(null, p.id)}>
                    <button
                      type="submit"
                      className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-600 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800"
                      title="Duplicate"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </form>
                  {!p.isSystem && <DeletePageButton id={p.id} />}
                </div>
              </div>
            </article>
          );
        })}

        {/* New page card */}
        <button
          type="button"
          onClick={() => setCreateOpen(true)}
          className="min-h-[280px] rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-600 bg-slate-50/50 dark:bg-slate-900/30 hover:border-lime-500 hover:bg-lime-500/5 transition flex flex-col items-center justify-center gap-3 text-center px-6"
        >
          <span className="w-12 h-12 rounded-2xl bg-lime-500/15 text-lime-600 flex items-center justify-center">
            <Plus className="w-6 h-6" />
          </span>
          <div>
            <p className="font-semibold text-slate-800 dark:text-white">Create a new page</p>
            <p className="text-xs text-slate-500 mt-1">Landing, about, contact, fees & more</p>
          </div>
        </button>
      </div>
    </div>
  );
}
