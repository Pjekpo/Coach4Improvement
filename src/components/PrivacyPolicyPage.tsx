"use client";

import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

export function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen">
      <Helmet>
        <title>Privacy Policy | Coach4Improvement</title>
        <meta
          name="description"
          content="Learn how Coach4Improvement collects, uses, and protects personal information when you visit our site or book CQC consultancy services."
        />
        <link rel="canonical" href="https://coach4improvement.co.uk/privacy-policy" />
      </Helmet>

      <section className="bg-gradient-to-br from-primary via-primary to-secondary text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-white mb-4">Privacy Policy</h1>
          <p className="text-xl text-white/95 max-w-3xl mx-auto">
            How we collect, use, and protect your personal information when you use Coach4Improvement.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-10">
            <div className="space-y-3">
              <h2>Overview</h2>
              <p className="text-muted-foreground">
                Coach4Improvement (C4i) Care Consultancy provides regulatory improvement and coaching
                services for health and social care providers across the UK. This policy applies to our
                website, enquiries, bookings, and related communications.
              </p>
            </div>

            <div className="space-y-3">
              <h3>Information we collect</h3>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Contact and enquiry details, such as your name, email, phone number, organisation, and message.</li>
                <li>Booking details, including preferred date, time, service need, and any notes you provide.</li>
                <li>Account details used to access bookings and resources, such as email address and display name.</li>
                <li>Communications with us by email, phone, or WhatsApp.</li>
                <li>Basic technical data like IP address, device type, browser, and pages visited for security and performance.</li>
              </ul>
              <p className="text-muted-foreground">
                Authentication credentials are handled by our provider (Supabase), and we do not have access to your password.
              </p>
            </div>

            <div className="space-y-3">
              <h3>How we use your information</h3>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Respond to enquiries and provide customer support.</li>
                <li>Schedule and manage consultations, audits, and coaching services.</li>
                <li>Create and maintain your account for booking access.</li>
                <li>Send service updates, confirmations, and administrative messages.</li>
                <li>Protect the website, prevent misuse, and improve our services.</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h3>Legal bases for processing</h3>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Consent for contact forms and marketing communications when you opt in.</li>
                <li>Contract performance when we deliver consultancy or coaching services.</li>
                <li>Legitimate interests in operating, securing, and improving our website.</li>
                <li>Legal obligations where applicable.</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h3>How we share information</h3>
              <p className="text-muted-foreground">
                We only share personal information when needed to provide our services. This includes:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Service providers that help us operate the site, such as Formspree for form submissions.</li>
                <li>Supabase for authentication and booking data storage.</li>
                <li>Email, phone, and messaging services to communicate with you.</li>
                <li>Regulators or authorities if required by law.</li>
              </ul>
              <p className="text-muted-foreground">We do not sell your personal information.</p>
            </div>

            <div className="space-y-3">
              <h3>Cookies and similar technologies</h3>
              <p className="text-muted-foreground">
                We use essential storage and similar technologies to keep you signed in and enable booking features.
                We do not use advertising cookies.
              </p>
            </div>

            <div className="space-y-3">
              <h3>Data retention</h3>
              <p className="text-muted-foreground">
                We keep personal information only as long as needed to respond to you, deliver services,
                and meet legal or regulatory obligations.
              </p>
            </div>

            <div className="space-y-3">
              <h3>Your rights</h3>
              <p className="text-muted-foreground">
                You can request access, correction, deletion, or restriction of your personal information.
                You can also withdraw consent where processing is based on consent. To exercise your rights,
                contact us using the details below.
              </p>
            </div>

            <div className="space-y-3">
              <h3>International transfers</h3>
              <p className="text-muted-foreground">
                Some service providers may process data outside the UK. When this happens, we rely on
                appropriate safeguards to protect your information.
              </p>
            </div>

            <div className="space-y-3">
              <h3>Questions or concerns</h3>
              <p className="text-muted-foreground">
                For questions about this policy, contact Coach4Improvement at{" "}
                <a
                  href="mailto:coach4improvement@gmail.com"
                  className="underline underline-offset-2 hover:text-foreground"
                >
                  coach4improvement@gmail.com
                </a>{" "}
                or call +447359257530. You can also visit our{" "}
                <Link to="/contact" className="underline underline-offset-2 hover:text-foreground">
                  Contact page
                </Link>{" "}
                for additional ways to reach us.
              </p>
              <p className="text-muted-foreground">
                Coach4Improvement (C4i) Care Consultancy, Preston Technology Centre, Marsh Lane, Preston, PR1 8UQ.
              </p>
              <p className="text-muted-foreground">
                For how we provide our services, see our{" "}
                <Link to="/terms-of-service" className="underline underline-offset-2 hover:text-foreground">
                  Terms of Service
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
