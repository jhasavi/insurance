"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Car, Home, Shield, ArrowRight, ArrowLeft, CheckCircle, DollarSign, Users, Info } from "lucide-react"
import { Tooltip } from "@/components/ui/tooltip"
import { Header } from "@/components/header"

type CoverageType = "AUTO" | "HOME" | "BUNDLE"
type MaritalStatus = "SINGLE" | "MARRIED" | "DIVORCED" | "WIDOWED"
type CoverageLevel = "MINIMUM" | "RECOMMENDED" | "MAXIMUM"

interface FormData {
  // Step 1: Coverage Type
  coverageType: CoverageType | null
  
  // Step 2: Personal Info
  firstName: string
  lastName: string
  dateOfBirth: string
  maritalStatus: MaritalStatus | null
  
  // Step 3: Vehicle Details (if AUTO)
  vehicleYear: string
  vehicleMake: string
  vehicleModel: string
  vehicleMileage: string
  parkingLocation: string
  
  // Step 4: Property Details (if HOME)
  propertyAddress: string
  propertyCity: string
  propertyState: string
  propertyZipCode: string
  propertyYearBuilt: string
  propertySquareFootage: string
  
  // Step 5: Coverage Preferences
  coverageLevel: CoverageLevel | null
  currentCarrier: string
  currentPremium: string
  
  // Step 6: Consent
  consentMarketing: boolean
  consentReferral: boolean
  consentDataProcessing: boolean
}

