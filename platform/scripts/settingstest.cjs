const { chromium } = require("playwright");
const OUT = process.env.SHOT_DIR;
(async () => {
  const b = await chromium.launch();
  const p = await b.newContext({ viewport: { width: 1280, height: 950 } }).then(c=>c.newPage());
  await p.goto("http://localhost:3000/super/login", { waitUntil: "networkidle", timeout: 45000 });
  await p.fill('input[name="email"]', "super@platform.test");
  await p.fill('input[name="password"]', "super1234");
  await p.click('button:has-text("Sign in")');
  await p.waitForSelector("text=Platform overview", { timeout: 20000 });
  await p.goto("http://localhost:3000/super/settings", { waitUntil: "networkidle" });
  await p.waitForTimeout(600);
  console.log("settings page loaded; mock badge:", (await p.content()).includes("Test / mock mode"));
  // fill razorpay test keys and save
  await p.fill('input[name="razorpayKeyId"]', "rzp_test_ABC123XYZ");
  await p.fill('input[name="razorpayKeySecret"]', "testsecret456");
  await p.click('button:has-text("Save payment keys")');
  await p.waitForTimeout(1500);
  const afterSave = await p.content();
  console.log("live enabled after save:", afterSave.includes("Live payments"));
  await p.screenshot({ path: OUT + "/e1-super-settings.png", fullPage: true });
  // revert to mock (clear key id)
  await p.fill('input[name="razorpayKeyId"]', "");
  await p.click('button:has-text("Save payment keys")');
  await p.waitForTimeout(1200);
  console.log("reverted to mock:", (await p.content()).includes("Test / mock mode"));
  await b.close();
})();
