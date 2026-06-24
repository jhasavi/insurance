import Link from "next/link"
import { Calendar, MapPin, Users, Video, ArrowUpRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  type JanaganaEmbedEvent,
  eventFormatLabel,
  formatEventDate,
  formatEventPrice,
} from "@/lib/janagana"

export function EventCard({ event }: { event: JanaganaEmbedEvent }) {
  const isVirtual = event.format === "VIRTUAL" || event.isVirtual

  return (
    <article className="fintech-card group flex h-full flex-col overflow-hidden">
      <div className="h-1 w-full bg-gradient-to-r from-teal-500 via-teal-400 to-cyan-400 opacity-80" />
      <div className="flex flex-1 flex-col p-6">
        <div className="mb-4 flex items-start justify-between gap-2">
          <Badge className="rounded-full bg-teal-50 text-teal-800 border-teal-100 hover:bg-teal-50">
            {formatEventPrice(event.priceCents)}
          </Badge>
          <Badge variant="outline" className="shrink-0 rounded-full text-xs">
            {eventFormatLabel(event)}
          </Badge>
        </div>
        <h3 className="text-lg font-semibold leading-snug text-slate-900 group-hover:text-teal-800 transition-colors">
          {event.title}
        </h3>
        {event.shortSummary && (
          <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-slate-600">
            {event.shortSummary}
          </p>
        )}
        <div className="mt-5 space-y-2.5 text-sm text-slate-600">
          <div className="flex items-center gap-2.5">
            <Calendar className="h-4 w-4 shrink-0 text-teal-600" />
            <span>{formatEventDate(event.startDate)}</span>
          </div>
          {event.location && (
            <div className="flex items-center gap-2.5">
              {isVirtual ? (
                <Video className="h-4 w-4 shrink-0 text-teal-600" />
              ) : (
                <MapPin className="h-4 w-4 shrink-0 text-teal-600" />
              )}
              <span>{event.location}</span>
            </div>
          )}
          {event.attendeeCount != null && event.attendeeCount > 0 && (
            <div className="flex items-center gap-2.5">
              <Users className="h-4 w-4 shrink-0 text-teal-600" />
              <span>{event.attendeeCount} registered</span>
            </div>
          )}
        </div>
        <div className="mt-auto flex flex-wrap gap-2 pt-6">
          <Button asChild className="flex-1 min-w-[120px] rounded-full bg-slate-900 hover:bg-slate-800">
            <Link href={event.registrationUrl} target="_blank" rel="noopener noreferrer">
              Register
              <ArrowUpRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" asChild className="rounded-full">
            <Link href={event.detailsUrl} target="_blank" rel="noopener noreferrer">
              Details
            </Link>
          </Button>
        </div>
      </div>
    </article>
  )
}
