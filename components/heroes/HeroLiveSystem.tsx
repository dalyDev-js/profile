"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  HeroShell,
  LiveDot,
  META,
  Mono,
  T,
  useClock,
  useResponsive,
} from "./heroShared";

// ──────────────────────────────────────────────────────────────────────────────
//  VARIANT B — "Live System"
//  The hero boots. A console types a real session on the left while live
//  telemetry ticks on the right, over a giant outlined name watermark.
// ──────────────────────────────────────────────────────────────────────────────

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

type LineKind = "cmd" | "out" | "dim" | "ok" | "gap";
interface Line {
  kind: LineKind;
  text: string;
}

const SESSION: Line[] = [
  { kind: "cmd", text: "whoami" },
  { kind: "out", text: "abdulrhman.el-daly — senior frontend / full-stack engineer" },
  { kind: "gap", text: "" },
  { kind: "cmd", text: "cat ./stack.json" },
  { kind: "dim", text: "{" },
  { kind: "out", text: '  "frontend": ["React", "Next.js", "TypeScript"],' },
  { kind: "out", text: '  "backend":  ["Spring Boot", "NestJS", "Node"],' },
  { kind: "out", text: '  "data":     ["PostgreSQL", "Redis", "MongoDB"]' },
  { kind: "dim", text: "}" },
  { kind: "gap", text: "" },
  { kind: "cmd", text: "ls ./work --recent" },
  { kind: "out", text: "callstack/   rakam/   wildlife/   qomra/   hemmah/" },
  { kind: "gap", text: "" },
  { kind: "gap", text: "" },
  { kind: "cmd", text: "uptime --career" },
  { kind: "out", text: "5 yrs 2 mo · 20+ products live · 4 teams mentored" },
  { kind: "gap", text: "" },
  { kind: "cmd", text: "./status --availability" },
  { kind: "ok", text: "● OPEN — taking senior frontend & full-stack engagements" },
];

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const on = () => setReduced(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return reduced;
}

/** Types the session one character at a time; commands slower than output. */
function useBootSequence(lines: Line[], skip: boolean) {
  const [index, setIndex] = useState(0);
  const [chars, setChars] = useState(0);

  useEffect(() => {
    if (skip) {
      setIndex(lines.length);
      return;
    }
    if (index >= lines.length) return;
    const line = lines[index];
    if (chars < line.text.length) {
      const speed = line.kind === "cmd" ? 32 : 7;
      const id = setTimeout(() => setChars((c) => c + 1), speed);
      return () => clearTimeout(id);
    }
    const pause = line.kind === "cmd" ? 340 : line.kind === "gap" ? 60 : 90;
    const id = setTimeout(() => {
      setIndex((i) => i + 1);
      setChars(0);
    }, pause);
    return () => clearTimeout(id);
  }, [index, chars, lines, skip]);

  return { index, chars, done: index >= lines.length };
}

const LINE_COLOR: Record<LineKind, string> = {
  cmd: T.fg,
  out: `${T.fg}C8`,
  dim: T.muted,
  ok: "#34D399",
  gap: "transparent",
};

function TelemetryCard({
  label,
  value,
  accent = T.fg,
  children,
}: {
  label: string;
  value?: string;
  accent?: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      style={{
        border: `1px solid ${T.br}`,
        background: `${T.s1}AA`,
        borderRadius: 3,
        padding: "0.9rem 1rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
      }}>
      <Mono size="0.53rem" track="0.18em">
        {label}
      </Mono>
      {value && (
        <span
          style={{
            fontFamily: "var(--h-jb)",
            fontSize: "0.95rem",
            fontWeight: 500,
            color: accent,
            fontVariantNumeric: "tabular-nums",
            letterSpacing: "0.02em",
          }}>
          {value}
        </span>
      )}
      {children}
    </div>
  );
}

