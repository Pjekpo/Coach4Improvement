import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Card, CardContent } from "./ui/card";
import { Award, Heart, Users, Target, Shield, TrendingUp } from "lucide-react";
import { motion } from "motion/react";

const values = [
  {
    icon: Shield,
    title: "Safe",
    description: "Ensuring people are protected from abuse and avoidable harm",
  },
  {
    icon: Heart,
    title: "Effective",
    description: "Care, treatment and support that achieves good outcomes",
  },
  {
    icon: Users,
    title: "Caring",
    description: "Staff involve and treat people with compassion, kindness, dignity and respect",
  },
  {
    icon: Target,
    title: "Responsive",
    description: "Services organised to meet the needs of people who use them",
  },
  {
    icon: TrendingUp,
    title: "Well-led",
    description: "Leadership, management and governance of the organisation assure delivery of quality care",
  },
];

const qualifications = [
  "24+ years experience as CQC Adult Social Care Inspector",
  "Background in Mental Health and Social Work",
  "Expert in Adult Social Work and Mental Health Social Work",
  "Specialist in learning disability and mental health services",
  "Medicines optimisation and IPC expertise",
  "Registered CQC consultancy specialist",
];

export function AboutPage() {
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
            About Coach4Improvement
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-white/95 max-w-3xl mx-auto"
          >
            Health & Social Care Consultancy specialising in personalised regulatory improvement and compliance services
          </motion.p>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="mb-6">Our Story</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  <strong className="text-foreground">Coach4Improvement (C4i) Care Consultancy</strong> is a leading Health and Social Care Consultancy specialising in offering personalised Health and Social Care Regulatory Improvement and compliance services tailored to each client and their needs.
                </p>
                <p>
                  We provide expert regulatory advice, consultancy and improvement support for adults' social care, health providers. With vast experience in Social Care ranging from Adult Social Work, Mental Health Social Work to 24 years as a CQC Adult Social Care Inspector, our team brings unparalleled expertise to every engagement.
                </p>
                <p>
                  We support services with full-service audits, specific area audits (medicines, health and safety, IPC audits, governance audits). We have a crisis turnaround package with detailed investigations to find the root cause after incidents or poor inspection rating.
                </p>
                <p>
                  We can provide ongoing provider visits and provider reports on behalf of providers. We also check registered managers' reports and audits on behalf of the provider.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="rounded-2xl overflow-hidden shadow-xl">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1565647946321-a146ac24a220?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGhjYXJlJTIwdGVhbSUyMG9mZmljZXxlbnwxfHx8fDE3NjAyNjI5NjR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="C4i team collaborating"
                  className="w-full h-auto"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-accent">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-6 text-white">Our Mission</h2>
          <p className="text-xl text-white/90 max-w-3xl mx-auto mb-12">
            We help you assess your current Health and Social Care Act (2014) regulatory performance and develop and deliver improvement plans to help your services be safe, effective, caring, responsive and well-led.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6 mt-12">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6 text-center">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <value.icon className="w-8 h-8 text-primary" />
                    </div>
                    <h4 className="mb-2">{value.title}</h4>
                    <p className="text-sm text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Expertise Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="mb-4">Our Expertise</h2>
              <p className="text-muted-foreground">
                C4i offers a complete package, working with professionals with learning disability, mental health, medicines optimisation and IPC background. This allows us to provide you a holistic package.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {qualifications.map((qual, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <Award className="w-4 h-4 text-primary" />
                  </div>
                  <p className="text-muted-foreground">{qual}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Holistic Approach Section */}
      <section className="py-16 bg-gradient-to-br from-primary to-secondary text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-white mb-6">A Holistic Approach</h2>
            <p className="text-xl text-white/95 mb-8">
              Our team's diverse backgrounds in social work, mental health, CQC inspection, and specialized care allow us to provide comprehensive, integrated solutions that address all aspects of your care service.
            </p>
            <p className="text-white/90">
              Whether you need support with CQC registration, ongoing compliance, crisis intervention, or long-term improvement strategies, we have the expertise and experience to guide you every step of the way.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
