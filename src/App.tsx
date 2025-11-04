"use client";

import { useState } from "react";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { HomePage } from "./components/HomePage";
import { AboutPage } from "./components/AboutPage";
import { ServicesPage } from "./components/ServicesPage";
import { PackagesPage } from "./components/PackagesPage";
import { ContactPage } from "./components/ContactPage";
import { BookingModal } from "./components/BookingModal";
import { Toaster } from "./components/ui/sonner";

export default function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [bookingModalOpen, setBookingModalOpen] = useState(false);

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <HomePage onNavigate={setCurrentPage} onOpenBooking={() => setBookingModalOpen(true)} />;
      case "about":
        return <AboutPage />;
      case "services":
        return <ServicesPage onOpenBooking={() => setBookingModalOpen(true)} />;
      case "packages":
        return <PackagesPage onOpenBooking={() => setBookingModalOpen(true)} />;
      case "contact":
        return <ContactPage />;
      default:
        return <HomePage onNavigate={setCurrentPage} onOpenBooking={() => setBookingModalOpen(true)} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header currentPage={currentPage} onNavigate={setCurrentPage} onOpenBooking={() => setBookingModalOpen(true)} />
      <main className="flex-1">
        {renderPage()}
      </main>
      <Footer />
      <BookingModal open={bookingModalOpen} onClose={() => setBookingModalOpen(false)} />
      <Toaster />
    </div>
  );
}
