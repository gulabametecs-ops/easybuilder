import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  websiteBlueprintSchema,
  modifyResponseSchema,
  filterValidSectionTypes,
} from "./blueprintSchema";
import { isAllowedSectionType } from "./builderRegistry";
import { designToTheme, resolvePageSections } from "./hydrate";
import { defaultTheme } from "@/lib/template";
import { isValidGroqModelId, resolveGroqModel, GROQ_DEFAULT_MODEL } from "@/lib/groqModel";
import { extractJsonText } from "./groq";
import { enrichBlueprint, inferVerticalId } from "./enrichBlueprint";
import { normalizeBlueprint } from "./normalizeBlueprint";
import { mergeBlueprintPatch } from "./publicModify";
import { detectColorIntent } from "./colorIntent";

const validBlueprint = {
  website: { name: "Nova Digital", type: "agency", description: "Digital marketing agency" },
  design: { style: "dark premium", primaryColor: "#1e293b" },
  pages: [
    {
      name: "Home",
      slug: "home",
      sections: [
        { sectionType: "hero", content: { heading: "Grow Faster" } },
        { sectionType: "services", content: { heading: "Our Services" } },
        { sectionType: "faq", content: { heading: "FAQ" } },
      ],
    },
    {
      name: "Contact",
      slug: "contact",
      sections: [{ sectionType: "contact", content: { heading: "Contact Us" } }],
    },
  ],
};

describe("AI blueprint validation", () => {
  it("accepts a valid business website blueprint", () => {
    const filtered = filterValidSectionTypes(validBlueprint);
    const parsed = websiteBlueprintSchema.safeParse(filtered);
    assert.equal(parsed.success, true);
    assert.equal(parsed.data?.pages.length, 2);
  });

  it("accepts a SaaS blueprint with pricing and features", () => {
    const blueprint = {
      website: { name: "CloudApp" },
      pages: [
        {
          name: "Home",
          slug: "home",
          sections: [
            { sectionType: "hero" },
            { sectionType: "features" },
            { sectionType: "pricingPlans" },
            { sectionType: "contactForm" },
          ],
        },
      ],
    };
    const parsed = websiteBlueprintSchema.safeParse(filterValidSectionTypes(blueprint));
    assert.equal(parsed.success, true);
    assert.deepEqual(
      parsed.data?.pages[0].sections?.map((s) => s.sectionType),
      ["hero", "features", "pricingPlans", "contactForm"],
    );
  });

  it("accepts a restaurant blueprint with menu and gallery", () => {
    const blueprint = {
      website: { name: "Royal Spice" },
      design: { style: "luxury dark gold" },
      pages: [
        {
          name: "Home",
          slug: "home",
          sections: [{ sectionType: "hero" }, { sectionType: "gallery" }],
        },
        { name: "Menu", slug: "menu", sections: [{ sectionType: "services" }] },
      ],
    };
    const parsed = websiteBlueprintSchema.safeParse(filterValidSectionTypes(blueprint));
    assert.equal(parsed.success, true);
  });

  it("strips invalid section types without failing parse", () => {
    const blueprint = {
      website: { name: "Test" },
      pages: [
        {
          name: "Home",
          slug: "home",
          sections: [
            { sectionType: "hero" },
            { sectionType: "not_a_real_section" },
            { sectionType: "html" },
          ],
        },
      ],
    };
    const filtered = filterValidSectionTypes(blueprint as typeof validBlueprint);
    assert.equal(filtered.pages[0].sections?.length, 1);
    assert.equal(filtered.pages[0].sections?.[0].sectionType, "hero");
    assert.equal(isAllowedSectionType("html"), false);
  });

  it("rejects invalid blueprint shape", () => {
    const parsed = websiteBlueprintSchema.safeParse({ website: { name: "" }, pages: [] });
    assert.equal(parsed.success, false);
  });
});

