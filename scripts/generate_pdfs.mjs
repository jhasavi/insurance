#!/usr/bin/env node
import fs from 'fs'
import { chromium } from 'playwright'

async function ensureDir(dir) {
  try { await fs.promises.mkdir(dir, { recursive: true }) } catch {}
}

;(async () => {
  const out = './out'
  await ensureDir(out)
  const browser = await chromium.launch()
  const page = await browser.newPage()
  const base = process.env.BASE_URL || 'http://localhost:3001'
  const targets = ['/agent-one-pager', '/life-insurance']

  for (const t of targets) {
    const url = base + t
    console.log('Rendering', url)
    await page.goto(url, { waitUntil: 'networkidle' })
    const pathOut = `./out/${t.replace(/\//g,'').replace(/^_/, '') || 'page'}.pdf`
    try {
      await page.pdf({ path: pathOut, format: 'A4' })
      console.log('Saved PDF:', pathOut)
    } catch (e) {
      console.error('PDF save failed for', url, e)
    }
  }

  await browser.close()
})().catch((e) => { console.error(e); process.exit(1) })
