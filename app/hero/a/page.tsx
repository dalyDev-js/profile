import type { Metadata } from "next";
import HeroInkPlate from "@/components/heroes/HeroInkPlate";

export const metadata: Metadata = {
  title: "Hero A — Ink Plate",
  robots: { index: false, follow: false },
};

export default function HeroAPage() {
  return <HeroInkPlate treatment="plate" />;
}
