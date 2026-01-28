"use client"

import React from "react"
import { LifeInsuranceTool } from "@/components/LifeInsuranceTool"

export default function LifeInsurancePage() {
  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-semibold text-gray-900 mb-4">Life Insurance Recommendation Tool</h1>
        <p className="text-sm text-gray-600 mb-6">Answer a few questions and get a quick, professional recommendation.</p>

        <LifeInsuranceTool />
      </div>
    </main>
  )
}
