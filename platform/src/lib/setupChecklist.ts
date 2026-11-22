// Dashboard "Getting started" checklist. Pure: the dashboard gathers the facts,
// this decides what's done. "Done" means changed from the template the site
// was provisioned with, so untouched placeholders don't tick.

export type ChecklistFacts = {
  logoImage: string;
  primaryColor: string;
  /** Primary colours the site could have out of the box (template + design presets). */
  templatePrimaries: string[];
  services: number;
  gallery: number;
  phones: string[];
  email: string;
  templatePhones: string[];
  templateEmail: string;
  seoTitle: string;
  seoDescription: string;
  templateSeoTitle: string;
  templateSeoDescription: string;
  /** null = plan doesn't include a custom domain (item hidden). */
  domainConnected: boolean | null;
  leads: number;
};

export type ChecklistItem = { id: string; label: string; hint: string; href: string; done: boolean };

const norm = (s: string) => s.trim().toLowerCase();
const digits = (s: string) => s.replace(/\D/g, "");

export function buildChecklist(f: ChecklistFacts): ChecklistItem[] {
  const tplPhones = new Set(f.templatePhones.map(digits));
  const realPhone = f.phones.some((p) => digits(p).length >= 8 && !tplPhones.has(digits(p)));
  const realEmail = f.email.includes("@") && norm(f.email) !== norm(f.templateEmail) && !/@example\./i.test(f.email);
  const tplColors = new Set(f.templatePrimaries.map(norm));
  const seoDone =
    f.seoTitle.trim().length >= 10 && f.seoDescription.trim().length >= 50 &&
    (f.seoTitle.trim() !== f.templateSeoTitle.trim() || f.seoDescription.trim() !== f.templateSeoDescription.trim()) &&
    !/your city/i.test(`${f.seoTitle} ${f.seoDescription}`);

  const items: ChecklistItem[] = [
    { id: "logo", label: "Upload your logo", hint: "Shown in the header of every page", href: "/admin/appearance", done: !!f.logoImage.trim() },
    { id: "colors", label: "Set your brand colours", hint: "Make the site match your signboard", href: "/admin/appearance", done: !!f.primaryColor && !tplColors.has(norm(f.primaryColor)) },
    { id: "services", label: "Add at least 3 services", hint: `${f.services} added so far`, href: "/admin/services", done: f.services >= 3 },
    { id: "gallery", label: "Add 5 or more gallery photos", hint: `${f.gallery} added so far`, href: "/admin/gallery", done: f.gallery >= 5 },
    { id: "contact", label: "Add your phone & email", hint: "Replace the sample contact details", href: "/admin/appearance", done: realPhone && realEmail },
    { id: "seo", label: "Write your Google title & description", hint: "How you appear in search results", href: "/admin/seo", done: seoDone },
  ];
  if (f.domainConnected !== null) {
    items.push({ id: "domain", label: "Connect your own domain", hint: "e.g. www.yourbusiness.in", href: "/admin/settings", done: f.domainConnected });
  }
  items.push({ id: "lead", label: "Receive your first enquiry", hint: "Share your site to get it", href: "/admin/share", done: f.leads > 0 });
  return items;
}
