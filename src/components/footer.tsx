import Link from "next/link"
import { Shield, Mail, MapPin } from "lucide-react"
import { ComplianceDisclaimer } from "@/components/ComplianceDisclaimer"
import { portalContactUrl, portalEventsUrl } from "@/lib/janagana"

export function Footer() {
  return (
    <footer className="border-t bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Shield className="h-6 w-6 text-blue-600" />
              <span className="font-bold text-lg">Safora</span>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Educational financial planning and insurance guidance for Massachusetts families.
              Classes, tools, and resources — not personalized investment advice.
            </p>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>Needham &amp; Greater Boston, MA</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <a href="mailto:hello@safora.com" className="hover:text-blue-600">
                  hello@safora.com
                </a>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Classes</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/classes" className="text-gray-600 hover:text-blue-600">
                  Upcoming classes
                </Link>
              </li>
              <li>
                <a
                  href={portalEventsUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-blue-600"
                >
                  Full event calendar
                </a>
              </li>
              <li>
                <a
                  href={portalContactUrl("class-interest")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-blue-600"
                >
                  Request a class topic
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Tools</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/tools/balance" className="text-gray-600 hover:text-blue-600">
                  Portfolio Balance Planner
                </Link>
              </li>
              <li>
                <Link href="/life-insurance" className="text-gray-600 hover:text-blue-600">
                  Life Insurance Recommendation
                </Link>
              </li>
              <li>
                <Link href="/learn" className="text-gray-600 hover:text-blue-600">
                  Learning center
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy" className="text-gray-600 hover:text-blue-600">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-600 hover:text-blue-600">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/licenses" className="text-gray-600 hover:text-blue-600">
                  Licenses &amp; Disclaimers
                </Link>
              </li>
              <li>
                <Link href="/accessibility" className="text-gray-600 hover:text-blue-600">
                  Accessibility
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200 space-y-4">
          <ComplianceDisclaimer variant="footer" />

          <p className="text-xs text-gray-600 leading-relaxed">
            <strong>Insurance disclosure:</strong> Safora is not an insurance company. Insurance
            products are offered by licensed carriers. Tools provide educational estimates only.
            Consult a licensed insurance professional before purchasing coverage.
          </p>

          <p className="text-xs text-gray-600 leading-relaxed">
            <strong>Investment disclosure:</strong> Safora is not a registered investment adviser or
            broker-dealer. Portfolio tools use general guidelines and do not recommend specific
            securities. Consult a qualified financial professional for personalized advice.
          </p>

          <p className="text-xs text-gray-600 leading-relaxed">
            <strong>Class registration:</strong> Event sign-ups are processed through JanaGana CRM.
            Your registration data is handled per our{" "}
            <Link href="/privacy" className="text-blue-600 hover:underline">
              Privacy Policy
            </Link>
            .
          </p>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-600">
            © {new Date().getFullYear()} Safora — Sanjeev Jha. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
