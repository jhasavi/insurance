import type { Metadata } from "next"
import { FinancialBalanceTool } from "@/components/FinancialBalanceTool"
import { ComplianceDisclaimer } from "@/components/ComplianceDisclaimer"
import { PageHero } from "@/components/fintech/PageHero"

export const metadata: Metadata = {
  title: "Portfolio Balance Planner | Educational Planning Tool",
  description:
    "Educational tool to review allocation across Roth, 401(k), brokerage, insurance, and real estate — illustrative outputs only, not personalized advice.",
}

export default function BalanceToolPage() {
  return (
    <main className="min-h-screen bg-slate-50/50">
      <PageHero
        variant="emerald"
        align="left"
        eyebrow="Free planning tool"
        title="Portfolio Balance Planner"
        description="Enter your accounts on the left, see illustrative discussion topics on the right. Data stays in this browser unless you export it."
      />

      <section className="container mx-auto max-w-6xl px-4 py-10">
        <FinancialBalanceTool />
        <div className="mt-10">
          <ComplianceDisclaimer variant="footer" />
        </div>
      </section>
    </main>
  )
}
