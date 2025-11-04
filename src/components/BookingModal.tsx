"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Calendar } from "./ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Calendar as CalendarIcon, CreditCard, FileText } from "lucide-react";
import { toast } from "sonner@2.0.3";

interface BookingModalProps {
  open: boolean;
  onClose: () => void;
}

const services = [
  "CQC Inspections & Ratings",
  "Registration Forms for CQC",
  "Medicines Optimisation Audits",
  "Health & Safety / IPC Audits",
  "Safeguarding Reviews",
  "Deprivation of Liberty Safeguards",
  "Recruitment Processes",
  "Crisis Turnaround Package",
  "Monthly Consultancy Subscription",
  "Other - Please specify in message",
];

const timeSlots = [
  "09:00 - 10:00",
  "10:00 - 11:00",
  "11:00 - 12:00",
  "12:00 - 13:00",
  "13:00 - 14:00",
  "14:00 - 15:00",
  "15:00 - 16:00",
  "16:00 - 17:00",
];

export function BookingModal({ open, onClose }: BookingModalProps) {
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [bookingData, setBookingData] = useState({
    name: "",
    email: "",
    organisation: "",
    phone: "",
    service: "",
    timeSlot: "",
    message: "",
    paymentMethod: "card",
  });

  const handleChange = (field: string, value: string) => {
    setBookingData({ ...bookingData, [field]: value });
  };

  const handleSubmit = () => {
    try {
      const to = "praiseekpo2@gmail.com";
      const subject = `New Consultation Booking – ${bookingData.name || "Unknown"}`;
      const lines = [
        "A new booking has been submitted:",
        "",
        `Name: ${bookingData.name}`,
        `Email: ${bookingData.email}`,
        `Organisation: ${bookingData.organisation || "N/A"}`,
        `Phone: ${bookingData.phone || "N/A"}`,
        `Service: ${bookingData.service || "N/A"}`,
        `Preferred Date: ${selectedDate ? selectedDate.toDateString() : "N/A"}`,
        `Preferred Time: ${bookingData.timeSlot || "N/A"}`,
        `Payment Method: ${bookingData.paymentMethod}`,
        "",
        "Message:",
        bookingData.message || "(none)",
      ];
      const body = lines.join("\n");

      const webhook = (import.meta as any).env?.VITE_EMAIL_WEBHOOK_URL as string | undefined;

      if (webhook) {
        // Optional: post to a backend/webhook if configured
        fetch(webhook, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ to, subject, body }),
        }).catch(() => {});
      }

      // Always trigger a mail client as a fallback/delivery path
      const mailto = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      if (typeof window !== "undefined") {
        window.location.href = mailto;
      }

      toast.success("Booking details prepared in your email client.");
    } catch (e) {
      toast.error("Could not prepare the email. Please try again.");
    }

    onClose();
    // Reset form
    setStep(1);
    setSelectedDate(undefined);
    setBookingData({
      name: "",
      email: "",
      organisation: "",
      phone: "",
      service: "",
      timeSlot: "",
      message: "",
      paymentMethod: "card",
    });
  };

  const canProceedToStep2 = bookingData.name && bookingData.email && bookingData.service;
  const canProceedToStep3 = selectedDate && bookingData.timeSlot;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Book a Consultation</DialogTitle>
          <DialogDescription>
            Fill in your details to book a consultation with our expert team
          </DialogDescription>
        </DialogHeader>

        <Tabs value={`step${step}`} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="step1" disabled={step < 1}>
              1. Details
            </TabsTrigger>
            <TabsTrigger value="step2" disabled={step < 2}>
              2. Date & Time
            </TabsTrigger>
            <TabsTrigger value="step3" disabled={step < 3}>
              3. Payment
            </TabsTrigger>
          </TabsList>

          <TabsContent value="step1" className="space-y-6 mt-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  placeholder="John Smith"
                  value={bookingData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={bookingData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="organisation">Organisation</Label>
                <Input
                  id="organisation"
                  placeholder="Your Care Home"
                  value={bookingData.organisation}
                  onChange={(e) => handleChange("organisation", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="07123456789"
                  value={bookingData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="service">Service Required *</Label>
                <Select value={bookingData.service} onValueChange={(value) => handleChange("service", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a service" />
                  </SelectTrigger>
                  <SelectContent>
                    {services.map((service) => (
                      <SelectItem key={service} value={service}>
                        {service}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Additional Information</Label>
                <Textarea
                  id="message"
                  placeholder="Any specific requirements or questions..."
                  rows={4}
                  value={bookingData.message}
                  onChange={(e) => handleChange("message", e.target.value)}
                />
              </div>
            </div>

            <Button onClick={() => setStep(2)} disabled={!canProceedToStep2} className="w-full" size="lg">
              Continue to Date Selection
            </Button>
          </TabsContent>

          <TabsContent value="step2" className="space-y-6 mt-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Select a Date *</Label>
                <Card>
                  <CardContent className="pt-6 flex justify-center">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      disabled={(date) => date < new Date()}
                      className="rounded-md border"
                    />
                  </CardContent>
                </Card>
              </div>

              {selectedDate && (
                <div className="space-y-2">
                  <Label>Select Time Slot *</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {timeSlots.map((slot) => (
                      <button
                        key={slot}
                        onClick={() => handleChange("timeSlot", slot)}
                        className={`p-3 rounded-lg border text-sm transition-colors ${
                          bookingData.timeSlot === slot
                            ? "bg-primary text-primary-foreground border-primary"
                            : "hover:bg-accent"
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <Button onClick={() => setStep(1)} variant="outline" className="w-full">
                Back
              </Button>
              <Button onClick={() => setStep(3)} disabled={!canProceedToStep3} className="w-full">
                Continue to Payment
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="step3" className="space-y-6 mt-6">
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Booking Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Service:</span>
                    <span>{bookingData.service}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Date:</span>
                    <span>{selectedDate?.toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Time:</span>
                    <span>{bookingData.timeSlot}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t">
                    <span className="text-muted-foreground">Consultation Fee:</span>
                    <span>£150.00</span>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-2">
                <Label>Payment Method</Label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleChange("paymentMethod", "card")}
                    className={`p-4 rounded-lg border flex flex-col items-center gap-2 transition-colors ${
                      bookingData.paymentMethod === "card"
                        ? "bg-primary text-primary-foreground border-primary"
                        : "hover:bg-accent"
                    }`}
                  >
                    <CreditCard className="w-6 h-6" />
                    <span className="text-sm">Card Payment</span>
                  </button>
                  <button
                    onClick={() => handleChange("paymentMethod", "invoice")}
                    className={`p-4 rounded-lg border flex flex-col items-center gap-2 transition-colors ${
                      bookingData.paymentMethod === "invoice"
                        ? "bg-primary text-primary-foreground border-primary"
                        : "hover:bg-accent"
                    }`}
                  >
                    <FileText className="w-6 h-6" />
                    <span className="text-sm">Invoice</span>
                  </button>
                </div>
              </div>

              {bookingData.paymentMethod === "card" && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Card Details</CardTitle>
                    <CardDescription>Enter your payment information</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Card Number</Label>
                      <Input placeholder="1234 5678 9012 3456" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Expiry Date</Label>
                        <Input placeholder="MM/YY" />
                      </div>
                      <div className="space-y-2">
                        <Label>CVV</Label>
                        <Input placeholder="123" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {bookingData.paymentMethod === "invoice" && (
                <Card className="bg-accent">
                  <CardContent className="pt-6">
                    <p className="text-sm text-white/90">
                      An invoice will be sent to your email address. Payment is due within 7 days of the consultation date.
                    </p>
                  </CardContent>
                </Card>
              )}

              <p className="text-xs text-muted-foreground text-center">
                By confirming this booking, you agree to our terms of service and privacy policy. All payments are secure and encrypted.
              </p>
            </div>

            <div className="flex gap-3">
              <Button onClick={() => setStep(2)} variant="outline" className="w-full">
                Back
              </Button>
              <Button onClick={handleSubmit} className="w-full" size="lg">
                Confirm Booking
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
