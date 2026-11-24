import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  buildDelhiveryPayload, buildShiprocketOrder, courierPublic, errorText, parseCourierCreds, parseDelhiveryCreate, parseDelhiveryTrack,
  parseShiprocketAwb, parseShiprocketCreate, parseShiprocketTrack, type ShipmentInput,
} from "./couriers";

const shipment: ShipmentInput = {
  orderNo: 1042, orderDate: new Date("2026-11-20T09:30:00Z"), customerName: "Asha Rani Verma", phone: "+91 98765-43210", email: "asha@example.com",
  address: "12 MG Road & Sons; Flat #4", addressLine2: "Near Metro", city: "Bengaluru", state: "Karnataka", pincode: "560038",
  items: [{ name: "Linen Shirt", sku: "LS-M", qty: 2, price: 1299, hsn: "6205", gstRate: 5 }, { name: "Cap", sku: "", qty: 1, price: 399, hsn: "", gstRate: 0 }],
  subtotal: 2997, shipping: 0, discount: 0, total: 2997, cod: true, weightGrams: 750, lengthCm: 25, breadthCm: 20, heightCm: 5,
  pickup: { name: "QA Store", phone: "9123456789", email: "", address: "5 Industrial Area", city: "Pune", state: "Maharashtra", pincode: "411001" },
  sellerName: "QA Fashion Pvt Ltd",
};

describe("Shiprocket request/response", () => {
  it("builds an adhoc order", () => {
    const b = buildShiprocketOrder(shipment, "Warehouse-1");
    assert.equal(b.order_id, "1042");
    assert.equal(b.order_date, "2026-11-20 09:30");
    assert.equal(b.pickup_location, "Warehouse-1");
    assert.equal(b.billing_customer_name, "Asha");
    assert.equal(b.billing_last_name, "Rani Verma");
    assert.equal(b.billing_phone, "9876543210");
    assert.equal(b.payment_method, "COD");
    assert.equal(b.weight, 0.75);
    assert.equal(b.order_items[1].sku, "ITEM-2");
    assert.equal(b.order_items[0].units, 2);
    assert.equal(b.sub_total, 2997);
    assert.equal(buildShiprocketOrder({ ...shipment, cod: false, weightGrams: 0 }, "").payment_method, "Prepaid");
    assert.equal(buildShiprocketOrder({ ...shipment, weightGrams: 0 }, "").pickup_location, "Primary");
  });

  it("parses create / AWB responses", () => {
    assert.deepEqual(parseShiprocketCreate({ order_id: 123, shipment_id: 456, status: "NEW", status_code: 1, awb_code: "", courier_name: "" }), { shipmentId: "456", awb: "", courier: "" });
    assert.equal(parseShiprocketCreate({ message: "Oops", errors: {} }), null);
    assert.deepEqual(parseShiprocketAwb({ awb_assign_status: 1, response: { data: { awb_code: "1234567890", courier_name: "Xpressbees Surface", shipment_id: 456 } } }), { awb: "1234567890", courier: "Xpressbees Surface" });
    const bad = parseShiprocketAwb({ awb_assign_status: 0, response: { data: { awb_assign_error: "Insufficient wallet balance" } } });
    assert.deepEqual(bad, { error: "Insufficient wallet balance" });
  });

  it("parses tracking", () => {
    const t = parseShiprocketTrack({ tracking_data: { track_status: 1, shipment_status: 7, shipment_track: [{ awb_code: "123", current_status: "Delivered", delivered_date: "2026-11-23 14:05:00" }], shipment_track_activities: [{ date: "2026-11-23 14:05:00", activity: "Delivered", location: "Bengaluru" }, { date: "2026-11-22 08:00:00", activity: "Out for delivery", location: "Bengaluru" }], track_url: "https://shiprocket.co/tracking/123" } });
    assert.ok(t.ok && t.state === "delivered" && t.deliveredAt === "2026-11-23 14:05:00" && t.events.length === 2);
    const transit = parseShiprocketTrack({ tracking_data: { shipment_track: [{ current_status: "IN TRANSIT" }], shipment_track_activities: [] } });
    assert.ok(transit.ok && transit.state === "in_transit" && transit.deliveredAt === null);
    const rto = parseShiprocketTrack({ tracking_data: { shipment_track: [{ current_status: "RTO Delivered" }] } });
    assert.ok(rto.ok && rto.state === "rto");
    assert.equal(parseShiprocketTrack({ tracking_data: { track_status: 0, error: "Aahh! There is no activities found in our DB for this AWB." } }).ok, false);
    assert.equal(parseShiprocketTrack({}).ok, false);
  });
});

