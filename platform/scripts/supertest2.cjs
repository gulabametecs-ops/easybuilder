const { chromium } = require("playwright");
const OUT = process.env.SHOT_DIR;
(async () => {
  const b = await chromium.launch();
  const p = await b.newContext({ viewport: { width: 1280, height: 950 } }).then(c=>c.newPage());
  // login super
  await p.goto("http://localhost:3000/super/login", { waitUntil: "networkidle", timeout: 45000 });
  await p.fill('input[name="email"]', "super@platform.test");
  await p.fill('input[name="password"]', "super1234");
  await p.click('button:has-text("Sign in")');
  await p.waitForSelector("text=Platform overview", { timeout: 20000 });
  console.log("logged in");
  // analytics
  await p.goto("http://localhost:3000/super/analytics", { waitUntil: "networkidle" });
  await p.waitForTimeout(800);
  await p.screenshot({ path: OUT + "/f1-analytics.png", fullPage: true });
  console.log("analytics ok:", (await p.content()).includes("Revenue (last 6 months)"));
  // create a coupon
  await p.goto("http://localhost:3000/super/coupons", { waitUntil: "networkidle" });
  await p.fill('input[name="code"]', "WELCOME20");
  await p.fill('input[name="percentOff"]', "20");
  await p.click('button:has-text("Create")');
  await p.waitForTimeout(1200);
  console.log("coupon created:", (await p.content()).includes("WELCOME20"));
  // clients filter
  await p.goto("http://localhost:3000/super/clients?filter=active", { waitUntil: "networkidle" });
  console.log("filter tab active:", (await p.content()).includes("Expiring (30d)"));
  // CSV export
  const resp = await p.request.get("http://localhost:3000/super/export?type=clients", { headers: { cookie: (await p.context().cookies()).map(c=>c.name+"="+c.value).join("; ") } });
  console.log("csv export:", resp.status(), (resp.headers()["content-type"]||"").includes("csv"));
  await b.close();
})();
