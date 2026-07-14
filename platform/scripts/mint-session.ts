import "dotenv/config";
import { SignJWT } from "jose";
import { db } from "../src/lib/db";

// Dev helper: mint a valid admin session cookie for the demo tenant so we can
// smoke-test authenticated admin pages over HTTP.
async function main() {
  const tenant = await db.tenant.findUnique({ where: { subdomain: "demo" } });
  if (!tenant) throw new Error("demo tenant missing — run the seed first");
  const user = await db.user.findFirst({ where: { tenantId: tenant.id } });
  if (!user) throw new Error("demo user missing");

  const secret = new TextEncoder().encode(process.env.AUTH_SECRET ?? "dev-secret-change-me");
  const token = await new SignJWT({
    userId: user.id,
    tenantId: tenant.id,
    email: user.email,
    role: user.role,
    name: user.name ?? tenant.name,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);

  console.log(token);
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
