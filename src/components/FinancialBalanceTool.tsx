"use client"

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react"
import Link from "next/link"
import {
  ChevronDown,
  Download,
  Printer,
  RotateCcw,
  Sparkles,
  ExternalLink,
  Upload,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ComplianceDisclaimer } from "@/components/ComplianceDisclaimer"
import {
  analyzeBalance,
  BALANCE_STORAGE_KEY,
  categoryLabel,
  type AccountCategory,
  type AccountInput,
  type BalanceAnalysis,
  type LifeContext,
} from "@/lib/financial-balance"
import { BALANCE_REFERENCES } from "@/lib/balance-references"
import { PlanningInsightsAccordion } from "@/components/PlanningInsightsAccordion"
import { AdvisorExplanationPanel } from "@/components/AdvisorExplanationPanel"
import {
  AdvisorScenarioFields,
  defaultAdvisorFields,
  type AdvisorFieldState,
} from "@/components/AdvisorScenarioFields"
import {
  buildLlmContextPayload,
  generateAdvisorExplanation,
  scenarioFromDraft,
  type AdvisorDraftFields,
  type AdvisorExplanation,
} from "@/lib/planning-rules"
import { BALANCE_RESULTS_DISCLAIMER, CONTEXTUAL_DISCLAIMERS } from "@/lib/balance-disclaimers"
import {
  buildBalanceExportPayload,
  parseBalanceImportFile,
} from "@/lib/balance-persistence"

const DEFAULT_ACCOUNTS: AccountInput[] = [
  { category: "emergency", label: "Emergency fund", balance: 0, monthlyContribution: 0 },
  { category: "retirement_tax_deferred", label: "401(k) / IRA (pre-tax)", balance: 0, monthlyContribution: 0 },
  { category: "retirement_roth", label: "Roth IRA / Roth 401(k)", balance: 0, monthlyContribution: 0 },
  { category: "taxable_brokerage", label: "Taxable brokerage & stocks", balance: 0, monthlyContribution: 0 },
  { category: "insurance", label: "Cash value (if not entered below)", balance: 0 },
  { category: "real_estate", label: "Real estate equity (total)", balance: 0 },
]

type DraftState = {
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
  showHousehold: boolean
  showDetails: boolean
  advisorMode: boolean
  advisorFields: AdvisorFieldState
  result: BalanceAnalysis | null
  advisorExplanation: AdvisorExplanation | null
}

function priorityColor(priority: "high" | "medium" | "low") {
  if (priority === "high") return "bg-red-100 text-red-800"
  if (priority === "medium") return "bg-amber-100 text-amber-800"
  return "bg-green-100 text-green-800"
}

function priorityLabel(priority: "high" | "medium" | "low") {
  if (priority === "high") return "Worth review"
  if (priority === "medium") return "Discuss"
  return "Monitor"
}

function numOrUndef(v: number | ""): number | undefined {
  return v === "" ? undefined : Number(v)
}

function defaultDraft(): DraftState {
  return {
    age: 40,
    annualIncome: 120000,
    monthlyExpenses: 6000,
    accounts: DEFAULT_ACCOUNTS,
    termLifeCoverage: "",
    permLifeDeathBenefit: "",
    cashValueLife: "",
    hasDependents: true,
    maritalStatus: "married",
    spouseIncome: "",
    spouseRetirement: "",
    dependentCount: 2,
    collegeFunding: "",
    active401k: "",
    old401k: "",
    primaryHome: "",
    rentalEquity: "",
    overseasAssets: "",
    cryptoAssets: "",
    healthConcerns: false,
    immigrationUncertain: false,
    showHousehold: false,
    showDetails: false,
    advisorMode: false,
    advisorFields: defaultAdvisorFields(),
    result: null,
    advisorExplanation: null,
  }
}

