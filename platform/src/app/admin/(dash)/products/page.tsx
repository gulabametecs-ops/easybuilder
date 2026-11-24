import { getAuthedSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { getDemoSessionId } from "@/lib/actions/guard";
import { demoVisibleWhere } from "@/lib/demoSession";
import { mapProduct } from "@/lib/store";
import { getStoreSettings } from "@/lib/storeServer";
import { ProductsManager } from "@/components/admin/store/ProductsManager";

export const metadata = { title: "Products" };

export default async function ProductsPage() {
  const authed = await getAuthedSession();
  if (!authed) return null;
  const demoId = await getDemoSessionId();
  const [rows, settings] = await Promise.all([
    db.product.findMany({ where: demoVisibleWhere(authed.tenant.id, demoId), orderBy: [{ featured: "desc" }, { order: "asc" }] }),
    getStoreSettings(authed.tenant.id, demoId),
  ]);
  const products = rows.map((r) => ({ ...mapProduct(r), published: r.published, mine: !demoId || r.demoSessionId === demoId }));
  return <ProductsManager products={products} lowStockAt={settings.lowStockAt} demo={!!demoId} />;
}
