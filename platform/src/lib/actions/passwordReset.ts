"use server";

import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { getCurrentTenant } from "@/lib/tenant";
import { sendEmail } from "@/lib/email";
import { rateLimit } from "@/lib/rateLimit";
import { ROOT_DOMAIN } from "@/lib/domains";
import { authSecret } from "@/lib/secret";

const resetSecret = () => authSecret("-password-reset");

export type ResetState = { ok: boolean; message: string };

async function signResetToken(payload: { userId: string; tenantId: string; email: string }) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(resetSecret());
}

async function verifyResetToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, resetSecret());
    return payload as { userId: string; tenantId: string; email: string };
  } catch {
    return null;
  }
}

export async function requestPasswordReset(_prev: ResetState, formData: FormData): Promise<ResetState> {
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  const rl = rateLimit(`pwreset:${ip}`, 5, 15 * 60_000);
  if (!rl.ok) return { ok: false, message: `Too many requests. Try again in ${rl.retryAfterSec}s.` };

  const email = (formData.get("email")?.toString() ?? "").trim().toLowerCase();
  if (!email || !email.includes("@")) return { ok: false, message: "Enter a valid email." };

  const tenant = await getCurrentTenant();
  if (!tenant) return { ok: false, message: "Site not found." };

  // Always return the same message to avoid email enumeration.
  const generic = { ok: true, message: "If that email exists, we sent a reset link. Check your inbox." };

  const user = await db.user.findUnique({
    where: { tenantId_email: { tenantId: tenant.id, email } },
  });
  if (!user) return generic;

  const token = await signResetToken({ userId: user.id, tenantId: tenant.id, email: user.email });
  const proto = ROOT_DOMAIN.includes("localhost") ? "http" : "https";
  const host = h.get("host") || `${tenant.subdomain}.${ROOT_DOMAIN}`;
  const link = `${proto}://${host}/admin/reset-password?token=${encodeURIComponent(token)}`;

  await sendEmail(
    user.email,
    "Reset your admin password",
    `<p>Hi${user.name ? ` ${user.name}` : ""},</p>
     <p>Click the link below to reset your password for <strong>${tenant.name}</strong>. This link expires in 1 hour.</p>
     <p><a href="${link}">${link}</a></p>
     <p>If you didn't request this, you can ignore this email.</p>`,
  );

  return generic;
}

export async function resetPasswordWithToken(_prev: ResetState, formData: FormData): Promise<ResetState> {
  const token = formData.get("token")?.toString() ?? "";
  const password = formData.get("password")?.toString() ?? "";
  const confirm = formData.get("confirm")?.toString() ?? "";

  if (password.length < 6) return { ok: false, message: "Password must be at least 6 characters." };
  if (password !== confirm) return { ok: false, message: "Passwords do not match." };

  const payload = await verifyResetToken(token);
  if (!payload) return { ok: false, message: "This reset link is invalid or has expired." };

  const tenant = await getCurrentTenant();
  if (!tenant || tenant.id !== payload.tenantId) {
    return { ok: false, message: "Reset link does not match this site." };
  }

  const user = await db.user.findFirst({
    where: { id: payload.userId, tenantId: payload.tenantId, email: payload.email },
  });
  if (!user) return { ok: false, message: "User not found." };

  await db.user.update({
    where: { id: user.id },
    data: { password: await bcrypt.hash(password, 10) },
  });

  return { ok: true, message: "Password updated. You can sign in now." };
}
