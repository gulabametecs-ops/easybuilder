import type { PickupAddress } from "./store";

// Delivery partners over plain fetch (no SDKs). Server-only: credentials live in SiteConfig.store JSON
// under `courier` and never leave the server (parseStoreSettings strips them).
//   Shiprocket: https://apidocs.shiprocket.in  (email/password → bearer token, ~10 days)
//   Delhivery:  https://one.delhivery.com/developer-portal  (static API token)
// Request builders and response parsers are pure + exported so they're unit-tested with fixtures.

export type CourierCreds = {
  shiprocket: { email: string; password: string; pickupLocation: string };
  delhivery: { token: string; pickupName: string; staging: boolean };
};
export const DEFAULT_COURIER: CourierCreds = {
  shiprocket: { email: "", password: "", pickupLocation: "Primary" },
  delhivery: { token: "", pickupName: "", staging: false },
};

export function parseCourierCreds(storeJson: string | null | undefined): CourierCreds {
  try {
    const c = (JSON.parse(storeJson || "{}") as { courier?: Partial<CourierCreds> }).courier ?? {};
    return { shiprocket: { ...DEFAULT_COURIER.shiprocket, ...c.shiprocket }, delhivery: { ...DEFAULT_COURIER.delhivery, ...c.delhivery } };
  } catch {
    return { shiprocket: { ...DEFAULT_COURIER.shiprocket }, delhivery: { ...DEFAULT_COURIER.delhivery } };
  }
}

/** What the admin UI may see: everything except the password/token. */
export type CourierPublic = {
  shiprocket: { email: string; pickupLocation: string; hasPassword: boolean };
  delhivery: { pickupName: string; staging: boolean; hasToken: boolean };
};
export function courierPublic(c: CourierCreds): CourierPublic {
  return {
    shiprocket: { email: c.shiprocket.email, pickupLocation: c.shiprocket.pickupLocation, hasPassword: !!c.shiprocket.password },
    delhivery: { pickupName: c.delhivery.pickupName, staging: c.delhivery.staging, hasToken: !!c.delhivery.token },
  };
}
export const shiprocketReady = (c: CourierCreds) => !!(c.shiprocket.email && c.shiprocket.password);
export const delhiveryReady = (c: CourierCreds) => !!(c.delhivery.token && c.delhivery.pickupName);

