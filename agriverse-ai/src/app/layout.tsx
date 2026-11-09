import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/components/providers";

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
    default: "AgriVerse AI — Smarter Farming. Better Decisions. Sustainable Future.",
    template: "%s | AgriVerse AI",
  },
  description:
    "AgriVerse AI is an intelligent AI-powered smart farming platform. Analyze soil, weather, crops, environment and farm conditions to make data-driven farming decisions.",
  keywords: [
    "agritech",
    "smart farming",
    "AI farming",
    "crop recommendation",
    "soil intelligence",
    "precision agriculture",
    "AgriVerse AI",
  ],
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <body className="min-h-screen">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}