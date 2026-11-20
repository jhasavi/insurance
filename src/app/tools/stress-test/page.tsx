import type { Metadata } from "next"
import { SequenceRiskSimulator } from "@/components/SequenceRiskSimulator"
import { ComplianceDisclaimer } from "@/components/ComplianceDisclaimer"
import { SP500_SOURCE } from "@/lib/sp500-returns"

export const metadata: Metadata = {
  title: "Market Crash Stress Test — Sequence-of-Returns Risk Calculator",
  description:
    "See what actually happens to a 100%-stock retirement portfolio during real historical crashes (2000, 2008, 2022) versus one with a small non-correlated buffer, using real S&P 500 annual returns.",
  alternates: { canonical: "/tools/stress-test" },
}

export default function StressTestPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">The Market Crash Stress Test</h1>
          <p className="text-sm text-gray-700 leading-relaxed">
            You&rsquo;re probably right that the S&amp;P 500 beats almost everything else over 20-30
            years. That&rsquo;s not the question this tool asks. The question is: what happens the
            moment you start <em>withdrawing</em> from that portfolio and the market has a bad run
            right out of the gate? Pick a real historical starting year &mdash; 2000, 2008, whatever
            &mdash; and watch what the withdrawals actually do.
          </p>
        </div>

        <ComplianceDisclaimer />

        <div className="rounded-lg border border-slate-200 bg-white p-4 sm:p-6">
          <SequenceRiskSimulator />
        </div>

        <div className="rounded-lg bg-slate-50 border border-slate-200 p-4 space-y-2">
          <h2 className="text-sm font-semibold text-gray-900">What this is actually showing</h2>
          <p className="text-sm text-gray-700">
            This is &ldquo;sequence-of-returns risk&rdquo; &mdash; the same average return, in a
            different order, can produce wildly different outcomes once you&rsquo;re withdrawing
            instead of accumulating. The &ldquo;buffer&rdquo; strategy here models what
            researchers like Wade Pfau call a <em>volatility buffer</em>: a small, non-correlated
            bucket (whole life cash value, a fixed annuity, or cash) you draw from only in down
            years, so the market side of the portfolio isn&rsquo;t forced to sell at a loss and gets
            a chance to recover.
          </p>
          <p className="text-sm text-gray-700">
            This isn&rsquo;t an argument that stocks are a bad long-term investment &mdash; the data
            says the opposite. It&rsquo;s an argument that the accumulation-phase return and the
            retirement-withdrawal outcome are two different problems, and a portfolio that&rsquo;s
            100% correlated to the market has no shock absorber for the second one.
          </p>
          <p className="text-sm text-gray-700">
            Try it honestly: start in 2008 instead of 2000. The buffer barely matters there &mdash;
            one bad year followed by a decade-plus bull run means the 100%-market portfolio actually
            pulls ahead, because the buffer money sat out some of the recovery. The buffer strategy
            isn&rsquo;t a free win; it specifically targets the scenario where bad years cluster
            right at the start of withdrawals, which is exactly the scenario a &ldquo;just stay 100%
            invested&rdquo; plan has no answer for.
          </p>
          <p className="text-xs text-gray-500 pt-2 border-t border-slate-200">
            S&amp;P 500 annual total returns (dividends reinvested) from{" "}
            <a href={SP500_SOURCE.url} target="_blank" rel="noopener noreferrer nofollow" className="underline">
              {SP500_SOURCE.publisher}
            </a>
            , retrieved {SP500_SOURCE.retrievedAt}. This simulation is simplified for illustration
            — it doesn&rsquo;t model insurance costs, loan interest, taxes, or fees on any specific
            product. It uses real historical sequences but that is not a guarantee of how any
            future retirement will play out. Always model a client&rsquo;s actual numbers before
            making a recommendation.
          </p>
        </div>
      </div>
    </main>
  )
}
