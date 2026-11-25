import { test } from "node:test";
import assert from "node:assert/strict";
import { applySectionsOverlay, patchSectionOverlay, addOverlaySection, setSectionOrderOverlay } from "./demoOverlay";
import { sectionFrameClasses, sectionFrameStyle } from "./config";

const row = (id: string, order: number) => ({ id, pageId: "p", type: "about", order, visible: true, content: "{}", style: "{}" });

test("demo overlay: added sections can be inserted, edited and deleted", () => {
  let o = addOverlaySection({}, "demo_x", { pageId: "p", type: "faq", order: 10_000, visible: true, content: "{}", style: "{}" });
  o = setSectionOrderOverlay(o, "p", ["a", "demo_x", "b"]);
  assert.deepEqual(applySectionsOverlay([row("a", 0), row("b", 1)], "p", o).map((s) => s.id), ["a", "demo_x", "b"]);
  o = patchSectionOverlay(o, "demo_x", { style: '{"padBottom":40}' });
  assert.equal(applySectionsOverlay([row("a", 0)], "p", o).find((s) => s.id === "demo_x")?.style, '{"padBottom":40}');
  o = patchSectionOverlay(o, "demo_x", { deleted: true });
  assert.deepEqual(applySectionsOverlay([row("a", 0), row("b", 1)], "p", o).map((s) => s.id), ["a", "b"]);
});

test("section size style: unset renders as before, px overrides presets", () => {
  assert.deepEqual(sectionFrameStyle({}), {});
  assert.equal(sectionFrameClasses({ spacingTop: "lg" }), "pt-24");
  assert.equal(sectionFrameClasses({ spacingTop: "lg", padTop: 40 }), "");
  const s = sectionFrameStyle({ padBottom: 999, cols: 3 }) as Record<string, string>;
  assert.equal(s["--sec-pb"], "400px");
  assert.equal(s["--sec-cols"], "3");
  assert.equal(s["--sec-cols-sm"], "2");
});
