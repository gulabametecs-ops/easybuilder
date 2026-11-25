// Increda Sink client site (website + admin), visible in Super Admin → Clients.
// Create (one time):
//   npx tsx --env-file=.env scripts/sites/increda-sink.ts --email owner@example.com --password 'StrongPass123' [--subdomain incredasink]
// Update an existing site to the latest template (pages, header, footer, photos, contact number):
//   npx tsx --env-file=.env scripts/sites/increda-sink.ts --refresh [--subdomain incredasink]
//   Add --reset-options to also overwrite every product's options with the template defaults.
//   ⚠ --refresh replaces page sections with the template's (Pages editor edits are lost);
//     products/services, their specs, leads, gallery uploads and logins are kept.
import { db } from "../../src/lib/db";
import { createTenantFromTemplate } from "../../src/lib/provision";
import { isPlaceholderSrc } from "../../src/lib/img";
import { incredaSink, incredaOptions, INCREDA_CATEGORY_PHOTO, INCREDA_PHOTOS as P } from "../../src/lib/templates/incredaSink";

const arg = (k: string) => { const i = process.argv.indexOf(`--${k}`); return i > 0 ? process.argv[i + 1] ?? "" : ""; };
const u = (id: string, w: number, h: number) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&h=${h}&q=80`;
const BIZ = "Increda Sink";

/** Fill empty product and gallery photos (never overwrites an uploaded one). */
async function fillPhotos(tenantId: string) {
  const services = await db.service.findMany({ where: { tenantId }, select: { id: true, category: true, title: true, image: true, options: true } });
  for (const s of services) {
    // Give products their variety options unless the owner already set some.
    if (!s.options || s.options === "[]" || process.argv.includes("--reset-options")) {
      await db.service.update({ where: { id: s.id }, data: { options: JSON.stringify(incredaOptions(s.category, s.title)) } });
    }
    const id = INCREDA_CATEGORY_PHOTO[s.category];
    if (id && (!s.image || isPlaceholderSrc(s.image))) {
      await db.service.update({ where: { id: s.id }, data: { image: u(id, 800, 600) } });
    }
  }
  const galleryPhotos = [P.hero, P.chefKitchen, P.restaurant, P.welding, P.sparks, P.foodPlant];
  const gallery = await db.galleryItem.findMany({ where: { tenantId }, orderBy: { order: "asc" }, select: { id: true, image: true } });
  for (const [i, g] of gallery.entries()) {
    if (!g.image || isPlaceholderSrc(g.image)) {
      await db.galleryItem.update({ where: { id: g.id }, data: { image: u(galleryPhotos[i % galleryPhotos.length], 900, 900) } });
    }
  }
}

async function refresh(tenantId: string) {
  const tpl = incredaSink;
  await db.siteConfig.update({
    where: { tenantId },
    data: {
      theme: JSON.stringify(tpl.theme),
      header: JSON.stringify(tpl.header(BIZ)),
      footer: JSON.stringify(tpl.footer(BIZ)),
      seo: JSON.stringify(tpl.seo(BIZ)),
    },
  });
  for (const page of tpl.pages(BIZ)) {
    const existing = await db.page.findFirst({ where: { tenantId, slug: page.slug } });
    const pageId = existing
      ? existing.id
      : (await db.page.create({ data: { tenantId, slug: page.slug, title: page.title, isSystem: page.isSystem, order: page.order, showInNav: page.showInNav !== false } })).id;
    await db.$transaction([
      db.section.deleteMany({ where: { pageId } }),
      db.section.createMany({
        data: page.sections.map((sec, i) => ({ pageId, type: sec.type, order: i, content: JSON.stringify(sec.content), style: JSON.stringify(sec.style ?? {}) })),
      }),
    ]);
  }
  await fillPhotos(tenantId);
}

(async () => {
  const subdomain = (arg("subdomain") || "incredasink").toLowerCase();
  if (!/^[a-z0-9-]{3,40}$/.test(subdomain)) throw new Error("Bad subdomain");
  const existing = await db.tenant.findUnique({ where: { subdomain } });

  if (process.argv.includes("--refresh")) {
    if (!existing) throw new Error(`No tenant "${subdomain}" to refresh — create it first.`);
    await refresh(existing.id);
    console.log(`Refreshed Increda Sink site (${subdomain}).`);
    await db.$disconnect();
    return;
  }

  const email = arg("email").trim().toLowerCase();
  const password = arg("password");
  if (!/^\S+@\S+\.\S+$/.test(email) || password.length < 8) {
    console.error("Usage: --email <owner email> --password <min 8 chars> [--subdomain incredasink]   (or --refresh)");
    process.exit(1);
  }
  if (existing) {
    console.error(`Tenant "${subdomain}" already exists — nothing changed. Use --refresh to update its pages.`);
    process.exit(1);
  }

  const tenant = await createTenantFromTemplate({
    businessName: BIZ,
    subdomain,
    ownerEmail: email,
    ownerPassword: password,
    plan: "pro",
    vertical: "kitchen-sink-wholesale", // closest sector: admin menus, AI help, integrations recs
    template: incredaSink,
    subscriptionEndsAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
  });
  await fillPhotos(tenant.id);

  console.log(`Created Increda Sink: tenant ${tenant.id}`);
  console.log(`Website: https://${subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? "sitepixl.com"}`);
  console.log(`Admin:   https://${subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? "sitepixl.com"}/admin  (login: ${email})`);
  await db.$disconnect();
})().catch(async (e) => { console.error(e); await db.$disconnect(); process.exit(1); });
