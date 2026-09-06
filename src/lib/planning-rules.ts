/**
 * Deterministic advisor explanation engine — no external AI.
 */

import {
  ADVISOR_EXPLANATION_DISCLAIMER,
  CLIENT_QUESTION_BANK,
  DO_NOT_CONCLUDE,
  STRATEGY_PHRASES,
} from "@/lib/planning-insights"

export type FilingStatus = "single" | "mfj" | "mfs" | "hoh" | "qualifying_widow"
export type InsuranceType = "term" | "permanent" | "group" | "mixed" | "none"
export type MedicareStatus = "not_enrolled" | "within_2_years" | "enrolled" | "not_applicable"
export type SocialSecurityStatus = "not_claiming" | "claimed" | "planning" | "unknown"
export type LtcConcern = "none" | "moderate" | "high"
export type RetirementStatus = "working" | "retired" | "partially_retired"
export type GoalPriority =
  | "income_protection"
  | "tax_reduction"
  | "legacy"
  | "estate_liquidity"
  | "business_planning"
  | "retirement_income"
  | "ltc_protection"

export type RiskLevel = "red" | "yellow" | "green"

export type AdvisorScenario = {
  clientAge: number
  spouseAge?: number
  retirementStatus: RetirementStatus
  filingStatus: FilingStatus
  plannedRetirementAge?: number
  taxableAssets: number
  taxDeferredAssets: number
  taxFreeAssets: number
  emergencyCash: number
  monthlyExpenses: number
  householdIncome: number
  termLifeDeathBenefit: number
  permanentLifeDeathBenefit: number
  insuranceType: InsuranceType
  termExpirationAge?: number
  dependents: number
  mortgageAndDebt: number
  realEstateInvestment: number
  medicareStatus: MedicareStatus
  socialSecurityStatus: SocialSecurityStatus
  pensionIncome?: number
  ssEstimate62?: number
  ssEstimateFRA?: number
  ssEstimate70?: number
  ltcConcern: LtcConcern
  goalPriorities: GoalPriority[]
  hasDependents: boolean
  maritalStatus?: string
}

export type SnapshotRow = {
  label: string
  value: string
}

export type PlanningObservation = { id: string; text: string }

export type RiskFlag = {
  id: string
  label: string
  level: RiskLevel
  summary: string
}

export type ExplanationLogicItem = {
  id: string
  observation: string
  triggeredBy: string
  whyItMatters: string
  askNext: string
  doNotConclude: string
}

export type AdvisorExplanation = {
  snapshot: SnapshotRow[]
  observations: PlanningObservation[]
  riskFlags: RiskFlag[]
  explanationLogic: ExplanationLogicItem[]
  strategyAreas: string[]
  clientQuestions: string[]
  disclaimer: string
}

const FILING_LABELS: Record<FilingStatus, string> = {
  single: "Single",
  mfj: "Married filing jointly",
  mfs: "Married filing separately",
  hoh: "Head of household",
  qualifying_widow: "Qualifying surviving spouse",
}

const GOAL_LABELS: Record<GoalPriority, string> = {
  income_protection: "Income protection",
  tax_reduction: "Tax reduction",
  legacy: "Legacy",
  estate_liquidity: "Estate liquidity",
  business_planning: "Business planning",
  retirement_income: "Retirement income",
  ltc_protection: "LTC protection",
}

function fmt(n: number): string {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })
}

function pct(part: number, total: number): number {
  return total > 0 ? Math.round((part / total) * 100) : 0
}

function emergencyMonths(s: AdvisorScenario): number {
  return s.monthlyExpenses > 0 ? s.emergencyCash / s.monthlyExpenses : 0
}

function totalInvestable(s: AdvisorScenario): number {
  return s.taxableAssets + s.taxDeferredAssets + s.taxFreeAssets
}

function totalDeathBenefit(s: AdvisorScenario): number {
  return s.termLifeDeathBenefit + s.permanentLifeDeathBenefit
}

function insuranceRatio(s: AdvisorScenario): number {
  return s.householdIncome > 0 ? totalDeathBenefit(s) / s.householdIncome : 0
}

