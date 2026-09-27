import { db } from "@/lib/db";
import { verticalName } from "@/lib/verticals";
import { PageHeader, Card, Badge, EmptyState } from "@/components/admin/ui";

export const metadata = { title: "Demo leads" };

export default async function DemoLeadsPage() {
  const sessions = await db.demoSession.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
    include: { platformLead: true },
  });

  const verified = sessions.filter((s) => s.status === "active" || s.verifiedAt).length;

  return (
    <>
      <PageHeader
        title="Demo leads"
        subtitle={`${sessions.length} requests · ${verified} OTP verified · isolated 10-min sandboxes`}
      />
      <Card>
        {sessions.length === 0 ? (
          <EmptyState title="No demo sessions yet" hint="Visitors unlock sector demos from the /demos page." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-slate-400 border-b border-slate-100">
                <tr>
                  <th className="p-4 font-medium">Visitor</th>
                  <th className="p-4 font-medium">Sector</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium">Pages viewed</th>
                  <th className="p-4 font-medium">Started</th>
                  <th className="p-4 font-medium">Expires</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sessions.map((s) => {
                  let pages: string[] = [];
                  try { pages = JSON.parse(s.pagesViewed || "[]") as string[]; } catch { pages = []; }
                  return (
                    <tr key={s.id}>
                      <td className="p-4">
                        <p className="font-medium text-slate-900">{s.name}</p>
                        <p className="text-slate-500">{s.phone}</p>
                        <p className="text-slate-400 text-xs">{s.email}</p>
                        {s.company && <p className="text-slate-400 text-xs">{s.company}</p>}
                      </td>
                      <td className="p-4 text-slate-700">{verticalName(s.vertical)}</td>
                      <td className="p-4">
                        <Badge tone={s.status === "active" ? "green" : s.status === "pending_otp" ? "amber" : "slate"}>
                          {s.verifiedAt ? "verified" : s.status}
                        </Badge>
                      </td>
                      <td className="p-4 text-slate-600 max-w-[200px]">
                        {pages.length ? pages.join(", ") : "—"}
                      </td>
                      <td className="p-4 text-slate-400 whitespace-nowrap">
                        {new Date(s.createdAt).toLocaleString("en-IN", { dateStyle: "short", timeStyle: "short" })}
                      </td>
                      <td className="p-4 text-slate-400 whitespace-nowrap">
                        {s.expiresAt ? new Date(s.expiresAt).toLocaleString("en-IN", { dateStyle: "short", timeStyle: "short" }) : "—"}
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
