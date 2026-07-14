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
  // clients list
  await p.goto("http://localhost:3000/super/clients", { waitUntil: "networkidle" });
  await p.waitForTimeout(800);
  await p.screenshot({ path: OUT + "/d1-clients-list.png", fullPage: true });
  console.log("clients list ok");
  // add client
  await p.goto("http://localhost:3000/super/clients/new", { waitUntil: "networkidle" });
  await p.fill('input[name="businessName"]', "Test Manual Client");
  await p.fill('input[name="subdomain"]', "manualtest");
  await p.fill('input[name="email"]', "owner@manual.test");
  await p.fill('input[name="password"]', "manual1234");
  await p.click('button:has-text("Create client")');
  await p.waitForSelector("text=Manage license", { timeout: 20000 });
  console.log("client created + detail loaded");
  await p.screenshot({ path: OUT + "/d2-client-detail.png", fullPage: true });
  // extend +1 year
  await p.click('button:has-text("+1 Year")');
  await p.waitForTimeout(1500);
  console.log("extended license");
  // search
  await p.goto("http://localhost:3000/super/clients?q=manual", { waitUntil: "networkidle" });
  const hasResult = (await p.content()).includes("Test Manual Client");
  console.log("search works:", hasResult);
  await b.close();
})();
