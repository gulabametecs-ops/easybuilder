import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, Circle, Truck, PackageCheck, ExternalLink, MessageCircle, XCircle, Undo2, MapPin } from "lucide-react";
import { db } from "@/lib/db";
import { getCurrentTenant } from "@/lib/tenant";
import { getStoreSettings } from "@/lib/storeServer";
import { parseTimeline } from "@/lib/fulfilment";
import { etaDate, quoteShipping } from "@/lib/shipping";
import { ORDER_STATUSES, PAYMENT_LABEL, inr, optionText, orderLabel, waLink, type OrderItem } from "@/lib/store";
import { ReturnRequest } from "@/components/site/TrackClient";

export const metadata = { title: "Order status", robots: { index: false } };

const STEPS = ORDER_STATUSES.filter((s) => s.id !== "cancelled");
const when = (d: Date | string) => new Date(d).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" });
const RETURN_TEXT: Record<string, string> = {
  requested: "Return requested — the store will review it shortly.",
  approved: "Return approved — the store will contact you about pickup or drop-off.",
  rejected: "Return request was not accepted. Please contact the store for help.",
  received: "Returned item(s) received — your refund is being processed.",
  refunded: "Refund issued.",
};

const withinDays = (d: Date, days: number) => Date.now() - d.getTime() <= days * 86_400_000;

