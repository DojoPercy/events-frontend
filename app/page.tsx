import { appClient } from "@/lib/auth0"
import { LandingContent } from "./landing-content"

export default async function LandingPage() {
  // Check if user is logged in WITH organization context
  // appClient.getSession() only returns session if user has org_id
  const session = await appClient.getSession()
  
  return <LandingContent hasSession={!!session} />
}
