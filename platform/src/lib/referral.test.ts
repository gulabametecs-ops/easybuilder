import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  REFERRAL_DEFAULTS, resolveReferralSettings, preGstAmount, isSelfReferral, qualifies, commissionAmount,
  availableAtFrom, commissionState, balances, canWithdraw, tdsSplit, maskAccount, maskName,
  referralCodeCandidate, normalizeRefCode,
} from "./referral";
import { resolveDurations, resolveTiers, priceFor, DURATIONS } from "./plans";

const S = REFERRAL_DEFAULTS;

describe("referral settings", () => {
  it("defaults to the owner's numbers and clamps bad overrides", () => {
    assert.deepEqual(resolveReferralSettings(""), S);
    assert.equal(S.commissionPct, 20);
    assert.equal(S.minOrderPaise, 1_000_000);
    assert.equal(S.minWithdrawalPaise, 1_500_000);
    const s = resolveReferralSettings(JSON.stringify({ commissionPct: 150, holdDays: -3, enabled: false, tdsPct: "x" }));
    assert.equal(s.commissionPct, 100);
    assert.equal(s.holdDays, 0);
    assert.equal(s.enabled, false);
    assert.equal(s.tdsPct, 0);
    assert.deepEqual(resolveReferralSettings("{broken"), S);
  });
});

describe("qualifies", () => {
  it("needs a pre-GST amount strictly above the minimum", () => {
    assert.equal(qualifies(1_000_000, S), false); // exactly ₹10,000
    assert.equal(qualifies(1_000_001, S), true);
    assert.equal(qualifies(2_000_000, { ...S, enabled: false }), false);
  });
  it("uses the pre-GST amount", () => {
    // ₹11,800 incl. 18% GST = ₹10,000 base → does NOT qualify
    assert.equal(preGstAmount(1_180_000, 18), 1_000_000);
    assert.equal(qualifies(preGstAmount(1_180_000, 18), S), false);
  });
  it("blocks self-referral", () => {
    const ref = { tenantId: "t1", emails: ["Owner@Gym.test"], phones: ["+91 98765 43210"] };
    assert.equal(isSelfReferral({ tenantId: "t1" }, ref), true);
    assert.equal(isSelfReferral({ email: "owner@gym.test " }, ref), true);
    assert.equal(isSelfReferral({ phone: "09876543210" }, ref), true);
    assert.equal(isSelfReferral({ tenantId: "t2", email: "new@x.com", phone: "9000000000" }, ref), false);
    assert.equal(isSelfReferral({ phone: "" }, { ...ref, phones: [""] }), false);
  });
});

describe("commission", () => {
  it("is 20% of the pre-GST amount, in whole paise", () => {
    assert.equal(commissionAmount(1_500_000, S), 300_000); // ₹15,000 → ₹3,000
    assert.equal(commissionAmount(1_234_567, S), 246_913);
    assert.equal(Number.isInteger(commissionAmount(999_999, { ...S, commissionPct: 7 })), true);
  });
  it("is pending during the hold, then available; reversed stays reversed", () => {
    const paid = new Date("2026-11-01T10:00:00Z");
    const availableAt = availableAtFrom(paid, 7);
    assert.equal(commissionState({ status: "earned", availableAt }, new Date("2026-11-07T10:00:00Z")), "pending");
    assert.equal(commissionState({ status: "earned", availableAt }, new Date("2026-11-08T10:00:00Z")), "available");
    assert.equal(commissionState({ status: "reversed", availableAt }, new Date("2027-01-01")), "reversed");
    assert.equal(commissionState({ status: "requested", availableAt }, new Date("2027-01-01")), "requested");
  });
});

describe("withdrawals", () => {
  const now = new Date("2026-12-01");
  const past = new Date("2026-11-01");
  const future = new Date("2026-12-05");
  it("sums balances by state", () => {
    const b = balances(
      [
        { status: "earned", availableAt: past, amount: 1_000_000 },
        { status: "earned", availableAt: future, amount: 300_000 },
        { status: "reversed", availableAt: past, amount: 200_000 },
        { status: "paid", availableAt: past, amount: 50_000 },
      ],
      now,
    );
    assert.deepEqual(b, { available: 1_000_000, pending: 300_000, reversed: 200_000, paid: 50_000, requested: 0 });
  });
  it("needs the minimum available and no open request", () => {
    assert.equal(canWithdraw(1_499_999, S, false), false);
    assert.equal(canWithdraw(1_500_000, S, false), true);
    assert.equal(canWithdraw(2_000_000, S, true), false);
    assert.equal(canWithdraw(0, { ...S, minWithdrawalPaise: 0 }, false), false);
  });
  it("splits TDS", () => {
    assert.deepEqual(tdsSplit(1_500_000, 0), { gross: 1_500_000, tds: 0, net: 1_500_000 });
    assert.deepEqual(tdsSplit(1_500_000, 5), { gross: 1_500_000, tds: 75_000, net: 1_425_000 });
  });
});

describe("helpers", () => {
  it("masks and codes", () => {
    assert.equal(maskAccount("123456789012"), "••••••••9012");
    assert.equal(maskName("Sunrise Yoga"), "Su***** Yo**");
    const code = referralCodeCandidate("demo-gym", () => 0);
    assert.equal(code, "DEMOGAAA");
    assert.equal(normalizeRefCode(" demogaaa "), "DEMOGAAA");
    assert.equal(normalizeRefCode("x"), "");
    assert.equal(normalizeRefCode("<script>"), "");
  });
});

describe("plan durations (Task B)", () => {
  it("applies duration discount overrides and keeps defaults", () => {
    assert.deepEqual(resolveDurations("{}").map((d) => d.discountPct), DURATIONS.map((d) => d.discountPct));
    const json = JSON.stringify({ durations: { "1y": 25 }, starter: { customDomain: true } });
    const d = resolveDurations(json).find((x) => x.id === "1y")!;
    assert.equal(d.discountPct, 25);
    const starter = resolveTiers(json)[0];
    assert.equal(starter.customDomain, true);
    assert.equal(priceFor(starter, d), Math.round(starter.monthlyBase * 12 * 0.75));
  });
});
