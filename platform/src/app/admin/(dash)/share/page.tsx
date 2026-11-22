import { getAuthedSession } from "@/lib/auth";
import { ROOT_DOMAIN } from "@/lib/domains";
import { getTenantConfig } from "@/lib/tenant";
import { PageHeader } from "@/components/admin/ui";
import { ShareKit } from "@/components/admin/ShareKit";

export const metadata = { title: "Share & QR" };

export default async function SharePage() {
  const authed = await getAuthedSession();
  if (!authed) return null;
  const { tenant } = authed;
  const { header } = await getTenantConfig(tenant.id, tenant.name);
  const proto = ROOT_DOMAIN.includes("localhost") ? "http" : "https";
  const url =
    tenant.customDomain && tenant.domainStatus === "connected"
      ? `https://${tenant.customDomain}`
      : `${proto}://${tenant.subdomain}.${ROOT_DOMAIN}`;

  return (
    <>
      <PageHeader
        title="Share & QR code"
        subtitle="Spread the word: copy your link, share it on WhatsApp, or print a QR poster for your shop, reception or notice board."
      />
      <ShareKit url={url} bizName={tenant.name} logo={header.logoImage} />
    </>
  );
}
