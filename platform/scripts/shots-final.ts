import { chromium } from "playwright";
const OUT = process.env.SHOT_DIR ?? ".";
const R = "localhost:3000";
async function main() {
  const b = await chromium.launch();
  const p = await b.newContext({ viewport: { width: 1280, height: 900 } }).then((c) => c.newPage());
  for (const [u, f] of [[`http://${R}/`, "40-marketing-pro.png"], [`http://demo.${R}/`, "41-demo-home-final.png"]] as [string, string][]) {
    await p.goto(u, { waitUntil: "networkidle", timeout: 45000 });
    await p.waitForTimeout(1500);
    await p.screenshot({ path: `${OUT}/${f}`, fullPage: true });
    console.log("shot", f);
  }
  await b.close();
}
main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
