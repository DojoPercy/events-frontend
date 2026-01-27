"use client";

import { motion } from "framer-motion";
import {
  Users,
  Globe2,
  Building2,
  Target,
  Sparkles,
  MessageSquare,
} from "lucide-react";

export function About() {
  const whoShouldAttend = [
    "Ministers of Transport & Energy",
    "City Mayors & Authorities",
    "Urban Planners & Regulators",
    "Development Partners",
    "Transport Operators",
  ];

  return (
    <section id="about" className="py-24 bg-white relative overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="grid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="container px-4 relative z-10">
        {/* 1. Header Section */}
        <div className="max-w-3xl mx-auto text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-50 border border-green-100 text-green-700 text-xs font-bold uppercase tracking-widest mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            About The Event
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold font-heading text-gray-900 mb-6 leading-tight"
          >
            Driving the Future of <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-700 to-green-500">
              Sustainable Mobility
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-gray-500 leading-relaxed"
          >
            The{" "}
            <span className="font-semibold text-gray-900">
              Green Mobility & Sustainable Transport Awards Africa 2026
            </span>{" "}
            is the continent's premier gathering for policymakers, innovators,
            and industry leaders dedicated to shaping a cleaner, more connected
            Africa.
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-stretch">
          {/* 2. Main Content Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-7 bg-white rounded-3xl p-8 md:p-10 border border-gray-100 shadow-xl shadow-gray-100/50 flex flex-col justify-between"
          >
            <div>
              <h3 className="text-2xl font-bold font-heading text-gray-900 mb-6 flex items-center gap-3">
                <Target className="w-6 h-6 text-green-600" />
                Core Objectives
              </h3>
              <div className="space-y-6">
                {[
                  {
                    title: "Celebrate Innovation",
                    desc: "Recognizing bold initiatives in low-carbon transport and infrastructure.",
                  },
                  {
                    title: "Accelerate Investment",
                    desc: "Bridging the gap between sustainable projects and green financing.",
                  },
                  {
                    title: "Policy Dialogue",
                    desc: "Facilitating high-level discussions to harmonize regulatory frameworks.",
                  },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 group">
                    <div className="mt-1 w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0 group-hover:bg-green-100 transition-colors">
                      <span className="text-green-700 font-bold font-heading">
                        {i + 1}
                      </span>
                    </div>
                    <div>
                      <h4 className="text-gray-900 font-bold mb-1">
                        {item.title}
                      </h4>
                      <p className="text-gray-500 text-sm leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-10 pt-8 border-t border-gray-100">
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="font-semibold text-green-700">
                  Held alongside:
                </span>
                Africa Governments Summit & Public Sector Innovation Awards 2026
              </div>
            </div>
          </motion.div>

          {/* 3. Side Cards Column */}
          <div className="lg:col-span-5 space-y-8 flex flex-col">
            {/* Who Should Attend */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-gray-900 text-white rounded-3xl p-8 relative overflow-hidden flex-1"
            >
              {/* Abstract Decoration */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-3xl -mr-10 -mt-10" />

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                    <Users className="w-5 h-5 text-green-400" />
                  </div>
                  <h3 className="text-xl font-bold font-heading">
                    Who Attends?
                  </h3>
                </div>

                <ul className="grid grid-cols-1 gap-3">
                  {whoShouldAttend.map((role, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-3 text-sm text-gray-300 font-medium"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                      {role}
                    </li>
                  ))}
                </ul>
                <div className="mt-6 pt-6 border-t border-white/10 text-xs text-gray-400">
                  + 500 Industry Leaders & Visionaries
                </div>
              </div>
            </motion.div>

            {/* Stat/Visual Box */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-green-50 rounded-3xl p-8 border border-green-100 flex items-center justify-between relative overflow-hidden group"
            >
              <div className="relative z-10">
                <p className="text-green-800 font-semibold mb-1">
                  Event Duration
                </p>
                <h3 className="text-4xl font-bold text-gray-900 font-heading">
                  1 <span className="text-green-600">Day</span>
                </h3>
                <p className="text-sm text-green-700/70 mt-2">
                  Full of Insights & Impact
                </p>
              </div>
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm z-10">
                <MessageSquare className="w-7 h-7 text-green-600" />
              </div>

              {/* Hover Effect */}
              <div className="absolute right-0 bottom-0 w-24 h-24 bg-green-200/20 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500" />
            </motion.div>
          </div>
        </div>

        {/* 4. Bottom Image Strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-8 relative h-48 md:h-64 rounded-3xl overflow-hidden group"
        >
          <img
            src="/mar.png"
            alt="Conference Experience"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent" />
          <div className="absolute bottom-6 left-6 md:left-10 text-white">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-green-400" />
              <span className="text-xs font-bold uppercase tracking-widest text-green-200">
                The Experience
              </span>
            </div>
            <h3 className="text-2xl font-bold font-heading">
              Innovation & Solutions Showcase
            </h3>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
