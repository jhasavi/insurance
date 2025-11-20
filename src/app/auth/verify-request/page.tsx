import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Mail, Home } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function VerifyRequestPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mb-4">
            <Mail className="h-8 w-8 text-blue-600" />
          </div>
          <CardTitle>Check your email</CardTitle>
          <CardDescription>
            A sign in link has been sent to your email address
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <Mail className="h-4 w-4" />
            <AlertDescription>
              Click the link in the email to complete sign in. The link will expire in 24 hours for security.
            </AlertDescription>
          </Alert>
          
          <div className="text-sm text-gray-600 space-y-2 bg-gray-50 p-4 rounded-lg">
            <p className="font-semibold">Didn't receive an email?</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Check your spam or junk folder</li>
              <li>Make sure you entered the correct email address</li>
              <li>Wait a few minutes - sometimes emails are delayed</li>
            </ul>
          </div>

          <Button variant="outline" className="w-full" asChild>
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Return to home
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
