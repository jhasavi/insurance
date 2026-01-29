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
  const [windfall, setWindfall] = useState<number | "">("")
  const [priority, setPriority] = useState<'Lowest Cost' | 'Comprehensive Living Benefits'>('Lowest Cost')
  const [comparisonMode, setComparisonMode] = useState<boolean>(true)
  const [wantLivingBenefitAccess, setWantLivingBenefitAccess] = useState<boolean>(false)
  const [wantWaiverOfPremium, setWantWaiverOfPremium] = useState<boolean>(false)
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

  const carrierSuggested = () => {
    const mapping = productMapping || {}
    const defaults = {
      transamerica: { name: 'Transamerica', notes: 'Good for budget/smaller face amounts' },
      nationwide: { name: 'Nationwide', notes: 'Strong living benefits & service' }
    }
    const trans = mapping.transamerica || defaults.transamerica
    const nw = mapping.nationwide || defaults.nationwide

    if (priority === 'Lowest Cost') return { carrier: trans.name, notes: trans.notes }
    return { carrier: nw.name, notes: nw.notes }
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
    const trans = mapping.transamerica || { term: { name: 'Level Term' }, whole: { name: 'Whole Life' }, products: {} }
    const wfg = mapping.wfg || {}
    const nationwide = mapping.nationwide || { term: { name: 'Term Select' }, products: { livingBenefits: { name: 'Living Benefits Rider' } } }

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

  const recommendCarrierByPriority = () => {
    return carrierSuggested()
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
      <div class="muted" style="margin-top:8px; font-size:12px;">Prepared for local advisors by Sanjeev Jha, Namaste Boston Homes (Boston, MA)</div>
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

  const printStrategyGuide = () => {
    const payload = { recommendedType: rec.type, coverage, termLength, inputs: { age, income, debt, mortgage, children, goal, replacementYears, inflationRate, tobaccoUse, healthRating, windfall, priority } }
    const carriers = carrierMatches()
    const suggested = recommendCarrierByPriority()
    const html = `<!doctype html>
    <html>
    <head>
      <meta charset="utf-8" />
      <title>Strategy Guide</title>
      <style>body{font-family:system-ui;padding:24px;color:#111827}h1{font-size:22px}table{width:100%;border-collapse:collapse}td,th{padding:8px;border-bottom:1px solid #eee}</style>
    </head>
    <body>
      <h1>Comprehensive Financial Strategy Guide</h1>
      <p><strong>Recommended:</strong> ${rec.type} ${termLength ? `— ${termLength} years` : '(Permanent)'}</p>
      <p><strong>Suggested Carrier:</strong> ${suggested.carrier} — ${suggested.notes}</p>
      <h2>Why this over Roth IRA / Annuity</h2>
      <p>Summary: ${income && toNumber(income) > 160000 && goal === 'Retirement' ? 'Roth IRA Alternative: IUL provides tax-advantaged cash growth, no standard contribution caps, and policy loan flexibility.' : 'Policy chosen to match client goals.'}</p>
      <h2>Strategy Comparison</h2>
      <table>
        <thead><tr><th>Product Type</th><th>Death Benefit</th><th>Cash Growth</th><th>Tax Advantage</th><th>Best For</th></tr></thead>
        <tbody>
          <tr><td>Level Term</td><td>High</td><td>None</td><td>None</td><td>Lowest Cost Income Replacement</td></tr>
          <tr><td>Whole Life</td><td>High</td><td>Steady</td><td>Tax-Deferred</td><td>Legacy / Guaranteed</td></tr>
          <tr><td>Indexed Universal Life (IUL)</td><td>High</td><td>Upside (index-linked)</td><td>Tax-Advantaged loans/withdrawals</td><td>Wealth Accumulation & Retirement</td></tr>
          <tr><td>Roth IRA</td><td>—</td><td>Market Exposure</td><td>Tax-Free Growth (contribution limits)</td><td>Tax-Free Retirement Income (low-to-mid earners)</td></tr>
          <tr><td>Annuity</td><td>N/A</td><td>Guaranteed / Variable</td><td>Tax-Deferred</td><td>Guaranteed Income</td></tr>
        </tbody>
      </table>

      ${coverage >= 1000000 ? `<h3>Legacy Option</h3><p>Your calculated need is ${fmt.format(coverage)} — consider a ${fmt.format(coverage*2)} legacy option to protect 20 years of income vs 10 years. Human Life Value suggests planning for longer horizons when you have dependents or estate goals.</p>` : ''}

      ${toNumber(windfall) > 100000 ? `<h3>Single Premium Pathway</h3><p>With a cash windfall, a single premium IUL may be attractive. Be mindful of MEC limits — large single premiums can trigger Modified Endowment Contract taxation.</p>` : ''}

      <h3>Riders</h3>
      <p>${wantLivingBenefitAccess ? 'Recommend Chronic/Critical Illness Rider (Nationwide strong offering).' : 'Consider Chronic/Critical Illness Rider if you want access to death benefit while alive.'}</p>
      <p>${wantWaiverOfPremium ? 'Waiver of Premium recommended for disability protection.' : 'Consider Waiver of Premium to maintain coverage if disabled.'}</p>

      <div style="margin-top:16px;font-size:12px;color:#6b7280">Prepared for local advisors by Sanjeev Jha, Namaste Boston Homes — Boston, MA</div>
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

  // Save and return entry (demo API)
  const saveRecommendation = async (payload: any) => {
    try {
      const res = await fetch('/api/recommendation', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      const json = await res.json()
      if (json?.ok) return json.entry
    } catch (e) {
      console.error('saveRecommendation', e)
    }
    return null
  }

  const handleSaveAndStartApplication = async (payload: any) => {
    const entry = await saveRecommendation(payload)
    if (!entry) { alert('Save failed'); return }
    try { window.open(`/recommendation/${entry.id}`, '_blank') } catch { alert('Unable to open application view') }
  }

  const handleEmailRecommendation = async (payload: any) => {
    const entry = await saveRecommendation(payload)
    const link = entry ? `${location.origin}/recommendation/${entry.id}` : ''
    const subject = encodeURIComponent('Life Insurance Recommendation')
    const bodyText = `Hi,\r\n\r\nHere is a recommended life insurance plan I prepared for you.\r\n\r\nCoverage: ${fmt.format(coverage)}\r\nType: ${rec.type}\r\nTerm: ${termLength ? `${termLength} years` : 'Permanent'}\r\n\r\nView full recommendation: ${link}\r\n\r\nBest,\r\nNamaste Insurance\r\n\r\nSanjeev`
    const body = encodeURIComponent(bodyText)
    try {
      window.location.href = `mailto:?subject=${subject}&body=${body}`
    } catch (e) {
      prompt('Copy this link to share:', link || JSON.stringify(payload, null, 2))
    }
  }

  const handleAddToClientProfile = async (payload: any) => {
    const entry = await saveRecommendation(payload)
    if (entry) {
      alert('Added to client profile (demo)')
    } else {
      alert('Add to profile failed')
    }
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
    // User-provided Calendly link
    const calendlyUrl = 'https://calendly.com/namaste1?data=' + encodeURIComponent(JSON.stringify(payload))
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
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2">
                <input data-testid="comparison-mode" type="checkbox" checked={comparisonMode} onChange={(e) => setComparisonMode(e.target.checked)} className="h-4 w-4" />
                <span className="text-sm">Comparison Mode</span>
              </label>

              <label className="flex items-center gap-2">
                <span className="text-sm">Priority</span>
                <select value={priority} onChange={(e) => setPriority(e.target.value as any)} className="ml-2 rounded border-gray-200">
                  <option>Lowest Cost</option>
                  <option>Comprehensive Living Benefits</option>
                </select>
              </label>
            </div>
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

        {step === 1 && (
          <div className="mt-4">
            <label className="block">
              <span className="text-sm font-medium text-gray-700">Cash Windfall (one-time, USD)</span>
              <input type="number" min={0} value={windfall === "" ? "" : windfall} onChange={(e) => setWindfall(e.target.value === "" ? "" : Number(e.target.value))} className="mt-1 block w-full rounded-md border-gray-200 shadow-sm" />
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

          {/* Strategy Comparison & Educational UI */}
          {comparisonMode && (
            <div className="mt-4 bg-white p-4 rounded border">
              <h3 className="font-semibold mb-2">Strategy Comparison</h3>
              <div className="overflow-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs text-gray-500"><th>Product Type</th><th>Death Benefit</th><th>Cash Growth</th><th>Tax Advantage</th><th>Best For</th></tr>
                  </thead>
                  <tbody>
                    <tr className="border-t"><td>Level Term</td><td>High</td><td>None</td><td>None</td><td>Lowest Cost Income Replacement</td></tr>
                    <tr className="border-t"><td>Whole Life</td><td>High</td><td>Steady</td><td>Tax-Deferred</td><td>Legacy / Guaranteed</td></tr>
                    <tr className="border-t"><td>IUL</td><td>High</td><td>Indexed Upside</td><td>Tax-Advantaged loans</td><td>Wealth Accumulation</td></tr>
                    <tr className="border-t"><td>Roth IRA</td><td>—</td><td>Market</td><td>Tax-Free (caps)</td><td>Tax-Free Retirement</td></tr>
                    <tr className="border-t"><td>Annuity</td><td>N/A</td><td>Guaranteed/Variable</td><td>Tax-Deferred</td><td>Guaranteed Income</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

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

          <div className="mt-4">
            {/* Rider selection module */}
            <div className="mb-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={wantLivingBenefitAccess} onChange={(e) => setWantLivingBenefitAccess(e.target.checked)} className="h-4 w-4" />
                <span className="text-sm">Would you like to access your death benefit while alive if you get sick? (Chronic/Critical illness)</span>
              </label>

              <label className="flex items-center gap-2">
                <input type="checkbox" checked={wantWaiverOfPremium} onChange={(e) => setWantWaiverOfPremium(e.target.checked)} className="h-4 w-4" />
                <span className="text-sm">If you become disabled, keep coverage active? (Waiver of Premium)</span>
              </label>
            </div>

            {/* Educational callouts */}
            {income && toNumber(income) > 160000 && goal === 'Retirement' && (
              <div className="mb-3 p-3 rounded border bg-yellow-50 text-sm text-yellow-800">
                <strong>Roth IRA Alternative:</strong> For higher earners, an IUL can act as a Roth alternative — no standard contribution caps, tax-advantaged cash growth, and policy loans. It can be superior for flexible retirement liquidity.
              </div>
            )}

            {toNumber(windfall) > 100000 && (
              <div className="mb-3 p-3 rounded border bg-blue-50 text-sm text-blue-800">
                <strong>Single Premium Pathway:</strong> With a cash windfall, consider a single-premium IUL. Note: large single premiums can create MEC tax treatment — consult underwriting.
              </div>
            )}

            {coverage >= 1000000 && (
              <div className="mb-3 p-3 rounded border bg-gray-50 text-sm text-gray-800">
                <strong>Legacy Option:</strong> Your need is {fmt.format(coverage)}. Consider a {fmt.format(coverage * 2)} legacy option to protect a longer horizon (HLV — 20 years vs 10 years rationale).
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={() => {
                const payload = { recommendedType: rec.type, coverage, termLength, inputs: { age, income, debt, mortgage, children, goal, replacementYears, inflationRate, tobaccoUse, healthRating, windfall, priority, wantLivingBenefitAccess, wantWaiverOfPremium, email } }
                void handleCopy(payload)
              }} className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">Copy Result</button>

              <button type="button" onClick={() => {
                const payload = { recommendedType: rec.type, coverage, termLength, inputs: { age, income, debt, mortgage, children, goal, replacementYears, inflationRate, tobaccoUse, healthRating, windfall, priority, wantLivingBenefitAccess, wantWaiverOfPremium, email } }
                handleDownload(payload)
              }} className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">Download JSON</button>

              <button type="button" onClick={async () => {
                const payload = { recommendedType: rec.type, coverage, termLength, inputs: { age, income, debt, mortgage, children, goal, replacementYears, inflationRate, tobaccoUse, healthRating, windfall, priority, wantLivingBenefitAccess, wantWaiverOfPremium, email } }
                await handleSaveAndStartApplication(payload)
              }} className="inline-flex items-center px-3 py-2 border border-indigo-600 rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">Start Application</button>

              <button type="button" onClick={() => {
                const payload = { recommendedType: rec.type, coverage, termLength, inputs: { age, income, debt, mortgage, children, goal, replacementYears, inflationRate, tobaccoUse, healthRating, windfall, priority, wantLivingBenefitAccess, wantWaiverOfPremium, email } }
                printStrategyGuide()
              }} className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">Download Strategy Guide (PDF)</button>

              <button type="button" onClick={async () => {
                const payload = { recommendedType: rec.type, coverage, termLength, inputs: { age, income, debt, mortgage, children, goal, replacementYears, inflationRate, tobaccoUse, healthRating, windfall, priority, wantLivingBenefitAccess, wantWaiverOfPremium, email } }
                await handleEmailRecommendation(payload)
              }} className="inline-flex items-center px-3 py-2 border border-blue-600 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">Email Recommendation</button>

              <button type="button" onClick={async () => {
                const payload = { recommendedType: rec.type, coverage, termLength, inputs: { age, income, debt, mortgage, children, goal, replacementYears, inflationRate, tobaccoUse, healthRating, windfall, priority, wantLivingBenefitAccess, wantWaiverOfPremium, email } }
                await handleAddToClientProfile(payload)
              }} className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">Add to Client Profile</button>

              <button type="button" onClick={() => {
                const payload = { recommendedType: rec.type, coverage, termLength, inputs: { age, income, debt, mortgage, children, goal, replacementYears, inflationRate, tobaccoUse, healthRating, windfall, priority, wantLivingBenefitAccess, wantWaiverOfPremium, email } }
                handleSchedule(payload)
              }} className="inline-flex items-center px-3 py-2 border border-green-600 rounded-md text-sm font-medium text-white bg-green-600 hover:bg-green-700">Schedule Consultation</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
