import { getAuthedSession } from "@/lib/auth";

// Every admin server action calls this first. It guarantees there's a valid
// session that belongs to the tenant of the current host, and returns the
// tenant id to scope all queries. Defense-in-depth against cross-tenant writes.
export async function requireTenantId(): Promise<string> {
  const authed = await getAuthedSession();
  if (!authed) throw new Error("Unauthorized");
  return authed.tenant.id;
}
