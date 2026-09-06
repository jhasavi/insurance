import Link from "next/link"
import { ComplianceDisclaimer } from "@/components/ComplianceDisclaimer"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-20">
        <h1 className="text-4xl font-bold mb-8">About Safora</h1>

        <div className="max-w-4xl space-y-8">
          <ComplianceDisclaimer />

          <section>
            <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
            <p className="text-gray-600 leading-relaxed">
              Safora helps Massachusetts families build financial confidence through education.
              We offer free classes, planning tools, and licensed insurance guidance — always with
              clear regulatory disclosures.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">What We Offer</h2>
            <ul className="list-disc ml-6 space-y-2 text-gray-600">
              <li>
                <Link href="/classes" className="text-blue-600 hover:underline">
                  Financial planning classes
                </Link>{" "}
                — virtual and in-person workshops on retirement, insurance, and portfolio balance
              </li>
              <li>
                <Link href="/tools/balance" className="text-blue-600 hover:underline">
                  Portfolio balance planner
                </Link>{" "}
                — educational tool for Roth, 401(k), brokerage, and real estate allocation
              </li>
              <li>
                <Link href="/life-insurance" className="text-blue-600 hover:underline">
                  Life insurance recommendation tool
                </Link>{" "}
                — DIME-based coverage analysis for advisors and families
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">About Sanjeev Jha</h2>
            <p className="text-gray-600 leading-relaxed">
              Sanjeev Jha is a licensed insurance professional and financial planning educator
              serving the Greater Boston area. Classes and tools on this site are designed to make
              complex topics accessible — not to replace personalized advice from qualified
              professionals.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">CRM &amp; Class Registration</h2>
            <p className="text-gray-600 leading-relaxed">
              Class sign-ups and contact inquiries are managed through JanaGana CRM, keeping
              registration data secure and organized. See our{" "}
              <Link href="/licenses" className="text-blue-600 hover:underline">
                Licenses &amp; Disclaimers
              </Link>{" "}
              for full regulatory information.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
