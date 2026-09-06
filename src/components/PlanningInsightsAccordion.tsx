"use client"

import { ChevronDown } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  ADVISOR_INSIGHT_CARDS,
  ADVISOR_INSIGHTS_DISCLAIMER,
} from "@/lib/balance-advisor-insights"
import { CONTEXTUAL_DISCLAIMERS } from "@/lib/balance-disclaimers"

export function PlanningInsightsAccordion() {
  return (
    <section
      className="mt-10 print:hidden"
      aria-labelledby="planning-insights-heading"
    >
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="px-5 py-5 sm:px-6 border-b bg-slate-50/80">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <h2
              id="planning-insights-heading"
              className="text-xl font-semibold text-gray-900"
            >
              Planning Questions &amp; Advisor Insights
            </h2>
            <Badge variant="outline" className="text-indigo-800 border-indigo-200 bg-indigo-50">
              Advisor Use
            </Badge>
          </div>
          <p className="text-sm text-gray-600 max-w-3xl">
            Expand any card for discussion prompts and planning angles that are often under-covered
            in generic articles — not personalized recommendations for any client.
          </p>
          <p className="mt-3 text-xs text-amber-900 bg-amber-50 border border-amber-200 rounded-md px-3 py-2">
            {ADVISOR_INSIGHTS_DISCLAIMER}
          </p>
        </div>

        <div className="divide-y divide-slate-100">
          {ADVISOR_INSIGHT_CARDS.map((card) => (
            <details key={card.id} className="group">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-4 sm:px-6 hover:bg-slate-50 transition-colors [&::-webkit-details-marker]:hidden">
                <span className="font-medium text-gray-900 text-left pr-2">
                  {card.title}
                </span>
                <ChevronDown
                  className="h-5 w-5 shrink-0 text-gray-400 transition-transform group-open:rotate-180"
                  aria-hidden
                />
              </summary>
              <div className="px-5 pb-5 sm:px-6 sm:pb-6 space-y-4 border-t border-slate-100 bg-white">
                <InsightBlock label="Client question" content={card.question} />
                <InsightBlock label="Why this may matter" content={card.whyItMatters} />
                <InsightBlock label="Advisor note" content={card.advisorNote} variant="note" />
                <InsightBlock label="Possible next step" content={card.nextStep} variant="action" />
                {card.topic && (
                  <p className="text-xs text-slate-700 bg-slate-50 border border-slate-200 rounded-md px-3 py-2">
                    {CONTEXTUAL_DISCLAIMERS[card.topic]}
                  </p>
                )}
                <p className="text-xs text-gray-500 pt-1 border-t border-dashed border-slate-200">
                  {ADVISOR_INSIGHTS_DISCLAIMER}
                </p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}

function InsightBlock({
  label,
  content,
  variant = "default",
}: {
  label: string
  content: string
  variant?: "default" | "note" | "action"
}) {
  const bg =
    variant === "note"
      ? "bg-blue-50 border-blue-100"
      : variant === "action"
        ? "bg-emerald-50 border-emerald-100"
        : "bg-gray-50 border-gray-100"

  return (
    <div className={`rounded-lg border p-3 sm:p-4 ${bg}`}>
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1.5">
        {label}
      </p>
      <p className="text-sm text-gray-800 leading-relaxed">{content}</p>
    </div>
  )
}
