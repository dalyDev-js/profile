"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";

// ──────────────────────────────────────────────────────────────────────────────
//  Shared shell + tokens for the hero exploration routes (/hero/*)
// ──────────────────────────────────────────────────────────────────────────────

export const sg = Space_Grotesk({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--h-sg",
});

export const jb = JetBrains_Mono({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  variable: "--h-jb",
});

/** Tokens mirror PALETTE_ORANGE from V3Page, plus paper tones for the ink plate. */
export const T = {
  bg: "#07090F",
  s1: "#0C1120",
  s2: "#0F1729",
  br: "#1E293B",
  pri: "#22D3EE",
  priRgb: "34,211,238",
  sec: "#A78BFA",
  fg: "#F1F5F9",
  muted: "#64748B",
  paper: "#EDE7DA",
  paperDeep: "#DED5C3",
  paperInk: "#1A1712",
};

export const META = {
  name: "Abdulrhman",
  surname: "El-Daly",
  roles: ["Senior Frontend", "Full-Stack Engineer", "Design Systems"],
  location: "Cairo, EG",
  tz: "Africa/Cairo",
  bio: "I build high-performance web products end to end — pixel-exact frontends on top of Spring Boot and NestJS services. Five years in, I mentor teams and lead the design systems they ship on.",
  stats: [
    { n: "5+", l: "Years shipping" },
    { n: "20+", l: "Products live" },
    { n: "12", l: "Stacks deep" },
  ],
  stack: ["React", "Next.js", "TypeScript", "Spring Boot", "NestJS", "PostgreSQL"],
  links: {
    github: "https://github.com/dalyDev-js",
    linkedin: "https://linkedin.com/in/abdulrhman-eldaly",
    cv: "/cv.pdf",
  },
};

export function useResponsive() {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const update = () => setWidth(window.innerWidth);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return {
    ready: width > 0,
    isMobile: width > 0 && width < 768,
    isTablet: width >= 768 && width < 1100,
  };
}

/** Normalised pointer position (-1..1) with a lazy follow, for parallax. */
export function usePointer(strength = 1) {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });
  const raf = useRef(0);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      target.current = {
        x: (e.clientX / window.innerWidth - 0.5) * 2 * strength,
        y: (e.clientY / window.innerHeight - 0.5) * 2 * strength,
      };
    };
    const tick = () => {
      setPos((prev) => ({
        x: prev.x + (target.current.x - prev.x) * 0.06,
        y: prev.y + (target.current.y - prev.y) * 0.06,
      }));
      raf.current = requestAnimationFrame(tick);
    };
    window.addEventListener("pointermove", onMove);
    raf.current = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf.current);
    };
  }, [strength]);

  return pos;
}

/** Live clock in a given IANA timezone. */
export function useClock(tz: string) {
  const [time, setTime] = useState("");
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
      timeZone: tz,
    });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [tz]);
  return time;
}

export const VARIANTS = [
  { href: "/hero/a", key: "A", label: "Ink Plate" },
  { href: "/hero/a-glow", key: "A2", label: "Ink Glow" },
  { href: "/hero/a-invert", key: "A3", label: "Ink Invert" },
  { href: "/hero/b", key: "B", label: "Live System" },
  { href: "/hero/c", key: "C", label: "Type Wall" },
];

function VariantBar() {
  const pathname = usePathname();
  return (
    <div
      style={{
        position: "fixed",
        bottom: "1.1rem",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 200,
        display: "flex",
        alignItems: "center",
        gap: "2px",
        padding: "4px",
        borderRadius: "999px",
        background: "rgba(7,9,15,.72)",
        border: `1px solid ${T.br}`,
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        fontFamily: "var(--h-jb), monospace",
        boxShadow: "0 8px 32px rgba(0,0,0,.55)",
        // Dev-only chrome: stays out of the way until you reach for it.
        opacity: 0.4,
        transition: "opacity .2s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
      onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.4")}>
      {VARIANTS.map((v) => {
        const active = pathname === v.href;
        return (
          <Link
            key={v.href}
            href={v.href}
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: "6px",
              padding: "6px 12px",
              borderRadius: "999px",
              textDecoration: "none",
              fontSize: "0.6rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              whiteSpace: "nowrap",
              color: active ? T.bg : T.muted,
              background: active ? T.pri : "transparent",
              transition: "color .18s, background .18s",
            }}>
            <span style={{ fontWeight: 700 }}>{v.key}</span>
            <span style={{ opacity: active ? 0.75 : 0.85 }}>{v.label}</span>
          </Link>
        );
      })}
    </div>
  );
}

/**
 * Page shell: applies the font variables, a local reset, hides the global
 * navbar (same trick V3Page uses) and pins the variant switcher.
 */
export function HeroShell({
  children,
  background = T.bg,
}: {
  children: React.ReactNode;
  background?: string;
}) {
  return (
    <div
      className={`${sg.variable} ${jb.variable}`}
      style={{
        background,
        color: T.fg,
        fontFamily: "var(--h-sg), system-ui, sans-serif",
        minHeight: "100vh",
        overflowX: "clip",
      }}>
      <style
        dangerouslySetInnerHTML={{
          __html: `
            nav { display: none !important; }
            .hero-scope * { box-sizing: border-box; margin: 0; padding: 0; }
            @keyframes heroPulse {
              0%,100% { opacity: 1; transform: scale(1); }
              50% { opacity: .35; transform: scale(.82); }
            }
            @keyframes heroCaret {
              0%,49% { opacity: 1; }
              50%,100% { opacity: 0; }
            }
            @media (prefers-reduced-motion: reduce) {
              .hero-scope *, .hero-scope *::before, .hero-scope *::after {
                animation-duration: .001ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: .001ms !important;
              }
            }
          `,
        }}
      />
      <div className="hero-scope">{children}</div>
      <VariantBar />
    </div>
  );
}

/** Hairline rule that draws itself out on mount. */
export function Rule({
  color = T.br,
  delay = 0,
  vertical = false,
}: {
  color?: string;
  delay?: number;
  vertical?: boolean;
}) {
  return (
    <div
      style={{
        background: color,
        ...(vertical
          ? { width: 1, alignSelf: "stretch" }
          : { height: 1, width: "100%" }),
        transformOrigin: vertical ? "top" : "left",
        animation: `heroRule .9s cubic-bezier(.22,1,.36,1) ${delay}s both`,
      }}>
      <style
        dangerouslySetInnerHTML={{
          __html: `@keyframes heroRule { from { transform: scale${
            vertical ? "Y" : "X"
          }(0); } to { transform: scale${vertical ? "Y" : "X"}(1); } }`,
        }}
      />
    </div>
  );
}

/** Small mono caption used throughout the variants. */
export function Mono({
  children,
  size = "0.6rem",
  color = T.muted,
  track = "0.18em",
  weight = 400,
  style,
}: {
  children: React.ReactNode;
  size?: string;
  color?: string;
  track?: string;
  weight?: number;
  style?: React.CSSProperties;
}) {
  return (
    <span
      style={{
        fontFamily: "var(--h-jb), monospace",
        fontSize: size,
        letterSpacing: track,
        textTransform: "uppercase",
        color,
        fontWeight: weight,
        ...style,
      }}>
      {children}
    </span>
  );
}

/** Pulsing availability dot. */
export function LiveDot({ color = "#34D399" }: { color?: string }) {
  return (
    <span
      style={{
        width: 6,
        height: 6,
        borderRadius: "50%",
        background: color,
        boxShadow: `0 0 10px ${color}`,
        display: "inline-block",
        animation: "heroPulse 2.4s ease-in-out infinite",
      }}
    />
  );
}
