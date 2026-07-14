import { db } from "./db";
import { getPlatformConfig } from "./platformConfig";

// Assigns a sequential invoice number to a paid/provisioned order (once).
export async function assignInvoiceNo(orderId: string): Promise<string> {
  const order = await db.order.findUnique({ where: { id: orderId } });
  if (!order) return "";
  if (order.invoiceNo) return order.invoiceNo;
  const cfg = await getPlatformConfig();
  const year = new Date(order.createdAt).getFullYear();
  const seq = (await db.order.count({ where: { invoiceNo: { not: null } } })) + 1;
  const no = `${cfg.invoicePrefix || "INV"}-${year}-${String(seq).padStart(5, "0")}`;
  try {
    await db.order.update({ where: { id: orderId }, data: { invoiceNo: no } });
  } catch {
    // unique clash (rare race) — leave unassigned; a later view will retry
    return "";
  }
  return no;
}

// GST breakdown assuming the charged amount is inclusive of GST.
export function gstBreakdown(amountPaise: number, gstRate: number) {
  const base = Math.round(amountPaise / (1 + gstRate / 100));
  const gst = amountPaise - base;
  return { base, cgst: Math.round(gst / 2), sgst: gst - Math.round(gst / 2), gst, total: amountPaise };
}