describe("AI modify operations", () => {
  it("accepts theme update for dark mode request", () => {
    const parsed = modifyResponseSchema.safeParse({
      message: "Made the site darker.",
      operations: [
        {
          op: "update_theme",
          theme: { colors: { dark: "#0a0f0d", light: "#141a16" } },
        },
      ],
    });
    assert.equal(parsed.success, true);
  });

  it("accepts add_section below services", () => {
    const parsed = modifyResponseSchema.safeParse({
      message: "Added testimonials.",
      operations: [
        {
          op: "add_section",
          pageSlug: "home",
          sectionType: "testimonials",
          afterSectionId: "sec-services",
        },
      ],
    });
    assert.equal(parsed.success, true);
  });

  it("accepts hero heading update only", () => {
    const parsed = modifyResponseSchema.safeParse({
      message: "Updated hero heading.",
      operations: [
        {
          op: "update_section",
          sectionId: "sec-hero",
          content: { heading: "Build Faster" },
        },
      ],
    });
    assert.equal(parsed.success, true);
    assert.equal(parsed.data?.operations.length, 1);
  });

  it("rejects invalid operation shape", () => {
    const parsed = modifyResponseSchema.safeParse({
      message: "Bad",
      operations: [{ op: "unknown_op" }],
    });
    assert.equal(parsed.success, false);
  });
});

describe("design intelligence", () => {
  it("maps dark premium style to theme colors", () => {
    const theme = designToTheme({ style: "dark premium" }, defaultTheme);
    assert.equal(theme.colors.dark, "#0a0f0d");
    assert.equal(theme.colors.heading, "#f8fafc");
  });

  it("fills missing hero button hrefs so preview Links do not crash", () => {
    const sections = resolvePageSections({
      name: "Home",
      slug: "home",
      sections: [{ sectionType: "hero", content: { heading: "Welcome", primaryBtn: { label: "Donate" } } }],
    });
    const hero = JSON.parse(sections[0].content) as {
      primaryBtn: { label: string; href: string };
      secondaryBtn: { label: string; href: string };
    };
    assert.equal(typeof hero.primaryBtn.href, "string");
    assert.ok(hero.primaryBtn.href.length > 0);
    assert.equal(typeof hero.secondaryBtn.href, "string");
    assert.ok(hero.secondaryBtn.href.length > 0);
    assert.equal(hero.primaryBtn.label, "Donate");
  });
});

describe("groq model validation", () => {
  it("accepts full vendor/model ids", () => {
    assert.equal(isValidGroqModelId("openai/gpt-oss-120b"), true);
  });

  it("rejects partial names like openai or new", () => {
    assert.equal(isValidGroqModelId("openai"), false);
    assert.equal(isValidGroqModelId("new"), false);
    assert.equal(resolveGroqModel("openai"), GROQ_DEFAULT_MODEL);
  });
});

describe("blueprint normalization", () => {
  it("accepts Groq-style messy JSON with aliases and extra questions", () => {
    const messy = {
      website: { name: "Hope Trust", description: "A".repeat(800) },
      questions: ["q1", "q2", "q3", "q4", "q5", "q6"],
      pages: [
        {
          name: "Home",
          slug: "/home",
          sections: [
            { sectionType: "hero", imageIntent: "children classroom", content: "Welcome" },
            { type: "services", content: { heading: "Programs" } },
            { sectionType: "contact", style: "dark" },
          ],
        },
      ],
    };
    const parsed = normalizeBlueprint(messy);
    assert.ok(parsed);
    assert.equal(parsed?.website.name, "Hope Trust");
    assert.ok((parsed?.website.description?.length ?? 0) <= 500);
    assert.equal(parsed?.questions?.length, 6);
    const types = parsed?.pages[0].sections?.map((s) => s.sectionType) ?? [];
    assert.deepEqual(types, ["hero", "serviceCategories", "contactForm"]);
    assert.equal(parsed?.pages[0].slug, "home");
  });
});

