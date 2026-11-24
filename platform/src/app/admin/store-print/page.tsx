import { redirect } from "next/navigation";
import { getAuthedSession } from "@/lib/auth";
import { getDemoSessionId } from "@/lib/actions/guard";
import { db } from "@/lib/db";
import { demoVisibleWhere } from "@/lib/demoSession";
import { getStoreSettings } from "@/lib/storeServer";
import { lookupPincode } from "@/lib/shipping";
import { PAYMENT_LABEL, inr, optionText, orderLabel, type OrderItem } from "@/lib/store";
import { PrintButton } from "@/components/PrintButton";

// Printable GST invoices / packing slips for one or many store orders (?doc=invoice|slip&ids=a,b).
// Invoice numbers are assigned by the prepareInvoices action before this opens.

export const metadata = { title: "Print", robots: { index: false } };

const normState = (s: string) => s.toLowerCase().replace(/&/g, "and").replace(/[^a-z]/g, "");
const money = (n: number) => `₹${n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const r2 = (n: number) => Math.round(n * 100) / 100;
const date = (d: Date) => d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

export default async function StorePrintPage({ searchParams }: { searchParams: Promise<{ doc?: string; ids?: string }> }) {
  const authed = await getAuthedSession();
  if (!authed) redirect("/admin/login");
  const sp = await searchParams;
  const doc = sp.doc === "slip" ? "slip" : "invoice";
  const ids = (sp.ids ?? "").split(",").filter(Boolean).slice(0, 200);
  const tenantId = authed.tenant.id;
  const demoId = await getDemoSessionId();
  const [orders, settings] = await Promise.all([
    db.storeOrder.findMany({ where: { ...demoVisibleWhere(tenantId, demoId), id: { in: ids } }, orderBy: { orderNo: "asc" } }),
    getStoreSettings(tenantId, demoId),
  ]);
  const parsed = orders.map((o) => {
    let items: OrderItem[] = [];
    try { items = JSON.parse(o.items || "[]"); } catch { /* none */ }
    return { o, items };
  });
  const products = new Map((await db.product.findMany({ where: { tenantId, id: { in: parsed.flatMap((p) => p.items.map((i) => i.productId)) } }, select: { id: true, hsn: true, gstRate: true, sku: true } })).map((p) => [p.id, p]));
  const sh = settings.shipping;
  const seller = { ...sh.pickup, name: sh.legalName || authed.tenant.name };

  // Buyer state: saved on the order, else from the pincode (needed for CGST+SGST vs IGST).
  const buyerStates = await Promise.all(parsed.map(async ({ o }) => o.state || (await lookupPincode(o.pincode))?.state || ""));

  return (
    <div className="min-h-screen bg-slate-100 print:bg-white text-slate-900 py-6 print:py-0">
      <div className="no-print max-w-3xl mx-auto px-4 mb-4 flex items-center justify-between gap-3">
        <p className="text-sm text-slate-600">{orders.length} {doc === "invoice" ? "invoice(s)" : "packing slip(s)"}</p>
        <PrintButton />
      </div>
      {!orders.length && <p className="text-center text-slate-500">No orders selected.</p>}
      {parsed.map(({ o, items }, idx) => {
        const buyerState = buyerStates[idx];
        const sameState = !!seller.state && !!buyerState && normState(seller.state) === normState(buyerState);
        const address = [o.address, o.addressLine2, o.city, buyerState, o.pincode].filter(Boolean).join(", ");
        const header = (
          <div className="flex justify-between gap-6 border-b border-slate-200 pb-4">
            <div>
              <p className="text-xl font-extrabold">{seller.name}</p>
              <p className="text-xs text-slate-600 max-w-xs">{[seller.address, seller.city, seller.state, seller.pincode].filter(Boolean).join(", ")}</p>
              {seller.phone && <p className="text-xs text-slate-600">Ph: {seller.phone}{seller.email ? ` · ${seller.email}` : ""}</p>}
              {sh.gstin && <p className="text-xs font-semibold mt-1">GSTIN: {sh.gstin}</p>}
            </div>
            <div className="text-right text-sm">
              <p className="text-lg font-extrabold uppercase tracking-wide">{doc === "slip" ? "Packing slip" : sh.gstin ? "Tax invoice" : "Invoice"}</p>
              {doc === "invoice" && <p>Invoice no: <b>{o.invoiceNo || "Draft"}</b></p>}
              <p>Order: <b>{orderLabel(o.orderNo)}</b></p>
              <p className="text-slate-600">{date(o.createdAt)}</p>
            </div>
          </div>
        );

        if (doc === "slip") {
          const cod = o.paymentMethod === "cod" && o.paymentStatus !== "paid";
          return (
            <section key={o.id} className="max-w-3xl mx-auto bg-white shadow print:shadow-none p-8 mb-6 print:mb-0 [break-after:page]">
              {header}
              <div className="grid grid-cols-2 gap-6 py-4 text-sm">
                <div><p className="text-[11px] font-bold uppercase text-slate-500">Ship to</p><p className="font-bold">{o.customerName}</p><p>{address}</p><p>Ph: {o.phone}</p></div>
                <div className="text-right">
                  {o.courier && <p>Courier: <b>{o.courier}</b></p>}
                  {o.awb && <p>AWB: <b className="font-mono">{o.awb}</b></p>}
                  {o.weightGrams > 0 && <p>Weight: {o.weightGrams} g</p>}
                  <p className={`mt-2 inline-block rounded px-2 py-1 font-extrabold ${cod ? "bg-amber-100" : "bg-emerald-100"}`}>{cod ? `COD — collect ${inr(o.total)}` : "PREPAID"}</p>
                </div>
              </div>
              <table className="w-full text-sm border-collapse">
                <thead><tr className="text-left text-[11px] uppercase text-slate-500 border-b"><th className="py-2 w-8">✓</th><th>Item</th><th>SKU</th><th className="text-right">Qty</th></tr></thead>
                <tbody>
                  {items.map((i, k) => (
                    <tr key={k} className="border-b border-slate-100 align-top">
                      <td className="py-2"><span className="inline-block w-4 h-4 border border-slate-400 rounded-sm" /></td>
                      <td className="py-2">{i.name}{Object.keys(i.options ?? {}).length ? <span className="block text-xs text-slate-500">{optionText(i.options)}</span> : null}</td>
                      <td className="py-2 text-xs">{products.get(i.productId)?.sku || "—"}</td>
                      <td className="py-2 text-right font-bold">{i.qty}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="text-sm mt-3">Total units: <b>{items.reduce((n, i) => n + i.qty, 0)}</b></p>
              {o.note && <p className="text-sm mt-2 rounded bg-slate-50 p-2">Customer note: {o.note}</p>}
            </section>
          );
        }

        // GST: prices are tax-inclusive at each product's rate. Delivery/COD charges use the highest item rate.
        const lines = items.map((i) => {
          const p = products.get(i.productId);
          const rate = p?.gstRate ?? 0;
          const amount = i.price * i.qty;
          const taxable = r2((amount * 100) / (100 + rate));
          return { name: i.name, opts: optionText(i.options ?? {}), hsn: p?.hsn ?? "", qty: i.qty, rate, amount, taxable, tax: r2(amount - taxable) };
        });
        const maxRate = Math.max(0, ...lines.map((l) => l.rate));
        const charges = o.shipping + o.codFee;
        if (charges > 0) {
          const taxable = r2((charges * 100) / (100 + maxRate));
          lines.push({ name: o.codFee ? "Delivery & COD charges" : "Delivery charges", opts: "", hsn: "996812", qty: 1, rate: maxRate, amount: charges, taxable, tax: r2(charges - taxable) });
        }
        const totTaxable = r2(lines.reduce((n, l) => n + l.taxable, 0));
        const totTax = r2(lines.reduce((n, l) => n + l.tax, 0));
        const gst = !!sh.gstin;
        return (
          <section key={o.id} className="max-w-3xl mx-auto bg-white shadow print:shadow-none p-8 mb-6 print:mb-0 [break-after:page]">
            {header}
            <div className="grid grid-cols-2 gap-6 py-4 text-sm">
              <div><p className="text-[11px] font-bold uppercase text-slate-500">Bill / ship to</p><p className="font-bold">{o.customerName}</p><p>{address}</p><p>Ph: {o.phone}</p></div>
              <div className="text-right">
                <p>Place of supply: <b>{buyerState || "—"}</b></p>
                <p>Payment: {PAYMENT_LABEL[o.paymentMethod] ?? o.paymentMethod} — {o.paymentStatus === "paid" ? "Paid" : o.paymentStatus === "refunded" ? "Refunded" : "Pending"}</p>
              </div>
            </div>
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="text-left uppercase text-slate-500 border-b">
                  <th className="py-2">Item</th>{gst && <th>HSN</th>}<th className="text-right">Qty</th>
                  {gst && <th className="text-right">Taxable</th>}
                  {gst && (sameState ? <><th className="text-right">CGST</th><th className="text-right">SGST</th></> : <th className="text-right">IGST</th>)}
                  <th className="text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {lines.map((l, k) => (
                  <tr key={k} className="border-b border-slate-100 align-top">
                    <td className="py-2 pr-2">{l.name}{l.opts && <span className="block text-slate-500">{l.opts}</span>}</td>
                    {gst && <td>{l.hsn || "—"}</td>}
                    <td className="text-right">{l.qty}</td>
                    {gst && <td className="text-right">{money(l.taxable)}</td>}
                    {gst && (sameState
                      ? <><td className="text-right">{money(r2(l.tax / 2))}<span className="block text-slate-400">{l.rate / 2}%</span></td><td className="text-right">{money(r2(l.tax / 2))}<span className="block text-slate-400">{l.rate / 2}%</span></td></>
                      : <td className="text-right">{money(l.tax)}<span className="block text-slate-400">{l.rate}%</span></td>)}
                    <td className="text-right font-semibold">{money(l.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="ml-auto max-w-xs text-sm mt-3 space-y-1">
              {gst && <div className="flex justify-between"><span>Taxable value</span><span>{money(totTaxable)}</span></div>}
              {gst && (sameState
                ? <><div className="flex justify-between"><span>CGST</span><span>{money(r2(totTax / 2))}</span></div><div className="flex justify-between"><span>SGST</span><span>{money(r2(totTax / 2))}</span></div></>
                : <div className="flex justify-between"><span>IGST</span><span>{money(totTax)}</span></div>)}
              {o.discount > 0 && <div className="flex justify-between"><span>Discount</span><span>−{money(o.discount)}</span></div>}
              <div className="flex justify-between border-t-2 border-slate-900 pt-1 text-base font-extrabold"><span>Total</span><span>{money(o.total)}</span></div>
              {o.refundAmount > 0 && <div className="flex justify-between text-slate-600"><span>Refunded</span><span>−{money(o.refundAmount)}</span></div>}
            </div>
            <p className="text-[11px] text-slate-500 mt-6">{gst ? "Prices are inclusive of GST. " : ""}This is a computer-generated invoice and does not need a signature. Thank you for shopping with {seller.name}!</p>
          </section>
        );
      })}
    </div>
  );
}
