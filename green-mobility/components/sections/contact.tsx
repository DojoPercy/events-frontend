"use client";

import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin } from "lucide-react";

export function Contact() {
  return (
    <section id="contact" className="py-20 md:py-28 bg-white">
      <div className="container px-4">
        <div className="bg-primary rounded-3xl p-8 md:p-16 text-white shadow-2xl relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-secondary/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

          <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 font-heading">
                Get Involved
              </h2>
              <p className="text-white/90 text-lg mb-8 max-w-md">
                For participation, nominations, partnerships, or media
                enquiries, please reach out to our team.
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-white/20 p-3 rounded-lg">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Venue</h4>
                    <p className="text-white/80">
                      Accra Marriott Hotel
                      <br />
                      Airport City, Accra – Ghana
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-white/20 p-3 rounded-lg">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Email</h4>
                    <a
                      href="mailto:info@thetechnologyboardroom.com"
                      className="text-white/80 hover:text-white transition-colors"
                    >
                      info@thetechnologyboardroom.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-white/20 p-3 rounded-lg">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Phone</h4>
                    <p className="text-white/80">
                      +233 247 415 140 / +233 20 238 4500
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white text-gray-900 p-8 rounded-2xl shadow-xl">
              <h3 className="text-2xl font-bold mb-6">Send us a message</h3>
              <form className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">First Name</label>
                    <input
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
                      placeholder="John"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Last Name</label>
                    <input
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
                      placeholder="Doe"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <input
                    type="email"
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="john@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Message</label>
                  <textarea
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 h-32 resize-none"
                    placeholder="How can we help?"
                  />
                </div>
                <Button className="w-full h-12 text-lg">Send Message</Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
