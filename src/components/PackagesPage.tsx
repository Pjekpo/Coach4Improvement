"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { Check, Star } from "lucide-react";
import { motion } from "motion/react";

interface PackagesPageProps {
  onOpenBooking: () => void;
}

const packages = [
  {
    name: "Basic",
    description: "Essential compliance support for established services",
    monthlyPrice: 299,
    annualPrice: 2990,
    features: [
      "Quarterly compliance review",
      "Email support",
      "Annual mock inspection",
      "Policy template access",
      "Compliance checklist",
    ],
    highlighted: false,
  },
  {
    name: "Standard",
    description: "Comprehensive support for growing care services",
    monthlyPrice: 599,
    annualPrice: 5990,
    features: [
      "Monthly provider visits",
      "Priority email & phone support",
      "Quarterly mock inspections",
      "Document review & feedback",
      "Staff training guidance",
      "Bi-annual full audit",
      "Action plan development",
    ],
    highlighted: true,
  },
  {
    name: "Premium",
    description: "Full-service consultancy for comprehensive care",
    monthlyPrice: 999,
    annualPrice: 9990,
    features: [
      "Bi-weekly provider visits",
      "24/7 urgent support line",
      "Monthly comprehensive audits",
      "Unlimited document reviews",
      "On-site staff training",
      "Quarterly full service audit",
      "Dedicated account manager",
      "CQC inspection preparation",
      "Crisis intervention support",
    ],
    highlighted: false,
  },
];

const additionalServices = [
  {
    name: "One-off Comprehensive Audit",
    price: "£750",
    description: "Full service audit with detailed report and action plan",
  },
  {
    name: "CQC Registration Support",
    price: "£1,200",
    description: "Complete application assistance from start to finish",
  },
  {
    name: "Crisis Turnaround Package",
    price: "£2,500",
    description: "Intensive 4-week intervention with ongoing support",
  },
  {
    name: "Mock CQC Inspection",
    price: "£650",
    description: "Comprehensive inspection simulation with detailed feedback",
  },
  {
    name: "Medicines Audit",
    price: "£450",
    description: "Thorough medicines management review",
  },
  {
    name: "Staff Training Session",
    price: "£350",
    description: "Half-day on-site training for your team (per session)",
  },
];

export function PackagesPage({ onOpenBooking }: PackagesPageProps) {
  const [isAnnual, setIsAnnual] = useState(false);

  const calculateSavings = (monthly: number, annual: number) => {
    const monthlyCost = monthly * 12;
    const savings = monthlyCost - annual;
    return Math.round((savings / monthlyCost) * 100);
  };

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
            Packages & Pricing
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-white/95 max-w-3xl mx-auto"
          >
            Choose the right support package for your care service. Flexible monthly or annual subscriptions.
          </motion.p>
        </div>
      </section>

      {/* Pricing Toggle */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-4">
            <Label htmlFor="billing-toggle" className={!isAnnual ? "" : "text-muted-foreground"}>
              Monthly
            </Label>
            <Switch
              id="billing-toggle"
              checked={isAnnual}
              onCheckedChange={setIsAnnual}
            />
            <Label htmlFor="billing-toggle" className={isAnnual ? "" : "text-muted-foreground"}>
              Annual
            </Label>
            {isAnnual && (
              <Badge className="bg-secondary text-secondary-foreground ml-2">
                Save up to 17%
              </Badge>
            )}
          </div>
        </div>
      </section>

      {/* Subscription Packages */}
      <section className="pb-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {packages.map((pkg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8 }}
              >
                <Card className={`h-full flex flex-col relative ${pkg.highlighted ? "border-primary border-2 shadow-xl" : ""}`}>
                  {pkg.highlighted && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <Badge className="bg-primary text-primary-foreground flex items-center gap-1 px-4 py-1">
                        <Star className="w-4 h-4 fill-current" />
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  <CardHeader className="text-center pb-8">
                    <CardTitle className="text-2xl mb-2">{pkg.name}</CardTitle>
                    <CardDescription className="mb-4">{pkg.description}</CardDescription>
                    <div className="mb-2">
                      <span className="text-4xl">
                        £{isAnnual ? pkg.annualPrice : pkg.monthlyPrice}
                      </span>
                      <span className="text-muted-foreground">
                        /{isAnnual ? "year" : "month"}
                      </span>
                    </div>
                    {isAnnual && (
                      <p className="text-sm text-muted-foreground">
                        Save {calculateSavings(pkg.monthlyPrice, pkg.annualPrice)}%
                      </p>
                    )}
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    <ul className="space-y-3 mb-8 flex-1">
                      {pkg.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Check className="w-3 h-3 text-primary" />
                          </div>
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      onClick={onOpenBooking}
                      className="w-full"
                      variant={pkg.highlighted ? "default" : "outline"}
                      size="lg"
                    >
                      Choose {pkg.name}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* One-off Services */}
      <section className="py-16 bg-accent">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="mb-4">One-off Services</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Need specific support without a subscription? We offer individual services tailored to your needs.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {additionalServices.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <CardTitle className="text-lg">{service.name}</CardTitle>
                      <Badge variant="outline" className="text-primary border-primary">
                        {service.price}
                      </Badge>
                    </div>
                    <CardDescription>{service.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button onClick={onOpenBooking} variant="outline" className="w-full">
                      Book Service
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-center mb-12">Package Comparison</h2>
          <div className="overflow-x-auto">
            <table className="w-full max-w-5xl mx-auto">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-4 px-4">Feature</th>
                  <th className="text-center py-4 px-4">Basic</th>
                  <th className="text-center py-4 px-4 bg-primary/5">Standard</th>
                  <th className="text-center py-4 px-4">Premium</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-3 px-4">Provider Visits</td>
                  <td className="text-center py-3 px-4">Quarterly</td>
                  <td className="text-center py-3 px-4 bg-primary/5">Monthly</td>
                  <td className="text-center py-3 px-4">Bi-weekly</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4">Mock Inspections</td>
                  <td className="text-center py-3 px-4">Annual</td>
                  <td className="text-center py-3 px-4 bg-primary/5">Quarterly</td>
                  <td className="text-center py-3 px-4">Monthly</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4">Support</td>
                  <td className="text-center py-3 px-4">Email</td>
                  <td className="text-center py-3 px-4 bg-primary/5">Email & Phone</td>
                  <td className="text-center py-3 px-4">24/7 Urgent</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4">Staff Training</td>
                  <td className="text-center py-3 px-4">Guidance</td>
                  <td className="text-center py-3 px-4 bg-primary/5">Guidance</td>
                  <td className="text-center py-3 px-4">On-site</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4">Dedicated Manager</td>
                  <td className="text-center py-3 px-4">-</td>
                  <td className="text-center py-3 px-4 bg-primary/5">-</td>
                  <td className="text-center py-3 px-4"><Check className="w-5 h-5 text-primary mx-auto" /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary to-secondary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-white mb-4">Need a Custom Package?</h2>
          <p className="text-xl mb-8 text-white/95 max-w-2xl mx-auto">
            Every care service is unique. Contact us to discuss a bespoke package tailored to your specific needs.
          </p>
          <Button
            size="lg"
            onClick={onOpenBooking}
            className="bg-white text-primary hover:bg-white/90"
          >
            Request Custom Quote
          </Button>
        </div>
      </section>
    </div>
  );
}
