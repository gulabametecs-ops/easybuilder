import { getAuthedSession } from "@/lib/auth";
import { ROOT_DOMAIN } from "@/lib/domains";
import { db } from "@/lib/db";
import { getPlatformConfig } from "@/lib/platformConfig";
import { resolveTier, serviceLimitForPlan } from "@/lib/plans";
import { PageHeader, Card } from "@/components/admin/ui";
import { BusinessForm, PasswordForm } from "@/components/admin/SettingsForms";
import { CustomDomainCard } from "@/components/admin/CustomDomainCard";
import { Sparkles } from "lucide-react";

export const metadata = { title: "Settings" };

export default async function SettingsPage() {
  const authed = await getAuthedSession();
  if (!authed) return null;
  const { tenant, session } = authed;

  const liveUrl = tenant.customDomain
    ? `https://${tenant.customDomain}`
    : `http://${tenant.subdomain}.${ROOT_DOMAIN}`;

  const cfg = await getPlatformConfig();
  const tier = resolveTier(tenant.plan, cfg.planOverrides);
  const serviceCount = await db.service.count({ where: { tenantId: tenant.id } });
  const limit = serviceLimitForPlan(tenant.plan, cfg.planOverrides);
  const expiry = tenant.subscriptionEndsAt ? new Date(tenant.subscriptionEndsAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "No expiry";
  const upgradeUrl = `http://${ROOT_DOMAIN}/subscribe`;

  return (
    <>
      <PageHeader title="Settings" subtitle="Manage your account and website settings." />

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="p-6 lg:col-span-2 bg-gradient-to-br from-lime-50 to-white border-lime-200">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h3 className="font-semibold text-slate-900 flex items-center gap-2"><Sparkles className="w-5 h-5 text-lime-600" /> Your plan: {tier ? tier.name : tenant.plan}</h3>
              <dl className="grid sm:grid-cols-3 gap-4 text-sm mt-4">
                <div><dt className="text-slate-400">Services</dt><dd className="font-medium text-slate-800">{serviceCount}{limit > 0 ? ` / ${limit}` : " / Unlimited"}</dd></div>
                <div><dt className="text-slate-400">Renews / expires</dt><dd className="font-medium text-slate-800">{expiry}</dd></div>
                <div><dt className="text-slate-400">Status</dt><dd className="font-medium text-slate-800 capitalize">{tenant.status}</dd></div>
              </dl>
              {limit > 0 && serviceCount >= limit && (
                <p className="text-sm text-amber-600 mt-3">You&apos;ve reached your plan&apos;s service limit. Upgrade to add more.</p>
              )}
            </div>
            <a href={upgradeUrl} target="_blank" className="inline-flex items-center gap-2 rounded-lg bg-slate-900 text-white text-sm font-semibold px-5 py-2.5 hover:bg-slate-800 shrink-0">
              <Sparkles className="w-4 h-4" /> Upgrade plan
            </a>
          </div>
        </Card>

        <CustomDomainCard
          domain={tenant.customDomain}
          status={tenant.domainStatus}
          aTarget={process.env.DOMAIN_A_TARGET ?? "76.76.21.21"}
          cnameTarget={process.env.DOMAIN_CNAME_TARGET ?? "cname.vercel-dns.com"}
        />

        <BusinessForm name={tenant.name} />
        <PasswordForm />

        <Card className="p-6 lg:col-span-2">
          <h3 className="font-semibold text-slate-900 mb-4">Website details</h3>
          <dl className="grid sm:grid-cols-2 gap-4 text-sm">
            <Detail label="Live website" value={liveUrl} isLink />
            <Detail label="Subdomain" value={`${tenant.subdomain}.${ROOT_DOMAIN}`} />
            <Detail label="Custom domain" value={tenant.customDomain ?? "Not connected"} />
            <Detail label="Plan" value={tenant.plan} />
            <Detail label="Signed in as" value={session.email} />
            <Detail label="Status" value={tenant.status} />
          </dl>
        </Card>
      </div>
    </>
  );
}

function Detail({ label, value, isLink }: { label: string; value: string; isLink?: boolean }) {
  return (
    <div>
      <dt className="text-slate-400">{label}</dt>
      <dd className="font-medium text-slate-800 break-all">
        {isLink ? <a href={value} target="_blank" className="text-lime-600 hover:underline">{value}</a> : value}
      </dd>
    </div>
  );
}
