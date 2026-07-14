import { chromium } from "playwright";

const OUT = process.env.SHOT_DIR ?? ".";
const ROOT = "localhost:3000";
const SUB = "guptatest";

async function main() {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 950 } });
  const page = await ctx.newPage();

  // ── 1. Demo gating ─────────────────────────────────────────────────────────
  await page.goto(`http://${ROOT}/demos`, { waitUntil: "networkidle" });
  const gateVisible = await page.locator("text=Unlock all live demos").isVisible();
  console.log("DEMO GATE visible before unlock:", gateVisible);
  await page.fill('input[name="name"]', "Ramesh Gupta");
  await page.fill('input[name="phone"]', "9876500000");
  await page.fill('input[name="email"]', "ramesh@gupta.test");
  await page.fill('input[name="company"]', "Gupta Home Services");
  await page.click('button:has-text("Unlock demos")');
  await page.waitForSelector("text=Open demo", { timeout: 20000 });
  console.log("DEMOS unlocked: Open demo buttons visible");
  await page.screenshot({ path: `${OUT}/13-demos-unlocked.png`, fullPage: true });

  // ── 2. Subscribe + pay (mock) ──────────────────────────────────────────────
  await page.goto(`http://${ROOT}/subscribe?vertical=home-services`, { waitUntil: "networkidle" });
  await page.fill('input[name="businessName"]', "Gupta Home Services");
  await page.fill('input[name="subdomain"]', SUB);
  await page.fill('input[name="email"]', "owner@gupta.test");
  await page.fill('input[name="phone"]', "9876500000");
  await page.fill('input[name="password"]', "gupta1234");
  await page.screenshot({ path: `${OUT}/14-subscribe-filled.png`, fullPage: true });
  await page.click('button:has-text("Pay & launch")');
  await page.waitForSelector("text=Payment successful", { timeout: 30000 });
  console.log("SUBSCRIBE: payment success + provisioned");
  await page.screenshot({ path: `${OUT}/15-subscribe-success.png`, fullPage: true });

  // Confirm the new tenant is live
  await page.goto(`http://${SUB}.${ROOT}/`, { waitUntil: "networkidle", timeout: 30000 });
  console.log("NEW CLIENT site live:", (await page.content()).includes("Gupta Home Services"));

  // ── 3. Super admin sees everything ─────────────────────────────────────────
  await page.goto(`http://${ROOT}/super/login`, { waitUntil: "networkidle" });
  await page.fill('input[name="email"]', "super@platform.test");
  await page.fill('input[name="password"]', "super1234");
  await page.click('button:has-text("Sign in")');
  await page.waitForSelector("text=Platform overview", { timeout: 20000 });
  console.log("SUPER ADMIN: logged in, overview loaded");
  await page.screenshot({ path: `${OUT}/16-super-overview.png`, fullPage: true });
  await page.goto(`http://${ROOT}/super/orders`, { waitUntil: "networkidle" });
  await page.screenshot({ path: `${OUT}/17-super-orders.png`, fullPage: true });

  await browser.close();
}
main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
