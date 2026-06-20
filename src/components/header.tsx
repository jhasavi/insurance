"use client"

import Link from "next/link"
import { UserNav } from "./user-nav"
import { Calendar, Shield, PieChart, GraduationCap } from "lucide-react"

export function Header() {
  return (
    <header className="border-b bg-white sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <Shield className="h-6 w-6 text-blue-600" />
          <span>Safora</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/classes"
            className="text-gray-900 font-medium hover:text-blue-600 flex items-center gap-1"
          >
            <Calendar className="h-4 w-4" />
            Classes
          </Link>

          <details className="relative">
            <summary className="list-none cursor-pointer text-gray-600 hover:text-gray-900 flex items-center gap-1">
              <PieChart className="h-4 w-4" />
              Tools
            </summary>
            <div className="absolute mt-2 w-56 bg-white border rounded-md shadow-lg p-2 z-50">
              <Link
                href="/tools/balance"
                className="block px-2 py-1 text-sm text-gray-700 hover:bg-gray-50"
              >
                Portfolio Balance Planner
              </Link>
              <Link
                href="/life-insurance"
                className="block px-2 py-1 text-sm text-gray-700 hover:bg-gray-50"
              >
                Life Insurance Recommendation
              </Link>
            </div>
          </details>

          <Link href="/learn" className="text-gray-600 hover:text-gray-900 flex items-center gap-1">
            <GraduationCap className="h-4 w-4" />
            Learn
          </Link>

          <Link href="/about" className="text-gray-600 hover:text-gray-900">
            About
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link
            href="/classes"
            className="md:hidden text-sm font-medium text-blue-600"
          >
            Classes
          </Link>
          <UserNav />
        </div>
      </div>
    </header>
  )
}
