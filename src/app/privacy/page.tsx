import Link from "next/link"
import { Button } from "@/components/ui/button"

export const metadata = {
  title: "Privacy Policy",
  description: "How Namaste Insurance collects, uses, and protects your personal information.",
}

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8">
          <Link href="/" className="text-blue-600 hover:underline text-sm">
            ← Back to Home
          </Link>
        </div>

        <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
        <p className="text-gray-600 mb-8">
          Last Updated: November 17, 2025
        </p>

        <div className="prose prose-lg max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
            <p>
              Namaste Insurance ("we," "our," or "us") is committed to protecting your privacy. 
              This Privacy Policy explains how we collect, use, disclose, and safeguard your 
              information when you use our insurance marketplace platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Information We Collect</h2>
            
            <h3 className="text-xl font-semibold mb-3">Personal Information</h3>
            <p>We may collect the following personal information:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Contact Information</strong>: Name, email address, phone number, mailing address</li>
              <li><strong>Insurance Details</strong>: Current policies, coverage amounts, claim history</li>
              <li><strong>Vehicle Information</strong>: Make, model, year, VIN, usage patterns</li>
              <li><strong>Property Information</strong>: Address, dwelling type, square footage, construction year</li>
              <li><strong>Financial Information</strong>: Premium payment history (not payment card details)</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 mt-4">Policy Documents</h3>
            <p>
              When you use our AI Policy Scanner, we collect and process insurance policy documents 
              you upload. These documents are:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Encrypted in transit and at rest</li>
              <li>Processed by OpenAI's GPT-4 Vision API (subject to their privacy policy)</li>
              <li>Stored securely for 90 days then permanently deleted</li>
              <li>Never sold or shared with third parties without your consent</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 mt-4">Automatically Collected Information</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Usage Data</strong>: Pages viewed, features used, time spent</li>
              <li><strong>Device Information</strong>: Browser type, IP address, operating system</li>
              <li><strong>Cookies</strong>: Session cookies, analytics cookies, preference cookies</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">How We Use Your Information</h2>
            <p>We use your information to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Provide Quote Comparisons</strong>: Match you with appropriate insurance carriers</li>
              <li><strong>AI Policy Analysis</strong>: Identify coverage gaps and savings opportunities</li>
              <li><strong>Referral Services</strong>: Connect you with licensed carriers for policy purchase</li>
              <li><strong>Communication</strong>: Send quote results, policy recommendations, service updates</li>
              <li><strong>Improvement</strong>: Analyze usage patterns to enhance our platform</li>
              <li><strong>Compliance</strong>: Meet legal and regulatory requirements</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Information Sharing</h2>
            
            <h3 className="text-xl font-semibold mb-3">With Your Consent</h3>
            <p>
              We share your information with insurance carriers only when you explicitly request quotes 
              or express interest in purchasing a policy. You will always be notified before we share 
              your information.
            </p>

            <h3 className="text-xl font-semibold mb-3 mt-4">Service Providers</h3>
            <p>We work with trusted third-party service providers:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>OpenAI</strong>: AI-powered policy analysis (GPT-4 Vision API)</li>
              <li><strong>Vercel</strong>: Website hosting and deployment</li>
              <li><strong>Supabase</strong>: Database and authentication services</li>
              <li><strong>Analytics Providers</strong>: Usage analytics and performance monitoring</li>
            </ul>
            <p className="mt-2">
              All service providers are contractually obligated to protect your data and use it only 
              for the purposes we specify.
            </p>

            <h3 className="text-xl font-semibold mb-3 mt-4">Insurance Carriers</h3>
            <p>
              When you request a quote or purchase a policy, we share relevant information with the 
              selected carrier(s). Each carrier has their own privacy policy governing how they use 
              your information.
            </p>

            <h3 className="text-xl font-semibold mb-3 mt-4">Legal Requirements</h3>
            <p>
              We may disclose your information if required by law, court order, or government request, 
              or to protect our rights, property, or safety.
            </p>

            <h3 className="text-xl font-semibold mb-3 mt-4">What We Don't Do</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>❌ We do NOT sell your personal information</li>
              <li>❌ We do NOT share your data with data brokers</li>
              <li>❌ We do NOT send unsolicited marketing emails</li>
              <li>❌ We do NOT share your uploaded policy documents publicly</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Your Rights</h2>
            
            <h3 className="text-xl font-semibold mb-3">Access and Correction</h3>
            <p>
              You have the right to access and correct your personal information. Contact us at 
              privacy@namasteinsurance.com to request your data.
            </p>

            <h3 className="text-xl font-semibold mb-3 mt-4">Deletion</h3>
            <p>
              You may request deletion of your personal information at any time. Note that we may 
              need to retain certain information for legal or legitimate business purposes.
            </p>

            <h3 className="text-xl font-semibold mb-3 mt-4">Opt-Out</h3>
            <p>
              You can opt out of marketing emails by clicking the "unsubscribe" link in any email 
              or contacting us directly.
            </p>

            <h3 className="text-xl font-semibold mb-3 mt-4">California Residents (CCPA)</h3>
            <p>California residents have additional rights under the CCPA:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Right to know what personal information we collect and how it's used</li>
              <li>Right to delete personal information</li>
              <li>Right to opt-out of the sale of personal information (we don't sell data)</li>
              <li>Right to non-discrimination for exercising these rights</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Data Security</h2>
            <p>We implement industry-standard security measures:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Encryption</strong>: All data encrypted in transit (TLS 1.3) and at rest (AES-256)</li>
              <li><strong>Access Controls</strong>: Limited employee access on need-to-know basis</li>
              <li><strong>Monitoring</strong>: Continuous security monitoring and threat detection</li>
              <li><strong>Regular Audits</strong>: Periodic security assessments and penetration testing</li>
            </ul>
            <p className="mt-2">
              However, no system is 100% secure. You should protect your account credentials and 
              notify us immediately of any unauthorized access.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Children's Privacy</h2>
            <p>
              Our service is not intended for individuals under 18 years old. We do not knowingly 
              collect personal information from children. If you believe we have collected information 
              from a child, please contact us immediately.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Cookies and Tracking</h2>
            <p>We use cookies for:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Essential Cookies</strong>: Required for site functionality (cannot be disabled)</li>
              <li><strong>Analytics Cookies</strong>: Help us understand how you use our site</li>
              <li><strong>Preference Cookies</strong>: Remember your settings and choices</li>
            </ul>
            <p className="mt-2">
              You can manage cookie preferences in your browser settings. Note that disabling cookies 
              may limit site functionality.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of material 
              changes by posting the new policy on this page and updating the "Last Updated" date. 
              Your continued use of our service after changes constitutes acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
            <p>Questions about this Privacy Policy? Contact us:</p>
            <ul className="list-none space-y-2 mt-4">
              <li><strong>Email</strong>: privacy@namasteinsurance.com</li>
              <li><strong>Mail</strong>: Namaste Insurance, 123 Main Street, Boston, MA 02101</li>
              <li><strong>Phone</strong>: (617) 555-0100</li>
            </ul>
          </section>

          <section className="bg-blue-50 p-6 rounded-lg mt-8">
            <h2 className="text-2xl font-semibold mb-4">Quick Summary</h2>
            <ul className="space-y-2">
              <li>✓ We only collect information necessary to provide our service</li>
              <li>✓ Your uploaded policy documents are encrypted and deleted after 90 days</li>
              <li>✓ We share your information with carriers only with your consent</li>
              <li>✓ We do NOT sell your data to third parties</li>
              <li>✓ You can request access, correction, or deletion of your data anytime</li>
              <li>✓ We use industry-standard security measures to protect your information</li>
            </ul>
          </section>
        </div>

        <div className="mt-12 flex gap-4">
          <Button asChild>
            <Link href="/terms">View Terms of Service</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
