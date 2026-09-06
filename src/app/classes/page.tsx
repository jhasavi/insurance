import type { Metadata } from "next"
import Link from "next/link"
import { Suspense } from "react"
import { EventsList } from "@/components/EventsList"
import { ComplianceDisclaimer } from "@/components/ComplianceDisclaimer"
import { PageHero } from "@/components/fintech/PageHero"
import { Button } from "@/components/ui/button"
import { portalContactUrl, portalEventsUrl } from "@/lib/janagana"

export const metadata: Metadata = {
  title: "Financial Planning Classes",
  description:
    "Sign up for upcoming financial planning and insurance education classes — virtual via Zoom or in person in Massachusetts.",
}

export default function ClassesPage({
  searchParams,
}: {
  searchParams: Promise<{ registration?: string }>
}) {
  return (
    <main className="min-h-screen">
      <Suspense fallback={null}>
        <RegistrationBanner searchParams={searchParams} />
      </Suspense>

      <PageHero
        variant="light"
        align="center"
        eyebrow="Workshops & webinars"
        title="Upcoming Classes & Workshops"
        description="Live sessions on retirement accounts, insurance basics, and building a balanced portfolio — via Zoom and in person."
      >
        <Button size="lg" asChild className="rounded-full bg-slate-900 hover:bg-slate-800">
          <Link href={portalEventsUrl()} target="_blank" rel="noopener noreferrer">
            View full calendar
          </Link>
        </Button>
        <Button size="lg" variant="outline" asChild className="rounded-full">
          <Link href={portalContactUrl("class-interest")} target="_blank" rel="noopener noreferrer">
            Request a topic
          </Link>
        </Button>
      </PageHero>

      <section className="container mx-auto max-w-6xl px-4 py-12">
        <ComplianceDisclaimer />
        <div className="mt-8">
          <Suspense
            fallback={
              <div className="py-12 text-center text-slate-500">Loading upcoming classes…</div>
            }
          >
            <EventsList maxItems={12} />
          </Suspense>
        </div>
      </section>

      <section className="fintech-section-alt py-14">
        <div className="container mx-auto max-w-3xl px-4 text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
            How registration works
          </h2>
          <p className="mt-3 text-slate-600 leading-relaxed">
            Registration is managed through our secure portal. After you sign up, you&apos;ll receive
            confirmation with Zoom links or venue details for in-person sessions.
          </p>
          <ComplianceDisclaimer variant="footer" />
        </div>
      </section>
    </main>
  )
}

async function RegistrationBanner({
  searchParams,
}: {
  searchParams: Promise<{ registration?: string }>
}) {
  const params = await searchParams
  if (params.registration !== "registered") return null

  return (
    <div className="border-b border-teal-200 bg-teal-50 px-4 py-3 text-center text-sm text-teal-900">
      Thank you for registering! Check your email for class details and calendar links.
    </div>
  )
}
