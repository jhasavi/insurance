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
            Life Insurance Guidance Built For Your Family And Clients
          </h1>
          <p className="text-xl text-gray-600 mb-4">
            Build clear life insurance recommendations in minutes with strategy support, carrier matching, and client-ready one-pagers.
          </p>
          <p className="text-3xl font-bold text-green-600 mb-8">
            Built by Sanjeev Jha • Trusted local guidance for Massachusetts families
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button size="lg" asChild className="bg-green-600 hover:bg-green-700 text-white">
              <Link href="/life-insurance">
                <CheckCircle className="mr-2 h-5 w-5" />
                Start Life Insurance Recommendation
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/scan">
                <Upload className="mr-2 h-5 w-5" />
                Scan Your Policy
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/compare">
                <BarChart3 className="mr-2 h-5 w-5" />
                Compare Auto or Home (Internal Beta)
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Local Trust Bar */}
      <section className="py-4 bg-white border-b">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-gray-700">Authored by <strong>Sanjeev Jha</strong> • Namaste Boston Homes — Local expertise for Massachusetts homeowners</div>
          <div className="flex items-center gap-3">
            <Link href="/life-insurance" className="text-sm text-blue-600 hover:underline">Try Life Insurance Tool</Link>
            <Link href="/agent-one-pager" className="text-sm text-gray-600 hover:underline">Agent One-Pager</Link>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-12 border-y bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">3</div>
              <div className="text-sm text-gray-600">Step Life Recommendation Flow</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-600 mb-2">10+1</div>
              <div className="text-sm text-gray-600">DIME Inputs + Goal Strategy</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-600 mb-2">Advisor</div>
              <div className="text-sm text-gray-600">Knowledge Assist Included</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-orange-600 mb-2">PDF</div>
              <div className="text-sm text-gray-600">Client-Ready Strategy Guide</div>
            </div>
          </div>
        </div>
      </section>

      {/* Real Money-Saving Examples */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Real Life Planning Scenarios</h2>
            <p className="text-xl text-gray-600">
              Use these examples to turn uncertainty into clear life insurance recommendations
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* Use Case 1 */}
            <Card className="border-2 hover:border-blue-400 transition-all">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary">Young Family Protection</Badge>
                  <TrendingDown className="h-5 w-5 text-green-600" />
                </div>
                <CardTitle className="text-lg">Arjun & Priya, Age 34</CardTitle>
                <CardDescription>Boston, MA • 1 child • New mortgage</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Coverage Gap:</span>
                    <span className="text-lg font-semibold text-red-500">$0 in-force life</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Recommended:</span>
                    <span className="text-lg font-semibold text-green-600">$1,250,000 Term</span>
                  </div>
                  <div className="pt-3 border-t">
                    <div className="text-2xl font-bold text-green-600 mb-2">20-year strategy</div>
                    <Badge className="bg-green-100 text-green-700">Income + Mortgage protected</Badge>
                  </div>
                  <div className="text-xs text-gray-600 pt-2">
                    ✓ DIME method created transparent target coverage
                    <br />✓ Carrier shortlist generated automatically
                    <br />✓ Client-ready one-pager prepared in minutes
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Use Case 2 */}
            <Card className="border-2 hover:border-blue-400 transition-all">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary">Business Owner Case</Badge>
                  <TrendingDown className="h-5 w-5 text-green-600" />
                </div>
                <CardTitle className="text-lg">Neha, Age 42</CardTitle>
                <CardDescription>Lexington, MA • 2 children • High income</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Primary Goal:</span>
                    <span className="text-lg font-semibold text-gray-900">Wealth Accumulation</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Recommended:</span>
                    <span className="text-lg font-semibold text-green-600">IUL Strategy</span>
                  </div>
                  <div className="pt-3 border-t">
                    <div className="text-2xl font-bold text-green-600 mb-2">Tax-aware design</div>
                    <Badge className="bg-green-100 text-green-700">Living benefits enabled</Badge>
                  </div>
                  <div className="text-xs text-gray-600 pt-2">
                    ✓ Advisor talking points included automatically
                    <br />✓ Objection handling prompts included
                    <br />✓ Strategy guide exported for client review
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Use Case 3 */}
            <Card className="border-2 hover:border-blue-400 transition-all">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary">Legacy Planning</Badge>
                  <Shield className="h-5 w-5 text-blue-600" />
                </div>
                <CardTitle className="text-lg">S. Family Trust, Age 55</CardTitle>
                <CardDescription>Cambridge, MA • Estate transfer goals</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Estate Goal:</span>
                    <span className="text-lg font-semibold">Liquidity + Legacy</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Recommended:</span>
                    <span className="text-lg font-semibold text-blue-600">Whole Life + Rider Review</span>
                  </div>
                  <div className="pt-3 border-t">
                    <div className="text-2xl font-bold text-blue-600 mb-2">Structured succession</div>
                    <Badge className="bg-blue-100 text-blue-700">Long-term certainty</Badge>
                  </div>
                  <div className="text-xs text-gray-600 pt-2">
                    ✓ Permanent policy comparison surfaced
                    <br />✓ Underwriting snapshot shared up front
                    <br />✓ Compliance-safe summary included
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
          <h2 className="text-4xl font-bold mb-4">Ready To Grow Your Life Insurance Business?</h2>
          <p className="text-xl mb-2 text-blue-100">
            Get recommendation logic, advisor prompts, and client-ready outputs in one workflow
          </p>
          <p className="text-sm mb-8 text-blue-200">
            ✓ DIME-based coverage logic ✓ Carrier mapping ✓ Strategy guide export
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100" asChild>
              <Link href="/life-insurance">
                Start Life Recommendation
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-blue-600" asChild>
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
