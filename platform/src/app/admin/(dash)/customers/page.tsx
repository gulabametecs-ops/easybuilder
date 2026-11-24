import { UserRound, MessageCircle, Phone } from "lucide-react";
import { getAuthedSession } from "@/lib/auth";
import { getDemoSessionId } from "@/lib/actions/guard";
import { adminOrders, customersFrom } from "@/lib/storeAdmin";
import { inr, waLink } from "@/lib/store";
import { Card, EmptyState, PageHeader, StatCard } from "@/components/admin/ui";

export const metadata = { title: "Customers" };

export default async function CustomersPage() {
  const authed = await getAuthedSession();
  if (!authed) return null;
  const customers = customersFrom(await adminOrders(authed.tenant.id, await getDemoSessionId()));
  const repeat = customers.filter((c) => c.orders > 1).length;
  const spent = customers.reduce((n, c) => n + c.spent, 0);
  const date = (iso: string) => new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

  return (
    <div className="space-y-4">
      <PageHeader icon={<UserRound />} title="Customers" subtitle="Everyone who has ordered from your store, with lifetime value." />
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        <StatCard label="Customers" value={customers.length} icon={<UserRound />} tone="violet" />
        <StatCard label="Repeat customers" value={repeat} hint={customers.length ? `${Math.round((repeat / customers.length) * 100)}% come back` : undefined} icon={<UserRound />} tone="green" />
        <StatCard label="Avg. lifetime value" value={customers.length ? inr(spent / customers.length) : "—"} icon={<UserRound />} tone="amber" />
      </div>
      <Card className="overflow-hidden">
        {customers.length === 0 ? (
          <EmptyState icon={<UserRound />} title="No customers yet" hint="Customers appear here automatically after their first order." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-[11px] uppercase tracking-wider text-slate-400 text-left">
                <tr><th className="px-4 py-2.5">Customer</th><th className="px-4 py-2.5">City</th><th className="px-4 py-2.5 text-right">Orders</th><th className="px-4 py-2.5 text-right">Spent</th><th className="px-4 py-2.5">Last order</th><th className="px-4 py-2.5" /></tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {customers.map((c) => (
                  <tr key={c.key} className="hover:bg-slate-50/70 dark:hover:bg-white/[0.02]">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <span className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 text-white text-xs font-bold flex items-center justify-center shrink-0">{c.name.split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase()}</span>
                        <div className="min-w-0"><p className="font-semibold text-slate-900 dark:text-white truncate">{c.name}</p><p className="text-xs text-slate-500 truncate">{c.phone}{c.email ? ` · ${c.email}` : ""}</p></div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{c.city || "—"}</td>
                    <td className="px-4 py-3 text-right font-semibold text-slate-800 dark:text-slate-100">{c.orders}{c.orders > 1 && <span className="ml-1.5 text-[10px] font-bold text-emerald-600">REPEAT</span>}</td>
                    <td className="px-4 py-3 text-right font-bold tabular-nums text-slate-900 dark:text-white">{inr(c.spent)}</td>
                    <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{date(c.last)}</td>
                    <td className="px-4 py-3">
                      <span className="flex justify-end gap-1">
                        <a href={`tel:${c.phone}`} title="Call" className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"><Phone className="w-4 h-4" /></a>
                        <a href={waLink(c.phone, `Hi ${c.name.split(" ")[0]}, thank you for shopping with ${authed.tenant.name}!`)} target="_blank" rel="noreferrer" title="WhatsApp" className="p-2 rounded-lg text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-500/10"><MessageCircle className="w-4 h-4" /></a>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
