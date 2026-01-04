"use client";

import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X, Phone, Mail } from "lucide-react";
import { Button } from "./ui/button";
import LogoImage from "../assets/asset-1.png"; // NOTE: ensure filename matches src/assets/asset-1.png
import ProfileImage from "../assets/Profile.jpg";
import { useAuth } from "@/auth/AuthProvider";
import AuthModal from "@/components/AuthModal";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const { user, signOut } = useAuth();
  const isLoggedIn = Boolean(user);
  const displayName = (user?.user_metadata as { display_name?: string } | undefined)?.display_name?.trim();
  const userEmail = user?.email;
  const welcomeName = displayName || userEmail;

  const avatar =
    (user?.user_metadata as any)?.avatar_url ||
    (user?.user_metadata as any)?.picture ||
    (user?.user_metadata as any)?.avatar;
  const displayAvatar = avatar || ProfileImage;

  const navLinks = [
    { name: "Home", to: "/" },
    { name: "About Us", to: "/about" },
    { name: "Services", to: "/services" },
    { name: "Resources", to: "/resources" },
    { name: "Contact", to: "/contact" },
  ];

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `px-4 py-2 rounded-lg transition-colors ${
      isActive ? "bg-primary text-primary-foreground" : "hover:bg-accent hover:text-accent-foreground"
    }`;

  useEffect(() => {
    if (isLoggedIn) {
      setAuthOpen(false);
    }
  }, [isLoggedIn]);

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
              <NavLink key={link.to} to={link.to} className={linkClass}>
                {link.name}
              </NavLink>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            {isLoggedIn && welcomeName && (
              <span className="text-sm font-semibold text-muted-foreground">Welcome, {welcomeName}</span>
            )}
            <Button
              onClick={async () => {
                if (isLoggedIn) {
                  await signOut();
                  return;
                }
                setAuthOpen(true);
              }}
              size="lg"
              variant="outline"
              className="flex items-center gap-2"
            >
              <span className="text-sm font-medium">{isLoggedIn ? "Sign Out" : "Sign Up"}</span>
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
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `block w-full text-left px-4 py-3 rounded-lg transition-colors ${
                    isActive ? "bg-primary text-primary-foreground" : "hover:bg-accent"
                  }`
                }
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </NavLink>
            ))}
            {isLoggedIn && welcomeName && (
              <div className="px-4 py-2 text-sm font-semibold text-muted-foreground">Welcome, {welcomeName}</div>
            )}
            <Button
              onClick={() => {
                setMobileMenuOpen(false);
                if (isLoggedIn) {
                  signOut();
                  return;
                }
                setAuthOpen(true);
              }}
              className="w-full mt-4 flex items-center gap-2"
              size="lg"
              variant="outline"
            >
              <span className="text-base font-medium">{isLoggedIn ? "Sign Out" : "Sign Up"}</span>
            </Button>
          </nav>
        )}
      </div>

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} defaultTab="signup" />
    </header>
  );
}
