"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import V4Hero from "./V4Hero";
import V4ThenNow from "./V4ThenNow";
import V4Projects from "./V4Projects";
import V4Stats from "./V4Stats";
import { NAV_H } from "./theme";
// The sections that already exist in V3 are palette-driven, so they come across
// to the light half of this page as-is rather than being rebuilt.
import {
  PALETTE_LIGHT,
  V3SkillTree,
  V3Experience,
  V3FistBumpExact,
} from "@/components/v3/V3Page";

gsap.registerPlugin(ScrollTrigger);

const CSS = `
:root { --v4-t: 0; }

.v4-root {
  min-height: 100vh;
  background: color-mix(in srgb, #F5F3EE calc(var(--v4-t) * 100%), #07090F);
  color: color-mix(in srgb, #12141A calc(var(--v4-t) * 100%), #F1F5F9);
  letter-spacing: -0.01em;
  /* deliberately no overflow here — any non-visible overflow on an ancestor
     risks turning this into the scrollport and killing the sticky case stack.
     body already carries overflow-x: clip. */
}

.v4-sr {
  position: absolute; width: 1px; height: 1px; padding: 0;
  overflow: hidden; clip: rect(0 0 0 0); clip-path: inset(50%);
  white-space: nowrap; border: 0;
}

/* ── progress + nav ─────────────────────────────────────────────────────── */
.v4-prog {
  position: fixed; top: 0; left: 0; height: 2px; width: 0%; z-index: 90;
  background: linear-gradient(90deg, #22D3EE, #A78BFA);
  box-shadow: 0 0 12px rgba(34,211,238,.45);
}
.v4-nav {
  position: sticky; top: 0; z-index: 60; height: ${NAV_H}px;
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 clamp(20px, 4vw, 56px);
  backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
  background: color-mix(in srgb, rgba(245,243,238,.72) calc(var(--v4-t) * 100%), rgba(7,9,15,.72));
  border-bottom: 1px solid color-mix(in srgb, rgba(12,14,20,.14) calc(var(--v4-t) * 100%), rgba(255,255,255,.08));
}
.v4-brand { font-weight: 800; font-size: 17px; letter-spacing: -0.02em; white-space: nowrap; }
.v4-brand-short { display: none; }
.v4-navlinks { display: flex; gap: 22px; font-size: 13px; font-weight: 500; }
.v4-navlinks a { opacity: .7; transition: opacity .2s; }
.v4-navlinks a:hover { opacity: 1; }

/* ── hero atmosphere ────────────────────────────────────────────────────── */
.v4-aurora { position: absolute; inset: 0; z-index: 0; pointer-events: none; overflow: hidden; }
.v4-aurora i { position: absolute; display: block; border-radius: 50%; filter: blur(85px); mix-blend-mode: screen; }
.v4-aurora i:nth-child(1) {
  width: 64vmax; height: 64vmax; top: -20%; left: -14%; opacity: .10;
  background: radial-gradient(circle, #22D3EE 0%, rgba(34,211,238,0) 62%);
  animation: v4aurA 26s ease-in-out infinite alternate;
}
.v4-aurora i:nth-child(2) {
  width: 58vmax; height: 58vmax; top: 2%; right: -18%; opacity: .085;
  background: radial-gradient(circle, #A78BFA 0%, rgba(167,139,250,0) 62%);
  animation: v4aurB 32s ease-in-out infinite alternate;
}
.v4-aurora i:nth-child(3) {
  width: 52vmax; height: 52vmax; bottom: -24%; left: 26%; opacity: .06;
  background: radial-gradient(circle, #5F7BFF 0%, rgba(95,123,255,0) 60%);
  animation: v4aurC 38s ease-in-out infinite alternate;
}
@keyframes v4aurA { to { transform: translate3d(8%, 6%, 0) scale(1.14); } }
@keyframes v4aurB { to { transform: translate3d(-7%, 9%, 0) scale(1.1); } }
@keyframes v4aurC { to { transform: translate3d(6%, -8%, 0) scale(1.16); } }

.v4-herobloom {
  position: absolute; inset: 0; z-index: 0; pointer-events: none;
  background:
    radial-gradient(46% 26% at 50% 50%, rgba(34,211,238,.13), rgba(34,211,238,0) 70%),
    radial-gradient(70% 44% at 50% 52%, rgba(167,139,250,.07), rgba(167,139,250,0) 72%);
}
.v4-cursorglow {
  position: fixed; top: 0; left: 0; width: 42vmax; height: 42vmax;
  margin: -21vmax 0 0 -21vmax; z-index: 2; pointer-events: none; border-radius: 50%;
  background: radial-gradient(circle, rgba(34,211,238,.10) 0%, rgba(167,139,250,.05) 42%, rgba(167,139,250,0) 66%);
  filter: blur(26px); mix-blend-mode: screen; opacity: 0; transition: opacity .6s;
}
.v4-fx { position: absolute; inset: 0; z-index: 3; pointer-events: none; overflow: hidden; }
.v4-ripple {
  position: absolute; width: 46px; height: 46px; margin: -23px 0 0 -23px;
  border-radius: 50%; filter: blur(7px); mix-blend-mode: screen;
  transform: scale(.2); opacity: 0;
  background: radial-gradient(circle, rgba(167,139,250,0) 26%, rgba(34,211,238,.30) 46%, rgba(167,139,250,.16) 60%, rgba(34,211,238,0) 76%);
  animation: v4ripple 1.9s cubic-bezier(.15,.72,.28,1) forwards;
}
.v4-ripple--2 { animation-duration: 2.6s; animation-delay: .14s; }
@keyframes v4ripple { 0% { transform: scale(.2); opacity: .9; } 100% { transform: scale(14); opacity: 0; } }

/* ── project stack ──────────────────────────────────────────────────────── */
.v4-stack { position: relative; }
.v4-case {
  position: sticky;
  height: calc(100vh - ${NAV_H}px);
  margin-bottom: 16vh;
  padding: 0 clamp(14px, 3vw, 44px) clamp(14px, 3vw, 40px);
  background: color-mix(in srgb, #F5F3EE calc(var(--v4-t) * 100%), #07090F);
}
.v4-case-frame {
  position: relative; height: 100%; overflow: hidden;
  border: 1px solid color-mix(in srgb, rgba(12,14,20,.16) calc(var(--v4-t) * 100%), rgba(255,255,255,.10));
}
.v4-tick { position: absolute; width: 11px; height: 11px; opacity: calc(.2 + .6 * var(--case-reveal)); }
.v4-tick::before, .v4-tick::after { content: ""; position: absolute; background: var(--case-ink); }
.v4-tick::before { left: 50%; top: 0; width: 1px; height: 100%; transform: translateX(-50%); }
.v4-tick::after { top: 50%; left: 0; height: 1px; width: 100%; transform: translateY(-50%); }
.v4-tick--tl { left: 12px; top: 12px; }
.v4-tick--tr { right: 12px; top: 12px; }
.v4-tick--bl { left: 12px; bottom: 12px; }
.v4-tick--br { right: 12px; bottom: 12px; }

.v4-case-n {
  position: absolute; top: 26px; left: 30px; z-index: 3;
  font-size: 11px; font-weight: 600; letter-spacing: .18em; text-transform: uppercase;
  color: var(--case-ink); opacity: calc(.3 + .7 * var(--case-reveal));
}
.v4-case-inner {
  height: 100%; display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  padding: clamp(44px, 7vh, 80px) clamp(18px, 4vw, 56px) 0;
  text-align: center;
}
.v4-case-head { max-width: 900px; }
.v4-case-client {
  font-size: 11px; font-weight: 600; letter-spacing: .18em; text-transform: uppercase;
  color: var(--case-ink); margin-bottom: 14px; opacity: var(--case-reveal);
  transition: opacity .2s linear;
}
.v4-case-title {
  font-weight: 800; text-transform: uppercase;
  font-size: clamp(34px, 6vw, 88px); line-height: .94; letter-spacing: -0.035em;
  margin-bottom: 18px;
}
.v4-lm { display: block; overflow: hidden; }
.v4-lm-in { display: block; transform: translateY(calc((1 - var(--case-reveal)) * 112%)); }
.v4-case-blurb {
  font-size: clamp(14px, 1.15vw, 17px); line-height: 1.6; max-width: 58ch;
  margin: 0 auto 20px; opacity: calc(.72 * var(--case-reveal));
}
.v4-tags { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; opacity: var(--case-reveal); }
.v4-tag {
  font-size: 11px; font-weight: 600; letter-spacing: .12em;
  opacity: .5;
}

.v4-laptop-wrap {
  position: relative; display: flex; justify-content: center; width: 100%;
  margin-top: clamp(20px, 4vh, 46px);
  opacity: calc(.12 + .88 * var(--case-reveal));
  transform: translateY(calc((1 - var(--case-reveal)) * 76px));
  /* perspective lives on the parent so the whole device rotates as one solid,
     rather than the lid pivoting on its own */
  perspective: 1500px;
  perspective-origin: 50% 42%;
}
.v4-inkglow {
  position: absolute; left: 50%; top: 22%; width: 70%; height: 70%;
  transform: translateX(-50%); border-radius: 50%; pointer-events: none;
  background: radial-gradient(circle, var(--case-ink) 0%, transparent 66%);
  opacity: calc(.16 * var(--case-reveal)); filter: blur(60px);
}

/* ── laptop mockup ──────────────────────────────────────────────────────── */
/* sized so head + device clear the frame height on a ~900px viewport */
/* swings in from a three-quarter angle and settles square to camera */
.v4-laptop {
  width: min(58vw, 720px);
  transform-style: preserve-3d;
  transform-origin: 50% 65%;
  transform:
    translateZ(calc((1 - var(--case-reveal)) * -260px))
    rotateX(calc((1 - var(--case-reveal)) * 20deg))
    rotateY(calc((1 - var(--case-reveal)) * -26deg))
    rotateZ(calc((1 - var(--case-reveal)) * 3deg));
}
.v4-laptop-lid {
  position: relative; background: #17181C;
  border-radius: 14px 14px 5px 5px; padding: 11px 11px 13px;
  box-shadow: 0 30px 70px rgba(0,0,0,.30), inset 0 1px 0 rgba(255,255,255,.07);
}
.v4-laptop-lid::before {
  content: ""; position: absolute; left: 50%; top: 4px;
  width: 5px; height: 5px; border-radius: 50%; background: #2C2E35;
  transform: translateX(-50%);
}
/* aspect-ratio is set per case from the capture's own dimensions, so the shot
   fills the lid exactly — no crop, no bars, nothing to colour-match */
.v4-laptop-screen {
  position: relative; border-radius: 6px; overflow: hidden;
}
.v4-laptop-base {
  position: relative; height: 13px; width: 110%; margin-left: -5%;
  background: linear-gradient(180deg, #D2D5DC, #9BA0AB);
  border-radius: 0 0 10px 10px;
  clip-path: polygon(0.8% 0, 99.2% 0, 96.5% 100%, 3.5% 100%);
  box-shadow: 0 18px 30px rgba(0,0,0,.22);
}
.v4-laptop-base::after {
  content: ""; position: absolute; left: 50%; top: 0;
  width: 13%; height: 4px; transform: translateX(-50%);
  background: #868B96; border-radius: 0 0 5px 5px;
}

/* ── contact ────────────────────────────────────────────────────────────── */
.v4-contact { text-align: center; padding: clamp(80px, 14vh, 170px) 20px clamp(50px, 8vh, 90px); }
.v4-contact h2 {
  font-weight: 800; font-size: clamp(44px, 9vw, 138px);
  letter-spacing: -0.035em; line-height: .9; margin-bottom: 30px;
}
.v4-contact h2 em { font-style: normal; color: #0E7490; }
.v4-email {
  font-size: clamp(19px, 2.3vw, 33px);
  border-bottom: 1px solid currentColor; padding-bottom: 4px; opacity: .85;
  transition: opacity .2s, color .2s;
}
.v4-email:hover { opacity: 1; color: #0E7490; }
.v4-clinks {
  margin-top: 34px; display: flex; gap: 22px; justify-content: center; flex-wrap: wrap;
  font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: .08em; opacity: .55;
}
.v4-clinks a:hover { opacity: 1; text-decoration: underline; }
.v4-foot {
  display: flex; justify-content: space-between; flex-wrap: wrap; gap: 8px 24px;
  padding: 20px clamp(20px, 4vw, 56px); font-size: 11px; opacity: .45;
  border-top: 1px solid color-mix(in srgb, rgba(12,14,20,.14) calc(var(--v4-t) * 100%), rgba(255,255,255,.08));
}

@media (max-width: 900px) {
  /* the full name wraps to two lines and shoves the nav around */
  .v4-brand-full { display: none; }
  .v4-brand-short { display: inline; letter-spacing: 0.04em; }
  .v4-then { grid-template-columns: 1fr !important; }
  .v4-laptop { width: 90vw; }
  .v4-case { margin-bottom: 10vh; }
  .v4-case-inner { padding-top: 54px; }
}

@media (prefers-reduced-motion: reduce) {
  .v4-aurora i { animation: none; }
  .v4-ripple { display: none; }
}
`;

