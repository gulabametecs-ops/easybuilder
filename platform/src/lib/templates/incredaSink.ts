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
  content: { title: "Planning a kitchen or wash-area project?", highlight: "Get a Bulk Quotation", phones: [], buttonLabel: "Request Bulk Quote", buttonHref: "/bulk-orders" },
};

const industries: SectionSeed<"features"> = {
  type: "features",
  content: { items: [
    { icon: "bed", title: "Hotels", text: "Main kitchens, banquet back-of-house and staff canteens." },
    { icon: "utensils", title: "Restaurants", text: "Prep, pot-wash and dishwashing lines sized to your kitchen." },
    { icon: "flame", title: "Commercial Kitchens", text: "Cloud kitchens, central kitchens and QSR outlets." },
    { icon: "stethoscope", title: "Hospitals", text: "Hand wash stations and hygienic wash areas." },
    { icon: "graduation", title: "Schools & Institutions", text: "Mid-day meal kitchens, hostels and mess halls." },
    { icon: "factory", title: "Food Processing", text: "Vegetable wash, utility sinks and stainless work tables." },
    { icon: "box", title: "Factories", text: "Industrial wash areas, canteens and utility stations." },
    { icon: "truck", title: "Caterers", text: "Portable, durable wash and prep equipment." },
    { icon: "hammer", title: "Contractors & Architects", text: "Project supply against drawings and BOQs." },
  ] },
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
.ics-hero{background:#fff;color:#16191e;padding:72px 20px 56px;font-family:inherit}
.ics-wrap{max-width:1200px;margin:0 auto}
.ics-badge{display:inline-flex;gap:8px;align-items:center;font-size:12px;font-weight:700;letter-spacing:.14em;color:#1d6f91;background:#eef5f8;border:1px solid #d6e6ee;border-radius:999px;padding:7px 14px}
.ics-h1{font-size:clamp(34px,5.2vw,64px);line-height:1.04;font-weight:800;letter-spacing:-.025em;margin:22px 0 18px;max-width:900px}
.ics-h1 span{color:#1d6f91}
.ics-sub{font-size:clamp(16px,1.6vw,20px);line-height:1.6;color:#4b525b;max-width:680px;margin:0 0 30px}
.ics-btns{display:flex;flex-wrap:wrap;gap:12px}
.ics-btn{display:inline-flex;align-items:center;gap:8px;padding:15px 26px;border-radius:10px;font-weight:700;font-size:15px;text-decoration:none}
.ics-btn.p{background:#16191e;color:#fff}.ics-btn.s{background:#fff;color:#16191e;border:1.5px solid #c9d1d8}
.ics-img{margin-top:48px;border-radius:18px;overflow:hidden;aspect-ratio:16/9;box-shadow:0 40px 80px -30px rgba(22,25,30,.45);background:#e9edf0}
.ics-img img{width:100%;height:100%;object-fit:cover;display:block}
.ics-trust{display:grid;grid-template-columns:repeat(4,1fr);gap:1px;background:#e3e8ec;border:1px solid #e3e8ec;border-radius:14px;overflow:hidden;margin-top:28px}
.ics-trust div{background:#fff;padding:18px 20px;font-weight:700;font-size:14px}
.ics-trust small{display:block;font-weight:500;color:#6b747e;font-size:12.5px;margin-top:3px}
@media(max-width:760px){.ics-trust{grid-template-columns:1fr 1fr}.ics-hero{padding-top:48px}}
</style>
<div class="ics-hero"><div class="ics-wrap">
<span class="ics-badge">● SINKS · WASH STATIONS · STAINLESS-STEEL EQUIPMENT</span>
<h1 class="ics-h1">Premium Sink &amp; Commercial <span>Wash Equipment</span> Solutions</h1>
<p class="ics-sub">Reliable products, customized solutions and bulk supply for commercial and industrial projects.</p>
<div class="ics-btns"><a class="ics-btn p" href="/products">Explore Products →</a><a class="ics-btn s" href="/bulk-orders">Request Bulk Quote</a></div>
<div class="ics-img"><img src="${u(P.hero, 1920, 1080)}" alt="Commercial kitchen with stainless-steel sinks and wash stations"></div>
<div class="ics-trust"><div>Stainless-Steel Range<small>Sinks, tables &amp; wash equipment</small></div><div>Custom Sizes<small>Made to your drawings</small></div><div>Bulk &amp; Project Supply<small>Quotation assistance</small></div><div>GST Invoice<small>Proper tax billing</small></div></div>
</div></div>`;

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

export const incredaSink: TemplateDef = {
  theme: {
    colors: { primary: "#1d6f91", primaryDark: "#15536d", secondary: "#2a2f36", accent: "#b9c3cc", dark: "#16191e", light: "#f4f6f8", text: "#4b525b", heading: "#16191e" },
    font: "Manrope", radius: "0.625rem",
  },
  header: (biz) => ({
    design: "classic",
    logoText: biz, logoImage: INCREDA.logo,
    announcement: { show: true, text: "Bulk supply & custom stainless-steel fabrication for commercial kitchens — request a quotation.", link: "/bulk-orders" },
    topbar: { show: true, address: "Rohini Sector 35, Delhi", phones: [], email: "", social: { facebook: "", instagram: "", whatsapp: "" } },
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
    contact: { phones: [], email: "", address: INCREDA.address },
    social: { facebook: "", instagram: "", whatsapp: "", location: "" },
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
      { type: "cta", content: { title: "Have a drawing or BOQ?", highlight: "Send It for a Quote", phones: [], buttonLabel: "Custom Project Enquiry", buttonHref: "/custom-project" } },
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
      { ...industries, style: { layout: "cards", cardRadius: "lg", cardShadow: "md" } },
      { type: "imageBanner", content: { title: "Hospitals & Healthcare", subtitle: "Hand wash stations and hygienic wash areas for wards, kitchens and labs.", buttonLabel: "Enquire", buttonHref: "/bulk-orders", image: u(P.hospital) } },
      { type: "imageBanner", content: { title: "Food Processing & Factories", subtitle: "Vegetable wash sinks, utility sinks, work tables and drain tables.", buttonLabel: "Enquire", buttonHref: "/bulk-orders", image: u(P.foodPlant) } },
      ctaSec,
    ] },
    { slug: "projects", title: "Projects", isSystem: true, order: 6, sections: [
      { type: "banner", content: { title: "Projects &", titleHighlight: "Gallery", subtitle: "Installed sinks, wash stations and stainless-steel kitchen equipment.", image: u(P.chefKitchen), bgColor: "", imageOpacity: 40, overlayOpacity: 75 } },
      { type: "gallery", content: { eyebrow: "OUR WORK", title: "Installations &", titleHighlight: "Fabrication" }, style: { layout: "grid" } },
      ctaSec,
    ] },
    { slug: "catalogue", title: "Catalogue Download", isSystem: true, order: 7, showInNav: false, sections: [
      { type: "downloads", content: { eyebrow: "DOWNLOADS", title: "Product", titleHighlight: "Catalogues", items: [
        { title: "Increda Sink Product Catalogue", description: "Complete product range — upload the PDF in Admin → Pages.", link: "", icon: "book" },
        { title: "Commercial Sinks & Wash Stations", description: "Commercial, industrial and hand wash range.", link: "", icon: "droplet" },
        { title: "Stainless Steel Fabrication", description: "Work tables, racks, trolleys, cabinets and dish tables.", link: "", icon: "grid" },
      ] } },
      { type: "cta", content: { title: "Need a catalogue for a specific product?", highlight: "Ask Us", phones: [], buttonLabel: "Contact Us", buttonHref: "/contact" }, style: { layout: "minimal" } },
    ] },
    { slug: "about", title: "About Increda Sink", isSystem: true, order: 8, sections: [
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
      { type: "contactInfo", content: { eyebrow: "CONTACT", title: "Get in", titleHighlight: "Touch", address: INCREDA.address, phone: "", email: "", hours: "Mon–Sat: 10:00 AM – 7:00 PM", mapEmbed: "" } },
      { type: "richText", content: { html: `<h3>Business details</h3><p><strong>Brand:</strong> Increda Sink<br/><strong>Legal name:</strong> ${INCREDA.legalName}<br/><strong>Trade name:</strong> ${INCREDA.tradeName}<br/><strong>Constitution:</strong> ${INCREDA.constitution}<br/><strong>GSTIN:</strong> ${INCREDA.gstin}<br/><strong>Registered address:</strong> ${INCREDA.address}</p>` } },
      { type: "contactForm", content: { title: "Send Us a Message", subtitle: "Product questions, quotations or project enquiries — we reply on the same working day." } },
    ] },
    { slug: "faq", title: "FAQ", isSystem: true, order: 10, showInNav: false, sections: [
      { type: "faq", content: { eyebrow: "FAQ", title: "Frequently Asked", titleHighlight: "Questions", items: faqItems } },
      ctaSec,
    ] },
    { slug: "privacy", title: "Privacy Policy", isSystem: true, order: 101, showInNav: false, sections: [
      { type: "richText", content: { html: `<h2>Privacy Policy</h2><p>This website is operated by ${INCREDA.tradeName} (trade name Increda Sink), ${INCREDA.address}.</p><h3>Information we collect</h3><p>When you submit an enquiry or quotation request we collect the details you provide — such as your name, company name, phone / WhatsApp number, email, GST number, city, state, product requirements and any files you share.</p><h3>How we use it</h3><p>We use this information only to respond to your enquiry, prepare quotations, supply products and provide support. We do not sell your information.</p><h3>Sharing</h3><p>Information may be shared with transporters or service providers only as needed to deliver your order, or where required by law.</p><h3>Retention</h3><p>Enquiry records are kept for as long as needed for business and legal (including GST) requirements.</p><h3>Your choices</h3><p>You may ask us to update or delete your information by contacting us using the details on the Contact page.</p>` } },
    ] },
    { slug: "terms", title: "Terms & Conditions", isSystem: true, order: 102, showInNav: false, sections: [
      { type: "richText", content: { html: `<h2>Terms &amp; Conditions</h2><p>These terms apply to products and services supplied by ${INCREDA.tradeName} (trade name Increda Sink), GSTIN ${INCREDA.gstin}.</p><h3>Quotations</h3><p>Quotations are valid for the period stated on them. Prices, taxes, delivery charges and timelines are confirmed in the quotation or invoice.</p><h3>Custom orders</h3><p>Custom-fabricated items are made to the dimensions and specifications approved by the customer. Approved custom orders cannot be cancelled once fabrication has started.</p><h3>Payments</h3><p>Payment terms are as stated in the quotation. All supplies are billed with a GST tax invoice.</p><h3>Delivery</h3><p>Delivery timelines are estimates and may vary for custom items and bulk orders. Please inspect goods on delivery and report transit damage promptly.</p><h3>Specifications</h3><p>Product images are for illustration. Refer to the specification sheet or quotation for exact material, dimensions and finish.</p><h3>Jurisdiction</h3><p>Any disputes are subject to the jurisdiction of courts in Delhi.</p>` } },
    ] },
  ],
};
