import type { TemplateDef, SectionSeed } from "./types";

// Jewellery Store (gold, diamond, silver, bridal, custom design):
// deep maroon + antique gold, serif and luxurious, conversion on the showroom appointment.
const PHONE = "9000000000";
const CATEGORIES = ["Gold Jewellery", "Diamond Jewellery", "Bridal Collections", "Silver & Gifting"];

const goldRate: SectionSeed<"priceList"> = {
  type: "priceList",
  content: {
    eyebrow: "TODAY'S RATE", title: "Live Gold &", titleHighlight: "Silver Rates",
    note: "Rates per gram, updated every morning at 10 AM. GST 3% and making charges extra. Call to lock today's rate on your booking.",
    groups: [
      { category: "Gold", items: [
        { name: "24 Karat (999)", price: "₹7,820 / g", note: "Coins & bars" },
        { name: "22 Karat (916 Hallmarked)", price: "₹7,170 / g", note: "Jewellery" },
        { name: "18 Karat (750)", price: "₹5,865 / g", note: "Diamond settings" },
      ] },
      { category: "Silver & Platinum", items: [
        { name: "Silver (999)", price: "₹96 / g", note: "Articles & coins" },
        { name: "Sterling Silver (925)", price: "₹102 / g", note: "Jewellery" },
        { name: "Platinum (950)", price: "₹3,250 / g", note: "Couple bands" },
      ] },
    ],
  },
  style: { background: "dark", align: "center", cardRadius: "sm" },
};

const promises: SectionSeed<"features"> = {
  type: "features",
  content: { items: [
    { icon: "badge-check", title: "BIS Hallmarked (HUID)", text: "Every gold piece carries a 6-digit HUID you can verify on the BIS Care app." },
    { icon: "award", title: "IGI / GIA Certified Diamonds", text: "Natural diamonds graded for cut, colour, clarity and carat." },
    { icon: "trending", title: "Lifetime Exchange", text: "Exchange or buy back your jewellery any time at today's gold value." },
    { icon: "tag", title: "Transparent Making Charges", text: "Making, stone and wastage listed separately on every invoice." },
  ] },
  style: { align: "center", cardShadow: "none", cardBorderWidth: 1, cardRadius: "sm" },
};

const testimonials: SectionSeed<"testimonials"> = {
  type: "testimonials",
  content: { eyebrow: "CHERISHED MOMENTS", title: "Loved by", titleHighlight: "Families", items: [
    { name: "Aishwarya & Karthik", role: "Bridal Set, Chennai", text: "They redesigned my grandmother's kasu mala into a modern temple set for my wedding. It looked like an heirloom and felt brand new.", rating: 5 },
    { name: "Meenal Joshi", role: "Diamond Solitaire Ring", text: "The staff explained the IGI certificate patiently and showed me five stones side by side. No pressure at all — just honest advice.", rating: 5 },
    { name: "Gurpreet Kaur", role: "Old Gold Exchange", text: "My old chains were melted and tested in front of me. The value was fair and I took home a lovely new necklace the same day.", rating: 5 },
    { name: "Rahul Agarwal", role: "Anniversary Gift", text: "Ordered a custom pendant with our initials. Delivered in 12 days, beautifully packed with a hallmark certificate.", rating: 5 },
  ] },
  style: { background: "light", align: "center" },
};

const bridalPlans: SectionSeed<"pricingPlans"> = {
  type: "pricingPlans",
  content: { eyebrow: "BRIDAL PACKAGES", title: "Curated", titleHighlight: "Bridal Sets", plans: [
        { name: "Muhurtham Essentials", price: "From ₹3.5 Lakh", period: "approx. 45 g", featured: false, buttonLabel: "Book Consultation", buttonHref: "/appointment", features: ["Necklace & matching jhumkas", "Pair of bangles", "Mangalsutra / thali chain", "Free bridal styling session"] },
        { name: "Grand Bridal Trousseau", price: "From ₹9 Lakh", period: "approx. 110 g", featured: true, buttonLabel: "Book Consultation", buttonHref: "/appointment", features: ["Choker + long haaram", "Vanki, oddiyanam & maang tikka", "4 bangles & 2 kadas", "Flat 30% off making charges", "Complimentary groom's ring"] },
        { name: "Heirloom Polki & Diamond", price: "From ₹18 Lakh", period: "custom", featured: false, buttonLabel: "Book Consultation", buttonHref: "/appointment", features: ["Uncut polki or diamond set", "Designed with our studio", "Certified stones & HUID gold", "Lifetime cleaning & polish"] },
      ] }, style: { background: "light", cardRadius: "sm", cardShadow: "lg" }
};

