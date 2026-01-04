"use client";

import { useState } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "./auth/AuthProvider";
import BookingPage from "./pages/BookingPage";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { HomePage } from "./components/HomePage";
import { AboutPage } from "./components/AboutPage";
import { ServicesPage } from "./components/ServicesPage";
import { ContactPage } from "./components/ContactPage";
import { PrivacyPolicyPage } from "./components/PrivacyPolicyPage";
import { TermsOfServicePage } from "./components/TermsOfServicePage";
import ResourcesPage from "./components/ResourcesPage";
import { BookingModal } from "./components/BookingModal";
import { Toaster } from "./components/ui/sonner";
import AuthCallback from "./pages/AuthCallback";

function RoutedApp() {
  const navigate = useNavigate();

  const handleNavigate = (page: string) => {
    // Map legacy page keys to paths so existing components work
    const map: Record<string, string> = {
      home: "/",
      about: "/about",
      services: "/services",
      resources: "/resources",
      contact: "/contact",
    };
    navigate(map[page] ?? "/");
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage onNavigate={handleNavigate} onOpenBooking={() => navigate('/booking')} />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/services" element={<ServicesPage onOpenBooking={() => navigate('/booking')} />} />
          <Route path="/resources" element={<ResourcesPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/terms-of-service" element={<TermsOfServicePage />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/booking" element={<BookingPage />} />
        </Routes>
      </main>
      <Footer />
      <Toaster />
    </div>
  );
}

export default function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <BrowserRouter>
          <RoutedApp />
        </BrowserRouter>
      </AuthProvider>
    </HelmetProvider>
  );
}
