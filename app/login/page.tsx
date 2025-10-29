import { redirect } from "next/navigation"

// Simple redirect page - just send everyone to signup
// The onboarding flow will handle routing logic from there
export default async function LoginPage() {
  redirect("/onboarding/signup")
}

