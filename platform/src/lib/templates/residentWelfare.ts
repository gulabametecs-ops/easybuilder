import type { TemplateDef } from "./types";
import type { SectionContentMap } from "../config";

// Housing Society / RWA: clean, utilitarian and information-first — teal + slate,
// built around notices, committee, amenities, maintenance, helpdesk and documents.
export const residentWelfare: TemplateDef = {
  theme: {
    colors: { primary: "#0d9488", primaryDark: "#0f766e", secondary: "#334155", accent: "#f97316", dark: "#0f172a", light: "#f0fdfa", text: "#475569", heading: "#0f172a" },
    font: "Work Sans", radius: "0.25rem",
  },
  header: (biz) => ({
    design: "minimal",
    logoText: biz, logoImage: "",
    announcement: { show: true, text: "Q3 maintenance due by 10th — pay online via UPI to avoid late fee", link: "/maintenance" },
    topbar: { show: false, address: "Society Office · Your City", phones: ["9000000000"], email: "hello@example.com", social: { whatsapp: "#" } },
    nav: [
      { label: "Home", href: "/" }, { label: "Notices", href: "/notices" }, { label: "Committee", href: "/committee" }, { label: "Amenities", href: "/amenities" },
      { label: "Maintenance", href: "/maintenance" }, { label: "Events", href: "/events" }, { label: "Documents", href: "/documents" }, { label: "Contact", href: "/contact" },
    ],
    cta: { label: "Raise a Complaint", href: "/helpdesk" },
  }),
  footer: (biz) => ({
    design: "minimal",
    about: `${biz} is the official Resident Welfare Association — keeping our community safe, clean, well-maintained and connected.`,
    columns: [
      { title: "Residents", links: [ { label: "Notice Board", href: "/notices" }, { label: "Maintenance & Dues", href: "/maintenance" }, { label: "Helpdesk", href: "/helpdesk" }, { label: "Documents & Bye-laws", href: "/documents" } ] },
      { title: "Community", links: [ { label: "Managing Committee", href: "/committee" }, { label: "Amenities & Booking", href: "/amenities" }, { label: "Events", href: "/events" }, { label: "Contact Office", href: "/contact" } ] },
    ],
    serviceAreas: ["Security", "Housekeeping", "Water & Power", "Lifts & DG", "Clubhouse", "Gardening"],
    contact: { phones: ["9000000000"], email: "hello@example.com", address: "Society Office, Your City" },
    social: { facebook: "#", whatsapp: "#", location: "#" },
    copyright: `© {year} ${biz}. Registered under the Societies Registration Act.`,
  }),
  seo: (biz) => ({
    title: `${biz} — Resident Welfare Association | Notices, Maintenance & Helpdesk`,
    description: "Official website of the housing society RWA: notices, managing committee, amenities booking, maintenance dues, complaints helpdesk, bye-laws and emergency contacts.",
    favicon: "", ogImage: "",
    keywords: "housing society, RWA, resident welfare association, apartment maintenance, society notices, clubhouse booking, society bye-laws",
    businessType: "HomeAndConstructionBusiness",
  }),
  services: [
    { category: "Facility Management", title: "24×7 Security", description: "Guarded gates, visitor management app, CCTV and night patrolling." },
    { category: "Facility Management", title: "Housekeeping", description: "Daily cleaning of lobbies, staircases, basements and common areas." },
    { category: "Facility Management", title: "Water & Power Backup", description: "STP, WTP, tanker coordination and 100% DG backup for common areas." },
    { category: "Facility Management", title: "Lift & DG Maintenance", description: "AMC-based servicing with monthly safety checks." },
    { category: "Facility Management", title: "Waste Segregation", description: "Door-to-door dry/wet collection and on-site composting." },
    { category: "Amenities", title: "Clubhouse & Party Hall", description: "Bookable hall for birthdays, poojas and get-togethers — up to 120 guests." },
    { category: "Amenities", title: "Swimming Pool", description: "Lifeguard-supervised pool with separate kids' section." },
    { category: "Amenities", title: "Gym & Yoga Room", description: "Fully equipped gym and a yoga studio open 5am–10pm." },
    { category: "Amenities", title: "Sports Courts & Play Area", description: "Badminton, basketball, a cricket net and a children's park." },
    { category: "Resident Services", title: "Complaint Helpdesk", description: "Plumbing, electrical, lift and security issues tracked to closure." },
    { category: "Resident Services", title: "Move-in / Move-out Support", description: "NOCs, lift booking and gate passes for shifting." },
  ],
  gallery: [
    "Main gate & security cabin", "Clubhouse party hall", "Swimming pool", "Children's play area", "Independence Day flag hoisting", "Holi in the central lawn", "Tree plantation drive", "Annual General Body Meeting",
  ].map((caption) => ({ category: "Our Society", caption })),
  people: () => [
    { name: "Mr. Suresh Agarwal", role: "President", groupName: "leadership", experience: "Tower A · 2nd term", bio: "Retired bank manager; leads the committee and liaises with the municipal ward office." },
    { name: "Mrs. Deepa Krishnan", role: "Secretary", groupName: "leadership", experience: "Tower C", bio: "Handles notices, meetings, minutes and resident communication." },
    { name: "Mr. Harpreet Singh", role: "Treasurer", groupName: "leadership", experience: "Tower B · Chartered Accountant", bio: "Manages maintenance collection, vendor payments and audited accounts." },
    { name: "Ms. Ritu Malhotra", role: "Amenities & Events", groupName: "core", experience: "Tower D", bio: "Coordinates clubhouse bookings, festivals and the sports calendar." },
    { name: "Mr. Abdul Rahman", role: "Security & Facilities", groupName: "core", experience: "Tower A", bio: "Oversees the security agency, lifts, DG and water supply." },
  ],
  events: (biz) => [
    {
      title: "Annual General Body Meeting 2026", slug: "agm-2026", activityName: "AGM",
      date: "2026-12-14", location: "Clubhouse Party Hall", status: "upcoming", organizedBy: biz,
      shortDescription: "Annual accounts, budget for 2027, election of the new managing committee and open house.",
      programDescription: "All flat owners are requested to attend. Tenants may attend as observers. Proxy forms are available on the Documents page.",
      objectives: ["Approve audited accounts", "Pass 2027 budget", "Elect managing committee", "Resident open house"],
    },
    {
      title: "New Year's Eve Community Night", slug: "new-year-community-night", activityName: "Cultural Evening",
      date: "2026-12-31", location: "Central Lawn", status: "upcoming", organizedBy: biz,
      shortDescription: "Kids' performances, DJ, food stalls by residents and a midnight countdown.",
      objectives: ["Bring all towers together", "Showcase resident talent", "Support home-run food businesses"],
    },
    {
      title: "Diwali Mela & Rangoli Competition", slug: "diwali-mela", activityName: "Festival Celebration",
      date: "2026-11-07", location: "Central Lawn & Clubhouse", status: "completed", organizedBy: biz,
      shortDescription: "35 resident stalls, a rangoli competition across four age groups and a green-crackers-only celebration.",
      impact: "Over 600 residents joined in, and stall sales of ₹1.8 lakh went to home-run businesses.",
    },
  ],
  pages: (biz) => [
    {
      slug: "home", title: "Home", isSystem: true, order: 0,
      sections: [
        { type: "hero", content: {
          variant: "minimal", customHtml: "",
          badge: "OFFICIAL RWA WEBSITE", titleTop: `Welcome to`, titleHighlight: biz,
          subtitle: "", description: "Notices, dues, amenity bookings and the helpdesk — everything residents need, in one place.", image: "",
          primaryBtn: { label: "Raise a Complaint", href: "/helpdesk" }, secondaryBtn: { label: "View Notices", href: "/notices" },
          features: [ { icon: "clipboard", title: "Notices", text: "" }, { icon: "tag", title: "Pay Dues", text: "" }, { icon: "calendar", title: "Book Amenities", text: "" }, { icon: "headset", title: "Helpdesk", text: "" } ],
        } },
        { type: "features", content: { items: [
          { icon: "tag", title: "Pay Maintenance", text: "UPI, NEFT or cheque — see your quarterly dues." },
          { icon: "headset", title: "Raise a Ticket", text: "Plumbing, electrical, lift or security complaints." },
          { icon: "calendar", title: "Book Clubhouse", text: "Check availability for the party hall and courts." },
          { icon: "book", title: "Bye-laws & Forms", text: "Download rules, NOC and move-in forms." },
        ] }, style: { layout: "minimal" } },
        { type: "noticeBoard", content: { eyebrow: "LATEST", title: "Notice", titleHighlight: "Board", limit: 5, notices: [
          { date: "12 Nov 2026", title: "Water supply shutdown in Towers B & C on 18 Nov, 10am–2pm for tank cleaning", category: "Maintenance", link: "/notices", isNew: true },
          { date: "10 Nov 2026", title: "AGM on 14 December — agenda and proxy form uploaded", category: "Meeting", link: "/documents", isNew: true },
          { date: "08 Nov 2026", title: "Nominations open for Managing Committee elections till 30 November", category: "Election", link: "/documents", isNew: true },
          { date: "05 Nov 2026", title: "Q3 maintenance bills issued — due date 10 December", category: "Accounts", link: "/maintenance", isNew: false },
          { date: "01 Nov 2026", title: "Pool closed for winter from 15 November to 28 February", category: "Amenities", link: "/amenities", isNew: false },
        ] }, style: { background: "light", cardRadius: "sm", cardShadow: "none", cardBorderWidth: 1 } },
        { type: "countdown", content: { eyebrow: "EVERY OWNER'S VOTE COUNTS", title: "Annual General", titleHighlight: "Body Meeting", subtitle: "Audited accounts, the 2027 budget and committee elections — Clubhouse Party Hall, 10:30 AM.", targetDate: "2026-12-14T10:30:00", buttonLabel: "Agenda & Proxy Form", buttonHref: "/documents" }, style: { background: "dark" } },
        { type: "about", content: {
          eyebrow: "ABOUT THE RWA", title: "Run by Residents,", titleHighlight: "for Residents",
          body: [`${biz} is a registered society elected by flat owners every two years. The managing committee volunteers its time to manage security, housekeeping, utilities, finances and community life.`, "Accounts are audited annually and shared at the AGM. Every rupee of maintenance is published in the quarterly statement on our Documents page."],
          image: "", points: ["Elected managing committee", "Audited accounts every year", "Monthly open-house meetings", "Transparent vendor contracts"],
          buttonLabel: "Meet the Committee", buttonHref: "/committee",
        }, style: { layout: "reverse" } },
        { type: "stats", content: { items: [ { value: "640", label: "Homes", icon: "home" }, { value: "4", label: "Towers", icon: "factory" }, { value: "24×7", label: "Security", icon: "shield" }, { value: "92%", label: "Tickets Closed in 48 hrs", icon: "check" } ] }, style: { layout: "band" } },
        { type: "serviceCategories", content: { eyebrow: "AMENITIES", title: "Shared Spaces", titleHighlight: "to Enjoy", categories: ["Amenities"] }, style: { background: "light" } },
        { type: "steps", content: { eyebrow: "HELPDESK", title: "From Complaint to", titleHighlight: "Closure", items: [
          { title: "Raise", text: "Submit the form with your flat number and issue", icon: "edit" },
          { title: "Assign", text: "Facility manager assigns a technician within 2 hours", icon: "user-check" },
          { title: "Resolve", text: "Most issues are fixed within 48 hours", icon: "wrench" },
          { title: "Close", text: "You confirm and rate the work", icon: "thumbs-up" },
        ] }, style: { layout: "cards" } },
        { type: "team", content: { eyebrow: "MANAGING COMMITTEE", title: "Your Elected", titleHighlight: "Committee", members: [
          { name: "Mr. Suresh Agarwal", role: "President", image: "", note: "A-204" },
          { name: "Mrs. Deepa Krishnan", role: "Secretary", image: "", note: "C-1102" },
          { name: "Mr. Harpreet Singh", role: "Treasurer", image: "", note: "B-506" },
          { name: "Ms. Ritu Malhotra", role: "Amenities & Events", image: "", note: "D-801" },
        ] }, style: { layout: "list", background: "light" } },
        { type: "eventList", content: { eyebrow: "COMMUNITY", title: "Upcoming", titleHighlight: "Events", subtitle: "Meetings, festivals and drives in our society.", limit: 3, emptyText: "Upcoming events will appear here." } },
        { type: "downloads", content: { eyebrow: "QUICK DOWNLOADS", title: "Most-used", titleHighlight: "Forms", items: [
          { title: "AGM 2026 Agenda & Proxy Form", description: "Agenda for 14 December and the proxy authorisation form.", link: "", icon: "calendar" },
          { title: "Move-in / Move-out Form", description: "Required 3 days before shifting; includes lift booking.", link: "", icon: "truck" },
          { title: "Tenant Registration Form", description: "With police verification and rental agreement copy.", link: "", icon: "user-check" },
        ] }, style: { background: "light" } },
        { type: "priceList", content: { eyebrow: "EMERGENCY", title: "Important", titleHighlight: "Numbers", note: "Save these numbers. In any emergency call the main gate first — guards will coordinate.", groups: [
          { category: "Society", items: [ { name: "Main Gate Security", price: "9000000000", note: "24×7" }, { name: "Facility Manager", price: "9000000000", note: "8am–8pm" }, { name: "Electrician / Plumber on duty", price: "9000000000", note: "24×7" } ] },
          { category: "City", items: [ { name: "Police", price: "112", note: "" }, { name: "Ambulance", price: "108", note: "" }, { name: "Fire", price: "101", note: "" } ] },
        ] } },
        { type: "faq", content: { eyebrow: "RESIDENTS ASK", title: "Quick", titleHighlight: "Answers", items: [
          { q: "How do I register as a new owner or tenant?", a: "Submit the tenant/owner registration form with ID proof, the sale deed or rental agreement and police verification at the society office. Gate-app access is activated within 24 hours." },
          { q: "How do I book the clubhouse?", a: "Raise a booking request on the Helpdesk at least 3 days in advance. The office confirms availability and shares the payment link for charges and deposit." },
          { q: "When is maintenance due?", a: "Quarterly bills are due by the 10th of the first month of each quarter. A 2% monthly late fee applies after the due date." },
          { q: "Who do I contact for a water leak at night?", a: "Call the main gate. The guard will alert the plumber on duty and, if needed, shut the riser valve for your tower." },
        ], intro: "The questions the society office hears every week. For anything else, raise a ticket on the Helpdesk." } as SectionContentMap["faq"], style: { layout: "split" } },
        { type: "cta", content: { title: "Facing an issue at home or in common areas?", highlight: "We'll Fix It", phones: ["9000000000"], buttonLabel: "Raise a Complaint", buttonHref: "/helpdesk" }, style: { layout: "minimal" } },
      ],
    },
    { slug: "notices", title: "Notice Board", isSystem: true, order: 1, sections: [
      { type: "noticeBoard", content: { eyebrow: "ALL NOTICES", title: "Circulars &", titleHighlight: "Announcements", notices: [
        { date: "12 Nov 2026", title: "Water supply shutdown in Towers B & C on 18 Nov, 10am–2pm for tank cleaning", category: "Maintenance", link: "", isNew: true },
        { date: "10 Nov 2026", title: "AGM on 14 December — agenda and proxy form uploaded", category: "Meeting", link: "/documents", isNew: true },
        { date: "08 Nov 2026", title: "Nominations open for Managing Committee elections till 30 November", category: "Election", link: "/documents", isNew: true },
        { date: "05 Nov 2026", title: "Q3 maintenance bills issued — due date 10 December", category: "Accounts", link: "/maintenance", isNew: false },
        { date: "01 Nov 2026", title: "Pool closed for winter from 15 November to 28 February", category: "Amenities", link: "", isNew: false },
        { date: "28 Oct 2026", title: "Diwali: green crackers only, in the central lawn, 7pm–10pm", category: "Rules", link: "", isNew: false },
        { date: "15 Oct 2026", title: "Pest control in basements and lift lobbies on 20 October", category: "Maintenance", link: "", isNew: false },
      ] }, style: { cardRadius: "sm", cardBorderWidth: 1, cardShadow: "none" } },
      { type: "features", content: { items: [
        { icon: "phone", title: "WhatsApp Broadcast", text: "Join the official RWA broadcast list for instant alerts — message the office." },
        { icon: "mail", title: "Email Circulars", text: "Every notice is also emailed to registered owners and tenants." },
        { icon: "clipboard", title: "Lift Lobby Boards", text: "Printed copies are pinned in every tower's ground-floor lobby." },
      ] }, style: { background: "light" } },
      { type: "cta", content: { title: "Missed a notice or need a clarification?", highlight: "Ask the Office", phones: ["9000000000"], buttonLabel: "Contact Office", buttonHref: "/contact" } },
    ] },
    { slug: "committee", title: "Managing Committee", isSystem: true, order: 2, sections: [
      { type: "team", content: { eyebrow: "2025 – 2027 TERM", title: "Managing", titleHighlight: "Committee", members: [
        { name: "Mr. Suresh Agarwal", role: "President", image: "", note: "A-204" },
        { name: "Mrs. Deepa Krishnan", role: "Secretary", image: "", note: "C-1102" },
        { name: "Mr. Harpreet Singh", role: "Treasurer", image: "", note: "B-506" },
        { name: "Ms. Ritu Malhotra", role: "Amenities & Events", image: "", note: "D-801" },
        { name: "Mr. Abdul Rahman", role: "Security & Facilities", image: "", note: "A-1003" },
        { name: "Mrs. Lalitha Rao", role: "Tower Representative", image: "", note: "B-301" },
      ] }, style: { cardRadius: "sm" } },
      { type: "visionMission", content: {
        eyebrow: "OUR COMMITMENT",
        visionTitle: "Our Vision", visionText: "A safe, green and friendly society where every resident — children, working families and seniors — feels at home.",
        missionTitle: "Our Mission", missionText: "Run common services efficiently, keep finances transparent and bring residents together through festivals, sports and civic drives.",
        valuesTitle: "How the Committee Works",
        values: [
          { icon: "clipboard", title: "Open Books", text: "Quarterly statements and audited accounts for every owner." },
          { icon: "users", title: "Resident First", text: "Monthly open house — any resident can raise any issue." },
          { icon: "shield", title: "Safety", text: "Fire drills, CCTV and verified staff and vendors." },
        ],
      }, style: { background: "light" } },
      { type: "steps", content: { eyebrow: "HOW DECISIONS ARE MADE", title: "Transparent", titleHighlight: "Governance", items: [
        { title: "Resident Input", text: "Suggestions via helpdesk, email or monthly open house", icon: "users" },
        { title: "Committee Review", text: "Discussed and minuted at fortnightly meetings", icon: "clipboard" },
        { title: "Quotations", text: "Minimum three vendor quotes for any spend above ₹25,000", icon: "tag" },
        { title: "Publish", text: "Minutes and decisions shared on the Documents page", icon: "book" },
      ] }, style: { background: "light" } },
      { type: "openingHours", content: { eyebrow: "MEET US", title: "Office &", titleHighlight: "Open House", note: "The committee holds an open house on the first Sunday of every month at 11am in the clubhouse.", days: [
        { day: "Monday – Saturday", hours: "10:00 AM – 1:00 PM, 5:00 PM – 8:00 PM" }, { day: "Sunday", hours: "10:00 AM – 1:00 PM" }, { day: "Monthly Open House", hours: "1st Sunday, 11:00 AM" },
      ] } },
      { type: "cta", content: { title: "Want to contribute to your community?", highlight: "Join a Sub-committee", phones: ["9000000000"], buttonLabel: "Write to Us", buttonHref: "/contact" } },
    ] },
    { slug: "amenities", title: "Amenities", isSystem: true, order: 3, sections: [
      { type: "serviceCategories", content: { eyebrow: "FACILITIES", title: "Amenities &", titleHighlight: "Services", categories: ["Amenities", "Facility Management"] } },
      { type: "priceList", content: { eyebrow: "BOOKING CHARGES", title: "Clubhouse &", titleHighlight: "Court Bookings", note: "Bookings open to residents only, at least 3 days in advance. A refundable deposit of ₹2,000 applies to the party hall.", groups: [
        { category: "Halls", items: [ { name: "Party Hall (4 hours)", price: "₹3,500", note: "up to 120 guests" }, { name: "Mini Hall (3 hours)", price: "₹1,500", note: "up to 40 guests" }, { name: "Terrace Garden", price: "₹2,000", note: "evening slot" } ] },
        { category: "Sports", items: [ { name: "Badminton court", price: "Free", note: "1-hour slots" }, { name: "Guest swimming pass", price: "₹200", note: "per visit" }, { name: "Gym personal trainer", price: "₹2,500", note: "per month" } ] },
      ] }, style: { background: "light" } },
      { type: "openingHours", content: { eyebrow: "TIMINGS", title: "Amenity", titleHighlight: "Hours", note: "Children under 12 must be accompanied by an adult at the pool and gym.", days: [
        { day: "Gym & Yoga Room", hours: "5:00 AM – 10:00 PM" }, { day: "Swimming Pool (Mar – Nov)", hours: "6:00 AM – 9:00 AM, 4:00 PM – 8:00 PM" }, { day: "Sports Courts", hours: "6:00 AM – 10:00 PM" }, { day: "Children's Park", hours: "6:00 AM – 9:00 PM" },
      ] } },
      { type: "gallery", content: { eyebrow: "AROUND THE SOCIETY", title: "Our", titleHighlight: "Spaces" }, style: { layout: "strip" } },
      { type: "cta", content: { title: "Want to book the clubhouse?", highlight: "Request a Booking", phones: ["9000000000"], buttonLabel: "Book via Helpdesk", buttonHref: "/helpdesk" } },
    ] },
    { slug: "maintenance", title: "Maintenance & Dues", isSystem: true, order: 4, sections: [
      { type: "priceList", content: { eyebrow: "QUARTERLY CHARGES", title: "Maintenance", titleHighlight: "Schedule", note: "Bills are issued quarterly and due by the 10th of the first month. A late fee of 2% per month applies after the due date.", groups: [
        { category: "Maintenance (per quarter)", items: [ { name: "2 BHK (1,150 sq ft)", price: "₹8,050", note: "@ ₹2.33 / sq ft / month" }, { name: "3 BHK (1,550 sq ft)", price: "₹10,850", note: "@ ₹2.33 / sq ft / month" }, { name: "4 BHK (2,100 sq ft)", price: "₹14,700", note: "@ ₹2.33 / sq ft / month" } ] },
        { category: "Other Charges", items: [ { name: "Sinking fund", price: "₹1,000", note: "per quarter" }, { name: "Extra car parking", price: "₹600", note: "per quarter" }, { name: "Move-in / move-out", price: "₹2,500", note: "one-time" } ] },
      ] } },
      { type: "donatePay", content: { eyebrow: "PAY ONLINE", title: "Pay Your", titleHighlight: "Dues", subtitle: "Scan the society UPI QR or pay online. Please mention your flat number (e.g. B-506) in the note.", suggestedAmounts: "8050,10850,14700" }, style: { background: "light" } },
      { type: "stats", content: { items: [ { value: "34%", label: "Security", icon: "shield" }, { value: "22%", label: "Housekeeping", icon: "home" }, { value: "18%", label: "Power & Water", icon: "bolt" }, { value: "26%", label: "AMC, Repairs & Reserve", icon: "wrench" } ] }, style: { background: "primary" } },
      { type: "faq", content: { eyebrow: "BILLING", title: "Maintenance", titleHighlight: "FAQs", items: [
        { q: "Who pays maintenance — owner or tenant?", a: "The owner is responsible. Owners may ask tenants to pay on their behalf, but receipts are always issued in the owner's name." },
        { q: "How do I get a receipt?", a: "Receipts are emailed within 3 working days of payment. You can also collect a printed copy from the society office." },
        { q: "Why is there a sinking fund?", a: "It builds a reserve for major repairs like waterproofing, painting and lift replacement, as required by the bye-laws." },
      ] } },
      { type: "cta", content: { title: "Billing query or wrong amount?", highlight: "Contact the Treasurer", phones: ["9000000000"], buttonLabel: "Raise a Ticket", buttonHref: "/helpdesk" } },
    ] },
    { slug: "events", title: "Events", isSystem: true, order: 5, sections: [
      { type: "countdown", content: { eyebrow: "DON'T MISS", title: "Annual General", titleHighlight: "Body Meeting", subtitle: "Accounts, 2027 budget and committee elections. Every owner's vote counts.", targetDate: "2026-12-14T10:30:00", buttonLabel: "Download Agenda", buttonHref: "/documents" } },
      { type: "eventList", content: { eyebrow: "CALENDAR", title: "Society", titleHighlight: "Events", subtitle: "Upcoming events first, then highlights from past celebrations.", limit: 12, emptyText: "Events published by the committee will appear here.", groupByStatus: true } },
      { type: "gallery", content: { eyebrow: "MEMORIES", title: "Celebrating", titleHighlight: "Together" }, style: { layout: "masonry" } },
      { type: "testimonials", content: { eyebrow: "RESIDENTS SAY", title: "Community", titleHighlight: "Moments", items: [
        { name: "Meenakshi Iyer", role: "C-704 · resident since 2015", text: "The Diwali mela was the first time my mother-in-law met half the neighbours. Now she has a morning walking group of twelve!", rating: 5 },
        { name: "Karan Bhatia", role: "A-1201 · sports sub-committee", text: "The inter-tower cricket league got the teenagers off their phones for a whole month. Next year we are adding badminton.", rating: 5 },
        { name: "Nasreen Shaikh", role: "D-302 · home baker", text: "I sold out at my stall in two hours. The committee keeps stall fees low so home businesses can take part.", rating: 5 },
      ] }, style: { layout: "minimal", background: "light" } },
      { type: "cta", content: { title: "Have an idea for the next event?", highlight: "Volunteer With Us", phones: ["9000000000"], buttonLabel: "Get in Touch", buttonHref: "/contact" } },
    ] },
    { slug: "helpdesk", title: "Helpdesk", isSystem: true, order: 6, sections: [
      { type: "steps", content: { eyebrow: "HOW IT WORKS", title: "Complaint", titleHighlight: "Resolution", items: [
        { title: "Raise", text: "Submit the form with your flat number and issue", icon: "edit" },
        { title: "Assign", text: "Facility manager assigns a technician within 2 hours", icon: "user-check" },
        { title: "Resolve", text: "Most issues are fixed within 48 hours", icon: "wrench" },
        { title: "Close", text: "You confirm and rate the work", icon: "thumbs-up" },
      ] }, style: { background: "light" } },
      { type: "openingHours", content: { eyebrow: "RESPONSE TIMES", title: "When to Expect", titleHighlight: "a Fix", note: "Times are counted from when the ticket is assigned. Emergencies are attended immediately.", days: [
        { day: "Emergency (fire, lift stuck, gas, major leak)", hours: "Immediate — call main gate" }, { day: "Plumbing & electrical", hours: "Within 24 hours" }, { day: "Housekeeping & pest control", hours: "Within 48 hours" }, { day: "Civil & waterproofing", hours: "Inspection within 3 days" },
      ] } },
      { type: "quoteForm", content: { title: "Raise a Complaint or Request", subtitle: "Mention your tower and flat number, the category (plumbing, electrical, lift, security, housekeeping, booking) and a short description.", showSidebar: true } },
      { type: "priceList", content: { eyebrow: "ESCALATION", title: "Not Resolved?", titleHighlight: "Escalate", note: "Escalate only after 48 hours from your original complaint.", groups: [
        { category: "Escalation Matrix", items: [ { name: "Level 1 — Facility Manager", price: "9000000000", note: "after 48 hours" }, { name: "Level 2 — Secretary", price: "hello@example.com", note: "after 4 days" }, { name: "Level 3 — President", price: "hello@example.com", note: "after 7 days" } ] },
      ] } },
      { type: "cta", content: { title: "Emergency — fire, lift stuck, gas leak?", highlight: "Call the Main Gate", phones: ["9000000000"], buttonLabel: "Emergency Contacts", buttonHref: "/contact" } },
    ] },
    { slug: "documents", title: "Rules & Documents", isSystem: true, order: 7, sections: [
      { type: "downloads", content: { eyebrow: "DOWNLOADS", title: "Forms &", titleHighlight: "Documents", items: [
        { title: "Society Bye-laws", description: "Registered bye-laws including amendments up to 2025.", link: "", icon: "book" },
        { title: "AGM 2026 Agenda & Proxy Form", description: "Agenda for 14 December and the proxy authorisation form.", link: "", icon: "calendar" },
        { title: "Audited Accounts FY 2025–26", description: "Balance sheet, income & expenditure and auditor's report.", link: "", icon: "tag" },
        { title: "Move-in / Move-out Form", description: "Required 3 days before shifting; includes lift booking.", link: "", icon: "truck" },
        { title: "Tenant Registration Form", description: "With police verification and rental agreement copy.", link: "", icon: "user-check" },
        { title: "Interior Work NOC", description: "Permission form and rules for renovation work.", link: "", icon: "hammer" },
      ] } },
      { type: "faq", content: { eyebrow: "HOUSE RULES", title: "Key Society", titleHighlight: "Rules", items: [
        { q: "What are the timings for interior or renovation work?", a: "10am to 6pm on weekdays and 10am to 1pm on Saturdays. No drilling or hammering on Sundays and public holidays." },
        { q: "What are the rules for pets?", a: "Pets are welcome. Please leash them in common areas, use the service lift and clean up after them. Register your pet with the office." },
        { q: "How do visitors and deliveries enter?", a: "All visitors are approved through the gate app. Delivery staff may go up only with resident approval; otherwise parcels are left at the gate." },
        { q: "What are the parking rules?", a: "Park only in your allotted slot. Visitor parking is near Gate 2 for up to 12 hours. Unregistered vehicles may be clamped." },
        { q: "Are there quiet hours?", a: "Yes, 10pm to 7am. Loud music and parties in the clubhouse must end by 10:30pm." },
      ] }, style: { background: "light" } },
      { type: "cta", content: { title: "Need a document that isn't listed?", highlight: "Request from Office", phones: ["9000000000"], buttonLabel: "Contact Office", buttonHref: "/contact" } },
    ] },
    { slug: "contact", title: "Contact", isSystem: true, order: 8, sections: [
      { type: "contactInfo", content: { eyebrow: "SOCIETY OFFICE", title: "Get in", titleHighlight: "Touch", address: "Society Office, Clubhouse Ground Floor — add full address in the editor", phone: "9000000000", email: "hello@example.com", hours: "Mon–Sat: 10am–1pm & 5pm–8pm · Sun: 10am–1pm", mapEmbed: "" } },
      { type: "priceList", content: { eyebrow: "EMERGENCY", title: "Emergency", titleHighlight: "Contacts", note: "Available round the clock.", groups: [
        { category: "Society", items: [ { name: "Main Gate Security", price: "9000000000", note: "24×7" }, { name: "Lift Emergency", price: "9000000000", note: "24×7" }, { name: "Electrician / Plumber", price: "9000000000", note: "24×7" } ] },
        { category: "City", items: [ { name: "Police", price: "112", note: "" }, { name: "Ambulance", price: "108", note: "" }, { name: "Fire", price: "101", note: "" } ] },
      ] }, style: { background: "light" } },
      { type: "map", content: { eyebrow: "LOCATION", title: "How to", titleHighlight: "Reach Us", address: "Your City", mapEmbed: "" } },
      { type: "contactForm", content: { title: "Message the Committee", subtitle: "Suggestions, feedback or general queries — for complaints please use the Helpdesk." } },
    ] },
  ],
};
