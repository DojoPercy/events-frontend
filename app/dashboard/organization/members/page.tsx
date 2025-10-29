import { redirect } from "next/navigation"
import { appClient, managementClient } from "@/lib/auth0"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Users, UserPlus, Shield, Mail } from "lucide-react"
import { InviteMemberDialog } from "./invite-member-dialog"

export default async function OrganizationMembersPage() {
  const session = await appClient.getSession()

  if (!session?.user) {
    redirect("/auth/login")
  }

  if (!session.user.org_id) {
    redirect("/onboarding/create")
  }

  // Get organization details
  const { data: org } = await managementClient.organizations.get({
    id: session.user.org_id,
  })

  // Get organization members
  const { data: members } = await managementClient.organizations.getMembers({
    id: session.user.org_id,
  })

  // Get member roles for each user
  const membersWithRoles = await Promise.all(
    members.map(async (member) => {
      try {
        const { data: roles } = await managementClient.organizations.getMemberRoles({
          id: session.user.org_id,
          user_id: member.user_id,
        })
        return { ...member, roles }
      } catch (error) {
        console.error(`Failed to fetch roles for ${member.email}:`, error)
        return { ...member, roles: [] }
      }
    })
  )

  // Get pending invitations
  let pendingInvitations: any[] = []
  try {
    const { data: invitations } = await managementClient.organizations.getInvitations({
      id: session.user.org_id,
    })
    pendingInvitations = invitations.filter((inv: any) => 
      !inv.expires_at || new Date(inv.expires_at) > new Date()
    )
  } catch (error) {
    console.error('Failed to fetch invitations:', error)
  }

  const isAdmin = membersWithRoles
    .find(m => m.user_id === session.user.sub)
    ?.roles.some(r => r.name === 'admin' || r.name === 'Admin')

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Team Members</h1>
          <p className="text-muted-foreground mt-1">
            Manage your organization's team members and invitations
          </p>
        </div>
        
        {isAdmin && (
          <InviteMemberDialog organizationId={session.user.org_id} organizationName={org.display_name || org.name} />
        )}
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{members.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Invitations</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingInvitations.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Administrators</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {membersWithRoles.filter(m => 
                m.roles.some(r => r.name === 'admin' || r.name === 'Admin')
              ).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Current Members */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Current Members
          </CardTitle>
          <CardDescription>
            People who have access to {org.display_name || org.name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {membersWithRoles.map((member) => {
              const initials = member.name
                ? member.name.split(' ').map(n => n[0]).join('').toUpperCase()
                : member.email.substring(0, 2).toUpperCase()

              const isCurrentUser = member.user_id === session.user.sub
              const hasAdminRole = member.roles.some(r => r.name === 'admin' || r.name === 'Admin')

              return (
                <div
                  key={member.user_id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={member.picture} alt={member.name || member.email} />
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-medium truncate">
                          {member.name || member.email}
                        </p>
                        {isCurrentUser && (
                          <Badge variant="secondary" className="text-xs">You</Badge>
                        )}
                        {hasAdminRole && (
                          <Badge variant="default" className="text-xs bg-primary/20 text-primary hover:bg-primary/30">
                            <Shield className="h-3 w-3 mr-1" />
                            Admin
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{member.email}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Pending Invitations */}
      {pendingInvitations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Pending Invitations
            </CardTitle>
            <CardDescription>
              Invitations that haven't been accepted yet
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingInvitations.map((invitation: any) => (
                <div
                  key={invitation.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg border bg-muted/30"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{invitation.invitee.email}</p>
                      <p className="text-sm text-muted-foreground">
                        Invited {new Date(invitation.created_at).toLocaleDateString()}
                        {invitation.expires_at && ` • Expires ${new Date(invitation.expires_at).toLocaleDateString()}`}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className="w-fit">
                    Pending
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

