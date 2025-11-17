import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Footer } from "@/components/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Namaste Insurance - Compare Auto & Home Insurance Quotes",
    template: "%s | Namaste Insurance"
  },
  description: "Compare real insurance quotes from 15+ carriers including GEICO, Progressive, and State Farm. AI-powered policy analysis. Save an average of $847/year. No spam, just savings.",
  keywords: ["auto insurance", "home insurance", "insurance comparison", "cheap insurance", "insurance quotes", "compare insurance", "best insurance rates"],
  authors: [{ name: "Namaste Insurance" }],
  openGraph: {
    title: "Namaste Insurance - Transparent Insurance Marketplace",
    description: "Compare real insurance quotes from 15+ carriers. AI-powered policy analysis. Save money without the spam.",
    type: "website",
    locale: "en_US",
    siteName: "Namaste Insurance",
  },
  twitter: {
    card: "summary_large_image",
    title: "Namaste Insurance - Compare Insurance Quotes",
    description: "Compare quotes from 15+ carriers. Save an average of $847/year.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-PXQ6PGV4P9"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-PXQ6PGV4P9');
          `}
        </Script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Footer />
      </body>
    </html>
  );
}
