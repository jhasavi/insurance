import {
  generateAdvisorExplanation,
  scenarioFromDraft,
  type AdvisorDraftFields,
} from "../src/lib/planning-rules"

const baseDraft: AdvisorDraftFields = {
  age: 58,
  spouseAge: 56,
  annualIncome: 140000,
  spouseIncome: 60000,
  monthlyExpenses: 7000,
  accounts: [
    { category: "emergency", balance: 15000 },
    { category: "retirement_tax_deferred", balance: 800000 },
    { category: "retirement_roth", balance: 50000 },
    { category: "taxable_brokerage", balance: 120000 },
    { category: "real_estate", balance: 400000 },
  ],
  termLifeCoverage: 500000,
  permLifeDeathBenefit: 0,
  cashValueLife: 0,
  active401k: 0,
  old401k: 0,
  primaryHome: 0,
  rentalEquity: 0,
  mortgageDebt: 250000,
  dependentCount: 0,
  hasDependents: false,
  maritalStatus: "married",
  filingStatus: "mfj",
  plannedRetirementAge: 65,
  retirementStatus: "working",
  pensionIncome: 0,
  ssAt62: 2200,
  ssAtFRA: 3100,
  ssAt70: 3900,
  insuranceType: "term",
  termExpirationAge: 65,
  medicareStatus: "within_2_years",
  socialSecurityStatus: "planning",
  ltcConcern: "moderate",
  goalPriorities: ["tax_reduction", "retirement_income"],
}

const scenario = scenarioFromDraft(baseDraft)
const explanation = generateAdvisorExplanation(scenario)

if (explanation.snapshot.length < 10) {
  throw new Error(`Expected rich snapshot, got ${explanation.snapshot.length} rows`)
}

if (explanation.observations.length === 0) {
  throw new Error("Expected at least one planning observation")
}

if (explanation.riskFlags.length < 5) {
  throw new Error(`Expected multiple risk flags, got ${explanation.riskFlags.length}`)
}

if (explanation.explanationLogic.length === 0) {
  throw new Error("Expected explanation logic items")
}

if (explanation.clientQuestions.length < 5 || explanation.clientQuestions.length > 8) {
  throw new Error(`Expected 5–8 client questions, got ${explanation.clientQuestions.length}`)
}

if (!explanation.disclaimer.includes("educational")) {
  throw new Error("Disclaimer should mention educational purpose")
}

const taxDeferredFlag = explanation.riskFlags.find((f) => f.id === "rmd-pressure")
if (!taxDeferredFlag || taxDeferredFlag.level === "green") {
  throw new Error("Expected RMD pressure flag for tax-deferred heavy scenario")
}

console.log("planning-rules: all checks passed")
