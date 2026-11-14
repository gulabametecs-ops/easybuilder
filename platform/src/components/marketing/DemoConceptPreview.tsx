import type { DemoDesign, DemoSector } from "./DemosExplorer";

const COPY: Record<string, { nav: string[]; cta: string; hero: string; sub: string; cards: string[] }> = {
  "ngo-charity": {
    nav: ["Causes", "Impact", "Get Involved", "Events", "Contact"],
    cta: "Donate Now",
    hero: "Every child deserves a chance to learn and grow.",
    sub: "Education, nutrition and healthcare — with 80G tax benefit on every gift.",
    cards: ["12,000 children supported", "80G tax exemption", "Volunteer with us"],
  },
  "social-foundation": {
    nav: ["About", "Initiatives", "Events", "Volunteer", "Contact"],
    cta: "Support Us",
    hero: "Health, skills and dignity — delivered on the ground.",
    sub: "Six grassroots programs. Public team. Live event reports.",
    cards: ["Health camps", "Financial literacy", "Livelihood skills"],
  },
  coaching: {
    nav: ["Courses", "Results", "Faculty", "Fees", "Free Demo"],
    cta: "Book Free Demo",
    hero: "Crack JEE, NEET, UPSC and SSC with expert faculty.",
    sub: "Small batches, weekly tests and a proven selection record.",
    cards: ["JEE / NEET", "UPSC & SSC", "Board tuition"],
  },
  school: {
    nav: ["About", "Academics", "Admissions", "Notices", "Contact"],
    cta: "Apply Now",
    hero: "A school where curiosity, character and results grow together.",
    sub: "CBSE curriculum, caring faculty and a campus your child will love.",
    cards: ["Academics", "Sports & arts", "Admissions open"],
  },
  "play-school": {
    nav: ["Programs", "Gallery", "Admissions", "Contact"],
    cta: "Book a Visit",
    hero: "A happy first school for ages 2 to 5.",
    sub: "Play-based learning, safe campus and warm teachers.",
    cards: ["Nursery", "LKG / UKG", "Day care"],
  },
  "primary-school": {
    nav: ["Academics", "Life at school", "Admissions", "Contact"],
    cta: "Enquire",
    hero: "Strong foundations for classes 1 to 5.",
    sub: "Activity-based learning with personal attention.",
    cards: ["English & maths", "Sports", "Transport"],
  },
  "education-consultancy": {
    nav: ["Destinations", "Services", "Success stories", "Contact"],
    cta: "Free counselling",
    hero: "Study in India or abroad — with a counsellor beside you.",
    sub: "University shortlists, visas and applications, handled end to end.",
    cards: ["Abroad", "In-India", "Visa support"],
  },
  "restaurant-hotel": {
    nav: ["Menu", "Reservations", "Gallery", "Contact"],
    cta: "Book a table",
    hero: "Food worth dressing up for.",
    sub: "Seasonal plates, warm service and a room for every occasion.",
    cards: ["Dining", "Private events", "Stay"],
  },
  "hospital-clinic": {
    nav: ["Departments", "Doctors", "Appointments", "Contact"],
    cta: "Book appointment",
    hero: "Care you can trust, close to home.",
    sub: "Specialists, diagnostics and 24×7 emergency support.",
    cards: ["OPD", "Lab & scans", "Emergency"],
  },
  "gym-fitness": {
    nav: ["Programs", "Trainers", "Timings", "Join"],
    cta: "Start free trial",
    hero: "Train hard. Feel better. Stay consistent.",
    sub: "Strength, cardio and classes with coaches who know your name.",
    cards: ["Gym floor", "Group classes", "Personal training"],
  },
  pharmacy: {
    nav: ["Medicines", "Upload Rx", "Lab tests", "Contact"],
    cta: "Order now",
    hero: "Medicines, prescriptions and lab tests — delivered.",
    sub: "Genuine stock, home delivery and a chemist you can call.",
    cards: ["Prescription", "OTC", "Lab tests"],
  },
  "wholesale-shop": {
    nav: ["Catalogue", "Bulk order", "About", "Contact"],
    cta: "Request quote",
    hero: "Wholesale prices. Reliable supply.",
    sub: "Stock for retailers — clear MOQs and fast dispatch.",
    cards: ["Grocery", "FMCG", "Bulk packs"],
  },
  manufacturing: {
    nav: ["Products", "Capacity", "Enquiry", "Contact"],
    cta: "Get a quote",
    hero: "Made to spec. Delivered on time.",
    sub: "Custom manufacturing and bulk orders for brands that need a factory partner.",
    cards: ["OEM", "Private label", "Export"],
  },
  "skill-learning": {
    nav: ["Classes", "Schedule", "Faculty", "Enroll"],
    cta: "Book a trial",
    hero: "Learn a skill you will actually use.",
    sub: "Karate, music, dance and more — small batches, real progress.",
    cards: ["Karate", "Music", "Dance"],
  },
  "home-services": {
    nav: ["Services", "Pricing", "Reviews", "Contact"],
    cta: "Get a quote",
    hero: "Electrician, plumber, carpenter — same-day help.",
    sub: "Trained technicians, clear prices, work guaranteed.",
    cards: ["Electrical", "Plumbing", "Painting"],
  },
  "events-training": {
    nav: ["Events", "Speakers", "Tickets", "Contact"],
    cta: "Register now",
    hero: "Learn from people who do the work.",
    sub: "Webinars, workshops and flagship conferences — book your seat.",
    cards: ["Webinars", "Workshops", "Corporate"],
  },
};

