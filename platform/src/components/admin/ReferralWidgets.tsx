"use client";

import { useActionState, useState } from "react";
import { Copy, Check, MessageCircle, CheckCircle2, AlertCircle } from "lucide-react";
import { requestWithdrawal, type ReferralActionState } from "@/lib/actions/referral";

const field = "w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3.5 py-2.5 text-sm outline-none focus:border-lime-500 focus:ring-2 focus:ring-lime-500/20";
const lbl = "block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1";

export function ShareLink({ link, code, message }: { link: string; code: string; message: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-stretch gap-2">
        <input readOnly value={link} aria-label="Your referral link" className={`${field} flex-1 min-w-[220px] font-mono`} onFocus={(e) => e.currentTarget.select()} />
        <button
          type="button"
          onClick={async () => {
            try { await navigator.clipboard.writeText(link); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch { /* clipboard blocked */ }
          }}
          className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-semibold px-4 py-2.5"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />} {copied ? "Copied" : "Copy"}
        </button>
        <a
          href={`https://wa.me/?text=${encodeURIComponent(`${message} ${link}`)}`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 rounded-lg bg-green-600 text-white text-sm font-semibold px-4 py-2.5 hover:bg-green-700"
        >
          <MessageCircle className="w-4 h-4" /> WhatsApp
        </a>
      </div>
      <p className="text-xs text-slate-500 dark:text-slate-400">
        Your code: <span className="font-mono font-bold text-slate-800 dark:text-slate-100">{code}</span> — friends can also type it at checkout.
      </p>
    </div>
  );
}

const init: ReferralActionState = { ok: false, message: "" };

export function WithdrawForm({ amountLabel, tdsNote }: { amountLabel: string; tdsNote?: string }) {
  const [state, action, pending] = useActionState(requestWithdrawal, init);
  const [method, setMethod] = useState<"upi" | "bank">("upi");
  if (state.ok) {
    return <p className="text-sm text-green-600 flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4" /> {state.message}</p>;
  }
  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="method" value={method} />
      <div className="inline-flex rounded-lg border border-slate-200 dark:border-slate-700 p-1 gap-1">
        {(["upi", "bank"] as const).map((m) => (
          <button key={m} type="button" onClick={() => setMethod(m)} className={`rounded-md px-3 py-1.5 text-sm font-semibold ${method === m ? "bg-lime-500 text-white" : "text-slate-600 dark:text-slate-300"}`}>
            {m === "upi" ? "UPI" : "Bank account"}
          </button>
        ))}
      </div>
      {method === "upi" ? (
        <label className="block"><span className={lbl}>UPI ID</span><input name="upiId" required placeholder="name@okbank" className={field} /></label>
      ) : (
        <div className="grid sm:grid-cols-3 gap-3">
          <label className="block"><span className={lbl}>Account holder</span><input name="accountName" required className={field} /></label>
          <label className="block"><span className={lbl}>Account number</span><input name="accountNumber" required inputMode="numeric" className={field} /></label>
          <label className="block"><span className={lbl}>IFSC</span><input name="ifsc" required placeholder="HDFC0001234" className={`${field} uppercase`} /></label>
        </div>
      )}
      <label className="block max-w-xs">
        <span className={lbl}>PAN (recommended)</span>
        <input name="pan" placeholder="ABCDE1234F" maxLength={10} className={`${field} uppercase`} />
        <span className="block text-xs text-slate-400 mt-1">Needed for tax records on commission payouts.</span>
      </label>
      {state.message && <p className="text-sm text-red-600 flex items-center gap-1.5"><AlertCircle className="w-4 h-4" /> {state.message}</p>}
      <button disabled={pending} className="rounded-lg bg-lime-500 text-white text-sm font-bold px-5 py-2.5 hover:bg-lime-600 disabled:opacity-60">
        {pending ? "Requesting…" : `Withdraw ${amountLabel}`}
      </button>
      {tdsNote && <p className="text-xs text-slate-400">{tdsNote}</p>}
    </form>
  );
}
