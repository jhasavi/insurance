// Analytics event tracking

export type AnalyticsEvent =
  | "compare_started"
  | "compare_completed"
  | "policy_uploaded"
  | "policy_analyzed"
  | "quote_viewed"
  | "quote_sorted"
  | "referral_clicked"
  | "advisory_requested"
  | "user_signed_in"
  | "user_signed_out"
  | "consent_granted"
  | "consent_revoked"

interface EventProperties {
  [key: string]: string | number | boolean | undefined
}

/**
 * Track analytics events to Google Analytics 4
 */
export function trackEvent(
  event: AnalyticsEvent,
  properties?: EventProperties
) {
  // Client-side tracking via gtag
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", event, properties)
  }

  // Server-side tracking can be added here
  // e.g., send to GA4 Measurement Protocol
}

/**
 * Track page views
 */
export function trackPageView(url: string) {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("config", process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "", {
      page_path: url,
    })
  }
}

/**
 * Server-side event tracking helper
 * Use this in API routes or server components
 */
export async function trackServerEvent(
  event: AnalyticsEvent,
  properties?: EventProperties & { userId?: string }
) {
  // Send to GA4 Measurement Protocol
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID
  const apiSecret = process.env.GA4_API_SECRET

  if (!measurementId || !apiSecret) {
    console.warn("GA4 credentials not configured for server-side tracking")
    return
  }

  try {
    await fetch(
      `https://www.google-analytics.com/mp/collect?measurement_id=${measurementId}&api_secret=${apiSecret}`,
      {
        method: "POST",
        body: JSON.stringify({
          client_id: properties?.userId || "anonymous",
          events: [
            {
              name: event,
              params: properties,
            },
          ],
        }),
      }
    )
  } catch (error) {
    console.error("Failed to track server event:", error)
  }
}

// Extend window type for gtag
declare global {
  interface Window {
    gtag: (
      command: string,
      targetId: string,
      config?: Record<string, any>
    ) => void
  }
}
