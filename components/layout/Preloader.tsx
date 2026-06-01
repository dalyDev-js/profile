"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Preloader() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="fixed inset-0 z-[10001] flex items-center justify-center overflow-hidden"
          style={{ background: "#07090F" }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
        >
          {/* Grid */}
          <div style={{
            position: "absolute", inset: 0,
            backgroundImage: "linear-gradient(rgba(249,115,22,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(249,115,22,0.07) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }} />
          {/* Radial glow — fades in with text, then pulses */}
          <motion.div
            style={{
              position: "absolute", width: 600, height: 600, borderRadius: "50%",
              background: "radial-gradient(circle, rgba(249,115,22,0.12) 0%, transparent 70%)",
              top: "50%", left: "50%", transform: "translate(-50%,-50%)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.7, 1, 0.7], scale: [0.9, 1, 1.1, 1] }}
            transition={{ duration: 2.5, delay: 0.5, ease: "easeInOut" }}
          />
          {/* Corner accent top-left */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            style={{
              position: "absolute", top: 0, left: 0, width: 300, height: 300,
              background: "radial-gradient(circle at top left, rgba(249,115,22,0.07) 0%, transparent 60%)",
            }} />
          {/* Corner accent bottom-right */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            style={{
              position: "absolute", bottom: 0, right: 0, width: 300, height: 300,
              background: "radial-gradient(circle at bottom right, rgba(59,130,246,0.05) 0%, transparent 60%)",
            }} />
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
          {/* Bottom progress bar */}
          <motion.div
            style={{
              position: "absolute", bottom: 0, left: 0, height: "2px",
              background: "linear-gradient(to right, #F97316, #FB923C)",
            }}
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 2.3, ease: [0.22, 1, 0.36, 1] }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
