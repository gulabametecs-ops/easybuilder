import type { TemplateDef } from "./types";
import type { SectionContentMap } from "../config";

// NGO / Charity / Trust: warm and trustworthy — deep teal + amber,
// focused on causes, measurable impact, donations (80G) and volunteering.
export const ngo: TemplateDef = {
  theme: {
    colors: { primary: "#0f766e", primaryDark: "#115e59", secondary: "#134e4a", accent: "#f59e0b", dark: "#042f2e", light: "#fffbeb", text: "#44403c", heading: "#1c1917" },
    font: "DM Sans", radius: "0.5rem",
  },
  header: (biz) => ({
    design: "bold",
    logoText: biz, logoImage: "",
    announcement: { show: true, text: "Every donation is eligible for 50% tax exemption under Section 80G", link: "/donate" },
    topbar: { show: true, address: "Registered Charitable Trust · Your City", phones: ["9000000000"], email: "hello@example.com", social: { facebook: "#", instagram: "#", whatsapp: "#" } },
    nav: [
      { label: "Home", href: "/" }, { label: "About", href: "/about" }, { label: "Causes", href: "/causes" }, { label: "Impact", href: "/impact" },
      { label: "Get Involved", href: "/get-involved" }, { label: "Events", href: "/events" }, { label: "Contact", href: "/contact" },
    ],
    cta: { label: "Donate Now", href: "/donate" },
  }),
  footer: (biz) => ({
    design: "modern",
    about: `${biz} is a registered non-profit working to give children, women and communities access to education, healthcare and dignified livelihoods.`,
    columns: [
      { title: "About", links: [ { label: "Who We Are", href: "/about" }, { label: "Our Causes", href: "/causes" }, { label: "Our Impact", href: "/impact" }, { label: "Events & Gallery", href: "/events" } ] },
      { title: "Support Us", links: [ { label: "Donate", href: "/donate" }, { label: "Volunteer", href: "/get-involved" }, { label: "CSR Partnerships", href: "/get-involved" }, { label: "Contact Us", href: "/contact" } ] },
    ],
    serviceAreas: ["Child Education", "Healthcare", "Women Empowerment", "Nutrition", "Environment", "Disaster Relief"],
    contact: { phones: ["9000000000"], email: "hello@example.com", address: "Your City" },
    social: { facebook: "#", instagram: "#", whatsapp: "#", location: "#" },
    copyright: `© {year} ${biz}. Registered under the Indian Trusts Act. Donations eligible under Section 80G.`,
  }),
  seo: (biz) => ({
    title: `${biz} — NGO for Education, Healthcare & Women Empowerment`,
    description: "Registered NGO working on child education, healthcare, nutrition and women empowerment. Donate online with 80G tax benefits or volunteer with us.",
    favicon: "", ogImage: "",
    keywords: "NGO, charity, donate online, 80G tax benefit, volunteer, child education, women empowerment, CSR",
    businessType: "NGO",
  }),
  services: [
    { category: "Education", title: "Child Education", description: "Free schooling support, books and uniforms for underprivileged children." },
    { category: "Education", title: "Digital Literacy", description: "Computer labs and skill training for rural youth." },
    { category: "Education", title: "Scholarships", description: "Merit-cum-need scholarships for girls pursuing higher studies." },
    { category: "Health & Nutrition", title: "Free Health Camps", description: "Medical check-ups, medicines and referrals in underserved areas." },
    { category: "Health & Nutrition", title: "Mid-day Nutrition", description: "Wholesome meals that keep children healthy and in school." },
    { category: "Health & Nutrition", title: "Clean Water & Sanitation", description: "Water filters, toilets and hygiene awareness in villages." },
    { category: "Livelihood & Empowerment", title: "Women Self-Help Groups", description: "Tailoring, handicraft and micro-enterprise training for women." },
    { category: "Livelihood & Empowerment", title: "Vocational Training", description: "Job-ready skills and placement support for youth." },
    { category: "Livelihood & Empowerment", title: "Disaster Relief", description: "Rapid food, shelter and medical relief during floods and emergencies." },
  ],
  gallery: [
    "Classroom in session", "Free health camp", "Mid-day meal distribution", "Women's tailoring workshop", "Tree plantation drive", "Volunteer meet", "Flood relief kits", "Annual day celebration",
  ].map((caption) => ({ category: "Our Work", caption })),
  pages: (biz) => [
    {
      slug: "home", title: "Home", isSystem: true, order: 0,
      sections: [
        { type: "hero", content: {
          variant: "split", customHtml: "",
          badge: "REGISTERED NGO · 12A & 80G CERTIFIED", titleTop: "Together, We Can", titleHighlight: "Change a Life",
          subtitle: "", description: `${biz} helps children stay in school, families access healthcare and women build independent livelihoods. Your support turns compassion into lasting change.`, image: "",
          primaryBtn: { label: "Donate Now", href: "/donate" }, secondaryBtn: { label: "Become a Volunteer", href: "/get-involved" },
          features: [ { icon: "shield", title: "100% Transparent", text: "" }, { icon: "badge-check", title: "80G Tax Benefit", text: "" }, { icon: "users", title: "Community-Led", text: "" }, { icon: "heart", title: "Direct Impact", text: "" } ],
        } },
        { type: "logos", content: { title: "Working alongside schools, panchayats and CSR partners", items: ["District Education Office", "Gram Panchayat Network", "Primary Health Centres", "Women SHG Federation", "CSR Partner · Manufacturing", "CSR Partner · Banking"] } },
        { type: "about", content: {
          eyebrow: "WHO WE ARE", title: "Small Acts,", titleHighlight: "Lasting Change",
          body: [`Founded by a group of teachers and doctors, ${biz} began by running an evening school for children of daily-wage workers. Today we support thousands of families across 120+ villages and urban settlements.`, "We believe real change is community-led — so we listen first, work with local volunteers and measure every outcome."],
          image: "", points: ["Education for every child", "Healthcare at the doorstep", "Dignified livelihoods for women", "Rapid relief in emergencies"],
          buttonLabel: "Our Story", buttonHref: "/about",
        }, style: { layout: "reverse", background: "light" } },
        { type: "stats", content: { items: [ { value: "25,000+", label: "Children Educated", icon: "graduation" }, { value: "1.2 Lakh", label: "Meals Served", icon: "utensils" }, { value: "350+", label: "Health Camps", icon: "stethoscope" }, { value: "1,800+", label: "Women Empowered", icon: "users" } ] }, style: { layout: "band" } },
        { type: "serviceCategories", content: { eyebrow: "OUR CAUSES", title: "Where Your Support", titleHighlight: "Goes", categories: ["Education", "Health & Nutrition", "Livelihood & Empowerment"] }, style: { layout: "list" } },
        { type: "features", content: { items: [
          { icon: "shield", title: "Registered & Audited", text: "Registered trust with 12A and 80G certification, CSR-1 registration and annually audited accounts." },
          { icon: "clipboard", title: "Transparent Reporting", text: "Every donor receives an 80G receipt, a utilisation note and our annual impact report." },
          { icon: "handshake", title: "Grassroots Partners", text: "We work alongside anganwadis, government schools and panchayats — never around them." },
          { icon: "heart", title: "85% to Programs", text: "The large majority of every rupee goes directly to the field, not to overheads." },
        ] }, style: { layout: "numbered" } },
        { type: "imageBanner", content: { title: "Sponsor a child's education for a full year", subtitle: "₹12,000 covers school fees, books, uniform, a school bag and daily nutrition for one child — with progress reports every term.", buttonLabel: "Sponsor a Child", buttonHref: "/donate", image: "" } },
        { type: "steps", content: { eyebrow: "HOW YOUR GIFT HELPS", title: "From Your Hands", titleHighlight: "to the Field", items: [
          { title: "You Give", text: "Donate securely online via UPI, card or net banking", icon: "heart" },
          { title: "We Plan", text: "Funds are allocated to the most urgent need in your chosen cause", icon: "clipboard" },
          { title: "We Act", text: "Field teams and local volunteers deliver on the ground", icon: "handshake" },
          { title: "You See Impact", text: "Receive photos, a utilisation note and the annual report", icon: "trending" },
        ] }, style: { layout: "timeline", background: "light" } },
        { type: "testimonials", content: { eyebrow: "VOICES", title: "Stories of", titleHighlight: "Hope", items: [
          { name: "Sunita Devi", role: "Self-help group member, Sitapur", text: "The tailoring training changed my life. Today I stitch school uniforms for three schools from home, earn about ₹7,000 a month, and both my daughters go to school.", rating: 5 },
          { name: "Rahul Verma", role: "Monthly donor since 2021", text: "I love that I get regular updates and photos. I can see exactly where my money goes — that trust is rare.", rating: 5 },
          { name: "Priya Menon", role: "Weekend volunteer", text: "Teaching English at the learning centre every Saturday has become the most meaningful part of my week.", rating: 5 },
          { name: "Mohd. Salim", role: "Parent, evening school", text: "My son was going to leave school to work at a dhaba. The centre's teachers convinced us otherwise — he cleared Class 10 with 78%.", rating: 5 },
        ] }, style: { layout: "featured" } },
        { type: "team", content: { eyebrow: "LEADERSHIP", title: "The People", titleHighlight: "Behind the Mission", members: [
          { name: "Dr. Meera Nair", role: "Founder & Managing Trustee", image: "", note: "Public health · 20 yrs" },
          { name: "Rajesh Kulkarni", role: "Programs Director", image: "", note: "Rural development" },
          { name: "Fatima Sheikh", role: "Education Lead", image: "", note: "Former school principal" },
          { name: "Amit Banerjee", role: "Finance & Compliance", image: "", note: "Chartered Accountant" },
        ] }, style: { layout: "list", background: "light" } },
        { type: "downloads", content: { eyebrow: "TRANSPARENCY", title: "Reports &", titleHighlight: "Certificates", items: [
          { title: "Annual Report 2025–26", description: "Programs, outcomes, stories and audited financial summary.", link: "", icon: "book-open" },
          { title: "Audited Accounts FY 2025–26", description: "Balance sheet, income & expenditure and auditor's report.", link: "", icon: "clipboard" },
          { title: "12A & 80G Certificates", description: "Income Tax registration for tax-exempt donations.", link: "", icon: "badge-check" },
          { title: "CSR-1 Registration", description: "MCA registration for companies funding CSR projects.", link: "", icon: "handshake" },
        ] } },
        { type: "faq", content: { eyebrow: "FAQ", title: "Common", titleHighlight: "Questions", items: [
          { q: "Is my donation eligible for tax exemption?", a: "Yes. We are registered under Section 12A and 80G of the Income Tax Act, so your donation qualifies for a 50% deduction. An 80G receipt is emailed after every donation." },
          { q: "How is my money used?", a: "Around 85% goes directly to programs on the ground. Our accounts are audited every year and the annual report is shared with all donors." },
          { q: "Can I donate for a specific cause?", a: "Yes. You can choose education, healthcare, nutrition or women empowerment while donating, and we will allocate your contribution accordingly." },
          { q: "How can I volunteer?", a: "Fill the volunteer form on our Get Involved page. We have weekend teaching, health camp, event and remote skill-based roles." },
          { q: "Do you accept CSR partnerships?", a: "Yes. We are CSR-1 registered and work with companies on education, health and livelihood projects with quarterly reporting." },
          { q: "Can I donate items instead of money?", a: "Yes — books, clothes, school supplies and dry ration are welcome. Please contact us first so we can direct them where needed most." },
        ], intro: "Straight answers on 80G receipts, fund use, CSR and volunteering. Still curious? Call us — a real person picks up." } as SectionContentMap["faq"], style: { layout: "split" } },
        { type: "cta", content: { title: "₹1,000 can keep a child in school for a month", highlight: "Donate Today", phones: ["9000000000"], buttonLabel: "Donate Now", buttonHref: "/donate" }, style: { layout: "split" } },
      ],
    },
    { slug: "about", title: "About Us", isSystem: true, order: 1, sections: [
      { type: "about", content: {
        eyebrow: "OUR STORY", title: "Rooted in", titleHighlight: "Compassion",
        body: [`${biz} started as a single evening classroom. Today we run education, health and livelihood programs that reach thousands of families every year.`, "Our work is guided by dignity, transparency and community ownership — we do not work for people, we work with them."],
        image: "", points: ["Registered under the Indian Trusts Act", "12A & 80G certified", "Annually audited accounts", "CSR-eligible organisation"],
        buttonLabel: "Support Our Work", buttonHref: "/donate",
      } },
      { type: "visionMission", content: {
        eyebrow: "WHAT DRIVES US",
        visionTitle: "Our Vision", visionText: "An inclusive society where no one is left behind because of where they were born.",
        missionTitle: "Our Mission", missionText: "To give every child, woman and family the opportunity to learn, stay healthy and earn with dignity — through programs the community owns.",
        valuesTitle: "Our Values",
        values: [
          { icon: "shield", title: "Transparency", text: "Audited books, 80G receipts and public annual reports." },
          { icon: "heart", title: "Empathy", text: "We listen before we act, and we never lead with pity." },
          { icon: "users", title: "Community-led", text: "Local volunteers and leaders shape every program." },
        ],
      }, style: { background: "light" } },
      { type: "steps", content: { eyebrow: "OUR JOURNEY", title: "Milestones Along", titleHighlight: "the Way", items: [
        { title: "2009 · One Classroom", text: "An evening school for 18 children of construction workers", icon: "book-open" },
        { title: "2013 · Health Camps", text: "Volunteer doctors begin monthly camps in five villages", icon: "stethoscope" },
        { title: "2017 · Women's SHGs", text: "Tailoring and micro-enterprise training for 200 women", icon: "users" },
        { title: "2024 · 120 Villages", text: "Education, health and livelihood programs across three districts", icon: "map-pin" },
      ] }, style: { layout: "timeline" } },
      { type: "team", content: { eyebrow: "LEADERSHIP", title: "Board of", titleHighlight: "Trustees", members: [
        { name: "Dr. Meera Nair", role: "Founder & Managing Trustee", image: "", note: "Public health · 20 yrs" },
        { name: "Rajesh Kulkarni", role: "Programs Director", image: "", note: "Rural development" },
        { name: "Fatima Sheikh", role: "Education Lead", image: "", note: "Former school principal" },
        { name: "Amit Banerjee", role: "Finance & Compliance", image: "", note: "Chartered Accountant" },
      ] } },
      { type: "cta", content: { title: "Be part of the change", highlight: "Join Our Mission", phones: ["9000000000"], buttonLabel: "Get Involved", buttonHref: "/get-involved" } },
    ] },
    { slug: "causes", title: "Our Causes", isSystem: true, order: 2, sections: [
      { type: "serviceCategories", content: { eyebrow: "WHAT WE DO", title: "Causes &", titleHighlight: "Programs", categories: ["Education", "Health & Nutrition", "Livelihood & Empowerment"] } },
      { type: "imageBanner", content: { title: "Sponsor a child's education for a full year", subtitle: "₹12,000 covers school fees, books, uniform and nutrition for one child.", buttonLabel: "Sponsor a Child", buttonHref: "/donate", image: "" } },
      { type: "cta", content: { title: "Choose a cause close to your heart", highlight: "Give Today", phones: ["9000000000"], buttonLabel: "Donate Now", buttonHref: "/donate" } },
    ] },
    { slug: "impact", title: "Our Impact", isSystem: true, order: 3, sections: [
      { type: "stats", content: { items: [ { value: "25,000+", label: "Children Educated", icon: "graduation" }, { value: "1.2 Lakh", label: "Meals Served", icon: "utensils" }, { value: "350+", label: "Health Camps", icon: "stethoscope" }, { value: "120+", label: "Villages Reached", icon: "map-pin" } ] }, style: { background: "dark" } },
      { type: "steps", content: { eyebrow: "OUR APPROACH", title: "How We Create", titleHighlight: "Change", items: [
        { title: "Listen", text: "Community surveys identify real needs", icon: "users" },
        { title: "Design", text: "Programs built with local leaders", icon: "edit" },
        { title: "Deliver", text: "Trained field teams and volunteers", icon: "handshake" },
        { title: "Measure", text: "Outcomes tracked and reported to donors", icon: "clipboard" },
      ] } },
      { type: "features", content: { items: [
        { icon: "graduation", title: "92% Retention", text: "Children in our learning centres continue into the next grade." },
        { icon: "heart-pulse", title: "40,000+ Check-ups", text: "Free consultations and medicines delivered through health camps." },
        { icon: "trending", title: "₹6,500 / month", text: "Average additional income earned by women in our livelihood program." },
      ] }, style: { background: "light" } },
      { type: "testimonials", content: { eyebrow: "IMPACT IN THEIR WORDS", title: "Lives", titleHighlight: "Changed", items: [
        { name: "Pooja Kumari", role: "Scholarship recipient, B.Sc Nursing", text: "My father is a rickshaw puller. The scholarship paid my college fees and hostel — next year I will be the first nurse in our village.", rating: 5 },
        { name: "Gopal Rathore", role: "Sarpanch, partner village", text: "After the water filters and toilets came, diarrhoea cases at our anganwadi dropped sharply. The volunteers still visit every month.", rating: 5 },
      ] }, style: { layout: "minimal" } },
      { type: "downloads", content: { eyebrow: "REPORTS", title: "Read Our", titleHighlight: "Annual Reports", items: [
        { title: "Annual Report 2025–26", description: "Programs, outcomes and audited financial summary.", link: "", icon: "book-open" },
        { title: "Annual Report 2024–25", description: "Year in review with village-wise impact data.", link: "", icon: "book-open" },
        { title: "Audited Accounts FY 2025–26", description: "Auditor's report, balance sheet and I&E statement.", link: "", icon: "clipboard" },
      ] }, style: { background: "light" } },
      { type: "cta", content: { title: "Help us reach the next village", highlight: "Donate Now", phones: ["9000000000"], buttonLabel: "Donate Now", buttonHref: "/donate" } },
    ] },
    { slug: "get-involved", title: "Get Involved", isSystem: true, order: 4, sections: [
      { type: "features", content: { items: [
        { icon: "users", title: "Volunteer on Ground", text: "Teach, assist at health camps or help with relief distribution on weekends." },
        { icon: "headset", title: "Remote Skills", text: "Design, content, fundraising or tech — help from anywhere." },
        { icon: "handshake", title: "CSR Partnership", text: "Partner with us on education, health and livelihood projects." },
        { icon: "gift", title: "Donate in Kind", text: "Books, clothes, school supplies and dry ration for families in need." },
      ] }, style: { layout: "minimal" } },
      { type: "volunteerForm", content: { title: "Volunteer Sign-up", subtitle: "Tell us about yourself, your city and how you'd like to help — our team will get in touch within a week.", interests: ["Weekend Teaching", "Health Camps", "Women's SHGs", "Relief Distribution", "Fundraising", "Design & Social Media", "Tech & Data"] }, style: { background: "light" } },
      { type: "quoteForm", content: { title: "CSR & In-kind Partnership Enquiry", subtitle: "Companies, schools and resident groups — tell us what you would like to support and we will share a project proposal with budget and reporting plan.", showSidebar: true } },
    ] },
    { slug: "donate", title: "Donate Now", isSystem: true, order: 5, sections: [
      { type: "pricingPlans", content: {
        eyebrow: "MAKE A DIFFERENCE", title: "Choose Your", titleHighlight: "Contribution",
        plans: [
          { name: "Feed a Child", price: "₹500", period: "one-time", features: ["Nutritious meals for a month", "80G tax receipt", "Thank-you update with photos"], featured: false, buttonLabel: "Donate ₹500", buttonHref: "/contact" },
          { name: "Educate a Child", price: "₹1,000", period: "/month", features: ["School fees, books & uniform", "Quarterly progress report", "80G tax receipt", "Annual impact report"], featured: true, buttonLabel: "Give Monthly", buttonHref: "/contact" },
          { name: "Health Camp Sponsor", price: "₹5,000", period: "one-time", features: ["Check-ups for 100 people", "Free medicines & referrals", "80G tax receipt", "Camp photos & report"], featured: false, buttonLabel: "Donate ₹5,000", buttonHref: "/contact" },
          { name: "Sponsor a Year", price: "₹12,000", period: "/year", features: ["Full year of education for one child", "Letters from your sponsored child", "80G tax receipt", "Invite to annual day"], featured: false, buttonLabel: "Sponsor Now", buttonHref: "/contact" },
        ],
      } },
      { type: "donatePay", content: { eyebrow: "PAY EASILY", title: "UPI, QR or", titleHighlight: "Online", subtitle: "Scan, transfer, or pay with Razorpay — set details in Admin → Settings → Payments.", suggestedAmounts: "500,1000,2500" } },
      { type: "priceList", content: { eyebrow: "BANK TRANSFER", title: "Donate via", titleHighlight: "Bank / UPI", note: "All donations are eligible for 50% tax exemption under Section 80G of the Income Tax Act. Please share your PAN and address to receive your 80G receipt. Foreign contributions accepted only through our FCRA account.", groups: [
        { category: "Bank Details", items: [ { name: "Account Name", price: "Your Trust Name", note: "" }, { name: "Account Number", price: "XXXXXXXXXXXX", note: "" }, { name: "IFSC", price: "XXXX0000000", note: "" }, { name: "UPI ID", price: "yourtrust@upi", note: "" } ] },
      ] }, style: { background: "light" } },
      { type: "cta", content: { title: "Questions about donating or 80G receipts?", highlight: "Talk to Us", phones: ["9000000000"], buttonLabel: "Contact Us", buttonHref: "/contact" } },
    ] },
    { slug: "events", title: "Events & Gallery", isSystem: true, order: 6, sections: [
      { type: "countdown", content: { eyebrow: "UPCOMING EVENT", title: "Annual Charity", titleHighlight: "Walkathon", subtitle: "Walk 5 km with us to raise funds for girls' education. Families, students and corporate teams welcome.", targetDate: "2026-12-13T07:00:00", buttonLabel: "Register as Volunteer", buttonHref: "/get-involved" } },
      { type: "gallery", content: { eyebrow: "ON THE GROUND", title: "Moments From", titleHighlight: "Our Work" }, style: { layout: "masonry" } },
      { type: "faq", content: { eyebrow: "WALKATHON", title: "Walkathon", titleHighlight: "Details", items: [
        { q: "Where does the walk start?", a: "From the city stadium main gate at 7:00 AM, ending at the same point. Water, ORS and first aid are available along the route." },
        { q: "Is there a registration fee?", a: "₹300 per walker (₹150 for students), which includes a T-shirt and breakfast. The entire amount goes to girls' education and is eligible for 80G." },
        { q: "Can my company register a team?", a: "Yes — corporate teams of 10 or more get a team banner and a CSR utilisation certificate." },
      ], intro: "Everything you need to know before walking with us on 13 December." } as SectionContentMap["faq"], style: { layout: "split", background: "light" } },
      { type: "cta", content: { title: "Want to join our next drive?", highlight: "Volunteer With Us", phones: ["9000000000"], buttonLabel: "Get Involved", buttonHref: "/get-involved" } },
    ] },
    { slug: "contact", title: "Contact Us", isSystem: true, order: 7, sections: [
      { type: "contactForm", content: { title: "Get in Touch", subtitle: "For donations, 80G receipts, CSR partnerships or volunteering — we'd love to hear from you." } },
      { type: "map", content: { eyebrow: "VISIT US", title: "Our", titleHighlight: "Office", address: "Your City", mapEmbed: "" } },
    ] },
  ],
};
