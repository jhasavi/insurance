"use client"

import type {
  AdvisorExplanation,
  RiskLevel,
} from "@/lib/planning-rules"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card"
import {
  BALANCE_RESULTS_DISCLAIMER,
  CONTEXTUAL_DISCLAIMERS,
  type ContextualTopic,
} from "@/lib/balance-disclaimers"

function riskStyles(level: RiskLevel) {
  if (level === "red") return "bg-red-100 text-red-800 border-red-200"
  if (level === "yellow") return "bg-amber-100 text-amber-800 border-amber-200"
  return "bg-green-100 text-green-800 border-green-200"
}

function riskLabel(level: RiskLevel) {
  if (level === "red") return "Review"
  if (level === "yellow") return "Discuss"
  return "OK / monitor"
}

function relevantTopics(explanation: AdvisorExplanation): ContextualTopic[] {
  const blob = [
    ...explanation.observations.map((o) => o.text),
    ...explanation.riskFlags.map((f) => f.label + f.summary),
    ...explanation.strategyAreas,
    ...explanation.explanationLogic.map((e) => e.observation),
  ]
    .join(" ")
    .toLowerCase()

  const topics: ContextualTopic[] = []
  if (/roth|rmd|conversion|tax-deferred|tax-free/.test(blob)) topics.push("roth")
  if (/insurance|term|death benefit|permanent/.test(blob)) topics.push("lifeInsurance")
  if (/medicare|irmaa/.test(blob)) topics.push("medicare")
  if (/social security|claiming|survivor/.test(blob)) topics.push("socialSecurity")
  if (/long-term care|ltc|custodial/.test(blob)) topics.push("ltc")
  return topics
}

export function AdvisorExplanationPanel({
  explanation,
}: {
  explanation: AdvisorExplanation
}) {
  const topics = relevantTopics(explanation)

  return (
    <section
      className="mt-8 space-y-6 print:block"
      aria-labelledby="advisor-explanation-heading"
    >
      <Card className="border-indigo-200 shadow-md">
        <CardHeader className="bg-gradient-to-r from-indigo-50 to-white border-b">
          <div className="flex flex-wrap items-center gap-2">
            <h2 id="advisor-explanation-heading" className="text-xl font-semibold leading-none">
              Advisor Explanation Mode
            </h2>
            <Badge variant="outline" className="text-indigo-800 border-indigo-200 bg-indigo-50">
              Advisor Use
            </Badge>
          </div>
          <CardDescription>
            Rules-based educational output from entered scenario data — not a suitability or
            recommendation engine.
          </CardDescription>
          <p className="text-xs text-amber-950 bg-amber-50 border border-amber-200 rounded-md px-3 py-2 mt-2">
            {BALANCE_RESULTS_DISCLAIMER}
          </p>
        </CardHeader>
        <CardContent className="pt-6 space-y-8">
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">A. Snapshot</h3>
            <dl className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {explanation.snapshot.map((row) => (
                <div key={row.label} className="rounded-lg bg-slate-50 border border-slate-100 p-3">
                  <dt className="text-xs text-gray-500">{row.label}</dt>
                  <dd className="text-sm font-medium text-gray-900 mt-0.5">{row.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-3">B. Planning observations</h3>
            <ul className="space-y-2">
              {explanation.observations.map((o) => (
                <li
                  key={o.id}
                  className="text-sm text-gray-800 bg-white border border-slate-200 rounded-lg px-4 py-3"
                >
                  {o.text}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-3">C. Risk flags</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {explanation.riskFlags.map((flag) => (
                <div
                  key={flag.id}
                  className={`rounded-lg border p-3 ${riskStyles(flag.level)}`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-medium text-sm">{flag.label}</span>
                    <Badge variant="outline" className="text-xs bg-white/60">
                      {riskLabel(flag.level)}
                    </Badge>
                  </div>
                  <p className="text-xs opacity-90">{flag.summary}</p>
                </div>
              ))}
            </div>
            {topics.includes("medicare") && (
              <p className="text-xs text-slate-700 mt-3 bg-slate-50 border border-slate-200 rounded-md px-3 py-2">
                {CONTEXTUAL_DISCLAIMERS.medicare}
              </p>
            )}
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <h3 className="font-semibold text-gray-900">D. Explanation logic</h3>
              <Badge variant="outline" className="text-xs text-indigo-800 border-indigo-200">
                Advisor Use
              </Badge>
            </div>
            <div className="space-y-4">
              {explanation.explanationLogic.map((item) => (
                <div key={item.id} className="rounded-lg border border-slate-200 p-4 space-y-2">
                  <p className="text-sm font-medium text-gray-900">{item.observation}</p>
                  <p className="text-xs text-gray-600">
                    <strong>Triggered by:</strong> {item.triggeredBy}
                  </p>
                  <p className="text-xs text-gray-600">
                    <strong>Why it may matter:</strong> {item.whyItMatters}
                  </p>
                  <p className="text-xs text-indigo-800 bg-indigo-50 rounded px-2 py-1">
                    <strong>Ask next:</strong> {item.askNext}
                  </p>
                  <p className="text-xs text-amber-900 bg-amber-50 rounded px-2 py-1">
                    <strong>Do not conclude automatically:</strong> {item.doNotConclude}
                  </p>
                </div>
              ))}
            </div>
            {topics.includes("roth") && (
              <p className="text-xs text-slate-700 mt-3 bg-slate-50 border border-slate-200 rounded-md px-3 py-2">
                {CONTEXTUAL_DISCLAIMERS.roth}
              </p>
            )}
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-3">E. Strategy discussion areas</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
              {explanation.strategyAreas.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
            {topics.includes("lifeInsurance") && (
              <p className="text-xs text-slate-700 mt-3 bg-slate-50 border border-slate-200 rounded-md px-3 py-2">
                {CONTEXTUAL_DISCLAIMERS.lifeInsurance}
              </p>
            )}
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-3">F. Client conversation questions</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-800">
              {explanation.clientQuestions.map((q) => (
                <li key={q} className="pl-1">
                  {q}
                </li>
              ))}
            </ol>
            {topics.includes("socialSecurity") && (
              <p className="text-xs text-slate-700 mt-3 bg-slate-50 border border-slate-200 rounded-md px-3 py-2">
                {CONTEXTUAL_DISCLAIMERS.socialSecurity}
              </p>
            )}
            {topics.includes("ltc") && (
              <p className="text-xs text-slate-700 mt-3 bg-slate-50 border border-slate-200 rounded-md px-3 py-2">
                {CONTEXTUAL_DISCLAIMERS.ltc}
              </p>
            )}
          </div>

          <div className="rounded-lg border border-amber-300 bg-amber-50 p-4">
            <h3 className="font-semibold text-amber-950 mb-2">G. Disclaimer</h3>
            <p className="text-sm text-amber-950 leading-relaxed">{explanation.disclaimer}</p>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
