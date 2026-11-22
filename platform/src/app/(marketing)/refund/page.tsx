import type { Metadata } from "next";
import { LegalPage, getBusiness, BusinessDetails, EmailLink, type LegalSection } from "@/components/marketing/LegalPage";

export const metadata: Metadata = {
  title: "Refund & Cancellation Policy — SitePixl",
  description: "Cancel anytime, 7-day refund on your first purchase, and how refunds are processed.",
};

export default async function RefundPage() {
  const b = await getBusiness();

  const sections: LegalSection[] = [
    {
      id: "cancel",
      title: "Cancel anytime",
      body: (
        <>
          <p>
            Our plans are prepaid and <strong>do not renew automatically</strong>, so there is nothing to cancel to stop
            future charges: if you do not renew, your plan simply ends at the close of the period you paid for. Your website
            stays live until then.
          </p>
          <p>
            If you want us to close your account and website earlier, email <EmailLink b={b} /> from the email linked to your
            account. Closing early does not by itself create a refund for the unused period, except under the 7-day refund
            below.
          </p>
        </>
      ),
    },
    {
      id: "seven-day",
      title: "7-day refund on your first purchase",
      body: (
        <>
          <p>
            If you are not satisfied, you can ask for a <strong>full refund within 7 days of your first purchase</strong> of
            any plan, including multi-year plans. Once the refund is approved your website is taken offline and the account is
            closed.
          </p>
          <p>
            The refund window applies once per customer or business. We may decline a refund where the Service has been
            used in breach of our <a href="/terms">Terms &amp; Conditions</a> (for example to host prohibited content) or
            where the same business has already received a refund.
          </p>
        </>
      ),
    },
    {
      id: "how",
      title: "How to request a refund",
      body: (
        <ol>
          <li>
            Email <EmailLink b={b} /> with the subject &ldquo;Refund request&rdquo;, from the email linked to your account.
          </li>
          <li>Include your website address, the payment date and the Razorpay payment ID or invoice number.</li>
          <li>We acknowledge your request within 48 hours and confirm approval or rejection within 3 working days.</li>
          <li>
            Approved refunds are issued to the <strong>original payment method</strong> within <strong>5 to 7 working
            days</strong> of approval. Your bank or card issuer may take a little longer to show the credit.
          </li>
        </ol>
      ),
    },
    {
      id: "non-refundable",
      title: "What is not refundable",
      body: (
        <ul>
          <li>Renewals, extensions and repeat purchases after the first 7 days of your first purchase.</li>
          <li>Any purchase after the 7-day window has passed, including multi-year plans.</li>
          <li>The unused part of a plan you choose to stop using before it ends.</li>
          <li>
            Domain registration or renewal fees paid to a domain registrar. We connect custom domains you own but do not sell
            domains, so these fees are between you and your registrar.
          </li>
          <li>Accounts suspended or terminated for breach of our Terms.</li>
        </ul>
      ),
    },
    {
      id: "failed",
      title: "Failed or duplicate payments",
      body: (
        <>
          <p>
            <strong>Failed payment:</strong> if money was debited but your payment failed or your website was not created,
            the amount is normally reversed automatically by Razorpay or your bank within 5 to 7 working days. If it is not,
            email us with the transaction details and we will trace it with Razorpay and either complete your order or
            refund you in full.
          </p>
          <p>
            <strong>Duplicate payment:</strong> if you were charged more than once for the same order, tell us and we will
            refund the extra amount in full to the original payment method within 5 to 7 working days of confirming it.
          </p>
        </>
      ),
    },
    {
      id: "gst",
      title: "GST on refunds",
      body: (
        <p>
          Refunds include the GST you paid. Where a GST invoice was already issued, we issue a credit note against it as
          required by the CGST Act, 2017.
        </p>
      ),
    },
    {
      id: "contact",
      title: "Contact",
      body: (
        <>
          <p>
            For any refund or cancellation question, write to <EmailLink b={b} /> or see our <a href="/contact">Contact page</a>.
          </p>
          <BusinessDetails b={b} />
        </>
      ),
    },
  ];

  return (
    <LegalPage
      title="Refund & Cancellation Policy"
      intro={
        <p>
          This policy explains how cancellations and refunds work for {b.name} plans. It forms part of our{" "}
          <a href="/terms">Terms &amp; Conditions</a>.
        </p>
      }
      sections={sections}
    />
  );
}

// Business details come from Super Admin → Settings; refresh them every 5 minutes.
export const revalidate = 300;
