import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { csvObjects, parseCsv, toCsv } from "./csv";
import { csvToProducts, PRODUCT_CSV_HEADER, productCsvRows } from "./productCsv";
import { mapProduct } from "./store";

describe("csv", () => {
  it("round-trips quotes, commas and newlines, and neutralises formulas", () => {
    const csv = toCsv(["a", "b"], [["x, y", 'say "hi"'], ["line1\nline2", "=SUM(A1)"], [-5, ""]]);
    assert.deepEqual(parseCsv(csv), [["a", "b"], ["x, y", 'say "hi"'], ["line1\nline2", "'=SUM(A1)"], ["-5", ""]]);
  });
});

describe("product CSV", () => {
  it("groups variant rows by handle and validates", () => {
    const text = [
      "handle,name,price,stock,option1_name,option1_value,option2_name,option2_value,variant_price,variant_stock,tags,images",
      "kurta,Kurta,899,,Size,S,Colour,Red,,4,\"cotton, festive\",https://x/a.jpg | https://x/b.jpg",
      "kurta,,,,Size,M,Colour,Red,949,2,,",
      "bottle,Bottle,₹1,299,12,,,,,,,",
      ",,,,,,,,,,,",
      "nameless,,0,,,,,,,,,",
    ].join("\n");
    const { drafts, errors } = csvToProducts(csvObjects(text));
    assert.equal(drafts.length, 2);
    const k = drafts[0];
    assert.equal(k.handle, "kurta");
    assert.deepEqual(k.options, [{ name: "Size", values: ["S", "M"] }, { name: "Colour", values: ["Red"] }]);
    assert.equal(k.variants.length, 2);
    assert.equal(k.variants[1].price, 949);
    assert.deepEqual(k.tags, ["cotton", "festive"]);
    assert.equal(k.images.length, 2);
    assert.equal(drafts[1].price, 1); // "₹1,299" unquoted splits into two cells: price "₹1"
    assert.equal(errors.length, 1);
  });

  it("exports what it imports", () => {
    const p = { ...mapProduct({ id: "1", slug: "tee", name: "Tee", category: "Men", price: 500, mrp: 0, images: "[]", description: "", stock: 0, options: JSON.stringify([{ name: "Size", values: ["S", "M"] }]), badge: "", featured: false, sku: "TEE", tags: "[\"basic\"]",
      variants: [{ id: "v1", title: "S", options: "{\"Size\":\"S\"}", sku: "TEE-S", price: 0, mrp: 0, stock: 3, image: "" }, { id: "v2", title: "M", options: "{\"Size\":\"M\"}", sku: "TEE-M", price: 550, mrp: 0, stock: 1, image: "" }] }), published: true };
    const { drafts, errors } = csvToProducts(csvObjects(toCsv(PRODUCT_CSV_HEADER, productCsvRows([p]))));
    assert.deepEqual(errors, []);
    assert.equal(drafts[0].sku, "TEE");
    assert.deepEqual(drafts[0].variants.map((v) => [v.options.Size, v.sku, v.price, v.stock]), [["S", "TEE-S", 0, 3], ["M", "TEE-M", 550, 1]]);
    assert.deepEqual(drafts[0].tags, ["basic"]);
  });
});
