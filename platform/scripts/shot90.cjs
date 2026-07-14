const { chromium } = require("playwright");
const OUT = process.env.SHOT_DIR;
(async () => {
  const b = await chromium.launch();
  const c = await b.newContext({ viewport: { width: 1280, height: 900 } });
  await c.addInitScript(() => localStorage.setItem("theme", "light"));
  const p = await c.newPage();
  await p.goto("http://localhost:3000/", { waitUntil: "networkidle", timeout: 45000 });
  await p.waitForTimeout(1500);
  await p.screenshot({ path: OUT + "/90-light-final.png", fullPage: true });
  console.log("done");
  await b.close();
})();