const savingsScheme: SectionSeed<"steps"> = {
  type: "steps",
  content: { eyebrow: "11-MONTH GOLD SAVINGS SCHEME", title: "Save Monthly,", titleHighlight: "Buy Gold Smarter", items: [
    { title: "Choose Your Instalment", text: "Start from ₹2,000 a month — pay by UPI, card or at the showroom.", icon: "calendar" },
    { title: "Pay for 11 Months", text: "Each instalment is recorded in your passbook and on WhatsApp.", icon: "clipboard" },
    { title: "We Add the 12th", text: "We contribute one full instalment as a bonus at maturity.", icon: "gift" },
    { title: "Pick Your Jewellery", text: "Redeem against any gold jewellery with 50% off making charges.", icon: "award" },
  ] },
  style: { layout: "timeline" },
};

const cta: SectionSeed<"cta"> = {
  type: "cta",
  content: { title: "See the collection in person", highlight: "Book a Private Showroom Visit", phones: [PHONE], buttonLabel: "Book Appointment", buttonHref: "/appointment" },
};

export const jewelleryStore: TemplateDef = {
  theme: {
    colors: { primary: "#b45309", primaryDark: "#92400e", secondary: "#4a0e1c", accent: "#d4a24c", dark: "#1a0a0f", light: "#fbf6ee", text: "#4a3b3b", heading: "#2b0a13" },
    font: "Cormorant Garamond", radius: "0.15rem",
  },
  header: (biz) => ({
    design: "centered",
    logoText: biz, logoImage: "",
    announcement: { show: true, text: "Wedding season offer · Up to 30% off on making charges for bridal jewellery", link: "/bridal" },
    topbar: { show: true, address: "Your City · BIS Hallmarked Jewellers since 1978", phones: [PHONE], email: "hello@example.com", social: { facebook: "#", instagram: "#", whatsapp: "#" } },
    nav: [
      { label: "Home", href: "/" }, { label: "Collections", href: "/collections" }, { label: "Bridal", href: "/bridal" }, { label: "Gold Rate", href: "/gold-rate" },
      { label: "Custom Design", href: "/custom-design" }, { label: "About", href: "/about" }, { label: "Contact", href: "/contact" },
    ],
    cta: { label: "Book Visit", href: "/appointment" },
  }),
  footer: (biz) => ({
    design: "centered",
    about: `${biz} has crafted BIS-hallmarked gold, certified diamond and silver jewellery for three generations of families — with honest pricing, lifetime exchange and bespoke design.`,
    columns: [
      { title: "Shop", links: [ { label: "Gold Jewellery", href: "/collections" }, { label: "Diamond Jewellery", href: "/collections" }, { label: "Bridal Collection", href: "/bridal" }, { label: "Silver & Gifting", href: "/collections" } ] },
      { title: "Services", links: [ { label: "Today's Gold Rate", href: "/gold-rate" }, { label: "Old Gold Exchange", href: "/gold-rate" }, { label: "Custom Design", href: "/custom-design" }, { label: "Book Appointment", href: "/appointment" }, { label: "Contact", href: "/contact" } ] },
    ],
    serviceAreas: ["Bridal Jewellery", "Temple Jewellery", "Diamond Rings", "Gold Coins", "Silver Articles", "Custom Design"],
    contact: { phones: [PHONE], email: "hello@example.com", address: "Your City" },
    social: { facebook: "#", instagram: "#", whatsapp: "#", location: "#" },
    copyright: `© {year} ${biz}. Crafted for generations.`,
  }),
  seo: (biz) => ({
    title: `${biz} — BIS Hallmarked Gold, Diamond & Bridal Jewellery in Your City`,
    description: "Trusted jewellers for BIS hallmarked 22K gold, IGI-certified diamonds, bridal sets and silver. Today's gold rate, old gold exchange, lifetime buyback and custom design.",
    favicon: "", ogImage: "",
    keywords: "jewellery shop near me, gold rate today, hallmark gold jewellery, bridal jewellery, diamond rings, old gold exchange, custom jewellery design",
    businessType: "JewelryStore", priceRange: "₹₹₹",
  }),
  services: [
    { category: "Gold Jewellery", title: "Necklaces & Haarams", description: "22K hallmarked necklaces, long haarams and chokers in traditional and modern styles." },
    { category: "Gold Jewellery", title: "Bangles & Kadas", description: "Daily-wear and occasion bangles, antique and Kolkata-cut finishes." },
    { category: "Gold Jewellery", title: "Chains, Earrings & Rings", description: "Lightweight everyday gold from 2 grams onwards." },
    { category: "Diamond Jewellery", title: "Solitaire & Engagement Rings", description: "IGI / GIA certified solitaires in 18K gold and platinum." },
    { category: "Diamond Jewellery", title: "Diamond Necklace Sets", description: "Polki, uncut and brilliant-cut diamond sets for celebrations." },
    { category: "Bridal Collections", title: "South Indian Temple Bridal", description: "Lakshmi haarams, vanki, oddiyanam and jhumkas handcrafted in 22K." },
    { category: "Bridal Collections", title: "Kundan & Polki Bridal", description: "Rajasthani kundan chokers, maang tikka and matha patti sets." },
    { category: "Bridal Collections", title: "Mangalsutra & Thali", description: "Regional mangalsutra and thali designs, plain or diamond-studded." },
    { category: "Silver & Gifting", title: "Silver Pooja Articles", description: "Diyas, kalash, plates and idols in 999 and 925 silver." },
    { category: "Silver & Gifting", title: "Gold & Silver Coins", description: "24K hallmarked coins for Dhanteras, Akshaya Tritiya and gifting." },
  ],
  gallery: [
    ...["Temple bridal haaram", "Kundan choker set", "Diamond solitaire ring", "Antique gold bangles"].map((caption) => ({ category: "Collections", caption })),
    ...["Our flagship showroom", "Master karigar at work", "Bride in heirloom set", "Silver pooja collection"].map((caption) => ({ category: "Showroom & Craft", caption })),
  ],
  pages: (biz) => [
    {
      slug: "home", title: "Home", isSystem: true, order: 0,
      sections: [
        { type: "hero", content: {
          variant: "centered", customHtml: "",
          badge: "BIS HALLMARKED · IGI CERTIFIED · SINCE 1978", titleTop: "Jewellery That Becomes", titleHighlight: "Your Family's Heirloom",
          subtitle: "", description: `Three generations of ${biz} craftsmanship — pure 22K gold, certified diamonds and bridal masterpieces, priced with complete transparency.`, image: "",
          primaryBtn: { label: "Explore Collections", href: "/collections" }, secondaryBtn: { label: "Today's Gold Rate", href: "/gold-rate" },
          features: [ { icon: "badge-check", title: "HUID Hallmarked", text: "" }, { icon: "award", title: "Certified Diamonds", text: "" }, { icon: "trending", title: "Lifetime Exchange", text: "" }, { icon: "gift", title: "Custom Design", text: "" } ],
        } },
        goldRate,
        { type: "serviceCategories", content: { eyebrow: "OUR COLLECTIONS", title: "Crafted for Every", titleHighlight: "Occasion", categories: CATEGORIES }, style: { layout: "tiles", align: "center" } },
        { ...promises, style: { ...promises.style, layout: "minimal" } },
        { type: "about", content: {
          eyebrow: "OUR LEGACY", title: "Since 1978,", titleHighlight: "Trust in Every Gram",
          body: [
            `What began as a small workshop run by our grandfather is today ${biz} — a showroom families return to for every wedding, festival and milestone.`,
            "Our master karigars still handcraft many pieces in-house, and every gram is tested on our XRF machine in front of you.",
          ],
          image: "", points: ["In-house karigars & design studio", "XRF purity testing in store", "Insured, sealed home delivery", "Easy EMI on diamond jewellery"],
          buttonLabel: "Our Story", buttonHref: "/about",
        }, style: { background: "light" } },
        { type: "imageBanner", content: { title: "The Bridal Edit", subtitle: "Temple, kundan and polki bridal sets — with a personal stylist to plan every function from engagement to reception.", buttonLabel: "View Bridal Collection", buttonHref: "/bridal", image: "" } },
        bridalPlans,
        { type: "gallery", content: { eyebrow: "THE SHOWROOM", title: "A Glimpse of", titleHighlight: "Our Craft" }, style: { layout: "masonry" } },
        { ...testimonials, style: { layout: "minimal" } },
        savingsScheme,
        { type: "openingHours", content: { eyebrow: "VISIT US", title: "Showroom", titleHighlight: "Timings", note: "Open on all festival days. Private bridal consultations available after hours by appointment.", days: [
          { day: "Monday – Saturday", hours: "10:30 AM – 8:30 PM" },
          { day: "Sunday", hours: "11:00 AM – 7:00 PM" },
          { day: "Dhanteras & Akshaya Tritiya", hours: "9:00 AM – 10:00 PM" },
        ] }, style: { align: "center", background: "dark" } },
        { type: "faq", content: { eyebrow: "FAQ", title: "Buying Gold", titleHighlight: "With Confidence", intro: "Hallmarks, making charges, exchange and buyback — everything you should know before you buy, explained plainly.", items: [
          { q: "How do I verify the hallmark?", a: "Every gold piece carries the BIS logo, purity grade (e.g. 22K916) and a 6-digit HUID. Enter the HUID in the BIS Care app to see the details." },
          { q: "How is the jewellery price calculated?", a: "Price = gold weight × today's rate + making charges + stone value (if any) + 3% GST. All components are listed separately on your bill." },
          { q: "Do you exchange old gold from other jewellers?", a: "Yes. We test your gold on an XRF machine in front of you and give 100% of today's value for exchange against new jewellery." },
          { q: "Can I book gold at today's rate and pay later?", a: "Yes — pay 10% advance to lock today's rate for up to 30 days. Our 11-month gold savings scheme is also available." },
          { q: "Do you offer buyback on diamonds?", a: "Certified diamonds have 90% exchange and 80% buyback value on the diamond portion, with 100% on gold." },
          { q: "Do you repair or polish jewellery?", a: "Yes. Free cleaning and polishing for life on our jewellery, and repairs, resizing and re-stringing for any jeweller's pieces at nominal charges." },
        ] } as SectionSeed<"faq">["content"], style: { layout: "split" } },
        { type: "appointmentForm", content: { title: "Book a Private Showroom Visit", subtitle: "Bridal, diamonds, custom design or old gold exchange — tell us what you're looking for and a consultant will be ready for you." }, style: { background: "light" } },
        { ...cta, style: { layout: "minimal" } },
      ],
    },
    { slug: "collections", title: "Collections", isSystem: true, order: 1, sections: [
      { type: "banner", content: { title: "Our", titleHighlight: "Collections", subtitle: "Gold, diamond, bridal and silver — each piece hallmarked and certified.", image: "", bgColor: "", imageOpacity: 45, overlayOpacity: 65 } },
      { type: "serviceCategories", content: { eyebrow: "", title: "Shop by", titleHighlight: "Collection", categories: CATEGORIES }, style: { cardRadius: "sm", cardShadow: "md", align: "center" } },
      { type: "gallery", content: { eyebrow: "LOOKBOOK", title: "Signature", titleHighlight: "Pieces" }, style: { layout: "strip" } },
      promises,
      cta,
    ] },
    { slug: "bridal", title: "Bridal", isSystem: true, order: 2, sections: [
      { type: "banner", content: { title: "For the Bride Who Wants", titleHighlight: "Forever", subtitle: "Temple, kundan, polki and diamond bridal jewellery — styled for every ritual.", image: "", bgColor: "", imageOpacity: 45, overlayOpacity: 65 } },
      bridalPlans,
      { type: "steps", content: { eyebrow: "YOUR BRIDAL JOURNEY", title: "Planned Around", titleHighlight: "Your Wedding", items: [
        { title: "Private Consultation", text: "Meet our bridal stylist with your outfits and function list.", icon: "calendar" },
        { title: "Curate or Design", text: "Choose from 2,000+ bridal designs or create your own.", icon: "edit" },
        { title: "Lock the Gold Rate", text: "Book at today's rate with 10% advance — protected from price rise.", icon: "shield" },
        { title: "Trial & Delivery", text: "Final trial fitting and insured delivery before your wedding date.", icon: "gift" },
      ] } },
      testimonials,
      cta,
    ] },
    { slug: "gold-rate", title: "Gold Rate & Exchange", isSystem: true, order: 3, sections: [
      goldRate,
      { type: "steps", content: { eyebrow: "OLD GOLD EXCHANGE", title: "Turn Old Gold Into", titleHighlight: "New Jewellery", items: [
        { title: "Bring Your Gold", text: "Any jeweller's gold — broken, old-fashioned or unused.", icon: "package" },
        { title: "XRF Purity Test", text: "Tested in front of you in under 5 minutes, no melting needed.", icon: "check" },
        { title: "Get Today's Value", text: "100% of today's rate for the tested purity, adjusted against new purchase.", icon: "tag" },
        { title: "Choose New Jewellery", text: "Pick from the showroom or custom-design something new.", icon: "gift" },
      ] }, style: { background: "light" } },
      { type: "faq", content: { eyebrow: "RATE FAQ", title: "Gold Rate", titleHighlight: "Explained", items: [
        { q: "Why is your rate different from the news?", a: "Published rates are usually for 24K bullion before GST. Our 22K rate reflects jewellery purity and is updated daily from the IBJA benchmark." },
        { q: "What are making charges?", a: "The cost of craftsmanship, shown as a % of gold value or per gram. Machine-made chains start at 6%; handcrafted temple work ranges from 12–18%." },
        { q: "Is there any deduction on exchange?", a: "No deduction on our own hallmarked jewellery. For other jewellers' gold, value is based purely on tested purity." },
      ] } },
      { ...savingsScheme, style: { background: "dark", layout: "cards" } },
      cta,
    ] },
    { slug: "custom-design", title: "Custom Design", isSystem: true, order: 4, sections: [
      { type: "about", content: { eyebrow: "BESPOKE STUDIO", title: "Designed by You,", titleHighlight: "Crafted by Our Karigars", body: [
        "Bring a photo, a sketch or just an idea — our designers turn it into a 3D CAD render you can see and approve before a gram of gold is used.",
        "Perfect for engagement rings, name pendants, redesigning heirlooms or matching a bridal outfit.",
      ], image: "", points: ["Free design consultation", "3D CAD render & wax model", "Ready in 10–21 days", "Same hallmark & lifetime exchange"], buttonLabel: "Start Your Design", buttonHref: "/appointment" } },
      { type: "steps", content: { eyebrow: "HOW IT WORKS", title: "From Idea to", titleHighlight: "Jewel", items: [
        { title: "Share Your Idea", text: "Photos, sketches or a heirloom piece to remodel.", icon: "edit" },
        { title: "3D Design", text: "CAD render with weight and price estimate in 3 days.", icon: "grid" },
        { title: "Handcrafting", text: "Cast, set and finished by our master karigars.", icon: "hammer" },
        { title: "Hallmark & Deliver", text: "BIS hallmarked, certified and gift-boxed.", icon: "award" },
      ] }, style: { background: "dark" } },
      { type: "team", content: { eyebrow: "OUR ARTISANS", title: "The Hands Behind", titleHighlight: "Every Piece", members: [
        { name: "Shankar Soni", role: "Master Karigar", image: "", note: "40 years of temple jewellery craft" },
        { name: "Divya Menon", role: "Lead Jewellery Designer", image: "", note: "NIFT, CAD & bridal design" },
        { name: "Abdul Rehman", role: "Diamond Setter", image: "", note: "Micro-pavé & polki specialist" },
      ] }, style: { align: "center", layout: "list" } },
      { type: "faq", content: { eyebrow: "CUSTOM ORDERS", title: "Bespoke", titleHighlight: "Questions", items: [
        { q: "Is there a design fee?", a: "No. Consultation and the 3D render are free; you pay only when you approve the design and place the order." },
        { q: "Can you remodel my grandmother's jewellery?", a: "Yes. We test the old gold, keep the stones you want to reuse and design a new piece around them." },
        { q: "What advance is needed?", a: "25% advance on approval; the gold rate is locked on that day." },
      ] }, style: { background: "light" } },
      cta,
    ] },
    { slug: "about", title: "About Us", isSystem: true, order: 5, sections: [
      { type: "about", content: { eyebrow: "OUR STORY", title: "Three Generations of", titleHighlight: "Honest Gold", body: [
        `In 1978, our founder opened a small workshop with one promise: weigh honestly and price fairly. ${biz} still runs on that promise.`,
        "Today the third generation runs a 4,000 sq ft showroom with over 15,000 designs — yet many families still ask for the same karigar who made their parents' wedding jewellery.",
      ], image: "", points: ["BIS licensed jewellers", "Member, All India Gem & Jewellery Council", "XRF machine & HUID verification in store", "Insured showroom & vault"], buttonLabel: "", buttonHref: "" } },
      { type: "stats", content: { items: [
        { value: "46", label: "Years of Trust", icon: "award" },
        { value: "15,000+", label: "Designs in Store", icon: "gift" },
        { value: "1 Lakh+", label: "Happy Families", icon: "heart" },
        { value: "100%", label: "HUID Hallmarked", icon: "badge-check" },
      ] }, style: { background: "primary" } },
      { type: "visionMission", content: {
        eyebrow: "OUR PROMISE",
        visionTitle: "Our Vision", visionText: "To be the jeweller every family in Your City trusts for life's most precious moments.",
        missionTitle: "Our Mission", missionText: "Offer pure, certified jewellery with transparent pricing and craftsmanship that lasts generations.",
        valuesTitle: "What We Stand For",
        values: [
          { icon: "shield", title: "Purity", text: "Every gram tested and hallmarked." },
          { icon: "handshake", title: "Honesty", text: "Itemised bills, no hidden charges." },
          { icon: "heart", title: "Craft", text: "Handmade heritage, modern design." },
        ],
      } },
      cta,
    ] },
    { slug: "appointment", title: "Book Appointment", isSystem: true, order: 6, sections: [
      { type: "appointmentForm", content: { title: "Book a Private Showroom Visit", subtitle: "Choose your date and what you're looking for — bridal, diamonds, custom design or gold exchange. A consultant will be ready for you." } },
      { type: "features", content: { items: [
        { icon: "users", title: "Personal Consultant", text: "One expert, no waiting, no rush." },
        { icon: "gift", title: "Complimentary Refreshments", text: "Relax with family while you choose." },
        { icon: "shield", title: "Rate Lock on the Spot", text: "Book today's gold rate during your visit." },
      ] }, style: { background: "light", align: "center" } },
      { type: "openingHours", content: { eyebrow: "TIMINGS", title: "When to", titleHighlight: "Visit", note: "Bridal consultations take 60–90 minutes — morning slots are quieter.", days: [
        { day: "Monday – Saturday", hours: "10:30 AM – 8:30 PM" },
        { day: "Sunday", hours: "11:00 AM – 7:00 PM" },
      ] } },
    ] },
    { slug: "contact", title: "Contact", isSystem: true, order: 7, sections: [
      { type: "contactInfo", content: { eyebrow: "VISIT THE SHOWROOM", title: "We'd Love to", titleHighlight: "Welcome You", address: "Your City", phone: PHONE, email: "hello@example.com", hours: "Mon–Sat: 10:30 AM – 8:30 PM · Sun: 11 AM – 7 PM", mapEmbed: "" } },
      { type: "map", content: { eyebrow: "LOCATION", title: "Find Our", titleHighlight: "Showroom", address: "Your City", mapEmbed: "" } },
      { type: "contactForm", content: { title: "Send an Enquiry", subtitle: "Ask about a design, today's rate or a repair — we reply on call or WhatsApp." } },
    ] },
  ],
};
