import { db } from "@/lib/db";
import { verticalName } from "@/lib/verticals";
import { BLOCKED, FOLLOW_UP_STATUSES, leadSearch } from "@/lib/leadStatus";
import { Ban, BadgeCheck, CalendarPlus, Download, Inbox, Mail, Phone } from "lucide-react";
import { PageHeader, Card, EmptyState } from "@/components/admin/ui";
import { Kpi, Who, Pill, LEAD_TONE, tbl, thead, th, tbody, tr, td, ago } from "@/components/super/kit";
import { FilterBar } from "@/components/super/FilterBar";
import { LeadActions } from "@/components/super/LeadActions";

export const metadata = { title: "Enquiries" };

type SP = { q?: string; type?: string; status?: string; sector?: string };

export default async function EnquiriesPage({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const status = [...FOLLOW_UP_STATUSES, BLOCKED].find((s) => s === sp.status);
  const weekAgo = new Date(new Date().getTime() - 7 * 86400000);
  const [leads, types, sectors, total, week, verified, blocked] = await Promise.all([
    db.platformLead.findMany({
      where: {
        ...leadSearch(sp.q),
        ...(sp.type ? { type: sp.type } : {}),
        ...(sp.sector ? { vertical: sp.sector } : {}),
        // Blocked contacts only show under the "blocked" filter.
        status: status ?? { not: BLOCKED },
      },
      orderBy: { createdAt: "desc" },
      take: 500,
    }),
    db.platformLead.groupBy({ by: ["type"] }),
    db.platformLead.groupBy({ by: ["vertical"] }),
    db.platformLead.count({ where: { status: { not: BLOCKED } } }),
    db.platformLead.count({ where: { status: { not: BLOCKED }, createdAt: { gte: weekAgo } } }),
    db.platformLead.count({ where: { verified: true, status: { not: BLOCKED } } }),
    db.platformLead.count({ where: { status: BLOCKED } }),
  ]);

  return (
    <>
      <PageHeader
        title="Enquiries"
        subtitle={`${leads.length} demo requests & sign-up enquiries${status ? ` · ${status}` : ""}`}
        icon={<Inbox />}
        action={
          <a href="/super/export?type=leads" className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 hover:border-lime-400 hover:text-lime-600 dark:border-white/10 dark:bg-slate-900 dark:text-slate-200">
            <Download className="h-4 w-4" /> Export CSV
          </a>
        }
      />
      <div className="mb-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <Kpi label="Total enquiries" value={total} hint="Excluding blocked" icon={<Inbox />} tone="blue" />
        <Kpi label="New this week" value={week} hint="Last 7 days" icon={<CalendarPlus />} tone="violet" />
        <Kpi label="OTP verified" value={verified} hint={total ? `${Math.round((verified / total) * 100)}% of enquiries` : undefined} icon={<BadgeCheck />} tone="green" />
        <Kpi label="Blocked" value={blocked} hint="Can't request demos" icon={<Ban />} tone="red" href="/super/enquiries?status=blocked" />
      </div>
      <FilterBar
        q={sp.q}
        selects={[
          { name: "type", label: "Type", value: sp.type, options: types.map((t) => ({ value: t.type, label: t.type })) },
          { name: "status", label: "Status", value: status, options: [...FOLLOW_UP_STATUSES, BLOCKED].map((s) => ({ value: s, label: s })) },
          {
            name: "sector",
            label: "Sector",
            value: sp.sector,
            options: sectors.filter((s) => s.vertical).map((s) => ({ value: s.vertical, label: verticalName(s.vertical) })).sort((a, b) => a.label.localeCompare(b.label)),
          },
        ]}
      />
      <Card className="overflow-hidden">
        {leads.length === 0 ? <EmptyState icon={<Inbox />} title="No enquiries found" hint="Try clearing the filters." /> : (
          <div className="overflow-x-auto">
            <table className={tbl}>
              <thead className={thead}>
                <tr>
                  <th className={th}>Name</th>
                  <th className={th}>Contact</th>
                  <th className={th}>Sector</th>
                  <th className={th}>Type · status</th>
                  <th className={th}>Received</th>
                  <th className={th}>Actions</th>
                </tr>
              </thead>
              <tbody className={tbody}>
                {leads.map((l) => (
                  <tr key={l.id} className={tr}>
                    <td className={td}><Who name={l.name} sub={l.company || undefined} extra={l.verified ? <BadgeCheck className="h-4 w-4 text-blue-500" aria-label="OTP verified" /> : null} /></td>
                    <td className={td}>
                      {l.phone && <a href={`tel:${l.phone.replace(/\s+/g, "")}`} className="flex items-center gap-1.5 whitespace-nowrap hover:text-lime-600"><Phone className="h-3.5 w-3.5 text-slate-400" />{l.phone}</a>}
                      {l.email && <a href={`mailto:${l.email}`} className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-lime-600"><Mail className="h-3.5 w-3.5" />{l.email}</a>}
                    </td>
                    <td className={`${td} whitespace-nowrap`}>{l.vertical ? verticalName(l.vertical) : "—"}</td>
                    <td className={td}>
                      <div className="flex flex-wrap gap-1.5">
                        <Pill tone={l.type === "demo" ? "blue" : "green"}>{l.type}</Pill>
                        <Pill tone={LEAD_TONE[l.status] ?? "slate"}>{l.status}</Pill>
                      </div>
                    </td>
                    <td className={`${td} whitespace-nowrap text-slate-400`} title={new Date(l.createdAt).toLocaleString("en-IN")}>{ago(l.createdAt)}</td>
                    <td className={td}><LeadActions leadId={l.id} blocked={l.status === BLOCKED} name={l.name} /></td>
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
