"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/90 backdrop-blur-md shadow-sm py-4"
          : "bg-transparent py-6"
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="relative z-50">
          <img
            src={!isScrolled ? "/logo.png" : "/logowhite.png"}
            alt="Green Mobility Awards"
            className="h-20 w-auto object-contain"
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-8">
          {[
            ["About", "#about"],
            ["Awards", "#awards"],
            ["Why Attend", "#why-attend"],
            ["Contact", "#contact"],
          ].map(([label, href]) => (
            <Link
              key={label}
              href={href}
              className={`text-sm font-medium transition-colors ${
                !isScrolled
                  ? "text-gray-700 hover:text-primary"
                  : "text-white/90 hover:text-white"
              }`}
            >
              {label}
            </Link>
          ))}
          <Button variant="gold" size="sm">
            Register Now
          </Button>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden relative z-50 p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className={isScrolled ? "text-gray-900" : "text-white"} />
          ) : (
            <Menu className={isScrolled ? "text-gray-900" : "text-white"} />
          )}
        </button>

        {/* Mobile Nav Overlay */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-0 left-0 w-full min-h-screen bg-white/95 backdrop-blur-xl pt-24 px-4 flex flex-col space-y-6 md:hidden"
            >
              {[
                ["About", "#about"],
                ["Awards", "#awards"],
                ["Why Attend", "#why-attend"],
                ["Contact", "#contact"],
              ].map(([label, href]) => (
                <Link
                  key={label}
                  href={href}
                  className="text-2xl font-bold text-gray-900"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {label}
                </Link>
              ))}
              <Button size="lg" className="w-full">
                Register Now
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