function buildSnapshot(s: AdvisorScenario): SnapshotRow[] {
  const totalLife = totalDeathBenefit(s)
  const termExp =
    s.termExpirationAge != null && s.termExpirationAge > 0
      ? `Age ${s.termExpirationAge}`
      : "Not entered"

  return [
    { label: "Client age", value: s.clientAge > 0 ? String(s.clientAge) : "—" },
    { label: "Spouse age", value: s.spouseAge ? String(s.spouseAge) : "—" },
    {
      label: "Retirement status",
      value:
        s.retirementStatus === "working"
          ? "Working"
          : s.retirementStatus === "retired"
            ? "Retired"
            : "Partially retired",
    },
    { label: "Filing status", value: FILING_LABELS[s.filingStatus] },
    {
      label: "Planned retirement age",
      value: s.plannedRetirementAge ? String(s.plannedRetirementAge) : "—",
    },
    { label: "Taxable assets", value: fmt(s.taxableAssets) },
    { label: "Tax-deferred assets", value: fmt(s.taxDeferredAssets) },
    { label: "Tax-free (Roth) assets", value: fmt(s.taxFreeAssets) },
    { label: "Emergency / cash", value: fmt(s.emergencyCash) },
    {
      label: "Life insurance (death benefit)",
      value: totalLife > 0 ? `${fmt(totalLife)} (${s.insuranceType})` : `None / ${s.insuranceType}`,
    },
    { label: "Term expiration", value: termExp },
    { label: "Dependents", value: String(s.dependents) },
    { label: "Mortgage & debts", value: fmt(s.mortgageAndDebt) },
    {
      label: "Real estate (investment)",
      value: fmt(s.realEstateInvestment),
    },
    {
      label: "Medicare status",
      value:
        s.medicareStatus === "enrolled"
          ? "Enrolled"
          : s.medicareStatus === "within_2_years"
            ? "Within ~2 years"
            : s.medicareStatus === "not_applicable"
              ? "N/A"
              : "Not yet enrolled",
    },
    {
      label: "Social Security status",
      value:
        s.socialSecurityStatus === "claimed"
          ? "Receiving benefits"
          : s.socialSecurityStatus === "planning"
            ? "Planning / comparing ages"
            : s.socialSecurityStatus === "not_claiming"
              ? "Not yet claiming"
              : "Unknown / not discussed",
    },
    {
      label: "Long-term care concern",
      value:
        s.ltcConcern === "high" ? "High" : s.ltcConcern === "moderate" ? "Moderate" : "Low / none noted",
    },
    {
      label: "Goal priorities",
      value:
        s.goalPriorities.length > 0
          ? s.goalPriorities.map((g) => GOAL_LABELS[g]).join(", ")
          : "Not specified",
    },
  ]
}

