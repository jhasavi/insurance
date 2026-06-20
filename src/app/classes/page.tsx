import type { Metadata } from "next"
import Link from "next/link"
import { Suspense } from "react"
import { EventsList } from "@/components/EventsList"
import { ComplianceDisclaimer } from "@/components/ComplianceDisclaimer"
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
    <main className="min-h-screen bg-white">
      <Suspense fallback={null}>
        <RegistrationBanner searchParams={searchParams} />
      </Suspense>

      <section className="bg-gradient-to-b from-blue-50 to-white py-16">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Upcoming Classes &amp; Workshops</h1>
          <p className="text-lg text-gray-600 mb-6">
            Join live sessions on financial planning, retirement accounts, insurance basics, and
            building a balanced portfolio. Sessions are offered via Zoom and in person.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Button size="lg" asChild>
              <Link href={portalEventsUrl()} target="_blank" rel="noopener noreferrer">
                View full calendar
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href={portalContactUrl("class-interest")} target="_blank" rel="noopener noreferrer">
                Request a topic
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12 max-w-6xl">
        <ComplianceDisclaimer />
        <div className="mt-8">
          <Suspense
            fallback={
              <div className="text-center text-gray-500 py-12">Loading upcoming classes…</div>
            }
          >
            <EventsList maxItems={12} />
          </Suspense>
        </div>
      </section>

      <section className="bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <h2 className="text-2xl font-bold mb-3">How registration works</h2>
          <p className="text-gray-600 mb-6">
            Class registration is managed through our secure portal powered by JanaGana. After you
            register, you&apos;ll receive confirmation details including Zoom links or venue
            information for in-person sessions.
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
    <div className="bg-green-50 border-b border-green-200 px-4 py-3 text-center text-green-900">
      Thank you for registering! Check your email for class details and calendar links.
    </div>
  )
}
