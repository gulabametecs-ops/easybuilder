const { chromium } = require("playwright");
(async () => {
  const b = await chromium.launch();
  const p = await b.newContext({ viewport: { width: 1280, height: 900 } }).then(c=>c.newPage());
  await p.goto("http://localhost:3000/super/login", { waitUntil: "networkidle", timeout: 45000 });
  await p.fill('input[name="email"]', "super@platform.test");
  await p.fill('input[name="password"]', "super1234");
  await p.click('button:has-text("Sign in")');
  await p.waitForSelector("text=Platform overview", { timeout: 20000 });
  await p.goto("http://localhost:3000/super/clients", { waitUntil: "networkidle" });
  await p.click('a:has-text("View")');
  await p.waitForSelector("text=Manage license", { timeout: 20000 });
  await p.click('button:has-text("Login as client")');
  await p.waitForTimeout(3000);
  const url = p.url();
  console.log("impersonate -> url:", url);
  console.log("in a client admin (not super):", url.includes("/admin") && !url.includes("/super") && !url.includes("localhost:3000/admin"));
  const body = await p.content();
  console.log("admin dashboard shown:", body.includes("Welcome") || body.includes("Dashboard") || body.includes("Total Leads"));

  const p2 = await b.newPage();
  await p2.goto("http://localhost:3000/subscribe?vertical=home-services", { waitUntil: "networkidle", timeout: 45000 });
  await p2.fill('input[placeholder="Coupon code"]', "WELCOME20");
  await p2.click('button:has-text("Apply")');
  await p2.waitForTimeout(1500);
  const b2 = await p2.content();
  console.log("coupon msg:", b2.includes("20% off applied"), "| line-through:", b2.includes("line-through"));
  await b.close();
})();
