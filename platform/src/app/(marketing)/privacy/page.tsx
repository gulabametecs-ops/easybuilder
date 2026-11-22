import type { Metadata } from "next";
import { LegalPage, getBusiness, BusinessDetails, GrievanceOfficer, EmailLink, type LegalSection } from "@/components/marketing/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy — SitePixl",
  description: "How SitePixl collects, uses, shares and protects personal data, in line with Indian law.",
};

export default async function PrivacyPage() {
  const b = await getBusiness();

  const sections: LegalSection[] = [
    {
      id: "who-we-are",
      title: "Who we are",
      body: (
        <>
          <p>
            {b.name}{" "}(&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) provides ready-made websites and admin panels to
            businesses and organisations in India, such as schools, clinics, gyms, NGOs and restaurants. We operate this
            website, the live-demo sandbox, the AI website builder, the checkout and the platform that hosts our
            customers&rsquo; websites (together, the &ldquo;Service&rdquo;).
          </p>
          <BusinessDetails b={b} />
        </>
      ),
    },
    {
      id: "what-we-collect",
      title: "What we collect",
      body: (
        <>
          <h3>Account information</h3>
          <p>
            When you sign up or subscribe: your name, business or organisation name, email address, mobile number, chosen
            website address (subdomain), sector, and a password (stored only as a one-way hash). If you are a
            super-admin user or a staff member of a customer, we also record your login activity.
          </p>
          <h3>Billing information</h3>
          <p>
            Your plan, amount, coupon used, order and payment references, billing name and address, GSTIN (if you give
            one) and the GST invoices we issue. Payments are processed by <strong>Razorpay</strong>. Card, UPI, net-banking
            and wallet details are entered on Razorpay&rsquo;s secure checkout and are never received or stored by us; we
            only receive a payment ID and status.
          </p>
          <p>
            If you join our referral program, we also store who you referred, the commissions you earn, and the payout details
            you give us for withdrawals (UPI ID or bank account name, number and IFSC, and PAN if provided), which we use only to
            pay you and keep tax records.
          </p>
          <h3>Live-demo sandbox</h3>
          <p>
            To open a demo we ask for your name, email, phone number and business name, and verify you with a one-time
            password (OTP) that is shown on screen or sent to you on WhatsApp. Anything you add or change inside the
            sandbox (sample enquiries, pages, settings) is stored only for the life of that sandbox.
          </p>
          <h3>AI website builder</h3>
          <p>
            The business name, description, colours and other text you type into the AI builder (your
            &ldquo;prompt&rdquo;) and the website draft generated from it. Please do not include sensitive personal data
            (health, financial or children&rsquo;s details) in a prompt.
          </p>
          <h3>Content you upload</h3>
          <p>
            Text, logos, photographs, documents and other files you add to your website or admin panel.
          </p>
          <h3>Technical data and cookies</h3>
          <p>
            IP address, browser and device type, pages visited, referring page, date and time of requests, and error
            logs, collected automatically when you use the Service. We use a small number of cookies and browser storage
            entries that are needed for the Service to work (see <a href="#cookies">Cookies</a>). We do not use
            advertising cookies on this website.
          </p>
          <h3>Visitor statistics on our customers&rsquo; websites</h3>
          <p>
            To show each customer how many people visit their website, we count page views on our own servers
            (first-party). We store only an aggregate total per page per day; we do not store IP addresses, set cookies or
            build profiles of individual visitors, and these counts are deleted after 13 months.
          </p>
        </>
      ),
    },
    {
      id: "purposes",
      title: "Why we use it, and your consent",
      body: (
        <>
          <p>We process personal data only for clear, lawful purposes:</p>
          <ul>
            <li>to create and run your account, website and admin panel;</li>
            <li>to process payments, issue GST invoices and keep the accounting records required by law;</li>
            <li>to run the demo sandbox and verify you by OTP;</li>
            <li>to generate a website draft from your AI-builder prompt;</li>
            <li>to send service emails and messages (renewal reminders, password resets, security alerts, notifications of new enquiries on your website, replies to your questions);</li>
            <li>to keep the Service secure, prevent fraud and abuse, and fix problems;</li>
            <li>to comply with legal obligations and respond to lawful requests from authorities.</li>
          </ul>
          <p>
            We rely on your consent, which you give when you submit a form that links to this policy, and on the
            &ldquo;legitimate uses&rdquo; allowed by Section 7 of the Digital Personal Data Protection Act, 2023 (for
            example, where you voluntarily give us data to obtain a service, or where law requires us to keep it). You can
            withdraw consent at any time by writing to <EmailLink b={b} />. Withdrawal does not affect processing already
            done, and we may then be unable to provide the parts of the Service that depend on that data.
          </p>
          <p>
            We send marketing messages only if you have asked for them, and every such message lets you opt out. We do
            not sell or rent personal data.
          </p>
        </>
      ),
    },
    {
      id: "our-role",
      title: "Our role: Data Fiduciary and Data Processor",
      body: (
        <>
          <p>
            <strong>For our own customers and visitors</strong> (account, billing, demo and AI-builder data described
            above), {b.name} is the <strong>Data Fiduciary</strong>: we decide why and how that data is processed.
          </p>
          <p>
            <strong>For the visitors of our customers&rsquo; websites</strong>, the position is different. When a school,
            clinic, NGO or other business uses our platform to collect enquiries, appointment bookings, volunteer
            applications, donations, student results or similar data from its own visitors, <strong>that business is the
            Data Fiduciary</strong> for that data and {b.name} acts only as its <strong>Data Processor</strong>. We store
            and process that data on the customer&rsquo;s behalf and under its instructions, and we do not use it for our
            own purposes.
          </p>
          <p>
            If you submitted information on one of our customers&rsquo; websites and want to access, correct or delete it,
            please contact that business directly; its details are on its website&rsquo;s privacy page. If you contact us
            instead, we will pass your request to the business concerned.
          </p>
        </>
      ),
    },
    {
      id: "sharing",
      title: "Who we share data with",
      body: (
        <>
          <p>
            We share personal data only with service providers who help us run the Service, under contracts that require
            them to protect it and use it only for that purpose:
          </p>
          <ul>
            <li>
              <strong>Payment processing:</strong> Razorpay Software Private Limited, for subscription payments (and for
              donations on customer websites that enable it).
            </li>
            <li>
              <strong>Hosting and file storage:</strong> our cloud hosting provider (Vercel Inc.), including Vercel Blob for
              uploaded files, and our database hosting provider.
            </li>
            <li>
              <strong>Email delivery:</strong> Resend, for account, invoice and notification emails.
            </li>
            <li>
              <strong>AI generation:</strong> Groq, Inc., which receives your AI-builder prompt to generate a website
              draft. We do not send your account or billing details to the AI provider.
            </li>
            <li>
              <strong>OTP messaging:</strong> Meta Platforms (WhatsApp Business Platform), when a demo OTP is sent to your
              WhatsApp number.
            </li>
          </ul>
          <p>
            We may also disclose data when required by law, a court order or a lawful request from a government agency;
            to protect the rights, safety or property of our users or the public; or to a successor if our business is
            merged or transferred, in which case this policy will continue to apply.
          </p>
        </>
      ),
    },
    {
      id: "cross-border",
      title: "Transfers outside India",
      body: (
        <p>
          Some of our providers (for example our hosting, email and AI providers) store or process data on servers outside
          India, including in the United States. Section 16 of the DPDP Act permits such transfers except to countries the
          Central Government restricts by notification, and we will not transfer data to any restricted country. Wherever
          data is processed, we require the same level of protection described in this policy.
        </p>
      ),
    },
    {
      id: "retention",
      title: "How long we keep data",
      body: (
        <ul>
          <li>
            <strong>Demo sandboxes:</strong> the sandbox and everything created in it are deleted automatically when the
            sandbox session expires. The contact details you gave to start the demo are kept as a sales enquiry for up to
            12 months, unless you ask us to delete them sooner.
          </li>
          <li>
            <strong>Account and website data</strong> (including data our customers collect from their visitors): kept while
            your subscription is active and for at least 90 days after it expires or is cancelled, so you can renew or export
            your data. After that, we delete it when you ask us to, and remove it from backups within a further 30 days.
          </li>
          <li>
            <strong>Invoices and payment records:</strong> kept for 8 years from the end of the relevant financial year, as
            required by the Central Goods and Services Tax Act, 2017 and the Income-tax Act, 1961.
          </li>
          <li>
            <strong>AI-builder prompts and drafts:</strong> kept for up to 90 days to troubleshoot, prevent abuse and enforce
            usage limits, unless saved into your website.
          </li>
          <li>
            <strong>Security and access logs:</strong> kept for at least one year, or longer where law (including CERT-In
            directions) requires.
          </li>
        </ul>
      ),
    },
    {
      id: "security",
      title: "How we protect data",
      body: (
        <>
          <p>
            We follow reasonable security practices and procedures as required by Section 43A of the Information Technology
            Act, 2000 and the IT (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information)
            Rules, 2011. These include encryption in transit (HTTPS), hashed passwords, signed and HTTP-only session cookies,
            strict separation of each customer&rsquo;s data, role-based access, rate limiting, and restricting staff access
            to what is needed for their work.
          </p>
          <p>
            No system is completely secure. If a personal data breach occurs, we will inform affected users and the Data
            Protection Board of India, and report to CERT-In, as the law requires.
          </p>
        </>
      ),
    },
    {
      id: "children",
      title: "Children's data",
      body: (
        <>
          <p>
            The Service is meant for businesses and adults. We do not knowingly collect personal data of children (anyone
            under 18) for our own purposes. If you believe a child has given us their data, contact us and we will delete
            it.
          </p>
          <p>
            Many of our customers are schools, coaching institutes and play schools that use their websites to publish
            results or collect admission enquiries about students. For that data the customer is the Data Fiduciary and
            must obtain verifiable consent from a parent or lawful guardian before collecting a child&rsquo;s data, and
            must not track, monitor the behaviour of, or target advertising at children, as Section 9 of the DPDP Act
            requires. We process such data only on the customer&rsquo;s instructions.
          </p>
        </>
      ),
    },
    {
      id: "rights",
      title: "Your rights",
      body: (
        <>
          <p>Under the DPDP Act you have the right to:</p>
          <ul>
            <li><strong>Access</strong> a summary of the personal data we hold about you and how we process it;</li>
            <li><strong>Correct, complete or update</strong> inaccurate or incomplete data;</li>
            <li><strong>Erase</strong> data that is no longer needed, unless law requires us to keep it (for example invoices);</li>
            <li><strong>Withdraw consent</strong> you gave earlier;</li>
            <li><strong>Grievance redressal</strong> through our Grievance Officer (below);</li>
            <li><strong>Nominate</strong> another person to exercise these rights on your behalf in the event of your death or incapacity.</li>
          </ul>
          <p>
            Most account details can be updated directly in your admin panel. For anything else, write to <EmailLink b={b} />{" "}
            from the email linked to your account. We may ask you to verify your identity before acting on a request. If you
            are not satisfied with our response, you may complain to the Data Protection Board of India.
          </p>
        </>
      ),
    },
    {
      id: "cookies",
      title: "Cookies and browser storage",
      body: (
        <>
          <p>We use only the following. All are needed for the Service to work, so they cannot be switched off individually.</p>
          <div className="overflow-x-auto mb-4">
            <table>
              <thead>
                <tr><th>Name</th><th>Purpose</th><th>Duration</th></tr>
              </thead>
              <tbody>
                <tr><td className="font-mono">admin_session</td><td>Keeps you signed in to your admin panel.</td><td>7 days, or until you log out</td></tr>
                <tr><td className="font-mono">super_session</td><td>Keeps platform administrators signed in.</td><td>7 days, or until they log out</td></tr>
                <tr><td className="font-mono">demo_session</td><td>Links your browser to your private demo sandbox.</td><td>Until the sandbox expires</td></tr>
                <tr><td className="font-mono">ref_code</td><td>Remembers the referral link you arrived from, so the customer who shared it is credited.</td><td>30 days</td></tr>
                <tr><td className="font-mono">site_design</td><td>Remembers the design you are previewing in a demo.</td><td>2 hours</td></tr>
                <tr><td className="font-mono">theme (local storage)</td><td>Remembers your light or dark mode choice.</td><td>Until you clear browser data</td></tr>
                <tr><td>AI-builder draft (local storage)</td><td>Carries your AI-builder prompt and draft from the preview to checkout.</td><td>Until checkout or you clear browser data</td></tr>
              </tbody>
            </table>
          </div>
          <p>
            Our customers&rsquo; websites may add analytics or advertising tags (such as Google Analytics or Meta Pixel) of
            their own choosing; those are the responsibility of the business running that website.
          </p>
        </>
      ),
    },
    {
      id: "grievance",
      title: "Grievance Officer",
      body: (
        <>
          <p>
            In line with the IT Act, 2000 and the rules made under it, the DPDP Act, 2023 and the Consumer Protection
            (E-Commerce) Rules, 2020, you can raise any concern about your personal data or the Service with our Grievance
            Officer:
          </p>
          <GrievanceOfficer b={b} />
        </>
      ),
    },
    {
      id: "changes",
      title: "Changes to this policy",
      body: (
        <p>
          We may update this policy when our Service or the law changes. The &ldquo;Last updated&rdquo; date at the top shows
          the latest version. If a change materially affects how we use your data, we will tell you by email or in your admin
          panel before it takes effect.
        </p>
      ),
    },
    {
      id: "contact",
      title: "Contact us",
      body: (
        <>
          <p>
            For any question about this policy, write to <EmailLink b={b} /> or see our <a href="/contact">Contact page</a>.
          </p>
          <BusinessDetails b={b} />
        </>
      ),
    },
  ];

  return (
    <LegalPage
      title="Privacy Policy"
      intro={
        <p>
          This policy explains how {b.name} collects, uses, shares and protects personal data when you use our website and
          Service. It is published under the Information Technology Act, 2000, the Information Technology (Reasonable
          Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011 and the Digital Personal
          Data Protection Act, 2023 (with the rules made under it, as they come into force). By using the Service you agree to
          this policy. Please also read our <a href="/terms">Terms &amp; Conditions</a>.
        </p>
      }
      sections={sections}
    />
  );
}

// Business details come from Super Admin → Settings; refresh them every 5 minutes.
export const revalidate = 300;
