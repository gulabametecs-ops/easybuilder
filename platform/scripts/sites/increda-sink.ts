// One-time setup of the Increda Sink client site (website + admin), visible in Super Admin → Clients.
//   npx tsx --env-file=.env scripts/sites/increda-sink.ts --email owner@example.com --password 'StrongPass123' [--subdomain incredasink]
// Safe to re-run: it refuses to touch an existing tenant with the same subdomain.
import { db } from "../../src/lib/db";
import { createTenantFromTemplate } from "../../src/lib/provision";
import { incredaSink, INCREDA_CATEGORY_PHOTO, INCREDA_PHOTOS as P } from "../../src/lib/templates/incredaSink";

const arg = (k: string) => { const i = process.argv.indexOf(`--${k}`); return i > 0 ? process.argv[i + 1] ?? "" : ""; };
const u = (id: string, w: number, h: number) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&h=${h}&q=80`;

(async () => {
  const email = arg("email").trim().toLowerCase();
  const password = arg("password");
  const subdomain = (arg("subdomain") || "incredasink").toLowerCase();
  if (!/^\S+@\S+\.\S+$/.test(email) || password.length < 8) {
    console.error("Usage: --email <owner email> --password <min 8 chars> [--subdomain incredasink]");
    process.exit(1);
  }
  if (!/^[a-z0-9-]{3,40}$/.test(subdomain)) throw new Error("Bad subdomain");
  if (await db.tenant.findUnique({ where: { subdomain } })) {
    console.error(`Tenant "${subdomain}" already exists — nothing changed.`);
    process.exit(1);
  }

  const tenant = await createTenantFromTemplate({
    businessName: "Increda Sink",
    subdomain,
    ownerEmail: email,
    ownerPassword: password,
    plan: "pro",
    vertical: "kitchen-sink-wholesale", // closest sector: admin menus, AI help, integrations recs
    template: incredaSink,
    subscriptionEndsAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
  });

  // Placeholder photos until the owner uploads real product photography (Admin → Services / Gallery).
  const services = await db.service.findMany({ where: { tenantId: tenant.id }, select: { id: true, category: true } });
  for (const s of services) {
    const id = INCREDA_CATEGORY_PHOTO[s.category];
    if (id) await db.service.update({ where: { id: s.id }, data: { image: u(id, 800, 600) } });
  }
  const galleryPhotos = [P.hero, P.chefKitchen, P.restaurant, P.welding, P.sparks, P.foodPlant];
  const gallery = await db.galleryItem.findMany({ where: { tenantId: tenant.id }, orderBy: { order: "asc" }, select: { id: true } });
  for (const [i, g] of gallery.entries()) {
    await db.galleryItem.update({ where: { id: g.id }, data: { image: u(galleryPhotos[i % galleryPhotos.length], 900, 900) } });
  }

  console.log(`Created Increda Sink: tenant ${tenant.id}`);
  console.log(`Website: https://${subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? "sitepixl.com"}`);
  console.log(`Admin:   https://${subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? "sitepixl.com"}/admin  (login: ${email})`);
  await db.$disconnect();
})().catch(async (e) => { console.error(e); await db.$disconnect(); process.exit(1); });