describe("blueprint enrichment", () => {
  it("adds NGO pages and requirements from prompt keywords", () => {
    const sparse = {
      website: { name: "Hope Foundation" },
      pages: [{ name: "Home", slug: "home", sections: [{ sectionType: "hero" }] }],
    };
    const enriched = enrichBlueprint(sparse, "Create an NGO website for child education charity");
    assert.ok(enriched.pages.length >= 5);
    assert.ok(enriched.pages.some((p) => p.slug === "programs" || p.slug === "about"));
    assert.ok((enriched.questions?.length ?? 0) >= 2);
    assert.equal(enriched.website.type, "ngo");
    assert.equal(inferVerticalId(enriched, "NGO child education"), "ngo-charity");
    const home = enriched.pages.find((p) => p.slug === "home");
    const homeTypes = home?.sections?.map((s) => s.sectionType) ?? [];
    assert.ok(homeTypes.length >= 5);
    assert.ok(homeTypes.includes("hero") && homeTypes.includes("about") && homeTypes.includes("cta"));
    const abouts = enriched.pages.filter((p) => p.slug === "about" || p.slug === "about-us");
    assert.equal(abouts.length, 1);
  });

  it("merges About Us duplicate slugs into one about page", () => {
    const sparse = {
      website: { name: "GULAB NGO", type: "ngo" },
      pages: [
        { name: "Home", slug: "home", sections: [{ sectionType: "hero" }] },
        { name: "About Us", slug: "about-us", sections: [{ sectionType: "about" }] },
        { name: "About Us", slug: "about", sections: [] },
      ],
    };
    const enriched = enrichBlueprint(sparse, "NGO child education");
    const abouts = enriched.pages.filter((p) => p.slug === "about" || p.slug === "about-us");
    assert.equal(abouts.length, 1);
    assert.equal(abouts[0].slug, "about");
  });
});

describe("json extraction", () => {
  it("extracts json from markdown fences", () => {
    const raw = '```json\n{"website":{"name":"Test"}}\n```';
    assert.deepEqual(JSON.parse(extractJsonText(raw)), { website: { name: "Test" } });
  });
});

describe("AI sector playbooks", () => {
  it("keeps a gym a gym even when the AI copy says classes / trusted / healthy", () => {
    const bp = normalizeBlueprint({
      website: { name: "IronPulse Fitness", type: "gym", description: "Trusted gym with group classes for a healthy life" },
      pages: [{ name: "Home", slug: "home", sections: [] }],
    })!;
    const slugs = enrichBlueprint(bp, "A modern gym in Pune with membership plans and trainers").pages.map((p) => p.slug);
    assert.ok(slugs.includes("membership"), `expected gym pages, got ${slugs.join(",")}`);
    for (const wrong of ["courses", "faculty", "admissions", "impact", "doctors"]) {
      assert.ok(!slugs.includes(wrong), `unexpected ${wrong} page in ${slugs.join(",")}`);
    }
  });

  it("matches whole words only", () => {
    const bp = normalizeBlueprint({
      website: { name: "Blue Tile Studio", type: "interior design", description: "A trusted studio" },
      pages: [{ name: "Home", slug: "home", sections: [] }],
    })!;
    const slugs = enrichBlueprint(bp, "Interior design studio website").pages.map((p) => p.slug);
    assert.ok(!slugs.includes("get-involved"), `NGO pages leaked in: ${slugs.join(",")}`);
    assert.ok(!slugs.includes("portfolio"), `agency pages leaked in: ${slugs.join(",")}`);
  });
});

