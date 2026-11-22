import { test } from "node:test";
import assert from "node:assert/strict";
import { auditPage, keywordStats, keywordHints, lengthStatus, TITLE_RANGE } from "./seoAudit";
import { placeholderImage } from "./img";

const site = { bizName: "Acme Plumbing", title: "Acme Plumbing — 24/7 plumbers in Delhi", description: "x".repeat(100) };

test("audit flags missing heading, placeholders, thin copy and long titles", () => {
  const a = auditPage({
    id: "1", slug: "about", title: "About", seoTitle: "A".repeat(70), seoDescription: "", focusKeyword: "", noindex: false, published: true,
    sections: [{ type: "about", visible: true, content: JSON.stringify({ title: "Who we are", image: placeholderImage(10, 10), text: "<p>We fix pipes</p>" }) }],
  }, site);
  assert.equal(a.heroTitles, 0);
  assert.equal(a.placeholderImages, 1);
  assert.ok(a.issues.some((i) => i.startsWith("Title too long")));
  assert.ok(a.issues.some((i) => i.startsWith("No main heading")));
  assert.ok(a.text.includes("we fix pipes") && !a.text.includes("<p>"));
  assert.equal(a.path, "/about");
});

test("keyword stats + hints", () => {
  const s = keywordStats("best plumber in delhi call the best plumber today", "best plumber");
  assert.equal(s.count, 2);
  assert.equal(s.words, 9);
  const hints = keywordHints({ effectiveTitle: "Best Plumber Delhi", effectiveDescription: "", text: "best plumber here", path: "/best-plumber" }, "Best Plumber");
  assert.equal(hints[0].ok, true);
  assert.equal(hints[1].ok, false);
  assert.equal(lengthStatus(45, TITLE_RANGE), "good");
  assert.equal(lengthStatus(0, TITLE_RANGE), "empty");
});

test("hero titleTop counts as the main heading", () => {
  const a = auditPage({
    id: "2", slug: "home", title: "Home", seoTitle: "", seoDescription: "", focusKeyword: "", noindex: false, published: true,
    sections: [{ type: "hero", visible: true, content: JSON.stringify({ titleTop: "Welcome", titleHighlight: "" }) }],
  }, site);
  assert.equal(a.heroTitles, 1);
});
