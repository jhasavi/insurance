"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ComplianceDisclaimer } from "@/components/ComplianceDisclaimer"
import {
  analyzeBalance,
  categoryLabel,
  type AccountCategory,
  type AccountInput,
} from "@/lib/financial-balance"

const DEFAULT_ACCOUNTS: AccountInput[] = [
  { category: "emergency", label: "Emergency fund", balance: 0, monthlyContribution: 0 },
  { category: "retirement_tax_deferred", label: "401(k) / IRA (pre-tax)", balance: 0, monthlyContribution: 0 },
  { category: "retirement_roth", label: "Roth IRA / Roth 401(k)", balance: 0, monthlyContribution: 0 },
  { category: "taxable_brokerage", label: "Taxable brokerage", balance: 0, monthlyContribution: 0 },
  { category: "insurance", label: "Cash value life insurance", balance: 0 },
  { category: "real_estate", label: "Real estate equity", balance: 0 },
]

function priorityColor(priority: "high" | "medium" | "low") {
  if (priority === "high") return "bg-red-100 text-red-800"
  if (priority === "medium") return "bg-amber-100 text-amber-800"
  return "bg-green-100 text-green-800"
}

export function FinancialBalanceTool() {
  const [age, setAge] = useState<number | "">(40)
  const [annualIncome, setAnnualIncome] = useState<number | "">(120000)
  const [monthlyExpenses, setMonthlyExpenses] = useState<number | "">(6000)
  const [accounts, setAccounts] = useState<AccountInput[]>(DEFAULT_ACCOUNTS)
  const [lifeInsuranceCoverage, setLifeInsuranceCoverage] = useState<number | "">("")
  const [hasDependents, setHasDependents] = useState(true)
  const [result, setResult] = useState<ReturnType<typeof analyzeBalance> | null>(null)

  const updateAccount = (index: number, field: "balance" | "monthlyContribution", value: number) => {
    setAccounts((prev) =>
      prev.map((a, i) => (i === index ? { ...a, [field]: value } : a))
    )
  }

  const handleAnalyze = () => {
    const analysis = analyzeBalance({
      age: Number(age) || 0,
      annualIncome: Number(annualIncome) || 0,
      monthlyExpenses: Number(monthlyExpenses) || 0,
      accounts,
      lifeInsuranceCoverage: lifeInsuranceCoverage === "" ? undefined : Number(lifeInsuranceCoverage),
      hasDependents,
    })
    setResult(analysis)
  }

  const categories: AccountCategory[] = [
    "emergency",
    "retirement_tax_deferred",
    "retirement_roth",
    "taxable_brokerage",
    "insurance",
    "real_estate",
  ]

  return (
    <div className="space-y-8">
      <ComplianceDisclaimer />

      <Card>
        <CardHeader>
          <CardTitle>Your financial snapshot</CardTitle>
          <CardDescription>
            Enter balances across your accounts. All data stays in your browser — nothing is stored on our servers.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                min={18}
                max={100}
                value={age}
                onChange={(e) => setAge(e.target.value === "" ? "" : Number(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="income">Annual gross income ($)</Label>
              <Input
                id="income"
                type="number"
                min={0}
                value={annualIncome}
                onChange={(e) => setAnnualIncome(e.target.value === "" ? "" : Number(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="expenses">Monthly expenses ($)</Label>
              <Input
                id="expenses"
                type="number"
                min={0}
                value={monthlyExpenses}
                onChange={(e) => setMonthlyExpenses(e.target.value === "" ? "" : Number(e.target.value))}
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="life-coverage">Term life insurance coverage ($)</Label>
              <Input
                id="life-coverage"
                type="number"
                min={0}
                placeholder="Optional — death benefit amount"
                value={lifeInsuranceCoverage}
                onChange={(e) =>
                  setLifeInsuranceCoverage(e.target.value === "" ? "" : Number(e.target.value))
                }
              />
            </div>
            <div className="flex items-end gap-2 pb-2">
              <input
                id="dependents"
                type="checkbox"
                checked={hasDependents}
                onChange={(e) => setHasDependents(e.target.checked)}
                className="h-4 w-4"
              />
              <Label htmlFor="dependents">I have financial dependents</Label>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Account balances</h3>
            {accounts.map((account, index) => (
              <div key={account.category} className="grid md:grid-cols-3 gap-3 items-end">
                <div className="md:col-span-1">
                  <Label>{account.label}</Label>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Current balance ($)</Label>
                  <Input
                    type="number"
                    min={0}
                    value={account.balance || ""}
                    onChange={(e) => updateAccount(index, "balance", Number(e.target.value) || 0)}
                  />
                </div>
                {account.category !== "insurance" && account.category !== "real_estate" && (
                  <div>
                    <Label className="text-xs text-gray-500">Monthly contribution ($)</Label>
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

          <Button onClick={handleAnalyze} size="lg" className="w-full md:w-auto">
            Analyze my balance
          </Button>
        </CardContent>
      </Card>

      {result && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Portfolio overview</CardTitle>
              <CardDescription>{result.summary}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="rounded-lg bg-gray-50 p-4">
                  <div className="text-sm text-gray-600">Total assets entered</div>
                  <div className="text-2xl font-bold">
                    ${result.totalAssets.toLocaleString()}
                  </div>
                </div>
                <div className="rounded-lg bg-gray-50 p-4">
                  <div className="text-sm text-gray-600">Emergency fund</div>
                  <div className="text-2xl font-bold">{result.emergencyFundMonths} mo</div>
                </div>
                <div className="rounded-lg bg-gray-50 p-4">
                  <div className="text-sm text-gray-600">Est. savings rate</div>
                  <div className="text-2xl font-bold">{result.retirementSavingsRate}%</div>
                </div>
                <div className="rounded-lg bg-gray-50 p-4">
                  <div className="text-sm text-gray-600">Life coverage ratio</div>
                  <div className="text-2xl font-bold">{result.insuranceCoverageRatio}x income</div>
                </div>
              </div>

              <h4 className="font-semibold mb-3">Allocation</h4>
              <div className="space-y-2">
                {categories.map((cat) =>
                  result.allocation[cat] > 0 || result.allocationPercent[cat] > 0 ? (
                    <div key={cat} className="flex items-center gap-3">
                      <span className="w-40 text-sm text-gray-600 shrink-0">{categoryLabel(cat)}</span>
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-600 rounded-full"
                          style={{ width: `${Math.min(result.allocationPercent[cat], 100)}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium w-16 text-right">
                        {result.allocationPercent[cat]}%
                      </span>
                    </div>
                  ) : null
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Where to focus next</CardTitle>
              <CardDescription>
                Prioritized educational prompts based on common planning guidelines
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {result.recommendations.map((rec, i) => (
                <div key={i} className="rounded-lg border p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h4 className="font-semibold">{rec.title}</h4>
                    <Badge className={priorityColor(rec.priority)}>{rec.priority} priority</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{rec.reason}</p>
                  <p className="text-sm">
                    <strong>Suggested action:</strong> {rec.suggestedAction}
                  </p>
                </div>
              ))}
              {result.recommendations.some((r) => r.category === "insurance") && (
                <Button variant="outline" asChild>
                  <Link href="/life-insurance">Open life insurance recommendation tool</Link>
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
