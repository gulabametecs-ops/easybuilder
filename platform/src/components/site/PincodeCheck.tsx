"use client";

import { useState, useTransition } from "react";
import { MapPin, Truck } from "lucide-react";
import { checkPincode, type PincodeCheckResult } from "@/lib/actions/tracking";
import { etaDate } from "@/lib/shipping";
import { inr } from "@/lib/store";

/** "Check delivery" box for product pages: pincode → "Delivers by Thu, 28 Nov · COD available".
 *  Pass the product price/weight so free-delivery and weight slabs apply. */
export function PincodeCheck({ subtotal = 0, weightGrams = 0, className = "" }: { subtotal?: number; weightGrams?: number; className?: string }) {
  const [pin, setPin] = useState("");
  const [res, setRes] = useState<PincodeCheckResult | null>(null);
  const [pending, start] = useTransition();
  const check = () => {
    if (!/^[1-9]\d{5}$/.test(pin)) return setRes({ ok: false, error: "Please enter a valid 6-digit pincode." });
    start(async () => setRes(await checkPincode(pin, subtotal, weightGrams).catch(() => ({ ok: false as const, error: "Couldn't check right now. Please try again." }))));
  };
  const q = res?.ok ? res.quote : null;
  return (
    <div className={`rounded-xl border border-slate-200 p-3 ${className}`}>
      <form onSubmit={(e) => { e.preventDefault(); check(); }} className="flex gap-2">
        <label className="relative flex-1">
          <span className="sr-only">Delivery pincode</span>
          <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input value={pin} onChange={(e) => { setPin(e.target.value.replace(/\D/g, "").slice(0, 6)); setRes(null); }} inputMode="numeric" autoComplete="postal-code" placeholder="Enter pincode" className="w-full rounded-lg border border-slate-300 bg-white text-slate-900 pl-9 pr-3 py-2 text-sm outline-none focus:border-primary" />
        </label>
        <button type="submit" disabled={pending} className="rounded-lg border-2 border-primary text-primary font-bold text-sm px-4 hover:bg-primary/5 disabled:opacity-60">{pending ? "…" : "Check"}</button>
      </form>
      {res && (
        <div className="mt-2 text-sm" role="status">
          {!res.ok ? <p className="text-rose-600">{res.error}</p> : !q?.serviceable ? <p className="text-rose-600">{q?.reason}</p> : (
            <>
              <p className="flex items-center gap-1.5 font-semibold text-heading"><Truck className="w-4 h-4 text-primary" /> Delivers by {etaDate(q.etaDays[1])}{res.place ? <span className="font-normal text-slate-500">· {res.place}</span> : null}</p>
              <p className="text-xs text-slate-600 mt-0.5">
                {q.fee ? `Delivery ${inr(q.fee)}` : "Free delivery"} · {q.codAllowed ? `Cash on delivery available${q.codFee ? ` (+${inr(q.codFee)})` : ""}` : "Cash on delivery not available"}
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
