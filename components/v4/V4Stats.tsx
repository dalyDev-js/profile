"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Mirrors V3Page's STATS. Kept here rather than imported so this section owns
// its own presentation — the V3 version is hidden via `showStats={false}`.
const STATS = [
  { to: 5, suffix: "+", label: "Years Experience", ink: "#0891B2" },
  { to: 10, suffix: "+", label: "Projects Shipped", ink: "#2563EB" },
  { to: 8, suffix: "+", label: "Juniors Mentored", ink: "#7C3AED" },
  { to: 4, suffix: "", label: "Companies", ink: "#059669" },
];

export default function V4Stats({ displayFont }: { displayFont: string }) {
  const rootRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const nums = gsap.utils.toArray<HTMLElement>(".v4-stat-n");
      nums.forEach((n) => {
        const to = Number(n.dataset.to ?? 0);
        const suffix = n.dataset.suffix ?? "";
        const counter = { v: 0 };
        gsap.to(counter, {
          v: to,
          duration: 1.3,
          ease: "power2.out",
          // Runs once, when the row actually comes into view.
          scrollTrigger: { trigger: el, start: "top 82%", once: true },
          onUpdate: () => {
            n.textContent = `${Math.round(counter.v)}${suffix}`;
          },
        });
      });

      gsap.from(".v4-stat", {
        opacity: 0,
        y: 26,
        duration: 0.7,
        stagger: 0.09,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 82%", once: true },
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      id="v4-stats"
      style={{ padding: "clamp(28px, 5vh, 56px) clamp(20px, 4vw, 56px)" }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
          gap: "clamp(14px, 2vw, 26px)",
          maxWidth: 1180,
          margin: "0 auto",
        }}
      >
        {STATS.map((s) => (
          <div
            key={s.label}
            className="v4-stat"
            style={{
              borderTop: `2px solid ${s.ink}`,
              paddingTop: 14,
            }}
          >
            <div
              className="v4-stat-n"
              data-to={s.to}
              data-suffix={s.suffix}
              style={{
                fontFamily: displayFont,
                fontWeight: 800,
                fontSize: "clamp(30px, 3.4vw, 46px)",
                lineHeight: 1,
                letterSpacing: "-0.03em",
                fontVariantNumeric: "tabular-nums",
                color: s.ink,
              }}
            >
              0{s.suffix}
            </div>
            <div
              style={{
                marginTop: 8,
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                opacity: 0.55,
              }}
            >
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
