import { test } from "node:test";
import assert from "node:assert/strict";
import { isBot, normalizePath, dayKey, lastDays } from "./analytics";
import { buildChecklist, type ChecklistFacts } from "./setupChecklist";

test("bot filter", () => {
  assert.equal(isBot("Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 Chrome/126.0 Mobile Safari/537.36"), false);
  assert.equal(isBot("Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"), true);
  assert.equal(isBot("WhatsApp/2.23.20.0 A"), true);
  assert.equal(isBot("Mozilla/5.0 HeadlessChrome/120.0.0.0 Safari/537.36"), true);
  assert.equal(isBot("curl/8.4.0"), true);
  assert.equal(isBot(""), true);
  assert.equal(isBot(null), true);
});

test("path normalisation", () => {
  assert.equal(normalizePath("/"), "/");
  assert.equal(normalizePath("/About/?utm=x#top"), "/about");
  assert.equal(normalizePath("//services//ac-repair"), "/services/ac-repair");
  assert.equal(normalizePath("/admin/leads"), null);
  assert.equal(normalizePath("/logo.png"), null);
  assert.equal(normalizePath("/<script>"), null);
  assert.equal(normalizePath("https://evil.com"), null);
  assert.equal(normalizePath("/" + "a".repeat(300)), null);
  assert.equal(normalizePath(42), null);
});

test("IST day keys", () => {
  assert.equal(dayKey(new Date("2026-11-15T19:00:00Z")), "2026-11-16"); // 00:30 IST
  assert.equal(dayKey(new Date("2026-11-15T18:00:00Z")), "2026-11-15");
  const d = lastDays(7, new Date("2026-11-16T06:00:00Z"));
  assert.deepEqual([d.length, d[0], d[6]], [7, "2026-11-10", "2026-11-16"]);
});

const fresh: ChecklistFacts = {
  logoImage: "", primaryColor: "#84cc16", templatePrimaries: ["#84cc16", "#2563eb"],
  services: 6, gallery: 2, phones: ["9000000000"], email: "hello@example.com",
  templatePhones: ["9000000000"], templateEmail: "hello@example.com",
  seoTitle: "Gym in Your City", seoDescription: "x".repeat(60),
  templateSeoTitle: "Gym in Your City", templateSeoDescription: "x".repeat(60),
  domainConnected: null, leads: 0,
};

test("checklist: untouched template only ticks real counts", () => {
  const items = buildChecklist(fresh);
  assert.deepEqual(items.filter((i) => i.done).map((i) => i.id), ["services"]);
  assert.equal(items.some((i) => i.id === "domain"), false);
});

test("checklist: customised site ticks everything", () => {
  const items = buildChecklist({
    ...fresh, logoImage: "/u/logo.png", primaryColor: "#B91C1C", gallery: 8,
    phones: ["+91 98480 22338"], email: "info@sharmagym.in",
    seoTitle: "Sharma Gym — Fitness in Pune", seoDescription: "y".repeat(60),
    domainConnected: true, leads: 3,
  });
  assert.equal(items.length, 8);
  assert.ok(items.every((i) => i.done));
});
