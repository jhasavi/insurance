"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { 
  Search, Plus, DollarSign, 
  FileText, AlertCircle, CheckCircle, Loader2
} from "lucide-react"
import { Header } from "@/components/header"

interface QuoteIntake {
  id: string
  lead: {
    id: string
    user: {
      email: string
      profile?: {
        firstName: string | null
        lastName: string | null
      }
    }
  }
  json: any
  createdAt: string
}

interface Carrier {
  id: string
  name: string
}

export default function AdminQuoteEntryPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [quoteIntake, setQuoteIntake] = useState<QuoteIntake | null>(null)
  const [carriers, setCarriers] = useState<Carrier[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  // Form state
  const [selectedCarrier, setSelectedCarrier] = useState("")
  const [annualPremium, setAnnualPremium] = useState("")
  const [deductibles, setDeductibles] = useState("")
  const [pros, setPros] = useState("")
  const [cons, setCons] = useState("")
  const [affiliateLink, setAffiliateLink] = useState("")
  const [commissionAmount, setCommissionAmount] = useState("")

  const fetchUserRole = async () => {
    try {
      const response = await fetch("/api/auth/me")
      if (response.ok) {
        const data = await response.json()
        if (data.role !== "ADMIN") {
          router.push("/")
        }
      }
    } catch (error) {
      console.error("Failed to fetch user role:", error)
      router.push("/")
    }
  }

  useEffect(() => {
    // Check if user is authenticated
    if (status === "unauthenticated") {
      router.push("/auth/signin?callbackUrl=/admin/quotes/new")
      return
    }
    
    // Check if user is admin
    if (status === "authenticated" && session?.user) {
      fetchUserRole()
    }
  }, [status, router, session, fetchUserRole])

  useEffect(() => {
    // Fetch carriers
    fetchCarriers()
  }, [])

  const fetchCarriers = async () => {
    try {
      const response = await fetch("/api/admin/carriers")
      if (response.ok) {
        const data = await response.json()
        setCarriers(data.carriers)
      }
    } catch (err) {
      console.error("Failed to fetch carriers:", err)
    }
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setError("Please enter a quote intake ID or user email")
      return
    }

    setIsSearching(true)
    setError("")
    setQuoteIntake(null)

    try {
      const response = await fetch(
        `/api/admin/quote-intake/search?q=${encodeURIComponent(searchQuery)}`
      )
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to search")
      }

      if (!data.quoteIntake) {
        setError("No quote intake found matching your search")
        return
      }

      setQuoteIntake(data.quoteIntake)
      
      // Pre-fill affiliate link if carrier has default
      if (data.quoteIntake.json?.currentCarrier) {
        const carrier = carriers.find(c => 
          c.name.toLowerCase() === data.quoteIntake.json.currentCarrier.toLowerCase()
        )
        if (carrier) {
          setSelectedCarrier(carrier.id)
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to search")
    } finally {
      setIsSearching(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!quoteIntake) return
    if (!selectedCarrier || !annualPremium) {
      setError("Carrier and annual premium are required")
      return
    }

    setIsSubmitting(true)
    setError("")

    try {
      const response = await fetch("/api/admin/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quoteIntakeId: quoteIntake.id,
          leadId: quoteIntake.lead.id,
          carrierId: selectedCarrier,
          annualPremium: parseFloat(annualPremium),
          monthlyPremium: parseFloat(annualPremium) / 12,
          deductibles,
          pros,
          cons,
          affiliateLink,
          commissionAmount: commissionAmount ? parseFloat(commissionAmount) : undefined,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to submit quote")
      }

      setSuccess(`Quote submitted successfully! ${data.emailSent ? 'Email sent to user.' : ''}`)
      
      // Reset form
      setSelectedCarrier("")
      setAnnualPremium("")
      setDeductibles("")
      setPros("")
      setCons("")
      setAffiliateLink("")
      setCommissionAmount("")
      
      // Clear search after 2 seconds
      setTimeout(() => {
        setQuoteIntake(null)
        setSearchQuery("")
        setSuccess("")
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit quote")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container max-w-5xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Quote Entry Tool
          </h1>
          <p className="text-gray-600">
            Search for a quote request and manually enter quotes from carriers
          </p>
        </div>

        {/* Search */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Find Quote Request
            </CardTitle>
            <CardDescription>
              Search by quote intake ID or user email
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Input
                placeholder="Quote ID or user email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="flex-1"
              />
              <Button onClick={handleSearch} disabled={isSearching}>
                {isSearching ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Search
                  </>
                )}
              </Button>
            </div>

            {error && !quoteIntake && (
              <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="mt-4 border-green-200 bg-green-50 text-green-800">
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Quote Intake Details */}
        {quoteIntake && (
          <>
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Quote Request Details
                  </span>
                  <Badge>{quoteIntake.json.coverageType}</Badge>
                </CardTitle>
                <CardDescription>
                  Submitted{" "}
                  {new Date(quoteIntake.createdAt).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-sm font-semibold text-gray-700">
                      Customer
                    </Label>
                    <p className="text-gray-900">
                      {quoteIntake.lead.user.profile?.firstName}{" "}
                      {quoteIntake.lead.user.profile?.lastName}
                    </p>
                    <p className="text-sm text-gray-600">
                      {quoteIntake.lead.user.email}
                    </p>
                  </div>

                  <div>
                    <Label className="text-sm font-semibold text-gray-700">
                      Coverage Level
                    </Label>
                    <p className="text-gray-900">
                      {quoteIntake.json.coverageLevel}
                    </p>
                  </div>

                  {quoteIntake.json.vehicle && (
                    <div>
                      <Label className="text-sm font-semibold text-gray-700">
                        Vehicle
                      </Label>
                      <p className="text-gray-900">
                        {quoteIntake.json.vehicle.year}{" "}
                        {quoteIntake.json.vehicle.make}{" "}
                        {quoteIntake.json.vehicle.model}
                      </p>
                      <p className="text-sm text-gray-600">
                        {quoteIntake.json.vehicle.mileage} miles/year
                      </p>
                    </div>
                  )}

                  {quoteIntake.json.property && (
                    <div>
                      <Label className="text-sm font-semibold text-gray-700">
                        Property
                      </Label>
                      <p className="text-gray-900">
                        {quoteIntake.json.property.address}
                      </p>
                      <p className="text-sm text-gray-600">
                        {quoteIntake.json.property.city},{" "}
                        {quoteIntake.json.property.state}{" "}
                        {quoteIntake.json.property.zipCode}
                      </p>
                    </div>
                  )}

                  {quoteIntake.json.currentCarrier && (
                    <div>
                      <Label className="text-sm font-semibold text-gray-700">
                        Current Carrier
                      </Label>
                      <p className="text-gray-900">
                        {quoteIntake.json.currentCarrier}
                      </p>
                      {quoteIntake.json.currentPremium && (
                        <p className="text-sm text-gray-600">
                          ${quoteIntake.json.currentPremium}/year
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Quote Entry Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Enter New Quote
                </CardTitle>
                <CardDescription>
                  Add a quote from a carrier for this customer
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="carrier">
                        Carrier <span className="text-red-500">*</span>
                      </Label>
                      <select
                        id="carrier"
                        value={selectedCarrier}
                        onChange={(e) => setSelectedCarrier(e.target.value)}
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value="">Select a carrier...</option>
                        {carriers.map((carrier) => (
                          <option key={carrier.id} value={carrier.id}>
                            {carrier.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <Label htmlFor="annual">
                        Annual Premium <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative mt-1">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                        <Input
                          id="annual"
                          type="number"
                          step="0.01"
                          min="0"
                          value={annualPremium}
                          onChange={(e) => setAnnualPremium(e.target.value)}
                          className="pl-10"
                          placeholder="0.00"
                          required
                        />
                      </div>
                      {annualPremium && (
                        <p className="text-sm text-gray-600 mt-1">
                          Monthly: $
                          {(parseFloat(annualPremium) / 12).toFixed(2)}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="deductibles">Deductibles & Coverage</Label>
                    <Textarea
                      id="deductibles"
                      value={deductibles}
                      onChange={(e) => setDeductibles(e.target.value)}
                      placeholder="E.g., $500 collision, $1000 comprehensive, 100/300/100 liability"
                      rows={2}
                      className="mt-1"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="pros">Pros</Label>
                      <Textarea
                        id="pros"
                        value={pros}
                        onChange={(e) => setPros(e.target.value)}
                        placeholder="Advantages of this quote..."
                        rows={4}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="cons">Cons</Label>
                      <Textarea
                        id="cons"
                        value={cons}
                        onChange={(e) => setCons(e.target.value)}
                        placeholder="Disadvantages or limitations..."
                        rows={4}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="affiliate">Affiliate Link</Label>
                      <Input
                        id="affiliate"
                        type="url"
                        value={affiliateLink}
                        onChange={(e) => setAffiliateLink(e.target.value)}
                        placeholder="https://..."
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="commission">Commission Amount</Label>
                      <div className="relative mt-1">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                        <Input
                          id="commission"
                          type="number"
                          step="0.01"
                          min="0"
                          value={commissionAmount}
                          onChange={(e) => setCommissionAmount(e.target.value)}
                          className="pl-10"
                          placeholder="0.00"
                        />
                      </div>
                      {commissionAmount && annualPremium && (
                        <p className="text-sm text-gray-600 mt-1">
                          {(
                            (parseFloat(commissionAmount) /
                              parseFloat(annualPremium)) *
                            100
                          ).toFixed(1)}
                          % of premium
                        </p>
                      )}
                    </div>
                  </div>

                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <div className="flex gap-4">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Plus className="mr-2 h-4 w-4" />
                          Submit Quote
                        </>
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setQuoteIntake(null)
                        setSearchQuery("")
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  )
}
