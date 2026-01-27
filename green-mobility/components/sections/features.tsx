"use client";

import { motion } from "framer-motion";
import { MessageSquare, Lightbulb, Trophy, ArrowRight } from "lucide-react";

export function Features() {
  const features = [
    {
      icon: MessageSquare,
      number: "01",
      title: "Green Mobility Forum",
      description:
        "High-level policy and leadership conversations on sustainable transport strategies, smart mobility, innovation, and climate-aligned investment.",
    },
    {
      icon: Lightbulb,
      number: "02",
      title: "Innovation Showcase",
      description:
        "A curated presentation of cutting-edge technologies, projects, and initiatives supporting clean mobility, electric transport, and sustainable logistics.",
    },
    {
      icon: Trophy,
      number: "03",
      title: "Prestigious Awards",
      description:
        "Celebrating outstanding leadership, institutions, and organisations driving sustainable transport, urban mobility, and climate action across Africa.",
    },
  ];

  return (
    <section
      id="features"
      className="py-24 md:py-32 bg-gray-50 relative overflow-hidden"
    >
      {/* Subtle Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(34,197,94,0.03),transparent_70%)]" />

      <div className="container px-4 relative z-10">
        {/* Header */}
        <div className="max-w-3xl mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-900 text-white text-xs font-bold uppercase tracking-wider mb-6">
              Event Components
            </div>
            <h2 className="text-4xl md:text-5xl font-bold font-heading text-gray-900 mb-6 leading-tight">
              Three Pillars of <br />
              <span className="text-green-600">Continental Impact</span>
            </h2>
            <p className="text-xl text-gray-600">
              A dynamic blend of thought leadership, solution showcasing, and
              awards recognition.
            </p>
          </motion.div>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.6 }}
              className="group relative"
            >
              {/* Card */}
              <div className="relative h-full bg-white rounded-3xl p-8 border border-gray-200 shadow-sm hover:shadow-xl hover:border-green-200 transition-all duration-500 overflow-hidden">
                {/* Subtle Green Glow on Hover */}
                <div className="absolute inset-0 bg-green-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Number Badge */}
                <div className="absolute top-6 right-6 text-7xl font-bold text-gray-50 group-hover:text-green-50 transition-colors duration-500">
                  {feature.number}
                </div>

                {/* Icon */}
                <div className="relative mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-gray-100 group-hover:bg-green-600 flex items-center justify-center shadow-sm group-hover:shadow-lg transition-all duration-500">
                    <feature.icon className="w-8 h-8 text-gray-700 group-hover:text-white transition-colors duration-500" />
                  </div>
                </div>

                {/* Content */}
                <div className="relative">
                  <h3 className="text-2xl font-bold mb-4 text-gray-900 group-hover:text-green-700 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    {feature.description}
                  </p>

                  {/* Learn More Link */}
                  <div className="flex items-center gap-2 text-sm font-semibold text-gray-400 group-hover:text-green-600 transition-colors">
                    <span>Learn More</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                {/* Bottom Accent Line */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-green-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
