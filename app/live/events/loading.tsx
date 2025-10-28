import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

export default function LiveEventsLoading() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Skeleton */}
      <header className="relative gradient-purple">
        <div className="absolute inset-0 gradient-mesh opacity-50" />
        <div className="relative container mx-auto px-4 py-12">
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center gap-3">
              <Skeleton className="h-16 w-16 rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-5 w-48" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Skeleton */}
      <main className="container mx-auto px-4 py-8">
        {/* Tabs Skeleton */}
        <div className="mb-8 flex items-center justify-center gap-4">
          <Skeleton className="h-12 w-48 rounded-lg" />
          <Skeleton className="h-12 w-48 rounded-lg" />
        </div>

        {/* Events Grid Skeleton */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="overflow-hidden border-0 shadow-md">
              {/* Cover Image Skeleton */}
              <div className="relative aspect-video bg-gradient-to-br from-purple-500 to-pink-500" />
              
              <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
                
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-40" />
                </div>

                <div className="space-y-1">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                </div>

                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}

