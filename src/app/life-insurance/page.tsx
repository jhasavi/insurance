"use client"

import React from "react"
import { LifeInsuranceTool } from "@/components/LifeInsuranceTool"

export default function LifeInsurancePage() {
  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-semibold text-gray-900 mb-4">Life Insurance Recommendation Tool</h1>
        <p className="text-sm text-gray-600 mb-6">Answer a few questions and get a quick, professional recommendation.</p>

        <section aria-labelledby="seo-intro" className="mb-6">
          <h2 id="seo-intro" className="text-lg font-medium text-gray-900">Boston Life Insurance Guidance</h2>
          <p className="text-sm text-gray-700">Designed for Massachusetts homeowners, this tool helps Boston-area families estimate coverage needs and explore options tailored to common local goals — mortgage protection, income replacement, and wealth transfer.</p>
          <p className="text-sm text-gray-700">Recommendations and one-pagers are prepared by Sanjeev Jha at Namaste Boston Homes to help advisors and consumers start informed conversations with carriers and brokers.</p>
        </section>

        <LifeInsuranceTool />
      </div>
    </main>
  )
}
