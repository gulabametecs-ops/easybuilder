import "dotenv/config";
import bcrypt from "bcryptjs";
import { db } from "../src/lib/db";
import { createTenantFromTemplate } from "../src/lib/provision";

// Seeds a demo tenant used for the public live-demo (demo.<yourdomain>) and for
// local testing. Re-running wipes and recreates the demo tenant only.
async function main() {
  // Super admin (platform owner) account — idempotent.
  const superEmail = "super@platform.test";
  await db.platformUser.upsert({
    where: { email: superEmail },
    update: {},
    create: { email: superEmail, password: await bcrypt.hash("super1234", 10), name: "Platform Owner" },
  });
  console.log(`✅ Super admin: ${superEmail} / super1234  → http://localhost:3000/super`);

  // One demo tenant per live vertical.
  const demos = [
    { subdomain: "demo", vertical: "home-services", name: "Standard Services", email: "demo@standard.test" },
    { subdomain: "demo-edu", vertical: "education-consultancy", name: "Bright Future Consultants", email: "demo@edu.test" },
    { subdomain: "demo-restaurant", vertical: "restaurant-hotel", name: "Spice Garden", email: "demo@restaurant.test" },
    { subdomain: "demo-hospital", vertical: "hospital-clinic", name: "CityCare Clinic", email: "demo@hospital.test" },
    { subdomain: "demo-school", vertical: "school-coaching", name: "Genius Coaching Academy", email: "demo@school.test" },
    { subdomain: "demo-wholesale", vertical: "wholesale-shop", name: "MegaMart Wholesale", email: "demo@wholesale.test" },
    { subdomain: "demo-mfg", vertical: "manufacturing", name: "PrecisionTech Industries", email: "demo@mfg.test" },
    { subdomain: "demo-skill", vertical: "skill-learning", name: "TalentHub Academy", email: "demo@skill.test" },
  ];

  for (const d of demos) {
    const existing = await db.tenant.findUnique({ where: { subdomain: d.subdomain } });
    if (existing) await db.tenant.delete({ where: { id: existing.id } });
    await createTenantFromTemplate({
      businessName: d.name,
      subdomain: d.subdomain,
      ownerEmail: d.email,
      ownerPassword: "demo1234",
      plan: "pro",
      vertical: d.vertical,
    });
    console.log(`✅ ${d.vertical}: http://${d.subdomain}.localhost:3000  (admin: ${d.email} / demo1234)`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
