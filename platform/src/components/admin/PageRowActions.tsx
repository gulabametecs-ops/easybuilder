"use client";

import { useTransition, type ReactNode } from "react";
import { Trash2 } from "lucide-react";
import { deletePage, duplicatePage } from "@/lib/actions/content";

export function DeletePageButton({ id }: { id: string }) {
  const [pending, start] = useTransition();
  return (
    <button
      disabled={pending}
      onClick={() => { if (confirm("Delete this page? This cannot be undone.")) start(() => deletePage(id)); }}
      className="p-2.5 rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/30 text-red-600 hover:bg-red-100 dark:hover:bg-red-950/50 disabled:opacity-50"
      title="Delete page"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  );
}

// Duplicate; shows the plan-limit message instead of failing silently.
export function DuplicatePageButton({ id, className, title, children }: { id: string; className: string; title?: string; children: ReactNode }) {
  const [pending, start] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      title={title}
      className={className}
      onClick={() => start(async () => { const r = await duplicatePage(id); if (r?.error) alert(r.error); })}
    >
      {children}
    </button>
  );
}
