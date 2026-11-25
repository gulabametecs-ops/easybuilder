import type { TemplateDef, SectionSeed } from "./types";

// Client site: Increda Sink (trade name of GINNI TRADERS) — B2B sinks, commercial wash-area and
// stainless-steel kitchen equipment. Provisioned by scripts/sites/increda-sink.ts (not a public sector).
// Product specs are intentionally NOT written here: the owner fills them per product in Admin → Services.
// Contact phone / email are blank on purpose — the owner adds them in Admin → Settings / Appearance.

export const INCREDA = {
  legalName: "MD MASHKUR ALAM",
  tradeName: "GINNI TRADERS",
  gstin: "07CTFPA0598B1Z2",
  constitution: "Proprietorship",
  address: "Ground, DDA Flat No. 4, Block B-6, Pocket 5, Rohini Sector 35, North West Delhi, Delhi, 110042",
  logo: "/sites/increda-sink/logo.svg",
  favicon: "/sites/increda-sink/mark.svg",
  phone: "9540522055",
  whatsapp: "https://wa.me/919540522055?text=" + encodeURIComponent("Hi Increda Sink, I came from your website and would like to enquire about your products."),
};

const u = (id: string, w = 1600, h = 900) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&h=${h}&q=80`;
export const INCREDA_PHOTOS = {
  hero: "1428515613728-6b4607e44363", // stainless commercial kitchen line
  chefKitchen: "1600565193348-f74bd3c7ccdf",
  welding: "1504328345606-18bbc8c9d7d1",
  sparks: "1504917595217-d4dc5ebe6122",
  foodPlant: "1513828583688-c52646db42da", // stainless process equipment
  warehouse: "1587293852726-70cdb56c2866",
  farmhouseSink: "1556909172-54557c7e4fb7",
  kitchenSink: "1556185781-a47769abb7ee",
  faucet: "1585704032915-c3400ca199e7",
  tap: "1542013936693-884638332954",
  basin: "1584622650111-993a426fbf0a",
  hotel: "1566073771259-6a8506099945",
  restaurant: "1517248135467-4c7edcad34c4",
  hospital: "1519494026892-80bbd2d6fd0d",
  school: "1592280771190-3e2e4d571952",
  catering: "1555244162-803834f70033",
  canteen: "1567521464027-f127ff144326",
};
const P = INCREDA_PHOTOS;

const CATEGORIES = [
  "Kitchen Sinks",
  "Commercial & Industrial Sinks",
  "Hand Wash Stations",
  "Dishwashing Equipment",
  "Stainless Steel Fabrication",
  "Sink Accessories",
];
/** Category → photo used for every product in it until the owner uploads real product photos. */
export const INCREDA_CATEGORY_PHOTO: Record<string, string> = {
  "Kitchen Sinks": P.farmhouseSink,
  "Commercial & Industrial Sinks": P.hero,
  "Hand Wash Stations": P.basin,
  "Dishwashing Equipment": P.chefKitchen,
  "Stainless Steel Fabrication": P.foodPlant,
  "Sink Accessories": P.faucet,
};

const SPEC_NOTE =
  "Material, dimensions, sheet thickness, finish and bowl size are shared with the quotation and spec sheet — tell us your required size, or ask for the available standard sizes. Custom sizes and bulk quantities are quoted on request.";

const products: Record<string, string[]> = {
  "Kitchen Sinks": [
    "Single Bowl Sink", "Double Bowl Sink", "Triple Bowl Sink", "Multi-Bowl Sink", "Handmade Sink", "Farmhouse Sink",
    "Undermount Sink", "Top Mount Sink", "Quartz Sink", "Granite Sink", "Ceramic Sink",
  ],
  "Commercial & Industrial Sinks": [
    "Commercial Single Sink", "Double Compartment Sink", "Triple Compartment Sink", "Pot Wash Sink", "Deep Bowl Sink",
    "Vegetable Wash Sink", "Utility Sink", "Mop Sink", "Wall-Mounted Sink", "Floor-Mounted Sink", "Pre-Rinse Sink",
    "Soiled Dish Table", "Sink with Drainboard",
  ],
  "Hand Wash Stations": [
    "Wall-Mounted Hand Sink", "Pedestal Hand Wash Sink", "Double Hand Wash Station", "Knee-Operated Hand Wash Sink",
    "Foot-Operated Hand Wash Sink", "Sensor Hand Wash Sink",
  ],
  "Dishwashing Equipment": [
    "Dishwashing Sink", "Dishwasher Tables", "Dish Collection Tables", "Pre-Rinse Units", "Commercial Dishwashers",
    "Glass Washers", "Loading and Unloading Tables",
  ],
  "Stainless Steel Fabrication": [
    "Stainless Steel Work Tables", "Sink Work Tables", "Storage Racks", "Pot Racks", "Wall Shelves", "Utility Trolleys",
    "Waste Bins", "Drain Tables", "Commercial Cabinets",
  ],
  "Sink Accessories": [
    "Faucets", "Drain Pipes", "Waste Couplings", "Sink Strainers", "Soap Dispensers", "Drain Boards", "Sink Grids",
    "Installation Accessories",
  ],
};

// Variety customers can pick on each product page (sent with the enquiry / WhatsApp). Editable per product in
// Admin → Services → Options (owners can add a photo per value so the main image changes with the choice).
type Opt = { name: string; values: string[]; colors?: Record<string, string> };
const size = (...v: string[]): Opt => ({ name: "Size", values: [...v, "Custom size"] });
const colour = (pairs: [string, string][]): Opt => ({ name: "Colour", values: pairs.map(([n]) => n), colors: Object.fromEntries(pairs) });
const SS: Opt = { name: "Material", values: ["SS 304", "SS 316", "SS 202"] };
const SS_FINISH: Opt = { name: "Finish", values: ["Matte", "Satin", "Mirror"] };
const OPTIONS_BY_CATEGORY: Record<string, Opt[]> = {
  "Kitchen Sinks": [
    size('18" × 16"', '24" × 18"', '32" × 18"', '37" × 18"', '45" × 20"'),
    colour([["Steel", "#b8bec5"], ["Black", "#1c1d20"], ["Graphite grey", "#4a4f55"], ["Gold", "#c9a24a"], ["Copper", "#b8734a"]]),
    { name: "Finish", values: ["Matte", "Satin", "Lining", "Glossy"] },
    { name: "Mounting", values: ["Top mount", "Undermount"] },
  ],
  "Commercial & Industrial Sinks": [size('24" × 24"', '30" × 24"', '36" × 24"', '48" × 24"'), SS, SS_FINISH, { name: "Drainboard", values: ["None", "Left", "Right", "Both sides"] }],
  "Hand Wash Stations": [size('16" × 14"', '20" × 16"', '24" × 18"'), SS, SS_FINISH],
  "Dishwashing Equipment": [size('36" × 24"', '48" × 30"', '60" × 30"'), SS, SS_FINISH],
  "Stainless Steel Fabrication": [size("4 ft × 2 ft", "5 ft × 2.5 ft", "6 ft × 2.5 ft"), SS, SS_FINISH, { name: "Shelves", values: ["No shelf", "1 under-shelf", "2 under-shelves"] }],
  "Sink Accessories": [
    { name: "Finish", values: ["Chrome", "Matte black", "Brushed steel", "Gold"], colors: { Chrome: "#d4d8dc", "Matte black": "#26272b", "Brushed steel": "#a8adb3", Gold: "#c9a24a" } },
    { name: "Size", values: ["Standard", "Large", "Custom"] },
  ],
};
/** Stone / ceramic sinks come in colours, not steel finishes. */
const STONE_OPTIONS: Opt[] = [
  size('24" × 18"', '30" × 18"', '33" × 20"'),
  colour([["Black", "#1c1d20"], ["Grey", "#8a9098"], ["White", "#f6f6f4"], ["Beige", "#d9c7a7"], ["Brown", "#6f4e37"]]),
  { name: "Bowl", values: ["Single", "1.5 bowl", "Double"] },
];
export function incredaOptions(category: string, title: string): Opt[] {
  return /quartz|granite|ceramic/i.test(title) ? STONE_OPTIONS : OPTIONS_BY_CATEGORY[category] ?? [];
}

const blurb: Record<string, (name: string) => string> = {
  "Kitchen Sinks": (n) => `${n} for residential, modular and premium kitchens — supplied in standard and custom sizes for projects and bulk orders.`,
  "Commercial & Industrial Sinks": (n) => `${n} built for commercial kitchens, hotels, hospitals and food-processing units — made to order in custom sizes.`,
  "Hand Wash Stations": (n) => `${n} for hygienic hand washing in kitchens, hospitals, food plants and public areas.`,
  "Dishwashing Equipment": (n) => `${n} for organised, high-volume dish and utensil washing in commercial kitchens.`,
  "Stainless Steel Fabrication": (n) => `${n} fabricated in stainless steel for commercial kitchens, labs and industrial wash areas.`,
  "Sink Accessories": (n) => `${n} to complete sink installations — supplied with sinks or separately in bulk.`,
};

const ctaSec: SectionSeed<"cta"> = {
  type: "cta",
  content: { title: "Planning a kitchen or wash-area project?", highlight: "Get a Bulk Quotation", phones: [INCREDA.phone], buttonLabel: "Request Bulk Quote", buttonHref: "/bulk-orders" },
};

const faqItems = [
  { q: "Do you supply in bulk for projects?", a: "Yes. We supply bulk quantities for hotels, restaurants, hospitals, institutions, factories and contractors. Share your product list or BOQ on the Bulk Orders page and we will send a quotation." },
  { q: "Can sinks and tables be made in custom sizes?", a: "Yes. Most commercial sinks, work tables and fabricated items can be made to your dimensions. Upload your drawing or write the sizes in the Custom Project form." },
  { q: "Which materials do you offer?", a: "Stainless steel grades and other materials are listed in each product's specifications. If you need a particular grade, thickness or finish, mention it in your enquiry." },
  { q: "Do you provide GST invoices?", a: "Yes. All supplies are billed with a GST tax invoice." },
  { q: "How do I get a price?", a: "Add products to your enquiry, or call or WhatsApp us with the product names and quantities. We reply with a quotation that includes taxes and delivery terms." },
  { q: "Do you deliver outside Delhi?", a: "Tell us your delivery location in the enquiry and we will confirm delivery options and charges in the quotation." },
];

const quoteSubtitle = "Add the products, quantities, sizes and your expected delivery date. Mention your company name, GST number (optional), city and state — we send a detailed quotation.";

const footerAbout = `Increda Sink supplies kitchen sinks, commercial and industrial sinks, hand wash stations, dishwashing equipment and stainless-steel fabrication for hotels, restaurants, hospitals, institutions, food processing units and projects.`;

const legalLine = `Legal name: ${INCREDA.legalName} · Trade name: ${INCREDA.tradeName} (${INCREDA.constitution}) · GSTIN: ${INCREDA.gstin}`;


// White, premium home hero + category photo grid as custom HTML (inline styles: no Tailwind build step needed).
// Owners can edit text/images in Admin → Pages → Home (hero "custom HTML"), or switch the hero to a standard design.
const heroHtml = `<style>
.ih{position:relative;overflow:hidden;background:linear-gradient(180deg,#f4f8fa 0%,#fff 70%);color:#16191e;font-family:inherit}
.ih:before{content:"";position:absolute;inset:0;background-image:radial-gradient(rgba(29,111,145,.12) 1px,transparent 1px);background-size:22px 22px;-webkit-mask-image:linear-gradient(180deg,#000 0%,transparent 75%);mask-image:linear-gradient(180deg,#000 0%,transparent 75%);pointer-events:none}
.ih-wrap{position:relative;max-width:1240px;margin:0 auto;padding:64px 20px 40px;display:grid;grid-template-columns:1.05fr 1fr;gap:56px;align-items:center}
.ih-badge{display:inline-flex;align-items:center;gap:8px;font-size:12px;font-weight:800;letter-spacing:.14em;color:#1d6f91;background:#fff;border:1px solid #d6e6ee;border-radius:999px;padding:7px 14px;box-shadow:0 4px 14px -8px rgba(29,111,145,.4)}
.ih-badge i{width:8px;height:8px;border-radius:50%;background:#22c55e;box-shadow:0 0 0 4px rgba(34,197,94,.18)}
.ih h1{font-size:clamp(36px,4.8vw,62px);line-height:1.03;font-weight:800;letter-spacing:-.03em;margin:20px 0 18px;color:#16191e}
.ih h1 span{background:linear-gradient(90deg,#1d6f91,#3ea3c9);-webkit-background-clip:text;background-clip:text;color:transparent}
.ih-sub{font-size:clamp(16px,1.5vw,19px);line-height:1.65;color:#4b525b;max-width:560px;margin:0 0 28px}
.ih-btns{display:flex;flex-wrap:wrap;gap:12px;align-items:center}
.ih-btn{display:inline-flex;align-items:center;gap:8px;padding:15px 26px;border-radius:12px;font-weight:700;font-size:15px;text-decoration:none;transition:transform .15s,box-shadow .15s}
.ih-btn:hover{transform:translateY(-2px)}
.ih-btn.p{background:#16191e;color:#fff;box-shadow:0 14px 28px -12px rgba(22,25,30,.55)}
.ih-btn.s{background:#fff;color:#16191e;border:1.5px solid #c9d1d8}
.ih-call{font-weight:700;font-size:14px;color:#1d6f91;text-decoration:none;padding:6px 4px}
.ih-pts{display:grid;grid-template-columns:1fr 1fr;gap:10px 22px;margin-top:30px;max-width:520px}
.ih-pts div{display:flex;gap:10px;align-items:flex-start;font-size:14px;font-weight:600;color:#2a2f36}
.ih-pts b{flex:none;width:22px;height:22px;border-radius:7px;background:#1d6f91;color:#fff;display:inline-flex;align-items:center;justify-content:center;font-size:12px}
.ih-art{position:relative;padding:0 0 46px 46px}
.ih-main{border-radius:24px;overflow:hidden;aspect-ratio:4/4.3;box-shadow:0 40px 80px -30px rgba(22,25,30,.5);background:#e9edf0}
.ih-main img,.ih-small img{width:100%;height:100%;object-fit:cover;display:block}
.ih-small{position:absolute;left:0;bottom:0;width:46%;aspect-ratio:4/3;border-radius:18px;overflow:hidden;border:6px solid #fff;box-shadow:0 24px 48px -20px rgba(22,25,30,.55);background:#e9edf0}
.ih-card{position:absolute;background:#fff;border-radius:14px;box-shadow:0 20px 40px -18px rgba(22,25,30,.45);padding:12px 16px;font-size:13px;font-weight:700;color:#16191e;display:flex;gap:10px;align-items:center}
.ih-card small{display:block;font-weight:500;color:#6b747e;font-size:11.5px;margin-top:2px}
.ih-card i{font-style:normal;width:34px;height:34px;border-radius:10px;background:#eef5f8;color:#1d6f91;display:inline-flex;align-items:center;justify-content:center;font-size:15px;font-weight:800}
.ih-c1{top:22px;right:-14px}
.ih-c2{right:24px;bottom:70px}
.ih-cats{position:relative;max-width:1240px;margin:0 auto;padding:0 20px 44px;display:flex;flex-wrap:wrap;gap:10px;align-items:center}
.ih-cats span{font-size:12px;font-weight:800;letter-spacing:.14em;color:#6b747e;margin-right:6px}
.ih-cats a{font-size:13.5px;font-weight:600;color:#2a2f36;text-decoration:none;background:#fff;border:1px solid #e3e8ec;border-radius:999px;padding:8px 14px;transition:border-color .15s,color .15s}
.ih-cats a:hover{border-color:#1d6f91;color:#1d6f91}
@media(max-width:960px){.ih-wrap{grid-template-columns:1fr;gap:36px;padding-top:44px}.ih-art{padding:0 0 30px 30px}.ih-c1{right:6px}}
@media(max-width:560px){.ih-pts{grid-template-columns:1fr}.ih-small{width:52%}.ih-c2{display:none}.ih-btn{width:100%;justify-content:center}}
</style>
<section class="ih">
<div class="ih-wrap">
<div>
<span class="ih-badge"><i></i>SINKS · WASH STATIONS · SS EQUIPMENT</span>
<h1>Premium Sink &amp; Commercial <span>Wash Equipment</span> Solutions</h1>
<p class="ih-sub">Reliable products, customized solutions and bulk supply for commercial and industrial projects.</p>
<div class="ih-btns"><a class="ih-btn p" href="/products">Explore Products →</a><a class="ih-btn s" href="/bulk-orders">Request Bulk Quote</a><a class="ih-call" href="tel:${INCREDA.phone}">or call ${INCREDA.phone}</a></div>
<div class="ih-pts"><div><b>✓</b>Stainless-steel range for commercial use</div><div><b>✓</b>Custom sizes made to your drawings</div><div><b>✓</b>Bulk &amp; project supply</div><div><b>✓</b>GST invoice on every order</div></div>
</div>
<div class="ih-art">
<div class="ih-main"><img src="${u(P.hero, 1100, 1180)}" alt="Commercial kitchen with stainless-steel sinks and wash stations"></div>
<div class="ih-small"><img src="${u(P.welding, 700, 520)}" alt="Stainless-steel fabrication"></div>
<div class="ih-card ih-c1"><i>SS</i><div>SS 304 &amp; SS 316<small>Food-grade stainless steel</small></div></div>
<div class="ih-card ih-c2"><i>↔</i><div>Custom sizes<small>Built to your layout</small></div></div>
</div>
</div>
<div class="ih-cats"><span>BROWSE</span><a href="/products">Kitchen Sinks</a><a href="/products">Commercial Sinks</a><a href="/products">Hand Wash Stations</a><a href="/services/pot-wash-sink">Pot Wash Sinks</a><a href="/products">Dishwashing</a><a href="/services/stainless-steel-work-tables">Work Tables</a><a href="/products">Accessories</a></div>
</section>`;

const CATEGORY_CARDS: { title: string; text: string; photo: string; href: string }[] = [
  { title: "Kitchen Sinks", text: "Single, double, handmade, quartz & more", photo: P.farmhouseSink, href: "/products" },
  { title: "Commercial Sinks", text: "Compartment, deep bowl & utility sinks", photo: P.hero, href: "/products" },
  { title: "Hand Wash Stations", text: "Wall, pedestal, knee, foot & sensor", photo: P.basin, href: "/products" },
  { title: "Pot Wash Sinks", text: "Heavy-duty sinks for large utensils", photo: P.chefKitchen, href: "/services/pot-wash-sink" },
  { title: "Dishwashing Equipment", text: "Dish tables, pre-rinse & dishwashers", photo: P.canteen, href: "/products" },
  { title: "Sink Accessories", text: "Faucets, couplings, strainers & grids", photo: P.faucet, href: "/products" },
  { title: "Stainless Steel Work Tables", text: "Work tables, racks, trolleys & cabinets", photo: P.foodPlant, href: "/services/stainless-steel-work-tables" },
  { title: "Industrial Wash Equipment", text: "Vegetable wash, drain tables & more", photo: P.welding, href: "/custom-manufacturing" },
];
const categoryHtml = `<style>
.icc{background:#f4f6f8;padding:84px 20px}
.icc-wrap{max-width:1200px;margin:0 auto}
.icc-eye{font-size:12px;font-weight:800;letter-spacing:.16em;color:#1d6f91}
.icc-h2{font-size:clamp(28px,3.6vw,44px);font-weight:800;letter-spacing:-.02em;color:#16191e;margin:10px 0 36px}
.icc-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:18px}
.icc-card{display:block;background:#fff;border-radius:14px;overflow:hidden;text-decoration:none;color:#16191e;border:1px solid #e3e8ec;transition:transform .2s,box-shadow .2s}
.icc-card:hover{transform:translateY(-4px);box-shadow:0 24px 40px -24px rgba(22,25,30,.35)}
.icc-card img{width:100%;aspect-ratio:4/3;object-fit:cover;display:block;background:#e9edf0}
.icc-card div{padding:16px 18px 18px}
.icc-card b{display:block;font-size:16.5px}
.icc-card small{display:block;color:#6b747e;font-size:13px;margin-top:4px}
.icc-card em{display:inline-block;margin-top:10px;font-style:normal;font-weight:700;font-size:13px;color:#1d6f91}
@media(max-width:1000px){.icc-grid{grid-template-columns:repeat(2,1fr)}}
@media(max-width:520px){.icc-grid{grid-template-columns:1fr}}
</style>
<div class="icc"><div class="icc-wrap"><div class="icc-eye">PRODUCT CATEGORIES</div><h2 class="icc-h2">Explore Our Product Range</h2><div class="icc-grid">
${CATEGORY_CARDS.map((c) => `<a class="icc-card" href="${c.href}"><img src="${u(c.photo, 800, 600)}" alt="${c.title}" loading="lazy"><div><b>${c.title}</b><small>${c.text}</small><em>View products →</em></div></a>`).join("")}
</div></div></div>`;


// Compact "Industries We Serve" strip: 9 small photo tiles instead of 9 tall cards.
const INDUSTRY_TILES: [string, string][] = [
  ["Hotels", P.hotel], ["Restaurants", P.restaurant], ["Commercial Kitchens", P.chefKitchen],
  ["Hospitals", P.hospital], ["Schools", P.school], ["Food Processing", P.foodPlant],
  ["Factories", P.warehouse], ["Caterers", P.catering], ["Contractors", P.welding],
];
const industryHtml = `<style>
.ici{background:#fff;padding:64px 20px}
.ici-wrap{max-width:1200px;margin:0 auto}
.ici-top{display:flex;flex-wrap:wrap;align-items:end;justify-content:space-between;gap:12px;margin-bottom:24px}
.ici-eye{font-size:12px;font-weight:800;letter-spacing:.16em;color:#1d6f91}
.ici-h2{font-size:clamp(26px,3.2vw,38px);font-weight:800;letter-spacing:-.02em;color:#16191e;margin:8px 0 0}
.ici-link{font-weight:700;font-size:14px;color:#1d6f91;text-decoration:none}
.ici-grid{display:grid;grid-template-columns:repeat(9,1fr);gap:10px}
.ici-t{position:relative;display:block;border-radius:12px;overflow:hidden;aspect-ratio:3/4;text-decoration:none}
.ici-t img{width:100%;height:100%;object-fit:cover;display:block;transition:transform .3s}
.ici-t:hover img{transform:scale(1.06)}
.ici-t span{position:absolute;inset:auto 0 0 0;padding:28px 10px 10px;color:#fff;font-weight:700;font-size:13px;line-height:1.2;background:linear-gradient(transparent,rgba(10,12,15,.85))}
@media(max-width:1000px){.ici-grid{grid-template-columns:repeat(5,1fr)}}
@media(max-width:600px){.ici-grid{grid-template-columns:repeat(3,1fr)}.ici{padding:48px 16px}}
</style>
<div class="ici"><div class="ici-wrap"><div class="ici-top"><div><div class="ici-eye">INDUSTRIES WE SERVE</div><h2 class="ici-h2">Built for Every Commercial Kitchen</h2></div><a class="ici-link" href="/industries">View all industries →</a></div>
<div class="ici-grid">${INDUSTRY_TILES.map(([t, id]) => `<a class="ici-t" href="/industries"><img src="${u(id, 400, 540)}" alt="${t}" loading="lazy"><span>${t}</span></a>`).join("")}</div></div></div>`;


// "Wholesale & Project Supply": full-width 4-step process with a dark panel and CTA (replaces the narrow steps cards).
const BULK_STEPS: [string, string][] = [
  ["Share your requirement", "Products, quantities, sizes, or a BOQ / drawing."],
  ["Get a quotation", "Itemised quotation with taxes and delivery terms."],
  ["Confirm & manufacture", "Standard items supplied; custom items fabricated to drawing."],
  ["Delivery & support", "Packed for transit and delivered to your site."],
];
const bulkHtml = `<style>
.icb{background:#f4f6f8;padding:72px 20px}
.icb-wrap{max-width:1200px;margin:0 auto;background:#16191e;border-radius:20px;padding:48px;color:#fff;display:grid;grid-template-columns:1fr 2fr;gap:40px;align-items:center}
.icb-eye{font-size:12px;font-weight:800;letter-spacing:.16em;color:#6fc1df}
.icb-h2{font-size:clamp(26px,3vw,38px);font-weight:800;letter-spacing:-.02em;margin:10px 0 14px;line-height:1.1;color:#fff}
.icb-p{color:#aab3bc;font-size:15px;line-height:1.6;margin:0 0 22px}
.icb-pts{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:24px}
.icb-pts span{font-size:12.5px;font-weight:600;border:1px solid #39414b;border-radius:999px;padding:6px 12px;color:#d7dde3}
.icb-btn{display:inline-block;background:#1d6f91;color:#fff;font-weight:700;font-size:15px;padding:14px 22px;border-radius:10px;text-decoration:none}
.icb-steps{display:grid;grid-template-columns:repeat(2,1fr);gap:14px}
.icb-s{background:#20252c;border:1px solid #2e353e;border-radius:14px;padding:22px}
.icb-s b{color:#fff;display:flex;align-items:center;gap:10px;font-size:16px}
.icb-s i{font-style:normal;flex:none;width:30px;height:30px;border-radius:8px;background:#1d6f91;display:inline-flex;align-items:center;justify-content:center;font-size:13px;font-weight:800}
.icb-s p{color:#aab3bc;font-size:14px;line-height:1.55;margin:10px 0 0}
@media(max-width:900px){.icb-wrap{grid-template-columns:1fr;padding:32px 22px}}
@media(max-width:520px){.icb-steps{grid-template-columns:1fr}.icb{padding:48px 16px}}
</style>
<div class="icb"><div class="icb-wrap"><div><div class="icb-eye">BULK SUPPLY</div><h2 class="icb-h2">Wholesale &amp; Project Supply</h2>
<p class="icb-p">Bulk orders for hotels, restaurants, hospitals, institutions, factories and contractors — standard products and custom sizes in one quotation.</p>
<div class="icb-pts"><span>Wholesale supply</span><span>Custom sizes</span><span>Project support</span><span>Quotation assistance</span></div>
<a class="icb-btn" href="/bulk-orders">Request Bulk Quote →</a></div>
<div class="icb-steps">${BULK_STEPS.map(([t, d], i) => `<div class="icb-s"><b><i>0${i + 1}</i>${t}</b><p>${d}</p></div>`).join("")}</div></div></div>`;


// Industries page: photo card per industry with what we supply there.
const INDUSTRY_DETAIL: [string, string, string][] = [
  ["Hotels", P.hotel, "Main kitchen wash lines, pot-wash sinks, hand wash stations and banquet back-of-house equipment."],
  ["Restaurants", P.restaurant, "Prep sinks, pot-wash and dishwashing tables sized to your kitchen layout."],
  ["Commercial Kitchens", P.chefKitchen, "Cloud, central and QSR kitchens — work tables, racks and multi-compartment sinks."],
  ["Hospitals", P.hospital, "Knee, foot and sensor-operated hand wash stations and hygienic wash areas."],
  ["Schools & Institutions", P.school, "Mid-day meal kitchens, hostels and mess halls — durable sinks and tables."],
  ["Food Processing", P.foodPlant, "Vegetable wash sinks, utility sinks, drain tables and stainless work tables."],
  ["Factories", P.warehouse, "Industrial wash areas, canteens, utility stations and storage racks."],
  ["Caterers", P.catering, "Portable, easy-to-clean wash and prep equipment for events and outdoor kitchens."],
  ["Contractors & Architects", P.welding, "Project supply against drawings and BOQs, with custom fabrication."],
];
const industryPageHtml = `<style>
.icx{background:#fff;padding:72px 20px}
.icx-wrap{max-width:1200px;margin:0 auto}
.icx-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
.icx-c{display:flex;flex-direction:column;border:1px solid #e3e8ec;border-radius:16px;overflow:hidden;background:#fff;text-decoration:none;color:#16191e;transition:transform .2s,box-shadow .2s}
.icx-c:hover{transform:translateY(-4px);box-shadow:0 24px 40px -24px rgba(22,25,30,.35)}
.icx-c img{width:100%;aspect-ratio:16/10;object-fit:cover;display:block;background:#e9edf0}
.icx-c div{padding:18px 20px 20px}
.icx-c b{display:block;font-size:18px;color:#16191e}
.icx-c p{color:#5b636c;font-size:14px;line-height:1.55;margin:6px 0 12px}
.icx-c em{font-style:normal;font-weight:700;font-size:13.5px;color:#1d6f91}
@media(max-width:1000px){.icx-grid{grid-template-columns:repeat(2,1fr)}}
@media(max-width:560px){.icx-grid{grid-template-columns:1fr}.icx{padding:48px 16px}}
</style>
<div class="icx"><div class="icx-wrap"><div class="icx-grid">${INDUSTRY_DETAIL.map(([t, id, d]) => `<a class="icx-c" href="/bulk-orders?service=${encodeURIComponent(t)}"><img src="${u(id, 800, 500)}" alt="${t}" loading="lazy"><div><b>${t}</b><p>${d}</p><em>Enquire for ${t} →</em></div></a>`).join("")}</div></div></div>`;

const customHero = (html: string): SectionSeed<"hero"> => ({
  type: "hero",
  content: {
    variant: "custom", customHtml: html, badge: "", titleTop: "", titleHighlight: "", subtitle: "", description: "", image: "",
    primaryBtn: { label: "", href: "" }, secondaryBtn: { label: "", href: "" }, features: [],
  },
});
const heroSection = customHero(heroHtml);
const categoryGrid = customHero(categoryHtml);
const industryStrip = customHero(industryHtml);
const bulkStrip = customHero(bulkHtml);
const industryPage = customHero(industryPageHtml);

export const incredaSink: TemplateDef = {
  theme: {
    colors: { primary: "#1d6f91", primaryDark: "#15536d", secondary: "#2a2f36", accent: "#b9c3cc", dark: "#16191e", light: "#f4f6f8", text: "#4b525b", heading: "#16191e" },
    font: "Manrope", radius: "0.625rem",
  },
  header: (biz) => ({
    design: "classic",
    logoText: biz, logoImage: INCREDA.logo,
    announcement: { show: true, text: "Bulk supply & custom stainless-steel fabrication for commercial kitchens — request a quotation.", link: "/bulk-orders" },
    topbar: { show: true, address: "Rohini Sector 35, Delhi", phones: [INCREDA.phone], email: "", social: { facebook: "", instagram: "", whatsapp: INCREDA.whatsapp } },
    nav: [
      { label: "Home", href: "/" },
      { label: "Products", href: "/products" },
      { label: "Custom Manufacturing", href: "/custom-manufacturing" },
      { label: "Bulk Orders", href: "/bulk-orders" },
      { label: "Industries", href: "/industries" },
      { label: "Projects", href: "/projects" },
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
    cta: { label: "Request Bulk Quote", href: "/bulk-orders" },
  }),
  footer: () => ({
    design: "modern",
    about: `${footerAbout}\n\n${legalLine}`,
    columns: [
      { title: "Products", links: CATEGORIES.map((c) => ({ label: c, href: "/products" })) },
      { title: "Company", links: [
        { label: "About Increda Sink", href: "/about" },
        { label: "Custom Manufacturing", href: "/custom-manufacturing" },
        { label: "Bulk Orders", href: "/bulk-orders" },
        { label: "Custom Project Enquiry", href: "/custom-project" },
        { label: "Catalogue Download", href: "/catalogue" },
        { label: "FAQ", href: "/faq" },
        { label: "Privacy Policy", href: "/privacy" },
        { label: "Terms & Conditions", href: "/terms" },
      ] },
    ],
    serviceAreas: ["Hotels", "Restaurants", "Commercial Kitchens", "Hospitals", "Schools", "Food Processing", "Factories", "Caterers", "Contractors"],
    contact: { phones: [INCREDA.phone], email: "", address: INCREDA.address },
    social: { facebook: "", instagram: "", whatsapp: INCREDA.whatsapp, location: "" },
    copyright: `© {year} Increda Sink — ${INCREDA.tradeName}. All Rights Reserved.`,
  }),
  seo: () => ({
    title: "Increda Sink — Commercial Sinks, Wash Stations & Stainless-Steel Kitchen Equipment",
    description: "Kitchen sinks, commercial and industrial sinks, hand wash stations, dishwashing equipment and stainless-steel fabrication. Bulk supply and custom sizes for hotels, restaurants, hospitals and projects. Delhi.",
    favicon: INCREDA.favicon, ogImage: u(P.hero, 1200, 630),
    keywords: "commercial sink, stainless steel sink supplier Delhi, pot wash sink, hand wash station, dishwashing table, stainless steel work table, commercial kitchen equipment, bulk sink supplier",
    businessType: "WholesaleStore",
  }),
  services: Object.entries(products).flatMap(([category, names]) =>
    names.map((name) => ({
      category,
      title: name,
      description: blurb[category](name),
      longDescription: `${blurb[category](name)}\n\n${SPEC_NOTE}`,
      options: incredaOptions(category, name),
    })),
  ),
  gallery: [
    { category: "Projects", caption: "Commercial kitchen wash line" },
    { category: "Projects", caption: "Hotel kitchen installation" },
    { category: "Projects", caption: "Restaurant prep & pot-wash area" },
    { category: "Fabrication", caption: "Stainless-steel fabrication" },
    { category: "Fabrication", caption: "Welding & finishing" },
    { category: "Fabrication", caption: "Food-plant stainless equipment" },
  ],
  pages: () => [
    {
      slug: "home", title: "Home", isSystem: true, order: 0,
      sections: [
        heroSection,
        categoryGrid,
        { type: "about", content: {
          eyebrow: "CUSTOM MANUFACTURING", title: "Made to Your", titleHighlight: "Drawings & Sizes",
          body: [
            "Commercial kitchens rarely fit standard sizes. We fabricate sinks, work tables, racks and wash-area equipment to your dimensions, layout and usage.",
            "Share a drawing, a BOQ or just measurements — we help with sizing, configuration and the right finish for your project.",
          ],
          image: u(P.welding, 1200, 900), points: ["Custom dimensions & bowl configurations", "Drawing / BOQ based fabrication", "Project installations", "Consistent finish across bulk orders"],
          buttonLabel: "Custom Manufacturing", buttonHref: "/custom-manufacturing",
        }, style: { layout: "split" } },
        bulkStrip,
        industryStrip,
        { type: "quoteForm", content: { title: "Request a Bulk Quotation", subtitle: quoteSubtitle, showSidebar: true }, style: { background: "light" } },
        { type: "faq", content: { eyebrow: "FAQ", title: "Common", titleHighlight: "Questions", items: faqItems.slice(0, 4) } },
        { ...ctaSec, style: { layout: "split" } },
      ],
    },
    { slug: "products", title: "Products", isSystem: true, order: 1, sections: [
      { type: "banner", content: { title: "Our", titleHighlight: "Products", subtitle: "Kitchen sinks, commercial sinks, hand wash stations, dishwashing equipment, stainless-steel fabrication and accessories.", image: u(P.hero), bgColor: "", imageOpacity: 40, overlayOpacity: 75 } },
      { type: "serviceCategories", content: { eyebrow: "ALL CATEGORIES", title: "Browse by", titleHighlight: "Category", categories: CATEGORIES }, style: { layout: "tiles" } },
      ctaSec,
    ] },
    // Breadcrumb target of product pages (/services/<slug> → "Services"); hidden from the menu.
    { slug: "services", title: "All Products", isSystem: true, order: 11, showInNav: false, sections: [
      { type: "banner", content: { title: "All", titleHighlight: "Products", subtitle: "Every product we supply, by category.", image: u(P.hero), bgColor: "", imageOpacity: 40, overlayOpacity: 75 } },
      { type: "serviceCategories", content: { eyebrow: "ALL CATEGORIES", title: "Browse by", titleHighlight: "Category", categories: CATEGORIES }, style: { layout: "tiles" } },
      ctaSec,
    ] },
    { slug: "custom-manufacturing", title: "Custom Manufacturing", isSystem: true, order: 2, sections: [
      { type: "banner", content: { title: "Custom", titleHighlight: "Manufacturing", subtitle: "Stainless-steel sinks, tables and wash-area equipment fabricated to your drawings.", image: u(P.sparks), bgColor: "", imageOpacity: 45, overlayOpacity: 75 } },
      { type: "about", content: {
        eyebrow: "FABRICATION", title: "Built Around", titleHighlight: "Your Kitchen",
        body: [
          "From single custom sinks to complete wash lines, we fabricate stainless-steel equipment to the size, layout and configuration your space needs.",
          "Send your drawing, layout or BOQ. We confirm dimensions, material and finish with you before manufacturing.",
        ],
        image: u(P.welding, 1200, 900), points: ["Custom sinks & multi-compartment units", "Work tables, racks, shelves & trolleys", "Dish tables & drain tables", "Cabinets & utility stations"],
        buttonLabel: "Start a Custom Project", buttonHref: "/custom-project",
      }, style: { layout: "split" } },
      { type: "steps", content: { eyebrow: "PROCESS", title: "How Custom", titleHighlight: "Orders Work", items: [
        { title: "Drawing / Requirement", text: "Upload drawings, images or a BOQ with sizes.", icon: "download" },
        { title: "Review & Quotation", text: "We review feasibility and send a quotation.", icon: "clipboard" },
        { title: "Fabrication", text: "Cutting, bending, welding and finishing.", icon: "wrench" },
        { title: "Delivery & Installation", text: "Delivered to site; installation support for projects.", icon: "truck" },
      ] }, style: { background: "light" } },
      { type: "gallery", content: { eyebrow: "WORKSHOP & PROJECTS", title: "Fabrication", titleHighlight: "Gallery" }, style: { layout: "grid" } },
      { type: "cta", content: { title: "Have a drawing or BOQ?", highlight: "Send It for a Quote", phones: [INCREDA.phone], buttonLabel: "Custom Project Enquiry", buttonHref: "/custom-project" } },
    ] },
    { slug: "bulk-orders", title: "Bulk Orders", isSystem: true, order: 3, sections: [
      { type: "banner", content: { title: "Bulk", titleHighlight: "Orders", subtitle: "Wholesale supply, custom sizes and project support with quotation assistance.", image: u(P.warehouse), bgColor: "", imageOpacity: 40, overlayOpacity: 75 } },
      { type: "features", content: { items: [
        { icon: "package", title: "Wholesale Supply", text: "Bulk quantities for dealers, contractors and institutions." },
        { icon: "ruler", title: "Custom Sizes", text: "Made-to-measure items alongside standard products." },
        { icon: "clipboard", title: "Project Support", text: "Help with product selection against your BOQ." },
        { icon: "clipboard", title: "Quotation Assistance", text: "Clear, itemised quotations with taxes and delivery terms." },
      ] }, style: { layout: "cards", cardRadius: "lg" } },
      { type: "quoteForm", content: { title: "Bulk Enquiry", subtitle: quoteSubtitle, showSidebar: true }, style: { background: "light" } },
    ] },
    { slug: "custom-project", title: "Custom Project Enquiry", isSystem: true, order: 4, showInNav: false, sections: [
      { type: "banner", content: { title: "Custom Project", titleHighlight: "Enquiry", subtitle: "For architects, builders, contractors, hotels, restaurants and commercial projects.", image: u(P.restaurant), bgColor: "", imageOpacity: 40, overlayOpacity: 75 } },
      { type: "quoteForm", content: { title: "Tell Us About Your Project", subtitle: "Project type, company, location, estimated quantity and a short description. Mention drawing / BOQ details — we will ask for the files on WhatsApp or email.", showSidebar: true } },
    ] },
    { slug: "industries", title: "Industries We Serve", isSystem: true, order: 5, sections: [
      { type: "banner", content: { title: "Industries We", titleHighlight: "Serve", subtitle: "Wash-area and stainless-steel solutions for every kind of commercial kitchen.", image: u(P.hotel), bgColor: "", imageOpacity: 40, overlayOpacity: 75 } },
      industryPage,
      ctaSec,
    ] },
    { slug: "projects", title: "Projects", isSystem: true, order: 6, sections: [
      { type: "banner", content: { title: "Projects &", titleHighlight: "Gallery", subtitle: "Installed sinks, wash stations and stainless-steel kitchen equipment.", image: u(P.chefKitchen), bgColor: "", imageOpacity: 40, overlayOpacity: 75 } },
      { type: "gallery", content: { eyebrow: "OUR WORK", title: "Installations &", titleHighlight: "Fabrication" }, style: { layout: "grid" } },
      ctaSec,
    ] },
    { slug: "catalogue", title: "Catalogue Download", isSystem: true, order: 7, showInNav: false, sections: [
      { type: "banner", content: { title: "Catalogue", titleHighlight: "Download", subtitle: "Product catalogues and spec sheets for our range.", image: u(P.foodPlant), bgColor: "", imageOpacity: 40, overlayOpacity: 75 } },
      { type: "downloads", content: { eyebrow: "DOWNLOADS", title: "Product", titleHighlight: "Catalogues", items: [
        { title: "Increda Sink Product Catalogue", description: "Complete product range — upload the PDF in Admin → Pages.", link: "", icon: "book" },
        { title: "Commercial Sinks & Wash Stations", description: "Commercial, industrial and hand wash range.", link: "", icon: "droplet" },
        { title: "Stainless Steel Fabrication", description: "Work tables, racks, trolleys, cabinets and dish tables.", link: "", icon: "grid" },
      ] } },
      { type: "cta", content: { title: "Need a catalogue for a specific product?", highlight: "Ask Us", phones: [INCREDA.phone], buttonLabel: "Contact Us", buttonHref: "/contact" }, style: { layout: "minimal" } },
    ] },
    { slug: "about", title: "About Increda Sink", isSystem: true, order: 8, sections: [
      { type: "banner", content: { title: "About", titleHighlight: "Increda Sink", subtitle: "Sinks, wash stations and stainless-steel equipment for commercial projects.", image: u(P.kitchenSink), bgColor: "", imageOpacity: 40, overlayOpacity: 75 } },
      { type: "about", content: { eyebrow: "ABOUT US", title: "About", titleHighlight: "Increda Sink", body: [
        "Increda Sink supplies sinks, sanitary sinks, stainless-steel wash-area equipment and commercial kitchen equipment for commercial and industrial projects.",
        "We work with hotels, restaurants, hospitals, institutions, food processing units, caterers and contractors — supplying standard products and fabricating custom items to their requirements.",
        `Increda Sink is a trade name of ${INCREDA.tradeName}, a ${INCREDA.constitution.toLowerCase()} based in Delhi (GSTIN ${INCREDA.gstin}).`,
      ], image: u(P.hero, 1200, 900), points: ["Kitchen & commercial sinks", "Hand wash & dishwashing equipment", "Custom stainless-steel fabrication", "Bulk & project supply"], buttonLabel: "Contact Us", buttonHref: "/contact" }, style: { layout: "reverse" } },
      { type: "visionMission", content: {
        eyebrow: "OUR APPROACH",
        visionTitle: "Our Vision", visionText: "To be a dependable partner for commercial kitchens and wash areas — from a single sink to a complete project.",
        missionTitle: "Our Mission", missionText: "Reliable products, honest quotations and customised solutions delivered on time.",
        valuesTitle: "What We Value",
        values: [
          { icon: "shield", title: "Reliability", text: "Products built for daily commercial use." },
          { icon: "ruler", title: "Customisation", text: "Solutions sized to your space and workflow." },
          { icon: "handshake", title: "Partnership", text: "Support from enquiry to delivery." },
        ],
      }, style: { background: "light" } },
      ctaSec,
    ] },
    { slug: "contact", title: "Contact Us", isSystem: true, order: 9, sections: [
      { type: "banner", content: { title: "Contact", titleHighlight: "Us", subtitle: "Call, WhatsApp or write to us for quotations and project enquiries.", image: u(P.warehouse), bgColor: "", imageOpacity: 40, overlayOpacity: 75 } },
      { type: "contactInfo", content: { eyebrow: "CONTACT", title: "Get in", titleHighlight: "Touch", address: INCREDA.address, phone: INCREDA.phone, email: "", hours: "Mon–Sat: 10:00 AM – 7:00 PM", mapEmbed: "" } },
      { type: "richText", content: { html: `<h3>Business details</h3><p><strong>Brand:</strong> Increda Sink<br/><strong>Legal name:</strong> ${INCREDA.legalName}<br/><strong>Trade name:</strong> ${INCREDA.tradeName}<br/><strong>Constitution:</strong> ${INCREDA.constitution}<br/><strong>GSTIN:</strong> ${INCREDA.gstin}<br/><strong>Registered address:</strong> ${INCREDA.address}</p>` } },
      { type: "contactForm", content: { title: "Send Us a Message", subtitle: "Product questions, quotations or project enquiries — we reply on the same working day." } },
    ] },
    { slug: "faq", title: "FAQ", isSystem: true, order: 10, showInNav: false, sections: [
      { type: "banner", content: { title: "Frequently Asked", titleHighlight: "Questions", subtitle: "Bulk orders, custom sizes, GST invoices and delivery.", image: u(P.canteen), bgColor: "", imageOpacity: 40, overlayOpacity: 75 } },
      { type: "faq", content: { eyebrow: "FAQ", title: "Frequently Asked", titleHighlight: "Questions", items: faqItems } },
      ctaSec,
    ] },
    { slug: "privacy", title: "Privacy Policy", isSystem: true, order: 101, showInNav: false, sections: [
      { type: "banner", content: { title: "Privacy", titleHighlight: "Policy", subtitle: "How we handle the information you share with us.", image: u(P.hero), bgColor: "", imageOpacity: 40, overlayOpacity: 75 } },
      { type: "richText", content: { html: `<h2>Privacy Policy</h2><p>This website is operated by ${INCREDA.tradeName} (trade name Increda Sink), ${INCREDA.address}.</p><h3>Information we collect</h3><p>When you submit an enquiry or quotation request we collect the details you provide — such as your name, company name, phone / WhatsApp number, email, GST number, city, state, product requirements and any files you share.</p><h3>How we use it</h3><p>We use this information only to respond to your enquiry, prepare quotations, supply products and provide support. We do not sell your information.</p><h3>Sharing</h3><p>Information may be shared with transporters or service providers only as needed to deliver your order, or where required by law.</p><h3>Retention</h3><p>Enquiry records are kept for as long as needed for business and legal (including GST) requirements.</p><h3>Your choices</h3><p>You may ask us to update or delete your information by contacting us using the details on the Contact page.</p>` } },
    ] },
    { slug: "terms", title: "Terms & Conditions", isSystem: true, order: 102, showInNav: false, sections: [
      { type: "banner", content: { title: "Terms &", titleHighlight: "Conditions", subtitle: "Terms for quotations, custom orders and supply.", image: u(P.hero), bgColor: "", imageOpacity: 40, overlayOpacity: 75 } },
      { type: "richText", content: { html: `<h2>Terms &amp; Conditions</h2><p>These terms apply to products and services supplied by ${INCREDA.tradeName} (trade name Increda Sink), GSTIN ${INCREDA.gstin}.</p><h3>Quotations</h3><p>Quotations are valid for the period stated on them. Prices, taxes, delivery charges and timelines are confirmed in the quotation or invoice.</p><h3>Custom orders</h3><p>Custom-fabricated items are made to the dimensions and specifications approved by the customer. Approved custom orders cannot be cancelled once fabrication has started.</p><h3>Payments</h3><p>Payment terms are as stated in the quotation. All supplies are billed with a GST tax invoice.</p><h3>Delivery</h3><p>Delivery timelines are estimates and may vary for custom items and bulk orders. Please inspect goods on delivery and report transit damage promptly.</p><h3>Specifications</h3><p>Product images are for illustration. Refer to the specification sheet or quotation for exact material, dimensions and finish.</p><h3>Jurisdiction</h3><p>Any disputes are subject to the jurisdiction of courts in Delhi.</p>` } },
    ] },
  ],
};
