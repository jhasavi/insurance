"use client"

import React, { useState } from "react"

export function LifeInsuranceTool() {
  const [step, setStep] = useState(1)
  const [age, setAge] = useState<number | "">("")
  const [income, setIncome] = useState<number | "">("")
  const [debt, setDebt] = useState<number | "">("")
  const [mortgage, setMortgage] = useState<number | "">("")
  const [children, setChildren] = useState<number | "">("")
  const [goal, setGoal] = useState<string>("Income Replacement")
  const [submitted, setSubmitted] = useState(false)

  const toNumber = (v: number | string | "") => {
    if (v === "") return 0
    return Number(v || 0)
  }

  const computeCoverage = () => {
    const d = toNumber(debt)
    const m = toNumber(mortgage)
    const inc = toNumber(income)
    const c = toNumber(children)
    return d + m + inc * 10 + c * 100000
  }

  const recommendType = () => {
    const a = toNumber(age)
    if (goal === "Budget-Friendly") return { type: "Level Term", perm: false }
    if (a > 50 && goal === "Wealth Transfer") return { type: "Whole Life", perm: true }
    return { type: "Level Term", perm: false }
  }

  const recommendTermLength = () => {
    const a = toNumber(age)
    if (a <= 30) return 30
    if (a <= 40) return 20
    if (a <= 50) return 15
    return 10
  }

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault()
    setSubmitted(true)
  }

  const coverage = computeCoverage()
  const rec = recommendType()
  const termLength = rec.perm ? null : recommendTermLength()

  const fmt = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })

  return (
    <div>
      <form onSubmit={handleSubmit} className="bg-white shadow-sm rounded-lg p-6">
        <div className="flex items-center gap-2 mb-6">
          {[1, 2, 3].map((s) => (
            <div key={s} className={`flex-1 text-center py-2 rounded ${step === s ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
              Step {s}
            </div>
          ))}
        </div>

        {step === 1 && (
          <div className="space-y-4">
            <label className="block">
              <span className="text-sm font-medium text-gray-700">Age</span>
              <input type="number" min={0} value={age === "" ? "" : age} onChange={(e) => setAge(e.target.value === "" ? "" : Number(e.target.value))} className="mt-1 block w-full rounded-md border-gray-200 shadow-sm focus:ring-indigo-500 focus:border-indigo-500" required />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-gray-700">Annual Income (USD)</span>
              <input type="number" min={0} value={income === "" ? "" : income} onChange={(e) => setIncome(e.target.value === "" ? "" : Number(e.target.value))} className="mt-1 block w-full rounded-md border-gray-200 shadow-sm focus:ring-indigo-500 focus:border-indigo-500" required />
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
              </select>
            </label>
          </div>
        )}

        <div className="mt-6 flex items-center justify-between">
          <div>
            {step > 1 && (
              <button type="button" onClick={() => setStep((s) => s - 1)} className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">Back</button>
            )}
          </div>

          <div className="flex items-center gap-3">
            {step < 3 && (
              <button type="button" onClick={() => setStep((s) => s + 1)} className="inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">Next</button>
            )}
            {step === 3 && (
              <button type="submit" onClick={handleSubmit} className="inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-green-600 hover:bg-green-700">Get Recommendation</button>
            )}
          </div>
        </div>
      </form>

      {submitted && (
        <div className="mt-6 bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Recommendation</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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

          <div className="mt-4 text-sm text-gray-600">
            <strong>Notes:</strong> Coverage calculated with the DIME formula: Debt + Mortgage + (Income × 10) + (Children × $100,000). Adjust with agent advice as needed.
          </div>
        </div>
      )}
    </div>
  )
}

// helper values derived after state
function recTypeFromState(age: number | "", goal: string) {
  const a = age === "" ? 0 : Number(age)
  if (goal === "Budget-Friendly") return { type: "Level Term", perm: false }
  if (a > 50 && goal === "Wealth Transfer") return { type: "Whole Life", perm: true }
  return { type: "Level Term", perm: false }
}
