import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { db } from "@/lib/db";
import { ROOT_DOMAIN } from "@/lib/domains";
import { verticalName } from "@/lib/verticals";
import { formatINR } from "@/lib/plans";
import { LogIn } from "lucide-react";
import { recordManualPayment } from "@/lib/actions/superAdmin";
import { PageHeader, Card, StatCard, Badge, EmptyState } from "@/components/admin/ui";
import { ClientActions } from "@/components/super/ClientActions";

export const metadata = { title: "Client" };
const proto = ROOT_DOMAIN.includes("localhost") ? "http" : "https";

type Props = { params: Promise<{ id: string }> };

export default async function ClientDetailPage({ params }: Props) {
  const { id } = await params;

  const tenant = await db.tenant.findUnique({
    where: { id },
    include: {
      _count: { select: { services: true, galleryItems: true, leads: true, appointments: true, pages: true, users: true } },
      users: { select: { email: true, role: true }, take: 5 },
      orders: { orderBy: { createdAt: "desc" }, take: 5 },
      leads: { orderBy: { createdAt: "desc" }, take: 5 },
    },
  });
  if (!tenant) notFound();

  const url = `${proto}://${tenant.subdomain}.${ROOT_DOMAIN}`;
  const expired = tenant.subscriptionEndsAt && new Date(tenant.subscriptionEndsAt) < new Date();
  const owner = tenant.users[0];

  return (
    <>
      <Link href="/super/clients" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 mb-4">
        <ArrowLeft className="w-4 h-4" /> Back to clients
      </Link>
      <PageHeader
        title={tenant.name}
        subtitle={`${tenant.subdomain}.${ROOT_DOMAIN} · ${verticalName(tenant.vertical)}`}
        action={
          <div className="flex gap-2">
            <a href={url} target="_blank" className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium hover:bg-slate-50"><ExternalLink className="w-4 h-4" /> Site</a>
            <a href={`/super/impersonate/${tenant.id}`} className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 text-white px-3 py-2 text-sm font-semibold hover:bg-slate-800"><LogIn className="w-4 h-4" /> Login as client</a>
          </div>
        }
      />

      {/* Usage stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <StatCard label="Services" value={tenant._count.services} />
        <StatCard label="Images" value={tenant._count.galleryItems} />
        <StatCard label="Leads" value={tenant._count.leads} />
        <StatCard label="Appointments" value={tenant._count.appointments} />
        <StatCard label="Pages" value={tenant._count.pages} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left: info + recent leads */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-5">
            <h3 className="font-semibold text-slate-900 mb-4">Account details</h3>
            <dl className="grid sm:grid-cols-2 gap-4 text-sm">
              <Detail label="Status" value={<Badge tone={tenant.status === "suspended" ? "red" : expired ? "amber" : "green"}>{tenant.status === "suspended" ? "suspended" : expired ? "expired" : "active"}</Badge>} />
              <Detail label="Plan" value={<span className="capitalize">{tenant.plan}</span>} />
              <Detail label="License ends" value={tenant.subscriptionEndsAt ? new Date(tenant.subscriptionEndsAt).toLocaleDateString() : "Lifetime"} />
              <Detail label="Created" value={new Date(tenant.createdAt).toLocaleDateString()} />
              <Detail label="Owner email" value={owner?.email ?? "—"} />
              <Detail label="Custom domain" value={tenant.customDomain ?? "Not connected"} />
            </dl>
          </Card>

          <Card className="p-5">
            <h3 className="font-semibold text-slate-900 mb-1">Record offline payment</h3>
            <p className="text-sm text-slate-500 mb-4">Client paid via cash / UPI / bank? Record it here and extend the license.</p>
            <form action={recordManualPayment} className="grid sm:grid-cols-4 gap-3 items-end">
              <input type="hidden" name="tenantId" value={tenant.id} />
              <label className="block"><span className="block text-xs font-medium text-slate-500 mb-1">Amount (₹)</span><input name="amount" type="number" min="0" step="1" required placeholder="999" className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" /></label>
              <label className="block"><span className="block text-xs font-medium text-slate-500 mb-1">Method</span>
                <select name="method" className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"><option value="cash">Cash</option><option value="upi">UPI</option><option value="bank">Bank transfer</option><option value="other">Other</option></select>
              </label>
              <label className="block"><span className="block text-xs font-medium text-slate-500 mb-1">Extend by</span>
                <select name="months" defaultValue="12" className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"><option value="1">1 Month</option><option value="3">3 Months</option><option value="6">6 Months</option><option value="12">1 Year</option><option value="24">2 Years</option><option value="lifetime">Lifetime</option></select>
              </label>
              <button className="rounded-lg bg-slate-900 text-white text-sm font-semibold px-4 py-2 hover:bg-slate-800">Record</button>
            </form>
          </Card>

          <Card>
            <div className="p-5 border-b border-slate-100 font-semibold text-slate-900">Recent leads</div>
            {tenant.leads.length === 0 ? <EmptyState title="No leads yet" /> : (
              <ul className="divide-y divide-slate-100">
                {tenant.leads.map((l) => (
                  <li key={l.id} className="p-4 flex items-center justify-between">
                    <div><p className="font-medium text-slate-900">{l.name} · <span className="font-normal text-slate-500">{l.phone}</span></p><p className="text-sm text-slate-500">{l.service || "General"}{l.message ? ` — ${l.message}` : ""}</p></div>
                    <Badge tone={l.status === "new" ? "green" : "slate"}>{l.status}</Badge>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          {tenant.orders.length > 0 && (
            <Card>
              <div className="p-5 border-b border-slate-100 font-semibold text-slate-900">Payment history</div>
              <ul className="divide-y divide-slate-100">
                {tenant.orders.map((o) => (
                  <li key={o.id} className="p-4 flex items-center justify-between text-sm">
                    <span className="text-slate-600">{new Date(o.createdAt).toLocaleDateString()} · {o.plan}</span>
                    <span className="font-semibold text-slate-900">{formatINR(o.amount)}</span>
                    <Badge tone={o.status === "provisioned" ? "green" : o.status === "paid" ? "blue" : "slate"}>{o.status}</Badge>
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </div>

        {/* Right: actions */}
        <Card className="p-5 h-fit">
          <h3 className="font-semibold text-slate-900 mb-4">Manage license</h3>
          <ClientActions tenantId={tenant.id} status={tenant.status} plan={tenant.plan} />
        </Card>
      </div>
    </>
  );
}

function Detail({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <dt className="text-slate-400">{label}</dt>
      <dd className="font-medium text-slate-800 mt-0.5 break-all">{value}</dd>
    </div>
  );
}
