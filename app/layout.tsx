import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SmoothScrollProvider from "@/components/providers/SmoothScrollProvider";
import ConditionalNavbar from "@/components/layout/ConditionalNavbar";
import Preloader from "@/components/layout/Preloader";
import GrainOverlay from "@/components/ui/GrainOverlay";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const TITLE =
  "Abdulrhman El-Daly — Senior Frontend Developer & Full-Stack Engineer";
const DESCRIPTION =
  "Senior Frontend Developer and Full-Stack Engineer with 5+ years building high-performance web apps in React, Next.js and TypeScript, backed by Java, Spring Boot, NestJS and PostgreSQL.";

export const metadata: Metadata = {
  metadataBase: new URL("https://eldaly.me"),
  // Sub-pages get "<their title> · Abdulrhman El-Daly" without repeating it.
  title: {
    default: TITLE,
    template: "%s · Abdulrhman El-Daly",
  },
  description: DESCRIPTION,
  applicationName: "Abdulrhman El-Daly",
  authors: [{ name: "Abdulrhman El-Daly", url: "https://eldaly.me" }],
  creator: "Abdulrhman El-Daly",
  keywords: [
    "Abdulrhman El-Daly",
    "Senior Frontend Developer",
    "Full-Stack Engineer",
    "React Developer",
    "Next.js Developer",
    "TypeScript",
    "NestJS",
    "Spring Boot",
    "PostgreSQL",
    "UI/UX",
    "Portfolio",
    "Egypt",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "profile",
    url: "https://eldaly.me",
    title: TITLE,
    description: DESCRIPTION,
    siteName: "Abdulrhman El-Daly",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Preloader />
        <SmoothScrollProvider>
          <ConditionalNavbar />
          <GrainOverlay />
          {children}
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
