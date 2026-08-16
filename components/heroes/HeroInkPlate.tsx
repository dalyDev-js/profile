"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  HeroShell,
  LiveDot,
  META,
  Mono,
  Rule,
  T,
  useClock,
  usePointer,
  useResponsive,
} from "./heroShared";

// ──────────────────────────────────────────────────────────────────────────────
//  VARIANT A — "Ink Plate"
//  Asymmetric editorial split. Dark masthead column on the left, cream paper
//  plate on the right holding the ink portrait like a mounted gallery print.
// ──────────────────────────────────────────────────────────────────────────────

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

function MastheadLine({
  children,
  delay,
  size,
}: {
  children: React.ReactNode;
  delay: number;
  size: string;
}) {
  return (
    <div style={{ overflow: "hidden", display: "block" }}>
      <motion.div
        initial={{ y: "108%" }}
        animate={{ y: "0%" }}
        transition={{ delay, duration: 1.05, ease: EASE }}
        style={{
          fontFamily: "var(--h-sg)",
          fontSize: size,
          fontWeight: 700,
          lineHeight: 0.92,
          letterSpacing: "-0.045em",
          whiteSpace: "nowrap",
        }}>
        {children}
      </motion.div>
    </div>
  );
}

/**
 * Only the right-hand portrait treatment changes between these three — the
 * editorial masthead column is identical, so they compare like-for-like.
 *   plate  — portrait mounted on a cream paper panel
 *   glow   — portrait floats on the dark page with a traced halo + bloom
 *   invert — portrait flipped to light-line-art, page stays fully dark
 */
export type InkTreatment = "plate" | "glow" | "invert";

