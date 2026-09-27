"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { headers } from "next/headers";
import { createSuperSession, destroySuperSession, verifySuperCredentials } from "@/lib/superAuth";
import { rateLimit } from "@/lib/rateLimit";

export type SuperAuthState = { error: string };

const schema = z.object({ email: z.string().email(), password: z.string().min(1) });

export async function superLogin(_prev: SuperAuthState, formData: FormData): Promise<SuperAuthState> {
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  const email = formData.get("email")?.toString() ?? "";
  const rl = rateLimit(`superlogin:${ip}:${email.toLowerCase()}`, 6, 15 * 60_000);
  if (!rl.ok) return { error: `Too many attempts. Try again in ${rl.retryAfterSec}s.` };

  const parsed = schema.safeParse({ email: formData.get("email"), password: formData.get("password") });
  if (!parsed.success) return { error: "Enter email and password" };
  const user = await verifySuperCredentials(parsed.data.email, parsed.data.password);
  if (!user) return { error: "Invalid credentials" };
  await createSuperSession({ userId: user.id, email: user.email, name: user.name ?? "Admin" });
  redirect("/super");
}

export async function superLogout() {
  await destroySuperSession();
  redirect("/super/login");
}
