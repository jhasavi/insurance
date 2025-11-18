export default function LicensesPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-20">
        <h1 className="text-4xl font-bold mb-8">Licenses & Disclaimers</h1>
        
        <div className="max-w-4xl space-y-8">
          <section className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded">
            <h2 className="text-2xl font-semibold mb-4">Important: We Are NOT an Insurance Company</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Namaste Insurance is a technology platform and insurance marketplace. We are not 
              an insurance company, and we do not underwrite, sell, or service insurance policies.
            </p>
            <p className="text-gray-700 leading-relaxed">
              All insurance products are offered by licensed insurance carriers who are solely 
              responsible for policy terms, pricing, underwriting decisions, and claims handling.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Insurance Licenses</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Namaste Insurance is licensed as an insurance producer/broker in the following states:
            </p>
            <ul className="space-y-2 text-gray-700">
              <li>• <strong>Massachusetts:</strong> License #123456</li>
              <li>• <strong>New Hampshire:</strong> License #789012</li>
              <li>• <strong>Rhode Island:</strong> License #345678</li>
            </ul>
            <p className="text-sm text-gray-500 mt-4">
              Note: License numbers are examples. Actual license numbers will be provided upon 
              obtaining proper insurance producer licenses.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Commission Disclosure</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We earn referral commissions when you purchase insurance through our platform. 
              Commission rates vary by carrier and typically range from 5-15% of your annual premium.
            </p>
            <p className="text-gray-700 leading-relaxed">
              <strong>Important:</strong> These commissions do not increase your premium. 
              Carriers pay the same commission whether you buy through us or directly. 
              We disclose the exact commission amount for each quote we show you.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">FTC Affiliate Disclosure</h2>
            <p className="text-gray-700 leading-relaxed">
              In compliance with FTC regulations, we disclose that we have financial relationships 
              with the insurance carriers we recommend. We may earn commissions when you purchase 
              policies through links on our site. Our recommendations are based on coverage quality, 
              price competitiveness, and carrier reputation—not solely on commission amounts.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">AI Analysis Disclaimer</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Our AI-powered policy scanner uses machine learning (GPT-4 Vision API) to analyze 
              insurance documents. While we strive for high accuracy (typically 95%+), AI analysis 
              is for informational purposes only.
            </p>
            <p className="text-gray-700 leading-relaxed">
              <strong>Do not rely solely on AI analysis for insurance decisions.</strong> Always 
              verify information with your insurance carrier and consult a licensed insurance 
              agent for advice specific to your situation.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Carrier Availability</h2>
            <p className="text-gray-700 leading-relaxed">
              Not all carriers are available in all states or for all customers. Quotes are 
              estimates based on information provided and are subject to carrier underwriting 
              and approval. Your actual premium may differ based on additional factors the 
              carrier evaluates during the underwriting process.
            </p>
          </section>

          <section className="bg-blue-50 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Questions About Licensing?</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              If you have questions about our licenses or want to verify our credentials, 
              please contact us:
            </p>
            <div className="space-y-2 text-gray-700">
              <p>📧 Email: legal@namasteinsurance.com</p>
              <p>📞 Phone: (617) 555-0100</p>
            </div>
          </section>

          <section className="text-sm text-gray-500">
            <p>Last Updated: November 2025</p>
          </section>
        </div>
      </div>
    </div>
  );
}
