import { getServerSession } from "next-auth/next"
import { Tooltip } from "@/components/ui/tooltip"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, BarChart3, Shield, ArrowRight } from "lucide-react"
import Image from "next/image"
import { Header } from "@/components/header"

export default async function QuoteResultsPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions as any) as { user?: any }
  
  if (!session?.user) {
    redirect("/auth/signin?callbackUrl=/compare/results/" + params.id)
  }

  // Fetch quote intake
  const quoteIntake = await prisma.quoteIntake.findUnique({
    where: { id: params.id },
    include: {
      lead: {
        include: {
          user: {
            include: {
              profile: true,
            },
          },
        },
      },
    },
  })

  if (!quoteIntake) {
    redirect("/compare/new")
  }

  // Check if user owns this quote
  if (quoteIntake.lead.userId !== session.user.id) {
    redirect("/compare/new")
  }

  const formData = quoteIntake.json as any
  const firstName = formData.firstName || session.user.email?.split("@")[0]

  // Fetch quotes for this user and quote intake
  const quotes = await prisma.comparisonQuote.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      carrier: true,
    },
    orderBy: { premium: "asc" },
  })

  const currentPremium = formData?.currentPremium ? parseFloat(formData.currentPremium) : undefined
  const bestQuote = quotes.length > 0 ? quotes[0] : null
  const savings = bestQuote && currentPremium ? Math.max(0, currentPremium - bestQuote.premium) : null

  // Sorting/filtering logic
  const sortOptions = [
    { value: "price", label: "Lowest Price" },
    { value: "rating", label: "Best Rating" },
    { value: "coverage", label: "Best Coverage" },
  ]
  const sortedQuotes = [...quotes]
  // Default sort: price
  sortedQuotes.sort((a, b) => a.premium - b.premium)

  // Commission disclosure helper
  function getCommissionDisclosure(quote: any) {
    if (quote.referralFee) {
      const pct = ((quote.referralFee / quote.premium) * 100).toFixed(1)
      return `We may receive a commission of $${quote.referralFee} (${pct}%) if you purchase this policy.`
    }
    return "No commission received for this quote."
  }

  // Coverage gap warning helper
  function getCoverageGapWarning(quote: any) {
    if (formData.coverageLevel === "MINIMUM") {
      return "Warning: Minimum coverage may leave you exposed to large out-of-pocket costs."
    }
    if (formData.coverageLevel === "RECOMMENDED" && currentPremium !== undefined && quote.premium < currentPremium) {
      return "Recommended coverage. You are saving compared to your current premium!"
    }
    if (formData.coverageLevel === "MAXIMUM") {
      return "Maximum protection."
    }
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Header />
      <div className="container max-w-4xl mx-auto px-4 py-12">
        {/* If quotes exist, show them. Otherwise, show 'in progress' UI */}
        {quotes.length > 0 ? (
          <>
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-4">
                <BarChart3 className="h-10 w-10 text-blue-600" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Your Quotes Are Ready!
              </h1>
              <p className="text-xl text-gray-600">
                Hi {firstName}, here are your personalized quotes from top carriers.
              </p>
              {savings !== null && (
                <div className="mt-4 text-green-700 font-semibold text-lg">
                  You could save <span className="bg-green-100 px-2 py-1 rounded">${savings.toLocaleString()}</span> per year!
                </div>
              )}
            </div>
            {/* Sorting/filtering UI */}
            <div className="mb-6 flex gap-4 items-center">
              <span className="font-semibold">Sort by:</span>
              {sortOptions.map((opt) => (
                <Button key={opt.value} variant="outline" size="sm" className="px-3 py-1">
                  {opt.label}
                </Button>
              ))}
            </div>
            <div className="grid gap-8 md:grid-cols-2">
              {sortedQuotes.map((quote) => (
                <Card key={quote.id} className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Image src={quote.carrier.logo || "/logo-placeholder.png"} alt={quote.carrier.name} width={32} height={32} className="h-8 w-8 rounded-full border" />
                      {quote.carrier.name}
                      <Badge className="ml-2">{formData.coverageType}</Badge>
                    </CardTitle>
                    <CardDescription>
                      {quote.carrier.website && (
                        <Link href={quote.carrier.website} target="_blank" className="text-blue-600 underline">Visit Carrier</Link>
                      )}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <span className="text-3xl font-bold text-blue-700">${quote.premium.toLocaleString()}</span>
                      <span className="ml-2 text-gray-500">/year</span>
                      <span className="ml-4 text-green-600 font-semibold">{quote.status === "ACTIVE" ? "Active" : quote.status}</span>
                    </div>
                    <div className="mb-2 flex items-center gap-2">
                      <strong>Coverage:</strong> {formData.coverageLevel}
                      <Tooltip content={
                        formData.coverageLevel === "MINIMUM"
                          ? "Minimum coverage meets state law but may leave you exposed to large costs."
                          : formData.coverageLevel === "RECOMMENDED"
                          ? "Recommended coverage balances cost and protection for most people."
                          : "Maximum coverage gives the highest limits and lowest deductibles."
                      }>
                        <span className="text-blue-500 underline cursor-pointer text-xs">What does this mean?</span>
                      </Tooltip>
                    </div>
                    {/* Commission disclosure */}
                    <div className="mb-2 text-xs text-gray-500 italic flex items-center gap-2">
                      {getCommissionDisclosure(quote)}
                      <Tooltip content="A commission is a fee paid by the insurance carrier to us if you purchase a policy. This does NOT increase your price.">
                        <span className="text-blue-500 underline cursor-pointer">What does this mean?</span>
                      </Tooltip>
                    </div>
                    {/* Coverage gap warning */}
                    {getCoverageGapWarning(quote) && (
                      <Alert className="mb-2 border-yellow-200 bg-yellow-50 text-yellow-800">
                        <AlertDescription>
                          {getCoverageGapWarning(quote)}{' '}
                          <Tooltip content="A coverage gap means you may have to pay out-of-pocket for damages or injuries not covered by your policy.">
                            <span className="text-blue-500 underline cursor-pointer">What does this mean?</span>
                          </Tooltip>
                        </AlertDescription>
                      </Alert>
                    )}
                    {quote.deductibles && (
                      <div className="mb-2">
                        <strong>Deductibles:</strong> {typeof quote.deductibles === "object" ? JSON.stringify(quote.deductibles) : String(quote.deductibles)}
                      </div>
                    )}
                    {quote.pros && quote.pros.length > 0 && (
                      <div className="mb-2">
                        <strong>Pros:</strong>
                        <ul className="list-disc ml-6 text-green-700">
                          {quote.pros.map((p: string, idx: number) => (
                            <li key={idx}>{p}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {quote.cons && quote.cons.length > 0 && (
                      <div className="mb-2">
                        <strong>Cons:</strong>
                        <ul className="list-disc ml-6 text-red-700">
                          {quote.cons.map((c: string, idx: number) => (
                            <li key={idx}>{c}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {quote.affiliateLink && (
                      <div className="mt-4">
                        <Button asChild className="w-full">
                          <Link href={quote.affiliateLink} target="_blank">
                            Get This Quote
                          </Link>
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="mt-12 text-center">
              <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-0">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-4">Need Help Deciding?</h3>
                  <p className="mb-6 text-blue-100">
                    Learn how insurance works and discover tips to save even more money
                  </p>
                  <div className="flex gap-4 justify-center flex-wrap">
                    <Button variant="secondary" asChild>
                      <Link href="/learn">
                        Learn About Insurance
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="outline" className="bg-white/10 border-white text-white hover:bg-white/20" asChild>
                      <Link href="/">
                        Return to Home
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        ) : (
          <>
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Great! We're Preparing Your Quotes
              </h1>
              <p className="text-xl text-gray-600">
                Hi {firstName}, we're analyzing rates from 15+ carriers to find you the best deal
              </p>
            </div>
            {/* Status Timeline, Next Steps, Info Summary, Guarantee, etc. can be added here as needed */}
          </>
        )}
        {/* Guarantee */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-6 py-3 rounded-full">
            <Shield className="h-4 w-4 text-green-600" />
            <span>
              <strong>Our Guarantee:</strong> No spam calls. Your data is encrypted. Cancel anytime.
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
