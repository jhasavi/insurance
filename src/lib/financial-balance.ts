/**
 * Educational portfolio balance analysis — not investment advice.
 */

import { BALANCE_REFERENCES, type BalanceReference } from "@/lib/balance-references"

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

export type LifeContext = {
  maritalStatus?: "single" | "married" | "partnered"
  spouseAnnualIncome?: number
  spouseRetirementBalance?: number
  dependentCount?: number
  collegeFundingNeeded?: number
  healthConcerns?: boolean
  immigrationUncertain?: boolean
  active401kBalance?: number
  old401kBalance?: number
  /** Term life death benefit (protection) */
  termLifeCoverage?: number
  /** Whole / universal / IUL death benefit — counted toward protection total */
  permanentLifeDeathBenefit?: number
  /** Cash surrender value — asset only, not death benefit */
  cashValueLifeBalance?: number
  primaryHomeEquity?: number
  rentalPropertyEquity?: number
  overseasAssets?: number
  cryptoOrDigitalAssets?: number
}

export type BalanceInputs = {
  age: number
  annualIncome: number
  monthlyExpenses: number
  accounts: AccountInput[]
  hasDependents?: boolean
  lifeContext?: LifeContext
}

export type BalanceRecommendation = {
  priority: "high" | "medium" | "low"
  category: AccountCategory
  title: string
  reason: string
  suggestedAction: string
  references: BalanceReference[]
}

export type LifeCoverageBreakdown = {
  term: number
  permanent: number
  total: number
}

export type BalanceAnalysis = {
  totalAssets: number
  householdIncome: number
  allocation: Record<AccountCategory, number>
  allocationPercent: Record<AccountCategory, number>
  emergencyFundMonths: number
  emergencyFundTargetMonths: number
  retirementSavingsRate: number
  insuranceCoverageRatio: number
  lifeCoverage: LifeCoverageBreakdown
  realEstateConcentration: number
  recommendations: BalanceRecommendation[]
  summary: string
  contextNotes: string[]
}

