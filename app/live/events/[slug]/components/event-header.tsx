"use client";

import { useState } from "react";
import { MenuIcon, XIcon } from "lucide-react";

interface EventHeaderProps {
  title: string;
  logoUrl?: string | null;
  primaryColor: string;
}

export function EventHeader({
  title,
  logoUrl,
  primaryColor,
}: EventHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur border-b">
      <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt="Event Logo"
                className="h-8 sm:h-12 object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            ) : (
              <div className="h-8 sm:h-12 flex items-center">
                <span
                  className="font-bold text-lg sm:text-xl"
                  style={{ color: primaryColor }}
                >
                  {title}
                </span>
              </div>
            )}
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#about" className="hover:text-gray-600 transition-colors">
              About
            </a>
            <a
              href="#tickets"
              className="hover:text-gray-600 transition-colors"
            >
              Tickets
            </a>
            <a href="#venue" className="hover:text-gray-600 transition-colors">
              Venue
            </a>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <XIcon className="h-6 w-6" />
            ) : (
              <MenuIcon className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 flex flex-col space-y-3 border-t pt-4">
            <a
              href="#about"
              className="hover:text-gray-600 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </a>
            <a
              href="#tickets"
              className="hover:text-gray-600 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Tickets
            </a>
            <a
              href="#venue"
              className="hover:text-gray-600 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Venue
            </a>
          </nav>
        )}
      </div>
    </header>
  );
}
