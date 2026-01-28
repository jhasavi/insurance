"use client"

import React, { useState, useEffect, useRef } from "react"

export function LifeInsuranceTool() {
  const [step, setStep] = useState(1)
  const [age, setAge] = useState<number | "">("")
  const [income, setIncome] = useState<number | "">("")
  const [debt, setDebt] = useState<number | "">("")
  const [mortgage, setMortgage] = useState<number | "">("")
  const [children, setChildren] = useState<number | "">("")
  const [goal, setGoal] = useState<string>("Income Replacement")
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const liveRegionRef = useRef<HTMLDivElement | null>(null)

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
      }
    } catch (e) {}
  }, [])

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault()
    const nextErrors: Record<string, string> = {}
    if (age === "" || Number(age) <= 0) nextErrors.age = "Please enter a valid age."
    if (income === "" || Number(income) < 0) nextErrors.income = "Please enter a valid income."

    setErrors(nextErrors)
    const isValid = Object.keys(nextErrors).length === 0
    if (!isValid) {
      setStep(1)
      return
    }

    const payload = { age, income, debt, mortgage, children, goal }
    try { localStorage.setItem("lifeInsuranceInput", JSON.stringify(payload)) } catch (e) {}
    try { console.log("analytics:event", "life_insurance_submitted", payload) } catch (e) {}

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
    setGoal("Income Replacement")
    setSubmitted(false)
    setErrors({})
    try { localStorage.removeItem("lifeInsuranceInput") } catch (e) {}
  }

  const coverage = computeCoverage()
  const rec = recommendType()
  const termLength = rec.perm ? null : recommendTermLength()

  const fmt = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })

  const carrierMatches = () => {
    // Suggested carrier/product mapping (confirm product codes with carrier/WFG)
    if (rec.type?.toLowerCase().includes("term")) {
      return [
        { carrier: "Transamerica", product: "Level Term (10/15/20/30)", notes: "Good for budget-friendly income replacement; competitive underwriting" },
        { carrier: "WFG-distributed Term", product: "Partner Term Options", notes: "Varies by carrier; suitable for term comparisons" },
      ]
    }

    if (rec.type?.toLowerCase().includes("whole")) {
      return [
        { carrier: "Transamerica", product: "Whole Life", notes: "Stable permanent coverage for wealth transfer; cash value accumulation" },
        { carrier: "WFG", product: "Whole Life Partners", notes: "Agency-distributed whole life options to consider" },
      ]
    }

    // default suggestions
    return [
      { carrier: "Transamerica", product: "Level Term / Whole Life", notes: "Contact carrier rep for best-fit product" },
    ]
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

  const printOnePager = () => {
    const payload = { recommendedType: rec.type, coverage, termLength, inputs: { age, income, debt, mortgage, children, goal } }
    const carriers = carrierMatches()
    const uw = underwritingSnapshot()
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

      <div class="card">
        <strong>Recommendation:</strong>
        <div>${rec.type} ${termLength ? `— ${termLength} years` : '(Permanent)'}</div>
        <div>${fmt.format(coverage)}</div>
      </div>

      <div class="card">
        <strong>Inputs</strong>
        <table>
          <tr><th>Age</th><td>${age || '-'}</td></tr>
          <tr><th>Income</th><td>${fmt.format(Number(income || 0))}</td></tr>
          <tr><th>Debt</th><td>${fmt.format(Number(debt || 0))}</td></tr>
          <tr><th>Mortgage</th><td>${fmt.format(Number(mortgage || 0))}</td></tr>
          <tr><th>Children</th><td>${children || 0}</td></tr>
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

      <div class="muted">Prepared by Safora — confirm carrier product names and offer details with underwriting/broker portal.</div>
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
              <input aria-invalid={!!errors.age} aria-describedby={errors.age ? "age-error" : undefined} type="number" min={0} value={age === "" ? "" : age} onChange={(e) => setAge(e.target.value === "" ? "" : Number(e.target.value))} className="mt-1 block w-full rounded-md border-gray-200 shadow-sm focus:ring-indigo-500 focus:border-indigo-500" required />
              {errors.age && <p id="age-error" className="mt-1 text-xs text-red-600">{errors.age}</p>}
            </label>

            <label className="block">
              <span className="text-sm font-medium text-gray-700">Annual Income (USD)</span>
              <input aria-invalid={!!errors.income} aria-describedby={errors.income ? "income-error" : undefined} type="number" min={0} value={income === "" ? "" : income} onChange={(e) => setIncome(e.target.value === "" ? "" : Number(e.target.value))} className="mt-1 block w-full rounded-md border-gray-200 shadow-sm focus:ring-indigo-500 focus:border-indigo-500" required />
              {errors.income && <p id="income-error" className="mt-1 text-xs text-red-600">{errors.income}</p>}
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
              <div className="flex items-center gap-2">
                <button type="submit" onClick={handleSubmit} className="inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-green-600 hover:bg-green-700">Get Recommendation</button>
                <button type="button" onClick={handleReset} className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">Reset</button>
              </div>
            )}
          </div>
        </div>
      </form>

      {submitted && (
        <div className="mt-6 bg-white shadow rounded-lg p-6" aria-live="polite" tabIndex={-1} ref={liveRegionRef}>
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

          <div className="mt-4 flex items-center gap-3">
            <button type="button" onClick={() => {
              const payload = { recommendedType: rec.type, coverage, termLength, inputs: { age, income, debt, mortgage, children, goal } }
              try { navigator.clipboard.writeText(JSON.stringify(payload, null, 2)); alert('Recommendation copied to clipboard') } catch (e) { console.log(e) }
            }} className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">Copy Result</button>

            <button type="button" onClick={() => {
              const payload = { recommendedType: rec.type, coverage, termLength, inputs: { age, income, debt, mortgage, children, goal } }
              const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
              const url = URL.createObjectURL(blob)
              const a = document.createElement('a')
              a.href = url
              a.download = 'life-insurance-recommendation.json'
              document.body.appendChild(a)
              a.click()
              a.remove()
              URL.revokeObjectURL(url)
            }} className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">Download JSON</button>
          </div>
        </div>
      )}
    </div>
  )
}
