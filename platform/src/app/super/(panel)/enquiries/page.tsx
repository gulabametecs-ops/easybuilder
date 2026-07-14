import { db } from "@/lib/db";
import { verticalName } from "@/lib/verticals";
import { PageHeader, Card, Badge, EmptyState } from "@/components/admin/ui";

export const metadata = { title: "Enquiries" };

export default async function EnquiriesPage() {
  const leads = await db.platformLead.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <>
      <PageHeader title="Enquiries" subtitle={`${leads.length} demo requests & sign-up enquiries`} />
      <Card>
        {leads.length === 0 ? <EmptyState title="No enquiries yet" hint="Demo-gate and enquiry forms feed this list." /> : (
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
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {leads.map((l) => (
                  <tr key={l.id}>
                    <td className="p-4 font-medium text-slate-900">{l.name}</td>
                    <td className="p-4 text-slate-600">{l.phone}<br /><span className="text-slate-400">{l.email}</span></td>
                    <td className="p-4 text-slate-600">{l.company || "—"}</td>
                    <td className="p-4 text-slate-600">{l.vertical ? verticalName(l.vertical) : "—"}</td>
                    <td className="p-4"><Badge tone={l.type === "demo" ? "blue" : "green"}>{l.type}</Badge></td>
                    <td className="p-4 text-slate-400 whitespace-nowrap">{new Date(l.createdAt).toLocaleDateString()}</td>
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
