import { chromium } from "playwright";

const OUT = process.env.SHOT_DIR ?? ".";
const ROOT = "localhost:3000";
const SUB = "sharmatest";

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newContext({ viewport: { width: 1200, height: 900 } }).then((c) => c.newPage());

  // 1. Go to signup and fill the form.
  await page.goto(`http://${ROOT}/signup`, { waitUntil: "networkidle" });
  await page.fill('input[name="businessName"]', "Sharma Home Services");
  await page.fill('input[name="subdomain"]', SUB);
  await page.fill('input[name="email"]', "owner@sharma.test");
  await page.fill('input[name="password"]', "sharma1234");
  await page.screenshot({ path: `${OUT}/10-signup-filled.png`, fullPage: true });

  // 2. Submit and wait for the success card.
  await page.click('button:has-text("Create my website")');
  await page.waitForSelector('text=Your website is live', { timeout: 30000 });
  await page.screenshot({ path: `${OUT}/11-signup-success.png`, fullPage: true });
  console.log("SIGNUP: success card shown");

  // 3. Visit the brand-new tenant site.
  await page.goto(`http://${SUB}.${ROOT}/`, { waitUntil: "networkidle", timeout: 30000 });
  const heading = await page.textContent("h1").catch(() => "");
  const hasSharma = (await page.content()).includes("Sharma Home Services");
  console.log("NEW SITE h1:", heading?.trim());
  console.log("NEW SITE shows business name:", hasSharma);
  await page.screenshot({ path: `${OUT}/12-new-tenant-home.png`, fullPage: true });

  await browser.close();
}
main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