// ─── Common shapes ──────────────────────────────────────────────────────────
export type ShipmentInput = {
  orderNo: number;
  orderDate: Date;
  customerName: string;
  phone: string;
  email: string;
  address: string;
  addressLine2: string;
  city: string;
  state: string;
  pincode: string;
  items: { name: string; sku: string; qty: number; price: number; hsn: string; gstRate: number }[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  cod: boolean;
  weightGrams: number;
  lengthCm: number;
  breadthCm: number;
  heightCm: number;
  pickup: PickupAddress;
  sellerName: string;
};
export type ShipResult =
  | { ok: true; shipmentRef: string; awb: string; courier: string; trackingUrl: string; note: string }
  | { ok: false; error: string; shipmentRef?: string };
export type TrackEvent = { at: string; status: string; location: string };
export type TrackResult =
  | { ok: true; state: "in_transit" | "out_for_delivery" | "delivered" | "rto" | "cancelled" | "pending"; label: string; deliveredAt: string | null; events: TrackEvent[] }
  | { ok: false; error: string };

type Http = { ok: boolean; status: number; json: unknown; text: string };

/** fetch with a timeout; never throws (network errors come back as status 0). */
async function http(url: string, init: RequestInit = {}, timeoutMs = 15_000): Promise<Http> {
  try {
    const res = await fetch(url, { ...init, signal: AbortSignal.timeout(timeoutMs), cache: "no-store" });
    const text = await res.text();
    let json: unknown = null;
    try { json = JSON.parse(text); } catch { /* not JSON */ }
    return { ok: res.ok, status: res.status, json, text };
  } catch (e) {
    const timeout = e instanceof Error && (e.name === "TimeoutError" || e.name === "AbortError");
    return { ok: false, status: 0, json: null, text: timeout ? "The courier didn't respond in time. Please try again." : "Couldn't reach the courier. Check your internet connection and try again." };
  }
}

const ymd = (d: Date) => d.toISOString().slice(0, 10);
const splitName = (n: string) => { const [first, ...rest] = n.trim().split(/\s+/); return { first: first || n, last: rest.join(" ") }; };
const digits10 = (p: string) => p.replace(/\D/g, "").slice(-10);

/** Pull a readable message out of a partner error body. */
export function errorText(r: Http, fallback: string): string {
  if (r.status === 0) return r.text;
  const j = r.json as Record<string, unknown> | null;
  const errs = j?.errors && typeof j.errors === "object" ? Object.values(j.errors as Record<string, unknown>).flat().filter((x) => typeof x === "string") : [];
  const msg = [typeof j?.message === "string" ? j.message : "", ...(errs as string[]), typeof j?.rmk === "string" ? j.rmk : "", typeof j?.error === "string" ? j.error : "", typeof j?.detail === "string" ? j.detail : ""]
    .filter(Boolean).join(" · ");
  if (r.status === 401 || r.status === 403) return `${fallback}: the courier rejected the credentials (${r.status}). Re-check them under Shipping & delivery.`;
  return `${fallback}${msg ? `: ${msg.slice(0, 300)}` : r.status ? ` (HTTP ${r.status})` : ""}`;
}

// ─── Shiprocket ─────────────────────────────────────────────────────────────
const SR = "https://apiv2.shiprocket.in/v1/external";
const srTokens = new Map<string, { token: string; exp: number }>();

async function srToken(c: CourierCreds["shiprocket"], fresh = false): Promise<{ ok: true; token: string } | { ok: false; error: string }> {
  const key = `${c.email}\n${c.password}`;
  const hit = srTokens.get(key);
  if (!fresh && hit && hit.exp > Date.now()) return { ok: true, token: hit.token };
  const r = await http(`${SR}/auth/login`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: c.email, password: c.password }) });
  const token = (r.json as { token?: string } | null)?.token;
  if (!r.ok || !token) {
    srTokens.delete(key);
    return { ok: false, error: r.status === 400 || r.status === 401 || r.status === 403 ? "Shiprocket login failed — check the API user email and password (Shiprocket → Settings → API → Create API user)." : errorText(r, "Shiprocket login failed") };
  }
  srTokens.set(key, { token, exp: Date.now() + 8 * 86_400_000 }); // tokens last 10 days
  return { ok: true, token };
}

async function srCall(c: CourierCreds["shiprocket"], path: string, init: RequestInit = {}): Promise<Http | { ok: false; status: -1; error: string }> {
  for (let attempt = 0; attempt < 2; attempt++) {
    const t = await srToken(c, attempt > 0);
    if (!t.ok) return { ok: false, status: -1, error: t.error };
    const r = await http(`${SR}${path}`, { ...init, headers: { "Content-Type": "application/json", Authorization: `Bearer ${t.token}`, ...init.headers } });
    if (r.status !== 401) return r; // 401 → token expired early; log in again once
  }
  return { ok: false, status: -1, error: "Shiprocket rejected the login token." };
}
const srErr = (r: Http | { status: -1; error: string }, what: string) => ("error" in r ? r.error : errorText(r, what));

