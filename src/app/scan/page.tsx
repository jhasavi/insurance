"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Upload, FileText, CheckCircle, AlertCircle, TrendingDown } from "lucide-react"
import { AiTransparencyBadge } from '@/components/AiTransparencyBadge'
import { LoadingSpinner, LoadingState } from "@/components/loading"

export default function PolicyScannerPage() {
  const [uploading, setUploading] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState<any>(null)

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploading(true)
    
    try {
      // In production, upload to UploadThing or similar service
      // For now, we'll use a placeholder URL
      const fileUrl = URL.createObjectURL(file)
      
      setAnalyzing(true)
      
      const response = await fetch('/api/ai/policy-scanner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileUrl,
          fileName: file.name,
          fileSize: file.size,
        }),
      })

      const data = await response.json()
      
      if (data.success) {
        setAnalysis(data.analysis)
      } else {
        alert('Failed to analyze policy: ' + data.error)
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert('Failed to upload file')
    } finally {
      setUploading(false)
      setAnalyzing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center">
            <Shield className="h-8 w-8 text-blue-600 mr-2" />
            <span className="text-2xl font-bold text-gray-900">AI Policy Scanner</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Scan Your Current Policy
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Upload your existing insurance policy and our AI will analyze it, identify gaps, 
            and show you where you could save money.
          </p>
        </div>

        {/* Upload Section */}
        {!analysis && (
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Upload Your Policy Document
              </CardTitle>
              <CardDescription>
                Supported formats: PDF, PNG, JPG (Max 10MB)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-blue-500 transition-colors">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">
                  Drag and drop your policy document here, or click to browse
                </p>
                <input
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg"
                  onChange={handleFileUpload}
                  disabled={uploading || analyzing}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload">
                  <Button asChild disabled={uploading || analyzing}>
                    <span>
                      {uploading ? (
                        <>
                          <LoadingSpinner size="sm" className="mr-2" />
                          Uploading...
                        </>
                      ) : analyzing ? (
                        <>
                          <LoadingSpinner size="sm" className="mr-2" />
                          Analyzing...
                        </>
                      ) : (
                        "Choose File"
                      )}
                    </span>
                  </Button>
                </label>
              </div>

              {/* Privacy Badge */}
              <div className="mt-6 p-4 bg-green-50 rounded-lg">
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-semibold text-green-900">Your Privacy is Protected</p>
                    <p className="text-sm text-green-700">
                      We don't sell your data. No spam calls. View quotes anonymously.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Analysis Results */}
        {analysis && (
          <div className="space-y-6">
            {/* Summary Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Analysis Complete
                </CardTitle>
                <CardDescription>
                  {analysis.currentCarrier} • {analysis.policyType} Insurance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Current Premium</p>
                    <p className="text-3xl font-bold text-blue-600">
                      ${analysis.currentPremium?.toFixed(2) || 'N/A'}
                    </p>
                    <p className="text-xs text-gray-500">per year</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Potential Savings</p>
                    <p className="text-3xl font-bold text-green-600 flex items-center justify-center gap-1">
                      <TrendingDown className="h-6 w-6" />
                      ${analysis.savingsOpportunity?.toFixed(2) || '0'}
                    </p>
                    <p className="text-xs text-gray-500">per year</p>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Coverage Rating</p>
                    <p className="text-3xl font-bold text-yellow-600">
                      {(analysis.aiInsights as any)?.benchmarkComparison?.competitiveRating || 'N/A'}
                    </p>
                    <p className="text-xs text-gray-500">vs market</p>
                  </div>
                </div>
              </CardContent>
            </Card>

              {/* Confidence Scores Card */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Confidence Scores</CardTitle>
                    <AiTransparencyBadge />
                  </div>
                  <CardDescription>How confident the AI is about extracted fields</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-600">Overall Confidence</div>
                      <div className="text-sm font-medium text-gray-900">{Math.round(((analysis.aiInsights?.confidence?.overall || 0) * 100))}%</div>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                      <div style={{ width: `${Math.round(((analysis.aiInsights?.confidence?.overall || 0) * 100))}%` }} className="h-3 bg-green-500" />
                    </div>

                    <div className="mt-3">
                      <div className="text-sm text-gray-600 mb-2">Field confidences</div>
                      <div className="grid gap-2">
                        {analysis.aiInsights?.confidence?.fields && Object.entries(analysis.aiInsights.confidence.fields).map(([k, v]: any) => (
                          <div key={k} className="flex items-center justify-between">
                            <div className="text-sm text-gray-700">{k}</div>
                            <div className="text-sm font-medium text-gray-900">{Math.round(v * 100)}%</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

            {/* Recommendations */}
            {analysis.recommendations && analysis.recommendations.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>💡 Recommendations</CardTitle>
                  <CardDescription>Ways to improve your coverage and save money</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {analysis.recommendations.map((rec: string, index: number) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Gap Analysis */}
            {analysis.riskAreas && analysis.riskAreas.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-red-600" />
                    Coverage Gaps Detected
                  </CardTitle>
                  <CardDescription>Areas where you may be underprotected</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {analysis.riskAreas.map((gap: string, index: number) => (
                      <li key={index} className="flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{gap}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* CTA */}
            <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
              <CardContent className="p-8 text-center">
                <h3 className="text-2xl font-bold mb-4">Ready to Get Better Coverage?</h3>
                <p className="mb-6">
                  Compare quotes from 15+ carriers and find the best rate for your needs.
                </p>
                <Button size="lg" variant="secondary" asChild>
                  <a href="/compare">Compare Quotes Now</a>
                </Button>
              </CardContent>
            </Card>

            {/* Reset */}
            <div className="text-center">
              <Button variant="outline" onClick={() => setAnalysis(null)}>
                Scan Another Policy
              </Button>
            </div>
          </div>
        )}

        {/* Features Grid */}
        {!analysis && (
          <div className="mt-16 grid md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="pt-6">
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">AI-Powered Analysis</h3>
                <p className="text-gray-600">
                  Our AI scans your policy and extracts all coverage details automatically.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <TrendingDown className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Find Savings</h3>
                <p className="text-gray-600">
                  Discover where you're overpaying and see potential savings opportunities.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Identify Gaps</h3>
                <p className="text-gray-600">
                  Get expert insights on coverage gaps and risk areas you should address.
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  )
}
