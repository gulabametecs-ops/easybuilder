import Link from "next/link";
import { Palette, LayoutDashboard, Inbox, Globe, Rocket, Wrench, Check, ArrowRight, Star, ShieldCheck, Zap, MousePointerClick, PencilRuler, Images, Send, HelpCircle } from "lucide-react";
import { VERTICALS } from "@/lib/verticals";
import { DURATIONS, priceFor, formatINR, resolveTiers } from "@/lib/plans";
import { getPlatformConfig } from "@/lib/platformConfig";
import { img } from "@/lib/img";
import { VerticalIcon } from "@/components/marketing/VerticalIcon";
import { DemoForm } from "@/components/marketing/DemoForm";
import { PricingSection } from "@/components/marketing/PricingSection";

const ROOT = process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? "localhost:3000";
const DEMO_URL = "http://demo." + ROOT;

const FEATURES = [
  { icon: Palette, title: "Full theme control", text: "Clients change colors, fonts, logo, header & footer — no code, live instantly." },
  { icon: LayoutDashboard, title: "Own admin panel", text: "Every client gets a private dashboard to manage their whole website." },
  { icon: Inbox, title: "Leads & appointments", text: "Quote and booking forms flow straight into the client's inbox." },
  { icon: Globe, title: "Own domain", text: "Each site on client.yourdomain.com — custom domains supported." },
  { icon: Wrench, title: "Ready content", text: "Services, gallery, pages pre-filled per sector. Edit, don't build." },
  { icon: Rocket, title: "Launch in minutes", text: "Pay and a complete website is provisioned automatically." },
];
const STEPS = [
  { n: 1, icon: MousePointerClick, t: "Pick your sector & plan", d: "Choose your industry and a subscription that fits — pay securely in seconds." },
  { n: 2, icon: PencilRuler, t: "Customize your site", d: "Change theme colors, fonts, logo, header & footer from your admin panel — no code." },
  { n: 3, icon: Images, t: "Add your content", d: "Add your services, photos, pages and business details. Everything is editable." },
  { n: 4, icon: Send, t: "Go live & get leads", d: "Share your link. Quote and appointment requests land straight in your inbox." },
];
const STATS = [{ v: "8+", l: "Industries" }, { v: "100%", l: "Customizable" }, { v: "5 min", l: "To launch" }, { v: "24/7", l: "Always online" }];
const TESTIMONIALS = [
  { n: "Rahul M.", r: "Home-service owner", t: "Got my website live in minutes and started getting leads the same week." },
  { n: "Dr. Anita", r: "Clinic owner", t: "Patients now book appointments online. The admin panel is so easy." },
  { n: "Sana K.", r: "Consultancy founder", t: "The study-abroad template had everything — universities, courses, forms." },
];
const FAQS = [
  { q: "Do I need any coding or technical skills?", a: "Not at all. Everything is point-and-click from your admin panel — change text, images, colours, services and pages without touching code." },
  { q: "Can I use my own domain?", a: "Yes. You start on a free subdomain (yourname.ourdomain.com) and can connect your own custom domain anytime on the Premium plan." },
  { q: "How fast does my website go live?", a: "Instantly. The moment your payment succeeds, your complete website and admin panel are created automatically." },
  { q: "Can I change my content later?", a: "Anytime. Add or edit services, gallery photos, pages, testimonials, contact details and theme whenever you want — changes go live immediately." },
  { q: "How do leads and appointments work?", a: "Every quote, contact and booking form on your site saves directly to your admin panel, where you can track status, call the customer and mark it done." },
  { q: "What if I want to cancel or get a refund?", a: "You can cancel anytime — a time-based plan simply won't renew. We also offer a 7-day refund window on your first purchase (see Terms)." },
  { q: "Do you offer a demo first?", a: "Yes — explore fully-working live demos for every sector, including the admin panel, before you buy." },
  { q: "Is my data safe?", a: "Yes. Each business is fully isolated, sessions are secure, and the leads you collect belong only to you." },
];

const card = "rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-white/[0.03]";
const h2 = "text-3xl font-extrabold text-slate-900 dark:text-white";
const muted = "text-slate-500 dark:text-slate-400";

