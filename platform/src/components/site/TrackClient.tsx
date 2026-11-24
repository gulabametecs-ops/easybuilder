"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { findOrderForTracking, requestReturn, type ReturnRequestInput } from "@/lib/actions/tracking";

// Storefront order tracking: lookup form (/track) and return request (/track/<token>).

const input = "w-full rounded-xl border border-slate-300 bg-white text-slate-900 px-3.5 py-3 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/15";
const btn = "w-full rounded-xl bg-primary text-white font-bold px-4 py-3 hover:opacity-90 disabled:opacity-60 transition";

export function TrackLookup() {
  const router = useRouter();
  const [orderNo, setOrderNo] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [pending, start] = useTransition();
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setError("");
        start(async () => {
          const r = await findOrderForTracking(orderNo, phone).catch(() => ({ ok: false as const, error: "Something went wrong. Please try again." }));
          if (r.ok) router.push(`/track/${r.token}`);
          else setError(r.error);
        });
      }}
      className="rounded-2xl bg-white shadow-sm border border-slate-200/70 p-5 space-y-3"
    >
      <label className="block"><span className="block text-sm font-semibold text-heading mb-1">Order number</span><input name="orderNo" value={orderNo} onChange={(e) => setOrderNo(e.target.value)} placeholder="e.g. 1042" inputMode="numeric" required className={input} /></label>
      <label className="block"><span className="block text-sm font-semibold text-heading mb-1">Phone number</span><input name="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="98765 43210" inputMode="tel" required className={input} /></label>
      {error && <p className="text-sm text-rose-600" role="alert">{error}</p>}
      <button type="submit" disabled={pending} className={btn}>{pending ? "Finding your order…" : "Track order"}</button>
      <p className="text-xs text-slate-500 text-center">Your order number is in the confirmation message and email.</p>
    </form>
  );
}

const REASONS: ReturnRequestInput["reason"][] = ["Damaged or defective", "Wrong item received", "Size or fit issue", "Not as described", "Changed my mind", "Other"];

export function ReturnRequest({ token, returnBy }: { token: string; returnBy: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [kind, setKind] = useState<"return" | "exchange">("return");
  const [reason, setReason] = useState<ReturnRequestInput["reason"] | "">("");
  const [details, setDetails] = useState("");
  const [error, setError] = useState("");
  const [pending, start] = useTransition();
  if (!open) {
    return (
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-600">Not happy with something? You can request a return or exchange{returnBy ? ` until ${returnBy}` : ""}.</p>
        <button type="button" onClick={() => setOpen(true)} className="rounded-xl border-2 border-primary text-primary font-bold text-sm px-4 py-2 hover:bg-primary/5">Request return / exchange</button>
      </div>
    );
  }
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!reason) return setError("Please choose a reason.");
        setError("");
        start(async () => {
          const r = await requestReturn({ token, reason, details, kind }).catch(() => ({ ok: false as const, error: "Something went wrong. Please try again." }));
          if (r.ok) router.refresh();
          else setError(r.error);
        });
      }}
      className="space-y-3"
    >
      <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="Return or exchange">
        {(["return", "exchange"] as const).map((k) => (
          <button key={k} type="button" role="radio" aria-checked={kind === k} onClick={() => setKind(k)} className={`rounded-xl border-2 px-3 py-2.5 text-sm font-bold capitalize ${kind === k ? "border-primary bg-primary/5 text-primary" : "border-slate-200 text-slate-600"}`}>{k === "return" ? "Return for refund" : "Exchange"}</button>
        ))}
      </div>
      <label className="block"><span className="block text-sm font-semibold text-heading mb-1">Reason</span>
        <select value={reason} onChange={(e) => setReason(e.target.value as ReturnRequestInput["reason"])} required className={input}>
          <option value="">Choose a reason</option>
          {REASONS.map((r) => <option key={r}>{r}</option>)}
        </select>
      </label>
      <label className="block"><span className="block text-sm font-semibold text-heading mb-1">Details {kind === "exchange" ? "(size / colour you want)" : "(optional)"}</span>
        <textarea rows={3} value={details} onChange={(e) => setDetails(e.target.value)} maxLength={500} className={input} />
      </label>
      {error && <p className="text-sm text-rose-600" role="alert">{error}</p>}
      <div className="flex gap-2">
        <button type="submit" disabled={pending} className="rounded-xl bg-primary text-white font-bold px-5 py-2.5 hover:opacity-90 disabled:opacity-60">{pending ? "Sending…" : "Submit request"}</button>
        <button type="button" onClick={() => setOpen(false)} className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-500 hover:bg-slate-100">Cancel</button>
      </div>
    </form>
  );
}
