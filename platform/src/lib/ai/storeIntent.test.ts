import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { detectStoreIntent, storeSector } from "./storeIntent";
import { enrichBlueprint, inferVerticalId } from "./enrichBlueprint";
import { normalizeBlueprint } from "./normalizeBlueprint";
import { withSampleProducts } from "./publicPlan";

describe("online store vs services detection", () => {
  const store: [string, string][] = [
    ["I want an online store to sell sarees and kurtis with COD", "fashion-store"],
    ["ecommerce website for my mobile accessories and earbuds business", "electronics-store"],
    ["Mujhe apni kirana dukaan online karni hai, customers ghar baithe sabzi order karein, cash on delivery", "grocery-store"],
    ["Online shop for handmade candles and gift hampers", "gifts-store"],
    ["sell my skincare and makeup products online", "beauty-store"],
    ["Furniture e-commerce site with cart and checkout", "home-decor-store"],
    ["I sell pet food and toys online, need a website with cart", "online-store"],
  ];
  for (const [prompt, sector] of store) {
    it(`store: ${prompt.slice(0, 40)}…`, () => {
      assert.deepEqual(detectStoreIntent(prompt), { isStore: true, vertical: sector });
    });
  }

  const services = [
    "Website for my unisex salon with appointment booking",
    "Coffee shop in Pune with menu and table booking",
    "Medical store near the hospital, show timings and contact",
    "Mobile repair shop — services list and pickup booking",
    "Boutique interior design studio portfolio",
    "Barber shop website",
  ];
  for (const prompt of services) {
    it(`service: ${prompt.slice(0, 40)}…`, () => assert.equal(detectStoreIntent(prompt).isStore, false));
  }

  it("falls back to the general store for unknown product ranges", () => {
    assert.equal(storeSector("books and stationery"), "online-store");
  });
});

describe("store blueprints", () => {
  const bp = () => normalizeBlueprint({
    website: { name: "Rangoli Threads", type: "fashion" },
    pages: [
      { name: "Home", slug: "home", sections: [{ sectionType: "hero" }] },
      { name: "Products", slug: "products", sections: [{ sectionType: "services" }] },
      { name: "Lookbook", slug: "lookbook", sections: [{ sectionType: "gallery" }] },
    ],
    products: [
      { name: "Silk Saree", category: "Sarees", price: "₹3,499", mrp: 4999, description: "Pure silk" },
      { name: "Cotton Kurti", category: "Kurtis", price: 899, options: [{ name: "Size", values: "S, M, L" }] },
      { name: "Free thing", category: "X", price: 0 },
    ],
  })!;

  it("normalizes the AI catalogue (string prices, comma options, no ₹0 rows)", () => {
    const p = bp().products!;
    assert.equal(p.length, 2);
    assert.equal(p[0].price, 3499);
    assert.deepEqual(p[1].options, [{ name: "Size", values: ["S", "M", "L"] }]);
  });

  it("builds a shop: product grid on /shop, store home, custom pages kept", () => {
    const out = enrichBlueprint(bp(), "online clothing store with cash on delivery");
    assert.equal(out.website.type, "ecommerce store");
    const slugs = out.pages.map((p) => p.slug);
    assert.deepEqual(slugs.slice(0, 2), ["home", "shop"]);
    assert.ok(slugs.includes("lookbook") && slugs.includes("contact"), slugs.join(","));
    assert.ok(out.pages.find((p) => p.slug === "shop")!.sections!.some((s) => s.sectionType === "productGrid"));
    const home = out.pages[0].sections!.map((s) => s.sectionType);
    assert.ok(home.includes("productGrid") && home.includes("productCategories"), home.join(","));
    assert.equal(inferVerticalId(out, "online clothing store"), "fashion-store");
  });

  it("fills an empty catalogue from the closest sector's samples", () => {
    const out = withSampleProducts(enrichBlueprint({ ...bp(), products: undefined }, "sell electronics gadgets online"), "sell electronics gadgets online");
    assert.ok((out.products?.length ?? 0) >= 8);
  });
});

describe("custom requirements are not forced into a sector", () => {
  it("keeps a full custom plan instead of padding it with playbook pages", () => {
    const bp = normalizeBlueprint({
      website: { name: "Sky Lantern Co", type: "drone light shows" },
      pages: ["Home", "Shows", "Book a Show", "Safety", "Contact"].map((name, i) => ({ name, slug: i ? name.toLowerCase().replace(/ /g, "-") : "home", sections: [{ sectionType: "richText" }] })),
    })!;
    const slugs = enrichBlueprint(bp, "drone light show company for weddings and events, need safety page").pages.map((p) => p.slug);
    for (const wrong of ["speakers", "tickets", "register"]) assert.ok(!slugs.includes(wrong), slugs.join(","));
    assert.ok(slugs.includes("safety"));
  });

  it("maps agencies to the digital-marketing sector and sector names generally", () => {
    assert.equal(inferVerticalId({ website: { type: "agency" } }, "digital marketing agency in Delhi"), "digital-marketing");
    assert.equal(inferVerticalId({ website: {} }, "We are a packers and movers company in Pune"), "packers-movers");
  });
});
