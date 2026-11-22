import type { TemplateDef } from "./types";

// Dietitian & Nutrition Clinic (weight loss, PCOS/thyroid/diabetes plans,
// sports nutrition, online consults): fresh green + clean white, trust-led.
export const nutritionClinic: TemplateDef = {
  theme: {
    colors: { primary: "#22c55e", primaryDark: "#16a34a", secondary: "#0f3d2e", accent: "#f59e0b", dark: "#0b2a20", light: "#f0fdf4", text: "#475569", heading: "#0f172a" },
    font: "Onest", radius: "0.875rem",
  },
  header: (biz) => ({
    design: "classic",
    logoText: biz, logoImage: "",
    announcement: { show: true, text: "Free 15-minute diet discovery call this week — talk to a dietitian before you decide", link: "/book-consultation" },
    topbar: { show: true, address: "Your City", phones: ["9000000000"], email: "hello@example.com", social: { facebook: "#", instagram: "#", whatsapp: "#" } },
    nav: [
      { label: "Home", href: "/" }, { label: "About", href: "/about" }, { label: "Diet Programs", href: "/programs" }, { label: "Pricing", href: "/pricing" },
      { label: "Transformations", href: "/transformations" }, { label: "Online Consult", href: "/online-consultation" }, { label: "Contact", href: "/contact" },
    ],
    cta: { label: "Book Consultation", href: "/book-consultation" },
  }),
  footer: (biz) => ({
    design: "modern",
    about: `${biz} is a dietitian-led nutrition clinic offering practical, Indian-food-based plans for weight management, PCOS, thyroid, diabetes and sports performance — in clinic and online.`,
    columns: [
      { title: "Programs", links: [ { label: "Weight Management", href: "/programs" }, { label: "PCOS & Thyroid", href: "/programs" }, { label: "Diabetes Diet", href: "/programs" }, { label: "Sports Nutrition", href: "/programs" } ] },
      { title: "Clinic", links: [ { label: "About Us", href: "/about" }, { label: "Plans & Pricing", href: "/pricing" }, { label: "Transformations", href: "/transformations" }, { label: "Online Consultation", href: "/online-consultation" }, { label: "Contact", href: "/contact" } ] },
    ],
    serviceAreas: ["Weight Loss", "PCOS Diet", "Thyroid Diet", "Diabetes Diet", "Sports Nutrition", "Online Diet Consultation"],
    contact: { phones: ["9000000000"], email: "hello@example.com", address: "Your City" },
    social: { facebook: "#", instagram: "#", whatsapp: "#", location: "#" },
    copyright: `© {year} ${biz}. Nutrition guidance does not replace medical treatment — please consult your doctor for medical conditions.`,
  }),
  seo: (biz) => ({
    title: `${biz} — Dietitian & Nutrition Clinic in Your City | Online Diet Plans`,
    description: "Certified dietitians for weight management, PCOS, thyroid, diabetes and sports nutrition. Home-food Indian diet plans, weekly follow-ups and online consultations from ₹1,499.",
    favicon: "", ogImage: "",
    keywords: "dietitian near me, nutritionist, weight loss diet plan, PCOS diet, thyroid diet, diabetes diet plan, sports nutritionist, online diet consultation",
    businessType: "MedicalBusiness", priceRange: "₹₹",
  }),
  services: [
    { category: "Weight Management", title: "Healthy Weight Loss", description: "Calorie-smart plans built on your home food — no crash diets, no starving." },
    { category: "Weight Management", title: "Healthy Weight Gain", description: "Nutrient-dense meal plans to build healthy weight and muscle." },
    { category: "Weight Management", title: "Post-Pregnancy Nutrition", description: "Gentle, lactation-friendly plans to regain energy and shape after delivery." },
    { category: "Lifestyle Conditions", title: "PCOS / PCOD Diet", description: "Low-GI, hormone-friendly eating to support cycles, energy and weight." },
    { category: "Lifestyle Conditions", title: "Thyroid Diet", description: "Balanced plans that work alongside your doctor's thyroid treatment." },
    { category: "Lifestyle Conditions", title: "Diabetes & Pre-Diabetes", description: "Carb-aware Indian meals designed to support steadier blood-sugar levels." },
    { category: "Lifestyle Conditions", title: "Heart & Cholesterol", description: "Low-sodium, fibre-rich plans for healthier lipid profiles." },
    { category: "Performance & Family", title: "Sports Nutrition", description: "Fuelling, recovery and supplement guidance for runners, lifters and athletes." },
    { category: "Performance & Family", title: "Kids & Teen Nutrition", description: "Fuss-free plans for growth, school energy and exam season." },
    { category: "Performance & Family", title: "Corporate Wellness", description: "Nutrition talks, health camps and group programs for workplaces." },
  ],
  gallery: [
    "Consultation room", "Body composition analysis", "Sample meal plate", "Healthy cooking workshop", "Online consultation", "Corporate health talk", "Client check-in", "Seasonal recipe book",
  ].map((caption) => ({ category: "Our Clinic", caption })),
  pages: (biz) => [
    {
      slug: "home", title: "Home", isSystem: true, order: 0,
      sections: [
        { type: "hero", content: {
          variant: "centered", customHtml: "",
          badge: "CERTIFIED DIETITIANS · CLINIC & ONLINE", titleTop: "Eat Real Food.", titleHighlight: "Feel Better Every Week.",
          subtitle: "", description: `${biz} builds personalised diet plans around the dal, roti and sabzi you already love — for weight management, PCOS, thyroid, diabetes and sports performance.`, image: "",
          primaryBtn: { label: "Book a Consultation", href: "/book-consultation" }, secondaryBtn: { label: "Explore Programs", href: "/programs" },
          features: [ { icon: "utensils", title: "Home-Food Plans", text: "" }, { icon: "user-check", title: "Certified Dietitians", text: "" }, { icon: "calendar", title: "Weekly Follow-ups", text: "" }, { icon: "phone", title: "WhatsApp Support", text: "" } ],
        } },
        { type: "logos", content: { title: "Corporate wellness partner for teams at", items: ["TechNova", "Shree Hospitals", "Urban Runners Club", "Greenleaf Schools", "Apex Bank", "FitFirst Gyms"] }, style: { background: "light" } },
        { type: "about", content: {
          eyebrow: "WHY US", title: "No Fads. No Pills.", titleHighlight: "Just Sensible Nutrition.",
          body: [`At ${biz} we believe a diet you can't follow at a family wedding isn't a diet worth having. Our dietitians design plans around your culture, budget, work hours and taste.`, "We work alongside your doctor — never replacing medical advice — and focus on habits that stay with you long after the program ends."],
          image: "", points: ["Veg, Jain, eggetarian & non-veg plans", "Review of blood reports with your plan", "Festival, travel & eating-out guides", "No mandatory supplements"],
          buttonLabel: "Meet the Team", buttonHref: "/about",
        } },
        { type: "serviceCategories", content: { eyebrow: "DIET PROGRAMS", title: "Plans for", titleHighlight: "Every Goal", categories: ["Weight Management", "Lifestyle Conditions", "Performance & Family"] }, style: { cardRadius: "md", cardShadow: "md" } },
        { type: "steps", content: { eyebrow: "HOW IT WORKS", title: "Your Path to", titleHighlight: "Better Habits", items: [
          { title: "Consult", text: "History, reports, routine and food preferences", icon: "clipboard" },
          { title: "Analyse", text: "Body composition and lifestyle assessment", icon: "heart-pulse" },
          { title: "Personalised Plan", text: "Indian meals that fit your family kitchen", icon: "utensils" },
          { title: "Follow-up", text: "Weekly check-ins and plan adjustments", icon: "trending" },
        ] }, style: { layout: "cards", background: "light" } },
        { type: "stats", content: { items: [ { value: "6,000+", label: "Clients Guided", icon: "users" }, { value: "11+", label: "Years in Practice", icon: "award" }, { value: "20+", label: "Cities Served Online", icon: "map" }, { value: "4.9★", label: "Google Rating", icon: "star" } ] }, style: { layout: "minimal" } },
        { type: "features", content: { items: [
          { icon: "clipboard", title: "Report-Based Planning", text: "Your HbA1c, TSH, lipid and vitamin reports shape every plan." },
          { icon: "utensils", title: "Swap Lists", text: "Healthy alternatives for samosa cravings, mithai boxes and office birthdays." },
          { icon: "plane", title: "Travel & Festival Plans", text: "Stay on track through Diwali, Navratri fasts, weddings and work trips." },
          { icon: "phone", title: "WhatsApp Check-ins", text: "Send a photo of your plate and get feedback the same day." },
          { icon: "store", title: "Grocery Lists", text: "Weekly lists that work with your local kirana and sabzi mandi." },
          { icon: "heart", title: "Family-Friendly", text: "One kitchen, one menu — we adapt your plan to what the family eats." },
        ] }, style: { background: "dark", cardRadius: "md" } },
        { type: "testimonials", content: { eyebrow: "CLIENT STORIES", title: "Real People,", titleHighlight: "Real Progress", items: [
          { name: "Shalini Verma", role: "PCOS program · 6 months", text: "For the first time a diet didn't feel like punishment. My energy improved, my cycles became more regular and I lost 9 kg steadily — without giving up my mother's cooking.", rating: 5 },
          { name: "Rajesh Iyer", role: "Diabetes diet · 4 months", text: "I still eat idli and rice — just in the right way. My doctor was happy with my latest reports.", rating: 5 },
          { name: "Kunal Batra", role: "Marathon runner", text: "The sports nutrition plan fixed my mid-run crashes. I ran my best half marathon time this season.", rating: 5 },
          { name: "Anjali Nair", role: "Thyroid diet · 3 months", text: "No more afternoon slump. The swap lists are stuck on my fridge.", rating: 5 },
        ] }, style: { layout: "featured" } },
        { type: "pricingPlans", content: {
          eyebrow: "PROGRAMS & PRICING", title: "Pick a Program That", titleHighlight: "Fits Your Life",
          plans: [
            { name: "Kickstart", price: "₹2,999", period: "/1 month", features: ["Detailed consultation", "Personalised diet plan", "4 weekly follow-ups", "WhatsApp support"], featured: false, buttonLabel: "Get Started", buttonHref: "/book-consultation" },
            { name: "Transform", price: "₹7,499", period: "/3 months", features: ["Everything in Kickstart", "12 weekly follow-ups", "Monthly body composition", "Recipe & eating-out guide", "Plan pauses for travel"], featured: true, buttonLabel: "Get Started", buttonHref: "/book-consultation" },
            { name: "Lifestyle", price: "₹12,999", period: "/6 months", features: ["Everything in Transform", "Condition-specific plan (PCOS / thyroid / diabetes)", "Family meal planning", "Maintenance phase guidance"], featured: false, buttonLabel: "Get Started", buttonHref: "/book-consultation" },
          ],
        }, style: { background: "light", cardRadius: "lg", cardShadow: "lg" } },
        { type: "team", content: { eyebrow: "OUR DIETITIANS", title: "Qualified,", titleHighlight: "Caring Experts", members: [
          { name: "Dr. Nidhi Saxena", role: "Chief Clinical Dietitian", image: "", note: "PhD Nutrition · 14 yrs" },
          { name: "Aarti Kulkarni", role: "PCOS & Women's Health", image: "", note: "M.Sc. Dietetics · 9 yrs" },
          { name: "Farhan Siddiqui", role: "Sports Nutritionist", image: "", note: "Sports nutrition certified · 7 yrs" },
          { name: "Deepa Raman", role: "Diabetes Educator", image: "", note: "Certified diabetes educator · 10 yrs" },
        ] }, style: { layout: "list" } },
        { type: "appointmentForm", content: { title: "Book a Free 15-Minute Discovery Call", subtitle: "Pick a date and time. A dietitian will call you to understand your goal and suggest the right program — no obligation." }, style: { background: "light" } },
        { type: "faq", content: { eyebrow: "FAQ", title: "Common", titleHighlight: "Questions", items: [
          { q: "Will I have to give up rice, roti or sweets?", a: "No. We teach portion, pairing and timing so you can enjoy your regular foods. Plans are built around what you already eat." },
          { q: "How much weight will I lose?", a: "Every body responds differently, so we don't promise numbers. Most clients aim for a steady, sustainable pace, and we track progress weekly and adjust." },
          { q: "Can diet help my PCOS, thyroid or diabetes?", a: "Nutrition can support your treatment, but it doesn't replace it. We work alongside your doctor's advice and medication — never instead of it." },
          { q: "Do online consultations work as well as clinic visits?", a: "Yes. Online clients get the same plans, video follow-ups and WhatsApp support. Many clients across India prefer it." },
          { q: "Do you sell supplements?", a: "No supplements are mandatory. If one is genuinely useful for you, we explain why and you are free to choose any brand." },
          { q: "I'm vegetarian and work night shifts. Can you still help?", a: "Yes — we regularly plan for shift workers, with meal timings built around your sleep and duty hours." },
        ] } },
        { type: "cta", content: { title: "Start with a conversation", highlight: "Book Your Consultation", phones: ["9000000000"], buttonLabel: "Book Consultation", buttonHref: "/book-consultation" }, style: { layout: "split", background: "primary" } },
      ],
    },
    { slug: "about", title: "About Us", isSystem: true, order: 1, sections: [
      { type: "about", content: {
        eyebrow: "OUR STORY", title: "Nutrition Made", titleHighlight: "Practical",
        body: [`${biz} was founded by Dr. Nidhi Saxena after years in hospital dietetics, seeing patients struggle with generic diet charts they could never follow at home.`, "Today our team of qualified dietitians helps thousands of clients — in clinic and online — build eating habits that fit real Indian kitchens and busy lives."],
        image: "", points: ["Qualified M.Sc. & PhD dietitians", "Evidence-based, culture-friendly plans", "Collaboration with your doctor", "Privacy of your health data"],
        buttonLabel: "Book Consultation", buttonHref: "/book-consultation",
      } },
      { type: "features", content: { items: [
        { icon: "book", title: "Evidence First", text: "Every recommendation is grounded in current nutrition research." },
        { icon: "utensils", title: "Food You Love", text: "Regional cuisines, festivals and family meals all fit the plan." },
        { icon: "handshake", title: "Partners in Care", text: "We coordinate with your doctor when you have a medical condition." },
        { icon: "shield", title: "Safe & Private", text: "Your reports and health details stay confidential." },
      ] }, style: { background: "light", cardRadius: "md", cardShadow: "sm" } },
      { type: "team", content: { eyebrow: "THE TEAM", title: "Meet Our", titleHighlight: "Dietitians", members: [
        { name: "Dr. Nidhi Saxena", role: "Founder · Chief Clinical Dietitian", image: "", note: "PhD Nutrition · 14 yrs" },
        { name: "Aarti Kulkarni", role: "PCOS & Women's Health", image: "", note: "M.Sc. Dietetics · 9 yrs" },
        { name: "Farhan Siddiqui", role: "Sports Nutritionist", image: "", note: "Sports nutrition certified · 7 yrs" },
        { name: "Deepa Raman", role: "Diabetes Educator", image: "", note: "CDE · 10 yrs" },
        { name: "Sneha Bhat", role: "Paediatric Nutrition", image: "", note: "M.Sc. Food & Nutrition · 6 yrs" },
        { name: "Mohit Arora", role: "Client Success Coach", image: "", note: "Habit coaching · 5 yrs" },
      ] } },
      { type: "cta", content: { title: "Let's talk about your goals", highlight: "Free 15-Minute Discovery Call", phones: ["9000000000"], buttonLabel: "Book Consultation", buttonHref: "/book-consultation" }, style: { background: "dark" } },
    ] },
    { slug: "programs", title: "Diet Programs", isSystem: true, order: 2, sections: [
      { type: "serviceCategories", content: { eyebrow: "WHAT WE HELP WITH", title: "Diet", titleHighlight: "Programs", categories: ["Weight Management", "Lifestyle Conditions", "Performance & Family"] }, style: { cardRadius: "md", cardShadow: "md" } },
      { type: "features", content: { items: [
        { icon: "clipboard", title: "Report-Based Planning", text: "Your HbA1c, TSH, lipid and vitamin reports shape the plan." },
        { icon: "utensils", title: "Swap Lists", text: "Healthy alternatives for every craving and occasion." },
        { icon: "plane", title: "Travel & Festival Plans", text: "Stay on track through Diwali, weddings and work trips." },
        { icon: "heart-pulse", title: "Activity Guidance", text: "Simple movement goals that support your diet." },
      ] }, style: { background: "light", align: "center" } },
      { type: "faq", content: { eyebrow: "PROGRAM FAQ", title: "Choosing the", titleHighlight: "Right Program", items: [
        { q: "I have both PCOS and thyroid. Which program should I pick?", a: "Choose Lifestyle — your dietitian will design one plan that considers both, along with your doctor's treatment." },
        { q: "Do you make plans for vegetarians and Jains?", a: "Yes. We regularly create pure-veg, Jain, eggetarian and vegan plans." },
        { q: "Can my whole family follow the plan?", a: "Our Lifestyle program includes family meal planning so you don't cook separately." },
      ] } },
      { type: "testimonials", content: { eyebrow: "PROGRAM STORIES", title: "What Clients", titleHighlight: "Achieved", items: [
        { name: "Pooja Malhotra", role: "Post-pregnancy · 5 months", text: "Gentle, practical and kind. I got my energy back while still breastfeeding comfortably.", rating: 5 },
        { name: "Vikram Chauhan", role: "Weight loss · 6 months", text: "I travel 15 days a month and the eating-out guide saved me. Down 12 kg and still going.", rating: 5 },
      ] }, style: { layout: "minimal" } },
      { type: "cta", content: { title: "Not sure which program fits?", highlight: "Ask a Dietitian", phones: ["9000000000"], buttonLabel: "Book Consultation", buttonHref: "/book-consultation" }, style: { background: "primary" } },
    ] },
    { slug: "pricing", title: "Plans & Pricing", isSystem: true, order: 3, sections: [
      { type: "pricingPlans", content: {
        eyebrow: "PROGRAMS & PRICING", title: "Transparent", titleHighlight: "Pricing",
        plans: [
          { name: "Kickstart", price: "₹2,999", period: "/1 month", features: ["Detailed consultation", "Personalised diet plan", "4 weekly follow-ups", "WhatsApp support"], featured: false, buttonLabel: "Get Started", buttonHref: "/book-consultation" },
          { name: "Transform", price: "₹7,499", period: "/3 months", features: ["Everything in Kickstart", "12 weekly follow-ups", "Monthly body composition", "Recipe & eating-out guide", "Plan pauses for travel"], featured: true, buttonLabel: "Get Started", buttonHref: "/book-consultation" },
          { name: "Lifestyle", price: "₹12,999", period: "/6 months", features: ["Everything in Transform", "Condition-specific plan", "Family meal planning", "Maintenance phase guidance"], featured: false, buttonLabel: "Get Started", buttonHref: "/book-consultation" },
        ],
      }, style: { cardRadius: "lg", cardShadow: "lg" } },
      { type: "priceList", content: { eyebrow: "SINGLE SESSIONS", title: "Consultations &", titleHighlight: "Add-ons", note: "Prices include GST. Fees are for nutrition guidance only and are not a substitute for medical treatment.", groups: [
        { category: "Consultations", items: [ { name: "First consultation (clinic)", price: "₹1,499", note: "45 min + plan" }, { name: "Online consultation", price: "₹1,299", note: "video call + plan" }, { name: "Follow-up session", price: "₹599", note: "20 min" } ] },
        { category: "Add-ons", items: [ { name: "Body composition analysis", price: "₹499", note: "" }, { name: "Sports nutrition assessment", price: "₹1,999", note: "with training-day plan" }, { name: "Healthy cooking workshop", price: "₹799", note: "per person" } ] },
      ] }, style: { background: "light" } },
      { type: "countdown", content: { eyebrow: "NEW YEAR RESET", title: "₹1,000 Off the", titleHighlight: "Transform Program", subtitle: "Start the year with sustainable habits. Offer valid for new clients.", targetDate: "2027-01-15T23:59", buttonLabel: "Claim the Offer", buttonHref: "/book-consultation" }, style: { background: "dark" } },
      { type: "cta", content: { title: "Questions about plans?", highlight: "Call or WhatsApp Us", phones: ["9000000000"], buttonLabel: "Book Consultation", buttonHref: "/book-consultation" } },
    ] },
    { slug: "transformations", title: "Transformations", isSystem: true, order: 4, sections: [
      { type: "stats", content: { items: [ { value: "6,000+", label: "Clients Guided", icon: "users" }, { value: "85%", label: "Complete Their Program", icon: "check" }, { value: "4.9★", label: "Average Rating", icon: "star" }, { value: "20+", label: "Cities Online", icon: "map" } ] }, style: { background: "primary" } },
      { type: "testimonials", content: { eyebrow: "CLIENT STORIES", title: "Journeys That", titleHighlight: "Inspire Us", items: [
        { name: "Shalini Verma", role: "PCOS program · 6 months", text: "My energy improved, my cycles became more regular and I lost 9 kg steadily — without giving up my mom's cooking.", rating: 5 },
        { name: "Rajesh Iyer", role: "Diabetes diet · 4 months", text: "Learning how to pair foods made the biggest difference. My doctor was happy with my latest reports.", rating: 5 },
        { name: "Pooja Malhotra", role: "Post-pregnancy · 5 months", text: "Gentle, practical and kind. I got my energy back while still breastfeeding comfortably.", rating: 5 },
        { name: "Kunal Batra", role: "Marathon runner", text: "Proper fuelling fixed my mid-run crashes. I ran my best half marathon time this season.", rating: 5 },
        { name: "Anjali Nair", role: "Thyroid diet · 3 months", text: "I finally stopped feeling sluggish every afternoon. The swap lists are now stuck on my fridge.", rating: 5 },
        { name: "Vikram Chauhan", role: "Weight loss · 6 months", text: "I travel 15 days a month and the eating-out guide saved me. Down 12 kg and still going.", rating: 5 },
      ] } },
      { type: "gallery", content: { eyebrow: "INSIDE THE CLINIC", title: "Workshops &", titleHighlight: "Check-ins" }, style: { background: "light" } },
      { type: "cta", content: { title: "Individual results vary — your plan is built for you", highlight: "Start Your Journey", phones: ["9000000000"], buttonLabel: "Book Consultation", buttonHref: "/book-consultation" } },
    ] },
    { slug: "online-consultation", title: "Online Consultation", isSystem: true, order: 5, sections: [
      { type: "banner", content: { title: "Online Diet", titleHighlight: "Consultation", subtitle: "Expert dietitians on video call, wherever you live in India or abroad.", image: "", bgColor: "#0b2a20", imageOpacity: 50, overlayOpacity: 60 } },
      { type: "steps", content: { eyebrow: "HOW ONLINE WORKS", title: "Simple From", titleHighlight: "Anywhere", items: [
        { title: "Book a Slot", text: "Pick a time that suits your time zone", icon: "calendar" },
        { title: "Share Details", text: "Upload reports and a 3-day food log", icon: "clipboard" },
        { title: "Video Consult", text: "45-minute call with your dietitian", icon: "headset" },
        { title: "Plan on WhatsApp", text: "Personalised plan within 48 hours", icon: "phone" },
      ] } },
      { type: "features", content: { items: [
        { icon: "map", title: "Anywhere in the World", text: "Clients from 20+ Indian cities, the Gulf, UK and USA." },
        { icon: "clock", title: "Flexible Timings", text: "Early morning and late evening slots for busy schedules." },
        { icon: "store", title: "Local Grocery Lists", text: "Plans adapted to what's available near you." },
      ] }, style: { background: "light", cardRadius: "md" } },
      { type: "faq", content: { eyebrow: "ONLINE FAQ", title: "Consulting", titleHighlight: "Online", items: [
        { q: "Which app do you use for video calls?", a: "Google Meet or WhatsApp video — whichever you prefer. No downloads needed." },
        { q: "Do you take international clients?", a: "Yes. We consult clients in the Gulf, UK, USA and Australia, with slots planned around your time zone." },
        { q: "How do I pay?", a: "UPI, card or net banking for Indian clients; international cards or bank transfer for overseas clients." },
      ] } },
      { type: "cta", content: { title: "Consult from your sofa", highlight: "Book an Online Session", phones: ["9000000000"], buttonLabel: "Book Consultation", buttonHref: "/book-consultation" }, style: { background: "dark" } },
    ] },
    { slug: "book-consultation", title: "Book Consultation", isSystem: true, order: 6, sections: [
      { type: "quoteForm", content: { title: "Book Your Diet Consultation", subtitle: "Tell us your goal, any health conditions and whether you prefer clinic or online. A dietitian will call you within 24 hours.", showSidebar: true } },
      { type: "steps", content: { eyebrow: "BEFORE YOUR CONSULT", title: "Keep These", titleHighlight: "Ready", items: [
        { title: "Recent Reports", text: "Blood tests from the last 3–6 months", icon: "clipboard" },
        { title: "Medications", text: "List of current medicines and supplements", icon: "stethoscope" },
        { title: "Food Log", text: "What you ate over 2–3 typical days", icon: "utensils" },
      ] }, style: { background: "light" } },
      { type: "openingHours", content: { eyebrow: "CLINIC HOURS", title: "Consultation", titleHighlight: "Timings", note: "Online consultations also available 7 AM – 9 PM on request.", days: [
        { day: "Monday – Friday", hours: "9:00 AM – 7:30 PM" }, { day: "Saturday", hours: "9:00 AM – 2:00 PM" }, { day: "Sunday", hours: "Online only" },
      ] } },
    ] },
    { slug: "contact", title: "Contact", isSystem: true, order: 7, sections: [
      { type: "contactInfo", content: { eyebrow: "REACH US", title: "Get In", titleHighlight: "Touch", address: "Your City", phone: "9000000000", email: "hello@example.com", hours: "Mon–Fri 9 AM – 7:30 PM · Sat 9 AM – 2 PM", mapEmbed: "" } },
      { type: "map", content: { eyebrow: "", title: "Visit", titleHighlight: "the Clinic", address: "Your City", mapEmbed: "" } },
      { type: "contactForm", content: { title: "Send Us a Message", subtitle: "Questions about programs, corporate wellness or online consultations? We reply within one working day." }, style: { background: "light" } },
    ] },
  ],
};
