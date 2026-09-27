"use client";

import { useState } from "react";
import { Monitor, Smartphone } from "lucide-react";
import type { WebsiteBlueprint } from "@/lib/ai/blueprintSchema";
import { blueprintStats } from "@/lib/ai/blueprintPreview";
import { AiBlueprintLivePreview } from "./AiBlueprintLivePreview";

export function AiInlinePreview({ blueprint }: { blueprint: WebsiteBlueprint }) {
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");
  const stats = blueprintStats(blueprint);
  const [pageIdx, setPageIdx] = useState(0);
  const activePage = stats.pages[pageIdx] ?? stats.pages[0];

  return (
    <div className="flex flex-col h-full min-h-[520px] bg-slate-200/80 dark:bg-slate-900">
      <div className="flex items-center gap-2 px-3 py-2 border-b border-[var(--mkt-border)] bg-[var(--mkt-surface)]">
        <div className="flex rounded-lg border border-[var(--mkt-border)] p-0.5">
          <button
            type="button"
            onClick={() => setDevice("desktop")}
            className={`p-1.5 rounded-md ${device === "desktop" ? "bg-lime-500 text-white" : "text-[var(--mkt-text-muted)]"}`}
            aria-label="Desktop"
          >
            <Monitor className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setDevice("mobile")}
            className={`p-1.5 rounded-md ${device === "mobile" ? "bg-lime-500 text-white" : "text-[var(--mkt-text-muted)]"}`}
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
                i === pageIdx ? "bg-lime-500 text-white" : "text-[var(--mkt-text-muted)] hover:bg-[var(--mkt-surface-muted)]"
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 overflow-auto p-3 flex justify-center">
        <div className={`bg-white overflow-hidden shadow-lg ${device === "mobile" ? "w-[390px] rounded-xl" : "w-full rounded-lg"}`}>
          {activePage && (
            <AiBlueprintLivePreview
              blueprint={blueprint}
              compact={device === "mobile"}
              pageSlug={activePage.slug}
              onNavigate={(slug) => {
                const i = stats.pages.findIndex((p) => p.slug === slug);
                if (i >= 0) setPageIdx(i);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
