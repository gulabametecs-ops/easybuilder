import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { parseHost, TENANT_HEADER, TENANT_KIND_HEADER } from "@/lib/domains";

const DEMO_COOKIE = "demo_session";
const DESIGN_COOKIE = "site_design";

// Multi-tenant router (Next.js 16 "proxy", formerly middleware).
//
// - Marketing host (root domain / www)  -> served as-is from app/(marketing)
// - Tenant host (subdomain / custom)    -> rewritten so file routes don't collide:
//       /admin/**  ->  /_admin/**   (client admin panel, tenant-scoped)
//       /**        ->  /_site/**    (public tenant website renderer)
//   The resolved tenant key is passed downstream via request headers.
export function proxy(request: NextRequest) {
  const url = request.nextUrl;
  const info = parseHost(request.headers.get("host"));
  const path = url.pathname;

  if (info.kind === "marketing") {
    return NextResponse.next();
  }

  // Tenant request — forward the tenant identity via headers.
  const headers = new Headers(request.headers);
  headers.set(TENANT_HEADER, info.key);
  headers.set(TENANT_KIND_HEADER, info.kind);

  const dt = url.searchParams.get("dt");

  // If demo token is in the URL: ensure cookie exists, then strip dt from the URL.
  if (dt && !path.startsWith("/api/")) {
    const hasCookie = !!request.cookies.get(DEMO_COOKIE)?.value;
    const clean = url.clone();
    clean.searchParams.delete("dt");
    const res = NextResponse.redirect(clean);
    if (!hasCookie) {
      res.cookies.set(DEMO_COOKIE, dt, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 10,
      });
    }
    return res;
  }

  // Design preview (?design=modern): remember it in a cookie and drop the param.
  // Only demo tenants honour it (see lib/designs + site layout/page).
  const design = url.searchParams.get("design");
  if (design !== null && !path.startsWith("/api/")) {
    const clean = url.clone();
    clean.searchParams.delete("design");
    const res = NextResponse.redirect(clean);
    res.cookies.set(DESIGN_COOKIE, /^[a-z]{1,20}$/.test(design) ? design : "", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 2,
    });
    return res;
  }

  // Marketing-only routes must not be rewritten to tenant /site/*
  if (path === "/ai-preview" || path.startsWith("/ai-preview/") || path.startsWith("/ai-live/")) {
    return NextResponse.next();
  }

  // Admin panel, API routes, server actions, and already-rewritten paths:
  // keep the path, just forward tenant headers.
  if (
    path === "/admin" ||
    path.startsWith("/admin/") ||
    path.startsWith("/api/") ||
    path.startsWith("/site")
  ) {
    return NextResponse.next({ request: { headers } });
  }

  // Public tenant pages -> rewrite into the /site route tree so they don't
  // collide with the marketing routes at the root path space.
  const rewritten = url.clone();
  rewritten.pathname = `/site${path === "/" ? "" : path}`;
  return NextResponse.rewrite(rewritten, { request: { headers } });
}

export const config = {
  // Run on everything except static assets and Next internals.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
