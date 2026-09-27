import { getAuthedSession } from "@/lib/auth";
import { ROOT_DOMAIN } from "@/lib/domains";
import { db } from "@/lib/db";
import { getPlatformConfig } from "@/lib/platformConfig";
import { resolveTier, serviceLimitForPlan } from "@/lib/plans";
import { parseAdminPrefs } from "@/lib/adminPrefs";
import { SettingsManager } from "@/components/admin/SettingsManager";

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
  const [serviceCount, members, siteConfig, user, leads, appointments] = await Promise.all([
    db.service.count({ where: { tenantId: tenant.id } }),
    db.user.findMany({
      where: { tenantId: tenant.id },
      orderBy: { createdAt: "asc" },
      select: { id: true, email: true, name: true, role: true },
    }),
    db.siteConfig.findUnique({ where: { tenantId: tenant.id } }),
    db.user.findUnique({ where: { id: session.userId }, select: { name: true } }),
    db.lead.findMany({
      where: { tenantId: tenant.id },
      orderBy: { createdAt: "desc" },
      take: 2000,
      select: { name: true, phone: true, email: true, message: true, createdAt: true },
    }),
    db.appointment.findMany({
      where: { tenantId: tenant.id },
      orderBy: { createdAt: "desc" },
      take: 2000,
      select: { name: true, phone: true, email: true, date: true, time: true, message: true, createdAt: true },
    }),
  ]);
  const limit = serviceLimitForPlan(tenant.plan, cfg.planOverrides);
  const expiry = tenant.subscriptionEndsAt
    ? new Date(tenant.subscriptionEndsAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
    : "No expiry";
  const canManageTeam = session.role === "owner" || session.role === "admin";

  const prefs = parseAdminPrefs(siteConfig?.adminPrefs);

  return (
    <div className="admin-full-bleed flex flex-col flex-1 min-h-0">
      <SettingsManager
        planName={tier ? tier.name : tenant.plan}
        serviceCount={serviceCount}
        serviceLimit={limit}
        expiry={expiry}
        status={tenant.status}
        liveUrl={liveUrl}
        subdomain={`${tenant.subdomain}.${ROOT_DOMAIN}`}
        customDomain={tenant.customDomain}
        domainStatus={tenant.domainStatus}
        aTarget={process.env.DOMAIN_A_TARGET ?? "76.76.21.21"}
        cnameTarget={process.env.DOMAIN_CNAME_TARGET ?? "cname.vercel-dns.com"}
        businessName={tenant.name}
        planId={tenant.plan}
        sessionEmail={session.email}
        sessionRole={session.role}
        sessionName={user?.name || session.name || ""}
        members={members}
        currentUserId={session.userId}
        canManageTeam={canManageTeam}
        isOwner={session.role === "owner"}
        prefs={prefs}
        leads={leads.map((l) => ({
          name: l.name,
          phone: l.phone,
          email: l.email,
          message: l.message,
          createdAt: l.createdAt.toISOString(),
        }))}
        appointments={appointments.map((a) => ({
          name: a.name,
          phone: a.phone,
          email: a.email,
          date: a.date,
          time: a.time,
          message: a.message,
          createdAt: a.createdAt.toISOString(),
        }))}
        cancelRequested={!!tenant.cancelledAt}
        supportEmail={cfg.supportEmail}
      />
    </div>
  );
}
