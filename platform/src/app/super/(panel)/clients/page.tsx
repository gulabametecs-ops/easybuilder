import Link from "next/link";
import { Search, Plus, Eye } from "lucide-react";
import { db } from "@/lib/db";
import { ROOT_DOMAIN } from "@/lib/domains";
import { verticalName } from "@/lib/verticals";
import { PageHeader, Card, Badge, EmptyState } from "@/components/admin/ui";

export const metadata = { title: "Clients" };
const proto = ROOT_DOMAIN.includes("localhost") ? "http" : "https";

type Props = { searchParams: Promise<{ q?: string; filter?: string }> };

const FILTERS = [
  { id: "all", label: "All" },
  { id: "active", label: "Active" },
  { id: "expiring", label: "Expiring (30d)" },
  { id: "expired", label: "Expired" },
  { id: "suspended", label: "Suspended" },
];

export default async function ClientsPage({ searchParams }: Props) {
  const { q, filter } = await searchParams;
  const query = (q ?? "").trim();
  const activeFilter = FILTERS.some((f) => f.id === filter) ? filter! : "all";

  const now = new Date();
  const in30 = new Date();
  in30.setDate(in30.getDate() + 30);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const conditions: any[] = [];
  if (query) {
    conditions.push({ OR: [{ name: { contains: query } }, { subdomain: { contains: query } }, { users: { some: { email: { contains: query } } } }] });
  }
  if (activeFilter === "active") conditions.push({ status: "active", OR: [{ subscriptionEndsAt: null }, { subscriptionEndsAt: { gt: now } }] });
  else if (activeFilter === "expiring") conditions.push({ status: "active", subscriptionEndsAt: { gte: now, lte: in30 } });
  else if (activeFilter === "expired") conditions.push({ subscriptionEndsAt: { lt: now } });
  else if (activeFilter === "suspended") conditions.push({ status: "suspended" });

  const where = conditions.length ? { AND: conditions } : {};

  const clients = await db.tenant.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { leads: true, appointments: true, services: true } } },
  });

  return (
    <>
      <PageHeader
        title="Clients"
        subtitle={`${clients.length} businesses${query ? ` matching "${query}"` : ""}`}
        action={
          <Link href="/super/clients/new" className="inline-flex items-center gap-2 rounded-lg bg-lime-500 text-white font-semibold px-4 py-2.5 text-sm hover:bg-lime-600">
            <Plus className="w-4 h-4" /> Add client
          </Link>
        }
      />

      {/* Search + filter tabs */}
      <div className="flex flex-col lg:flex-row lg:items-center gap-3 mb-5">
        <form className="relative flex-1 max-w-md" action="/super/clients">
          {activeFilter !== "all" && <input type="hidden" name="filter" value={activeFilter} />}
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input name="q" defaultValue={query} placeholder="Search by business, subdomain or email…" className="w-full rounded-lg border border-slate-300 pl-10 pr-4 py-2.5 text-sm outline-none focus:border-lime-500" />
        </form>
        <div className="flex flex-wrap gap-1.5">
          {FILTERS.map((f) => {
            const href = `/super/clients?filter=${f.id}${query ? `&q=${encodeURIComponent(query)}` : ""}`;
            return (
              <Link key={f.id} href={href} className={`rounded-lg px-3 py-2 text-sm font-medium ${activeFilter === f.id ? "bg-slate-900 text-white" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"}`}>
                {f.label}
              </Link>
            );
          })}
        </div>
      </div>

      <Card>
        {clients.length === 0 ? (
          <EmptyState title="No clients found" hint={query ? "Try a different search." : "Add your first client."} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-slate-400 border-b border-slate-100">
                <tr>
                  <th className="p-4 font-medium">Business</th>
                  <th className="p-4 font-medium">Sector</th>
                  <th className="p-4 font-medium">Plan</th>
                  <th className="p-4 font-medium">License ends</th>
                  <th className="p-4 font-medium">Leads</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {clients.map((c) => {
                  const expired = c.subscriptionEndsAt && new Date(c.subscriptionEndsAt) < new Date();
                  return (
                    <tr key={c.id} className="hover:bg-slate-50">
                      <td className="p-4 font-medium text-slate-900">{c.name}<br /><span className="text-slate-400 font-normal">{c.subdomain}.{ROOT_DOMAIN}</span></td>
                      <td className="p-4 text-slate-600">{verticalName(c.vertical)}</td>
                      <td className="p-4 text-slate-600 capitalize">{c.plan}</td>
                      <td className="p-4 text-slate-600">{c.subscriptionEndsAt ? new Date(c.subscriptionEndsAt).toLocaleDateString() : "Lifetime"}</td>
                      <td className="p-4 text-slate-600">{c._count.leads}</td>
                      <td className="p-4"><Badge tone={c.status === "suspended" ? "red" : expired ? "amber" : "green"}>{c.status === "suspended" ? "suspended" : expired ? "expired" : "active"}</Badge></td>
                      <td className="p-4">
                        <Link href={`/super/clients/${c.id}`} className="inline-flex items-center gap-1 text-lime-600 font-medium hover:underline"><Eye className="w-4 h-4" /> View</Link>
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