export default function HeroInkPlate({
  treatment = "plate",
}: {
  treatment?: InkTreatment;
}) {
  const isPlate = treatment === "plate";
  const { isMobile, isTablet, ready } = useResponsive();
  const clock = useClock(META.tz);
  const pt = usePointer(1);

  const nameSize = isMobile
    ? "clamp(38px, 12.5vw, 64px)"
    : isTablet
    ? "clamp(44px, 7.4vw, 72px)"
    : "clamp(52px, 6.2vw, 96px)";

  return (
    <HeroShell>
      <section
        style={{
          position: "relative",
          minHeight: "100svh",
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          alignItems: "stretch",
          overflow: "hidden",
          background: T.bg,
        }}>
        {/* ── LEFT: dark masthead column ─────────────────────────────────── */}
        <div
          style={{
            flex: 1,
            minWidth: 0,
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            gap: isMobile ? "2.2rem" : "2rem",
            padding: isMobile
              ? "3.2rem 1.5rem 1.75rem"
              : "clamp(2.5rem, 4vh, 4rem) clamp(2rem, 3.6vw, 4.5rem)",
          }}>
          {/* Faint hairline grid, replaces the old aurora shader */}
          <div
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `linear-gradient(${T.br}2E 1px, transparent 1px), linear-gradient(90deg, ${T.br}2E 1px, transparent 1px)`,
              backgroundSize: "88px 88px",
              maskImage:
                "radial-gradient(ellipse 90% 70% at 20% 40%, #000 0%, transparent 100%)",
              WebkitMaskImage:
                "radial-gradient(ellipse 90% 70% at 20% 40%, #000 0%, transparent 100%)",
              pointerEvents: "none",
            }}
          />
          <div
            aria-hidden
            style={{
              position: "absolute",
              left: "-12%",
              top: "18%",
              width: "60%",
              height: "55%",
              background: `radial-gradient(circle, rgba(${T.priRgb},.09) 0%, transparent 68%)`,
              filter: "blur(20px)",
              pointerEvents: "none",
            }}
          />

          {/* ── Top meta bar ── */}
          <div style={{ position: "relative", zIndex: 2 }}>
            <Rule delay={0.1} />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "0.9rem",
                paddingTop: "0.85rem",
              }}>
              {/* Wordmark, not the name — the masthead below already says it */}
              <span
                style={{
                  fontFamily: "var(--h-sg)",
                  fontWeight: 700,
                  fontSize: "1rem",
                  letterSpacing: "-0.02em",
                  color: T.pri,
                }}>
                AD.
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: "1.4rem" }}>
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
          </div>

          {/* ── Masthead — centred in whatever height is left over ── */}
          <div
            style={{
              position: "relative",
              zIndex: 2,
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              minHeight: 0,
            }}>
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                gap: isMobile ? "1.1rem" : "clamp(1.2rem, 2.4vw, 2.6rem)",
              }}>
              <div style={{ minWidth: 0 }}>
                <MastheadLine delay={0.28} size={nameSize}>
                  {META.name}
                </MastheadLine>
                <MastheadLine delay={0.4} size={nameSize}>
                  <span style={{ color: T.pri }}>{META.surname}</span>
                  <span style={{ color: T.pri }}>.</span>
                </MastheadLine>
              </div>

              {/* Role stack, riding the masthead baseline */}
              {!isMobile && (
                <motion.div
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.85, duration: 0.7, ease: EASE }}
                  style={{
                    display: "flex",
                    gap: "clamp(.8rem, 1.4vw, 1.4rem)",
                    paddingBottom: "0.55em",
                  }}>
                  <div
                    style={{
                      width: 1,
                      background: `linear-gradient(to bottom, transparent, ${T.muted}99, transparent)`,
                    }}
                  />
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.42rem",
                      whiteSpace: "nowrap",
                    }}>
                    {META.roles.map((r) => (
                      <Mono key={r} size="0.62rem" track="0.14em">
                        {r}
                      </Mono>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.72, duration: 0.8, ease: EASE }}
              style={{
                marginTop: isMobile ? "1.3rem" : "1.8rem",
                maxWidth: "46ch",
                fontSize: isMobile ? "0.92rem" : "clamp(.95rem, 1.05vw, 1.08rem)",
                lineHeight: 1.65,
                color: `${T.fg}9E`,
              }}>
              {META.bio}
            </motion.p>
          </div>

          {/* ── Bottom: stats + actions ── */}
          <div style={{ position: "relative", zIndex: 2 }}>
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0, duration: 0.7, ease: EASE }}
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "flex-end",
                justifyContent: "space-between",
                gap: "1.6rem",
                marginBottom: "1rem",
              }}>
              {/* Stat strip */}
              <div style={{ display: "flex", alignItems: "stretch" }}>
                {META.stats.map((s, i) => (
                  <div
                    key={s.l}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.3rem",
                      paddingRight: isMobile ? "1.1rem" : "1.8rem",
                      paddingLeft: i === 0 ? 0 : isMobile ? "1.1rem" : "1.8rem",
                      borderLeft: i === 0 ? "none" : `1px solid ${T.br}`,
                    }}>
                    <span
                      style={{
                        fontFamily: "var(--h-sg)",
                        fontSize: isMobile ? "1.25rem" : "1.6rem",
                        fontWeight: 600,
                        lineHeight: 1,
                        letterSpacing: "-0.03em",
                      }}>
                      {s.n}
                    </span>
                    <Mono size="0.55rem" track="0.14em">
                      {s.l}
                    </Mono>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: isMobile ? "1.2rem" : "1.6rem",
                }}>
                <a
                  href="#v3-projects"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.7rem",
                    padding: "0.95rem 1.7rem",
                    background: T.pri,
                    color: T.bg,
                    textDecoration: "none",
                    borderRadius: "2px",
                    fontFamily: "var(--h-jb)",
                    fontSize: "0.63rem",
                    fontWeight: 700,
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                    transition: "transform .22s cubic-bezier(.22,1,.36,1), box-shadow .22s",
                    boxShadow: `0 0 0 rgba(${T.priRgb},0)`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = `0 10px 30px rgba(${T.priRgb},.28)`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = `0 0 0 rgba(${T.priRgb},0)`;
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
                    paddingBottom: "3px",
                    transition: "color .2s, border-color .2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = T.fg;
                    e.currentTarget.style.borderColor = T.fg;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = T.muted;
                    e.currentTarget.style.borderColor = T.br;
                  }}>
                  Résumé ↓
                </a>
                {!isMobile && (
                  <div style={{ display: "flex", gap: "1.1rem" }}>
                    {(
                      [
                        ["GH", META.links.github],
                        ["IN", META.links.linkedin],
                      ] as const
                    ).map(([l, h]) => (
                      <a
                        key={l}
                        href={h}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          fontFamily: "var(--h-jb)",
                          fontSize: "0.63rem",
                          letterSpacing: "0.14em",
                          color: T.muted,
                          textDecoration: "none",
                          transition: "color .2s",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = T.pri)}
                        onMouseLeave={(e) => (e.currentTarget.style.color = T.muted)}>
                        {l} ↗
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
            <Rule delay={1.15} />
          </div>
        </div>

        {/* ── RIGHT: cream ink plate ─────────────────────────────────────── */}
        <motion.div
          // Only the paper plate gets the wipe — a resting `inset(0)` clip on
          // the floating treatments would cut off their bloom.
          initial={isPlate ? { clipPath: "inset(100% 0% 0% 0%)" } : { opacity: 0 }}
          animate={isPlate ? { clipPath: "inset(0% 0% 0% 0%)" } : { opacity: 1 }}
          transition={{ delay: 0.18, duration: 1.15, ease: EASE }}
          style={{
            position: "relative",
            width: isMobile ? "100%" : isTablet ? "40vw" : "42vw",
            height: isMobile ? "46svh" : "auto",
            minHeight: isMobile ? 300 : undefined,
            flexShrink: 0,
            background: isPlate ? T.paper : "transparent",
            // The paper plate clips; the floating treatments must not, or the
            // bloom's bounding box shows up as a seam against the dark page.
            overflow: isPlate ? "hidden" : "visible",
          }}>
          {isPlate ? (
            <>
              {/* Ruled paper texture */}
              <div
                aria-hidden
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundImage: `repeating-linear-gradient(to bottom, ${T.paperDeep}66 0px, ${T.paperDeep}66 1px, transparent 1px, transparent 7px)`,
                  opacity: 0.55,
                }}
              />
              {/* Paper vignette so the portrait sits in light, not flat colour */}
              <div
                aria-hidden
                style={{
                  position: "absolute",
                  inset: 0,
                  background: `radial-gradient(ellipse 78% 62% at 52% 38%, rgba(255,255,255,.75) 0%, transparent 62%), linear-gradient(to bottom, transparent 40%, ${T.paperDeep}88 100%)`,
                }}
              />
              {/* Cyan spine where dark meets paper */}
              {!isMobile && (
                <div
                  aria-hidden
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: 3,
                    background: `linear-gradient(to bottom, ${T.pri}00 0%, ${T.pri} 35%, ${T.pri} 65%, ${T.pri}00 100%)`,
                    boxShadow: `0 0 24px rgba(${T.priRgb},.55)`,
                  }}
                />
              )}
            </>
          ) : (
            <>
              {/* Bloom behind the floating portrait */}
              <div
                aria-hidden
                style={{
                  position: "absolute",
                  inset: "-20%",
                  background:
                    treatment === "glow"
                      ? `radial-gradient(circle at 50% 46%, rgba(${T.priRgb},.20) 0%, rgba(167,139,250,.10) 34%, transparent 68%)`
                      : `radial-gradient(circle at 50% 46%, rgba(${T.priRgb},.14) 0%, transparent 64%)`,
                  filter: "blur(12px)",
                }}
              />
              {/* Soft light disc so the artwork has something to sit against */}
              {treatment === "glow" && (
                <div
                  aria-hidden
                  style={{
                    position: "absolute",
                    left: "50%",
                    top: "48%",
                    width: "78%",
                    aspectRatio: "1",
                    transform: "translate(-50%,-50%)",
                    borderRadius: "50%",
                    background:
                      "radial-gradient(circle, rgba(241,245,249,.13) 0%, rgba(241,245,249,.05) 45%, transparent 70%)",
                  }}
                />
              )}
            </>
          )}

          {/* Portrait — ink-bleeds up, bleeds off the bottom edge */}
          {/* Outer node owns the pointer parallax; inner motion node owns the
              reveal, so the two never fight over `transform`. */}
          <div
            style={{
              position: "absolute",
              inset: isMobile ? "5% 6% -12% 6%" : "9% 6% -5% 6%",
              transform: ready
                ? `translate3d(${pt.x * -10}px, ${pt.y * -7}px, 0)`
                : undefined,
              willChange: "transform",
            }}>
            <motion.div
              initial={{ clipPath: "inset(100% 0% 0% 0%)", opacity: 0 }}
              animate={{ clipPath: "inset(0% 0% 0% 0%)", opacity: 1 }}
              transition={{ delay: 0.62, duration: 1.25, ease: EASE }}
              style={{
                position: "absolute",
                inset: 0,
                // Glow traces a white halo along every ink line so the black
                // linework survives on a near-black page; invert flips lightness
                // while hue-rotate keeps the browns and creams plausible.
                filter:
                  treatment === "glow"
                    ? "drop-shadow(0 0 1px rgba(241,245,249,.95)) drop-shadow(0 0 4px rgba(241,245,249,.5)) drop-shadow(0 26px 60px rgba(0,0,0,.65))"
                    : treatment === "invert"
                    ? "invert(1) hue-rotate(180deg) saturate(.88) contrast(1.04) drop-shadow(0 26px 60px rgba(0,0,0,.6))"
                    : "drop-shadow(0 18px 40px rgba(26,23,18,.22))",
              }}>
              <Image
                src="/v3-hero.png"
                alt="Illustrated portrait of Abdulrhman El-Daly, seated with a coffee"
                fill
                priority
                sizes="(max-width: 768px) 90vw, 42vw"
                style={{ objectFit: "contain", objectPosition: "bottom center" }}
              />
            </motion.div>
          </div>

          {/* Museum label */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.45, duration: 0.7 }}
            style={{
              position: "absolute",
              right: isMobile ? "1.25rem" : "1.9rem",
              top: isMobile ? "1rem" : "1.8rem",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              gap: "0.3rem",
              zIndex: 3,
              textAlign: "right",
            }}>
            <div
              style={{
                width: 26,
                height: 1,
                background: isPlate ? `${T.paperInk}55` : T.br,
                marginBottom: "0.25rem",
              }}
            />
            <Mono
              size="0.56rem"
              track="0.16em"
              color={isPlate ? T.paperInk : `${T.fg}CC`}
              weight={500}>
              Abdulrhman El-Daly
            </Mono>
            <Mono
              size="0.52rem"
              track="0.13em"
              color={isPlate ? `${T.paperInk}88` : T.muted}>
              Ink &amp; wash on paper · 2026
            </Mono>
          </motion.div>
        </motion.div>
      </section>
    </HeroShell>
  );
}