function buildAdvisorDraftFields(draft: DraftState): AdvisorDraftFields {
  return {
    age: draft.age,
    spouseAge: draft.advisorFields.spouseAge,
    annualIncome: draft.annualIncome,
    spouseIncome: draft.spouseIncome,
    monthlyExpenses: draft.monthlyExpenses,
    accounts: draft.accounts,
    termLifeCoverage: draft.termLifeCoverage,
    permLifeDeathBenefit: draft.permLifeDeathBenefit,
    cashValueLife: draft.cashValueLife,
    active401k: draft.active401k,
    old401k: draft.old401k,
    primaryHome: draft.primaryHome,
    rentalEquity: draft.rentalEquity,
    mortgageDebt: draft.advisorFields.mortgageDebt,
    dependentCount: draft.dependentCount,
    hasDependents: draft.hasDependents,
    maritalStatus: draft.maritalStatus,
    filingStatus: draft.advisorFields.filingStatus,
    plannedRetirementAge: draft.advisorFields.plannedRetirementAge,
    retirementStatus: draft.advisorFields.retirementStatus,
    pensionIncome: draft.advisorFields.pensionIncome,
    ssAt62: draft.advisorFields.ssAt62,
    ssAtFRA: draft.advisorFields.ssAtFRA,
    ssAt70: draft.advisorFields.ssAt70,
    insuranceType: draft.advisorFields.insuranceType,
    termExpirationAge: draft.advisorFields.termExpirationAge,
    medicareStatus: draft.advisorFields.medicareStatus,
    socialSecurityStatus: draft.advisorFields.socialSecurityStatus,
    ltcConcern: draft.advisorFields.ltcConcern,
    goalPriorities: draft.advisorFields.goalPriorities,
  }
}

function RefLink({ href, label }: { href: string; label: string }) {
  if (href.startsWith("/")) {
    return (
      <Link href={href} className="text-blue-600 hover:underline text-xs inline-flex items-center gap-1">
        {label}
      </Link>
    )
  }
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-600 hover:underline text-xs inline-flex items-center gap-1"
    >
      {label}
      <ExternalLink className="h-3 w-3" />
    </a>
  )
}

