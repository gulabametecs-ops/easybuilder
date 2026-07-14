import { formatINR, getDuration, resolveTier } from "@/lib/plans";
import { verticalName } from "@/lib/verticals";
import { gstBreakdown } from "@/lib/invoice";
import type { PlatformConfig } from "@/lib/platformConfig";
import { PrintButton } from "./PrintButton";

type Order = {
  id: string; invoiceNo: string | null; createdAt: Date; customerName: string; email: string; phone: string;
  company: string; vertical: string; plan: string; amount: number; status: string; gateway: string;
};

// A clean, printable GST invoice. Used by both the super admin and the client.
export function Invoice({ order, cfg }: { order: Order; cfg: PlatformConfig }) {
  const [tierId, durId] = order.plan.split("-");
  const tier = resolveTier(tierId, "{}");
  const duration = getDuration(durId);
  const gst = gstBreakdown(order.amount, cfg.gstRate);
  const date = new Date(order.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  const desc = `${tier?.name ?? order.plan} plan · ${verticalName(order.vertical)}${duration ? ` · ${duration.label}` : ""} website subscription`;

  return (
    <div className="bg-white text-slate-800 max-w-2xl mx-auto rounded-xl border border-slate-200 shadow-sm print:shadow-none print:border-0 p-8">
      {/* Header */}
      <div className="flex justify-between items-start pb-6 border-b border-slate-200">
        <div>
          <div className="text-xl font-extrabold text-slate-900">{cfg.platformName || "StandardSaaS"}</div>
          {cfg.businessAddress && <p className="text-sm text-slate-500 mt-1 whitespace-pre-line max-w-xs">{cfg.businessAddress}</p>}
          {cfg.gstin && <p className="text-sm text-slate-500 mt-1">GSTIN: <b>{cfg.gstin}</b></p>}
          {cfg.supportEmail && <p className="text-sm text-slate-500">{cfg.supportEmail}</p>}
        </div>
        <div className="text-right">
          <div className="text-2xl font-extrabold text-slate-900">INVOICE</div>
          <p className="text-sm text-slate-500 mt-1">{order.invoiceNo ?? "—"}</p>
          <p className="text-sm text-slate-500">Date: {date}</p>
          {order.status === "refunded" && <p className="text-sm font-bold text-red-600 mt-1">REFUNDED</p>}
        </div>
      </div>

      {/* Bill to */}
      <div className="py-6 border-b border-slate-200">
        <p className="text-xs uppercase tracking-wide text-slate-400 mb-1">Bill to</p>
        <p className="font-semibold text-slate-900">{order.company || order.customerName}</p>
        {order.email && <p className="text-sm text-slate-500">{order.email}</p>}
        {order.phone && <p className="text-sm text-slate-500">{order.phone}</p>}
      </div>

      {/* Line items */}
      <table className="w-full text-sm my-6">
        <thead>
          <tr className="text-left text-slate-400 border-b border-slate-200">
            <th className="py-2 font-medium">Description</th>
            <th className="py-2 font-medium text-right">Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-slate-100">
            <td className="py-3 text-slate-700">{desc}</td>
            <td className="py-3 text-right text-slate-700">{formatINR(gst.base)}</td>
          </tr>
        </tbody>
      </table>

      {/* Totals */}
      <div className="flex justify-end">
        <div className="w-64 text-sm space-y-1.5">
          <div className="flex justify-between text-slate-500"><span>Taxable value</span><span>{formatINR(gst.base)}</span></div>
          <div className="flex justify-between text-slate-500"><span>CGST ({cfg.gstRate / 2}%)</span><span>{formatINR(gst.cgst)}</span></div>
          <div className="flex justify-between text-slate-500"><span>SGST ({cfg.gstRate / 2}%)</span><span>{formatINR(gst.sgst)}</span></div>
          <div className="flex justify-between font-bold text-slate-900 text-base pt-2 border-t border-slate-200"><span>Total</span><span>{formatINR(gst.total)}</span></div>
        </div>
      </div>

      <p className="text-xs text-slate-400 mt-8 pt-6 border-t border-slate-200">
        This is a computer-generated invoice and does not require a signature.
        Payment method: {order.gateway}. {!cfg.gstin && "Add your GSTIN in Super Admin → Settings to show it here."}
      </p>

      <div className="mt-6 no-print"><PrintButton /></div>
    </div>
  );
}
