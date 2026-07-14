import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { db } from "./db";
import { getCurrentTenant } from "./tenant";

export const SESSION_COOKIE = "admin_session";
const COOKIE = SESSION_COOKIE;
const secret = new TextEncoder().encode(
  process.env.AUTH_SECRET ?? "dev-secret-change-me",
);
// Distinct secret for short-lived impersonation hand-off tokens.
const impSecret = new TextEncoder().encode((process.env.AUTH_SECRET ?? "dev-secret-change-me") + "-impersonate");

export type Session = {
  userId: string;
  tenantId: string;
  email: string;
  role: string;
  name: string;
};

export const sessionCookieOpts = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: 60 * 60 * 24 * 7,
};

export async function signSession(session: Session): Promise<string> {
  return new SignJWT(session).setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime("7d").sign(secret);
}

// Signs a session JWT and stores it as an httpOnly cookie. Because each tenant
// lives on its own host, the cookie is naturally isolated per tenant.
export async function createSession(session: Session) {
  const token = await signSession(session);
  const store = await cookies();
  store.set(COOKIE, token, sessionCookieOpts);
}

// Short-lived token used to hand off a super-admin "login as client" across
// hosts (super admin lives on the root domain, tenant admin on the subdomain).
export async function createImpersonationToken(session: Session): Promise<string> {
  return new SignJWT(session).setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime("2m").sign(impSecret);
}
export async function consumeImpersonationToken(token: string): Promise<Session | null> {
  try {
    const { payload } = await jwtVerify(token, impSecret);
    return payload as unknown as Session;
  } catch {
    return null;
  }
}

export async function destroySession() {
  const store = await cookies();
  store.delete(COOKIE);
}

// Reads + verifies the session cookie (or null).
export async function getSession(): Promise<Session | null> {
  const store = await cookies();
  const token = store.get(COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as unknown as Session;
  } catch {
    return null;
  }
}

// Returns the session ONLY if it belongs to the tenant of the current host.
// This is the guard used by the admin layout.
export async function getAuthedSession(): Promise<
  { session: Session; tenant: NonNullable<Awaited<ReturnType<typeof getCurrentTenant>>> } | null
> {
  const tenant = await getCurrentTenant();
  if (!tenant) return null;
  const session = await getSession();
  if (!session || session.tenantId !== tenant.id) return null;
  return { session, tenant };
}

// Verifies email + password against the current tenant's users.
export async function verifyCredentials(email: string, password: string) {
  const bcrypt = (await import("bcryptjs")).default;
  const tenant = await getCurrentTenant();
  if (!tenant) return null;
  const user = await db.user.findUnique({
    where: { tenantId_email: { tenantId: tenant.id, email: email.toLowerCase() } },
  });
  if (!user) return null;
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return null;
  return { user, tenant };
}
