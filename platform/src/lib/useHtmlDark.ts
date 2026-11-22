"use client";

import { useSyncExternalStore } from "react";

// Watches the `dark` class on <html> so theme toggles re-render without setState-in-effect.
function subscribe(onChange: () => void) {
  const mo = new MutationObserver(onChange);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  return () => mo.disconnect();
}

const read = () => document.documentElement.classList.contains("dark");

/** `serverDefault` is used for SSR and hydration, then the real class takes over. */
export function useHtmlDark(serverDefault: boolean) {
  return useSyncExternalStore(subscribe, read, () => serverDefault);
}
