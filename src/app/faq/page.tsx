import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function FAQPage() {
  return (
    <main className="container mx-auto py-16 px-4 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc ml-6 mb-4">
            <li><strong>How do I compare quotes?</strong> Use our Compare Quotes tool to see offers from 15+ carriers.</li>
            <li><strong>How does AI help?</strong> Our AI scans your policy and finds savings or coverage gaps.</li>
            <li><strong>Is my data safe?</strong> Yes, we use encryption and never sell your data.</li>
            <li><strong>Can I talk to an agent?</strong> Yes, contact us for personalized help.</li>
          </ul>
        </CardContent>
      </Card>
    </main>
  );
}