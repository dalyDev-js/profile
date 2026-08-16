import type { Metadata } from "next";
import { Archivo } from "next/font/google";
import V4Page from "@/components/v4/V4Page";

// Variable font — the canvas asks for weight 900 directly.
const archivo = Archivo({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "V4 — Then / Now | Abdulrhman El-Daly",
  robots: { index: false, follow: false },
};

export default function V4Route() {
  return <V4Page displayFont={archivo.style.fontFamily} />;
}
