import Link from "next/link"
import { Button } from "@/components/ui/button"
import { HomeIcon } from "lucide-react"

export default function OnboardingNotFound() {
  return (
    <div className="min-h-screen grid place-items-center">
      <div className="text-center space-y-4">
        <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
          404
        </h1>
        <p className="text-muted-foreground">The page you're looking for doesn't exist.</p>
        <Button asChild>
          <Link href="/onboarding/signup">
            <HomeIcon className="mr-2 h-4 w-4" />
            Back to Onboarding
          </Link>
        </Button>
      </div>
    </div>
  )
}
