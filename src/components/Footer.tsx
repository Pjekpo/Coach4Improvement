import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";
import LogoImage from "../assets/Asset 1.png";

export function Footer() {
  return (
    <footer className="bg-gradient-to-r from-primary to-secondary text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
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
                <h4 className="text-white">Coach4Improvement</h4>
              </div>
            </div>
            <p className="text-white/90 text-sm">
              Solution Focused Care Consultancy providing personalised Health and Social Care Compliance & Improvement Services
            </p>
          </div>

          
          {/* Contact Info */}
          <div>
            <h4 className="mb-4 text-white">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <Phone className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-white/90">Mobile: +447359257530</p>
                  <p className="text-white/90">WhatsApp/Text: +447352453489</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <a href="mailto:coach4improvement@gmail.com" className="text-white/90 hover:text-white transition-colors">
                  coach4improvement@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MessageCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <a
                  href="https://wa.me/447352453489"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/90 hover:text-white transition-colors"
                >
                  Chat on WhatsApp
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/20 mt-8 pt-8 text-center text-sm text-white/80">
          <p>© 2025 Coach4Improvement (C4i) Care Consultancy. All rights reserved.</p>
          <p className="mt-2">
           Developed by{' Praise Ekpo'}
          </p>
        </div>
      </div>
    </footer>
  );
}
