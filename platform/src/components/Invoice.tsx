import { formatINR, getDuration, resolveTier } from "@/lib/plans";
import { verticalName } from "@/lib/verticals";
import { gstBreakdown } from "@/lib/invoice";
import type { PlatformConfig } from "@/lib/platformConfig";
import { PrintButton } from "./PrintButton";

type Order = {
  id: string; invoiceNo: string | null; createdAt: Date; customerName: string; email: string; phone: string;
  company: string; vertical: string; plan: string; amount: number; status: string; gateway: string;
};

/** Platform-branded GST invoice (StandardSaaS theme: navy + lime). */
export function Invoice({ order, cfg }: { order: Order; cfg: PlatformConfig }) {
  const [tierId, durId] = order.plan.split("-");
  const tier = resolveTier(tierId, "{}");
  const duration = getDuration(durId);
  const gst = gstBreakdown(order.amount, cfg.gstRate);
  const date = new Date(order.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  const desc = `${tier?.name ?? order.plan} plan · ${verticalName(order.vertical)}${duration ? ` · ${duration.label}` : ""} website subscription`;
  const brand = cfg.platformName || "StandardSaaS";
  const initial = brand.charAt(0).toUpperCase();

  return (
    <div
      className="invoice-doc max-w-2xl mx-auto overflow-hidden shadow-lg print:shadow-none"
      style={{
        background: "#ffffff",
        color: "var(--c-text, #334155)",
        borderRadius: "var(--site-radius, 0.9rem)",
        border: "1px solid color-mix(in srgb, var(--c-primary, #7cb518) 18%, #e2e8f0)",
        fontFamily: 'var(--site-font, "Poppins", ui-sans-serif, system-ui, sans-serif)',
      }}
    >
      {/* Brand top bar */}
      <div
        className="h-1.5 print:h-2"
        style={{ background: "linear-gradient(90deg, var(--c-primary, #7cb518), var(--c-accent, #8bc34a), var(--c-primary-dark, #5c8a12))" }}
      />

      <div className="p-7 sm:p-9">
        {/* Header */}
        <div className="flex justify-between items-start gap-4 pb-6" style={{ borderBottom: "1px solid color-mix(in srgb, var(--c-primary, #7cb518) 15%, #e2e8f0)" }}>
          <div className="min-w-0">
            <div className="flex items-center gap-2.5">
              <span
                className="w-9 h-9 rounded-lg text-white font-extrabold flex items-center justify-center text-sm shrink-0"
                style={{ background: "var(--c-primary, #7cb518)" }}
              >
                {initial}
              </span>
              <div className="min-w-0">
                <div className="text-xl font-extrabold tracking-tight truncate" style={{ color: "var(--c-heading, #0f2942)" }}>
                  {brand}
                </div>
                <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--c-primary, #7cb518)" }}>
                  Website subscription invoice
                </p>
              </div>
            </div>
            {cfg.businessAddress && (
              <p className="text-xs mt-3 whitespace-pre-line max-w-xs" style={{ color: "var(--c-text, #64748b)" }}>
                {cfg.businessAddress}
              </p>
            )}
            <div className="mt-2 space-y-0.5 text-xs" style={{ color: "var(--c-text, #64748b)" }}>
              {cfg.gstin && <p>GSTIN: <b style={{ color: "var(--c-heading, #0f2942)" }}>{cfg.gstin}</b></p>}
              {cfg.supportEmail && <p>{cfg.supportEmail}</p>}
              {cfg.supportPhone && <p>{cfg.supportPhone}</p>}
            </div>
          </div>

          <div className="text-right shrink-0">
            <div
              className="inline-block text-[10px] font-bold uppercase tracking-[0.2em] text-white px-3 py-1 rounded-full mb-2"
              style={{ background: "var(--c-secondary, #0f2942)" }}
            >
              Invoice
            </div>
            <p className="text-sm font-bold" style={{ color: "var(--c-heading, #0f2942)" }}>{order.invoiceNo ?? "—"}</p>
            <p className="text-xs mt-0.5" style={{ color: "var(--c-text, #64748b)" }}>Date: {date}</p>
            {order.status === "refunded" && (
              <p className="text-xs font-bold text-rose-600 mt-2 uppercase tracking-wide">Refunded</p>
            )}
          </div>
        </div>

        {/* Bill to */}
        <div className="py-5" style={{ borderBottom: "1px solid color-mix(in srgb, var(--c-primary, #7cb518) 12%, #e2e8f0)" }}>
          <p className="text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: "var(--c-primary, #7cb518)" }}>
            Bill to
          </p>
          <p className="font-bold text-base" style={{ color: "var(--c-heading, #0f2942)" }}>
            {order.company || order.customerName}
          </p>
          {order.email && <p className="text-sm mt-0.5" style={{ color: "var(--c-text, #64748b)" }}>{order.email}</p>}
          {order.phone && <p className="text-sm" style={{ color: "var(--c-text, #64748b)" }}>{order.phone}</p>}
        </div>

        {/* Line items */}
        <table className="w-full text-sm my-5">
          <thead>
            <tr style={{ borderBottom: "2px solid var(--c-primary, #7cb518)" }}>
              <th className="py-2.5 font-bold text-left text-xs uppercase tracking-wide" style={{ color: "var(--c-heading, #0f2942)" }}>Description</th>
              <th className="py-2.5 font-bold text-right text-xs uppercase tracking-wide" style={{ color: "var(--c-heading, #0f2942)" }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: "1px solid #f1f5f9" }}>
              <td className="py-3.5 pr-4" style={{ color: "var(--c-text, #334155)" }}>{desc}</td>
              <td className="py-3.5 text-right font-semibold whitespace-nowrap" style={{ color: "var(--c-heading, #0f2942)" }}>{formatINR(gst.base)}</td>
            </tr>
          </tbody>
        </table>

        {/* Totals */}
        <div className="flex justify-end">
          <div
            className="w-full max-w-xs text-sm rounded-xl p-4 space-y-2"
            style={{ background: "color-mix(in srgb, var(--c-primary, #7cb518) 8%, #ffffff)" }}
          >
            <div className="flex justify-between" style={{ color: "var(--c-text, #64748b)" }}>
              <span>Taxable value</span><span>{formatINR(gst.base)}</span>
            </div>
            <div className="flex justify-between" style={{ color: "var(--c-text, #64748b)" }}>
              <span>CGST ({cfg.gstRate / 2}%)</span><span>{formatINR(gst.cgst)}</span>
            </div>
            <div className="flex justify-between" style={{ color: "var(--c-text, #64748b)" }}>
              <span>SGST ({cfg.gstRate / 2}%)</span><span>{formatINR(gst.sgst)}</span>
            </div>
            <div
              className="flex justify-between font-extrabold text-base pt-2.5 mt-1"
              style={{
                color: "var(--c-heading, #0f2942)",
                borderTop: "1px solid color-mix(in srgb, var(--c-primary, #7cb518) 25%, transparent)",
              }}
            >
              <span>Total</span>
              <span style={{ color: "var(--c-primary-dark, #5c8a12)" }}>{formatINR(gst.total)}</span>
            </div>
          </div>
        </div>

        <p className="text-[11px] mt-8 pt-5" style={{ color: "#94a3b8", borderTop: "1px solid #f1f5f9" }}>
          This is a computer-generated invoice and does not require a signature.
          Payment method: {order.gateway}.
          {!cfg.gstin && " Add your GSTIN in Super Admin → Settings to show it here."}
        </p>

        <div className="mt-6 no-print">
          <PrintButton variant="brand" />
        </div>
      </div>
    </div>
  );
}
