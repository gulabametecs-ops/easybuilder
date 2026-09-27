"use client";

import { useActionState, useEffect } from "react";
import { renewSubscription, type RenewState, verifyPayment } from "@/lib/actions/checkout";
import { formatINR } from "@/lib/plans";
import { Card } from "./ui";

type TierOpt = { id: string; name: string; monthlyBase: number };
type DurOpt = { id: string; label: string };

const init: RenewState = { status: "idle" };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare global { interface Window { Razorpay: any } }

function loadRazorpay(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

export function RenewPlanCard({
  tiers,
  durations,
  currentPlan,
}: {
  tiers: TierOpt[];
  durations: DurOpt[];
  currentPlan: string;
}) {
  const [state, action, pending] = useActionState(renewSubscription, init);

  useEffect(() => {
    if (state.status !== "razorpay") return;
    (async () => {
      const ok = await loadRazorpay();
      if (!ok || !window.Razorpay) return;
      const rzp = new window.Razorpay({
        key: state.keyId,
        amount: state.amount,
        currency: "INR",
        name: state.name,
        description: state.planLabel,
        order_id: state.rzpOrderId,
        prefill: { name: state.name, email: state.email, contact: state.phone },
        handler: async (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
          await verifyPayment({
            dbOrderId: state.dbOrderId,
            rzpOrderId: response.razorpay_order_id,
            rzpPaymentId: response.razorpay_payment_id,
            signature: response.razorpay_signature,
          });
          window.location.reload();
        },
      });
      rzp.open();
    })();
  }, [state]);

  return (
    <Card className="p-6 mb-6">
      <h3 className="font-semibold text-slate-900 mb-1">Renew or upgrade</h3>
      <p className="text-sm text-slate-500 mb-4">Extend your subscription or switch to a higher plan without leaving admin.</p>
      <form action={action} className="grid sm:grid-cols-3 gap-3 items-end">
        <label className="block">
          <span className="block text-sm font-medium text-slate-600 mb-1">Plan</span>
          <select name="tier" defaultValue={currentPlan || tiers[1]?.id || tiers[0]?.id} className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm">
            {tiers.map((t) => (
              <option key={t.id} value={t.id}>{t.name} ({formatINR(t.monthlyBase)}/mo)</option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="block text-sm font-medium text-slate-600 mb-1">Duration</span>
          <select name="duration" defaultValue="1y" className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm">
            {durations.map((d) => (
              <option key={d.id} value={d.id}>{d.label}</option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="block text-sm font-medium text-slate-600 mb-1">Coupon (optional)</span>
          <input name="coupon" className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm" placeholder="SAVE20" />
        </label>
        <div className="sm:col-span-3 flex flex-wrap items-center gap-3">
          <button disabled={pending} className="rounded-lg bg-lime-500 text-white text-sm font-semibold px-5 py-2.5 hover:bg-lime-600 disabled:opacity-60">
            {pending ? "Processing..." : "Pay & renew"}
          </button>
          {state.status === "error" && <p className="text-sm text-red-600">{state.message}</p>}
          {state.status === "success" && <p className="text-sm text-green-600">{state.message} ({state.planLabel})</p>}
        </div>
      </form>
    </Card>
  );
}
