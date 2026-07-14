import Link from "next/link";
import { FileText } from "lucide-react";
import { getAuthedSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { ROOT_DOMAIN } from "@/lib/domains";
import { formatINR } from "@/lib/plans";
import { PageHeader, Card, Badge, EmptyState } from "@/components/admin/ui";

export const metadata = { title: "Billing" };
const proto = ROOT_DOMAIN.includes("localhost") ? "http" : "https";

export default async function BillingPage() {
  const authed = await getAuthedSession();
  if (!authed) return null;

  const orders = await db.order.findMany({ where: { tenantId: authed.tenant.id }, orderBy: { createdAt: "desc" } });
  const renew = `${proto}://${ROOT_DOMAIN}/#pricing`;

  return (
    <>
      <PageHeader
        title="Billing & Invoices"
        subtitle="Your payment history and downloadable invoices."
        action={<a href={renew} target="_blank" className="rounded-lg bg-lime-500 text-white text-sm font-semibold px-4 py-2.5 hover:bg-lime-600">Renew / Upgrade</a>}
      />
      <Card>
        {orders.length === 0 ? (
          <EmptyState title="No invoices yet" hint="Your subscription payments will appear here." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-slate-400 border-b border-slate-100">
                <tr><th className="p-4 font-medium">Invoice</th><th className="p-4 font-medium">Date</th><th className="p-4 font-medium">Amount</th><th className="p-4 font-medium">Status</th><th className="p-4"></th></tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map((o) => (
                  <tr key={o.id}>
                    <td className="p-4 font-medium text-slate-900">{o.invoiceNo ?? "—"}</td>
                    <td className="p-4 text-slate-600">{new Date(o.createdAt).toLocaleDateString()}</td>
                    <td className="p-4 font-semibold text-slate-900">{formatINR(o.amount)}</td>
                    <td className="p-4"><Badge tone={o.status === "refunded" ? "red" : o.status === "provisioned" || o.status === "paid" ? "green" : "slate"}>{o.status}</Badge></td>
                    <td className="p-4">
                      {(o.status === "provisioned" || o.status === "paid" || o.status === "refunded") && (
                        <Link href={`/admin/invoice/${o.id}`} className="inline-flex items-center gap-1 text-lime-600 font-medium hover:underline"><FileText className="w-4 h-4" /> Invoice</Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </>
  );
}
