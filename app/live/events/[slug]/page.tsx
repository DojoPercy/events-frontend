import { notFound } from "next/navigation";
import {
  CalendarIcon,
  MapPinIcon,
  LinkedinIcon,
  TwitterIcon,
  InstagramIcon,
  GlobeIcon,
} from "lucide-react";
import { format } from "date-fns";
import { Metadata } from "next";

import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { EventHeader } from "./components/event-header";
import { CountdownTimer } from "./components/countdown-timer";
import { TicketList } from "./components/ticket-list";

// Helper to fetch event
async function getEvent(slug: string) {
  const event = await prisma.event.findUnique({
    where: { slug },
    include: {
      organization: true,
      ticketTypes: {
        where: { isActive: true },
      },
    },
  });
  return event;
}

// Generate Dynamic Metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEvent(slug);

  if (!event) {
    return {
      title: "Event Not Found",
    };
  }

  const title = event.heroTitle || event.title;
  const description = event.description || `Join us for ${event.title}`;
  const imageUrl = event.coverImageUrl || event.imageUrl || "/og-default.png"; // You should have a default OG image

  return {
    title: `${title} | EventApp`,
    description: description.substring(0, 160),
    openGraph: {
      title,
      description,
      images: [{ url: imageUrl }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = await getEvent(slug);

  if (!event) {
    notFound();
  }

  // Serialize TicketTypes (decimals to numbers) needed for Client Component?
  const serializedTicketTypes = event.ticketTypes.map((t) => ({
    ...t,
    price: Number(t.price),
    // Handle nulls if necessary
  }));

  const primaryColor = event.primaryColor || "#D4A574";
  const secondaryColor = event.secondaryColor || "#ffffff";
  const currency = event.currency || "AED";

  return (
    <div
      className="min-h-screen pb-12"
      style={
        {
          "--primary-color": primaryColor,
          "--secondary-color": secondaryColor,
        } as React.CSSProperties
      }
    >
      <EventHeader
        title={event.title}
        logoUrl={event.logoUrl}
        primaryColor={primaryColor}
      />

      {/* Hero Section with Background */}
      <section
        className="relative min-h-[90vh] sm:min-h-screen flex items-center justify-center text-white pt-16 sm:pt-0"
        style={{
          backgroundImage: event.coverImageUrl
            ? `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${event.coverImageUrl})`
            : `linear-gradient(135deg, ${primaryColor} 0%, ${primaryColor}dd 100%)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="container mx-auto px-4 sm:px-6 text-center space-y-6 sm:space-y-8 py-12 sm:py-0">
          {/* Logo */}
          {event.logoUrl && (
            <div className="mb-4">
              <img
                src={event.logoUrl}
                alt="Event Logo"
                className="h-24 sm:h-32 mx-auto object-contain"
                // No onError handler in server components comfortably, CSS/JS solution better or just reliable images.
                // We'll trust Cloudinary urls for now.
              />
            </div>
          )}

          {/* Event Details */}
          <div className="flex flex-col sm:flex-row items-center justify-center sm:space-x-6 space-y-3 sm:space-y-0 text-base sm:text-lg">
            <div className="flex items-center">
              <CalendarIcon className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              <span>{format(event.eventDate, "MMMM dd, yyyy")}</span>
            </div>
            {event.location && (
              <div className="flex items-center">
                <MapPinIcon className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                <span>{event.location}</span>
              </div>
            )}
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold leading-tight px-4 drop-shadow-md">
            {event.heroTitle || event.title}
          </h1>

          {/* Subtitle */}
          {event.heroSubtitle && (
            <p className="text-lg sm:text-xl md:text-2xl max-w-3xl mx-auto px-4 drop-shadow-sm">
              {event.heroSubtitle}
            </p>
          )}

          {/* Countdown Client Component */}
          <CountdownTimer eventDate={event.eventDate.toISOString()} />

          {/* CTA Button Placeholder - Link to Tickets Section */}
          <div className="pt-6 sm:pt-8">
            <Button
              size="lg"
              className="text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 shadow-lg hover:shadow-xl transition-shadow border-2 border-transparent hover:border-white"
              style={{
                backgroundColor: primaryColor,
                color: secondaryColor,
              }}
              asChild
            >
              <a href="#tickets">Get Your Tickets</a>
            </Button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-12 sm:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
          <h2
            className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8 text-center"
            style={{ color: primaryColor }}
          >
            About the Event
          </h2>

          {event.description && (
            <div className="text-base sm:text-lg text-gray-700 mb-6 sm:mb-8 leading-relaxed whitespace-pre-wrap">
              {event.description}
            </div>
          )}

          {event.aboutSection && (
            <div className="text-base sm:text-lg text-gray-700 leading-relaxed whitespace-pre-wrap">
              {event.aboutSection}
            </div>
          )}

          {!event.description && !event.aboutSection && (
            <p className="text-center text-gray-500 italic">
              No description available
            </p>
          )}

          {/* Event Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mt-8 sm:mt-12">
            <div className="bg-gray-50 p-4 sm:p-6 rounded-lg">
              <h3 className="font-semibold text-base sm:text-lg mb-2 flex items-center">
                <CalendarIcon
                  className="mr-2 h-4 w-4 sm:h-5 sm:w-5"
                  style={{ color: primaryColor }}
                />
                Date & Time
              </h3>
              <p className="text-sm sm:text-base text-gray-700">
                {format(event.eventDate, "EEEE, MMMM dd, yyyy")}
              </p>
              <p className="text-sm sm:text-base text-gray-700">
                {format(event.eventDate, "h:mm a")}
                {event.endDate && ` - ${format(event.endDate, "h:mm a")}`}
              </p>
            </div>

            <div className="bg-gray-50 p-4 sm:p-6 rounded-lg">
              <h3 className="font-semibold text-base sm:text-lg mb-2 flex items-center">
                <MapPinIcon
                  className="mr-2 h-4 w-4 sm:h-5 sm:w-5"
                  style={{ color: primaryColor }}
                />
                Location
              </h3>
              {event.venue && (
                <p className="text-sm sm:text-base font-medium text-gray-900">
                  {event.venue}
                </p>
              )}
              {event.addressLine1 && (
                <p className="text-sm sm:text-base text-gray-700">
                  {event.addressLine1}
                </p>
              )}
              {event.city && (
                <p className="text-sm sm:text-base text-gray-700">
                  {event.city}
                  {event.state && `, ${event.state}`} {event.zipCode}
                </p>
              )}
              {event.country && (
                <p className="text-sm sm:text-base text-gray-700">
                  {event.country}
                </p>
              )}
            </div>
          </div>

          {/* Organizer */}
          {event.organization && (
            <div className="mt-8 sm:mt-12 text-center">
              <p className="text-sm sm:text-base text-gray-600">Organized by</p>
              <p
                className="text-lg sm:text-xl font-semibold mt-2"
                style={{ color: primaryColor }}
              >
                {event.organization.name}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Tickets Section */}
      <section
        id="tickets"
        className="py-12 sm:py-20 bg-gradient-to-b from-gray-50 to-white"
      >
        <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
          <h2
            className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8 sm:mb-12 text-center"
            style={{ color: primaryColor }}
          >
            Ticket Options
          </h2>

          {serializedTicketTypes.length > 0 ? (
            <TicketList
              ticketTypes={serializedTicketTypes}
              eventDate={event.eventDate.toISOString()}
              eventSlug={event.slug}
              primaryColor={primaryColor}
              currency={currency}
            />
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">Ticket information coming soon</p>
            </div>
          )}
        </div>
      </section>

      {/* Venue/Map Section */}
      {(event.venue || event.location) && (
        <section id="venue" className="py-12 sm:py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
            <h2
              className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8 text-center"
              style={{ color: primaryColor }}
            >
              Venue
            </h2>

            <div className="bg-gray-50 p-4 sm:p-8 rounded-lg">
              {event.venue && (
                <h3 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">
                  {event.venue}
                </h3>
              )}

              <div className="space-y-2 text-sm sm:text-base text-gray-700">
                {event.addressLine1 && <p>{event.addressLine1}</p>}
                {event.city && (
                  <p>
                    {event.city}
                    {event.state && `, ${event.state}`} {event.zipCode}
                  </p>
                )}
                {event.country && <p>{event.country}</p>}
              </div>

              {event.latitude && event.longitude && (
                <div className="mt-4 sm:mt-6">
                  <a
                    href={`https://www.google.com/maps?q=${event.latitude},${event.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-sm sm:text-base font-medium hover:underline"
                    style={{ color: primaryColor }}
                  >
                    <MapPinIcon className="mr-2 h-4 w-4" />
                    View on Google Maps
                  </a>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <div className="text-center sm:text-left">
              <h3 className="text-lg sm:text-xl font-bold mb-2">
                {event.title}
              </h3>
              {event.organization && (
                <p className="text-sm text-gray-400">
                  by {event.organization.name}
                </p>
              )}
            </div>

            {/* Social Links */}
            {(event.website ||
              event.linkedinUrl ||
              event.twitterUrl ||
              event.instagramUrl) && (
              <div className="flex space-x-4">
                {event.website && (
                  <a
                    href={event.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-gray-300 transition-colors"
                  >
                    <GlobeIcon className="h-5 w-5 sm:h-6 sm:w-6" />
                  </a>
                )}
                {event.linkedinUrl && (
                  <a
                    href={event.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-gray-300 transition-colors"
                  >
                    <LinkedinIcon className="h-5 w-5 sm:h-6 sm:w-6" />
                  </a>
                )}
                {event.twitterUrl && (
                  <a
                    href={event.twitterUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-gray-300 transition-colors"
                  >
                    <TwitterIcon className="h-5 w-5 sm:h-6 sm:w-6" />
                  </a>
                )}
                {event.instagramUrl && (
                  <a
                    href={event.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-gray-300 transition-colors"
                  >
                    <InstagramIcon className="h-5 w-5 sm:h-6 sm:w-6" />
                  </a>
                )}
              </div>
            )}
          </div>

          <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-gray-800 text-center text-xs sm:text-sm text-gray-400">
            <p>
              © {new Date().getFullYear()}{" "}
              {event.organization?.name || event.title}. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
