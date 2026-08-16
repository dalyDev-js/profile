"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CASES, NAV_H } from "./theme";

gsap.registerPlugin(ScrollTrigger);

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

/**
 * Sticky case stack.
 *
 * Every case is `position: sticky` inside one shared container with an
 * ascending z-index, so each new case slides up and covers the one before it
 * and they release together at the end. A single ScrollTrigger on the stack
 * writes a per-case `--case-reveal` (0 → 1); all the motion is CSS driven off
 * that one custom property.
 */
export default function V4Projects({ displayFont }: { displayFont: string }) {
  const stackRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const stack = stackRef.current;
    if (!stack) return;

    const cards = Array.from(
      stack.querySelectorAll<HTMLElement>(".v4-case")
    );
    const n = cards.length;
    const step = 1 / n;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: stack,
        // Lead-in above the fold so case 01 reveals on approach rather than
        // snapping in already-complete.
        start: "top 85%",
        end: "bottom bottom",
        scrub: true,
        onUpdate: (self) => {
          const gp = self.progress;
          cards.forEach((el, i) => {
            // Reveal finishes just as this case takes over the viewport.
            const start = i === 0 ? 0 : (i - 0.5) * step;
            const end = i === 0 ? step * 0.35 : i * step + 0.15 * step;
            const local = clamp01((gp - start) / (end - start));
            el.style.setProperty("--case-reveal", local.toFixed(4));
          });
        },
      });
    }, stack);

    return () => ctx.revert();
  }, []);

  return (
    <section id="v4-work" style={{ position: "relative" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          gap: 20,
          flexWrap: "wrap",
          padding: `clamp(70px, 12vh, 130px) clamp(20px, 4vw, 56px) 34px`,
          fontSize: 12,
          fontWeight: 600,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          opacity: 0.55,
        }}
      >
        <span>Selected Work · {CASES.length} projects</span>
        <span>Scroll ↓</span>
      </div>

      <div ref={stackRef} className="v4-stack">
        {CASES.map((c, i) => (
          <article
            key={c.title}
            className="v4-case"
            style={
              {
                zIndex: 5 + i,
                top: NAV_H,
                "--case-ink": c.ink,
                "--case-reveal": "0",
              } as React.CSSProperties
            }
          >
            <div className="v4-case-frame">
              <span className="v4-tick v4-tick--tl" />
              <span className="v4-tick v4-tick--tr" />
              <span className="v4-tick v4-tick--bl" />
              <span className="v4-tick v4-tick--br" />

              <span className="v4-case-n">case {c.n}</span>

              <div className="v4-case-inner">
                <div className="v4-case-head">
                  <div className="v4-case-client">{c.client}</div>

                  <h3
                    className="v4-case-title"
                    style={{ fontFamily: displayFont }}
                  >
                    <span className="v4-lm">
                      <span className="v4-lm-in">{c.title}</span>
                    </span>
                  </h3>

                  <p className="v4-case-blurb">{c.blurb}</p>

                  <div className="v4-tags">
                    {c.tags.map((t) => (
                      <span key={t} className="v4-tag">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="v4-laptop-wrap">
                  <span className="v4-inkglow" aria-hidden />
                  <div className="v4-laptop">
                    <div className="v4-laptop-lid">
                      <div
                        className="v4-laptop-screen"
                        style={{ aspectRatio: String(c.aspect) }}
                      >
                        <Image
                          src={c.image}
                          alt={`${c.title} — ${c.client}`}
                          fill
                          sizes="(max-width: 900px) 92vw, 68vw"
                          // The lid already matches this image's aspect, so
                          // cover neither crops nor leaves bars.
                          style={{
                            objectFit: "cover",
                            objectPosition: "center",
                          }}
                        />
                      </div>
                    </div>
                    <div className="v4-laptop-base" />
                  </div>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
