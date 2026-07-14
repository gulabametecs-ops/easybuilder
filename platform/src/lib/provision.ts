import { db } from "./db";
import bcrypt from "bcryptjs";
import { getTemplate } from "./templates";
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
};

// Creates a fully-populated tenant from the default template.
// Used by the seed script and the marketing-site signup flow.
export async function createTenantFromTemplate(input: ProvisionInput) {
  const { businessName, subdomain, ownerEmail } = input;
  const biz = businessName;
  const tpl = getTemplate(input.vertical ?? "home-services");
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
        theme: JSON.stringify(tpl.theme),
        header: JSON.stringify(tpl.header(biz)),
        footer: JSON.stringify(tpl.footer(biz)),
        seo: JSON.stringify(tpl.seo(biz)),
      },
    });

    // Services
    await tx.service.createMany({
      data: tpl.services.map((s, i) => ({
        tenantId: tenant.id,
        category: s.category,
        title: s.title,
        description: s.description,
        image: img(`${s.title}-${i}`, 600, 400),
        order: i,
      })),
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
        },
      });

      let sections = page.sections as { type: string; content: unknown }[];
      const firstType = sections[0]?.type;
      if (page.slug !== "home" && firstType !== "banner" && firstType !== "hero") {
        const words = page.title.trim().split(/\s+/);
        const titleHighlight = words.length > 1 ? words.pop()! : "";
        sections = [
          { type: "banner", content: { title: words.join(" ") || page.title, titleHighlight, subtitle: "" } },
          ...sections,
        ];
      }

      // Home page: add social proof (testimonials) + FAQ before the trailing CTA.
      if (page.slug === "home") {
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

      await tx.section.createMany({
        data: sections.map((sec, i) => ({
          pageId: createdPage.id,
          type: sec.type,
          order: i,
          content: JSON.stringify(sec.content),
        })),
      });
    }

    // Legal pages (Terms & Privacy) — system pages, hidden from the nav but
    // linked in the footer. Editable by the client via the Pages editor.
    const legal: { slug: string; title: string; html: string }[] = [
      {
        slug: "terms",
        title: "Terms & Conditions",
        html: `<h2>Terms &amp; Conditions</h2><p>Welcome to ${biz}. By using our website and services, you agree to the following terms.</p><h3>Services</h3><p>We provide the services listed on this website. Pricing and availability may change without notice.</p><h3>Bookings & Payments</h3><p>Any quotes provided are estimates. Final charges are confirmed before work begins.</p><h3>Cancellations</h3><p>Please contact us in advance to reschedule or cancel a booking.</p><h3>Liability</h3><p>We take care in delivering quality service. Our liability is limited to the value of the service provided.</p><h3>Contact</h3><p>For any questions about these terms, please contact us using the details in the footer.</p>`,
      },
      {
        slug: "privacy",
        title: "Privacy Policy",
        html: `<h2>Privacy Policy</h2><p>${biz} respects your privacy. This policy explains how we handle your information.</p><h3>Information we collect</h3><p>We collect the details you provide through our enquiry, quote and booking forms — such as your name, phone, email and message.</p><h3>How we use it</h3><p>We use your information only to respond to your enquiry and provide our services. We do not sell your data.</p><h3>Your rights</h3><p>You may request access to or deletion of your information at any time by contacting us.</p>`,
      },
    ];
    for (const [i, l] of legal.entries()) {
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