describe("AI refine patch merge", () => {
  const base = normalizeBlueprint({
    website: { name: "IronPulse", type: "gym" },
    design: { primaryColor: "#7cb518", style: "modern" },
    pages: [
      { name: "Home", slug: "home", sections: [{ sectionType: "hero", content: { titleTop: "Old" } }] },
      { name: "About", slug: "about", sections: [{ sectionType: "about" }] },
    ],
  })!;

  it("changes only design for a colour request and keeps every page", () => {
    const out = mergeBlueprintPatch(base, { design: { primaryColor: "#1e3a8a" } });
    assert.equal(out.design?.primaryColor, "#1e3a8a");
    assert.equal(out.design?.style, "modern");
    assert.deepEqual(out.pages.map((p) => p.slug), ["home", "about"]);
  });

  it("replaces a changed page by slug, appends new pages, never removes home", () => {
    const out = mergeBlueprintPatch(base, {
      pages: [
        { name: "Home", slug: "home", sections: [{ sectionType: "hero", content: { titleTop: "New" } }, { sectionType: "faq" }] },
        { name: "Pricing", slug: "pricing", sections: [{ sectionType: "pricingPlans" }] },
      ],
      removePages: ["home", "about"],
    });
    assert.deepEqual(out.pages.map((p) => p.slug), ["home", "pricing"]);
    assert.equal(out.pages[0].sections?.length, 2);
    assert.equal((out.pages[0].sections?.[0].content as { titleTop: string }).titleTop, "New");
  });

  it("keeps a dark secondary colour and blocks unrequested new pages", () => {
    const out = mergeBlueprintPatch(
      { ...base, design: { ...base.design, secondaryColor: "#0f172a" } },
      { design: { primaryColor: "#2563eb", secondaryColor: "#ff8a65" }, pages: [{ name: "Pricing", slug: "pricing", sections: [] }] },
      { allowNewPages: false },
    );
    assert.equal(out.design?.primaryColor, "#2563eb");
    assert.equal(out.design?.secondaryColor, "#0f172a");
    assert.ok(!out.pages.some((p) => p.slug === "pricing"));
  });
});

describe("colour-only refine requests", () => {
  it("handles named colours and plain theme changes locally", () => {
    assert.equal(detectColorIntent("make it blue")?.name, "Blue");
    assert.equal(detectColorIntent("change the colour to purple")?.name, "Purple");
    assert.equal(detectColorIntent("red")?.name, "Red");
    const a = detectColorIntent("change the color theme", "#7cb518");
    const b = detectColorIntent("change the color theme", a!.primary);
    assert.ok(a && b && a.primary !== b.primary, "theme change should rotate palettes");
  });

  it("leaves content changes to the AI", () => {
    assert.equal(detectColorIntent("Add an FAQ section"), null);
    assert.equal(detectColorIntent("make the hero headline blue and shorter"), null);
    assert.equal(detectColorIntent("add a pricing page"), null);
  });
});

describe("AI site completeness & design presets", () => {
  it("fills thin lists and names inner-page banners", () => {
    const team = resolvePageSections({ name: "Our Trainers", slug: "trainers", pageTemplateId: "team" });
    const banner = JSON.parse(team.find((s) => s.type === "banner")!.content);
    assert.equal(`${banner.title} ${banner.titleHighlight}`.trim(), "Our Trainers");
    const members = JSON.parse(team.find((s) => s.type === "team")!.content).members;
    assert.equal(members.length, 4);
    const reviews = resolvePageSections({ name: "Home", slug: "home", sections: [{ sectionType: "testimonials", content: { items: [{ name: "Asha", text: "Great", rating: 5 }] } }] });
    assert.equal(JSON.parse(reviews[0].content).items.length, 3);
  });

  it("applies the chosen preset to theme, hero and header", () => {
    const design = { primaryColor: "#2563eb", secondaryColor: "#0f172a", preset: "bold" };
    const hero = resolvePageSections({ name: "Home", slug: "home", sections: [{ sectionType: "hero", content: { titleTop: "Hi" } }] }, design);
    assert.equal(JSON.parse(hero[0].content).variant, "gradient");
    assert.equal(designToTheme(design).font, "Sora");
    assert.equal(designToTheme(design).colors.primary, "#2563eb");
  });
});
