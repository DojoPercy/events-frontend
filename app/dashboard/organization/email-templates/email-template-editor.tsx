"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Eye, Save, RotateCcw, Palette } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface EmailTemplateEditorProps {
  organizationId: string
  templateType: string
  templateName: string
  defaultSubject: string
  existingTemplate?: any
}

const DEFAULT_HTML_BODY = [
  '<!DOCTYPE html>',
  '<html>',
  '<head>',
  '  <style>',
  '    body { font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f7; }',
  '    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }',
  '    .header { background: linear-gradient(135deg, {{primaryColor}} 0%, {{secondaryColor}} 100%); padding: 40px 30px; text-align: center; }',
  '    .header h1 { color: #ffffff; margin: 0; font-size: 28px; }',
  '    .content { padding: 40px 30px; color: #333333; }',
  '    .details-box { background-color: #f9fafb; border-left: 4px solid {{primaryColor}}; padding: 20px; margin: 24px 0; border-radius: 4px; }',
  '    .button { display: inline-block; padding: 16px 32px; background-color: {{primaryColor}}; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; }',
  '    .footer { background-color: #f9fafb; padding: 30px; text-align: center; color: #6b7280; font-size: 14px; }',
  '  </style>',
  '</head>',
  '<body>',
  '  <table width="100%" cellpadding="0" cellspacing="0">',
  '    <tr>',
  '      <td align="center">',
  '        <div class="container">',
  '          <div class="header">',
  '            <h1>{{organizationName}}</h1>',
  '          </div>',
  '          <div class="content">',
  '            <h2>Hello {{customerName}},</h2>',
  '            <p>This is regarding your ticket request for <strong>{{eventTitle}}</strong>.</p>',
  '            ',
  '            <div class="details-box">',
  '              <h3>Details</h3>',
  '              <p><strong>Event:</strong> {{eventTitle}}</p>',
  '              <p><strong>Date:</strong> {{eventDate}}</p>',
  '              <p><strong>Location:</strong> {{eventLocation}}</p>',
  '              <p><strong>Ticket Type:</strong> {{ticketType}}</p>',
  '              <p><strong>Quantity:</strong> {{quantity}}</p>',
  '              <p><strong>Total:</strong> ${{totalAmount}}</p>',
  '            </div>',
  '            ',
  '            <p style="text-align: center;">',
  '              <a href="{{trackingUrl}}" class="button">View Details</a>',
  '            </p>',
  '            ',
  '            <p>Reference ID: {{purchaseId}}</p>',
  '          </div>',
  '          <div class="footer">',
  '            <p>© {{year}} {{organizationName}}. All rights reserved.</p>',
  '          </div>',
  '        </div>',
  '      </td>',
  '    </tr>',
  '  </table>',
  '</body>',
  '</html>',
].join('\n')

