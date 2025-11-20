"use client"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"


import { Suspense } from "react"

function ErrorContent() {
  const searchParams = useSearchParams()
  const error = searchParams?.get("error")

  const errorMessages: Record<string, string> = {
    Configuration: "There is a problem with the server configuration.",
    AccessDenied: "You do not have permission to sign in.",
    Verification: "The sign in link is no longer valid. It may have expired or already been used.",
    Default: "An unexpected error occurred during sign in.",
  }

  const errorMessage = errorMessages[error || ""] || errorMessages.Default

  return (
    <>
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>{errorMessage}</AlertDescription>
      </Alert>

      <div className="space-y-2">
        <Button className="w-full" asChild>
          <Link href="/auth/signin">Try signing in again</Link>
        </Button>
        <Button variant="outline" className="w-full" asChild>
          <Link href="/">Return to home</Link>
        </Button>
      </div>

      <div className="text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
        <p className="font-semibold mb-2">Need help?</p>
        <p>
          If you continue to experience issues, please contact support at{" "}
          <a href="mailto:support@safora.namastebostonhomes.com" className="text-blue-600 hover:underline">
            support@safora.namastebostonhomes.com
          </a>
        </p>
      </div>
    </>
  )
}

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mb-4">
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
          <CardTitle>Authentication Error</CardTitle>
          <CardDescription>
            We couldn't sign you in
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Suspense>
            <ErrorContent />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}
