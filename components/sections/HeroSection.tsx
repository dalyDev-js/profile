"use client";
import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { personalInfo } from "@/lib/constants";
import RevealText from "@/components/ui/RevealText";
import MagneticButton from "@/components/ui/MagneticButton";
import { fadeInUp, staggerContainer } from "@/lib/animations";

gsap.registerPlugin(ScrollTrigger);

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Parallax: text moves up slower, avatar moves up faster on scroll
      gsap.to(textRef.current, {
        y: -80,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap.to(avatarRef.current, {
        y: -150,
        scale: 0.9,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      // Fade out hero as you scroll away
      gsap.to(sectionRef.current, {
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "60% top",
          end: "bottom top",
          scrub: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="home"
      className="relative flex min-h-screen items-center"
    >
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center gap-8 px-6 lg:flex-row lg:gap-12">
        {/* Text content */}
        <div ref={textRef} className="flex-1 pt-24 lg:pt-0">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            <motion.p
              variants={fadeInUp}
              className="font-mono text-sm uppercase tracking-widest text-accent-primary"
            >
              {personalInfo.title}
            </motion.p>

            <h1 className="whitespace-nowrap text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-7xl">
              <RevealText text={personalInfo.name} delay={0.5} />
            </h1>

            <motion.p
              variants={fadeInUp}
              className="text-xl font-medium text-accent-secondary"
            >
              {personalInfo.subtitle}
            </motion.p>

            <motion.p
              variants={fadeInUp}
              className="max-w-lg text-lg text-zinc-400"
            >
              {personalInfo.tagline}
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className="flex flex-wrap gap-4 pt-4"
            >
              <MagneticButton href="#projects" variant="solid">
                View Projects
              </MagneticButton>
              <MagneticButton href="#contact" variant="outline">
                Get in Touch
              </MagneticButton>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="flex gap-5 pt-4"
            >
              <a href={personalInfo.github} target="_blank" rel="noopener noreferrer" className="text-zinc-500 transition-colors hover:text-accent-primary">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
              </a>
              <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="text-zinc-500 transition-colors hover:text-accent-primary">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
              </a>
            </motion.div>
          </motion.div>
        </div>

        {/* Hero Avatar Image */}
        <div ref={avatarRef} className="flex flex-1 items-center justify-center">
          <motion.div
            className="relative"
            initial={{ opacity: 0, scale: 0.85, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="absolute inset-0 -z-10 scale-90 blur-3xl" style={{ background: "radial-gradient(circle, rgba(249,115,22,0.25) 0%, rgba(234,179,8,0.15) 50%, transparent 70%)" }} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/hero-avatar.png"
              alt="Abdulrhman El-Daly"
              width={420}
              height={420}
              className="drop-shadow-[0_0_60px_rgba(249,115,22,0.2)]"
            />
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3, duration: 1 }}
      >
        <motion.div
          className="flex flex-col items-center gap-2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="text-xs uppercase tracking-widest text-zinc-500">Scroll to Explore</span>
          <svg className="h-4 w-4 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
}
