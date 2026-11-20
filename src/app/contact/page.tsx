import type { Metadata } from "next"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Reach Safora for questions about insurance, financial planning classes, or to talk to a licensed agent in Newton, MA.",
  alternates: { canonical: "/contact" },
}

export default function ContactPage() {
  return (
    <main className="container mx-auto py-16 px-4 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle>Contact Us</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-lg text-gray-700">We're here to help. Reach out for support, questions, or to talk to an agent.</p>
          <ul className="mb-4">
            <li><strong>Location:</strong> Newton, MA</li>
            <li><strong>Email:</strong> <a href="mailto:insurance@namastebostonhomes.com" className="text-blue-600 hover:underline">insurance@namastebostonhomes.com</a></li>
            <li><strong>Phone:</strong> <a href="tel:+16177890100" className="text-blue-600 hover:underline">(617) 789-0100</a></li>
          </ul>
        </CardContent>
      </Card>
    </main>
  );
}
