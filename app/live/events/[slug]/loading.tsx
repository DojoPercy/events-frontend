import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

export default function EventDetailLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section Skeleton - Matches actual hero */}
      <section className="relative h-[60vh] sm:h-[70vh] min-h-[400px] sm:min-h-[500px] overflow-hidden">
        {/* Background Image Placeholder */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-purple-600 to-pink-500 animate-pulse" />
        
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/50" />
        
        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 sm:px-6 h-full flex items-center justify-center">
          <div className="text-center space-y-4 sm:space-y-6 max-w-3xl w-full">
            {/* Logo */}
            <Skeleton className="h-12 w-32 sm:h-16 sm:w-48 mx-auto bg-white/20" />
            
            {/* Title */}
            <Skeleton className="h-12 sm:h-16 lg:h-20 w-full max-w-2xl mx-auto bg-white/20" />
            
            {/* Date & Location */}
            <Skeleton className="h-5 sm:h-6 w-64 sm:w-96 mx-auto bg-white/20" />
            
            {/* Countdown Timer */}
            <div className="flex items-center justify-center gap-3 sm:gap-4 mt-6 sm:mt-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="text-center">
                  <Skeleton className="h-12 w-12 sm:h-14 sm:w-14 rounded-lg bg-white/20" />
                  <Skeleton className="h-3 w-10 sm:w-12 mt-2 mx-auto bg-white/20" />
                </div>
              ))}
            </div>
            
            {/* CTA Button */}
            <Skeleton className="h-12 sm:h-14 w-48 sm:w-64 mx-auto mt-6 rounded-lg bg-white/20" />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-12 sm:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
          <div className="grid gap-8 sm:gap-12 md:grid-cols-2">
            {/* Left Column - About */}
            <div className="space-y-6 sm:space-y-8">
              <div className="space-y-3">
                <Skeleton className="h-7 sm:h-8 w-32 sm:w-40" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/5" />
              </div>

              <div className="space-y-3">
                <Skeleton className="h-7 sm:h-8 w-40 sm:w-48" />
                <Skeleton className="h-20 sm:h-24 w-full rounded-lg" />
              </div>
            </div>

            {/* Right Column - Event Details */}
            <div className="space-y-6">
              <Skeleton className="h-8 sm:h-10 w-48 sm:w-56" />
              
              {/* Detail cards */}
              <div className="bg-gray-50 p-4 sm:p-6 rounded-lg space-y-2">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>

              <div className="bg-gray-50 p-4 sm:p-6 rounded-lg space-y-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/5" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tickets Section - Matches new card design */}
      <section className="py-12 sm:py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
          <Skeleton className="h-8 sm:h-10 w-48 sm:w-64 mx-auto mb-8 sm:mb-12" />

          {/* Desktop: 3 columns */}
          <div className="hidden lg:grid lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="overflow-hidden shadow-lg">
                {/* Header with primaryColor */}
                <div className="h-16 bg-gradient-to-r from-purple-500 to-purple-600 animate-pulse" />
                
                <CardContent className="p-6 space-y-4">
                  {/* Price */}
                  <div className="space-y-2">
                    <Skeleton className="h-10 w-40" />
                    <Skeleton className="h-4 w-48" />
                  </div>

                  {/* CTA Button */}
                  <Skeleton className="h-14 w-full rounded-lg" />

                  {/* Details */}
                  <div className="pt-4 space-y-2">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <Skeleton className="h-4 w-4/5" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Mobile: Horizontal scroll hint */}
          <div className="lg:hidden">
            <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="w-[320px] sm:w-[400px] flex-shrink-0 snap-center overflow-hidden shadow-lg">
                  <div className="h-16 bg-gradient-to-r from-purple-500 to-purple-600 animate-pulse" />
                  
                  <CardContent className="p-6 space-y-4">
                    <div className="space-y-2">
                      <Skeleton className="h-10 w-40" />
                      <Skeleton className="h-4 w-48" />
                    </div>
                    <Skeleton className="h-14 w-full rounded-lg" />
                    <div className="pt-4 space-y-2">
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-5/6" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <Skeleton className="h-4 w-48 mx-auto mt-4" />
          </div>
        </div>
      </section>

      {/* Footer Skeleton */}
      <footer className="border-t py-8 sm:py-12 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-center gap-4 sm:gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-6 w-6 rounded-full" />
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}
