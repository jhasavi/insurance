export default function LicensesPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-20">
        <h1 className="text-4xl font-bold mb-8">Licenses &amp; Disclaimers</h1>

        <div className="max-w-4xl space-y-8">
          <section className="bg-amber-50 border-l-4 border-amber-400 p-6 rounded">
            <h2 className="text-2xl font-semibold mb-4">Educational Purpose Only</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Safora provides educational content, planning tools, and class information. Nothing on
              this website constitutes insurance, tax, legal, or investment advice. Tools produce
              illustrative outputs based on information you enter and general planning guidelines.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Always consult licensed professionals — including insurance agents, tax advisors, and
              financial planners — before making decisions about coverage, investments, or estate
              planning.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Insurance Licensing</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Insurance guidance and product recommendations on this site are provided in an
              educational context by Sanjeev Jha, a licensed insurance professional in Massachusetts.
            </p>
            <ul className="space-y-2 text-gray-700">
              <li>
                • <strong>Massachusetts:</strong> Licensed insurance producer (contact for license
                number)
              </li>
            </ul>
            <p className="text-sm text-gray-500 mt-4">
              Safora is not an insurance company. Insurance products are underwritten and issued by
              licensed carriers. Policy terms, pricing, and underwriting decisions are made solely by
              the carrier.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Financial Advisory Disclosure</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Safora is not a registered investment adviser (RIA) or broker-dealer. Portfolio balance
              tools and class materials discuss general financial planning concepts. They do not
              recommend specific securities, funds, or investment products.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Past performance, estimates, and guideline-based outputs do not guarantee future results.
              Your personal situation may differ materially from examples shown on this site.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Commission &amp; Compensation Disclosure</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              When you purchase insurance through a licensed agent associated with this practice,
              compensation may be received in the form of commissions from the carrier. Commissions do
              not increase your premium — carriers pay the same rates whether you buy direct or
              through an agent.
            </p>
            <p className="text-gray-700 leading-relaxed">
              In compliance with FTC guidelines, we disclose that financial relationships with
              carriers may exist. Recommendations in educational materials are based on coverage
              quality and suitability — not commission amounts alone.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">AI &amp; Calculator Disclaimer</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Some tools may use automated analysis or AI-assisted features. Outputs are for
              informational and educational purposes only and should be verified with primary source
              documents and licensed professionals.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Do not rely solely on automated tools for insurance or investment decisions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Class Registration &amp; CRM</h2>
            <p className="text-gray-700 leading-relaxed">
              Class sign-ups and contact forms are processed through JanaGana CRM. Registration data
              is used to manage events, send class details (including Zoom links), and follow up on
              your inquiries. See our Privacy Policy for data handling practices.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">State Availability</h2>
            <p className="text-gray-700 leading-relaxed">
              Insurance products and licensing vary by state. Not all carriers or products are
              available in all jurisdictions. Quotes and recommendations are estimates subject to
              carrier underwriting and approval.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
