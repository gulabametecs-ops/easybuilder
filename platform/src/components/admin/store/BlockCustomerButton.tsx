"use client";

import { useTransition } from "react";
import { Ban, Check } from "lucide-react";
import { setCustomerBlocked } from "@/lib/actions/storeCatalogAdmin";

export function BlockCustomerButton({ id, blocked }: { id: string; blocked: boolean }) {
  const [pending, start] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (!blocked && !confirm("Block this customer? They won't be able to sign in or place orders while signed in.")) return;
        start(async () => {
          const r = await setCustomerBlocked(id, !blocked).catch((e: unknown) => ({ ok: false as const, error: e instanceof Error ? e.message : "Failed" }));
          if (!r.ok) alert(r.error);
        });
      }}
      className={`inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold disabled:opacity-60 ${blocked ? "bg-emerald-600 text-white hover:bg-emerald-700" : "border border-rose-200 dark:border-rose-500/30 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10"}`}
    >
      {blocked ? <><Check className="w-3.5 h-3.5" /> Unblock</> : <><Ban className="w-3.5 h-3.5" /> Block customer</>}
    </button>
  );
}
