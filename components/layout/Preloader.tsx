"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

// The paper-plane mark. Also used for the favicon (app/icon.svg) so the tab and
// the loading screen carry the same symbol.
const PLANE = "M2 3 L23 12 L2 21 L2 14 L17 12 L2 10 Z";

/** /v4's loader: the sheet folds, flies across, and the name lands. */
function PaperLoader() {
  return (
    <motion.div
      className="fixed inset-0 z-[10001] flex flex-col items-center justify-center overflow-hidden"
      style={{ background: "#07090F" }}
      exit={{ y: "-100%" }}
      transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
    >
      {/* soft cyan bloom, same palette as the hero */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(46% 30% at 50% 50%, rgba(34,211,238,.10), transparent 70%)",
        }}
      />

      {/* flight path */}
      <div
        style={{
          position: "relative",
          width: "min(70vw, 460px)",
          height: 64,
          marginBottom: 26,
        }}
      >
        <motion.div
          aria-hidden
          style={{
            position: "absolute",
            top: "50%",
            left: 0,
            height: 1,
            background:
              "linear-gradient(90deg, transparent, rgba(34,211,238,.45))",
          }}
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
        />
        <motion.svg
          viewBox="0 0 24 24"
          width={34}
          height={34}
          // `left` in %, not `x` — a percentage transform is relative to the
          // element's own width (34px), so x:"104%" barely moved it. `left` is
          // relative to the track, which is what "cross the line" needs.
          style={{ position: "absolute", top: "50%", marginTop: -17, marginLeft: -17 }}
          initial={{ left: "0%", opacity: 0, rotate: -14 }}
          animate={{
            left: ["0%", "100%"],
            opacity: [0, 1, 1, 0.9],
            rotate: [-14, -3, -8, 0],
          }}
          transition={{ duration: 1.9, ease: [0.36, 0, 0.3, 1] }}
        >
          <path d={PLANE} fill="#E9E6DC" />
        </motion.svg>
      </div>

      <motion.span
        style={{
          fontWeight: 800,
          letterSpacing: "0.16em",
          fontSize: "clamp(20px, 4vw, 34px)",
          color: "#F1F5F9",
        }}
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
      >
        EL-DALY
      </motion.span>

      <motion.div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          height: "2px",
          background: "linear-gradient(to right, #22D3EE, #A78BFA)",
        }}
        initial={{ width: "0%" }}
        animate={{ width: "100%" }}
        transition={{ duration: 2.3, ease: [0.22, 1, 0.36, 1] }}
      />
    </motion.div>
  );
}

/** The original loader, kept for the live homepage and the other variants. */
function MarkLoader() {
  return (
    <motion.div
      className="fixed inset-0 z-[10001] flex items-center justify-center overflow-hidden"
      style={{ background: "#07090F" }}
      exit={{ y: "-100%" }}
      transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(249,115,22,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(249,115,22,0.07) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      <motion.div
        style={{
          position: "absolute",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(249,115,22,0.12) 0%, transparent 70%)",
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.7, 1, 0.7], scale: [0.9, 1, 1.1, 1] }}
        transition={{ duration: 2.5, delay: 0.5, ease: "easeInOut" }}
      />
      <div className="relative">
        <motion.span
          className="gradient-text inline-block text-7xl font-bold sm:text-9xl"
          style={{ padding: "0 0.1em" }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          AD
        </motion.span>
        <motion.div
          className="mt-3 h-[2px] rounded-full"
          style={{
            background: "var(--accent-gradient)",
            transformOrigin: "left",
          }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.2, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
      <motion.div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          height: "2px",
          background: "linear-gradient(to right, #F97316, #FB923C)",
        }}
        initial={{ width: "0%" }}
        animate={{ width: "100%" }}
        transition={{ duration: 2.3, ease: [0.22, 1, 0.36, 1] }}
      />
    </motion.div>
  );
}

export default function Preloader() {
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();
  // The paper loader belongs to the v4 design, which is now the home page.
  // The old mark loader stays for /hero/* and the other variants.
  const isPaper = pathname === "/" || pathname?.startsWith("/v4");

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (isPaper ? <PaperLoader /> : <MarkLoader />)}
    </AnimatePresence>
  );
}
