"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  HeroShell,
  LiveDot,
  META,
  Mono,
  T,
  useClock,
  usePointer,
  useResponsive,
} from "./heroShared";

// ──────────────────────────────────────────────────────────────────────────────
//  VARIANT C — "Type Wall"
//  Vertical marquees of outlined skill type scroll behind a centred portrait.
//  The name sandwiches the artwork: one line behind it, one line in front.
// ──────────────────────────────────────────────────────────────────────────────

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const COLUMNS = [
  ["REACT", "NEXT.JS", "TYPESCRIPT", "GSAP", "WEBGL"],
  ["SPRING BOOT", "NESTJS", "NODE", "REDIS", "DOCKER"],
  ["POSTGRES", "MONGODB", "PRISMA", "GRAPHQL", "REST"],
  ["DESIGN SYSTEMS", "ACCESSIBILITY", "MOTION", "TOKENS", "FIGMA"],
  ["PERFORMANCE", "TESTING", "CI/CD", "MENTORING", "DX"],
];

function VerticalMarquee({
  words,
  seconds,
  reverse,
  offset,
}: {
  words: string[];
  seconds: number;
  reverse: boolean;
  offset: number;
}) {
  const doubled = [...words, ...words, ...words];
  return (
    <div
      style={{
        flex: 1,
        minWidth: 0,
        overflow: "hidden",
        borderLeft: `1px solid ${T.br}40`,
        transform: `translateY(${offset}px)`,
        willChange: "transform",
      }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          animation: `heroScrollY ${seconds}s linear infinite`,
          animationDirection: reverse ? "reverse" : "normal",
        }}>
        {doubled.map((w, i) => (
          <span
            key={`${w}-${i}`}
            style={{
              fontFamily: "var(--h-sg)",
              fontSize: "clamp(24px, 3vw, 50px)",
              fontWeight: 700,
              lineHeight: 1.5,
              letterSpacing: "-0.02em",
              color: "transparent",
              WebkitTextStroke: `1px ${T.br}`,
              whiteSpace: "nowrap",
              textAlign: "center",
              padding: "0 0.4rem",
            }}>
            {w}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function HeroTypeWall() {
  const { isMobile, ready } = useResponsive();
  const clock = useClock(META.tz);
  const pt = usePointer(1);

  // "ABDULRHMAN" is 10 characters on one nowrap line — mobile has to stay well
  // under 12vw or the masthead runs off the edge.
  const nameSize = isMobile
    ? "clamp(30px, 10.5vw, 60px)"
    : "clamp(84px, 13.5vw, 208px)";

  return (
    <HeroShell>
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes heroScrollY { from { transform: translateY(0); } to { transform: translateY(-33.3333%); } }
            @keyframes heroScrollX { from { transform: translateX(0); } to { transform: translateX(-50%); } }
          `,
        }}
      />
      <section
        style={{
          position: "relative",
          minHeight: "100svh",
          overflow: "hidden",
          background: T.bg,
          display: "flex",
          flexDirection: "column",
        }}>
        {/* ── Type wall backdrop ── */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: "-8% -2%",
            display: "flex",
            opacity: 0.32,
            maskImage:
              "radial-gradient(ellipse 82% 74% at 50% 52%, transparent 12%, #000 88%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 82% 74% at 50% 52%, transparent 12%, #000 88%)",
            pointerEvents: "none",
          }}>
          {COLUMNS.map((words, i) => (
            <VerticalMarquee
              key={i}
              words={words}
              seconds={46 + i * 9}
              reverse={i % 2 === 1}
              offset={ready ? pt.y * (i % 2 === 1 ? 14 : -14) : 0}
            />
          ))}
        </div>

        {/* Centre bloom so the portrait has light behind it */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            left: "50%",
            top: "54%",
            width: "min(70vw, 780px)",
            aspectRatio: "1",
            transform: "translate(-50%,-50%)",
            borderRadius: "50%",
            background: `radial-gradient(circle, rgba(${T.priRgb},.16) 0%, rgba(167,139,250,.07) 38%, transparent 68%)`,
            pointerEvents: "none",
          }}
        />

        {/* ── Top meta strip ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          style={{
            position: "relative",
            zIndex: 6,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "0.8rem",
            padding: isMobile
              ? "5.2rem 1.25rem 0"
              : "clamp(1.6rem, 3vh, 2.4rem) clamp(1.75rem, 3vw, 3.5rem) 0",
          }}>
          <Mono color={`${T.fg}CC`} weight={500}>
            Senior Frontend · Full-Stack
          </Mono>
          <div style={{ display: "flex", alignItems: "center", gap: "1.3rem" }}>
            <Mono>{META.location}</Mono>
            <Mono style={{ fontVariantNumeric: "tabular-nums", minWidth: "5.4em" }}>
              {clock || "--:--:--"}
            </Mono>
            <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <LiveDot />
              <Mono color="#34D399">Open to work</Mono>
            </span>
          </div>
        </motion.div>

        {/* ── Stage: name behind / portrait / name in front ── */}
        <div
          style={{
            position: "relative",
            flex: 1,
            width: "min(1180px, 94vw)",
            margin: "0 auto",
            minHeight: isMobile ? "58svh" : "62svh",
          }}>
          {/* Line 1 — behind the portrait */}
          <div
            style={{
              position: "absolute",
              top: isMobile ? "4%" : "6%",
              left: 0,
              right: 0,
              textAlign: "center",
              zIndex: 1,
              overflow: "hidden",
            }}>
            <motion.h1
              initial={{ y: "104%" }}
              animate={{ y: "0%" }}
              transition={{ delay: 0.25, duration: 1.05, ease: EASE }}
              style={{
                fontFamily: "var(--h-sg)",
                fontSize: nameSize,
                fontWeight: 700,
                lineHeight: 0.9,
                letterSpacing: "-0.05em",
                color: T.fg,
                whiteSpace: "nowrap",
              }}>
              ABDULRHMAN
            </motion.h1>
          </div>

          {/* Portrait */}
          {/* Outer node owns the pointer parallax; inner motion node owns the
              scale-in, so the two never fight over `transform`. */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: "50%",
              width: isMobile ? "min(80vw, 360px)" : "min(58vh, 40vw, 520px)",
              height: isMobile ? "82%" : "92%",
              zIndex: 2,
              transform: ready
                ? `translate3d(calc(-50% + ${pt.x * -12}px), ${pt.y * -8}px, 0)`
                : "translateX(-50%)",
              willChange: "transform",
            }}>
            <motion.div
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.45, duration: 1.2, ease: EASE }}
              style={{ position: "absolute", inset: 0 }}>
              <Image
                src="/v3-hero.png"
                alt="Illustrated portrait of Abdulrhman El-Daly, seated with a coffee"
                fill
                priority
                sizes="(max-width: 768px) 78vw, 34vw"
                style={{
                  objectFit: "contain",
                  objectPosition: "bottom center",
                  filter:
                    "drop-shadow(0 0 1px rgba(241,245,249,.95)) drop-shadow(0 0 5px rgba(241,245,249,.5)) drop-shadow(0 30px 70px rgba(0,0,0,.7))",
                }}
              />
            </motion.div>
          </div>

          {/* Line 2 — in front of the portrait */}
          <div
            style={{
              position: "absolute",
              bottom: isMobile ? "-1%" : "-2%",
              left: 0,
              right: 0,
              textAlign: "center",
              zIndex: 3,
              overflow: "hidden",
              pointerEvents: "none",
            }}>
            <motion.h1
              initial={{ y: "104%" }}
              animate={{ y: "0%" }}
              transition={{ delay: 0.38, duration: 1.05, ease: EASE }}
              style={{
                fontFamily: "var(--h-sg)",
                fontSize: nameSize,
                fontWeight: 700,
                lineHeight: 0.9,
                letterSpacing: "-0.05em",
                color: T.pri,
                whiteSpace: "nowrap",
                textShadow: `0 0 60px rgba(${T.priRgb},.35)`,
              }}>
              EL-DALY
            </motion.h1>
          </div>
        </div>

        {/* ── Bottom: role marquee + actions ── */}
        <div style={{ position: "relative", zIndex: 6 }}>
          <div
            style={{
              borderTop: `1px solid ${T.br}`,
              borderBottom: `1px solid ${T.br}`,
              overflow: "hidden",
              padding: "0.55rem 0",
              background: `${T.bg}D9`,
            }}>
            <div
              style={{
                display: "flex",
                width: "max-content",
                animation: "heroScrollX 38s linear infinite",
              }}>
              {[0, 1].map((dup) => (
                <div key={dup} style={{ display: "flex" }}>
                  {[
                    "5+ YEARS SHIPPING",
                    "20+ PRODUCTS LIVE",
                    "DESIGN SYSTEMS",
                    "WEB PERFORMANCE",
                    "MENTORING TEAMS",
                    "FULL-STACK",
                  ].map((w) => (
                    <span
                      key={`${dup}-${w}`}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "1.6rem",
                        paddingRight: "1.6rem",
                        fontFamily: "var(--h-jb)",
                        fontSize: "0.6rem",
                        letterSpacing: "0.22em",
                        color: `${T.fg}66`,
                        whiteSpace: "nowrap",
                      }}>
                      {w}
                      <span style={{ color: `${T.pri}88` }}>◆</span>
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.7, ease: EASE }}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "1.2rem",
              padding: isMobile
                ? "1.1rem 1.25rem 5rem"
                : "1.2rem clamp(1.75rem, 3vw, 3.5rem) 5rem",
            }}>
            <p
              style={{
                maxWidth: "42ch",
                fontSize: isMobile ? "0.84rem" : "0.94rem",
                lineHeight: 1.6,
                color: `${T.fg}96`,
              }}>
              {META.bio}
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
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
            </div>
          </motion.div>
        </div>
      </section>
    </HeroShell>
  );
}
