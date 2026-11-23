import { test } from "node:test";
import assert from "node:assert/strict";
import { buckets, contactMatcher, pctDelta, series } from "./superStats";

test("pctDelta handles a zero base", () => {
  assert.equal(pctDelta(150, 100), 50);
  assert.equal(pctDelta(50, 100), -50);
  assert.equal(pctDelta(5, 0), null);
});

test("buckets are contiguous and the last one contains now", () => {
  const now = new Date(2026, 10, 23, 15);
  for (const unit of ["day", "week", "month"] as const) {
    const bs = buckets(unit, 6, now);
    assert.equal(bs.length, 6);
    for (let i = 1; i < bs.length; i++) assert.equal(bs[i].start.getTime(), bs[i - 1].end.getTime());
    assert.ok(bs[5].start <= now && now < bs[5].end);
  }
  const days = buckets("day", 2, now);
  assert.deepEqual(series(days, [now, new Date(2026, 10, 22, 9), new Date(2026, 9, 1)], (d) => d), [1, 1]);
});

test("contactMatcher matches by email or last-10 phone, never on blanks", () => {
  const m = contactMatcher([{ email: "A@b.com", phone: "+91 98765 43210" }, { email: "", phone: "" }]);
  assert.ok(m({ email: "a@b.com ", phone: "" }));
  assert.ok(m({ email: "x@y.com", phone: "9876543210" }));
  assert.ok(!m({ email: "", phone: "" }));
  assert.ok(!m({ email: "x@y.com", phone: "1234567890" }));
});
