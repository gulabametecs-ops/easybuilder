const { chromium } = require("playwright");
const fs = require("fs");
const OUT = process.env.SHOT_DIR;
const token = fs.readFileSync(process.env.TOKEN_FILE, "utf8").trim();
(async () => {
  const b = await chromium.launch();
  // demo home top (announcement bar)
  const p1 = await b.newPage();
  await p1.setViewportSize({ width: 1280, height: 500 });
  await p1.goto("http://demo.localhost:3000/", { waitUntil: "networkidle", timeout: 45000 });
  await p1.waitForTimeout(1200);
  await p1.screenshot({ path: OUT + "/b1-announce.png" });
  // admin add-section menu
  const c2 = await b.newContext({ viewport: { width: 1280, height: 950 } });
  await c2.addCookies([{ name: "admin_session", value: token, domain: "demo.localhost", path: "/" }]);
  const p2 = await c2.newPage();
  await p2.goto("http://demo.localhost:3000/admin/pages", { waitUntil: "networkidle", timeout: 45000 });
  // open first page editor
  await p2.click("a[href*='/admin/pages/']");
  await p2.waitForTimeout(800);
  await p2.click("text=Add a section");
  await p2.waitForTimeout(600);
  await p2.screenshot({ path: OUT + "/b2-add-section.png", fullPage: true });
  console.log("done");
  await b.close();
})();