export function EmailTemplateEditor({
  organizationId,
  templateType,
  templateName,
  defaultSubject,
  existingTemplate,
}: EmailTemplateEditorProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  
  const [subject, setSubject] = useState(existingTemplate?.subject || defaultSubject)
  const [htmlBody, setHtmlBody] = useState(existingTemplate?.htmlBody || DEFAULT_HTML_BODY)
  const [primaryColor, setPrimaryColor] = useState(existingTemplate?.primaryColor || "#8B5CF6")
  const [secondaryColor, setSecondaryColor] = useState(existingTemplate?.secondaryColor || "#A855F7")
  const [logoUrl, setLogoUrl] = useState(existingTemplate?.logoUrl || "")

  const handleSave = async () => {
    setLoading(true)

    try {
      const response = await fetch('/api/email-templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          organizationId,
          type: templateType,
          name: templateName,
          subject,
          htmlBody,
          primaryColor,
          secondaryColor,
          logoUrl: logoUrl || null,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to save template')
      }

      toast.success('Email template saved successfully')
      router.refresh()
    } catch (error) {
      console.error('Save error:', error)
      toast.error('Failed to save template')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setSubject(defaultSubject)
    setHtmlBody(DEFAULT_HTML_BODY)
    setPrimaryColor("#8B5CF6")
    setSecondaryColor("#A855F7")
    setLogoUrl("")
    toast.info('Template reset to default')
  }

  const getPreviewHtml = () => {
    return htmlBody
      .replace(/{{primaryColor}}/g, primaryColor)
      .replace(/{{secondaryColor}}/g, secondaryColor)
      .replace(/{{organizationName}}/g, 'Your Organization')
      .replace(/{{customerName}}/g, 'John Doe')
      .replace(/{{eventTitle}}/g, 'Sample Event 2025')
      .replace(/{{eventDate}}/g, 'January 15, 2025 at 6:00 PM')
      .replace(/{{eventLocation}}/g, 'New York, NY')
      .replace(/{{ticketType}}/g, 'VIP Pass')
      .replace(/{{quantity}}/g, '2')
      .replace(/{{totalAmount}}/g, '150.00')
      .replace(/{{purchaseId}}/g, 'PUR-12345')
      .replace(/{{trackingUrl}}/g, '#')
      .replace(/{{year}}/g, new Date().getFullYear().toString())
  }

  return (
    <div className="space-y-4">
      <Tabs defaultValue="content" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="design">Design</TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor={`subject-${templateType}`}>Email Subject</Label>
            <Input
              id={`subject-${templateType}`}
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Enter email subject..."
            />
            <p className="text-xs text-muted-foreground">
              Use variables like {'{{'} eventTitle {'}}'}  or {'{{'} customerName {'}}'}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor={`html-${templateType}`}>HTML Template</Label>
            <Textarea
              id={`html-${templateType}`}
              value={htmlBody}
              onChange={(e) => setHtmlBody(e.target.value)}
              rows={12}
              className="font-mono text-xs"
              placeholder="Enter HTML template..."
            />
            <p className="text-xs text-muted-foreground">
              Full HTML email template. Use variables like {'{{'} customerName {'}}'}, {'{{'} eventTitle {'}}'}, etc.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="design" className="space-y-4 mt-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`primary-${templateType}`}>Primary Color</Label>
              <div className="flex gap-2">
                <Input
                  id={`primary-${templateType}`}
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-20 h-10"
                />
                <Input
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  placeholder="#8B5CF6"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor={`secondary-${templateType}`}>Secondary Color</Label>
              <div className="flex gap-2">
                <Input
                  id={`secondary-${templateType}`}
                  type="color"
                  value={secondaryColor}
                  onChange={(e) => setSecondaryColor(e.target.value)}
                  className="w-20 h-10"
                />
                <Input
                  value={secondaryColor}
                  onChange={(e) => setSecondaryColor(e.target.value)}
                  placeholder="#A855F7"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor={`logo-${templateType}`}>Logo URL (Optional)</Label>
            <Input
              id={`logo-${templateType}`}
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
              placeholder="https://example.com/logo.png"
            />
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex flex-wrap gap-2 pt-4 border-t">
        <Button onClick={handleSave} disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          <Save className="mr-2 h-4 w-4" />
          Save Template
        </Button>

        <Dialog open={showPreview} onOpenChange={setShowPreview}>
          <DialogTrigger asChild>
            <Button variant="outline">
              <Eye className="mr-2 h-4 w-4" />
              Preview
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Email Preview</DialogTitle>
              <DialogDescription>
                Preview of how your email will look to recipients
              </DialogDescription>
            </DialogHeader>
            <div className="border rounded-lg p-4 bg-gray-50">
              <div dangerouslySetInnerHTML={{ __html: getPreviewHtml() }} />
            </div>
          </DialogContent>
        </Dialog>

        <Button variant="ghost" onClick={handleReset}>
          <RotateCcw className="mr-2 h-4 w-4" />
          Reset to Default
        </Button>
      </div>
    </div>
  )
}

