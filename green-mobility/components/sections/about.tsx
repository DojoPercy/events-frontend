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
    <section id="about" className="py-24 bg-gray-50">
      <div className="container px-4">
        {/* 1. Primary Description (Text Heavy) */}
        <div className="flex flex-col lg:flex-row gap-12 items-start mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:w-2/3"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100/50 border border-green-200 text-green-700 text-sm font-semibold uppercase tracking-wider mb-6">
              <Sparkles className="w-4 h-4" />
              About The Event
            </div>
            <h2 className="text-4xl md:text-5xl font-bold font-heading text-gray-900 mb-6 leading-tight">
              A Landmark Continental Platform for{" "}
              <span className="text-green-600">Sustainable Mobility</span>
            </h2>
            <div className="prose prose-lg text-gray-600 leading-relaxed space-y-4">
              <p>
                The{" "}
                <span className="font-semibold text-gray-900">
                  Green Mobility & Sustainable Transport Awards Africa 2026
                </span>{" "}
                is dedicated to recognizing leadership, innovation, and impact
                in advancing clean transport systems and climate-resilient
                infrastructure across Africa.
              </p>
              <p>
                Held alongside the{" "}
                <span className="font-semibold text-gray-900">
                  Africa Governments Summit & Public Sector Innovation Awards
                  2026
                </span>
                , this high-level gathering serves as a catalyst for policy
                dialogue, innovation showcasing, and continental recognition.
              </p>
            </div>
          </motion.div>

          {/* 2. Key Context Card (Right Side) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="lg:w-1/3 bg-white p-8 rounded-3xl border border-gray-100 shadow-xl"
          >
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-green-600" />
              Core Objectives
            </h3>
            <ul className="space-y-4">
              {[
                "Celebrate bold initiatives in low-carbon transport.",
                "Accelerate investment in sustainable infrastructure.",
                "Facilitate high-level policy dialogue.",
                "Showcase future-ready mobility solutions.",
              ].map((item, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 text-sm text-gray-600"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400 mt-1.5 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* 3. The Grid (Visuals + "Who Should Attend") */}
        <div className="grid md:grid-cols-4 gap-6">
          {/* Visual Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="md:col-span-2 bg-gray-900 rounded-3xl overflow-hidden relative group h-[300px]"
          >
            <img
              src="/mar.png"
              alt="Conference Interior"
              className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-700"
            />
            <div className="absolute bottom-6 left-6 right-6">
              <div className="text-white">
                <p className="text-xs font-bold uppercase tracking-wider mb-1 text-green-400">
                  The Experience
                </p>
                <h3 className="text-xl font-bold">
                  Innovation & Solutions Showcase
                </h3>
                <p className="text-sm text-gray-300 mt-2 line-clamp-2">
                  A curated presentation of cutting-edge technologies supporting
                  clean mobility and logistics.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Who Should Attend Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="md:col-span-1 bg-green-600 text-white p-6 rounded-3xl flex flex-col justify-between"
          >
            <div>
              <Users className="w-8 h-8 mb-4 text-green-200" />
              <h3 className="font-bold text-lg mb-4">Who Should Attend?</h3>
              <ul className="space-y-2">
                {whoShouldAttend.slice(0, 3).map((role, i) => (
                  <li
                    key={i}
                    className="text-xs font-medium text-green-50 border-b border-green-500/30 pb-2 last:border-0"
                  >
                    {role}
                  </li>
                ))}
                <li className="text-xs font-medium text-green-200 pt-1 italic">
                  + CEOs, Investors & Planners
                </li>
              </ul>
            </div>
          </motion.div>

          {/* Stat Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="md:col-span-1 bg-white border border-gray-100 p-6 rounded-3xl flex flex-col justify-center items-center text-center shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
              <MessageSquare className="w-6 h-6 text-gray-900" />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">1 Day</h3>
            <p className="text-sm text-gray-500 font-medium">
              High-Impact Forum
            </p>
            <div className="mt-4 text-xs text-gray-400 px-3 py-1 bg-gray-50 rounded-lg">
              Panel Discussions • Awards • Networking
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
