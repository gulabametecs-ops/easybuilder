import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { getCurrentTenant } from "@/lib/tenant";
import { getStoreSettings } from "@/lib/storeServer";
import { getActiveDemoSessionForTenant, isDemoSubdomain } from "@/lib/demoSession";
import { catalogLines } from "@/lib/storeCatalog";
import { isStoreVertical, jsonList, type OrderItem } from "@/lib/store";
import { CartRestore, CartView } from "@/components/site/store/Checkout";

export const metadata = { title: "Your Cart", robots: { index: false } };

export default async function CartPage({ searchParams }: { searchParams: Promise<{ restore?: string }> }) {
  const tenant = await getCurrentTenant();
  if (!tenant) notFound();
  const settings = await getStoreSettings(tenant.id);
  // Any site with products can sell, but only store sectors link here.
  if (!isStoreVertical(tenant.vertical) && !(await db.product.count({ where: { tenantId: tenant.id } }))) notFound();

  // Abandoned-checkout link (/cart?restore=<token>): refill the cart at today's prices.
  const token = (await searchParams).restore ?? "";
  let restore: { token: string; items: { productId: string; variantId: string | null; qty: number; options: Record<string, string>; slug: string; name: string; price: number; image: string }[] } | null = null;
  if (/^[\w-]{16,64}$/.test(token)) {
    const demo = isDemoSubdomain(tenant.subdomain) ? await getActiveDemoSessionForTenant(tenant) : null;
    const cart = await db.abandonedCart.findFirst({ where: { tenantId: tenant.id, token, recovered: false, demoSessionId: demo?.id ?? null } });
    if (cart) {
      const saved = jsonList<OrderItem>(cart.items).filter((i) => i && i.productId);
      const lines = await catalogLines(tenant.id, saved.map((i) => ({ productId: i.productId, variantId: i.variantId ?? null, qty: i.qty, options: i.options ?? {} })), { demoSessionId: demo?.id ?? null });
      restore = {
        token,
        items: lines.filter((l) => l.name && l.maxQty > 0).map((l) => ({ productId: l.productId, variantId: l.variantId, qty: Math.min(l.qty, l.maxQty), options: l.options, slug: l.slug, name: l.name, price: l.unitPrice, image: l.image })),
      };
    }
  }

  return (
    <div className="site-sec bg-light min-h-[60vh]">
      {restore && <CartRestore token={restore.token} items={restore.items} />}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 sm:py-12">
        <h1 className="text-3xl sm:text-4xl font-bold mb-6 sm:mb-8">Your <span className="text-primary">Cart</span></h1>
        <CartView freeShippingAbove={settings.freeShippingAbove} minOrder={settings.minOrder} checkoutNote={settings.checkoutNote} />
      </div>
    </div>
  );
}
