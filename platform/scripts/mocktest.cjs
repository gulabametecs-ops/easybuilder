const { chromium } = require("playwright");
(async () => {
  const b = await chromium.launch();
  const p = await b.newContext({ viewport: { width: 1200, height: 900 } }).then(c=>c.newPage());
  await p.goto("http://localhost:3000/subscribe?vertical=home-services", { waitUntil: "networkidle", timeout: 45000 });
  await p.fill('input[name="businessName"]', "Verma Services");
  await p.fill('input[name="subdomain"]', "vermatest");
  await p.fill('input[name="email"]', "owner@verma.test");
  await p.fill('input[name="phone"]', "9998887776");
  await p.fill('input[name="password"]', "verma1234");
  await p.click('button:has-text("Pay")');
  await p.waitForSelector("text=Payment successful", { timeout: 30000 });
  console.log("MOCK CHECKOUT: success");
  await p.goto("http://vermatest.localhost:3000/", { waitUntil: "networkidle", timeout: 30000 });
  console.log("NEW SITE live:", (await p.content()).includes("Verma Services"));
  await b.close();
})();
