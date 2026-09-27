"use client";

import { DevicePreviewFrame } from "./DevicePreviewFrame";

export function LivePreviewPane({ src = "/", version }: { src?: string; version?: string }) {
  return (
    <DevicePreviewFrame
      src={src}
      reloadKey={version}
      className="lg:sticky lg:top-6 h-[calc(100vh-9rem)] min-h-[520px]"
    />
  );
}
