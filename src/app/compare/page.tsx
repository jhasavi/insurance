"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, CheckCircle, Star, TrendingDown, ExternalLink, Filter } from "lucide-react"

// Mock data for demonstration - in production, this comes from API
const mockQuotes = [
  {
    id: "1",
    carrier: {
      name: "Clearcover",
      slug: "clearcover",
      rating: 4.5,
      financialStrength: "A",
    },
    premium: 1248,
    monthlyPremium: 104,
    coverage: {
      bodilyInjury: "100/300",
      propertyDamage: "100",
      collision: "Included",
      comprehensive: "Included",
    },
    deductibles: {
      collision: 500,
      comprehensive: 500,
    },
    discounts: ["Good Driver", "Multi-Policy", "Paperless"],
    pros: ["Lowest price", "Digital-first experience", "Fast claims"],
    cons: ["Limited agent support", "Newer company"],
    affiliateLink: "https://clearcover.com",
    referralFee: 125,
  },
  {
    id: "2",
    carrier: {
      name: "GEICO",
      slug: "geico",
      rating: 4.3,
      financialStrength: "A++",
    },
    premium: 1389,
    monthlyPremium: 116,
    coverage: {
      bodilyInjury: "100/300",
      propertyDamage: "100",
      collision: "Included",
      comprehensive: "Included",
    },
    deductibles: {
      collision: 500,
      comprehensive: 500,
    },
    discounts: ["Good Driver", "Multi-Policy", "Federal Employee"],
    pros: ["Strong financial rating", "24/7 support", "Nationwide coverage"],
    cons: ["Not the cheapest", "Limited local agents"],
    affiliateLink: "https://geico.com",
    referralFee: 139,
  },
  {
    id: "3",
    carrier: {
      name: "Progressive",
      slug: "progressive",
      rating: 4.2,
      financialStrength: "A+",
    },
    premium: 1425,
    monthlyPremium: 119,
    coverage: {
      bodilyInjury: "100/300",
      propertyDamage: "100",
      collision: "Included",
      comprehensive: "Included",
      roadside: "Included",
    },
    deductibles: {
      collision: 500,
      comprehensive: 500,
    },
    discounts: ["Good Driver", "Snapshot", "Multi-Policy"],
    pros: ["Name Your Price tool", "Roadside assistance", "Good mobile app"],
    cons: ["Mid-range pricing"],
    affiliateLink: "https://progressive.com",
    referralFee: 143,
  },
  {
    id: "4",
    carrier: {
      name: "Liberty Mutual",
      slug: "liberty-mutual",
      rating: 4.0,
      financialStrength: "A",
    },
    premium: 1567,
    monthlyPremium: 131,
    coverage: {
      bodilyInjury: "100/300",
      propertyDamage: "100",
      collision: "Included",
      comprehensive: "Included",
      roadside: "Included",
      rental: "Included",
    },
    deductibles: {
      collision: 500,
      comprehensive: 500,
    },
    discounts: ["Good Driver", "Multi-Policy", "Bundling"],
    pros: ["Local agent support", "Comprehensive coverage", "Strong bundling discounts"],
    cons: ["Higher price point", "Complex discount structure"],
    affiliateLink: "https://libertymutual.com",
    referralFee: 157,
  },
  {
    id: "5",
    carrier: {
      name: "State Farm",
      slug: "state-farm",
      rating: 4.1,
      financialStrength: "A++",
    },
    premium: 1623,
    monthlyPremium: 135,
    coverage: {
      bodilyInjury: "100/300",
      propertyDamage: "100",
      collision: "Included",
      comprehensive: "Included",
      roadside: "Included",
    },
    deductibles: {
      collision: 500,
      comprehensive: 500,
    },
    discounts: ["Good Driver", "Multi-Policy", "Drive Safe & Save"],
    pros: ["Largest agent network", "Excellent customer service", "Strong reputation"],
    cons: ["Premium pricing", "Agent fees may apply"],
    affiliateLink: "https://statefarm.com",
    referralFee: 162,
  },
]