const CATEGORY_LABELS: Record<AccountCategory, string> = {
  emergency: "Emergency fund",
  retirement_tax_deferred: "401(k) / tax-deferred",
  retirement_roth: "Roth IRA / Roth 401(k)",
  taxable_brokerage: "Taxable brokerage & stocks",
  insurance: "Cash value (asset)",
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

function n(v: number | undefined): number {
  return Math.max(0, v ?? 0)
}

function rec(
  partial: Omit<BalanceRecommendation, "references"> & { references?: BalanceReference[] }
): BalanceRecommendation {
  return { references: [], ...partial }
}

export function analyzeBalance(inputs: BalanceInputs): BalanceAnalysis {
  const ctx = inputs.lifeContext ?? {}
  const accounts = inputs.accounts.filter((a) => a.balance > 0 || (a.monthlyContribution ?? 0) > 0)

  const extraRetirement =
    n(ctx.spouseRetirementBalance) + n(ctx.active401kBalance) + n(ctx.old401kBalance)
  const extraRealEstate = n(ctx.primaryHomeEquity) + n(ctx.rentalPropertyEquity)
  const extraOther = n(ctx.overseasAssets) + n(ctx.cryptoOrDigitalAssets)
  const extraInsurance = n(ctx.cashValueLifeBalance)

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
    categories.map((c) => {
      let total = sumByCategory(accounts, c)
      if (c === "retirement_tax_deferred") total += extraRetirement
      if (c === "real_estate") total += extraRealEstate
      if (c === "other") total += extraOther
      if (c === "insurance") total += extraInsurance
      return [c, total]
    })
  ) as Record<AccountCategory, number>

  const totalAssets = categories.reduce((sum, c) => sum + allocation[c], 0)

  const allocationPercent = Object.fromEntries(
    categories.map((c) => [
      c,
      totalAssets > 0 ? Math.round((allocation[c] / totalAssets) * 100) : 0,
    ])
  ) as Record<AccountCategory, number>

  const monthlyExpenses = Math.max(inputs.monthlyExpenses, 1)
  const emergencyFundMonths = allocation.emergency / monthlyExpenses

  const spouseIncome = n(ctx.spouseAnnualIncome)
  const householdIncome = inputs.annualIncome + spouseIncome

  const retirementSavingsRate =
    householdIncome > 0
      ? Math.round((monthlyContributions(accounts) * 12 / householdIncome) * 100)
      : 0

  const termLife = n(ctx.termLifeCoverage)
  const permDeathBenefit = n(ctx.permanentLifeDeathBenefit)
  const totalDeathBenefit = termLife + permDeathBenefit
  const lifeCoverage: LifeCoverageBreakdown = {
    term: termLife,
    permanent: permDeathBenefit,
    total: totalDeathBenefit,
  }
  const insuranceCoverageRatio =
    householdIncome > 0 ? Math.round((totalDeathBenefit / householdIncome) * 10) / 10 : 0

  const realEstateConcentration = allocationPercent.real_estate
  const rentalShare =
    extraRealEstate > 0 && allocation.real_estate > 0
      ? Math.round((n(ctx.rentalPropertyEquity) / allocation.real_estate) * 100)
      : 0

  const cryptoShare =
    totalAssets > 0 ? Math.round((n(ctx.cryptoOrDigitalAssets) / totalAssets) * 100) : 0

  const hasDependents =
    inputs.hasDependents ||
    n(ctx.dependentCount) > 0 ||
    ctx.maritalStatus === "married" ||
    ctx.maritalStatus === "partnered"

  let emergencyTargetMonths = hasDependents ? 6 : 3
  if (ctx.immigrationUncertain) emergencyTargetMonths = Math.max(emergencyTargetMonths, 9)
  if (ctx.healthConcerns) emergencyTargetMonths = Math.max(emergencyTargetMonths, 6)

  const recommendations: BalanceRecommendation[] = []
  const contextNotes: string[] = []

  if (totalDeathBenefit > 0) {
    const parts = [
      termLife > 0 ? `term $${termLife.toLocaleString()}` : null,
      permDeathBenefit > 0 ? `permanent $${permDeathBenefit.toLocaleString()}` : null,
    ].filter(Boolean)
    contextNotes.push(
      `Life insurance death benefit total: $${totalDeathBenefit.toLocaleString()} (${parts.join(" + ")}). Cash value is tracked separately as an asset.`
    )
  }

  if (ctx.maritalStatus === "married" || ctx.maritalStatus === "partnered") {
    contextNotes.push(
      spouseIncome > 0
        ? `Household income includes your income plus spouse/partner ($${spouseIncome.toLocaleString()}).`
        : "Married/partnered households often plan protection and retirement together — include spouse accounts."
    )
  }

  if (emergencyFundMonths < emergencyTargetMonths) {
    recommendations.push(
      rec({
        priority: emergencyFundMonths < 3 ? "high" : "medium",
        category: "emergency",
        title: "Emergency reserves may need review",
        reason: `About ${emergencyFundMonths.toFixed(1)} months of expenses saved; a common planning discussion uses ${emergencyTargetMonths} months${
          ctx.immigrationUncertain ? " (higher while immigration status is uncertain)" : ""
        }.`,
        suggestedAction:
          "May be worth reviewing liquid savings before increasing investment risk. Discuss FDIC-insured account options with your banker.",
        references: [BALANCE_REFERENCES.emergencyFund],
      })
    )
  }

  if (ctx.immigrationUncertain && emergencyFundMonths < 9) {
    recommendations.push(
      rec({
        priority: "high",
        category: "emergency",
        title: "Extra liquidity while status is uncertain",
        reason:
          "Job changes, travel, or documentation gaps are harder to navigate without cash on hand.",
        suggestedAction:
          "Some households discuss targeting 9–12 months of expenses in accessible savings while status is uncertain.",
        references: [BALANCE_REFERENCES.emergencyFund],
      })
    )
  }

  const collegeNeed = n(ctx.collegeFundingNeeded)
  if (collegeNeed > 0 && hasDependents) {
    if (allocation.taxable_brokerage < collegeNeed * 0.25) {
      recommendations.push(
        rec({
          priority: "medium",
          category: "taxable_brokerage",
          title: "Plan for upcoming education costs",
          reason: `~$${collegeNeed.toLocaleString()} in college costs ahead. Dedicated savings reduces last-minute borrowing.`,
          suggestedAction:
            "May be worth discussing 529 plans or a dedicated savings bucket; volatile assets may not suit short tuition timelines.",
          references: [BALANCE_REFERENCES.college529],
        })
      )
    }
  }

  if (n(ctx.old401kBalance) > 0 && n(ctx.active401kBalance) === 0) {
    recommendations.push(
      rec({
        priority: "medium",
        category: "retirement_tax_deferred",
        title: "Review old 401(k) accounts",
        reason: `~$${n(ctx.old401kBalance).toLocaleString()} in former employer plan(s) with no active contributions noted.`,
        suggestedAction:
          "May be worth comparing rollover to an IRA vs. keeping the old plan with a qualified professional.",
        references: [BALANCE_REFERENCES.rollover401k],
      })
    )
  }

  if (inputs.age < 50 && allocation.retirement_roth === 0 && allocation.retirement_tax_deferred > 0) {
    recommendations.push(
      rec({
        priority: "medium",
        category: "retirement_roth",
        title: "Tax diversification may be worth discussing",
        reason:
          "Retirement savings look heavily tax-deferred. Roth accounts may offer more tax-flexible withdrawals in retirement — outcomes depend on individual tax rules.",
        suggestedAction:
          "Could be worth discussing Roth IRA or Roth 401(k) contributions, if eligible, with a tax professional.",
        references: [BALANCE_REFERENCES.rothDiversification],
      })
    )
  }

  if (retirementSavingsRate < 15 && inputs.age < 55) {
    recommendations.push(
      rec({
        priority: retirementSavingsRate < 10 ? "high" : "medium",
        category: "retirement_tax_deferred",
        title: "Increase household retirement savings",
        reason: `Estimated savings rate is ${retirementSavingsRate}% of household income. A common guideline is 15%+.`,
        suggestedAction:
          "Some households discuss raising 401(k) deferrals, capturing employer match, then gradual increases — subject to cash flow and plan rules.",
        references: [BALANCE_REFERENCES.retirement15Percent],
      })
    )
  }

  if (allocationPercent.taxable_brokerage > 25 && emergencyFundMonths < emergencyTargetMonths) {
    recommendations.push(
      rec({
        priority: "medium",
        category: "taxable_brokerage",
        title: "Liquidity before brokerage growth",
        reason: "Investments are a large share of assets while emergency reserves may still be building.",
        suggestedAction:
          "May be worth discussing whether to pause new brokerage contributions and redirect toward emergency or retirement goals.",
        references: [BALANCE_REFERENCES.emergencyFund],
      })
    )
  }

  const insuranceThreshold = hasDependents ? 8 : 5
  if (hasDependents && insuranceCoverageRatio < insuranceThreshold) {
    const breakdown =
      totalDeathBenefit > 0
        ? ` (term $${termLife.toLocaleString()} + permanent $${permDeathBenefit.toLocaleString()})`
        : ""
    recommendations.push(
      rec({
        priority: "high",
        category: "insurance",
        title: "Review life insurance protection",
        reason: `Total death benefit is ~${insuranceCoverageRatio}x household income${breakdown}. Families often target 10–15x.${
          ctx.healthConcerns ? " Health may affect underwriting — applying while eligible matters." : ""
        }`,
        suggestedAction:
          "May be worth running the DIME-based life insurance tool for an illustrative estimate. Death benefit and cash value serve different purposes. Discuss suitability with a licensed insurance professional.",
        references: [
          BALANCE_REFERENCES.lifeInsuranceDime,
          BALANCE_REFERENCES.lifeInsuranceNeeds,
        ],
      })
    )
  }

  if (
    n(ctx.cashValueLifeBalance) > 0 &&
    totalDeathBenefit === 0 &&
    hasDependents
  ) {
    recommendations.push(
      rec({
        priority: "medium",
        category: "insurance",
        title: "Cash value is not the same as death benefit",
        reason:
          "You entered cash surrender value but no term or permanent death benefit. Dependents need income protection, not just policy cash value.",
        suggestedAction:
          "May be worth entering permanent policy death benefit separately from cash value, or discussing term coverage with a licensed professional.",
        references: [BALANCE_REFERENCES.termVsPermanent, BALANCE_REFERENCES.lifeInsuranceDime],
      })
    )
  }

  if (permDeathBenefit > 0 && termLife === 0 && hasDependents && insuranceCoverageRatio < 10) {
    recommendations.push(
      rec({
        priority: "medium",
        category: "insurance",
        title: "Permanent coverage alone may be insufficient",
        reason: `Permanent death benefit of $${permDeathBenefit.toLocaleString()} may not fully replace household income.`,
        suggestedAction:
          "Some families discuss layering term life on permanent policies for peak earning years — subject to underwriting, affordability, and compliance review.",
        references: [BALANCE_REFERENCES.termVsPermanent, BALANCE_REFERENCES.lifeInsuranceDime],
      })
    )
  }

  if (realEstateConcentration > 60) {
    recommendations.push(
      rec({
        priority: "medium",
        category: "real_estate",
        title: "Real estate concentration may need review",
        reason: `${realEstateConcentration}% of assets are in real estate — which may be harder to access in emergencies.`,
        suggestedAction:
          "May be worth discussing liquid retirement and brokerage accounts before additional property purchases.",
        references: [BALANCE_REFERENCES.realEstateConcentration],
      })
    )
  }

  if (rentalShare >= 50 && n(ctx.rentalPropertyEquity) > 0) {
    recommendations.push(
      rec({
        priority: "medium",
        category: "real_estate",
        title: "Rental property concentration",
        reason: "Much of your real estate equity is in rentals — vacancy and repairs need cash reserves.",
        suggestedAction:
          "May be worth keeping a repair/vacancy reserve (often discussed as 3–6 months of rental expenses) separate from equity.",
        references: [BALANCE_REFERENCES.rentalReserves],
      })
    )
  }

  if (n(ctx.overseasAssets) > 0) {
    recommendations.push(
      rec({
        priority: "low",
        category: "other",
        title: "Overseas assets — tax and access",
        reason: `~$${n(ctx.overseasAssets).toLocaleString()} overseas may have currency, tax, or reporting considerations.`,
        suggestedAction:
          "Document ownership and discuss cross-border reporting with a tax professional.",
        references: [BALANCE_REFERENCES.fbar],
      })
    )
  }

  if (cryptoShare >= 10) {
    recommendations.push(
      rec({
        priority: "medium",
        category: "other",
        title: "Digital asset concentration",
        reason: `Crypto/digital assets are ~${cryptoShare}% of entered wealth — highly volatile.`,
        suggestedAction:
          "May be worth discussing emergency and retirement basics before speculative digital asset allocation.",
        references: [BALANCE_REFERENCES.cryptoRisk],
      })
    )
  }

  if (
    allocation.retirement_tax_deferred === 0 &&
    allocation.retirement_roth === 0 &&
    inputs.age >= 25
  ) {
    recommendations.push(
      rec({
        priority: "high",
        category: "retirement_tax_deferred",
        title: "Retirement contributions may need review",
        reason: "No retirement balances entered (including spouse/old 401(k) details).",
        suggestedAction:
          "May be worth discussing whether to open or fund a 401(k) or IRA with automated contributions.",
        references: [BALANCE_REFERENCES.retirement15Percent],
      })
    )
  }

  if (recommendations.length === 0) {
    recommendations.push(
      rec({
        priority: "low",
        category: "other",
        title: "Portfolio looks reasonably balanced",
        reason: "No major gaps stand out from your inputs. Review annually or after life changes.",
        suggestedAction:
          "Consider joining a class to validate assumptions with a licensed educator.",
        references: [BALANCE_REFERENCES.classes],
      })
    )
  }

  const priorityOrder = { high: 0, medium: 1, low: 2 }
  recommendations.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])

  const topFocus = recommendations.slice(0, 2).map((r) => r.title).join("; ")
  const summary =
    recommendations[0]?.priority === "low"
      ? "Your inputs suggest a balanced starting point. Keep reviewing as life changes."
      : `Focus areas: ${topFocus}. Educational prompts only — not personalized advice.`

  return {
    totalAssets,
    householdIncome,
    allocation,
    allocationPercent,
    emergencyFundMonths: Math.round(emergencyFundMonths * 10) / 10,
    emergencyFundTargetMonths: emergencyTargetMonths,
    retirementSavingsRate,
    insuranceCoverageRatio,
    lifeCoverage,
    realEstateConcentration,
    recommendations,
    summary,
    contextNotes,
  }
}

export const BALANCE_STORAGE_KEY = "safora-balance-planner-v1"
