"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { readAiDraft, AI_BLUEPRINT_KEY } from "@/lib/ai/promptStorage";
import type { WebsiteBlueprint } from "@/lib/ai/blueprintSchema";
import { AiBlueprintLivePreview } from "@/components/marketing/AiBlueprintLivePreview";
import { slugify } from "@/lib/ai/hydrate";

function loadBlueprint(): WebsiteBlueprint | null {
  const draft = readAiDraft();
  if (!draft?.blueprint) return null;
  try {
    return JSON.parse(draft.blueprint) as WebsiteBlueprint;
  } catch {
    return null;
  }
}

export default function AiPreviewPage() {
  const [blueprint, setBlueprint] = useState<WebsiteBlueprint | null>(null);
  const [pageSlug, setPageSlug] = useState("home");
  const [ready, setReady] = useState(false);

  const refresh = useCallback(() => {
    setBlueprint(loadBlueprint());
  }, []);

  useEffect(() => {
    refresh();
    setReady(true);
    const onStorage = (e: StorageEvent) => {
      if (!e.key || e.key === AI_BLUEPRINT_KEY) refresh();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [refresh]);

  if (!ready) {
    return <div className="min-h-screen bg-white" />;
  }

  if (!blueprint) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-slate-500 text-sm px-6 text-center gap-3">
        <p>No AI preview yet. Generate a website from the homepage, then open Full preview.</p>
        <Link href="/ai-builder" className="text-lime-600 font-semibold hover:underline">
          Go to AI Website Builder
        </Link>
      </div>
    );
  }

  return (
    <AiBlueprintLivePreview
      blueprint={blueprint}
      pageSlug={pageSlug}
      onNavigate={(slug) => {
        const match = blueprint.pages.find(
          (p) => slugify(p.slug || p.name) === slug || (slug === "home" && (p.slug === "home" || slugify(p.name) === "home")),
        );
        setPageSlug(match ? (match.slug === "home" || slugify(match.slug) === "home" ? "home" : slugify(match.slug || match.name)) : "home");
      }}
    />
  );
}