export function buildShiprocketOrder(s: ShipmentInput, pickupLocation: string) {
  const { first, last } = splitName(s.customerName);
  return {
    order_id: String(s.orderNo),
    order_date: `${ymd(s.orderDate)} ${s.orderDate.toISOString().slice(11, 16)}`,
    pickup_location: pickupLocation || "Primary",
    billing_customer_name: first,
    billing_last_name: last,
    billing_address: s.address.slice(0, 190),
    billing_address_2: s.addressLine2.slice(0, 190),
    billing_city: s.city,
    billing_pincode: s.pincode,
    billing_state: s.state,
    billing_country: "India",
    billing_email: s.email,
    billing_phone: digits10(s.phone),
    shipping_is_billing: true,
    order_items: s.items.map((i, k) => ({ name: i.name.slice(0, 120), sku: i.sku || `ITEM-${k + 1}`, units: i.qty, selling_price: i.price, discount: 0, tax: i.gstRate || "", hsn: i.hsn || "" })),
    payment_method: s.cod ? "COD" : "Prepaid",
    shipping_charges: s.shipping,
    total_discount: s.discount,
    sub_total: s.total, // Shiprocket collects sub_total (+ shipping) on COD — send the full payable amount
    length: Math.max(1, s.lengthCm),
    breadth: Math.max(1, s.breadthCm),
    height: Math.max(1, s.heightCm),
    weight: Math.max(0.05, Math.round(s.weightGrams) / 1000), // kg
  };
}

/** /orders/create/adhoc → { order_id, shipment_id, status_code, awb_code? } */
export function parseShiprocketCreate(j: unknown): { shipmentId: string; awb: string; courier: string } | null {
  const o = j as { shipment_id?: number | string; awb_code?: string; courier_name?: string } | null;
  return o?.shipment_id ? { shipmentId: String(o.shipment_id), awb: o.awb_code || "", courier: o.courier_name || "" } : null;
}

/** /courier/assign/awb → { awb_assign_status: 1, response: { data: { awb_code, courier_name } } } */
export function parseShiprocketAwb(j: unknown): { awb: string; courier: string } | { error: string } {
  const o = j as { awb_assign_status?: number; message?: string; response?: { data?: { awb_code?: string; courier_name?: string; awb_assign_error?: string } } } | null;
  const d = o?.response?.data;
  if (o?.awb_assign_status === 1 && d?.awb_code) return { awb: String(d.awb_code), courier: d.courier_name || "Shiprocket" };
  return { error: d?.awb_assign_error || o?.message || "Shiprocket couldn't assign a courier (check wallet balance and pincode serviceability)." };
}

export const shiprocketTrackUrl = (awb: string) => `https://shiprocket.co/tracking/${encodeURIComponent(awb)}`;

export async function shiprocketTest(c: CourierCreds["shiprocket"]): Promise<{ ok: true; note: string } | { ok: false; error: string }> {
  const t = await srToken(c, true);
  if (!t.ok) return t;
  const r = await http(`${SR}/settings/company/pickup`, { headers: { Authorization: `Bearer ${t.token}` } });
  const names = ((r.json as { data?: { shipping_address?: { pickup_location?: string }[] } } | null)?.data?.shipping_address ?? []).map((a) => a.pickup_location).filter(Boolean) as string[];
  if (names.length && !names.includes(c.pickupLocation)) return { ok: false, error: `Logged in, but pickup location "${c.pickupLocation}" doesn't exist in Shiprocket. Yours: ${names.join(", ")}.` };
  return { ok: true, note: names.length ? `Connected. Pickup locations: ${names.join(", ")}.` : "Connected to Shiprocket." };
}

