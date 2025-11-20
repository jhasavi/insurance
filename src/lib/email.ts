/**
 * Email Sending Utilities
 * 
 * Wrapper around Resend API for sending transactional emails
 */

import { Resend } from "resend"
import { logAuditEvent } from "./audit"

const resend = new Resend(process.env.RESEND_API_KEY)

interface SendEmailParams {
  to: string
  subject: string
  html: string
  userId?: string
  category?: "auth" | "quote" | "notification" | "marketing"
}

/**
 * Send an email via Resend
 */
export async function sendEmail(params: SendEmailParams) {
  try {
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || "Safora Insurance <noreply@safora.namastebostonhomes.com>",
      to: params.to,
      subject: params.subject,
      html: params.html,
    })

    if (error) {
      console.error("Resend error:", error)
      throw new Error(`Failed to send email: ${error.message}`)
    }

    // Log email sent event
    if (params.userId) {
      await logAuditEvent({
        userId: params.userId,
        action: "USER_CREATED",
        resource: "Email",
        details: {
          to: params.to,
          subject: params.subject,
          category: params.category || "notification",
          messageId: data?.id,
          actionType: "EMAIL_SENT",
        },
      })
    }

    console.log(`Email sent successfully: ${data?.id}`)
    return { success: true, messageId: data?.id }
  } catch (error) {
    console.error("Failed to send email:", error)
    
    // Log failure
    if (params.userId) {
      await logAuditEvent({
        userId: params.userId,
        action: "DATA_EXPORTED",
        resource: "Email",
        details: {
          to: params.to,
          subject: params.subject,
          error: error instanceof Error ? error.message : "Unknown error",
          actionType: "EMAIL_FAILED",
        },
      })
    }
    
    throw error
  }
}

/**
 * Send email to multiple recipients
 */
export async function sendBulkEmails(
  emails: Array<Omit<SendEmailParams, "userId">>
) {
  const results = await Promise.allSettled(
    emails.map((email) => sendEmail(email))
  )

  const successful = results.filter((r) => r.status === "fulfilled").length
  const failed = results.filter((r) => r.status === "rejected").length

  console.log(`Bulk email send: ${successful} successful, ${failed} failed`)

  return {
    successful,
    failed,
    total: emails.length,
    results,
  }
}

/**
 * Check if user has opted out of email category
 */
export async function canSendEmail(
  userId: string,
  category: "marketing" | "transactional"
): Promise<boolean> {
  // Transactional emails can always be sent
  if (category === "transactional") return true

  // Marketing emails require consent - check user table
  // TODO: Add marketingConsent field to User model or check separate consent table
  return true // For now, allow all emails
}

/**
 * Send email with consent check
 */
export async function sendEmailWithConsent(
  params: SendEmailParams & { category: "marketing" | "transactional" }
) {
  if (!params.userId) {
    throw new Error("userId required for consent check")
  }

  const canSend = await canSendEmail(params.userId, params.category)

  if (!canSend) {
    console.log(
      `Skipping ${params.category} email to ${params.to} - no consent`
    )
    return { success: false, reason: "no_consent" }
  }

  return sendEmail(params)
}
