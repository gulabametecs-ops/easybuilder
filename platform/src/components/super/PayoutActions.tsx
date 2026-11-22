"use client";

import { useActionState } from "react";
import { markWithdrawalPaid, rejectWithdrawal, type ReferralActionState } from "@/lib/actions/referral";

const init: ReferralActionState = { ok: false, message: "" };
const input = "rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-2.5 py-1.5 text-xs outline-none focus:border-lime-500 w-40";

export function PayoutActions({ id }: { id: string }) {
  const [paid, payAction, paying] = useActionState(markWithdrawalPaid, init);
  const [rej, rejAction, rejecting] = useActionState(rejectWithdrawal, init);
  const msg = paid.message || rej.message;
  return (
    <div className="space-y-2">
      <form action={payAction} className="flex items-center gap-1.5">
        <input type="hidden" name="id" value={id} />
        <input name="reference" required minLength={4} maxLength={64} placeholder="UTR / reference" className={input} />
        <button disabled={paying} className="rounded-lg bg-lime-500 text-white text-xs font-semibold px-3 py-1.5 hover:bg-lime-600 disabled:opacity-60">{paying ? "…" : "Mark paid"}</button>
      </form>
      <form action={rejAction} className="flex items-center gap-1.5">
        <input type="hidden" name="id" value={id} />
        <input name="reason" required minLength={3} maxLength={300} placeholder="Reject reason" className={input} />
        <button disabled={rejecting} className="rounded-lg border border-red-300 text-red-600 text-xs font-semibold px-3 py-1.5 hover:bg-red-50 disabled:opacity-60">{rejecting ? "…" : "Reject"}</button>
      </form>
      {msg && <p className={`text-xs ${paid.ok || rej.ok ? "text-green-600" : "text-red-600"}`}>{msg}</p>}
    </div>
  );
}
