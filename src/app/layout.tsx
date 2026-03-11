import type { Metadata } from "next";
import { Space_Grotesk, Syne, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { Toaster } from "@/components/ui/Toaster";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import VisitTracker from "@/components/analytics/VisitTracker";
import { SessionProvider } from "@/components/providers/SessionProvider";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: {
    default: "Sopon Islam | Full Stack Developer",
    template: "%s | Sopon Islam",
  },
  description:
    "Full Stack Developer specializing in Next.js, React, Node.js, PostgreSQL. Building beautiful and performant web applications.",
  keywords: [
    "Sopon Islam",
    "Full Stack Developer",
    "Next.js Developer",
    "React Developer",
    "MERN Stack",
    "Web Developer Bangladesh",
    "Portfolio",
  ],
  authors: [{ name: "Sopon Islam", url: "https://github.com/soponalways" }],
  creator: "Sopon Islam",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "Sopon Islam | Full Stack Developer",
    description: "Full Stack Developer specializing in Next.js, React, Node.js, PostgreSQL.",
    siteName: "Sopon Islam Portfolio",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Sopon Islam Portfolio" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sopon Islam | Full Stack Developer",
    description: "Full Stack Developer specializing in Next.js, React, Node.js, PostgreSQL.",
    creator: "@soponalways",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-video-preview": -1, "max-image-preview": "large", "max-snippet": -1 },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${spaceGrotesk.variable} ${syne.variable} ${jetbrains.variable} font-sans antialiased`}>
        <ThemeProvider>
          <SessionProvider>
            <GoogleAnalytics measurementId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || ""} />
            <VisitTracker />
            {children}
            <Toaster />
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
