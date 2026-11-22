"use client";

import { useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { Monitor, Smartphone } from "lucide-react";
import type { WebsiteBlueprint } from "@/lib/ai/blueprintSchema";
import { blueprintStats } from "@/lib/ai/blueprintPreview";
import { AiBlueprintLivePreview } from "./AiBlueprintLivePreview";

export function AiInlinePreview({ blueprint, initialSlug }: { blueprint: WebsiteBlueprint; initialSlug?: string }) {
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");
  const stats = blueprintStats(blueprint);
  // Open on the page a refine just changed (the parent remounts us via key).
  const [pageIdx, setPageIdx] = useState(() => Math.max(0, stats.pages.findIndex((p) => p.slug === initialSlug)));
  const activePage = stats.pages[pageIdx] ?? stats.pages[0];

  return (
    <div className="flex h-full min-h-0 flex-col bg-slate-200/80 dark:bg-slate-900">
      <div className="flex shrink-0 items-center gap-2 px-3 py-2 border-b border-[var(--mkt-border)] bg-[var(--mkt-surface)]">
        <div className="flex rounded-lg border border-[var(--mkt-border)] p-0.5">
          <button
            type="button"
            onClick={() => setDevice("desktop")}
            className={`p-1.5 rounded-md ${device === "desktop" ? "bg-[var(--mkt-accent)] text-white" : "text-[var(--mkt-text-muted)]"}`}
            aria-label="Desktop"
          >
            <Monitor className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setDevice("mobile")}
            className={`p-1.5 rounded-md ${device === "mobile" ? "bg-[var(--mkt-accent)] text-white" : "text-[var(--mkt-text-muted)]"}`}
            aria-label="Phone"
          >
            <Smartphone className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="flex gap-1 overflow-x-auto min-w-0">
          {stats.pages.map((p, i) => (
            <button
              key={p.slug}
              type="button"
              onClick={() => setPageIdx(i)}
              className={`shrink-0 text-[11px] px-2 py-1 rounded-md font-medium ${
                i === pageIdx ? "bg-[var(--mkt-accent)] text-white" : "text-[var(--mkt-text-muted)] hover:bg-[var(--mkt-surface-muted)]"
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>
      <div className="flex min-h-0 flex-1 items-start justify-center overflow-auto overscroll-contain p-3">
        {activePage &&
          (() => {
            const site = (
              <AiBlueprintLivePreview
                blueprint={blueprint}
                compact={device === "mobile"}
                pageSlug={activePage.slug}
                onNavigate={(slug) => {
                  const i = stats.pages.findIndex((p) => p.slug === slug);
                  if (i >= 0) setPageIdx(i);
                }}
              />
            );
            return device === "mobile" ? (
              // A real 390px viewport, so the site's sm:/lg: breakpoints switch to mobile.
              <div className="h-fit rounded-[2.2rem] bg-[#0b0b12] p-2.5 shadow-2xl ring-1 ring-black/10">
                <FrameViewport title="Phone preview" className="block h-[760px] max-h-[calc(100vh/var(--mkt-zoom,1)-14rem)] w-[375px] rounded-[1.7rem] border-0 bg-white">
                  {site}
                </FrameViewport>
              </div>
            ) : (
              <div className="w-full overflow-hidden rounded-lg bg-white shadow-lg [zoom:0.8]">{site}</div>
            );
          })()}
      </div>
    </div>
  );
}

/** Renders children inside an iframe (own viewport), copying the page's styles in. */
function FrameViewport({ children, title, className }: { children: ReactNode; title: string; className?: string }) {
  const [mount, setMount] = useState<HTMLElement | null>(null);

  // ponytail: styles copied once on load; a dev hot-reload of CSS needs a device toggle to refresh
  const onLoad = (e: React.SyntheticEvent<HTMLIFrameElement>) => {
    const doc = e.currentTarget.contentDocument;
    if (!doc) return;
    document.querySelectorAll('link[rel="stylesheet"], style').forEach((n) => doc.head.appendChild(n.cloneNode(true)));
    doc.documentElement.className = document.documentElement.className.replace(/dark/, "");
    doc.body.className = document.body.className;
    doc.body.style.margin = "0";
    setMount(doc.body);
  };

  return (
    <iframe title={title} className={className} onLoad={onLoad} srcDoc="<!doctype html><html><head></head><body></body></html>">
      {mount && createPortal(children, mount)}
    </iframe>
  );
}
