import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSuperSession } from "@/lib/superAuth";
import { createImpersonationToken } from "@/lib/auth";
import { ROOT_DOMAIN } from "@/lib/domains";

// Super-admin "login as client": issues a short-lived token and redirects to the
// client's subdomain, where /admin/impersonate exchanges it for a session.
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await getSuperSession())) return NextResponse.redirect(new URL("/super/login", request.url));
  const { id } = await params;

  const tenant = await db.tenant.findUnique({ where: { id } });
  if (!tenant) return NextResponse.redirect(new URL("/super/clients", request.url));
  const user = (await db.user.findFirst({ where: { tenantId: id, role: "owner" } })) ?? (await db.user.findFirst({ where: { tenantId: id } }));
  if (!user) return NextResponse.redirect(new URL("/super/clients", request.url));

  const token = await createImpersonationToken({ userId: user.id, tenantId: id, email: user.email, role: user.role, name: user.name ?? tenant.name });
  const proto = ROOT_DOMAIN.includes("localhost") ? "http" : "https";
  return NextResponse.redirect(`${proto}://${tenant.subdomain}.${ROOT_DOMAIN}/admin/impersonate?t=${token}`);
}
