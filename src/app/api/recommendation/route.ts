import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const dataDir = path.resolve(process.cwd(), 'data')
    try { await fs.mkdir(dataDir) } catch {}
    const file = path.join(dataDir, 'recommendations.json')
    let arr = []
    try {
      const raw = await fs.readFile(file, 'utf-8')
      arr = JSON.parse(raw || '[]')
    } catch {
      arr = []
    }
    const entry = { id: Date.now(), createdAt: new Date().toISOString(), ...body }
    arr.push(entry)
    await fs.writeFile(file, JSON.stringify(arr, null, 2), 'utf-8')
    return NextResponse.json({ ok: true, entry })
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 })
  }
}
