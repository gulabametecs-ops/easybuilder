import { LAST_UPDATED } from "@/components/marketing/LegalPage";
import type { FooterConfig } from "@/lib/config";

/**
 * Default privacy notice for every tenant site at /privacy. Rendered by the
 * catch-all route only when the tenant has no published page of its own with
 * slug "privacy" (a custom page always wins).
 */
export function TenantPrivacy({ bizName, contact }: { bizName: string; contact: FooterConfig["contact"] }) {
  const phones = contact.phones.filter(Boolean);
  const reach = contact.email ? (
    <a href={`mailto:${contact.email}`}>{contact.email}</a>
  ) : phones[0] ? (
    <a href={`tel:${phones[0].replace(/\s/g, "")}`}>{phones[0]}</a>
  ) : (
    "the contact details on this website"
  );

  return (
    <section className="site-sec py-16 sm:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 text-[15px] leading-relaxed [&_p]:mb-4 [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mb-1.5 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mt-10 [&_h2]:mb-3 [&_h2]:text-[var(--c-heading)] [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2">
        <h1 className="text-3xl sm:text-4xl font-bold text-[var(--c-heading)]">Privacy Policy</h1>
        <p className="site-muted text-sm mt-2">Last updated: {LAST_UPDATED}</p>

        <p>
          This notice explains how {bizName} (&ldquo;we&rdquo;, &ldquo;us&rdquo;) handles the personal data you share
          through this website, in line with the Digital Personal Data Protection Act, 2023 and the Information Technology
          Act, 2000.
        </p>

        <h2>Who is responsible for your data</h2>
        <p>
          {bizName} is the <strong>Data Fiduciary</strong> (data controller) for the information you submit on this website,
          including enquiries, appointment bookings, volunteer applications, donations and student results. This website is
          built and hosted on the SitePixl platform, which stores and processes that data <strong>on our behalf</strong>{" "}
          as our Data Processor and does not use it for its own purposes.
        </p>

        <h2>What we collect</h2>
        <ul>
          <li><strong>Enquiries and quote requests:</strong> your name, phone number, email, location and message.</li>
          <li><strong>Appointment bookings:</strong> the above, plus the service, date and time you choose.</li>
          <li><strong>Volunteer applications:</strong> your name, contact details, age, gender, city, interests, availability and experience.</li>
          <li>
            <strong>Donations:</strong> your name, email, phone and the amount. Online payments are processed by Razorpay; we
            never see or store your card, UPI or bank login details.
          </li>
          <li><strong>Student results:</strong> where we publish results, the student details needed to look them up, such as roll number and marks.</li>
          <li><strong>Technical data:</strong> basic logs such as IP address and browser type, kept for security, and any analytics tools we use.</li>
        </ul>

        <h2>How we use it</h2>
        <p>
          Only to reply to you, manage your booking or application, process and acknowledge your donation (including tax
          receipts), publish results, keep this website secure, and meet our legal obligations. We do not sell your data.
          By submitting a form on this website you consent to this use; you can withdraw consent at any time by contacting us.
        </p>

        <h2>Children</h2>
        <p>
          If information about a child (anyone under 18) is submitted, for example for an admission enquiry or results, it
          must be submitted by, or with the consent of, a parent or lawful guardian. We do not use children&rsquo;s data for
          tracking or targeted advertising.
        </p>

        <h2>Sharing and retention</h2>
        <p>
          Your data is shared only with the service providers that run this website (hosting, email delivery and payment
          processing) and with authorities where the law requires. We keep it only as long as needed for the purpose you gave
          it for, or as long as the law requires (for example, donation and tax records).
        </p>

        <h2>Your rights</h2>
        <p>
          You can ask us to give you a summary of your data, correct or update it, erase it, or nominate someone to act for
          you, and you can raise a grievance with us. If you are not satisfied with our reply, you may approach the Data
          Protection Board of India.
        </p>

        <h2>Contact us</h2>
        <p>For any privacy question or request, contact {bizName} at {reach}.</p>
        {(phones.length > 0 || contact.address) && (
          <ul>
            {phones.length > 0 && <li>Phone: {phones.join(", ")}</li>}
            {contact.email && <li>Email: <a href={`mailto:${contact.email}`}>{contact.email}</a></li>}
            {contact.address && <li>Address: {contact.address}</li>}
          </ul>
        )}
      </div>
    </section>
  );
}
