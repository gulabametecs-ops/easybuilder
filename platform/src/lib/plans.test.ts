import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { TIERS, resolveTiers, limitsForPlan, serviceLimitForPlan, wouldExceed, formatLimit, formatBytes } from "./plans";

describe("plan limits", () => {
  it("defaults per tier, legacy plans unlimited", () => {
    assert.equal(limitsForPlan("starter", "{}")?.storageMb, TIERS[0].limits.storageMb);
    assert.equal(limitsForPlan("premium", "{}")?.pages, 0);
    assert.equal(limitsForPlan("pro", "{}"), null);
    assert.equal(limitsForPlan("free", "{}"), null);
    assert.equal(serviceLimitForPlan("pro", "{}"), 0);
  });

  it("keeps the legacy {monthlyBase, maxServices} override shape", () => {
    const t = resolveTiers(JSON.stringify({ starter: { monthlyBase: 59900, maxServices: 30 } }))[0];
    assert.equal(t.monthlyBase, 59900);
    assert.equal(t.limits.services, 30);
    assert.equal(t.limits.pages, TIERS[0].limits.pages); // untouched default
  });

  it("applies limits overrides and ignores junk", () => {
    const [s, p] = resolveTiers(JSON.stringify({ starter: { limits: { storageMb: 2048, pages: -1 } }, professional: "x" }));
    assert.equal(s.limits.storageMb, 2048);
    assert.equal(s.limits.pages, TIERS[0].limits.pages); // -1 ignored
    assert.equal(p.limits.services, TIERS[1].limits.services); // junk override ignored
    assert.equal(resolveTiers("not json")[0].limits.users, 1);
  });

  it("wouldExceed: 0 = unlimited, blocks only past the limit", () => {
    assert.equal(wouldExceed(0, 999), false);
    assert.equal(wouldExceed(8, 7), false);
    assert.equal(wouldExceed(8, 8), true);
    assert.equal(wouldExceed(8, 12), true); // over after a downgrade
    assert.equal(wouldExceed(1024, 1000, 24), false);
    assert.equal(wouldExceed(1024, 1000, 25), true);
  });

  it("formats", () => {
    assert.equal(formatLimit("storageMb", 1024), "1 GB");
    assert.equal(formatLimit("uploadMb", 5), "5 MB");
    assert.equal(formatLimit("pages", 0), "Unlimited");
    assert.equal(formatBytes(512 * 1024), "512 KB");
    assert.equal(formatBytes(1.5 * 1024 * 1024 * 1024), "1.5 GB");
  });
});
