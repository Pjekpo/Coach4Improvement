"use client";

import { useState } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { HomePage } from "./components/HomePage";
import { AboutPage } from "./components/AboutPage";
import { ServicesPage } from "./components/ServicesPage";
import { PackagesPage } from "./components/PackagesPage";
import { ContactPage } from "./components/ContactPage";
import { BookingModal } from "./components/BookingModal";
import { Toaster } from "./components/ui/sonner";

function RoutedApp() {
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleNavigate = (page: string) => {
    // Map legacy page keys to paths so existing components work
    const map: Record<string, string> = {
      home: "/",
      about: "/about",
      services: "/services",
      packages: "/packages",
      contact: "/contact",
    };
    navigate(map[page] ?? "/");
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header onOpenBooking={() => setBookingModalOpen(true)} />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage onNavigate={handleNavigate} onOpenBooking={() => setBookingModalOpen(true)} />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/services" element={<ServicesPage onOpenBooking={() => setBookingModalOpen(true)} />} />
          <Route path="/packages" element={<PackagesPage onOpenBooking={() => setBookingModalOpen(true)} />} />
          <Route path="/contact" element={<ContactPage />} />
        </Routes>
      </main>
      <Footer />
      <BookingModal open={bookingModalOpen} onClose={() => setBookingModalOpen(false)} />
      <Toaster />
    </div>
  );
}

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <RoutedApp />
      </BrowserRouter>
    </HelmetProvider>
  );
}
