const { chromium } = require("playwright");
const fs = require("fs");
const OUT = process.env.SHOT_DIR;
const token = fs.readFileSync(process.env.TOKEN_FILE, "utf8").trim();
(async () => {
  const b = await chromium.launch();
  // super admin dark (default)
  const p = await b.newContext({ viewport: { width: 1280, height: 900 } }).then(c=>c.newPage());
  await p.goto("http://localhost:3000/super/login", { waitUntil: "networkidle", timeout: 45000 });
  await p.fill('input[name="email"]', "super@platform.test");
  await p.fill('input[name="password"]', "super1234");
  await p.click('button:has-text("Sign in")');
  await p.waitForSelector("text=Platform overview", { timeout: 20000 });
  await p.goto("http://localhost:3000/super/clients", { waitUntil: "networkidle" });
  await p.waitForTimeout(800);
  await p.screenshot({ path: OUT + "/g1-super-dark.png", fullPage: true });
  console.log("super dark shot");
  // toggle to light
  await p.click('button:has-text("Light mode")');
  await p.waitForTimeout(600);
  await p.screenshot({ path: OUT + "/g2-super-light.png", fullPage: true });
  console.log("super light shot");
  // client admin dark (default) — demo tenant
  const c2 = await b.newContext({ viewport: { width: 1280, height: 900 } });
  await c2.addCookies([{ name: "admin_session", value: token, domain: "demo.localhost", path: "/" }]);
  const p2 = await c2.newPage();
  await p2.goto("http://demo.localhost:3000/admin", { waitUntil: "networkidle", timeout: 45000 });
  await p2.waitForTimeout(800);
  await p2.screenshot({ path: OUT + "/g3-client-admin-dark.png", fullPage: true });
  console.log("client admin dark shot");
  await b.close();
})();
