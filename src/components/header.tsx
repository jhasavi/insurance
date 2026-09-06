"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { UserNav } from "./user-nav"
import { Calendar, PieChart, GraduationCap, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

const navLink =
  "text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-1.5"

export function Header() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/70">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="group flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 text-sm font-bold text-white shadow-sm">
            S
          </span>
          <span className="text-lg font-semibold tracking-tight text-slate-900">Safora</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          <Link
            href="/classes"
            className={cn(
              "rounded-lg px-3 py-2",
              navLink,
              pathname === "/classes" && "bg-slate-100 text-slate-900"
            )}
          >
            <Calendar className="h-4 w-4 text-teal-600" />
            Classes
          </Link>

          <details className="relative group">
            <summary
              className={cn(
                "list-none cursor-pointer rounded-lg px-3 py-2 [&::-webkit-details-marker]:hidden",
                navLink,
                pathname?.startsWith("/tools") || pathname === "/life-insurance"
                  ? "bg-slate-100 text-slate-900"
                  : ""
              )}
            >
              <PieChart className="h-4 w-4 text-teal-600" />
              Tools
              <ChevronDown className="h-3.5 w-3.5 opacity-60" />
            </summary>
            <div className="absolute left-0 mt-1 w-64 rounded-xl border border-slate-200 bg-white p-2 shadow-xl shadow-slate-200/50">
              <Link
                href="/tools/balance"
                className="block rounded-lg px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
              >
                <span className="font-medium">Portfolio Balance</span>
                <span className="mt-0.5 block text-xs text-slate-500">Educational allocation review</span>
              </Link>
              <Link
                href="/life-insurance"
                className="block rounded-lg px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
              >
                <span className="font-medium">Life Insurance</span>
                <span className="mt-0.5 block text-xs text-slate-500">DIME-based analysis</span>
              </Link>
            </div>
          </details>

          <Link
            href="/learn"
            className={cn("rounded-lg px-3 py-2", navLink, pathname === "/learn" && "bg-slate-100")}
          >
            <GraduationCap className="h-4 w-4 text-teal-600" />
            Learn
          </Link>

          <Link
            href="/about"
            className={cn("rounded-lg px-3 py-2", navLink, pathname === "/about" && "bg-slate-100")}
          >
            About
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/classes"
            className="hidden rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 sm:inline-flex"
          >
            Sign up
          </Link>
          <Link href="/classes" className="md:hidden text-sm font-medium text-teal-700">
            Classes
          </Link>
          <UserNav />
        </div>
      </div>
    </header>
  )
}