function copyFor(sector: DemoSector) {
  return (
    COPY[sector.id] ?? {
      nav: ["About", "Services", "Gallery", "Contact"],
      cta: "Get in touch",
      hero: sector.name,
      sub: sector.tagline,
      cards: ["Quality work", "Fair prices", "Easy booking"],
    }
  );
}

const DESKTOP_W = 1280;
const DESKTOP_H = 800;

/** Desktop-sized homepage mock, scaled to the left pane. */
export function DemoConceptPreview({
  sector,
  design,
}: {
  sector: DemoSector;
  design: DemoDesign;
}) {
  const c = design.colors;
  const copy = copyFor(sector);
  const darkHeader = design.header === "bold";
  const centered = design.header === "centered";
  const minimal = design.header === "minimal";
  const modern = design.header === "modern";
  const heroDark = design.hero === "gradient" || !design.hero;
  const ink = heroDark ? "#fff" : c.heading;
  const heroBg =
    design.hero === "gradient"
      ? `linear-gradient(135deg, ${c.dark} 0%, ${c.secondary} 55%, ${c.primary} 100%)`
      : design.hero === "split" || design.hero === "minimal" || design.hero === "centered"
        ? c.light
        : `linear-gradient(120deg, ${c.secondary}, ${c.primaryDark})`;

  return (
    <div className="flex h-full min-h-0 w-full flex-col justify-center">
      <div
        className="w-full"
        style={{
          containerType: "inline-size",
        }}
      >
        <div className="relative w-full overflow-hidden rounded-2xl shadow-[0_24px_80px_rgba(0,0,0,0.45)] ring-1 ring-white/20" style={{ height: `calc(${DESKTOP_H} / ${DESKTOP_W} * 100cqw)` }}>
          <div
            className="absolute left-0 top-0 origin-top-left bg-white"
            style={{
              width: DESKTOP_W,
              height: DESKTOP_H,
              transform: `scale(calc(100cqw / ${DESKTOP_W}))`,
            }}
          >
            <DesktopChrome host={`${sector.name.toLowerCase().replace(/[^a-z0-9]+/g, "")}.yoursite.in`} />

            <header
              className="flex h-[72px] items-center justify-between gap-6 px-10"
              style={darkHeader ? { background: c.dark } : { background: "#fff", boxShadow: "0 1px 0 rgba(0,0,0,0.06)" }}
            >
              {modern ? (
                <div className="flex w-full items-center justify-between rounded-full px-5 py-2.5 shadow-sm ring-1 ring-black/5" style={{ background: "#fff" }}>
                  <BrandMark sector={sector} color={c.heading} onDark={false} accent={c.primary} />
                  <Nav items={copy.nav} color={c.heading} />
                  <Cta label={copy.cta} bg={c.primary} />
                </div>
              ) : centered ? (
                <div className="flex w-full flex-col items-center gap-2">
                  <BrandMark sector={sector} color={c.heading} onDark={false} accent={c.primary} />
                  <Nav items={copy.nav} color={c.heading} />
                </div>
              ) : (
                <>
                  <BrandMark sector={sector} color={darkHeader ? "#fff" : c.heading} onDark={darkHeader} accent={c.primary} />
                  {!minimal && <Nav items={copy.nav} color={darkHeader ? "rgba(255,255,255,0.82)" : c.heading} />}
                  <Cta label={copy.cta} bg={c.primary} />
                </>
              )}
            </header>

            <div className="relative" style={{ height: 520, background: heroBg }}>
              {design.hero === "split" ? (
                <div className="grid h-full grid-cols-2">
                  <HeroCopy copy={copy} ink={c.heading} cta={c.primary} />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={sector.image} alt="" className="h-full w-full object-cover" />
                </div>
              ) : (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={sector.image} alt="" className="absolute inset-0 h-full w-full object-cover" />
                  <div
                    className="absolute inset-0"
                    style={{
                      background: heroDark
                        ? `linear-gradient(90deg, ${c.dark}ee 12%, ${c.dark}88 48%, transparent 78%)`
                        : `linear-gradient(90deg, ${c.light}f2 8%, ${c.light}cc 42%, transparent 75%)`,
                    }}
                  />
                  <HeroCopy
                    copy={copy}
                    ink={ink}
                    cta={c.primary}
                    centered={centered || design.hero === "centered" || design.hero === "minimal"}
                  />
                </>
              )}
            </div>

            <div className="grid grid-cols-3 gap-5 px-10 py-7" style={{ background: c.light, height: 172 }}>
              {copy.cards.map((card, i) => (
                <div
                  key={card}
                  className="flex items-center gap-4 rounded-2xl bg-white px-5 py-4 shadow-sm"
                  style={{ boxShadow: "0 1px 2px rgba(15,23,42,0.06), 0 0 0 1px rgba(15,23,42,0.04)" }}
                >
                  <span className="h-10 w-10 shrink-0 rounded-xl" style={{ background: i === 1 ? c.accent : c.primary, opacity: 0.9 }} />
                  <span className="text-[17px] font-semibold" style={{ color: c.heading }}>
                    {card}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <p className="mt-3 text-center text-[11px] font-medium tracking-wide text-white/45">
        Desktop preview · {design.name} look
      </p>
    </div>
  );
}

function DesktopChrome({ host }: { host: string }) {
  return (
    <div className="flex h-9 items-center gap-3 border-b border-black/[0.06] bg-[#ecebe7] px-3">
      <span className="flex gap-1.5">
        <span className="h-[11px] w-[11px] rounded-full bg-[#ff5f57]" />
        <span className="h-[11px] w-[11px] rounded-full bg-[#febc2e]" />
        <span className="h-[11px] w-[11px] rounded-full bg-[#28c840]" />
      </span>
      <span className="mx-auto flex h-6 w-[420px] items-center justify-center rounded-md bg-white text-[11px] text-slate-500 shadow-sm">
        https://{host}
      </span>
    </div>
  );
}

function BrandMark({
  sector,
  color,
  onDark,
  accent,
}: {
  sector: DemoSector;
  color: string;
  onDark: boolean;
  accent?: string;
}) {
  return (
    <span className="flex min-w-0 items-center gap-2.5">
      <span
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[11px] font-black text-white"
        style={{ background: accent || color }}
      >
        {sector.name.replace(/[^A-Za-z]/g, "").slice(0, 2).toUpperCase()}
      </span>
      <span className="truncate text-[17px] font-bold tracking-tight" style={{ color: onDark ? "#fff" : color }}>
        {sector.name}
      </span>
    </span>
  );
}

function Nav({ items, color }: { items: string[]; color: string }) {
  return (
    <span className="flex items-center gap-6">
      {items.map((n) => (
        <span key={n} className="text-[14px] font-medium" style={{ color }}>
          {n}
        </span>
      ))}
    </span>
  );
}

function Cta({ label, bg }: { label: string; bg: string }) {
  return (
    <span className="shrink-0 rounded-full px-5 py-2 text-[13px] font-semibold text-white" style={{ background: bg }}>
      {label}
    </span>
  );
}

function HeroCopy({
  copy,
  ink,
  cta,
  centered,
}: {
  copy: { hero: string; sub: string; cta: string };
  ink: string;
  cta: string;
  centered?: boolean;
}) {
  return (
    <div className={`relative flex h-full max-w-[640px] flex-col justify-center gap-5 px-12 ${centered ? "mx-auto items-center text-center" : "items-start"}`}>
      <p className="text-[40px] font-bold leading-[1.15] tracking-tight" style={{ color: ink }}>
        {copy.hero}
      </p>
      <p className="max-w-[480px] text-[18px] leading-relaxed" style={{ color: ink, opacity: 0.82 }}>
        {copy.sub}
      </p>
      <span className="mt-1 rounded-full px-6 py-2.5 text-[15px] font-semibold text-white" style={{ background: cta }}>
        {copy.cta}
      </span>
    </div>
  );
}
