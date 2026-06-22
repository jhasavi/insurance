import type { Metadata } from "next"
import { FinancialBalanceTool } from "@/components/FinancialBalanceTool"
import { ComplianceDisclaimer } from "@/components/ComplianceDisclaimer"

export const metadata: Metadata = {
  title: "Portfolio Balance Planner | Educational Planning Tool",
  description:
    "Educational tool to review allocation across Roth, 401(k), brokerage, insurance, and real estate — illustrative outputs only, not personalized advice.",
}

export default function BalanceToolPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <section className="bg-gradient-to-br from-emerald-700 to-emerald-900 text-white py-14">
        <div className="container mx-auto px-4 max-w-6xl">
          <p className="text-emerald-200 text-sm font-medium uppercase tracking-wide mb-2">
            Free planning tool
          </p>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Portfolio Balance Planner</h1>
          <p className="text-lg text-emerald-100 max-w-2xl">
            Enter your accounts on the left, see illustrative discussion topics on the right. Data
            stays in this browser unless you export it.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-10 max-w-6xl">
        <FinancialBalanceTool />
        <div className="mt-10">
          <ComplianceDisclaimer variant="footer" />
        </div>
      </section>
    </main>
  )
}
