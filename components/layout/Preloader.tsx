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
          className="fixed inset-0 z-[10001] flex items-center justify-center"
          style={{ background: "#0a0a08" }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="relative overflow-hidden">
            <motion.span
              className="gradient-text text-7xl font-bold tracking-tighter sm:text-9xl"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              AE
            </motion.span>
            <motion.div
              className="absolute bottom-0 left-0 h-full w-full"
              style={{
                background: "#0a0a08",
                transformOrigin: "right",
              }}
              initial={{ scaleX: 1 }}
              animate={{ scaleX: 0 }}
              transition={{ duration: 1.5, delay: 0.3, ease: [0.76, 0, 0.24, 1] }}
            />
            <motion.div
              className="mx-auto mt-4 h-[2px] rounded-full"
              style={{ background: "var(--accent-gradient)" }}
              initial={{ width: 0 }}
              animate={{ width: 120 }}
              transition={{ duration: 1.2, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
