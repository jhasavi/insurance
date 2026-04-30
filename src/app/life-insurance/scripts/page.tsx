'use client'

import { useState } from 'react'
import Link from 'next/link'

type Script = {
  id: string
  scenario: string
  tag: string
  tagColor: string
  channel: 'WhatsApp' | 'SMS' | 'Email' | 'Call'
  subject?: string
  body: string
}

const scripts: Script[] = [
  {
    id: 'new-lead-intro',
    scenario: 'First contact — new lead from recommendation tool',
    tag: 'New Lead',
    tagColor: 'bg-blue-100 text-blue-800',
    channel: 'WhatsApp',
    body: `Hi [Client Name]! This is [Your Name] from [Agency]. 

I just completed a Life Insurance analysis for your family — it looks like a *$[Coverage Amount] [Policy Type]* policy would close your income protection gap.

I'd love to walk you through the recommendation in 15 minutes. When works best this week — Tuesday or Thursday afternoon?`,
  },
  {
    id: 'term-pitch',
    scenario: 'Term Life follow-up — budget-conscious client',
    tag: 'Term Life',
    tagColor: 'bg-sky-100 text-sky-800',
    channel: 'WhatsApp',
    body: `Hi [Client Name], quick note from [Your Name] 👋

For a healthy [Age]-year-old like yourself, a *$500,000 / 20-year Term* policy typically runs *$[Monthly Premium]/month* — less than a Netflix subscription for real family protection.

The younger and healthier you are when you lock in the rate, the lower it stays for the entire 20 years. Want me to run a formal quote? Takes 5 minutes.`,
  },
  {
    id: 'iul-followup',
    scenario: 'IUL follow-up — client interested in retirement income',
    tag: 'IUL',
    tagColor: 'bg-purple-100 text-purple-800',
    channel: 'WhatsApp',
    body: `Hi [Client Name], it's [Your Name].

Following up on our conversation about the *Indexed Universal Life* strategy for your retirement plan. 

Quick recap of why it makes sense for you:
✅ Tax-free growth tied to S&P 500 (with a 0% floor — no losses in bad years)
✅ Tax-free retirement income via policy loans
✅ Death benefit that covers your family while it grows

I have a 25-year illustration ready to share. Can we connect this week? I'm free Wed/Thu.`,
  },
  {
    id: 'whole-life-estate',
    scenario: 'Whole Life — estate planning / legacy client',
    tag: 'Whole Life',
    tagColor: 'bg-emerald-100 text-emerald-800',
    channel: 'WhatsApp',
    body: `Hi [Client Name], [Your Name] here.

One thing I wanted to flag: Massachusetts has a *$2M estate tax threshold* — much lower than the $13.6M federal limit. For families with a home + business + savings, this can trigger a surprise tax bill for your heirs.

A *Whole Life policy held in an Irrevocable Life Insurance Trust (ILIT)* is the cleanest solution — the death benefit passes to your family completely tax-free, outside your estate.

Worth a 20-min conversation? I can show you the numbers.`,
  },
  {
    id: 'no-response',
    scenario: 'Soft follow-up after no response (3–5 days later)',
    tag: 'Follow-up',
    tagColor: 'bg-amber-100 text-amber-800',
    channel: 'SMS',
    body: `Hi [Client Name], [Your Name] here — just a gentle follow-up on the Life Insurance recommendation I shared last week.

No pressure at all. If the timing isn't right, that's completely fine. Just wanted to make sure it didn't get buried. 

I'm available for a quick 10-minute call whenever it's convenient. Reply anytime!`,
  },
  {
    id: 'employer-coverage-gap',
    scenario: 'Client relying only on employer group life',
    tag: 'Coverage Gap',
    tagColor: 'bg-red-100 text-red-800',
    channel: 'WhatsApp',
    body: `Hi [Client Name], [Your Name] from [Agency].

Quick question: if you left your job tomorrow — voluntarily or otherwise — what happens to your life insurance?

Most employer group policies *can't be taken with you* or convert at 3–4× the normal premium. Your family's protection shouldn't depend on your employment status.

Your current group coverage: *[Group Coverage Amount]*
Your family's actual need: *$[Recommended Coverage]*
Gap: *$[Gap Amount]*

I can close that gap for around *$[Monthly Premium]/month*. Want me to show you how?`,
  },
  {
    id: 'closed-thank-you',
    scenario: 'Post-close thank you + referral ask',
    tag: 'Closed',
    tagColor: 'bg-green-100 text-green-800',
    channel: 'WhatsApp',
    body: `Hi [Client Name]! [Your Name] here. 

Congratulations — your *[Policy Type]* policy is in force! Your family is now protected. 🎉

One quick ask: is there anyone in your life — a sibling, colleague, or close friend — who might benefit from the same analysis we did together? 

I work on referrals only, so your introduction means everything. Even a first name and "you should talk to my advisor" is enough for me to take it from there.

Thank you again — it's an honor to protect your family.`,
  },
]

