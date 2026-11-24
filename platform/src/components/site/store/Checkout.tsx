"use client";

import { useEffect, useMemo, useRef, useState, useTransition, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShoppingBag, Trash2, ArrowLeft, Loader2, Lock, Truck, MapPin, CreditCard, Banknote, Smartphone, MessageCircle, TicketPercent, X, ChevronDown,
  CheckCircle2, AlertCircle, ShieldCheck, BookUser,
} from "lucide-react";
import { inr, optionText, productHref, type PaymentMethod } from "@/lib/store";
import { etaDate } from "@/lib/shipping";
import type { CustomerAddress } from "@/lib/storeCustomer";
import {
  placeStoreOrder, quoteCheckout, saveCheckoutDraft, confirmStorePayment, reportPaymentFailed, simulateDemoPayment, resumeStorePayment,
  type PayStart, type QuoteResult,
} from "@/lib/actions/storefront";
import { cartToken, clearCart, removeFromCart, replaceCart, setCartToken, setQty, useCart, type CartItem } from "./cart";
import { ProductImage } from "../sections/StoreBlocks";
import { FIELD, Qty, RADIUS } from "./StoreClient";

// Cart page, one-page checkout, payment launcher (Razorpay Checkout / demo simulator) and cart restore.

const lineInput = (i: CartItem) => ({ productId: i.productId, variantId: i.variantId ?? null, qty: i.qty, options: i.options });
const subtotalOf = (items: CartItem[]) => items.reduce((n, i) => n + i.qty * i.price, 0);
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const digits10 = (p: string) => p.replace(/\D/g, "").slice(-10);

function EmptyCart() {
  return (
    <div className="text-center py-16">
      <ShoppingBag className="w-14 h-14 mx-auto text-primary opacity-60" />
      <h2 className="text-2xl font-bold mt-4">Your cart is empty</h2>
      <p className="site-muted mt-1">Browse the shop and add something you love.</p>
      <Link href="/shop" className="btn-primary inline-flex items-center gap-2 px-6 py-3 mt-6 font-semibold">Start shopping</Link>
    </div>
  );
}

// ─── Cart page ──────────────────────────────────────────────────────────────
export function CartView({ freeShippingAbove, minOrder, checkoutNote }: { freeShippingAbove: number; minOrder: number; checkoutNote: string }) {
  const items = useCart();
  if (!items.length) return <EmptyCart />;
  const subtotal = subtotalOf(items);
  const toFree = freeShippingAbove > 0 ? freeShippingAbove - subtotal : 0;
  const short = minOrder > 0 ? minOrder - subtotal : 0;
  return (
    <div className="grid lg:grid-cols-[1fr_22rem] gap-8 items-start">
      <div className="card sec-card p-4 sm:p-6 min-w-0">
        <h2 className="text-lg font-bold mb-2">Your cart ({items.reduce((n, i) => n + i.qty, 0)})</h2>
        <ul className="divide-y divide-[var(--site-line)]">
          {items.map((i) => (
            <li key={i.key} className="py-4 flex gap-3 sm:gap-4">
              <Link href={productHref(i.slug)} className={`w-20 h-20 sm:w-24 sm:h-24 shrink-0 overflow-hidden ${RADIUS} bg-light`}>
                <ProductImage p={{ name: i.name, images: i.image ? [i.image] : [] }} />
              </Link>
              <div className="flex-1 min-w-0">
                <Link href={productHref(i.slug)} className="font-semibold leading-snug line-clamp-2 hover:text-primary">{i.name}</Link>
                {Object.keys(i.options).length > 0 && <p className="text-xs site-muted mt-0.5">{optionText(i.options)}</p>}
                <div className="mt-2 flex flex-wrap items-center gap-3">
                  <Qty small value={i.qty} onChange={(n) => setQty(i.key, n)} />
                  <button type="button" onClick={() => removeFromCart(i.key)} className="inline-flex items-center gap-1 text-xs font-semibold site-muted hover:text-rose-600"><Trash2 className="w-3.5 h-3.5" /> Remove</button>
                </div>
              </div>
              <p className="font-bold tabular-nums shrink-0">{inr(i.price * i.qty)}</p>
            </li>
          ))}
        </ul>
      </div>
      <aside className="card sec-card p-4 sm:p-6 lg:sticky lg:top-24 space-y-3">
        <h2 className="text-lg font-bold">Summary</h2>
        <div className="flex justify-between text-sm"><span className="site-muted">Subtotal</span><span className="font-semibold tabular-nums">{inr(subtotal)}</span></div>
        <p className="text-xs site-muted">Delivery, discounts and COD charges are calculated at checkout. Prices include GST.</p>
        {toFree > 0 && <FreeBar subtotal={subtotal} target={freeShippingAbove} />}
        {short > 0 && <p className="text-xs rounded-lg bg-amber-50 text-amber-800 px-3 py-2">Minimum order is {inr(minOrder)} — add {inr(short)} more.</p>}
        <Link href="/checkout" aria-disabled={short > 0} className={`btn-primary w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 font-bold ${short > 0 ? "pointer-events-none opacity-50" : ""}`}>
          <Lock className="w-4 h-4" /> Checkout · {inr(subtotal)}
        </Link>
        {checkoutNote && <p className="text-xs site-muted">{checkoutNote}</p>}
        <Link href="/shop" className="flex items-center justify-center gap-1 text-sm font-semibold site-muted hover:text-primary"><ArrowLeft className="w-4 h-4" /> Continue shopping</Link>
      </aside>
    </div>
  );
}

