import type { TemplateDef } from "./types";

// Gym / Fitness Studio (gyms, CrossFit, yoga studios, personal training):
// energetic charcoal + electric lime, conversion-focused on the free trial.
export const gym: TemplateDef = {
  theme: {
    colors: { primary: "#84cc16", primaryDark: "#65a30d", secondary: "#18181b", accent: "#f97316", dark: "#0c0c0e", light: "#f7fee7", text: "#3f3f46", heading: "#09090b" },
    font: "Outfit", radius: "0.375rem",
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
    design: "gradient",
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
          variant: "slideshow", customHtml: "",
          badge: "FIRST 3 DAYS FREE · NO JOINING FEE THIS MONTH", titleTop: "Stronger Every Day,", titleHighlight: "Starting Today",
          subtitle: "", description: `${biz} brings certified coaches, premium equipment and high-energy classes under one roof. Whether it's fat loss, muscle gain or mobility — we build the plan, you bring the effort.`, image: "",
          primaryBtn: { label: "Book Free Trial", href: "/free-trial" }, secondaryBtn: { label: "View Memberships", href: "/membership" },
          features: [ { icon: "user-check", title: "Certified Coaches", text: "" }, { icon: "zap", title: "Premium Equipment", text: "" }, { icon: "clock", title: "Open 5 AM – 11 PM", text: "" }, { icon: "heart-pulse", title: "Diet Guidance", text: "" } ],
          slides: [
            { titleTop: "Stronger Every Day,", titleHighlight: "Starting Today", description: `Certified coaches, 12,000 sq ft of premium equipment and a plan built around your goal. Your first 3 days at ${biz} are on us.`, image: "", primaryBtn: { label: "Book Free Trial", href: "/free-trial" }, secondaryBtn: { label: "View Memberships", href: "/membership" } },
            { titleTop: "40+ Classes a Week —", titleHighlight: "Find Your Tribe", description: "CrossFit at sunrise, Zumba after work, power yoga on Sunday. Group classes are included in every Quarterly and Annual plan.", image: "", primaryBtn: { label: "See the Schedule", href: "/schedule" }, secondaryBtn: { label: "Explore Programs", href: "/programs" } },
            { titleTop: "12-Week Transformation,", titleHighlight: "Coached All the Way", description: "Workouts, a ghar-ka-khana diet plan and weekly check-ins with your coach. Real numbers, tracked every month.", image: "", primaryBtn: { label: "Talk to a Coach", href: "/free-trial" }, secondaryBtn: { label: "Meet the Trainers", href: "/trainers" } },
          ],
        } },
        { type: "stats", content: { items: [ { value: "2,500+", label: "Active Members", icon: "users" }, { value: "25+", label: "Certified Coaches", icon: "user-check" }, { value: "40+", label: "Weekly Classes", icon: "calendar" }, { value: "10,000 kg+", label: "Fat Lost by Members", icon: "trending" } ] }, style: { layout: "band", background: "primary" } },
        { type: "serviceCategories", content: { eyebrow: "PROGRAMS", title: "Train Your", titleHighlight: "Way", categories: ["Strength & Conditioning", "Group Classes", "Personal Coaching"] }, style: { layout: "tiles", background: "dark" } },
        { type: "about", content: {
          eyebrow: "ABOUT US", title: "More Than a Gym —", titleHighlight: "A Fitness Family",
          body: [`${biz} was built for people who want real results without the intimidation. From first-timers to competitive lifters, every member gets a structured plan and a coach who knows their name.`, "We combine science-backed training, sensible nutrition and a supportive community so your progress lasts long after the first month."],
          image: "", points: ["Free fitness assessment on joining", "Personalised workout plan", "Separate ladies' batch timings", "Flexible monthly to yearly plans"],
          buttonLabel: "Our Story", buttonHref: "/about",
        }, style: { layout: "reverse" } },
        { type: "features", content: { items: [
          { icon: "user-check", title: "Certified Trainers", text: "Internationally certified coaches who correct your form and push you safely — never ego-lifting." },
          { icon: "zap", title: "World-Class Equipment", text: "Imported machines, a full free-weight area, power racks, rigs and a dedicated cardio floor." },
          { icon: "heart-pulse", title: "Body Composition Tracking", text: "Monthly body-fat, muscle and visceral-fat scans so you see real progress, not guesses." },
          { icon: "utensils", title: "Indian Diet Plans", text: "Practical meal plans with dal, roti and sabzi — no fancy supplements required." },
          { icon: "users", title: "Motivating Community", text: "Monthly challenges, weekend runs and a crew that keeps you showing up." },
          { icon: "shield", title: "Clean & Safe", text: "Sanitised every shift, air-conditioned and CCTV-secured, with lockers and hot showers." },
        ] }, style: { layout: "numbered", background: "light" } },
        { type: "openingHours", content: { eyebrow: "TIMINGS", title: "Open Early,", titleHighlight: "Close Late", note: "Ladies' batch: 10 AM – 12 PM and 4 PM – 6 PM (Mon–Sat). Reduced hours on Holi, Diwali and Independence Day.", days: [
          { day: "Monday – Friday", hours: "5:00 AM – 11:00 PM" }, { day: "Saturday", hours: "5:00 AM – 10:00 PM" }, { day: "Sunday", hours: "7:00 AM – 1:00 PM" },
        ] } },
        { type: "pricingPlans", content: {
          eyebrow: "MEMBERSHIP", title: "Simple,", titleHighlight: "Honest Pricing",
          plans: [
            { name: "Monthly", price: "₹1,999", period: "/month", features: ["Full gym floor access", "Cardio & strength zones", "Locker & shower access", "Free fitness assessment"], featured: false, buttonLabel: "Start Free Trial", buttonHref: "/free-trial" },
            { name: "Quarterly Pro", price: "₹4,999", period: "/3 months", features: ["Everything in Monthly", "Unlimited group classes", "Personalised diet plan", "Monthly body composition check", "2 personal training sessions"], featured: true, buttonLabel: "Start Free Trial", buttonHref: "/free-trial" },
            { name: "Annual Elite", price: "₹14,999", period: "/year", features: ["Everything in Quarterly Pro", "8 personal training sessions", "Freeze membership up to 60 days", "Guest passes every month", "Exclusive merchandise kit"], featured: false, buttonLabel: "Start Free Trial", buttonHref: "/free-trial" },
          ],
        }, style: { background: "dark" } },
        { type: "countdown", content: { eyebrow: "NEXT CHALLENGE", title: "90-Day New Year", titleHighlight: "Transformation", subtitle: "Coached workouts, a diet plan and fortnightly weigh-ins. Top 3 transformations win a free annual membership. Registration ₹999, adjusted against any plan.", targetDate: "2027-01-05T06:00", buttonLabel: "Join the Challenge", buttonHref: "/free-trial" }, style: { background: "primary" } },
        { type: "team", content: { eyebrow: "OUR COACHES", title: "Meet Your", titleHighlight: "Trainers", members: [
          { name: "Rohit Malhotra", role: "Head Coach · Strength", image: "", note: "Certified strength coach · 10 yrs" },
          { name: "Ananya Iyer", role: "Yoga & Mobility", image: "", note: "500-hr yoga teacher · 8 yrs" },
          { name: "Vikram Singh", role: "CrossFit Coach", image: "", note: "Level 2 functional coach · 7 yrs" },
          { name: "Neha Kapoor", role: "Nutrition & Weight Loss", image: "", note: "Sports nutritionist · 6 yrs" },
        ] }, style: { layout: "list", background: "light" } },
        { type: "testimonials", content: { eyebrow: "TRANSFORMATIONS", title: "Real Members,", titleHighlight: "Real Results", items: [
          { name: "Karan Mehta", role: "Lost 14 kg in 5 months", text: "I had tried joining gyms three times before and always quit. The coaches here tracked my progress every month and the diet plan actually fit my office routine and my mother's cooking.", rating: 5 },
          { name: "Pooja Sharma", role: "Yoga & HIIT member", text: "The ladies' batch timings and the friendly trainers made me feel comfortable from day one. My back pain is gone.", rating: 5 },
          { name: "Aditya Rao", role: "Strength athlete", text: "Coaches who genuinely know programming. My deadlift went from 120 kg to 180 kg in a year.", rating: 5 },
          { name: "Harpreet Kaur", role: "Member at 52", text: "I started for my knees and sugar levels. Eight months later I climb stairs without a second thought.", rating: 5 },
        ] }, style: { layout: "featured" } },
        { type: "gallery", content: { eyebrow: "INSIDE THE GYM", title: "Take a", titleHighlight: "Look Around" }, style: { layout: "strip", background: "dark" } },
        { type: "faq", content: { ...{ intro: "Everything new members ask at the front desk — from trial passes to ladies' batches. Still curious? WhatsApp us anytime." }, eyebrow: "FAQ", title: "Questions,", titleHighlight: "Answered", items: [
          { q: "Can I try the gym before joining?", a: "Yes. Book a free trial and get 3 days of full access plus a complimentary fitness assessment with one of our coaches." },
          { q: "I'm a complete beginner. Is that okay?", a: "Absolutely. Every new member gets an orientation, a beginner-friendly plan and a coach to guide form during the first few weeks." },
          { q: "Do you have separate timings for women?", a: "Yes, we run dedicated ladies' batches in the morning and evening, along with women-only yoga and Zumba classes." },
          { q: "Are group classes included in the membership?", a: "Group classes are included in the Quarterly Pro and Annual Elite plans. Monthly members can add classes for ₹999 a month." },
          { q: "Can I pause my membership?", a: "Annual members can freeze their membership for up to 60 days for travel, exams or medical reasons." },
          { q: "Do you provide diet plans?", a: "Yes. Our nutritionist designs practical Indian meal plans (veg, Jain, eggetarian and non-veg) based on your goal and daily routine." },
          { q: "Is parking available? Can I pay in EMI?", a: "Yes to both — free two-wheeler and car parking, and no-cost EMI on annual plans with most credit cards and UPI pay-later apps." },
        ] }, style: { layout: "split", background: "light" } },
        { type: "cta", content: { title: "Your first workout is on us", highlight: "Claim Your Free Trial", phones: ["9000000000"], buttonLabel: "Book Free Trial", buttonHref: "/free-trial" }, style: { layout: "split" } },
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
      { type: "faq", content: { ...{ intro: "Not sure where to start? These are the questions our coaches hear most in week one." }, eyebrow: "PROGRAM FAQ", title: "Picking the", titleHighlight: "Right Program", items: [
        { q: "Can I combine strength training and group classes?", a: "Yes — most members do. Your coach will balance heavy days with classes so you recover properly." },
        { q: "How soon will I see results?", a: "With 4 sessions a week and the diet plan, most members notice better energy in 2 weeks and visible change in 6–8 weeks." },
        { q: "Is personal training worth it for beginners?", a: "A 12-session PT pack is the fastest way to learn safe technique. Many members switch to the floor plan after that." },
      ] }, style: { layout: "split" } },
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
        { name: "Rohit Malhotra", role: "Head Coach · Strength", image: "", note: "Certified strength coach · 10 yrs" },
        { name: "Ananya Iyer", role: "Yoga & Mobility", image: "", note: "500-hr yoga teacher · 8 yrs" },
        { name: "Vikram Singh", role: "CrossFit Coach", image: "", note: "Level 2 functional coach · 7 yrs" },
        { name: "Neha Kapoor", role: "Nutrition & Weight Loss", image: "", note: "Sports nutritionist" },
        { name: "Arjun Desai", role: "HIIT & Bootcamp", image: "", note: "Certified HIIT coach · 6 yrs" },
        { name: "Sana Qureshi", role: "Zumba & Dance Fitness", image: "", note: "Licensed dance-fitness instructor · 5 yrs" },
      ] } },
      { type: "testimonials", content: { eyebrow: "COACHED BY THEM", title: "What Members", titleHighlight: "Say", items: [
        { name: "Sahil Bhatnagar", role: "PT client · 6 months", text: "Rohit fixed my squat in two sessions after years of knee pain. Patient, precise and always on time.", rating: 5 },
        { name: "Divya Menon", role: "Zumba & yoga member", text: "Sana's Zumba hour is pure joy, and Ananya's mobility class undid years of desk posture.", rating: 5 },
      ] }, style: { layout: "minimal", background: "light" } },
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
