import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function GlossaryPage() {
  return (
    <main className="container mx-auto py-16 px-4 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle>Insurance Glossary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-lg text-gray-700">Common insurance terms explained for everyone.</p>
          <ul className="list-disc ml-6 mb-4">
            <li><strong>Premium:</strong> The amount you pay for your insurance policy.</li>
            <li><strong>Deductible:</strong> The amount you pay out of pocket before insurance covers costs.</li>
            <li><strong>Coverage:</strong> The protection provided by your insurance policy.</li>
            <li><strong>Carrier:</strong> The insurance company providing your policy.</li>
            <li><strong>Quote:</strong> An estimate of your insurance cost.</li>
          </ul>
        </CardContent>
      </Card>
    </main>
  );
}