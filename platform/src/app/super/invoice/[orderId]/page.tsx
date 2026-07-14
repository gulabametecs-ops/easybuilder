import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { db } from "@/lib/db";
import { getSuperSession } from "@/lib/superAuth";
import { getPlatformConfig } from "@/lib/platformConfig";
import { assignInvoiceNo } from "@/lib/invoice";
import { Invoice } from "@/components/Invoice";

export const metadata = { title: "Invoice" };

export default async function SuperInvoicePage({ params }: { params: Promise<{ orderId: string }> }) {
  if (!(await getSuperSession())) redirect("/super/login");
  const { orderId } = await params;
  let order = await db.order.findUnique({ where: { id: orderId } });
  if (!order) notFound();
  if (!order.invoiceNo && (order.status === "paid" || order.status === "provisioned")) {
    await assignInvoiceNo(order.id);
    order = await db.order.findUnique({ where: { id: orderId } });
  }
  const cfg = await getPlatformConfig();

  return (
    <div className="min-h-screen bg-slate-100 py-10 px-4">
      <div className="max-w-2xl mx-auto mb-4 no-print">
        <Link href="/super/orders" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800"><ArrowLeft className="w-4 h-4" /> Back to orders</Link>
      </div>
      <Invoice order={order!} cfg={cfg} />
    </div>
  );
}
