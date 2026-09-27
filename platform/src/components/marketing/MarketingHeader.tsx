"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X, Sparkles } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { mkt } from "@/lib/marketingTheme";

// In-page sections of the landing page (ids must exist in app/(marketing)/page.tsx).
const LINKS = [
  { label: "Features", id: "features" },
  { label: "Sectors", id: "sectors" },
  { label: "How it works", id: "how" },
  { label: "Pricing", id: "pricing" },
  { label: "FAQ", id: "faq" },
];

export function MarketingHeader() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");
  const pathname = usePathname();
  const onHome = pathname === "/";

  // Highlight the section currently in view (landing page only).
  useEffect(() => {
    if (!onHome) return;
    const els = LINKS.map((l) => document.getElementById(l.id)).filter((e): e is HTMLElement => !!e);
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (hit) setActive(hit.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: [0, 0.25, 0.5] },
    );
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, [onHome]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const linkCls = (id: string) =>
    `relative rounded-full px-3 py-1.5 text-sm transition-colors ${
      onHome && active === id
        ? "bg-lime-500/10 text-[var(--mkt-text)] font-semibold"
        : "text-[var(--mkt-text-secondary)] hover:text-[var(--mkt-text)]"
    }`;

  return (
    <header className={mkt.header}>
      <div className={`${mkt.container} h-16 flex items-center justify-between gap-4`}>
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <span className={mkt.logoMark}>S</span>
          <span className={`${mkt.logoText} text-lg`}>
            Standard<span className={mkt.logoAccent}>SaaS</span>
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1" aria-label="Main">
          {LINKS.map((l) => (
            <a key={l.id} href={`/#${l.id}`} className={linkCls(l.id)} aria-current={onHome && active === l.id ? "true" : undefined}>
              {l.label}
            </a>
          ))}
          <span className="mx-1.5 h-5 w-px bg-[var(--mkt-border)]" aria-hidden />
          <Link
            href="/ai-builder"
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold transition ${
              pathname === "/ai-builder" ? "bg-lime-500/15 text-[var(--mkt-text)]" : "text-[var(--mkt-accent-text)] hover:bg-lime-500/10"
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" /> AI Builder
          </Link>
          <Link
            href="/demos"
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold transition ${
              pathname === "/demos" ? "bg-lime-500/15 text-[var(--mkt-text)]" : "text-[var(--mkt-text-secondary)] hover:text-[var(--mkt-text)]"
            }`}
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-lime-500" />
            </span>
            Live demos
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link href="/subscribe" className={`${mkt.btnPrimary} ${mkt.btnPrimarySm} rounded-full whitespace-nowrap max-sm:hidden`}>
            Get started
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="lg:hidden text-[var(--mkt-text)] p-2 rounded-lg hover:bg-[var(--mkt-surface-muted)]"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mkt-mobile-nav"
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {open && (
        <nav id="mkt-mobile-nav" className="lg:hidden border-t border-[var(--mkt-border)] px-4 py-3 flex flex-col gap-0.5 bg-[var(--mkt-surface)]" aria-label="Mobile">
          {LINKS.map((l) => (
            <a
              key={l.id}
              href={`/#${l.id}`}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2.5 text-[var(--mkt-text-secondary)] hover:bg-[var(--mkt-surface-muted)] hover:text-[var(--mkt-text)]"
            >
              {l.label}
            </a>
          ))}
          <Link href="/ai-builder" onClick={() => setOpen(false)} className="inline-flex items-center gap-2 rounded-lg px-3 py-2.5 font-semibold text-[var(--mkt-accent-text)] hover:bg-lime-500/10">
            <Sparkles className="h-4 w-4" /> AI Builder
          </Link>
          <Link href="/demos" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2.5 font-semibold text-[var(--mkt-text)] hover:bg-[var(--mkt-surface-muted)]">
            Live demos
          </Link>
          <Link href="/subscribe" onClick={() => setOpen(false)} className={`mt-2 text-center ${mkt.btnPrimary} ${mkt.btnPrimaryMd} rounded-full`}>
            Get started
          </Link>
        </nav>
      )}
    </header>
  );
}
