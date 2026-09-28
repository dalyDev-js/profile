"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { V4 } from "./theme";
import { PALETTE_LIGHT, V3About } from "@/components/v3/V3Page";
import {
  FOLD,
  INVERT,
  LAND,
  YEAR,
  YEAR_FLY,
  YEAR_RUN,
  clamp01,
  lerp,
  smoothstep as ss,
} from "./paperTiming";

// About's own portrait is hidden outright on /v4 — the paper opens out into its
// slot and *is* the portrait. Set once on mount and never animated, so there is
// exactly one picture on screen and nothing that can flicker or cross-fade.
// Its box is left in the layout because V4Paper reads that rect to know where
// to land.
const PORTRAIT_SEL = "#v3-about [data-portrait-slot] img";

gsap.registerPlugin(ScrollTrigger);

const V4Paper = dynamic(() => import("./V4Paper"), { ssr: false });

const THEN_YEAR = 1997;
const NOW_YEAR = new Date().getFullYear();
const PHOTO_AR = 1169 / 1346;

/**
 * The then → now crossover.
 *
 * The 1997 print folds itself into a paper plane, flies down through a wormhole,
 * and unfolds on the other side as the About portrait. The print and the paper
 * are the same object throughout — see V4Paper. About is rendered
 * *inside* this section on purpose — the ball's canvas is a sticky layer
 * spanning the whole section, which is what lets it reach the portrait.
 */
