import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

const DATA_FILE = path.join(process.cwd(), 'data', 'recommendations.json')

type LeadStage = 'New' | 'Follow-up' | 'Closed'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { ids, stage } = body as { ids: number[]; stage: LeadStage }

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: 'ids array is required' }, { status: 400 })
    }
    if (!['New', 'Follow-up', 'Closed'].includes(stage)) {
      return NextResponse.json({ error: 'Invalid stage' }, { status: 400 })
    }

    let entries: unknown[] = []
    try {
      const raw = await fs.readFile(DATA_FILE, 'utf-8')
      entries = JSON.parse(raw || '[]')
    } catch {
      return NextResponse.json({ error: 'Data file not found' }, { status: 404 })
    }

    const idSet = new Set(ids.map(Number))
    let updated = 0
    const result = (entries as Array<Record<string, unknown>>).map((entry) => {
      if (idSet.has(Number(entry.id))) {
        updated++
        return { ...entry, leadStage: stage, updatedAt: new Date().toISOString() }
      }
      return entry
    })

    await fs.writeFile(DATA_FILE, JSON.stringify(result, null, 2), 'utf-8')
    return NextResponse.json({ ok: true, updated })
  } catch (err) {
    console.error('[bulk-stage] error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
