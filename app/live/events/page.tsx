import { prisma } from "@/lib/prisma";
import { SparklesIcon } from "lucide-react";
import { EventListClient } from "./event-list-client";

export const dynamic = "force-dynamic"; // Ensure we don't statically cache the list excessively

export default async function PublicEventsPage() {
  // Fetch only published events
  const events = await prisma.event.findMany({
    where: {
      isPublished: true,
      // Optional: hide draft events. Schema says isPublished default false.
    },
    include: {
      ticketTypes: true,
    },
    orderBy: {
      eventDate: "asc",
    },
  });

  // Serialize for client component
  // Prisma Dates are Date objects, Client Components need strings or numbers usually,
  // but Next 13+ handles Date objects in server->client props reasonably well in recent versions?
  // Actually Next.js warns about passing Dates to client components.
  // Best to serialize manually to Avoid hydration warnings.
  const serializedEvents = events.map((event) => ({
    ...event,
    ticketTypes: event.ticketTypes.map((t) => ({
      ...t,
      price: t.price.toNumber(), // Convert Decimal to Number
    })),
  }));

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Header */}
      <header className="relative gradient-purple text-white">
        <div className="absolute inset-0 gradient-mesh opacity-50" />
        <div className="relative container mx-auto px-4 py-12">
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm">
                <SparklesIcon className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-4xl font-bold tracking-tight">EventApp</h1>
                <p className="text-white/80">
                  Discover amazing events near you
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <EventListClient initialEvents={serializedEvents} />
    </div>
  );
}
