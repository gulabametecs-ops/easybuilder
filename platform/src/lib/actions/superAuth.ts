"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createSuperSession, destroySuperSession, verifySuperCredentials } from "@/lib/superAuth";

export type SuperAuthState = { error: string };

const schema = z.object({ email: z.string().email(), password: z.string().min(1) });

export async function superLogin(_prev: SuperAuthState, formData: FormData): Promise<SuperAuthState> {
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
