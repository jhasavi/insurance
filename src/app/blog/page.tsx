export default function BlogPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-20">
        <h1 className="text-4xl font-bold mb-8">Insurance Blog</h1>
        
        <div className="max-w-4xl">
          <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
            <div className="text-6xl mb-4">📝</div>
            <h2 className="text-2xl font-semibold mb-4">Blog Coming Soon</h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              We're working on helpful articles about insurance savings, coverage tips, 
              and industry insights. Check back soon!
            </p>
            <p className="text-sm text-gray-500">
              In the meantime, feel free to{" "}
              <a href="/compare" className="text-blue-600 hover:underline">
                compare quotes
              </a>{" "}
              or{" "}
              <a href="/scan" className="text-blue-600 hover:underline">
                scan your policy
              </a>
              .
            </p>
          </div>

          <div className="mt-12">
            <h2 className="text-2xl font-semibold mb-6">Upcoming Topics</h2>
            <div className="space-y-4">
              {[
                "How to Save $500+ on Auto Insurance (Without Sacrificing Coverage)",
                "Understanding Your Policy: What Those Insurance Terms Really Mean",
                "5 Coverage Gaps That Could Cost You Thousands",
                "Digital-First Insurance: Are Lemonade and Clearcover Worth It?",
                "Bundle and Save: The Truth About Multi-Policy Discounts"
              ].map((topic, i) => (
                <div key={i} className="border-l-4 border-blue-600 pl-4 py-2">
                  <p className="text-gray-700">{topic}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
