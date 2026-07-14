import Link from "next/link";
import { FileText } from "lucide-react";
import { db } from "@/lib/db";
import { formatINR } from "@/lib/plans";
import { verticalName } from "@/lib/verticals";
import { PageHeader, Card, Badge, EmptyState } from "@/components/admin/ui";
import { RefundButton } from "@/components/super/RefundButton";
import { RetryProvisionButton } from "@/components/super/RetryProvisionButton";

export const metadata = { title: "Orders & Payments" };

export default async function OrdersPage() {
  const orders = await db.order.findMany({ orderBy: { createdAt: "desc" } });
  const revenue = orders.filter((o) => o.status === "paid" || o.status === "provisioned").reduce((s, o) => s + o.amount, 0);

  return (
    <>
      <PageHeader title="Orders & Payments" subtitle={`${orders.length} orders · ${formatINR(revenue)} collected`} />
      <Card>
        {orders.length === 0 ? <EmptyState title="No orders yet" hint="Subscriptions and payments appear here." /> : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-slate-400 border-b border-slate-100">
                <tr>
                  <th className="p-4 font-medium">Customer</th>
                  <th className="p-4 font-medium">Sector</th>
                  <th className="p-4 font-medium">Plan</th>
                  <th className="p-4 font-medium">Site</th>
                  <th className="p-4 font-medium">Amount</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium">Date</th>
                  <th className="p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map((o) => {
                  const paid = o.status === "provisioned" || o.status === "paid";
                  const stuck = o.status === "paid"; // paid but not yet live
                  return (
                  <tr key={o.id} className={stuck ? "bg-amber-50/60" : ""}>
                    <td className="p-4 font-medium text-slate-900">{o.customerName}<br /><span className="text-slate-400 font-normal">{o.email}</span></td>
                    <td className="p-4 text-slate-600">{verticalName(o.vertical)}</td>
                    <td className="p-4 text-slate-600">{o.plan}</td>
                    <td className="p-4 text-slate-600">{o.subdomain}</td>
                    <td className="p-4 font-semibold text-slate-900">{formatINR(o.amount)}</td>
                    <td className="p-4">
                      <Badge tone={o.status === "provisioned" ? "green" : o.status === "paid" ? "blue" : o.status === "failed" ? "red" : o.status === "refunded" ? "red" : "amber"}>{o.status === "paid" ? "paid · not live" : o.status}</Badge>
                      {o.provisionError && <p className="text-xs text-red-500 mt-1 max-w-[200px]">{o.provisionError}</p>}
                    </td>
                    <td className="p-4 text-slate-400 whitespace-nowrap">{new Date(o.createdAt).toLocaleDateString()}</td>
                    <td className="p-4 whitespace-nowrap">
                      <div className="flex items-center gap-3 text-sm">
                        {stuck && <RetryProvisionButton orderId={o.id} />}
                        {(paid || o.status === "refunded") && <Link href={`/super/invoice/${o.id}`} className="inline-flex items-center gap-1 text-lime-600 hover:underline"><FileText className="w-3.5 h-3.5" /> Invoice</Link>}
                        {paid && <RefundButton orderId={o.id} />}
                      </div>
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </>
  );
}
