"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCcw, LayoutDashboard } from "lucide-react";

// Any failed save/render inside the admin lands here instead of a blank "Application error" screen.
// Production hides server error text, so the message stays generic; the digest matches the server log line.
export default function AdminError({ error, unstable_retry }: { error: Error & { digest?: string }; unstable_retry: () => void }) {
  useEffect(() => { console.error(error); }, [error]);
  return (
    <div className="flex flex-1 items-center justify-center p-6">
      <div className="max-w-md w-full rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 p-6 text-center shadow-sm">
        <span className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-600 dark:bg-amber-500/15">
          <AlertTriangle className="h-6 w-6" />
        </span>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">That didn&apos;t go through</h2>
        <p className="mt-1 text-sm text-slate-500">
          Your other changes are safe. Try again — if it keeps happening, send us the code below.
          On a demo site a few actions (team, domain, SEO) unlock only after you buy a plan.
        </p>
        {error.digest && <p className="mt-2 font-mono text-[11px] text-slate-400">Code: {error.digest}</p>}
        <div className="mt-5 flex justify-center gap-2">
          <button type="button" onClick={() => (/Server Action|ChunkLoad|Failed to fetch/i.test(error.message) ? location.reload() : unstable_retry())} className="admin-grad inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold">
            <RotateCcw className="h-4 w-4" /> Try again
          </button>
          <a href="/admin" className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-white/10 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
            <LayoutDashboard className="h-4 w-4" /> Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}
