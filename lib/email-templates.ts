/**
 * Professional HTML Email Templates for EventApp
 * Following best practices:
 * - 600px width for compatibility
 * - Inline CSS for email client support
 * - Single column responsive layout
 * - Web-safe fonts
 * - Clear CTAs
 */

interface PurchaseConfirmationData {
  customerName: string
  eventTitle: string
  eventDate: string
  ticketTypeName: string
  quantity: number
  totalAmount: string
  purchaseId: string
  organizationName: string
  customerEmail: string
  eventLocation?: string
}

interface ApprovalEmailData {
  customerName: string
  eventTitle: string
  eventDate: string
  ticketTypeName: string
  quantity: number
  totalAmount: string
  purchaseId: string
  organizationName: string
  customerEmail: string
  eventLocation?: string
  paymentLink?: string
}

interface RejectionEmailData {
  customerName: string
  eventTitle: string
  eventDate: string
  ticketTypeName: string
  quantity: number
  totalAmount: string
  purchaseId: string
  organizationName: string
  rejectionReason: string
  customerEmail: string
}

const baseStyles = `
  body { margin: 0; padding: 0; font-family: Arial, Helvetica, sans-serif; background-color: #f4f4f7; }
  table { border-collapse: collapse; }
  img { border: 0; display: block; }
  .email-container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
  .header { background: linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%); padding: 40px 30px; text-align: center; }
  .header h1 { color: #ffffff; margin: 0; font-size: 28px; font-weight: bold; }
  .content { padding: 40px 30px; color: #333333; }
  .content h2 { color: #1a1a1a; font-size: 24px; margin-top: 0; margin-bottom: 20px; }
  .content p { line-height: 1.6; margin: 16px 0; font-size: 16px; }
  .details-box { background-color: #f9fafb; border-left: 4px solid #8B5CF6; padding: 20px; margin: 24px 0; border-radius: 4px; }
  .details-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
  .details-row:last-child { border-bottom: none; }
  .details-label { font-weight: 600; color: #4b5563; }
  .details-value { color: #1f2937; }
  .cta-button { display: inline-block; padding: 16px 32px; background-color: #8B5CF6; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px; margin: 20px 0; }
  .cta-button:hover { background-color: #7C3AED; }
  .info-box { background-color: #eff6ff; border: 1px solid: #bfdbfe; padding: 16px; border-radius: 6px; margin: 20px 0; }
  .warning-box { background-color: #fef2f2; border: 1px solid #fecaca; padding: 16px; border-radius: 6px; margin: 20px 0; }
  .success-box { background-color: #f0fdf4; border: 1px solid #bbf7d0; padding: 16px; border-radius: 6px; margin: 20px 0; }
  .footer { background-color: #f9fafb; padding: 30px; text-align: center; color: #6b7280; font-size: 14px; border-top: 1px solid #e5e7eb; }
  .footer a { color: #8B5CF6; text-decoration: none; }
  .divider { height: 1px; background-color: #e5e7eb; margin: 30px 0; }
  .text-center { text-align: center; }
  .text-muted { color: #6b7280; }
  .text-bold { font-weight: 600; }
  .mb-0 { margin-bottom: 0; }
`

