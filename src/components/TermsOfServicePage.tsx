"use client";

import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

export function TermsOfServicePage() {
  return (
    <div className="min-h-screen">
      <Helmet>
        <title>Terms of Service | Coach4Improvement</title>
        <meta
          name="description"
          content="Terms of Service for Coach4Improvement CQC consultancy, audits, registration support, and coaching services."
        />
        <link rel="canonical" href="https://coach4improvement.co.uk/terms-of-service" />
      </Helmet>

      <section className="bg-gradient-to-br from-primary via-primary to-secondary text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-white mb-4">Terms of Service</h1>
          <p className="text-xl text-white/95 max-w-3xl mx-auto">
            The terms that apply when you use our website or book Coach4Improvement services.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-10">
            <div className="space-y-3">
              <h2>Agreement to these terms</h2>
              <p className="text-muted-foreground">
                These terms apply to your use of coach4improvement.co.uk and to any consultancy,
                audit, training, or coaching services we provide. By using the site or booking a
                consultation, you agree to these terms.
              </p>
            </div>

            <div className="space-y-3">
              <h3>Services and scope</h3>
              <p className="text-muted-foreground">
                We provide regulatory support for health and social care providers, including CQC
                compliance, CIW guidance, audits, mock inspections, registration support, and coaching.
                The scope, timing, and deliverables for each engagement will be confirmed in writing.
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Regulatory audits and mock inspections.</li>
                <li>Registration and enforcement support.</li>
                <li>Medicines optimisation, governance, and safeguarding reviews.</li>
                <li>Training, mentoring, and ongoing consultancy subscriptions.</li>
              </ul>
              <p className="text-muted-foreground">
                Our guidance is professional consultancy and does not guarantee regulatory outcomes or ratings.
              </p>
            </div>

            <div className="space-y-3">
              <h3>Bookings and accounts</h3>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>You may need an account to book a consultation or access resources.</li>
                <li>You are responsible for keeping your login details secure and up to date.</li>
                <li>We may require email verification before confirming bookings.</li>
                <li>We may decline or reschedule bookings if necessary and will notify you promptly.</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h3>Fees and payment</h3>
              <p className="text-muted-foreground">
                Fees are agreed in writing and may vary by service or package. Invoices are payable
                according to the terms shown on the invoice or in the engagement letter.
              </p>
            </div>

            <div className="space-y-3">
              <h3>Cancellations and changes</h3>
              <p className="text-muted-foreground">
                If you need to change or cancel a booking, please contact us as soon as possible.
                Subscription packages can be cancelled with 30 days' notice. Any additional cancellation
                terms will be set out in your proposal or engagement letter.
              </p>
            </div>

            <div className="space-y-3">
              <h3>Your responsibilities</h3>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Provide accurate and complete information about your service and requirements.</li>
                <li>Ensure relevant staff are available and documents can be reviewed when needed.</li>
                <li>Implement recommendations and maintain compliance; regulatory decisions remain your responsibility.</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h3>Confidentiality and data</h3>
              <p className="text-muted-foreground">
                We treat client information as confidential and use it only to deliver services.
                Our privacy practices are described in our{" "}
                <Link to="/privacy-policy" className="underline underline-offset-2 hover:text-foreground">
                  Privacy Policy
                </Link>
                .
              </p>
            </div>

            <div className="space-y-3">
              <h3>Intellectual property</h3>
              <p className="text-muted-foreground">
                All website content, tools, and materials are owned by Coach4Improvement or our licensors.
                You may use reports and deliverables we provide for your internal business purposes, but
                you may not resell, redistribute, or publish them without written permission.
              </p>
            </div>

            <div className="space-y-3">
              <h3>Third-party links</h3>
              <p className="text-muted-foreground">
                Our site may link to third-party services such as WhatsApp or Google Maps. We are not
                responsible for their content or privacy practices.
              </p>
            </div>

            <div className="space-y-3">
              <h3>Disclaimers and limitation of liability</h3>
              <p className="text-muted-foreground">
                We provide services with reasonable care and skill, but we do not guarantee specific
                inspection outcomes or ratings. To the extent permitted by law, we are not liable for
                indirect, incidental, or consequential losses. Nothing in these terms limits liability
                that cannot be limited by law.
              </p>
            </div>

            <div className="space-y-3">
              <h3>Governing law</h3>
              <p className="text-muted-foreground">
                These terms are governed by the laws of England and Wales.
              </p>
            </div>

            <div className="space-y-3">
              <h3>Contact</h3>
              <p className="text-muted-foreground">
                If you have questions about these terms, email{" "}
                <a
                  href="mailto:coach4improvement@gmail.com"
                  className="underline underline-offset-2 hover:text-foreground"
                >
                  coach4improvement@gmail.com
                </a>{" "}
                or call +447359257530.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
