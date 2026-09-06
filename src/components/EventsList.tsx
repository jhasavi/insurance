import Link from "next/link"
import { CalendarDays } from "lucide-react"
import { EventCard } from "@/components/EventCard"
import { Button } from "@/components/ui/button"
import { fetchEmbedEvents, portalEventsUrl } from "@/lib/janagana"

export async function EventsList({ maxItems = 6 }: { maxItems?: number }) {
  const { events, error } = await fetchEmbedEvents(maxItems)

  if (error && events.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
        <CalendarDays className="h-10 w-10 text-gray-400 mx-auto mb-3" />
        <p className="text-gray-700 font-medium mb-2">Upcoming classes will appear here</p>
        <p className="text-sm text-gray-500 mb-4">
          New sessions are published regularly. Join our list to get notified.
        </p>
        <Button asChild variant="outline">
          <Link href={portalEventsUrl()} target="_blank" rel="noopener noreferrer">
            View all events on portal
          </Link>
        </Button>
      </div>
    )
  }

  if (events.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
        <CalendarDays className="h-10 w-10 text-gray-400 mx-auto mb-3" />
        <p className="text-gray-700 font-medium mb-2">No upcoming classes scheduled yet</p>
        <p className="text-sm text-gray-500 mb-4">
          Check back soon or contact us to express interest in the next session.
        </p>
        <Button asChild>
          <Link href={portalEventsUrl()} target="_blank" rel="noopener noreferrer">
            Browse events portal
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  )
}
