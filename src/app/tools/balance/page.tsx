import type { Metadata } from "next"
import { FinancialBalanceTool } from "@/components/FinancialBalanceTool"
import { ComplianceDisclaimer } from "@/components/ComplianceDisclaimer"

export const metadata: Metadata = {
  title: "Portfolio Balance Planner",
  description:
    "Educational tool to review allocation across Roth, 401(k), brokerage, insurance, and real estate accounts.",
}

export default function BalanceToolPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="bg-gradient-to-b from-emerald-50 to-white py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-4xl font-bold mb-4">Portfolio Balance Planner</h1>
          <p className="text-lg text-gray-600">
            Enter your Roth, 401(k), brokerage, insurance, and real estate details to see where
            your financial plan may need attention. This is an educational exercise — not
            personalized investment advice.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12 max-w-4xl">
        <FinancialBalanceTool />
        <div className="mt-8">
          <ComplianceDisclaimer variant="footer" />
        </div>
      </section>
    </main>
  )
}
