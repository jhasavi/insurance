"use client"

import React, { useState } from 'react'

export function AiTransparencyBadge() {
  const [open, setOpen] = useState(false)
  return (
    <div className="relative inline-block">
      <button onClick={() => setOpen(true)} className="px-2 py-1 text-sm bg-blue-50 rounded border border-blue-100">AI Info</button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded shadow-lg max-w-xl p-6">
            <h3 className="text-lg font-bold mb-2">How our AI works</h3>
            <p className="text-sm text-gray-700 mb-2">We use OCR and GPT-4 Vision to extract fields from your policy. Confidence scores reflect model and OCR certainty.</p>
            <p className="text-xs text-gray-500">These scores are estimates and should be validated by an agent for final decisions.</p>
            <div className="mt-4 flex justify-end">
              <button onClick={() => setOpen(false)} className="px-3 py-1 bg-blue-600 text-white rounded">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
