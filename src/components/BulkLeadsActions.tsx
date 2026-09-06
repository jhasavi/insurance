'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { LeadStageSelector } from './LeadStageSelector'

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

function stageStyles(stage: LeadStage) {
  if (stage === 'Closed') return 'bg-green-100 text-green-800 border-green-200'
  if (stage === 'Follow-up') return 'bg-amber-100 text-amber-800 border-amber-200'
  return 'bg-blue-100 text-blue-800 border-blue-200'
}

function fmtCurrency(value?: number) {
  if (!value) return '—'
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value)
}

export function BulkLeadsActions({ leads }: { leads: RecommendationEntry[] }) {
  const router = useRouter()
  const [selected, setSelected] = useState<Set<number>>(new Set())
  const [bulkStage, setBulkStage] = useState<LeadStage>('Follow-up')
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const toggleAll = () => {
    if (selected.size === leads.length) {
      setSelected(new Set())
    } else {
      setSelected(new Set(leads.map((l) => l.id)))
    }
  }

  const toggleOne = (id: number) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const applyBulk = async () => {
    if (selected.size === 0) return
    setError(null)
    startTransition(async () => {
      const res = await fetch('/api/recommendation/bulk-stage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: Array.from(selected), stage: bulkStage }),
      })
      if (!res.ok) {
        setError('Failed to update stages. Please try again.')
        return
      }
      setSelected(new Set())
      router.refresh()
    })
  }

  const allChecked = leads.length > 0 && selected.size === leads.length
  const someChecked = selected.size > 0

  return (
    <div>
      {/* Bulk Toolbar */}
      <div
        className={`mb-4 flex flex-wrap items-center gap-3 rounded-lg border px-4 py-3 transition-all ${
          someChecked ? 'bg-indigo-50 border-indigo-200' : 'bg-white border-gray-200'
        }`}
      >
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={allChecked}
            onChange={toggleAll}
            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          {allChecked ? 'Deselect all' : `Select all (${leads.length})`}
        </label>

        {someChecked && (
          <>
            <span className="text-sm text-indigo-700 font-semibold">{selected.size} selected</span>
            <span className="text-gray-300">|</span>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              Move to:
              <select
                value={bulkStage}
                onChange={(e) => setBulkStage(e.target.value as LeadStage)}
                className="rounded-md border-gray-300 text-sm py-1"
              >
                <option value="New">New</option>
                <option value="Follow-up">Follow-up</option>
                <option value="Closed">Closed</option>
              </select>
            </label>
            <button
              onClick={applyBulk}
              disabled={isPending}
              className="inline-flex items-center px-3 py-1.5 bg-indigo-600 text-white rounded-md text-sm font-semibold hover:bg-indigo-700 disabled:opacity-50"
            >
              {isPending ? 'Updating…' : 'Apply'}
            </button>
            <button
              onClick={() => setSelected(new Set())}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Cancel
            </button>
          </>
        )}

        {error && <span className="text-sm text-red-600">{error}</span>}
      </div>

      {/* Lead Cards */}
      {leads.length === 0 ? (
        <div className="bg-white rounded-lg border p-8 text-center">
          <h2 className="text-lg font-semibold text-gray-900">No leads found</h2>
          <p className="text-sm text-gray-600 mt-1">
            Try a different filter or{' '}
            <Link href="/life-insurance" className="text-indigo-600 underline">
              create a new recommendation
            </Link>
            .
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {leads.map((entry) => {
            const stage = getStage(entry)
            const isChecked = selected.has(entry.id)
            return (
              <article
                key={entry.id}
                className={`bg-white border rounded-lg p-4 transition-all ${isChecked ? 'ring-2 ring-indigo-500 border-indigo-300' : ''}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleOne(entry.id)}
                      className="mt-0.5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900">
                        {entry.inputs?.clientName ? entry.inputs.clientName : `Lead #${entry.id}`}
                      </h3>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Saved {new Date(entry.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded border text-xs font-semibold ${stageStyles(stage)}`}
                  >
                    {stage}
                  </span>
                </div>

                <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <dt className="text-gray-500">Email</dt>
                    <dd className="font-medium text-gray-900 break-all">{entry.inputs?.email || '—'}</dd>
                  </div>
                  <div>
                    <dt className="text-gray-500">Recommended Type</dt>
                    <dd className="font-medium text-gray-900">{entry.recommendedType || '—'}</dd>
                  </div>
                  <div>
                    <dt className="text-gray-500">Coverage</dt>
                    <dd className="font-medium text-gray-900">{fmtCurrency(entry.coverage)}</dd>
                  </div>
                  <div>
                    <dt className="text-gray-500">Primary Goal</dt>
                    <dd className="font-medium text-gray-900">{entry.inputs?.goal || '—'}</dd>
                  </div>
                </dl>

                <div className="mt-4 flex items-center gap-2">
                  <Link
                    href={`/recommendation/${entry.id}`}
                    className="inline-flex items-center px-3 py-2 bg-indigo-600 text-white rounded text-xs font-semibold hover:bg-indigo-700"
                  >
                    Open Recommendation
                  </Link>
                  <Link
                    href="/life-insurance"
                    className="inline-flex items-center px-3 py-2 border rounded text-xs font-semibold text-gray-700 hover:bg-gray-50"
                  >
                    New Case
                  </Link>
                  <LeadStageSelector id={entry.id} stage={stage} />
                </div>
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}
