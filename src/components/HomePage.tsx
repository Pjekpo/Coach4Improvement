"use client";

import { useState } from "react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import {
  ClipboardCheck,
  Shield,
  Heart,
  Users,
  TrendingUp,
  Star,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { motion } from "motion/react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

interface HomePageProps {
  onNavigate: (page: string) => void;
  onOpenBooking: () => void;
}

const services = [
  {
    icon: ClipboardCheck,
    title: "CQC regulatory Support",
    description:
      "Expert guidance on preparing for meeting the fundamental standards of care and understanding regulatory requirements. We do not just want providers to be compliant with CQC inspections but for providers to offer people positive experiences and outcomes. Our service help you sustain Good and Outstanding ratings and improve Requires Improvement Services. We offer support in the completion of registration forms and guidance on reporting incidents and developing lessons learnt processes.",
  },
  {
    icon: Shield,
    title: "Support with Provider and Registered Manager Registration Forms for CQC",
    description:
      "Complete assistance with CQC registration application processes including drafting policies and statements of purpose. We support you navigate the complex registration process ensuring all requirements are met including support for managers and Nominated individuals on their responsibilities.",
  },
  {
    icon: TrendingUp,
    title: "Medicines Optimisation Audits",
    description:
      "Comprehensive medicines management audits to ensure safe administration, and storage of medications in your care setting. We support providers to ensure they follow NICE Guidance on Medicines Management both in care homes and in the community. Includes: MAR chart reviews; Storage audits; Policy compliance; Staff competency checks.",
  },
];

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Care Home Manager",
    text: "C4i transformed our approach to compliance. Their expertise and personalized support helped us achieve an Outstanding rating from CQC.",
    rating: 5,
  },
  {
    name: "David Thompson",
    role: "Healthcare Provider",
    text: "The crisis turnaround package was exactly what we needed. Professional, thorough, and results-driven.",
    rating: 5,
  },
  {
    name: "Emma Williams",
    role: "Nursing Home Director",
    text: "Outstanding consultancy service. The team's background as CQC inspectors gives them unique insights that are invaluable.",
    rating: 5,
  },
];

const partners = [
  { name: "24+ Years Experience", icon: Shield },
  { name: "100+ Clients Served", icon: Users },
  { name: "Expert-Led", icon: Star },
];

