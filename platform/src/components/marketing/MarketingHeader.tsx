"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

const LINKS = [
  { label: "Sectors", href: "/#sectors" },
  { label: "How it works", href: "/#how" },
  { label: "Pricing", href: "/#pricing" },
];

export function MarketingHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-950/90 backdrop-blur border-b border-black/5 dark:border-white/10">
      <div className="mx-auto max-w-6xl px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-lime-500 text-white font-extrabold flex items-center justify-center">S</span>
          <span className="font-bold text-slate-900 dark:text-white">Standard<span className="text-lime-500 dark:text-lime-400">SaaS</span></span>
        </Link>

        <nav className="hidden md:flex items-center gap-7">
          {LINKS.map((l) => (
            <a key={l.label} href={l.href} className="text-sm text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white">{l.label}</a>
          ))}
          <Link href="/demos" className="inline-flex items-center gap-1.5 text-sm font-semibold text-lime-600 dark:text-lime-400 hover:text-lime-700 dark:hover:text-lime-300">
            <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime-400 opacity-75" /><span className="relative inline-flex rounded-full h-2 w-2 bg-lime-500" /></span>
            Live demos
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link href="/subscribe" className="hidden sm:inline-flex rounded-full bg-lime-500 text-white font-semibold px-5 py-2 text-sm hover:bg-lime-600">Start free</Link>
          <button onClick={() => setOpen((v) => !v)} className="md:hidden text-slate-700 dark:text-white p-2" aria-label="Menu">
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>
      {open && (
        <nav className="md:hidden border-t border-black/5 dark:border-white/10 px-4 py-3 flex flex-col gap-1">
          {LINKS.map((l) => (
            <a key={l.label} href={l.href} onClick={() => setOpen(false)} className="py-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white">{l.label}</a>
          ))}
          <Link href="/demos" onClick={() => setOpen(false)} className="py-2 font-semibold text-lime-600 dark:text-lime-400">● Live demos</Link>
          <Link href="/subscribe" onClick={() => setOpen(false)} className="mt-2 rounded-full bg-lime-500 text-white font-semibold px-5 py-2.5 text-sm text-center">Start free</Link>
        </nav>
      )}
    </header>
  );
}
