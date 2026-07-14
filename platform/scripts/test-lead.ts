import "dotenv/config";
import { db } from "../src/lib/db";

async function main() {
  const tenant = await db.tenant.findUnique({ where: { subdomain: "demo" } });
  if (!tenant) throw new Error("no demo tenant");
  await db.lead.create({
    data: { tenantId: tenant.id, name: "Test Customer", phone: "9999988888", service: "Plumbing", message: "Tap leaking in kitchen", location: "Gachibowli" },
  });
  await db.appointment.create({
    data: { tenantId: tenant.id, name: "Appt Customer", phone: "9888877777", service: "Electrical", date: "2026-07-20", time: "10:00" },
  });
  console.log("inserted 1 lead + 1 appointment for demo tenant");
}
main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