/** Create order (or reuse `existingShipmentId`), assign AWB, then best-effort pickup request. */
export async function shiprocketShip(c: CourierCreds["shiprocket"], s: ShipmentInput, existingShipmentId = ""): Promise<ShipResult> {
  let shipmentId = existingShipmentId;
  let awb = "";
  let courier = "";
  if (!shipmentId) {
    const r = await srCall(c, "/orders/create/adhoc", { method: "POST", body: JSON.stringify(buildShiprocketOrder(s, c.pickupLocation)) });
    const created = r.ok && "json" in r ? parseShiprocketCreate(r.json) : null;
    if (!created) return { ok: false, error: srErr(r, "Shiprocket couldn't create the order") };
    ({ shipmentId, awb, courier } = created);
  }
  if (!awb) {
    const r = await srCall(c, "/courier/assign/awb", { method: "POST", body: JSON.stringify({ shipment_id: Number(shipmentId) || shipmentId }) });
    const a = "json" in r ? parseShiprocketAwb(r.json) : { error: srErr(r, "Shiprocket AWB") };
    if ("error" in a) return { ok: false, error: `Order created in Shiprocket (shipment ${shipmentId}) but no courier was assigned: ${a.error}`, shipmentRef: shipmentId };
    ({ awb, courier } = a);
  }
  const p = await srCall(c, "/courier/generate/pickup", { method: "POST", body: JSON.stringify({ shipment_id: [Number(shipmentId) || shipmentId] }) });
  const when = ((p as Http).json as { response?: { pickup_scheduled_date?: string } } | null)?.response?.pickup_scheduled_date;
  return {
    ok: true, shipmentRef: shipmentId, awb, courier: courier || "Shiprocket", trackingUrl: shiprocketTrackUrl(awb),
    note: p.ok ? `Pickup requested${when ? ` for ${when}` : ""}.` : "Pickup not requested automatically — schedule it in Shiprocket.",
  };
}

export async function shiprocketDocs(c: CourierCreds["shiprocket"], shipmentId: string, kind: "label" | "manifest"): Promise<{ ok: true; url: string } | { ok: false; error: string }> {
  const ids = JSON.stringify({ shipment_id: [Number(shipmentId) || shipmentId] });
  if (kind === "label") {
    const r = await srCall(c, "/courier/generate/label", { method: "POST", body: ids });
    const url = "json" in r ? (r.json as { label_url?: string } | null)?.label_url : "";
    return url ? { ok: true, url } : { ok: false, error: srErr(r, "Shiprocket label") };
  }
  // ponytail: a manifest already generated elsewhere errors here; reprinting needs /manifests/print with the SR order id (not stored).
  const r = await srCall(c, "/manifests/generate", { method: "POST", body: ids });
  const url = "json" in r ? (r.json as { manifest_url?: string } | null)?.manifest_url : "";
  return url ? { ok: true, url } : { ok: false, error: srErr(r, "Shiprocket manifest (if it was already generated, download it from Shiprocket → Manifests)") };
}

/** /courier/track/awb/{awb} → { tracking_data: { track_status, shipment_track[], shipment_track_activities[], error? } } */
export function parseShiprocketTrack(j: unknown): TrackResult {
  const td = (j as { tracking_data?: Record<string, unknown> } | null)?.tracking_data as
    | { track_status?: number; error?: string; shipment_track?: { current_status?: string; delivered_date?: string }[]; shipment_track_activities?: { date?: string; activity?: string; location?: string }[] }
    | undefined;
  if (!td) return { ok: false, error: "Unexpected tracking response from Shiprocket." };
  if (td.error && !td.shipment_track?.length) return { ok: false, error: td.error };
  const st = td.shipment_track?.[0];
  const label = st?.current_status || "Pending";
  const events = (td.shipment_track_activities ?? []).map((a) => ({ at: a.date || "", status: a.activity || "", location: a.location || "" }));
  const delivered = st?.delivered_date && /^\d{4}-/.test(st.delivered_date) ? st.delivered_date : null;
  return { ok: true, state: classify(label), label, deliveredAt: classify(label) === "delivered" ? delivered ?? events[0]?.at ?? null : null, events };
}

export async function shiprocketTrack(c: CourierCreds["shiprocket"], awb: string): Promise<TrackResult> {
  const r = await srCall(c, `/courier/track/awb/${encodeURIComponent(awb)}`);
  if (!r.ok) return { ok: false, error: srErr(r, "Shiprocket tracking") };
  return parseShiprocketTrack((r as Http).json);
}

