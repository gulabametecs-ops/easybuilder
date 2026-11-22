import { test } from "node:test";
import assert from "node:assert/strict";
import { formatPrice, emi, mapProperty } from "./property";

test("formatPrice: Indian lakh / crore style", () => {
  assert.equal(formatPrice(0), "Price on request");
  assert.equal(formatPrice(18000), "₹18,000");
  assert.equal(formatPrice(4500000), "₹45 Lakh");
  assert.equal(formatPrice(4550000), "₹45.5 Lakh");
  assert.equal(formatPrice(12500000), "₹1.25 Cr");
});

test("emi: standard reducing-balance formula", () => {
  // ₹50 L at 8.5% for 20 years ≈ ₹43,391
  assert.equal(emi(5_000_000, 8.5, 20), 43391);
  assert.equal(emi(1_200_000, 0, 1), 100000);
  assert.equal(emi(0, 8, 20), 0);
});

test("mapProperty: bad JSON and unknown enums fall back safely", () => {
  const p = mapProperty({
    id: "1", slug: "x", title: "X", purpose: "weird", propertyType: "apartment", price: 1, priceNote: "", deposit: 0,
    maintenance: 0, bhk: "", areaSqft: 0, furnishing: "", bathrooms: 0, floor: "", facing: "", parking: "", availableFrom: "",
    possession: "", rera: "", sharing: "", foodIncluded: false, gender: "", locality: "", city: "", address: "", mapUrl: "",
    summary: "", description: "", highlights: "not json", amenities: '["gym", 3]', coverImage: "", gallery: '["a.jpg",""]',
    floorPlans: '[{"label":"2 BHK","image":""}, null]', brochureUrl: "", videoUrl: "", status: "??", featured: false,
  });
  assert.equal(p.purpose, "sale");
  assert.equal(p.status, "available");
  assert.deepEqual(p.highlights, []);
  assert.deepEqual(p.amenities, ["gym"]);
  assert.deepEqual(p.gallery, ["a.jpg"]);
  assert.equal(p.floorPlans.length, 1);
});
