import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Footer } from "@/components/footer";
import { AuthProvider } from "@/components/auth-provider";
import { Header } from "@/components/header";
import { ErrorBoundary } from "@/components/error-boundary";

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
    default: "Safora — Financial Planning Classes & Tools",
    template: "%s | Safora",
  },
  description:
    "Educational financial planning classes and free tools for Massachusetts families. Sign up for workshops on retirement, insurance, and portfolio balance.",
  keywords: [
    "financial planning classes",
    "retirement planning",
    "life insurance education",
    "portfolio balance",
    "Massachusetts",
    "Sanjeev Jha",
  ],
  authors: [{ name: "Sanjeev Jha" }],
  openGraph: {
    title: "Safora — Financial Planning Classes & Tools",
    description:
      "Sign up for financial planning classes and use free educational tools for retirement, insurance, and portfolio balance.",
    type: "website",
    locale: "en_US",
    siteName: "Safora",
  },
  twitter: {
    card: "summary_large_image",
    title: "Safora — Financial Planning Classes & Tools",
    description: "Classes, tools, and educational resources for financial planning.",
  },
  robots: {
    index: true,
    follow: true,
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
        <ErrorBoundary>
          <AuthProvider>
            <Header />
            {children}
            <Footer />
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
