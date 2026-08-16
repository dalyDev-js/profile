"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";

const HIDDEN_PREFIXES = ["/expenses", "/v4"];
// The home page renders V4Page, which brings its own nav. Exact match — a
// startsWith("/") test would hide the navbar on every route.
const HIDDEN_EXACT = ["/"];

export default function ConditionalNavbar() {
  const pathname = usePathname();
  if (HIDDEN_EXACT.includes(pathname)) return null;
  if (HIDDEN_PREFIXES.some((p) => pathname.startsWith(p))) return null;
  return <Navbar />;
}
