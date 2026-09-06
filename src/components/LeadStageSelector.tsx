"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type LeadStage = 'New' | 'Follow-up' | 'Closed'

export function LeadStageSelector({ id, stage }: { id: number; stage: LeadStage }) {
  const [value, setValue] = useState<LeadStage>(stage)
  const [saving, setSaving] = useState(false)
  const router = useRouter()

  const update = async (next: LeadStage) => {
    setValue(next)
    setSaving(true)
    try {
      const res = await fetch('/api/recommendation/stage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, stage: next }),
      })

      if (!res.ok) {
        setValue(stage)
        alert('Could not update lead stage')
      } else {
        router.refresh()
      }
    } catch {
      setValue(stage)
      alert('Could not update lead stage')
    } finally {
      setSaving(false)
    }
  }

  return (
    <label className="inline-flex items-center gap-2 text-xs text-gray-600">
      <span>Stage</span>
      <select
        value={value}
        onChange={(e) => void update(e.target.value as LeadStage)}
        disabled={saving}
        className="rounded border-gray-300 text-xs"
      >
        <option value="New">New</option>
        <option value="Follow-up">Follow-up</option>
        <option value="Closed">Closed</option>
      </select>
    </label>
  )
}
