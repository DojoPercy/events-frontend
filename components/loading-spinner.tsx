import { cn } from "@/lib/utils"

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg"
  className?: string
}

export function LoadingSpinner({ size = "md", className }: LoadingSpinnerProps) {
  const sizes = {
    sm: "h-6 w-6 border-2",
    md: "h-10 w-10 border-2",
    lg: "h-16 w-16 border-3"
  }

  return (
    <div className={cn("animate-spin rounded-full border-b-primary border-t-transparent", sizes[size], className)} />
  )
}

export function LoadingScreen({ message }: { message?: string }) {
  return (
    <div className="min-h-screen grid place-items-center">
      <div className="text-center space-y-4">
        <LoadingSpinner size="lg" className="mx-auto" />
        {message && <p className="text-muted-foreground">{message}</p>}
      </div>
    </div>
  )
}

