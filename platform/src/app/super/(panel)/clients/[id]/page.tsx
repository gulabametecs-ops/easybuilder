import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarCheck, ExternalLink, FileStack, HardDrive, Inbox } from "lucide-react";
import { db } from "@/lib/db";
import { ROOT_DOMAIN } from "@/lib/domains";
import { verticalName } from "@/lib/verticals";
import { formatBytes, formatINR } from "@/lib/plans";
import { LogIn } from "lucide-react";
import { recordManualPayment } from "@/lib/actions/superAdmin";
import { Card, StatCard, Badge, EmptyState } from "@/components/admin/ui";
import { ClientActions } from "@/components/super/ClientActions";
import { PlanUsage, LicenseTimeline } from "@/components/super/ClientUsage";
import { getUsage, planFor } from "@/lib/usage";

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

  const [usage, plan] = await Promise.all([getUsage(tenant.id), planFor(tenant)]);
  const url = `${proto}://${tenant.subdomain}.${ROOT_DOMAIN}`;
  const expired = tenant.subscriptionEndsAt && new Date(tenant.subscriptionEndsAt) < new Date();
  const owner = tenant.users[0];

  return (
    <>
      <Link href="/super/clients" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 mb-4">
        <ArrowLeft className="w-4 h-4" /> Back to clients
      </Link>
      {/* Hero */}
      <div className="admin-grad relative mb-6 overflow-hidden rounded-3xl p-6 sm:p-7 shadow-lg">
        <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-white/10" aria-hidden />
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-xl font-extrabold backdrop-blur">
              {tenant.name.split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase()}
            </span>
            <div className="min-w-0">
              <h1 className="font-display text-2xl font-extrabold tracking-tight sm:text-3xl">{tenant.name}</h1>
              <p className="truncate text-sm text-white/80">{tenant.subdomain}.{ROOT_DOMAIN} · {verticalName(tenant.vertical)}</p>
              <div className="mt-2 flex flex-wrap gap-1.5 text-[11px] font-semibold">
                <span className="rounded-full bg-white/20 px-2.5 py-0.5 capitalize">{plan.tier?.name ?? tenant.plan}</span>
                <span className={`rounded-full px-2.5 py-0.5 ${tenant.status === "suspended" ? "bg-red-500" : expired ? "bg-amber-500" : "bg-emerald-500"}`}>{tenant.status === "suspended" ? "Suspended" : expired ? "Expired" : "Active"}</span>
                {tenant.customDomain && <span className="rounded-full bg-white/20 px-2.5 py-0.5">{tenant.customDomain}</span>}
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <a href={url} target="_blank" className="inline-flex items-center gap-1.5 rounded-xl border border-white/40 px-3.5 py-2 text-sm font-semibold hover:bg-white/10"><ExternalLink className="w-4 h-4" /> Site</a>
            <a href={`/super/impersonate/${tenant.id}`} className="inline-flex items-center gap-1.5 rounded-xl bg-white px-3.5 py-2 text-sm font-semibold text-slate-900 hover:bg-white/90"><LogIn className="w-4 h-4" /> Login as client</a>
          </div>
        </div>
      </div>

      {/* Activity */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Storage used" value={formatBytes(usage.storageBytes)} icon={<HardDrive className="h-4 w-4" />} />
        <StatCard label="Leads" value={tenant._count.leads} icon={<Inbox className="h-4 w-4" />} />
        <StatCard label="Appointments" value={tenant._count.appointments} icon={<CalendarCheck className="h-4 w-4" />} />
        <StatCard label="Pages" value={tenant._count.pages} icon={<FileStack className="h-4 w-4" />} />
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
                <select name="months" defaultValue="12" className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"><option value="1">1 Month</option><option value="3">3 Months</option><option value="6">6 Months</option><option value="12">1 Year</option><option value="24">2 Years</option><option value="36">3 Years</option></select>
              </label>
              <button className="admin-grad rounded-lg text-sm font-semibold px-4 py-2 hover:opacity-90">Record</button>
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

        {/* Right: usage, licence, actions */}
        <div className="space-y-6">
          <LicenseTimeline endsAt={tenant.subscriptionEndsAt} status={tenant.status} />
          <PlanUsage usage={usage} limits={plan.limits} planName={plan.tier?.name ?? tenant.plan} />
          <Card className="p-5 h-fit">
            <h3 className="font-semibold text-slate-900 mb-4">Manage license</h3>
            <ClientActions tenantId={tenant.id} status={tenant.status} plan={tenant.plan} />
          </Card>
        </div>
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
