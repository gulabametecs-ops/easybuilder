const { chromium } = require("playwright");
const OUT = process.env.SHOT_DIR;
(async () => {
  const b = await chromium.launch();
  // Dark (default)
  const d = await b.newContext({ viewport: { width: 1280, height: 900 } });
  const dp = await d.newPage();
  await dp.goto("http://localhost:3000/", { waitUntil: "networkidle", timeout: 45000 });
  await dp.waitForTimeout(2000);
  await dp.screenshot({ path: OUT + "/60-landing-dark.png", fullPage: true });
  console.log("dark done");

  // Light (set localStorage before load)
  const l = await b.newContext({ viewport: { width: 1280, height: 900 } });
  await l.addInitScript(() => localStorage.setItem("theme", "light"));
  const lp = await l.newPage();
  await lp.goto("http://localhost:3000/", { waitUntil: "networkidle", timeout: 45000 });
  await lp.waitForTimeout(2000);
  await lp.screenshot({ path: OUT + "/61-landing-light.png", fullPage: true });
  console.log("light done");

  // Subscribe (dark flow)
  const sp = await d.newPage();
  await sp.goto("http://localhost:3000/subscribe", { waitUntil: "networkidle", timeout: 45000 });
  await sp.waitForTimeout(1200);
  await sp.screenshot({ path: OUT + "/62-subscribe.png", fullPage: true });
  console.log("subscribe done");
  await b.close();
})();
