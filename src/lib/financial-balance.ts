/**
 * Educational portfolio balance analysis — not investment advice.
 * Helps users see allocation gaps across common account types.
 */

export type AccountCategory =
  | "emergency"
  | "retirement_tax_deferred"
  | "retirement_roth"
  | "taxable_brokerage"
  | "insurance"
  | "real_estate"
  | "other"

export type AccountInput = {
  category: AccountCategory
  label: string
  balance: number
  monthlyContribution?: number
}

export type BalanceInputs = {
  age: number
  annualIncome: number
  monthlyExpenses: number
  accounts: AccountInput[]
  mortgageBalance?: number
  lifeInsuranceCoverage?: number
  hasDependents?: boolean
}

export type BalanceRecommendation = {
  priority: "high" | "medium" | "low"
  category: AccountCategory
  title: string
  reason: string
  suggestedAction: string
}

export type BalanceAnalysis = {
  totalAssets: number
  allocation: Record<AccountCategory, number>
  allocationPercent: Record<AccountCategory, number>
  emergencyFundMonths: number
  retirementSavingsRate: number
  insuranceCoverageRatio: number
  realEstateConcentration: number
  recommendations: BalanceRecommendation[]
  summary: string
}

const CATEGORY_LABELS: Record<AccountCategory, string> = {
  emergency: "Emergency fund",
  retirement_tax_deferred: "401(k) / tax-deferred",
  retirement_roth: "Roth IRA / Roth 401(k)",
  taxable_brokerage: "Taxable brokerage",
  insurance: "Cash value / insurance",
  real_estate: "Real estate equity",
  other: "Other assets",
}

export function categoryLabel(category: AccountCategory): string {
  return CATEGORY_LABELS[category]
}

function sumByCategory(accounts: AccountInput[], category: AccountCategory): number {
  return accounts
    .filter((a) => a.category === category)
    .reduce((sum, a) => sum + Math.max(0, a.balance), 0)
}

function monthlyContributions(accounts: AccountInput[]): number {
  return accounts.reduce((sum, a) => sum + Math.max(0, a.monthlyContribution ?? 0), 0)
}

