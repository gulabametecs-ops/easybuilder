import { chromium } from "playwright";

const OUT = process.env.SHOT_DIR ?? ".";
const ROOT = "localhost:3000";

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newContext({ viewport: { width: 1280, height: 900 } }).then((c) => c.newPage());

  const shots: [string, string][] = [
    [`http://demo-edu.${ROOT}/`, "20-edu-home.png"],
    [`http://demo-restaurant.${ROOT}/menu`, "21-restaurant-menu.png"],
    [`http://demo-hospital.${ROOT}/doctors`, "22-hospital-doctors.png"],
    [`http://${ROOT}/demos`, "23-demos-catalog.png"],
  ];
  for (const [url, file] of shots) {
    await page.goto(url, { waitUntil: "networkidle", timeout: 40000 });
    await page.waitForTimeout(500);
    await page.screenshot({ path: `${OUT}/${file}`, fullPage: true });
    console.log("shot:", file);
  }
  await browser.close();
}
main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
