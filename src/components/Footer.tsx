import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gradient-to-r from-primary to-secondary text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                <span>C4i</span>
              </div>
              <div>
                <h4 className="text-white">Coach4Improvement</h4>
              </div>
            </div>
            <p className="text-white/90 text-sm">
              Solution Focused Care Consultancy providing personalised Health and Social Care Compliance & Improvement Services
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-4 text-white">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#home" className="text-white/90 hover:text-white transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="#about" className="text-white/90 hover:text-white transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#services" className="text-white/90 hover:text-white transition-colors">
                  Services
                </a>
              </li>
              <li>
                <a href="#packages" className="text-white/90 hover:text-white transition-colors">
                  Packages & Pricing
                </a>
              </li>
              <li>
                <a href="#contact" className="text-white/90 hover:text-white transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="mb-4 text-white">Our Services</h4>
            <ul className="space-y-2 text-sm text-white/90">
              <li>CQC Support</li>
              <li>Health & Safety Audits</li>
              <li>Medicines Optimisation</li>
              <li>Safeguarding Reviews</li>
              <li>Crisis Turnaround</li>
              <li>Compliance Support</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="mb-4 text-white">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <Phone className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-white/90">Mobile: 07359257530</p>
                  <p className="text-white/90">WhatsApp: 07404717002</p>
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
                  href="https://wa.me/447404717002"
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
            GDPR Compliant | Your data is safe and secure with us
          </p>
        </div>
      </div>
    </footer>
  );
}
