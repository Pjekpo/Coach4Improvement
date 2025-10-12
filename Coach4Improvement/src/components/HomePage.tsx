"use client";

import { useState } from "react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import {
  ClipboardCheck,
  Shield,
  Award,
  Heart,
  Users,
  TrendingUp,
  Star,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { motion } from "motion/react";

interface HomePageProps {
  onNavigate: (page: string) => void;
  onOpenBooking: () => void;
}

const services = [
  {
    icon: ClipboardCheck,
    title: "CQC Support",
    description: "Expert guidance for CQC inspections, ratings, and registration forms",
  },
  {
    icon: Shield,
    title: "Health & Safety Audits",
    description: "Comprehensive audits including medicines, IPC, and governance",
  },
  {
    icon: TrendingUp,
    title: "Crisis Turnaround",
    description: "Rapid intervention to identify root causes and deliver improvement plans",
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
  { name: "CQC Registered", icon: Award },
  { name: "7+ Years Experience", icon: Shield },
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

  const scrollToServices = () => {
    document.getElementById("services-section")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary via-primary to-secondary text-white overflow-hidden">
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
              <h1 className="text-white mb-4">
                Solution Focused Care Consultancy
              </h1>
              <p className="text-xl md:text-2xl mb-6 text-white/95">
                Personalised Health and Social Care Compliance & Improvement Services
              </p>
              <p className="mb-8 text-white/90">
                Expert regulatory advice and improvement support from experienced CQC inspectors.
                We help your services be safe, effective, caring, responsive, and well-led.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button
                  size="lg"
                  onClick={onOpenBooking}
                  className="bg-white text-primary hover:bg-white/90"
                >
                  Book Now
                </Button>
                <Button
                  size="lg"
                  onClick={scrollToServices}
                  variant="outline"
                  className="border-white text-white hover:bg-white/10"
                >
                  Learn More
                </Button>
                <Button
                  size="lg"
                  onClick={() => onNavigate("contact")}
                  variant="outline"
                  className="border-white text-white hover:bg-white/10"
                >
                  Contact Us
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="rounded-2xl overflow-hidden shadow-2xl">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1676552055618-22ec8cde399a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGhjYXJlJTIwbnVyc2UlMjBwcm9mZXNzaW9uYWwlMjBzbWlsaW5nfGVufDF8fHx8MTc2MDI2Mjk2M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
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
                <p className="text-sm text-muted-foreground">{partner.name}</p>
              </motion.div>
            ))}
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
      <section className="py-16 md:py-24 bg-gradient-to-r from-primary to-secondary text-white">
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
              onClick={() => onNavigate("packages")}
              variant="outline"
              className="border-white text-white hover:bg-white/10"
            >
              View Packages
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
