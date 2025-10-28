import { Skeleton } from "@/components/ui/skeleton"

export default function EventDetailLoading() {
  return (
    <div className="min-h-screen">
      {/* Hero Section Skeleton */}
      <section className="relative h-[70vh] min-h-[500px] overflow-hidden">
        <Skeleton className="absolute inset-0 w-full h-full" />
        
        <div className="absolute inset-0 bg-black/40" />
        
        <div className="relative z-10 container mx-auto px-4 h-full flex items-center justify-center">
          <div className="text-center space-y-6 max-w-3xl">
            <Skeleton className="h-16 w-48 mx-auto" />
            <Skeleton className="h-20 w-full mx-auto" />
            <Skeleton className="h-6 w-96 mx-auto" />
            
            {/* Countdown Skeleton */}
            <div className="flex items-center justify-center gap-4 mt-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="text-center">
                  <Skeleton className="h-14 w-14 rounded-lg" />
                  <Skeleton className="h-3 w-12 mt-2" />
                </div>
              ))}
            </div>
            
            <Skeleton className="h-12 w-48 mx-auto mt-6" />
          </div>
        </div>
      </section>

      {/* Content Section Skeleton */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid gap-12 md:grid-cols-2">
          {/* Left Column */}
          <div className="space-y-8">
            <div className="space-y-3">
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>

            <div className="space-y-3">
              <Skeleton className="h-8 w-40" />
              <Skeleton className="h-24 w-full" />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <Skeleton className="h-10 w-48" />
            
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-6 border rounded-lg space-y-3">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-8 w-24" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Skeleton */}
      <footer className="border-t py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-6 w-6 rounded-full" />
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}

