import { NextResponse } from "next/server";
import { getCurrentTenant } from "@/lib/tenant";

// Lightweight identity endpoint used by custom-domain verification.
// When a domain's DNS points at us, hitting https://<domain>/api/whoami returns
// the tenant that domain resolves to.
export async function GET() {
  const tenant = await getCurrentTenant();
  return NextResponse.json({ subdomain: tenant?.subdomain ?? null });
}
