import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function LearnPage() {
  return (
    <main className="container mx-auto py-16 px-4 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle>Insurance Education & Glossary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-lg text-gray-700">
            Welcome to the Learn section! Here you'll find guides, FAQs, and a glossary to help you understand insurance terms and make informed decisions.
          </p>
          <ul className="list-disc ml-6 mb-4">
            <li><Link href="/glossary" className="text-blue-600 hover:underline">Insurance Glossary</Link></li>
            <li><Link href="/faq" className="text-blue-600 hover:underline">Frequently Asked Questions</Link></li>
            <li><Link href="/compare">How to Compare Quotes</Link></li>
            <li><Link href="/scan">How to Scan Your Policy</Link></li>
          </ul>
          <p className="text-gray-600">Have more questions? <Link href="/contact" className="text-blue-600 hover:underline">Contact us</Link> for personalized help.</p>
        </CardContent>
      </Card>
    </main>
  );
}
