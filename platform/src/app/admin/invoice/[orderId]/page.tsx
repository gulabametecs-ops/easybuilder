import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { db } from "@/lib/db";
import { getAuthedSession } from "@/lib/auth";
import { getPlatformConfig } from "@/lib/platformConfig";
import { Invoice } from "@/components/Invoice";

export const metadata = { title: "Invoice" };

export default async function ClientInvoicePage({ params }: { params: Promise<{ orderId: string }> }) {
  const authed = await getAuthedSession();
  if (!authed) redirect("/admin/login");
  const { orderId } = await params;
  const order = await db.order.findUnique({ where: { id: orderId } });
  if (!order || order.tenantId !== authed.tenant.id) notFound();
  const cfg = await getPlatformConfig();

  return (
    <div className="min-h-screen bg-slate-100 py-10 px-4">
      <div className="max-w-2xl mx-auto mb-4 no-print">
        <Link href="/admin/billing" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800"><ArrowLeft className="w-4 h-4" /> Back to billing</Link>
      </div>
      <Invoice order={order} cfg={cfg} />
    </div>
  );
}
