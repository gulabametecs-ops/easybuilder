"use server";

import { cookies } from "next/headers";
import { z } from "zod";
import { db } from "@/lib/db";

const DEMO_COOKIE = "demo_unlocked";

export type UnlockState = { ok: boolean; message: string };

const schema = z.object({
  name: z.string().min(2, "Please enter your name"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().min(7, "Please enter a valid phone number"),
  company: z.string().min(2, "Please enter your business/company name"),
  vertical: z.string().optional().default(""),
});

// Gate: phone + company + email are compulsory before demos are revealed.
// Saves a PlatformLead (so the super admin sees who wanted a demo) and sets a
// cookie that unlocks the demo links.
export async function unlockDemoAccess(_prev: UnlockState, formData: FormData): Promise<UnlockState> {
  const parsed = schema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    company: formData.get("company"),
    vertical: formData.get("vertical") ?? "",
  });
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Please fill all required fields." };
  }

  await db.platformLead.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone,
      company: parsed.data.company,
      vertical: parsed.data.vertical ?? "",
      type: "demo",
    },
  });

  const store = await cookies();
  store.set(DEMO_COOKIE, "1", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  return { ok: true, message: "Unlocked! You can now explore all demos." };
}

export async function hasDemoAccess(): Promise<boolean> {
  const store = await cookies();
  return store.get(DEMO_COOKIE)?.value === "1";
}
