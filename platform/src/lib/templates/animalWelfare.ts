import type { TemplateDef } from "./types";
import type { SectionContentMap } from "../config";

// Animal Welfare & Shelter: energetic and hopeful — burnt orange + deep forest,
// built around rescue, adoption, ABC (sterilisation) drives, feeding and sponsor-a-pet.
export const animalWelfare: TemplateDef = {
  theme: {
    colors: { primary: "#ea580c", primaryDark: "#c2410c", secondary: "#14532d", accent: "#facc15", dark: "#1c1917", light: "#fff7ed", text: "#44403c", heading: "#1c1917" },
    font: "Nunito", radius: "1.5rem",
  },
  header: (biz) => ({
    design: "classic",
    logoText: biz, logoImage: "",
    announcement: { show: true, text: "Found an injured animal? Call our 24×7 rescue helpline: 9000000000", link: "/rescue" },
    topbar: { show: true, address: "Shelter & Clinic · Your City", phones: ["9000000000"], email: "hello@example.com", social: { facebook: "#", instagram: "#", whatsapp: "#" } },
    nav: [
      { label: "Home", href: "/" }, { label: "About", href: "/about" }, { label: "Adopt", href: "/adopt" }, { label: "Our Work", href: "/our-work" },
      { label: "Rescue", href: "/rescue" }, { label: "Events", href: "/events" }, { label: "Volunteer", href: "/volunteer" }, { label: "Contact", href: "/contact" },
    ],
    cta: { label: "Sponsor a Pet", href: "/donate" },
  }),
  footer: (biz) => ({
    design: "centered",
    about: `${biz} rescues, treats, sterilises and rehomes street animals. Every dog, cat and calf that comes through our gates leaves healthier — and many leave with a family.`,
    columns: [
      { title: "Shelter", links: [ { label: "About Us", href: "/about" }, { label: "Adopt a Pet", href: "/adopt" }, { label: "Our Work", href: "/our-work" }, { label: "Events & Drives", href: "/events" } ] },
      { title: "Help Animals", links: [ { label: "Report a Rescue", href: "/rescue" }, { label: "Sponsor a Pet", href: "/donate" }, { label: "Volunteer", href: "/volunteer" }, { label: "Contact", href: "/contact" } ] },
    ],
    serviceAreas: ["24×7 Rescue", "Adoption", "Sterilisation (ABC)", "Anti-rabies Vaccination", "Street Feeding", "Foster Care"],
    contact: { phones: ["9000000000"], email: "hello@example.com", address: "Your City" },
    social: { facebook: "#", instagram: "#", whatsapp: "#", location: "#" },
    copyright: `© {year} ${biz}. Registered animal welfare trust. Donations eligible under Section 80G.`,
  }),
  seo: (biz) => ({
    title: `${biz} — Animal Rescue, Shelter & Pet Adoption`,
    description: "24×7 street animal rescue, free sterilisation and vaccination drives, feeding programs and pet adoption. Adopt, foster, volunteer or sponsor a pet with 80G benefit.",
    favicon: "", ogImage: "",
    keywords: "animal shelter, dog rescue, adopt a dog, adopt a cat, stray animal sterilisation, anti-rabies vaccination, animal NGO, sponsor a pet, 80G",
    businessType: "AnimalShelter",
  }),
  services: [
    { category: "Rescue & Care", title: "24×7 Emergency Rescue", description: "Ambulance pick-up for injured, sick or trapped street animals across the city.", longDescription: "Our rescue van and trained handlers respond to accident, injury and trapped-animal calls round the clock, with first aid on the spot." },
    { category: "Rescue & Care", title: "Shelter Clinic & Surgery", description: "In-house vet, OT and recovery kennels for fractures, wounds and infections." },
    { category: "Rescue & Care", title: "Senior & Disabled Sanctuary", description: "Lifelong care for animals who are blind, paralysed or too old to be rehomed." },
    { category: "Community Programs", title: "Sterilisation (ABC) Drives", description: "Free Animal Birth Control surgeries for community dogs and cats, as per ABC Rules 2023." },
    { category: "Community Programs", title: "Anti-rabies Vaccination", description: "Ward-wise vaccination camps that protect animals and the people around them." },
    { category: "Community Programs", title: "Street Feeding Program", description: "Daily meals for 600+ community dogs through trained neighbourhood feeders." },
    { category: "Community Programs", title: "School Kindness Workshops", description: "Fun sessions teaching children safe, compassionate behaviour around animals." },
    { category: "Adoption & Fostering", title: "Pet Adoption", description: "Vaccinated, sterilised dogs and cats matched carefully to loving homes." },
    { category: "Adoption & Fostering", title: "Foster Care Network", description: "Short-term homes for puppies, kittens and recovering animals." },
    { category: "Adoption & Fostering", title: "Sponsor-a-Pet", description: "Cover food, medicine and care for a resident animal from ₹750 a month." },
  ],
  gallery: [
    "Rescue van on a night call", "Puppy after recovery", "Sterilisation camp in progress", "Volunteers at feeding time", "Adoption day smiles", "Vaccination drive", "Senior dogs in the sanctuary", "Kittens in foster care",
  ].map((caption) => ({ category: "Shelter Life", caption })),
  people: () => [
    { name: "Ananya Rao", role: "Founder & Managing Trustee", groupName: "leadership", experience: "14 years · Animal rescue", bio: "Started feeding street dogs in college and built the shelter from a single rented shed." },
    { name: "Dr. Karthik Iyer", role: "Chief Veterinarian", groupName: "leadership", experience: "12 years · Small-animal surgery", bio: "Leads the clinic, surgical team and every ABC drive." },
    { name: "Imran Qureshi", role: "Rescue Operations Lead", groupName: "core", experience: "8 years · Field rescue", bio: "Runs the 24×7 helpline and rescue ambulance crew." },
    { name: "Neha Joshi", role: "Adoption & Foster Coordinator", groupName: "core", experience: "6 years · Rehoming", bio: "Screens families and follows up on every adoption for a year." },
  ],
  events: (biz) => [
    {
      title: "Free Sterilisation & Vaccination Camp", slug: "abc-vaccination-camp", activityName: "ABC & Anti-rabies Drive",
      date: "2026-12-07", location: "Ward 12 Community Ground, Your City", status: "upcoming", organizedBy: biz,
      enableDonate: true, donateAmount: 1500, showQr: true, qrCaption: "₹1,500 sponsors one sterilisation surgery",
      shortDescription: "Target: 80 community dogs sterilised and 200 vaccinated against rabies in a single weekend.",
      programDescription: "Feeders and residents bring community dogs; our vet team operates on-site, ear-notches, vaccinates and returns each dog to its territory after recovery.",
      impact: "Fewer unwanted litters, fewer rabies cases and calmer streets for residents and animals alike.",
      objectives: ["Sterilise 80 dogs", "Vaccinate 200 dogs", "Register local feeders", "Educate residents on ABC Rules"],
    },
    {
      title: "Adoption Mela — Find Your Best Friend", slug: "adoption-mela", activityName: "Weekend Adoption Drive",
      date: "2026-12-20", location: "City Park, Gate 2, Your City", status: "upcoming", organizedBy: biz,
      shortDescription: "Meet 40+ vaccinated, sterilised puppies, dogs and cats looking for forever homes.",
      programDescription: "Families can meet animals, talk to our counsellors and complete adoption paperwork on the spot after a home-readiness check.",
      objectives: ["Rehome 25 animals", "Counsel first-time pet parents", "Promote Indie breed adoption"],
    },
    {
      title: "Monsoon Feeding & First-aid Drive", slug: "monsoon-feeding-drive", activityName: "Street Feeding Program",
      date: "2026-08-10", location: "Old City Market Area", status: "completed", organizedBy: biz,
      shortDescription: "Volunteers fed 900 street animals and treated 60 for wounds and skin infections.",
      impact: "Animals stayed fed through heavy rain when markets and food sources shut down.",
      objectives: ["Feed 900 animals", "Treat maggot wounds", "Distribute tick medicine"],
    },
  ],
  pages: (biz) => [
    {
      slug: "home", title: "Home", isSystem: true, order: 0,
      sections: [
        { type: "hero", content: {
          variant: "marquee", customHtml: "",
          badge: "24×7 RESCUE · ADOPTION · 80G CERTIFIED", titleTop: "Every Paw Deserves", titleHighlight: "a Second Chance",
          subtitle: "", description: `${biz} rescues injured street animals, heals them in our shelter clinic and finds them loving homes. Adopt, foster, volunteer or sponsor — every bit of kindness counts.`, image: "",
          primaryBtn: { label: "Adopt a Pet", href: "/adopt" }, secondaryBtn: { label: "Report a Rescue", href: "/rescue" },
          features: [ { icon: "heart-pulse", title: "24×7 Rescue", text: "" }, { icon: "stethoscope", title: "In-house Vet", text: "" }, { icon: "home", title: "Adopt Don't Shop", text: "" }, { icon: "badge-check", title: "80G Receipts", text: "" } ],
        } },
        { type: "features", content: { items: [
          { icon: "phone", title: "Report a Rescue", text: "Injured, sick or trapped animal? Our ambulance responds 24×7." },
          { icon: "home", title: "Adopt a Pet", text: "Vaccinated, sterilised Indies and cats waiting for a family." },
          { icon: "heart", title: "Foster for a Few Weeks", text: "Give a recovering puppy or kitten a quiet corner at home." },
          { icon: "gift", title: "Sponsor a Resident", text: "₹750 a month covers food, meds and bedding for one animal." },
        ] }, style: { layout: "minimal" } },
        { type: "stats", content: { items: [ { value: "12,000+", label: "Animals Rescued", icon: "heart-pulse" }, { value: "18,500+", label: "Sterilisations Done", icon: "stethoscope" }, { value: "2,300+", label: "Happy Adoptions", icon: "home" }, { value: "600", label: "Dogs Fed Daily", icon: "utensils" } ] }, style: { layout: "cards", background: "primary" } },
        { type: "about", content: {
          eyebrow: "OUR STORY", title: "From One Injured Puppy to", titleHighlight: "a City-wide Shelter",
          body: [`${biz} began in 2012 when a group of students rushed a road-accident puppy to a vet and couldn't find anyone to care for her afterwards. That puppy, Laddoo, still lives at our sanctuary.`, "Today we run a 24×7 rescue ambulance, a full veterinary clinic, recovery kennels and a sanctuary for animals who can never be rehomed — powered by volunteers and donors like you."],
          image: "", points: ["Registered trust with 12A & 80G", "Recognised by the Animal Welfare Board of India", "Full-time vet and surgical team", "Every rupee accounted for"],
          buttonLabel: "Meet the Team", buttonHref: "/about",
        }, style: { layout: "centered", background: "light" } },
        { type: "serviceCategories", content: { eyebrow: "WHAT WE DO", title: "Rescue, Heal,", titleHighlight: "Rehome", categories: ["Rescue & Care", "Community Programs", "Adoption & Fostering"] }, style: { layout: "tiles", cardRadius: "lg" } },
        { type: "gallery", content: { eyebrow: "LOOKING FOR HOMES", title: "Waiting to", titleHighlight: "Meet You" }, style: { layout: "strip" } },
        { type: "steps", content: { eyebrow: "ADOPTION JOURNEY", title: "Bringing Home", titleHighlight: "Your New Friend", items: [
          { title: "Meet", text: "Browse our animals or visit the shelter on a weekend", icon: "heart" },
          { title: "Apply", text: "Fill a short form and speak to our counsellor", icon: "clipboard" },
          { title: "Home Check", text: "A quick visit to make sure your space is pet-safe", icon: "home" },
          { title: "Welcome Home", text: "Take them home with vaccination card and starter kit", icon: "gift" },
        ] }, style: { layout: "cards", background: "light" } },
        { type: "testimonials", content: { eyebrow: "HAPPY TAILS", title: "Stories From", titleHighlight: "Forever Homes", items: [
          { name: "Sneha & Rohit Kapoor", role: "Adopted Simba, an Indie pup", text: "Simba was found in a drain with a broken leg. Today he's the boss of our house. The team followed up for months after adoption — that's how much they care.", rating: 5 },
          { name: "Farhan Ali", role: "Colony feeder", text: "They sterilised and vaccinated all 14 dogs in our lane in one weekend. No more litters dying on the road, and residents are far less scared.", rating: 5 },
          { name: "Lakshmi Narayanan", role: "Monthly sponsor", text: "I sponsor a blind senior dog named Kaalu. The monthly photos make my day — I know exactly where my money goes.", rating: 5 },
          { name: "Tanvi Deshmukh", role: "Foster parent, 11 kittens so far", text: "Fostering sounded scary, but the team gave me food, meds and a vet on call. Watching tiny kittens grow up and go to families is pure joy.", rating: 5 },
        ] }, style: { layout: "dark" } },
        { type: "countdown", content: { eyebrow: "NEXT BIG DRIVE", title: "Adoption", titleHighlight: "Mela", subtitle: "40+ vaccinated and sterilised puppies, dogs and cats ready to meet their families at City Park, Gate 2.", targetDate: "2026-12-20T11:00:00", buttonLabel: "Apply to Adopt", buttonHref: "/adopt" } },
        { type: "eventList", content: { eyebrow: "DRIVES & CAMPS", title: "Upcoming", titleHighlight: "Drives", subtitle: "Sterilisation camps, vaccination drives and adoption melas near you.", limit: 3, emptyText: "New drives will appear here once announced." }, style: { background: "light" } },
        { type: "priceList", content: { eyebrow: "WHERE MONEY GOES", title: "What Your Gift", titleHighlight: "Buys", note: "Indicative costs at our shelter. Every donation receives an 80G receipt.", groups: [
          { category: "Medical", items: [ { name: "Anti-rabies vaccination", price: "₹350", note: "per animal" }, { name: "Sterilisation surgery", price: "₹1,500", note: "incl. 3-day recovery" }, { name: "Fracture surgery", price: "₹6,000", note: "plates & aftercare" } ] },
          { category: "Daily Care", items: [ { name: "Feed 10 street dogs", price: "₹200", note: "per day" }, { name: "Monthly care of one resident", price: "₹750", note: "food, meds, bedding" }, { name: "Rescue ambulance fuel", price: "₹2,500", note: "per week" } ] },
        ] } },
        { type: "donatePay", content: { eyebrow: "GIVE IN SECONDS", title: "Scan, Tap,", titleHighlight: "Save a Life", subtitle: "Pay by UPI or card. Add your PAN in the note for an 80G receipt.", suggestedAmounts: "350,750,1500,5000" }, style: { background: "light" } },
        { type: "faq", content: { eyebrow: "GOOD TO KNOW", title: "Questions", titleHighlight: "We Get Often", items: [
          { q: "What should I do if I find an injured animal?", a: "Keep a safe distance, give water if possible and call our 24×7 helpline at 9000000000 or use the Rescue page. Share the exact location and a photo on WhatsApp." },
          { q: "Is there an adoption fee?", a: "Adoption is free. We only request a voluntary contribution towards vaccination and sterilisation, which every animal receives before going home." },
          { q: "Do you take in pets people can no longer keep?", a: "Our shelter space is reserved for injured and sick street animals, but we help owners rehome pets through our adoption network." },
          { q: "Are donations tax-deductible?", a: "Yes. We are registered under Section 12A and 80G, so you receive a 50% tax deduction receipt for every donation." },
          { q: "My society wants the street dogs removed. What does the law say?", a: "Under the ABC Rules 2023, community dogs cannot be relocated. They are sterilised, vaccinated and returned to their area. We can help your RWA plan a drive and designate feeding spots." },
          { q: "Can my company volunteer with you?", a: "Yes — we host corporate volunteering days for kennel cleaning, feeding drives and adoption events. Write to hello@example.com." },
        ], intro: "Rescue, adoption, ABC drives and donations — the questions families, feeders and RWAs ask us most." } as SectionContentMap["faq"], style: { layout: "split" } },
        { type: "cta", content: { title: "Can't adopt? You can still save a life", highlight: "Donate or Foster", phones: ["9000000000"], buttonLabel: "Donate Now", buttonHref: "/donate" } },
      ],
    },
    { slug: "about", title: "About Us", isSystem: true, order: 1, sections: [
      { type: "visionMission", content: {
        eyebrow: "WHY WE EXIST",
        visionTitle: "Our Vision", visionText: "A city where no animal suffers on the street — where every dog, cat and cow is fed, vaccinated and treated with kindness.",
        missionTitle: "Our Mission", missionText: "Rescue and treat animals in distress, control street populations humanely through ABC, and build a community of responsible adopters and feeders.",
        valuesTitle: "What Guides Us",
        values: [
          { icon: "heart", title: "Compassion First", text: "Every life matters, whether it can be rehomed or not." },
          { icon: "shield", title: "Humane & Legal", text: "We follow ABC Rules 2023 and the Prevention of Cruelty to Animals Act." },
          { icon: "users", title: "Community Powered", text: "Feeders, residents and volunteers are our real strength." },
        ],
      } },
      { type: "team", content: { eyebrow: "OUR PEOPLE", title: "Hands That", titleHighlight: "Heal", members: [
        { name: "Ananya Rao", role: "Founder & Managing Trustee", image: "", note: "14 yrs in animal rescue" },
        { name: "Dr. Karthik Iyer", role: "Chief Veterinarian", image: "", note: "BVSc & AH, MVSc Surgery" },
        { name: "Imran Qureshi", role: "Rescue Operations Lead", image: "", note: "24×7 helpline" },
        { name: "Neha Joshi", role: "Adoption Coordinator", image: "", note: "2,000+ rehomings" },
      ] }, style: { layout: "list", background: "light", cardRadius: "lg" } },
      { type: "stats", content: { items: [ { value: "2012", label: "Founded", icon: "star" }, { value: "38", label: "Staff & Caregivers", icon: "users" }, { value: "450+", label: "Active Volunteers", icon: "heart" }, { value: "140", label: "Sanctuary Residents", icon: "home" } ] }, style: { layout: "band" } },
      { type: "logos", content: { title: "Recognised & supported by", items: ["Animal Welfare Board of India", "Municipal Corporation", "State Veterinary Dept.", "Resident Welfare Associations", "CSR Partners", "Veterinary College Interns"] } },
      { type: "cta", content: { title: "Visit the shelter this weekend", highlight: "Meet the Residents", phones: ["9000000000"], buttonLabel: "Plan a Visit", buttonHref: "/contact" } },
    ] },
    { slug: "adopt", title: "Adopt a Pet", isSystem: true, order: 2, sections: [
      { type: "features", content: { items: [
        { icon: "badge-check", title: "Vaccinated", text: "Every animal gets anti-rabies and core vaccines before adoption." },
        { icon: "stethoscope", title: "Sterilised & Checked", text: "Neutered, dewormed and health-checked by our vet." },
        { icon: "heart", title: "Indie Love", text: "Indian breeds are hardy, smart and perfectly suited to our climate." },
        { icon: "headset", title: "Lifetime Support", text: "Call us anytime for behaviour or health advice after adoption." },
      ] }, style: { cardRadius: "lg", cardShadow: "md" } },
      { type: "steps", content: { eyebrow: "HOW IT WORKS", title: "Four Steps to", titleHighlight: "Adoption", items: [
        { title: "Choose", text: "Visit on Sat/Sun 11am–4pm or ask for photos on WhatsApp", icon: "heart" },
        { title: "Counselling", text: "A 20-minute chat about lifestyle, space and family", icon: "users" },
        { title: "Home Visit", text: "We check balconies, gates and safety", icon: "home" },
        { title: "Adopt", text: "Sign the adoption agreement and take your pet home", icon: "check" },
      ] }, style: { background: "light" } },
      { type: "gallery", content: { eyebrow: "LOOKING FOR HOMES", title: "Waiting for", titleHighlight: "You" }, style: { layout: "masonry" } },
      { type: "quoteForm", content: { title: "Adoption Application", subtitle: "Tell us about your home, family and the kind of companion you're looking for. Our adoption counsellor will call within 48 hours.", showSidebar: true } },
      { type: "cta", content: { title: "Not ready to adopt? Foster for a few weeks", highlight: "Become a Foster Parent", phones: ["9000000000"], buttonLabel: "Volunteer to Foster", buttonHref: "/volunteer" } },
    ] },
    { slug: "our-work", title: "Our Work", isSystem: true, order: 3, sections: [
      { type: "serviceCategories", content: { eyebrow: "PROGRAMS", title: "How We Help", titleHighlight: "Animals", categories: ["Rescue & Care", "Community Programs", "Adoption & Fostering"] } },
      { type: "stats", content: { items: [ { value: "35", label: "Rescues a Week", icon: "truck" }, { value: "90%", label: "Recovery Rate", icon: "heart-pulse" }, { value: "42", label: "Wards Covered", icon: "map-pin" }, { value: "140", label: "Sanctuary Residents", icon: "home" } ] }, style: { background: "dark" } },
      { type: "priceList", content: { eyebrow: "WHERE MONEY GOES", title: "What Your Gift", titleHighlight: "Buys", note: "Indicative costs at our shelter. All donations receive an 80G receipt.", groups: [
        { category: "Medical", items: [ { name: "Anti-rabies vaccination", price: "₹350", note: "per animal" }, { name: "Sterilisation surgery", price: "₹1,500", note: "incl. 3-day recovery" }, { name: "Fracture surgery", price: "₹6,000", note: "plates & aftercare" } ] },
        { category: "Daily Care", items: [ { name: "Feed 10 street dogs", price: "₹200", note: "per day" }, { name: "Monthly care of one resident", price: "₹750", note: "food, meds, bedding" }, { name: "Rescue ambulance fuel", price: "₹2,500", note: "per week" } ] },
      ] }, style: { background: "light" } },
      { type: "steps", content: { eyebrow: "HOW ABC WORKS", title: "Catch, Neuter,", titleHighlight: "Vaccinate, Return", items: [
        { title: "Catch", text: "Feeders help our handlers gently pick up community dogs", icon: "heart" },
        { title: "Neuter", text: "Sterilisation surgery by our vet under anaesthesia", icon: "stethoscope" },
        { title: "Vaccinate & Recover", text: "Anti-rabies shot, ear-notch and 3 days of post-op care", icon: "shield" },
        { title: "Return", text: "Released back to the same street, as the ABC Rules require", icon: "map-pin" },
      ] }, style: { layout: "timeline" } },
      { type: "testimonials", content: { eyebrow: "PARTNERS", title: "Neighbourhoods", titleHighlight: "We Work With", items: [
        { name: "Secretary, Green Park RWA", role: "Resident Welfare Association", text: "After the ABC drive the dog population in our colony stabilised and bite complaints stopped. The team also helped us set up two feeding points.", rating: 5 },
        { name: "Dr. Sameer Khan", role: "Visiting veterinary surgeon", text: "The clinic runs like a small hospital — clean OT, clear records and caring kennel staff. I am glad to volunteer here every month.", rating: 5 },
      ] }, style: { layout: "featured", background: "light" } },
      { type: "cta", content: { title: "Fund the next sterilisation camp", highlight: "Give ₹1,500", phones: ["9000000000"], buttonLabel: "Donate Now", buttonHref: "/donate" } },
    ] },
    { slug: "rescue", title: "Report a Rescue", isSystem: true, order: 4, sections: [
      { type: "features", content: { items: [
        { icon: "phone", title: "Call First", text: "Call 9000000000 — our helpline runs 24×7, all 365 days." },
        { icon: "map-pin", title: "Share Location", text: "Send a live location and landmark on WhatsApp." },
        { icon: "shield", title: "Stay Safe", text: "Don't handle bleeding or aggressive animals; keep people and traffic away." },
        { icon: "droplet", title: "Give Water", text: "Offer water and shade while the ambulance reaches you." },
      ] }, style: { background: "primary", cardRadius: "lg" } },
      { type: "openingHours", content: { eyebrow: "WHEN TO REACH US", title: "Helpline &", titleHighlight: "Shelter Hours", note: "Emergency rescues are attended 24×7. Non-emergency calls are returned during clinic hours.", days: [
        { day: "Emergency Rescue", hours: "24×7" }, { day: "Clinic (Mon – Sat)", hours: "9:00 AM – 7:00 PM" }, { day: "Adoption Visits (Sat – Sun)", hours: "11:00 AM – 4:00 PM" }, { day: "Sunday Clinic", hours: "Emergencies only" },
      ] } },
      { type: "contactForm", content: { title: "Report an Animal in Distress", subtitle: "Describe the animal, injury and exact location. For bleeding, accidents or trapped animals please call the helpline instead of waiting." } },
      { type: "cta", content: { title: "Every rescue costs ₹1,200 on average", highlight: "Fund a Rescue", phones: ["9000000000"], buttonLabel: "Donate", buttonHref: "/donate" } },
    ] },
    { slug: "events", title: "Drives & Events", isSystem: true, order: 5, sections: [
      { type: "countdown", content: { eyebrow: "NEXT BIG DRIVE", title: "Adoption", titleHighlight: "Mela", subtitle: "40+ vaccinated and sterilised dogs and cats ready to meet their families.", targetDate: "2026-12-20T11:00:00", buttonLabel: "Apply to Adopt", buttonHref: "/adopt" } },
      { type: "eventList", content: { eyebrow: "CALENDAR", title: "Camps &", titleHighlight: "Drives", subtitle: "Upcoming camps first, then reports from completed drives.", limit: 12, emptyText: "Drives you publish in Admin → Events will appear here.", groupByStatus: true } },
      { type: "gallery", content: { eyebrow: "FROM THE FIELD", title: "Shelter", titleHighlight: "Moments" } },
      { type: "cta", content: { title: "Want to help at the next camp?", highlight: "Join as Volunteer", phones: ["9000000000"], buttonLabel: "Volunteer", buttonHref: "/volunteer" } },
    ] },
    { slug: "volunteer", title: "Volunteer & Foster", isSystem: true, order: 6, sections: [
      { type: "features", content: { items: [
        { icon: "utensils", title: "Feeding Rounds", text: "Join morning or evening feeding routes in your area." },
        { icon: "home", title: "Foster at Home", text: "Care for puppies, kittens or recovering animals for 2–6 weeks." },
        { icon: "heart", title: "Shelter Care", text: "Walk, groom and socialise dogs at the shelter on weekends." },
        { icon: "edit", title: "Skills from Home", text: "Photography, social media, design and fundraising." },
      ] }, style: { cardRadius: "lg", cardShadow: "sm" } },
      { type: "volunteerForm", content: { title: "Become a Volunteer", subtitle: "Minimum age 16 (with parent consent). Tell us when you're free and how you'd like to help.", interests: ["Rescue Support", "Feeding Rounds", "Foster Care", "Shelter Care", "Adoption Events", "Vaccination Camps", "Photography & Social Media", "Fundraising"] } },
      { type: "faq", content: { eyebrow: "BEFORE YOU JOIN", title: "Volunteer", titleHighlight: "FAQs", items: [
        { q: "Do I need experience with animals?", a: "No. Every new volunteer attends a 2-hour orientation on handling, hygiene and safety before their first shift." },
        { q: "How much time do I need to give?", a: "As little as one weekend shift a month. Feeding rounds take about an hour, morning or evening." },
        { q: "Is fostering expensive?", a: "No. We provide food, medicines and vet visits for every foster animal — you provide the love and a safe corner." },
      ], intro: "New to animal care? Here is what to expect before your first shift or foster." } as SectionContentMap["faq"], style: { layout: "split", background: "light" } },
      { type: "cta", content: { title: "Bring your team for a CSR volunteering day", highlight: "Corporate Volunteering", phones: ["9000000000"], buttonLabel: "Talk to Us", buttonHref: "/contact" } },
    ] },
    { slug: "donate", title: "Donate", isSystem: true, order: 7, sections: [
      { type: "pricingPlans", content: {
        eyebrow: "SPONSOR A PET", title: "Choose How", titleHighlight: "You Help",
        plans: [
          { name: "Feed a Street", price: "₹500", period: "one-time", features: ["Meals for 25 dogs for a day", "80G tax receipt", "Thank-you photo"], featured: false, buttonLabel: "Give ₹500", buttonHref: "/contact" },
          { name: "Sponsor a Pet", price: "₹750", period: "/month", features: ["Food, medicine & bedding", "Monthly photo update", "Visit your sponsored pet", "80G tax receipt"], featured: true, buttonLabel: "Sponsor Now", buttonHref: "/contact" },
          { name: "Sterilise & Vaccinate", price: "₹1,850", period: "one-time", features: ["One ABC surgery + rabies shot", "3-day post-op care", "80G tax receipt"], featured: false, buttonLabel: "Give ₹1,850", buttonHref: "/contact" },
          { name: "Rescue Hero", price: "₹10,000", period: "one-time", features: ["Fuel & meds for a week of rescues", "Name on our Wall of Kindness", "80G tax receipt"], featured: false, buttonLabel: "Be a Hero", buttonHref: "/contact" },
        ],
      } },
      { type: "donatePay", content: { eyebrow: "PAY INSTANTLY", title: "UPI, QR or", titleHighlight: "Card", subtitle: "Scan the QR or pay online. Add your PAN in the note for an 80G receipt.", suggestedAmounts: "500,750,1850,5000" }, style: { background: "light" } },
      { type: "features", content: { items: [
        { icon: "package", title: "Donate Supplies", text: "Dog food, rice, old bedsheets, newspapers and medicines are always welcome." },
        { icon: "truck", title: "Sponsor the Ambulance", text: "Help us add a second rescue van for the city outskirts." },
        { icon: "gift", title: "Celebrate with Them", text: "Mark a birthday or memorial with a feeding day at the shelter." },
      ] } },
      { type: "cta", content: { title: "Questions about 80G receipts or CSR?", highlight: "Talk to Us", phones: ["9000000000"], buttonLabel: "Contact Us", buttonHref: "/contact" } },
    ] },
    { slug: "contact", title: "Contact", isSystem: true, order: 8, sections: [
      { type: "contactInfo", content: { eyebrow: "REACH US", title: "Visit the", titleHighlight: "Shelter", address: "Shelter & Clinic — add street, landmark and PIN in the editor", phone: "9000000000", email: "hello@example.com", hours: "Clinic: Mon–Sat 9am–7pm · Rescue: 24×7", mapEmbed: "" } },
      { type: "map", content: { eyebrow: "DIRECTIONS", title: "Find", titleHighlight: "Us", address: "Your City", mapEmbed: "" } },
      { type: "contactForm", content: { title: "Send Us a Message", subtitle: "Adoption, volunteering, donations or a shelter visit — we reply within a day." } },
    ] },
  ],
};
