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
          <Link href="/compare" className="text-gray-600 hover:text-gray-900">
            Compare Quotes
          </Link>
          <Link href="/life-insurance" className="text-gray-600 hover:text-gray-900">
            Life Insurance Tool
          </Link>
          <Link href="/scan" className="text-gray-600 hover:text-gray-900">
            Scan Policy
          </Link>
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
