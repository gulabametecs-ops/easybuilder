import { getCurrentTenant } from "@/lib/tenant";
import { indexNowKey } from "@/lib/indexnow";

// Serves the tenant's IndexNow key (referenced as keyLocation when submitting).
export async function GET() {
  const tenant = await getCurrentTenant();
  if (!tenant) return new Response("", { status: 404 });
  return new Response(indexNowKey(tenant.id), { headers: { "content-type": "text/plain; charset=utf-8" } });
}
