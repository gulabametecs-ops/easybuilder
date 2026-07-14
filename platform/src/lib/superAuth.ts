import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { db } from "./db";

const COOKIE = "super_session";
const secret = new TextEncoder().encode((process.env.AUTH_SECRET ?? "dev-secret") + "-super");

export type SuperSession = { userId: string; email: string; name: string };

export async function createSuperSession(s: SuperSession) {
  const token = await new SignJWT(s).setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime("7d").sign(secret);
  const store = await cookies();
  store.set(COOKIE, token, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 24 * 7 });
}

export async function destroySuperSession() {
  (await cookies()).delete(COOKIE);
}

export async function getSuperSession(): Promise<SuperSession | null> {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as unknown as SuperSession;
  } catch {
    return null;
  }
}

export async function verifySuperCredentials(email: string, password: string) {
  const bcrypt = (await import("bcryptjs")).default;
  const user = await db.platformUser.findUnique({ where: { email: email.toLowerCase() } });
  if (!user) return null;
  if (!(await bcrypt.compare(password, user.password))) return null;
  return user;
}
