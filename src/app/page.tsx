import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ComplianceDisclaimer } from "@/components/ComplianceDisclaimer"
import { EventsList } from "@/components/EventsList"
import { PageHero } from "@/components/fintech/PageHero"
import {
  Calendar,
  GraduationCap,
  PieChart,
  Shield,
  ArrowRight,
  BookOpen,
  Sparkles,
} from "lucide-react"
import { Suspense } from "react"
import { portalContactUrl } from "@/lib/janagana"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <PageHero
        eyebrow="Financial planning education"
        title="Learn, Plan, and Build Financial Confidence"
        description={
          <>
            Free classes and educational tools for Massachusetts families — retirement, insurance,
            and portfolio balance. Led by Sanjeev Jha, licensed insurance professional &amp;
            planning educator.
          </>
        }
      >
        <Button
          size="lg"
          asChild
          className="rounded-full bg-teal-500 px-8 text-white shadow-lg shadow-teal-500/25 hover:bg-teal-400"
        >
          <Link href="/classes">
            <Calendar className="mr-2 h-5 w-5" />
            Sign Up for Classes
          </Link>
        </Button>
        <Button
          size="lg"
          variant="outline"
          asChild
          className="rounded-full border-white/25 bg-white/5 text-white hover:bg-white/10 hover:text-white"
        >
          <Link href="/tools/balance">
            <PieChart className="mr-2 h-5 w-5" />
            Portfolio Balance Tool
          </Link>
        </Button>
      </PageHero>

      <div className="relative -mt-6 z-10 container mx-auto max-w-4xl px-4">
        <div className="flex flex-wrap justify-center gap-3">
          <span className="fintech-stat-pill bg-slate-900/90 backdrop-blur border-slate-700">
            <Sparkles className="h-4 w-4 text-teal-400" />
            Educational only
          </span>
          <span className="fintech-stat-pill bg-slate-900/90 backdrop-blur border-slate-700">
            Massachusetts families
          </span>
          <span className="fintech-stat-pill bg-slate-900/90 backdrop-blur border-slate-700">
            Free planning tools
          </span>
        </div>
      </div>

      <ComplianceDisclaimer variant="banner" />

      <section className="container mx-auto max-w-6xl px-4 py-20">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-teal-600 mb-2">
              Live workshops
            </p>
            <h2 className="text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
              Upcoming Classes
            </h2>
            <p className="mt-2 text-slate-600">Virtual via Zoom and in-person sessions</p>
          </div>
          <Button variant="outline" asChild className="rounded-full">
            <Link href="/classes">
              View all classes
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <Suspense fallback={<div className="text-slate-500 py-12 text-center">Loading classes…</div>}>
          <EventsList maxItems={3} />
        </Suspense>
      </section>

      <section className="fintech-section-alt py-20">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="mb-12 text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-teal-600 mb-2">
              Self-serve
            </p>
            <h2 className="text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
              Free Planning Tools
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-slate-600">
              Explore your financial picture with calculators that run in your browser — illustrative
              outputs, not personalized advice.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="fintech-card p-8">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-600">
                <PieChart className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900">Portfolio Balance Planner</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Review Roth, 401(k), brokerage, insurance, and real estate — topics that may be worth
                discussing with a qualified professional.
              </p>
              <Button asChild className="mt-6 rounded-full bg-slate-900 hover:bg-slate-800">
                <Link href="/tools/balance">Open balance planner</Link>
              </Button>
            </div>
            <div className="fintech-card p-8">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900">Life Insurance Tool</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                DIME-based coverage analysis for educational and advisory use — not a consumer
                recommendation engine.
              </p>
              <Button asChild variant="outline" className="mt-6 rounded-full">
                <Link href="/life-insurance">Start analysis</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto max-w-6xl px-4 py-20">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-slate-900">What Our Classes Cover</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              icon: GraduationCap,
              title: "Retirement Accounts",
              text: "Roth vs. traditional, 401(k) basics, and tax-bucket planning — including IRMAA lookback and survivor-spouse filing angles.",
            },
            {
              icon: Shield,
              title: "Insurance Fundamentals",
              text: "Term vs. permanent life, disability basics, and how insurance fits a broader plan — with clear compliance disclosures.",
            },
            {
              icon: BookOpen,
              title: "Portfolio Balance",
              text: "Allocation across liquid savings, retirement, real estate, and insurance — practical frameworks for everyday families.",
            },
          ].map((item) => (
            <div key={item.title} className="fintech-card p-6">
              <item.icon className="mb-3 h-7 w-7 text-teal-600" />
              <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden bg-slate-950 py-20 text-white">
        <div className="fintech-hero-grid pointer-events-none absolute inset-0 opacity-50" aria-hidden />
        <div className="container relative mx-auto max-w-3xl px-4 text-center">
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">Ready to Join a Class?</h2>
          <p className="mt-4 text-lg text-slate-400">
            Registration is free for most sessions. Reserve your spot and get Zoom or venue details by
            email.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button size="lg" className="rounded-full bg-teal-500 hover:bg-teal-400" asChild>
              <Link href="/classes">Browse upcoming classes</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-full border-slate-600 text-white hover:bg-slate-800"
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
