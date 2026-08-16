import type { Metadata } from "next";
import HeroTypeWall from "@/components/heroes/HeroTypeWall";

export const metadata: Metadata = {
  title: "Hero C — Type Wall",
  robots: { index: false, follow: false },
};

export default function HeroCPage() {
  return <HeroTypeWall />;
}
