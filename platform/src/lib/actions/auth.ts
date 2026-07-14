"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createSession, destroySession, verifyCredentials } from "@/lib/auth";

export type AuthState = { error: string };

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Enter your password"),
});

export async function loginAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const parsed = schema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const result = await verifyCredentials(parsed.data.email, parsed.data.password);
  if (!result) {
    return { error: "Invalid email or password." };
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
