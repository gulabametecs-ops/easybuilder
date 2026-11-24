import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { getCurrentTenant } from "@/lib/tenant";
import { getStoreSettings } from "@/lib/storeServer";
import { isStoreVertical, paymentMethods } from "@/lib/store";
import { CartCheckout } from "@/components/site/store/StoreClient";
import { getStoreCustomer } from "@/lib/storeCustomer";

export const metadata = { title: "Your Cart", robots: { index: false } };

export default async function CartPage() {
  const tenant = await getCurrentTenant();
  if (!tenant) notFound();
  const settings = await getStoreSettings(tenant.id);
  // Any site with products can sell, but only store sectors link here.
  if (!isStoreVertical(tenant.vertical) && !(await db.product.count({ where: { tenantId: tenant.id } }))) notFound();
  // Signed-in shoppers get their default address filled in.
  const me = await getStoreCustomer();
  const addr = me?.addresses.find((a) => a.isDefault) ?? me?.addresses[0];
  const prefill = me ? {
    name: addr?.name || me.name, phone: addr?.phone || me.phone, email: me.email,
    address: addr ? [addr.line1, addr.line2].filter(Boolean).join(", ") : "", city: addr?.city ?? "", pincode: addr?.pincode ?? "",
  } : null;
  return (
    <div className="site-sec bg-light min-h-[60vh]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 sm:py-12">
        <h1 className="text-3xl sm:text-4xl font-bold mb-6 sm:mb-8">Cart &amp; <span className="text-primary">Checkout</span></h1>
        <CartCheckout settings={settings} methods={paymentMethods(settings)} bizName={tenant.name} prefill={prefill} />
      </div>
    </div>
  );
}
