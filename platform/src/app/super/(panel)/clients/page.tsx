import Link from "next/link";
import { statfs } from "node:fs/promises";
import { Search, Plus, Eye, HardDrive, Server, Building2, CalendarClock } from "lucide-react";
import { formatBytes } from "@/lib/plans";
import { db } from "@/lib/db";
import { ROOT_DOMAIN } from "@/lib/domains";
import { verticalName } from "@/lib/verticals";
import { PageHeader, Card, EmptyState, StatCard, btnPrimary } from "@/components/admin/ui";
import { Who, Pill, Chips, tbl, thead, th, tbody, tr, td } from "@/components/super/kit";

export const metadata = { title: "Clients" };

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

  const [clients, storage, expiring, disk] = await Promise.all([
    db.tenant.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { leads: true, appointments: true, services: true } } },
    }),
    db.mediaFile.groupBy({ by: ["tenantId"], _sum: { bytes: true } }),
    db.tenant.count({ where: { status: "active", subscriptionEndsAt: { gte: now, lte: in30 } } }),
    // Free space on the disk that holds uploads (null on hosts without a real disk).
    statfs(process.cwd()).catch(() => null),
  ]);
  const bytesOf = new Map(storage.map((r) => [r.tenantId, r._sum.bytes ?? 0]));
  const totalBytes = storage.reduce((n, r) => n + (r._sum.bytes ?? 0), 0);
  const diskTotal = disk ? disk.blocks * disk.bsize : 0;
  const diskFree = disk ? disk.bavail * disk.bsize : 0;

  return (
    <>
      <PageHeader
        title="Clients"
        subtitle={`${clients.length} businesses${query ? ` matching "${query}"` : ""}`}
        icon={<Building2 />}
        action={
          <Link href="/super/clients/new" className={btnPrimary}>
            <Plus className="w-4 h-4" /> Add client
          </Link>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <StatCard label="Clients" value={clients.length} icon={<Building2 className="h-4 w-4" />} />
        <StatCard label="Client storage" value={formatBytes(totalBytes)} hint="All uploaded files" icon={<HardDrive className="h-4 w-4" />} />
        <StatCard
          label="Server disk free"
          value={disk ? formatBytes(diskFree) : "—"}
          hint={disk ? `of ${formatBytes(diskTotal)} · ${Math.round((1 - diskFree / diskTotal) * 100)}% used` : "Not available"}
          icon={<Server className="h-4 w-4" />}
        />
        <StatCard label="Expiring in 30 days" value={expiring} icon={<CalendarClock className="h-4 w-4" />} />
      </div>

      {/* Search + filter tabs */}
      <div className="flex flex-col lg:flex-row lg:items-center gap-3 mb-5">
        <form className="relative flex-1 max-w-md" action="/super/clients">
          {activeFilter !== "all" && <input type="hidden" name="filter" value={activeFilter} />}
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input name="q" defaultValue={query} placeholder="Search by business, subdomain or email…" className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm outline-none focus:border-lime-500 dark:border-slate-700" />
        </form>
        <div className="[&>div]:mb-0">
          <Chips items={FILTERS.map((f) => ({ href: `/super/clients?filter=${f.id}${query ? `&q=${encodeURIComponent(query)}` : ""}`, label: f.label, active: activeFilter === f.id }))} />
        </div>
      </div>

      <Card className="overflow-hidden">
        {clients.length === 0 ? (
          <EmptyState icon={<Building2 />} title="No clients found" hint={query ? "Try a different search." : "Add your first client."} />
        ) : (
          <div className="overflow-x-auto">
            <table className={tbl}>
              <thead className={thead}>
                <tr>
                  <th className={th}>Business</th>
                  <th className={th}>Sector</th>
                  <th className={th}>Plan</th>
                  <th className={th}>License ends</th>
                  <th className={th}>Storage</th>
                  <th className={th}>Leads</th>
                  <th className={th}>Status</th>
                  <th className={th}></th>
                </tr>
              </thead>
              <tbody className={tbody}>
                {clients.map((c) => {
                  const expired = c.subscriptionEndsAt && new Date(c.subscriptionEndsAt) < new Date();
                  return (
                    <tr key={c.id} className={tr}>
                      <td className={td}><Who name={c.name} sub={`${c.subdomain}.${ROOT_DOMAIN}`} href={`/super/clients/${c.id}`} /></td>
                      <td className={`${td} whitespace-nowrap`}>{verticalName(c.vertical)}</td>
                      <td className={`${td} capitalize`}>{c.plan}</td>
                      <td className={`${td} whitespace-nowrap`}>{c.subscriptionEndsAt ? new Date(c.subscriptionEndsAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "Lifetime"}</td>
                      <td className={`${td} whitespace-nowrap`}>{formatBytes(bytesOf.get(c.id) ?? 0)}</td>
                      <td className={td}>{c._count.leads}</td>
                      <td className={td}><Pill tone={c.status === "suspended" ? "red" : expired ? "amber" : "green"}>{c.status === "suspended" ? "suspended" : expired ? "expired" : "active"}</Pill></td>
                      <td className={td}>
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
