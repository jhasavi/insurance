export default function CarriersPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-20">
        <h1 className="text-4xl font-bold mb-8">Our Insurance Carriers</h1>
        
        <div className="max-w-4xl space-y-8">
          <section>
            <p className="text-xl text-gray-600 leading-relaxed mb-8">
              We partner with 15+ trusted insurance carriers to bring you the best rates. 
              Compare quotes from national brands and digital-first insurers all in one place.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-6">Featured Carriers</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                { name: "GEICO", desc: "Government Employees Insurance Company - known for great rates" },
                { name: "Progressive", desc: "Name Your Price® tool and competitive rates" },
                { name: "State Farm", desc: "America's largest insurer with local agents nationwide" },
                { name: "Lemonade", desc: "Digital-first insurer with instant claims via AI" },
                { name: "Clearcover", desc: "Tech-forward auto insurance with low overhead" },
                { name: "Liberty Mutual", desc: "Customizable coverage with numerous discounts" },
                { name: "Allstate", desc: "You're in good hands with comprehensive coverage" },
                { name: "USAA", desc: "Exclusive to military members and families" }
              ].map((carrier) => (
                <div key={carrier.name} className="border rounded-lg p-6 hover:border-blue-400 transition-colors">
                  <h3 className="text-xl font-bold mb-2">{carrier.name}</h3>
                  <p className="text-gray-600 text-sm">{carrier.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-blue-50 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Why These Carriers?</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We carefully select carriers based on:
            </p>
            <ul className="space-y-2 text-gray-700">
              <li>✓ Financial strength ratings (A.M. Best A- or higher)</li>
              <li>✓ Customer satisfaction scores</li>
              <li>✓ Competitive pricing</li>
              <li>✓ Claims handling reputation</li>
              <li>✓ Digital experience quality</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">More Carriers Coming Soon</h2>
            <p className="text-gray-600 leading-relaxed">
              We're constantly adding new carrier partnerships to give you even more choice. 
              Check back regularly to see our latest options.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
