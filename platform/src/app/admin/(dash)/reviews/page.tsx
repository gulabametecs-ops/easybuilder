import { getAuthedSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { getDemoSessionId } from "@/lib/actions/guard";
import { demoVisibleWhere } from "@/lib/demoSession";
import { jsonList } from "@/lib/store";
import { ReviewsManager } from "@/components/admin/store/ReviewsManager";

export const metadata = { title: "Reviews" };

export default async function ReviewsPage() {
  const authed = await getAuthedSession();
  if (!authed) return null;
  const demoId = await getDemoSessionId();
  const rows = await db.productReview.findMany({
    where: demoVisibleWhere(authed.tenant.id, demoId),
    orderBy: { createdAt: "desc" },
    take: 1000,
    include: { product: { select: { name: true, slug: true, images: true } } },
  });
  const reviews = rows.map((r) => ({
    id: r.id, name: r.name, rating: r.rating, title: r.title, body: r.body, status: r.status, verified: r.verified, createdAt: r.createdAt.toISOString(),
    product: { name: r.product.name, slug: r.product.slug, image: jsonList<string>(r.product.images)[0] ?? "" },
    mine: !demoId || r.demoSessionId === demoId,
  }));
  return <ReviewsManager reviews={reviews} demo={!!demoId} />;
}
