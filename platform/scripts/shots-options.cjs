const { chromium } = require("playwright");
const fs = require("fs");
const OUT = process.env.SHOT_DIR;
const token = fs.readFileSync(process.env.TOKEN_FILE, "utf8").trim();
(async () => {
  const b = await chromium.launch();

  // Admin appearance (theme preview) — authed
  const c1 = await b.newContext({ viewport: { width: 1280, height: 950 } });
  await c1.addCookies([{ name: "admin_session", value: token, domain: "demo.localhost", path: "/" }]);
  const p1 = await c1.newPage();
  await p1.goto("http://demo.localhost:3000/admin/appearance", { waitUntil: "networkidle", timeout: 45000 });
  await p1.waitForTimeout(1000);
  await p1.screenshot({ path: OUT + "/a1-theme-preview.png" });
  console.log("appearance");

  // Restaurant home — centered hero variant
  const p2 = await b.newPage();
  await p2.goto("http://demo-restaurant.localhost:3000/", { waitUntil: "networkidle", timeout: 45000 });
  await p2.waitForTimeout(1500);
  await p2.screenshot({ path: OUT + "/a2-hero-centered.png", clip: { x: 0, y: 0, width: 1280, height: 640 } });
  console.log("restaurant");

  // Hospital home — split hero variant
  const p3 = await b.newPage();
  await p3.goto("http://demo-hospital.localhost:3000/", { waitUntil: "networkidle", timeout: 45000 });
  await p3.waitForTimeout(1500);
  await p3.screenshot({ path: OUT + "/a3-hero-split.png", clip: { x: 0, y: 0, width: 1280, height: 640 } });
  console.log("hospital");

  await b.close();
})();
