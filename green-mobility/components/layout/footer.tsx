import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white pt-20 pb-10">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="space-y-6">
            <img
              src="/logowhite.png"
              alt="Green Mobility Awards"
              className="h-16 w-auto"
            />
            <p className="text-gray-400 text-sm leading-relaxed">
              Advancing Green Mobility and Sustainable Transport Solutions for
              Africa’s Cities and Economies.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-lg mb-6">Quick Links</h4>
            <ul className="space-y-4 text-gray-400">
              <li>
                <Link
                  href="#about"
                  className="hover:text-primary transition-colors"
                >
                  About the Event
                </Link>
              </li>
              <li>
                <Link
                  href="#awards"
                  className="hover:text-primary transition-colors"
                >
                  Award Categories
                </Link>
              </li>
              <li>
                <Link
                  href="#sponsors"
                  className="hover:text-primary transition-colors"
                >
                  Become a Sponsor
                </Link>
              </li>
              <li>
                <Link
                  href="#contact"
                  className="hover:text-primary transition-colors"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-lg mb-6">Contact Us</h4>
            <div className="space-y-4 text-gray-400">
              <div className="flex items-start gap-3">
                <MapPin className="text-primary w-5 h-5 mt-1" />
                <span>
                  Accra Marriott Hotel
                  <br />
                  Airport City, Accra – Ghana
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="text-primary w-5 h-5" />
                <span>+233 247 415 140</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="text-primary w-5 h-5" />
                <a
                  href="mailto:info@thetechnologyboardroom.com"
                  className="hover:text-white"
                >
                  info@thetechnologyboardroom.com
                </a>
              </div>
            </div>
          </div>

          {/* Powered By */}
          <div>
            <h4 className="font-bold text-lg mb-6">Powered By</h4>
            <div className="space-y-4">
              <div className="bg-white/5 p-4 rounded-lg">
                <p className="text-sm font-semibold text-gray-300">
                  The Technology Boardroom
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Organised & Powered by
                </p>
              </div>
              <div className="text-sm text-gray-400">
                <p className="font-semibold text-white mb-2">
                  In Collaboration with:
                </p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>Accra Metropolitan Assembly (AMA)</li>
                  <li>The Governance & Business Boardroom</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <p>© 2026 Green Mobility Awards. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-white">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-white">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