export default function CompareNewPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const [formData, setFormData] = useState<FormData>({
    coverageType: null,
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    maritalStatus: null,
    vehicleYear: "",
    vehicleMake: "",
    vehicleModel: "",
    vehicleMileage: "",
    parkingLocation: "DRIVEWAY",
    propertyAddress: "",
    propertyCity: "",
    propertyState: "MA",
    propertyZipCode: "",
    propertyYearBuilt: "",
    propertySquareFootage: "",
    coverageLevel: null,
    currentCarrier: "",
    currentPremium: "",
    consentMarketing: false,
    consentReferral: false,
    consentDataProcessing: false,
  })

  // Redirect if not authenticated
  if (status === "unauthenticated") {
    router.push("/auth/signin?callbackUrl=/compare/new")
    return null
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  const totalSteps = formData.coverageType === "BUNDLE" ? 6 : 
                    formData.coverageType === "AUTO" || formData.coverageType === "HOME" ? 5 : 6
  const progress = (step / totalSteps) * 100

  const updateFormData = (updates: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...updates }))
  }

  const handleNext = () => {
    // Skip vehicle step if not AUTO or BUNDLE
    if (step === 2 && formData.coverageType === "HOME") {
      setStep(4)
    } 
    // Skip property step if not HOME or BUNDLE
    else if (step === 3 && formData.coverageType === "AUTO") {
      setStep(5)
    }
    else {
      setStep(step + 1)
    }
  }

  const handleBack = () => {
    // Skip vehicle step when going back if not AUTO or BUNDLE
    if (step === 4 && formData.coverageType === "HOME") {
      setStep(2)
    }
    // Skip property step when going back if not HOME or BUNDLE
    else if (step === 5 && formData.coverageType === "AUTO") {
      setStep(3)
    }
    else {
      setStep(step - 1)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    
    try {
      const response = await fetch("/api/quote-intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const data = await response.json()
        router.push(`/compare/results/${data.id}`)
      } else {
        throw new Error("Failed to submit quote request")
      }
    } catch (error) {
      console.error("Quote submission error:", error)
      alert("Failed to submit quote request. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Header />
      
      <div className="container max-w-3xl mx-auto px-4 py-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              Step {step} of {totalSteps}
            </span>
            <span className="text-sm text-gray-600">{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step 1: Coverage Type */}
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-6 w-6 text-blue-600" />
                What type of insurance do you need?
              </CardTitle>
              <CardDescription>
                Choose the coverage that fits your needs
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <RadioGroup
                value={formData.coverageType || ""}
                onValueChange={(value) => updateFormData({ coverageType: value as CoverageType })}
              >
                <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-blue-50 cursor-pointer">
                  <RadioGroupItem value="AUTO" id="auto" className="mt-1" />
                  <Label htmlFor="auto" className="cursor-pointer flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Car className="h-5 w-5 text-blue-600" />
                      <span className="font-semibold">Auto Insurance Only</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Coverage for your vehicle(s) - liability, collision, comprehensive
                    </p>
                  </Label>
                </div>

                <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-blue-50 cursor-pointer">
                  <RadioGroupItem value="HOME" id="home" className="mt-1" />
                  <Label htmlFor="home" className="cursor-pointer flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Home className="h-5 w-5 text-blue-600" />
                      <span className="font-semibold">Home Insurance Only</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Coverage for your home, belongings, and liability
                    </p>
                  </Label>
                </div>

                <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-green-50 cursor-pointer border-green-300 bg-green-50">
                  <RadioGroupItem value="BUNDLE" id="bundle" className="mt-1" />
                  <Label htmlFor="bundle" className="cursor-pointer flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="h-5 w-5 text-green-600" />
                      <span className="font-semibold">Bundle Auto + Home</span>
                      <Badge className="bg-green-600">Save 15-20%</Badge>
                    </div>
                    <p className="text-sm text-gray-600">
                      Get both policies from the same carrier and save money
                    </p>
                  </Label>
                </div>
              </RadioGroup>

              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  <strong>Why bundle?</strong> Most carriers offer 10-25% discounts when you combine auto and home insurance.
                  You'll also have one point of contact for claims.
                </AlertDescription>
              </Alert>

              <Button 
                className="w-full" 
                onClick={handleNext}
                disabled={!formData.coverageType}
              >
                Continue
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Personal Info */}
        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-6 w-6 text-blue-600" />
                Tell us about yourself
              </CardTitle>
              <CardDescription>
                This helps us find accurate quotes for your situation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => updateFormData({ firstName: e.target.value })}
                    placeholder="John"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => updateFormData({ lastName: e.target.value })}
                    placeholder="Doe"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="dateOfBirth">
                  Date of Birth
                  <span className="text-sm text-gray-500 ml-2">(Age affects rates)</span>
                </Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => updateFormData({ dateOfBirth: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label>Marital Status</Label>
                <Select
                  value={formData.maritalStatus || ""}
                  onValueChange={(value) => updateFormData({ maritalStatus: value as MaritalStatus })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SINGLE">Single</SelectItem>
                    <SelectItem value="MARRIED">Married (Save 10-15%! 💑)</SelectItem>
                    <SelectItem value="DIVORCED">Divorced</SelectItem>
                    <SelectItem value="WIDOWED">Widowed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  <strong>Why we ask:</strong> Married drivers typically save 10-15% on auto insurance.
                  Age and marital status help carriers assess risk and offer accurate pricing.
                </AlertDescription>
              </Alert>

              <div className="flex gap-2">
                <Button variant="outline" onClick={handleBack} className="flex-1">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button 
                  className="flex-1" 
                  onClick={handleNext}
                  disabled={!formData.firstName || !formData.lastName || !formData.dateOfBirth || !formData.maritalStatus}
                >
                  Continue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Vehicle Details */}
        {step === 3 && (formData.coverageType === "AUTO" || formData.coverageType === "BUNDLE") && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Car className="h-6 w-6 text-blue-600" />
                Tell us about your vehicle
              </CardTitle>
              <CardDescription>
                Vehicle details help us calculate accurate premiums
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="vehicleYear">Year <Tooltip content="The year your vehicle was manufactured. Newer cars may qualify for discounts."><Info className="inline h-4 w-4 text-blue-500 ml-1" /></Tooltip></Label>
                  <Select
                    value={formData.vehicleYear}
                    onValueChange={(value) => updateFormData({ vehicleYear: value })}
                  >
                    <SelectTrigger id="vehicleYear">
                      <SelectValue placeholder="Year" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i).map(year => (
                        <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2">
                  <Label htmlFor="vehicleMake">Make <Tooltip content="The brand of your vehicle, e.g., Toyota, Honda, Ford."><Info className="inline h-4 w-4 text-blue-500 ml-1" /></Tooltip></Label>
                  <Input
                    id="vehicleMake"
                    value={formData.vehicleMake}
                    onChange={(e) => updateFormData({ vehicleMake: e.target.value })}
                    placeholder="e.g., Toyota, Honda, Ford"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="vehicleModel">Model <Tooltip content="The specific model of your vehicle, e.g., Camry, Accord, F-150."><Info className="inline h-4 w-4 text-blue-500 ml-1" /></Tooltip></Label>
                <Input
                  id="vehicleModel"
                  value={formData.vehicleModel}
                  onChange={(e) => updateFormData({ vehicleModel: e.target.value })}
                  placeholder="e.g., Camry, Accord, F-150"
                />
              </div>

              <div>
                <Label htmlFor="vehicleMileage">
                  Annual Mileage <Tooltip content="How many miles you drive per year. Lower mileage can mean lower premiums."><Info className="inline h-4 w-4 text-blue-500 ml-1" /></Tooltip>
                  <span className="text-sm text-gray-500 ml-2">(Lower mileage = lower rates)</span>
                </Label>
                <Select
                  value={formData.vehicleMileage}
                  onValueChange={(value) => updateFormData({ vehicleMileage: value })}
                >
                  <SelectTrigger id="vehicleMileage">
                    <SelectValue placeholder="Select mileage" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0-5000">0-5,000 miles (Great rate! 🌟)</SelectItem>
                    <SelectItem value="5000-10000">5,000-10,000 miles</SelectItem>
                    <SelectItem value="10000-15000">10,000-15,000 miles (Average)</SelectItem>
                    <SelectItem value="15000-20000">15,000-20,000 miles</SelectItem>
                    <SelectItem value="20000+">20,000+ miles</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="parkingLocation">Where is your vehicle parked overnight? <Tooltip content="Garaged vehicles often get better rates due to lower risk of theft or damage."><Info className="inline h-4 w-4 text-blue-500 ml-1" /></Tooltip></Label>
                <Select
                  value={formData.parkingLocation}
                  onValueChange={(value) => updateFormData({ parkingLocation: value })}
                >
                  <SelectTrigger id="parkingLocation">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GARAGE">Garage (Best rate 🏠)</SelectItem>
                    <SelectItem value="DRIVEWAY">Driveway</SelectItem>
                    <SelectItem value="STREET">Street parking</SelectItem>
                    <SelectItem value="PARKING_LOT">Parking lot</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  <strong>Insurance tip:</strong> Garaged vehicles typically save 5-10% vs. street parking.
                  Lower annual mileage can save you 10-20% on premiums.
                </AlertDescription>
              </Alert>

              <div className="flex gap-2">
                <Button variant="outline" onClick={handleBack} className="flex-1">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button 
                  className="flex-1" 
                  onClick={handleNext}
                  disabled={!formData.vehicleYear || !formData.vehicleMake || !formData.vehicleModel || !formData.vehicleMileage}
                >
                  Continue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Property Details */}
        {step === 4 && (formData.coverageType === "HOME" || formData.coverageType === "BUNDLE") && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="h-6 w-6 text-blue-600" />
                Tell us about your home
              </CardTitle>
              <CardDescription>
                Property details help us determine replacement cost and coverage needs
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="propertyAddress">Street Address <Tooltip content="The address of your home to determine location-based risks and pricing."><Info className="inline h-4 w-4 text-blue-500 ml-1" /></Tooltip></Label>
                <Input
                  id="propertyAddress"
                  value={formData.propertyAddress}
                  onChange={(e) => updateFormData({ propertyAddress: e.target.value })}
                  placeholder="123 Main St"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="propertyCity">City <Tooltip content="The city where your property is located."><Info className="inline h-4 w-4 text-blue-500 ml-1" /></Tooltip></Label>
                  <Input
                    id="propertyCity"
                    value={formData.propertyCity}
                    onChange={(e) => updateFormData({ propertyCity: e.target.value })}
                    placeholder="Boston"
                  />
                </div>
                <div>
                  <Label htmlFor="propertyState">State <Tooltip content="The state where your property is located."><Info className="inline h-4 w-4 text-blue-500 ml-1" /></Tooltip></Label>
                  <Select
                    value={formData.propertyState}
                    onValueChange={(value) => updateFormData({ propertyState: value })}
                  >
                    <SelectTrigger id="propertyState">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MA">Massachusetts</SelectItem>
                      <SelectItem value="NH">New Hampshire</SelectItem>
                      <SelectItem value="RI">Rhode Island</SelectItem>
                      <SelectItem value="CT">Connecticut</SelectItem>
                      <SelectItem value="ME">Maine</SelectItem>
                      <SelectItem value="VT">Vermont</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="propertyZipCode">ZIP Code <Tooltip content="ZIP code helps determine local risks and pricing."><Info className="inline h-4 w-4 text-blue-500 ml-1" /></Tooltip></Label>
                  <Input
                    id="propertyZipCode"
                    value={formData.propertyZipCode}
                    onChange={(e) => updateFormData({ propertyZipCode: e.target.value })}
                    placeholder="02134"
                    maxLength={5}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="propertyYearBuilt">
                    Year Built <Tooltip content="The year your home was built. Newer homes may qualify for discounts."><Info className="inline h-4 w-4 text-blue-500 ml-1" /></Tooltip>
                    <span className="text-sm text-gray-500 ml-2">(Newer = lower rates)</span>
                  </Label>
                  <Select
                    value={formData.propertyYearBuilt}
                    onValueChange={(value) => updateFormData({ propertyYearBuilt: value })}
                  >
                    <SelectTrigger id="propertyYearBuilt">
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i).map(year => (
                        <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="propertySquareFootage">Square Footage <Tooltip content="The total finished area of your home in square feet."><Info className="inline h-4 w-4 text-blue-500 ml-1" /></Tooltip></Label>
                  <Input
                    id="propertySquareFootage"
                    type="number"
                    value={formData.propertySquareFootage}
                    onChange={(e) => updateFormData({ propertySquareFootage: e.target.value })}
                    placeholder="2000"
                  />
                </div>
              </div>

              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  <strong>Why location matters:</strong> ZIP code affects rates based on local crime, weather risks, and claims history.
                  Homes built after 2000 often qualify for discounts (newer wiring, plumbing, roof).
                </AlertDescription>
              </Alert>

              <div className="flex gap-2">
                <Button variant="outline" onClick={handleBack} className="flex-1">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button 
                  className="flex-1" 
                  onClick={handleNext}
                  disabled={!formData.propertyAddress || !formData.propertyCity || !formData.propertyZipCode || !formData.propertyYearBuilt || !formData.propertySquareFootage}
                >
                  Continue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 5: Coverage Preferences */}
        {step === 5 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-6 w-6 text-blue-600" />
                Choose your coverage level
              </CardTitle>
              <CardDescription>
                We'll show you quotes that match your preferred protection level
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Coverage Level <Tooltip content="Choose how much protection you want. Minimum meets state law, Recommended balances cost and protection, Maximum gives the highest limits."><Info className="inline h-4 w-4 text-blue-500 ml-1" /></Tooltip></Label>
                <RadioGroup
                  value={formData.coverageLevel || ""}
                  onValueChange={(value) => updateFormData({ coverageLevel: value as CoverageLevel })}
                >
                  <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <RadioGroupItem value="MINIMUM" id="minimum" className="mt-1" />
                    <Label htmlFor="minimum" className="cursor-pointer flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold">Minimum (State Required)</span>
                        <Badge variant="outline">Lowest Cost</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        Meets legal requirements but limited protection
                      </p>
                      <p className="text-xs text-orange-600">
                        ⚠️ Risk: You could pay $50,000+ out-of-pocket in serious accidents
                      </p>
                    </Label>
                  </div>

                  <div className="flex items-start space-x-3 p-4 border-2 border-blue-300 rounded-lg bg-blue-50 cursor-pointer">
                    <RadioGroupItem value="RECOMMENDED" id="recommended" className="mt-1" />
                    <Label htmlFor="recommended" className="cursor-pointer flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold">Recommended (Best Value)</span>
                        <Badge className="bg-blue-600">Most Popular ⭐</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        Balanced protection for most people - covers typical incidents
                      </p>
                      <p className="text-xs text-green-600">
                        ✓ Protects your assets without overpaying
                      </p>
                    </Label>
                  </div>

                  <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <RadioGroupItem value="MAXIMUM" id="maximum" className="mt-1" />
                    <Label htmlFor="maximum" className="cursor-pointer flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold">Maximum (Full Protection)</span>
                        <Badge variant="outline">Premium</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        Highest limits, lowest deductibles - comprehensive peace of mind
                      </p>
                      <p className="text-xs text-blue-600">
                        Best for high net worth or maximum protection needs
                      </p>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  <strong>How we recommend:</strong> Based on your profile, we suggest "Recommended" coverage.
                  This balances protection and cost for most families. You can adjust coverage limits on the results page.
                </AlertDescription>
              </Alert>

              <div>
                <Label htmlFor="currentCarrier">Current Insurance Carrier (Optional) <Tooltip content="Who you are currently insured with. Helps us compare and show savings."><Info className="inline h-4 w-4 text-blue-500 ml-1" /></Tooltip></Label>
                <Input
                  id="currentCarrier"
                  value={formData.currentCarrier}
                  onChange={(e) => updateFormData({ currentCarrier: e.target.value })}
                  placeholder="e.g., GEICO, State Farm, Progressive"
                />
              </div>

              <div>
                <Label htmlFor="currentPremium">
                  Current Annual Premium (Optional) <Tooltip content="How much you pay per year for insurance. Helps us show your savings."><Info className="inline h-4 w-4 text-blue-500 ml-1" /></Tooltip>
                  <span className="text-sm text-gray-500 ml-2">(Helps us show your savings)</span>
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <Input
                    id="currentPremium"
                    type="number"
                    value={formData.currentPremium}
                    onChange={(e) => updateFormData({ currentPremium: e.target.value })}
                    placeholder="1200"
                    className="pl-7"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={handleBack} className="flex-1">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button 
                  className="flex-1" 
                  onClick={handleNext}
                  disabled={!formData.coverageLevel}
                >
                  Continue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 6: Review & Consent */}
        {step === 6 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-6 w-6 text-blue-600" />
                Review & Submit
              </CardTitle>
              <CardDescription>
                Verify your information and give us permission to find you the best quotes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Summary */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-600">Coverage Type</p>
                    <p className="font-semibold">
                      {formData.coverageType === "BUNDLE" && "Auto + Home Bundle 💰"}
                      {formData.coverageType === "AUTO" && "Auto Insurance"}
                      {formData.coverageType === "HOME" && "Home Insurance"}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setStep(1)}>Edit</Button>
                </div>

                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-600">Your Info</p>
                    <p className="font-semibold">{formData.firstName} {formData.lastName}</p>
                    <p className="text-sm text-gray-600">{formData.maritalStatus}</p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setStep(2)}>Edit</Button>
                </div>

                {(formData.coverageType === "AUTO" || formData.coverageType === "BUNDLE") && (
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-gray-600">Vehicle</p>
                      <p className="font-semibold">{formData.vehicleYear} {formData.vehicleMake} {formData.vehicleModel}</p>
                      <p className="text-sm text-gray-600">{formData.vehicleMileage} miles/year</p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => setStep(3)}>Edit</Button>
                  </div>
                )}

                {(formData.coverageType === "HOME" || formData.coverageType === "BUNDLE") && (
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-gray-600">Property</p>
                      <p className="font-semibold">{formData.propertyAddress}</p>
                      <p className="text-sm text-gray-600">{formData.propertyCity}, {formData.propertyState} {formData.propertyZipCode}</p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => setStep(4)}>Edit</Button>
                  </div>
                )}

                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-600">Coverage Level</p>
                    <p className="font-semibold">
                      {formData.coverageLevel === "MINIMUM" && "Minimum (State Required)"}
                      {formData.coverageLevel === "RECOMMENDED" && "Recommended ⭐"}
                      {formData.coverageLevel === "MAXIMUM" && "Maximum Protection"}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setStep(5)}>Edit</Button>
                </div>
              </div>

              {/* Consent Checkboxes */}
              <div className="space-y-4 border-t pt-4">
                <h3 className="font-semibold text-lg">Your Consent</h3>
                
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="consentDataProcessing"
                    checked={formData.consentDataProcessing}
                    onCheckedChange={(checked) => 
                      updateFormData({ consentDataProcessing: checked as boolean })
                    }
                  />
                  <Label htmlFor="consentDataProcessing" className="cursor-pointer text-sm leading-relaxed">
                    <span className="font-semibold">I consent to data processing</span> (Required)
                    <Tooltip content="We use your info only to generate quotes and contact you. Your data is encrypted and never sold."><Info className="inline h-4 w-4 text-blue-500 ml-1" /></Tooltip>
                    <p className="text-gray-600 mt-1">
                      I authorize Safora Insurance to use my information to generate insurance quotes and 
                      contact me about my request. Your data is encrypted and never sold.
                    </p>
                  </Label>
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="consentReferral"
                    checked={formData.consentReferral}
                    onCheckedChange={(checked) => 
                      updateFormData({ consentReferral: checked as boolean })
                    }
                  />
                  <Label htmlFor="consentReferral" className="cursor-pointer text-sm leading-relaxed">
                    <span className="font-semibold">I consent to referrals</span> (Required)
                    <Tooltip content="We may earn a referral commission (10-15%) if you select a quote. This does NOT increase your price."><Info className="inline h-4 w-4 text-blue-500 ml-1" /></Tooltip>
                    <p className="text-gray-600 mt-1">
                      I understand that when I select a quote and contact a carrier, Safora may earn a 
                      referral commission (10-15% of premium). This does NOT increase my price - carriers 
                      pay the same whether you buy direct or through us.
                    </p>
                  </Label>
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="consentMarketing"
                    checked={formData.consentMarketing}
                    onCheckedChange={(checked) => 
                      updateFormData({ consentMarketing: checked as boolean })
                    }
                  />
                  <Label htmlFor="consentMarketing" className="cursor-pointer text-sm leading-relaxed">
                    <span className="font-semibold">Marketing communications</span> (Optional)
                    <Tooltip content="Get tips to save on insurance, renewal reminders, and special offers. You can unsubscribe anytime."><Info className="inline h-4 w-4 text-blue-500 ml-1" /></Tooltip>
                    <p className="text-gray-600 mt-1">
                      Send me tips to save on insurance, policy renewal reminders, and special offers. 
                      You can unsubscribe anytime.
                    </p>
                  </Label>
                </div>
              </div>

              <Alert className="bg-blue-50 border-blue-200">
                <Info className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-900">
                  <strong>What happens next:</strong> We'll analyze your profile against 15+ carriers and 
                  prepare personalized quotes. You'll see results in 5-10 minutes, or we'll email you within 
                  24 hours. No spam calls, guaranteed.
                </AlertDescription>
              </Alert>

              <div className="flex gap-2">
                <Button variant="outline" onClick={handleBack} className="flex-1">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button 
                  className="flex-1 bg-green-600 hover:bg-green-700" 
                  onClick={handleSubmit}
                  disabled={!formData.consentDataProcessing || !formData.consentReferral || isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="animate-spin mr-2">⏳</span>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Get My Quotes
                    </>
                  )}
                </Button>
              </div>

              <p className="text-xs text-center text-gray-600">
                By submitting, you agree to our{" "}
                <Link href="/terms" className="text-blue-600 hover:underline">Terms of Service</Link>
                {" "}and{" "}
                <Link href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>
              </p>
            </CardContent>
          </Card>
        )}
        
      </div>
    </div>
  )
}