export default function V4ThenNow({ displayFont }: { displayFont: string }) {
  const progressRef = useRef(0);
  const crossoverRef = useRef<HTMLElement | null>(null);
  const photoRef = useRef<HTMLDivElement | null>(null);
  const nowLabelRef = useRef<HTMLDivElement | null>(null);
  const yearRef = useRef<HTMLDivElement | null>(null);
  const portraitEl = useRef<HTMLElement | null>(null);
  const [mountBall, setMountBall] = useState(false);
  const [ballActive, setBallActive] = useState(false);

  // Spin WebGL up when the sequence is near, and stop the render loop once it's
  // gone — there are four more heavy sections below this one.
  useEffect(() => {
    const el = crossoverRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        const on = entries.some((e) => e.isIntersecting);
        if (on) setMountBall(true);
        setBallActive(on);
      },
      { rootMargin: "60% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const el = crossoverRef.current;
    if (!el) return;
    const root = document.documentElement;

    // Hidden once, statically. `visibility` rather than `opacity` so nothing
    // can be mistaken for a fade, and the box stays in the layout as the
    // paper's landing target.
    portraitEl.current = document.querySelector(PORTRAIT_SEL);
    if (portraitEl.current) portraitEl.current.style.visibility = "hidden";

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: el,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate: (self) => {
          const p = self.progress;
          progressRef.current = p;

          // Straight fade. The 3D sheet takes over flat, at this exact rect and
          // tilt, carrying the same picture — there is nothing to disguise, so
          // any extra scrunching here would just fight the fold in V4Paper.
          // Must track V4Paper's FOLD window, or the print is still solid while
          // the plane it became is already flying.
          const birth = ss(FOLD[0], FOLD[1], p);
          const photo = photoRef.current;
          if (photo) photo.style.opacity = String(1 - birth);

          // Years ticking past while he's mid-air, then the number shrinks and
          // flies up into the corner to become the NOW · YYYY label.
          const yr = yearRef.current;
          const label = nowLabelRef.current;
          if (yr) {
            const run = clamp01(
              (p - YEAR_RUN[0]) / (YEAR_RUN[1] - YEAR_RUN[0])
            );
            yr.textContent = String(
              Math.round(THEN_YEAR + (NOW_YEAR - THEN_YEAR) * run)
            );

            const fly = ss(YEAR_FLY[0], YEAR_FLY[1], p);
            const stage = yr.parentElement;
            let tx = 0;
            let ty = 0;
            if (stage && label) {
              const s = stage.getBoundingClientRect();
              const l = label.getBoundingClientRect();
              tx = l.left + l.width / 2 - s.left - s.width / 2;
              ty = l.top + l.height / 2 - s.top - s.height / 2;
            }
            yr.style.transform = `translate(${lerp(0, tx, fly)}px, ${lerp(
              0,
              ty,
              fly
            )}px) scale(${lerp(1, 0.06, fly)})`;

            yr.style.opacity = String(
              ss(YEAR[0], YEAR[0] + 0.06, p) *
                lerp(0.16, 0.9, fly) *
                (1 - ss(0.9, 0.945, p))
            );
          }

          // Takes over exactly where the flying number arrives.
          if (label) label.style.opacity = String(ss(0.9, 0.95, p));

          // Tight window — the halfway point of a dark→light mix is a muddy
          // grey, and with the descent otherwise empty it is very exposed.
          root.style.setProperty(
            "--v4-t",
            ss(INVERT[0], INVERT[1], p).toFixed(4)
          );
        },
      });
    }, el);

    return () => {
      ctx.revert();
      root.style.setProperty("--v4-t", "0");
      if (portraitEl.current) portraitEl.current.style.visibility = "";
    };
  }, []);

  return (
    <section
      ref={crossoverRef}
      id="v4-crossover"
      style={{ position: "relative" }}
    >
      {/* Paper layer: pinned over the whole section, pulled out of the flow so
          the content below sits under it. */}
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          marginBottom: "-100vh",
          zIndex: 3,
          pointerEvents: "none",
        }}
      >
        {/* Years counting past, behind the paper — the canvas is transparent,
            so this reads as depth rather than an overlay. */}
        <div
          ref={yearRef}
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: 0,
            fontFamily: displayFont,
            fontWeight: 800,
            fontSize: "clamp(64px, 13vw, 190px)",
            letterSpacing: "-0.04em",
            lineHeight: 1,
            fontVariantNumeric: "tabular-nums",
            color: "currentColor",
            userSelect: "none",
            willChange: "transform, opacity",
          }}
        >
          {THEN_YEAR}
        </div>

        <div style={{ position: "absolute", inset: 0, zIndex: 1 }}>
          {mountBall && (
            <V4Paper
              progressRef={progressRef}
              photoRef={photoRef}
              active={ballActive}
            />
          )}
        </div>

        <div
          ref={nowLabelRef}
          style={{
            position: "absolute",
            top: "clamp(80px, 12vh, 120px)",
            right: "clamp(20px, 4vw, 56px)",
            opacity: 0,
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "#0F766E",
          }}
        >
          Now · {NOW_YEAR}
        </div>
      </div>

      <div style={{ position: "relative", zIndex: 1 }}>
        {/* Screen one: ball in the upper third, the 1997 print below it. */}
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            padding:
              "clamp(70px, 11vh, 110px) clamp(20px, 4vw, 56px) clamp(30px, 5vh, 60px)",
          }}
        >
          <div
            style={{
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: V4.cyan,
            }}
          >
            Then · {THEN_YEAR}
          </div>

          {/* breathing room under the "Then" label */}
          <div style={{ flex: "0 0 12vh", pointerEvents: "none" }} />

          <div
            className="v4-then"
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 0.8fr) minmax(0, 1.2fr)",
              gap: "clamp(26px, 5vw, 70px)",
              alignItems: "center",
            }}
          >
            {/* Fixed width with an animatable aspect-ratio: as it rounds off it
                also squares up, so the print resolves into a disc that matches
                the sphere rather than an ellipse. */}
            <div
              ref={photoRef}
              style={{
                position: "relative",
                width: "min(360px, 100%)",
                aspectRatio: String(PHOTO_AR),
                overflow: "hidden",
                transform: "rotate(-2.4deg)",
                filter: "drop-shadow(0 30px 54px rgba(0,0,0,0.65))",
              }}
            >
              <Image
                src="/v4/then.png"
                alt={`Abdulrhman El-Daly aged five, ${THEN_YEAR}`}
                fill
                sizes="(max-width: 900px) 70vw, 26vw"
                style={{ objectFit: "cover", objectPosition: "center top" }}
              />
            </div>

            <div>
              <h2
                style={{
                  fontFamily: displayFont,
                  fontWeight: 800,
                  fontSize: "clamp(26px, 3.2vw, 48px)",
                  lineHeight: 1.05,
                  letterSpacing: "-0.025em",
                  marginBottom: 20,
                }}
              >
                Hi, I&rsquo;m Abdulrhman. It&rsquo;s {THEN_YEAR}, and I just
                turned five.
              </h2>
              <p
                style={{
                  fontSize: "clamp(15px, 1.2vw, 18px)",
                  lineHeight: 1.6,
                  color: "#B9B8B2",
                  maxWidth: "52ch",
                  marginBottom: 14,
                }}
              >
                Already glued to the family computer — Windows 95, and a copy of
                Doom 95 I was far too young for.
              </p>
              <p
                style={{
                  fontSize: "clamp(15px, 1.2vw, 18px)",
                  lineHeight: 1.6,
                  color: "#B9B8B2",
                  maxWidth: "52ch",
                }}
              >
                The tools have gotten a lot better since. The obsession never
                went anywhere.
              </p>
              {/* Lives in the text column, so the grid's centring lifts the copy
                  and the whole column sits centred against the print. */}
              <video
                src="/v4/doom.mp4"
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
                aria-label="Doom 95 gameplay"
                style={{
                  display: "block",
                  width: "min(400px, 100%)",
                  aspectRatio: "16 / 9",
                  marginTop: 28,
                  borderRadius: 6,
                  boxShadow: "0 24px 48px rgba(0,0,0,0.5)",
                }}
              />
            </div>
          </div>
        </div>

        {/* room for the ball to fall through before it flies to the portrait */}
        <div style={{ height: "150vh" }} />

        {/* stats live in their own section below — see V4Stats */}
        <V3About p={PALETTE_LIGHT} showStats={false} />
      </div>
    </section>
  );
}
