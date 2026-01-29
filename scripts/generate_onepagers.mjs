#!/usr/bin/env node
import fs from 'fs/promises'
import path from 'path'

async function render(entry) {
  const { recommendedType, coverage, termLength, inputs, createdAt, id } = entry
  const fmt = (v) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(v)
  const html = `<!doctype html>
  <html>
  <head>
    <meta charset="utf-8" />
    <title>Life Insurance Recommendation - ${id}</title>
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
    <div class="muted">Generated: ${createdAt || new Date().toISOString()}</div>

    <div class="card">
      <strong>Recommendation:</strong>
      <div>${recommendedType} ${termLength ? `— ${termLength} years` : '(Permanent)'}</div>
      <div>${fmt(coverage)}</div>
    </div>

    <div class="card">
      <strong>Inputs</strong>
      <table>
        <tr><th>Age</th><td>${inputs.age || '-'}</td></tr>
        <tr><th>Income</th><td>${fmt(inputs.income || 0)}</td></tr>
        <tr><th>Debt</th><td>${fmt(inputs.debt || 0)}</td></tr>
        <tr><th>Mortgage</th><td>${fmt(inputs.mortgage || 0)}</td></tr>
        <tr><th>Children</th><td>${inputs.children || 0}</td></tr>
        <tr><th>Goal</th><td>${inputs.goal}</td></tr>
      </table>
    </div>

    <div class="card">
      <strong>Underwriting Snapshot</strong>
      <ul>
        <li>Age eligibility: 18-85 (varies)</li>
        <li>Simplified issue: Available for lower face amounts</li>
        <li>Medical exam: Likely for larger face amounts</li>
      </ul>
    </div>

    <div class="card">
      <strong>Raw Recommendation Payload</strong>
      <pre style="white-space:pre-wrap; background:#f9fafb; padding:8px; border-radius:6px;">${JSON.stringify(entry, null, 2)}</pre>
    </div>

    <div class="muted">Prepared by Namaste Boston Homes — please confirm carrier product names and limits with underwriting.</div>
  </body>
  </html>`
  return html
}

async function main(){
  const dataFile = path.resolve(process.cwd(), 'data', 'recommendations.json')
  try {
    const raw = await fs.readFile(dataFile, 'utf-8')
    const arr = JSON.parse(raw || '[]')
    const outDir = path.resolve(process.cwd(), 'out')
    await fs.mkdir(outDir, { recursive: true })
    for (const e of arr.slice(0,3)) {
      const html = await render(e)
      const name = `onepager-${e.id || Date.now()}.html`
      await fs.writeFile(path.join(outDir, name), html, 'utf-8')
      console.log('Wrote', name)
    }
  } catch (err) {
    console.error('Failed to generate one-pagers', err)
    process.exit(1)
  }
}

main()
