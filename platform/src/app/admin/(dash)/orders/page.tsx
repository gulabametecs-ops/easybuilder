import { getAuthedSession } from "@/lib/auth";
import { getDemoSessionId } from "@/lib/actions/guard";
import { adminOrders } from "@/lib/storeAdmin";
import { OrdersManager } from "@/components/admin/store/OrdersManager";

export const metadata = { title: "Orders" };

export default async function OrdersPage() {
  const authed = await getAuthedSession();
  if (!authed) return null;
  const demoId = await getDemoSessionId();
  return <OrdersManager orders={await adminOrders(authed.tenant.id, demoId)} bizName={authed.tenant.name} demo={!!demoId} />;
}
