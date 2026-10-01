import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/site/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Playwright + TypeScript Learn",
  description:
    "A hands-on curriculum that takes you from primitive types and your first page.goto to advanced generics, network mocking, and interview-ready answers.",
  keywords: [
    "Playwright",
    "TypeScript",
    "End-to-end testing",
    "GitHub Pages",
    "Learn TypeScript",
    "Playwright tutorial",
    "TypeScript interview",
  ],
  authors: [{ name: "Playwright + TS Learn" }],
  openGraph: {
    title: "Master Playwright with TypeScript",
    description:
      "Beginner to interview-ready curriculum for Playwright and TypeScript, with runnable code examples and practice problems.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider>{children}</ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
