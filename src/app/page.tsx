import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ComplianceDisclaimer } from "@/components/ComplianceDisclaimer"
import { EventsList } from "@/components/EventsList"
import {
  Calendar,
  GraduationCap,
  PieChart,
  Shield,
  ArrowRight,
  BookOpen,
} from "lucide-react"
import { Suspense } from "react"
import { portalContactUrl } from "@/lib/janagana"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero — classes first */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-20">
        <div className="container mx-auto px-4 text-center max-w-5xl">
          <Badge className="mb-4 bg-blue-600">Financial Planning Education</Badge>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Learn, Plan, and Build Financial Confidence
          </h1>
          <p className="text-xl text-gray-600 mb-4 max-w-3xl mx-auto">
            Safora offers free educational classes and planning tools for Massachusetts families.
            Sign up for upcoming workshops on retirement, insurance, and portfolio balance.
          </p>
          <p className="text-lg text-gray-500 mb-8">
            Led by Sanjeev Jha — licensed insurance professional &amp; financial planning educator
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button size="lg" asChild className="bg-blue-600 hover:bg-blue-700">
              <Link href="/classes">
                <Calendar className="mr-2 h-5 w-5" />
                Sign Up for Classes
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/tools/balance">
                <PieChart className="mr-2 h-5 w-5" />
                Portfolio Balance Tool
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <ComplianceDisclaimer variant="banner" />

      {/* Upcoming classes preview */}
      <section className="py-16 container mx-auto px-4 max-w-6xl">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <h2 className="text-3xl font-bold">Upcoming Classes</h2>
            <p className="text-gray-600 mt-1">Virtual via Zoom and in-person sessions</p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/classes">
              View all classes
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <Suspense fallback={<div className="text-gray-500">Loading classes…</div>}>
          <EventsList maxItems={3} />
        </Suspense>
      </section>

      {/* Planning tools */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Free Planning Tools</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Educational calculators to explore gaps in your financial picture. The balance planner
              saves locally in your browser; other tools may not store your entries.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-2 hover:border-emerald-400 transition-all">
              <CardHeader>
                <PieChart className="h-8 w-8 text-emerald-600 mb-2" />
                <CardTitle>Portfolio Balance Planner</CardTitle>
                <CardDescription>
                  Enter Roth, 401(k), brokerage, insurance, and real estate details to see topics
                  that may be worth reviewing with a qualified professional.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild>
                  <Link href="/tools/balance">Open balance planner</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-blue-400 transition-all">
              <CardHeader>
                <Shield className="h-8 w-8 text-blue-600 mb-2" />
                <CardTitle>Life Insurance Recommendation</CardTitle>
                <CardDescription>
                  DIME-based coverage analysis with carrier matching and client-ready strategy
                  summaries. For educational and advisory use.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline">
                  <Link href="/life-insurance">Start recommendation</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* What you'll learn */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">What Our Classes Cover</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <GraduationCap className="h-7 w-7 text-blue-600 mb-2" />
                <CardTitle className="text-lg">Retirement Accounts</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-gray-600">
                Roth vs. traditional, 401(k) basics, and tax-bucket planning — including angles like
                IRMAA lookback years and survivor-spouse tax filing that generic articles often skip.
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Shield className="h-7 w-7 text-blue-600 mb-2" />
                <CardTitle className="text-lg">Insurance Fundamentals</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-gray-600">
                Term vs. permanent life, disability basics, and how insurance fits into a broader
                financial plan — with clear compliance disclosures.
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <BookOpen className="h-7 w-7 text-blue-600 mb-2" />
                <CardTitle className="text-lg">Portfolio Balance</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-gray-600">
                Asset allocation across liquid savings, retirement, real estate, and insurance —
                practical frameworks for everyday families.
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-b from-blue-600 to-blue-700 text-white">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h2 className="text-4xl font-bold mb-4">Ready to Join a Class?</h2>
          <p className="text-xl mb-8 text-blue-100">
            Registration is free for most sessions. Reserve your spot and get Zoom or venue details
            by email.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100" asChild>
              <Link href="/classes">Browse upcoming classes</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-blue-600"
              asChild
            >
              <Link href={portalContactUrl("newsletter")} target="_blank" rel="noopener noreferrer">
                Get class announcements
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