const channels = ['All', 'WhatsApp', 'SMS', 'Email', 'Call'] as const
const tags = ['All', 'New Lead', 'Term Life', 'IUL', 'Whole Life', 'Follow-up', 'Coverage Gap', 'Closed'] as const

export default function ScriptLibraryPage() {
  const [activeChannel, setActiveChannel] = useState<string>('All')
  const [activeTag, setActiveTag] = useState<string>('All')
  const [copied, setCopied] = useState<string | null>(null)

  const filtered = scripts.filter((s) => {
    if (activeChannel !== 'All' && s.channel !== activeChannel) return false
    if (activeTag !== 'All' && s.tag !== activeTag) return false
    return true
  })

  const copyScript = (script: Script) => {
    navigator.clipboard.writeText(script.body)
    setCopied(script.id)
    setTimeout(() => setCopied(null), 2000)
  }

  const shareWhatsApp = (body: string) => {
    window.open(`https://wa.me/?text=${encodeURIComponent(body)}`, '_blank')
  }

  const shareSMS = (body: string) => {
    window.open(`sms:?body=${encodeURIComponent(body)}`, '_blank')
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-green-900 to-green-700 text-white py-14 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-green-300 text-sm font-semibold uppercase tracking-widest mb-3">Advisor Toolkit</p>
          <h1 className="text-4xl font-bold mb-4">Follow-Up Script Library</h1>
          <p className="text-green-200 text-lg max-w-2xl mx-auto">
            7 ready-to-send scripts for every stage — new lead, term, IUL, whole life, estate planning, follow-up, and post-close referral ask.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/life-insurance" className="inline-flex items-center px-5 py-2.5 bg-white text-green-800 rounded-lg text-sm font-semibold hover:bg-green-50">
              Run Recommendation Tool →
            </Link>
            <Link href="/life-insurance/learn" className="inline-flex items-center px-5 py-2.5 border border-white/40 text-white rounded-lg text-sm font-semibold hover:bg-white/10">
              Knowledge Base
            </Link>
          </div>
        </div>
      </section>

      {/* Filters */}
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-3">
        <div className="flex flex-wrap gap-2">
          <span className="text-xs font-semibold text-gray-500 self-center mr-1">Channel:</span>
          {channels.map((c) => (
            <button
              key={c}
              onClick={() => setActiveChannel(c)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition ${
                activeChannel === c ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="text-xs font-semibold text-gray-500 self-center mr-1">Scenario:</span>
          {tags.map((t) => (
            <button
              key={t}
              onClick={() => setActiveTag(t)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition ${
                activeTag === t ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Scripts */}
      <div className="max-w-4xl mx-auto px-4 pb-16 space-y-6">
        {filtered.length === 0 && (
          <div className="bg-white rounded-lg border p-8 text-center text-gray-500">No scripts match the selected filters.</div>
        )}
        {filtered.map((script) => (
          <div key={script.id} className="bg-white border rounded-xl shadow-sm overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-2 px-5 py-3 bg-gray-50 border-b">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`px-2 py-0.5 rounded text-xs font-semibold ${script.tagColor}`}>{script.tag}</span>
                <span className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded font-medium">{script.channel}</span>
                <span className="text-sm text-gray-600">{script.scenario}</span>
              </div>
            </div>

            <div className="px-5 py-4">
              <pre className="whitespace-pre-wrap text-sm text-gray-800 font-sans leading-relaxed">{script.body}</pre>
            </div>

            <div className="flex flex-wrap gap-2 px-5 py-3 border-t bg-gray-50">
              <button
                onClick={() => copyScript(script)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 border rounded text-xs font-semibold text-gray-700 bg-white hover:bg-gray-100 transition"
              >
                {copied === script.id ? '✓ Copied!' : '📋 Copy Text'}
              </button>
              {(script.channel === 'WhatsApp' || script.channel === 'SMS') && (
                <button
                  onClick={() => shareWhatsApp(script.body)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white rounded text-xs font-semibold hover:bg-green-700 transition"
                >
                  💬 Open in WhatsApp
                </button>
              )}
              {script.channel === 'SMS' && (
                <button
                  onClick={() => shareSMS(script.body)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded text-xs font-semibold hover:bg-blue-700 transition"
                >
                  📱 Open in SMS
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="border-t bg-white py-10 px-4 text-center">
        <p className="text-gray-600 mb-4">Want a personalized script for a specific client? Run the recommendation tool and use the built-in share button.</p>
        <Link href="/life-insurance" className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700">
          Run Recommendation Tool →
        </Link>
      </div>
    </main>
  )
}
