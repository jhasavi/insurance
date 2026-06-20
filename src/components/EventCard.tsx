import Link from "next/link"
import { Calendar, MapPin, Users, Video } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  type JanaganaEmbedEvent,
  eventFormatLabel,
  formatEventDate,
  formatEventPrice,
} from "@/lib/janagana"

export function EventCard({ event }: { event: JanaganaEmbedEvent }) {
  const isVirtual = event.format === "VIRTUAL" || event.isVirtual

  return (
    <Card className="flex flex-col h-full border hover:border-blue-300 transition-colors">
      <CardHeader>
        <div className="flex items-start justify-between gap-2 mb-2">
          <Badge variant="secondary">{formatEventPrice(event.priceCents)}</Badge>
          <Badge variant="outline" className="shrink-0">
            {eventFormatLabel(event)}
          </Badge>
        </div>
        <CardTitle className="text-lg leading-snug">{event.title}</CardTitle>
        {event.shortSummary && (
          <CardDescription className="line-clamp-3">{event.shortSummary}</CardDescription>
        )}
      </CardHeader>
      <CardContent className="flex flex-col flex-1 gap-4">
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 shrink-0 text-blue-600" />
            <span>{formatEventDate(event.startDate)}</span>
          </div>
          {event.location && (
            <div className="flex items-center gap-2">
              {isVirtual ? (
                <Video className="h-4 w-4 shrink-0 text-blue-600" />
              ) : (
                <MapPin className="h-4 w-4 shrink-0 text-blue-600" />
              )}
              <span>{event.location}</span>
            </div>
          )}
          {event.attendeeCount != null && event.attendeeCount > 0 && (
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 shrink-0 text-blue-600" />
              <span>{event.attendeeCount} registered</span>
            </div>
          )}
        </div>
        <div className="mt-auto flex flex-wrap gap-2">
          <Button asChild className="flex-1 min-w-[120px]">
            <Link href={event.registrationUrl} target="_blank" rel="noopener noreferrer">
              Register
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href={event.detailsUrl} target="_blank" rel="noopener noreferrer">
              Details
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
