"use client";

import { useMemo } from "react";
import type { WebsiteBlueprint } from "@/lib/ai/blueprintSchema";
import { blueprintToPreview } from "@/lib/ai/blueprintPreview";
import { slugify } from "@/lib/ai/hydrate";
import { SectionRenderer } from "@/components/site/SectionRenderer";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { themeToStyle, googleFontHref } from "@/components/site/themeVars";

function pathToSlug(href: string): string | null {
  if (!href || href.startsWith("mailto:") || href.startsWith("tel:") || href.startsWith("#") || href.startsWith("http")) {
    return null;
  }
  const path = href.split("?")[0].split("#")[0];
  if (path === "/" || path === "") return "home";
  const first = path.replace(/^\//, "").split("/")[0];
  return first || "home";
}

export function AiBlueprintLivePreview({
  blueprint,
  compact,
  pageSlug = "home",
  onNavigate,
}: {
  blueprint: WebsiteBlueprint;
  compact?: boolean;
  pageSlug?: string;
  onNavigate?: (slug: string) => void;
}) {
  const preview = useMemo(() => blueprintToPreview(blueprint, pageSlug), [blueprint, pageSlug]);
  const style = themeToStyle(preview.theme);
  const known = useMemo(
    () => new Set(blueprint.pages.map((p) => (p.slug === "home" || slugify(p.slug || p.name) === "home" ? "home" : slugify(p.slug || p.name)))),
    [blueprint.pages],
  );

  return (
    <>
      <link rel="stylesheet" href={googleFontHref(preview.theme.font)} />
      <div
        className={`site-root bg-[var(--c-light)] text-[var(--c-text)] ${compact ? "text-[13px]" : ""}`}
        style={style}
        onClickCapture={(e) => {
          if (!onNavigate) return;
          const a = (e.target as HTMLElement).closest("a");
          if (!a) return;
          const href = a.getAttribute("href");
          if (!href) return;
          const slug = pathToSlug(href);
          if (!slug) return;
          e.preventDefault();
          e.stopPropagation();
          onNavigate(known.has(slug) ? slug : "home");
        }}
      >
        <SiteHeader header={preview.header} />
        <main>
          {preview.sections.map((section) => (
            <SectionRenderer key={section.id} section={section} ctx={preview.ctx} />
          ))}
        </main>
        <SiteFooter footer={preview.footer} bizName={blueprint.website.name} />
      </div>
    </>
  );
}
