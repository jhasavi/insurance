import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export const metadata = {
  title: "Terms of Service",
  description: "Terms and conditions for using Namaste Insurance marketplace platform.",
}

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8">
          <Link href="/" className="text-blue-600 hover:underline text-sm">
            ← Back to Home
          </Link>
        </div>

        <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
        <p className="text-gray-600 mb-8">
          Last Updated: November 17, 2025
        </p>

        <Alert className="mb-8 border-blue-200 bg-blue-50">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Important:</strong> By using Namaste Insurance, you agree to these terms. 
            Please read them carefully before using our service.
          </AlertDescription>
        </Alert>

        <div className="prose prose-lg max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Agreement to Terms</h2>
            <p>
              These Terms of Service ("Terms") govern your access to and use of Namaste Insurance's 
              website, services, and applications (collectively, the "Service"). By accessing or using 
              our Service, you agree to be bound by these Terms.
            </p>
            <p className="mt-2">
              If you do not agree to these Terms, you may not access or use the Service.
            </p>
          </section>

          <section className="bg-yellow-50 p-6 rounded-lg border-2 border-yellow-400">
            <h2 className="text-2xl font-semibold mb-4">2. What Namaste Insurance Is (and Isn't)</h2>
            
            <h3 className="text-xl font-semibold mb-3">We Are:</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>✓ A <strong>technology platform</strong> that connects consumers with insurance carriers</li>
              <li>✓ An <strong>insurance marketplace</strong> for comparing quotes</li>
              <li>✓ A <strong>referral service</strong> that earns commissions from carriers</li>
              <li>✓ An <strong>AI-powered tool</strong> for analyzing insurance policies</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 mt-4">We Are NOT:</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>❌ An insurance company or carrier</li>
              <li>❌ A licensed insurance agent (unless explicitly stated)</li>
              <li>❌ Underwriting or issuing insurance policies</li>
              <li>❌ Providing legal or financial advice</li>
              <li>❌ Responsible for carrier policy decisions or claims</li>
            </ul>

            <p className="mt-4 font-semibold text-red-700">
              All insurance products are offered by licensed insurance carriers, not by Namaste Insurance. 
              We do not guarantee policy approval, pricing, or coverage terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. Eligibility</h2>
            <p>You must meet the following requirements to use our Service:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Be at least 18 years old</li>
              <li>Have the legal capacity to enter into a binding contract</li>
              <li>Reside in a state where we operate (currently MA, NH, RI)</li>
              <li>Provide accurate and truthful information</li>
              <li>Not be prohibited from using the Service by law</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. How Our Service Works</h2>
            
            <h3 className="text-xl font-semibold mb-3">Quote Comparison</h3>
            <p>
              When you request insurance quotes, we display offers from multiple licensed carriers. 
              These quotes are:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Based on information you provide</li>
              <li>Subject to carrier approval and verification</li>
              <li>Not guaranteed or binding until issued by the carrier</li>
              <li>May change based on underwriting review</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 mt-4">AI Policy Scanner</h3>
            <p>
              Our AI-powered policy scanner uses GPT-4 Vision to analyze insurance documents. You understand that:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>AI analysis is for informational purposes only</li>
              <li>Accuracy is not guaranteed (typically 95%+ but not perfect)</li>
              <li>You should verify all information with your carrier</li>
              <li>This is not a substitute for professional insurance advice</li>
              <li>Uploaded documents are subject to our Privacy Policy</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 mt-4">Referrals</h3>
            <p>
              When you select a quote and contact a carrier, we may receive a referral commission. 
              You acknowledge that:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Commission rates vary by carrier and are disclosed per quote</li>
              <li>Commissions do not increase your premium</li>
              <li>Our recommendations are based on coverage and price, not commission</li>
              <li>You're free to purchase insurance directly from any carrier</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Your Responsibilities</h2>
            
            <h3 className="text-xl font-semibold mb-3">Accurate Information</h3>
            <p>You agree to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide complete and accurate information</li>
              <li>Update information promptly if it changes</li>
              <li>Not misrepresent your insurance needs or history</li>
              <li>Not provide false documents or information</li>
            </ul>
            <p className="mt-2 text-sm text-red-600">
              Providing false information to obtain insurance quotes may constitute fraud and could 
              void any resulting policy.
            </p>

            <h3 className="text-xl font-semibold mb-3 mt-4">Acceptable Use</h3>
            <p>You agree NOT to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Use the Service for any illegal purpose</li>
              <li>Attempt to access unauthorized areas of the Service</li>
              <li>Interfere with or disrupt the Service</li>
              <li>Use automated tools (bots, scrapers) without permission</li>
              <li>Copy, modify, or distribute our content without authorization</li>
              <li>Impersonate another person or entity</li>
              <li>Upload malicious code or viruses</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 mt-4">Account Security</h3>
            <p>If you create an account:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Keep your password secure and confidential</li>
              <li>Notify us immediately of any unauthorized access</li>
              <li>You're responsible for all activity under your account</li>
              <li>Do not share your account with others</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">6. Intellectual Property</h2>
            
            <h3 className="text-xl font-semibold mb-3">Our Content</h3>
            <p>
              All content on the Service—including text, graphics, logos, software, and design—is 
              owned by Namaste Insurance or our licensors and protected by copyright, trademark, 
              and other intellectual property laws.
            </p>

            <h3 className="text-xl font-semibold mb-3 mt-4">Your Content</h3>
            <p>
              When you upload policy documents or submit information, you grant us a limited license to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Process and analyze your documents using AI</li>
              <li>Store your information to provide the Service</li>
              <li>Share your information with carriers (with your consent)</li>
            </ul>
            <p className="mt-2">
              You retain ownership of your content. We will not use your documents for any purpose 
              other than providing the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">7. Commission Disclosure</h2>
            <p className="bg-blue-50 p-4 rounded border-l-4 border-blue-600">
              <strong>FTC Disclosure:</strong> Namaste Insurance earns referral commissions when you 
              purchase insurance through our platform. Commission rates vary by carrier and typically 
              range from 5-15% of your annual premium. We disclose the specific commission amount for 
              each quote. These commissions help us provide free comparison tools and do not increase 
              your premium. Our recommendations are based on coverage quality and price competitiveness, 
              not commission amounts.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">8. Disclaimers and Limitations</h2>
            
            <h3 className="text-xl font-semibold mb-3">No Warranty</h3>
            <p>
              THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, 
              EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Accuracy, reliability, or completeness of information</li>
              <li>Availability or uninterrupted access to the Service</li>
              <li>Freedom from errors, bugs, or viruses</li>
              <li>Fitness for a particular purpose</li>
              <li>Non-infringement of third-party rights</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 mt-4">Limitation of Liability</h3>
            <p>
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, NAMASTE INSURANCE SHALL NOT BE LIABLE FOR:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Indirect, incidental, special, or consequential damages</li>
              <li>Lost profits, data, or business opportunities</li>
              <li>Damages resulting from carrier decisions or policy denials</li>
              <li>Errors or omissions in quotes or AI analysis</li>
              <li>Unauthorized access to your account or information</li>
            </ul>
            <p className="mt-2">
              Our total liability to you for any claim shall not exceed the greater of (a) $100 or 
              (b) the commissions we received from carriers based on your purchases in the past 12 months.
            </p>

            <h3 className="text-xl font-semibold mb-3 mt-4">Insurance-Specific Disclaimers</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>We do not guarantee policy approval or specific premium rates</li>
              <li>Quotes are estimates subject to carrier underwriting</li>
              <li>Coverage terms are determined by carriers, not by us</li>
              <li>We are not responsible for claim denials or coverage disputes</li>
              <li>You should read your policy documents carefully before purchasing</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">9. Indemnification</h2>
            <p>
              You agree to indemnify and hold harmless Namaste Insurance, its officers, directors, 
              employees, and agents from any claims, damages, losses, or expenses (including legal fees) 
              arising from:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Your use of the Service</li>
              <li>Your violation of these Terms</li>
              <li>Your violation of any third-party rights</li>
              <li>False or misleading information you provide</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">10. Termination</h2>
            <p>
              We may suspend or terminate your access to the Service at any time, with or without cause, 
              with or without notice. Reasons for termination may include:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Violation of these Terms</li>
              <li>Fraudulent or illegal activity</li>
              <li>Abuse of the Service</li>
              <li>Extended inactivity</li>
            </ul>
            <p className="mt-2">
              Upon termination, your right to use the Service immediately ceases. We may delete your 
              account and data, subject to our Privacy Policy and legal obligations.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">11. Dispute Resolution</h2>
            
            <h3 className="text-xl font-semibold mb-3">Governing Law</h3>
            <p>
              These Terms are governed by the laws of the Commonwealth of Massachusetts, without regard 
              to conflict of law principles.
            </p>

            <h3 className="text-xl font-semibold mb-3 mt-4">Arbitration</h3>
            <p>
              Any dispute arising from these Terms or the Service shall be resolved through binding 
              arbitration in accordance with the American Arbitration Association's rules, except that:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>You may bring claims in small claims court if eligible</li>
              <li>Either party may seek injunctive relief in court</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 mt-4">Class Action Waiver</h3>
            <p>
              You agree that any arbitration or legal proceeding shall be conducted on an individual 
              basis, not as a class action, and you waive your right to participate in a class action 
              lawsuit or class-wide arbitration.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">12. Changes to Terms</h2>
            <p>
              We may modify these Terms at any time. We will notify you of material changes by:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Posting the updated Terms on this page</li>
              <li>Updating the "Last Updated" date</li>
              <li>Sending an email notification (if you have an account)</li>
            </ul>
            <p className="mt-2">
              Your continued use of the Service after changes constitutes acceptance of the updated Terms. 
              If you do not agree to the new Terms, you must stop using the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">13. General Provisions</h2>
            
            <p><strong>Entire Agreement:</strong> These Terms constitute the entire agreement between you and Namaste Insurance.</p>
            
            <p className="mt-2"><strong>Severability:</strong> If any provision is found invalid, the remaining provisions remain in effect.</p>
            
            <p className="mt-2"><strong>Waiver:</strong> Our failure to enforce any right or provision does not constitute a waiver.</p>
            
            <p className="mt-2"><strong>Assignment:</strong> You may not assign these Terms without our written consent.</p>
            
            <p className="mt-2"><strong>Third-Party Rights:</strong> These Terms do not create rights for third parties.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">14. State-Specific Notices</h2>
            
            <h3 className="text-xl font-semibold mb-3">Massachusetts Residents</h3>
            <p>
              Massachusetts law requires us to disclose that we are not licensed as an insurance agent 
              in Massachusetts. We are a technology platform that refers consumers to licensed carriers.
            </p>

            <h3 className="text-xl font-semibold mb-3 mt-4">California Residents</h3>
            <p>
              California Civil Code Section 1789.3 requires us to provide: California residents may 
              contact the Complaint Assistance Unit of the Division of Consumer Services of the California 
              Department of Consumer Affairs by mail at 1625 North Market Blvd., Sacramento, CA 95834, 
              or by telephone at (916) 445-1254 or (800) 952-5210.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">15. Contact Information</h2>
            <p>Questions about these Terms? Contact us:</p>
            <ul className="list-none space-y-2 mt-4">
              <li><strong>Email</strong>: legal@namasteinsurance.com</li>
              <li><strong>Mail</strong>: Namaste Insurance, 123 Main Street, Boston, MA 02101</li>
              <li><strong>Phone</strong>: (617) 555-0100</li>
            </ul>
          </section>

          <section className="bg-gray-50 p-6 rounded-lg mt-8">
            <h2 className="text-2xl font-semibold mb-4">Summary (Not Legally Binding)</h2>
            <p className="mb-4">This is a plain-English summary. The full Terms above are legally binding.</p>
            <ul className="space-y-2">
              <li>✓ We're a marketplace, not an insurance company</li>
              <li>✓ We earn commissions when you buy insurance through us</li>
              <li>✓ Our AI analysis is helpful but not guaranteed perfect</li>
              <li>✓ You must provide accurate information</li>
              <li>✓ We're not liable for carrier decisions or policy disputes</li>
              <li>✓ Disputes are resolved through arbitration, not court</li>
              <li>✓ We can change these Terms with notice</li>
            </ul>
          </section>
        </div>

        <div className="mt-12 flex gap-4">
          <Button asChild>
            <Link href="/privacy">View Privacy Policy</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
