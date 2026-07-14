import { chromium } from "playwright";
import { readFileSync } from "node:fs";

const OUT = process.env.SHOT_DIR ?? ".";
const token = readFileSync(process.env.TOKEN_FILE!, "utf8").trim();

async function main() {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  // Admin session cookie for the demo tenant host.
  await context.addCookies([
    { name: "admin_session", value: token, domain: "demo.localhost", path: "/" },
  ]);
  const page = await context.newPage();

  const shots: [string, string, boolean?][] = [
    ["http://localhost:3000/", "01-marketing.png"],
    ["http://demo.localhost:3000/", "02-tenant-home.png"],
    ["http://demo.localhost:3000/services", "03-tenant-services.png"],
    ["http://demo.localhost:3000/quote", "04-tenant-quote.png"],
    ["http://demo.localhost:3000/admin/login", "05-admin-login.png"],
    ["http://demo.localhost:3000/admin", "06-admin-dashboard.png"],
    ["http://demo.localhost:3000/admin/appearance", "07-admin-appearance.png"],
    ["http://demo.localhost:3000/admin/pages", "08-admin-pages.png"],
    ["http://demo.localhost:3000/admin/leads", "09-admin-leads.png"],
  ];

  for (const [url, file] of shots) {
    try {
      await page.goto(url, { waitUntil: "networkidle", timeout: 45000 });
      await page.waitForTimeout(600);
      await page.screenshot({ path: `${OUT}/${file}`, fullPage: true });
      console.log("shot:", file);
    } catch (e) {
      console.log("FAIL", file, (e as Error).message);
    }
  }

  await browser.close();
}
main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
