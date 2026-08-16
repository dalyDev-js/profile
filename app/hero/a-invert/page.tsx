import type { Metadata } from "next";
import HeroInkPlate from "@/components/heroes/HeroInkPlate";

export const metadata: Metadata = {
  title: "Hero A3 — Ink Invert",
  robots: { index: false, follow: false },
};

export default function HeroAInvertPage() {
  return <HeroInkPlate treatment="invert" />;
}
