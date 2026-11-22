import type { TemplateDef } from "./types";
import type { SectionContentMap } from "../config";

// Old Age Home & Senior Care: calm, dignified, homely — soft lavender on cream
// with a serif typeface. Focus on assisted living, nursing, day care and family trust.
export const seniorCare: TemplateDef = {
  theme: {
    colors: { primary: "#7c3aed", primaryDark: "#6d28d9", secondary: "#5b4b6e", accent: "#d4a373", dark: "#2e1f47", light: "#faf6ef", text: "#4a4453", heading: "#2e1f47" },
    font: "Source Serif 4", radius: "0.75rem",
  },
  header: (biz) => ({
    design: "centered",
    logoText: biz, logoImage: "",
    announcement: { show: true, text: "Limited rooms available for the new season — book a family visit this week", link: "/enquiry" },
    topbar: { show: true, address: "Residential Senior Care · Your City", phones: ["9000000000"], email: "hello@example.com", social: { facebook: "#", instagram: "#", whatsapp: "#" } },
    nav: [
      { label: "Home", href: "/" }, { label: "About", href: "/about" }, { label: "Care Services", href: "/care-services" }, { label: "Rooms & Tariff", href: "/rooms" },
      { label: "Life Here", href: "/life-here" }, { label: "Contact", href: "/contact" },
    ],
    cta: { label: "Book a Visit", href: "/enquiry" },
  }),
  footer: (biz) => ({
    design: "classic",
    about: `${biz} is a home for elders who deserve comfort, companionship and round-the-clock care — with the warmth of family and the reassurance of trained nurses.`,
    columns: [
      { title: "Our Home", links: [ { label: "About Us", href: "/about" }, { label: "Life Here", href: "/life-here" }, { label: "Rooms & Tariff", href: "/rooms" }, { label: "Contact", href: "/contact" } ] },
      { title: "Care", links: [ { label: "Assisted Living", href: "/care-services" }, { label: "Nursing Care", href: "/care-services" }, { label: "Day Care", href: "/care-services" }, { label: "Book a Visit", href: "/enquiry" } ] },
    ],
    serviceAreas: ["Assisted Living", "24×7 Nursing", "Dementia Care", "Day Care", "Post-hospital Recovery", "Respite Stays"],
    contact: { phones: ["9000000000"], email: "hello@example.com", address: "Your City" },
    social: { facebook: "#", instagram: "#", whatsapp: "#", location: "#" },
    copyright: `© {year} ${biz}. All rights reserved.`,
  }),
  seo: (biz) => ({
    title: `${biz} — Old Age Home, Assisted Living & Senior Nursing Care`,
    description: "Safe, caring old age home with assisted living, 24×7 nursing, dementia care, day care and short respite stays. Visit our home and meet our care team.",
    favicon: "", ogImage: "",
    keywords: "old age home, senior care, assisted living, elder care, nursing home, dementia care, day care for elderly, retirement home",
    businessType: "NursingHome",
  }),
  services: [
    { category: "Residential Care", title: "Assisted Living", description: "Private and shared rooms with help for bathing, dressing, medicines and mobility.", longDescription: "Residents live independently in a safe, step-free environment while caregivers assist with daily activities as needed." },
    { category: "Residential Care", title: "24×7 Nursing Care", description: "GNM nurses on every floor for bedridden, post-stroke and chronic-care residents." },
    { category: "Residential Care", title: "Memory & Dementia Care", description: "A secure wing with trained staff, routines and therapy for Alzheimer's and dementia." },
    { category: "Residential Care", title: "Respite & Short Stays", description: "Stays from 1 week to 3 months while families travel or recover." },
    { category: "Health & Medical", title: "Doctor Visits & Monitoring", description: "Weekly physician rounds, daily vitals and specialist tie-ups with nearby hospitals." },
    { category: "Health & Medical", title: "Physiotherapy", description: "Daily physio sessions for mobility, balance and post-surgery recovery." },
    { category: "Health & Medical", title: "Post-hospital Recovery", description: "Transitional care after surgery or hospitalisation, with wound care and nursing." },
    { category: "Health & Medical", title: "Diet & Nutrition", description: "Dietician-planned vegetarian meals adapted for diabetes, BP and soft diets." },
    { category: "Day Care & Wellness", title: "Senior Day Care", description: "Weekday care from 9am to 6pm with meals, activities and medical supervision." },
    { category: "Day Care & Wellness", title: "Activities & Companionship", description: "Bhajans, yoga, reading circles, games, outings and festival celebrations." },
  ],
  gallery: [
    "Morning yoga in the garden", "Residents' dining hall", "Private room with attached bath", "Diwali celebrations", "Physiotherapy session", "Evening bhajan sandhya", "Reading corner", "Family visit Sunday",
  ].map((caption) => ({ category: "Life at Home", caption })),
  people: () => [
    { name: "Dr. Shobha Deshpande", role: "Founder & Medical Director", groupName: "leadership", experience: "30 years · Geriatric medicine", bio: "Started the home after caring for her own parents and seeing the need for dignified elder care." },
    { name: "Mr. Venkatesh Pillai", role: "Administrator", groupName: "leadership", experience: "18 years · Healthcare administration", bio: "Looks after residents' families, admissions and day-to-day operations." },
    { name: "Sr. Mary Thomas", role: "Head Nurse", groupName: "core", experience: "22 years · Nursing", bio: "Leads a team of 14 nurses and caregivers across three shifts." },
    { name: "Pooja Saxena", role: "Activities & Wellbeing Coordinator", groupName: "core", experience: "7 years · Occupational therapy", bio: "Plans daily activities, outings and celebrations." },
  ],
  pages: (biz) => [
    {
      slug: "home", title: "Home", isSystem: true, order: 0,
      sections: [
        { type: "hero", content: {
          variant: "centered", customHtml: "",
          badge: "ASSISTED LIVING · NURSING · DAY CARE", titleTop: "A Home Filled With", titleHighlight: "Care, Comfort & Respect",
          subtitle: "", description: `At ${biz}, your parents are looked after the way you would — with trained nurses around the clock, wholesome home-style food and the company of friends.`, image: "",
          primaryBtn: { label: "Book a Family Visit", href: "/enquiry" }, secondaryBtn: { label: "View Rooms & Tariff", href: "/rooms" },
          features: [ { icon: "heart-pulse", title: "24×7 Nursing", text: "" }, { icon: "stethoscope", title: "Weekly Doctor Rounds", text: "" }, { icon: "utensils", title: "Home-style Meals", text: "" }, { icon: "shield", title: "Safe & Step-free", text: "" } ],
        } },
        { type: "stats", content: { items: [ { value: "15+", label: "Years of Care", icon: "award" }, { value: "60", label: "Residents at Home", icon: "home" }, { value: "1 : 4", label: "Caregiver Ratio", icon: "users" }, { value: "24×7", label: "Nursing Support", icon: "heart-pulse" } ] }, style: { layout: "minimal" } },
        { type: "about", content: {
          eyebrow: "OUR HOME", title: "Where Elders Live", titleHighlight: "Their Best Years",
          body: [`${biz} was founded by Dr. Shobha Deshpande, a geriatric physician who believed that growing old should never mean being alone. Our home is designed so elders feel independent, safe and part of a warm community.`, "Sunlit rooms, a quiet garden, a small temple and prayer room, a library and a dining hall where everyone eats together — it feels like home because it is one."],
          image: "", points: ["Ramps, grab-bars and anti-skid floors throughout", "Nurse-call bell in every room", "CCTV in common areas", "Generator and lift backup"],
          buttonLabel: "Learn About Us", buttonHref: "/about",
        }, style: { background: "light" } },
        { type: "features", content: { items: [
          { icon: "heart", title: "Dignity Always", text: "Residents choose their routine, meals and activities — we simply support them." },
          { icon: "stethoscope", title: "Medical Peace of Mind", text: "Ambulance on call and tie-ups with two multi-speciality hospitals within 3 km." },
          { icon: "users", title: "Family Stays Close", text: "Open visiting hours, video calls and a monthly health update for every family." },
          { icon: "utensils", title: "Food Like Home", text: "Dietician-planned vegetarian meals — soft, diabetic and Jain options every day." },
        ] }, style: { align: "center", cardShadow: "none", cardBorderWidth: 1, cardRadius: "sm" } },
        { type: "serviceCategories", content: { eyebrow: "CARE SERVICES", title: "Care That Fits", titleHighlight: "Every Need", categories: ["Residential Care", "Health & Medical", "Day Care & Wellness"] }, style: { layout: "list" } },
        { type: "openingHours", content: { eyebrow: "A GENTLE ROUTINE", title: "A Day at", titleHighlight: biz, note: "Every routine is flexible — residents are welcome to rest, read or join in as they like.", days: [
          { day: "Morning", hours: "6:30 AM yoga · 8:00 AM breakfast & medicines" }, { day: "Late Morning", hours: "Physiotherapy, newspaper reading, garden walk" }, { day: "Afternoon", hours: "1:00 PM lunch · rest · 4:00 PM tea & games" }, { day: "Evening", hours: "6:00 PM bhajan or movie · 8:00 PM dinner" },
        ] }, style: { background: "light" } },
        { type: "testimonials", content: { eyebrow: "FAMILIES SPEAK", title: "Trusted by", titleHighlight: "Families", items: [
          { name: "Arvind Menon", role: "Son of a resident, lives in Dubai", text: "Living abroad, I worried constantly about my mother. The monthly updates and video calls have given me peace — and she has made more friends here than she had in years.", rating: 5 },
          { name: "Kavita Sharma", role: "Daughter of a dementia-care resident", text: "The staff are patient and gentle with Papa even on his difficult days. They know his favourite songs and his morning tea just the way he likes it.", rating: 5 },
          { name: "Mr. R. Subramaniam", role: "Resident, 81", text: "I chose to come here myself after my wife passed. I play carrom every evening and lead the Sunday reading group. I feel useful again.", rating: 5 },
        ] }, style: { layout: "featured" } },
        { type: "pricingPlans", content: {
          eyebrow: "ROOMS", title: "Comfortable", titleHighlight: "Living Spaces",
          plans: [
            { name: "Twin Sharing", price: "₹28,000", period: "/month", features: ["Shared room, attached bath", "All meals & laundry", "Daily vitals & medicine help"], featured: false, buttonLabel: "Enquire", buttonHref: "/enquiry" },
            { name: "Private Room", price: "₹42,000", period: "/month", features: ["Single room with balcony", "All meals & laundry", "Assisted living support", "Priority doctor visits"], featured: true, buttonLabel: "Enquire", buttonHref: "/enquiry" },
            { name: "Nursing Suite", price: "₹55,000", period: "/month", features: ["Hospital bed & oxygen point", "Dedicated nursing care", "Physiotherapy included"], featured: false, buttonLabel: "Enquire", buttonHref: "/enquiry" },
          ],
        }, style: { background: "light", cardRadius: "md", cardShadow: "md" } },
        { type: "team", content: { eyebrow: "OUR CARE TEAM", title: "The People Who", titleHighlight: "Care", members: [
          { name: "Dr. Shobha Deshpande", role: "Founder & Medical Director", image: "", note: "MD, Geriatric Medicine" },
          { name: "Mr. Venkatesh Pillai", role: "Administrator", image: "", note: "Admissions & families" },
          { name: "Sr. Mary Thomas", role: "Head Nurse", image: "", note: "22 years in nursing" },
          { name: "Pooja Saxena", role: "Wellbeing Coordinator", image: "", note: "Occupational therapist" },
        ] }, style: { layout: "list" } },
        { type: "gallery", content: { eyebrow: "MOMENTS", title: "Life at", titleHighlight: "Our Home" }, style: { layout: "masonry", background: "light" } },
        { type: "steps", content: { eyebrow: "ADMISSION PROCESS", title: "A Gentle", titleHighlight: "Transition", items: [
          { title: "Visit", text: "Tour the home, share a meal and meet residents and staff", icon: "home" },
          { title: "Assessment", text: "Medical and care-needs review by our doctor — free of charge", icon: "stethoscope" },
          { title: "Care Plan", text: "A personal plan for diet, medicines, physio and activities", icon: "clipboard" },
          { title: "Settling In", text: "A buddy resident and daily family updates for the first month", icon: "heart" },
        ] }, style: { layout: "timeline" } },
        { type: "faq", content: { eyebrow: "QUESTIONS", title: "Before You", titleHighlight: "Decide", items: [
          { q: "Can we visit before admission?", a: "Of course. We encourage families and the elder to visit, have a meal with residents and meet the nurses. Book a visit any day between 10am and 6pm." },
          { q: "Is there a trial stay?", a: "Yes, a 15-day trial stay is available for assisted living so your parent can settle in before deciding." },
          { q: "Do you accept bedridden or dementia patients?", a: "Yes. Our nursing suites and memory-care wing are equipped for bedridden, post-stroke and dementia residents, after an assessment by our medical director." },
          { q: "What is included in the monthly tariff?", a: "Accommodation, all meals, laundry, housekeeping, daily vitals, medicine management and activities. Medicines, diapers and specialist visits are billed at actuals." },
          { q: "What happens in a medical emergency?", a: "Our nurses provide first response, the ambulance is on call 24×7 and we have tie-ups with nearby hospitals. Families are informed immediately." },
          { q: "We live in another city. How will we stay informed?", a: "You get a monthly health summary on WhatsApp or email, scheduled video calls, and an immediate call from the nurse on duty for anything unusual." },
        ] }, style: { background: "light" } },
        { type: "cta", content: { title: "Come for tea and meet our family", highlight: "Book a Visit", phones: ["9000000000"], buttonLabel: "Schedule a Visit", buttonHref: "/enquiry" }, style: { layout: "split" } },
      ],
    },
    { slug: "about", title: "About Us", isSystem: true, order: 1, sections: [
      { type: "about", content: {
        eyebrow: "OUR STORY", title: "Built Out of", titleHighlight: "Love for Parents",
        body: [`${biz} began in 2010 with eight residents in a renovated family bungalow. Today we are home to sixty elders, cared for by a team of nurses, caregivers, a physiotherapist and visiting doctors.`, "We have kept the bungalow feel — a garden, a shared dining table and no hospital corridors — because comfort and companionship heal as much as medicine does."],
        image: "", points: ["Registered senior care facility", "Trained GNM nurses on all shifts", "Police-verified staff", "Fire safety certified"],
        buttonLabel: "See Our Rooms", buttonHref: "/rooms",
      } },
      { type: "visionMission", content: {
        eyebrow: "WHAT WE BELIEVE",
        visionTitle: "Vision", visionText: "Every elder lives with dignity, purpose and companionship — never alone, never forgotten.",
        missionTitle: "Mission", missionText: "To provide safe, medically supported and joyful living for seniors, while keeping families closely involved in their care.",
        valuesTitle: "Our Values",
        values: [
          { icon: "heart", title: "Respect", text: "We call our residents by name, ask before we help and honour their choices." },
          { icon: "shield", title: "Safety", text: "Trained staff, clear protocols and constant supervision." },
          { icon: "users", title: "Family", text: "Families are partners in care, not visitors." },
        ],
      }, style: { background: "light" } },
      { type: "team", content: { eyebrow: "OUR CARE TEAM", title: "The People Who", titleHighlight: "Care", members: [
        { name: "Dr. Shobha Deshpande", role: "Founder & Medical Director", image: "", note: "MD, Geriatric Medicine" },
        { name: "Mr. Venkatesh Pillai", role: "Administrator", image: "", note: "Admissions & families" },
        { name: "Sr. Mary Thomas", role: "Head Nurse", image: "", note: "22 years in nursing" },
        { name: "Pooja Saxena", role: "Wellbeing Coordinator", image: "", note: "Occupational therapist" },
      ] }, style: { align: "center", cardShadow: "none" } },
      { type: "logos", content: { title: "Medical tie-ups & accreditations", items: ["Multi-speciality Hospital (2 km)", "Cardiac Care Centre (3 km)", "Diagnostic Lab Partner", "24×7 Ambulance Service", "Fire Safety Certified", "Registered with Social Welfare Dept."] }, style: { background: "light" } },
      { type: "cta", content: { title: "We'd be honoured to care for your loved one", highlight: "Talk to Us", phones: ["9000000000"], buttonLabel: "Enquire Now", buttonHref: "/enquiry" } },
    ] },
    { slug: "care-services", title: "Care Services", isSystem: true, order: 2, sections: [
      { type: "serviceCategories", content: { eyebrow: "WHAT WE OFFER", title: "Care for", titleHighlight: "Every Stage", categories: ["Residential Care", "Health & Medical", "Day Care & Wellness"] } },
      { type: "steps", content: { eyebrow: "ADMISSION PROCESS", title: "A Gentle", titleHighlight: "Transition", items: [
        { title: "Visit", text: "Tour the home and meet residents and staff", icon: "home" },
        { title: "Assessment", text: "Medical and care-needs review by our doctor", icon: "stethoscope" },
        { title: "Care Plan", text: "Personal plan for diet, medicines and activities", icon: "clipboard" },
        { title: "Settling In", text: "A buddy resident and daily family updates for the first month", icon: "heart" },
      ] }, style: { background: "light" } },
      { type: "features", content: { items: [
        { icon: "heart-pulse", title: "Daily Vitals", text: "BP, sugar and oxygen recorded every morning." },
        { icon: "package", title: "Medicine Management", text: "Nurses dispense every dose on time and track refills." },
        { icon: "truck", title: "Ambulance on Call", text: "24×7 ambulance with hospital tie-ups within 3 km." },
        { icon: "user-check", title: "Personal Care", text: "Help with bathing, grooming, toileting and mobility." },
      ] }, style: { cardRadius: "sm", cardBorderWidth: 1, cardShadow: "none" } },
      { type: "faq", content: { eyebrow: "CARE QUESTIONS", title: "Choosing the Right", titleHighlight: "Care Level", items: [
        { q: "What is the difference between assisted living and nursing care?", a: "Assisted living is for elders who are mostly independent but need help with medicines, bathing or mobility. Nursing care is for bedridden, post-stroke or chronically ill residents who need skilled nurses through the day." },
        { q: "Can care levels change later?", a: "Yes. Our doctor reviews every resident monthly, and the care plan and room can be changed in consultation with the family." },
        { q: "Do you offer physiotherapy for non-residents?", a: "Yes, day-care members and seniors from the neighbourhood can book physiotherapy sessions on weekdays." },
      ], intro: "Every elder is different. Our doctor offers a free assessment — these answers help you prepare." } as SectionContentMap["faq"], style: { layout: "split", background: "light" } },
      { type: "cta", content: { title: "Not sure which care level is right?", highlight: "Free Care Assessment", phones: ["9000000000"], buttonLabel: "Book Assessment", buttonHref: "/enquiry" } },
    ] },
    { slug: "rooms", title: "Rooms & Tariff", isSystem: true, order: 3, sections: [
      { type: "pricingPlans", content: {
        eyebrow: "ACCOMMODATION", title: "Rooms &", titleHighlight: "Monthly Tariff",
        plans: [
          { name: "Twin Sharing", price: "₹28,000", period: "/month", features: ["Shared room, attached bath", "Wardrobe & bedside table", "All meals & laundry", "Daily vitals & medicine help"], featured: false, buttonLabel: "Enquire", buttonHref: "/enquiry" },
          { name: "Private Room", price: "₹42,000", period: "/month", features: ["Single room with balcony", "TV & personal fridge", "Assisted living support", "Priority doctor visits"], featured: true, buttonLabel: "Enquire", buttonHref: "/enquiry" },
          { name: "Couple Suite", price: "₹65,000", period: "/month", features: ["Large room for two", "Sit-out & garden view", "All meals & housekeeping", "Shared care plan"], featured: false, buttonLabel: "Enquire", buttonHref: "/enquiry" },
          { name: "Nursing Suite", price: "₹55,000", period: "/month", features: ["Hospital bed & oxygen point", "Dedicated nursing care", "Physiotherapy included", "Dementia-safe layout"], featured: false, buttonLabel: "Enquire", buttonHref: "/enquiry" },
        ],
      } },
      { type: "priceList", content: { eyebrow: "OTHER CHARGES", title: "Day Care &", titleHighlight: "Add-ons", note: "Refundable security deposit equal to two months' tariff. Medicines, consumables and specialist visits billed at actuals.", groups: [
        { category: "Day Care", items: [ { name: "Day care (Mon–Fri, 9am–6pm)", price: "₹12,000", note: "per month, incl. lunch & tea" }, { name: "Single day visit", price: "₹750", note: "per day" } ] },
        { category: "Short Stays & Add-ons", items: [ { name: "Respite stay", price: "₹1,800", note: "per day, min. 7 days" }, { name: "Private attendant", price: "₹18,000", note: "per month, 12-hour shift" }, { name: "Hospital escort", price: "₹500", note: "per visit" } ] },
      ] }, style: { background: "light" } },
      { type: "features", content: { items: [
        { icon: "home", title: "Every Room Has", text: "Nurse-call bell, grab-bars, anti-skid floor, geyser and ample sunlight." },
        { icon: "utensils", title: "Meals Included", text: "Breakfast, lunch, evening tea and dinner — Jain and diabetic options available." },
        { icon: "check", title: "No Hidden Costs", text: "A clear monthly bill with medicines and extras itemised." },
      ] }, style: { layout: "minimal", align: "center" } },
      { type: "cta", content: { title: "Check room availability for your parent", highlight: "Enquire Today", phones: ["9000000000"], buttonLabel: "Check Availability", buttonHref: "/enquiry" } },
    ] },
    { slug: "life-here", title: "Life Here", isSystem: true, order: 4, sections: [
      { type: "features", content: { items: [
        { icon: "leaf", title: "Garden & Walking Track", text: "Shaded paths, benches and a small vegetable patch residents tend themselves." },
        { icon: "book-open", title: "Library & Reading Circle", text: "Newspapers in five languages and a weekly book discussion." },
        { icon: "star", title: "Prayer Room", text: "A quiet space for morning prayers, aarti and meditation." },
        { icon: "heart", title: "Celebrations", text: "Birthdays, Diwali, Onam, Christmas and Eid — every festival is celebrated together." },
      ] }, style: { cardRadius: "sm", cardShadow: "sm" } },
      { type: "gallery", content: { eyebrow: "MOMENTS", title: "Life at", titleHighlight: "Our Home" }, style: { layout: "strip" } },
      { type: "features", content: { items: [
        { icon: "heart-pulse", title: "Monday · Chair Yoga", text: "Gentle stretches and breathing in the garden, led by our physiotherapist." },
        { icon: "book-open", title: "Wednesday · Reading Circle", text: "Residents take turns reading stories, poetry and the week's news." },
        { icon: "star", title: "Friday · Bhajan Sandhya", text: "Evening devotional songs with harmonium and tabla — families welcome." },
        { icon: "users", title: "Sunday · Family Lunch", text: "A special meal where families join residents at the long table." },
      ] }, style: { layout: "numbered", background: "light" } },
      { type: "countdown", content: { eyebrow: "COMING UP", title: "Grandparents'", titleHighlight: "Day Celebration", subtitle: "Songs, a talent show by residents and lunch with grandchildren. All families are invited.", targetDate: "2026-12-20T11:00:00", buttonLabel: "RSVP for Your Family", buttonHref: "/enquiry" } },
      { type: "testimonials", content: { eyebrow: "IN THEIR WORDS", title: "Residents", titleHighlight: "Share", items: [
        { name: "Mrs. Saroj Gupta", role: "Resident, 76", text: "I teach the younger residents knitting and they teach me to use WhatsApp. Every day has something to look forward to.", rating: 5 },
        { name: "Col. (Retd.) H. S. Bedi", role: "Resident, 84", text: "Discipline, good food and good company — this place runs like a well-kept mess, and I mean that as a compliment.", rating: 5 },
      ] } },
      { type: "cta", content: { title: "Join us for Sunday lunch with residents", highlight: "Visit Us", phones: ["9000000000"], buttonLabel: "Book a Visit", buttonHref: "/enquiry" } },
    ] },
    { slug: "enquiry", title: "Book a Visit", isSystem: true, order: 5, sections: [
      { type: "features", content: { items: [
        { icon: "calendar", title: "Visit Any Day", text: "10am – 6pm, including Sundays." },
        { icon: "utensils", title: "Stay for a Meal", text: "Taste our food with the residents." },
        { icon: "stethoscope", title: "Free Care Assessment", text: "Our doctor will review your parent's needs." },
      ] }, style: { align: "center", background: "light" } },
      { type: "appointmentForm", content: { title: "Book a Family Visit or Enquiry", subtitle: "Share your parent's age, health needs and preferred room type. Our administrator will call you within a few hours." } },
      { type: "faq", content: { eyebrow: "ADMISSIONS", title: "Admission", titleHighlight: "Questions", items: [
        { q: "What documents are needed?", a: "ID proof, recent medical reports, a doctor's prescription list and contact details of two family members." },
        { q: "How soon can admission happen?", a: "Usually within 2–3 days of the assessment, subject to room availability." },
        { q: "Can my parent bring their own furniture?", a: "Yes, small personal items, photos and a favourite chair are welcome — it helps them feel at home." },
      ] } },
      { type: "cta", content: { title: "Prefer to talk right away?", highlight: "Call Us", phones: ["9000000000"], buttonLabel: "Contact Us", buttonHref: "/contact" } },
    ] },
    { slug: "contact", title: "Contact", isSystem: true, order: 6, sections: [
      { type: "contactInfo", content: { eyebrow: "REACH US", title: "We're Here", titleHighlight: "for You", address: "Add street, landmark and PIN in the editor", phone: "9000000000", email: "hello@example.com", hours: "Visiting: 10am – 6pm daily · Care: 24×7", mapEmbed: "" } },
      { type: "map", content: { eyebrow: "LOCATION", title: "Find", titleHighlight: "Our Home", address: "Your City", mapEmbed: "" } },
      { type: "contactForm", content: { title: "Write to Us", subtitle: "Admissions, family queries or volunteering — we respond within a day." } },
    ] },
  ],
};
