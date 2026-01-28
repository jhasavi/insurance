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
  const [replacementYears, setReplacementYears] = useState<number>(10)
  const [inflationRate, setInflationRate] = useState<number>(3)
  const [tobaccoUse, setTobaccoUse] = useState<boolean>(false)
  const [healthRating, setHealthRating] = useState<string>('Standard')
  const [email, setEmail] = useState<string>('')
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
    // Apply replacement years and inflation multiplier to preserve purchasing power over 20 years
    const years = replacementYears || 10
    const infl = (1 + (Number(inflationRate) || 0) / 100)
    const inflationMultiplier = Math.pow(infl, 20)
    const incomeReplacement = inc * years * inflationMultiplier
    return d + m + incomeReplacement + c * 100000
  }

  const recommendType = () => {
    const a = toNumber(age)
    if (goal === "Budget-Friendly") return { type: "Level Term", perm: false }
    // New logic: Wealth Accumulation for younger clients -> IUL
    if (goal === 'Wealth Accumulation' && a < 50) return { type: 'Indexed Universal Life (IUL)', perm: true, features: ['Cash Value Growth', 'Tax-Free Loans'] }
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
        if (obj.replacementYears !== undefined) setReplacementYears(obj.replacementYears)
        if (obj.inflationRate !== undefined) setInflationRate(obj.inflationRate)
        if (obj.tobaccoUse !== undefined) setTobaccoUse(obj.tobaccoUse)
        if (obj.healthRating !== undefined) setHealthRating(obj.healthRating)
        if (obj.email !== undefined) setEmail(obj.email)
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
    if (income === "" || Number(income) < 0) nextErrors.income = "Please enter a valid income."

    setErrors(nextErrors)
    const isValid = Object.keys(nextErrors).length === 0
    if (!isValid) {
      setStep(1)
      return
    }

    const payload = { age, income, debt, mortgage, children, goal, replacementYears, inflationRate, tobaccoUse, healthRating, email }
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
    setGoal("Income Replacement")
    setSubmitted(false)
    setErrors({})
    try { localStorage.removeItem("lifeInsuranceInput") } catch {}
  }

  const coverage = computeCoverage()
  const rec = recommendType()
  const termLength = rec.perm ? null : recommendTermLength()

  const fmt = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })

  const carrierMatches = () => {
    // Use static mapping when available to show carrier-specific product names
    const mapping = productMapping || {}
    const trans = mapping.transamerica || {}
    const wfg = mapping.wfg || {}

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

      <div class="card">
        <strong>Raw Recommendation Payload</strong>
        <pre style="white-space:pre-wrap; background:#f9fafb; padding:8px; border-radius:6px;">${JSON.stringify(payload, null, 2)}</pre>
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
    const calendlyUrl = 'https://calendly.com/your-organization/consult?data=' + encodeURIComponent(JSON.stringify(payload))
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
                <option>Wealth Accumulation</option>
              </select>
            </label>

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
            <strong>Notes:</strong> Coverage calculated with the DIME formula: Debt + Mortgage + (Income × Replacement Years × inflation adjustment over 20 years) + (Children × $100,000). Adjust with agent advice as needed.
          </div>

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
                    try { localStorage.setItem('lifeInsuranceInput', JSON.stringify({ age, income, debt, mortgage, children, goal, replacementYears, inflationRate, tobaccoUse, healthRating, email, unlocked: true })) } catch {}
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
                  Income replacement ({replacementYears}×, inflation_adj): {fmt.format(toNumber(income) * replacementYears * Math.pow(1 + (Number(inflationRate) || 0)/100, 20))}<br />
                  Children: {fmt.format(toNumber(children) * 100000)}<br />
                  <strong>Total:</strong> {fmt.format(coverage)}
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

          <div className="mt-4 flex items-center gap-3">
            <button type="button" onClick={() => {
              const payload = { recommendedType: rec.type, coverage, termLength, inputs: { age, income, debt, mortgage, children, goal, replacementYears, inflationRate, tobaccoUse, healthRating, email } }
              void handleCopy(payload)
            }} className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">Copy Result</button>

            <button type="button" onClick={() => {
              const payload = { recommendedType: rec.type, coverage, termLength, inputs: { age, income, debt, mortgage, children, goal, replacementYears, inflationRate, tobaccoUse, healthRating, email } }
              handleDownload(payload)
            }} className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">Download JSON</button>
            <button type="button" onClick={async () => {
              const payload = { recommendedType: rec.type, coverage, termLength, inputs: { age, income, debt, mortgage, children, goal, replacementYears, inflationRate, tobaccoUse, healthRating, email } }
              await handleSave(payload)
            }} className="inline-flex items-center px-3 py-2 border border-indigo-600 rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">Save to CRM</button>

            <button type="button" onClick={() => {
              const payload = { recommendedType: rec.type, coverage, termLength, inputs: { age, income, debt, mortgage, children, goal, replacementYears, inflationRate, tobaccoUse, healthRating, email } }
              handlePrint(payload)
            }} className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">Print</button>

            <button type="button" onClick={() => {
              const payload = { recommendedType: rec.type, coverage, termLength, inputs: { age, income, debt, mortgage, children, goal, replacementYears, inflationRate, tobaccoUse, healthRating, email } }
              handleSchedule(payload)
            }} className="inline-flex items-center px-3 py-2 border border-green-600 rounded-md text-sm font-medium text-white bg-green-600 hover:bg-green-700">Schedule Consultation</button>
          </div>
        </div>
      )}
    </div>
  )
}
