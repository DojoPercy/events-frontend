"use client";

import { motion } from "framer-motion";

export function Partners() {
  return (
    <section id="sponsors" className="py-20 bg-gray-50 text-center">
      <div className="container px-4">
        <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-10">
          Organised & Powered By
        </h3>

        <div className="flex flex-wrap items-center justify-center gap-12 md:gap-20 mb-16 grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
          {/* Logo placeholders - text for now as we don't have images */}
          <div className="text-xl font-bold text-gray-800">
            The Technology Boardroom
          </div>
        </div>

        <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-10">
          In Collaboration With
        </h3>

        <div className="flex flex-wrap items-center justify-center gap-12 md:gap-20 opacity-70">
          <div className="flex flex-col items-center gap-4">
            <img
              src="/ama.png"
              alt="Accra Metropolitan Assembly"
              className="h-20 w-auto object-contain"
            />
            <div className="text-lg font-semibold text-gray-600">
              Accra Metropolitan Assembly
            </div>
          </div>

          <div className="h-24 w-px bg-gray-300 hidden md:block" />

          <div className="flex flex-col items-center gap-4">
            <img
              src="/gov.png"
              alt="The Governance & Business Boardroom"
              className="h-20 w-auto object-contain"
            />
            <div className="text-lg font-semibold text-gray-600">
              The Governance & Business Boardroom
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