export default function HeroLiveSystem() {
  const { isMobile, isTablet } = useResponsive();
  const reduced = usePrefersReducedMotion();
  const clock = useClock(META.tz);
  const stacked = isMobile || isTablet;

  // Stacked layout already runs long; drop the directory listing there. Memoised
  // because the ticking clock re-renders every second and a fresh array would
  // restart the typing effect's pending timeout each time.
  const session = useMemo(
    () =>
      isMobile
        ? SESSION.filter(
            (l) => !l.text.startsWith("ls ./work") && !l.text.startsWith("callstack/")
          )
        : SESSION,
    [isMobile]
  );
  const { index, chars, done } = useBootSequence(session, reduced);

  return (
    <HeroShell>
      <section
        style={{
          position: "relative",
          minHeight: "100svh",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          padding: isMobile
            ? "3.2rem 1.25rem 4rem"
            : "clamp(2rem, 3.5vh, 3rem) clamp(1.75rem, 3vw, 3.5rem) 5rem",
          background: T.bg,
        }}>
        {/* Grid + scanline atmosphere */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `linear-gradient(${T.br}26 1px, transparent 1px), linear-gradient(90deg, ${T.br}26 1px, transparent 1px)`,
            backgroundSize: "64px 64px",
            maskImage:
              "radial-gradient(ellipse 100% 80% at 50% 30%, #000 0%, transparent 100%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 100% 80% at 50% 30%, #000 0%, transparent 100%)",
            pointerEvents: "none",
          }}
        />
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "repeating-linear-gradient(to bottom, rgba(255,255,255,.022) 0px, rgba(255,255,255,.022) 1px, transparent 1px, transparent 3px)",
            pointerEvents: "none",
          }}
        />

        {/* ── Top status strip ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          style={{
            position: "relative",
            zIndex: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "0.8rem",
            paddingBottom: "0.8rem",
            borderBottom: `1px solid ${T.br}`,
          }}>
          <Mono color={T.pri} weight={500}>
            eldaly.me / system
          </Mono>
          <div style={{ display: "flex", alignItems: "center", gap: "1.3rem" }}>
            <Mono>{META.location}</Mono>
            <Mono style={{ fontVariantNumeric: "tabular-nums", minWidth: "5.4em" }}>
              {clock || "--:--:--"}
            </Mono>
            <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <LiveDot />
              <Mono color="#34D399">{done ? "Ready" : "Booting"}</Mono>
            </span>
          </div>
        </motion.div>

        {/* ── Masthead ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.8, ease: EASE }}
          style={{
            position: "relative",
            zIndex: 2,
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1rem",
            padding: isMobile ? "1.6rem 0 0" : "1.5rem 0 0",
          }}>
          <h1
            style={{
              fontFamily: "var(--h-sg)",
              fontSize: isMobile
                ? "clamp(34px, 10vw, 52px)"
                : "clamp(46px, 5.4vw, 84px)",
              fontWeight: 700,
              lineHeight: 0.92,
              letterSpacing: "-0.045em",
            }}>
            Abdulrhman <span style={{ color: T.pri }}>El-Daly</span>
          </h1>
          {!isMobile && (
            <p
              style={{
                maxWidth: "40ch",
                fontSize: "0.9rem",
                lineHeight: 1.6,
                color: `${T.fg}96`,
                paddingBottom: "0.35rem",
              }}>
              {META.bio}
            </p>
          )}
        </motion.div>

        {/* ── Main grid ── */}
        <div
          style={{
            position: "relative",
            zIndex: 2,
            flex: 1,
            display: "grid",
            gridTemplateColumns: stacked ? "1fr" : "1.35fr 1fr",
            gap: stacked ? "1.5rem" : "2rem",
            alignItems: "stretch",
            paddingTop: "1.6rem",
            minHeight: 0,
          }}>
          {/* Console */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
            style={{
              border: `1px solid ${T.br}`,
              borderRadius: 4,
              background: "rgba(9,12,20,.82)",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              minHeight: stacked ? "50svh" : 0,
              boxShadow: "0 30px 80px rgba(0,0,0,.5)",
            }}>
            {/* Window chrome */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.6rem",
                padding: "0.65rem 0.9rem",
                borderBottom: `1px solid ${T.br}`,
                background: `${T.s1}99`,
              }}>
              {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
                <span
                  key={c}
                  style={{
                    width: 9,
                    height: 9,
                    borderRadius: "50%",
                    background: c,
                    opacity: 0.85,
                  }}
                />
              ))}
              <Mono size="0.55rem" track="0.12em" style={{ marginLeft: "0.5rem" }}>
                abdulrhman@portfolio — zsh
              </Mono>
            </div>

            {/* Session body */}
            <div
              style={{
                flex: 1,
                padding: isMobile ? "1rem" : "1.35rem 1.5rem",
                fontFamily: "var(--h-jb), monospace",
                fontSize: isMobile ? "0.68rem" : "0.78rem",
                lineHeight: 1.85,
                overflow: "hidden",
              }}>
              {session.map((line, i) => {
                if (i > index) return null;
                const text = i === index ? line.text.slice(0, chars) : line.text;
                if (line.kind === "gap")
                  return <div key={i} style={{ height: "0.6em" }} />;
                return (
                  <div
                    key={i}
                    style={{
                      color: LINE_COLOR[line.kind],
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-word",
                    }}>
                    {line.kind === "cmd" && (
                      <span style={{ color: T.pri, marginRight: "0.6em" }}>❯</span>
                    )}
                    {text}
                    {i === index && (
                      <span
                        style={{
                          display: "inline-block",
                          width: "0.55em",
                          height: "1em",
                          background: T.pri,
                          marginLeft: "2px",
                          verticalAlign: "-0.15em",
                          animation: "heroCaret 1s step-end infinite",
                        }}
                      />
                    )}
                  </div>
                );
              })}
              {done && (
                <div style={{ color: T.fg }}>
                  <span style={{ color: T.pri, marginRight: "0.6em" }}>❯</span>
                  <span
                    style={{
                      display: "inline-block",
                      width: "0.55em",
                      height: "1em",
                      background: T.pri,
                      verticalAlign: "-0.15em",
                      animation: "heroCaret 1s step-end infinite",
                    }}
                  />
                </div>
              )}
            </div>
          </motion.div>

          {/* Telemetry column */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12, duration: 0.7, ease: EASE }}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.85rem",
              minHeight: 0,
            }}>
            {/* Portrait feed */}
            <div
              style={{
                position: "relative",
                flex: stacked ? "none" : 1,
                minHeight: stacked ? 240 : 160,
                border: `1px solid ${T.br}`,
                borderRadius: 3,
                background: `${T.s1}AA`,
                overflow: "hidden",
              }}>
              <div
                aria-hidden
                style={{
                  position: "absolute",
                  inset: 0,
                  background: `radial-gradient(circle at 50% 55%, rgba(${T.priRgb},.18) 0%, transparent 68%)`,
                }}
              />
              <Image
                src="/v3-hero.png"
                alt="Illustrated portrait of Abdulrhman El-Daly, seated with a coffee"
                fill
                priority
                sizes="(max-width: 1100px) 90vw, 34vw"
                style={{
                  objectFit: "contain",
                  objectPosition: "bottom center",
                  padding: "1.2rem 1.2rem 0",
                  filter:
                    "drop-shadow(0 0 1px rgba(241,245,249,.9)) drop-shadow(0 0 4px rgba(241,245,249,.45))",
                }}
              />
              <div
                aria-hidden
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundImage:
                    "repeating-linear-gradient(to bottom, rgba(34,211,238,.05) 0px, rgba(34,211,238,.05) 1px, transparent 1px, transparent 4px)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  top: "0.7rem",
                  left: "0.85rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.45rem",
                }}>
                <LiveDot color="#FF5F57" />
                <Mono size="0.5rem" track="0.2em">
                  Feed 01
                </Mono>
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr 1fr" : "1fr 1fr",
                gap: "0.85rem",
              }}>
              <TelemetryCard label="Shipping since" value="2021" />
              <TelemetryCard label="Products live" value="20+" accent={T.pri} />
            </div>
            <TelemetryCard label="Current focus">
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                {["Design systems", "Web performance", "DX", "Mentoring"].map((f) => (
                  <span
                    key={f}
                    style={{
                      fontFamily: "var(--h-jb)",
                      fontSize: "0.58rem",
                      letterSpacing: "0.06em",
                      color: `${T.fg}CC`,
                      border: `1px solid ${T.br}`,
                      borderRadius: 2,
                      padding: "0.24rem 0.55rem",
                    }}>
                    {f}
                  </span>
                ))}
              </div>
            </TelemetryCard>
          </motion.div>
        </div>

        {/* ── Actions ── */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.7, ease: EASE }}
          style={{
            position: "relative",
            zIndex: 2,
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1.4rem",
            marginTop: "1.6rem",
            paddingTop: "1.2rem",
            borderTop: `1px solid ${T.br}`,
          }}>
          <a
            href="#v3-projects"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.7rem",
              padding: "0.9rem 1.7rem",
              background: T.pri,
              color: T.bg,
              textDecoration: "none",
              borderRadius: 2,
              fontFamily: "var(--h-jb)",
              fontSize: "0.63rem",
              fontWeight: 700,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
            }}>
            Selected Work <span aria-hidden>→</span>
          </a>
          <a
            href={META.links.cv}
            download="Abdulrhman-ElDaly-CV.pdf"
            style={{
              fontFamily: "var(--h-jb)",
              fontSize: "0.63rem",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: T.muted,
              textDecoration: "none",
              borderBottom: `1px solid ${T.br}`,
              paddingBottom: 3,
            }}>
            Résumé ↓
          </a>
        </motion.div>
      </section>
    </HeroShell>
  );
}
