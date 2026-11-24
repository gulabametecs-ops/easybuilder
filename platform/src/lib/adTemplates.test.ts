import { test } from "node:test";
import assert from "node:assert/strict";
import { adTemplates, addDays } from "./adTemplates";
import { upcomingOccasions } from "./marketingIdeas";

test("adTemplates: sector first, festivals capped to 2 weeks, goal templates always present", () => {
  const today = "2026-11-24"; // Tuesday
  const t = adTemplates({ vertical: "school", bizName: "Sunrise", services: ["Nursery"], occasions: upcomingOccasions(today, 3), today });
  assert.equal(t[0].id, "admission");
  assert.equal(t[0].draft.headline, "Admissions Open 2027–28 at Sunrise");
  assert.ok(t.some((x) => x.id === "google-call" && x.draft.headline.includes("Nursery")));
  for (const x of t) {
    assert.ok(x.draft.startDate >= today && x.draft.endDate >= x.draft.startDate, x.id);
    const days = (Date.parse(x.draft.endDate) - Date.parse(x.draft.startDate)) / 86_400_000 + 1;
    assert.ok(days <= 14, `${x.id} runs ${days} days`);
    assert.equal(x.draft.budget, x.perDay * days, x.id);
  }
  const xmas = t.find((x) => x.id === "fest-christmas")!;
  assert.equal(xmas.draft.endDate, "2026-12-25");
  assert.equal(xmas.draft.startDate, addDays("2026-12-25", -13));
  // Weekend offer starts on the coming Friday.
  assert.equal(t.find((x) => x.id === "weekend-discount")!.draft.startDate, "2026-11-27");
  // Unknown sector: no sector templates, generic fallback still works.
  const g = adTemplates({ vertical: "unknown", bizName: "", services: [], occasions: [], today });
  assert.ok(g.every((x) => x.group === "goal") && g.length === 5);
});
