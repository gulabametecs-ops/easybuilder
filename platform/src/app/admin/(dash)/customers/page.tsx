import { UserRound, MessageCircle, Phone, BadgeCheck, Mail } from "lucide-react";
import { getAuthedSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { getDemoSessionId } from "@/lib/actions/guard";
import { demoVisibleWhere } from "@/lib/demoSession";
import { adminOrders, customersFrom } from "@/lib/storeAdmin";
import { inr, jsonList, orderLabel, waLink } from "@/lib/store";
import { Card, EmptyState, PageHeader, StatCard, Badge } from "@/components/admin/ui";
import { CsvExportButton } from "@/components/admin/store/CsvExportButton";
import { BlockCustomerButton } from "@/components/admin/store/BlockCustomerButton";

export const metadata = { title: "Customers" };

const digits = (p: string) => p.replace(/\D/g, "").slice(-10);

export default async function CustomersPage() {
  const authed = await getAuthedSession();
  if (!authed) return null;
  const demoId = await getDemoSessionId();
  const [orders, accounts] = await Promise.all([
    adminOrders(authed.tenant.id, demoId),
    db.storeCustomer.findMany({ where: { ...demoVisibleWhere(authed.tenant.id, demoId), lastLoginAt: { not: null } }, orderBy: { lastLoginAt: "desc" } }),
  ]);

  // Order-derived customers (grouped by phone), joined to sign-in accounts by email or phone.
  const used = new Set<string>();
  const rows = customersFrom(orders).map((c) => {
    const acc = accounts.find((a) => (c.email && a.email === c.email.toLowerCase()) || (a.phone && digits(a.phone) === c.key));
    if (acc) used.add(acc.id);
    return { ...c, account: acc ?? null };
  });
  for (const a of accounts) {
    if (used.has(a.id)) continue;
    rows.push({ key: a.id, name: a.name || a.email.split("@")[0], phone: a.phone, email: a.email, city: "", orders: 0, spent: 0, last: "", account: a });
  }
  const ordersOf = (c: (typeof rows)[number]) => orders.filter((o) => (o.phone && digits(o.phone) === c.key) || (c.email && o.email.toLowerCase() === c.email.toLowerCase()));
  const buyers = rows.filter((c) => c.orders > 0);
  const repeat = buyers.filter((c) => c.orders > 1).length;
  const spent = buyers.reduce((n, c) => n + c.spent, 0);
  const date = (iso: string) => (iso ? new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—");

  return (
    <div className="space-y-4">
      <PageHeader
        icon={<UserRound />}
        title="Customers"
        subtitle="Everyone who has ordered or signed in to your store, with lifetime value."
        action={<div className="flex flex-wrap gap-2"><CsvExportButton kind="customers" /><CsvExportButton kind="orders" /></div>}
      />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Customers" value={rows.length} icon={<UserRound />} tone="violet" />
        <StatCard label="With an account" value={accounts.length} hint={`${accounts.filter((a) => a.marketingOptIn).length} opted in to offers`} icon={<BadgeCheck />} tone="sky" />
        <StatCard label="Repeat customers" value={repeat} hint={buyers.length ? `${Math.round((repeat / buyers.length) * 100)}% come back` : undefined} icon={<UserRound />} tone="green" />
        <StatCard label="Avg. lifetime value" value={buyers.length ? inr(spent / buyers.length) : "—"} icon={<UserRound />} tone="amber" />
      </div>
      <Card className="overflow-hidden">
        {rows.length === 0 ? (
          <EmptyState icon={<UserRound />} title="No customers yet" hint="Customers appear here automatically after their first order or sign-in." />
        ) : (
          <ul className="divide-y divide-slate-100 dark:divide-white/5">
            {rows.map((c) => {
              const list = ordersOf(c).slice(0, 10);
              const wish = c.account ? jsonList<string>(c.account.wishlist).length : 0;
              const addrs = c.account ? jsonList<unknown>(c.account.addresses).length : 0;
              return (
                <li key={c.key}>
                  <details className="group">
                    <summary className="list-none cursor-pointer grid grid-cols-[1fr_auto] md:grid-cols-[1fr_7rem_5rem_7rem_7rem_auto] items-center gap-3 px-4 py-3 hover:bg-slate-50/70 dark:hover:bg-white/[0.02]">
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 text-white text-xs font-bold flex items-center justify-center shrink-0">{(c.name || "?").split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase()}</span>
                        <div className="min-w-0">
                          <p className="font-semibold text-sm text-slate-900 dark:text-white truncate flex items-center gap-1.5">
                            {c.name}
                            {c.account && <Badge tone="blue">Account</Badge>}
                            {c.account?.blocked && <Badge tone="red">Blocked</Badge>}
                          </p>
                          <p className="text-xs text-slate-500 truncate">{[c.phone, c.email].filter(Boolean).join(" · ")}</p>
                        </div>
                      </div>
                      <span className="hidden md:block text-sm text-slate-600 dark:text-slate-300 truncate">{c.city || "—"}</span>
                      <span className="hidden md:block text-sm text-right font-semibold text-slate-800 dark:text-slate-100">{c.orders}{c.orders > 1 && <span className="ml-1 text-[10px] font-bold text-emerald-600">REPEAT</span>}</span>
                      <span className="text-sm text-right font-bold tabular-nums text-slate-900 dark:text-white">{inr(c.spent)}</span>
                      <span className="hidden md:block text-xs text-slate-500 whitespace-nowrap">{date(c.last)}</span>
                      <span className="hidden md:flex justify-end gap-1">
                        {c.phone && <a href={`tel:${c.phone}`} title="Call" className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"><Phone className="w-4 h-4" /></a>}
                        {c.phone && <a href={waLink(c.phone, `Hi ${c.name.split(" ")[0]}, thank you for shopping with ${authed.tenant.name}!`)} target="_blank" rel="noreferrer" title="WhatsApp" className="p-2 rounded-lg text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-500/10"><MessageCircle className="w-4 h-4" /></a>}
                        {c.email && <a href={`mailto:${c.email}`} title="Email" className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"><Mail className="w-4 h-4" /></a>}
                      </span>
                    </summary>
                    <div className="px-4 pb-4 pt-1 grid md:grid-cols-[1fr_16rem] gap-4 bg-slate-50/60 dark:bg-white/[0.02]">
                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Orders</p>
                        {list.length === 0 ? <p className="text-xs text-slate-400">No orders yet.</p> : (
                          <ul className="space-y-1">
                            {list.map((o) => (
                              <li key={o.id} className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-sm">
                                <a href="/admin/orders" className="font-semibold text-slate-900 dark:text-white hover:text-lime-600">{orderLabel(o.orderNo)}</a>
                                <span className="text-xs text-slate-500">{date(o.createdAt)}</span>
                                <Badge tone={o.status === "delivered" ? "green" : o.status === "cancelled" ? "red" : "slate"}>{o.status}</Badge>
                                <span className="text-xs text-slate-500 truncate max-w-xs">{o.items.map((i) => `${i.name} ×${i.qty}`).join(", ")}</span>
                                <span className="ml-auto font-semibold tabular-nums">{inr(o.total)}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                      <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                        {c.account ? (
                          <>
                            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Account</p>
                            <p>{c.account.email}</p>
                            <p>Last sign-in {date(c.account.lastLoginAt?.toISOString() ?? "")} · {addrs} address{addrs === 1 ? "" : "es"} · {wish} in wishlist</p>
                            <p>{c.account.marketingOptIn ? "Opted in to offers" : "Not opted in to offers"}</p>
                            <BlockCustomerButton id={c.account.id} blocked={c.account.blocked} />
                          </>
                        ) : <p className="text-slate-400">No store account — ordered as a guest.</p>}
                      </div>
                    </div>
                  </details>
                </li>
              );
            })}
          </ul>
        )}
      </Card>
    </div>
  );
}
