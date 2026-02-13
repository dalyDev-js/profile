"use client";
import { motion } from "framer-motion";
import { charReveal, charRevealChild } from "@/lib/animations";

interface RevealTextProps {
  text: string;
  className?: string;
  delay?: number;
}

export default function RevealText({ text, className, delay = 0 }: RevealTextProps) {
  return (
    <motion.span
      className={className}
      variants={{
        hidden: {},
        visible: {
          transition: { staggerChildren: 0.03, delayChildren: delay },
        },
      }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      aria-label={text}
    >
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          className="inline-block"
          variants={charRevealChild}
          style={{ whiteSpace: char === " " ? "pre" : undefined }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </motion.span>
  );
}
