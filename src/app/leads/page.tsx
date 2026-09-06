import fs from 'fs/promises'
import path from 'path'
import Link from 'next/link'
import { BulkLeadsActions } from '@/components/BulkLeadsActions'

type LeadStage = 'New' | 'Follow-up' | 'Closed'

type RecommendationEntry = {
  id: number
  createdAt: string
  recommendedType?: string
  coverage?: number
  termLength?: number | null
  leadStage?: LeadStage
  inputs?: {
    email?: string
    age?: number
    goal?: string
    clientName?: string
  }
}

function getStage(entry: RecommendationEntry): LeadStage {
  const raw = entry.leadStage || (entry as any)?.inputs?.leadStage
  if (raw === 'Follow-up' || raw === 'Closed') return raw
  return 'New'
}

export default async function LeadsPage({
  searchParams,
}: {
  searchParams?: { stage?: string; q?: string }
}) {
  const selectedStage = (searchParams?.stage || 'All') as 'All' | LeadStage
  const q = (searchParams?.q || '').trim().toLowerCase()

  const file = path.join(process.cwd(), 'data', 'recommendations.json')
  let leads: RecommendationEntry[] = []
  try {
    const raw = await fs.readFile(file, 'utf-8')
    leads = JSON.parse(raw || '[]')
  } catch {
    leads = []
  }

  const sorted = [...leads].sort((a, b) => Number(b.id) - Number(a.id))

  const counts = {
    All: sorted.length,
    New: sorted.filter((x) => getStage(x) === 'New').length,
    'Follow-up': sorted.filter((x) => getStage(x) === 'Follow-up').length,
    Closed: sorted.filter((x) => getStage(x) === 'Closed').length,
  }

  const filtered = sorted.filter((entry) => {
    const stage = getStage(entry)
    if (selectedStage !== 'All' && stage !== selectedStage) return false
    if (!q) return true
    const email = String(entry.inputs?.email || '').toLowerCase()
    const recType = String(entry.recommendedType || '').toLowerCase()
    const goal = String(entry.inputs?.goal || '').toLowerCase()
    const name = String(entry.inputs?.clientName || '').toLowerCase()
    return email.includes(q) || recType.includes(q) || goal.includes(q) || name.includes(q) || String(entry.id).includes(q)
  })

  const filterLink = (stage: 'All' | LeadStage) => {
    const params = new URLSearchParams()
    if (stage !== 'All') params.set('stage', stage)
    if (q) params.set('q', q)
    const query = params.toString()
    return `/leads${query ? `?${query}` : ''}`
  }

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Life Leads Dashboard</h1>
            <p className="text-sm text-gray-600 mt-1">
              Track your recommendation pipeline. Select multiple leads to update stages in bulk.
            </p>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <Link
              href="/life-insurance/scripts"
              className="inline-flex items-center px-3 py-2 border border-indigo-300 text-indigo-700 bg-white rounded-md text-sm font-medium hover:bg-indigo-50"
            >
              Script Library
            </Link>
            <Link
              href="/life-insurance"
              className="inline-flex items-center px-3 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700"
            >
              + New Recommendation
            </Link>
          </div>
        </div>

        {/* Stats bar */}
        <div className="mb-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {(['All', 'New', 'Follow-up', 'Closed'] as const).map((stage) => {
            const colors: Record<string, string> = {
              All: 'border-gray-200 bg-white',
              New: 'border-blue-200 bg-blue-50',
              'Follow-up': 'border-amber-200 bg-amber-50',
              Closed: 'border-green-200 bg-green-50',
            }
            const textColors: Record<string, string> = {
              All: 'text-gray-900',
              New: 'text-blue-900',
              'Follow-up': 'text-amber-900',
              Closed: 'text-green-900',
            }
            return (
              <Link
                key={stage}
                href={filterLink(stage)}
                className={`rounded-lg border p-3 text-center hover:opacity-90 transition ${colors[stage]} ${selectedStage === stage ? 'ring-2 ring-indigo-500' : ''}`}
              >
                <div className={`text-2xl font-bold ${textColors[stage]}`}>{counts[stage]}</div>
                <div className="text-xs font-medium text-gray-600 mt-0.5">{stage}</div>
              </Link>
            )
          })}
        </div>

        {/* Search */}
        <div className="mb-4 bg-white border rounded-lg p-4">
          <form className="flex flex-col sm:flex-row gap-3" method="GET" action="/leads">
            {selectedStage !== 'All' && <input type="hidden" name="stage" value={selectedStage} />}
            <input
              type="text"
              name="q"
              defaultValue={q}
              placeholder="Search by name, email, type, goal, or ID"
              className="flex-1 rounded-md border-gray-300 text-sm"
            />
            <button
              type="submit"
              className="inline-flex items-center px-3 py-2 bg-gray-900 text-white rounded-md text-sm font-medium hover:bg-black"
            >
              Search
            </button>
            {q && (
              <Link
                href={filterLink(selectedStage)}
                className="inline-flex items-center px-3 py-2 border rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Clear
              </Link>
            )}
          </form>
        </div>

        {/* Leads grid with bulk actions */}
        <BulkLeadsActions leads={filtered} />
      </div>
    </main>
  )
}
