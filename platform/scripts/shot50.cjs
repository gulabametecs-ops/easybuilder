const { chromium } = require("playwright");
(async () => {
  const b = await chromium.launch();
  const p = await b.newContext({ viewport: { width: 1280, height: 900 } }).then(c=>c.newPage());
  await p.goto("http://demo.localhost:3000/services", { waitUntil: "networkidle", timeout: 45000 });
  await p.waitForTimeout(2500);
  await p.screenshot({ path: process.env.SHOT_DIR + "/50-topical-services.png" });
  await b.close(); console.log("done");
})();
