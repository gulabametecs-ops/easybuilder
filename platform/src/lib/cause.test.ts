import { test } from "node:test";
import assert from "node:assert/strict";
import { mapCause, progressPct, daysLeft, compactINR } from "./cause";

const row = {
  id: "1", slug: "s", title: "T", category: "", summary: "", story: "", coverImage: "", gallery: "bad",
  goalAmount: 500000, offlineRaised: 150000, offlineDonors: 40, deadline: "", urgent: false, beneficiaries: "",
  location: "", impactTiers: '[{"amount":500,"label":"feeds 20"},{"amount":0,"label":"x"}]', updates: "[]", status: "weird", featured: false,
};

test("mapCause adds online paid donations to the offline totals", () => {
  const c = mapCause(row, { amount: 100000, donors: 12 });
  assert.equal(c.raised, 250000);
  assert.equal(c.donors, 52);
  assert.equal(c.status, "active");
  assert.deepEqual(c.gallery, []);
  assert.deepEqual(c.impactTiers, [{ amount: 500, label: "feeds 20" }]);
});

test("progressPct caps at 100 and is 0 for open-ended causes", () => {
  assert.equal(progressPct({ raised: 250000, goalAmount: 500000 }), 50);
  assert.equal(progressPct({ raised: 900000, goalAmount: 500000 }), 100);
  assert.equal(progressPct({ raised: 900000, goalAmount: 0 }), 0);
});

test("daysLeft: null when ongoing, never negative", () => {
  const now = new Date("2026-11-17T10:00:00");
  assert.equal(daysLeft("", now), null);
  assert.equal(daysLeft("2026-11-20", now), 4);
  assert.equal(daysLeft("2026-01-01", now), 0);
});

test("compactINR", () => {
  assert.equal(compactINR(45000), "₹45,000");
  assert.equal(compactINR(250000), "₹2.5 L");
  assert.equal(compactINR(12000000), "₹1.2 Cr");
});
