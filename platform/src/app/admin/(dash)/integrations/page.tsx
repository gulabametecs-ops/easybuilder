import { getAuthedSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { parsePayments } from "@/lib/payments";
import { parseIntegrations, LEGACY_SEO_FIELDS, type IntegrationsConfig } from "@/lib/integrations";
import { IntegrationsManager } from "@/components/admin/IntegrationsManager";
import { categoryOf, verticalName } from "@/lib/verticals";
import { ROOT_DOMAIN } from "@/lib/domains";

export const metadata = { title: "Integrations" };

export default async function IntegrationsPage() {
  const authed = await getAuthedSession();
  if (!authed) return null;
  const { tenant, session } = authed;
  const row = await db.siteConfig.findUnique({ where: { tenantId: tenant.id }, select: { integrations: true, payments: true, seo: true } });
  const integrations: IntegrationsConfig = parseIntegrations(row?.integrations);
  const payments = parsePayments(row?.payments);

  // Values still stored in SEO settings show as connected until re-saved here.
  let seo: Record<string, unknown> = {};
  try { seo = JSON.parse(row?.seo || "{}"); } catch { /* keep empty */ }
  const legacy: string[] = [];
  for (const [id, [key, seoKey]] of Object.entries(LEGACY_SEO_FIELDS)) {
    const v = typeof seo[seoKey] === "string" ? (seo[seoKey] as string).trim() : "";
    if (v && !integrations[id]) {
      integrations[id] = { enabled: true, values: { [key]: v } };
      legacy.push(id);
    }
  }

  return (
    <IntegrationsManager
      integrations={integrations}
      legacy={legacy}
      // The Razorpay secret never leaves the server; only whether one is saved.
      payments={{ razorpayKeyId: payments.razorpayKeyId, upiId: payments.upiId, upiQrImage: payments.upiQrImage }}
      hasRazorpaySecret={Boolean(payments.razorpayKeySecret)}
      readOnly={Boolean(session.demo) || !["owner", "admin"].includes(session.role)}
      demo={Boolean(session.demo)}
      sector={{ category: categoryOf(tenant.vertical), name: verticalName(tenant.vertical) }}
      siteUrl={tenant.customDomain ? `https://${tenant.customDomain}` : `${ROOT_DOMAIN.includes("localhost") ? "http" : "https"}://${tenant.subdomain}.${ROOT_DOMAIN}`}
    />
  );
}
