import { getAuthedSession } from "@/lib/auth";
import { getDemoWriteContext } from "@/lib/actions/guard";
import { db } from "@/lib/db";
import { getStoreSettings } from "@/lib/storeServer";
import { courierPublic, parseCourierCreds } from "@/lib/couriers";
import { ShippingSettingsForm } from "@/components/admin/store/ShippingSettingsForm";

export const metadata = { title: "Shipping & delivery" };

export default async function ShippingPage() {
  const authed = await getAuthedSession();
  if (!authed) return null;
  const demo = await getDemoWriteContext();
  const cfg = await db.siteConfig.findUnique({ where: { tenantId: authed.tenant.id }, select: { store: true } });
  // Secrets stay on the server: the form only learns whether a password/token is saved.
  const courier = courierPublic(parseCourierCreds(demo?.overlay.siteConfig?.store ?? cfg?.store));
  return <ShippingSettingsForm store={await getStoreSettings(authed.tenant.id, demo?.sessionId ?? null)} courier={courier} demo={!!demo} />;
}
