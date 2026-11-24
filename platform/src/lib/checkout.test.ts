import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { allocateDiscount, computeTotals, includedGst, normCode, validateCoupon, type CouponLike } from "./checkout";
import { verifyRazorpaySignatureWithSecret, verifyRazorpayWebhook } from "./razorpay";

const coupon = (over: Partial<CouponLike> = {}): CouponLike => ({
  code: "SAVE10", type: "percent", value: 10, minOrder: 0, maxDiscount: 0, startsAt: null, endsAt: null,
  usageLimit: 0, perCustomerLimit: 0, used: 0, firstOrderOnly: false, active: true, ...over,
});

describe("validateCoupon", () => {
  const now = new Date("2026-11-24T10:00:00Z");
  it("percent off, capped by maxDiscount", () => {
    const r = validateCoupon(coupon(), { subtotal: 1999, now });
    assert.ok(r.ok && r.discount === 199 && !r.freeShip);
    const capped = validateCoupon(coupon({ value: 50, maxDiscount: 300 }), { subtotal: 1000, now });
    assert.ok(capped.ok && capped.discount === 300);
  });
  it("flat off never exceeds the subtotal; freeship gives no discount but free delivery", () => {
    const r = validateCoupon(coupon({ type: "flat", value: 500 }), { subtotal: 300, now });
    assert.ok(r.ok && r.discount === 300);
    const f = validateCoupon(coupon({ type: "freeship", value: 0 }), { subtotal: 300, now });
    assert.ok(f.ok && f.discount === 0 && f.freeShip);
  });
  it("rejects inactive, unstarted, expired, used-up and below-minimum codes", () => {
    assert.equal(validateCoupon(null, { subtotal: 100 }).ok, false);
    assert.equal(validateCoupon(coupon({ active: false }), { subtotal: 100, now }).ok, false);
    assert.match((validateCoupon(coupon({ startsAt: new Date("2026-12-01") }), { subtotal: 100, now }) as { error: string }).error, /isn't active yet/);
    assert.match((validateCoupon(coupon({ endsAt: new Date("2026-11-01") }), { subtotal: 100, now }) as { error: string }).error, /expired/);
    assert.match((validateCoupon(coupon({ usageLimit: 5, used: 5 }), { subtotal: 100, now }) as { error: string }).error, /usage limit/);
    assert.match((validateCoupon(coupon({ minOrder: 999 }), { subtotal: 500, now }) as { error: string }).error, /Add ₹499 more/);
  });
  it("first-order-only and per-customer limits (unknown shopper passes until checkout)", () => {
    assert.equal(validateCoupon(coupon({ firstOrderOnly: true }), { subtotal: 500, now, priorOrders: 1 }).ok, false);
    assert.equal(validateCoupon(coupon({ firstOrderOnly: true }), { subtotal: 500, now, priorOrders: 0 }).ok, true);
    assert.equal(validateCoupon(coupon({ firstOrderOnly: true }), { subtotal: 500, now, priorOrders: null }).ok, true);
    assert.match((validateCoupon(coupon({ perCustomerLimit: 1 }), { subtotal: 500, now, customerUses: 1 }) as { error: string }).error, /already used/);
    assert.equal(validateCoupon(coupon({ perCustomerLimit: 2 }), { subtotal: 500, now, customerUses: 1 }).ok, true);
  });
  it("normalises codes", () => assert.equal(normCode("  save 10 "), "SAVE10"));
});

describe("allocateDiscount", () => {
  it("splits in proportion and sums exactly", () => {
    const a = allocateDiscount([1000, 500, 1], 100);
    assert.equal(a.reduce((x, y) => x + y, 0), 100);
    assert.deepEqual(a, [67, 33, 0]);
    assert.deepEqual(allocateDiscount([333, 333, 334], 100), [33, 33, 34]);
    assert.deepEqual(allocateDiscount([100], 500), [100]); // never more than the amount
    assert.deepEqual(allocateDiscount([0, 0], 10), [0, 0]);
  });
});

describe("computeTotals (GST inclusive, discount before tax)", () => {
  it("total = subtotal − discount + shipping + COD; tax on discounted lines + charges at max rate", () => {
    const t = computeTotals({ lines: [{ amount: 1050, gstRate: 5 }, { amount: 1180, gstRate: 18 }], discount: 223, shipping: 59, codFee: 0 });
    assert.equal(t.subtotal, 2230);
    assert.equal(t.total, 2230 - 223 + 59);
    // discount split 105 / 118 → taxable 945 @5% and 1062 @18%; charges 59 @18%
    const expected = includedGst(945, 5) + includedGst(1062, 18) + includedGst(59, 18);
    assert.equal(t.tax, Math.round(expected));
    assert.equal(t.tax, 216);
  });
  it("no GST rates → no tax; discount clamps to subtotal", () => {
    const t = computeTotals({ lines: [{ amount: 400, gstRate: 0 }], discount: 900, shipping: 49, codFee: 25 });
    assert.deepEqual([t.discount, t.total, t.tax], [400, 74, 0]);
  });
});

describe("Razorpay signatures", () => {
  it("checkout signature: HMAC-SHA256(order_id|payment_id, key secret) — known vector", () => {
    const sig = "90511c59f2aa7699da2a34ba3a75734d33a8a58fb5d02eedd9bda84fe5f42f99";
    assert.equal(verifyRazorpaySignatureWithSecret("order_ABC123", "pay_XYZ789", sig, "test_secret_123"), true);
    assert.equal(verifyRazorpaySignatureWithSecret("order_ABC123", "pay_OTHER", sig, "test_secret_123"), false);
    assert.equal(verifyRazorpaySignatureWithSecret("order_ABC123", "pay_XYZ789", sig, "wrong"), false);
  });
  it("webhook signature: HMAC-SHA256(raw body, webhook secret)", () => {
    const body = '{"event":"payment.captured"}';
    assert.equal(verifyRazorpayWebhook(body, "4f463a57dd128675850163391f0311888616d57bccca75c774c9cdb28134f851", "whsec_test"), true);
    assert.equal(verifyRazorpayWebhook(body + " ", "4f463a57dd128675850163391f0311888616d57bccca75c774c9cdb28134f851", "whsec_test"), false);
    assert.equal(verifyRazorpayWebhook(body, "", "whsec_test"), false);
    assert.equal(verifyRazorpayWebhook(body, "abc", ""), false);
  });
});
