"use client"

import React, { useState, useEffect, useRef } from "react"
import { toast } from 'sonner'
import { Toaster } from '@/components/ui/sonner'

export function LifeInsuranceTool() {
  const [step, setStep] = useState(1)
  const [age, setAge] = useState<number | "">("")
  const [income, setIncome] = useState<number | "">("")
  const [debt, setDebt] = useState<number | "">("")
  const [mortgage, setMortgage] = useState<number | "">("")
  const [children, setChildren] = useState<number | "">("")
  const [goal, setGoal] = useState<string>("Income Replacement")
  const [replacementYears, setReplacementYears] = useState<number>(10)
  const [inflationRate, setInflationRate] = useState<number>(3)
  const [tobaccoUse, setTobaccoUse] = useState<boolean>(false)
  const [healthRating, setHealthRating] = useState<string>('Standard')
  const [windfall, setWindfall] = useState<number | "">("")
  const [maritalStatus, setMaritalStatus] = useState<string>('Single')
  const [spouseIncome, setSpouseIncome] = useState<number | "">("")
  const [otherDependents, setOtherDependents] = useState<number | "">("")
  const [existingCoverage, setExistingCoverage] = useState<number | "">("")
  const [liquidAssets, setLiquidAssets] = useState<number | "">("")
  const [finalExpenses, setFinalExpenses] = useState<number>(25000)
  const [socialSecurityMonthly, setSocialSecurityMonthly] = useState<number | "">("")
  const [clientName, setClientName] = useState<string>("")
  const [agentName, setAgentName] = useState<string>("")
  const [agentLicense, setAgentLicense] = useState<string>("")
  const [clientState, setClientState] = useState<string>('MA')
  const [considerJointPolicy, setConsiderJointPolicy] = useState<boolean>(false)
  const [educationPerChild, setEducationPerChild] = useState<number>(50000)
  const [coverageHorizonYears, setCoverageHorizonYears] = useState<number>(20)
  const [monthlyBudget, setMonthlyBudget] = useState<number | "">("")
  const [cashValuePreference, setCashValuePreference] = useState<'None' | 'Some' | 'High'>('None')
  const [premiumFlexibility, setPremiumFlexibility] = useState<'Fixed' | 'Flexible'>('Fixed')
  const [riskTolerance, setRiskTolerance] = useState<'Low' | 'Medium' | 'High'>('Medium')
  const [policyPreference, setPolicyPreference] = useState<'Term Only' | 'Prefer Permanent' | 'Not Sure'>('Not Sure')
  const [businessOwner, setBusinessOwner] = useState<boolean>(false)
  const [estateNeed, setEstateNeed] = useState<boolean>(false)
  const [retirementIncomeNeed, setRetirementIncomeNeed] = useState<boolean>(false)
  const [priority, setPriority] = useState<'Lowest Cost' | 'Comprehensive Living Benefits'>('Lowest Cost')
  const [comparisonMode, setComparisonMode] = useState<boolean>(true)
  const [wantLivingBenefitAccess, setWantLivingBenefitAccess] = useState<boolean>(false)
  const [wantWaiverOfPremium, setWantWaiverOfPremium] = useState<boolean>(false)
  const [wantChildRider, setWantChildRider] = useState<boolean>(false)
  const [wantAccidentalDeath, setWantAccidentalDeath] = useState<boolean>(false)
  const [wantTermConversion, setWantTermConversion] = useState<boolean>(true)
  const [wantGuaranteedInsurability, setWantGuaranteedInsurability] = useState<boolean>(false)
  const [email, setEmail] = useState<string>('')
  const [emailModalOpen, setEmailModalOpen] = useState(false)
  const [comparisonModalOpen, setComparisonModalOpen] = useState(false)
  const [recipientEmail, setRecipientEmail] = useState<string>('')
  const [recipientNameModal, setRecipientNameModal] = useState<string>('')
  const [leadStage, setLeadStage] = useState<'New' | 'Follow-up' | 'Closed'>('New')
  const [unlocked, setUnlocked] = useState<boolean>(false)
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const liveRegionRef = useRef<HTMLDivElement | null>(null)
  const [productMapping, setProductMapping] = useState<any>(null)

  const toNumber = (v: number | string | "") => {
    if (v === "") return 0
    return Number(v || 0)
  }

  const computeCoverage = () => {
    const d = toNumber(debt)
    const m = toNumber(mortgage)
    const inc = toNumber(income)
    const c = toNumber(children)
    const other = toNumber(otherDependents)
    const existing = toNumber(existingCoverage)
    const assets = toNumber(liquidAssets)
    const wind = toNumber(windfall)
    const edu = toNumber(educationPerChild)
    const final = Number(finalExpenses || 0)
    const ssBenefits = toNumber(socialSecurityMonthly)
    // Apply replacement years and inflation multiplier to match the actual coverage period
    const years = replacementYears || 10
    const infl = (1 + (Number(inflationRate) || 0) / 100)
    const inflationMultiplier = Math.pow(infl, years) // Fixed: use actual years, not hardcoded 20
    const incomeReplacement = inc * years * inflationMultiplier
    const ssOffset = ssBenefits * 12 * years // Social Security survivor benefits offset
    const education = (c + other) * edu
    const grossNeed = d + m + incomeReplacement + education + final
    const netNeed = Math.max(0, grossNeed - existing - assets - wind - ssOffset)
    return netNeed
  }

  const recommendType = () => {
    const a = toNumber(age)
    const monthlyGrossIncome = toNumber(income) / 12
    const maxAffordablePremium = Math.max(toNumber(monthlyBudget) || 0, monthlyGrossIncome * 0.05) // 5% of income or stated budget
    
    if (policyPreference === 'Term Only') return { type: 'Level Term', perm: false }
    if (goal === "Budget-Friendly" || monthlyBudget !== "" && toNumber(monthlyBudget) < 60) {
      return { type: 'Level Term', perm: false }
    }

    // Helper: Check if a permanent policy would be affordable
    const checkAffordability = (policyType: 'WholeLife' | 'IUL') => {
      // permanent policies use the same multiplier
      const basePremium = estimatePremium(true)
      if (!basePremium) return false
      
      const isAffordable = basePremium.individual <= maxAffordablePremium
      if (isAffordable) return true
      
      return false
    }

    if (goal === 'Wealth Transfer' || estateNeed) {
      // For wealth transfer, prefer permanent, but only if affordable
      if (checkAffordability('WholeLife')) {
        return { type: 'Whole Life', perm: true, features: ['Guaranteed Death Benefit', 'Stable Cash Value'] }
      }
      // If too expensive, recommend term and note that permanent is an option if they reduce coverage or increase budget
      return { type: 'Level Term (30-year)', perm: false, features: ['Affordable Income Protection', 'Consider smaller Whole Life for estate'], budget: 'constrained' }
    }

    const retirementGoal = goal === 'Retirement Income'
    if (cashValuePreference === 'High' || retirementIncomeNeed || retirementGoal || businessOwner) {
      if (riskTolerance === 'Low' || premiumFlexibility === 'Fixed') {
        if (checkAffordability('WholeLife')) {
          return { type: 'Whole Life', perm: true, features: ['Guaranteed Cash Value', 'Fixed Premiums'] }
        }
        // Fall back to IUL (cheaper) or term
        if (checkAffordability('IUL')) {
          return { type: 'Indexed Universal Life (IUL)', perm: true, features: ['Cash Value Growth', 'Flexible Premiums'] }
        }
        return { type: 'Level Term (20-year)', perm: false, features: ['Affordable Base', 'Add permanent later if budget allows'], budget: 'constrained' }
      }
      if (checkAffordability('IUL')) {
        return { type: 'Indexed Universal Life (IUL)', perm: true, features: ['Cash Value Growth', 'Flexible Premiums'] }
      }
      return { type: 'Level Term (20-year)', perm: false, budget: 'constrained' }
    }

    if (goal === 'Wealth Accumulation' && a < 55) {
      if (checkAffordability('IUL')) {
        return { type: 'Indexed Universal Life (IUL)', perm: true, features: ['Cash Value Growth', 'Tax-Advantaged Loans'] }
      }
      return { type: 'Level Term (20-year)', perm: false, budget: 'constrained' }
    }

    if (policyPreference === 'Prefer Permanent') {
      if (checkAffordability('WholeLife')) {
        return { type: 'Whole Life', perm: true }
      }
      // Recommend term if permanent unaffordable
      return { type: 'Level Term (20-year)', perm: false, features: ['Affordable option'], budget: 'constrained' }
    }

    return { type: 'Level Term', perm: false }
  }

  const carrierSuggested = () => {
    const mapping = productMapping || {}
    const defaults = {
      transamerica: { name: 'Transamerica', notes: 'Good for budget/smaller face amounts' },
      nationwide: { name: 'Nationwide', notes: 'Strong living benefits & service' }
    }
    const trans = mapping.transamerica || defaults.transamerica
    const nw = mapping.nationwide || defaults.nationwide

    if (priority === 'Lowest Cost') return { carrier: trans.name, notes: trans.notes }
    return { carrier: nw.name, notes: nw.notes }
  }

  const recommendTermLength = () => {
    const a = toNumber(age)
    
    // For wealth transfer or longer income replacement, use longer terms
    if (goal === 'Wealth Transfer' || coverageHorizonYears >= 25) return 30
    if (goal === 'Retirement Income') return 30  // Need coverage through retirement
    
    if (coverageHorizonYears >= 10 && coverageHorizonYears <= 35) {
      const rounded = Math.round(coverageHorizonYears / 5) * 5
      return Math.min(35, Math.max(10, rounded))
    }
    if (a <= 30) return 30
    if (a <= 40) return 25
    if (a <= 50) return 20
    if (a <= 60) return 15
    return 10
  }

  // Estimate monthly premium based on age, health, tobacco, coverage amount, term length
  // optionally pass isPermanent to avoid runtime ordering issues
  const estimatePremium = (isPermanent?: boolean) => {
    const a = toNumber(age)
    const cov = coverage
    if (a === 0 || cov === 0) return null

    // Base rate per $1000 of coverage per month (calibrated to market rates)
    let baseRate = 0.06 // Starting base for healthy 30-year-old

    // Age adjustment (term life industry benchmarks)
    if (a < 30) baseRate = 0.04
    else if (a < 40) baseRate = 0.06
    else if (a < 50) baseRate = 0.12
    else if (a < 60) baseRate = 0.28
    else if (a < 70) baseRate = 0.60
    else baseRate = 1.20

    // Health rating adjustment
    if (healthRating === 'Super Preferred') baseRate *= 0.85
    else if (healthRating === 'Preferred') baseRate *= 0.90
    else baseRate *= 1.0 // Standard

    // Tobacco use (roughly doubles premium)
    if (tobaccoUse) baseRate *= 2.0

    // Term length adjustment (longer terms slightly more expensive)
    const permFlag = isPermanent !== undefined ? isPermanent : false
    if (permFlag) {
      // Permanent policies are 5.5x more expensive than term (realistic market ratio)
      baseRate *= 5.5
    } else {
      if (termLength && termLength >= 30) baseRate *= 1.15
      else if (termLength && termLength >= 20) baseRate *= 1.05
    }

    // Calculate monthly premium
    const monthlyPremium = (cov / 1000) * baseRate

    // Joint policy discount (roughly 10-15% savings)
    if (considerJointPolicy && maritalStatus === 'Married') {
      return {
        individual: Math.round(monthlyPremium),
        joint: Math.round(monthlyPremium * 1.7), // Second person at slight discount
        savings: Math.round(monthlyPremium * 0.3)
      }
    }

    return {
      individual: Math.round(monthlyPremium),
      joint: null,
      savings: null
    }
  }

  // Validate rider compatibility with recommended policy type
  const validateRiders = () => {
    const warnings: string[] = []
    const policyType = rec.type?.toLowerCase() || ''

    // Term Conversion only makes sense on term policies
    if (wantTermConversion && rec.perm) {
      warnings.push('Term Conversion rider is not applicable to permanent policies.')
    }

    // Living benefits typically not available on basic term
    if (wantLivingBenefitAccess && policyType.includes('term') && coverage < 250000) {
      warnings.push('Living Benefits may not be available on term policies under $250k face amount.')
    }

    // Waiver of premium availability
    if (wantWaiverOfPremium && toNumber(age) > 60) {
      warnings.push('Waiver of Premium rider may not be available for applicants over age 60.')
    }

    // Child rider
    if (wantChildRider && toNumber(children) === 0 && toNumber(otherDependents) === 0) {
      warnings.push('Child Rider selected but no children/dependents indicated.')
    }

    return warnings
  }

  useEffect(() => {
    try {
      const raw = localStorage.getItem("lifeInsuranceInput")
      if (raw) {
        const obj = JSON.parse(raw)
        if (obj.age !== undefined) setAge(obj.age)
        if (obj.income !== undefined) setIncome(obj.income)
        if (obj.debt !== undefined) setDebt(obj.debt)
        if (obj.mortgage !== undefined) setMortgage(obj.mortgage)
        if (obj.children !== undefined) setChildren(obj.children)
        if (obj.goal !== undefined) setGoal(obj.goal)
        if (obj.replacementYears !== undefined) setReplacementYears(obj.replacementYears)
        if (obj.inflationRate !== undefined) setInflationRate(obj.inflationRate)
        if (obj.tobaccoUse !== undefined) setTobaccoUse(obj.tobaccoUse)
        if (obj.healthRating !== undefined) setHealthRating(obj.healthRating)
        if (obj.maritalStatus !== undefined) setMaritalStatus(obj.maritalStatus)
        if (obj.spouseIncome !== undefined) setSpouseIncome(obj.spouseIncome)
        if (obj.otherDependents !== undefined) setOtherDependents(obj.otherDependents)
        if (obj.existingCoverage !== undefined) setExistingCoverage(obj.existingCoverage)
        if (obj.liquidAssets !== undefined) setLiquidAssets(obj.liquidAssets)
        if (obj.finalExpenses !== undefined) setFinalExpenses(obj.finalExpenses)
        if (obj.educationPerChild !== undefined) setEducationPerChild(obj.educationPerChild)
        if (obj.coverageHorizonYears !== undefined) setCoverageHorizonYears(obj.coverageHorizonYears)
        if (obj.monthlyBudget !== undefined) setMonthlyBudget(obj.monthlyBudget)
        if (obj.cashValuePreference !== undefined) setCashValuePreference(obj.cashValuePreference)
        if (obj.premiumFlexibility !== undefined) setPremiumFlexibility(obj.premiumFlexibility)
        if (obj.riskTolerance !== undefined) setRiskTolerance(obj.riskTolerance)
        if (obj.policyPreference !== undefined) setPolicyPreference(obj.policyPreference)
        if (obj.businessOwner !== undefined) setBusinessOwner(obj.businessOwner)
        if (obj.estateNeed !== undefined) setEstateNeed(obj.estateNeed)
        if (obj.retirementIncomeNeed !== undefined) setRetirementIncomeNeed(obj.retirementIncomeNeed)
        if (obj.wantLivingBenefitAccess !== undefined) setWantLivingBenefitAccess(obj.wantLivingBenefitAccess)
        if (obj.wantWaiverOfPremium !== undefined) setWantWaiverOfPremium(obj.wantWaiverOfPremium)
        if (obj.wantChildRider !== undefined) setWantChildRider(obj.wantChildRider)
        if (obj.wantAccidentalDeath !== undefined) setWantAccidentalDeath(obj.wantAccidentalDeath)
        if (obj.wantTermConversion !== undefined) setWantTermConversion(obj.wantTermConversion)
        if (obj.wantGuaranteedInsurability !== undefined) setWantGuaranteedInsurability(obj.wantGuaranteedInsurability)
        if (obj.clientName !== undefined) setClientName(obj.clientName)
        if (obj.agentName !== undefined) setAgentName(obj.agentName)
        if (obj.agentLicense !== undefined) setAgentLicense(obj.agentLicense)
        if (obj.clientState !== undefined) setClientState(obj.clientState)
        if (obj.socialSecurityMonthly !== undefined) setSocialSecurityMonthly(obj.socialSecurityMonthly)
        if (obj.considerJointPolicy !== undefined) setConsiderJointPolicy(obj.considerJointPolicy)
        if (obj.email !== undefined) setEmail(obj.email)
        if (obj.leadStage !== undefined) setLeadStage(obj.leadStage)
        if (obj.unlocked !== undefined) setUnlocked(obj.unlocked)
      }
    } catch {}
  }, [])

  useEffect(() => {
    // Load static product mapping from public folder
    fetch('/product-mapping.json')
      .then((r) => r.json())
      .then((m) => setProductMapping(m))
      .catch(() => setProductMapping(null))
  }, [])

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault()
    const nextErrors: Record<string, string> = {}
    if (age === "" || Number(age) <= 0) nextErrors.age = "Please enter a valid age."
    if (age !== "" && Number(age) > 85) nextErrors.age = "Age must be 85 or under for most policies."
    if (income === "" || Number(income) < 0) nextErrors.income = "Please enter a valid income."
    if (income !== "" && Number(income) > 10000000) nextErrors.income = "Income over $10M requires specialized underwriting."
    if (!clientName || clientName.trim() === "") nextErrors.clientName = "Client name is required for professional documentation."
    if (!clientState) nextErrors.clientState = "State is required for compliance purposes."

    setErrors(nextErrors)
    const isValid = Object.keys(nextErrors).length === 0
    if (!isValid) {
      setStep(1)
      return
    }

    const payload = {
      age,
      income,
      debt,
      mortgage,
      children,
      otherDependents,
      goal,
      replacementYears,
      inflationRate,
      tobaccoUse,
      healthRating,
      maritalStatus,
      spouseIncome,
      existingCoverage,
      liquidAssets,
      finalExpenses,
      educationPerChild,
      coverageHorizonYears,
      monthlyBudget,
      cashValuePreference,
      premiumFlexibility,
      riskTolerance,
      policyPreference,
      businessOwner,
      estateNeed,
      retirementIncomeNeed,
      wantLivingBenefitAccess,
      wantWaiverOfPremium,
      wantChildRider,
      wantAccidentalDeath,
      wantTermConversion,
      wantGuaranteedInsurability,
      windfall,
      priority,
      clientName,
      agentName,
      agentLicense,
      clientState,
      socialSecurityMonthly,
        email,
        leadStage
    }
    try { localStorage.setItem("lifeInsuranceInput", JSON.stringify(payload)) } catch {}
    try { console.log("analytics:event", "life_insurance_submitted", payload) } catch {}

    // Increment lightweight engagement score for internal KPI tracking
    try {
      const raw = localStorage.getItem('engagementScore')
      const n = raw ? Number(raw) : 0
      const next = Math.min(100, (isNaN(n) ? 0 : n) + 1)
      localStorage.setItem('engagementScore', String(next))
    } catch {}

    setSubmitted(true)
    if (liveRegionRef.current) {
      liveRegionRef.current.focus()
    }
  }

  const handleReset = () => {
    setAge("")
    setIncome("")
    setDebt("")
    setMortgage("")
    setChildren("")
    setOtherDependents("")
    setGoal("Income Replacement")
    setMaritalStatus('Single')
    setSpouseIncome("")
    setExistingCoverage("")
    setLiquidAssets("")
    setFinalExpenses(25000)
    setEducationPerChild(50000)
    setSocialSecurityMonthly("")
    setClientName("")
    setAgentName("")
    setAgentLicense("")
    setClientState('MA')
    setConsiderJointPolicy(false)
    setCoverageHorizonYears(20)
    setMonthlyBudget("")
    setCashValuePreference('None')
    setPremiumFlexibility('Fixed')
    setRiskTolerance('Medium')
    setPolicyPreference('Not Sure')
    setBusinessOwner(false)
    setEstateNeed(false)
    setRetirementIncomeNeed(false)
    setWantLivingBenefitAccess(false)
    setWantWaiverOfPremium(false)
    setWantChildRider(false)
    setWantAccidentalDeath(false)
    setWantTermConversion(true)
    setWantGuaranteedInsurability(false)
    setSubmitted(false)
    setErrors({})
    try { localStorage.removeItem("lifeInsuranceInput") } catch {}
  }

  const coverage = computeCoverage()
  const rec = recommendType()
  const termLength = rec.perm ? null : recommendTermLength()

  const fmt = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })

  const buildPayload = () => ({
    recommendedType: rec.type,
    coverage,
    termLength,
    leadStage,
    inputs: {
      age,
      income,
      maritalStatus,
      spouseIncome,
      children,
      otherDependents,
      debt,
      mortgage,
      finalExpenses,
      educationPerChild,
      existingCoverage,
      liquidAssets,
      windfall,
      goal,
      replacementYears,
      inflationRate,
      coverageHorizonYears,
      monthlyBudget,
      cashValuePreference,
      premiumFlexibility,
      riskTolerance,
      policyPreference,
      businessOwner,
      estateNeed,
      retirementIncomeNeed,
      tobaccoUse,
      healthRating,
      priority,
      wantLivingBenefitAccess,
      wantWaiverOfPremium,
      wantChildRider,
      wantAccidentalDeath,
      wantTermConversion,
      wantGuaranteedInsurability,
      clientName,
      agentName,
      agentLicense,
      clientState,
      socialSecurityMonthly,
      considerJointPolicy,
      email,
      leadStage
    }
  })

  const selectedRiders = [
    wantLivingBenefitAccess && 'Living Benefits (chronic/critical illness)',
    wantWaiverOfPremium && 'Waiver of Premium',
    wantChildRider && 'Child Term Rider',
    wantAccidentalDeath && 'Accidental Death Benefit',
    wantTermConversion && 'Term Conversion Option',
    wantGuaranteedInsurability && 'Guaranteed Insurability'
  ].filter(Boolean) as string[]

  const carrierMatches = () => {
    // Use static mapping when available to show carrier-specific product names
    const mapping = productMapping || {}
    const trans = mapping.transamerica || { term: { name: 'Level Term' }, whole: { name: 'Whole Life' }, products: {} }
    const wfg = mapping.wfg || {}
    const nationwide = mapping.nationwide || { term: { name: 'Term Select' }, products: { livingBenefits: { name: 'Living Benefits Rider' } } }

    if (rec.type?.toLowerCase().includes('term')) {
      return [
        { carrier: 'Transamerica', product: trans.term?.name || 'Level Term (10/15/20/30)', notes: trans.term?.notes || 'Good for budget-friendly income replacement; competitive underwriting' },
        { carrier: 'WFG', product: wfg.term?.name || 'Partner Term Options', notes: wfg.term?.notes || 'Varies by carrier; suitable for term comparisons' }
      ]
    }

    if (rec.type?.toLowerCase().includes('whole')) {
      return [
        { carrier: 'Transamerica', product: trans.whole?.name || 'Whole Life', notes: trans.whole?.notes || 'Stable permanent coverage for wealth transfer; cash value accumulation' },
        { carrier: 'WFG', product: wfg.whole?.name || 'Whole Life Partners', notes: wfg.whole?.notes || 'Agency-distributed whole life options to consider' }
      ]
    }

    // IUL recommendations
    if (rec.type?.toLowerCase().includes('iul') || rec.type?.toLowerCase().includes('indexed')) {
      return [
        { carrier: 'Transamerica', product: trans.products?.financialFoundationIUL?.name || 'Financial Foundation IUL', notes: trans.products?.financialFoundationIUL?.notes || 'IUL with upside tied to indices' },
        { carrier: 'Transamerica', product: trans.products?.trendsetterIUL?.name || 'Trendsetter IUL', notes: trans.products?.trendsetterIUL?.notes || 'IUL alternative' }
      ]
    }

    return [
      { carrier: 'Transamerica', product: (trans.term?.name || 'Level Term') + ' / ' + (trans.whole?.name || 'Whole Life'), notes: 'Contact carrier rep for best-fit product' }
    ]
  }

  const recommendCarrierByPriority = () => {
    return carrierSuggested()
  }

  const underwritingSnapshot = () => {
    return {
      ageEligibility: '18-85 (varies by product)',
      simplifiedIssue: 'Available for lower face amounts on select products',
      medicalExam: 'Likely for larger face amounts (> $500k) or certain risk classes',
      smokerImpact: 'Smoker rates materially higher; verify tobacco questions',
      notes: 'Confirm state availability and product-specific limits with carrier/WFG broker portal.'
    }
  }

  const advisorKnowledgeAssist = () => {
    const points = [
      `Lead with need: estimated coverage target is ${fmt.format(coverage)} based on debt, mortgage, income replacement, and dependents.`,
      `Frame recommendation simply: ${rec.type}${termLength ? ` for ${termLength} years` : ' as a permanent design'}.`,
      `Use two-step close: confirm budget comfort, then confirm protection priority before discussing product detail.`
    ]

    if (goal === 'Wealth Accumulation' || rec.type.toLowerCase().includes('iul')) {
      points.push('Discuss tax-aware accumulation and policy loan flexibility only after confirming long-term funding commitment.')
    }

    if (toNumber(children) > 0 || toNumber(mortgage) > 0) {
      points.push('Reinforce family continuity: explain how coverage protects housing stability and education plans.')
    }

    const objections = [
      {
        objection: 'It feels expensive right now.',
        response: 'Start with core protection first, then layer optional riders as budget allows. Protecting the downside is the priority.'
      },
      {
        objection: 'I will decide later.',
        response: 'Waiting increases age-based pricing risk. Locking insurability now keeps options open even if coverage is adjusted later.'
      },
      {
        objection: 'I already have coverage through work.',
        response: 'Employer coverage usually ends when employment changes and may be insufficient for mortgage and family obligations.'
      }
    ]

    const complianceNotes = [
      'Use educational language only; avoid promising returns or underwriting outcomes.',
      'Confirm final product availability, riders, and premiums with carrier illustrations.',
      'Document that this output is a planning aid and not legal or tax advice.'
    ]

    return { points, objections, complianceNotes }
  }

  const buildFollowUpScript = () => {
    const assist = advisorKnowledgeAssist()
    const focusPoint = assist.points[0] || 'Coverage was calculated using debt, mortgage, income replacement, and dependent needs.'
    return [
      'Hi, sharing your life insurance recommendation summary.',
      `Coverage target: ${fmt.format(coverage)}`,
      `Recommended type: ${rec.type}${termLength ? ` (${termLength} years)` : ' (Permanent)'}`,
      `Current lead stage: ${leadStage}`,
      `Advisor note: ${focusPoint}`,
      '',
      'Reply with a good time this week and we can review options together.'
    ].join('\n')
  }

  const handleShareWhatsApp = async () => {
    const text = buildFollowUpScript()
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`
    try {
      window.open(url, '_blank', 'noopener,noreferrer')
      toast.success('WhatsApp follow-up opened.')
    } catch {
      await handleCopy({ followUpScript: text })
      toast.error('Could not open WhatsApp. Script copied instead.')
    }
  }

  const handleShareSms = async () => {
    const text = buildFollowUpScript()
    const url = `sms:?&body=${encodeURIComponent(text)}`
    try {
      window.location.href = url
      toast.success('SMS composer opened.')
    } catch {
      await handleCopy({ followUpScript: text })
      toast.error('Could not open SMS app. Script copied instead.')
    }
  }

  const printOnePager = () => {
    const payload = buildPayload()
    const carriers = carrierMatches()
    const uw = underwritingSnapshot()
    const premiumEst = estimatePremium(rec.perm)
    const premiumDisplay = premiumEst?.individual ? `$${premiumEst.individual}/month` : 'Pending'
    const html = `<!doctype html>
    <html>
    <head>
      <meta charset="utf-8" />
      <title>Life Insurance Recommendation</title>
      <style>
        body { font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial; padding: 24px; color: #111827 }
        h1 { font-size: 20px; margin-bottom: 8px }
        .muted { color: #6b7280 }
        .card { border: 1px solid #e5e7eb; padding: 12px; border-radius: 8px; margin-bottom: 12px }
        table { width:100%; border-collapse: collapse }
        td, th { padding: 6px 8px; text-align: left; border-bottom: 1px solid #f3f4f6 }
      </style>
    </head>
    <body>
      <h1>Life Insurance Recommendation</h1>
      <div class="muted">Generated: ${new Date().toLocaleString()}</div>

      <div class="card" style="background: #f0f9ff; border-color: #0284c7; border-left: 4px solid #0284c7;">
        <strong style="font-size: 16px;">Your Recommended Plan</strong>
        <div style="margin-top: 8px; font-size: 18px; color: #0c4a6e;"><strong>${rec.type} ${termLength ? `— ${termLength} years` : '(Permanent)'}</strong></div>
        <div style="margin-top: 4px; font-size: 24px; color: #0369a1;"><strong>${fmt.format(coverage)}</strong> Coverage</div>
        
        <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid #bae6fd;">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 8px;">
            <div>
              <div style="font-size: 12px; color: #0c4a6e;">Coverage Need</div>
              <div style="font-size: 14px; font-weight: 600; color: #0369a1;">${fmt.format(coverage)}</div>
            </div>
            <div>
              <div style="font-size: 12px; color: #0c4a6e;">Existing Coverage</div>
              <div style="font-size: 14px; font-weight: 600; color: #0369a1;">${fmt.format(Number(existingCoverage || 0))}</div>
            </div>
          </div>
          <div style="margin-top: 8px; padding: 8px; background: white; border-radius: 4px;">
            <div style="font-size: 12px; color: #6b7280;">Gap to Close</div>
            <div style="font-size: 16px; font-weight: 600; color: #059669;">${fmt.format(Math.max(0, coverage - Number(existingCoverage || 0)))}</div>
          </div>
        </div>

        <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid #bae6fd;">
          <div style="font-size: 12px; color: #0c4a6e;">Estimated Monthly Cost</div>
          <div style="font-size: 20px; font-weight: 600; color: #0369a1;">${premiumDisplay}</div>
          <div style="font-size: 11px; color: #6b7280; margin-top: 4px;">Based on age ${age}, ${healthRating} health rating${tobaccoUse ? ', tobacco use' : ''}</div>
        </div>

        <div style="margin-top: 12px; padding: 10px; background: #fef3c7; border-radius: 4px; border-left: 3px solid #f59e0b;">
          <div style="font-size: 13px; font-weight: 600; color: #92400e;">Next Steps</div>
          <ul style="margin: 6px 0 0 20px; padding: 0; font-size: 13px; color: #78350f;">
            <li>Confirm details above with your agent</li>
            <li>Schedule underwriting appointment</li>
            <li>Expect decision in 1-3 business days</li>
            <li>Coverage becomes effective on premium payment</li>
          </ul>
        </div>
      </div>

      <div class="card">
        <strong>Client & Agent Information</strong>
        <table>
          <tr><th>Client Name</th><td>${clientName || '-'}</td></tr>
          <tr><th>State</th><td>${clientState || '-'}</td></tr>
          <tr><th>Agent Name</th><td>${agentName || '-'}</td></tr>
          <tr><th>Agent License</th><td>${agentLicense || '-'}</td></tr>
        </table>
      </div>

      <div class="card">
        <strong>Financial Inputs</strong>
        <table>
          <tr><th>Age</th><td>${age || '-'}</td></tr>
          <tr><th>Marital Status</th><td>${maritalStatus || '-'}</td></tr>
          <tr><th>Income</th><td>${fmt.format(Number(income || 0))}</td></tr>
          <tr><th>Spouse Income</th><td>${fmt.format(Number(spouseIncome || 0))}</td></tr>
          <tr><th>Debt</th><td>${fmt.format(Number(debt || 0))}</td></tr>
          <tr><th>Mortgage</th><td>${fmt.format(Number(mortgage || 0))}</td></tr>
          <tr><th>Final Expenses</th><td>${fmt.format(Number(finalExpenses || 0))}</td></tr>
          <tr><th>Children</th><td>${children || 0}</td></tr>
          <tr><th>Other Dependents</th><td>${otherDependents || 0}</td></tr>
          <tr><th>Education Per Child</th><td>${fmt.format(Number(educationPerChild || 0))}</td></tr>
          <tr><th>Existing Coverage</th><td>${fmt.format(Number(existingCoverage || 0))}</td></tr>
          <tr><th>Liquid Assets</th><td>${fmt.format(Number(liquidAssets || 0))}</td></tr>
          <tr><th>SS Survivor Benefits (monthly)</th><td>${fmt.format(Number(socialSecurityMonthly || 0))}</td></tr>
          <tr><th>Coverage Horizon</th><td>${coverageHorizonYears} years</td></tr>
          <tr><th>Monthly Budget</th><td>${fmt.format(Number(monthlyBudget || 0))}</td></tr>
          <tr><th>Cash Value Preference</th><td>${cashValuePreference}</td></tr>
          <tr><th>Goal</th><td>${goal}</td></tr>
        </table>
      </div>

      <div class="card">
        <strong>Carrier Matches (suggested)</strong>
        <ul>${carriers.map(c => `<li><strong>${c.carrier}:</strong> ${c.product} — ${c.notes}</li>`).join('')}</ul>
      </div>

      <div class="card">
        <strong>Underwriting Snapshot</strong>
        <ul>
          <li>Age eligibility: ${uw.ageEligibility}</li>
          <li>Simplified issue: ${uw.simplifiedIssue}</li>
          <li>Medical exam: ${uw.medicalExam}</li>
          <li>Smoker impact: ${uw.smokerImpact}</li>
          <li class="muted">${uw.notes}</li>
        </ul>
      </div>

      <div class="card">
        <strong>Raw Recommendation Payload</strong>
        <pre style="white-space:pre-wrap; background:#f9fafb; padding:8px; border-radius:6px;">${JSON.stringify(payload, null, 2)}</pre>
      </div>

      <div class="muted">Prepared by ${process.env.NEXT_PUBLIC_BUSINESS_NAME || 'Safora'} — confirm carrier product names and offer details with underwriting/broker portal.</div>
      <div class="muted" style="margin-top:8px; font-size:12px;">Prepared for local advisors by ${process.env.NEXT_PUBLIC_OWNER_NAME || 'Insurance Advisor'}, ${process.env.NEXT_PUBLIC_BUSINESS_SUBTITLE || 'Professional Insurance Services'} (${process.env.NEXT_PUBLIC_BUSINESS_LOCATION || 'USA'})</div>
    </body>
    </html>`

    const w = window.open('', '_blank', 'noopener,noreferrer')
    if (!w) { alert('Unable to open print window. Please allow popups.'); return }
    w.document.open()
    w.document.write(html)
    w.document.close()
    w.focus()
    setTimeout(() => { w.print(); }, 300)
  }

  const printStrategyGuide = () => {
    const payload = buildPayload()
    const carriers = carrierMatches()
    const suggested = recommendCarrierByPriority()
    const assist = advisorKnowledgeAssist()
    const html = `<!doctype html>
    <html>
    <head>
      <meta charset="utf-8" />
      <title>Strategy Guide</title>
      <style>body{font-family:system-ui;padding:24px;color:#111827}h1{font-size:22px}table{width:100%;border-collapse:collapse}td,th{padding:8px;border-bottom:1px solid #eee}</style>
    </head>
    <body>
      <h1>Comprehensive Financial Strategy Guide</h1>
      <p><strong>Recommended:</strong> ${rec.type} ${termLength ? `— ${termLength} years` : '(Permanent)'}</p>
      <p><strong>Suggested Carrier:</strong> ${suggested.carrier} — ${suggested.notes}</p>
      <p><strong>Lead Stage:</strong> ${leadStage}</p>
      <h2>Why this over Roth IRA / Annuity</h2>
      <p>Summary: ${income && toNumber(income) > 160000 && goal === 'Retirement Income' ? 'Roth IRA Alternative: IUL provides tax-advantaged cash growth, no standard contribution caps, and policy loan flexibility.' : 'Policy chosen to match client goals.'}</p>
      <h2>Strategy Comparison</h2>
      <table>
        <thead><tr><th>Product Type</th><th>Death Benefit</th><th>Cash Growth</th><th>Tax Advantage</th><th>Best For</th></tr></thead>
        <tbody>
          <tr><td>Level Term</td><td>High</td><td>None</td><td>None</td><td>Lowest Cost Income Replacement</td></tr>
          <tr><td>Whole Life</td><td>High</td><td>Steady</td><td>Tax-Deferred</td><td>Legacy / Guaranteed</td></tr>
          <tr><td>Indexed Universal Life (IUL)</td><td>High</td><td>Upside (index-linked)</td><td>Tax-Advantaged loans/withdrawals</td><td>Wealth Accumulation & Retirement</td></tr>
          <tr><td>Roth IRA</td><td>—</td><td>Market Exposure</td><td>Tax-Free Growth (contribution limits)</td><td>Tax-Free Retirement Income (low-to-mid earners)</td></tr>
          <tr><td>Annuity</td><td>N/A</td><td>Guaranteed / Variable</td><td>Tax-Deferred</td><td>Guaranteed Income</td></tr>
        </tbody>
      </table>

      ${coverage >= 1000000 ? `<h3>Legacy Option</h3><p>Your calculated need is ${fmt.format(coverage)} — consider a ${fmt.format(coverage*2)} legacy option to protect 20 years of income vs 10 years. Human Life Value suggests planning for longer horizons when you have dependents or estate goals.</p>` : ''}

      ${toNumber(windfall) > 100000 ? `<h3>Single Premium Pathway</h3><p>With a cash windfall, a single premium IUL may be attractive. Be mindful of MEC limits — large single premiums can trigger Modified Endowment Contract taxation.</p>` : ''}

      <h3>Riders</h3>
      <p>${wantLivingBenefitAccess ? 'Recommend Chronic/Critical Illness Rider (Nationwide strong offering).' : 'Consider Chronic/Critical Illness Rider if you want access to death benefit while alive.'}</p>
      <p>${wantWaiverOfPremium ? 'Waiver of Premium recommended for disability protection.' : 'Consider Waiver of Premium to maintain coverage if disabled.'}</p>

      <h3>Advisor Knowledge Assist</h3>
      <p><strong>Talking Points</strong></p>
      <ul>${assist.points.map((p) => `<li>${p}</li>`).join('')}</ul>

      <p><strong>Objection Handling</strong></p>
      <ul>${assist.objections.map((o) => `<li><strong>${o.objection}</strong> ${o.response}</li>`).join('')}</ul>

      <p><strong>Compliance Notes</strong></p>
      <ul>${assist.complianceNotes.map((n) => `<li>${n}</li>`).join('')}</ul>

      <div style="margin-top:16px;font-size:12px;color:#6b7280">Prepared for local advisors by Sanjeev Jha, Namaste Boston Homes — Boston, MA</div>
    </body>
    </html>`

    const w = window.open('', '_blank', 'noopener,noreferrer')
    if (!w) { alert('Unable to open print window. Please allow popups.'); return }
    w.document.open()
    w.document.write(html)
    w.document.close()
    w.focus()
    setTimeout(() => { w.print(); }, 300)
  }

  // Helper: robust copy to clipboard with fallback
  const handleCopy = async (payload: any) => {
    const text = JSON.stringify(payload, null, 2)
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text)
        alert('Recommendation copied to clipboard')
        return
      }
    } catch (e) {
      // fallthrough to legacy method
    }

    try {
      const ta = document.createElement('textarea')
      ta.value = text
      ta.style.position = 'fixed'
      ta.style.left = '-9999px'
      document.body.appendChild(ta)
      ta.focus()
      ta.select()
      document.execCommand('copy')
      ta.remove()
      alert('Recommendation copied to clipboard')
    } catch (e) {
      alert('Copy failed — please copy manually')
    }
  }

  const handleDownload = (payload: any) => {
    try {
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'life-insurance-recommendation.json'
      document.body.appendChild(a)
      a.click()
      a.remove()
      setTimeout(() => URL.revokeObjectURL(url), 500)
    } catch (e) {
      alert('Download failed')
    }
  }

  const handleSave = async (payload: any) => {
    try {
      const res = await fetch('/api/recommendation', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      const json = await res.json()
      if (json?.ok) {
        alert('Saved recommendation to demo storage')
      } else {
        alert('Save failed')
      }
    } catch (e) {
      console.error(e)
      alert('Save failed')
    }
    try {
      const raw = localStorage.getItem('engagementScore')
      const n = raw ? Number(raw) : 0
      const next = Math.min(100, (isNaN(n) ? 0 : n) + 1)
      localStorage.setItem('engagementScore', String(next))
    } catch {}
  }

  // Save and return entry (demo API)
  const saveRecommendation = async (payload: any) => {
    try {
      const res = await fetch('/api/recommendation', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      const json = await res.json()
      if (json?.ok) return json.entry
    } catch (e) {
      console.error('saveRecommendation', e)
    }
    return null
  }

  const handleSaveAndStartApplication = async (payload: any) => {
    const entry = await saveRecommendation(payload)
    if (!entry) { alert('Save failed'); return }
    try { window.open(`/recommendation/${entry.id}`, '_blank') } catch { alert('Unable to open application view') }
  }

  const handleEmailRecommendation = async (payload: any, opts?: { recipientName?: string; recipientEmail?: string }) => {
    const entry = await saveRecommendation(payload)
    const link = entry ? `${location.origin}/recommendation/${entry.id}` : ''
    const subject = encodeURIComponent('Life Insurance Recommendation')

    const recipientName = opts?.recipientName || ''
    const greeting = recipientName ? `Hi ${recipientName},` : 'Hi,'
    const bodyText = `${greeting}\r\n\r\nHere is a recommended life insurance plan I prepared for you.\r\n\r\nCoverage: ${fmt.format(coverage)}\r\nType: ${rec.type}\r\nTerm: ${termLength ? `${termLength} years` : 'Permanent'}\r\n\r\nView full recommendation: ${link}\r\n\r\nBest,\r\nNamaste Insurance\r\n\r\nSanjeev`
    const body = encodeURIComponent(bodyText)

    try {
      // open mail client with optional recipient email
      const to = opts?.recipientEmail ? `${opts.recipientEmail}` : ''
      window.location.href = `mailto:${to}?subject=${subject}&body=${body}`

      // copy link to clipboard if possible
      try { if (link && navigator?.clipboard?.writeText) { navigator.clipboard.writeText(link).catch(() => {}) } } catch {}

      // show toast confirmation
      try { toast.success('Recommendation saved — mail client opened. Link copied to clipboard.') } catch {}
    } catch (e) {
      try { toast.error('Unable to open mail client. Recommendation link copied to clipboard.') } catch {}
      try { if (link && navigator?.clipboard?.writeText) await navigator.clipboard.writeText(link) } catch {}
    }
  }

  const handleAddToClientProfile = async (payload: any) => {
    const entry = await saveRecommendation(payload)
    if (entry) {
      alert('Added to client profile (demo)')
    } else {
      alert('Add to profile failed')
    }
  }

  const handlePrint = (payload: any) => {
    try {
      // try the existing print flow
      printOnePager()
    } catch (e) {
      try {
        const html = `<pre>${JSON.stringify(payload, null, 2)}</pre>`
        const w = window.open()
        if (!w) { throw new Error('Popup blocked') }
        w.document.open()
        w.document.write(html)
        w.document.close()
        w.focus()
        setTimeout(() => w.print(), 300)
      } catch (err) {
        alert('Print failed — please use your browser print or copy the result.')
      }
    }
  }

  const handleSchedule = (payload: any) => {
    // Use configured Calendly URL from environment
    const baseCalendlyUrl = process.env.NEXT_PUBLIC_CALENDLY_URL || 'https://calendly.com/namaste1'
    const calendlyUrl = baseCalendlyUrl + '?data=' + encodeURIComponent(JSON.stringify(payload))
    try {
      const w = window.open(calendlyUrl, '_blank')
      if (!w) {
        // fallback: show link to user
        prompt('Open this link to schedule:', calendlyUrl)
        return
      }
      try {
        const raw = localStorage.getItem('engagementScore')
        const n = raw ? Number(raw) : 0
        const next = Math.min(100, (isNaN(n) ? 0 : n) + 1)
        localStorage.setItem('engagementScore', String(next))
      } catch {}
    } catch (e) {
      prompt('Open this link to schedule:', calendlyUrl)
    }
  }

  return (
    <div>
      {emailModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setEmailModalOpen(false)} />
          <div className="relative bg-white rounded shadow-lg w-full max-w-md p-6">
            <h3 className="text-lg font-medium mb-2">Email Recommendation</h3>
            <div className="space-y-3">
              <label className="block">
                <span className="text-sm font-medium">Recipient Email</span>
                <input value={recipientEmail} onChange={(e) => setRecipientEmail(e.target.value)} className="mt-1 block w-full rounded-md border-gray-200 shadow-sm p-2" placeholder="recipient@example.com" />
              </label>

              <label className="block">
                <span className="text-sm font-medium">Recipient Name (optional)</span>
                <input value={recipientNameModal} onChange={(e) => setRecipientNameModal(e.target.value)} className="mt-1 block w-full rounded-md border-gray-200 shadow-sm p-2" placeholder="" />
              </label>
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setEmailModalOpen(false)} className="px-3 py-2 bg-white border rounded">Cancel</button>
              <button onClick={async () => {
                const payload = (window as any).__lastRecommendationPayload
                setEmailModalOpen(false)
                if (!payload) { toast.error('No recommendation to send'); return }
                await handleEmailRecommendation(payload, { recipientName: recipientNameModal || undefined, recipientEmail: recipientEmail || undefined })
              }} className="px-3 py-2 bg-blue-600 text-white rounded">Send</button>
            </div>
          </div>
        </div>
      )}
      {comparisonModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setComparisonModalOpen(false)} />
          <div className="relative bg-white rounded shadow-lg w-full max-w-3xl p-6 max-h-[80vh] overflow-auto">
            <h3 className="text-lg font-semibold mb-2">Strategy Comparison Scenarios</h3>
            <p className="text-sm text-gray-600 mb-4">These examples show how different products fit different goals. Insurance is protection first; some policies can also build cash value.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border rounded p-4">
                <div className="font-semibold">Scenario 1: Mortgage + Kids</div>
                <div className="text-sm text-gray-600">Age 32, income $90k, mortgage $350k, 2 kids</div>
                <div className="text-xs text-gray-600 mt-2">Need: $90k × 10 years × 1.34 ≈ $1.21M + $350k - $200k existing = ~$1.36M</div>
                <div className="text-xs text-gray-600 mt-1">Best fit: Term (lowest cost to cover the time-limited need)</div>
              </div>
              <div className="border rounded p-4">
                <div className="font-semibold">Scenario 2: Wealth Transfer</div>
                <div className="text-sm text-gray-600">Age 55, estate planning, wants guaranteed legacy</div>
                <div className="text-xs text-gray-600 mt-2">Best fit: Whole Life (guaranteed death benefit + stable cash value)</div>
              </div>
              <div className="border rounded p-4">
                <div className="font-semibold">Scenario 3: Retirement Flexibility</div>
                <div className="text-sm text-gray-600">Age 40, maxing 401k, wants tax-advantaged liquidity</div>
                <div className="text-xs text-gray-600 mt-2">Best fit: IUL (cash value potential + flexible premiums)</div>
              </div>
              <div className="border rounded p-4">
                <div className="font-semibold">Scenario 4: Roth IRA Comparison</div>
                <div className="text-sm text-gray-600">Contribute $7,000/year for 20 years at 7% growth</div>
                <div className="text-xs text-gray-600 mt-2">Future value ≈ $7,000 × 40.995 ≈ $287,000 (Roth IRA has contribution caps)</div>
                <div className="text-xs text-gray-600 mt-1">Insurance cash value may exceed caps but carries fees and policy risk.</div>
              </div>
            </div>

            <div className="mt-4 text-xs text-gray-500">Examples are illustrative only. Actual premiums, returns, and benefits depend on underwriting, carrier pricing, and policy design.</div>
            <div className="mt-4 flex justify-end">
              <button onClick={() => setComparisonModalOpen(false)} className="px-3 py-2 bg-white border rounded">Close</button>
            </div>
          </div>
        </div>
      )}
      <Toaster />
      <form onSubmit={handleSubmit} className="bg-white shadow-sm rounded-lg p-6">
        <div className="flex items-center gap-2 mb-6">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className={`flex-1 text-center py-2 rounded ${step === s ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
              Step {s}
            </div>
          ))}
        </div>

        {step === 1 && (
          <div className="space-y-4">
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded mb-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Professional Information</h3>
              <div className="space-y-3">
                <label className="block">
                  <span className="text-sm font-medium text-gray-700">Client Name *</span>
                  <input 
                    type="text" 
                    value={clientName} 
                    onChange={(e) => setClientName(e.target.value)} 
                    className="mt-1 block w-full rounded-md border-gray-200 shadow-sm focus:ring-indigo-500 focus:border-indigo-500" 
                    required 
                    placeholder="John Doe"
                    aria-invalid={!!errors.clientName}
                    aria-describedby={errors.clientName ? "client-name-error" : undefined}
                  />
                  {errors.clientName && <p id="client-name-error" className="mt-1 text-xs text-red-600">{errors.clientName}</p>}
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label className="block">
                    <span className="text-sm font-medium text-gray-700">State *</span>
                    <select 
                      value={clientState} 
                      onChange={(e) => setClientState(e.target.value)} 
                      className="mt-1 block w-full rounded-md border-gray-200 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                      required
                      aria-invalid={!!errors.clientState}
                      aria-describedby={errors.clientState ? "client-state-error" : undefined}
                    >
                      <option value="MA">Massachusetts</option>
                      <option value="NH">New Hampshire</option>
                      <option value="RI">Rhode Island</option>
                      <option value="CT">Connecticut</option>
                      <option value="VT">Vermont</option>
                      <option value="ME">Maine</option>
                      <option value="NY">New York</option>
                      <option value="Other">Other</option>
                    </select>
                    {errors.clientState && <p id="client-state-error" className="mt-1 text-xs text-red-600">{errors.clientState}</p>}
                  </label>

                  <label className="block">
                    <span className="text-sm font-medium text-gray-700">Agent Name (optional)</span>
                    <input 
                      type="text" 
                      value={agentName} 
                      onChange={(e) => setAgentName(e.target.value)} 
                      className="mt-1 block w-full rounded-md border-gray-200 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Agent name"
                    />
                  </label>
                </div>

                <label className="block">
                  <span className="text-sm font-medium text-gray-700">Agent License # (optional)</span>
                  <input 
                    type="text" 
                    value={agentLicense} 
                    onChange={(e) => setAgentLicense(e.target.value)} 
                    className="mt-1 block w-full rounded-md border-gray-200 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="License number"
                  />
                </label>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2">
                <input data-testid="comparison-mode" type="checkbox" checked={comparisonMode} onChange={(e) => setComparisonMode(e.target.checked)} className="h-4 w-4" />
                <span className="text-sm">Comparison Mode</span>
              </label>

              <label className="flex items-center gap-2">
                <span className="text-sm">Priority</span>
                <select value={priority} onChange={(e) => setPriority(e.target.value as any)} className="ml-2 rounded border-gray-200">
                  <option>Lowest Cost</option>
                  <option>Comprehensive Living Benefits</option>
                </select>
              </label>
            </div>
            <label className="block">
              <span className="text-sm font-medium text-gray-700">Age *</span>
              <input aria-invalid={!!errors.age} aria-describedby={errors.age ? "age-error" : undefined} type="number" min={0} max={85} value={age === "" ? "" : age} onChange={(e) => setAge(e.target.value === "" ? "" : Number(e.target.value))} className="mt-1 block w-full rounded-md border-gray-200 shadow-sm focus:ring-indigo-500 focus:border-indigo-500" required />
              {errors.age && <p id="age-error" className="mt-1 text-xs text-red-600">{errors.age}</p>}
            </label>

            <label className="block">
              <span className="text-sm font-medium text-gray-700">Annual Income (USD)</span>
              <input aria-invalid={!!errors.income} aria-describedby={errors.income ? "income-error" : undefined} type="number" min={0} value={income === "" ? "" : income} onChange={(e) => setIncome(e.target.value === "" ? "" : Number(e.target.value))} className="mt-1 block w-full rounded-md border-gray-200 shadow-sm focus:ring-indigo-500 focus:border-indigo-500" required />
              {errors.income && <p id="income-error" className="mt-1 text-xs text-red-600">{errors.income}</p>}
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="block">
                <span className="text-sm font-medium text-gray-700">Marital Status</span>
                <select value={maritalStatus} onChange={(e) => setMaritalStatus(e.target.value)} className="mt-1 block w-full rounded-md border-gray-200 shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
                  <option>Single</option>
                  <option>Married</option>
                  <option>Domestic Partnership</option>
                  <option>Divorced</option>
                  <option>Widowed</option>
                </select>
              </label>

              <label className="block">
                <span className="text-sm font-medium text-gray-700">Spouse/Partner Income (USD)</span>
                <input type="number" min={0} value={spouseIncome === "" ? "" : spouseIncome} onChange={(e) => setSpouseIncome(e.target.value === "" ? "" : Number(e.target.value))} className="mt-1 block w-full rounded-md border-gray-200 shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
              </label>
            </div>

            {maritalStatus === 'Married' && (
              <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded">
                <label className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    checked={considerJointPolicy} 
                    onChange={(e) => setConsiderJointPolicy(e.target.checked)} 
                    className="h-4 w-4" 
                  />
                  <div>
                    <span className="text-sm font-semibold">Consider Joint/Survivorship Policy?</span>
                    <p className="text-xs text-gray-600 mt-1">For estate planning, joint policies (second-to-die) provide death benefit when both spouses pass, often at lower cost. Common for wealth transfer strategies.</p>
                  </div>
                </label>
              </div>
            )}

            <label className="block">
              <span className="text-sm font-medium text-gray-700">Other Dependents (parents, others)</span>
              <input type="number" min={0} value={otherDependents === "" ? "" : otherDependents} onChange={(e) => setOtherDependents(e.target.value === "" ? "" : Number(e.target.value))} className="mt-1 block w-full rounded-md border-gray-200 shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
            </label>
            <div className="grid grid-cols-2 gap-4">
              <label className="block">
                <span className="text-sm font-medium text-gray-700">Replacement Years</span>
                <select value={replacementYears} onChange={(e) => setReplacementYears(Number(e.target.value))} className="mt-1 block w-full rounded-md border-gray-200 shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
                  <option value={5}>5 years</option>
                  <option value={10}>10 years</option>
                  <option value={15}>15 years</option>
                </select>
              </label>

              <label className="block">
                <span className="text-sm font-medium text-gray-700">Inflation Rate (annual %)</span>
                <input type="number" min={0} step={0.1} value={inflationRate} onChange={(e) => setInflationRate(Number(e.target.value))} className="mt-1 block w-full rounded-md border-gray-200 shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
              </label>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="mt-4">
            <label className="block">
              <span className="text-sm font-medium text-gray-700">One-time Lump Sum Cash (USD)</span>
              <input type="number" min={0} value={windfall === "" ? "" : windfall} onChange={(e) => setWindfall(e.target.value === "" ? "" : Number(e.target.value))} className="mt-1 block w-full rounded-md border-gray-200 shadow-sm" />
              <p className="mt-1 text-xs text-gray-500">Example: inheritance, bonus, home sale proceeds, or savings you could use to reduce insurance needs.</p>
            </label>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <label className="block">
              <span className="text-sm font-medium text-gray-700">Total Debt (USD)</span>
              <input type="number" min={0} value={debt === "" ? "" : debt} onChange={(e) => setDebt(e.target.value === "" ? "" : Number(e.target.value))} className="mt-1 block w-full rounded-md border-gray-200 shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-gray-700">Mortgage Balance (USD)</span>
              <input type="number" min={0} value={mortgage === "" ? "" : mortgage} onChange={(e) => setMortgage(e.target.value === "" ? "" : Number(e.target.value))} className="mt-1 block w-full rounded-md border-gray-200 shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-gray-700">Final Expenses (funeral, legal, USD)</span>
              <input type="number" min={0} value={finalExpenses} onChange={(e) => setFinalExpenses(Number(e.target.value || 0))} className="mt-1 block w-full rounded-md border-gray-200 shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-gray-700">Education Funding Per Child</span>
              <select value={educationPerChild} onChange={(e) => setEducationPerChild(Number(e.target.value))} className="mt-1 block w-full rounded-md border-gray-200 shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
                <option value={0}>No education funding</option>
                <option value={50000}>$50,000 (community college)</option>
                <option value={100000}>$100,000 (public university)</option>
                <option value={150000}>$150,000 (mix public/private)</option>
                <option value={200000}>$200,000 (private university)</option>
                <option value={250000}>$250,000 (premium education)</option>
              </select>
            </label>

            <label className="block">
              <span className="text-sm font-medium text-gray-700">Social Security Survivor Benefits (monthly estimate)</span>
              <select value={socialSecurityMonthly === "" ? "" : socialSecurityMonthly} onChange={(e) => setSocialSecurityMonthly(e.target.value === "" ? "" : Number(e.target.value))} className="mt-1 block w-full rounded-md border-gray-200 shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
                <option value="">Not sure / Don't include</option>
                <option value={1000}>$1,000/month</option>
                <option value={1500}>$1,500/month</option>
                <option value={2000}>$2,000/month</option>
                <option value={2500}>$2,500/month</option>
                <option value={3000}>$3,000/month</option>
              </select>
              <p className="mt-1 text-xs text-gray-500">Social Security survivor benefits can offset insurance needs. Estimate based on your earnings record.</p>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="block">
                <span className="text-sm font-medium text-gray-700">Existing Life Coverage (USD)</span>
                <input type="number" min={0} value={existingCoverage === "" ? "" : existingCoverage} onChange={(e) => setExistingCoverage(e.target.value === "" ? "" : Number(e.target.value))} className="mt-1 block w-full rounded-md border-gray-200 shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-gray-700">Liquid Assets Available (USD)</span>
                <input type="number" min={0} value={liquidAssets === "" ? "" : liquidAssets} onChange={(e) => setLiquidAssets(e.target.value === "" ? "" : Number(e.target.value))} className="mt-1 block w-full rounded-md border-gray-200 shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
              </label>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <label className="block">
              <span className="text-sm font-medium text-gray-700">Number of Children</span>
              <input type="number" min={0} value={children === "" ? "" : children} onChange={(e) => setChildren(e.target.value === "" ? "" : Number(e.target.value))} className="mt-1 block w-full rounded-md border-gray-200 shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-gray-700">Primary Goal</span>
              <select value={goal} onChange={(e) => setGoal(e.target.value)} className="mt-1 block w-full rounded-md border-gray-200 shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
                <option>Income Replacement</option>
                <option>Wealth Transfer</option>
                <option>Budget-Friendly</option>
                <option>Wealth Accumulation</option>
                <option>Retirement Income</option>
              </select>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="block">
                <span className="text-sm font-medium text-gray-700">Coverage Horizon (years)</span>
                <select value={coverageHorizonYears} onChange={(e) => setCoverageHorizonYears(Number(e.target.value))} className="mt-1 block w-full rounded-md border-gray-200 shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
                  <option value={10}>10 years</option>
                  <option value={15}>15 years</option>
                  <option value={20}>20 years</option>
                  <option value={25}>25 years</option>
                  <option value={30}>30 years</option>
                  <option value={35}>35 years</option>
                </select>
              </label>

              <label className="block">
                <span className="text-sm font-medium text-gray-700">Monthly Budget (USD)</span>
                <input type="number" min={0} value={monthlyBudget === "" ? "" : monthlyBudget} onChange={(e) => setMonthlyBudget(e.target.value === "" ? "" : Number(e.target.value))} className="mt-1 block w-full rounded-md border-gray-200 shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="block">
                <span className="text-sm font-medium text-gray-700">Policy Preference</span>
                <select value={policyPreference} onChange={(e) => setPolicyPreference(e.target.value as any)} className="mt-1 block w-full rounded-md border-gray-200 shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
                  <option>Not Sure</option>
                  <option>Term Only</option>
                  <option>Prefer Permanent</option>
                </select>
              </label>

              <label className="block">
                <span className="text-sm font-medium text-gray-700">Cash Value Preference</span>
                <select value={cashValuePreference} onChange={(e) => setCashValuePreference(e.target.value as any)} className="mt-1 block w-full rounded-md border-gray-200 shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
                  <option>None</option>
                  <option>Some</option>
                  <option>High</option>
                </select>
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="block">
                <span className="text-sm font-medium text-gray-700">Premium Style</span>
                <select value={premiumFlexibility} onChange={(e) => setPremiumFlexibility(e.target.value as any)} className="mt-1 block w-full rounded-md border-gray-200 shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
                  <option>Fixed</option>
                  <option>Flexible</option>
                </select>
              </label>

              <label className="block">
                <span className="text-sm font-medium text-gray-700">Risk Tolerance</span>
                <select value={riskTolerance} onChange={(e) => setRiskTolerance(e.target.value as any)} className="mt-1 block w-full rounded-md border-gray-200 shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
              </label>
            </div>

            <label className="block">
              <span className="text-sm font-medium text-gray-700">Tobacco Use</span>
              <div className="mt-1">
                <label className="inline-flex items-center">
                  <input type="checkbox" checked={tobaccoUse} onChange={(e) => setTobaccoUse(e.target.checked)} className="mr-2" />
                  <span className="text-sm">Tobacco / Nicotine use</span>
                </label>
              </div>
            </label>

            <label className="block">
              <span className="text-sm font-medium text-gray-700">Basic Health Rating</span>
              <select value={healthRating} onChange={(e) => setHealthRating(e.target.value)} className="mt-1 block w-full rounded-md border-gray-200 shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
                <option>Standard</option>
                <option>Preferred</option>
                <option>Super Preferred</option>
              </select>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={retirementIncomeNeed} onChange={(e) => setRetirementIncomeNeed(e.target.checked)} className="h-4 w-4" />
                <span className="text-sm">Need retirement income?</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={businessOwner} onChange={(e) => setBusinessOwner(e.target.checked)} className="h-4 w-4" />
                <span className="text-sm">Business owner?</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={estateNeed} onChange={(e) => setEstateNeed(e.target.checked)} className="h-4 w-4" />
                <span className="text-sm">Estate/legacy planning?</span>
              </label>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <div className="text-sm text-gray-600">
              Select optional riders and benefits to personalize your policy.
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={wantLivingBenefitAccess} onChange={(e) => setWantLivingBenefitAccess(e.target.checked)} className="h-4 w-4" />
                <span className="text-sm">Living Benefits (chronic/critical illness access)</span>
              </label>

              <label className="flex items-center gap-2">
                <input type="checkbox" checked={wantWaiverOfPremium} onChange={(e) => setWantWaiverOfPremium(e.target.checked)} className="h-4 w-4" />
                <span className="text-sm">Waiver of Premium (disability protection)</span>
              </label>

              <label className="flex items-center gap-2">
                <input type="checkbox" checked={wantChildRider} onChange={(e) => setWantChildRider(e.target.checked)} className="h-4 w-4" />
                <span className="text-sm">Child Term Rider</span>
              </label>

              <label className="flex items-center gap-2">
                <input type="checkbox" checked={wantAccidentalDeath} onChange={(e) => setWantAccidentalDeath(e.target.checked)} className="h-4 w-4" />
                <span className="text-sm">Accidental Death Benefit</span>
              </label>

              <label className="flex items-center gap-2">
                <input type="checkbox" checked={wantTermConversion} onChange={(e) => setWantTermConversion(e.target.checked)} className="h-4 w-4" />
                <span className="text-sm">Term Conversion Option</span>
              </label>

              <label className="flex items-center gap-2">
                <input type="checkbox" checked={wantGuaranteedInsurability} onChange={(e) => setWantGuaranteedInsurability(e.target.checked)} className="h-4 w-4" />
                <span className="text-sm">Guaranteed Insurability</span>
              </label>
            </div>
          </div>
        )}

        <div className="mt-6 flex items-center justify-between">
          <div>
            {step > 1 && (
              <button type="button" onClick={() => setStep((s) => s - 1)} className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">Back</button>
            )}
          </div>

          <div className="flex items-center gap-3">
            {step < 4 && (
              <button type="button" onClick={() => setStep((s) => s + 1)} className="inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">Next</button>
            )}
            {step === 4 && (
              <div className="flex items-center gap-2">
                <button type="submit" onClick={handleSubmit} className="inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-green-600 hover:bg-green-700">Get Recommendation</button>
                <button type="button" onClick={handleReset} className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">Reset</button>
              </div>
            )}
          </div>
        </div>
      </form>

      {submitted && (
        <div className="mt-6 bg-white shadow-lg rounded-lg p-8" aria-live="polite" tabIndex={-1} ref={liveRegionRef}>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Life Insurance Plan</h2>

          {(() => {
            const assist = advisorKnowledgeAssist()
            return (
              <div className="mb-4 rounded-md border border-blue-200 bg-blue-50 p-4">
                <h3 className="text-sm font-semibold text-blue-900">Advisor Knowledge Assist</h3>
                <p className="mt-1 text-xs text-blue-800">Use this script to guide your client conversation with consistent, compliance-aware language.</p>

                <div className="mt-3">
                  <div className="text-xs font-semibold text-blue-900">Talking Points</div>
                  <ul className="mt-1 list-disc pl-5 text-xs text-blue-900">
                    {assist.points.map((point, index) => (
                      <li key={`point-${index}`}>{point}</li>
                    ))}
                  </ul>
                </div>

                <div className="mt-3">
                  <div className="text-xs font-semibold text-blue-900">Objection Handling</div>
                  <ul className="mt-1 list-disc pl-5 text-xs text-blue-900">
                    {assist.objections.map((item, index) => (
                      <li key={`obj-${index}`}><strong>{item.objection}</strong> {item.response}</li>
                    ))}
                  </ul>
                </div>

                <div className="mt-3">
                  <div className="text-xs font-semibold text-blue-900">Compliance Notes</div>
                  <ul className="mt-1 list-disc pl-5 text-xs text-blue-900">
                    {assist.complianceNotes.map((note, index) => (
                      <li key={`compliance-${index}`}>{note}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )
          })()}

          <div className="mt-3 mb-6 rounded-md border border-gray-200 bg-gray-50 p-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <div className="text-xs text-gray-500">Lead Stage</div>
                <div className="text-sm text-gray-700">Track follow-up status for this recommendation.</div>
              </div>
              <select
                value={leadStage}
                onChange={(e) => {
                  const next = e.target.value as 'New' | 'Follow-up' | 'Closed'
                  setLeadStage(next)
                  try {
                    const raw = localStorage.getItem('lifeInsuranceInput')
                    const parsed = raw ? JSON.parse(raw) : {}
                    localStorage.setItem('lifeInsuranceInput', JSON.stringify({ ...parsed, leadStage: next }))
                  } catch {}
                }}
                className="rounded-md border-gray-300 text-sm"
              >
                <option value="New">New</option>
                <option value="Follow-up">Follow-up</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
          </div>
          
          {/* Main Recommendation Card */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-indigo-200 rounded-lg p-6 mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <div className="text-xs font-semibold text-indigo-600 uppercase tracking-wide">Recommended Type</div>
                <div className="mt-2 text-2xl font-bold text-indigo-900">{rec.type}</div>
                <div className="mt-1 text-sm text-indigo-700">{termLength ? `${termLength} year term` : `Permanent`}</div>
              </div>

              <div>
                <div className="text-xs font-semibold text-indigo-600 uppercase tracking-wide">Coverage Amount</div>
                <div className="mt-2 text-2xl font-bold text-indigo-900">{fmt.format(coverage)}</div>
                <div className="mt-1 text-sm text-indigo-700">Recommended Need</div>
              </div>

              <div>
                <div className="text-xs font-semibold text-indigo-600 uppercase tracking-wide">Coverage Gap</div>
                <div className="mt-2 text-2xl font-bold text-green-700">{fmt.format(Math.max(0, coverage - Number(existingCoverage || 0)))}</div>
                <div className="mt-1 text-sm text-green-700">To Close (after current coverage)</div>
              </div>
            </div>
          </div>

          {/* Budget Constraint Note */}
          {rec.budget === 'constrained' && (
            <div className="mb-6 bg-orange-50 border-l-4 border-orange-400 p-4 rounded">
              <div className="flex gap-3">
                <div className="flex-shrink-0">
                  <span className="text-orange-600 font-semibold">💡 Budget Note</span>
                </div>
                <div className="text-sm text-orange-800">
                  <p>Your goal is <strong>{goal.toLowerCase()}</strong>, which would benefit from permanent insurance. However, the full permanent recommendation would exceed your budget. The <strong>${termLength}-year term</strong> above provides your core income protection affordably.</p>
                  <p className="mt-2"><strong>To add permanent coverage for wealth transfer:</strong> You could add a smaller whole life policy ($250k-$500k) for estate/legacy purposes while keeping the term for income replacement.</p>
                </div>
              </div>
            </div>
          )}

          {/* Premium & Next Steps */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
            {/* Premium Estimate */}
            {(() => {
              const premiumEst = estimatePremium(rec.perm)
              if (premiumEst && premiumEst.individual > 0) {
                return (
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg p-6">
                    <div className="text-xs font-semibold text-green-700 uppercase tracking-wide">Monthly Cost (Estimate)</div>
                    <div className="mt-3">
                      <div className="text-3xl font-bold text-green-900">${premiumEst.individual}</div>
                      <div className="text-sm text-green-700">/month for {rec.type}</div>
                    </div>
                    {premiumEst.joint && (
                      <div className="mt-4 pt-4 border-t border-green-300">
                        <div className="text-sm text-green-700 mb-2">
                          <span className="font-semibold">Joint Option:</span> ${premiumEst.joint}/month
                        </div>
                        <div className="text-xs text-green-600">
                          Savings: ~${premiumEst.savings}/month vs. two individual policies
                        </div>
                      </div>
                    )}
                    <p className="text-xs text-gray-600 mt-4 pt-4 border-t border-green-300">
                      Based on age {age}, {healthRating} health{tobaccoUse ? ', tobacco use' : ''}. Actual premium varies by carrier.
                    </p>
                  </div>
                )
              }
              return null
            })()}

            {/* Next Steps */}
            <div className="bg-gradient-to-br from-amber-50 to-yellow-50 border-2 border-amber-200 rounded-lg p-6">
              <div className="text-xs font-semibold text-amber-700 uppercase tracking-wide">What Happens Next</div>
              <ol className="mt-3 space-y-3">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-amber-300 text-xs font-bold text-amber-900">1</span>
                  <span className="text-sm text-gray-700">Review details with your agent</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-amber-300 text-xs font-bold text-amber-900">2</span>
                  <span className="text-sm text-gray-700">Schedule underwriting appointment</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-amber-300 text-xs font-bold text-amber-900">3</span>
                  <span className="text-sm text-gray-700">Get decision in 1-3 business days</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-amber-300 text-xs font-bold text-amber-900">4</span>
                  <span className="text-sm text-gray-700">Coverage effective upon premium payment</span>
                </li>
              </ol>
            </div>
          </div>

          {/* Results Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="p-4 border rounded-md bg-gray-50">
              <div className="text-xs text-gray-500">Recommended Type</div>
              <div className="mt-1 text-sm font-medium text-gray-900">{rec.type}</div>
            </div>

            <div className="p-4 border rounded-md bg-gray-50">
              <div className="text-xs text-gray-500">Suggested Coverage</div>
              <div className="mt-1 text-sm font-medium text-gray-900">{fmt.format(coverage)}</div>
            </div>

            <div className="p-4 border rounded-md bg-gray-50">
              <div className="text-xs text-gray-500">Recommended Term Length</div>
              <div className="mt-1 text-sm font-medium text-gray-900">{termLength ? `${termLength} years` : "Not applicable (Permanent)"}</div>
            </div>
          </div>

          {/* Premium Estimate */}
          {(() => {
            const premiumEst = estimatePremium(rec.perm)
            if (premiumEst && premiumEst.individual > 0) {
              return (
                <div className="mt-4 bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
                  <div className="text-sm font-semibold text-gray-900 mb-2">Estimated Monthly Premium</div>
                  {premiumEst.joint ? (
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-700">Individual Policy:</span>
                        <span className="text-sm font-medium">${premiumEst.individual}/month</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-700">Joint/Survivorship Policy:</span>
                        <span className="text-sm font-medium">${premiumEst.joint}/month</span>
                      </div>
                      <div className="flex justify-between text-green-700">
                        <span className="text-sm font-semibold">Est. Joint Savings:</span>
                        <span className="text-sm font-semibold">~${premiumEst.savings}/month (${premiumEst.savings * 12}/year)</span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-gray-700">
                      Estimated monthly premium: <span className="font-medium">${premiumEst.individual}/month</span>
                    </div>
                  )}
                  <p className="text-xs text-gray-600 mt-2">
                    *Estimate based on age, health rating, tobacco use, and coverage amount. Actual premium may vary based on underwriting and carrier-specific rates. Final rates provided by carrier upon application.
                  </p>
                </div>
              )
            }
            return null
          })()}

          {/* Rider Compatibility Warnings */}
          {(() => {
            const riderWarnings = validateRiders()
            if (riderWarnings.length > 0) {
              return (
                <div className="mt-4 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                  <div className="text-sm font-semibold text-gray-900 mb-2">Rider Compatibility Notes</div>
                  <ul className="list-disc pl-5 space-y-1">
                    {riderWarnings.map((warning, idx) => (
                      <li key={idx} className="text-sm text-gray-700">{warning}</li>
                    ))}
                  </ul>
                </div>
              )
            }
            return null
          })()}

          {/* IUL Risk Disclosure */}
          {rec.type && (rec.type.toLowerCase().includes('iul') || rec.type.toLowerCase().includes('indexed')) && (
            <div className="mt-4 bg-orange-50 border-l-4 border-orange-400 p-4 rounded">
              <p className="text-sm text-gray-900">
                <strong>IUL Risk Disclosure:</strong> Indexed Universal Life policies involve market risk, fees, caps, and participation rates that can significantly impact returns. Cash value growth is tied to market indices but is not guaranteed. Policy performance depends on credited interest rates, which may vary. IUL policies require ongoing monitoring and may need premium adjustments to maintain coverage. Understand policy charges, surrender periods, and potential for lapse before purchasing. Always review detailed illustrations with a licensed agent.
              </p>
            </div>
          )}

          {/* Estate Planning Warning */}
          {estateNeed && coverage < 1000000 && (
            <div className="mt-4 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
              <p className="text-sm text-gray-900">
                <strong>Estate Planning Notice:</strong> You indicated estate planning needs. Most estate planning strategies require $1M+ coverage for effective wealth transfer and estate tax mitigation. Consider consulting with an estate planning attorney and insurance specialist to determine appropriate coverage levels.
              </p>
            </div>
          )}

          <div className="mt-4 text-sm text-gray-600">
            <strong>Notes:</strong> Coverage uses a DIME-based model: Debt + Mortgage + (Income × Replacement Years × inflation adjustment) + Education + Final Expenses, minus Existing Coverage, Liquid Assets, Windfall, and Social Security Survivor Benefits. Adjust with agent advice as needed.
          </div>

          {/* Strategy Comparison & Educational UI */}
          {comparisonMode && (
            <div className="mt-4 bg-indigo-50 p-4 rounded border border-indigo-200">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Strategy Comparison (Protection vs. Investment)</h3>
                <button type="button" onClick={() => setComparisonModalOpen(true)} className="text-sm text-indigo-700 underline">View 4 scenario examples</button>
              </div>
              <p className="text-xs text-gray-600 mt-1">Insurance is primarily protection. Some policies add cash value features, but they are not pure investment accounts.</p>
              <div className="overflow-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs text-gray-500"><th>Product Type</th><th>Death Benefit</th><th>Cash Growth</th><th>Tax Advantage</th><th>Best For</th></tr>
                  </thead>
                  <tbody>
                    <tr className="border-t"><td>Level Term</td><td>High</td><td>None</td><td>None</td><td>Lowest Cost Income Replacement</td></tr>
                    <tr className="border-t"><td>Whole Life</td><td>High</td><td>Steady</td><td>Tax-Deferred</td><td>Legacy / Guaranteed</td></tr>
                    <tr className="border-t"><td>IUL</td><td>High</td><td>Indexed Upside</td><td>Tax-Advantaged loans</td><td>Wealth Accumulation</td></tr>
                    <tr className="border-t"><td>Roth IRA</td><td>—</td><td>Market</td><td>Tax-Free (caps)</td><td>Tax-Free Retirement</td></tr>
                    <tr className="border-t"><td>Annuity</td><td>N/A</td><td>Guaranteed/Variable</td><td>Tax-Deferred</td><td>Guaranteed Income</td></tr>
                  </tbody>
                </table>
              </div>
              <div className="mt-4 text-sm text-gray-700 space-y-2">
                <div className="font-semibold">Quick math example (income replacement)</div>
                <div>Assume $90,000 income, 10 years, 3% inflation:</div>
                <div className="text-xs text-gray-600">Calculation: $90,000 × 10 × (1.03)^{10} ≈ $1.21M</div>
                <div className="text-xs text-gray-600">If debt + mortgage = $350k and existing coverage = $200k, net need ≈ $1.36M.</div>
                <div className="mt-2 font-semibold">Roth IRA quick math (illustrative)</div>
                <div className="text-xs text-gray-600">$7,000/year × 20 years at 7% ≈ $287,000. Roth IRA has annual contribution caps.</div>
              </div>
            </div>
          )}

          {/* Suggested Strategy */}
          <div className="mt-4 bg-gray-50 p-4 rounded-md">
            <div className="text-sm font-medium text-gray-700">Suggested Strategy</div>
            <div className="mt-2 text-sm text-gray-600">
              { (toNumber(mortgage) > 0 && toNumber(children) > 0 && toNumber(age) < 50) ? (
                <div>
                  We suggest splitting coverage into two term policies to optimize premium costs: one policy to cover the mortgage and a second policy to cover family replacement needs. Example split:
                  <ul className="list-disc pl-5 mt-2">
                    <li><strong>Mortgage:</strong> {fmt.format(Number(mortgage || 0))} — {termLength ? `${termLength} years` : 'term as appropriate'}</li>
                    <li><strong>Family / Income Replacement:</strong> {fmt.format(Math.max(0, coverage - Number(mortgage || 0)))} — {termLength ? `${termLength} years` : 'term as appropriate'}</li>
                  </ul>
                </div>
              ) : (
                <div>Standard strategy: recommend the product that best fits the client's goal and budget. Consider laddering term lengths where appropriate.</div>
              )}
            </div>
          </div>

          <div className="mt-4 bg-white p-4 rounded border">
            <div className="text-sm font-medium text-gray-700">Selected Riders</div>
            {selectedRiders.length === 0 ? (
              <div className="mt-2 text-sm text-gray-600">No riders selected. You can add riders in Step 4.</div>
            ) : (
              <ul className="mt-2 list-disc pl-5 text-sm text-gray-600">
                {selectedRiders.map((rider) => (
                  <li key={rider}>{rider}</li>
                ))}
              </ul>
            )}
          </div>

          {/* Gated details */}
          <div className="mt-4">
            <div className="text-sm font-medium text-gray-700">Details</div>
            {!unlocked ? (
              <div className="mt-2">
                <div className="text-sm text-gray-600">Full DIME Breakdown and carrier-specific recommendations are available after you provide an email.</div>
                <div className="mt-2 flex gap-2">
                  <input placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)} className="block w-full rounded-md border-gray-200 shadow-sm p-2" />
                  <button onClick={() => {
                    const re = /^\S+@\S+\.\S+$/
                    if (!email || !re.test(email)) { alert('Please enter a valid email'); return }
                    setUnlocked(true)
                    try {
                      const payload = buildPayload()
                      localStorage.setItem('lifeInsuranceInput', JSON.stringify({ ...payload.inputs, email, unlocked: true }))
                    } catch {}
                    try {
                      const raw = localStorage.getItem('engagementScore')
                      const n = raw ? Number(raw) : 0
                      const next = Math.min(100, (isNaN(n) ? 0 : n) + 1)
                      localStorage.setItem('engagementScore', String(next))
                    } catch {}
                  }} className="inline-flex items-center px-3 py-2 bg-indigo-600 text-white rounded-md">Unlock Details</button>
                </div>
              </div>
            ) : (
              <div className="mt-2 space-y-3">
                <div className="text-sm text-gray-700">Full DIME Breakdown:</div>
                <div className="text-sm text-gray-600">
                  Debt: {fmt.format(Number(debt || 0))}<br />
                  Mortgage: {fmt.format(Number(mortgage || 0))}<br />
                  Income replacement ({replacementYears} years, {inflationRate}% inflation): {fmt.format(toNumber(income) * replacementYears * Math.pow(1 + (Number(inflationRate) || 0)/100, replacementYears))}<br />
                  Education ({toNumber(children) + toNumber(otherDependents)} dependents @ {fmt.format(toNumber(educationPerChild))}): {fmt.format((toNumber(children) + toNumber(otherDependents)) * toNumber(educationPerChild))}<br />
                  Final expenses: {fmt.format(Number(finalExpenses || 0))}<br />
                  Existing coverage: -{fmt.format(toNumber(existingCoverage))}<br />
                  Liquid assets: -{fmt.format(toNumber(liquidAssets))}<br />
                  Windfall: -{fmt.format(toNumber(windfall))}<br />
                  Social Security survivor benefits ({replacementYears} years): -{fmt.format(toNumber(socialSecurityMonthly) * 12 * replacementYears)}<br />
                  <strong>Total Net Need:</strong> {fmt.format(coverage)}
                </div>

                <div>
                  <div className="text-sm font-medium text-gray-700">Specific Carrier Recommendations</div>
                  <ul className="mt-2 list-disc pl-5 text-sm text-gray-600">
                    {carrierMatches().map((c, i) => (
                      <li key={i}><strong>{c.carrier}:</strong> {c.product} — {c.notes}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>

          <div className="mt-4">
            {/* Rider selection module */}
            <div className="mb-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={wantLivingBenefitAccess} onChange={(e) => setWantLivingBenefitAccess(e.target.checked)} className="h-4 w-4" />
                <span className="text-sm">Would you like to access your death benefit while alive if you get sick? (Chronic/Critical illness)</span>
              </label>

              <label className="flex items-center gap-2">
                <input type="checkbox" checked={wantWaiverOfPremium} onChange={(e) => setWantWaiverOfPremium(e.target.checked)} className="h-4 w-4" />
                <span className="text-sm">If you become disabled, keep coverage active? (Waiver of Premium)</span>
              </label>
            </div>

            {/* Educational callouts */}
            {income && toNumber(income) > 160000 && goal === 'Retirement Income' && (
              <div className="mb-3 p-3 rounded border bg-yellow-50 text-sm text-yellow-800">
                <strong>Roth IRA Alternative:</strong> For higher earners, an IUL can act as a Roth alternative — no standard contribution caps, tax-advantaged cash growth, and policy loans. It can be superior for flexible retirement liquidity.
              </div>
            )}

            {toNumber(windfall) > 100000 && (
              <div className="mb-3 p-3 rounded border bg-blue-50 text-sm text-blue-800">
                <strong>Single Premium Pathway:</strong> With a cash windfall, consider a single-premium IUL. Note: large single premiums can create MEC tax treatment — consult underwriting.
              </div>
            )}

            {coverage >= 1000000 && (
              <div className="mb-3 p-3 rounded border bg-gray-50 text-sm text-gray-800">
                <strong>Legacy Option:</strong> Your need is {fmt.format(coverage)}. Consider a {fmt.format(coverage * 2)} legacy option to protect a longer horizon (HLV — 20 years vs 10 years rationale).
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={() => {
                const payload = buildPayload()
                void handleCopy(payload)
              }} className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">Copy Result</button>

              <button type="button" onClick={() => {
                const payload = buildPayload()
                handleDownload(payload)
              }} className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">Download JSON</button>

              <button type="button" onClick={async () => {
                const payload = buildPayload()
                await handleSaveAndStartApplication(payload)
              }} className="inline-flex items-center px-3 py-2 border border-indigo-600 rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">Start Application</button>

              <button type="button" onClick={() => {
                const payload = buildPayload()
                printStrategyGuide()
              }} className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">Download Strategy Guide (PDF)</button>

              <button type="button" onClick={() => {
                const payload = buildPayload()
                setRecipientEmail(email || '')
                setRecipientNameModal('')
                // store payload on the window for modal send action (lightweight approach)
                ;(window as any).__lastRecommendationPayload = payload
                setEmailModalOpen(true)
              }} className="inline-flex items-center px-3 py-2 border border-blue-600 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">Email Recommendation</button>

              <button type="button" onClick={async () => {
                const payload = buildPayload()
                await handleAddToClientProfile(payload)
              }} className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">Add to Client Profile</button>

              <button type="button" onClick={() => {
                const payload = buildPayload()
                handleSchedule(payload)
              }} className="inline-flex items-center px-3 py-2 border border-green-600 rounded-md text-sm font-medium text-white bg-green-600 hover:bg-green-700">Schedule Consultation</button>

              <button type="button" onClick={() => void handleShareWhatsApp()} className="inline-flex items-center px-3 py-2 border border-emerald-600 rounded-md text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700">Share Script via WhatsApp</button>

              <button type="button" onClick={() => void handleShareSms()} className="inline-flex items-center px-3 py-2 border border-sky-600 rounded-md text-sm font-medium text-white bg-sky-600 hover:bg-sky-700">Share Script via SMS</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