export default function V4Page({ displayFont }: { displayFont: string }) {
  const progRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const bar = progRef.current;
    if (!bar) return;
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self) => {
          bar.style.width = `${(self.progress * 100).toFixed(2)}%`;
        },
      });
    });
    // Layout settles after fonts/images land; keep triggers honest.
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 400);
    return () => {
      window.clearTimeout(id);
      ctx.revert();
    };
  }, []);

  return (
    <div className="v4-root" style={{ fontFamily: "var(--font-geist-sans)" }}>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <div ref={progRef} className="v4-prog" aria-hidden />

      <nav className="v4-nav">
        <span className="v4-brand" style={{ fontFamily: displayFont }}>
          <span className="v4-brand-full">Abdulrhman El-Daly</span>
          <span className="v4-brand-short">EL-DALY</span>
        </span>
        <div className="v4-navlinks">
          <a href="#v3-about">About</a>
          <a href="#v3-skills">Skills</a>
          <a href="#v4-work">Work</a>
          <a href="mailto:abdulrhman.eldaly@gmail.com">Contact</a>
          <a href="/cv.pdf" target="_blank" rel="noopener">
            CV
          </a>
        </div>
      </nav>

      <V4Hero displayFont={displayFont} />
      <V4ThenNow displayFont={displayFont} />

      {/* About is rendered inside V4ThenNow — the paper has to be able to reach
          its portrait, so it lives under the same sticky canvas. */}
      <V4Stats displayFont={displayFont} />
      <V3SkillTree p={PALETTE_LIGHT} />
      <V3Experience p={PALETTE_LIGHT} />

      <V4Projects displayFont={displayFont} />

      <V3FistBumpExact p={PALETTE_LIGHT} />

      <section className="v4-contact">
        {/* the fist-bump section right above already delivers "let's build
            together" — this must not echo it */}
        <h2 style={{ fontFamily: displayFont }}>
          Say <em>hello.</em>
        </h2>
        <a className="v4-email" href="mailto:abdulrhman.eldaly@gmail.com">
          abdulrhman.eldaly@gmail.com
        </a>
        <div className="v4-clinks">
          <a href="https://www.linkedin.com/in/abdulrhman-eldaly/" target="_blank" rel="noopener">
            LinkedIn
          </a>
          <a href="https://github.com/abdulrhmaneldaly" target="_blank" rel="noopener">
            GitHub
          </a>
          <a href="/cv.pdf" target="_blank" rel="noopener">
            Résumé
          </a>
        </div>
      </section>

      <footer className="v4-foot">
        <span>© {new Date().getFullYear()} Abdulrhman El-Daly</span>
      </footer>
    </div>
  );
}