export default function ComparePage() {
  const [sortBy, setSortBy] = useState<"price" | "rating">("price")
  const [showDisclosures, setShowDisclosures] = useState(false)
  const [quotes, setQuotes] = useState(mockQuotes)

  useEffect(() => {
    const sorted = [...mockQuotes].sort((a, b) => {
      if (sortBy === "price") {
        return a.premium - b.premium
      } else {
        return b.carrier.rating - a.carrier.rating
      }
    })
    setQuotes(sorted)
  }, [sortBy])

  const lowestPremium = Math.min(...quotes.map((q) => q.premium))
  const averagePremium = quotes.reduce((sum, q) => sum + q.premium, 0) / quotes.length

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-blue-600 mr-2" />
              <span className="text-2xl font-bold text-gray-900">Compare Quotes</span>
            </div>
            <Button variant="outline" asChild>
              <Link href="/">← Back to Home</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Summary Banner */}
        <Card className="mb-8 bg-gradient-to-r from-green-50 to-blue-50">
          <CardContent className="py-6">
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <p className="text-sm text-gray-600 mb-1">Lowest Quote</p>
                <p className="text-3xl font-bold text-green-600">${lowestPremium}</p>
                <p className="text-xs text-gray-500">per year</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Average Quote</p>
                <p className="text-3xl font-bold text-blue-600">${averagePremium.toFixed(0)}</p>
                <p className="text-xs text-gray-500">per year</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Potential Savings</p>
                <p className="text-3xl font-bold text-orange-600 flex items-center justify-center gap-1">
                  <TrendingDown className="h-6 w-6" />
                  ${(mockQuotes[4].premium - lowestPremium).toFixed(0)}
                </p>
                <p className="text-xs text-gray-500">vs highest quote</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Controls */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Filter className="h-5 w-5 text-gray-500" />
            <span className="text-sm text-gray-600">Sort by:</span>
            <Button
              variant={sortBy === "price" ? "default" : "outline"}
              size="sm"
              onClick={() => setSortBy("price")}
            >
              Lowest Price
            </Button>
            <Button
              variant={sortBy === "rating" ? "default" : "outline"}
              size="sm"
              onClick={() => setSortBy("rating")}
            >
              Highest Rated
            </Button>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowDisclosures(!showDisclosures)}
          >
            {showDisclosures ? "Hide" : "Show"} Commissions
          </Button>
        </div>

        {/* Transparency Notice */}
        <Card className="mb-6 border-blue-200 bg-blue-50">
          <CardContent className="py-4">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <p className="font-semibold text-blue-900 mb-1">No Spam Guarantee</p>
                <p className="text-sm text-blue-700">
                  Browse quotes anonymously. We only contact you if you request it. 
                  We don't sell your information to third parties. All commissions are disclosed transparently.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quote Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quotes.map((quote, index) => (
            <Card 
              key={quote.id} 
              className={`relative ${index === 0 ? 'ring-2 ring-green-500' : ''}`}
            >
              {index === 0 && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-green-600">Best Value</Badge>
                </div>
              )}
              
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <CardTitle className="text-xl">{quote.carrier.name}</CardTitle>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <span className="text-sm font-semibold">{quote.carrier.rating}</span>
                  </div>
                </div>
                <CardDescription className="flex items-center gap-2">
                  <Badge variant="outline">{quote.carrier.financialStrength}</Badge>
                  <span className="text-xs text-gray-500">Financial Strength</span>
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Price */}
                <div className="text-center py-4 bg-gray-50 rounded-lg">
                  <p className="text-3xl font-bold text-gray-900">${quote.premium}</p>
                  <p className="text-sm text-gray-600">per year</p>
                  <p className="text-xs text-gray-500 mt-1">
                    (${quote.monthlyPremium}/month)
                  </p>
                  {quote.premium === lowestPremium && (
                    <Badge className="mt-2 bg-green-600">Lowest Price</Badge>
                  )}
                </div>

                {/* Coverage Highlights */}
                <div>
                  <p className="text-sm font-semibold mb-2">Coverage</p>
                  <ul className="space-y-1">
                    {Object.entries(quote.coverage).slice(0, 3).map(([key, value]) => (
                      <li key={key} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">
                          {key.replace(/([A-Z])/g, ' $1').trim()}: {value}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Discounts */}
                <div>
                  <p className="text-sm font-semibold mb-2">Applied Discounts</p>
                  <div className="flex flex-wrap gap-1">
                    {quote.discounts.map((discount) => (
                      <Badge key={discount} variant="secondary" className="text-xs">
                        {discount}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Pros/Cons */}
                <div className="space-y-2">
                  <div>
                    <p className="text-xs font-semibold text-green-700 mb-1">Pros</p>
                    <ul className="space-y-1">
                      {quote.pros.slice(0, 2).map((pro, i) => (
                        <li key={i} className="text-xs text-gray-600">• {pro}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-red-700 mb-1">Cons</p>
                    <ul className="space-y-1">
                      {quote.cons.slice(0, 2).map((con, i) => (
                        <li key={i} className="text-xs text-gray-600">• {con}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Commission Disclosure */}
                {showDisclosures && (
                  <div className="pt-3 border-t border-gray-200">
                    <p className="text-xs text-gray-500">
                      💰 Referral commission: ${quote.referralFee} if you purchase through our link
                    </p>
                  </div>
                )}
              </CardContent>

              <CardFooter className="flex gap-2">
                <Button className="flex-1" asChild>
                  <a href={quote.affiliateLink} target="_blank" rel="noopener noreferrer">
                    Get Quote <ExternalLink className="h-4 w-4 ml-1" />
                  </a>
                </Button>
                <Button variant="outline" asChild>
                  <a href={`/compare/${quote.id}`}>Details</a>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* FAQ / Additional Info */}
        <div className="mt-12 grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">How This Works</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-gray-600">
              <p>
                <strong>1. Compare:</strong> Review real quotes from multiple carriers side-by-side.
              </p>
              <p>
                <strong>2. Choose:</strong> Select the carrier that offers the best value for your needs.
              </p>
              <p>
                <strong>3. Purchase:</strong> Click "Get Quote" to complete your purchase directly with the carrier.
              </p>
              <p className="text-xs text-gray-500 mt-4">
                * Quotes are estimates based on the information provided. Final rates may vary.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Why Trust Us?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-gray-600">
              <div className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <p><strong>Transparent:</strong> We disclose all commissions upfront.</p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <p><strong>Privacy-First:</strong> No spam calls or data selling.</p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <p><strong>Unbiased:</strong> We show all carriers, not just high-commission ones.</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CTA */}
        <Card className="mt-12 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Want Expert Advice?</h3>
            <p className="mb-6">
              Get a comprehensive policy review from our AI + human experts for just $20 
              (refunded if you purchase a recommended policy).
            </p>
            <Button size="lg" variant="secondary" asChild>
              <a href="/scan">Scan Your Current Policy</a>
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
