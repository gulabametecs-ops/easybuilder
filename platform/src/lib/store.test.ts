import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { DEFAULT_STORE, priceOrder, paymentMethods, waDigits, type PublicProduct } from "./store";

const product = (over: Partial<PublicProduct>): PublicProduct => ({
  id: "p1", slug: "p1", name: "Tee", category: "Men", price: 500, mrp: 0, images: [], description: "", stock: 5, options: [], badge: "", featured: false, ...over,
});

describe("priceOrder (server-side checkout pricing)", () => {
  const s = { ...DEFAULT_STORE, shippingFee: 49, freeShippingAbove: 999 };

  it("uses DB prices and adds shipping below the free threshold", () => {
    const r = priceOrder([{ productId: "p1", qty: 2, options: {} }], [product({})], s);
    assert.ok(r.ok);
    assert.equal(r.subtotal, 1000);
    assert.equal(r.shipping, 0);
    const r2 = priceOrder([{ productId: "p1", qty: 1, options: {} }], [product({})], s);
    assert.ok(r2.ok && r2.total === 549);
  });

  it("rejects unknown products, missing options, over-stock and bad quantities", () => {
    assert.equal(priceOrder([{ productId: "nope", qty: 1, options: {} }], [product({})], s).ok, false);
    const sized = product({ options: [{ name: "Size", values: ["S", "M"] }] });
    assert.equal(priceOrder([{ productId: "p1", qty: 1, options: {} }], [sized], s).ok, false);
    assert.equal(priceOrder([{ productId: "p1", qty: 1, options: { Size: "XXL" } }], [sized], s).ok, false);
    assert.ok(priceOrder([{ productId: "p1", qty: 1, options: { Size: "M" } }], [sized], s).ok);
    // stock is checked across lines of the same product
    assert.equal(priceOrder([{ productId: "p1", qty: 3, options: { Size: "S" } }, { productId: "p1", qty: 3, options: { Size: "M" } }], [sized], s).ok, false);
    assert.equal(priceOrder([{ productId: "p1", qty: 0, options: {} }], [product({})], s).ok, false);
  });

  it("enforces the minimum order", () => {
    assert.equal(priceOrder([{ productId: "p1", qty: 1, options: {} }], [product({})], { ...s, minOrder: 600 }).ok, false);
  });
});

describe("payment options", () => {
  it("offers UPI / WhatsApp only when configured", () => {
    assert.deepEqual(paymentMethods(DEFAULT_STORE), ["cod"]);
    assert.deepEqual(paymentMethods({ ...DEFAULT_STORE, upiId: "a@upi", whatsappNumber: "98765 43210" }), ["cod", "upi", "whatsapp"]);
    assert.equal(waDigits("98765 43210"), "919876543210");
    assert.equal(waDigits("123"), "");
  });
});
