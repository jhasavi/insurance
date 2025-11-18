export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-20">
        <h1 className="text-4xl font-bold mb-8">About Namaste Insurance</h1>
        
        <div className="max-w-4xl space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
            <p className="text-gray-600 leading-relaxed">
              We believe insurance shopping should be transparent, fast, and spam-free. 
              Namaste Insurance was founded in Boston to bring honesty back to the insurance marketplace.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">What We Do</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              We're a technology platform that connects consumers with licensed insurance carriers. 
              We compare quotes from 15+ carriers and use AI to identify savings opportunities.
            </p>
            <p className="text-gray-600 leading-relaxed">
              <strong>Important:</strong> We are not an insurance company. We do not underwrite, 
              sell, or service insurance policies. All insurance products are offered by licensed 
              carriers who are solely responsible for policy terms and coverage.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Our Values</h2>
            <ul className="space-y-3 text-gray-700">
              <li>🙏 <strong>Transparency:</strong> We disclose our commissions on every quote</li>
              <li>🔒 <strong>Privacy:</strong> We never sell your personal information</li>
              <li>🤖 <strong>Innovation:</strong> We use AI to find savings humans might miss</li>
              <li>💙 <strong>Customer First:</strong> Your savings matter more than our commissions</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Serving Massachusetts</h2>
            <p className="text-gray-600 leading-relaxed">
              We're licensed to serve Massachusetts, New Hampshire, and Rhode Island. 
              Our team is based in Boston and committed to helping New England families save money.
            </p>
          </section>

          <section className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
            <div className="space-y-2 text-gray-700">
              <p>📧 Email: hello@namasteinsurance.com</p>
              <p>📞 Phone: (617) 555-0100</p>
              <p>📍 Location: Boston, MA</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
