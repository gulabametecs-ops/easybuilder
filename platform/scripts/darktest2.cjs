const { chromium } = require("playwright");
const fs = require("fs");
const OUT = process.env.SHOT_DIR;
const token = fs.readFileSync(process.env.TOKEN_FILE, "utf8").trim();
(async () => {
  const b = await chromium.launch();
  const c = await b.newContext({ viewport: { width: 1280, height: 900 } });
  await c.addCookies([{ name: "admin_session", value: token, domain: "demo.localhost", path: "/" }]);
  const p = await c.newPage();
  await p.goto("http://demo.localhost:3000/admin", { waitUntil: "networkidle", timeout: 45000 });
  await p.waitForTimeout(900);
  console.log("client admin dashboard:", (await p.content()).includes("Welcome"));
  await p.screenshot({ path: OUT + "/g3-client-admin-dark.png", fullPage: true });
  await b.close();
})();
