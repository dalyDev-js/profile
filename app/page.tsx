import type { Metadata } from "next";
import { Archivo } from "next/font/google";
import Script from "next/script";
import V4Page from "@/components/v4/V4Page";

// Variable font — the hero canvas asks for weight 900 directly.
const archivo = Archivo({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title:
    "Abdulrhman El-Daly — Senior Frontend Developer & Full-Stack Engineer",
  description:
    "Senior Frontend Developer and Full-Stack Engineer with 5+ years building high-performance web apps in React, Next.js and TypeScript, backed by Java, Spring Boot, NestJS and PostgreSQL. Selected work, skills and experience.",
  alternates: { canonical: "/" },
};

const PERSON_LD = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Abdulrhman El-Daly",
  alternateName: "Abdulrhman Aldaly",
  url: "https://eldaly.me",
  email: "mailto:abdulrhman.eldaly@gmail.com",
  jobTitle: "Senior Frontend Developer & Full-Stack Engineer",
  description:
    "Senior Frontend Developer and Full-Stack Engineer with 5+ years of experience building high-performance web applications.",
  knowsAbout: [
    "React",
    "Next.js",
    "TypeScript",
    "Node.js",
    "NestJS",
    "Java",
    "Spring Boot",
    "PostgreSQL",
    "UI/UX Design",
    "Web Performance",
    "Accessibility",
  ],
  sameAs: [
    "https://www.linkedin.com/in/abdulrhman-eldaly/",
    "https://github.com/abdulrhmaneldaly",
  ],
};

export default function Home() {
  return (
    <>
      <Script
        id="person-ld"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(PERSON_LD) }}
      />
      <V4Page displayFont={archivo.style.fontFamily} />
    </>
  );
}
