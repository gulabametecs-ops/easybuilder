import type { TemplateDef } from "./types";

// Play School / Preschool (ages 1.5–6): bright, playful, rounded, parent-focused.
export const playSchool: TemplateDef = {
  theme: {
    colors: { primary: "#ff7a3d", primaryDark: "#ea5f1f", secondary: "#6d28d9", accent: "#ec4899", dark: "#2e1065", light: "#fff7ed", text: "#4b5563", heading: "#2e1065" },
    font: "Nunito", radius: "1.5rem",
  },
  header: (biz) => ({
    design: "centered",
    logoText: biz, logoImage: "",
    announcement: { show: true, text: "🎈 Admissions open for Playgroup, Nursery, LKG & UKG — only a few seats left in each group!", link: "/admission" },
    topbar: { show: true, address: "Play-based preschool · Ages 1.5 to 6", phones: ["9000000000"], email: "hello@example.com", social: { facebook: "#", instagram: "#", whatsapp: "#" } },
    nav: [
      { label: "Home", href: "/" }, { label: "Programs", href: "/programs" }, { label: "Facilities", href: "/facilities" }, { label: "Gallery", href: "/gallery" }, { label: "Notices", href: "/notices" }, { label: "Fees", href: "/fees" }, { label: "Contact", href: "/contact" },
    ],
    cta: { label: "Book a Visit", href: "/admission" },
  }),
  footer: (biz) => ({
    design: "centered",
    about: "A safe, warm and joyful preschool where little ones learn through play, make their first friends and grow in confidence every single day.",
    columns: [
      { title: "Quick Links", links: [ { label: "Home", href: "/" }, { label: "About Us", href: "/about" }, { label: "Programs", href: "/programs" }, { label: "Facilities", href: "/facilities" }, { label: "Gallery", href: "/gallery" }, { label: "Book a Visit", href: "/admission" } ] },
      { title: "Programs", links: [ { label: "Toddler Group", href: "/programs" }, { label: "Playgroup", href: "/programs" }, { label: "Nursery", href: "/programs" }, { label: "LKG & UKG", href: "/programs" }, { label: "Day Care", href: "/programs" } ] },
    ],
    serviceAreas: ["Toddler", "Playgroup", "Nursery", "LKG", "UKG", "Day Care"],
    contact: { phones: ["9000000000"], email: "hello@example.com", address: "Your City" },
    social: { facebook: "#", instagram: "#", whatsapp: "#", location: "#" },
    copyright: `© {year} ${biz}. Nurturing happy little learners.`,
  }),
  seo: (biz) => ({ title: `${biz} — Play School, Preschool & Day Care`, description: "A safe, CCTV-secured preschool where children aged 1.5–6 learn through play with caring, trained teachers. Playgroup, Nursery, LKG, UKG & day care. Book a free visit today!", favicon: "", ogImage: "" }),
  services: [
    { category: "Our Programs", title: "Toddler Group (1.5–2.5 yrs)", description: "Short, gentle sessions with a parent-friendly settling-in period — a soft first step away from home." },
    { category: "Our Programs", title: "Playgroup (2–3 yrs)", description: "Sensory play, rhymes and circle time that build language, social skills and independence." },
    { category: "Our Programs", title: "Nursery (3–4 yrs)", description: "Phonics, number sense, colours and shapes through hands-on activities and stories." },
    { category: "Our Programs", title: "LKG (4–5 yrs)", description: "Early reading, writing and maths readiness with lots of play, art and movement." },
    { category: "Our Programs", title: "UKG (5–6 yrs)", description: "A confident, school-ready child — reading simple words, writing neatly and thinking independently." },
    { category: "Our Programs", title: "Day Care (till 6:30 pm)", description: "Safe after-school care with a healthy meal, nap time and supervised play for working parents." },
    { category: "Fun Activities", title: "Art & Craft", description: "Finger painting, clay and collage that build fine motor skills and imagination." },
    { category: "Fun Activities", title: "Music & Rhymes", description: "Action songs and rhythm games that build memory, vocabulary and joy." },
    { category: "Fun Activities", title: "Dance & Movement", description: "Yoga, freestyle and group games for balance, coordination and energy." },
    { category: "Fun Activities", title: "Story Time & Puppetry", description: "Picture books and puppet shows that spark listening skills and a love for reading." },
  ],
  gallery: [...["Bright, colourful classrooms", "Soft-floor play area", "Sensory activity corner", "Cosy nap room", "Garden & sandpit play", "Annual day performance", "Festival celebrations", "Art & craft time"].map((c) => ({ category: "Our Playschool", caption: c }))],
  pages: (biz) => [
    {
      slug: "home", title: "Home", isSystem: true, order: 0,
      sections: [
        { type: "hero", content: {
          variant: "gradient", customHtml: "",
          badge: "AGES 1.5 – 6 · ADMISSIONS OPEN", titleTop: "A Happy Place to", titleHighlight: "Learn, Play & Grow",
          subtitle: "", description: `At ${biz}, your child spends the day with caring, trained teachers in a safe, CCTV-secured campus — learning through play, music and stories, and coming home with a big smile.`, image: "",
          primaryBtn: { label: "Book a Free Visit", href: "/admission" }, secondaryBtn: { label: "Explore Programs", href: "/programs" },
          features: [ { icon: "shield", title: "CCTV & Secure Pick-up", text: "" }, { icon: "heart", title: "Trained, Loving Teachers", text: "" }, { icon: "star", title: "Play-Based Learning", text: "" }, { icon: "users", title: "1:10 Teacher Ratio", text: "" } ],
        } },
        { type: "features", style: { layout: "minimal" }, content: { items: [
          { icon: "shield", title: "Safety, Always", text: "CCTV in every room, verified staff, child-proof furniture and a strict authorised pick-up policy." },
          { icon: "heart", title: "Caring Teachers", text: "Early-childhood trained, first-aid certified teachers who know every child by name and nature." },
          { icon: "star", title: "Learning Through Play", text: "A play-way curriculum that builds language, numbers, motor and social skills — without pressure." },
          { icon: "phone", title: "Daily Parent Updates", text: "Photos, activity notes and meal updates on the parent app so you never miss a moment." },
        ] } },
        { type: "serviceCategories", style: { layout: "tiles", background: "light" }, content: { eyebrow: "PROGRAMS", title: "Programs for Every", titleHighlight: "Little Stage", categories: ["Our Programs", "Fun Activities"] } },
        { type: "steps", style: { layout: "cards" }, content: { eyebrow: "A DAY WITH US", title: "A Happy, Balanced", titleHighlight: "Daily Routine", items: [
          { title: "Welcome Circle", text: "Hugs, greetings, prayer and a morning song", icon: "star" },
          { title: "Learning Through Play", text: "Phonics, numbers and themes with hands-on activities", icon: "book" },
          { title: "Snack & Outdoor Time", text: "Healthy snacks, then sandpit, slides and garden play", icon: "heart" },
          { title: "Art, Stories & Home", text: "Craft, story time and a cheerful goodbye", icon: "home" },
        ] } },
        { type: "about", style: { layout: "reverse", background: "light" }, content: { eyebrow: "WHY PARENTS CHOOSE US", title: "Your Child's First School Should Feel Like", titleHighlight: "Home", body: [`${biz} was started by parents and educators who wanted a preschool that is warm, safe and genuinely joyful. Every corner of our campus is designed for little hands and curious minds.`, "Our small groups mean teachers have time for every child — to comfort, encourage and celebrate each tiny milestone with you."], image: "", points: ["Early-childhood trained teachers", "Hygienic, child-safe campus", "Healthy snacks & meal plans", "Gentle settling-in for first-timers", "Regular parent-teacher meets", "Day care till 6:30 pm"], buttonLabel: "Book a Visit", buttonHref: "/admission" } },
        { type: "gallery", style: { layout: "strip" }, content: { eyebrow: "LITTLE MOMENTS", title: "Smiles, Paint &", titleHighlight: "Playtime" } },
        { type: "stats", style: { layout: "cards", background: "primary" }, content: { items: [ { value: "1,200+", label: "Happy Graduates", icon: "users" }, { value: "12+", label: "Years of Care", icon: "star" }, { value: "1:10", label: "Teacher–Child Ratio", icon: "heart" }, { value: "4.9★", label: "Parent Rating", icon: "award" } ] } },
        { type: "team", content: { eyebrow: "OUR TEACHERS", title: "The Caring Hands Behind", titleHighlight: "Every Smile", members: [
          { name: "Ms. Kavita Sharma", role: "Centre Head", image: "", note: "M.A. Child Development · 15 yrs" },
          { name: "Ms. Pooja Nair", role: "Nursery Lead Teacher", image: "", note: "Montessori Certified" },
          { name: "Ms. Ritu Malhotra", role: "LKG & UKG Teacher", image: "", note: "NTT · Phonics Specialist" },
          { name: "Ms. Shalini Iyer", role: "Music & Movement", image: "", note: "Diploma in Music" },
        ] } },
        { type: "openingHours", style: { background: "light" }, content: { eyebrow: "TIMINGS", title: "School &", titleHighlight: "Day-Care Hours", note: "Flexible half-day and full-day day-care plans for working parents. Saturday activity club is optional.", days: [
          { day: "Toddler & Playgroup", hours: "9:30am – 12:00pm" }, { day: "Nursery, LKG & UKG", hours: "9:00am – 12:30pm" }, { day: "Day Care (Mon–Fri)", hours: "12:30pm – 6:30pm" }, { day: "Saturday Activity Club", hours: "10:00am – 12:00pm" }, { day: "Sunday", hours: "Closed" },
        ] } },
        { type: "testimonials", style: { layout: "minimal" }, content: { eyebrow: "PARENTS SAY", title: "Loved by", titleHighlight: "Parents", items: [
          { name: "Neha Gupta", role: "Mother of Aadya, Nursery", text: "Aadya cried for two days and then started running to school! The teachers are so patient, and the daily photos on the app keep me relaxed at work.", rating: 5 },
          { name: "Rahul Mehta", role: "Father of Vihaan, LKG", text: "Clean, safe and genuinely fun. In six months Vihaan went from shy to singing rhymes for the whole family. Best decision we made.", rating: 5 },
          { name: "Sana Khan", role: "Mother of Zoya, Playgroup", text: "I checked five preschools before choosing this one. The hygiene, the CCTV and the warmth of the staff made it an easy choice.", rating: 5 },
          { name: "Arjun & Divya Reddy", role: "Parents of Ishaan, UKG", text: "Ishaan is reading simple words and is completely ready for big school. The day care has been a blessing for us as working parents.", rating: 5 },
        ] } },
        { type: "noticeBoard", style: { background: "light" }, content: { eyebrow: "STAY UPDATED", title: "What's Happening at", titleHighlight: "School", limit: 4, notices: [
          { date: "12 Nov", title: "Children's Day celebration — puppet show & balloon fun on 14th", category: "Event", link: "", isNew: true },
          { date: "08 Nov", title: "Admissions open for 2027–28 — book a free campus visit", category: "Admission", link: "/admission", isNew: true },
          { date: "01 Nov", title: "Winter timings from 1st December: 9:30am start", category: "News", link: "/notices", isNew: false },
          { date: "25 Oct", title: "Diwali break 29th Oct – 3rd Nov — happy holidays, little ones!", category: "Holiday", link: "", isNew: false },
        ] } },
        { type: "faq", content: { eyebrow: "PARENT FAQ", title: "Questions Parents", titleHighlight: "Often Ask", items: [
          { q: "What is the right age to start preschool?", a: "Children can join our Toddler Group from 1.5 years and Playgroup from 2 years. We help you choose the right group during your visit." },
          { q: "How do you keep children safe?", a: "Every room has CCTV, all staff are police-verified, the campus is child-proofed and children are handed over only to authorised adults with an ID card." },
          { q: "My child has never stayed away from me. How will you help?", a: "We follow a gentle settling-in plan — shorter hours in the first week and a parent allowed to stay nearby — so your child feels secure." },
          { q: "Do you provide meals?", a: "Yes, we serve fresh, hygienic snacks and an optional nutritious lunch for day-care children. Menus are shared with parents every month." },
          { q: "Is my child expected to be toilet-trained?", a: "Not for Toddler Group and Playgroup. Our didis help gently with toilet training in partnership with you." },
          { q: "How will I know how my child is doing?", a: "You get daily photos and notes on the parent app, monthly progress updates and parent-teacher meetings every term." },
        ] } },
        { type: "cta", style: { layout: "minimal" }, content: { title: "Give your child a joyful start", highlight: "Book a Free Campus Visit", phones: ["9000000000"], buttonLabel: "Book a Visit", buttonHref: "/admission" } },
      ],
    },
    { slug: "about", title: "About", isSystem: true, order: 1, sections: [
      { type: "about", content: { eyebrow: "ABOUT US", title: "Our", titleHighlight: "Philosophy", body: [`At ${biz}, we believe children learn best when they are happy, safe and free to explore.`, "We blend play, care and gentle learning to build strong foundations for life — curiosity, confidence, kindness and a love for learning."], image: "", points: ["Learning through play", "Safe & hygienic environment", "Individual attention in small groups", "Values & good habits", "Close partnership with parents"], buttonLabel: "", buttonHref: "" } },
      { type: "stats", content: { items: [ { value: "1,200+", label: "Happy Graduates", icon: "users" }, { value: "12+", label: "Years", icon: "star" }, { value: "20+", label: "Teachers", icon: "heart" }, { value: "100%", label: "CCTV Covered", icon: "shield" } ] } },
      { type: "visionMission", style: { background: "light" }, content: {
        eyebrow: "OUR PROMISE",
        visionTitle: "Our Vision", visionText: "Every child's first school memory should be a happy one.",
        missionTitle: "Our Mission", missionText: "Gentle, play-based early learning in a safe, spotless campus — with parents as partners at every step.",
        valuesTitle: "What Matters to Us",
        values: [
          { icon: "heart", title: "Warmth", text: "Hugs, patience and a teacher who knows your child." },
          { icon: "shield", title: "Safety", text: "CCTV, verified staff and ID-based pick-up." },
          { icon: "star", title: "Curiosity", text: "Questions are welcome — always." },
        ],
      } },
      { type: "cta", content: { title: "Come see us in action", highlight: "Book a Visit", phones: ["9000000000"], buttonLabel: "Book a Visit", buttonHref: "/admission" } },
    ] },
    { slug: "programs", title: "Programs", isSystem: true, order: 2, sections: [
      { type: "serviceCategories", content: { eyebrow: "", title: "Our", titleHighlight: "Programs", categories: ["Our Programs", "Fun Activities"] } },
      { type: "steps", style: { layout: "timeline", background: "light" }, content: { eyebrow: "ADMISSION", title: "Joining Is", titleHighlight: "Simple", items: [
        { title: "Book a Visit", text: "Walk around the campus with your child and meet the teachers.", icon: "home" },
        { title: "Fill the Form", text: "Birth certificate, photos and Aadhaar of child and parent.", icon: "clipboard" },
        { title: "Settling-in Week", text: "Short, gentle days with a parent nearby.", icon: "heart" },
      ] } },
      { type: "cta", content: { title: "Not sure which program?", highlight: "Talk to Us", phones: ["9000000000"], buttonLabel: "Book a Visit", buttonHref: "/admission" } },
    ] },
    { slug: "facilities", title: "Facilities", isSystem: true, order: 3, sections: [
      { type: "features", content: { items: [
        { icon: "shield", title: "CCTV & Safe Entry", text: "Round-the-clock monitoring and ID-card based pick-up." },
        { icon: "home", title: "Child-Safe Campus", text: "Soft flooring, rounded edges and spotless, sanitised spaces." },
        { icon: "heart", title: "Nutritious Meals", text: "Healthy, hygienic snacks prepared with care." },
        { icon: "star", title: "Play & Activity Zones", text: "Indoor and outdoor play, art and music rooms." },
        { icon: "check", title: "First Aid & Care", text: "First-aid trained staff and a quiet rest area." },
        { icon: "truck", title: "Safe Transport", text: "GPS-tracked vans with a lady attendant on board." },
      ] } },
      { type: "gallery", content: { eyebrow: "", title: "A Peek Into", titleHighlight: "Our School" } },
    ] },
    { slug: "gallery", title: "Gallery", isSystem: true, order: 4, sections: [ { type: "gallery", content: { eyebrow: "", title: "Happy", titleHighlight: "Moments" } } ] },
    { slug: "fees", title: "Fees", isSystem: true, order: 5, sections: [
      { type: "priceList", content: { eyebrow: "", title: "Fee", titleHighlight: "Structure", note: "Fees include the activity kit. Sibling discount available. Contact us for full details.", groups: [
        { category: "Annual Fees", items: [ { name: "Toddler / Playgroup", price: "₹28,000/yr", note: "" }, { name: "Nursery", price: "₹32,000/yr", note: "" }, { name: "LKG / UKG", price: "₹36,000/yr", note: "" } ] },
        { category: "Optional", items: [ { name: "Day Care (till 6:30 pm)", price: "₹3,500/mo", note: "includes lunch" }, { name: "Transport", price: "₹1,200/mo", note: "route-wise" } ] },
        { category: "One-time", items: [ { name: "Admission Kit", price: "₹4,000", note: "uniform, books & bag" } ] },
      ] } },
      { type: "cta", content: { title: "Questions about fees?", highlight: "Contact Us", phones: ["9000000000"], buttonLabel: "Book a Visit", buttonHref: "/admission" } },
    ] },
    { slug: "contact", title: "Contact", isSystem: true, order: 6, sections: [ { type: "contactForm", content: { title: "Contact Us", subtitle: "We'd love to show you around — reach out anytime." } } ] },
    { slug: "admission", title: "Book a Visit", isSystem: true, order: 7, sections: [
      { type: "downloads", content: { eyebrow: "DOWNLOADS", title: "Downloads &", titleHighlight: "Prospectus", items: [
        { title: "Prospectus", description: "Programs, daily routine, safety & facilities.", link: "", icon: "book" },
        { title: "Fee Structure", description: "Program-wise fees and what's included.", link: "", icon: "tag" },
        { title: "Activity Calendar", description: "Fun events and holidays through the year.", link: "", icon: "calendar" },
      ] } },
      { type: "quoteForm", content: { title: "Admission / Visit Enquiry", subtitle: "Tell us about your child and we'll call you to arrange a visit.", showSidebar: true } },
    ] },
    { slug: "notices", title: "Notices", isSystem: true, order: 8, sections: [
      { type: "noticeBoard", content: { eyebrow: "STAY UPDATED", title: "Notices &", titleHighlight: "Updates", notices: [
        { date: "05 Jul", title: "Admissions open — limited seats, book a visit!", category: "Admission", link: "/admission", isNew: true },
        { date: "01 Jul", title: "Summer Fun Camp starts 10th July", category: "Event", link: "", isNew: true },
        { date: "25 Jun", title: "Parent orientation on 8th July", category: "Event", link: "", isNew: false },
        { date: "20 Jun", title: "School reopens 1st July — welcome back little ones!", category: "Holiday", link: "", isNew: false },
        { date: "15 Jun", title: "Fancy dress day — theme 'My Favourite Fruit'", category: "Event", link: "", isNew: false },
      ] } },
      { type: "downloads", content: { eyebrow: "DOWNLOADS", title: "Download", titleHighlight: "Circulars", items: [
        { title: "Activity Calendar", description: "Fun events and holidays through the year.", link: "", icon: "calendar" },
        { title: "Fee Circular", description: "Program-wise fees and what's included.", link: "", icon: "tag" },
        { title: "What to Bring", description: "Daily checklist for your little one.", link: "", icon: "clipboard" },
      ] } },
    ] },
  ],
};
