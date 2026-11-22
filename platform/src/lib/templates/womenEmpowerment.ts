import type { TemplateDef } from "./types";
import type { SectionContentMap } from "../config";

// Women Empowerment NGO — "Editorial plum": deep plum/magenta + marigold,
// Fraunces serif, crisp small radius, centered masthead header, custom
// magazine-style hero. Livelihoods, SHGs, menstrual health, legal aid,
// girls' education and a safety helpline.

// Custom hero: inline styles + theme CSS variables only (sanitizeHtml strips
// <style>/<svg>), so it stays on-palette when the client changes colours.
const heroHtml = (biz: string) => `
<div style="background:var(--c-dark);color:#fff;position:relative;overflow:hidden">
  <div style="position:absolute;right:-8rem;top:-8rem;width:26rem;height:26rem;border-radius:9999px;background:var(--c-primary);opacity:.35;filter:blur(90px)"></div>
  <div style="position:absolute;left:-6rem;bottom:-10rem;width:22rem;height:22rem;border-radius:9999px;background:var(--c-accent);opacity:.18;filter:blur(90px)"></div>
  <div style="position:relative;max-width:80rem;margin:0 auto;padding:clamp(4rem,9vw,7.5rem) 1.25rem;display:flex;flex-wrap:wrap;gap:3rem;align-items:center">
    <div style="flex:1 1 30rem;min-width:0">
      <p style="display:inline-block;letter-spacing:.22em;font-size:.75rem;font-weight:700;color:var(--c-accent);border-top:1px solid var(--c-accent);border-bottom:1px solid var(--c-accent);padding:.45rem 0;margin:0 0 1.75rem">${biz.toUpperCase()} · SINCE 2009</p>
      <h1 style="font-size:clamp(2.6rem,6.2vw,4.9rem);line-height:1.02;font-weight:600;margin:0 0 1.5rem;letter-spacing:-.02em;color:#fff">She earns.<br/>She decides.<br/><em style="color:var(--c-accent);font-style:italic">She leads.</em></h1>
      <p style="font-size:clamp(1.05rem,1.6vw,1.25rem);line-height:1.7;max-width:36rem;opacity:.85;margin:0 0 2.25rem">Skill training, self-help groups, legal aid and menstrual health for women in urban bastis and rural blocks — so that every woman has an income, a voice and a safe place to turn to.</p>
      <div style="display:flex;flex-wrap:wrap;gap:.9rem">
        <a href="/donate" style="background:var(--c-accent);color:var(--c-dark);padding:1rem 1.8rem;border-radius:var(--site-radius);font-weight:700;text-decoration:none">Fund a Woman's Training →</a>
        <a href="/programs" style="border:1px solid rgba(255,255,255,.45);color:#fff;padding:1rem 1.8rem;border-radius:var(--site-radius);font-weight:600;text-decoration:none">Our Programs</a>
      </div>
    </div>
    <div style="flex:1 1 20rem;min-width:0;display:grid;gap:1rem">
      <div style="background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.14);border-left:4px solid var(--c-accent);padding:1.75rem;border-radius:var(--site-radius)">
        <p style="font-size:1.35rem;line-height:1.5;font-style:italic;margin:0 0 1rem">"I stitched my first blouse at the centre in 2021. Today I run a boutique and employ four women from my lane."</p>
        <p style="font-size:.85rem;letter-spacing:.12em;opacity:.7;margin:0">— SUNITA DEVI, SHG LEADER</p>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem">
        <div style="background:var(--c-primary);padding:1.4rem;border-radius:var(--site-radius)"><p style="font-size:2rem;font-weight:700;margin:0">18,400+</p><p style="font-size:.85rem;opacity:.85;margin:.25rem 0 0">women trained</p></div>
        <div style="background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.14);padding:1.4rem;border-radius:var(--site-radius)"><p style="font-size:2rem;font-weight:700;margin:0;color:var(--c-accent)">640</p><p style="font-size:.85rem;opacity:.85;margin:.25rem 0 0">self-help groups</p></div>
      </div>
      <a href="tel:9000000000" style="display:block;background:#fff;color:var(--c-dark);padding:1.1rem 1.4rem;border-radius:var(--site-radius);text-decoration:none"><span style="font-size:.75rem;letter-spacing:.16em;font-weight:700;color:var(--c-primary)">SAKHI HELPLINE · 24×7</span><br/><span style="font-size:1.4rem;font-weight:700">90000 00000</span> <span style="opacity:.6;font-size:.9rem">— confidential, free</span></a>
    </div>
  </div>
</div>`;