export default async function Landing() {
  const cfg = await getPlatformConfig();
  const tiers = resolveTiers(cfg.planOverrides);
  const startPrice = formatINR(Math.min(...tiers.map((t) => priceFor(t, DURATIONS[0]))));

  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_10%,rgba(132,204,22,0.16),transparent_45%)]" />
        <div className="absolute inset-0 [background-image:linear-gradient(rgba(0,0,0,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.04)_1px,transparent_1px)] dark:[background-image:linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:44px_44px] [mask-image:radial-gradient(circle_at_center,black,transparent_75%)]" />
        <div className="relative mx-auto max-w-6xl px-4 pt-24 pb-16 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-lime-500/15 text-lime-700 dark:text-lime-300 text-xs font-semibold px-4 py-1.5 mb-6 tracking-wide">
            <Zap className="w-3.5 h-3.5" /> WEBSITES FOR EVERY SERVICE BUSINESS
          </span>
          <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 dark:text-white leading-[1.05] max-w-4xl mx-auto">
            Sell branded websites that your <span className="text-lime-600 dark:text-lime-400">clients control</span>
          </h1>
          <p className="mt-6 text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            One platform to launch complete, customizable websites for home services, clinics, restaurants,
            consultancies and more — each with its own admin panel, leads and bookings.
          </p>
          <div className="mt-9 flex flex-wrap gap-3 justify-center">
            <Link href="/subscribe" className="inline-flex items-center gap-2 rounded-full bg-lime-500 text-white font-semibold px-7 py-3.5 hover:bg-lime-600">Start from {startPrice} <ArrowRight className="w-4 h-4" /></Link>
            <Link href="/demos" className="inline-flex items-center gap-2 rounded-full border border-black/15 dark:border-white/20 text-slate-800 dark:text-white px-7 py-3.5 font-semibold hover:bg-black/5 dark:hover:bg-white/10">Explore live demos</Link>
          </div>
          <div className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {STATS.map((s) => (<div key={s.l}><div className="text-3xl font-extrabold text-slate-900 dark:text-white">{s.v}</div><div className={`text-sm ${muted}`}>{s.l}</div></div>))}
          </div>
        </div>
      </section>

      {/* Sectors with images */}
      <section id="sectors" className="py-20 border-t border-black/5 dark:border-white/10 bg-slate-50 dark:bg-white/[0.02]">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center mb-12"><h2 className={h2}>Built for every sector</h2><p className={`mt-2 ${muted}`}>Pick your industry — each comes with a ready-made template.</p></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {VERTICALS.map((v) => (
              <Link key={v.id} href={`/subscribe?vertical=${v.id}`} className={`group overflow-hidden ${card} hover:border-lime-500/50 hover:shadow-lg transition`}>
                <div className="relative h-32">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img(v.name, 600, 300)} alt={v.name} className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <span className="absolute top-3 left-3 w-10 h-10 rounded-xl flex items-center justify-center backdrop-blur bg-white/90 text-slate-900"><VerticalIcon name={v.icon} className="w-5 h-5" /></span>
                  <span className={`absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full ${v.status === "live" ? "bg-lime-500 text-white" : "bg-amber-400 text-slate-900"}`}>{v.status === "live" ? "LIVE" : "SOON"}</span>
                </div>
                <div className="p-4">
                  <p className="text-slate-900 dark:text-white font-semibold group-hover:text-lime-600 dark:group-hover:text-lime-400">{v.name}</p>
                  <p className={`text-xs mt-0.5 ${muted}`}>{v.tagline}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 border-t border-black/5 dark:border-white/10">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center mb-12"><h2 className={h2}>Everything a client needs</h2><p className={`mt-2 ${muted}`}>One platform, unlimited branded websites.</p></div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f) => (
              <div key={f.title} className={`p-6 ${card}`}>
                <span className="inline-flex w-11 h-11 rounded-xl bg-lime-500/15 items-center justify-center mb-4"><f.icon className="w-5 h-5 text-lime-600 dark:text-lime-400" /></span>
                <h3 className="text-slate-900 dark:text-white font-semibold">{f.title}</h3>
                <p className={`text-sm mt-1.5 ${muted}`}>{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="py-20 border-t border-black/5 dark:border-white/10 bg-slate-50 dark:bg-white/[0.02]">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center mb-14">
            <p className="text-lime-600 dark:text-lime-400 text-sm font-semibold tracking-wider uppercase mb-2">Get started in minutes</p>
            <h2 className={h2}>How it works</h2>
            <p className={`mt-2 ${muted}`}>From sign-up to your first lead — four simple steps, zero code.</p>
          </div>
          <div className="relative grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* connector line behind steps (desktop) */}
            <div className="hidden lg:block absolute top-9 left-[12%] right-[12%] h-0.5 bg-gradient-to-r from-lime-500/0 via-lime-500/40 to-lime-500/0" />
            {STEPS.map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.n} className={`relative p-6 text-center ${card} hover:shadow-lg transition`}>
                  <div className="relative w-16 h-16 mx-auto">
                    <div className="w-16 h-16 rounded-2xl bg-lime-500/15 flex items-center justify-center">
                      <Icon className="w-7 h-7 text-lime-600 dark:text-lime-400" />
                    </div>
                    <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-lime-500 text-white text-xs font-bold flex items-center justify-center">{s.n}</span>
                  </div>
                  <h3 className="text-slate-900 dark:text-white font-semibold mt-4">{s.t}</h3>
                  <p className={`text-sm mt-1.5 ${muted}`}>{s.d}</p>
                </div>
              );
            })}
          </div>
          <div className="text-center mt-12">
            <Link href="/subscribe" className="inline-flex items-center gap-2 rounded-full bg-lime-500 text-white font-semibold px-7 py-3 hover:bg-lime-600">Get started now <ArrowRight className="w-4 h-4" /></Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 border-t border-black/5 dark:border-white/10">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center mb-12"><h2 className={h2}>Loved by business owners</h2></div>
          <div className="grid sm:grid-cols-3 gap-5">
            {TESTIMONIALS.map((t) => (
              <div key={t.n} className={`p-6 ${card}`}>
                <div className="flex gap-0.5 mb-3">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className="w-4 h-4 text-lime-500 fill-lime-500" />)}</div>
                <p className="text-slate-700 dark:text-slate-300 italic">“{t.t}”</p>
                <p className="mt-4 text-slate-900 dark:text-white font-semibold">{t.n}</p><p className={`text-xs ${muted}`}>{t.r}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <PricingSection tiers={tiers} />

      {/* FAQ */}
      <section id="faq" className="py-20 border-t border-black/5 dark:border-white/10">
        <div className="mx-auto max-w-5xl px-4">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 rounded-full bg-lime-500/15 text-lime-700 dark:text-lime-300 text-xs font-semibold px-4 py-1.5 mb-3"><HelpCircle className="w-3.5 h-3.5" /> FAQ</span>
            <h2 className={h2}>Questions? Answered.</h2>
            <p className={`mt-2 ${muted}`}>Everything you need to know before getting started.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {FAQS.map((f) => (
              <details key={f.q} className={`group ${card} open:shadow-md transition`}>
                <summary className="cursor-pointer list-none flex items-start justify-between gap-3 p-5 font-semibold text-slate-900 dark:text-white">
                  <span>{f.q}</span>
                  <span className="shrink-0 w-6 h-6 rounded-full bg-lime-500/15 flex items-center justify-center mt-0.5"><ArrowRight className="w-3.5 h-3.5 text-lime-600 dark:text-lime-400 group-open:rotate-90 transition-transform" /></span>
                </summary>
                <p className={`px-5 pb-5 text-sm ${muted}`}>{f.a}</p>
              </details>
            ))}
          </div>
          <div className={`mt-8 rounded-2xl p-6 text-center ${card}`}>
            <p className="text-slate-900 dark:text-white font-semibold">Still have questions?</p>
            <p className={`text-sm mt-1 ${muted}`}>We're happy to help you get set up.</p>
            <a href="#demo" className="mt-4 inline-flex items-center gap-2 rounded-full border border-black/15 dark:border-white/20 text-slate-800 dark:text-white px-6 py-2.5 text-sm font-semibold hover:bg-black/5 dark:hover:bg-white/10">Contact us <ArrowRight className="w-4 h-4" /></a>
          </div>
        </div>
      </section>

      {/* CTA + demo */}
      <section id="demo" className="py-20 border-t border-black/5 dark:border-white/10 bg-slate-50 dark:bg-white/[0.02]">
        <div className="mx-auto max-w-5xl px-4 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className={h2}>Ready to launch?</h2>
            <p className={`mt-3 ${muted}`}>Start now, or request a guided demo. Explore the <a href={DEMO_URL} className="text-lime-600 dark:text-lime-400 underline">live demo</a> first.</p>
            <ul className="mt-6 space-y-2.5">
              {["No credit card to start", "Website ready in minutes", "Cancel anytime", "Free subdomain included"].map((t) => (
                <li key={t} className="flex items-center gap-2 text-slate-700 dark:text-slate-300"><Check className="w-4 h-4 text-lime-500" /> {t}</li>
              ))}
            </ul>
            <div className={`mt-6 flex items-center gap-2 text-sm ${muted}`}><ShieldCheck className="w-4 h-4 text-lime-500" /> Trusted, secure &amp; always online.</div>
          </div>
          <div className={`p-6 ${card}`}><DemoForm /></div>
        </div>
      </section>
    </main>
  );
}
