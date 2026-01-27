"use client";

import { motion } from "framer-motion";
import {
  Trophy,
  Leaf,
  Zap,
  Bus,
  Map,
  Smartphone,
  ArrowRight,
} from "lucide-react";

export function Awards() {
  const categories = [
    {
      icon: Leaf,
      title: "Clean & Alternative Transport",
      description:
        "Innovations in biofuels, hydrogen, and low-carbon transport solutions.",
    },
    {
      icon: Smartphone,
      title: "Smart Mobility Systems",
      description:
        "Intelligent transport systems (ITS), MaaS, and data-driven urban mobility.",
    },
    {
      icon: Bus,
      title: "Sustainable Public Transport",
      description:
        "Excellence in BRT systems, rail, and mass transit integration.",
    },
    {
      icon: Zap,
      title: "Electric Mobility",
      description:
        "Leadership in EV adoption, fleet electrification, and charging infrastructure.",
    },
    {
      icon: Map,
      title: "Climate-Smart Planning",
      description:
        "Urban planning strategies that prioritize non-motorized transport and resilience.",
    },
  ];

  const recognitionGroups = [
    "Government institutions and city authorities",
    "State-owned enterprises and public agencies",
    "Private sector organisations and solution providers",
    "Development partners and collaborative initiatives",
    "Exceptional individual leaders",
  ];

  return (
    <section
      id="awards"
      className="py-24 md:py-32 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden"
    >
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(34,197,94,0.03),transparent_60%)]" />

      <div className="container px-4 relative z-10">
        {/* Header */}
        <div className="max-w-3xl mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-900 text-white text-xs font-bold uppercase tracking-wider mb-6">
              <Trophy className="w-3 h-3" />
              Award Categories
            </div>
            <h2 className="text-4xl md:text-5xl font-bold font-heading text-gray-900 mb-6 leading-tight">
              Celebrating Excellence in <br />
              <span className="text-green-600">Sustainable Mobility</span>
            </h2>
            <p className="text-xl text-gray-600">
              Recognizing the pioneers driving Africa towards a cleaner, more
              efficient future.
            </p>
          </motion.div>
        </div>

        {/* Categories Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {categories.map((cat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative bg-white rounded-3xl p-8 border border-gray-200 hover:border-green-200 shadow-sm hover:shadow-xl transition-all duration-500"
            >
              {/* Subtle Green Glow on Hover */}
              <div className="absolute inset-0 bg-green-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />

              {/* Icon */}
              <div className="relative mb-6">
                <div className="w-14 h-14 rounded-2xl bg-gray-100 group-hover:bg-green-600 flex items-center justify-center transition-all duration-500">
                  <cat.icon className="w-7 h-7 text-gray-700 group-hover:text-white transition-colors duration-500" />
                </div>
              </div>

              {/* Content */}
              <div className="relative">
                <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-green-700 transition-colors">
                  {cat.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {cat.description}
                </p>
              </div>

              {/* Bottom Accent */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-green-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-b-3xl" />
            </motion.div>
          ))}

          {/* Nomination CTA Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="group bg-gray-900 rounded-3xl p-8 flex flex-col justify-center items-center text-center cursor-pointer hover:bg-green-600 transition-all duration-500 shadow-lg"
          >
            <Trophy className="w-12 h-12 text-white mb-4 group-hover:scale-110 transition-transform duration-500" />
            <h3 className="text-xl font-bold mb-2 text-white">
              Submit Nomination
            </h3>
            <p className="text-gray-300 text-sm mb-4">
              Join the ranks of leaders.
            </p>
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <span>Learn More</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </motion.div>
        </div>

        {/* Recognition Section */}
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h3 className="text-2xl md:text-3xl font-bold font-heading text-gray-900 mb-4">
              Who We Recognize
            </h3>
            <p className="text-gray-600">
              Awards are conferred based on impact, innovation, scalability, and
              contribution to sustainable development.
            </p>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-3">
            {recognitionGroups.map((group, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="px-5 py-3 rounded-full bg-white border border-gray-200 text-sm font-medium text-gray-700 hover:border-green-200 hover:bg-green-50 transition-all"
              >
                {group}
              </motion.span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