function FreeBar({ subtotal, target }: { subtotal: number; target: number }) {
  const pct = Math.min(100, Math.round((subtotal / target) * 100));
  return (
    <div className="rounded-lg bg-light px-3 py-2.5 text-xs">
      <p>Add <strong>{inr(target - subtotal)}</strong> more for <strong>free delivery</strong></p>
      <span className="mt-1.5 block h-1.5 rounded-full bg-[var(--site-line)] overflow-hidden"><span className="block h-full bg-primary rounded-full" style={{ width: `${pct}%` }} /></span>
    </div>
  );
}

/** /cart?restore=<token>: refill the cart from an abandoned checkout, then drop the param. */
export function CartRestore({ token, items }: { token: string; items: Omit<CartItem, "key">[] }) {
  const router = useRouter();
  useEffect(() => {
    if (items.length) replaceCart(items);
    setCartToken(token);
    router.replace("/cart");
  }, [items, token, router]);
  return null;
}

// ─── Payment launcher ───────────────────────────────────────────────────────
type PayOutcome = "paid" | "failed" | "dismissed";
type RazorpayCtor = new (opts: Record<string, unknown>) => { open: () => void; on: (ev: string, cb: (r: { error?: { description?: string } }) => void) => void };

function loadRazorpay(): Promise<boolean> {
  const w = window as unknown as { Razorpay?: RazorpayCtor };
  if (w.Razorpay) return Promise.resolve(true);
  return new Promise((resolve) => {
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

/** `start(pay, token)` opens Razorpay Checkout (or the demo simulator) and resolves with the outcome. */
export function usePayment(bizName: string) {
  const [demo, setDemo] = useState<{ amount: number; resolve: (ok: boolean | null) => void } | null>(null);
  const start = async (pay: PayStart, token: string): Promise<PayOutcome> => {
    if (pay.mode === "demo") {
      const ok = await new Promise<boolean | null>((resolve) => setDemo({ amount: pay.amount, resolve }));
      setDemo(null);
      if (ok === null) return "dismissed";
      const r = await simulateDemoPayment(token, ok).catch(() => ({ ok: false as const, error: "" }));
      return ok && r.ok ? "paid" : "failed";
    }
    if (!(await loadRazorpay())) return "failed";
    const Rzp = (window as unknown as { Razorpay: RazorpayCtor }).Razorpay;
    return new Promise<PayOutcome>((resolve) => {
      let failed = false;
      const rzp = new Rzp({
        key: pay.keyId, amount: pay.amount, currency: "INR", order_id: pay.orderId, name: pay.name || bizName, description: "Order payment", prefill: pay.prefill,
        theme: { color: getComputedStyle(document.documentElement).getPropertyValue("--c-primary").trim() || "#2563eb" },
        handler: async (r: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
          const c = await confirmStorePayment({ token, razorpayOrderId: r.razorpay_order_id, razorpayPaymentId: r.razorpay_payment_id, signature: r.razorpay_signature }).catch(() => ({ ok: false as const }));
          resolve(c.ok ? "paid" : "failed");
        },
        modal: { ondismiss: () => resolve(failed ? "failed" : "dismissed") },
      });
      rzp.on("payment.failed", (r) => { failed = true; void reportPaymentFailed(token, r.error?.description ?? "").catch(() => {}); });
      rzp.open();
    });
  };
  const sheet = demo ? (
    <div className="fixed inset-0 z-[80] bg-black/50 flex items-end sm:items-center justify-center p-0 sm:p-4" role="dialog" aria-modal aria-label="Demo payment">
      <div className="w-full sm:max-w-sm bg-white text-slate-900 rounded-t-3xl sm:rounded-3xl shadow-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <p className="flex items-center gap-2 font-extrabold"><CreditCard className="w-5 h-5 text-blue-600" /> Test payment</p>
          <button type="button" onClick={() => demo.resolve(null)} aria-label="Close" className="p-1 rounded-lg hover:bg-slate-100"><X className="w-4 h-4" /></button>
        </div>
        <p className="text-sm text-slate-600">This is a demo store — no real money moves. On your live store, shoppers pay here with UPI, cards or netbanking via Razorpay.</p>
        <p className="text-3xl font-extrabold tabular-nums">{inr(demo.amount / 100)}</p>
        <button type="button" onClick={() => demo.resolve(true)} className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3">Pay (simulate success)</button>
        <button type="button" onClick={() => demo.resolve(false)} className="w-full rounded-xl ring-1 ring-slate-300 font-semibold py-2.5 text-rose-600 hover:bg-rose-50">Simulate a failed payment</button>
      </div>
    </div>
  ) : null;
  return { start, sheet };
}

/** "Complete payment" on the order page for unpaid online orders. */
export function PayNow({ token, total, bizName }: { token: string; total: number; bizName: string }) {
  const router = useRouter();
  const { start, sheet } = usePayment(bizName);
  const [pending, run] = useTransition();
  const [msg, setMsg] = useState("");
  const go = () => run(async () => {
    setMsg("");
    const r = await resumeStorePayment(token).catch(() => ({ ok: false as const, error: "Couldn't start the payment. Please try again." }));
    if (!r.ok) return setMsg(r.error);
    const out = await start(r.pay, token);
    if (out === "failed") setMsg("Payment didn't go through. No money was taken — please try again or use another UPI app / card.");
    router.refresh();
  });
  return (
    <div className="space-y-2">
      <button type="button" onClick={go} disabled={pending} className="btn-primary w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 font-bold disabled:opacity-60">
        {pending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Lock className="w-4 h-4" />} Pay {inr(total)} now
      </button>
      {msg && <p className="text-sm font-semibold text-rose-600" role="alert">{msg}</p>}
      {sheet}
    </div>
  );
}

// ─── Checkout ───────────────────────────────────────────────────────────────
export type CheckoutPrefill = { name: string; phone: string; email: string };

const METHOD: Record<PaymentMethod, { icon: typeof Banknote; title: string; hint: string }> = {
  online: { icon: CreditCard, title: "Pay online", hint: "UPI, cards, netbanking & wallets — secured by Razorpay" },
  cod: { icon: Banknote, title: "Cash on delivery", hint: "Pay in cash or UPI when your order arrives" },
  upi: { icon: Smartphone, title: "UPI (scan & pay)", hint: "Pay to our UPI ID after placing the order" },
  whatsapp: { icon: MessageCircle, title: "Order on WhatsApp", hint: "We'll confirm the order and payment on WhatsApp" },
};

type Form = { name: string; phone: string; email: string; pincode: string; address: string; addressLine2: string; city: string; state: string; note: string };

function Section({ n, title, icon, children, aside }: { n: number; title: string; icon: ReactNode; children: ReactNode; aside?: ReactNode }) {
  return (
    <section className="card sec-card p-4 sm:p-6">
      <div className="flex items-center justify-between gap-3 mb-4">
        <h2 className="flex items-center gap-2.5 text-base sm:text-lg font-bold">
          <span className="w-7 h-7 rounded-full bg-primary text-white text-xs font-extrabold inline-flex items-center justify-center shrink-0">{n}</span>
          <span className="text-primary [&>svg]:w-4.5 [&>svg]:h-4.5 hidden sm:inline-flex">{icon}</span>{title}
        </h2>
        {aside}
      </div>
      {children}
    </section>
  );
}

function Input({ label, className = "", ...p }: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className={`block ${className}`}>
      <span className="block text-xs font-semibold site-muted mb-1">{label}</span>
      <input {...p} className={FIELD} />
    </label>
  );
}

export function Checkout({ bizName, methods: initialMethods, prefill, addresses, checkoutNote, demo }: {
  bizName: string; methods: PaymentMethod[]; prefill: CheckoutPrefill | null; addresses: CustomerAddress[]; checkoutNote: string; demo: boolean;
}) {
  const router = useRouter();
  const items = useCart();
  const def = addresses.find((a) => a.isDefault) ?? addresses[0];
  const [f, setF] = useState<Form>(() => ({
    name: def?.name || prefill?.name || "", phone: def?.phone || prefill?.phone || "", email: prefill?.email || "",
    pincode: def?.pincode ?? "", address: def?.line1 ?? "", addressLine2: def?.line2 ?? "", city: def?.city ?? "", state: def?.state ?? "", note: "",
  }));
  const [addrId, setAddrId] = useState(def?.id ?? "");
  const [method, setMethod] = useState<PaymentMethod>(initialMethods[0]);
  const [code, setCode] = useState("");
  const [codeInput, setCodeInput] = useState("");
  const [codeOpen, setCodeOpen] = useState(false);
  const [sum, setSum] = useState<{ key: string; res: QuoteResult } | null>(null);
  const [error, setError] = useState("");
  const [placing, start] = useTransition();
  const [showSummary, setShowSummary] = useState(false);
  const autoPlace = useRef<{ city: string; state: string }>({ city: "", state: "" });
  const { start: startPay, sheet } = usePayment(bizName);
  const set = (k: keyof Form, v: string) => setF((x) => ({ ...x, [k]: v }));

  const lines = useMemo(() => items.map(lineInput), [items]);
  const pin = /^[1-9]\d{5}$/.test(f.pincode) ? f.pincode : "";
  const contactKey = code ? `${f.email}|${digits10(f.phone)}` : "";
  const key = JSON.stringify([lines, pin, method, code, contactKey]);

  // Live, server-priced summary (debounced).
  useEffect(() => {
    if (!lines.length) return;
    let live = true;
    const t = setTimeout(async () => {
      const res = await quoteCheckout({ lines, pincode: pin, state: f.state, paymentMethod: method, couponCode: code, email: f.email, phone: f.phone }).catch(() => ({ ok: false as const, error: "Couldn't update the total. Check your connection." }));
      if (!live) return;
      setSum({ key, res });
      // Pincode → city/state (only overwrite what we filled before, never the shopper's own typing).
      if (res.ok && res.place) {
        const p = res.place;
        const prev = autoPlace.current;
        autoPlace.current = p;
        setF((x) => ({
          ...x,
          city: !x.city || x.city === prev.city ? p.city : x.city,
          state: !x.state || x.state === prev.state ? p.state : x.state,
        }));
      }
    }, 350);
    return () => { live = false; clearTimeout(t); };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- `key` captures every input that changes the price
  }, [key]);

  // Abandoned-checkout capture once we can reach the shopper (debounced).
  const reachable = digits10(f.phone).length === 10 || EMAIL.test(f.email);
  const draftKey = reachable ? JSON.stringify([lines, f.name, f.phone, f.email]) : "";
  useEffect(() => {
    if (!draftKey) return;
    const t = setTimeout(() => {
      const token = cartToken();
      if (token) void saveCheckoutDraft({ token, name: f.name, phone: f.phone, email: f.email, lines }).catch(() => {});
    }, 1500);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- draftKey captures the inputs
  }, [draftKey]);

  if (!items.length) return <EmptyCart />;

  const res = sum?.res ?? null;
  const fresh = sum?.key === key;
  const s = res?.ok ? res : null;
  const methods = s?.methods ?? initialMethods;
  const quote = s?.quote ?? null;
  const active: PaymentMethod = methods.includes(method) ? method : methods[0];
  const codBlocked = !!quote?.serviceable && !quote.codAllowed;
  const subtotal = s?.subtotal ?? subtotalOf(items);
  const total = s?.total ?? subtotal;
  const blocker = res && !res.ok ? res.error : pin && quote && !quote.serviceable ? quote.reason ?? "We can't deliver to this pincode." : "";

  const pickAddress = (a: CustomerAddress) => {
    setAddrId(a.id);
    setF((x) => ({ ...x, name: a.name || x.name, phone: a.phone || x.phone, pincode: a.pincode, address: a.line1, addressLine2: a.line2, city: a.city, state: a.state }));
  };

  const applyCode = () => { setCode(codeInput.trim().toUpperCase()); setCodeOpen(true); };
  const removeCode = () => { setCode(""); setCodeInput(""); };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (blocker) return setError(blocker);
    if (active === "cod" && codBlocked) return setError("Cash on delivery isn't available for this pincode. Please choose another payment option.");
    start(async () => {
      const token = cartToken();
      const r = await placeStoreOrder({ ...f, paymentMethod: active, couponCode: s?.coupon ? code : "", cartToken: token, lines })
        .catch(() => ({ ok: false as const, error: "Could not place the order. Please check your connection and try again." }));
      if (!r.ok) return setError(r.error);
      // The order exists now (stock held). Payment outcome only changes the page we land on.
      const out = r.pay ? await startPay(r.pay, r.token) : null;
      clearCart();
      setCartToken(null);
      if (out) return router.push(`/order/${r.token}${out === "paid" ? "" : `?pay=${out}`}`);
      if (r.paymentMethod === "whatsapp" && r.whatsappUrl) window.open(r.whatsappUrl, "_blank", "noopener");
      router.push(`/order/${r.token}`);
    });
  };

  const summary = (
    <div className="space-y-4">
      <ul className="space-y-3">
        {items.map((i) => (
          <li key={i.key} className="flex items-center gap-3">
            <span className={`relative w-14 h-14 shrink-0 ${RADIUS} bg-light ring-1 ring-[var(--site-line)]`}>
              <span className={`block w-full h-full overflow-hidden ${RADIUS}`}><ProductImage p={{ name: i.name, images: i.image ? [i.image] : [] }} /></span>
              <span className="absolute -top-1.5 -right-1.5 min-w-5 h-5 px-1 rounded-full bg-[var(--c-heading,#0f172a)] text-white text-[11px] font-bold inline-flex items-center justify-center">{i.qty}</span>
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-semibold leading-snug line-clamp-2">{i.name}</span>
              {Object.keys(i.options).length > 0 && <span className="block text-xs site-muted">{optionText(i.options)}</span>}
            </span>
            <span className="text-sm font-semibold tabular-nums">{inr(i.price * i.qty)}</span>
          </li>
        ))}
      </ul>

      {/* Coupon */}
      <div className="border-t border-[var(--site-line)] pt-4">
        {s?.coupon ? (
          <div className={`flex items-center justify-between gap-2 ${RADIUS} bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200 px-3 py-2.5`}>
            <span className="flex items-center gap-2 text-sm min-w-0"><TicketPercent className="w-4 h-4 shrink-0" /><span className="min-w-0"><b className="font-mono">{s.coupon.code}</b> applied · {s.coupon.label}</span></span>
            <button type="button" onClick={removeCode} className="text-xs font-bold hover:underline shrink-0">Remove</button>
          </div>
        ) : !codeOpen && !code ? (
          <button type="button" onClick={() => setCodeOpen(true)} className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"><TicketPercent className="w-4 h-4" /> Have a discount code?</button>
        ) : (
          <div>
            <div className="flex gap-2">
              <input value={codeInput} onChange={(e) => setCodeInput(e.target.value.toUpperCase().replace(/\s/g, ""))} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); applyCode(); } }} placeholder="Discount code" aria-label="Discount code" maxLength={40} className={`${FIELD} font-mono uppercase`} />
              <button type="button" onClick={applyCode} disabled={!codeInput.trim()} className={`${RADIUS} px-4 text-sm font-bold ring-2 ring-inset ring-primary text-primary hover:bg-primary hover:text-white transition disabled:opacity-40`}>Apply</button>
            </div>
            {code && fresh && s && !s.coupon && s.couponError && <p className="mt-1.5 text-xs font-semibold text-rose-600" role="alert">{s.couponError}</p>}
            {code && !fresh && <p className="mt-1.5 text-xs site-muted">Checking code…</p>}
          </div>
        )}
      </div>

      <dl className="border-t border-[var(--site-line)] pt-4 space-y-2 text-sm">
        <div className="flex justify-between"><dt className="site-muted">Subtotal</dt><dd className="font-semibold tabular-nums">{inr(subtotal)}</dd></div>
        {!!s?.discount && <div className="flex justify-between text-emerald-700"><dt>Discount{s.coupon ? ` (${s.coupon.code})` : ""}</dt><dd className="font-semibold tabular-nums">−{inr(s.discount)}</dd></div>}
        <div className="flex justify-between">
          <dt className="site-muted">Delivery</dt>
          <dd className="font-semibold tabular-nums">{!quote ? <span className="site-muted font-normal text-xs">Enter pincode</span> : !quote.serviceable ? "—" : s?.shipping ? inr(s.shipping) : <span className="text-emerald-700">Free</span>}</dd>
        </div>
        {!!s?.codFee && <div className="flex justify-between"><dt className="site-muted">COD charge</dt><dd className="font-semibold tabular-nums">{inr(s.codFee)}</dd></div>}
        <div className="flex justify-between items-baseline border-t border-[var(--site-line)] pt-3">
          <dt className="text-base font-bold">Total</dt>
          <dd className="text-right"><span className="text-2xl font-extrabold tabular-nums">{inr(total)}</span>{!fresh && <Loader2 className="inline w-3.5 h-3.5 ml-1.5 animate-spin site-muted" />}</dd>
        </div>
        <p className="text-xs site-muted text-right">Inclusive of GST{s?.tax ? ` (${inr(s.tax)})` : ""}</p>
      </dl>
    </div>
  );

  const pinMsg = !f.pincode ? null : f.pincode.length < 6 ? null : !pin ? <p className="text-xs font-semibold text-rose-600">Please enter a valid 6-digit pincode.</p>
    : !fresh && !quote ? <p className="text-xs site-muted">Checking delivery…</p>
    : quote && !quote.serviceable ? <p className="flex items-center gap-1.5 text-xs font-semibold text-rose-600" role="alert"><AlertCircle className="w-3.5 h-3.5" /> {quote.reason}</p>
    : quote ? <p className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700"><CheckCircle2 className="w-3.5 h-3.5" /> Delivers to {s?.place?.city || f.city || "this pincode"} by {etaDate(quote.etaDays[1])}</p> : null;

  return (
    <form onSubmit={submit} className="grid lg:grid-cols-[1fr_24rem] gap-6 lg:gap-8 items-start">
      {/* Mobile: collapsible summary (Shopify-style) */}
      <div className="lg:hidden card sec-card overflow-hidden">
        <button type="button" onClick={() => setShowSummary((v) => !v)} className="w-full flex items-center justify-between gap-3 px-4 py-3.5" aria-expanded={showSummary}>
          <span className="flex items-center gap-2 text-sm font-semibold text-primary"><ShoppingBag className="w-4 h-4" /> {showSummary ? "Hide" : "Show"} order summary <ChevronDown className={`w-4 h-4 transition ${showSummary ? "rotate-180" : ""}`} /></span>
          <span className="text-lg font-extrabold tabular-nums">{inr(total)}</span>
        </button>
        {showSummary && <div className="px-4 pb-4">{summary}</div>}
      </div>

      <div className="space-y-4 sm:space-y-5 min-w-0">
        <Section n={1} title="Contact" icon={<MessageCircle />} aside={!prefill && <Link href="/account" className="text-xs font-semibold text-primary hover:underline">Sign in</Link>}>
          <div className="grid sm:grid-cols-2 gap-3">
            <Input label="Mobile number *" name="phone" required type="tel" inputMode="tel" autoComplete="tel" value={f.phone} onChange={(e) => set("phone", e.target.value)} placeholder="10-digit mobile" />
            <Input label="Email (for order updates)" name="email" type="email" autoComplete="email" value={f.email} onChange={(e) => set("email", e.target.value)} placeholder="you@example.com" />
          </div>
        </Section>

        <Section n={2} title="Delivery address" icon={<MapPin />}>
          {addresses.length > 0 && (
            <div className="mb-4 space-y-2">
              <p className="flex items-center gap-1.5 text-xs font-semibold site-muted"><BookUser className="w-3.5 h-3.5" /> Saved addresses</p>
              <div className="grid sm:grid-cols-2 gap-2">
                {addresses.map((a) => (
                  <button key={a.id} type="button" onClick={() => pickAddress(a)} aria-pressed={addrId === a.id} className={`text-left ${RADIUS} p-3 ring-1 ring-inset text-xs transition ${addrId === a.id ? "ring-2 ring-primary bg-light" : "ring-[var(--site-line)] hover:ring-primary"}`}>
                    <span className="block font-bold text-sm">{a.name}{a.isDefault && <span className="ml-1.5 text-[10px] font-bold uppercase text-primary">Default</span>}</span>
                    <span className="block site-muted line-clamp-2">{[a.line1, a.line2, a.city, a.pincode].filter(Boolean).join(", ")}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="sm:col-span-2 grid grid-cols-[9rem_1fr] sm:grid-cols-[11rem_1fr] gap-3 items-start">
              <Input label="Pincode *" name="pincode" required inputMode="numeric" autoComplete="postal-code" maxLength={6} value={f.pincode} onChange={(e) => { set("pincode", e.target.value.replace(/\D/g, "").slice(0, 6)); setAddrId(""); }} placeholder="6 digits" />
              <div className="pt-6 min-h-6">{pinMsg}</div>
            </div>
            <Input label="Full name *" name="name" required minLength={2} autoComplete="name" value={f.name} onChange={(e) => set("name", e.target.value)} className="sm:col-span-2" />
            <Input label="House / flat no., building, street *" name="address" required minLength={5} autoComplete="address-line1" value={f.address} onChange={(e) => set("address", e.target.value)} className="sm:col-span-2" />
            <Input label="Area, landmark (optional)" name="addressLine2" autoComplete="address-line2" value={f.addressLine2} onChange={(e) => set("addressLine2", e.target.value)} className="sm:col-span-2" />
            <Input label="City *" name="city" required autoComplete="address-level2" value={f.city} onChange={(e) => set("city", e.target.value)} />
            <Input label="State" name="state" autoComplete="address-level1" value={f.state} onChange={(e) => set("state", e.target.value)} />
            <Input label="Order note (optional)" name="note" value={f.note} onChange={(e) => set("note", e.target.value)} placeholder="Gift message, delivery time…" className="sm:col-span-2" />
          </div>
        </Section>

        <Section n={3} title="Delivery" icon={<Truck />}>
          {!quote ? <p className="text-sm site-muted">Enter your pincode to see delivery charges and date.</p>
            : !quote.serviceable ? <p className={`flex items-start gap-2 ${RADIUS} bg-rose-50 text-rose-700 px-3.5 py-3 text-sm font-semibold`} role="alert"><AlertCircle className="w-4 h-4 mt-0.5 shrink-0" /> {quote.reason}</p>
            : (
              <div className={`flex items-center gap-3 ${RADIUS} ring-2 ring-primary bg-light p-3.5`}>
                <Truck className="w-5 h-5 text-primary shrink-0" />
                <span className="flex-1 min-w-0">
                  <span className="block font-semibold text-sm">{quote.zoneName ? `${quote.zoneName} delivery` : "Standard delivery"}</span>
                  <span className="block text-xs site-muted">Arrives {quote.etaDays[0] === quote.etaDays[1] ? `by ${etaDate(quote.etaDays[1])}` : `${etaDate(quote.etaDays[0])} – ${etaDate(quote.etaDays[1])}`}</span>
                </span>
                <span className="font-bold text-sm tabular-nums">{s?.shipping ? inr(s.shipping) : <span className="text-emerald-700">FREE</span>}</span>
              </div>
            )}
        </Section>

        <Section n={4} title="Payment" icon={<CreditCard />} aside={<span className="inline-flex items-center gap-1 text-[11px] font-semibold site-muted"><ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Secure</span>}>
          <div className="space-y-2.5" role="radiogroup" aria-label="Payment method">
            {methods.map((m) => {
              const M = METHOD[m];
              const off = m === "cod" && codBlocked;
              return (
                <label key={m} className={`flex items-center gap-3 ${RADIUS} p-3.5 ring-1 ring-inset transition ${off ? "opacity-50 cursor-not-allowed ring-[var(--site-line)]" : "cursor-pointer"} ${active === m && !off ? "ring-2 ring-primary bg-light" : "ring-[var(--site-line)] hover:ring-primary"}`}>
                  <input type="radio" name="pay" value={m} disabled={off} checked={active === m} onChange={() => setMethod(m)} className="accent-[var(--c-primary)] w-4 h-4" />
                  <M.icon className="w-5 h-5 text-primary shrink-0" />
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold text-sm">{M.title}{m === "online" && demo && <span className="ml-1.5 text-[10px] font-bold uppercase tracking-wide text-violet-600">Demo · simulated</span>}</span>
                    <span className="block text-xs site-muted">{off ? "Not available for this pincode" : M.hint}</span>
                  </span>
                  {m === "cod" && !off && !!quote?.codFee && <span className="text-xs font-semibold site-muted shrink-0">+{inr(quote.codFee)}</span>}
                </label>
              );
            })}
          </div>
        </Section>
      </div>

      <aside className="card sec-card p-4 sm:p-6 lg:sticky lg:top-24 space-y-4">
        <h2 className="hidden lg:block text-lg font-bold">Order summary</h2>
        <div className="hidden lg:block">{summary}</div>
        <div className="lg:hidden flex justify-between items-baseline"><span className="font-bold">Total</span><span className="text-2xl font-extrabold tabular-nums">{inr(total)}</span></div>
        {error && <p className={`flex items-start gap-2 ${RADIUS} bg-rose-50 text-rose-700 px-3 py-2.5 text-sm font-semibold`} role="alert"><AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />{error}</p>}
        {!error && blocker && pin && <p className="text-sm font-semibold text-rose-600">{blocker}</p>}
        <button type="submit" disabled={placing || !!blocker} className="btn-primary w-full inline-flex items-center justify-center gap-2 px-5 py-4 text-base font-bold disabled:opacity-60">
          {placing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Lock className="w-4 h-4" />}
          {active === "online" ? `Pay ${inr(total)}` : active === "whatsapp" ? `Place order on WhatsApp · ${inr(total)}` : `Place order · ${inr(total)}`}
        </button>
        {checkoutNote && <p className="text-xs site-muted text-center">{checkoutNote}</p>}
        <Link href="/cart" className="flex items-center justify-center gap-1 text-sm font-semibold site-muted hover:text-primary"><ArrowLeft className="w-4 h-4" /> Back to cart</Link>
      </aside>
      {sheet}
    </form>
  );
}