export function analyzeBalance(inputs: BalanceInputs): BalanceAnalysis {
  const accounts = inputs.accounts.filter((a) => a.balance > 0 || (a.monthlyContribution ?? 0) > 0)
  const totalAssets = accounts.reduce((sum, a) => sum + Math.max(0, a.balance), 0)

  const categories: AccountCategory[] = [
    "emergency",
    "retirement_tax_deferred",
    "retirement_roth",
    "taxable_brokerage",
    "insurance",
    "real_estate",
    "other",
  ]

  const allocation = Object.fromEntries(
    categories.map((c) => [c, sumByCategory(accounts, c)])
  ) as Record<AccountCategory, number>

  const allocationPercent = Object.fromEntries(
    categories.map((c) => [
      c,
      totalAssets > 0 ? Math.round((allocation[c] / totalAssets) * 100) : 0,
    ])
  ) as Record<AccountCategory, number>

  const emergency = allocation.emergency
  const monthlyExpenses = Math.max(inputs.monthlyExpenses, 1)
  const emergencyFundMonths = emergency / monthlyExpenses

  const retirementTotal = allocation.retirement_tax_deferred + allocation.retirement_roth
  const retirementSavingsRate =
    inputs.annualIncome > 0
      ? Math.round((monthlyContributions(accounts) * 12 / inputs.annualIncome) * 100)
      : 0

  const lifeCoverage = inputs.lifeInsuranceCoverage ?? sumByCategory(accounts, "insurance")
  const incomeMultiple = inputs.annualIncome > 0 ? lifeCoverage / inputs.annualIncome : 0
  const insuranceCoverageRatio = Math.round(incomeMultiple * 10) / 10

  const realEstateConcentration = allocationPercent.real_estate

  const recommendations: BalanceRecommendation[] = []

  if (emergencyFundMonths < 3) {
    recommendations.push({
      priority: "high",
      category: "emergency",
      title: "Build your emergency fund first",
      reason: `You have about ${emergencyFundMonths.toFixed(1)} months of expenses saved. Most planners suggest 3–6 months before aggressive investing.`,
      suggestedAction: "Direct new savings to a high-yield savings account until you reach at least 3 months of expenses.",
    })
  } else if (emergencyFundMonths < 6 && inputs.hasDependents) {
    recommendations.push({
      priority: "medium",
      category: "emergency",
      title: "Strengthen emergency reserves",
      reason: "With dependents, a 6-month cushion reduces pressure during income disruptions.",
      suggestedAction: "Increase monthly emergency contributions before adding risk in brokerage accounts.",
    })
  }

  if (inputs.age < 50 && allocation.retirement_roth === 0 && allocation.retirement_tax_deferred > 0) {
    recommendations.push({
      priority: "medium",
      category: "retirement_roth",
      title: "Add tax diversification with Roth",
      reason: "Your retirement savings appear heavily tax-deferred. Roth accounts can provide tax-free income in retirement.",
      suggestedAction: "Consider Roth IRA or Roth 401(k) contributions if eligible, after any employer match.",
    })
  }

  if (retirementSavingsRate < 15 && inputs.age < 55) {
    recommendations.push({
      priority: retirementSavingsRate < 10 ? "high" : "medium",
      category: "retirement_tax_deferred",
      title: "Increase retirement savings rate",
      reason: `Estimated savings rate is ${retirementSavingsRate}%. Many guidelines suggest 15%+ of gross income for retirement.`,
      suggestedAction: "Raise 401(k) deferrals to capture full employer match, then increase by 1% annually.",
    })
  }

  if (allocationPercent.taxable_brokerage > 25 && emergencyFundMonths < 6) {
    recommendations.push({
      priority: "medium",
      category: "taxable_brokerage",
      title: "Rebalance toward safety before brokerage growth",
      reason: "Taxable investments are a large share of assets while emergency reserves are still building.",
      suggestedAction: "Pause new brokerage contributions temporarily and redirect to emergency or retirement accounts.",
    })
  }

  if (inputs.hasDependents && insuranceCoverageRatio < 8) {
    recommendations.push({
      priority: "high",
      category: "insurance",
      title: "Review life insurance protection",
      reason: `Coverage is roughly ${insuranceCoverageRatio}x annual income. Families often target 10–15x income for income replacement.`,
      suggestedAction: "Use the life insurance tool to estimate needs, then consult a licensed agent for product selection.",
    })
  }

  if (realEstateConcentration > 60) {
    recommendations.push({
      priority: "medium",
      category: "real_estate",
      title: "Reduce real estate concentration",
      reason: `${realEstateConcentration}% of assets are in real estate. Heavy concentration increases liquidity and market risk.`,
      suggestedAction: "Prioritize liquid retirement and brokerage accounts before additional property purchases.",
    })
  }

  if (allocation.retirement_tax_deferred === 0 && allocation.retirement_roth === 0 && inputs.age >= 25) {
    recommendations.push({
      priority: "high",
      category: "retirement_tax_deferred",
      title: "Start retirement contributions",
      reason: "No retirement account balances were entered. Time in market matters for long-term goals.",
      suggestedAction: "Open or fund a 401(k) or IRA and automate monthly contributions.",
    })
  }

  if (recommendations.length === 0) {
    recommendations.push({
      priority: "low",
      category: "other",
      title: "Portfolio looks reasonably balanced",
      reason: "Based on the information provided, no major gaps stand out. Review annually or after life changes.",
      suggestedAction: "Schedule a class or consultation to validate assumptions and update your plan.",
    })
  }

  const priorityOrder = { high: 0, medium: 1, low: 2 }
  recommendations.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])

  const topFocus = recommendations.slice(0, 2).map((r) => r.title).join("; ")
  const summary =
    recommendations[0]?.priority === "low"
      ? "Your inputs suggest a balanced starting point. Keep reviewing as your income and goals change."
      : `Focus areas: ${topFocus}. These are educational prompts — not personalized investment advice.`

  return {
    totalAssets,
    allocation,
    allocationPercent,
    emergencyFundMonths: Math.round(emergencyFundMonths * 10) / 10,
    retirementSavingsRate,
    insuranceCoverageRatio,
    realEstateConcentration,
    recommendations,
    summary,
  }
}
