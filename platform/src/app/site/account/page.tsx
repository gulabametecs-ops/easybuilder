import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { getCurrentTenant } from "@/lib/tenant";
import { getStoreCustomer } from "@/lib/storeCustomer";
import { jsonList, type OrderItem } from "@/lib/store";
import { AccountLogin, AccountView } from "@/components/site/store/AccountClient";

export const metadata = { title: "My Account", robots: { index: false } };

export default async function AccountPage() {
  const tenant = await getCurrentTenant();
  if (!tenant) notFound();
  const me = await getStoreCustomer();
  const shell = (body: React.ReactNode) => (
    <div className="site-sec bg-light min-h-[60vh]">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-8 sm:py-12">{body}</div>
    </div>
  );
  if (!me || me.blocked) return shell(<AccountLogin bizName={tenant.name} blocked={!!me?.blocked} />);

  const rows = await db.storeOrder.findMany({
    where: { tenantId: tenant.id, demoSessionId: me.demoSessionId ?? null, OR: [{ customerId: me.id }, { email: me.email }] },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  const orders = rows.map((o) => ({
    id: o.id, orderNo: o.orderNo, createdAt: o.createdAt.toISOString(), status: o.status, paymentMethod: o.paymentMethod, paymentStatus: o.paymentStatus,
    total: o.total, items: jsonList<OrderItem>(o.items), address: [o.address, o.city, o.pincode].filter(Boolean).join(", "),
  }));
  return shell(
    <AccountView
      bizName={tenant.name}
      me={{ email: me.email, name: me.name, phone: me.phone, marketingOptIn: me.marketingOptIn, addresses: me.addresses, wishlist: me.wishlist }}
      orders={orders}
    />,
  );
}