export function generatePurchaseConfirmationEmail(data: PurchaseConfirmationData): string {
  const appUrl = process.env.APP_BASE_URL || 'http://localhost:3000'
  const trackingUrl = `${appUrl}/customer/purchases?email=${encodeURIComponent(data.customerEmail)}`

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Ticket Request Confirmation</title>
  <style>${baseStyles}</style>
</head>
<body>
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color: #f4f4f7; padding: 20px 0;">
    <tr>
      <td align="center">
        <table class="email-container" width="600" cellpadding="0" cellspacing="0" role="presentation">
          
          <!-- Header -->
          <tr>
            <td class="header">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">✨ EventApp</h1>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td class="content">
              <h2>Ticket Request Received</h2>
              
              <p>Dear <strong>${data.customerName}</strong>,</p>
              
              <p>Thank you for your ticket request for <strong>${data.eventTitle}</strong>. We've received your request and it's currently pending approval.</p>

              <!-- Event Details Box -->
              <div class="details-box">
                <h3 style="margin-top: 0; color: #8B5CF6; font-size: 18px;">📋 Request Details</h3>
                <table width="100%" cellpadding="4" cellspacing="0">
                  <tr>
                    <td class="details-label">Event:</td>
                    <td class="details-value" align="right"><strong>${data.eventTitle}</strong></td>
                  </tr>
                  ${data.eventLocation ? `
                  <tr>
                    <td class="details-label">Location:</td>
                    <td class="details-value" align="right">${data.eventLocation}</td>
                  </tr>
                  ` : ''}
                  <tr>
                    <td class="details-label">Date:</td>
                    <td class="details-value" align="right">${data.eventDate}</td>
                  </tr>
                  <tr>
                    <td class="details-label">Ticket Type:</td>
                    <td class="details-value" align="right">${data.ticketTypeName}</td>
                  </tr>
                  <tr>
                    <td class="details-label">Quantity:</td>
                    <td class="details-value" align="right">${data.quantity}</td>
                  </tr>
                  <tr style="border-top: 2px solid #8B5CF6;">
                    <td class="details-label" style="padding-top: 12px;"><strong>Total Amount:</strong></td>
                    <td class="details-value" align="right" style="padding-top: 12px;"><strong style="font-size: 18px; color: #8B5CF6;">$${data.totalAmount}</strong></td>
                  </tr>
                </table>
              </div>

              <!-- Important Notice -->
              <div class="info-box">
                <p style="margin: 0; line-height: 1.6;">
                  <strong>⏳ What Happens Next?</strong><br/>
                  Your ticket request is currently under review. Once approved, you will receive:<br/>
                  <br/>
                  ✓ Confirmation email with ticket details<br/>
                  ✓ <strong>Secure payment link</strong> to complete your purchase<br/>
                  ✓ Access to your event tickets<br/>
                </p>
              </div>

              <p>We'll notify you via email as soon as your request is processed. This usually takes 1-2 business days.</p>

              <!-- CTA Button -->
              <div class="text-center">
                <a href="${trackingUrl}" class="cta-button" style="background-color: #8B5CF6; color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 6px; display: inline-block; font-weight: 600;">
                  Track Your Request
                </a>
              </div>

              <div class="divider"></div>

              <!-- Purchase ID -->
              <p class="text-muted" style="font-size: 14px;">
                <strong>Reference ID:</strong> ${data.purchaseId}<br/>
                Keep this ID for your records.
              </p>

              <p>If you have any questions, please don't hesitate to contact us.</p>
              
              <p style="margin-top: 30px;">
                Best regards,<br/>
                <strong>${data.organizationName}</strong>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td class="footer">
              <p style="margin: 0 0 10px 0;">© ${new Date().getFullYear()} ${data.organizationName}. All rights reserved.</p>
              <p style="margin: 0;">
                <a href="${appUrl}" style="color: #8B5CF6; text-decoration: none;">Visit Our Website</a> • 
                <a href="${trackingUrl}" style="color: #8B5CF6; text-decoration: none;">Track Your Requests</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`
}

export function generateApprovalEmail(data: ApprovalEmailData): string {
  const appUrl = process.env.APP_BASE_URL || 'http://localhost:3000'
  const trackingUrl = `${appUrl}/customer/purchases?email=${encodeURIComponent(data.customerEmail)}`
  const paymentLink = data.paymentLink || '#' // Will be replaced with actual payment link

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Ticket Request Approved</title>
  <style>${baseStyles}</style>
</head>
<body>
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color: #f4f4f7; padding: 20px 0;">
    <tr>
      <td align="center">
        <table class="email-container" width="600" cellpadding="0" cellspacing="0" role="presentation">
          
          <!-- Header -->
          <tr>
            <td class="header">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">✨ EventApp</h1>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td class="content">
              
              <!-- Success Badge -->
              <div class="text-center">
                <div style="display: inline-block; background-color: #10b981; color: white; padding: 8px 20px; border-radius: 20px; font-weight: 600; margin-bottom: 20px;">
                  ✓ Approved
                </div>
              </div>

              <h2 class="text-center">Your Ticket Request Has Been Approved! 🎉</h2>
              
              <p>Dear <strong>${data.customerName}</strong>,</p>
              
              <p>Great news! Your ticket request for <strong>${data.eventTitle}</strong> has been approved. We're excited to have you join us!</p>

              <!-- Event Details Box -->
              <div class="details-box">
                <h3 style="margin-top: 0; color: #10b981; font-size: 18px;">🎫 Your Ticket Details</h3>
                <table width="100%" cellpadding="4" cellspacing="0">
                  <tr>
                    <td class="details-label">Event:</td>
                    <td class="details-value" align="right"><strong>${data.eventTitle}</strong></td>
                  </tr>
                  ${data.eventLocation ? `
                  <tr>
                    <td class="details-label">Location:</td>
                    <td class="details-value" align="right">${data.eventLocation}</td>
                  </tr>
                  ` : ''}
                  <tr>
                    <td class="details-label">Date:</td>
                    <td class="details-value" align="right">${data.eventDate}</td>
                  </tr>
                  <tr>
                    <td class="details-label">Ticket Type:</td>
                    <td class="details-value" align="right">${data.ticketTypeName}</td>
                  </tr>
                  <tr>
                    <td class="details-label">Quantity:</td>
                    <td class="details-value" align="right">${data.quantity} ticket(s)</td>
                  </tr>
                  <tr style="border-top: 2px solid #10b981;">
                    <td class="details-label" style="padding-top: 12px;"><strong>Total Amount:</strong></td>
                    <td class="details-value" align="right" style="padding-top: 12px;"><strong style="font-size: 18px; color: #10b981;">$${data.totalAmount}</strong></td>
                  </tr>
                </table>
              </div>

              <!-- Payment Notice -->
              <div class="success-box">
                <h3 style="margin-top: 0; font-size: 18px;">💳 Next Step: Complete Your Payment</h3>
                <p style="margin-bottom: 0; line-height: 1.6;">
                  To secure your tickets, please complete the payment within <strong>48 hours</strong>. A secure payment link will be sent to you shortly in a separate email.
                </p>
              </div>

              <p><strong>What to expect:</strong></p>
              <ul style="line-height: 1.8; margin: 16px 0;">
                <li>You will receive a secure payment link via email</li>
                <li>Complete the payment using your preferred method</li>
                <li>Receive your official e-tickets instantly</li>
                <li>Get event reminders and updates</li>
              </ul>

              <!-- CTA Button -->
              <div class="text-center">
                <a href="${trackingUrl}" class="cta-button" style="background-color: #10b981; color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 6px; display: inline-block; font-weight: 600;">
                  View Ticket Details
                </a>
              </div>

              <div class="divider"></div>

              <!-- Important Information -->
              <div class="info-box">
                <p style="margin: 0; font-size: 14px; line-height: 1.6;">
                  <strong>📌 Important:</strong><br/>
                  • Your tickets will be confirmed once payment is received<br/>
                  • Save this email for your records<br/>
                  • Reference ID: <code style="background: #e5e7eb; padding: 2px 6px; border-radius: 3px;">${data.purchaseId}</code><br/>
                </p>
              </div>

              <p>We look forward to seeing you at the event!</p>
              
              <p style="margin-top: 30px;">
                Best regards,<br/>
                <strong>${data.organizationName}</strong>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td class="footer">
              <p style="margin: 0 0 10px 0;">© ${new Date().getFullYear()} ${data.organizationName}. All rights reserved.</p>
              <p style="margin: 0;">
                <a href="${appUrl}" style="color: #8B5CF6; text-decoration: none;">Visit Our Website</a> • 
                <a href="${trackingUrl}" style="color: #8B5CF6; text-decoration: none;">My Tickets</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`
}