export function generateAdvisorExplanation(scenario: AdvisorScenario): AdvisorExplanation {
  const observations: PlanningObservation[] = []
  const riskFlags: RiskFlag[] = []
  const explanationLogic: ExplanationLogicItem[] = []
  const strategySet = new Set<string>()
  const questionSet = new Set<string>()

  const investable = totalInvestable(scenario)
  const deferredPct = pct(scenario.taxDeferredAssets, investable)
  const freePct = pct(scenario.taxFreeAssets, investable)
  const taxablePct = pct(scenario.taxableAssets, investable)
  const emMonths = emergencyMonths(scenario)
  const insRatio = insuranceRatio(scenario)
  const yearsToRmd = 73 - scenario.clientAge
  const nearMedicare =
    scenario.medicareStatus === "within_2_years" ||
    scenario.medicareStatus === "enrolled" ||
    (scenario.clientAge >= 63 && scenario.clientAge < 65)

  // ── Tax-deferred concentration ──
  if (investable > 0 && deferredPct >= 55) {
    const text =
      "Most investable assets appear tax-deferred, which may create future RMD pressure and taxable income in retirement."
    observations.push({ id: "tax-deferred-heavy", text })
    explanationLogic.push({
      id: "tax-deferred-heavy",
      observation: text,
      triggeredBy: `Tax-deferred assets are ${deferredPct}% of taxable + tax-deferred + tax-free totals (${fmt(scenario.taxDeferredAssets)}).`,
      whyItMatters:
        "Future required minimum distributions may increase taxable income, affect Social Security taxation, and influence Medicare premiums.",
      askNext: CLIENT_QUESTION_BANK.rmd,
      doNotConclude: DO_NOT_CONCLUDE.rothConversion,
    })
    riskFlags.push({
      id: "rmd-pressure",
      label: "RMD pressure",
      level: scenario.clientAge >= 70 ? "red" : yearsToRmd <= 10 ? "yellow" : "yellow",
      summary: "Tax-deferred balance may drive future mandatory withdrawals.",
    })
    strategySet.add(STRATEGY_PHRASES.rmdPlanning)
    questionSet.add(CLIENT_QUESTION_BANK.rmd)
    questionSet.add(CLIENT_QUESTION_BANK.taxBuckets)
  }

  // ── Low tax-free bucket ──
  if (investable > 50000 && freePct < 15 && scenario.taxDeferredAssets > 0) {
    const text =
      "The tax-free (Roth) bucket may be relatively small compared with tax-deferred assets — diversification could be worth discussing."
    observations.push({ id: "low-roth", text })
    explanationLogic.push({
      id: "low-roth",
      observation: text,
      triggeredBy: `Roth/tax-free assets are ${freePct}% of investable assets (${fmt(scenario.taxFreeAssets)}).`,
      whyItMatters:
        "Roth assets may offer flexibility in high-tax years and for a surviving spouse, but conversions have trade-offs.",
      askNext: CLIENT_QUESTION_BANK.rothRoom,
      doNotConclude: DO_NOT_CONCLUDE.rothConversion,
    })
    riskFlags.push({
      id: "low-tax-free",
      label: "Low tax-free bucket",
      level: freePct < 8 ? "yellow" : "green",
      summary: "Limited Roth/tax-free assets relative to tax-deferred.",
    })
    strategySet.add(STRATEGY_PHRASES.rothConversion)
    questionSet.add(CLIENT_QUESTION_BANK.rothRoom)
  }

  // ── Roth conversion window ──
  if (
    scenario.clientAge >= 55 &&
    scenario.clientAge < 73 &&
    scenario.taxDeferredAssets > 100000 &&
    scenario.taxFreeAssets < scenario.taxDeferredAssets * 0.3 &&
    (scenario.retirementStatus === "retired" || scenario.retirementStatus === "partially_retired")
  ) {
    const text =
      "There may be a Roth conversion discussion window after retirement but before RMD age — subject to tax and cash-flow review."
    observations.push({ id: "roth-window", text })
    explanationLogic.push({
      id: "roth-window",
      observation: text,
      triggeredBy: `Client age ${scenario.clientAge}, retirement status "${scenario.retirementStatus}", tax-deferred ${fmt(scenario.taxDeferredAssets)}.`,
      whyItMatters:
        "Lower-income years may allow partial conversions at controlled rates, but Medicare and cash to pay tax matter.",
      askNext: CLIENT_QUESTION_BANK.rothRoom,
      doNotConclude: DO_NOT_CONCLUDE.rothConversion,
    })
    strategySet.add(STRATEGY_PHRASES.rothConversion)
  }

  // ── Medicare / IRMAA ──
  if (nearMedicare && scenario.taxDeferredAssets > 250000) {
    const text =
      "Client may be approaching Medicare age — large IRA withdrawals or Roth conversions could affect premium discussions (IRMAA)."
    observations.push({ id: "medicare-irmaa", text })
    explanationLogic.push({
      id: "medicare-irmaa",
      observation: text,
      triggeredBy: `Age ${scenario.clientAge}, Medicare status "${scenario.medicareStatus}", significant tax-deferred assets.`,
      whyItMatters:
        "Modified adjusted gross income may influence Medicare Part B/D premiums for higher-income beneficiaries.",
      askNext: CLIENT_QUESTION_BANK.medicare,
      doNotConclude: DO_NOT_CONCLUDE.rothConversion,
    })
    riskFlags.push({
      id: "medicare-irmaa",
      label: "Medicare IRMAA awareness",
      level: "yellow",
      summary: "Large income events may warrant Medicare premium coordination.",
    })
    strategySet.add(STRATEGY_PHRASES.medicareIrmaa)
    questionSet.add(CLIENT_QUESTION_BANK.medicare)
  }

  // ── Social Security planning ──
  if (
    scenario.socialSecurityStatus === "planning" ||
    (scenario.clientAge >= 58 && scenario.clientAge <= 70 && scenario.socialSecurityStatus !== "claimed")
  ) {
    const text =
      "Social Security claiming age may affect lifetime income, survivor benefits, and the order of portfolio withdrawals."
    observations.push({ id: "ss-timing", text })
    strategySet.add(STRATEGY_PHRASES.socialSecurity)
    questionSet.add(CLIENT_QUESTION_BANK.ssClaiming)
    if (scenario.ssEstimate62 || scenario.ssEstimateFRA || scenario.ssEstimate70) {
      explanationLogic.push({
        id: "ss-timing",
        observation: text,
        triggeredBy: "Client age and Social Security status suggest claiming may be on the planning horizon.",
        whyItMatters:
          "Early vs. delayed claiming changes monthly income and may affect spouse survivor benefits.",
        askNext: CLIENT_QUESTION_BANK.ssClaiming,
        doNotConclude: DO_NOT_CONCLUDE.socialSecurity,
      })
    }
  }

  // ── Term insurance fit ──
  if (
    (scenario.insuranceType === "term" || scenario.insuranceType === "mixed") &&
    scenario.hasDependents
  ) {
    const text =
      "Term insurance may align with temporary protection needs (mortgage, income replacement, education) — duration should be confirmed."
    observations.push({ id: "term-fit", text })
    explanationLogic.push({
      id: "term-fit",
      observation: text,
      triggeredBy: `Insurance type "${scenario.insuranceType}" with dependents (${scenario.dependents}).`,
      whyItMatters: "Term coverage is often used when the need has a defined time horizon.",
      askNext: CLIENT_QUESTION_BANK.insuranceNeed,
      doNotConclude: DO_NOT_CONCLUDE.lifeInsurance,
    })
    strategySet.add(STRATEGY_PHRASES.termVsPermanent)
    questionSet.add(CLIENT_QUESTION_BANK.insuranceNeed)
  }

  // ── Permanent insurance — cautious ──
  if (
    scenario.insuranceType === "permanent" ||
    scenario.insuranceType === "mixed" ||
    scenario.goalPriorities.includes("legacy") ||
    scenario.goalPriorities.includes("estate_liquidity") ||
    scenario.goalPriorities.includes("business_planning")
  ) {
    const text =
      "Permanent insurance discussion may be appropriate only if there is a lifetime liquidity, estate, legacy, business, or special-needs planning purpose — not by default."
    observations.push({ id: "perm-context", text })
    explanationLogic.push({
      id: "perm-context",
      observation: text,
      triggeredBy:
        "Permanent/mixed coverage, or goals include legacy, estate liquidity, or business planning.",
      whyItMatters:
        "Permanent policies combine protection with cash value; suitability depends on duration of need and budget.",
      askNext: CLIENT_QUESTION_BANK.insuranceNeed,
      doNotConclude: DO_NOT_CONCLUDE.permanentInsurance,
    })
    strategySet.add(STRATEGY_PHRASES.termVsPermanent)
  }

  // ── Life insurance gap ──
  if (scenario.hasDependents && scenario.householdIncome > 0) {
    if (insRatio < 5) {
      riskFlags.push({
        id: "life-gap",
        label: "Life insurance gap",
        level: "red",
        summary: `Death benefit is ~${insRatio.toFixed(1)}x household income — may warrant a needs review.`,
      })
      strategySet.add(STRATEGY_PHRASES.lifeNeeds)
      questionSet.add(CLIENT_QUESTION_BANK.insuranceNeed)
    } else if (insRatio < 8) {
      riskFlags.push({
        id: "life-gap",
        label: "Life insurance gap",
        level: "yellow",
        summary: `Death benefit is ~${insRatio.toFixed(1)}x income — discuss whether duration and amount match goals.`,
      })
      strategySet.add(STRATEGY_PHRASES.lifeNeeds)
    } else {
      riskFlags.push({
        id: "life-gap",
        label: "Life insurance gap",
        level: "green",
        summary: "Death benefit entered appears substantial relative to income — confirm duration and ownership.",
      })
    }
  }

  // ── Term expiration ──
  if (
    scenario.termExpirationAge != null &&
    scenario.termExpirationAge > 0 &&
    scenario.termExpirationAge - scenario.clientAge <= 10 &&
    scenario.termExpirationAge >= scenario.clientAge
  ) {
    const text = `Term insurance may expire around age ${scenario.termExpirationAge} — renewal or replacement timing could be worth reviewing.`
    observations.push({ id: "term-expiry", text })
    riskFlags.push({
      id: "term-expiration",
      label: "Term expiration risk",
      level: scenario.termExpirationAge - scenario.clientAge <= 5 ? "red" : "yellow",
      summary: `Term may end in ~${scenario.termExpirationAge - scenario.clientAge} years.`,
    })
    questionSet.add(CLIENT_QUESTION_BANK.termExpiry)
    explanationLogic.push({
      id: "term-expiry",
      observation: text,
      triggeredBy: `Term expiration age ${scenario.termExpirationAge}, client age ${scenario.clientAge}.`,
      whyItMatters: "Protection may drop off while needs (mortgage, income) still exist.",
      askNext: CLIENT_QUESTION_BANK.termExpiry,
      doNotConclude: DO_NOT_CONCLUDE.lifeInsurance,
    })
  }

  // ── Survivor spouse ──
  if (
    (scenario.filingStatus === "mfj" || scenario.maritalStatus === "married") &&
    scenario.spouseAge != null
  ) {
    const text =
      "Survivor-spouse tax filing and income changes may warrant review — Roth and insurance may play a role in flexibility."
    observations.push({ id: "survivor-spouse", text })
    riskFlags.push({
      id: "survivor-tax",
      label: "Survivor spouse tax risk",
      level: "yellow",
      summary: "Filing status may change from joint to single for the survivor.",
    })
    strategySet.add(STRATEGY_PHRASES.beneficiaryReview)
    questionSet.add(CLIENT_QUESTION_BANK.survivor)
    explanationLogic.push({
      id: "survivor-spouse",
      observation: text,
      triggeredBy: "Married / MFJ filing with spouse age provided.",
      whyItMatters:
        "Survivor may eventually file as single; brackets and deductions can change.",
      askNext: CLIENT_QUESTION_BANK.survivor,
      doNotConclude: "Do not assume income needs drop by 50% — review actual expenses and debts.",
    })
  }

  // ── LTC ──
  if (scenario.ltcConcern !== "none" || scenario.goalPriorities.includes("ltc_protection")) {
    const text =
      "Long-term care funding and liquidity may deserve discussion — custodial care is generally not covered by Medicare alone."
    observations.push({ id: "ltc", text })
    riskFlags.push({
      id: "ltc-liquidity",
      label: "Long-term care liquidity risk",
      level: scenario.ltcConcern === "high" ? "red" : "yellow",
      summary: "Care costs may require IRA withdrawals or asset sales.",
    })
    strategySet.add(STRATEGY_PHRASES.ltcFunding)
    questionSet.add(CLIENT_QUESTION_BANK.ltc)
    explanationLogic.push({
      id: "ltc",
      observation: text,
      triggeredBy: `LTC concern level: ${scenario.ltcConcern}.`,
      whyItMatters: "Three years of care can materially affect retirement and spouse security.",
      askNext: CLIENT_QUESTION_BANK.ltc,
      doNotConclude: DO_NOT_CONCLUDE.ltc,
    })
  }

  // ── Real estate illiquidity ──
  const totalWithRE = investable + scenario.realEstateInvestment
  const rePct = pct(scenario.realEstateInvestment, totalWithRE)
  if (scenario.realEstateInvestment > 0 && rePct >= 35) {
    const text =
      "Real estate investment equity may be illiquid — death, disability, or care needs could force timing pressure on a sale."
    observations.push({ id: "re-illiquid", text })
    riskFlags.push({
      id: "re-illiquidity",
      label: "Real estate illiquidity risk",
      level: rePct >= 55 ? "red" : "yellow",
      summary: `${rePct}% of entered wealth is in real estate equity.`,
    })
    strategySet.add(STRATEGY_PHRASES.realEstateLiquidity)
    questionSet.add(CLIENT_QUESTION_BANK.realEstate)
    explanationLogic.push({
      id: "re-illiquid",
      observation: text,
      triggeredBy: `Real estate investment equity ${fmt(scenario.realEstateInvestment)} (${rePct}% of total).`,
      whyItMatters: "Heirs or a surviving spouse may need liquidity without a rushed sale.",
      askNext: CLIENT_QUESTION_BANK.realEstate,
      doNotConclude: DO_NOT_CONCLUDE.realEstate,
    })
  }

  // ── Emergency cash ──
  if (emMonths < 3 && scenario.monthlyExpenses > 0) {
    riskFlags.push({
      id: "emergency-cash",
      label: "Lack of emergency cash",
      level: emMonths < 1.5 ? "red" : "yellow",
      summary: `~${emMonths.toFixed(1)} months of expenses in emergency cash.`,
    })
    strategySet.add(STRATEGY_PHRASES.emergencyReserve)
    questionSet.add(CLIENT_QUESTION_BANK.emergency)
    observations.push({
      id: "emergency-low",
      text: "Emergency reserves may be below common planning guidelines — liquidity before conversions or new commitments may be worth reviewing.",
    })
  } else if (emMonths >= 6) {
    riskFlags.push({
      id: "emergency-cash",
      label: "Lack of emergency cash",
      level: "green",
      summary: `~${emMonths.toFixed(1)} months of expenses in cash — may support flexibility.`,
    })
  }

  // ── Tax bucket concentration flag ──
  if (investable > 0) {
    const maxPct = Math.max(deferredPct, freePct, taxablePct)
    const dominant =
      maxPct === deferredPct ? "tax-deferred" : maxPct === freePct ? "tax-free" : "taxable"
    if (maxPct >= 70) {
      riskFlags.push({
        id: "tax-concentration",
        label: "Over-concentration in one tax bucket",
        level: "yellow",
        summary: `~${maxPct}% in ${dominant} assets.`,
      })
    } else {
      riskFlags.push({
        id: "tax-concentration",
        label: "Over-concentration in one tax bucket",
        level: "green",
        summary: "Tax buckets appear somewhat diversified from entered data.",
      })
    }
  }

  // ── Roth flexibility note ──
  if (scenario.taxFreeAssets > 50000) {
    observations.push({
      id: "roth-flex",
      text: "Roth assets may be valuable for high-tax years or survivor-spouse withdrawal flexibility — confirm ownership and beneficiaries.",
    })
  }

  // Default green flags for categories not flagged
  const flagIds = new Set(riskFlags.map((f) => f.id))
  if (!flagIds.has("rmd-pressure") && scenario.taxDeferredAssets < 100000) {
    riskFlags.push({
      id: "rmd-pressure",
      label: "RMD pressure",
      level: "green",
      summary: "Tax-deferred balance entered is modest or not dominant.",
    })
  }

  // Strategy from goals
  if (scenario.goalPriorities.includes("tax_reduction")) strategySet.add(STRATEGY_PHRASES.rothConversion)
  if (scenario.goalPriorities.includes("income_protection")) strategySet.add(STRATEGY_PHRASES.lifeNeeds)
  if (scenario.goalPriorities.includes("legacy") || scenario.goalPriorities.includes("estate_liquidity")) {
    strategySet.add(STRATEGY_PHRASES.beneficiaryReview)
  }

  questionSet.add(CLIENT_QUESTION_BANK.estateDocs)

  const clientQuestions = Array.from(questionSet).slice(0, 8)
  while (clientQuestions.length < 5) {
    clientQuestions.push(CLIENT_QUESTION_BANK.taxBuckets)
    break
  }

  if (observations.length === 0) {
    observations.push({
      id: "neutral",
      text: "Entered data does not trigger strong planning signals — use insight cards below to guide discovery.",
    })
  }

  return {
    snapshot: buildSnapshot(scenario),
    observations,
    riskFlags,
    explanationLogic,
    strategyAreas: Array.from(strategySet),
    clientQuestions,
    disclaimer: ADVISOR_EXPLANATION_DISCLAIMER,
  }
}

