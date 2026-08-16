import type { Metadata } from "next";
import HeroInkPlate from "@/components/heroes/HeroInkPlate";

export const metadata: Metadata = {
  title: "Hero A2 — Ink Glow",
  robots: { index: false, follow: false },
};

export default function HeroAGlowPage() {
  return <HeroInkPlate treatment="glow" />;
}
