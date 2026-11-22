import type { Metadata } from "next";
import { LegalPage, getBusiness, BusinessDetails, EmailLink, type LegalSection } from "@/components/marketing/LegalPage";

export const metadata: Metadata = {
  title: "Shipping & Delivery Policy — SitePixl",
  description: "SitePixl is a digital service: your website and admin panel are delivered online, instantly after payment.",
};

export default async function ShippingPage() {
  const b = await getBusiness();

  const sections: LegalSection[] = [
    {
      id: "digital",
      title: "Digital service, no physical shipping",
      body: (
        <p>
          {b.name} sells an online service: a website and an admin panel. Nothing is shipped physically, there are no
          shipping or handling charges, and no courier or delivery address is involved. The Service can be used from
          anywhere in India with an internet connection.
        </p>
      ),
    },
    {
      id: "delivery",
      title: "How and when it is delivered",
      body: (
        <>
          <p>
            Your website and admin panel are <strong>set up automatically and instantly</strong> once Razorpay confirms your
            payment, usually within a few seconds. You get access as follows:
          </p>
          <ul>
            <li>on screen, straight after payment, with links to your new website and admin panel;</li>
            <li>you log in to the admin panel with the email address and password you gave at checkout;</li>
            <li>your GST invoice is available at any time under Billing in your admin panel, and we can email it on request.</li>
          </ul>
          <p>
            Your website is live at your chosen <em>yourname</em> subdomain immediately. If your plan includes a custom domain,
            it starts working once you update your domain&rsquo;s DNS settings as shown in your admin panel; DNS changes can
            take up to 48 hours to take effect worldwide.
          </p>
        </>
      ),
    },
    {
      id: "failed",
      title: "If set-up fails",
      body: (
        <>
          <p>
            Rarely, a payment succeeds but set-up does not complete (for example because of a network error). If you do not
            see your access details on screen after paying, or cannot log in within 15 minutes, email{" "}
            <EmailLink b={b} /> with your payment ID.
          </p>
          <p>
            We will complete the set-up manually within <strong>1 working day</strong>. If we cannot deliver the Service
            within 3 working days of your payment, we will refund the full amount to your original payment method within 5 to
            7 working days, as described in our <a href="/refund">Refund &amp; Cancellation Policy</a>.
          </p>
        </>
      ),
    },
    {
      id: "renewals",
      title: "Renewals",
      body: (
        <p>
          When you renew, the new period is added to your account immediately after payment. Your website and data stay as
          they are, with no interruption.
        </p>
      ),
    },
    {
      id: "contact",
      title: "Contact",
      body: (
        <>
          <p>
            For delivery questions, write to <EmailLink b={b} /> or see our <a href="/contact">Contact page</a>.
          </p>
          <BusinessDetails b={b} />
        </>
      ),
    },
  ];

  return (
    <LegalPage
      title="Shipping & Delivery Policy"
      intro={<p>This policy explains how {b.name} delivers your website and admin panel after you buy a plan.</p>}
      sections={sections}
    />
  );
}

// Business details come from Super Admin → Settings; refresh them every 5 minutes.
export const revalidate = 300;
