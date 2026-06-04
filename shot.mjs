import { chromium } from "playwright";

const URL = process.env.URL || "http://localhost:3001/";
const W = 1440, H = 900;

const browser = await chromium.launch({
  args: [
    "--enable-unsafe-swiftshader",
    "--use-gl=angle",
    "--use-angle=swiftshader",
    "--ignore-gpu-blocklist",
  ],
});
const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
const errors = [];
page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
page.on("pageerror", (e) => errors.push("PAGEERR: " + e.message));

await page.goto(URL, { waitUntil: "networkidle" });
await page.waitForTimeout(2500); // дать сцене и шрифтам прогрузиться

const steps = [
  ["1-hero", 0],
  ["2-aware-1", 980],
  ["3-aware-4", 2980],
  ["4-vitamins", 4450],
  ["5-sport", 5202],
];

for (const [name, y] of steps) {
  await page.evaluate((yy) => {
    const l = window.__lenis;
    if (l) l.scrollTo(yy, { immediate: true, force: true });
    else window.scrollTo(0, yy);
  }, y);
  await page.waitForTimeout(1700);
  await page.screenshot({ path: `/tmp/shots/${name}.png` });
  console.log("shot", name, "@", Math.round(y));
}

console.log("CONSOLE ERRORS:", errors.length ? errors.slice(0, 12) : "none");
await browser.close();
