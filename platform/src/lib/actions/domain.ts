"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireTenantId } from "./guard";

export type DomainState = { ok: boolean; message: string };

// Normalise user input into a bare hostname (strip protocol, path, www, port).
function normalizeDomain(input: string): string {
  let d = input.trim().toLowerCase();
  d = d.replace(/^https?:\/\//, "").replace(/\/.*$/, "").replace(/:\d+$/, "");
  if (d.startsWith("www.")) d = d.slice(4);
  return d;
}

const DOMAIN_RE = /^([a-z0-9](-?[a-z0-9])*\.)+[a-z]{2,}$/;

export async function saveCustomDomain(_prev: DomainState, formData: FormData): Promise<DomainState> {
  const tenantId = await requireTenantId();
  const domain = normalizeDomain(formData.get("domain")?.toString() ?? "");
  if (!domain) return { ok: false, message: "Enter your domain, e.g. www.mybusiness.com" };
  if (!DOMAIN_RE.test(domain)) return { ok: false, message: "That doesn't look like a valid domain." };

  // Uniqueness — not claimed by another tenant.
  const clash = await db.tenant.findFirst({ where: { customDomain: domain, NOT: { id: tenantId } } });
  if (clash) return { ok: false, message: "This domain is already connected to another account." };

  await db.tenant.update({ where: { id: tenantId }, data: { customDomain: domain, domainStatus: "pending" } });
  revalidatePath("/admin/settings");
  return { ok: true, message: "Domain saved. Now add the DNS records below, then click “Verify connection”." };
}

export async function removeCustomDomain(): Promise<void> {
  const tenantId = await requireTenantId();
  await db.tenant.update({ where: { id: tenantId }, data: { customDomain: null, domainStatus: "none" } });
  revalidatePath("/admin/settings");
}

// Checks that the domain's DNS actually points at us by hitting /api/whoami on it
// and confirming it resolves to THIS tenant.
export async function verifyCustomDomain(_prev: DomainState, _formData: FormData): Promise<DomainState> {
  const tenantId = await requireTenantId();
  const tenant = await db.tenant.findUnique({ where: { id: tenantId } });
  if (!tenant?.customDomain) return { ok: false, message: "No domain saved yet." };

  try {
    const res = await fetch(`https://${tenant.customDomain}/api/whoami`, { cache: "no-store", signal: AbortSignal.timeout(8000) });
    const data = (await res.json()) as { subdomain?: string };
    if (data.subdomain === tenant.subdomain) {
      await db.tenant.update({ where: { id: tenantId }, data: { domainStatus: "connected" } });
      revalidatePath("/admin/settings");
      return { ok: true, message: "🎉 Domain connected! Your website is now live on " + tenant.customDomain };
    }
    return { ok: false, message: "Domain is reachable but not pointing here yet. DNS can take up to 24 hours — try again later." };
  } catch {
    return { ok: false, message: "Couldn't reach the domain yet. Make sure the DNS records are added; changes can take a few hours." };
  }
}
