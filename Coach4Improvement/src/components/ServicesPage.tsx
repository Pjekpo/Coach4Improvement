import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  ClipboardCheck,
  FileText,
  Pill,
  Shield,
  Users,
  Lock,
  UserCheck,
  AlertTriangle,
  Calendar,
} from "lucide-react";
import { motion } from "motion/react";

interface ServicesPageProps {
  onOpenBooking: () => void;
}

const services = [
  {
    icon: ClipboardCheck,
    title: "CQC Inspections & Ratings",
    description: "Expert support with CQC inspections and ratings. Prepare your service for inspection with guidance from experienced CQC inspectors who understand the process inside out.",
    features: ["Mock inspections", "Rating improvement strategies", "Evidence preparation", "Action plan development"],
    popular: true,
  },
  {
    icon: FileText,
    title: "Registration Forms for CQC",
    description: "Complete assistance with CQC registration applications. We help you navigate the complex registration process ensuring all requirements are met.",
    features: ["Application preparation", "Documentation support", "Compliance checks", "Submission guidance"],
    popular: false,
  },
  {
    icon: Pill,
    title: "Medicines Optimisation Audits",
    description: "Comprehensive medicines management audits to ensure safe prescribing, administration, and storage of medications in your care setting.",
    features: ["MAR chart reviews", "Storage audits", "Policy compliance", "Staff competency checks"],
    popular: false,
  },
  {
    icon: Shield,
    title: "Health & Safety / IPC Audits",
    description: "Full health and safety and infection prevention control audits. Identify risks and implement effective control measures.",
    features: ["Risk assessments", "IPC protocols", "Environmental audits", "Staff training needs"],
    popular: false,
  },
  {
    icon: Users,
    title: "Safeguarding Reviews",
    description: "Expert safeguarding reviews and audits to ensure robust protection systems are in place for vulnerable adults.",
    features: ["Policy review", "Case audits", "Staff training assessment", "Improvement recommendations"],
    popular: false,
  },
  {
    icon: Lock,
    title: "Deprivation of Liberty Safeguards",
    description: "DoLS assessments and compliance support. Ensure lawful deprivation of liberty and proper authorization processes.",
    features: ["DoLS applications", "Capacity assessments", "Best interest decisions", "MCA compliance"],
    popular: false,
  },
  {
    icon: UserCheck,
    title: "Recruitment Processes",
    description: "Review and improve your recruitment processes to ensure safe hiring practices and regulatory compliance.",
    features: ["DBS checks review", "Interview process", "Reference verification", "Policy development"],
    popular: false,
  },
  {
    icon: AlertTriangle,
    title: "Crisis Turnaround Package",
    description: "Rapid intervention for services in crisis. Detailed investigations to identify root causes after incidents or poor inspection ratings with comprehensive improvement plans.",
    features: ["Root cause analysis", "Immediate action plans", "Ongoing support", "Performance monitoring"],
    popular: true,
  },
  {
    icon: Calendar,
    title: "Consultancy Subscriptions",
    description: "Ongoing monthly consultancy support packages. Regular provider visits, reports, and continuous compliance monitoring tailored to your needs.",
    features: ["Monthly visits", "Provider reports", "Manager report checks", "Continuous support"],
    popular: true,
  },
];

export function ServicesPage({ onOpenBooking }: ServicesPageProps) {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary via-primary to-secondary text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-white mb-4"
          >
            Our Services
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-white/95 max-w-3xl mx-auto"
          >
            Comprehensive health and social care consultancy services tailored to your regulatory and compliance needs
          </motion.p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -8 }}
              >
                <Card className="h-full flex flex-col hover:shadow-lg transition-shadow relative">
                  {service.popular && (
                    <div className="absolute -top-3 -right-3">
                      <Badge className="bg-secondary text-secondary-foreground">Popular</Badge>
                    </div>
                  )}
                  <CardHeader>
                    <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                      <service.icon className="w-7 h-7 text-primary" />
                    </div>
                    <CardTitle>{service.title}</CardTitle>
                    <CardDescription>{service.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    <ul className="space-y-2 mb-6 flex-1">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button onClick={onOpenBooking} className="w-full">
                      Book Now
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Services Section */}
      <section className="py-16 bg-accent">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-center mb-12">Additional Support Services</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Site Visits and Evaluation</CardTitle>
                  <CardDescription>
                    On-site assessments and evaluations of your care environment, practices, and documentation
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>CQC Enforcement Support</CardTitle>
                  <CardDescription>
                    Expert guidance when facing CQC enforcement actions, helping you respond effectively
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Care Plan Audits</CardTitle>
                  <CardDescription>
                    Detailed review of care plans to ensure person-centered, compliant documentation
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Governance Audits</CardTitle>
                  <CardDescription>
                    Comprehensive governance structure reviews to ensure effective leadership and management
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-primary to-secondary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-white mb-4">Not Sure Which Service You Need?</h2>
          <p className="text-xl mb-8 text-white/95 max-w-2xl mx-auto">
            Book a free consultation and we'll help you identify the right support for your service
          </p>
          <Button
            size="lg"
            onClick={onOpenBooking}
            className="bg-white text-primary hover:bg-white/90"
          >
            Book Free Consultation
          </Button>
        </div>
      </section>
    </div>
  );
}
