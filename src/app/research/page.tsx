import type { Metadata } from "next"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table"
import { ComplianceDisclaimer } from "@/components/ComplianceDisclaimer"
import {
  knowledgeTopics,
  getDataPoint,
  getSource,
  type KnowledgeCategory,
} from "@/lib/knowledge-base"

export const metadata: Metadata = {
  title: "Research: Roth vs. Permanent, Annuities, Tax & College Planning",
  description:
    "Sourced, public-data reference for client conversations: Roth vs. permanent life insurance, term + S&P 500 vs. permanent insurance, annuity trends, tax-saving ideas, and college planning (529 vs. life insurance on the FAFSA).",
  alternates: { canonical: "/research" },
}

const CATEGORY_LABELS: Record<KnowledgeCategory, string> = {
  ROTH_VS_PERM: "Roth vs. Permanent Insurance",
  TERM_PLUS_INVEST_VS_PERM: "Term + S&P 500 vs. Permanent",
  ANNUITY_TRENDS: "Annuity & Investment Trends",
  TAX_SAVINGS: "Tax-Saving Ideas",
  COLLEGE_PLANNING: "College Planning",
}

const CATEGORY_ORDER: KnowledgeCategory[] = [
  "ROTH_VS_PERM",
  "TERM_PLUS_INVEST_VS_PERM",
  "ANNUITY_TRENDS",
  "TAX_SAVINGS",
  "COLLEGE_PLANNING",
]

export default function ResearchPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Research &amp; Data</h1>
          <p className="text-sm text-gray-600">
            A sourced reference for conversations clients actually ask about: Roth vs. permanent
            insurance, &ldquo;buy term and invest the difference&rdquo; vs. permanent, annuity
            trends, tax-saving ideas, and college planning. Every figure below links back to its
            public source and the date it was pulled.
          </p>
        </div>

        <ComplianceDisclaimer />

        <nav aria-label="Jump to topic" className="flex flex-wrap gap-2">
          {CATEGORY_ORDER.map((cat) => (
            <a
              key={cat}
              href={`#${cat}`}
              className="text-xs font-medium rounded-full border border-slate-200 bg-white px-3 py-1.5 text-slate-700 hover:bg-slate-50"
            >
              {CATEGORY_LABELS[cat]}
            </a>
          ))}
        </nav>

        {CATEGORY_ORDER.map((category) => {
          const topics = knowledgeTopics.filter((t) => t.category === category)
          if (topics.length === 0) return null

          return (
            <section key={category} id={category} className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">{CATEGORY_LABELS[category]}</h2>

              {topics.map((topic) => {
                const dataPoints = (topic.dataPointIds ?? [])
                  .map(getDataPoint)
                  .filter((d): d is NonNullable<typeof d> => Boolean(d))
                const sources = topic.sourceIds.map(getSource).filter((s): s is NonNullable<typeof s> => Boolean(s))

                return (
                  <Card key={topic.id} id={topic.slug}>
                    <CardHeader>
                      <CardTitle>{topic.title}</CardTitle>
                      <p className="text-sm text-gray-600 mt-1">{topic.summary}</p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {topic.body.map((para, i) => (
                        <p key={i} className="text-sm text-gray-700 leading-relaxed">
                          {para}
                        </p>
                      ))}

                      {dataPoints.length > 0 && (
                        <div className="rounded-lg border border-slate-200 overflow-hidden">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Figure</TableHead>
                                <TableHead>Value</TableHead>
                                <TableHead>As of</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {dataPoints.map((dp) => (
                                <TableRow key={dp.id}>
                                  <TableCell className="whitespace-normal">
                                    {dp.carrier ? <span className="font-medium">{dp.carrier}: </span> : null}
                                    {dp.label}
                                    {dp.notes && (
                                      <span className="block text-xs text-gray-500 mt-0.5">{dp.notes}</span>
                                    )}
                                  </TableCell>
                                  <TableCell className="font-semibold whitespace-nowrap">
                                    {dp.unit === "$" ? `$${dp.value.toLocaleString()}` : `${dp.value}${dp.unit.startsWith("%") ? "%" : ""}`}
                                    {!dp.unit.startsWith("%") && dp.unit !== "$" && (
                                      <span className="block text-xs font-normal text-gray-500">{dp.unit}</span>
                                    )}
                                  </TableCell>
                                  <TableCell className="whitespace-nowrap text-gray-500">
                                    {new Date(dp.asOfDate).toLocaleDateString("en-US", { year: "numeric", month: "short" })}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      )}

                      <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
                        {sources.map((s) => (
                          <a
                            key={s.id}
                            href={s.url}
                            target="_blank"
                            rel="noopener noreferrer nofollow"
                          >
                            <Badge variant="outline" className="text-xs cursor-pointer hover:bg-slate-50">
                              {s.publisher}
                            </Badge>
                          </a>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </section>
          )
        })}

        <p className="text-xs text-gray-500 pt-4 border-t border-slate-200">
          Historical and current figures shown for education only. Past performance, declared
          dividend rates, and crediting rates are not guarantees of future results. Always verify
          current figures with the carrier or source before using in a recommendation.
        </p>
      </div>
    </main>
  )
}
