"use client"

import React, { useEffect, useState } from 'react'

export function EngagementBadge() {
  const [score, setScore] = useState<number | null>(null)

  useEffect(() => {
    const raw = localStorage.getItem('engagementScore')
    if (raw) {
      const n = Number(raw)
      if (!Number.isNaN(n)) setScore(n)
    } else {
      const initial = 72
      localStorage.setItem('engagementScore', String(initial))
      setScore(initial)
    }
  }, [])

  return (
    <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
      <span className="font-semibold">Engagement</span>
      <span aria-hidden>•</span>
      <span>{score ?? '—'}%</span>
    </div>
  )
}
