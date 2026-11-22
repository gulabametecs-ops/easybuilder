"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { BrandMark } from "./BrandLogo";

// The one brand load animation, tied to the page actually loading:
// shows on every refresh / route change, plays the 1.5s logo story, and stays until the page
// is ready (document loaded and no route `loading.tsx` placeholder left), then fades to reveal it.
// Takes no clicks (pointer-events: none). Keyed by pathname so each navigation starts fresh.
const MIN_MS = 1500;
const MAX_MS = 8000; // never hang on a stuck request
let firstMount = true; // a hard load's overlay has been on screen since navigation start

export function PageIntro() {
  const path = usePathname();
  return <Overlay key={path} />;
}

function Overlay() {
  const [done, setDone] = useState(false);
  // captured once per mount (safe under StrictMode's double effects)
  const [start] = useState(() => (firstMount ? 0 : performance.now()));

  useEffect(() => {
    firstMount = false;
    const id = window.setInterval(() => {
      const elapsed = performance.now() - start;
      const ready = document.readyState === "complete" && !document.querySelector("[data-route-loading]");
      if ((ready && elapsed >= MIN_MS) || elapsed >= MAX_MS) {
        setDone(true);
        window.clearInterval(id);
      }
    }, 100);
    return () => window.clearInterval(id);
  }, [start]);

  return (
    <div
      aria-hidden
      className={`spx-intro pointer-events-none fixed inset-0 z-[90] grid place-items-center bg-white/75 backdrop-blur-[6px] dark:bg-[#060a14]/75 ${
        done ? "spx-intro-out" : ""
      }`}
    >
      <span className="spx-quick relative grid place-items-center">
        <span className="spx-intro-glow absolute h-32 w-32 rounded-full blur-2xl" />
        <BrandMark size={72} className="relative" />
        {/* only appears if the page is still loading after the 1.5s story */}
        <span className="spx-intro-bar absolute -bottom-9 h-1 w-24 overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
          <span className="block h-full w-1/3 rounded-full bg-gradient-to-r from-[#16b6ff] via-[#2563ff] to-[#7c3aed]" />
        </span>
      </span>
    </div>
  );
}
