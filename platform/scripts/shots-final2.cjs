const { chromium } = require("playwright");
const OUT = process.env.SHOT_DIR;
(async () => {
  const b = await chromium.launch();

  // Landing (light) — full, to see How it works + FAQ
  const c1 = await b.newContext({ viewport: { width: 1280, height: 900 } });
  await c1.addInitScript(() => localStorage.setItem("theme", "light"));
  const p1 = await c1.newPage();
  await p1.goto("http://localhost:3000/", { waitUntil: "networkidle", timeout: 45000 });
  await p1.waitForTimeout(1500);
  await p1.screenshot({ path: OUT + "/80-landing-full.png", fullPage: true });
  console.log("landing");

  // Demos (light, unlocked) — to see admin panel buttons
  const c2 = await b.newContext({ viewport: { width: 1280, height: 900 } });
  await c2.addInitScript(() => localStorage.setItem("theme", "light"));
  await c2.addCookies([{ name: "demo_unlocked", value: "1", domain: "localhost", path: "/" }]);
  const p2 = await c2.newPage();
  await p2.goto("http://localhost:3000/demos", { waitUntil: "networkidle", timeout: 45000 });
  await p2.waitForTimeout(1800);
  await p2.screenshot({ path: OUT + "/81-demos-premium.png", fullPage: true });
  console.log("demos");
  await b.close();
})();
