import { getAuthedSession } from "@/lib/auth";
import { getDemoSessionId } from "@/lib/actions/guard";
import { getStoreSettings } from "@/lib/storeServer";
import { StoreSettingsForm } from "@/components/admin/store/StoreSettingsForm";

export const metadata = { title: "Store settings" };

export default async function StoreSettingsPage() {
  const authed = await getAuthedSession();
  if (!authed) return null;
  const demoId = await getDemoSessionId();
  return <StoreSettingsForm initial={await getStoreSettings(authed.tenant.id, demoId)} demo={!!demoId} />;
}
