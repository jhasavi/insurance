import fs from 'fs/promises'
import path from 'path'
import Link from 'next/link'

interface Props { params: { id: string } }

export default async function RecommendationView({ params }: Props) {
  const file = path.join(process.cwd(), 'data', 'recommendations.json')
  let arr = [] as any[]
  try {
    const raw = await fs.readFile(file, 'utf-8')
    arr = JSON.parse(raw || '[]')
  } catch {
    arr = []
  }
  const idNum = Number(params.id)
  const entry = arr.find((e) => Number(e.id) === idNum)
  if (!entry) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="p-8 bg-white rounded shadow">
          <h1 className="text-xl font-semibold">Recommendation not found</h1>
          <p className="text-sm text-gray-600 mt-2">This recommendation may have been removed or the id is invalid.</p>
        </div>
      </main>
    )
  }

  const rec = entry.recommendedType || entry.recommendedType || (entry.recommendation || {}).type
  const coverage = entry.coverage || (entry.recommendation || {}).coverage
  const inputs = entry.inputs || entry

  const fmt = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white shadow rounded p-6">
        <h1 className="text-2xl font-bold mb-2">Saved Recommendation</h1>
        <div className="text-sm text-gray-600 mb-4">Saved: {new Date(entry.createdAt).toLocaleString()}</div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 border rounded">
            <div className="text-xs text-gray-500">Recommended Type</div>
            <div className="mt-1 font-medium">{rec}</div>
          </div>

          <div className="p-4 border rounded">
            <div className="text-xs text-gray-500">Suggested Coverage</div>
            <div className="mt-1 font-medium">{coverage ? fmt.format(Number(coverage)) : '—'}</div>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="font-semibold">Inputs</h3>
          <pre className="mt-2 text-sm bg-gray-100 p-3 rounded">{JSON.stringify(inputs, null, 2)}</pre>
        </div>

        <div className="mt-6 flex gap-3">
          <Link href="/" className="inline-flex items-center px-3 py-2 bg-indigo-600 text-white rounded">Return Home</Link>
          <button onClick={() => window.print()} className="inline-flex items-center px-3 py-2 bg-white border rounded">Print</button>
        </div>
      </div>
    </main>
  )
}
