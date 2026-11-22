import { test } from "node:test";
import assert from "node:assert/strict";
import { coerceListContent } from "./mapSectionContent";

test("priceList: invented keys and numeric prices map onto groups/items", () => {
  const out = coerceListContent("priceList", {
    heading: "Our Menu",
    menu: [{ name: "Starters", dishes: [{ dish: "Paneer Tikka", cost: 280, description: "6 pcs" }, "Papad"] }],
  });
  assert.deepEqual(out?.groups, [
    { category: "Starters", items: [{ name: "Paneer Tikka", price: "₹280", note: "6 pcs" }, { name: "Papad", price: "", note: "" }] },
  ]);
});

test("priceList: a flat items array becomes one group; nothing usable drops groups", () => {
  const flat = coerceListContent("priceList", { items: [{ title: "Thali", price: "350" }] });
  assert.deepEqual(flat?.groups, [{ category: "Menu", items: [{ name: "Thali", price: "₹350", note: "" }] }]);
  const empty = coerceListContent("priceList", { groups: [{ category: "X", items: [] }] });
  assert.equal(empty?.groups, undefined);
});

test("faq: question/answer aliases", () => {
  const out = coerceListContent("faq", { faqs: [{ question: "Open Sunday?", answer: "Yes" }, { question: "no answer" }] });
  assert.deepEqual(out?.items, [{ q: "Open Sunday?", a: "Yes" }]);
});
