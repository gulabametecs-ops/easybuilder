import { db } from "@/lib/db";
import { verticalName } from "@/lib/verticals";
import { BLOCKED, FOLLOW_UP_STATUSES, leadSearch } from "@/lib/leadStatus";
import { PageHeader, Card, Badge, EmptyState } from "@/components/admin/ui";
import { FilterBar } from "@/components/super/FilterBar";
import { LeadActions } from "@/components/super/LeadActions";

export const metadata = { title: "Enquiries" };

type SP = { q?: string; type?: string; status?: string; sector?: string };

export default async function EnquiriesPage({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const status = [...FOLLOW_UP_STATUSES, BLOCKED].find((s) => s === sp.status);
  const [leads, types, sectors] = await Promise.all([
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
  ]);

  return (
    <>
      <PageHeader title="Enquiries" subtitle={`${leads.length} demo requests & sign-up enquiries${status ? ` · ${status}` : ""}`} />
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
      <Card>
        {leads.length === 0 ? <EmptyState title="No enquiries found" hint="Try clearing the filters." /> : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-slate-400 border-b border-slate-100">
                <tr>
                  <th className="p-4 font-medium">Name</th>
                  <th className="p-4 font-medium">Contact</th>
                  <th className="p-4 font-medium">Company</th>
                  <th className="p-4 font-medium">Sector</th>
                  <th className="p-4 font-medium">Type</th>
                  <th className="p-4 font-medium">Date</th>
                  <th className="p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {leads.map((l) => (
                  <tr key={l.id}>
                    <td className="p-4 font-medium text-slate-900">
                      {l.name}
                      {l.status === BLOCKED && <span className="ml-2"><Badge tone="red">blocked</Badge></span>}
                    </td>
                    <td className="p-4 text-slate-600">{l.phone}<br /><span className="text-slate-400">{l.email}</span></td>
                    <td className="p-4 text-slate-600">{l.company || "—"}</td>
                    <td className="p-4 text-slate-600">{l.vertical ? verticalName(l.vertical) : "—"}</td>
                    <td className="p-4"><Badge tone={l.type === "demo" ? "blue" : "green"}>{l.type}</Badge></td>
                    <td className="p-4 text-slate-400 whitespace-nowrap">{new Date(l.createdAt).toLocaleDateString("en-IN")}</td>
                    <td className="p-4"><LeadActions leadId={l.id} blocked={l.status === BLOCKED} name={l.name} /></td>
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