export function generateRejectionEmail(data: RejectionEmailData): string {
  const appUrl = process.env.APP_BASE_URL || 'http://localhost:3000'
  const trackingUrl = `${appUrl}/customer/purchases?email=${encodeURIComponent(data.customerEmail)}`

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Ticket Request Update</title>
  <style>${baseStyles}</style>
</head>
<body>
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color: #f4f4f7; padding: 20px 0;">
    <tr>
      <td align="center">
        <table class="email-container" width="600" cellpadding="0" cellspacing="0" role="presentation">
          
          <!-- Header -->
          <tr>
            <td class="header">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">✨ EventApp</h1>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td class="content">
              
              <h2>Ticket Request Update</h2>
              
              <p>Dear <strong>${data.customerName}</strong>,</p>
              
              <p>Thank you for your interest in <strong>${data.eventTitle}</strong>. Unfortunately, we are unable to approve your ticket request at this time.</p>

              <!-- Event Details Box -->
              <div class="details-box">
                <h3 style="margin-top: 0; color: #6b7280; font-size: 18px;">Request Details</h3>
                <table width="100%" cellpadding="4" cellspacing="0">
                  <tr>
                    <td class="details-label">Event:</td>
                    <td class="details-value" align="right">${data.eventTitle}</td>
                  </tr>
                  <tr>
                    <td class="details-label">Date:</td>
                    <td class="details-value" align="right">${data.eventDate}</td>
                  </tr>
                  <tr>
                    <td class="details-label">Ticket Type:</td>
                    <td class="details-value" align="right">${data.ticketTypeName}</td>
                  </tr>
                  <tr>
                    <td class="details-label">Quantity:</td>
                    <td class="details-value" align="right">${data.quantity}</td>
                  </tr>
                  <tr>
                    <td class="details-label">Amount:</td>
                    <td class="details-value" align="right">$${data.totalAmount}</td>
                  </tr>
                </table>
              </div>

              <!-- Reason Box -->
              <div class="warning-box">
                <h3 style="margin-top: 0; font-size: 16px; color: #dc2626;">Reason:</h3>
                <p style="margin: 0; line-height: 1.6;">
                  ${data.rejectionReason || 'Unfortunately, we cannot process your request at this time.'}
                </p>
              </div>

              <div class="info-box">
                <p style="margin: 0; line-height: 1.6;">
                  <strong>What you can do:</strong><br/>
                  • Check our events page for other available events<br/>
                  • Contact us if you have questions about this decision<br/>
                  • Try requesting tickets for a different date or type<br/>
                </p>
              </div>

              <p>We appreciate your understanding and hope to have the opportunity to serve you at future events.</p>

              <!-- CTA Button -->
              <div class="text-center">
                <a href="${appUrl}/live/events" class="cta-button" style="background-color: #8B5CF6; color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 6px; display: inline-block; font-weight: 600;">
                  Browse Other Events
                </a>
              </div>

              <div class="divider"></div>

              <p class="text-muted" style="font-size: 14px;">
                <strong>Reference ID:</strong> ${data.purchaseId}<br/>
                If you have questions, please reference this ID when contacting us.
              </p>

              <p style="margin-top: 30px;">
                Best regards,<br/>
                <strong>${data.organizationName}</strong>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td class="footer">
              <p style="margin: 0 0 10px 0;">© ${new Date().getFullYear()} ${data.organizationName}. All rights reserved.</p>
              <p style="margin: 0;">
                <a href="${appUrl}" style="color: #8B5CF6; text-decoration: none;">Visit Our Website</a> • 
                <a href="${appUrl}/contact" style="color: #8B5CF6; text-decoration: none;">Contact Us</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`
}


