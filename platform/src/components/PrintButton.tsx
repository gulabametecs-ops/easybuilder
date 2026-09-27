"use client";

import { Printer } from "lucide-react";

export function PrintButton({ variant = "default" }: { variant?: "default" | "brand" }) {
  const brand = variant === "brand";
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className={
        brand
          ? "no-print inline-flex items-center gap-2 rounded-xl text-white text-sm font-bold px-5 py-2.5 hover:opacity-90 transition"
          : "no-print inline-flex items-center gap-2 rounded-lg bg-slate-900 text-white text-sm font-semibold px-4 py-2 hover:bg-slate-800"
      }
      style={brand ? { background: "var(--c-secondary, #0f2942)" } : undefined}
    >
      <Printer className="w-4 h-4" /> Print / Save PDF
    </button>
  );
}
