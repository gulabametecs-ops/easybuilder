import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { parseHost, TENANT_HEADER, TENANT_KIND_HEADER } from "@/lib/domains";

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

  if (info.kind === "marketing") {
    return NextResponse.next();
  }

  // Tenant request — forward the tenant identity via headers.
  const headers = new Headers(request.headers);
  headers.set(TENANT_HEADER, info.key);
  headers.set(TENANT_KIND_HEADER, info.kind);

  const path = url.pathname;

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
