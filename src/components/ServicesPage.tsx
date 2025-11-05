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
import { Helmet } from "react-helmet-async";

interface ServicesPageProps {
  onOpenBooking: () => void;
}

const services = [
  {
    icon: ClipboardCheck,
    title: "CQC regulatory Support",
    description:
      "Expert guidance on preparing for meeting the fundamental standards of care and understanding regulatory requirements. We do not just want providers to be compliant with CQC inspections but for providers to offer people positive experiences and outcomes. Our service help you sustain Good and Outstanding ratings and improve Requires Improvement Services. We offer support in the completion of registration forms and guidance on reporting incidents and developing lessons learnt processes.",
    features: ["Mock inspections", "Rating improvement strategies", "Evidence preparation", "Action plan development"],
    popular: true,
  },
  {
    icon: FileText,
    title: "Support with Provider and Registered Manager Registration Forms for CQC",
    description:
      "Complete assistance with CQC registration application processes including drafting policies and statements of purpose. We support you navigate the complex registration process ensuring all requirements are met including support for managers and Nominated individuals on their responsibilities.",
    features: ["Application preparation", "Documentation support", "Compliance checks", "Submission guidance"],
    popular: false,
  },
  {
    icon: Pill,
    title: "Medicines Optimisation Audits",
    description:
      "Comprehensive medicines management audits to ensure safe administration, and storage of medications in your care setting. We support providers to ensure they follow NICE Guidance on Medicines Management both in care homes and in the community.",
    features: ["MAR chart reviews", "Storage audits", "Policy compliance", "Staff competency checks"],
    popular: false,
  },
  {
    icon: Users,
    title: "Safeguarding & Whistleblowing Investigations and Reviews",
    description:
      "Expert independent safeguarding and whistleblowing reviews and audits to ensure robust protection systems are in place for vulnerable adults and children. We make recommendations that provide assurance to the regulators and commissioners and offer long lasting solutions.",
    features: [
      "Policy review",
      "Case audits",
      "Staff training assessment",
      "Improvement recommendations",
    ],
    popular: false,
  },
  {
    icon: Lock,
    title: "MCA/ Deprivation of Liberty Safeguards Guidance",
    description:
      "MCA/ DoLS assessments and compliance support. Ensure lawful deprivation of liberty and proper authorisation processes. With our expertise in Human Rights and Social Work practice we will assess existing care support to ensure it does not unlawfully restrict people. We know sometimes providers want to manage risk which may adversely affect people’s liberties, we support you on how to avoid this.",
    features: [
      "DoLS applications",
      "Capacity assessments",
      "Best interest decisions",
      "MCA compliance",
    ],
    popular: false,
  },
  {
    icon: UserCheck,
    title: "Safe Recruitment Processes",
    description:
      "Review and improve your recruitment processes to ensure safe hiring practices and regulatory compliance with regulatory requirements. We have expert experience in safe recruitment processes and understanding of what constitutes safe procedures for CQC, CIW and Ofsted registered providers.",
    features: [
      "DBS checks review",
      "Interview process",
      "Reference verification",
      "Policy development",
    ],
    popular: false,
  },
  {
    icon: AlertTriangle,
    title: "Internal Quality Monitoring Teams Inspection Training",
    description:
      "We offer training for providers within house internal monitoring teams. We ensure we train them on the CQC approach to inspection processes, evidence triangulation and how to monitor quality in a proactive manner. We have experience in designing and delivering inspection framework training for internal organisations and NGO across Europe and the Middle East.",
    features: [
      "CQC inspection approach",
      "Evidence triangulation",
      "Proactive quality monitoring",
      "Framework design & delivery",
    ],
    popular: true,
  },
  {
    icon: Calendar,
    title: "Regulatory Mentoring and Consultancy Subscriptions",
    description:
      "Ongoing monthly consultancy support packages. Regular provider visits, reports, and continuous compliance monitoring tailored to your needs. This may suit new providers and registered managers. Includes: Monthly visits; Quarterly visits; Provider reports; Action Plans and Recommendations; Manager report checks and Factual accuracy report support; Continuous support.",
    features: [
      "Monthly visits",
      "Quarterly visits",
      "Provider reports",
      "Action Plans and Recommendations",
      "Manager report checks & factual accuracy support",
      "Continuous support",
    ],
    popular: true,
  },
];

export function ServicesPage({ onOpenBooking }: ServicesPageProps) {
  return (
    <div className="min-h-screen">
      <Helmet>
        <title>Services | CQC Compliance, Mock Inspections & Coaching Support</title>
        <meta name="description" content="CQC mock inspections, full regulatory audits, enforcement response support, registration guidance and mindset coaching services for care providers and professionals." />
        <meta name="keywords" content="CQC mock inspection service, CQC audit support, care home compliance services, regulatory training, coaching for registered managers, enforcement response support" />
      </Helmet>
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
                    <div className="flex-1" />
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
            <h2 className="text-center mb-12 text-white">Additional Support Services</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Site Visits and Inspections</CardTitle>
                  <CardDescription>
                    On-site assessments and evaluations of your care environment, practices, and documentation before CQC registration and after registration. We inspect empty premises in preparation for registration (care homes).
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Care Plan Audits</CardTitle>
                  <CardDescription>
                    Detailed review of care plans to ensure person-centred, compliant documentation is provided to ensure care is delivered safely. We review electronic records; our consultants are well experiences in using the common electronic care record systems and electronic medicines management systems. We will review care records and make recommendations.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Quality Assurance Framework and Governance Reviews and Audits</CardTitle>
                  <CardDescription>
                    We offer comprehensive governance structure reviews to ensure effective leadership and management of the care provision. Our Quality Assurance Framework reviews including both desk top reviews of policy and procedures.
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
