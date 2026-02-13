"use client";
import { useRef, useEffect } from "react";
import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { personalInfo, stats } from "@/lib/constants";
import SectionHeading from "@/components/ui/SectionHeading";
import GlassCard from "@/components/ui/GlassCard";

gsap.registerPlugin(ScrollTrigger);

function StatCounter({ value, label }: { value: number; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v));

  useEffect(() => {
    if (isInView) {
      animate(count, value, { duration: 2, ease: "easeOut" });
    }
  }, [isInView, count, value]);

  return (
    <div ref={ref} className="text-center">
      <div className="text-4xl font-bold">
        <motion.span>{rounded}</motion.span>
        <span className="gradient-text">+</span>
      </div>
      <p className="mt-1 text-sm text-zinc-400">{label}</p>
    </div>
  );
}

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const decor1Ref = useRef<HTMLDivElement>(null);
  const decor2Ref = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const bioRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Parallax decorative blurs
      gsap.to(decor1Ref.current, {
        y: -60,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap.to(decor2Ref.current, {
        y: 80,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });

      // Card slides in from left
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, x: -60 },
        {
          opacity: 1,
          x: 0,
          ease: "power2.out",
          scrollTrigger: {
            trigger: cardRef.current,
            start: "top 85%",
            end: "top 50%",
            scrub: 1,
          },
        }
      );

      // Bio slides in from right
      gsap.fromTo(
        bioRef.current,
        { opacity: 0, x: 60 },
        {
          opacity: 1,
          x: 0,
          ease: "power2.out",
          scrollTrigger: {
            trigger: bioRef.current,
            start: "top 85%",
            end: "top 50%",
            scrub: 1,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="about" className="relative py-20 overflow-hidden">
      {/* Decorative circles — parallax */}
      <div ref={decor1Ref} className="absolute -left-32 top-20 h-64 w-64 rounded-full bg-accent-primary/5 blur-3xl" />
      <div ref={decor2Ref} className="absolute -right-20 top-1/2 h-48 w-48 rounded-full bg-accent-secondary/5 blur-3xl" />

      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading title="About Me" subtitle="Get to know me better" />

        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          {/* 3D Card */}
          <div ref={cardRef}>
            <GlassCard tilt className="p-8">
              <div className="space-y-4">
                <div className="inline-block rounded-full bg-accent-primary/10 px-4 py-1.5 text-sm text-accent-primary">
                  5+ Years of Experience
                </div>
                <h3 className="text-2xl font-bold">{personalInfo.fullName}</h3>
                <p className="font-mono text-sm text-accent-secondary">{personalInfo.title} {personalInfo.subtitle}</p>
                <div className="flex items-center gap-2 text-sm text-zinc-400">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {personalInfo.location}
                </div>
                <div className="flex items-center gap-2 text-sm text-zinc-400">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {personalInfo.email}
                </div>
              </div>

              {/* Stats */}
              <div className="mt-8 grid grid-cols-3 gap-4 border-t border-white/5 pt-6">
                {stats.map((stat) => (
                  <StatCounter key={stat.label} value={stat.value} label={stat.label} />
                ))}
              </div>
            </GlassCard>
          </div>

          {/* Bio text */}
          <div ref={bioRef} className="space-y-6">
            <p className="text-lg leading-relaxed text-zinc-300">
              {personalInfo.bio}
            </p>

            <p className="leading-relaxed text-zinc-400">
              Proven track record in technical leadership, mentoring junior developers, and building
              advanced design systems. I thrive at the intersection of design and engineering,
              creating solutions that are both beautiful and performant.
            </p>

            <div>
              <h4 className="mb-3 text-sm font-semibold uppercase tracking-widest text-zinc-500">Education</h4>
              <div className="space-y-2">
                <p className="text-sm text-zinc-300">
                  Bachelor&apos;s Degree in Engineering — El-Shrouk Academy
                </p>
                <p className="text-sm text-zinc-300">
                  ITI Intensive Code Camp — MERN Stack (2024)
                </p>
              </div>
            </div>

            <div>
              <h4 className="mb-3 text-sm font-semibold uppercase tracking-widest text-zinc-500">Languages</h4>
              <p className="text-sm text-zinc-300">Arabic (Native) &middot; English (Fluent)</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
