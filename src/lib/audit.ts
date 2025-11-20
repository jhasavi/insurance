import { prisma } from "@/lib/prisma"

export type AuditAction =
  | "USER_CREATED"
  | "USER_SIGNED_IN"
  | "USER_SIGNED_OUT"
  | "CONSENT_GRANTED"
  | "CONSENT_REVOKED"
  | "QUOTE_REQUESTED"
  | "QUOTE_VIEWED"
  | "POLICY_UPLOADED"
  | "POLICY_ANALYZED"
  | "REFERRAL_CLICKED"
  | "ADVISORY_REQUESTED"
  | "PAYMENT_PROCESSED"
  | "DATA_EXPORTED"
  | "DATA_DELETED"

interface AuditLogData {
  userId?: string
  action: AuditAction
  resource: string
  resourceId?: string
  details?: Record<string, any>
  ipAddress?: string
  userAgent?: string
}

/**
 * Log audit events for compliance and security
 */
export async function logAuditEvent(data: AuditLogData): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        userId: data.userId || null,
        action: data.action,
        resource: data.resource,
        resourceId: data.resourceId || null,
        details: data.details || undefined,
        ipAddress: data.ipAddress || null,
        userAgent: data.userAgent || null,
      },
    })
  } catch (error) {
    console.error("Failed to create audit log:", error)
    // Don't throw - audit logging should never break user flows
  }
}

/**
 * Log consent events
 */
export async function logConsent(
  userId: string,
  consentType: "marketing" | "referral" | "dataProcessing",
  granted: boolean,
  ipAddress?: string
): Promise<void> {
  await logAuditEvent({
    userId,
    action: granted ? "CONSENT_GRANTED" : "CONSENT_REVOKED",
    resource: "Consent",
    resourceId: `${userId}-${consentType}`,
    details: {
      consentType,
      granted,
      timestamp: new Date().toISOString(),
    },
    ipAddress,
  })

  // Update user consent fields
  const updateData: any = {
    [`${consentType}Consent`]: granted,
  }

  if (granted) {
    updateData.consentTimestamp = new Date()
  }

  await prisma.user.update({
    where: { id: userId },
    data: updateData,
  })
}

/**
 * Get audit logs for a user (for data export requests)
 */
export async function getUserAuditLogs(userId: string) {
  return prisma.auditLog.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  })
}
