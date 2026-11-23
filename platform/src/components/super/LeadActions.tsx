"use client";

import { useTransition } from "react";
import { Ban, ShieldCheck, Trash2 } from "lucide-react";
import { deleteLead, setLeadBlocked } from "@/lib/actions/leadFollowUp";

/** Block / unblock + delete for one platform lead. */
export function LeadActions({ leadId, blocked, name }: { leadId: string; blocked: boolean; name: string }) {
  const [pending, start] = useTransition();
  const btn = "inline-flex items-center gap-1 rounded-lg border px-2 py-1 text-xs font-medium transition disabled:opacity-50";
  return (
    <div className="flex items-center gap-1.5">
      <button
        type="button"
        disabled={pending}
        onClick={() => {
          if (blocked || confirm(`Block ${name}? This phone/email won't be able to request demos or send enquiries.`)) start(() => setLeadBlocked(leadId, !blocked));
        }}
        className={`${btn} ${blocked ? "border-emerald-300 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-800 dark:text-emerald-300" : "border-amber-300 text-amber-700 hover:bg-amber-50 dark:border-amber-800 dark:text-amber-300"}`}
        title={blocked ? "Unblock" : "Block this contact"}
      >
        {blocked ? <ShieldCheck className="h-3.5 w-3.5" /> : <Ban className="h-3.5 w-3.5" />} {blocked ? "Unblock" : "Block"}
      </button>
      <button
        type="button"
        disabled={pending}
        onClick={() => confirm(`Delete ${name}'s enquiry permanently?`) && start(() => deleteLead(leadId))}
        className={`${btn} border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900 dark:text-red-400`}
        title="Delete"
      >
        <Trash2 className="h-3.5 w-3.5" /> Delete
      </button>
    </div>
  );
}
