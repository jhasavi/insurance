"use client"

import Link from "next/link"
import { UserNav } from "./user-nav"
import { EngagementBadge } from "./EngagementBadge"
import { Shield } from "lucide-react"

export function Header() {
  return (
    <header className="border-b bg-white sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <Shield className="h-6 w-6 text-blue-600" />
          <span>Safora</span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/life-insurance" className="text-gray-700 font-medium hover:text-gray-900">
            Life Insurance
          </Link>

          <details className="relative">
            <summary className="list-none cursor-pointer text-gray-600 hover:text-gray-900">Tools</summary>
            <div className="absolute mt-2 w-56 bg-white border rounded-md shadow-lg p-2">
              <Link href="/leads" className="block px-2 py-1 text-sm text-gray-700 hover:bg-gray-50">Life Leads Dashboard</Link>
              <Link href="/life-insurance/scripts" className="block px-2 py-1 text-sm text-gray-700 hover:bg-gray-50">Script Library</Link>
              <Link href="/life-insurance/learn" className="block px-2 py-1 text-sm text-gray-700 hover:bg-gray-50">Knowledge Base</Link>
              <Link href="/compare" className="block px-2 py-1 text-sm text-gray-700 hover:bg-gray-50">Compare Quotes (Internal Beta)</Link>
              <Link href="/scan" className="block px-2 py-1 text-sm text-gray-700 hover:bg-gray-50">Scan Policy</Link>
            </div>
          </details>

          <Link href="/how-it-works" className="text-gray-600 hover:text-gray-900">
            How It Works
          </Link>
          <Link href="/learn" className="text-gray-600 hover:text-gray-900">
            Learn
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <EngagementBadge />
          <UserNav />
        </div>
      </div>
    </header>
  )
}
