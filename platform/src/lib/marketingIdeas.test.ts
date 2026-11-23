import { test } from "node:test";
import assert from "node:assert/strict";
import { upcomingOccasions, sectorIdeas, istToday } from "./marketingIdeas";

test("upcomingOccasions returns the next 3, including ongoing seasons and year rollover", () => {
  const u = upcomingOccasions("2026-11-23");
  assert.deepEqual(u.map((o) => o.name), ["Wedding season", "Christmas", "New Year"]);
  assert.equal(u[0].ongoing, true);
  assert.equal(u[0].daysAway, 0);
  assert.equal(u[1].daysAway, 32);
  assert.equal(u[2].date, "2027-01-01");
  // Approximate lunar dates are flagged.
  const diwali = upcomingOccasions("2026-11-01").find((o) => o.name === "Diwali");
  assert.equal(diwali?.approx, true);
  assert.equal(diwali?.daysAway, 7);
});

test("sectorIdeas matches vertical ids with a generic fallback", () => {
  assert.match(sectorIdeas("gym-fitness").offers[0], /trial/);
  assert.match(sectorIdeas("cafe-bakery").posts[0], /special/);
  assert.equal(sectorIdeas("something-else").offers.length, 3);
  assert.equal(istToday(Date.parse("2026-11-23T20:00:00Z")), "2026-11-24");
});
