import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { DEFAULT_STORE, fromPrice, isSoldOut, mapProduct, maxBuyable, priceOrder, resolveCartLines, totalStock, variantMatrix, paymentMethods, waDigits, type PublicProduct } from "./store";

const product = (over: Partial<PublicProduct>): PublicProduct => ({
  ...mapProduct({ id: "p1", slug: "p1", name: "Tee", category: "Men", price: 500, mrp: 0, images: "[]", description: "", stock: 5, options: "[]", badge: "", featured: false }),
  ...over,
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

describe("variants", () => {
  const opts = [{ name: "Size", values: ["S", "M"] }, { name: "Colour", values: ["Red", "Blue"] }];

  it("builds the Size × Colour matrix and keeps existing variant data", () => {
    const m = variantMatrix(opts);
    assert.deepEqual(m.map((v) => v.title), ["S / Red", "S / Blue", "M / Red", "M / Blue"]);
    const kept = variantMatrix([...opts, { name: "Fit", values: [] }], [{ id: "v9", title: "", options: { Size: "M", Colour: "Blue" }, sku: "X", price: 700, mrp: 0, stock: 3, image: "" }]);
    assert.equal(kept.length, 4);
    assert.deepEqual(kept.find((v) => v.title === "M / Blue"), { id: "v9", title: "M / Blue", options: { Size: "M", Colour: "Blue" }, sku: "X", price: 700, mrp: 0, stock: 3, image: "" });
    assert.deepEqual(variantMatrix([]), []);
  });

  const withVariants = product({
    options: opts, price: 500, mrp: 800, stock: 0,
    variants: [
      { id: "a", title: "S / Red", options: { Size: "S", Colour: "Red" }, sku: "T-S-R", price: 0, mrp: 0, stock: 2, image: "" },
      { id: "b", title: "M / Blue", options: { Size: "M", Colour: "Blue" }, sku: "T-M-B", price: 650, mrp: 0, stock: 0, image: "/b.jpg" },
    ],
  });

  it("prices variant lines from the DB, by id or by options", () => {
    const [byId, byOpts] = resolveCartLines([{ productId: "p1", variantId: "a", qty: 1, options: {} }, { productId: "p1", qty: 1, options: { Size: "S", Colour: "Red" } }], [withVariants]);
    assert.equal(byId.available, true);
    assert.equal(byId.unitPrice, 500); // price 0 = product price
    assert.equal(byId.mrp, 800);
    assert.equal(byId.sku, "T-S-R");
    assert.equal(byOpts.variantId, "a");
    // stock (2) is shared by both lines of the same variant
    assert.equal(byOpts.maxQty, 1);
  });

  it("rejects out-of-stock variants and unknown combinations, allows backorder", () => {
    const [oos] = resolveCartLines([{ productId: "p1", variantId: "b", qty: 1, options: {} }], [withVariants]);
    assert.equal(oos.available, false);
    assert.equal(oos.unitPrice, 650);
    assert.match(oos.error, /out of stock/);
    assert.equal(resolveCartLines([{ productId: "p1", qty: 1, options: { Size: "M", Colour: "Red" } }], [withVariants])[0].available, false);
    const [back] = resolveCartLines([{ productId: "p1", variantId: "b", qty: 3, options: {} }], [{ ...withVariants, allowBackorder: true }]);
    assert.equal(back.available, true);
    const [untracked] = resolveCartLines([{ productId: "p1", variantId: "b", qty: 3, options: {} }], [{ ...withVariants, trackStock: false }]);
    assert.equal(untracked.available, true);
  });

  it("priceOrder carries variantId into order items", () => {
    const r = priceOrder([{ productId: "p1", variantId: "a", qty: 2, options: {} }], [withVariants], { ...DEFAULT_STORE, freeShippingAbove: 0, shippingFee: 40 });
    assert.ok(r.ok);
    assert.equal(r.items[0].variantId, "a");
    assert.deepEqual(r.items[0].options, { Size: "S", Colour: "Red" });
    assert.equal(r.total, 1040);
  });

  it("summarises stock and prices for cards", () => {
    assert.equal(totalStock(withVariants), 2);
    assert.equal(isSoldOut(withVariants), false);
    assert.equal(fromPrice(withVariants), 500);
    assert.equal(maxBuyable(withVariants, 100), 20);
  });
});
