import { redirect } from "next/navigation";

// Simple redirect to onboarding signup page
// The signup form will handle the Auth0 flow
export default async function LoginPage() {
  redirect("/auth/login?returnTo=/dashboard");
}
