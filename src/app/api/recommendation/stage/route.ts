import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

type LeadStage = 'New' | 'Follow-up' | 'Closed'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const id = Number(body?.id)
    const stage = body?.stage as LeadStage

    if (!id || !['New', 'Follow-up', 'Closed'].includes(stage)) {
      return NextResponse.json({ ok: false, error: 'Invalid id or stage' }, { status: 400 })
    }

    const dataDir = path.resolve(process.cwd(), 'data')
    const file = path.join(dataDir, 'recommendations.json')

    let arr: any[] = []
    try {
      const raw = await fs.readFile(file, 'utf-8')
      arr = JSON.parse(raw || '[]')
    } catch {
      arr = []
    }

    const index = arr.findIndex((entry) => Number(entry?.id) === id)
    if (index === -1) {
      return NextResponse.json({ ok: false, error: 'Recommendation not found' }, { status: 404 })
    }

    arr[index] = {
      ...arr[index],
      leadStage: stage,
      inputs: {
        ...(arr[index]?.inputs || {}),
        leadStage: stage,
      },
      updatedAt: new Date().toISOString(),
    }

    await fs.writeFile(file, JSON.stringify(arr, null, 2), 'utf-8')
    return NextResponse.json({ ok: true, entry: arr[index] })
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 })
  }
}
