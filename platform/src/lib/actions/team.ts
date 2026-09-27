"use server";

import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireRole } from "./guard";
import { sendEmail } from "@/lib/email";
import { ROOT_DOMAIN } from "@/lib/domains";

export type TeamState = { ok: boolean; message: string };

const ROLES = ["owner", "admin", "staff"] as const;

export async function inviteTeamMember(_prev: TeamState, formData: FormData): Promise<TeamState> {
  const { session, tenant } = await requireRole(["owner", "admin"]);

  const email = (formData.get("email")?.toString() ?? "").trim().toLowerCase();
  const name = (formData.get("name")?.toString() ?? "").trim();
  const role = (formData.get("role")?.toString() ?? "staff") as (typeof ROLES)[number];
  const password = formData.get("password")?.toString() ?? "";

  if (!z.string().email().safeParse(email).success) return { ok: false, message: "Enter a valid email." };
  if (!ROLES.includes(role)) return { ok: false, message: "Invalid role." };
  if (role === "owner" && session.role !== "owner") {
    return { ok: false, message: "Only the owner can create another owner." };
  }
  if (password.length < 6) return { ok: false, message: "Temporary password must be at least 6 characters." };

  const exists = await db.user.findUnique({
    where: { tenantId_email: { tenantId: tenant.id, email } },
  });
  if (exists) return { ok: false, message: "That email is already on the team." };

  await db.user.create({
    data: {
      tenantId: tenant.id,
      email,
      name: name || email.split("@")[0],
      role,
      password: await bcrypt.hash(password, 10),
    },
  });

  const proto = ROOT_DOMAIN.includes("localhost") ? "http" : "https";
  const loginUrl = `${proto}://${tenant.subdomain}.${ROOT_DOMAIN}/admin/login`;
  await sendEmail(
    email,
    `You've been added to ${tenant.name}`,
    `<p>Hi${name ? ` ${name}` : ""},</p>
     <p>You've been invited as <strong>${role}</strong> on <strong>${tenant.name}</strong>.</p>
     <p>Sign in at <a href="${loginUrl}">${loginUrl}</a></p>
     <p>Email: <strong>${email}</strong><br/>Temporary password: <strong>${password}</strong></p>
     <p>Please change your password after signing in.</p>`,
  ).catch(() => {});

  revalidatePath("/admin/settings");
  return { ok: true, message: `Invited ${email} as ${role}.` };
}

export async function updateTeamMemberRole(userId: string, role: string) {
  const { session, tenant } = await requireRole(["owner"]);
  if (!ROLES.includes(role as (typeof ROLES)[number])) throw new Error("Invalid role");
  if (userId === session.userId && role !== "owner") {
    throw new Error("You cannot demote yourself.");
  }
  const user = await db.user.findFirst({ where: { id: userId, tenantId: tenant.id } });
  if (!user) throw new Error("User not found");
  if (user.role === "owner" && role !== "owner") {
    const owners = await db.user.count({ where: { tenantId: tenant.id, role: "owner" } });
    if (owners <= 1) throw new Error("Keep at least one owner.");
  }
  await db.user.update({ where: { id: userId }, data: { role } });
  revalidatePath("/admin/settings");
}

export async function removeTeamMember(userId: string) {
  const { session, tenant } = await requireRole(["owner", "admin"]);
  if (userId === session.userId) throw new Error("You cannot remove yourself.");
  const user = await db.user.findFirst({ where: { id: userId, tenantId: tenant.id } });
  if (!user) throw new Error("User not found");
  if (user.role === "owner" && session.role !== "owner") {
    throw new Error("Only an owner can remove another owner.");
  }
  if (user.role === "owner") {
    const owners = await db.user.count({ where: { tenantId: tenant.id, role: "owner" } });
    if (owners <= 1) throw new Error("Keep at least one owner.");
  }
  await db.user.delete({ where: { id: userId } });
  revalidatePath("/admin/settings");
}
