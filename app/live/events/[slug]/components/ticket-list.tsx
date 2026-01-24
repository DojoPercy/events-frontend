"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TicketType {
  id: string;
  name: string;
  description: string | null;
  price: number;
  quantity: number;
  sold: number;
  isActive: boolean;
  requiresApproval: boolean;
  customNotes: string | null;
}

interface TicketListProps {
  ticketTypes: TicketType[];
  eventDate: Date | string;
  eventSlug: string;
  primaryColor: string;
  currency?: string;
}

export function TicketList({
  ticketTypes,
  eventDate,
  eventSlug,
  primaryColor,
  currency,
}: TicketListProps) {
  const router = useRouter();
  const [expandedTickets, setExpandedTickets] = useState<
    Record<string, boolean>
  >({});

  // If no active ticket types, return specific message handled by parent or empty here?
  // The parent handles "Ticket information coming soon" if array is empty.

  return (
    <>
      <div className="hidden lg:grid lg:grid-cols-3 gap-6 mb-8">
        {ticketTypes.map((ticket) => {
          const available = ticket.quantity - ticket.sold;
          const isSoldOut = available <= 0;
          const showMore = expandedTickets[ticket.id] || false;

          return (
            <div
              key={ticket.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col"
            >
              {/* Header with decorative tickets */}
              <div
                className="relative px-6 py-16 overflow-hidden"
                style={{ backgroundColor: primaryColor }}
              >
                <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-20">
                  <svg
                    width="40"
                    height="24"
                    viewBox="0 0 40 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect
                      x="1"
                      y="1"
                      width="38"
                      height="22"
                      rx="2"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeDasharray="3 2"
                    />
                    <circle
                      cx="5"
                      cy="12"
                      r="2"
                      stroke="white"
                      strokeWidth="1"
                      fill="none"
                    />
                    <circle
                      cx="35"
                      cy="12"
                      r="2"
                      stroke="white"
                      strokeWidth="1"
                      fill="none"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-white pr-12 line-clamp-2">
                  {ticket.name}
                </h3>
              </div>

              {/* Price Section */}
              <div className="px-6 py-5 bg-white">
                <div className="text-3xl font-bold text-gray-900">
                  {currency || "AED"} {Number(ticket.price).toFixed(2)}
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Sales end on {format(new Date(eventDate), "MMM dd, yyyy")}
                </p>
              </div>

              {/* CTA Button */}
              <div className="px-6 pb-4">
                <Button
                  className="w-full text-white font-semibold py-6 rounded-lg transition-all"
                  style={{ backgroundColor: primaryColor }}
                  onClick={() =>
                    router.push(`/live/events/${eventSlug}/tickets`)
                  }
                  disabled={isSoldOut}
                >
                  {isSoldOut ? "SOLD OUT" : "BOOK NOW"}
                </Button>
                {ticket.requiresApproval && (
                  <p className="text-xs text-red-600 mt-2 flex items-center justify-center gap-1">
                    <span className="text-red-600">*</span> Approval Required
                  </p>
                )}
              </div>

              {/* Details Section */}
              <div className="px-6 pb-6 flex-1">
                <h4 className="font-bold text-gray-900 mb-2">More Details</h4>
                {ticket.description && (
                  <p
                    className={cn(
                      "text-sm text-gray-600 leading-relaxed",
                      !showMore && "line-clamp-3",
                    )}
                  >
                    {ticket.description}
                  </p>
                )}
                {ticket.customNotes && (
                  <p
                    className={cn(
                      "text-xs text-gray-500 mt-2 italic",
                      !showMore && "line-clamp-2",
                    )}
                  >
                    {ticket.customNotes}
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-2">Subject to 5% VAT.</p>
                {(ticket.description || ticket.customNotes) && (
                  <button
                    onClick={() =>
                      setExpandedTickets((prev) => ({
                        ...prev,
                        [ticket.id]: !showMore,
                      }))
                    }
                    className="text-xs mt-2 hover:underline"
                    style={{ color: primaryColor }}
                  >
                    {showMore ? "... Show less" : "... Show more"}
                  </button>
                )}
                <div className="mt-4 pt-4 border-t text-xs text-gray-500">
                  {available} / {ticket.quantity} tickets available
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile & Tablet: Horizontal scroll */}
      <div className="lg:hidden overflow-x-auto pb-4 -mx-4 px-4 snap-x snap-mandatory">
        <div className="flex gap-4 min-w-min">
          {ticketTypes.map((ticket) => {
            const available = ticket.quantity - ticket.sold;
            const isSoldOut = available <= 0;
            const showMore = expandedTickets[ticket.id] || false;

            return (
              <div
                key={ticket.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden w-[320px] sm:w-[400px] flex-shrink-0 snap-center flex flex-col"
              >
                {/* Header */}
                <div
                  className="relative px-6 py-4 overflow-hidden"
                  style={{ backgroundColor: primaryColor }}
                >
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-20">
                    <svg
                      width="40"
                      height="24"
                      viewBox="0 0 40 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect
                        x="1"
                        y="1"
                        width="38"
                        height="22"
                        rx="2"
                        stroke="white"
                        strokeWidth="1.5"
                        strokeDasharray="3 2"
                      />
                      <circle
                        cx="5"
                        cy="12"
                        r="2"
                        stroke="white"
                        strokeWidth="1"
                        fill="none"
                      />
                      <circle
                        cx="35"
                        cy="12"
                        r="2"
                        stroke="white"
                        strokeWidth="1"
                        fill="none"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-white pr-12">
                    {ticket.name}
                  </h3>
                </div>

                {/* Price */}
                <div className="px-6 py-5">
                  <div className="text-3xl font-bold text-gray-900">
                    {currency || "AED"} {Number(ticket.price).toFixed(2)}
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    Sales end on {format(new Date(eventDate), "MMM dd, yyyy")}
                  </p>
                </div>

                {/* CTA */}
                <div className="px-6 pb-4">
                  <Button
                    className="w-full text-white font-semibold py-6 rounded-lg"
                    style={{ backgroundColor: primaryColor }}
                    onClick={() =>
                      router.push(`/live/events/${eventSlug}/tickets`)
                    }
                    disabled={isSoldOut}
                  >
                    {isSoldOut ? "SOLD OUT" : "BOOK NOW"}
                  </Button>
                  {ticket.requiresApproval && (
                    <p className="text-xs text-red-600 mt-2 flex items-center justify-center gap-1">
                      <span>*</span> Approval Required
                    </p>
                  )}
                </div>

                {/* Details */}
                <div className="px-6 pb-6 flex-1">
                  <h4 className="font-bold text-gray-900 mb-2">More Details</h4>
                  {ticket.description && (
                    <p
                      className={cn(
                        "text-sm text-gray-600",
                        !showMore && "line-clamp-3",
                      )}
                    >
                      {ticket.description}
                    </p>
                  )}
                  {ticket.customNotes && (
                    <p
                      className={cn(
                        "text-xs text-gray-500 mt-2 italic",
                        !showMore && "line-clamp-2",
                      )}
                    >
                      {ticket.customNotes}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-2">
                    Subject to 5% VAT.
                  </p>
                  {(ticket.description || ticket.customNotes) && (
                    <button
                      onClick={() =>
                        setExpandedTickets((prev) => ({
                          ...prev,
                          [ticket.id]: !showMore,
                        }))
                      }
                      className="text-xs mt-2 hover:underline"
                      style={{ color: primaryColor }}
                    >
                      {showMore ? "... Show less" : "... Show more"}
                    </button>
                  )}
                  <div className="mt-4 pt-4 border-t text-xs text-gray-500">
                    {available} / {ticket.quantity} available
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Scroll indicator for mobile */}
      <div className="lg:hidden text-center mt-4 text-sm text-gray-500">
        ← Swipe to see more options →
      </div>
    </>
  );
}
