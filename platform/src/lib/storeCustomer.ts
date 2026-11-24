import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { db } from "./db";
import { authSecret } from "./secret";
import { getCurrentTenant } from "./tenant";
import { jsonList } from "./store";

// Shopper accounts on a store site (email OTP). Separate cookie + secret from the admin session;
// the cookie is host-only, so it's naturally scoped to the tenant's own domain.

export const CUSTOMER_COOKIE = "store_customer";
const secret = () => authSecret("-store-customer");
const MAX_AGE = 60 * 60 * 24 * 30;

export type CustomerAddress = { id: string; name: string; phone: string; line1: string; line2: string; city: string; state: string; pincode: string; isDefault: boolean };

export async function setCustomerSession(customerId: string, tenantId: string) {
  const token = await new SignJWT({ cid: customerId, tid: tenantId }).setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime("30d").sign(secret());
  (await cookies()).set(CUSTOMER_COOKIE, token, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: MAX_AGE });
}

export async function clearCustomerSession() {
  (await cookies()).delete(CUSTOMER_COOKIE);
}

/** The signed-in shopper for the current store host, or null (bad/expired cookie, other tenant, deleted). */
export async function getStoreCustomer() {
  const token = (await cookies()).get(CUSTOMER_COOKIE)?.value;
  if (!token) return null;
  let payload: { cid?: string; tid?: string };
  try {
    payload = (await jwtVerify(token, secret())).payload as typeof payload;
  } catch {
    return null;
  }
  const tenant = await getCurrentTenant();
  if (!tenant || payload.tid !== tenant.id || !payload.cid) return null;
  const c = await db.storeCustomer.findFirst({ where: { id: payload.cid, tenantId: tenant.id } });
  if (!c) return null;
  return {
    id: c.id, tenantId: c.tenantId, email: c.email, name: c.name, phone: c.phone, marketingOptIn: c.marketingOptIn, blocked: c.blocked,
    demoSessionId: c.demoSessionId,
    addresses: jsonList<CustomerAddress>(c.addresses),
    wishlist: jsonList<string>(c.wishlist).filter((x) => typeof x === "string"),
  };
}
export type StoreCustomerView = NonNullable<Awaited<ReturnType<typeof getStoreCustomer>>>;