export function HomePage({ onNavigate, onOpenBooking }: HomePageProps) {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const handleNavigate = (page: string) => {
    onNavigate(page);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };


  return (
    <div className="min-h-screen">
      <Helmet>
        <link rel="canonical" href="https://coach4improvement.co.uk/" />
        {/* TODO: Place og-home.jpg into /public. Update URL if different. */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Coach4Improvement | CQC Care Consultancy & Coaching" />
        <meta property="og:description" content="Specialist CQC care consultancy and personal development coaching. Supporting care providers with compliance, audits, registration and mindset growth services." />
        <meta property="og:url" content="https://coach4improvement.co.uk/" />
        <meta property="og:image" content="https://coach4improvement.co.uk/og-home.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Coach4Improvement | CQC Care Consultancy & Coaching" />
        <meta name="twitter:description" content="Specialist CQC care consultancy and personal development coaching. Supporting care providers with compliance, audits, registration and mindset growth services." />
        <meta name="twitter:image" content="https://coach4improvement.co.uk/og-home.jpg" />
        <script type="application/ld+json">
          {JSON.stringify(
            {
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "Home",
                  item: "https://coach4improvement.co.uk/",
                },
              ],
            },
            null,
            2
          )}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(
            {
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Coach4Improvement Care Consultancy",
              url: "https://coach4improvement.co.uk/",
              logo: "https://coach4improvement.co.uk/og-image.png",
              description:
                "CQC care consultancy, mock inspections, audits, registration support and development coaching.",
              sameAs: [
                "https://www.linkedin.com/company/coach4improvement-care-consultancy-ltd/",
              ],
            },
            null,
            2
          )}
        </script>
      </Helmet>
      {/* Hero Section */}
      <section
        className="relative bg-gradient-to-br from-primary via-primary to-secondary text-white overflow-hidden"
        style={{ backgroundImage: "linear-gradient(135deg, #00c3ca 0%, #8c52ff 100%)" }}
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnptMCAzNmMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIGZpbGw9IiNmZmYiLz48L2c+PC9zdmc+')] bg-repeat"></div>
        </div>
        
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-white mb-4">CQC Care Consultancy & Coaching</h1>
              <div className="text-white/95 mb-8 space-y-4">
                <p>
                  We deliver specialised <strong>Regulatory Care consultancy</strong> for all <strong>CQC-registered services</strong> across England and CIW- Wales, supporting both care homes and domiciliary care providers. What sets us apart is our dual foundation: a supportive <strong>Coaching approach</strong> and deep <strong>Social Work expertise</strong>, ensuring our support drives <strong>meaningful, sustained improvement</strong>, not just compliance.
                </p>
                <p>
                  We partner with you from day one, offering seamless <strong>registration support</strong> for new providers or changes to your Statement of Purpose.
                </p>
                <p>
                  Our services include thorough <strong>CQC-style mock inspections</strong> and tailored action plans to assure regulatory excellence. We conduct full regulatory and specific area audits (covering high-risk areas like Risk management, MCA/DoLS, Staffing, medicines, IPC, and governance), providing you with a clear roadmap to improvements.
                </p>
                <p>
                  When challenges occur, we leverage our social work background to provide expert, independent support, including conducting <strong>safeguarding and whistleblowing investigations</strong> and drafting detailed, professional responses to regulators such as CQC, CIW, and Ofsted. Furthermore, our <strong>crisis turnaround package</strong> offers detailed root-cause analysis after poor ratings or critical incidents, working directly with Registered Managers and Providers to embed and sustain lasting positive change. We support you to focus on people who receive care and their outcomes; it is not just about compliance with regulations.
                </p>
              </div>
              {/* Removed hero action buttons as requested */}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="rounded-2xl overflow-hidden shadow-2xl">
                <ImageWithFallback
                  src="https://media.gettyimages.com/id/2170084233/photo/home-care-healthcare-professional-hugging-elderly-patient.jpg?s=612x612&w=0&k=20&c=AvWopqBNzNO2cg971OFY2LMD21J1HHkh6APoehev1hg="
                  alt="Professional healthcare consultant"
                  className="w-full h-auto"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Partners/Trust Section */}
      <section className="py-12 bg-accent">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-12">
            {partners.map((partner, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex flex-col items-center text-center"
              >
                <partner.icon className="w-12 h-12 text-primary mb-2" />
                <p className="text-sm text-white">{partner.name}</p>
              </motion.div>
            ))}
          </div>
          {/* Internal links for SEO */}
          <div className="mt-8 flex gap-4">
            <Link to="/services" className="underline text-white">Explore our CQC services</Link>
            <Link to="/contact" className="underline text-white">Contact our consultants</Link>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services-section" className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="mb-4">Our Core Services</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Comprehensive consultancy services tailored to your health and social care needs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                      <service.icon className="w-8 h-8 text-primary" />
                    </div>
                    <CardTitle>{service.title}</CardTitle>
                    <CardDescription>{service.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button onClick={() => onNavigate("services")} variant="outline" className="w-full">
                      Learn More
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-accent to-secondary/10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="mb-4">What Our Clients Say</h2>
            <p className="text-muted-foreground">
              Trusted by healthcare providers across the UK
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="relative">
              <CardContent className="pt-6">
                <div className="flex justify-center mb-4">
                  {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <blockquote className="text-center text-lg mb-6">
                  "{testimonials[currentTestimonial].text}"
                </blockquote>
                <div className="text-center">
                  <p className="text-muted-foreground">
                    {testimonials[currentTestimonial].name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {testimonials[currentTestimonial].role}
                  </p>
                </div>

                <div className="flex items-center justify-center gap-4 mt-6">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={prevTestimonial}
                    className="rounded-full"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </Button>
                  <div className="flex gap-2">
                    {testimonials.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentTestimonial(index)}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          index === currentTestimonial ? "bg-primary" : "bg-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={nextTestimonial}
                    className="rounded-full"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        className="py-16 md:py-24 bg-gradient-to-r from-primary to-secondary text-white"
        style={{ backgroundImage: "linear-gradient(90deg, #00c3ca 0%, #8c52ff 100%)" }}
      >
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-white mb-4">Ready to Improve Your Care Standards?</h2>
          <p className="text-xl mb-8 text-white/95 max-w-2xl mx-auto">
            Book a consultation today and let our experienced team help you achieve excellence in care
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button
              size="lg"
              onClick={onOpenBooking}
              className="bg-white text-primary hover:bg-white/90"
            >
              Book Consultation
            </Button>
            <Button
              size="lg"
              onClick={() => handleNavigate("packages")}
              variant="outline"
              className="border-white text-white bg-transparent hover:bg-white/10 hover:text-white"
            >
              View Packages
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
