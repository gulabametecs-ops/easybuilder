import { NextResponse } from "next/server";
import { consumeImpersonationToken, signSession, SESSION_COOKIE, sessionCookieOpts } from "@/lib/auth";
import { getCurrentTenant } from "@/lib/tenant";

// Consumes a super-admin impersonation token (issued on the root domain) and
// starts an admin session on this tenant's host, then opens the admin panel.
//
// NOTE: we build redirect URLs from the Host header, NOT request.url — Next
// normalizes request.url to the internal `localhost` origin, which would drop
// the tenant subdomain and break the cross-host session.
export async function GET(request: Request) {
  const host = request.headers.get("host") ?? "";
  const proto = host.includes("localhost") ? "http" : "https";
  const base = `${proto}://${host}`;

  const token = new URL(request.url).searchParams.get("t") ?? "";
  const session = await consumeImpersonationToken(token);
  const tenant = await getCurrentTenant();

  if (!session || !tenant || session.tenantId !== tenant.id) {
    return NextResponse.redirect(`${base}/admin/login`);
  }

  const res = NextResponse.redirect(`${base}/admin`);
  res.cookies.set(SESSION_COOKIE, await signSession(session), sessionCookieOpts);
  return res;
}
