"use client";

import { motion } from "framer-motion";
import { Calendar, MapPin, ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative min-h-[100vh] flex items-center justify-center overflow-hidden">
      {/* Immersive Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/hero-bg.png"
          alt="Sustainable Future City Accra"
          className="w-full h-full object-cover"
        />
        {/* Cinematic Gradient Overlays for Readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-gray-900 to-transparent" />
      </div>

      <div className="container relative z-20 px-4 pt-20">
        <div className="max-w-3xl">
          {/* Animated Badge */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 backdrop-blur-md mb-6 hover:bg-white/20 transition-colors"
          >
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-xs font-semibold tracking-wider text-white uppercase">
              Accra, Ghana • 2026
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold text-white mb-6 leading-[1.1] drop-shadow-lg"
          >
            Advancing <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-200">
              Green Mobility
            </span>
            <br />
            in Africa
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-xl text-gray-200 mb-10 leading-relaxed max-w-2xl drop-shadow-md"
          >
            Join the continent's most influential leaders, policymakers, and
            innovators as we shape the future of sustainable transport and urban
            mobility.
          </motion.p>

          {/* Key Info Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 mb-10"
          >
            <div className="flex items-center gap-3 bg-white/5 backdrop-blur-sm border border-white/10 px-5 py-3 rounded-xl">
              <Calendar className="w-5 h-5 text-green-400" />
              <div className="text-left">
                <p className="text-xs text-gray-400 uppercase font-bold">
                  Date
                </p>
                <p className="text-sm text-white font-medium">
                  5th March, 2026
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-white/5 backdrop-blur-sm border border-white/10 px-5 py-3 rounded-xl">
              <MapPin className="w-5 h-5 text-amber-400" />
              <div className="text-left">
                <p className="text-xs text-gray-400 uppercase font-bold">
                  Venue
                </p>
                <p className="text-sm text-white font-medium">
                  Accra Marriott Hotel
                </p>
              </div>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Button
              size="lg"
              className="h-14 px-8 text-base bg-green-600 hover:bg-green-700 text-white rounded-full font-semibold shadow-lg shadow-green-900/20 border border-green-500/50"
            >
              Register Now
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="h-14 px-8 text-base border-white/30 text-white hover:bg-white/10 rounded-full bg-white/5 backdrop-blur-sm"
            >
              <Play className="mr-2 w-4 h-4 fill-white" />
              See What to Expect
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 w-full h-24 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent z-10" />
    </section>
  );
}
