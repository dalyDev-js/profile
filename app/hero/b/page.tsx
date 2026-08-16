import type { Metadata } from "next";
import HeroLiveSystem from "@/components/heroes/HeroLiveSystem";

export const metadata: Metadata = {
  title: "Hero B — Live System",
  robots: { index: false, follow: false },
};

export default function HeroBPage() {
  return <HeroLiveSystem />;
}
