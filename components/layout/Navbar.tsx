"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { clsx } from "clsx";
import { navLinks } from "@/lib/constants";

const links = navLinks;

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    links.forEach(({ href }) => {
      const id = href.replace("#", "");
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(id);
          }
        },
        { threshold: 0.3, rootMargin: "-80px 0px -50% 0px" }
      );
      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const handleClick = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.nav
      className={clsx(
        "fixed top-4 left-1/2 z-[100] -translate-x-1/2 rounded-full px-2 py-2 transition-all duration-500",
        scrolled
          ? "glass bg-opacity-80 shadow-lg"
          : "bg-transparent"
      )}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 2.5, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Desktop nav */}
      <ul className="hidden items-center gap-1 md:flex">
        {links.map(({ label, href }) => {
          const id = href.replace("#", "");
          const isActive = activeSection === id;
          return (
            <li key={id}>
              <button
                onClick={() => handleClick(href)}
                className={clsx(
                  "relative rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  isActive ? "text-white" : "text-zinc-400 hover:text-zinc-200"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute inset-0 rounded-full"
                    style={{ background: "rgba(249, 115, 22, 0.2)", border: "1px solid rgba(249, 115, 22, 0.3)" }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{label}</span>
              </button>
            </li>
          );
        })}
      </ul>

      {/* Mobile hamburger */}
      <button
        className="flex h-10 w-10 items-center justify-center rounded-full md:hidden"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        <div className="space-y-1.5">
          <motion.div
            className="h-[2px] w-6 bg-foreground rounded-full"
            animate={mobileOpen ? { rotate: 45, y: 5.5 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.3 }}
          />
          <motion.div
            className="h-[2px] w-6 bg-foreground rounded-full"
            animate={mobileOpen ? { opacity: 0 } : { opacity: 1 }}
            transition={{ duration: 0.2 }}
          />
          <motion.div
            className="h-[2px] w-6 bg-foreground rounded-full"
            animate={mobileOpen ? { rotate: -45, y: -5.5 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </button>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="glass absolute top-14 left-1/2 -translate-x-1/2 rounded-2xl p-4 md:hidden"
            initial={{ opacity: 0, scale: 0.9, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <ul className="flex flex-col gap-2">
              {links.map(({ label, href }) => (
                <li key={href}>
                  <button
                    onClick={() => handleClick(href)}
                    className="w-full rounded-lg px-6 py-2 text-left text-sm text-zinc-300 hover:bg-white/5 hover:text-white"
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
