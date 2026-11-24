import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { DEFAULT_SHIPPING, DEFAULT_STORE, parseStoreSettings, type ShipZone, type StoreSettings } from "./store";
import { findZone, parsePostalResponse, quoteShipping, slabFee } from "./shipping";

const zone = (over: Partial<ShipZone>): ShipZone => ({ id: "z", name: "Zone", states: [], pincodes: [], fee: 0, freeAbove: 0, codAllowed: true, codFee: 0, etaMin: 1, etaMax: 2, ...over });
const store = (sh: Partial<StoreSettings["shipping"]> = {}, over: Partial<StoreSettings> = {}): StoreSettings => ({ ...DEFAULT_STORE, shippingFee: 49, freeShippingAbove: 499, ...over, shipping: { ...DEFAULT_SHIPPING, ...sh } });
const q = (over: Partial<Parameters<typeof quoteShipping>[1]> = {}) => ({ pincode: "560038", state: "Karnataka", subtotal: 300, weightGrams: 500, ...over });

describe("quoteShipping", () => {
  it("defaults match the old flat fee + free-above rule", () => {
    const r = quoteShipping(store(), q());
    assert.deepEqual({ ...r }, { serviceable: true, fee: 49, codAllowed: true, codFee: 0, etaDays: [3, 6], zoneName: "" });
    assert.equal(quoteShipping(store(), q({ subtotal: 499 })).fee, 0);
  });

  it("rejects bad pincodes", () => {
    for (const pincode of ["", "12345", "012345", "abcdef"]) assert.equal(quoteShipping(store(), q({ pincode })).serviceable, false);
  });

  it("matches zones by longest pincode prefix, then by state", () => {
    const zones = [zone({ id: "ka", name: "Karnataka", states: ["karnataka"], fee: 60 }), zone({ id: "blr", name: "Bengaluru", pincodes: ["560"], fee: 30 }), zone({ id: "blr38", name: "Indiranagar", pincodes: ["560038"], fee: 0 })];
    assert.equal(findZone(zones, "560038", "Karnataka")?.id, "blr38");
    assert.equal(findZone(zones, "560001", "Karnataka")?.id, "blr");
    assert.equal(findZone(zones, "575001", "KARNATAKA")?.id, "ka");
    assert.equal(findZone(zones, "110001", "Delhi"), null);
    const r = quoteShipping(store({ zones }), q({ pincode: "560001" }));
    assert.equal(r.fee, 30);
    assert.equal(r.zoneName, "Bengaluru");
    assert.deepEqual(r.etaDays, [2, 3]); // dispatch 1 + zone 1–2
  });

  it("zone free-above overrides the store default; 0 inherits", () => {
    const zones = [zone({ pincodes: ["11"], fee: 80, freeAbove: 999 }), zone({ pincodes: ["40"], fee: 70 })];
    assert.equal(quoteShipping(store({ zones }), q({ pincode: "110001", subtotal: 600 })).fee, 80);
    assert.equal(quoteShipping(store({ zones }), q({ pincode: "110001", subtotal: 999 })).fee, 0);
    assert.equal(quoteShipping(store({ zones }), q({ pincode: "400001", subtotal: 600 })).fee, 0);
  });

  it("weight slabs replace the flat fee; zone fee is added on top", () => {
    const weightSlabs = [{ upToGrams: 1000, fee: 50 }, { upToGrams: 500, fee: 40 }, { upToGrams: 5000, fee: 120 }];
    assert.equal(slabFee(weightSlabs, 300), 40);
    assert.equal(slabFee(weightSlabs, 800), 50);
    assert.equal(slabFee(weightSlabs, 9000), 120);
    assert.equal(slabFee([], 100), null);
    const s = store({ weightSlabs, zones: [zone({ states: ["Assam"], fee: 30 })] });
    assert.equal(quoteShipping(s, q({ weightGrams: 2000 })).fee, 120);
    assert.equal(quoteShipping(s, q({ weightGrams: 2000, state: "Assam", pincode: "781001" })).fee, 150);
  });

  it("COD: store switch, zone rule, fee and reason", () => {
    const zones = [zone({ states: ["Assam"], codAllowed: false }), zone({ states: ["Kerala"], codFee: 40 })];
    const s = store({ zones, codFee: 25 });
    assert.equal(quoteShipping(s, q()).codFee, 25);
    assert.equal(quoteShipping(s, q({ state: "Kerala", pincode: "682016" })).codFee, 40);
    const assam = quoteShipping(s, q({ state: "Assam", pincode: "781001", paymentMethod: "cod" }));
    assert.equal(assam.codAllowed, false);
    assert.equal(assam.codFee, 0);
    assert.match(assam.reason ?? "", /Cash on delivery/);
    assert.equal(quoteShipping(store({}, { codEnabled: false }), q()).codAllowed, false);
  });

  it("service area: zones-only and local pincode whitelist", () => {
    const zonesOnly = store({ serviceArea: "zones", zones: [zone({ pincodes: ["560"] })] });
    assert.equal(quoteShipping(zonesOnly, q()).serviceable, true);
    assert.equal(quoteShipping(zonesOnly, q({ pincode: "110001", state: "Delhi" })).serviceable, false);
    const local = store({ serviceArea: "local", localPincodes: ["560038", "56010"] });
    assert.equal(quoteShipping(local, q()).serviceable, true);
    assert.equal(quoteShipping(local, q({ pincode: "560102" })).serviceable, true);
    const out = quoteShipping(local, q({ pincode: "560001" }));
    assert.equal(out.serviceable, false);
    assert.match(out.reason ?? "", /locally/);
  });

  it("parseStoreSettings fills shipping defaults and strips courier secrets", () => {
    const s = parseStoreSettings(JSON.stringify({ shippingFee: 10, shipping: { dispatchDays: 3, pickup: { city: "Pune" } }, courier: { delhivery: { token: "SECRET" } } }));
    assert.equal(s.shipping.dispatchDays, 3);
    assert.equal(s.shipping.etaMax, DEFAULT_SHIPPING.etaMax);
    assert.equal(s.shipping.pickup.city, "Pune");
    assert.equal(s.shipping.pickup.pincode, "");
    assert.ok(!JSON.stringify(s).includes("SECRET"));
    assert.deepEqual(parseStoreSettings("{}").shipping, DEFAULT_SHIPPING);
  });
});

describe("parsePostalResponse (India Post)", () => {
  it("reads district/state; null on errors", () => {
    const ok = [{ Message: "Number of pincode(s) found:3", Status: "Success", PostOffice: [{ Name: "Indiranagar", Block: "Bangalore North", District: "Bangalore", State: "Karnataka" }] }];
    assert.deepEqual(parsePostalResponse(ok), { city: "Bangalore", district: "Bangalore", state: "Karnataka" });
    assert.equal(parsePostalResponse([{ Message: "No records found", Status: "Error", PostOffice: null }]), null);
    assert.equal(parsePostalResponse(null), null);
  });
});
