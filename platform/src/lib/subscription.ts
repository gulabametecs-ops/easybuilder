// Subscription status helpers — used by site + admin layouts to enforce expiry.

export type TenantAccess = {
  allowed: boolean;
  reason: "ok" | "suspended" | "expired" | "cancelled";
  expired: boolean;
};

export function checkTenantAccess(tenant: {
  status: string;
  subscriptionEndsAt: Date | null;
}): TenantAccess {
  if (tenant.status === "suspended") {
    return { allowed: false, reason: "suspended", expired: false };
  }
  if (tenant.status === "cancelled") {
    return { allowed: false, reason: "cancelled", expired: false };
  }
  const ends = tenant.subscriptionEndsAt ? new Date(tenant.subscriptionEndsAt) : null;
  if (ends && ends.getTime() < Date.now()) {
    return { allowed: false, reason: "expired", expired: true };
  }
  return { allowed: true, reason: "ok", expired: false };
}

/** Grace period (days) after expiry during which admin can still log in to renew. */
export const ADMIN_GRACE_DAYS = 14;

export function checkAdminAccess(tenant: {
  status: string;
  subscriptionEndsAt: Date | null;
}): TenantAccess & { grace: boolean } {
  if (tenant.status === "suspended") {
    return { allowed: false, reason: "suspended", expired: false, grace: false };
  }
  if (tenant.status === "cancelled") {
    return { allowed: false, reason: "cancelled", expired: false, grace: false };
  }
  const ends = tenant.subscriptionEndsAt ? new Date(tenant.subscriptionEndsAt) : null;
  if (ends && ends.getTime() < Date.now()) {
    const graceEnds = ends.getTime() + ADMIN_GRACE_DAYS * 24 * 3600 * 1000;
    if (Date.now() <= graceEnds) {
      return { allowed: true, reason: "expired", expired: true, grace: true };
    }
    return { allowed: false, reason: "expired", expired: true, grace: false };
  }
  return { allowed: true, reason: "ok", expired: false, grace: false };
}
