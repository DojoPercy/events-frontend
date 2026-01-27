"use client";

import { motion } from "framer-motion";
import { Globe, TrendingUp, Heart, ShieldCheck } from "lucide-react";

export function Impact() {
  const reasons = [
    {
      icon: Globe,
      title: "Climate Resilience",
      description:
        "Reducing carbon footprints and building infrastructure that withstands environmental shifts.",
    },
    {
      icon: TrendingUp,
      title: "Economic Competitiveness",
      description:
        "Efficient transport systems are the backbone of thriving cities and robust economies.",
    },
    {
      icon: ShieldCheck,
      title: "Inclusive Urban Development",
      description:
        "Ensuring mobility is accessible, safe, and equitable for all urban residents.",
    },
    {
      icon: Heart,
      title: "Improved Quality of Life",
      description:
        "Reducing congestion and pollution to create healthier, more livable cities.",
    },
  ];

  return (
    <section id="why-matters" className="py-24 md:py-32 bg-gray-50">
      <div className="container px-4">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:w-1/2"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-900 text-white text-xs font-bold uppercase tracking-wider mb-6">
              The Imperative
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-8 font-heading leading-tight text-gray-900">
              Why This Platform <span className="text-green-600">Matters</span>
            </h2>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Africa's cities are growing rapidly, placing increasing pressure
              on transport systems, energy use, and urban infrastructure.
              Sustainable mobility is no longer optional—it is essential for our
              future.
            </p>
            <div className="p-6 bg-white rounded-2xl border border-gray-200 shadow-sm">
              <p className="text-gray-700 italic leading-relaxed">
                "The Green Mobility & Sustainable Transport Awards Africa
                provides a trusted platform to recognise progress, inspire
                leadership, and accelerate collaboration."
              </p>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-sm font-semibold text-gray-900">
                  Continental Impact Initiative
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Powered by The Technology Boardroom
                </p>
              </div>
            </div>
          </motion.div>

          {/* Cards Grid */}
          <div className="lg:w-1/2 grid sm:grid-cols-2 gap-6">
            {reasons.map((reason, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group bg-white p-6 rounded-2xl border border-gray-200 hover:border-green-200 hover:shadow-lg transition-all duration-500"
              >
                {/* Subtle Green Glow on Hover */}
                <div className="absolute inset-0 bg-green-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />

                <div className="relative">
                  <div className="w-12 h-12 rounded-xl bg-gray-100 group-hover:bg-green-600 flex items-center justify-center mb-4 transition-all duration-500">
                    <reason.icon className="w-6 h-6 text-gray-700 group-hover:text-white transition-colors duration-500" />
                  </div>
                  <h3 className="font-bold text-lg mb-2 text-gray-900 group-hover:text-green-700 transition-colors">
                    {reason.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {reason.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
