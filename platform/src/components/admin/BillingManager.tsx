"use client";

import { useActionState, useEffect, useState } from "react";
import Link from "next/link";
import { CreditCard, FileText, CheckCircle2, Sparkles } from "lucide-react";
import { renewSubscription, type RenewState, verifyPayment } from "@/lib/actions/checkout";
import { formatINR } from "@/lib/plans";
import { AdminWorkspace, fieldCls, labelCls } from "./AdminWorkspace";
import { Badge } from "./ui";

type TierOpt = { id: string; name: string; monthlyBase: number };
type DurOpt = { id: string; label: string };
type OrderRow = {
  id: string;
  invoiceNo: string | null;
  createdAt: string | Date;
  amount: number;
  status: string;
};

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

const TABS = [
  { id: "renew", label: "Renew", hint: "Upgrade", icon: Sparkles },
  { id: "invoices", label: "Invoices", hint: "History", icon: FileText },
] as const;

export function BillingManager({
  tiers,
  durations,
  currentPlan,
  canRenew,
  orders,
}: {
  tiers: TierOpt[];
  durations: DurOpt[];
  currentPlan: string;
  canRenew: boolean;
  orders: OrderRow[];
}) {
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>(canRenew ? "renew" : "invoices");
  const [tier, setTier] = useState(currentPlan || tiers[1]?.id || tiers[0]?.id || "");
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

  const selected = tiers.find((t) => t.id === tier);

  return (
    <AdminWorkspace
      title="Billing"
      titleIcon={<CreditCard className="w-4 h-4 text-lime-600 shrink-0" />}
      tabs={canRenew ? [...TABS] : TABS.filter((t) => t.id === "invoices")}
      tab={tab}
      onTabChange={(id) => setTab(id as typeof tab)}
    >
      {tab === "renew" && canRenew && (
        <form action={action} className="space-y-4 max-w-2xl">
          <input type="hidden" name="tier" value={tier} />
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Choose plan</p>
            <div className="grid sm:grid-cols-2 gap-2">
              {tiers.map((t) => {
                const on = tier === t.id;
                const current = t.id === currentPlan;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTier(t.id)}
                    className={`text-left rounded-2xl border-2 p-3 transition ${
                      on ? "border-lime-500 ring-2 ring-lime-500/20 bg-lime-50/50 dark:bg-lime-500/5" : "border-slate-200 dark:border-slate-700 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                          {t.name}
                          {current && <span className="text-[9px] font-bold uppercase tracking-wide text-lime-700 bg-lime-100 px-1.5 py-0.5 rounded-full">Current</span>}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">{formatINR(t.monthlyBase)} / month</p>
                      </div>
                      {on && <CheckCircle2 className="w-4 h-4 text-lime-600 shrink-0" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <label className="block">
              <span className={labelCls}>Duration</span>
              <select name="duration" defaultValue="1y" className={fieldCls}>
                {durations.map((d) => <option key={d.id} value={d.id}>{d.label}</option>)}
              </select>
            </label>
            <label className="block">
              <span className={labelCls}>Coupon (optional)</span>
              <input name="coupon" className={fieldCls} placeholder="SAVE20" />
            </label>
          </div>

          {selected && (
            <div className="rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/40 px-3 py-2.5 text-xs text-slate-600 dark:text-slate-300">
              Renewing <b className="text-slate-900 dark:text-white">{selected.name}</b> at {formatINR(selected.monthlyBase)}/mo base — pay securely with Razorpay.
            </div>
          )}

          <button disabled={pending} className="w-full rounded-xl bg-lime-500 text-white text-sm font-bold py-2.5 hover:bg-lime-600 disabled:opacity-60">
            {pending ? "Processing…" : "Pay & renew"}
          </button>
          {state.status === "error" && <p className="text-xs text-rose-600">{state.message}</p>}
          {state.status === "success" && <p className="text-xs text-emerald-600">{state.message} ({state.planLabel})</p>}
        </form>
      )}

      {tab === "invoices" && (
        <div className="space-y-2 max-w-2xl">
          {orders.length === 0 ? (
            <div className="text-center py-14 px-4">
              <span className="inline-flex w-12 h-12 rounded-2xl bg-lime-500/15 text-lime-600 items-center justify-center mb-3">
                <FileText className="w-6 h-6" />
              </span>
              <p className="text-sm font-semibold text-slate-800 dark:text-white">No invoices yet</p>
              <p className="text-xs text-slate-400 mt-1">Payments will show up here after you renew.</p>
            </div>
          ) : (
            orders.map((o) => (
              <div key={o.id} className="rounded-xl border border-slate-100 dark:border-slate-800 px-3 py-3 flex flex-wrap items-center gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{o.invoiceNo ?? "Invoice"}</p>
                  <p className="text-[10px] text-slate-400">{new Date(o.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
                </div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">{formatINR(o.amount)}</p>
                <Badge tone={o.status === "refunded" ? "red" : o.status === "provisioned" || o.status === "paid" ? "green" : "slate"}>{o.status}</Badge>
                {(o.status === "provisioned" || o.status === "paid" || o.status === "refunded") && (
                  <Link href={`/admin/invoice/${o.id}`} className="inline-flex items-center gap-1 text-xs font-semibold text-lime-600 hover:underline">
                    <FileText className="w-3.5 h-3.5" /> PDF
                  </Link>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </AdminWorkspace>
  );
}
