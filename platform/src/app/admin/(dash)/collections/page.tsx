import { getAuthedSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { getDemoSessionId } from "@/lib/actions/guard";
import { demoVisibleWhere } from "@/lib/demoSession";
import { jsonList, mapProduct } from "@/lib/store";
import { CollectionsManager } from "@/components/admin/store/CollectionsManager";

export const metadata = { title: "Collections" };

export default async function CollectionsPage() {
  const authed = await getAuthedSession();
  if (!authed) return null;
  const demoId = await getDemoSessionId();
  const where = demoVisibleWhere(authed.tenant.id, demoId);
  const [rows, products] = await Promise.all([
    db.collection.findMany({ where, orderBy: [{ order: "asc" }, { createdAt: "asc" }] }),
    db.product.findMany({ where, orderBy: [{ order: "asc" }] }),
  ]);
  const collections = rows.map((r) => ({
    id: r.id, slug: r.slug, title: r.title, description: r.description, image: r.image, published: r.published,
    productIds: jsonList<string>(r.productIds), mine: !demoId || r.demoSessionId === demoId,
  }));
  const slim = products.map((r) => {
    const p = mapProduct(r);
    return { id: p.id, name: p.name, category: p.category, price: p.price, image: p.images[0] ?? "", published: r.published, tags: p.tags };
  });
  return <CollectionsManager collections={collections} products={slim} demo={!!demoId} />;
}
