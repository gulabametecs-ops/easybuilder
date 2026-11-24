import Link from "next/link";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { CheckCircle2, Clock3, XCircle, Truck, MessageCircle, MapPin, UserRound, Smartphone, Banknote, CreditCard } from "lucide-react";
import { db } from "@/lib/db";
import { getCurrentTenant } from "@/lib/tenant";
import { getStoreSettings } from "@/lib/storeServer";
import { getStoreCustomer } from "@/lib/storeCustomer";
import { etaDate, quoteShipping } from "@/lib/shipping";
import { PAYMENT_LABEL, inr, jsonList, optionText, orderLabel, orderSummaryText, waLink, type OrderItem } from "@/lib/store";
import { qrImageForData, upiPayLink } from "@/lib/payments";
import { PayNow } from "@/components/site/store/Checkout";

export const metadata = { title: "Order confirmed", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function OrderPage({ params, searchParams }: { params: Promise<{ token: string }>; searchParams: Promise<{ pay?: string }> }) {
  const tenant = await getCurrentTenant();
  if (!tenant) notFound();
  const { token } = await params;
  if (!/^[\w-]{16,64}$/.test(token)) notFound();
  const o = await db.storeOrder.findFirst({ where: { tenantId: tenant.id, trackToken: token } });
  if (!o) notFound();
  const [settings, me, sp, h] = await Promise.all([getStoreSettings(tenant.id, o.demoSessionId), getStoreCustomer(), searchParams, headers()]);
  const host = h.get("host") ?? "";
  const trackUrl = `${host.includes("localhost") ? "http" : "https"}://${host}/track/${token}`;
  const items = jsonList<OrderItem>(o.items);
  const first = o.customerName.split(" ")[0] || "there";
  const online = o.paymentMethod === "online";
  const paid = o.paymentStatus === "paid";
  const expired = online && !paid && o.status === "cancelled";
  const awaiting = online && !paid && !expired && o.paymentStatus !== "refunded";
  const quote = quoteShipping(settings, { pincode: o.pincode, state: o.state, subtotal: o.subtotal, weightGrams: o.weightGrams });
  const eta = quote.serviceable && o.status !== "cancelled" ? etaDate(quote.etaDays[1], o.createdAt) : "";
  const upi = o.paymentMethod === "upi" && settings.upiId && !paid ? upiPayLink(settings.upiId, tenant.name, o.total) : "";
  const summary = orderSummaryText({ bizName: tenant.name, orderNo: o.orderNo, items, subtotal: o.subtotal, shipping: o.shipping, discount: o.discount, codFee: o.codFee, total: o.total, paymentMethod: o.paymentMethod, customerName: o.customerName, phone: o.phone, address: [o.address, o.addressLine2].filter(Boolean).join(", "), city: o.city, pincode: o.pincode });
  const waStore = settings.whatsappNumber ? waLink(settings.whatsappNumber, `Hi! About my order ${orderLabel(o.orderNo)}:\n\n${summary}`) : "";
  const card = "rounded-2xl bg-[var(--site-surface,#fff)] ring-1 ring-[var(--site-line)] p-5 sm:p-6";

  const Head = expired ? XCircle : awaiting ? Clock3 : CheckCircle2;
  const tone = expired ? "text-rose-500" : awaiting ? "text-amber-500" : "text-emerald-500";
  const title = expired ? "Order expired" : awaiting ? "Almost there — complete your payment" : `Thank you, ${first}!`;
  const sub = expired
    ? "Payment wasn't completed in time, so this order was cancelled and nothing was charged."
    : awaiting
      ? "Your items are reserved for a few minutes. Complete the payment to confirm your order."
      : `Your order ${orderLabel(o.orderNo)} is confirmed. ${o.email ? `We've sent the details to ${o.email}.` : "Save this page to track it."}`;

  return (
    <div className="site-sec bg-light min-h-[60vh]">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:py-12 space-y-4">
        <div className="text-center">
          <Head className={`w-16 h-16 mx-auto ${tone}`} />
          <p className="mt-3 text-sm font-semibold site-muted">Order {orderLabel(o.orderNo)}</p>
          <h1 className="text-2xl sm:text-3xl font-extrabold mt-1">{title}</h1>
          <p className="site-muted mt-2 max-w-lg mx-auto">{sub}</p>
        </div>

        {/* Payment */}
        <section className={card}>
          <h2 className="font-bold flex items-center gap-2 mb-3">
            {online ? <CreditCard className="w-4 h-4 text-primary" /> : o.paymentMethod === "upi" ? <Smartphone className="w-4 h-4 text-primary" /> : o.paymentMethod === "whatsapp" ? <MessageCircle className="w-4 h-4 text-primary" /> : <Banknote className="w-4 h-4 text-primary" />}
            Payment · {PAYMENT_LABEL[o.paymentMethod] ?? o.paymentMethod}
          </h2>
          {paid && <p className="flex items-center gap-2 text-emerald-700 font-semibold"><CheckCircle2 className="w-4 h-4" /> Paid {inr(o.total)}{o.paymentId ? <span className="font-normal text-xs site-muted">· Ref {o.paymentId}</span> : null}</p>}
          {o.paymentStatus === "refunded" && <p className="font-semibold site-muted">Refunded {inr(o.refundAmount)}</p>}
          {awaiting && (
            <div className="space-y-3">
              {(sp.pay === "failed" || o.paymentStatus === "failed") && <p className="rounded-xl bg-rose-50 text-rose-700 text-sm px-3.5 py-2.5">Your last payment attempt didn&apos;t go through. No money was taken — please try again.</p>}
              {sp.pay === "dismissed" && o.paymentStatus !== "failed" && <p className="rounded-xl bg-amber-50 text-amber-800 text-sm px-3.5 py-2.5">Payment window was closed before paying.</p>}
              <PayNow token={token} total={o.total} bizName={tenant.name} />
            </div>
          )}
          {expired && <Link href="/shop" className="btn-primary inline-flex items-center gap-2 px-5 py-3 font-bold">Shop again</Link>}
          {o.paymentMethod === "cod" && !paid && <p className="text-sm">Pay <b>{inr(o.total)}</b> in cash or UPI when your order arrives.</p>}
          {o.paymentMethod === "whatsapp" && !paid && (
            <div className="space-y-3">
              <p className="text-sm">Send your order to us on WhatsApp — we&apos;ll confirm it and share payment details.</p>
              {waStore && <a href={waStore} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 font-bold"><MessageCircle className="w-4 h-4" /> Send order on WhatsApp</a>}
            </div>
          )}
          {upi && (
            <div className="flex flex-col sm:flex-row items-center gap-5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={settings.upiQrImage || qrImageForData(upi, 240)} alt="UPI QR code" className="w-44 h-44 rounded-xl ring-1 ring-[var(--site-line)] bg-white p-2 shrink-0" />
              <div className="space-y-2 text-sm text-center sm:text-left">
                <p>Scan with any UPI app and pay <b>{inr(o.total)}</b></p>
                <p>or pay to <b className="select-all">{settings.upiId}</b></p>
                <a href={upi} className="btn-primary inline-flex items-center gap-2 px-5 py-3 font-bold sm:hidden"><Smartphone className="w-4 h-4" /> Pay with UPI app</a>
                <p className="text-xs site-muted">Add &ldquo;{orderLabel(o.orderNo)}&rdquo; in the payment note. We&apos;ll confirm once received{waStore ? " — or send us the screenshot on WhatsApp" : ""}.</p>
              </div>
            </div>
          )}
        </section>

        {/* Summary */}
        <section className={card}>
          <h2 className="font-bold mb-3">Order summary</h2>
          <ul className="divide-y divide-[var(--site-line)]">
            {items.map((i, k) => (
              <li key={k} className="py-2.5 flex items-center gap-3 text-sm">
                <span className="w-12 h-12 rounded-lg overflow-hidden bg-light shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {i.image && <img src={i.image} alt="" className="w-full h-full object-cover" />}
                </span>
                <span className="flex-1 min-w-0"><span className="block font-semibold truncate">{i.name}</span><span className="block text-xs site-muted">{[optionText(i.options ?? {}), `Qty ${i.qty}`].filter(Boolean).join(" · ")}</span></span>
                <span className="font-semibold tabular-nums">{inr(i.price * i.qty)}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-3 pt-3 border-t border-[var(--site-line)] space-y-1.5 text-sm">
            <div className="flex justify-between"><dt className="site-muted">Subtotal</dt><dd className="tabular-nums">{inr(o.subtotal)}</dd></div>
            {o.discount > 0 && <div className="flex justify-between text-emerald-700"><dt>Discount{o.couponCode ? ` (${o.couponCode})` : ""}</dt><dd className="tabular-nums">−{inr(o.discount)}</dd></div>}
            <div className="flex justify-between"><dt className="site-muted">Delivery</dt><dd className="tabular-nums">{o.shipping ? inr(o.shipping) : "Free"}</dd></div>
            {o.codFee > 0 && <div className="flex justify-between"><dt className="site-muted">COD charge</dt><dd className="tabular-nums">{inr(o.codFee)}</dd></div>}
            <div className="flex justify-between text-base font-extrabold pt-1"><dt>Total</dt><dd className="tabular-nums">{inr(o.total)}</dd></div>
            <p className="text-xs site-muted text-right">Inclusive of GST{o.tax ? ` (${inr(o.tax)})` : ""}</p>
          </dl>
        </section>

        <section className={`${card} grid sm:grid-cols-2 gap-4 text-sm`}>
          <div>
            <p className="flex items-center gap-1.5 font-bold mb-1"><MapPin className="w-4 h-4 text-primary" /> Delivering to</p>
            <p>{o.customerName} · {o.phone}</p>
            <p className="site-muted">{[o.address, o.addressLine2, o.city, o.state, o.pincode].filter(Boolean).join(", ")}</p>
          </div>
          {eta && !expired && (
            <div>
              <p className="flex items-center gap-1.5 font-bold mb-1"><Truck className="w-4 h-4 text-primary" /> Expected delivery</p>
              <p>By {eta}</p>
            </div>
          )}
        </section>

        <div className="flex flex-wrap gap-3 justify-center">
          {!expired && <Link href={`/track/${token}`} className="btn-primary inline-flex items-center gap-2 px-5 py-3 font-bold"><Truck className="w-4 h-4" /> Track order</Link>}
          <a href={`https://wa.me/?text=${encodeURIComponent(`My order ${orderLabel(o.orderNo)} from ${tenant.name} — track it here: ${trackUrl}`)}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl ring-1 ring-inset ring-[var(--site-line)] px-5 py-3 font-semibold hover:text-primary"><MessageCircle className="w-4 h-4" /> Share on WhatsApp</a>
          <Link href="/shop" className="inline-flex items-center gap-2 rounded-xl ring-1 ring-inset ring-[var(--site-line)] px-5 py-3 font-semibold hover:text-primary">Continue shopping</Link>
        </div>

        {!me && !expired && (
          <section className={`${card} flex flex-col sm:flex-row items-center gap-4`}>
            <UserRound className="w-10 h-10 text-primary shrink-0" />
            <div className="flex-1 text-center sm:text-left">
              <p className="font-bold">Create an account in one step</p>
              <p className="text-sm site-muted">See all your orders, save addresses and check out faster next time{o.email ? ` — just sign in with ${o.email}` : ""}.</p>
            </div>
            <Link href="/account" className="inline-flex items-center gap-2 rounded-xl ring-2 ring-inset ring-primary text-primary px-5 py-2.5 font-bold hover:bg-primary hover:text-white transition">Create account</Link>
          </section>
        )}
      </div>
    </div>
  );
}
