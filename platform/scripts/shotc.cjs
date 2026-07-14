const { chromium } = require("playwright");
const OUT = process.env.SHOT_DIR;
(async () => {
  const b = await chromium.launch();
  const c = await b.newContext({ viewport: { width: 1280, height: 900 } });
  await c.addInitScript(() => localStorage.setItem("theme", "light"));
  await c.addCookies([{ name: "demo_unlocked", value: "1", domain: "localhost", path: "/" }]);
  const p = await c.newPage();
  await p.goto("http://localhost:3000/demos", { waitUntil: "networkidle", timeout: 45000 });
  await p.waitForTimeout(1800);
  await p.screenshot({ path: OUT + "/c1-catalog-8live.png", fullPage: true });
  // skill home
  const p2 = await b.newPage();
  await p2.setViewportSize({ width: 1280, height: 760 });
  await p2.goto("http://demo-skill.localhost:3000/", { waitUntil: "networkidle", timeout: 45000 });
  await p2.waitForTimeout(1500);
  await p2.screenshot({ path: OUT + "/c2-skill-home.png" });
  // wholesale products page
  const p3 = await b.newPage();
  await p3.setViewportSize({ width: 1280, height: 760 });
  await p3.goto("http://demo-mfg.localhost:3000/", { waitUntil: "networkidle", timeout: 45000 });
  await p3.waitForTimeout(1500);
  await p3.screenshot({ path: OUT + "/c3-mfg-home.png" });
  console.log("done");
  await b.close();
})();
