"use client";

import { useState } from "react";
import { Menu, X, Phone, Mail } from "lucide-react";
import { Button } from "./ui/button";
import LogoImage from "../assets/Asset 1.png";

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function Header({ currentPage, onNavigate }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavigate = (page: string) => {
    onNavigate(page);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const navLinks = [
    { name: "Home", href: "home" },
    { name: "About Us", href: "about" },
    { name: "Services", href: "services" },
    { name: "Packages", href: "packages" },
    { name: "Contact", href: "contact" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="container mx-auto px-4">
        {/* Top bar with contact info */}
        <div className="hidden md:flex items-center justify-end gap-6 py-2 border-b border-gray-200">
          <a href="tel:+447359257530" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
            <Phone className="w-4 h-4" />
            <span>+447359257530</span>
          </a>
          <a href="mailto:coach4improvement@gmail.com" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
            <Mail className="w-4 h-4" />
            <span>coach4improvement@gmail.com</span>
          </a>
        </div>

        {/* Main navigation */}
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <div className="w-12 h-12 flex items-center justify-center overflow-hidden">
              <img
                src={LogoImage}
                alt="Coach4Improvement logo"
                className="w-12 h-12 object-contain"
                loading="eager"
                decoding="sync"
              />
            </div>
            <div>
              <h3 className="text-primary">Coach4Improvement</h3>
              <p className="text-xs text-muted-foreground">Health & Social Care Consultancy</p>
            </div>
          </div>

          {/* Desktop navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNavigate(link.href)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  currentPage === link.href
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                {link.name}
              </button>
            ))}
          </nav>

          <div className="hidden lg:block">
            <Button onClick={() => handleNavigate("contact")} size="lg">
              Book Consultation
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 hover:bg-accent rounded-lg transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile navigation */}
        {mobileMenuOpen && (
          <nav className="lg:hidden py-4 border-t border-gray-200">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => {
                  handleNavigate(link.href);
                  setMobileMenuOpen(false);
                }}
                className={`block w-full text-left px-4 py-3 rounded-lg transition-colors ${
                  currentPage === link.href
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-accent"
                }`}
              >
                {link.name}
              </button>
            ))}
            <Button
              onClick={() => {
                handleNavigate("contact");
                setMobileMenuOpen(false);
              }}
              className="w-full mt-4"
              size="lg"
            >
              Book Consultation
            </Button>
          </nav>
        )}
      </div>
    </header>
  );
}
