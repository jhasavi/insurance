"use client"

import React from "react"
import { LifeInsuranceTool } from "@/components/LifeInsuranceTool"

export default function LifeInsurancePage() {
  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-semibold text-gray-900 mb-4">Life Insurance Recommendation Tool</h1>
        <p className="text-sm text-gray-600 mb-6">Answer a few questions and get a quick, professional recommendation.</p>

        {/* Critical Compliance Disclaimer */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded">
          <p className="text-sm text-gray-700 leading-relaxed">
            <strong className="font-semibold">Important:</strong> This tool provides educational estimates only and is not a 
            solicitation or offer to sell insurance. Recommendations are illustrative and subject to 
            underwriting approval. Coverage amounts, policy types, and premiums may vary significantly 
            based on health, lifestyle, and carrier-specific underwriting. <strong>Always consult with 
            a licensed insurance agent</strong> before making coverage decisions. This tool does not 
            constitute financial or legal advice.
          </p>
        </div>

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
