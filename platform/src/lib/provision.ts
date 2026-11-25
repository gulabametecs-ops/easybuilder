import { db } from "./db";
import bcrypt from "bcryptjs";
import { getTemplate } from "./templates";
import type { TemplateDef } from "./templates/types";
import { designTheme, designHeader, designFooter, designSeeds } from "./designs";
import type { SectionStyle } from "./config";
import { img } from "./img";

export type ProvisionInput = {
  businessName: string;
  subdomain: string;
  ownerEmail: string;
  ownerPassword?: string; // plain password (will be hashed)
  ownerPasswordHash?: string; // OR a pre-computed bcrypt hash (for recovery)
  plan?: string;
  status?: string;
  vertical?: string;
  subscriptionEndsAt?: Date | null;
  /** Design preset id (see lib/designs.ts); empty = template as designed. */
  design?: string;
  /** Client-specific template (scripts/sites/*) instead of the vertical's. */
  template?: TemplateDef;
};

// Creates a fully-populated tenant from the default template.
// Used by the seed script and the marketing-site signup flow.
export async function createTenantFromTemplate(input: ProvisionInput) {
  const { businessName, subdomain, ownerEmail } = input;
  const biz = businessName;
  const tpl = input.template ?? getTemplate(input.vertical ?? "home-services");
  const design = input.design ?? "";
  const passwordHash = input.ownerPasswordHash ?? (input.ownerPassword ? await bcrypt.hash(input.ownerPassword, 10) : "");
  if (!passwordHash) throw new Error("No password provided for the owner account");

  return db.$transaction(async (tx) => {
    const tenant = await tx.tenant.create({
      data: {
        name: biz,
        subdomain,
        plan: input.plan ?? "free",
        status: input.status ?? "active",
        vertical: input.vertical ?? "home-services",
        subscriptionEndsAt: input.subscriptionEndsAt ?? null,
      },
    });

    await tx.user.create({
      data: {
        tenantId: tenant.id,
        email: ownerEmail.toLowerCase(),
        password: passwordHash,
        name: biz,
        role: "owner",
      },
    });

    await tx.siteConfig.create({
      data: {
        tenantId: tenant.id,
        theme: JSON.stringify(designTheme(tpl.theme, design)),
        header: JSON.stringify(designHeader(tpl.header(biz), design)),
        footer: JSON.stringify(designFooter(tpl.footer(biz), design)),
        seo: JSON.stringify(tpl.seo(biz)),
      },
    });

    // Services
    const svcSlug = (t: string) => t.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "service";
    const seen = new Set<string>();
    await tx.service.createMany({
      data: tpl.services.map((s, i) => {
        let slug = svcSlug(s.title);
        while (seen.has(slug)) slug = `${svcSlug(s.title)}-${i}`;
        seen.add(slug);
        return {
          tenantId: tenant.id,
          category: s.category,
          title: s.title,
          description: s.description,
          longDescription: s.longDescription ?? "",
          options: JSON.stringify(s.options ?? []),
          image: img(`${s.title}-${i}`, 600, 400),
          order: i,
          slug,
        };
      }),
    });

    // Gallery
    await tx.galleryItem.createMany({
      data: tpl.gallery.map((g, i) => ({
        tenantId: tenant.id,
        category: g.category,
        image: img(`${g.caption}-${g.category}-${i}`, 600, 600),
        caption: g.caption,
        order: i,
      })),
    });

    // Pages + sections. Every inner page (not the home page) gets a page banner
    // prepended automatically, so each page has a hero-style header.
    for (const page of tpl.pages(biz)) {
      const createdPage = await tx.page.create({
        data: {
          tenantId: tenant.id,
          slug: page.slug,
          title: page.title,
          isSystem: page.isSystem,
          order: page.order,
          showInNav: page.showInNav !== false,
        },
      });

      let sections = page.sections as { type: string; content: unknown; style?: SectionStyle }[];
      const firstType = sections[0]?.type;
      if (page.slug !== "home" && firstType !== "banner" && firstType !== "hero") {
        const words = page.title.trim().split(/\s+/);
        const titleHighlight = words.length > 1 ? words.pop()! : "";
        sections = [
          { type: "banner", content: { title: words.join(" ") || page.title, titleHighlight, subtitle: "" } },
          ...sections,
        ];
      }

      // Home page: add generic social proof + FAQ before the trailing CTA — only when
      // the template doesn't already bring its own (vertical-specific) ones.
      if (page.slug === "home" && !sections.some((s) => s.type === "testimonials" || s.type === "faq")) {
        const extras = [
          { type: "testimonials", content: {
            eyebrow: "TESTIMONIALS", title: "What Our", titleHighlight: "Customers Say",
            items: [
              { name: "Ramesh Kumar", role: "Happy Customer", text: "Excellent service! The team was punctual, professional and did a fantastic job.", rating: 5 },
              { name: "Priya Sharma", role: "Happy Customer", text: "Very reliable and affordable. Highly recommended to everyone.", rating: 5 },
              { name: "Amit Verma", role: "Happy Customer", text: "Quick response and quality work. I will definitely come back again.", rating: 5 },
            ],
          } },
          { type: "faq", content: {
            eyebrow: "FAQ", title: "Frequently Asked", titleHighlight: "Questions",
            items: [
              { q: "How do I book?", a: "Fill the form or call us — we'll get back to you quickly." },
              { q: "Are your prices transparent?", a: "Yes, 100% transparent with no hidden charges." },
              { q: "Do you offer any guarantee?", a: "Absolutely — we stand behind the quality of our work." },
              { q: "Which areas do you serve?", a: "See the service areas in our footer, or contact us to confirm." },
            ],
          } },
        ];
        const lastIsCta = sections[sections.length - 1]?.type === "cta";
        sections = lastIsCta
          ? [...sections.slice(0, -1), ...extras, sections[sections.length - 1]]
          : [...sections, ...extras];
      }

      sections = designSeeds(sections, design);
      await tx.section.createMany({
        data: sections.map((sec, i) => ({
          pageId: createdPage.id,
          type: sec.type,
          order: i,
          content: JSON.stringify(sec.content),
          ...(sec.style && Object.keys(sec.style).length ? { style: JSON.stringify(sec.style) } : {}),
        })),
      });
    }

    const people = tpl.people?.(biz) ?? [];
    if (people.length) {
      await tx.person.createMany({
        data: people.map((p, i) => ({
          tenantId: tenant.id,
          name: p.name,
          role: p.role,
          bio: p.bio ?? "",
          image: p.image || img(`${p.name}-team-${i}`, 600, 600),
          groupName: p.groupName ?? "core",
          experience: p.experience ?? "",
          order: i,
          published: true,
        })),
      });
    }

    const causes = tpl.causes?.(biz) ?? [];
    if (causes.length) {
      const seen = new Set<string>();
      await tx.cause.createMany({
        data: causes.map((c, i) => {
          let slug = c.slug || svcSlug(c.title);
          while (seen.has(slug)) slug = `${svcSlug(c.title)}-${i}`;
          seen.add(slug);
          return {
            tenantId: tenant.id,
            slug,
            title: c.title,
            category: c.category,
            summary: c.summary,
            story: c.story,
            goalAmount: c.goalAmount,
            offlineRaised: c.offlineRaised ?? 0,
            offlineDonors: c.offlineDonors ?? 0,
            deadline: c.deadline ?? "",
            urgent: !!c.urgent,
            beneficiaries: c.beneficiaries ?? "",
            location: c.location ?? "",
            impactTiers: JSON.stringify(c.impactTiers ?? []),
            updates: JSON.stringify(c.updates ?? []),
            status: c.status ?? "active",
            featured: !!c.featured,
            order: i,
          };
        }),
      });
    }

    const properties = tpl.properties?.(biz) ?? [];
    if (properties.length) {
      const seen = new Set<string>();
      await tx.property.createMany({
        data: properties.map((p, i) => {
          let slug = p.slug || svcSlug(p.title);
          while (seen.has(slug)) slug = `${svcSlug(p.title)}-${i}`;
          seen.add(slug);
          return {
            tenantId: tenant.id,
            slug,
            title: p.title,
            purpose: p.purpose,
            propertyType: p.propertyType,
            price: p.price,
            priceNote: p.priceNote ?? "",
            deposit: p.deposit ?? 0,
            maintenance: p.maintenance ?? 0,
            bhk: p.bhk ?? "",
            areaSqft: p.areaSqft ?? 0,
            furnishing: p.furnishing ?? "",
            bathrooms: p.bathrooms ?? 0,
            floor: p.floor ?? "",
            facing: p.facing ?? "",
            parking: p.parking ?? "",
            availableFrom: p.availableFrom ?? "",
            possession: p.possession ?? "",
            rera: p.rera ?? "",
            sharing: p.sharing ?? "",
            foodIncluded: !!p.foodIncluded,
            gender: p.gender ?? "",
            locality: p.locality,
            city: p.city,
            address: p.address ?? "",
            summary: p.summary,
            description: p.description,
            highlights: JSON.stringify(p.highlights ?? []),
            amenities: JSON.stringify(p.amenities ?? []),
            floorPlans: JSON.stringify((p.floorPlans ?? []).map((f) => ({ label: f.label, area: f.area ?? "", image: "" }))),
            status: p.status ?? "available",
            featured: !!p.featured,
            order: i,
          };
        }),
      });
    }

    const products = tpl.products?.(biz) ?? [];
    if (products.length) {
      const seen = new Set<string>();
      await tx.product.createMany({
        data: products.map((p, i) => {
          let slug = svcSlug(p.name);
          while (seen.has(slug)) slug = `${svcSlug(p.name)}-${i}`;
          seen.add(slug);
          return {
            tenantId: tenant.id,
            slug,
            name: p.name,
            category: p.category,
            price: p.price,
            mrp: p.mrp ?? 0,
            description: p.description,
            stock: p.stock ?? 20,
            options: JSON.stringify(p.options ?? []),
            badge: p.badge ?? "",
            featured: !!p.featured,
            order: i,
          };
        }),
      });
    }

    const events = tpl.events?.(biz) ?? [];
    if (events.length) {
      const seenSlugs = new Set<string>();
      await tx.siteEvent.createMany({
        data: events.map((e, i) => {
          let slug = (e.slug || svcSlug(e.title));
          while (seenSlugs.has(slug)) slug = `${svcSlug(e.title)}-${i}`;
          seenSlugs.add(slug);
          return {
            tenantId: tenant.id,
            slug,
            title: e.title,
            activityName: e.activityName ?? e.title,
            shortDescription: e.shortDescription ?? "",
            programDescription: e.programDescription ?? "",
            date: e.date,
            location: e.location ?? "",
            organizedBy: e.organizedBy ?? biz,
            dignitaries: e.dignitaries ?? "",
            impact: e.impact ?? "",
            coverImage: img(`${e.title}-event-${i}`, 1200, 720),
            gallery: JSON.stringify([
              img(`${e.title}-g1-${i}`, 800, 600),
              img(`${e.title}-g2-${i}`, 800, 600),
              img(`${e.title}-g3-${i}`, 800, 600),
            ]),
            objectives: JSON.stringify(e.objectives ?? []),
            documents: JSON.stringify(e.documents ?? []),
            status: e.status ?? "auto",
            mapUrl: e.mapUrl ?? "",
            venueNote: e.venueNote ?? "",
            blocks: JSON.stringify(e.blocks ?? []),
            enableDonate: !!e.enableDonate,
            donateAmount: e.donateAmount ?? 0,
            donateLabel: "",
            showQr: !!e.showQr,
            qrCaption: e.qrCaption ?? "",
            published: true,
            order: i,
          };
        }),
      });
    }

    // Legal pages — system pages, hidden from the nav but linked in the footer.
    // Editable by the client via the Pages editor. /privacy is not provisioned:
    // the site route renders a full built-in notice (TenantPrivacy) unless the
    // client creates its own page with slug "privacy".
    const legal: { slug: string; title: string; html: string }[] = [
      {
        slug: "terms",
        title: "Terms & Conditions",
        html: `<h2>Terms &amp; Conditions</h2><p>Welcome to ${biz}. By using our website and services, you agree to the following terms.</p><h3>Services</h3><p>We provide the services listed on this website. Pricing and availability may change without notice.</p><h3>Bookings & Payments</h3><p>Any quotes provided are estimates. Final charges are confirmed before work begins.</p><h3>Cancellations</h3><p>Please contact us in advance to reschedule or cancel a booking.</p><h3>Liability</h3><p>We take care in delivering quality service. Our liability is limited to the value of the service provided.</p><h3>Contact</h3><p>For any questions about these terms, please contact us using the details in the footer.</p>`,
      },
    ];
    const own = new Set(tpl.pages(biz).map((p) => p.slug));
    for (const [i, l] of legal.filter((x) => !own.has(x.slug)).entries()) {
      const p = await tx.page.create({
        data: { tenantId: tenant.id, slug: l.slug, title: l.title, isSystem: true, showInNav: false, order: 100 + i },
      });
      await tx.section.createMany({
        data: [
          { pageId: p.id, type: "banner", order: 0, content: JSON.stringify({ title: l.title.split(" ")[0], titleHighlight: l.title.split(" ").slice(1).join(" "), subtitle: "" }) },
          { pageId: p.id, type: "richText", order: 1, content: JSON.stringify({ html: l.html }) },
        ],
      });
    }

    return tenant;
  });
}
