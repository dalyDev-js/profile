import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SmoothScrollProvider from "@/components/providers/SmoothScrollProvider";
import Navbar from "@/components/layout/Navbar";
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

export const metadata: Metadata = {
  title: "Abdulrhman El-Daly | Senior Frontend Developer & UI/UX Developer",
  description:
    "Portfolio of Abdulrhman El-Daly — Senior Frontend Developer and UI/UX Developer with 5+ years of experience building high-performance web applications.",
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
          <Navbar />
          <GrainOverlay />
          {children}
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
