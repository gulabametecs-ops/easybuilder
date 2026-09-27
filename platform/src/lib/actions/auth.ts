"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { headers } from "next/headers";
import { createSession, destroySession, verifyCredentials } from "@/lib/auth";
import { rateLimit } from "@/lib/rateLimit";
import { db } from "@/lib/db";
import { getCurrentTenant } from "@/lib/tenant";
import {
  getActiveDemoSessionForTenant,
  isDemoSubdomain,
  setDemoCookie,
  getDemoTokenFromCookie,
  getDemoSessionByToken,
} from "@/lib/demoSession";

export type AuthState = { error: string };

const schema = z.object({
  email: z.string().min(1, "Enter your username or email"),
  password: z.string().min(1, "Enter your password"),
});

/** Demo sandbox: login with temporary username + password from OTP unlock. */
async function tryDemoTempLogin(usernameOrEmail: string, password: string) {
  const tenant = await getCurrentTenant();
  if (!tenant || !isDemoSubdomain(tenant.subdomain)) return null;

  const login = usernameOrEmail.toLowerCase().trim();
  let session = await getActiveDemoSessionForTenant(tenant);

  const matches = (s: { adminUsername: string; adminPassword: string; email: string }) =>
    s.adminPassword === password &&
    (s.adminUsername.toLowerCase() === login || s.email.toLowerCase() === login);

  if (!session || !matches(session)) {
    const candidates = await db.demoSession.findMany({
      where: { status: "active", adminPassword: password },
      orderBy: { createdAt: "desc" },
      take: 30,
    });
    const expectedVertical =
      (await import("@/lib/demoSession")).verticalForDemoSubdomain(tenant.subdomain) ?? tenant.vertical;
    session =
      candidates.find(
        (s) =>
          matches(s) &&
          s.vertical === expectedVertical &&
          s.expiresAt &&
          s.expiresAt.getTime() > Date.now(),
      ) ?? null;
  }

  if (!session || !matches(session)) return null;
  if (!session.expiresAt || session.expiresAt.getTime() <= Date.now()) return null;
  if (!session.adminUsername || !session.adminPassword) return null;

  const owner =
    (await db.user.findFirst({
      where: { tenantId: tenant.id, role: "owner" },
      orderBy: { createdAt: "asc" },
    })) ??
    (await db.user.findFirst({ where: { tenantId: tenant.id }, orderBy: { createdAt: "asc" } }));

  if (!owner) return null;

  const msLeft = session.expiresAt.getTime() - Date.now();
  await setDemoCookie(session.token, Math.ceil(msLeft / 1000));

  return {
    user: owner,
    tenant,
    name: session.name || owner.name || tenant.name,
  };
}

export async function loginAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "local";
  const email = formData.get("email")?.toString() ?? "";
  const rl = rateLimit(`login:${ip}:${email.toLowerCase()}`, 8, 15 * 60_000);
  if (!rl.ok) {
    return { error: `Too many login attempts. Try again in ${rl.retryAfterSec} seconds.` };
  }

  const parsed = schema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const demo = await tryDemoTempLogin(parsed.data.email, parsed.data.password);
  if (demo) {
    await createSession({
      userId: demo.user.id,
      tenantId: demo.tenant.id,
      email: demo.user.email,
      role: demo.user.role,
      name: demo.name,
      demo: true,
    });
    redirect("/admin");
  }

  // Real tenant login (email only)
  if (!parsed.data.email.includes("@")) {
    return { error: "Invalid email or password." };
  }

  const result = await verifyCredentials(parsed.data.email, parsed.data.password);
  if (!result) {
    return { error: "Invalid email or password." };
  }

  if (isDemoSubdomain(result.tenant.subdomain)) {
    const token = await getDemoTokenFromCookie();
    const sess = await getDemoSessionByToken(token);
    if (!sess || sess.status !== "active" || !sess.expiresAt || sess.expiresAt.getTime() <= Date.now()) {
      return { error: "Use the temporary username & password shown on this page (from your verified demo)." };
    }
  }

  if (result.tenant.status === "suspended") {
    return { error: "This account is suspended. Contact support." };
  }

  await createSession({
    userId: result.user.id,
    tenantId: result.tenant.id,
    email: result.user.email,
    role: result.user.role,
    name: result.user.name ?? result.tenant.name,
  });

  redirect("/admin");
}

export async function logoutAction() {
  await destroySession();
  redirect("/admin/login");
}
