import "dotenv/config";
import { db } from "../src/lib/db";

async function main() {
  const t = await db.tenant.findUnique({ where: { subdomain: "demo" } });
  if (!t) throw new Error("no demo");
  const cfg = await db.siteConfig.findUnique({ where: { tenantId: t.id } });
  const header = JSON.parse(cfg!.header);
  header.announcement = { show: true, text: "🎉 Monsoon Offer — Get 15% off your first booking! Call now.", link: "/quote" };
  await db.siteConfig.update({ where: { tenantId: t.id }, data: { header: JSON.stringify(header) } });
  console.log("announcement enabled on demo");
}
main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
