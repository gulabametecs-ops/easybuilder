const { chromium } = require("playwright");
const OUT = process.env.SHOT_DIR;
async function shot(b, url, file, theme) {
  const ctx = await b.newContext({ viewport: { width: 1280, height: 900 } });
  if (theme === "light") await ctx.addInitScript(() => localStorage.setItem("theme", "light"));
  const p = await ctx.newPage();
  await p.goto(url, { waitUntil: "networkidle", timeout: 45000 });
  await p.waitForTimeout(1800);
  await p.screenshot({ path: OUT + "/" + file, fullPage: true });
  console.log(file);
  await ctx.close();
}
(async () => {
  const b = await chromium.launch();
  await shot(b, "http://localhost:3000/demos", "70-demos-light.png", "light");
  await shot(b, "http://localhost:3000/demos", "71-demos-dark.png", "dark");
  await shot(b, "http://localhost:3000/subscribe", "72-subscribe-light.png", "light");
  await b.close();
})();
