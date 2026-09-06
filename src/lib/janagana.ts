/**
 * JanaGana CRM integration — visitor plane only (no Clerk).
 * Events, class registration, and lead capture live on the JanaGana portal.
 */

export type JanaganaEmbedEvent = {
  id: string
  title: string
  shortSummary: string | null
  description: string | null
  startDate: string
  endDate: string | null
  location: string | null
  coverImageUrl: string | null
  speakerName: string | null
  attendeeCount: number | null
  tags: string[]
  priceCents: number
  format: "IN_PERSON" | "VIRTUAL" | "HYBRID"
  isVirtual: boolean
  detailsUrl: string
  registrationUrl: string
  portalUrl: string
  status: string
}

const DEFAULT_PORTAL_BASE = "https://janagana.namasteneedham.com"
const DEFAULT_TENANT_SLUG = "namaste-boston"

export function getJanaganaPortalBase(): string {
  return (
    process.env.NEXT_PUBLIC_JANAGANA_PORTAL_BASE_URL ??
    process.env.NEXT_PUBLIC_JANAGANA_API_URL ??
    DEFAULT_PORTAL_BASE
  ).replace(/\/$/, "")
}

export function getJanaganaApiBase(): string {
  return (
    process.env.NEXT_PUBLIC_JANAGANA_API_URL ??
    process.env.NEXT_PUBLIC_JANAGANA_PORTAL_BASE_URL ??
    DEFAULT_PORTAL_BASE
  ).replace(/\/$/, "")
}

export function getJanaganaTenantSlug(): string {
  return process.env.NEXT_PUBLIC_JANAGANA_TENANT_SLUG ?? DEFAULT_TENANT_SLUG
}

export function getSiteBaseUrl(): string {
  if (typeof window !== "undefined") {
    return window.location.origin
  }
  return (
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.NEXTAUTH_URL ??
    "http://localhost:3001"
  ).replace(/\/$/, "")
}

export function portalPath(path: string): string {
  const slug = getJanaganaTenantSlug()
  const base = getJanaganaPortalBase()
  const normalized = path.startsWith("/") ? path : `/${path}`
  return `${base}/portal/${slug}${normalized}`
}

export function portalUrlWithReturn(path: string, returnPath?: string): string {
  const url = new URL(portalPath(path))
  const returnTo = returnPath ?? "/classes?registration=registered"
  url.searchParams.set("returnTo", `${getSiteBaseUrl()}${returnTo}`)
  return url.toString()
}

export function portalEventsUrl(returnPath = "/classes"): string {
  return portalUrlWithReturn("/events", returnPath)
}

export function portalContactUrl(
  interest: "newsletter" | "investment-analysis" | "class-interest" = "class-interest",
  returnPath = "/classes"
): string {
  return portalUrlWithReturn(`/contact?interest=${interest}`, returnPath)
}

export async function fetchEmbedEvents(
  maxItems = 12
): Promise<{ events: JanaganaEmbedEvent[]; error?: string }> {
  const slug = getJanaganaTenantSlug()
  const apiBase = getJanaganaApiBase()
  const url = `${apiBase}/api/embed/events?tenantSlug=${encodeURIComponent(slug)}&maxItems=${maxItems}`

  try {
    const res = await fetch(url, { next: { revalidate: 300 } })
    if (!res.ok) {
      return { events: [], error: `Events unavailable (${res.status})` }
    }
    const json = (await res.json()) as { success?: boolean; data?: JanaganaEmbedEvent[] }
    return { events: json.data ?? [] }
  } catch {
    return { events: [], error: "Unable to load events right now" }
  }
}

export function formatEventDate(iso: string): string {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(new Date(iso))
}

export function formatEventPrice(cents: number): string {
  if (cents <= 0) return "Free"
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100)
}

export function eventFormatLabel(event: JanaganaEmbedEvent): string {
  if (event.format === "VIRTUAL" || event.isVirtual) return "Virtual (Zoom)"
  if (event.format === "HYBRID") return "Hybrid"
  return "In person"
}
