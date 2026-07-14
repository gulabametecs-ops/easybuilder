import { chromium } from "playwright";
const OUT = process.env.SHOT_DIR ?? ".";
const R = "localhost:3000";
async function main() {
  const b = await chromium.launch();
  const p = await b.newContext({ viewport: { width: 1280, height: 900 } }).then((c) => c.newPage());
  const shots: [string, string][] = [
    [`http://demo.${R}/`, "30-home-hero.png"],
    [`http://demo.${R}/services`, "31-home-services-banner.png"],
    [`http://demo-edu.${R}/`, "32-edu-home.png"],
  ];
  for (const [u, f] of shots) {
    await p.goto(u, { waitUntil: "networkidle", timeout: 45000 });
    await p.waitForTimeout(1500);
    await p.screenshot({ path: `${OUT}/${f}`, fullPage: true });
    console.log("shot", f);
  }
  await b.close();
}
main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
