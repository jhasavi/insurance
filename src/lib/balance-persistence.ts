/**
 * Portfolio balance draft save/load — browser file round-trip (no server DB).
 */

import type { AccountInput, BalanceAnalysis, LifeContext } from "@/lib/financial-balance"
import type { AdvisorFieldState } from "@/components/AdvisorScenarioFields"
import type { AdvisorExplanation } from "@/lib/planning-rules"

export type BalanceDraftExport = {
  exportedAt?: string
  version?: number
  inputs: {
    age?: number | ""
    annualIncome?: number | ""
    monthlyExpenses?: number | ""
    accounts?: AccountInput[]
    hasDependents?: boolean
    advisorMode?: boolean
    advisorFields?: Partial<AdvisorFieldState>
    lifeContext?: Partial<LifeContext>
  }
  result?: BalanceAnalysis | null
}

export type BalanceDraftSlice = {
  age: number | ""
  annualIncome: number | ""
  monthlyExpenses: number | ""
  accounts: AccountInput[]
  termLifeCoverage: number | ""
  permLifeDeathBenefit: number | ""
  cashValueLife: number | ""
  hasDependents: boolean
  maritalStatus: LifeContext["maritalStatus"]
  spouseIncome: number | ""
  spouseRetirement: number | ""
  dependentCount: number | ""
  collegeFunding: number | ""
  active401k: number | ""
  old401k: number | ""
  primaryHome: number | ""
  rentalEquity: number | ""
  overseasAssets: number | ""
  cryptoAssets: number | ""
  healthConcerns: boolean
  immigrationUncertain: boolean
  advisorMode: boolean
  advisorFields: AdvisorFieldState
  result: BalanceAnalysis | null
  advisorExplanation: AdvisorExplanation | null
}

function numOrEmpty(v: unknown): number | "" {
  if (v === "" || v === undefined || v === null) return ""
  const n = Number(v)
  return Number.isFinite(n) ? n : ""
}

export function buildBalanceExportPayload(
  draft: BalanceDraftSlice,
  lifeContext: LifeContext
): BalanceDraftExport {
  return {
    exportedAt: new Date().toISOString(),
    version: 1,
    inputs: {
      age: draft.age,
      annualIncome: draft.annualIncome,
      monthlyExpenses: draft.monthlyExpenses,
      accounts: draft.accounts,
      hasDependents: draft.hasDependents,
      advisorMode: draft.advisorMode,
      advisorFields: draft.advisorFields,
      lifeContext,
    },
    result: draft.result,
  }
}

export function parseBalanceImportFile(
  raw: string
):
  | { ok: true; partial: Partial<BalanceDraftSlice>; advisorFieldsPartial?: Partial<AdvisorFieldState> }
  | { ok: false; error: string } {
  let parsed: unknown
  try {
    parsed = JSON.parse(raw)
  } catch {
    return { ok: false, error: "File is not valid JSON." }
  }

  if (!parsed || typeof parsed !== "object") {
    return { ok: false, error: "Unrecognized file format." }
  }

  const root = parsed as Record<string, unknown>
  const inputs = (root.inputs ?? root) as Record<string, unknown>
  if (!inputs || typeof inputs !== "object") {
    return { ok: false, error: "Missing inputs in file." }
  }

  const lc = (inputs.lifeContext ?? {}) as Partial<LifeContext>

  const partial: Partial<BalanceDraftSlice> = {
    age: numOrEmpty(inputs.age),
    annualIncome: numOrEmpty(inputs.annualIncome),
    monthlyExpenses: numOrEmpty(inputs.monthlyExpenses),
    accounts: Array.isArray(inputs.accounts) ? (inputs.accounts as AccountInput[]) : undefined,
    hasDependents: typeof inputs.hasDependents === "boolean" ? inputs.hasDependents : undefined,
    advisorMode: typeof inputs.advisorMode === "boolean" ? inputs.advisorMode : undefined,
    maritalStatus: lc.maritalStatus,
    spouseIncome: numOrEmpty(lc.spouseAnnualIncome),
    spouseRetirement: numOrEmpty(lc.spouseRetirementBalance),
    dependentCount: numOrEmpty(lc.dependentCount),
    collegeFunding: numOrEmpty(lc.collegeFundingNeeded),
    active401k: numOrEmpty(lc.active401kBalance),
    old401k: numOrEmpty(lc.old401kBalance),
    termLifeCoverage: numOrEmpty(lc.termLifeCoverage),
    permLifeDeathBenefit: numOrEmpty(lc.permanentLifeDeathBenefit),
    cashValueLife: numOrEmpty(lc.cashValueLifeBalance),
    primaryHome: numOrEmpty(lc.primaryHomeEquity),
    rentalEquity: numOrEmpty(lc.rentalPropertyEquity),
    overseasAssets: numOrEmpty(lc.overseasAssets),
    cryptoAssets: numOrEmpty(lc.cryptoOrDigitalAssets),
    healthConcerns: lc.healthConcerns ?? false,
    immigrationUncertain: lc.immigrationUncertain ?? false,
    result: (root.result as BalanceAnalysis | null) ?? null,
    advisorExplanation: null,
  }

  if (partial.age === "" && partial.annualIncome === "") {
    return { ok: false, error: "File does not contain portfolio age or income fields." }
  }

  const advisorFieldsPartial = inputs.advisorFields as Partial<AdvisorFieldState> | undefined
  return { ok: true, partial, advisorFieldsPartial }
}
