"use client";
import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { clsx } from "clsx";

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  href?: string;
  onClick?: () => void;
  variant?: "solid" | "outline";
}

export default function MagneticButton({
  children,
  className,
  href,
  onClick,
  variant = "solid",
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setPosition({ x: x * 0.3, y: y * 0.3 });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  const baseStyles =
    variant === "solid"
      ? "bg-gradient-to-r from-accent-primary to-accent-secondary text-white"
      : "glass text-foreground hover:bg-white/5";

  const content = (
    <motion.div
      ref={ref}
      className={clsx(
        "relative inline-flex cursor-pointer items-center justify-center rounded-full px-8 py-3 text-sm font-medium transition-colors",
        baseStyles,
        className
      )}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 350, damping: 15, mass: 0.5 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );

  if (href) {
    return (
      <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer">
        {content}
      </a>
    );
  }

  return content;
}