export default async function TrackOrderPage({ params }: { params: Promise<{ token: string }> }) {
  const tenant = await getCurrentTenant();
  if (!tenant) notFound();
  const { token } = await params;
  if (!/^[\w-]{16,64}$/.test(token)) notFound();
  const o = await db.storeOrder.findFirst({ where: { tenantId: tenant.id, trackToken: token } });
  if (!o) notFound();
  const settings = await getStoreSettings(tenant.id, o.demoSessionId);
  let items: OrderItem[] = [];
  try { items = JSON.parse(o.items || "[]"); } catch { /* none */ }

  const cancelled = o.status === "cancelled";
  const step = STEPS.findIndex((s) => s.id === o.status);
  const timeline = parseTimeline(o.timeline).filter((e) => !e.status.startsWith("payment_")).reverse();
  const at = (status: string) => parseTimeline(o.timeline).find((e) => e.status === status)?.at;
  const quote = quoteShipping(settings, { pincode: o.pincode, state: o.state, subtotal: o.subtotal, weightGrams: o.weightGrams });
  const expected = !cancelled && o.status !== "delivered" && quote.serviceable ? etaDate(quote.etaDays[1], o.createdAt) : "";
  const returnDays = settings.shipping.returnWindowDays;
  const deliveredAt = o.deliveredAt ?? (o.status === "delivered" ? o.updatedAt : null);
  const canReturn = o.status === "delivered" && o.returnStatus === "none" && returnDays > 0 && !!deliveredAt && withinDays(deliveredAt, returnDays);
  const returnBy = deliveredAt && returnDays ? etaDate(returnDays, deliveredAt) : "";

  return (
    <section className="py-10 sm:py-16 bg-light min-h-[60vh]">
      <div className="mx-auto max-w-3xl px-4 space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-sm text-slate-500">Placed {when(o.createdAt)}</p>
            <h1 className="text-3xl font-extrabold text-heading">Order {orderLabel(o.orderNo)}</h1>
          </div>
          {expected && <p className="rounded-full bg-primary/10 text-primary font-bold text-sm px-4 py-1.5">Expected by {expected}</p>}
          {o.status === "delivered" && <p className="rounded-full bg-emerald-100 text-emerald-700 font-bold text-sm px-4 py-1.5">Delivered {deliveredAt ? when(deliveredAt) : ""}</p>}
        </div>

        <div className="rounded-2xl bg-white shadow-sm border border-slate-200/70 p-5">
          {cancelled ? (
            <p className="flex items-center gap-2 text-rose-600 font-bold"><XCircle className="w-5 h-5" /> This order was cancelled{o.cancelReason ? ` — ${o.cancelReason}` : ""}.</p>
          ) : (
            <ol className="grid grid-cols-5 gap-1 text-center">
              {STEPS.map((s, i) => {
                const done = i <= step;
                const t = at(s.id);
                return (
                  <li key={s.id} className="min-w-0">
                    <span className={`block h-1.5 rounded-full ${done ? "bg-primary" : "bg-slate-200"}`} />
                    <span className={`mt-2 flex flex-col items-center gap-0.5 text-[11px] sm:text-xs font-semibold ${done ? "text-heading" : "text-slate-400"}`}>
                      {done ? <CheckCircle2 className="w-4 h-4 text-primary" /> : <Circle className="w-4 h-4" />}
                      <span className="truncate max-w-full">{s.id === "new" ? "Placed" : s.label}</span>
                      {done && t && <span className="font-normal text-slate-400 text-[10px]">{new Date(t).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>}
                    </span>
                  </li>
                );
              })}
            </ol>
          )}
        </div>

        {(o.awb || o.courier) && (
          <div className="rounded-2xl bg-white shadow-sm border border-slate-200/70 p-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="flex items-center gap-2 font-bold text-heading"><Truck className="w-5 h-5 text-primary" /> {o.courier || "Shipped"}</p>
              {o.awb && <p className="text-sm text-slate-600 mt-0.5">Tracking number (AWB): <span className="font-mono font-semibold select-all">{o.awb}</span></p>}
            </div>
            {o.trackingUrl && <a href={o.trackingUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-xl bg-primary text-white font-semibold text-sm px-4 py-2.5 hover:opacity-90"><ExternalLink className="w-4 h-4" /> Track with courier</a>}
          </div>
        )}

        {(o.returnStatus !== "none" || canReturn) && (
          <div className="rounded-2xl bg-white shadow-sm border border-slate-200/70 p-5 space-y-3">
            <p className="flex items-center gap-2 font-bold text-heading"><Undo2 className="w-5 h-5 text-primary" /> Return or exchange</p>
            {o.returnStatus !== "none" ? (
              <p className="text-sm text-slate-600">{RETURN_TEXT[o.returnStatus] ?? o.returnStatus}{o.returnStatus === "refunded" && o.refundAmount ? ` Amount: ${inr(o.refundAmount)}.` : ""}</p>
            ) : (
              <ReturnRequest token={token} returnBy={returnBy} />
            )}
          </div>
        )}

        <div className="grid md:grid-cols-[1fr_16rem] gap-4 items-start">
          <div className="rounded-2xl bg-white shadow-sm border border-slate-200/70 p-5">
            <p className="font-bold text-heading mb-3 flex items-center gap-2"><PackageCheck className="w-5 h-5 text-primary" /> Items</p>
            <ul className="divide-y divide-slate-100">
              {items.map((i, k) => (
                <li key={k} className="flex items-center gap-3 py-2.5">
                  <span className="w-12 h-12 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    {i.image && <img src={i.image} alt="" className="w-full h-full object-cover" />}
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="block text-sm font-semibold text-heading truncate">{i.name}</span>
                    <span className="block text-xs text-slate-500">{[optionText(i.options ?? {}), `Qty ${i.qty}`].filter(Boolean).join(" · ")}</span>
                  </span>
                  <span className="text-sm font-bold text-heading">{inr(i.price * i.qty)}</span>
                </li>
              ))}
            </ul>
            <div className="border-t border-slate-100 pt-3 mt-1 text-sm space-y-1">
              <p className="flex justify-between text-slate-600"><span>Subtotal</span><span>{inr(o.subtotal)}</span></p>
              <p className="flex justify-between text-slate-600"><span>Delivery</span><span>{o.shipping ? inr(o.shipping) : "Free"}</span></p>
              {o.codFee > 0 && <p className="flex justify-between text-slate-600"><span>COD charge</span><span>{inr(o.codFee)}</span></p>}
              {o.discount > 0 && <p className="flex justify-between text-slate-600"><span>Discount</span><span>−{inr(o.discount)}</span></p>}
              <p className="flex justify-between font-extrabold text-heading text-base"><span>Total</span><span>{inr(o.total)}</span></p>
              <p className="text-xs text-slate-500">{PAYMENT_LABEL[o.paymentMethod] ?? o.paymentMethod} · {o.paymentStatus === "paid" ? "Paid" : o.paymentStatus === "refunded" ? "Refunded" : "Payment pending"}</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="rounded-2xl bg-white shadow-sm border border-slate-200/70 p-5 text-sm">
              <p className="font-bold text-heading mb-1 flex items-center gap-2"><MapPin className="w-4 h-4 text-primary" /> Delivering to</p>
              <p className="text-slate-600">{o.customerName}<br />{[o.city, o.state, o.pincode].filter(Boolean).join(", ")}</p>
            </div>
            {settings.whatsappNumber && (
              <a href={waLink(settings.whatsappNumber, `Hi! I have a question about my order ${orderLabel(o.orderNo)}.`)} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 text-white font-semibold text-sm px-4 py-3 hover:bg-emerald-700"><MessageCircle className="w-4 h-4" /> Need help? WhatsApp us</a>
            )}
          </div>
        </div>

        {timeline.length > 0 && (
          <div className="rounded-2xl bg-white shadow-sm border border-slate-200/70 p-5">
            <p className="font-bold text-heading mb-3">Updates</p>
            <ol className="relative border-l border-slate-200 ml-1.5 space-y-3">
              {timeline.map((e, i) => (
                <li key={i} className="pl-4 relative">
                  <span className={`absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full ${i === 0 ? "bg-primary" : "bg-slate-300"}`} />
                  <p className="text-sm font-semibold text-heading capitalize">{e.status === "new" ? "Order placed" : e.status.replace(/_/g, " ")}</p>
                  {e.note && e.note !== "Order placed" && <p className="text-xs text-slate-500">{e.note}</p>}
                  <p className="text-[11px] text-slate-400">{when(e.at)}</p>
                </li>
              ))}
            </ol>
          </div>
        )}
        <p className="text-center text-sm"><Link href="/" className="text-primary font-semibold hover:underline">Continue shopping →</Link></p>
      </div>
    </section>
  );
}
