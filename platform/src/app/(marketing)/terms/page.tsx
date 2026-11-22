import type { Metadata } from "next";
import Link from "next/link";
import { getPlatformConfig } from "@/lib/platformConfig";
import { resolveReferralSettings } from "@/lib/referral";
import { formatINR } from "@/lib/plans";
import { LegalPage, getBusiness, BusinessDetails, GrievanceOfficer, EmailLink, type LegalSection } from "@/components/marketing/LegalPage";

export const metadata: Metadata = {
  title: "Terms & Conditions — SitePixl",
  description: "The terms that apply to SitePixl websites, admin panels, plans and billing.",
};

export default async function TermsPage() {
  const b = await getBusiness();
  const r = resolveReferralSettings((await getPlatformConfig()).referralSettings);

  const sections: LegalSection[] = [
    {
      id: "agreement",
      title: "About these terms",
      body: (
        <p>
          These Terms &amp; Conditions (&ldquo;Terms&rdquo;) are an agreement between you and {b.name} (&ldquo;we&rdquo;,
          &ldquo;us&rdquo;) for the use of our website, live demos, AI website builder, and the websites and admin panels we
          provide (the &ldquo;Service&rdquo;). By creating an account, starting a demo or paying for a plan you accept these
          Terms, our <a href="/privacy">Privacy Policy</a>, our <a href="/refund">Refund &amp; Cancellation Policy</a> and our{" "}
          <a href="/shipping">Shipping &amp; Delivery Policy</a>. This document is an electronic record under the Information
          Technology Act, 2000 and does not need a physical or digital signature.
        </p>
      ),
    },
    {
      id: "eligibility",
      title: "Eligibility and your account",
      body: (
        <>
          <p>
            You must be at least 18 years old and able to enter into a binding contract under the Indian Contract Act, 1872.
            If you sign up for a business, school, NGO or other organisation, you confirm that you are authorised to accept
            these Terms for it, and &ldquo;you&rdquo; includes that organisation.
          </p>
          <p>
            You must give accurate details, keep your password secret and tell us promptly about any unauthorised use of your
            account. You are responsible for everything done through your account, including by staff you give access to.
          </p>
        </>
      ),
    },
    {
      id: "plans",
      title: "Plans, billing and GST",
      body: (
        <>
          <p>
            Plans and prices are shown on our <Link href="/#pricing">pricing section</Link> and at checkout. You can choose a
            time-based plan of 1 month, 6 months, 1 year, 2 years or 3 years; longer plans carry a discount.
            Payment is taken in advance through Razorpay. Prices are in Indian Rupees and include GST at the applicable rate
            unless stated otherwise. We issue a GST tax invoice for every payment; if you want your GSTIN on the invoice, enter
            it before paying.
          </p>
          <h3>Renewal and expiry</h3>
          <p>
            Time-based plans <strong>do not renew automatically</strong> and we never charge you without your action. We send
            reminders before your plan ends. If you do not renew, your public website goes offline when the paid period ends;
            your admin panel stays available for 14 days so you can renew, and your data is kept for at least 90 days after expiry
            so you can renew or export it, and is deleted when you ask us to, as set out in our Privacy Policy.
          </p>
          <h3>Price changes</h3>
          <p>
            We may change prices for future purchases or renewals. A change never affects a period you have already paid for.
          </p>
        </>
      ),
    },
    {
      id: "refunds",
      title: "Cancellation and refunds",
      body: (
        <p>
          You can cancel at any time and your plan will simply not renew. First purchases are covered by a 7-day refund window.
          The full rules, timelines and exclusions are in our <a href="/refund">Refund &amp; Cancellation Policy</a>.
        </p>
      ),
    },
    {
      id: "acceptable-use",
      title: "Acceptable use",
      body: (
        <>
          <p>You must not use the Service, or allow your website to be used, to host, publish or transmit anything that:</p>
          <ul>
            <li>is unlawful, or is prohibited by Rule 3(1)(b) of the IT (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021;</li>
            <li>is defamatory, obscene, pornographic, paedophilic, invasive of privacy, or harasses or threatens anyone;</li>
            <li>promotes hatred or violence on grounds of religion, caste, gender or ethnicity, or threatens the unity, integrity, security or sovereignty of India;</li>
            <li>infringes any copyright, trademark or other intellectual property right;</li>
            <li>sells or advertises prohibited goods or services (such as drugs, weapons, gambling or betting, counterfeit goods, or unlicensed financial, medical or legal services);</li>
            <li>is fraudulent or misleading, including fake reviews, phishing pages or pages that impersonate another person, brand or government body;</li>
            <li>contains malware, or is spam, bulk unsolicited messaging, or an attempt to collect data without consent.</li>
          </ul>
          <p>
            You must not try to break, overload, scan or reverse-engineer the Service, access other customers&rsquo; data,
            bypass plan limits, or resell the Service without our written permission. We may remove content or suspend a
            website that breaks these rules, and we act on valid notices from courts and government agencies as the law
            requires.
          </p>
        </>
      ),
    },
    {
      id: "content",
      title: "Your content and licence",
      body: (
        <p>
          You own the text, images, logos, documents and data you add to your website (&ldquo;Customer Content&rdquo;). You
          confirm you have the rights to use it. You give us a non-exclusive, royalty-free licence to host, copy, display and
          process Customer Content only as needed to run, secure and support the Service, and to show your public website to
          its visitors. This licence ends when your content is deleted, except for copies we must keep by law. We may show
          your public website&rsquo;s name and design as an example of our work unless you ask us not to.
        </p>
      ),
    },
    {
      id: "your-obligations",
      title: "Your obligations to your own visitors",
      body: (
        <>
          <p>
            Your website may collect enquiries, appointment bookings, volunteer applications, donations, student results and
            other personal data from your visitors. For that data <strong>you are the Data Fiduciary</strong> under the Digital
            Personal Data Protection Act, 2023, and we are your Data Processor. You are responsible for:
          </p>
          <ul>
            <li>having a lawful basis and a clear notice for collecting each type of data (each website includes a privacy page you can edit at <code>/privacy</code>);</li>
            <li>obtaining verifiable parental or guardian consent before collecting data of anyone under 18, which applies to schools, coaching institutes and play schools in particular;</li>
            <li>answering your visitors&rsquo; requests to access, correct or erase their data, which you can do from your admin panel;</li>
            <li>following any sector rules that apply to you, such as those for health records, donations (including 80G receipts and FCRA), or education;</li>
            <li>any analytics, advertising or chat tools you add to your website.</li>
          </ul>
          <p>
            We process your visitors&rsquo; data only to provide the Service to you and on your instructions, protect it as
            described in our Privacy Policy, and help you meet these obligations where reasonable.
          </p>
        </>
      ),
    },
    {
      id: "demo-ai",
      title: "Live demos and AI-generated content",
      body: (
        <>
          <h3>Demo sandbox</h3>
          <p>
            A demo is a temporary, private copy of a sample website for evaluation only. It expires after a short time and
            everything in it is deleted automatically. Do not enter real customer data or confidential information in a demo,
            and do not use it to publish content or take real bookings or payments.
          </p>
          <h3>AI website builder</h3>
          <p>
            The AI builder uses a third-party AI model to draft website text, structure and suggestions from your prompt.
            AI output can be inaccurate, incomplete or similar to content produced for others. It is provided as a starting
            point only: you must review it and are responsible for what you publish, including claims about your services,
            prices, qualifications or registrations. Do not enter other people&rsquo;s personal data or sensitive information
            in a prompt.
          </p>
        </>
      ),
    },
    {
      id: "ip",
      title: "Our intellectual property",
      body: (
        <p>
          The Service, including its software, templates, designs, admin panel and branding, belongs to {b.name} or its
          licensors. While your plan is active you may use the templates and designs for your own website. You may not copy,
          resell or redistribute the templates or software outside the Service. Stock images supplied in templates are
          licensed for use on your website only.
        </p>
      ),
    },
    {
      id: "availability",
      title: "Availability and disclaimer",
      body: (
        <p>
          We work to keep the Service available and secure, but it is provided &ldquo;as is&rdquo; and &ldquo;as
          available&rdquo;. We do not guarantee that it will be uninterrupted, error-free or meet every requirement you have.
          We may carry out maintenance, update features or change third-party providers, and will give notice of planned
          downtime where we reasonably can. To the extent the law allows, we disclaim all implied warranties, including
          fitness for a particular purpose.
        </p>
      ),
    },
    {
      id: "liability",
      title: "Limitation of liability",
      body: (
        <p>
          To the maximum extent permitted by law, we are not liable for any indirect, incidental, special or consequential
          loss, or for loss of profit, revenue, business, goodwill or data, arising from the Service. Our total liability for
          all claims in any 12-month period is limited to the amount you paid us for the Service in that period. Nothing in
          these Terms limits liability that cannot be limited under Indian law, including for fraud or rights you have under
          the Consumer Protection Act, 2019.
        </p>
      ),
    },
    {
      id: "indemnity",
      title: "Indemnity",
      body: (
        <p>
          You agree to indemnify {b.name} against claims, penalties, losses and reasonable legal costs arising from your
          Customer Content, your breach of these Terms, or your failure to meet your legal obligations to your own visitors
          and customers.
        </p>
      ),
    },
    {
      id: "termination",
      title: "Suspension, termination and data export",
      body: (
        <>
          <p>
            We may suspend or terminate your website or account, with notice where practical, if you seriously or repeatedly
            breach these Terms, fail to pay, create legal risk for us or others, or if a court or authority directs us to.
            In urgent cases (such as malware, phishing or unlawful content) we may act immediately.
          </p>
          <p>
            You can stop using the Service at any time. After your plan ends or is terminated, you can export your leads,
            bookings and other records from the admin panel during the 14-day grace period, or ask us by email for an export
            within 90 days. After that, your data is deleted as set out in our Privacy Policy, except records we must keep by
            law.
          </p>
        </>
      ),
    },
    {
      id: "referral-program",
      title: "Referral Program Terms",
      body: (
        <>
          <p>
            <strong>Eligibility.</strong> Any customer with an active paid plan (the &ldquo;Referrer&rdquo;) can share the
            referral link or code shown under <em>Refer &amp; Earn</em> in their admin panel. Demo and trial accounts cannot
            take part. Only the account that shared the link or code earns; the customer who buys (the &ldquo;Referred
            Customer&rdquo;) pays the normal price and gets no referral discount.
          </p>
          <p>
            <strong>Attribution.</strong> A purchase is credited to a Referrer when the buyer opens their referral link within{" "}
            30 days before buying (the most recent link wins) or enters their code at checkout. Once a Referred Customer&rsquo;s
            account is created, it stays linked to that Referrer.
          </p>
          <p>
            <strong>Commission.</strong> The Referrer earns {r.commissionPct}% of the amount paid, excluding GST, on each
            purchase by a Referred Customer that is greater than {formatINR(r.minOrderPaise)} excluding GST
            {r.firstPurchaseOnly ? ", for the Referred Customer’s first purchase only" : ", including their later renewals and upgrades"}.
            Coupons reduce the amount the commission is calculated on.
          </p>
          <p>
            <strong>Hold period and refunds.</strong> Commission stays pending for {r.holdDays} days after the payment, in line
            with our refund window. If the purchase is refunded or charged back, its commission is reversed; if it was already
            paid out, we may deduct it from future commissions.
          </p>
          <p>
            <strong>Withdrawal.</strong> You can request a payout to your UPI ID or Indian bank account once your available
            balance reaches {formatINR(r.minWithdrawalPaise)}. One request can be open at a time and it covers your whole
            available balance. We aim to process requests within 15 working days and may ask for KYC details (such as PAN)
            before paying. Commission has no cash value until it is paid and does not earn interest.
          </p>
          <p>
            <strong>Self-referral and fraud.</strong> You may not refer yourself, your own business, accounts you control, or
            use fake identities, spam, misleading ads or bidding on our brand name. We may withhold or reverse commission and
            remove you from the program for any of these, or if we reasonably suspect abuse.
          </p>
          <p>
            <strong>Taxes.</strong> Commission is income for the Referrer, who is responsible for any tax on it. Where the law
            requires, we will deduct TDS
            {r.tdsPct > 0 ? ` (currently ${r.tdsPct}%)` : ""} and share the details for your records.
          </p>
          <p>
            <strong>Changes.</strong> We may change the commission rate, minimums, hold period or any part of the program, or
            end it, at any time. Changes do not affect commission already earned on payments made before the change. If the
            program ends, we will pay out the available balances that meet the minimum withdrawal.
          </p>
        </>
      ),
    },
    {
      id: "law",
      title: "Governing law and disputes",
      body: (
        <p>
          These Terms are governed by the laws of India. Please contact our Grievance Officer first so we can try to resolve
          any dispute. Subject to that, and to any right you have to approach a consumer commission, {b.courts} shall have exclusive
          jurisdiction.
        </p>
      ),
    },
    {
      id: "changes",
      title: "Changes to these terms",
      body: (
        <p>
          We may update these Terms from time to time. The &ldquo;Last updated&rdquo; date shows the current version. For
          material changes we will notify you by email or in your admin panel at least 15 days before they apply. Continuing
          to use the Service after that date means you accept the updated Terms.
        </p>
      ),
    },
    {
      id: "contact",
      title: "Contact and grievances",
      body: (
        <>
          <p>
            Questions about these Terms: <EmailLink b={b} />. Complaints are handled by our Grievance Officer:
          </p>
          <GrievanceOfficer b={b} />
          <BusinessDetails b={b} />
        </>
      ),
    },
  ];

  return (
    <LegalPage
      title="Terms & Conditions"
      intro={<p>Please read these Terms carefully. They set out your rights and responsibilities when you use {b.name}.</p>}
      sections={sections}
    />
  );
}

// Business details come from Super Admin → Settings; refresh them every 5 minutes.
export const revalidate = 300;