export function FinancialBalanceTool() {
  const [draft, setDraft] = useState<DraftState>(defaultDraft)
  const [savedHint, setSavedHint] = useState<string | null>(null)
  const [importError, setImportError] = useState<string | null>(null)
  const resultsRef = useRef<HTMLDivElement>(null)
  const importInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(BALANCE_STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as DraftState
        const base = defaultDraft()
        setDraft({
          ...base,
          ...parsed,
          accounts: parsed.accounts ?? DEFAULT_ACCOUNTS,
          advisorFields: { ...base.advisorFields, ...parsed.advisorFields },
        })
        setSavedHint("Restored your last session from this browser.")
      }
    } catch {
      /* ignore corrupt storage */
    }
  }, [])

  useEffect(() => {
    const t = setTimeout(() => {
      try {
        localStorage.setItem(BALANCE_STORAGE_KEY, JSON.stringify(draft))
      } catch {
        /* quota exceeded */
      }
    }, 400)
    return () => clearTimeout(t)
  }, [draft])

  const patch = useCallback((partial: Partial<DraftState>) => {
    setDraft((d) => ({ ...d, ...partial }))
  }, [])

  const buildLifeContext = (): LifeContext => ({
    maritalStatus: draft.maritalStatus,
    spouseAnnualIncome: numOrUndef(draft.spouseIncome),
    spouseRetirementBalance: numOrUndef(draft.spouseRetirement),
    dependentCount: numOrUndef(draft.dependentCount),
    collegeFundingNeeded: numOrUndef(draft.collegeFunding),
    healthConcerns: draft.healthConcerns,
    immigrationUncertain: draft.immigrationUncertain,
    active401kBalance: numOrUndef(draft.active401k),
    old401kBalance: numOrUndef(draft.old401k),
    termLifeCoverage: numOrUndef(draft.termLifeCoverage),
    permanentLifeDeathBenefit: numOrUndef(draft.permLifeDeathBenefit),
    cashValueLifeBalance: numOrUndef(draft.cashValueLife),
    primaryHomeEquity: numOrUndef(draft.primaryHome),
    rentalPropertyEquity: numOrUndef(draft.rentalEquity),
    overseasAssets: numOrUndef(draft.overseasAssets),
    cryptoOrDigitalAssets: numOrUndef(draft.cryptoAssets),
  })

  const handleAnalyze = () => {
    const result = analyzeBalance({
      age: Number(draft.age) || 0,
      annualIncome: Number(draft.annualIncome) || 0,
      monthlyExpenses: Number(draft.monthlyExpenses) || 0,
      accounts: draft.accounts,
      hasDependents: draft.hasDependents,
      lifeContext: buildLifeContext(),
    })
    const advisorExplanation = draft.advisorMode
      ? generateAdvisorExplanation(scenarioFromDraft(buildAdvisorDraftFields(draft)))
      : null
    patch({ result, advisorExplanation })
    setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100)
  }

  const handleClear = () => {
    localStorage.removeItem(BALANCE_STORAGE_KEY)
    setDraft(defaultDraft())
    setSavedHint("Cleared saved data.")
  }

  const handleExport = () => {
    const payload = {
      ...buildBalanceExportPayload(draft, buildLifeContext()),
      disclaimer: "Educational output only — not financial, tax, or insurance advice.",
    }
    if (draft.advisorMode && draft.advisorExplanation) {
      Object.assign(payload, {
        advisorExplanation: buildLlmContextPayload(
          scenarioFromDraft(buildAdvisorDraftFields(draft)),
          draft.advisorExplanation
        ),
      })
    }
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `safora-balance-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImportClick = () => {
    setImportError(null)
    importInputRef.current?.click()
  }

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ""
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      const parsed = parseBalanceImportFile(String(reader.result ?? ""))
      if (!parsed.ok) {
        setImportError(parsed.error)
        return
      }
      const p = parsed.partial
      setDraft((d) => ({
        ...d,
        ...p,
        accounts: p.accounts ?? d.accounts,
        advisorFields: parsed.advisorFieldsPartial
          ? { ...defaultAdvisorFields(), ...parsed.advisorFieldsPartial }
          : p.advisorFields ?? d.advisorFields,
        advisorExplanation: null,
        showHousehold: Boolean(
          p.maritalStatus || p.spouseIncome || p.dependentCount !== undefined
        ),
        showDetails: Boolean(
          p.active401k || p.old401k || p.primaryHome || p.rentalEquity
        ),
      }))
      setImportError(null)
      setSavedHint("Imported portfolio data from file. Click Analyze to refresh results.")
    }
    reader.onerror = () => setImportError("Could not read the selected file.")
    reader.readAsText(file)
  }

  const handlePrint = () => {
    window.print()
  }

  const updateAccount = (index: number, field: "balance" | "monthlyContribution", value: number) => {
    patch({
      accounts: draft.accounts.map((a, i) => (i === index ? { ...a, [field]: value } : a)),
    })
  }

  const categories: AccountCategory[] = [
    "emergency",
    "retirement_tax_deferred",
    "retirement_roth",
    "taxable_brokerage",
    "insurance",
    "real_estate",
    "other",
  ]

  const { result } = draft

  return (
    <div className="space-y-6">
      <ComplianceDisclaimer />

      {savedHint && (
        <p className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-2">
          {savedHint}
        </p>
      )}

      {importError && (
        <p className="text-sm text-red-800 bg-red-50 border border-red-200 rounded-lg px-4 py-2">
          {importError}
        </p>
      )}

      <p className="text-sm text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-4 py-3">
        <strong>Your data stays on this device.</strong> Entries auto-save in this browser. Use{" "}
        <strong>Export</strong> to keep a JSON backup or <strong>Import</strong> to restore on another
        computer. Sign-in to sync across devices is planned when account login is re-enabled.
      </p>

      <input
        ref={importInputRef}
        type="file"
        accept="application/json,.json"
        className="hidden"
        onChange={handleImportFile}
        aria-hidden
      />

      <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-start">
        {/* ─── INPUTS ─── */}
        <div className="space-y-6 print:hidden" id="balance-inputs">
          <Card className="border-emerald-200 shadow-sm">
            <CardHeader className="bg-gradient-to-r from-emerald-50 to-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-white text-sm font-bold">
                  1
                </span>
                Enter your information
              </CardTitle>
              <CardDescription>
                Saved automatically in this browser — use back/forward without losing data.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <label className="flex items-start gap-3 rounded-lg border border-indigo-200 bg-indigo-50/60 p-4 cursor-pointer">
                <input
                  type="checkbox"
                  checked={draft.advisorMode}
                  onChange={(e) =>
                    patch({
                      advisorMode: e.target.checked,
                      advisorExplanation: e.target.checked ? draft.advisorExplanation : null,
                    })
                  }
                  className="mt-1 h-4 w-4"
                />
                <span>
                  <span className="font-semibold text-indigo-950 block">Advisor Explanation Mode</span>
                  <span className="text-sm text-indigo-800">
                    After analysis, show rules-based planning observations, risk flags, and
                    conversation prompts — for advisor education, not client recommendations.
                  </span>
                </span>
              </label>

              {draft.advisorMode && (
                <AdvisorScenarioFields
                  fields={draft.advisorFields}
                  onChange={(partial) =>
                    patch({ advisorFields: { ...draft.advisorFields, ...partial } })
                  }
                />
              )}

              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="age">Your age</Label>
                  <Input
                    id="age"
                    type="number"
                    min={18}
                    max={100}
                    value={draft.age}
                    onChange={(e) => patch({ age: e.target.value === "" ? "" : Number(e.target.value) })}
                  />
                </div>
                <div>
                  <Label htmlFor="income">Your annual income ($)</Label>
                  <Input
                    id="income"
                    type="number"
                    min={0}
                    value={draft.annualIncome}
                    onChange={(e) =>
                      patch({ annualIncome: e.target.value === "" ? "" : Number(e.target.value) })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="expenses">Monthly expenses ($)</Label>
                  <Input
                    id="expenses"
                    type="number"
                    min={0}
                    value={draft.monthlyExpenses}
                    onChange={(e) =>
                      patch({ monthlyExpenses: e.target.value === "" ? "" : Number(e.target.value) })
                    }
                  />
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900">Core accounts</h3>
                {draft.accounts.map((account, index) => (
                  <div
                    key={account.category}
                    className="grid sm:grid-cols-3 gap-3 items-end p-3 rounded-lg bg-gray-50/80"
                  >
                    <Label className="sm:col-span-1">{account.label}</Label>
                    <div>
                      <Label className="text-xs text-gray-500">Balance ($)</Label>
                      <Input
                        type="number"
                        min={0}
                        value={account.balance || ""}
                        onChange={(e) => updateAccount(index, "balance", Number(e.target.value) || 0)}
                      />
                    </div>
                    {account.category !== "insurance" && account.category !== "real_estate" && (
                      <div>
                        <Label className="text-xs text-gray-500">Monthly ($)</Label>
                        <Input
                          type="number"
                          min={0}
                          value={account.monthlyContribution ?? ""}
                          onChange={(e) =>
                            updateAccount(index, "monthlyContribution", Number(e.target.value) || 0)
                          }
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Life insurance — prominent */}
              <div className="rounded-lg border border-blue-200 bg-blue-50/50 p-4 space-y-3">
                <h3 className="font-semibold text-blue-900">Life insurance protection</h3>
                <p className="text-xs text-blue-800">
                  Death benefit (term + permanent) counts toward protection. Cash value is an asset only.
                  Policy suitability depends on need, underwriting, and compliance review.
                </p>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="term-life">Term life death benefit ($)</Label>
                    <Input
                      id="term-life"
                      type="number"
                      min={0}
                      value={draft.termLifeCoverage}
                      onChange={(e) =>
                        patch({ termLifeCoverage: e.target.value === "" ? "" : Number(e.target.value) })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="perm-life">Permanent life death benefit ($)</Label>
                    <Input
                      id="perm-life"
                      type="number"
                      min={0}
                      placeholder="Whole / UL / IUL face amount"
                      value={draft.permLifeDeathBenefit}
                      onChange={(e) =>
                        patch({ permLifeDeathBenefit: e.target.value === "" ? "" : Number(e.target.value) })
                      }
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <Label htmlFor="cash-value">Cash surrender value ($)</Label>
                    <Input
                      id="cash-value"
                      type="number"
                      min={0}
                      value={draft.cashValueLife}
                      onChange={(e) =>
                        patch({ cashValueLife: e.target.value === "" ? "" : Number(e.target.value) })
                      }
                    />
                  </div>
                </div>
              </div>

              <CollapsibleSection
                title="Household & life situation"
                open={draft.showHousehold}
                onToggle={() => patch({ showHousehold: !draft.showHousehold })}
              >
                <div className="grid sm:grid-cols-2 gap-3 pt-3">
                  <div>
                    <Label>Marital status</Label>
                    <select
                      value={draft.maritalStatus}
                      onChange={(e) =>
                        patch({ maritalStatus: e.target.value as LifeContext["maritalStatus"] })
                      }
                      className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                    >
                      <option value="single">Single</option>
                      <option value="married">Married</option>
                      <option value="partnered">Partnered</option>
                    </select>
                  </div>
                  <div>
                    <Label>Spouse/partner income ($)</Label>
                    <Input
                      type="number"
                      min={0}
                      value={draft.spouseIncome}
                      onChange={(e) =>
                        patch({ spouseIncome: e.target.value === "" ? "" : Number(e.target.value) })
                      }
                    />
                  </div>
                  <div>
                    <Label>Spouse retirement ($)</Label>
                    <Input
                      type="number"
                      min={0}
                      value={draft.spouseRetirement}
                      onChange={(e) =>
                        patch({ spouseRetirement: e.target.value === "" ? "" : Number(e.target.value) })
                      }
                    />
                  </div>
                  <div>
                    <Label>Dependents</Label>
                    <Input
                      type="number"
                      min={0}
                      value={draft.dependentCount}
                      onChange={(e) =>
                        patch({ dependentCount: e.target.value === "" ? "" : Number(e.target.value) })
                      }
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <Label>College costs, next 10 years ($)</Label>
                    <Input
                      type="number"
                      min={0}
                      value={draft.collegeFunding}
                      onChange={(e) =>
                        patch({ collegeFunding: e.target.value === "" ? "" : Number(e.target.value) })
                      }
                    />
                  </div>
                </div>
                <div className="flex flex-wrap gap-4 pt-3">
                  <CheckboxLabel
                    checked={draft.hasDependents}
                    onChange={(v) => patch({ hasDependents: v })}
                    label="Someone relies on my income"
                  />
                  <CheckboxLabel
                    checked={draft.healthConcerns}
                    onChange={(v) => patch({ healthConcerns: v })}
                    label="Health may affect insurance underwriting"
                  />
                  <CheckboxLabel
                    checked={draft.immigrationUncertain}
                    onChange={(v) => patch({ immigrationUncertain: v })}
                    label="Immigration / visa uncertain"
                  />
                </div>
              </CollapsibleSection>

              <CollapsibleSection
                title="Split accounts & other assets"
                open={draft.showDetails}
                onToggle={() => patch({ showDetails: !draft.showDetails })}
              >
                <div className="grid sm:grid-cols-2 gap-3 pt-3">
                  {[
                    ["Active 401(k) ($)", "active401k", draft.active401k],
                    ["Old / rollover 401(k) ($)", "old401k", draft.old401k],
                    ["Primary home equity ($)", "primaryHome", draft.primaryHome],
                    ["Rental property equity ($)", "rentalEquity", draft.rentalEquity],
                    ["Overseas assets ($)", "overseasAssets", draft.overseasAssets],
                    ["Crypto / digital ($)", "cryptoAssets", draft.cryptoAssets],
                  ].map(([label, key, val]) => (
                    <div key={key as string}>
                      <Label>{label as string}</Label>
                      <Input
                        type="number"
                        min={0}
                        value={val as number | ""}
                        onChange={(e) =>
                          patch({
                            [key as keyof DraftState]: e.target.value === "" ? "" : Number(e.target.value),
                          } as Partial<DraftState>)
                        }
                      />
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-600 pt-3">
                  Building a real estate portfolio?{" "}
                  <a
                    href="https://www.namasteneedham.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline inline-flex items-center gap-1"
                  >
                    Namaste Boston Homes
                    <ExternalLink className="h-3 w-3" />
                  </a>{" "}
                  offers local guidance for Massachusetts buyers and investors.
                </p>
              </CollapsibleSection>

              <div className="flex flex-wrap gap-3">
                <Button type="button" variant="outline" onClick={handleImportClick}>
                  <Upload className="mr-2 h-4 w-4" />
                  Import JSON
                </Button>
                <Button onClick={handleAnalyze} size="lg" className="bg-emerald-600 hover:bg-emerald-700">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Analyze my balance
                </Button>
                <Button type="button" variant="outline" size="lg" onClick={handleClear}>
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Clear saved data
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ─── RESULTS ─── */}
        <div ref={resultsRef} id="balance-results" className="space-y-6 lg:sticky lg:top-24">
          <Card className="border-slate-200 shadow-md min-h-[320px]">
            <CardHeader className="bg-gradient-to-r from-slate-100 to-white rounded-t-lg border-b">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-white text-sm font-bold">
                      2
                    </span>
                    Your results
                  </CardTitle>
                  <CardDescription>
                    {result
                      ? "Illustrative output from the information you entered"
                      : "Run analysis to see educational discussion topics"}
                  </CardDescription>
                </div>
                {result && (
                  <div className="flex gap-2 print:hidden">
                    <Button type="button" variant="outline" size="sm" onClick={handleImportClick}>
                      <Upload className="h-4 w-4 mr-1" />
                      Import
                    </Button>
                    <Button type="button" variant="outline" size="sm" onClick={handleExport}>
                      <Download className="h-4 w-4 mr-1" />
                      Export
                    </Button>
                    <Button type="button" variant="outline" size="sm" onClick={handlePrint}>
                      <Printer className="h-4 w-4 mr-1" />
                      Print
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              {!result ? (
                <div className="text-center py-16 text-gray-500">
                  <Sparkles className="h-10 w-10 mx-auto mb-3 text-gray-300" />
                  <p>Complete step 1 and click <strong>Analyze my balance</strong>.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <p className="text-xs text-amber-950 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 leading-relaxed">
                    {BALANCE_RESULTS_DISCLAIMER}
                  </p>

                  {result.contextNotes.map((note, i) => (
                    <p key={i} className="text-sm text-blue-900 bg-blue-50 rounded-lg px-3 py-2">
                      {note}
                    </p>
                  ))}

                  <div className="grid grid-cols-2 gap-3">
                    <Metric label="Total assets" value={`$${result.totalAssets.toLocaleString()}`} />
                    <Metric
                      label="Emergency fund"
                      value={`${result.emergencyFundMonths} / ${result.emergencyFundTargetMonths} mo`}
                    />
                    <Metric label="Savings rate" value={`${result.retirementSavingsRate}%`} />
                    <Metric label="Life coverage" value={`${result.insuranceCoverageRatio}x income`} />
                  </div>

                  {result.lifeCoverage.total > 0 && (
                    <div className="text-sm bg-gray-50 rounded-lg p-3">
                      <strong>Death benefit breakdown:</strong> term $
                      {result.lifeCoverage.term.toLocaleString()} + permanent $
                      {result.lifeCoverage.permanent.toLocaleString()} ={" "}
                      <strong>${result.lifeCoverage.total.toLocaleString()}</strong>
                    </div>
                  )}

                  <div>
                    <h4 className="font-semibold mb-2 text-sm">Allocation</h4>
                    <div className="space-y-2">
                      {categories.map((cat) =>
                        result.allocation[cat] > 0 ? (
                          <div key={cat} className="flex items-center gap-2 text-sm">
                            <span className="w-36 text-gray-600 truncate">{categoryLabel(cat)}</span>
                            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-emerald-600 rounded-full"
                                style={{
                                  width: `${Math.min(result.allocationPercent[cat], 100)}%`,
                                }}
                              />
                            </div>
                            <span className="w-10 text-right font-medium">
                              {result.allocationPercent[cat]}%
                            </span>
                          </div>
                        ) : null
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">Topics that may be worth reviewing</h4>
                    <div className="space-y-4">
                      {result.recommendations.map((rec, i) => (
                        <div key={i} className="rounded-lg border border-slate-200 p-4 bg-white">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <h5 className="font-semibold text-gray-900">{rec.title}</h5>
                            <Badge className={priorityColor(rec.priority)}>
                              {priorityLabel(rec.priority)}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{rec.reason}</p>
                          <p className="text-sm mb-3">
                            <strong>May be worth discussing:</strong> {rec.suggestedAction}
                          </p>
                          {rec.category === "insurance" && (
                            <p className="text-xs text-slate-600 mb-2 bg-slate-50 rounded px-2 py-1">
                              {CONTEXTUAL_DISCLAIMERS.lifeInsurance}
                            </p>
                          )}
                          {(rec.category === "retirement_roth" ||
                            rec.title.toLowerCase().includes("roth")) && (
                            <p className="text-xs text-slate-600 mb-2 bg-slate-50 rounded px-2 py-1">
                              {CONTEXTUAL_DISCLAIMERS.roth}
                            </p>
                          )}
                          {rec.references.length > 0 && (
                            <div className="flex flex-wrap gap-x-4 gap-y-1 pt-2 border-t border-slate-100">
                              <span className="text-xs text-gray-500 w-full">Reference material:</span>
                              {rec.references.map((ref) => (
                                <RefLink key={ref.url} href={ref.url} label={ref.label} />
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 print:hidden">
                    {result.recommendations.some((r) => r.category === "insurance") && (
                      <Button variant="outline" size="sm" asChild>
                        <Link href="/life-insurance">Life insurance tool (DIME)</Link>
                      </Button>
                    )}
                    {result.recommendations.some((r) => r.category === "real_estate") && (
                      <Button variant="outline" size="sm" asChild>
                        <a
                          href={BALANCE_REFERENCES.realEstateConcentration.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Namaste Boston Homes
                        </a>
                      </Button>
                    )}
                    <Button variant="ghost" size="sm" asChild>
                      <Link href="/classes">Upcoming classes</Link>
                    </Button>
                  </div>

                  <p className="text-xs text-gray-500 print:block">
                    Generated {new Date().toLocaleString()} — {BALANCE_RESULTS_DISCLAIMER}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {draft.advisorMode && draft.advisorExplanation && (
        <AdvisorExplanationPanel explanation={draft.advisorExplanation} />
      )}

      <PlanningInsightsAccordion />
    </div>
  )
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-slate-50 p-3 border border-slate-100">
      <div className="text-xs text-gray-500">{label}</div>
      <div className="text-lg font-bold text-gray-900">{value}</div>
    </div>
  )
}

function CollapsibleSection({
  title,
  open,
  onToggle,
  children,
}: {
  title: string
  open: boolean
  onToggle: () => void
  children: ReactNode
}) {
  return (
    <div className="border rounded-lg overflow-hidden">
      <button
        type="button"
        className="w-full flex items-center justify-between p-4 text-left font-medium hover:bg-gray-50"
        onClick={onToggle}
      >
        <span>{title} (optional)</span>
        <ChevronDown className={`h-5 w-5 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="px-4 pb-4 border-t">{children}</div>}
    </div>
  )
}

function CheckboxLabel({
  checked,
  onChange,
  label,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  label: string
}) {
  return (
    <label className="flex items-center gap-2 text-sm cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4"
      />
      {label}
    </label>
  )
}
