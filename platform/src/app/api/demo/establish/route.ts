import { NextResponse } from "next/server";
import {
  DEMO_COOKIE,
  demoCookieOptions,
  getDemoSessionByToken,
} from "@/lib/demoSession";
import { ROOT_DOMAIN } from "@/lib/domains";

/** Establish demo cookie on the demo subdomain from a one-time token in the URL. */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const token = url.searchParams.get("dt");
  const root = ROOT_DOMAIN;
  const marketingProto = root.includes("localhost") ? "http" : "https";
  const marketingBase = `${marketingProto}://${root.includes("localhost") ? "localhost:3000" : root}`;

  if (!token) return NextResponse.json({ error: "missing token" }, { status: 400 });

  const session = await getDemoSessionByToken(token);
  if (!session || session.status !== "active" || !session.expiresAt) {
    return NextResponse.redirect(`${marketingBase}/demos?expired=1`);
  }

  const msLeft = session.expiresAt.getTime() - Date.now();
  if (msLeft <= 0) {
    return NextResponse.redirect(
      `${marketingBase}/demos?expired=1&vertical=${encodeURIComponent(session.vertical)}`,
    );
  }

  // Prefer Host header — Next's request.url origin is often the internal
  // localhost, which would bounce the visitor off the demo subdomain.
  const host = request.headers.get("x-forwarded-host") || request.headers.get("host") || url.host;
  const proto =
    request.headers.get("x-forwarded-proto") ||
    (host.includes("localhost") ? "http" : "https");
  // Same-site paths only — never let `to` send visitors to another domain.
  const to = url.searchParams.get("to") || "/";
  const dest = to.startsWith("/") && !to.startsWith("//") && !to.startsWith("/\\") ? to : "/";
  const clean = new URL(dest, `${proto}://${host}`);
  // Carry a design preview through to the site (the proxy turns it into a cookie).
  const design = url.searchParams.get("design");
  if (design) clean.searchParams.set("design", design);
  // Keep `dt` so proxy can re-set the cookie if this Set-Cookie is dropped.

  const res = NextResponse.redirect(clean);
  res.cookies.set(DEMO_COOKIE, token, demoCookieOptions(Math.ceil(msLeft / 1000)));
  return res;
}
