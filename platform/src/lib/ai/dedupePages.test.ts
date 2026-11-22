import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { dedupePages } from "./dedupePages";
import { normalizeBlueprint } from "./normalizeBlueprint";
import { enrichBlueprint } from "./enrichBlueprint";

type P = { name: string; slug: string; sections?: { sectionType: string; content?: Record<string, unknown> }[] };

describe("dedupePages", () => {
  it("drops synonym, same-title and same-slug duplicates, keeping the first", () => {
    const out = dedupePages<P>([
      { name: "Home", slug: "home", sections: [{ sectionType: "cta", content: { buttonHref: "/book-a-table#form" } }] },
      { name: "Reservations", slug: "reservations", sections: [{ sectionType: "appointmentForm" }] },
      { name: "Book a Table", slug: "book-a-table", sections: [{ sectionType: "appointmentForm" }, { sectionType: "faq" }] },
      { name: "Contact", slug: "contact", sections: [] },
      { name: "Contact Us", slug: "contact-us", sections: [{ sectionType: "contactForm" }] },
      { name: "Menu", slug: "menu" },
      { name: "Menu", slug: "our-menu" },
      { name: "Menu Card", slug: "menu" },
    ]);
    assert.deepEqual(out.map((p) => p.slug), ["home", "reservations", "contact", "menu"]);
    // Only new section types are merged in.
    assert.deepEqual(out[1].sections?.map((s) => s.sectionType), ["appointmentForm", "faq"]);
    assert.deepEqual(out[2].sections?.map((s) => s.sectionType), ["contactForm"]);
    // Links to the dropped slug now point at the kept page.
    assert.equal(out[0].sections?.[0].content?.buttonHref, "/reservations#form");
  });

  it("leaves distinct pages alone", () => {
    const pages = [{ name: "Home", slug: "home" }, { name: "About", slug: "about" }, { name: "Gallery", slug: "gallery" }];
    assert.equal(dedupePages(pages).length, 3);
  });

  it("runs inside normalizeBlueprint and enrichBlueprint", () => {
    const bp = normalizeBlueprint({
      website: { name: "Spice Route", type: "restaurant" },
      pages: [
        { name: "Home", slug: "home", sections: [{ sectionType: "hero", content: { buttonHref: "/get-in-touch" } }] },
        { name: "Contact", slug: "contact", sections: [{ sectionType: "contactForm" }] },
        { name: "Get in Touch", slug: "get-in-touch", sections: [{ sectionType: "contactForm" }] },
        { name: "Reservations", slug: "reservations", sections: [{ sectionType: "appointmentForm" }] },
      ],
    });
    assert.ok(bp);
    assert.deepEqual(bp.pages.map((p) => p.slug), ["home", "contact", "reservations"]);
    assert.equal(bp.pages[0].sections?.[0].content?.buttonHref, "/contact");

    const enriched = enrichBlueprint(bp, "restaurant with table booking");
    const slugs = enriched.pages.map((p) => p.slug);
    assert.equal(new Set(slugs).size, slugs.length);
    const bookingLike = slugs.filter((s) => ["book", "booking", "reservations", "book-a-table", "appointment"].includes(s));
    assert.ok(bookingLike.length <= 1, `duplicate booking pages: ${slugs.join(",")}`);
  });
});
