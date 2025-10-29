import { redirect } from "next/navigation"
import { appClient } from "@/lib/auth0"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Palette, Eye } from "lucide-react"
import { EmailTemplateEditor } from "./email-template-editor"

const DEFAULT_TEMPLATES = [
  {
    type: 'ticket_confirmation',
    name: 'Ticket Confirmation',
    description: 'Sent when a customer submits a ticket request',
    defaultSubject: 'Ticket Request Received: {{eventTitle}}',
  },
  {
    type: 'ticket_approval',
    name: 'Ticket Approval',
    description: 'Sent when a ticket request is approved',
    defaultSubject: '✓ Ticket Request Approved: {{eventTitle}}',
  },
  {
    type: 'ticket_rejection',
    name: 'Ticket Rejection',
    description: 'Sent when a ticket request is rejected',
    defaultSubject: 'Ticket Request Update: {{eventTitle}}',
  },
]

export default async function EmailTemplatesPage() {
  const session = await appClient.getSession()

  if (!session?.user?.org_id) {
    redirect("/auth/login")
  }

  // Get or create organization
  let organization = await prisma.organization.findUnique({
    where: { auth0OrgId: session.user.org_id },
    include: {
      emailTemplates: true,
    },
  })

  if (!organization) {
    // Create organization if it doesn't exist
    organization = await prisma.organization.create({
      data: {
        auth0OrgId: session.user.org_id,
        name: 'My Organization',
      },
      include: {
        emailTemplates: true,
      },
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Email Templates</h1>
          <p className="text-muted-foreground mt-1">
            Customize email templates sent to your customers
          </p>
        </div>
      </div>

      {/* Info Card */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Palette className="h-5 w-5 text-primary" />
            Customization Features
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Use variables like <code className="px-1.5 py-0.5 rounded bg-muted">{'{{eventTitle}}'}</code>, <code className="px-1.5 py-0.5 rounded bg-muted">{'{{customerName}}'}</code>, etc.
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Customize colors to match your brand
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Add your organization logo
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Preview before saving
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Template Cards */}
      <div className="grid gap-6">
        {DEFAULT_TEMPLATES.map((template) => {
          const existingTemplate = organization.emailTemplates.find(
            (t) => t.type === template.type
          )

          return (
            <Card key={template.type}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle>{template.name}</CardTitle>
                      <CardDescription className="mt-1">
                        {template.description}
                      </CardDescription>
                    </div>
                  </div>
                  {existingTemplate && (
                    <div className="flex items-center gap-2 px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                      <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                      Customized
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <EmailTemplateEditor
                  organizationId={organization.id}
                  templateType={template.type}
                  templateName={template.name}
                  defaultSubject={template.defaultSubject}
                  existingTemplate={existingTemplate}
                />
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Available Variables */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Available Variables
          </CardTitle>
          <CardDescription>
            Use these variables in your subject and email body
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { var: '{{customerName}}', desc: "Customer's full name" },
              { var: '{{eventTitle}}', desc: 'Event name' },
              { var: '{{eventDate}}', desc: 'Event date and time' },
              { var: '{{eventLocation}}', desc: 'Event location' },
              { var: '{{ticketType}}', desc: 'Ticket type name' },
              { var: '{{quantity}}', desc: 'Number of tickets' },
              { var: '{{totalAmount}}', desc: 'Total cost' },
              { var: '{{purchaseId}}', desc: 'Purchase reference ID' },
              { var: '{{organizationName}}', desc: 'Your organization name' },
              { var: '{{trackingUrl}}', desc: 'Order tracking link' },
            ].map((item) => (
              <div key={item.var} className="p-3 rounded-lg border bg-card">
                <code className="text-xs font-mono text-primary bg-primary/10 px-2 py-1 rounded">
                  {item.var}
                </code>
                <p className="text-xs text-muted-foreground mt-2">{item.desc}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

