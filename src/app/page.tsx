import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Brain, CheckCircle, TrendingDown, Upload, BarChart3 } from "lucide-react"
// ...existing code...

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-20">
        <div className="container mx-auto px-4 text-center max-w-5xl">
          <Badge className="mb-4 bg-blue-600">🚀 15+ Insurance Carriers</Badge>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Compare Insurance in Minutes,<br />Not Days
          </h1>
          <p className="text-xl text-gray-600 mb-4">
            Real quotes. No spam. AI-powered insights.
          </p>
          <p className="text-3xl font-bold text-green-600 mb-8">
            Save an average of $847/year
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button size="lg" asChild className="bg-blue-600 hover:bg-blue-700">
              <Link href="/compare">
                <BarChart3 className="mr-2 h-5 w-5" />
                Compare Quotes
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/scan">
                <Upload className="mr-2 h-5 w-5" />
                Scan Your Policy
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-12 border-y bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">15+</div>
              <div className="text-sm text-gray-600">Insurance Carriers</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-600 mb-2">$847</div>
              <div className="text-sm text-gray-600">Average Savings/Year</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-600 mb-2">95%+</div>
              <div className="text-sm text-gray-600">AI Accuracy Rate</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-orange-600 mb-2">4.8★</div>
              <div className="text-sm text-gray-600">User Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Real Money-Saving Examples */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Real People, Real Savings</h2>
            <p className="text-xl text-gray-600">
              See how much our users saved by comparing quotes
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* Use Case 1 */}
            <Card className="border-2 hover:border-blue-400 transition-all">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary">Auto Insurance</Badge>
                  <TrendingDown className="h-5 w-5 text-green-600" />
                </div>
                <CardTitle className="text-lg">Sarah M., Age 32</CardTitle>
                <CardDescription>Boston, MA • 2019 Honda Civic</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Before:</span>
                    <span className="text-lg font-semibold line-through text-gray-400">$2,400/year</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">After:</span>
                    <span className="text-lg font-semibold text-green-600">$1,450/year</span>
                  </div>
                  <div className="pt-3 border-t">
                    <div className="text-2xl font-bold text-green-600 mb-2">$950 saved</div>
                    <Badge className="bg-green-100 text-green-700">39% savings</Badge>
                  </div>
                  <div className="text-xs text-gray-600 pt-2">
                    ✓ Switched to Clearcover (digital-first carrier)
                    <br />✓ Increased deductible to $500
                    <br />✓ Removed unnecessary rental coverage
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Use Case 2 */}
            <Card className="border-2 hover:border-blue-400 transition-all">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary">Bundle</Badge>
                  <TrendingDown className="h-5 w-5 text-green-600" />
                </div>
                <CardTitle className="text-lg">Martinez Family</CardTitle>
                <CardDescription>Worcester, MA • Home + 2 Cars</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Before:</span>
                    <span className="text-lg font-semibold line-through text-gray-400">$3,000/year</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">After:</span>
                    <span className="text-lg font-semibold text-green-600">$2,400/year</span>
                  </div>
                  <div className="pt-3 border-t">
                    <div className="text-2xl font-bold text-green-600 mb-2">$600 saved</div>
                    <Badge className="bg-green-100 text-green-700">20% savings</Badge>
                  </div>
                  <div className="text-xs text-gray-600 pt-2">
                    ✓ Bundled auto + home with Progressive
                    <br />✓ Multi-policy discount applied
                    <br />✓ Same great coverage, lower price
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Use Case 3 */}
            <Card className="border-2 hover:border-blue-400 transition-all">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary">Coverage Gap</Badge>
                  <Shield className="h-5 w-5 text-blue-600" />
                </div>
                <CardTitle className="text-lg">Mike T., Age 45</CardTitle>
                <CardDescription>Cambridge, MA • $800K Home</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Liability Limit:</span>
                    <span className="text-lg font-semibold text-red-600">$100K only</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Home Equity:</span>
                    <span className="text-lg font-semibold">$800K</span>
                  </div>
                  <div className="pt-3 border-t">
                    <div className="text-2xl font-bold text-blue-600 mb-2">$1M protected</div>
                    <Badge className="bg-blue-100 text-blue-700">For $200/year</Badge>
                  </div>
                  <div className="text-xs text-gray-600 pt-2">
                    ✓ AI detected massive coverage gap
                    <br />✓ Added $1M umbrella policy
                    <br />✓ Protected net worth from lawsuits
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works with AI Transparency */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-gray-600">
              Simple, fast, and powered by cutting-edge AI
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Upload className="h-8 w-8 text-blue-600" />
              </div>
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mx-auto -mt-8 mb-4 text-sm font-bold">1</div>
              <h3 className="text-xl font-semibold mb-2">Upload Your Policy</h3>
              <p className="text-gray-600 text-sm">
                AI scans your current policy in seconds using GPT-4 Vision. Extracts coverage details with 95%+ accuracy.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="h-8 w-8 text-green-600" />
              </div>
              <div className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center mx-auto -mt-8 mb-4 text-sm font-bold">2</div>
              <h3 className="text-xl font-semibold mb-2">Compare Real Quotes</h3>
              <p className="text-gray-600 text-sm">
                See rates from 15+ carriers instantly. We show exact commission rates—100% transparent.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-purple-600" />
              </div>
              <div className="bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center mx-auto -mt-8 mb-4 text-sm font-bold">3</div>
              <h3 className="text-xl font-semibold mb-2">Save Money</h3>
              <p className="text-gray-600 text-sm">
                Choose the best coverage at the lowest price. Purchase directly with the carrier—no middleman markup.
              </p>
            </div>
          </div>

          {/* AI Transparency Card */}
          <Card className="border-2 border-blue-200 bg-blue-50 max-w-3xl mx-auto">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Brain className="h-8 w-8 text-blue-600" />
                <div>
                  <CardTitle className="text-xl">AI-Powered Analysis You Can Trust</CardTitle>
                  <CardDescription>Here's exactly how our AI works</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong>GPT-4 Vision API:</strong> Extracts coverage details, deductibles, and premiums from your policy documents with 95%+ accuracy
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong>Benchmark Database:</strong> Compares against 10,000+ policies in our database to identify overcharges and gaps
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong>Risk Profile Matching:</strong> Analyzes your specific situation (location, vehicle, home value) for personalized recommendations
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong>Human Review:</strong> All AI insights reviewed by licensed insurance professionals before presentation
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-blue-200">
                <p className="text-xs text-gray-600">
                  <strong>Confidence Scores:</strong> Every recommendation includes a confidence score (0-100%). 
                  We show our work and cite data sources so you can make informed decisions.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Featured Carriers */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Trusted Insurance Carriers</h2>
          <p className="text-gray-600 mb-8">Compare quotes from industry-leading providers</p>
          <div className="flex flex-wrap justify-center items-center gap-8 max-w-5xl mx-auto text-gray-400">
            <div className="text-2xl font-bold">GEICO</div>
            <div className="text-2xl font-bold">Progressive</div>
            <div className="text-2xl font-bold">State Farm</div>
            <div className="text-2xl font-bold">Lemonade</div>
            <div className="text-2xl font-bold">Clearcover</div>
            <div className="text-2xl font-bold">Liberty Mutual</div>
            <div className="text-2xl font-bold">Allstate</div>
            <div className="text-2xl font-semibold">+ 8 more</div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-b from-blue-600 to-blue-700 text-white">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h2 className="text-4xl font-bold mb-4">Ready to Save on Insurance?</h2>
          <p className="text-xl mb-2 text-blue-100">
            Join thousands who've saved an average of $847/year
          </p>
          <p className="text-sm mb-8 text-blue-200">
            ✓ Real quotes in minutes ✓ No spam calls ✓ 100% free to compare
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              <Link href="/compare">
                Get Started - Compare Quotes
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-blue-600">
              <Link href="/scan">
                Scan My Current Policy
              </Link>
            </Button>
          </div>
          <p className="text-xs mt-6 text-blue-200">
            No credit card required • Takes less than 2 minutes
          </p>
        </div>
      </section>
    </div>
  )
}
