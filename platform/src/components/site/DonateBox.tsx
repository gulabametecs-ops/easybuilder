"use client";

import { useState } from "react";
import { confirmSiteDonation, startSiteDonation } from "@/lib/actions/siteDonate";
import { qrImageForData, upiPayLink, type PublicPayments } from "@/lib/payments";
import { PrivacyConsent } from "./PrivacyConsent";

// ponytail: Window.Razorpay is declared (any) in BillingManager/RenewPlanCard/SubscribeFlow

function loadRazorpay(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.Razorpay) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("Could not load Razorpay"));
    document.body.appendChild(s);
  });
}

export function DonateBox({
  payments,
  orgName,
  eventId,
  causeId,
  suggested = 500,
  label = "Donate",
  presets = [500, 1000, 2500],
}: {
  payments: PublicPayments;
  orgName: string;
  eventId?: string;
  /** donation is tagged to this fundraising cause (lib/cause.ts) */
  causeId?: string;
  /** parent can change it later (e.g. a picked impact tier) — the amount follows */
  suggested?: number;
  label?: string;
  presets?: number[];
}) {
  const [amount, setAmount] = useState(suggested > 0 ? suggested : 500);
  const [prevSuggested, setPrevSuggested] = useState(suggested);
  if (suggested !== prevSuggested) {
    setPrevSuggested(suggested);
    if (suggested > 0) setAmount(suggested);
  }
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  const upi = payments.upiId;
  const qr = payments.upiQrImage || (upi ? qrImageForData(upiPayLink(upi, orgName, amount)) : "");
  const hasBank = payments.accountName || payments.accountNumber || payments.upiId;

  async function payOnline() {
    setBusy(true);
    setMsg("");
    try {
      const res = await startSiteDonation({ name, email, phone, amountInr: amount, eventId, causeId });
      if (res.status === "error") {
        setMsg(res.message);
        return;
      }
      if (res.status === "upi") {
        setMsg("Use the QR or UPI ID below to complete the transfer. Thank you.");
        return;
      }
      await loadRazorpay();
      if (!window.Razorpay) {
        setMsg("Razorpay could not open. Use UPI / QR instead.");
        return;
      }
      const rzp = new window.Razorpay({
        key: res.keyId,
        amount: res.amount,
        currency: "INR",
        name: orgName,
        description: label,
        order_id: res.rzpOrderId,
        prefill: { name, email, contact: phone },
        handler: async (resp: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
          const done = await confirmSiteDonation({
            donationId: res.donationId,
            rzpOrderId: resp.razorpay_order_id,
            rzpPaymentId: resp.razorpay_payment_id,
            signature: resp.razorpay_signature,
          });
          setMsg(done.message);
        },
      });
      rzp.open();
    } catch {
      setMsg("Payment could not start. Try UPI / QR.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-2xl ring-1 ring-[var(--site-line)] bg-[var(--site-surface)] p-6 space-y-4">
      <h3 className="text-lg font-bold">{label}</h3>
      <p className="text-sm site-muted">Pay online, scan QR, or transfer to the bank account. Pick whatever is easiest.</p>
      <div className="flex flex-wrap gap-2">
        {presets.filter((n) => n > 0).map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => setAmount(n)}
            className={`rounded-full px-3 py-1 text-sm font-semibold ring-1 ${amount === n ? "bg-primary text-white ring-primary" : "ring-[var(--site-line)]"}`}
          >
            ₹{n.toLocaleString("en-IN")}
          </button>
        ))}
      </div>
      <label className="block text-sm">
        Amount (₹)
        <input type="number" min={1} value={amount} onChange={(e) => setAmount(Number(e.target.value) || 0)} className="mt-1 w-full rounded-lg ring-1 ring-[var(--site-line)] px-3 py-2 bg-transparent" />
      </label>
      <div className="grid sm:grid-cols-3 gap-2">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className="rounded-lg ring-1 ring-[var(--site-line)] px-3 py-2 text-sm bg-transparent" />
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email (receipt)" className="rounded-lg ring-1 ring-[var(--site-line)] px-3 py-2 text-sm bg-transparent" />
        <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone" className="rounded-lg ring-1 ring-[var(--site-line)] px-3 py-2 text-sm bg-transparent" />
      </div>
      {payments.razorpayReady && (
        <button type="button" disabled={busy} onClick={payOnline} className="btn-primary px-5 py-2.5 text-sm font-semibold disabled:opacity-60">
          {busy ? "Opening payment…" : `Pay ₹${amount.toLocaleString("en-IN")} with Razorpay`}
        </button>
      )}
      {qr && (
        <div className="flex items-center gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={qr} alt="Donation QR" className="w-36 h-36 rounded-xl bg-white p-2 ring-1 ring-[var(--site-line)]" />
          <div className="text-sm">
            <p className="font-semibold">Scan to pay</p>
            {upi && <p className="site-muted mt-1">UPI: {upi}</p>}
            {payments.paymentNote && <p className="site-muted mt-2">{payments.paymentNote}</p>}
          </div>
        </div>
      )}
      {hasBank && (
        <dl className="grid sm:grid-cols-2 gap-2 text-sm">
          {payments.bankName && <><dt className="site-muted">Bank</dt><dd>{payments.bankName}</dd></>}
          {payments.accountName && <><dt className="site-muted">Account name</dt><dd>{payments.accountName}</dd></>}
          {payments.accountNumber && <><dt className="site-muted">Account no.</dt><dd className="font-mono">{payments.accountNumber}</dd></>}
          {payments.ifsc && <><dt className="site-muted">IFSC</dt><dd className="font-mono">{payments.ifsc}</dd></>}
        </dl>
      )}
      {!payments.razorpayReady && !qr && !hasBank && (
        <p className="text-sm site-muted">The organisation can add UPI, QR or Razorpay from Admin → Settings → Payments.</p>
      )}
      {msg && <p className="text-sm font-medium text-primary">{msg}</p>}
      <PrivacyConsent className="site-muted" />
    </div>
  );
}
