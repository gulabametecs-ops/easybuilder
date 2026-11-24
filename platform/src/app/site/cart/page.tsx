import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { getCurrentTenant } from "@/lib/tenant";
import { getStoreSettings } from "@/lib/storeServer";
import { isStoreVertical, paymentMethods } from "@/lib/store";
import { CartCheckout } from "@/components/site/store/StoreClient";

export const metadata = { title: "Your Cart", robots: { index: false } };

export default async function CartPage() {
  const tenant = await getCurrentTenant();
  if (!tenant) notFound();
  const settings = await getStoreSettings(tenant.id);
  // Any site with products can sell, but only store sectors link here.
  if (!isStoreVertical(tenant.vertical) && !(await db.product.count({ where: { tenantId: tenant.id } }))) notFound();
  return (
    <div className="site-sec bg-light min-h-[60vh]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 sm:py-12">
        <h1 className="text-3xl sm:text-4xl font-bold mb-6 sm:mb-8">Cart &amp; <span className="text-primary">Checkout</span></h1>
        <CartCheckout settings={settings} methods={paymentMethods(settings)} bizName={tenant.name} />
      </div>
    </div>
  );
}
