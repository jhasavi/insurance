export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-20">
        <h1 className="text-4xl font-bold mb-8">How It Works</h1>
        
        <div className="max-w-4xl space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Simple, Fast, Transparent</h2>
            <p className="text-gray-600 leading-relaxed">
              Namaste Insurance makes comparing insurance quotes easier than ever. No spam calls, 
              no hidden fees, just honest comparisons from 15+ carriers.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Step 1: Tell Us About Yourself</h2>
            <p className="text-gray-600 leading-relaxed">
              Answer a few quick questions about your vehicle, home, or current policy. 
              Takes less than 2 minutes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Step 2: Get Real Quotes</h2>
            <p className="text-gray-600 leading-relaxed">
              We instantly compare rates from 15+ carriers including GEICO, Progressive, State Farm, 
              and more. You'll see exact prices—no estimates.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Step 3: Choose & Save</h2>
            <p className="text-gray-600 leading-relaxed">
              Pick the best coverage at the lowest price. Purchase directly with the carrier. 
              We'll show you exactly what commission we earn—100% transparent.
            </p>
          </section>

          <section className="bg-blue-50 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Why We're Different</h2>
            <ul className="space-y-3 text-gray-700">
              <li>✓ <strong>No Spam:</strong> We never sell your phone number</li>
              <li>✓ <strong>Commission Transparency:</strong> We disclose exactly what we earn</li>
              <li>✓ <strong>AI-Powered:</strong> Our technology finds savings humans might miss</li>
              <li>✓ <strong>Free Forever:</strong> No fees to compare quotes</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
