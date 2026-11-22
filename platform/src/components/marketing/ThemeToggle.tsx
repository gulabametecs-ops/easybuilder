"use client";

import { useEffect } from "react";
import { Sun, Moon } from "lucide-react";
import { useHtmlDark } from "@/lib/useHtmlDark";

export function ThemeToggle({ className }: { className?: string } = {}) {
  const dark = useHtmlDark(false);

  // Apply the saved theme to <html>; useHtmlDark picks up the class change.
  useEffect(() => {
    let isDark = false;
    try {
      isDark = localStorage.getItem("theme") === "dark";
    } catch {
      isDark = document.documentElement.classList.contains("dark");
    }
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  const toggle = () => {
    const next = !dark;
    document.documentElement.classList.toggle("dark", next);
    try { localStorage.setItem("theme", next ? "dark" : "light"); } catch {}
  };

  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      title={dark ? "Switch to light mode" : "Switch to dark mode"}
      className={className ?? "w-9 h-9 rounded-full flex items-center justify-center border border-[var(--mkt-border-strong)] bg-[var(--mkt-surface)] text-[var(--mkt-text)] hover:bg-[var(--mkt-accent-soft)] transition-colors shadow-sm"}
    >
      {dark ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
    </button>
  );
}
