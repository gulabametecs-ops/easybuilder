"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";
import { readAiDraft } from "@/lib/ai/promptStorage";
import { mkt } from "@/lib/marketingTheme";

export function AiDraftBanner() {
  const [siteName, setSiteName] = useState<string | null>(null);

  useEffect(() => {
    const draft = readAiDraft();
    if (!draft?.blueprint) return;
    try {
      const bp = JSON.parse(draft.blueprint) as { website?: { name?: string } };
      setSiteName(bp.website?.name?.trim() || "Your website");
    } catch {
      setSiteName("Your website");
    }
  }, []);

  if (!siteName) return null;

  return (
    <div className={`${mkt.card} border-lime-500/35 bg-lime-500/8 p-4 sm:p-5 mb-8 flex flex-col sm:flex-row sm:items-center gap-4`}>
      <div className="flex items-start gap-3 min-w-0 flex-1">
        <span className="w-10 h-10 rounded-xl bg-lime-500/15 flex items-center justify-center shrink-0">
          <Sparkles className="w-5 h-5 text-lime-600 dark:text-lime-400" />
        </span>
        <div>
          <p className="font-semibold text-[var(--mkt-text)]">AI plan ready: {siteName}</p>
          <p className={`text-sm mt-0.5 ${mkt.muted}`}>
            Try a live demo below, or subscribe to launch this website on your own domain.
          </p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 shrink-0">
        <Link href="/subscribe?from=ai" className={`${mkt.btnPrimary} ${mkt.btnPrimarySm}`}>
          Buy plan <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
