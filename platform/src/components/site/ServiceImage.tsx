"use client";

import { useEffect, useState } from "react";

export const SERVICE_IMAGE_EVENT = "svc-image";

// Main product photo on the service page; swaps when a variety option with its own photo is picked (ServiceEnquiry).
export function ServiceImage({ src, alt }: { src: string; alt: string }) {
  const [current, setCurrent] = useState(src);
  useEffect(() => {
    const on = (e: Event) => setCurrent((e as CustomEvent<string>).detail || src);
    window.addEventListener(SERVICE_IMAGE_EVENT, on);
    return () => window.removeEventListener(SERVICE_IMAGE_EVENT, on);
  }, [src]);
  // eslint-disable-next-line @next/next/no-img-element
  return <img key={current} src={current} alt={alt} className="w-full aspect-video rounded-2xl object-cover shadow-lg mb-6 transition-opacity" />;
}
