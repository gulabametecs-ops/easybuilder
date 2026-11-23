"use client";

import { useTransition } from "react";
import { CalendarPlus, Power, Trash2, Ban } from "lucide-react";
import { extendSubscription, setTenantStatus, setTenantPlan, deleteTenant, cancelSubscription } from "@/lib/actions/superAdmin";
import { TIERS } from "@/lib/plans";

const EXTEND: { label: string; plan: "1" | "3" | "6" | "12" | "24" | "36" }[] = [
  { label: "+1 Month", plan: "1" },
  { label: "+3 Months", plan: "3" },
  { label: "+6 Months", plan: "6" },
  { label: "+1 Year", plan: "12" },
  { label: "+2 Years", plan: "24" },
  { label: "+3 Years", plan: "36" },
];

export function ClientActions({ tenantId, status, plan }: { tenantId: string; status: string; plan: string }) {
  const [pending, start] = useTransition();
  const suspended = status === "suspended";
  const cancelled = status === "cancelled";

  return (
    <div className={`space-y-6 ${pending ? "opacity-60 pointer-events-none" : ""}`}>
      {/* Extend license */}
      <div>
        <p className="text-sm font-semibold text-slate-800 mb-2 flex items-center gap-1.5"><CalendarPlus className="w-4 h-4 text-lime-600" /> Extend license</p>
        <div className="flex flex-wrap gap-2">
          {EXTEND.map((e) => (
            <button key={e.plan} onClick={() => start(() => extendSubscription(tenantId, e.plan))} className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
              {e.label}
            </button>
          ))}
        </div>
      </div>

      {/* Change plan */}
      <div>
        <p className="text-sm font-semibold text-slate-800 mb-2">Plan</p>
        <select defaultValue={plan} onChange={(e) => start(() => setTenantPlan(tenantId, e.target.value))} className="rounded-lg border border-slate-300 px-3 py-2 text-sm">
          {TIERS.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
          <option value="free">Free</option>
          <option value="pro">Pro (legacy)</option>
        </select>
      </div>

      {/* Status + delete */}
      <div className="flex flex-wrap gap-3 pt-2 border-t border-slate-100">
        <button
          onClick={() => start(() => setTenantStatus(tenantId, suspended ? "active" : "suspended"))}
          className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold ${suspended ? "bg-lime-500 text-white hover:bg-lime-600" : "bg-amber-100 text-amber-800 hover:bg-amber-200 dark:bg-amber-500/15 dark:text-amber-300 dark:hover:bg-amber-500/25"}`}
        >
          <Power className="w-4 h-4" /> {suspended ? "Activate" : "Deactivate"}
        </button>
        {!cancelled && (
          <button
            onClick={() => { const reason = prompt("Cancel this subscription? Optionally note a reason:"); if (reason !== null) start(() => cancelSubscription(tenantId, reason)); }}
            className="inline-flex items-center gap-2 rounded-lg bg-orange-50 text-orange-600 px-4 py-2 text-sm font-semibold hover:bg-orange-100 dark:bg-orange-500/15 dark:text-orange-300"
          >
            <Ban className="w-4 h-4" /> Cancel subscription
          </button>
        )}
        <button
          onClick={() => { if (confirm("Delete this client and ALL its data permanently? This cannot be undone.")) start(() => deleteTenant(tenantId)); }}
          className="inline-flex items-center gap-2 rounded-lg bg-red-50 text-red-600 px-4 py-2 text-sm font-semibold hover:bg-red-100 dark:bg-red-500/15 dark:text-red-300"
        >
          <Trash2 className="w-4 h-4" /> Delete client
        </button>
      </div>
    </div>
  );
}
