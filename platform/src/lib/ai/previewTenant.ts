import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { createTenantFromTemplate } from "@/lib/provision";
import { applyBlueprint } from "./applyBlueprint";
import { inferVerticalId } from "./enrichBlueprint";
import type { WebsiteBlueprint } from "./blueprintSchema";
import { createImpersonationToken } from "@/lib/auth";

const TTL_MS = 2 * 60 * 60 * 1000;

/** Fixed sandbox login for AI live preview tenants. */
export const AI_PREVIEW_PASSWORD = "preview1234";

export function aiPreviewEmail(key: string) {
  return `preview@${key}.ai.test`;
}

export async function ensureAiPreviewTenant(key: string, blueprint: WebsiteBlueprint) {
  const vertical = inferVerticalId(blueprint, blueprint.website.description ?? "");
  const ends = new Date(Date.now() + TTL_MS);
  const email = aiPreviewEmail(key);
  const passwordHash = await bcrypt.hash(AI_PREVIEW_PASSWORD, 10);
  const existing = await db.tenant.findUnique({ where: { subdomain: key } });

  let tenantId: string;
  if (!existing) {
    const created = await createTenantFromTemplate({
      businessName: blueprint.website.name,
      subdomain: key,
      ownerEmail: email,
      ownerPasswordHash: passwordHash,
      plan: "professional",
      status: "trial",
      vertical,
      subscriptionEndsAt: ends,
    });
    tenantId = created.id;
  } else {
    const isPreview = await db.user.findFirst({ where: { tenantId: existing.id, role: "owner", email } });
    if (!isPreview) throw new Error("Preview key unavailable.");
    tenantId = existing.id;
    await db.tenant.update({
      where: { id: tenantId },
      data: {
        name: blueprint.website.name,
        vertical,
        status: "trial",
        subscriptionEndsAt: ends,
      },
    });
    const owner = await db.user.findFirst({
      where: { tenantId, role: "owner" },
      orderBy: { createdAt: "asc" },
    });
    if (owner) {
      await db.user.update({
        where: { id: owner.id },
        data: { email, password: passwordHash, name: blueprint.website.name },
      });
    }
  }

  await applyBlueprint({ tenantId, blueprint, mode: "overwrite" });
  await db.tenant.update({
    where: { id: tenantId },
    data: { name: blueprint.website.name },
  });

  const user =
    (await db.user.findFirst({
      where: { tenantId, role: "owner" },
      orderBy: { createdAt: "asc" },
    })) ?? (await db.user.findFirst({ where: { tenantId }, orderBy: { createdAt: "asc" } }));

  if (!user) throw new Error("Preview admin user missing");

  const impersonateToken = await createImpersonationToken({
    userId: user.id,
    tenantId,
    email: user.email,
    role: user.role,
    name: user.name ?? blueprint.website.name,
  });

  return { tenantId, impersonateToken };
}
