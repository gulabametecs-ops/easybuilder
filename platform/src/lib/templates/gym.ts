import type { TemplateDef } from "./types";

// Gym / Fitness Studio (gyms, CrossFit, yoga studios, personal training):
// energetic charcoal + electric lime, conversion-focused on the free trial.
export const gym: TemplateDef = {
  theme: {
    colors: { primary: "#84cc16", primaryDark: "#65a30d", secondary: "#18181b", accent: "#f97316", dark: "#0c0c0e", light: "#f7fee7", text: "#3f3f46", heading: "#09090b" },
    font: "Outfit", radius: "0.75rem",
  },
  header: (biz) => ({
    design: "bold",
    logoText: biz, logoImage: "",
    announcement: { show: true, text: "New member offer · Your first 3 days are FREE — book a trial session today", link: "/free-trial" },
    topbar: { show: true, address: "Your City", phones: ["9000000000"], email: "hello@example.com", social: { facebook: "#", instagram: "#", whatsapp: "#" } },
    nav: [
      { label: "Home", href: "/" }, { label: "About", href: "/about" }, { label: "Programs", href: "/programs" }, { label: "Membership", href: "/membership" },
      { label: "Trainers", href: "/trainers" }, { label: "Schedule", href: "/schedule" }, { label: "Gallery", href: "/gallery" }, { label: "Contact", href: "/contact" },
    ],
    cta: { label: "Free Trial", href: "/free-trial" },
  }),
  footer: (biz) => ({
    design: "modern",
    about: `${biz} is a modern fitness studio with certified coaches, premium equipment and programs for every goal — fat loss, strength, mobility and wellness.`,
    columns: [
      { title: "Explore", links: [ { label: "About Us", href: "/about" }, { label: "Programs", href: "/programs" }, { label: "Trainers", href: "/trainers" }, { label: "Gallery", href: "/gallery" }, { label: "Contact", href: "/contact" } ] },
      { title: "Join", links: [ { label: "Membership Plans", href: "/membership" }, { label: "Class Schedule", href: "/schedule" }, { label: "Book Free Trial", href: "/free-trial" }, { label: "Personal Training", href: "/programs" } ] },
    ],
    serviceAreas: ["Strength Training", "CrossFit", "Yoga", "Zumba", "Personal Training", "Weight Loss"],
    contact: { phones: ["9000000000"], email: "hello@example.com", address: "Your City" },
    social: { facebook: "#", instagram: "#", whatsapp: "#", location: "#" },
    copyright: `© {year} ${biz}. Train hard. Stay strong.`,
  }),
  seo: (biz) => ({
    title: `${biz} — Gym, CrossFit, Yoga & Personal Training in Your City`,
    description: "Modern gym with certified trainers, strength & cardio zones, CrossFit, yoga and Zumba classes. Flexible memberships from ₹1,499/month. Book your free trial today.",
    favicon: "", ogImage: "",
    keywords: "gym near me, fitness centre, personal trainer, crossfit, yoga classes, zumba, weight loss program",
    businessType: "ExerciseGym", priceRange: "₹₹",
  }),
  services: [
    { category: "Strength & Conditioning", title: "Strength Training", description: "Free weights, racks and machines with coach-designed progressive plans." },
    { category: "Strength & Conditioning", title: "CrossFit & Functional", description: "High-intensity WODs that build power, endurance and agility." },
    { category: "Strength & Conditioning", title: "Powerlifting Coaching", description: "Technique-first squat, bench and deadlift programming." },
    { category: "Group Classes", title: "Yoga & Mobility", description: "Hatha, power yoga and stretching sessions for flexibility and calm." },
    { category: "Group Classes", title: "Zumba & Dance Fitness", description: "High-energy cardio parties that burn calories fast." },
    { category: "Group Classes", title: "HIIT Bootcamp", description: "45-minute circuits to torch fat and boost stamina." },
    { category: "Personal Coaching", title: "Personal Training", description: "One-on-one sessions with a dedicated certified coach." },
    { category: "Personal Coaching", title: "Weight Loss Program", description: "12-week coached plan with workouts, diet and weekly check-ins." },
    { category: "Personal Coaching", title: "Diet & Nutrition Plans", description: "Custom Indian meal plans built around your goals and routine." },
  ],
  gallery: [
    "Strength zone", "Cardio floor", "CrossFit box", "Yoga studio", "Group HIIT class", "Personal training session", "Zumba night", "Locker rooms", "Member transformation",
  ].map((caption) => ({ category: "Our Gym", caption })),
  pages: (biz) => [
    {
      slug: "home", title: "Home", isSystem: true, order: 0,
      sections: [
        { type: "hero", content: {
          variant: "split", customHtml: "",
          badge: "FIRST 3 DAYS FREE · NO JOINING FEE THIS MONTH", titleTop: "Stronger Every Day,", titleHighlight: "Starting Today",
          subtitle: "", description: `${biz} brings certified coaches, premium equipment and high-energy classes under one roof. Whether it's fat loss, muscle gain or mobility — we build the plan, you bring the effort.`, image: "",
          primaryBtn: { label: "Book Free Trial", href: "/free-trial" }, secondaryBtn: { label: "View Memberships", href: "/membership" },
          features: [ { icon: "user-check", title: "Certified Coaches", text: "" }, { icon: "zap", title: "Premium Equipment", text: "" }, { icon: "clock", title: "Open 5 AM – 11 PM", text: "" }, { icon: "heart-pulse", title: "Diet Guidance", text: "" } ],
        } },
        { type: "features", content: { items: [
          { icon: "user-check", title: "Certified Trainers", text: "ACE, K11 and ISSA-certified coaches who correct form and push you safely." },
          { icon: "zap", title: "World-Class Equipment", text: "Imported machines, full free-weight area, racks, rigs and a dedicated cardio floor." },
          { icon: "heart-pulse", title: "Body Composition Tracking", text: "Monthly InBody-style assessments so you see real progress, not guesses." },
          { icon: "utensils", title: "Indian Diet Plans", text: "Practical meal plans with ghar ka khana — no fancy supplements required." },
          { icon: "users", title: "Motivating Community", text: "Group classes, challenges and a crew that keeps you showing up." },
          { icon: "shield", title: "Clean & Safe", text: "Sanitised daily, air-conditioned, CCTV-secured with lockers and showers." },
        ] }, style: { background: "light" } },
        { type: "about", content: {
          eyebrow: "ABOUT US", title: "More Than a Gym —", titleHighlight: "A Fitness Family",
          body: [`${biz} was built for people who want real results without the intimidation. From first-timers to competitive lifters, every member gets a structured plan and a coach who knows their name.`, "We combine science-backed training, sensible nutrition and a supportive community so your progress lasts long after the first month."],
          image: "", points: ["Free fitness assessment on joining", "Personalised workout plan", "Separate ladies' batch timings", "Flexible monthly to yearly plans"],
          buttonLabel: "Our Story", buttonHref: "/about",
        } },
        { type: "serviceCategories", content: { eyebrow: "PROGRAMS", title: "Train Your", titleHighlight: "Way", categories: ["Strength & Conditioning", "Group Classes", "Personal Coaching"] } },
        { type: "stats", content: { items: [ { value: "2,500+", label: "Active Members", icon: "users" }, { value: "25+", label: "Certified Coaches", icon: "user-check" }, { value: "40+", label: "Weekly Classes", icon: "calendar" }, { value: "10,000 kg+", label: "Fat Lost by Members", icon: "trending" } ] }, style: { background: "dark" } },
        { type: "pricingPlans", content: {
          eyebrow: "MEMBERSHIP", title: "Simple,", titleHighlight: "Honest Pricing",
          plans: [
            { name: "Monthly", price: "₹1,999", period: "/month", features: ["Full gym floor access", "Cardio & strength zones", "Locker & shower access", "Free fitness assessment"], featured: false, buttonLabel: "Start Free Trial", buttonHref: "/free-trial" },
            { name: "Quarterly Pro", price: "₹4,999", period: "/3 months", features: ["Everything in Monthly", "Unlimited group classes", "Personalised diet plan", "Monthly body composition check", "2 personal training sessions"], featured: true, buttonLabel: "Start Free Trial", buttonHref: "/free-trial" },
            { name: "Annual Elite", price: "₹14,999", period: "/year", features: ["Everything in Quarterly Pro", "8 personal training sessions", "Freeze membership up to 60 days", "Guest passes every month", "Exclusive merchandise kit"], featured: false, buttonLabel: "Start Free Trial", buttonHref: "/free-trial" },
          ],
        } },
        { type: "team", content: { eyebrow: "OUR COACHES", title: "Meet Your", titleHighlight: "Trainers", members: [
          { name: "Rohit Malhotra", role: "Head Coach · Strength", image: "", note: "K11 certified · 10 yrs" },
          { name: "Ananya Iyer", role: "Yoga & Mobility", image: "", note: "RYT-500 · 8 yrs" },
          { name: "Vikram Singh", role: "CrossFit Coach", image: "", note: "CF-L2 · 7 yrs" },
          { name: "Neha Kapoor", role: "Nutrition & Weight Loss", image: "", note: "Sports nutritionist" },
        ] }, style: { background: "light" } },
        { type: "testimonials", content: { eyebrow: "TRANSFORMATIONS", title: "Real Members,", titleHighlight: "Real Results", items: [
          { name: "Karan Mehta", role: "Lost 14 kg in 5 months", text: "I had tried joining gyms three times before and always quit. The coaches here tracked my progress every month and the diet plan actually fit my routine.", rating: 5 },
          { name: "Pooja Sharma", role: "Yoga & HIIT member", text: "The ladies' batch timings and the friendly trainers made me feel comfortable from day one. My back pain is gone and my energy is through the roof.", rating: 5 },
          { name: "Aditya Rao", role: "Strength athlete", text: "Best equipment in the city and coaches who genuinely know programming. My deadlift went from 120 kg to 180 kg in a year.", rating: 5 },
        ] } },
        { type: "faq", content: { eyebrow: "FAQ", title: "Questions,", titleHighlight: "Answered", items: [
          { q: "Can I try the gym before joining?", a: "Yes. Book a free trial and get 3 days of full access plus a complimentary fitness assessment with one of our coaches." },
          { q: "I'm a complete beginner. Is that okay?", a: "Absolutely. Every new member gets an orientation, a beginner-friendly plan and a coach to guide form during the first few weeks." },
          { q: "Do you have separate timings for women?", a: "Yes, we run dedicated ladies' batches in the morning and evening, along with women-only yoga and Zumba classes." },
          { q: "Are group classes included in the membership?", a: "Group classes are included in the Quarterly Pro and Annual Elite plans. Monthly members can add classes for a small fee." },
          { q: "Can I pause my membership?", a: "Annual members can freeze their membership for up to 60 days for travel, exams or medical reasons." },
          { q: "Do you provide diet plans?", a: "Yes. Our nutritionist designs practical Indian meal plans (veg and non-veg) based on your goal and daily routine." },
        ] } },
        { type: "cta", content: { title: "Your first workout is on us", highlight: "Claim Your Free Trial", phones: ["9000000000"], buttonLabel: "Book Free Trial", buttonHref: "/free-trial" } },
      ],
    },
    { slug: "about", title: "About Us", isSystem: true, order: 1, sections: [
      { type: "about", content: {
        eyebrow: "OUR STORY", title: "Built for People Who", titleHighlight: "Want Results",
        body: [`${biz} started with a simple belief — fitness should be guided, welcoming and results-driven. Today we are a community of thousands who train with purpose every single day.`, "Our coaches focus on correct technique, progressive plans and sustainable habits, so you get fitter without injuries or burnout."],
        image: "", points: ["Certified, experienced coaching team", "Premium imported equipment", "Air-conditioned, hygienic facility", "Programs for every age and fitness level"],
        buttonLabel: "Book Free Trial", buttonHref: "/free-trial",
      } },
      { type: "stats", content: { items: [ { value: "8+", label: "Years Running", icon: "star" }, { value: "2,500+", label: "Active Members", icon: "users" }, { value: "12,000 sq ft", label: "Training Space", icon: "home" }, { value: "4.9★", label: "Google Rating", icon: "thumbs-up" } ] }, style: { background: "dark" } },
      { type: "steps", content: { eyebrow: "HOW IT WORKS", title: "Your First", titleHighlight: "30 Days", items: [
        { title: "Free Assessment", text: "Body composition, posture and goal check", icon: "clipboard" },
        { title: "Custom Plan", text: "Workout and diet plan built for you", icon: "edit" },
        { title: "Coached Sessions", text: "Trainer-guided workouts with form correction", icon: "user-check" },
        { title: "Track Progress", text: "Monthly re-assessment and plan updates", icon: "trending" },
      ] } },
      { type: "cta", content: { title: "See the difference in person", highlight: "Visit Us for a Free Trial", phones: ["9000000000"], buttonLabel: "Book Free Trial", buttonHref: "/free-trial" } },
    ] },
    { slug: "programs", title: "Programs & Classes", isSystem: true, order: 2, sections: [
      { type: "serviceCategories", content: { eyebrow: "WHAT WE OFFER", title: "Programs &", titleHighlight: "Classes", categories: ["Strength & Conditioning", "Group Classes", "Personal Coaching"] } },
      { type: "features", content: { items: [
        { icon: "trending", title: "Fat Loss", text: "HIIT, cardio and a calorie-smart Indian diet plan." },
        { icon: "zap", title: "Muscle Gain", text: "Progressive hypertrophy splits with protein-focused nutrition." },
        { icon: "heart-pulse", title: "Endurance & Stamina", text: "Conditioning circuits for runners, athletes and busy professionals." },
        { icon: "shield", title: "Mobility & Rehab", text: "Yoga and corrective exercise for stiff joints and posture issues." },
      ] }, style: { background: "light" } },
      { type: "cta", content: { title: "Not sure which program fits?", highlight: "Talk to a Coach", phones: ["9000000000"], buttonLabel: "Book Free Trial", buttonHref: "/free-trial" } },
    ] },
    { slug: "membership", title: "Membership Plans", isSystem: true, order: 3, sections: [
      { type: "pricingPlans", content: {
        eyebrow: "MEMBERSHIP", title: "Choose Your", titleHighlight: "Plan",
        plans: [
          { name: "Monthly", price: "₹1,999", period: "/month", features: ["Full gym floor access", "Cardio & strength zones", "Locker & shower access", "Free fitness assessment"], featured: false, buttonLabel: "Start Free Trial", buttonHref: "/free-trial" },
          { name: "Quarterly Pro", price: "₹4,999", period: "/3 months", features: ["Everything in Monthly", "Unlimited group classes", "Personalised diet plan", "Monthly body composition check", "2 personal training sessions"], featured: true, buttonLabel: "Start Free Trial", buttonHref: "/free-trial" },
          { name: "Annual Elite", price: "₹14,999", period: "/year", features: ["Everything in Quarterly Pro", "8 personal training sessions", "Freeze membership up to 60 days", "Guest passes every month", "Exclusive merchandise kit"], featured: false, buttonLabel: "Start Free Trial", buttonHref: "/free-trial" },
        ],
      } },
      { type: "priceList", content: { eyebrow: "ADD-ONS", title: "Personal Training &", titleHighlight: "Extras", note: "Student and couple discounts available. EMI options on annual plans. Prices inclusive of GST.", groups: [
        { category: "Personal Training", items: [ { name: "Single PT session", price: "₹800", note: "60 minutes" }, { name: "12 PT sessions", price: "₹8,500", note: "valid 45 days" }, { name: "24 PT sessions", price: "₹15,000", note: "valid 90 days" } ] },
        { category: "Extras", items: [ { name: "Group classes (monthly add-on)", price: "₹999", note: "" }, { name: "Custom diet plan", price: "₹1,499", note: "with 4 weekly check-ins" }, { name: "Day pass", price: "₹299", note: "" } ] },
      ] }, style: { background: "light" } },
      { type: "cta", content: { title: "Try before you commit", highlight: "3 Days Free", phones: ["9000000000"], buttonLabel: "Book Free Trial", buttonHref: "/free-trial" } },
    ] },
    { slug: "trainers", title: "Our Trainers", isSystem: true, order: 4, sections: [
      { type: "team", content: { eyebrow: "OUR COACHES", title: "Certified", titleHighlight: "Trainers", members: [
        { name: "Rohit Malhotra", role: "Head Coach · Strength", image: "", note: "K11 certified · 10 yrs" },
        { name: "Ananya Iyer", role: "Yoga & Mobility", image: "", note: "RYT-500 · 8 yrs" },
        { name: "Vikram Singh", role: "CrossFit Coach", image: "", note: "CF-L2 · 7 yrs" },
        { name: "Neha Kapoor", role: "Nutrition & Weight Loss", image: "", note: "Sports nutritionist" },
        { name: "Arjun Desai", role: "HIIT & Bootcamp", image: "", note: "ACE certified · 6 yrs" },
        { name: "Sana Qureshi", role: "Zumba & Dance Fitness", image: "", note: "Zumba licensed · 5 yrs" },
      ] } },
      { type: "cta", content: { title: "Train with the best", highlight: "Book a Session", phones: ["9000000000"], buttonLabel: "Book Free Trial", buttonHref: "/free-trial" } },
    ] },
    { slug: "schedule", title: "Class Schedule", isSystem: true, order: 5, sections: [
      { type: "openingHours", content: { eyebrow: "TIMINGS", title: "Gym", titleHighlight: "Hours", note: "Ladies' batch: 10 AM – 12 PM and 4 PM – 6 PM (Mon–Sat). Timings may change on public holidays.", days: [
        { day: "Monday – Friday", hours: "5:00 AM – 11:00 PM" }, { day: "Saturday", hours: "5:00 AM – 10:00 PM" }, { day: "Sunday", hours: "7:00 AM – 1:00 PM" },
      ] } },
      { type: "priceList", content: { eyebrow: "WEEKLY CLASSES", title: "Group Class", titleHighlight: "Timetable", note: "Classes are 45–60 minutes. Please arrive 10 minutes early. Book your spot at the front desk or on WhatsApp.", groups: [
        { category: "Morning", items: [ { name: "Power Yoga", price: "6:00 AM", note: "Mon · Wed · Fri" }, { name: "CrossFit WOD", price: "7:00 AM", note: "Daily" }, { name: "HIIT Bootcamp", price: "8:00 AM", note: "Tue · Thu · Sat" } ] },
        { category: "Evening", items: [ { name: "Zumba", price: "6:00 PM", note: "Mon · Wed · Fri" }, { name: "Strength Club", price: "7:00 PM", note: "Tue · Thu" }, { name: "Mobility & Stretch", price: "8:00 PM", note: "Daily" } ] },
      ] }, style: { background: "light" } },
      { type: "cta", content: { title: "Find a class that fits your day", highlight: "Try One Free", phones: ["9000000000"], buttonLabel: "Book Free Trial", buttonHref: "/free-trial" } },
    ] },
    { slug: "gallery", title: "Gallery", isSystem: true, order: 6, sections: [
      { type: "gallery", content: { eyebrow: "INSIDE THE GYM", title: "Take a", titleHighlight: "Look Around" } },
      { type: "cta", content: { title: "Like what you see?", highlight: "Come Train With Us", phones: ["9000000000"], buttonLabel: "Book Free Trial", buttonHref: "/free-trial" } },
    ] },
    { slug: "free-trial", title: "Free Trial", isSystem: true, order: 7, sections: [
      { type: "appointmentForm", content: { title: "Book Your Free Trial", subtitle: "Pick a date and time — get 3 days of full access plus a free fitness assessment with a coach." } },
      { type: "steps", content: { eyebrow: "WHAT TO EXPECT", title: "Your Free", titleHighlight: "Trial", items: [
        { title: "Book a Slot", text: "Choose a time that suits you", icon: "calendar" },
        { title: "Meet Your Coach", text: "Quick chat about your goals", icon: "user-check" },
        { title: "Assessment", text: "Body composition and fitness check", icon: "clipboard" },
        { title: "Train Free", text: "3 days of full gym and class access", icon: "zap" },
      ] }, style: { background: "light" } },
    ] },
    { slug: "contact", title: "Contact Us", isSystem: true, order: 8, sections: [
      { type: "contactForm", content: { title: "Get in Touch", subtitle: "Questions about memberships, personal training or classes? We usually reply within a few hours." } },
      { type: "map", content: { eyebrow: "VISIT US", title: "Find", titleHighlight: "Our Gym", address: "Your City", mapEmbed: "" } },
    ] },
  ],
};
