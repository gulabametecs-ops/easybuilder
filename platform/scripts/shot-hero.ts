import { chromium } from "playwright";
const OUT = process.env.SHOT_DIR ?? ".";
async function main() {
  const b = await chromium.launch();
  const p = await b.newContext({ viewport: { width: 1280, height: 620 } }).then((c) => c.newPage());
  await p.goto("http://demo.localhost:3000/", { waitUntil: "networkidle", timeout: 40000 });
  await p.waitForTimeout(1500);
  await p.screenshot({ path: `${OUT}/42-hero-fixed.png` });
  console.log("done");
  await b.close();
}
main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
