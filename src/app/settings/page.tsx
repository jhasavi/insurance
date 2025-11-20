import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Info } from "lucide-react"
import { Tooltip } from "@/components/ui/tooltip"

export default async function SettingsPage() {
  const session = await getServerSession(authOptions as any) as { user?: any }
  if (!session?.user) {
    redirect("/auth/signin?callbackUrl=/settings")
  }

  // Fetch user and consent from DB
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  })

  // Consent values from User model
  const consentMarketing = user?.marketingConsent ?? false
  const consentReferral = user?.referralConsent ?? false
  const consentDataProcessing = user?.dataProcessingConsent ?? false

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-8">
      <Card className="max-w-xl w-full">
        <CardHeader>
          <CardTitle>Settings & Consent</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <Checkbox id="consentDataProcessing" checked={consentDataProcessing} disabled />
              <Label htmlFor="consentDataProcessing" className="cursor-pointer text-sm leading-relaxed">
                <span className="font-semibold">I consent to data processing</span> (Required)
                <Tooltip content="We use your info only to generate quotes and contact you. Your data is encrypted and never sold."><Info className="inline h-4 w-4 text-blue-500 ml-1" /></Tooltip>
                <p className="text-gray-600 mt-1">
                  I authorize Safora Insurance to use my information to generate insurance quotes and contact me about my request. Your data is encrypted and never sold.
                </p>
              </Label>
            </div>
            <div className="flex items-start space-x-3">
              <Checkbox id="consentReferral" checked={consentReferral} disabled />
              <Label htmlFor="consentReferral" className="cursor-pointer text-sm leading-relaxed">
                <span className="font-semibold">I consent to referrals</span> (Required)
                <Tooltip content="We may earn a referral commission (10-15%) if you select a quote. This does NOT increase your price."><Info className="inline h-4 w-4 text-blue-500 ml-1" /></Tooltip>
                <p className="text-gray-600 mt-1">
                  I understand that when I select a quote and contact a carrier, Safora may earn a referral commission (10-15% of premium). This does NOT increase my price - carriers pay the same whether you buy direct or through us.
                </p>
              </Label>
            </div>
            <div className="flex items-start space-x-3">
              <Checkbox id="consentMarketing" checked={consentMarketing} disabled />
              <Label htmlFor="consentMarketing" className="cursor-pointer text-sm leading-relaxed">
                <span className="font-semibold">Marketing communications</span> (Optional)
                <Tooltip content="Get tips to save on insurance, renewal reminders, and special offers. You can unsubscribe anytime."><Info className="inline h-4 w-4 text-blue-500 ml-1" /></Tooltip>
                <p className="text-gray-600 mt-1">
                  Send me tips to save on insurance, policy renewal reminders, and special offers. You can unsubscribe anytime.
                </p>
              </Label>
            </div>
          </div>
          <Alert>
            <AlertDescription>
              <strong>Data Export & Deletion:</strong> You can request a copy of your data or delete your account at any time. Contact <a href="mailto:support@safora.namastebostonhomes.com" className="text-blue-600 underline">support@safora.namastebostonhomes.com</a> for assistance.
            </AlertDescription>
          </Alert>
          <Button className="w-full" variant="outline" asChild>
            <a href="mailto:support@safora.namastebostonhomes.com?subject=Data Export/Delete Request">Request Data Export or Deletion</a>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
