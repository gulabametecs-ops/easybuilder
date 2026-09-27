"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

const ROOT = process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? "localhost:3000";

export function DemoTimerBar({ expiresAt }: { expiresAt: string }) {
  const [left, setLeft] = useState("--:--");

  useEffect(() => {
    const tick = () => {
      const ms = new Date(expiresAt).getTime() - Date.now();
      if (ms <= 0) {
        setLeft("0:00");
        const proto = ROOT.includes("localhost") ? "http" : "https";
        const host = ROOT.includes("localhost") ? "localhost:3000" : ROOT;
        window.location.href = `${proto}://${host}/demos?expired=1`;
        return;
      }
      const m = Math.floor(ms / 60000);
      const s = Math.floor((ms % 60000) / 1000);
      setLeft(`${m}:${String(s).padStart(2, "0")}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [expiresAt]);

  return (
    <div className="sticky top-0 z-50 bg-amber-500 text-amber-950 px-3 py-1.5 flex items-center justify-center gap-2 shadow-sm">
      <Clock className="w-3.5 h-3.5 shrink-0" aria-hidden />
      <span className="text-xs sm:text-sm font-medium">Demo</span>
      <span className="font-mono text-sm sm:text-base font-bold tabular-nums tracking-wide">{left}</span>
    </div>
  );
}
