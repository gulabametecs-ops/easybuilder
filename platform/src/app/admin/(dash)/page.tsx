import Link from "next/link";
import { getAuthedSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { PageHeader, StatCard, Card, Badge, EmptyState } from "@/components/admin/ui";

export default async function DashboardPage() {
  const authed = await getAuthedSession();
  if (!authed) return null;
  const tenantId = authed.tenant.id;

  const [leadCount, newLeads, apptCount, pageCount, serviceCount, recentLeads] = await Promise.all([
    db.lead.count({ where: { tenantId } }),
    db.lead.count({ where: { tenantId, status: "new" } }),
    db.appointment.count({ where: { tenantId } }),
    db.page.count({ where: { tenantId } }),
    db.service.count({ where: { tenantId } }),
    db.lead.findMany({ where: { tenantId }, orderBy: { createdAt: "desc" }, take: 5 }),
  ]);

  return (
    <>
      <PageHeader title={`Welcome, ${authed.session.name}`} subtitle="Here's what's happening with your website." />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Leads" value={leadCount} hint={`${newLeads} new`} />
        <StatCard label="Appointments" value={apptCount} />
        <StatCard label="Pages" value={pageCount} />
        <StatCard label="Services" value={serviceCount} />
      </div>

      <Card>
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <h2 className="font-semibold text-slate-900">Recent Leads</h2>
          <Link href="/admin/leads" className="text-sm text-lime-600 font-medium hover:underline">View all →</Link>
        </div>
        {recentLeads.length === 0 ? (
          <EmptyState title="No leads yet" hint="Quote & contact form submissions will appear here." />
        ) : (
          <ul className="divide-y divide-slate-100">
            {recentLeads.map((l) => (
              <li key={l.id} className="flex items-center justify-between p-5">
                <div className="min-w-0">
                  <p className="font-medium text-slate-900">{l.name} · <span className="text-slate-500 font-normal">{l.phone}</span></p>
                  <p className="text-sm text-slate-500 truncate">{l.service || "General enquiry"}{l.message ? ` — ${l.message}` : ""}</p>
                </div>
                <Badge tone={l.status === "new" ? "green" : "slate"}>{l.status}</Badge>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </>
  );
}
