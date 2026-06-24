import Link from "next/link"
import { Mail, MapPin } from "lucide-react"
import { ComplianceDisclaimer } from "@/components/ComplianceDisclaimer"
import { portalContactUrl, portalEventsUrl } from "@/lib/janagana"

export function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 text-slate-300">
      <div className="container mx-auto px-4 py-14">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-1">
            <div className="mb-4 flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-teal-700 text-sm font-bold text-white">
                S
              </span>
              <span className="text-lg font-semibold text-white">Safora</span>
            </div>
            <p className="mb-4 text-sm leading-relaxed text-slate-400">
              Educational financial planning for Massachusetts families. Classes, tools, and
              resources — not personalized investment advice.
            </p>
            <div className="space-y-2 text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 shrink-0 text-teal-500" />
                <span>Needham &amp; Greater Boston, MA</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0 text-teal-500" />
                <a href="mailto:hello@safora.com" className="hover:text-white transition-colors">
                  hello@safora.com
                </a>
              </div>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-500">
              Classes
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/classes" className="hover:text-white transition-colors">
                  Upcoming classes
                </Link>
              </li>
              <li>
                <a
                  href={portalEventsUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Full event calendar
                </a>
              </li>
              <li>
                <a
                  href={portalContactUrl("class-interest")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Request a class topic
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-500">
              Tools
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/tools/balance" className="hover:text-white transition-colors">
                  Portfolio Balance Planner
                </Link>
              </li>
              <li>
                <Link href="/life-insurance" className="hover:text-white transition-colors">
                  Life Insurance Tool
                </Link>
              </li>
              <li>
                <Link href="/learn" className="hover:text-white transition-colors">
                  Learning center
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-500">
              Legal
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/licenses" className="hover:text-white transition-colors">
                  Licenses &amp; Disclaimers
                </Link>
              </li>
              <li>
                <Link href="/accessibility" className="hover:text-white transition-colors">
                  Accessibility
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-800 pt-8 text-xs leading-relaxed text-slate-500">
          <ComplianceDisclaimer variant="footer-dark" />
        </div>

        <p className="mt-6 text-center text-xs text-slate-600">
          © {new Date().getFullYear()} Safora — Sanjeev Jha. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