export const womenEmpowerment: TemplateDef = {
  theme: {
    colors: { primary: "#a21caf", primaryDark: "#86198f", secondary: "#4a1d5c", accent: "#f2a516", dark: "#2b0d33", light: "#fbf3ee", text: "#4b3a48", heading: "#2b0d33" },
    font: "Fraunces", radius: "0.375rem",
  },
  header: (biz) => ({
    design: "centered",
    logoText: biz, logoImage: "",
    announcement: { show: true, text: "In distress? Sakhi Helpline 90000 00000 — free, confidential, 24×7", link: "/contact" },
    topbar: { show: true, address: "Registered Trust · 12A & 80G · Your City", phones: ["9000000000"], email: "hello@example.com", social: { facebook: "#", instagram: "#", whatsapp: "#" } },
    nav: [
      { label: "Home", href: "/" },
      { label: "Our Story", href: "/about" },
      { label: "Programs", href: "/programs" },
      { label: "Causes", href: "/causes" },
      { label: "Her Stories", href: "/stories" },
      { label: "Events", href: "/events" },
      { label: "Get Involved", href: "/get-involved" },
      { label: "Contact", href: "/contact" },
    ],
    cta: { label: "Donate", href: "/donate" },
  }),
  footer: (biz) => ({
    design: "modern",
    about: `${biz} works with women and adolescent girls on livelihoods, self-help groups, menstrual health, legal aid, education and safety — so every woman can earn, decide and lead.`,
    columns: [
      { title: "The Foundation", links: [ { label: "Our Story", href: "/about" }, { label: "Programs", href: "/programs" }, { label: "Her Stories", href: "/stories" }, { label: "Events", href: "/events" } ] },
      { title: "Stand With Her", links: [ { label: "Donate", href: "/donate" }, { label: "Live Causes", href: "/causes" }, { label: "Volunteer", href: "/get-involved" }, { label: "CSR Partnerships", href: "/get-involved" }, { label: "Sakhi Helpline", href: "/contact" } ] },
    ],
    serviceAreas: ["Skill & Livelihood", "Self-Help Groups", "Menstrual Health", "Legal Aid", "Girls' Education", "Safety Helpline"],
    contact: { phones: ["9000000000"], email: "hello@example.com", address: "Your City" },
    social: { facebook: "#", instagram: "#", whatsapp: "#", location: "#" },
    copyright: `© {year} ${biz}. Registered public charitable trust · 12A & 80G certified · CSR-1 registered.`,
  }),
  seo: (biz) => ({
    title: `${biz} — Women Empowerment NGO for Skills, SHGs & Legal Aid`,
    description: "Women empowerment NGO running skill training, self-help groups, menstrual health, free legal aid, girls' scholarships and a 24×7 women's helpline. Donate with 80G benefit or volunteer.",
    favicon: "", ogImage: "",
    keywords: "women empowerment NGO, self help group, skill training for women, menstrual hygiene, legal aid for women, women helpline, girls education, 80G donation, CSR women",
    businessType: "NGO",
  }),
  services: [
    { category: "Livelihood & Enterprise", title: "Skill Training Centres", description: "Tailoring, beauty, food processing and computer courses with certification.", longDescription: "3–6 month courses aligned with NSDC trades. Every batch ends with a toolkit, a certificate and a placement or self-employment plan." },
    { category: "Livelihood & Enterprise", title: "Self-Help Groups & Micro-Credit", description: "Savings groups, bank linkage and seed capital for women-run enterprises.", longDescription: "We form and mentor SHGs of 10–15 women, link them to banks under NRLM, and help members start dairy, kirana, tailoring and pickle units." },
    { category: "Livelihood & Enterprise", title: "Market Linkage", description: "Haats, exhibitions and online stores for products made by our women.", longDescription: "Packaging, pricing and a shared brand so SHG products reach city buyers, corporate gifting and festival melas." },
    { category: "Health & Dignity", title: "Menstrual Health — Project Garima", description: "Pad banks, awareness sessions and low-cost sanitary pad units.", longDescription: "School and community sessions that break the silence on periods, plus women-run pad-making units that create jobs and dignity together." },
    { category: "Health & Dignity", title: "Mother & Child Nutrition", description: "Anaemia screening, nutrition kits and counselling for pregnant women.", longDescription: "With ASHA and anganwadi workers we screen for anaemia, track pregnancies and run monthly nutrition demonstrations." },
    { category: "Rights & Safety", title: "Free Legal Aid Cell", description: "Counselling and lawyers for domestic violence, maintenance and property cases.", longDescription: "Panel advocates and trained counsellors help women file complaints, seek protection orders and claim maintenance — free of cost." },
    { category: "Rights & Safety", title: "Sakhi Helpline & Safe Space", description: "24×7 helpline, crisis counselling and short-stay support.", longDescription: "Trained counsellors answer calls round the clock and connect women to police, One Stop Centres, shelter and medical help." },
    { category: "Rights & Safety", title: "Girls' Education & Scholarships", description: "Bridge courses, scholarships and mentoring that keep girls in school.", longDescription: "Merit-cum-need scholarships, bicycles for long commutes and women mentors so adolescent girls finish Class 12 and beyond." },
  ],
  gallery: [
    "Tailoring batch graduation", "SHG monthly meeting", "Pad-making unit", "Legal awareness camp",
    "Girls' scholarship day", "Women's Day march", "Diwali haat stall", "Computer class for women", "Self-defence workshop",
  ].map((caption) => ({ category: "Her Journey", caption })),
  people: () => [
    { name: "Founder Name", role: "Founder & Managing Trustee", groupName: "leadership", experience: "20+ years · Gender & livelihoods", bio: "Started the foundation with one sewing machine in a basti community hall; now leads strategy and CSR partnerships." },
    { name: "Trustee Name", role: "Trustee & Legal Advisor", groupName: "leadership", experience: "18+ years · Family law", bio: "Advocate who heads the free legal aid cell and trains paralegal volunteers." },
    { name: "Programme Head", role: "Head — Livelihoods & SHGs", groupName: "core", experience: "12+ years · Microfinance", bio: "Builds SHG federations, bank linkages and market access for women's enterprises." },
    { name: "Health Lead", role: "Lead — Project Garima", groupName: "core", experience: "9+ years · Public health", bio: "Runs menstrual health and nutrition programmes with ASHA and school networks." },
    { name: "Counsellor Name", role: "Helpline Coordinator", groupName: "core", experience: "8+ years · Crisis counselling", bio: "Manages the 24×7 Sakhi Helpline team and referral network." },
    { name: "Mentor Name", role: "Girls' Education Mentor", groupName: "core", experience: "6+ years · Adolescent programmes", bio: "Coordinates scholarships, bridge classes and the mentoring circle." },
  ],
  events: (biz) => [
    {
      title: "Mahila Udyam Haat — Women Entrepreneurs' Fair",
      slug: "mahila-udyam-haat",
      activityName: "SHG Products Exhibition & Sale",
      date: "2026-12-13",
      location: "Town Hall Grounds, Your City",
      venueNote: "Entry from the main gate. Free parking behind the hall.",
      status: "upcoming",
      enableDonate: true,
      donateAmount: 2000,
      showQr: true,
      qrCaption: "Scan to sponsor a stall for an SHG",
      organizedBy: biz,
      shortDescription: "40+ stalls of handloom, pickles, papad, jewellery and home décor made by our self-help groups.",
      programDescription: "A two-day fair where SHG members sell directly to city buyers, meet corporate gifting teams and attend a session on GST and online selling.",
      dignitaries: "District Collector, NRLM block officials and women entrepreneurs.",
      impact: "Each stall typically earns ₹15,000–₹40,000 in two days and finds repeat buyers.",
      objectives: ["Direct market access for SHGs", "Corporate gifting tie-ups", "Training on pricing & GST", "Celebrate women entrepreneurs"],
    },
    {
      title: "Know Your Rights — Legal Literacy Camp",
      slug: "legal-literacy-camp",
      activityName: "Free Legal Awareness & Counselling",
      date: "2027-01-24",
      location: "Community Centre, Ward 14",
      venueNote: "Women-only session. Childcare corner available.",
      status: "upcoming",
      enableDonate: true,
      donateAmount: 1000,
      organizedBy: biz,
      shortDescription: "Domestic violence law, maintenance, property rights and how to file a complaint — explained simply.",
      programDescription: "Advocates and paralegals explain the PWDV Act, maintenance under BNSS, inheritance rights and the One Stop Centre, followed by private one-on-one counselling.",
      dignitaries: "District Legal Services Authority panel lawyer and Protection Officer.",
      impact: "Women leave knowing their rights and with a direct contact for follow-up support.",
      objectives: ["Explain key laws in plain language", "Free private counselling", "Connect to DLSA & One Stop Centre", "Train community paralegals"],
    },
    {
      title: "Garima Pad Bank Launch",
      slug: "garima-pad-bank-launch",
      activityName: "Menstrual Health Drive",
      date: "2026-09-21",
      location: "Govt. Girls' Senior Secondary School",
      status: "completed",
      enableDonate: true,
      donateAmount: 500,
      showQr: true,
      qrCaption: "₹500 keeps a girl supplied for a year",
      blocks: [
        { type: "heading", text: "What happened" },
        { type: "text", text: "We opened the school's first pad bank, ran a period-literacy session for 320 girls and their mothers, and installed an incinerator in the girls' washroom." },
        { type: "heading", text: "What's next" },
        { type: "text", text: "Two more schools in the block are on the waiting list. Sponsor a pad bank for ₹12,000 and we will share a utilisation report." },
      ],
      organizedBy: biz,
      shortDescription: "First school pad bank, period-literacy session for 320 girls and a washroom incinerator.",
      programDescription: "Project Garima launch with teachers, mothers and the school management committee.",
      dignitaries: "School principal, block education officer and ANM.",
      impact: "Absenteeism among girls during periods dropped noticeably in the following term.",
      objectives: ["Open a pad bank", "Break period taboos", "Safe disposal", "Involve mothers & teachers"],
    },
  ],
  causes: (biz) => [
    {
      title: "Sakhi Helpline — keep it running 24×7",
      slug: "sakhi-helpline-24x7",
      category: "Safety & Rights",
      summary: "Six trained women counsellors answer 1,100+ calls a month, day and night. Help us fund the next twelve months of night shifts.",
      story: `At 2 am, the only person many women can call is a Sakhi counsellor. Our helpline answers domestic-violence, harassment and trafficking calls round the clock, and connects women to police, One Stop Centres, shelter and our free legal aid cell.\n\nThe line is run by six women counsellors on three rotating shifts, backed by a panel advocate and a case worker who follows up every serious call within 48 hours. Night shifts cost the most and are the hardest to fund from CSR grants, which usually pay only for daytime programmes.\n\nThis appeal covers salaries, phone lines, a confidential case-management system and emergency travel for counsellors for one full year. Every donation is reported in our quarterly helpline log (anonymised), and receipts are issued under 80G.\n\n${biz} has never switched the line off since 2016 — not during floods, not during the lockdown. With your help, it never will.`,
      goalAmount: 1800000,
      offlineRaised: 738000,
      offlineDonors: 412,
      deadline: "",
      urgent: true,
      featured: true,
      beneficiaries: "13,000+ calls a year from women in crisis",
      location: "Helpline control room · serves 3 districts",
      impactTiers: [
        { amount: 1500, label: "Runs the helpline for one night shift" },
        { amount: 5000, label: "Covers a counsellor's emergency travel for a month" },
        { amount: 25000, label: "Funds one counsellor's salary for a month" },
        { amount: 150000, label: "Keeps the line open 24×7 for a full month" },
      ],
      updates: [
        { date: "2026-11-05", title: "October log: 1,148 calls", text: "312 domestic-violence calls, 41 police escorts arranged, 19 women moved to a safe shelter the same night." },
        { date: "2026-09-12", title: "WhatsApp line added", text: "Women who cannot speak safely can now text the counsellor on WhatsApp — 23% of contacts in the first month came this way." },
        { date: "2026-07-01", title: "Appeal launched", text: "Our two-year CSR grant for daytime shifts was renewed, but night shifts from January 2027 are unfunded." },
      ],
    },
    {
      title: "Fund 50 sewing machines for SHG units",
      slug: "50-sewing-machines-shg",
      category: "Livelihood",
      summary: "Each motorised machine turns a trained tailor into a home-based entrepreneur earning ₹6,000–₹9,000 a month.",
      story: `Our tailoring graduates know the trade — what they lack is a machine of their own. Without one, they wait for the centre to open or work for a middleman at ₹8 a piece.\n\nThis appeal places 50 motorised sewing machines with 10 self-help groups across our basti and rural blocks. Each machine is owned by the SHG, rotated among members and repaid into the group's savings fund at ₹200 a month, so it buys the next machine.\n\nEvery machine comes with a starter kit (scissors, measuring tape, threads, 20 m of fabric), a refresher session on pricing and a link to our Mahila Udyam Haat and school-uniform orders.\n\nDonors receive the name of the SHG their machine went to, a photo from the handover and an 80G receipt.`,
      goalAmount: 450000,
      offlineRaised: 292500,
      offlineDonors: 186,
      deadline: "2026-12-31",
      featured: true,
      beneficiaries: "50 women tailors in 10 SHGs (≈250 family members)",
      location: "Ward 9 & Ward 14 bastis + Rampur block",
      impactTiers: [
        { amount: 1200, label: "A starter kit of scissors, tapes and threads" },
        { amount: 3000, label: "One-third of a machine, shared with two other donors" },
        { amount: 9000, label: "One complete motorised machine with starter kit" },
        { amount: 45000, label: "Equip an entire SHG unit of five tailors" },
      ],
      updates: [
        { date: "2026-11-10", title: "32 machines handed over", text: "Six SHGs received machines at the Ward 9 community hall. First order: 400 school uniforms for the municipal school." },
        { date: "2026-10-02", title: "Suppliers finalised", text: "Machines bought directly from an authorised dealer with a 2-year service contract — ₹600 cheaper per machine than last year." },
      ],
    },
    {
      title: "Sanitary pad unit for 3 villages",
      slug: "garima-pad-unit-3-villages",
      category: "Health & Dignity",
      summary: "A women-run Project Garima unit making 3,000 low-cost pads a month for girls and women in three villages.",
      story: `In Rampur, Khedi and Sonpur, most girls used cloth and missed three to five days of school every month. The nearest chemist sold pads at ₹40 a packet — more than a day's wage for many families.\n\nWith this appeal we set up a semi-automatic pad-making unit run by ten women from the three villages. They produce biodegradable pads sold at ₹15 a packet to households and supplied free to the government girls' school.\n\nThe unit is now self-sustaining: sales cover raw material and the women's wages, and a share goes to the village pad bank for girls who cannot pay.\n\nThank you to every donor who made this possible — the goal was reached in October 2026.`,
      goalAmount: 650000,
      offlineRaised: 672000,
      offlineDonors: 298,
      deadline: "2026-10-31",
      status: "completed",
      beneficiaries: "1,900 girls and women · 10 women employed",
      location: "Rampur, Khedi & Sonpur villages",
      impactTiers: [
        { amount: 500, label: "A year of pads for one girl" },
        { amount: 12000, label: "A school pad bank with incinerator" },
        { amount: 65000, label: "One month of raw material for the unit" },
      ],
      updates: [
        { date: "2026-11-01", title: "First month: 3,240 pads", text: "The unit beat its target in its first month. Girls' absenteeism at the government school is being tracked with the headmistress." },
        { date: "2026-10-18", title: "Goal reached — thank you!", text: "298 donors and one CSR partner completed the appeal. Machine installed, ten women trained." },
      ],
    },
    {
      title: "Bicycles for 120 girls to finish school",
      slug: "bicycles-for-120-girls",
      category: "Safety & Rights",
      summary: "A 6 km walk on an unsafe road is why girls drop out after Class 8. A bicycle keeps them in school.",
      story: `In our rural blocks the nearest senior secondary school is 5–7 km away. Parents worried about the lonely road pull girls out after Class 8 — and many are married within two years.\n\nThis appeal gives 120 girls from our mentoring circle a sturdy bicycle, a helmet, a lock and a self-defence session. Girls ride in groups of four with a 'cycle didi' mentor who checks in every week.\n\nLast year's 60 bicycle girls all passed Class 10. Three of them now cycle to the district college.\n\nDonors receive the first name, class and photo of the girl they supported (with parental consent) and an 80G receipt.`,
      goalAmount: 540000,
      offlineRaised: 99000,
      offlineDonors: 71,
      deadline: "2027-01-10",
      beneficiaries: "120 adolescent girls, Classes 9–12",
      location: "Rampur & Bhojpur blocks",
      impactTiers: [
        { amount: 600, label: "A helmet, lock and reflector kit" },
        { amount: 1500, label: "A self-defence workshop seat for 5 girls" },
        { amount: 4500, label: "One complete bicycle for one girl" },
      ],
      updates: [
        { date: "2026-11-14", title: "Girls selected", text: "120 girls chosen with school principals and parents; priority to those living 5 km+ from school." },
      ],
    },
  ],
  pages: (biz) => [
    {
      slug: "home", title: "Home", isSystem: true, order: 0,
      sections: [
        { type: "hero", content: {
          variant: "custom", customHtml: heroHtml(biz),
          badge: "SKILLS · RIGHTS · DIGNITY",
          titleTop: "She earns. She decides.", titleHighlight: "She leads.",
          subtitle: "",
          description: "Skill training, self-help groups, legal aid and menstrual health for women in urban bastis and rural blocks.",
          image: "",
          primaryBtn: { label: "Fund a Woman's Training", href: "/donate" },
          secondaryBtn: { label: "Our Programs", href: "/programs" },
          features: [
            { icon: "graduation", title: "Skill Training", text: "" },
            { icon: "handshake", title: "Self-Help Groups", text: "" },
            { icon: "shield", title: "Legal Aid", text: "" },
            { icon: "heart", title: "24×7 Helpline", text: "" },
          ],
        } },
        { type: "stats", content: { items: [
          { value: "18,400+", label: "Women Skilled", icon: "graduation" },
          { value: "640", label: "Self-Help Groups", icon: "users" },
          { value: "₹9.2 Cr", label: "SHG Savings Mobilised", icon: "trending" },
          { value: "3,100+", label: "Legal Cases Supported", icon: "shield" },
        ] }, style: { layout: "band" } },
        { type: "about", content: {
          eyebrow: "WHY WE EXIST", title: "When a woman earns,", titleHighlight: "a whole family rises",
          body: [
            `${biz} began in 2009 in a single community hall with one sewing machine and twelve women who wanted to earn without leaving their children. Today we work across 3 districts with women, adolescent girls and their families.`,
            "Income alone is not enough. Our women also need to know their rights, stay healthy and have someone to call when things go wrong — so every programme we run connects livelihood with dignity and safety.",
          ],
          image: "",
          points: ["Certified skill training with toolkits", "SHGs linked to banks under NRLM", "Free legal aid & counselling", "Menstrual health in schools and bastis"],
          buttonLabel: "Read Our Story", buttonHref: "/about",
        }, style: { layout: "split" } },
        { type: "serviceCategories", content: { eyebrow: "WHAT WE DO", title: "Three Paths to", titleHighlight: "Independence", categories: ["Livelihood & Enterprise", "Health & Dignity", "Rights & Safety"] }, style: { background: "light", cardBorderWidth: 0, cardShadow: "md", cardRadius: "sm" } },
        { type: "causeList", content: {
          eyebrow: "OPEN APPEALS", title: "Causes She's", titleHighlight: "Counting On",
          subtitle: "Machines for SHG tailors, night shifts on the Sakhi Helpline, bicycles for girls — pick one, watch it fill up, and get an 80G receipt the same day.",
          category: "all", featuredOnly: true, showFilters: false, showCompleted: false, limit: 3,
          emptyText: "New appeals will appear here soon.",
        }, style: { cardRadius: "sm", cardShadow: "md", cardBorderWidth: 0 } },
        { type: "testimonials", content: { eyebrow: "HER VOICE", title: "Stories That", titleHighlight: "Changed Our Lanes", items: [
          { name: "Sunita Devi", role: "Tailoring graduate · now runs a boutique", text: "My husband said a woman's money never stays. Today my boutique pays our rent, my daughter's college fees and the salaries of four women from my lane.", rating: 5 },
          { name: "Rehana Khatoon", role: "SHG treasurer, Ward 9", text: "Our group of 12 saved ₹100 a week. With the bank loan we started a papad unit — now we supply three kirana stores and the school canteen.", rating: 5 },
          { name: "Pooja (name changed)", role: "Supported by the legal aid cell", text: "I called the helpline at 2 am. By morning a counsellor was with me, and in three months I had a protection order and maintenance for my children.", rating: 5 },
        ] }, style: { layout: "featured", background: "dark" } },
        { type: "steps", content: { eyebrow: "HER JOURNEY", title: "From First Visit to", titleHighlight: "First Income", items: [
          { title: "Walk in", text: "A neighbour brings her to a centre or SHG meeting — no fees, no paperwork to start.", icon: "home" },
          { title: "Learn a trade", text: "3–6 months of hands-on training with childcare at the centre.", icon: "graduation" },
          { title: "Join an SHG", text: "Weekly savings, bank account and access to micro-credit.", icon: "users" },
          { title: "Earn & lead", text: "Placement or her own enterprise — then she mentors the next batch.", icon: "award" },
        ] } },
        { type: "features", content: { items: [
          { icon: "badge-check", title: "12A, 80G & CSR-1", text: "50% tax deduction on donations; eligible for CSR under Schedule VII." },
          { icon: "clipboard", title: "Audited & Reported", text: "Annual audit, utilisation certificates and a donor update every quarter." },
          { icon: "users", title: "Led by Women", text: "78% of our staff and every centre manager is a woman from the community." },
          { icon: "heart", title: "Safe by Design", text: "Child-safe and POSH-compliant policies at every centre and camp." },
        ] }, style: { layout: "minimal", align: "center" } },
        { type: "eventList", content: { eyebrow: "COME JOIN US", title: "Fairs, Camps &", titleHighlight: "Gatherings", subtitle: "Haats, legal camps and health drives — published from Admin → Events.", limit: 3, emptyText: "Upcoming events will appear here." }, style: { background: "light" } },
        { type: "pricingPlans", content: {
          eyebrow: "STAND WITH HER", title: "What Your Gift", titleHighlight: "Makes Possible",
          plans: [
            { name: "Dignity Kit", price: "₹500", period: "one-time", features: ["A year of sanitary pads for one girl", "Period-literacy session", "80G receipt"], featured: false, buttonLabel: "Give ₹500", buttonHref: "/donate" },
            { name: "Sponsor a Trainee", price: "₹6,000", period: "one-time", features: ["Full tailoring or beauty course", "Toolkit & certificate", "Her graduation photo & story"], featured: true, buttonLabel: "Sponsor Her", buttonHref: "/donate" },
            { name: "Sakhi Circle", price: "₹1,500", period: "/month", features: ["Keeps the 24×7 helpline running", "Quarterly impact letter", "Invite to Women's Day event"], featured: false, buttonLabel: "Give Monthly", buttonHref: "/donate" },
          ],
        } },
        { type: "logos", content: { title: "Working alongside", items: ["NRLM / State Livelihood Mission", "District Legal Services Authority", "One Stop Centre", "NSDC Training Partners", "CSR Partners", "Women & Child Development Dept."] } },
        { type: "faq", content: { eyebrow: "GOOD TO KNOW", title: "Questions We", titleHighlight: "Hear Often", items: [
          { q: "Are donations tax-deductible?", a: "Yes. We are registered under 12A and 80G. You receive an 80G receipt by email; please share your PAN for the receipt and Form 10BE." },
          { q: "Can a woman join a course if she has small children?", a: "Yes. Every centre has a supervised childcare corner and classes are scheduled around school hours." },
          { q: "Is the helpline really free and confidential?", a: "Yes. Calls are answered by trained women counsellors. We never share a caller's details without her consent, except where the law requires it for her safety." },
          { q: "Can our company partner under CSR?", a: "Yes. We are CSR-1 registered and run skilling, menstrual health and legal-aid projects with budgets, KPIs and quarterly reports." },
        ] } },
        { type: "cta", content: { title: "Every woman deserves an income and a voice", highlight: "Stand With Her Today", phones: ["9000000000"], buttonLabel: "Donate Now", buttonHref: "/donate" }, style: { background: "primary" } },
      ],
    },
    { slug: "about", title: "Our Story", isSystem: true, order: 1, sections: [
      { type: "banner", content: { title: "Our", titleHighlight: "Story", subtitle: "Sixteen years of standing with women — one sewing machine at a time.", image: "", bgColor: "", imageOpacity: 35, overlayOpacity: 80 } },
      { type: "about", content: {
        eyebrow: "SINCE 2009", title: "Built by Women,", titleHighlight: "for Women",
        body: [
          `${biz} was founded by a group of social workers and lawyers who saw the same pattern again and again: women with skills but no income, women with income but no say, and women in danger with nowhere to go.`,
          "We built one organisation that answers all three — training, savings groups, legal aid and a helpline — run by women from the very communities we serve.",
        ],
        image: "",
        points: ["Registered public charitable trust", "12A, 80G & CSR-1 registered", "FCRA compliant for foreign contributions", "Audited annual accounts"],
        buttonLabel: "See Our Programs", buttonHref: "/programs",
      }, style: { layout: "reverse" } },
      { type: "visionMission", content: {
        eyebrow: "WHAT GUIDES US",
        visionTitle: "Vision",
        visionText: "A society where every woman is economically independent, legally aware, healthy and free from violence.",
        missionTitle: "Mission",
        missionText: "To equip 1 lakh women by 2030 with skills, savings, rights awareness and a safety net — through community-led centres and partnerships.",
        valuesTitle: "Our Values",
        values: [
          { icon: "heart", title: "Dignity", text: "We listen first and never judge." },
          { icon: "shield", title: "Safety", text: "Confidentiality and consent in everything we do." },
          { icon: "users", title: "Sisterhood", text: "Every graduate mentors the next woman." },
        ],
      }, style: { background: "light" } },
      { type: "team", content: { eyebrow: "THE PEOPLE", title: "Women Who", titleHighlight: "Lead Us", members: [
        { name: "Founder Name", role: "Founder & Managing Trustee", image: "", note: "Gender & livelihoods" },
        { name: "Trustee Name", role: "Trustee & Legal Advisor", image: "", note: "Family law" },
        { name: "Programme Head", role: "Livelihoods & SHGs", image: "", note: "Microfinance" },
        { name: "Health Lead", role: "Project Garima", image: "", note: "Public health" },
      ] }, style: { layout: "list" } },
      { type: "downloads", content: { eyebrow: "TRANSPARENCY", title: "Registrations &", titleHighlight: "Reports", items: [
        { title: "Trust Registration Deed", description: "Registered public charitable trust.", link: "", icon: "badge-check" },
        { title: "12A & 80G Certificates", description: "Income-tax exemption for donors.", link: "", icon: "shield" },
        { title: "CSR-1 & FCRA", description: "Eligibility for CSR and foreign contributions.", link: "", icon: "handshake" },
        { title: "Annual Report 2025–26", description: "Outcomes, stories and audited accounts.", link: "", icon: "book-open" },
      ] } },
      { type: "cta", content: { title: "Want to see our work up close?", highlight: "Visit a Centre", phones: ["9000000000"], buttonLabel: "Contact Us", buttonHref: "/contact" }, style: { layout: "split" } },
    ] },
    { slug: "programs", title: "Programs", isSystem: true, order: 2, sections: [
      { type: "banner", content: { title: "Our", titleHighlight: "Programs", subtitle: "Livelihood, health and rights — connected, not separate.", image: "", bgColor: "", imageOpacity: 35, overlayOpacity: 80 } },
      { type: "serviceCategories", content: { eyebrow: "PROGRAMMES", title: "How We Stand", titleHighlight: "With Women", categories: ["Livelihood & Enterprise", "Health & Dignity", "Rights & Safety"] }, style: { layout: "list" } },
      { type: "stats", content: { items: [
        { value: "72%", label: "Graduates Earning in 6 Months", icon: "trending" },
        { value: "₹7,800", label: "Avg. Monthly Income Gained", icon: "tag" },
        { value: "1.1 Lakh", label: "Girls Reached on Menstrual Health", icon: "heart" },
        { value: "24×7", label: "Helpline Availability", icon: "headset" },
      ] }, style: { layout: "cards", background: "light" } },
      { type: "features", content: { items: [
        { icon: "graduation", title: "Courses we teach", text: "Tailoring & fashion design, beauty & wellness, food processing, computer & Tally, mobile repair." },
        { icon: "handshake", title: "SHG support", text: "Group formation, bookkeeping, bank linkage, NRLM schemes and enterprise mentoring." },
        { icon: "shield", title: "Legal aid", text: "Domestic violence, maintenance, divorce, property and workplace harassment (POSH)." },
        { icon: "book", title: "Girls' programme", text: "Scholarships, bicycles, bridge classes, career counselling and life-skills circles." },
      ] }, style: { layout: "numbered" } },
      { type: "cta", content: { title: "Sponsor a full training course for one woman", highlight: "₹6,000 Changes a Life", phones: ["9000000000"], buttonLabel: "Sponsor Her", buttonHref: "/donate" } },
    ] },
    { slug: "causes", title: "Causes", isSystem: true, order: 3, showInNav: true, sections: [
      { type: "banner", content: { title: "Live", titleHighlight: "Causes", subtitle: "Every appeal has a goal, a deadline and a public progress bar. Choose the change you want to fund.", image: "", bgColor: "", imageOpacity: 35, overlayOpacity: 80 } },
      { type: "causeList", content: {
        eyebrow: "CHOOSE HER CAUSE", title: "Fund What", titleHighlight: "Matters Most",
        subtitle: "Filter by livelihood, health or safety. Completed appeals stay up so you can see where the money went.",
        category: "all", featuredOnly: false, showFilters: true, showCompleted: true, limit: 12,
        emptyText: "Publish a cause from Admin → Causes to show it here.",
      }, style: { cardRadius: "sm", cardShadow: "md", cardBorderWidth: 0 } },
      { type: "testimonials", content: { eyebrow: "WHAT LAST YEAR'S CAUSES DID", title: "Gifts With", titleHighlight: "Outcomes You Can See", items: [
        { name: "Meena Kumari", role: "Garima pad unit · 10 jobs, 3,240 pads in month one", text: "Before the unit, I earned nothing of my own. Now I manage ten women and the girls in our school stopped missing class every month.", rating: 5 },
        { name: "Rehana Khatoon", role: "SHG machine appeal · income ₹1,800 → ₹7,400 a month", text: "The machine came to our group, not to one woman. We stitched 400 uniforms for the municipal school in the first month and repaid ₹1,000 to our savings.", rating: 5 },
        { name: "Kavya, 17", role: "Bicycle girl, 2025 batch · passed Class 10 with 78%", text: "Papa said the road was not safe. With the cycle and three friends riding together, he let me go. Now I cycle to college.", rating: 5 },
        { name: "Sakhi counsellor", role: "Helpline · 19 women sheltered the same night in October", text: "The night shift is when the worst calls come. Because donors fund it, I can promise every caller: someone will pick up.", rating: 5 },
      ] }, style: { layout: "minimal", background: "light" } },
      { type: "steps", content: { eyebrow: "WHERE YOUR RUPEE GOES", title: "How Every Cause", titleHighlight: "Is Accounted For", items: [
        { title: "Ring-fenced", text: "Your gift goes only to the cause you chose — never to a general pool.", icon: "shield" },
        { title: "92% to the field", text: "Only 8% covers audit, payment fees and reporting. Field staff salaries count as programme cost.", icon: "trending" },
        { title: "Updates on the page", text: "Purchases, handovers and outcomes are posted on each cause's timeline.", icon: "clipboard" },
        { title: "Audited every year", text: "Cause-wise utilisation is part of our annual audit and report.", icon: "badge-check" },
      ] }, style: { layout: "timeline" } },
      { type: "faq", content: { eyebrow: "RECEIPTS & TAX", title: "80G &", titleHighlight: "Receipt FAQs", items: [
        { q: "Will I get an 80G receipt for a cause donation?", a: "Yes. Every donation from an Indian donor gets an 80G receipt by email. Enter your PAN while donating so we can file Form 10BD and send you Form 10BE by 31 May." },
        { q: "What happens if a cause raises more than its goal?", a: "Extra funds go to the next phase of the same programme (for example, more machines or another month of helpline shifts). We post this on the cause timeline." },
        { q: "Can our company fund a whole cause under CSR?", a: "Yes. We are CSR-1 registered. We share a project budget, KPIs and a utilisation certificate, and can name the cause after your CSR programme." },
        { q: "Can I donate from abroad?", a: "Foreign contributions can only go to our FCRA account. Please write to us before giving so we can share the details." },
      ] }, style: { background: "light" } },
    ] },
    { slug: "stories", title: "Her Stories", isSystem: true, order: 4, sections: [
      { type: "banner", content: { title: "Her", titleHighlight: "Stories", subtitle: "Real women, real change — in their own words.", image: "", bgColor: "", imageOpacity: 35, overlayOpacity: 80 } },
      { type: "testimonials", content: { eyebrow: "IN THEIR WORDS", title: "Voices From", titleHighlight: "Our Centres", items: [
        { name: "Sunita Devi", role: "Boutique owner", text: "The centre gave me a skill, the SHG gave me capital and the other women gave me courage.", rating: 5 },
        { name: "Kavya, 17", role: "Scholarship student", text: "I was going to be married at 16. The mentor didi spoke to my parents. Now I am studying B.Sc. Nursing.", rating: 5 },
        { name: "Meena Kumari", role: "Pad-unit manager", text: "We make 3,000 pads a month and sell them to schools. Ten women earn from it — and girls stopped missing class.", rating: 5 },
        { name: "Asha Bai", role: "Paralegal volunteer", text: "I learnt the law from the legal cell. Now women in my village come to me first, and I know exactly where to take them.", rating: 5 },
      ] }, style: { layout: "default" } },
      { type: "gallery", content: { eyebrow: "HER JOURNEY", title: "Moments From", titleHighlight: "Our Centres" }, style: { layout: "strip", background: "light" } },
      { type: "cta", content: { title: "Help write the next story", highlight: "Donate or Volunteer", phones: ["9000000000"], buttonLabel: "Get Involved", buttonHref: "/get-involved" }, style: { layout: "minimal" } },
    ] },
    { slug: "events", title: "Events", isSystem: true, order: 5, sections: [
      { type: "eventList", content: { eyebrow: "CALENDAR", title: "Events &", titleHighlight: "Gatherings", subtitle: "Upcoming haats and camps first, then reports from past programmes.", limit: 24, emptyText: "Publish an event from Admin → Events to show it here.", groupByStatus: true } },
      { type: "countdown", content: { eyebrow: "NEXT BIG DAY", title: "Mahila Udyam", titleHighlight: "Haat 2026", subtitle: "40+ stalls by women entrepreneurs. Shop, sponsor a stall or volunteer at the fair.", targetDate: "2026-12-13T10:00:00", buttonLabel: "Volunteer at the Haat", buttonHref: "/get-involved" }, style: { background: "dark" } },
    ] },
    { slug: "get-involved", title: "Get Involved", isSystem: true, order: 6, sections: [
      { type: "banner", content: { title: "Stand", titleHighlight: "With Her", subtitle: "Teach a skill, mentor a girl, offer legal help or partner as a company.", image: "", bgColor: "", imageOpacity: 35, overlayOpacity: 80 } },
      { type: "features", content: { items: [
        { icon: "graduation", title: "Teach a Skill", text: "Spoken English, computers, accounts or design — a few hours a week." },
        { icon: "users", title: "Mentor a Girl", text: "One call a fortnight with a scholarship student for a year." },
        { icon: "shield", title: "Pro-bono Legal", text: "Advocates and law students can join the legal aid panel." },
        { icon: "handshake", title: "CSR Partnership", text: "Fund a centre, a pad unit or a helpline shift with full reporting." },
      ] }, style: { layout: "split" } },
      { type: "volunteerForm", content: { title: "Volunteer With Us", subtitle: "Women and men are both welcome. Tell us your skills and time — we'll call within a week.", interests: ["Skill Training", "Mentoring Girls", "Legal Aid", "Counselling", "Menstrual Health Drives", "Fundraising & Events", "Design & Social Media"] }, style: { background: "light" } },
      { type: "faq", content: { eyebrow: "BEFORE YOU JOIN", title: "Volunteer", titleHighlight: "FAQs", items: [
        { q: "Is there a background check?", a: "Yes. All volunteers working with girls or helpline callers complete ID verification and sign our safeguarding policy." },
        { q: "Can I volunteer remotely?", a: "Yes — design, content, fundraising, online mentoring and data work can be done from anywhere." },
        { q: "Will I get a certificate?", a: "Yes, after 30 hours of volunteering we issue a certificate and a letter of recommendation on request." },
      ], intro: "A few things to know before your first session with us." } as SectionContentMap["faq"], style: { layout: "split" } },
    ] },
    { slug: "donate", title: "Donate", isSystem: true, order: 7, sections: [
      { type: "donatePay", content: { eyebrow: "GIVE WITH CONFIDENCE", title: "Donate to", titleHighlight: biz, subtitle: "Pay by UPI, QR or online. Every Indian donation gets an 80G receipt for 50% tax deduction.", suggestedAmounts: "500,1500,6000,12000" } },
      { type: "steps", content: { eyebrow: "WHERE IT GOES", title: "Your Rupee", titleHighlight: "at Work", items: [
        { title: "₹500", text: "A year of sanitary pads for one girl", icon: "heart" },
        { title: "₹1,500", text: "Runs the Sakhi Helpline for one night", icon: "headset" },
        { title: "₹6,000", text: "A full skill course with toolkit for one woman", icon: "graduation" },
        { title: "₹12,000", text: "A school pad bank with incinerator", icon: "gift" },
      ] }, style: { layout: "timeline", background: "light" } },
      { type: "priceList", content: { eyebrow: "BANK TRANSFER", title: "Donate via", titleHighlight: "Bank / NEFT", note: "Share your PAN and address for the 80G receipt. Foreign contributions only to our FCRA account — write to us for details.", groups: [
        { category: "Bank Details", items: [ { name: "Account Name", price: "Your Trust Name", note: "" }, { name: "Account Number", price: "XXXXXXXXXXXX", note: "" }, { name: "IFSC", price: "XXXX0000000", note: "" }, { name: "UPI ID", price: "yourtrust@upi", note: "" } ] },
      ] } },
    ] },
    { slug: "contact", title: "Contact", isSystem: true, order: 8, sections: [
      { type: "contactInfo", content: { eyebrow: "REACH US", title: "We're Here", titleHighlight: "to Listen", address: "Head office — add street, area and PIN in the editor", phone: "9000000000", email: "hello@example.com", hours: "Office: Mon–Sat 10am – 6pm · Helpline: 24×7", mapEmbed: "" } },
      { type: "openingHours", content: { eyebrow: "SAKHI HELPLINE", title: "Help Is", titleHighlight: "Always Open", note: "In immediate danger, call 112. Women Helpline (govt.): 181.", days: [
        { day: "Sakhi Helpline (call / WhatsApp)", hours: "24×7" },
        { day: "Legal Aid Cell — walk-in", hours: "Tue & Fri · 11am – 4pm" },
        { day: "Skill Centres", hours: "Mon–Sat · 10am – 5pm" },
        { day: "Sunday", hours: "Helpline only" },
      ] }, style: { background: "light" } },
      { type: "contactForm", content: { title: "Write to Us", subtitle: "Donations, CSR, volunteering or a request for help — every message is read by a woman on our team." } },
    ] },
  ],
};
