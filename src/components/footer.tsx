import Link from "next/link"
import { Shield, Mail, Phone, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Shield className="h-6 w-6 text-blue-600" />
              <span className="font-bold text-lg">Namaste Insurance</span>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              The transparent insurance marketplace. Compare quotes from 15+ carriers. 
              Save an average of $847/year.
            </p>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>Boston, MA</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <a href="mailto:hello@namasteinsurance.com" className="hover:text-blue-600">
                  hello@namasteinsurance.com
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <a href="tel:+16175550100" className="hover:text-blue-600">
                  (617) 555-0100
                </a>
              </div>
            </div>
          </div>

          {/* Products */}
          <div>
            <h3 className="font-semibold mb-4">Products</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/compare" className="text-gray-600 hover:text-blue-600">
                  Auto Insurance
                </Link>
              </li>
              <li>
                <Link href="/compare" className="text-gray-600 hover:text-blue-600">
                  Home Insurance
                </Link>
              </li>
              <li>
                <Link href="/scan" className="text-gray-600 hover:text-blue-600">
                  AI Policy Scanner
                </Link>
              </li>
              <li>
                <Link href="/compare" className="text-gray-600 hover:text-blue-600">
                  Bundle & Save
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-gray-600 hover:text-blue-600">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="text-gray-600 hover:text-blue-600">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/carriers" className="text-gray-600 hover:text-blue-600">
                  Our Carriers
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-600 hover:text-blue-600">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
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
                  Licenses & Disclaimers
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

        {/* Disclaimers */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded">
            <p className="text-xs text-gray-700 leading-relaxed">
              <strong className="font-semibold">Important Disclaimer:</strong> Namaste Insurance is not an 
              insurance company. We are a technology platform and marketplace that connects consumers with 
              licensed insurance carriers. We do not underwrite, sell, or service insurance policies. All 
              insurance products are offered by licensed carriers who are solely responsible for policy 
              terms, pricing, and coverage decisions.
            </p>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6 rounded">
            <p className="text-xs text-gray-700 leading-relaxed">
              <strong className="font-semibold">Commission Disclosure:</strong> We earn referral commissions 
              when you purchase insurance through our platform. Commission rates vary by carrier (typically 
              5-15% of annual premium) and are disclosed for each quote. These commissions help us provide 
              free comparison tools and do not increase your premium. Our recommendations are based on 
              coverage quality and price competitiveness, not commission amounts.
            </p>
          </div>

          <p className="text-xs text-gray-600 leading-relaxed mb-4">
            <strong>Licensing:</strong> Licensed in Massachusetts, New Hampshire, and Rhode Island. 
            License numbers: MA #123456, NH #789012, RI #345678. Not all carriers are available in all 
            states. Quotes are estimates based on information provided and are subject to carrier 
            underwriting and approval. Your actual premium may differ.
          </p>

          <p className="text-xs text-gray-600 leading-relaxed mb-4">
            <strong>AI Analysis Disclaimer:</strong> Our AI-powered policy scanner uses machine learning 
            to analyze insurance documents. While we strive for accuracy (typically 95%+), AI analysis is 
            for informational purposes only and should not be relied upon as the sole basis for insurance 
            decisions. Always verify information with your insurance carrier and consult a licensed agent 
            for advice specific to your situation.
          </p>

          <p className="text-xs text-gray-600 leading-relaxed">
            <strong>Data Privacy:</strong> We are committed to protecting your privacy. Uploaded policy 
            documents are encrypted, processed securely, and automatically deleted after 90 days. We do 
            not sell your personal information. See our <Link href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link> for details.
          </p>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-600">
            © {new Date().getFullYear()} Namaste Insurance. All rights reserved.
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Made with ❤️ in Boston | Committed to transparency and trust
          </p>
        </div>
      </div>
    </footer>
  )
}