/** Map UI draft fields → AdvisorScenario (shared adapter for future LLM context export) */
export type AdvisorDraftFields = {
  age: number | ""
  spouseAge: number | ""
  annualIncome: number | ""
  spouseIncome: number | ""
  monthlyExpenses: number | ""
  accounts: AccountInputLite[]
  termLifeCoverage: number | ""
  permLifeDeathBenefit: number | ""
  cashValueLife: number | ""
  active401k: number | ""
  old401k: number | ""
  primaryHome: number | ""
  rentalEquity: number | ""
  mortgageDebt: number | ""
  dependentCount: number | ""
  hasDependents: boolean
  maritalStatus?: string
  filingStatus: FilingStatus
  plannedRetirementAge: number | ""
  retirementStatus: RetirementStatus
  pensionIncome: number | ""
  ssAt62: number | ""
  ssAtFRA: number | ""
  ssAt70: number | ""
  insuranceType: InsuranceType
  termExpirationAge: number | ""
  medicareStatus: MedicareStatus
  socialSecurityStatus: SocialSecurityStatus
  ltcConcern: LtcConcern
  goalPriorities: GoalPriority[]
}

type AccountInputLite = { category: string; balance: number }

export function scenarioFromDraft(d: AdvisorDraftFields): AdvisorScenario {
  const sumCat = (cat: string) =>
    d.accounts.filter((a) => a.category === cat).reduce((s, a) => s + (a.balance || 0), 0)

  const taxDeferred =
    sumCat("retirement_tax_deferred") +
    (Number(d.active401k) || 0) +
    (Number(d.old401k) || 0)
  const taxFree = sumCat("retirement_roth")
  const taxable = sumCat("taxable_brokerage")
  const emergency = sumCat("emergency")
  const realEstate =
    sumCat("real_estate") + (Number(d.primaryHome) || 0) + (Number(d.rentalEquity) || 0)

  const income = (Number(d.annualIncome) || 0) + (Number(d.spouseIncome) || 0)

  return {
    clientAge: Number(d.age) || 0,
    spouseAge: d.spouseAge === "" ? undefined : Number(d.spouseAge),
    retirementStatus: d.retirementStatus,
    filingStatus: d.filingStatus,
    plannedRetirementAge: d.plannedRetirementAge === "" ? undefined : Number(d.plannedRetirementAge),
    taxableAssets: taxable,
    taxDeferredAssets: taxDeferred,
    taxFreeAssets: taxFree,
    emergencyCash: emergency,
    monthlyExpenses: Number(d.monthlyExpenses) || 0,
    householdIncome: income,
    termLifeDeathBenefit: Number(d.termLifeCoverage) || 0,
    permanentLifeDeathBenefit: Number(d.permLifeDeathBenefit) || 0,
    insuranceType: d.insuranceType,
    termExpirationAge: d.termExpirationAge === "" ? undefined : Number(d.termExpirationAge),
    dependents: Number(d.dependentCount) || 0,
    mortgageAndDebt: Number(d.mortgageDebt) || 0,
    realEstateInvestment: realEstate,
    medicareStatus: d.medicareStatus,
    socialSecurityStatus: d.socialSecurityStatus,
    pensionIncome: d.pensionIncome === "" ? undefined : Number(d.pensionIncome),
    ssEstimate62: d.ssAt62 === "" ? undefined : Number(d.ssAt62),
    ssEstimateFRA: d.ssAtFRA === "" ? undefined : Number(d.ssAtFRA),
    ssEstimate70: d.ssAt70 === "" ? undefined : Number(d.ssAt70),
    ltcConcern: d.ltcConcern,
    goalPriorities: d.goalPriorities,
    hasDependents: d.hasDependents,
    maritalStatus: d.maritalStatus,
  }
}

/** JSON-serializable context for a future LLM layer */
export function buildLlmContextPayload(
  scenario: AdvisorScenario,
  explanation: AdvisorExplanation
) {
  return {
    scenario,
    explanation: {
      observations: explanation.observations,
      riskFlags: explanation.riskFlags,
      strategyAreas: explanation.strategyAreas,
      clientQuestions: explanation.clientQuestions,
    },
    disclaimer: explanation.disclaimer,
  }
}
