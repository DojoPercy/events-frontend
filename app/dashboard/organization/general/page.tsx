import { redirect } from "next/navigation"
import { appClient, managementClient } from "@/lib/auth0"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Building2, Shield, Users } from "lucide-react"

export default async function OrganizationGeneralPage() {
  const session = await appClient.getSession()

  if (!session?.user) {
    redirect("/auth/login")
  }

  const { data: orgs } = await managementClient.users.getUserOrganizations({
    id: session.user.sub,
  })

  if (!orgs.length) {
    redirect("/onboarding/create")
  }

  const currentOrg = orgs.find((o) => o.id === session.user.org_id) || orgs[0]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Organization Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your organization's profile and preferences
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Building2 className="h-5 w-5 text-primary" />
              <CardTitle>Organization Details</CardTitle>
            </div>
            <CardDescription>
              Basic information about your organization
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Organization Name</Label>
              <Input 
                value={currentOrg.display_name || currentOrg.name} 
                disabled 
                className="bg-muted"
              />
            </div>
            <div className="space-y-2">
              <Label>Organization ID</Label>
              <Input 
                value={currentOrg.id} 
                disabled 
                className="bg-muted font-mono text-xs"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Contact support to update organization details
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-primary" />
              <CardTitle>Team Members</CardTitle>
            </div>
            <CardDescription>
              Manage who has access to this organization
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{session.user.email}</p>
                  <p className="text-sm text-muted-foreground">Owner</p>
                </div>
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <Button variant="outline" className="w-full" disabled>
                Invite Team Members (Coming Soon)
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
          <CardDescription>
            Irreversible actions for your organization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="destructive" disabled>
            Delete Organization (Contact Support)
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

