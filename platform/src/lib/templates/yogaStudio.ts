import type { TemplateDef } from "./types";

// Yoga & Meditation Studio (hatha, vinyasa, prenatal, meditation, retreats,
// teacher training): calm, earthy sage + sand, airy minimal layout.
export const yogaStudio: TemplateDef = {
  theme: {
    colors: { primary: "#65a30d", primaryDark: "#4d7c0f", secondary: "#57534e", accent: "#c2a878", dark: "#1f2a1c", light: "#f6f3ea", text: "#57534e", heading: "#292524" },
    font: "Mulish", radius: "1.5rem",
  },
  header: (biz) => ({
    design: "centered",
    logoText: biz, logoImage: "",
    announcement: { show: true, text: "New here? Your first class is free — breathe, move and see how it feels", link: "/book-class" },
    topbar: { show: false, address: "Your City", phones: ["9000000000"], email: "hello@example.com", social: { facebook: "#", instagram: "#", whatsapp: "#" } },
    nav: [
      { label: "Home", href: "/" }, { label: "About", href: "/about" }, { label: "Classes", href: "/classes" }, { label: "Schedule", href: "/schedule" },
      { label: "Memberships", href: "/memberships" }, { label: "Retreats", href: "/retreats" }, { label: "Teacher Training", href: "/teacher-training" }, { label: "Contact", href: "/contact" },
    ],
    cta: { label: "Book a Class", href: "/book-class" },
  }),
  footer: (biz) => ({
    design: "minimal",
    about: `${biz} is a quiet space for yoga, breathwork and meditation — small batches, experienced teachers and a practice that meets you where you are.`,
    columns: [
      { title: "Practice", links: [ { label: "Classes", href: "/classes" }, { label: "Weekly Schedule", href: "/schedule" }, { label: "Memberships", href: "/memberships" }, { label: "Book a Class", href: "/book-class" } ] },
      { title: "Go Deeper", links: [ { label: "Retreats", href: "/retreats" }, { label: "Teacher Training", href: "/teacher-training" }, { label: "Our Story", href: "/about" }, { label: "Contact", href: "/contact" } ] },
    ],
    serviceAreas: ["Hatha Yoga", "Vinyasa Flow", "Prenatal Yoga", "Meditation", "Online Classes", "Yoga Retreats"],
    contact: { phones: ["9000000000"], email: "hello@example.com", address: "Your City" },
    social: { facebook: "#", instagram: "#", whatsapp: "#", location: "#" },
    copyright: `© {year} ${biz}. Breathe in, slow down.`,
  }),
  seo: (biz) => ({
    title: `${biz} — Yoga, Meditation & Teacher Training in Your City`,
    description: "Hatha, vinyasa, prenatal yoga and guided meditation in small batches, plus live online classes, weekend retreats and 200-hour teacher training. First class free.",
    favicon: "", ogImage: "",
    keywords: "yoga classes near me, hatha yoga, vinyasa yoga, prenatal yoga, meditation classes, online yoga, yoga teacher training, yoga retreat",
    businessType: "SportsActivityLocation", priceRange: "₹₹",
  }),
  services: [
    { category: "Studio Classes", title: "Hatha Yoga", description: "Slow, alignment-focused postures with breath awareness — ideal for beginners." },
    { category: "Studio Classes", title: "Vinyasa Flow", description: "Breath-linked, flowing sequences that build strength, heat and focus." },
    { category: "Studio Classes", title: "Yin & Restorative", description: "Long, supported holds that release deep tension and calm the nervous system." },
    { category: "Studio Classes", title: "Prenatal Yoga", description: "Gentle, doctor-friendly practice for every trimester, led by a certified prenatal teacher." },
    { category: "Mind & Breath", title: "Guided Meditation", description: "Simple sitting practices to settle a busy mind — no experience needed." },
    { category: "Mind & Breath", title: "Pranayama & Breathwork", description: "Classical breathing techniques for energy, sleep and stress relief." },
    { category: "Mind & Breath", title: "Yoga Nidra", description: "A deeply restful guided relaxation, practised lying down." },
    { category: "Beyond the Studio", title: "Live Online Classes", description: "Join from home over Zoom with real-time cues from your teacher." },
    { category: "Beyond the Studio", title: "Weekend Retreats", description: "Two to five days of practice, silence and sattvic food in nature." },
    { category: "Beyond the Studio", title: "200-Hour Teacher Training", description: "Yoga Alliance–aligned course in asana, philosophy, anatomy and teaching." },
    { category: "Beyond the Studio", title: "Corporate Wellness", description: "Desk-friendly yoga and mindfulness sessions for teams, on-site or online." },
  ],
  gallery: [
    "Morning hatha class", "Sunlit studio floor", "Meditation corner", "Prenatal batch", "Vinyasa flow", "Riverside retreat", "Teacher training graduates", "Props & mats",
  ].map((caption) => ({ category: "Our Studio", caption })),
  pages: (biz) => [
    {
      slug: "home", title: "Home", isSystem: true, order: 0,
      sections: [
        { type: "hero", content: {
          variant: "minimal", customHtml: "",
          badge: "SMALL BATCHES · CERTIFIED TEACHERS · FIRST CLASS FREE", titleTop: "Slow Down.", titleHighlight: "Breathe. Begin.",
          subtitle: "", description: `${biz} is a calm, unhurried studio for hatha, vinyasa, prenatal yoga and meditation. Come as you are — stiff, busy or brand new — and leave a little lighter.`, image: "",
          primaryBtn: { label: "Book Your Free Class", href: "/book-class" }, secondaryBtn: { label: "See the Schedule", href: "/schedule" },
          features: [ { icon: "leaf", title: "Max 12 per batch", text: "" }, { icon: "award", title: "500-hr teachers", text: "" }, { icon: "heart", title: "Beginner friendly", text: "" } ],
        } },
        { type: "about", content: {
          eyebrow: "WELCOME", title: "A Practice That", titleHighlight: "Meets You Where You Are",
          body: [`At ${biz}, yoga is not about touching your toes. It is about noticing your breath, softening what is tight and building strength that lasts into old age.`, "Our classes stay small so every student gets hands-on guidance, props when needed and a teacher who remembers their story."],
          image: "", points: ["Mats, blocks & bolsters provided", "Morning, evening & weekend batches", "Live online option", "Quiet, naturally lit studio", "No joining fee"],
          buttonLabel: "Our Story", buttonHref: "/about",
        }, style: { layout: "centered" } },
        { type: "features", content: { items: [
          { icon: "leaf", title: "Better Sleep", text: "Restorative poses and yoga nidra help the body switch off at night." },
          { icon: "heart-pulse", title: "Less Stress", text: "Pranayama trains the breath — and the breath calms the mind." },
          { icon: "shield", title: "Healthier Back", text: "Mindful strength and mobility for long hours at a desk or behind the wheel." },
          { icon: "star", title: "Steady Focus", text: "Ten minutes of sitting a day builds attention that carries into work and exams." },
        ] }, style: { layout: "minimal" } },
        { type: "steps", content: { eyebrow: "YOUR FIRST MONTH", title: "Gentle Steps,", titleHighlight: "Lasting Habit", items: [
          { title: "Week 1 · Free Trial Class", text: "Meet your teacher, share any injuries, try a beginner hatha batch", icon: "heart" },
          { title: "Week 2 · Foundations", text: "Breath, sun salutations and safe alignment with props", icon: "leaf" },
          { title: "Week 3 · Find Your Style", text: "Try vinyasa, yin or meditation and see what your body enjoys", icon: "star" },
          { title: "Week 4 · Home Practice", text: "Take home a 15-minute sequence written just for you", icon: "book-open" },
        ] }, style: { layout: "timeline", background: "light" } },
        { type: "serviceCategories", content: { eyebrow: "WAYS TO PRACTISE", title: "Find Your", titleHighlight: "Practice", categories: ["Studio Classes", "Mind & Breath", "Beyond the Studio"] }, style: { layout: "list" } },
        { type: "imageBanner", content: { title: "Weekend Silent Retreat by the River", subtitle: "Three days of practice, sattvic meals and digital detox near Rishikesh — limited to 20 seats.", buttonLabel: "Explore Retreats", buttonHref: "/retreats", image: "" } },
        { type: "priceList", content: { eyebrow: "THIS WEEK", title: "Popular", titleHighlight: "Batches", note: "All batches are 60 minutes unless mentioned. Studio + live online. Full timetable on the schedule page.", groups: [
          { category: "Mornings", items: [ { name: "Sunrise Hatha", price: "6:30 AM", note: "Mon – Sat" }, { name: "Vinyasa Flow", price: "8:00 AM", note: "Mon · Wed · Fri" }, { name: "Prenatal Yoga", price: "10:30 AM", note: "Tue · Thu · Sat" } ] },
          { category: "Evenings", items: [ { name: "Desk Relief Yoga", price: "6:00 PM", note: "Mon – Fri · Online" }, { name: "Yin & Restorative", price: "7:00 PM", note: "Tue · Thu" }, { name: "Guided Meditation", price: "8:15 PM", note: "Daily · 30 min" } ] },
        ] }, style: { background: "light", cardRadius: "lg" } },
        { type: "testimonials", content: { eyebrow: "KIND WORDS", title: "From Our", titleHighlight: "Students", items: [
          { name: "Ritika Sen", role: "Student · 2 years", text: "I came for my back pain and stayed for the calm. The evening hatha batch is the best hour of my day.", rating: 5 },
          { name: "Siddharth Joshi", role: "IT professional", text: "Meditation with Swamiji has genuinely changed how I handle work stress. Simple, practical, no jargon.", rating: 5 },
          { name: "Ananya Gupta", role: "Prenatal student", text: "Dr. Kavya made me feel safe through all three trimesters. I felt strong and prepared for delivery.", rating: 5 },
        ] }, style: { layout: "minimal" } },
        { type: "team", content: { eyebrow: "TEACHERS", title: "Guided by", titleHighlight: "Experience", members: [
          { name: "Meera Krishnan", role: "Founder · Hatha & Philosophy", image: "", note: "500-hr senior teacher · 15 yrs" },
          { name: "Arjun Nair", role: "Vinyasa & Yin", image: "", note: "500-hr teacher · 9 yrs" },
          { name: "Dr. Kavya Rao", role: "Prenatal & Postnatal", image: "", note: "Prenatal certified · Physiotherapist" },
          { name: "Swami Prakash", role: "Meditation & Pranayama", image: "", note: "Ashram-trained · 20 yrs of sadhana" },
        ] }, style: { background: "light", align: "center", cardRadius: "full", cardShadow: "none" } },
        { type: "countdown", content: { eyebrow: "NEXT RETREAT", title: "Riverside Silent", titleHighlight: "Retreat", subtitle: "3 days · 2 nights · sattvic meals, twin-sharing cottages and daily hatha, pranayama and guided silence. ₹14,500 per person, all inclusive.", targetDate: "2027-01-22T07:00", buttonLabel: "Reserve a Seat", buttonHref: "/retreats" }, style: { background: "dark" } },
        { type: "pricingPlans", content: {
          eyebrow: "MEMBERSHIPS", title: "Practise", titleHighlight: "Your Way",
          plans: [
            { name: "Class Pack", price: "₹2,400", period: "/8 classes", features: ["Any studio class", "Valid for 6 weeks", "Mats & props included"], featured: false, buttonLabel: "Get Started", buttonHref: "/book-class" },
            { name: "Unlimited Monthly", price: "₹3,999", period: "/month", features: ["Unlimited studio + online classes", "1 private alignment session", "Workshop discounts", "Pause once per quarter"], featured: true, buttonLabel: "Join Now", buttonHref: "/book-class" },
            { name: "Online Only", price: "₹1,799", period: "/month", features: ["All live Zoom classes", "Recordings for 48 hours", "Monthly meditation circle"], featured: false, buttonLabel: "Join Online", buttonHref: "/book-class" },
          ],
        }, style: { cardRadius: "lg", cardShadow: "sm" } },
        { type: "faq", content: { eyebrow: "FAQ", title: "Before Your", titleHighlight: "First Class", items: [
          { q: "I'm not flexible at all. Can I still join?", a: "Yes — that is exactly why people start. Our beginner hatha classes use props and variations so every body can practise comfortably." },
          { q: "What should I bring?", a: "Just comfortable clothes and a water bottle. Mats, blocks, straps and bolsters are provided and cleaned after every class." },
          { q: "Should I eat before class?", a: "Practise on a light stomach — ideally 2–3 hours after a meal. A fruit or a few nuts an hour before is fine." },
          { q: "Is prenatal yoga safe?", a: "Our prenatal classes are designed for each trimester by a certified teacher. We ask that you get a go-ahead from your doctor before joining." },
          { q: "Do online classes count towards my membership?", a: "Unlimited Monthly members can join any studio or live online class. Online-only plans are also available." },
          { q: "Can senior citizens join?", a: "Yes. Our gentle hatha and chair-yoga variations are popular with students in their 60s and 70s, and seniors get 15% off monthly plans." },
        ] }, style: { background: "light" } },
        { type: "cta", content: { title: "Your mat is waiting", highlight: "First Class Free", phones: ["9000000000"], buttonLabel: "Book a Class", buttonHref: "/book-class" }, style: { layout: "minimal" } },
      ],
    },
    { slug: "about", title: "Our Story", isSystem: true, order: 1, sections: [
      { type: "about", content: {
        eyebrow: "OUR STORY", title: "Rooted in Tradition,", titleHighlight: "Taught for Today",
        body: [`${biz} began as a small morning batch on a terrace with six students. Years later we still teach the same way — slowly, personally and with respect for the classical roots of yoga.`, "We blend traditional hatha and pranayama with modern anatomy, so practice feels both meaningful and safe for busy, modern bodies."],
        image: "", points: ["Classical lineage, modern alignment", "Teachers with 9–15 years of practice", "Small, unhurried batches", "A community, not a gym"],
        buttonLabel: "Meet Us in Class", buttonHref: "/book-class",
      } },
      { type: "visionMission", content: {
        eyebrow: "WHAT WE BELIEVE",
        visionTitle: "Our Vision", visionText: "A city where everyone has ten quiet minutes a day to breathe, stretch and come back to themselves.",
        missionTitle: "Our Mission", missionText: "To teach honest, accessible yoga and meditation in small groups — with patience, safety and warmth.",
        valuesTitle: "Our Values",
        values: [ { icon: "leaf", title: "Simplicity", text: "No gimmicks, just steady practice." }, { icon: "heart", title: "Compassion", text: "Every body, every age, every pace." }, { icon: "book-open", title: "Tradition", text: "Respect for yoga's roots and texts." } ],
      }, style: { background: "light" } },
      { type: "stats", content: { items: [ { value: "12+", label: "Years of Teaching", icon: "star" }, { value: "4,000+", label: "Students Guided", icon: "users" }, { value: "350+", label: "Teachers Certified", icon: "graduation" }, { value: "4.9★", label: "Google Rating", icon: "thumbs-up" } ] }, style: { background: "dark" } },
      { type: "team", content: { eyebrow: "TEACHERS", title: "The People Who", titleHighlight: "Hold the Space", members: [
        { name: "Meera Krishnan", role: "Founder · Hatha & Philosophy", image: "", note: "E-RYT 500 · 15 yrs" },
        { name: "Arjun Nair", role: "Vinyasa & Yin", image: "", note: "RYT 500 · 9 yrs" },
        { name: "Dr. Kavya Rao", role: "Prenatal & Postnatal", image: "", note: "RPYT · Physiotherapist" },
        { name: "Swami Prakash", role: "Meditation & Pranayama", image: "", note: "Ashram-trained · 20 yrs of sadhana" },
        { name: "Tanvi Deshpande", role: "Online Classes Lead", image: "", note: "RYT 200 · 6 yrs" },
        { name: "Rahul Menon", role: "Kids & Teens Yoga", image: "", note: "RCYT · 5 yrs" },
      ] }, style: { align: "center", cardRadius: "full", cardShadow: "none" } },
      { type: "cta", content: { title: "Come and feel the space", highlight: "Your First Class Is Free", phones: ["9000000000"], buttonLabel: "Book a Class", buttonHref: "/book-class" } },
    ] },
    { slug: "classes", title: "Classes", isSystem: true, order: 2, sections: [
      { type: "serviceCategories", content: { eyebrow: "CLASSES", title: "Every Style,", titleHighlight: "One Calm Space", categories: ["Studio Classes", "Mind & Breath", "Beyond the Studio"] } },
      { type: "steps", content: { eyebrow: "LEVELS", title: "Grow at", titleHighlight: "Your Pace", items: [
        { title: "Foundation", text: "Breath, basic postures and alignment", icon: "leaf" },
        { title: "Flow", text: "Linking movement with breath", icon: "heart-pulse" },
        { title: "Deepen", text: "Inversions, longer holds, pranayama", icon: "star" },
        { title: "Sit", text: "Meditation as a daily habit", icon: "heart" },
      ] }, style: { background: "light" } },
      { type: "testimonials", content: { eyebrow: "FROM THE MAT", title: "Students on", titleHighlight: "Our Classes", items: [
        { name: "Meera S.", role: "Hatha · 8 months", text: "I came for back pain and stayed for the calm. The teachers adjust every pose to your level.", rating: 5 },
        { name: "Rohit K.", role: "Vinyasa Flow", text: "Challenging but never intimidating. Small batches mean you actually get attention.", rating: 5 },
        { name: "Anjali P.", role: "Prenatal Yoga", text: "Gentle, safe and so reassuring through my pregnancy.", rating: 5 },
      ] } },
      { type: "cta", content: { title: "Not sure where to start?", highlight: "Try a Beginner Hatha Class", phones: ["9000000000"], buttonLabel: "Book a Class", buttonHref: "/book-class" }, style: { background: "dark" } },
    ] },
    { slug: "schedule", title: "Schedule", isSystem: true, order: 3, sections: [
      { type: "priceList", content: { eyebrow: "WEEKLY TIMETABLE", title: "Find a Class That", titleHighlight: "Fits Your Day", note: "All classes are 60 minutes unless mentioned. Please arrive 10 minutes early and keep phones on silent. Online classes run live on Zoom.", groups: [
          { category: "Morning", items: [ { name: "Sunrise Hatha", price: "6:30 AM", note: "Mon – Sat · Studio + Online" }, { name: "Vinyasa Flow", price: "8:00 AM", note: "Mon · Wed · Fri" }, { name: "Prenatal Yoga", price: "10:30 AM", note: "Tue · Thu · Sat" } ] },
          { category: "Evening", items: [ { name: "Desk Relief Yoga", price: "6:00 PM", note: "Mon – Fri · Online" }, { name: "Yin & Restorative", price: "7:00 PM", note: "Tue · Thu" }, { name: "Guided Meditation", price: "8:15 PM", note: "Daily · 30 min" } ] },
          { category: "Weekend", items: [ { name: "Pranayama Workshop", price: "7:30 AM", note: "Sunday · 90 min" }, { name: "Yoga Nidra", price: "6:00 PM", note: "Saturday · 45 min" } ] },
        ] }, style: { cardRadius: "lg" } },
      { type: "openingHours", content: { eyebrow: "STUDIO HOURS", title: "When We're", titleHighlight: "Open", note: "The studio stays closed on major festivals; online classes continue unless announced.", days: [
        { day: "Monday – Friday", hours: "6:00 AM – 9:00 PM" }, { day: "Saturday", hours: "6:30 AM – 7:00 PM" }, { day: "Sunday", hours: "7:00 AM – 11:00 AM" },
      ] }, style: { background: "light" } },
      { type: "cta", content: { title: "Spotted a class you like?", highlight: "Reserve Your Mat", phones: ["9000000000"], buttonLabel: "Book a Class", buttonHref: "/book-class" } },
    ] },
    { slug: "memberships", title: "Memberships", isSystem: true, order: 4, sections: [
      { type: "pricingPlans", content: {
        eyebrow: "MEMBERSHIPS", title: "Simple Plans for a", titleHighlight: "Steady Practice",
        plans: [
          { name: "Drop-In", price: "₹450", period: "/class", features: ["Any single studio class", "Mats & props included", "Pay at the studio or online"], featured: false, buttonLabel: "Book a Class", buttonHref: "/book-class" },
          { name: "Unlimited Monthly", price: "₹3,999", period: "/month", features: ["Unlimited studio + online classes", "1 private alignment session", "10% off workshops & retreats", "Pause once per quarter"], featured: true, buttonLabel: "Join Now", buttonHref: "/book-class" },
          { name: "Annual Sadhana", price: "₹36,000", period: "/year", features: ["Everything in Unlimited", "4 private sessions", "1 weekend retreat seat at 50% off", "Bring a friend free monthly"], featured: false, buttonLabel: "Join Now", buttonHref: "/book-class" },
        ],
      }, style: { cardRadius: "lg", cardShadow: "md" } },
      { type: "priceList", content: { eyebrow: "PRIVATE & SPECIAL", title: "One-on-One &", titleHighlight: "Add-ons", note: "Prices include GST. Student and senior-citizen discounts of 15% on monthly plans.", groups: [
        { category: "Private Sessions", items: [ { name: "Private yoga session", price: "₹1,500", note: "60 min · studio or home" }, { name: "Pack of 8 private sessions", price: "₹10,800", note: "valid 2 months" }, { name: "Couple / duo session", price: "₹2,200", note: "60 min" } ] },
        { category: "Programs", items: [ { name: "Prenatal 8-week series", price: "₹5,600", note: "2 classes a week" }, { name: "21-day meditation course", price: "₹2,100", note: "online, daily 30 min" }, { name: "Corporate session", price: "On request", note: "on-site or Zoom" } ] },
      ] }, style: { background: "light" } },
      { type: "faq", content: { eyebrow: "GOOD TO KNOW", title: "Membership", titleHighlight: "Questions", items: [
        { q: "Can I freeze my membership?", a: "Monthly members can pause once a quarter for up to 15 days; annual members can pause for up to 45 days in total." },
        { q: "Is there a joining fee?", a: "No joining fee, ever. Your first class is free so you can feel the studio before deciding." },
        { q: "Can I share my class pack?", a: "Class packs are personal, but Annual Sadhana members can bring a friend free once a month." },
      ] } },
      { type: "cta", content: { title: "Start with one free class", highlight: "Decide Later", phones: ["9000000000"], buttonLabel: "Book a Class", buttonHref: "/book-class" }, style: { background: "primary" } },
    ] },
    { slug: "retreats", title: "Retreats", isSystem: true, order: 5, sections: [
      { type: "banner", content: { title: "Retreats &", titleHighlight: "Workshops", subtitle: "Step away from the noise — practice, silence and simple food in nature.", image: "", bgColor: "", imageOpacity: 60, overlayOpacity: 45 } },
      { type: "countdown", content: { eyebrow: "NEXT RETREAT", title: "Riverside Silent", titleHighlight: "Retreat", subtitle: "3 days · 2 nights · sattvic meals, twin-sharing cottages, daily hatha, pranayama and guided silence. ₹14,500 per person, all inclusive.", targetDate: "2027-01-22T07:00", buttonLabel: "Reserve a Seat", buttonHref: "/book-class" }, style: { background: "dark" } },
      { type: "steps", content: { eyebrow: "A DAY ON RETREAT", title: "Gentle", titleHighlight: "Rhythm", items: [
        { title: "6 AM · Sunrise Practice", text: "Pranayama and hatha by the river", icon: "leaf" },
        { title: "9 AM · Sattvic Brunch", text: "Fresh, light, home-style meals", icon: "utensils" },
        { title: "4 PM · Nature Walk", text: "Mindful walking and journaling", icon: "map-pin" },
        { title: "7 PM · Yoga Nidra", text: "Deep rest and early nights", icon: "heart" },
      ] } },
      { type: "gallery", content: { eyebrow: "PAST RETREATS", title: "Moments of", titleHighlight: "Stillness" }, style: { background: "light" } },
      { type: "faq", content: { ...{ intro: "Travel, experience level and refunds — the practical bits before you step away from the noise." }, eyebrow: "RETREAT FAQ", title: "Before You", titleHighlight: "Pack", items: [
        { q: "Do I need prior yoga experience?", a: "No. Every session offers beginner variations, and silence periods are gentle — you can always talk to a teacher." },
        { q: "How do we get there?", a: "We arrange shared cabs from Dehradun airport and Haridwar railway station at ₹900 per seat." },
        { q: "What is the cancellation policy?", a: "Full refund up to 21 days before; 50% up to 7 days before; after that your seat can be moved to the next retreat." },
      ] }, style: { layout: "split", background: "light" } },
      { type: "cta", content: { title: "Seats fill quickly", highlight: "Reserve Your Retreat Spot", phones: ["9000000000"], buttonLabel: "Enquire Now", buttonHref: "/book-class" } },
    ] },
    { slug: "teacher-training", title: "Teacher Training", isSystem: true, order: 6, sections: [
      { type: "about", content: {
        eyebrow: "200-HOUR TTC", title: "Become a", titleHighlight: "Certified Yoga Teacher",
        body: ["Our 200-hour teacher training is a deep, practical immersion in asana, pranayama, anatomy, philosophy and the art of teaching — taught by senior teachers with decades of combined practice.", "Choose a 4-week intensive or a 12-week weekend format. Graduates receive a 200-hour certificate recognised by international yoga registries."],
        image: "", points: ["Internationally recognised 200-hr syllabus", "Intensive or weekend format", "Teaching practicum with real students", "Lifelong alumni mentoring"],
        buttonLabel: "Apply Now", buttonHref: "/book-class",
      } },
      { type: "features", content: { items: [
        { icon: "book-open", title: "Philosophy & Texts", text: "Yoga Sutras, Bhagavad Gita and Hatha Yoga Pradipika in plain language." },
        { icon: "heart-pulse", title: "Anatomy & Safety", text: "Functional anatomy, injuries and modifications taught by a physiotherapist." },
        { icon: "users", title: "Teaching Methodology", text: "Sequencing, cueing, hands-on adjustments and holding a room." },
        { icon: "leaf", title: "Personal Sadhana", text: "Daily practice, kriyas and meditation to deepen your own journey." },
      ] }, style: { background: "light", cardRadius: "lg", cardShadow: "none" } },
      { type: "pricingPlans", content: {
        eyebrow: "BATCHES & FEES", title: "Choose Your", titleHighlight: "Format",
        plans: [
          { name: "4-Week Intensive", price: "₹65,000", period: "/course", features: ["Mon–Sat, 6 AM – 5 PM", "Meals included", "Course manual & certificate"], featured: false, buttonLabel: "Apply Now", buttonHref: "/book-class" },
          { name: "12-Week Weekend", price: "₹58,000", period: "/course", features: ["Sat & Sun, 7 AM – 4 PM", "Ideal for working professionals", "Course manual & certificate", "EMI available"], featured: true, buttonLabel: "Apply Now", buttonHref: "/book-class" },
        ],
      } },
      { type: "testimonials", content: { eyebrow: "ALUMNI", title: "Teachers We've", titleHighlight: "Trained", items: [
        { name: "Priya Venkatesh", role: "TTC 2024 · now teaches in Pune", text: "The anatomy module alone was worth it. I left confident enough to start my own morning batch within two months.", rating: 5 },
        { name: "Nikhil Bansal", role: "TTC 2023 · corporate trainer", text: "The weekend format let me keep my job. The teachers are patient, deeply knowledgeable and genuinely kind.", rating: 5 },
      ] }, style: { background: "dark" } },
      { type: "cta", content: { title: "Next batch starts in February", highlight: "Limited to 18 Students", phones: ["9000000000"], buttonLabel: "Apply Now", buttonHref: "/book-class" } },
    ] },
    { slug: "book-class", title: "Book a Class", isSystem: true, order: 7, sections: [
      { type: "appointmentForm", content: { title: "Book Your Class", subtitle: "Pick a class, date and time. Your first class is free — we'll confirm your mat on WhatsApp within a few hours." } },
      { type: "steps", content: { eyebrow: "YOUR FIRST VISIT", title: "What to", titleHighlight: "Expect", items: [
        { title: "Arrive 10 Min Early", text: "A quick chat about your health and goals", icon: "clock" },
        { title: "Settle In", text: "Mats and props are ready for you", icon: "leaf" },
        { title: "Practise", text: "Your teacher offers easier and deeper options", icon: "heart" },
        { title: "Rest", text: "Every class ends in savasana", icon: "star" },
      ] }, style: { background: "light" } },
      { type: "faq", content: { eyebrow: "QUICK ANSWERS", title: "Booking", titleHighlight: "Help", items: [
        { q: "Can I cancel or reschedule?", a: "Yes, up to 4 hours before class on WhatsApp or by phone, at no charge." },
        { q: "Are online classes bookable here too?", a: "Yes — choose the online option and we will send you the Zoom link before class." },
        { q: "Can I book a retreat or teacher training here?", a: "Yes. Mention the retreat or course in your message and our team will call you with details." },
      ] } },
    ] },
    { slug: "contact", title: "Contact", isSystem: true, order: 8, sections: [
      { type: "contactInfo", content: { eyebrow: "SAY NAMASTE", title: "Visit the", titleHighlight: "Studio", address: "Your City", phone: "9000000000", email: "hello@example.com", hours: "Mon–Fri 6 AM – 9 PM · Sat 6:30 AM – 7 PM · Sun 7 – 11 AM", mapEmbed: "" } },
      { type: "map", content: { eyebrow: "", title: "Find", titleHighlight: "Us", address: "Your City", mapEmbed: "" }, style: { spacingTop: "none" } },
      { type: "contactForm", content: { title: "Send Us a Message", subtitle: "Questions about classes, private sessions, retreats or teacher training? We reply within a day." }, style: { background: "light" } },
    ] },
  ],
};