describe("Delhivery request/response", () => {
  it("builds the format=json&data= body with forbidden characters removed", () => {
    const body = buildDelhiveryPayload(shipment, "QA-WH");
    assert.ok(body.startsWith("format=json&data="));
    const data = JSON.parse(body.slice("format=json&data=".length));
    const s = data.shipments[0];
    assert.equal(data.pickup_location.name, "QA-WH");
    assert.ok(!/[&#;%]/.test(s.add));
    assert.equal(s.add, "12 MG Road Sons Flat 4, Near Metro");
    assert.equal(s.payment_mode, "COD");
    assert.equal(s.cod_amount, "2997");
    assert.equal(s.weight, "750");
    assert.equal(s.quantity, "3");
    assert.equal(s.phone, "9876543210");
    assert.equal(s.return_pin, "411001");
    assert.equal(JSON.parse(buildDelhiveryPayload({ ...shipment, cod: false }, "x").slice(17)).shipments[0].cod_amount, "0");
  });

  it("parses create responses", () => {
    assert.deepEqual(parseDelhiveryCreate({ success: true, packages: [{ waybill: "1490610012345", status: "Success", remarks: [""], refnum: "1042" }], rmk: "" }), { awb: "1490610012345" });
    const err = parseDelhiveryCreate({ success: false, packages: [{ waybill: "", status: "Fail", remarks: ["Crashing while saving package due to exception 'ClientWarehouse matching query does not exist.'"] }], rmk: "an internal Error has occurred" });
    assert.ok("error" in err && /ClientWarehouse/.test(err.error));
    assert.ok("error" in parseDelhiveryCreate(null));
  });

  it("parses tracking", () => {
    const fixture = { ShipmentData: [{ Shipment: { AWB: "149", Status: { Status: "Delivered", StatusType: "DL", StatusDateTime: "2026-11-23T14:05:00", StatusLocation: "Bengaluru_Hub" }, Scans: [
      { ScanDetail: { Scan: "Manifested", Instructions: "Shipment picked up", ScanDateTime: "2026-11-21T10:00:00", ScannedLocation: "Pune_Hub" } },
      { ScanDetail: { Scan: "Delivered", Instructions: "Delivered to consignee", ScanDateTime: "2026-11-23T14:05:00", ScannedLocation: "Bengaluru_Hub" } },
    ] } }] };
    const t = parseDelhiveryTrack(fixture);
    assert.ok(t.ok && t.state === "delivered" && t.deliveredAt === "2026-11-23T14:05:00");
    assert.ok(t.ok && t.events[0].status === "Delivered to consignee"); // newest first
    const rto = parseDelhiveryTrack({ ShipmentData: [{ Shipment: { Status: { Status: "RTO", StatusType: "RT" } } }] });
    assert.ok(rto.ok && rto.state === "rto");
    const transit = parseDelhiveryTrack({ ShipmentData: [{ Shipment: { Status: { Status: "In Transit", StatusType: "UD" } } }] });
    assert.ok(transit.ok && transit.state === "in_transit");
    assert.equal(parseDelhiveryTrack({ Error: "No such waybill or Order Id found" }).ok, false);
  });
});

describe("credentials", () => {
  it("never exposes secrets in the public view", () => {
    const c = parseCourierCreds(JSON.stringify({ courier: { shiprocket: { email: "a@b.in", password: "pw" }, delhivery: { token: "tok", pickupName: "WH" } } }));
    assert.equal(c.shiprocket.pickupLocation, "Primary");
    const pub = JSON.stringify(courierPublic(c));
    assert.ok(!pub.includes("pw") && !pub.includes("tok"));
    assert.ok(courierPublic(c).shiprocket.hasPassword && courierPublic(c).delhivery.hasToken);
    assert.equal(parseCourierCreds("not json").delhivery.token, "");
  });

  it("turns partner errors into readable messages", () => {
    assert.match(errorText({ ok: false, status: 422, json: { message: "Oops! Invalid Data.", errors: { billing_pincode: ["The billing pincode must be 6 digits."] } }, text: "" }, "Shiprocket"), /billing pincode must be 6 digits/);
    assert.match(errorText({ ok: false, status: 401, json: null, text: "" }, "Delhivery"), /rejected the credentials/);
    assert.match(errorText({ ok: false, status: 0, json: null, text: "The courier didn't respond in time." }, "X"), /respond in time/);
  });
});
