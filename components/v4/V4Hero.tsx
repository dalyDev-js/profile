"use client";

import { useEffect, useRef } from "react";
import { NAV_H, V4 } from "./theme";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  tx: number;
  ty: number;
  c: string;
  s: number;
};

const NAME = "EL-DALY";

/**
 * Interactive particle name field.
 *
 * The name is painted to an offscreen canvas, sampled on a grid, and every
 * opaque pixel becomes a spring target. Particles start scattered and pull
 * home; the pointer pushes them back out. The visible name is *only* canvas —
 * the real <h1> is present but visually hidden so the name still exists for
 * screen readers and crawlers.
 */
export default function V4Hero({ displayFont }: { displayFont: string }) {
  const heroRef = useRef<HTMLElement | null>(null);
  const cvRef = useRef<HTMLCanvasElement | null>(null);
  const fxRef = useRef<HTMLDivElement | null>(null);
  const glowRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const hero = heroRef.current;
    const canvas = cvRef.current;
    if (!hero || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const FAM = `${displayFont}, "Arial Black", Impact, sans-serif`;

    let W = 0;
    let H = 0;
    let raf = 0;
    let running = false;
    let parts: Particle[] = [];
    const mouse = { x: -9999, y: -9999, down: false };

    // One line, so it can run much larger than the two-line version — cap on
    // height, then shrink only if it would overrun the width.
    const fitFontSize = (o: CanvasRenderingContext2D) => {
      let fs = Math.min(H * 0.46, 300);
      o.font = `900 ${fs}px ${FAM}`;
      const maxW = W * 0.88;
      const w = o.measureText(NAME).width;
      if (w > maxW) fs = Math.floor(fs * (maxW / w));
      return fs;
    };

    const paintText = (o: CanvasRenderingContext2D, color: string) => {
      o.clearRect(0, 0, W, H);
      o.fillStyle = color;
      o.textAlign = "center";
      o.textBaseline = "middle";
      const fs = fitFontSize(o);
      o.font = `900 ${fs}px ${FAM}`;
      o.fillText(NAME, W / 2, H / 2);
    };

    const build = () => {
      const off = document.createElement("canvas");
      off.width = W;
      off.height = H;
      const o = off.getContext("2d", { willReadFrequently: true });
      if (!o) return;
      paintText(o, "#fff");

      const mob = window.matchMedia("(max-width: 760px)").matches;
      // Denser than the reference — cyan doesn't carry as far on black as its
      // lime does, so the name needs more coverage to read as solid.
      const gap = Math.max(mob ? 4 : 3, Math.round(W / (mob ? 240 : 380)));
      const d = o.getImageData(0, 0, W, H).data;
      const targets: [number, number][] = [];
      for (let y = 0; y < H; y += gap) {
        for (let x = 0; x < W; x += gap) {
          if (d[(y * W + x) * 4 + 3] > 128) targets.push([x, y]);
        }
      }

      if (parts.length > targets.length) parts.length = targets.length;
      for (let i = 0; i < targets.length; i++) {
        if (!parts[i]) {
          parts[i] = {
            x: Math.random() * W,
            y: Math.random() * H,
            vx: 0,
            vy: 0,
            tx: 0,
            ty: 0,
            // Violet keeps the reference's 14% accent share; the rest leans on
            // a lighter cyan so the name reads bright rather than submerged.
            c: (() => {
              const r = Math.random();
              if (r < 0.14) return V4.violet;
              if (r < 0.4) return V4.cyan;
              return "#67E8F9";
            })(),
            s: mob ? Math.random() * 1.6 + 2.1 : Math.random() * 1.3 + 1.1,
          };
        }
        parts[i].tx = targets[i][0];
        parts[i].ty = targets[i][1];
      }
    };

    const size = () => {
      W = hero.clientWidth;
      H = hero.clientHeight;
      if (!W || !H) return;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      build();
    };

    const drawStatic = () => {
      size();
      if (!W) return;
      paintText(ctx, V4.cyan);
    };

    const frame = () => {
      if (!running) return;
      // Skip the whole loop once the hero has scrolled past.
      if (hero.getBoundingClientRect().bottom > 0) {
        ctx.clearRect(0, 0, W, H);
        const R = mouse.down ? 150 : 105;
        const F = mouse.down ? 7 : 3.4;
        for (let i = 0; i < parts.length; i++) {
          const p = parts[i];
          let ax = (p.tx - p.x) * 0.02;
          let ay = (p.ty - p.y) * 0.02;
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < R * R) {
            const dd = Math.sqrt(d2) || 1;
            const f = ((R - dd) / R) * F;
            ax += (dx / dd) * f;
            ay += (dy / dd) * f;
          }
          p.vx = (p.vx + ax) * 0.86;
          p.vy = (p.vy + ay) * 0.86;
          p.x += p.vx;
          p.y += p.vy;
          ctx.fillStyle = p.c;
          ctx.fillRect(p.x, p.y, p.s, p.s);
        }
      }
      raf = requestAnimationFrame(frame);
    };

    const onMove = (e: PointerEvent) => {
      const r = hero.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
      const g = glowRef.current;
      if (g) {
        g.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
        g.style.opacity = "1";
      }
    };
    const onLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
      if (glowRef.current) glowRef.current.style.opacity = "0";
    };
    const onDown = (e: PointerEvent) => {
      mouse.down = true;
      const fx = fxRef.current;
      if (!fx || reduce) return;
      const r = hero.getBoundingClientRect();
      for (const cls of ["v4-ripple", "v4-ripple v4-ripple--2"]) {
        const el = document.createElement("i");
        el.className = cls;
        el.style.left = `${e.clientX - r.left}px`;
        el.style.top = `${e.clientY - r.top}px`;
        fx.appendChild(el);
        window.setTimeout(() => el.remove(), 2800);
      }
    };
    // Touch has no pointerleave — clear the point so particles fall back home.
    const onUp = (e: PointerEvent) => {
      mouse.down = false;
      if (e.pointerType !== "mouse") {
        mouse.x = -9999;
        mouse.y = -9999;
      }
    };
    const onResize = () => {
      if (running) size();
      else if (reduce) drawStatic();
    };

    hero.addEventListener("pointermove", onMove, { passive: true });
    hero.addEventListener("pointerleave", onLeave);
    hero.addEventListener("pointerdown", onDown);
    hero.addEventListener("pointercancel", onUp);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("resize", onResize);

    if (reduce) {
      drawStatic();
    } else {
      running = true;
      size();
      // Web font may land after first paint — re-measure when it does.
      if (document.fonts?.ready) {
        document.fonts.ready.then(() => {
          if (running) size();
        });
      }
      raf = requestAnimationFrame(frame);
    }

    return () => {
      running = false;
      if (raf) cancelAnimationFrame(raf);
      hero.removeEventListener("pointermove", onMove);
      hero.removeEventListener("pointerleave", onLeave);
      hero.removeEventListener("pointerdown", onDown);
      hero.removeEventListener("pointercancel", onUp);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("resize", onResize);
      parts = [];
    };
  }, [displayFont]);

  return (
    <section
      ref={heroRef}
      className="v4-hero"
      style={{
        position: "relative",
        // the sticky nav sits above this, so subtract it or the cues fall
        // below the fold
        height: `calc(100vh - ${NAV_H}px)`,
        minHeight: 560,
        overflow: "hidden",
        borderBottom: `1px solid ${V4.darkBr}`,
      }}
    >
      {/* drifting aurora — the only colour in the black */}
      <div className="v4-aurora" aria-hidden>
        <i />
        <i />
        <i />
      </div>

      {/* tight bloom behind the name so the particles sit in light */}
      <div className="v4-herobloom" aria-hidden />

      <canvas
        ref={cvRef}
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          display: "block",
          zIndex: 1,
        }}
      />

      <div ref={glowRef} className="v4-cursorglow" aria-hidden />
      <div ref={fxRef} className="v4-fx" aria-hidden />

      {/* real heading, visually hidden — the canvas is the performance */}
      <h1 className="v4-sr">Abdulrhman El-Daly</h1>

      <div
        style={{
          position: "absolute",
          top: 26,
          left: "clamp(20px, 4vw, 56px)",
          zIndex: 2,
          fontSize: 12,
          fontWeight: 600,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "#9A9A9F",
        }}
      >
        Senior Frontend Developer · Full-Stack Engineer · 2026
      </div>
    </section>
  );
}
