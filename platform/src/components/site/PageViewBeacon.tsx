"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Pings /api/pv once per real page view (initial load + each client navigation).
// Prefetches never mount this, and framed views (builder preview, /demos stage) are skipped.
export function PageViewBeacon() {
  const pathname = usePathname();
  useEffect(() => {
    if (window.self !== window.top || new URLSearchParams(location.search).has("__edit")) return;
    // location.pathname = what the visitor sees (the proxy rewrites to /site/* internally).
    const body = JSON.stringify({ p: location.pathname });
    if (!navigator.sendBeacon?.("/api/pv", body)) {
      fetch("/api/pv", { method: "POST", body, keepalive: true }).catch(() => {});
    }
  }, [pathname]);
  return null;
}
