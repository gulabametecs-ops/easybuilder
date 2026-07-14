const { chromium } = require("playwright");
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 1280, height: 950 } });
  const p = await ctx.newPage();
  await p.goto("http://localhost:3000/super/login", { waitUntil: "networkidle", timeout: 45000 });
  await p.fill('input[name="email"]', "super@platform.test");
  await p.fill('input[name="password"]', "super1234");
  await p.click('button:has-text("Sign in")');
  await p.waitForSelector("text=Platform overview", { timeout: 20000 });
  await p.goto("http://localhost:3000/super/clients", { waitUntil: "networkidle" });
  const href = await p.evaluate(() => Array.from(document.querySelectorAll('a[href^="/super/clients/"]')).map(a=>a.getAttribute('href')).find(h => h && h!=='/super/clients/new' && !h.includes('?')));
  const id = href.split('/').pop();
  // fetch the impersonate route with redirects, log chain
  p.on('response', r => { const l = r.headers()['location']; if (r.status()>=300 && r.status()<400) console.log("REDIR", r.status(), r.url(), "->", l); });
  await p.goto("http://localhost:3000/super/impersonate/"+id, { waitUntil: "networkidle", timeout: 30000 }).catch(e=>console.log("nav err", e.message));
  console.log("FINAL:", p.url());
  await b.close();
})();
