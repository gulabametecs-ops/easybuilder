"use client";

import { useRouter } from "next/navigation";
import { DemoVerticalPanel, previewUrl } from "./DemoVerticalPanel";

/** Details + OTP form on /demos/start; once verified, straight to the demo subdomain (top-level, so its cookie is first-party). */
export function DemoStartPanel({
  vertical,
  designs,
  design,
}: {
  vertical: { id: string; name: string };
  designs: { id: string; name: string }[];
  design: string;
}) {
  const router = useRouter();
  const openLive = (id: string) => router.push(`/demos?vertical=${encodeURIComponent(id)}&design=${encodeURIComponent(design)}&live=1`);
  return (
    <DemoVerticalPanel
      vertical={vertical}
      designs={designs}
      design={design}
      defaultOpen
      onActivated={(info) => window.location.assign(previewUrl(info.siteUrl, design))}
      onShowActive={openLive}
    />
  );
}
