import { notFound } from "next/navigation";
import { Lock } from "lucide-react";
import { db } from "@/lib/db";
import { getCurrentTenant } from "@/lib/tenant";
import { getStoreSettings } from "@/lib/storeServer";
import { getActiveDemoSessionForTenant, isDemoSubdomain } from "@/lib/demoSession";
import { onlineAvailable } from "@/lib/checkoutServer";
import { isStoreVertical, paymentMethods } from "@/lib/store";
import { getStoreCustomer } from "@/lib/storeCustomer";
import { Checkout } from "@/components/site/store/Checkout";

export const metadata = { title: "Checkout", robots: { index: false } };

export default async function CheckoutPage() {
  const tenant = await getCurrentTenant();
  if (!tenant) notFound();
  if (!isStoreVertical(tenant.vertical) && !(await db.product.count({ where: { tenantId: tenant.id } }))) notFound();
  const demo = isDemoSubdomain(tenant.subdomain) ? await getActiveDemoSessionForTenant(tenant) : null;
  const [settings, online, me] = await Promise.all([getStoreSettings(tenant.id), onlineAvailable(tenant.id, demo?.id ?? null), getStoreCustomer()]);
  return (
    <div className="site-sec bg-light min-h-[60vh]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-6 sm:py-10">
        <div className="flex items-end justify-between gap-3 mb-5 sm:mb-7">
          <h1 className="text-3xl sm:text-4xl font-bold">Checkout</h1>
          <p className="inline-flex items-center gap-1.5 text-xs font-semibold site-muted"><Lock className="w-3.5 h-3.5" /> Secure checkout</p>
        </div>
        <Checkout
          bizName={tenant.name}
          methods={paymentMethods(settings, online)}
          prefill={me ? { name: me.name, phone: me.phone, email: me.email } : null}
          addresses={me?.addresses ?? []}
          checkoutNote={settings.checkoutNote}
          demo={!!demo}
        />
      </div>
    </div>
  );
}