// ─── Delhivery ──────────────────────────────────────────────────────────────
const DL = (c: CourierCreds["delhivery"]) => (c.staging ? "https://staging-express.delhivery.com" : "https://track.delhivery.com");
const dlHeaders = (c: CourierCreds["delhivery"]) => ({ Authorization: `Token ${c.token}`, Accept: "application/json" });
// Delhivery's create API rejects these characters in any field.
const dlClean = (s: string) => String(s ?? "").replace(/[&#%;\\"]/g, " ").replace(/\s+/g, " ").trim();

export function buildDelhiveryPayload(s: ShipmentInput, pickupName: string) {
  const data = {
    shipments: [{
      name: dlClean(s.customerName),
      add: dlClean([s.address, s.addressLine2].filter(Boolean).join(", ")),
      pin: s.pincode,
      city: dlClean(s.city),
      state: dlClean(s.state),
      country: "India",
      phone: digits10(s.phone),
      order: String(s.orderNo),
      payment_mode: s.cod ? "COD" : "Prepaid",
      cod_amount: s.cod ? String(s.total) : "0",
      total_amount: String(s.total),
      products_desc: dlClean(s.items.map((i) => `${i.name} x${i.qty}`).join(", ")).slice(0, 200),
      hsn_code: s.items.map((i) => i.hsn).filter(Boolean)[0] ?? "",
      quantity: String(s.items.reduce((n, i) => n + i.qty, 0)),
      weight: String(Math.max(1, Math.round(s.weightGrams))), // grams
      shipment_length: String(s.lengthCm),
      shipment_width: String(s.breadthCm),
      shipment_height: String(s.heightCm),
      order_date: s.orderDate.toISOString(),
      seller_name: dlClean(s.sellerName),
      seller_add: dlClean(s.pickup.address),
      return_name: dlClean(s.pickup.name || s.sellerName),
      return_add: dlClean(s.pickup.address),
      return_city: dlClean(s.pickup.city),
      return_state: dlClean(s.pickup.state),
      return_pin: s.pickup.pincode,
      return_phone: digits10(s.pickup.phone),
      return_country: "India",
      waybill: "", // auto-assigned
      shipping_mode: "Surface",
    }],
    pickup_location: { name: pickupName },
  };
  // Documented format: raw `format=json&data=<json>` body (the JSON itself isn't URL-encoded).
  return `format=json&data=${JSON.stringify(data)}`;
}

/** /api/cmu/create.json → { success, packages: [{ waybill, status, remarks[] }], rmk } */
export function parseDelhiveryCreate(j: unknown): { awb: string } | { error: string } {
  const o = j as { success?: boolean; rmk?: string; packages?: { waybill?: string; status?: string; remarks?: string[] | string }[] } | null;
  const p = o?.packages?.[0];
  if (o?.success && p?.waybill && (p.status ?? "Success") === "Success") return { awb: String(p.waybill) };
  const remarks = Array.isArray(p?.remarks) ? p!.remarks.join(" ") : p?.remarks || "";
  return { error: [remarks, o?.rmk].filter(Boolean).join(" · ") || "Delhivery couldn't create the shipment." };
}

export const delhiveryTrackUrl = (awb: string) => `https://www.delhivery.com/track/package/${encodeURIComponent(awb)}`;

export async function delhiveryTest(c: CourierCreds["delhivery"], pincode = "110001"): Promise<{ ok: true; note: string } | { ok: false; error: string }> {
  const r = await http(`${DL(c)}/c/api/pin-codes/json/?filter_codes=${encodeURIComponent(pincode)}`, { headers: dlHeaders(c) });
  if (!r.ok) return { ok: false, error: errorText(r, "Delhivery connection failed") };
  const n = ((r.json as { delivery_codes?: unknown[] } | null)?.delivery_codes ?? []).length;
  return { ok: true, note: `Connected to Delhivery${c.staging ? " (staging)" : ""}. Pincode ${pincode} is ${n ? "serviceable" : "not serviceable"}.` };
}

export async function delhiveryShip(c: CourierCreds["delhivery"], s: ShipmentInput): Promise<ShipResult> {
  const r = await http(`${DL(c)}/api/cmu/create.json`, { method: "POST", headers: { ...dlHeaders(c), "Content-Type": "application/json" }, body: buildDelhiveryPayload(s, c.pickupName) });
  if (r.status === 0 || r.status === 401 || r.status === 403) return { ok: false, error: errorText(r, "Delhivery") };
  const p = parseDelhiveryCreate(r.json);
  if ("error" in p) return { ok: false, error: `Delhivery: ${p.error}` };
  return { ok: true, shipmentRef: p.awb, awb: p.awb, courier: "Delhivery", trackingUrl: delhiveryTrackUrl(p.awb), note: "Shipment created — Delhivery picks up per your scheduled pickup at the registered warehouse." };
}

export async function delhiveryLabel(c: CourierCreds["delhivery"], awb: string): Promise<{ ok: true; url: string } | { ok: false; error: string }> {
  const r = await http(`${DL(c)}/api/p/packing_slip?wbns=${encodeURIComponent(awb)}&pdf=true`, { headers: dlHeaders(c) });
  const url = (r.json as { packages?: { pdf_download_link?: string }[] } | null)?.packages?.[0]?.pdf_download_link;
  return url ? { ok: true, url } : { ok: false, error: errorText(r, "Delhivery label") };
}

/** /api/v1/packages/json/?waybill= → { ShipmentData: [{ Shipment: { Status: { Status, StatusType, StatusDateTime }, Scans: [{ ScanDetail }] } }] } */
export function parseDelhiveryTrack(j: unknown): TrackResult {
  type Scan = { ScanDetail?: { Scan?: string; Instructions?: string; ScanDateTime?: string; ScannedLocation?: string } };
  const sh = (j as { ShipmentData?: { Shipment?: { Status?: { Status?: string; StatusType?: string; StatusDateTime?: string; StatusLocation?: string }; Scans?: Scan[] } }[]; Error?: string } | null)?.ShipmentData?.[0]?.Shipment;
  if (!sh?.Status) return { ok: false, error: (j as { Error?: string } | null)?.Error || "Delhivery has no tracking for this waybill yet." };
  const { Status: label = "Pending", StatusType: type = "", StatusDateTime } = sh.Status;
  let state = classify(label);
  if (type === "DL" && state !== "rto") state = /rto|return/i.test(label) ? "rto" : "delivered";
  if (type === "RT") state = "rto";
  const events = (sh.Scans ?? []).map((s) => ({ at: s.ScanDetail?.ScanDateTime || "", status: s.ScanDetail?.Instructions || s.ScanDetail?.Scan || "", location: s.ScanDetail?.ScannedLocation || "" })).reverse();
  return { ok: true, state, label, deliveredAt: state === "delivered" ? StatusDateTime ?? null : null, events };
}

export async function delhiveryTrack(c: CourierCreds["delhivery"], awb: string): Promise<TrackResult> {
  const r = await http(`${DL(c)}/api/v1/packages/json/?waybill=${encodeURIComponent(awb)}`, { headers: dlHeaders(c) });
  if (!r.ok) return { ok: false, error: errorText(r, "Delhivery tracking") };
  return parseDelhiveryTrack(r.json);
}

function classify(label: string): "in_transit" | "out_for_delivery" | "delivered" | "rto" | "cancelled" | "pending" {
  const l = label.toLowerCase();
  if (/rto|return/.test(l)) return "rto";
  if (/cancel/.test(l)) return "cancelled";
  if (/undelivered|not delivered/.test(l)) return "in_transit";
  if (/out for delivery/.test(l)) return "out_for_delivery";
  if (/delivered/.test(l)) return "delivered";
  if (/pending|manifest|new|pickup (scheduled|generated)|awb assigned/.test(l)) return "pending";
  return "in_transit";
}
