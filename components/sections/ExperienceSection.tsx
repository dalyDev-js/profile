"use client";
import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { experiences } from "@/lib/constants";
import SectionHeading from "@/components/ui/SectionHeading";
import GlassCard from "@/components/ui/GlassCard";

gsap.registerPlugin(ScrollTrigger);

export default function ExperienceSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !lineRef.current) return;

    const ctx = gsap.context(() => {
      // Timeline line grows as you scroll
      gsap.fromTo(
        lineRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 60%",
            end: "bottom 70%",
            scrub: 0.5,
          },
        }
      );

      // Cards slide in from alternating sides
      const cards = gsap.utils.toArray<HTMLElement>(".exp-card");
      cards.forEach((card, i) => {
        const isLeft = i % 2 === 0;
        gsap.fromTo(
          card,
          { opacity: 0, x: isLeft ? -60 : 60, y: 30 },
          {
            opacity: 1,
            x: 0,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
              end: "top 55%",
              scrub: 1,
            },
          }
        );
      });

      // Timeline dots scale in
      const dots = gsap.utils.toArray<HTMLElement>(".exp-dot");
      dots.forEach((dot) => {
        gsap.fromTo(
          dot,
          { scale: 0 },
          {
            scale: 1,
            ease: "back.out(3)",
            scrollTrigger: {
              trigger: dot,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="experience" className="relative z-10 py-20 overflow-hidden bg-background">
      <div className="mx-auto max-w-5xl px-6">
        <SectionHeading
          title="Experience"
          subtitle="My professional journey"
        />

        <div className="relative">
          {/* Timeline center line — scroll-driven */}
          <div
            ref={lineRef}
            className="absolute left-4 top-0 bottom-0 w-[2px] origin-top md:left-1/2 md:-translate-x-[1px]"
            style={{
              background: "linear-gradient(to bottom, #f97316, #eab308)",
              boxShadow: "0 0 12px rgba(249, 115, 22, 0.4)",
            }}
          />

          {/* Experience cards */}
          <div className="space-y-16">
            {experiences.map((exp, i) => {
              const isLeft = i % 2 === 0;
              return (
                <div
                  key={exp.company}
                  className={`relative flex items-start gap-8 ${
                    isLeft ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  {/* Timeline dot */}
                  <div className="absolute left-4 z-10 -translate-x-1/2 md:left-1/2">
                    <div className="exp-dot h-4 w-4 rounded-full border-2 border-accent-primary bg-background shadow-[0_0_12px_rgba(249,115,22,0.5)]" />
                  </div>

                  {/* Card */}
                  <div
                    className={`exp-card ml-12 w-full md:ml-0 md:w-[calc(50%-2rem)] ${
                      isLeft ? "" : "md:ml-auto"
                    }`}
                  >
                    <GlassCard className="p-6">
                      <div className="mb-3 flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-accent-primary/10 px-3 py-1 text-xs font-medium text-accent-primary">
                          {exp.type}
                        </span>
                        <span className="text-xs text-zinc-500">{exp.period}</span>
                      </div>
                      <h3 className="text-xl font-bold">{exp.role}</h3>
                      <p className="mt-1 text-sm text-accent-secondary">{exp.company}</p>
                      <ul className="mt-4 space-y-2">
                        {exp.bullets.map((bullet, j) => (
                          <li key={j} className="flex items-start gap-2 text-sm text-zinc-400">
                            <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent-primary/50" />
                            {bullet}
                          </li>
                        ))}
                      </ul>
                    </GlassCard>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
