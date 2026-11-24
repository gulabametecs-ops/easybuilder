import { getAuthedSession } from "@/lib/auth";
import { getDemoSessionId } from "@/lib/actions/guard";
import { adminOrders } from "@/lib/storeAdmin";
import { ReturnsManager } from "@/components/admin/store/ReturnsManager";

export const metadata = { title: "Returns" };

export default async function ReturnsPage() {
  const authed = await getAuthedSession();
  if (!authed) return null;
  const demoId = await getDemoSessionId();
  const orders = (await adminOrders(authed.tenant.id, demoId)).filter((o) => o.returnStatus !== "none");
  return <ReturnsManager orders={orders} demo={!!demoId} />;
}
