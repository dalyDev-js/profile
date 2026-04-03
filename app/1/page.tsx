"use client";
import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Bebas_Neue, DM_Mono } from "next/font/google";
import { personalInfo, skills, experiences, projects, stats } from "@/lib/constants";

const bebas = Bebas_Neue({ weight: "400", subsets: ["latin"], variable: "--v1-bebas" });
const mono = DM_Mono({ weight: ["300", "400", "500"], subsets: ["latin"], variable: "--v1-mono" });

const R = "#FF3D00";
const BG = "#0D0D0D";
const FG = "#F5F5F0";
const MUT = "#444";

// ─── ARCHITECTURAL NOIR ──────────────────────────────────────────────────────
// Swiss brutalism × editorial magazine × high contrast
// Bebas Neue display | DM Mono body | #FF3D00 accent

export default function V1() {
  return (
    <div
      className={`${bebas.variable} ${mono.variable}`}
      style={{ background: BG, color: FG, fontFamily: "var(--v1-mono), monospace", overflowX: "hidden" }}
    >
      <style dangerouslySetInnerHTML={{ __html: `nav { display: none !important; }` }} />

      {/* ── NAV ─────────────────────────────── */}
      <header style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 200, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1.4rem 3rem", background: `${BG}E0`, backdropFilter: "blur(16px)", borderBottom: `1px solid #FFFFFF08` }}>
        <a href="#v1-home" style={{ fontFamily: "var(--v1-bebas)", fontSize: "1.8rem", color: R, letterSpacing: "0.08em", textDecoration: "none" }}>AD</a>
        <div style={{ display: "flex", gap: "2.5rem" }}>
          {[["About", "#v1-about"], ["Skills", "#v1-skills"], ["Experience", "#v1-exp"], ["Projects", "#v1-projects"], ["Contact", "#v1-contact"]].map(([lbl, href]) => (
            <a key={lbl} href={href} style={{ fontSize: "0.65rem", letterSpacing: "0.25em", textTransform: "uppercase", color: `${FG}88`, textDecoration: "none", transition: "color .2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = R)}
              onMouseLeave={e => (e.currentTarget.style.color = `${FG}88`)}>{lbl}</a>
          ))}
        </div>
      </header>

      {/* ── HERO ────────────────────────────── */}
      <section id="v1-home" style={{ minHeight: "100vh", padding: "7rem 3rem 5rem", display: "flex", flexDirection: "column", justifyContent: "flex-end", position: "relative", overflow: "hidden" }}>
        {/* Grid overlay */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(#FFFFFF06 1px, transparent 1px), linear-gradient(90deg, #FFFFFF06 1px, transparent 1px)`, backgroundSize: "64px 64px", pointerEvents: "none" }} />

        <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.6 }} style={{ fontSize: "0.62rem", letterSpacing: "0.35em", textTransform: "uppercase", color: R, marginBottom: "2rem" }}>
          Senior Frontend Developer & UI/UX Developer — Cairo, Egypt
        </motion.p>

        <div style={{ position: "relative" }}>
          <motion.h1 initial={{ opacity: 0, y: 80 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 1, ease: [0.22, 1, 0.36, 1] }}
            style={{ fontFamily: "var(--v1-bebas)", fontSize: "clamp(72px, 15vw, 240px)", lineHeight: 0.88, letterSpacing: "-0.01em", margin: 0 }}>
            ABDULRHMAN
          </motion.h1>
          <motion.h1 initial={{ opacity: 0, y: 80 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 1, ease: [0.22, 1, 0.36, 1] }}
            style={{ fontFamily: "var(--v1-bebas)", fontSize: "clamp(72px, 15vw, 240px)", lineHeight: 0.88, letterSpacing: "-0.01em", margin: 0, color: "transparent", WebkitTextStroke: `2px ${FG}` }}>
            EL-DALY
          </motion.h1>
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1, duration: 0.6 }}
          style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: "3rem", paddingTop: "2rem", borderTop: `1px solid ${MUT}50` }}>
          <p style={{ fontSize: "0.82rem", lineHeight: 1.75, color: MUT, maxWidth: "340px" }}>{personalInfo.tagline}</p>
          <div style={{ display: "flex", gap: "1rem" }}>
            <a href="#v1-projects" style={{ padding: "0.9rem 2.2rem", background: R, color: FG, textDecoration: "none", fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", fontFamily: "var(--v1-mono)" }}>View Work</a>
            <a href="#v1-contact" style={{ padding: "0.9rem 2.2rem", border: `1px solid ${MUT}60`, color: FG, textDecoration: "none", fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", fontFamily: "var(--v1-mono)" }}>Contact</a>
          </div>
        </motion.div>

        {/* Vertical label */}
        <div style={{ position: "absolute", right: "2.5rem", top: "50%", transform: "translateY(-50%) rotate(90deg)", fontSize: "0.52rem", letterSpacing: "0.5em", color: "#333", textTransform: "uppercase", whiteSpace: "nowrap" }}>
          Frontend · Design · Code
        </div>
      </section>

      {/* ── ABOUT ───────────────────────────── */}
      <V1Sec id="v1-about" num="01" title="ABOUT">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: "5rem", alignItems: "start" }}>
          <div>
            {stats.map((s) => (
              <div key={s.label} style={{ borderBottom: `1px solid ${MUT}30`, padding: "2rem 0", display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <span style={{ fontFamily: "var(--v1-bebas)", fontSize: "5rem", lineHeight: 1, color: R }}>{s.value}+</span>
                <span style={{ fontSize: "0.62rem", letterSpacing: "0.2em", textTransform: "uppercase", color: MUT }}>{s.label}</span>
              </div>
            ))}
            <div style={{ marginTop: "2.5rem", display: "flex", gap: "2rem" }}>
              {[["GitHub ↗", personalInfo.github], ["LinkedIn ↗", personalInfo.linkedin]].map(([lbl, href]) => (
                <a key={lbl} href={href} target="_blank" rel="noopener noreferrer" style={{ fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", color: R, textDecoration: "none" }}>{lbl}</a>
              ))}
            </div>
          </div>
          <div>
            <p style={{ fontSize: "1rem", lineHeight: 1.9, color: `${FG}CC`, marginBottom: "2.5rem" }}>{personalInfo.bio}</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", fontSize: "0.78rem", color: MUT }}>
              <span>📍 6th of October, Giza, Egypt</span>
              <span>🎓 El-Shrouk Academy — Engineering</span>
              <span>🗣 Arabic (Native) · English (Fluent)</span>
            </div>
          </div>
        </div>
      </V1Sec>

      {/* ── SKILLS ──────────────────────────── */}
      <V1Sec id="v1-skills" num="02" title="SKILLS">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
          {skills.map((sk, i) => <V1Skill key={sk.name} skill={sk} index={i} />)}
        </div>
      </V1Sec>

      {/* ── EXPERIENCE ──────────────────────── */}
      <V1Sec id="v1-exp" num="03" title="EXPERIENCE">
        {experiences.map((exp, i) => <V1Exp key={exp.company} exp={exp} index={i} />)}
      </V1Sec>

      {/* ── PROJECTS ────────────────────────── */}
      <V1Sec id="v1-projects" num="04" title="PROJECTS">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2px", background: `${MUT}20` }}>
          {projects.map((p, i) => <V1Project key={p.title} project={p} index={i} />)}
        </div>
      </V1Sec>

      {/* ── CONTACT ─────────────────────────── */}
      <V1Sec id="v1-contact" num="05" title="CONTACT">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem" }}>
          <div>
            <h3 style={{ fontFamily: "var(--v1-bebas)", fontSize: "clamp(48px, 5.5vw, 88px)", lineHeight: 0.9, marginBottom: "3rem" }}>
              LET&apos;S<br />BUILD<br /><span style={{ color: R }}>TOGETHER</span>
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
              {[["Email", personalInfo.email, `mailto:${personalInfo.email}`], ["Phone", personalInfo.phone, `tel:${personalInfo.phone}`]].map(([lbl, val, href]) => (
                <a key={lbl} href={href} style={{ display: "flex", flexDirection: "column", gap: "0.3rem", textDecoration: "none" }}>
                  <span style={{ fontSize: "0.58rem", letterSpacing: "0.25em", color: R, textTransform: "uppercase" }}>{lbl}</span>
                  <span style={{ fontSize: "0.9rem", color: FG }}>{val}</span>
                </a>
              ))}
            </div>
          </div>
          <form onSubmit={e => e.preventDefault()} style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            {(["Name", "Email"] as const).map(f => (
              <input key={f} placeholder={f} type={f === "Email" ? "email" : "text"} style={{ background: "transparent", border: "none", borderBottom: `1px solid ${MUT}50`, padding: "0.75rem 0", color: FG, fontSize: "0.9rem", fontFamily: "var(--v1-mono)", outline: "none", width: "100%" }} />
            ))}
            <textarea placeholder="Message" rows={4} style={{ background: `${FG}04`, border: `1px solid ${MUT}40`, padding: "1rem", color: FG, fontSize: "0.9rem", fontFamily: "var(--v1-mono)", resize: "none", outline: "none" }} />
            <button type="submit" style={{ padding: "1rem 2.5rem", background: R, color: FG, border: "none", cursor: "pointer", fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", fontFamily: "var(--v1-mono)", alignSelf: "flex-start" }}>
              Send Message →
            </button>
          </form>
        </div>
      </V1Sec>

      <footer style={{ padding: "2rem 3rem", borderTop: `1px solid ${MUT}30`, display: "flex", justifyContent: "space-between", fontSize: "0.6rem", letterSpacing: "0.18em", color: MUT, textTransform: "uppercase" }}>
        <span>© 2025 Abdulrhman El-Daly</span>
        <span>Senior Frontend Developer</span>
      </footer>
    </div>
  );
}

/* ── Sub-components ─────────────────────────────────────────────────────────── */

function V1Sec({ id, num, title, children }: { id: string; num: string; title: string; children: React.ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <section ref={ref} id={id} style={{ padding: "7rem 3rem", borderTop: `1px solid ${MUT}25`, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", right: "1rem", bottom: 0, fontFamily: "var(--v1-bebas)", fontSize: "22vw", lineHeight: 1, color: `${FG}03`, pointerEvents: "none", userSelect: "none" }}>{num}</div>
      <motion.div initial={{ opacity: 0, y: 28 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", marginBottom: "4rem" }}>
          <span style={{ fontFamily: "var(--v1-mono)", fontSize: "0.58rem", letterSpacing: "0.3em", color: R }}>{num}/05</span>
          <div style={{ flex: 1, height: "1px", background: `${MUT}30` }} />
          <h2 style={{ fontFamily: "var(--v1-bebas)", fontSize: "clamp(26px, 3.2vw, 52px)", letterSpacing: "0.12em" }}>{title}</h2>
        </div>
        {children}
      </motion.div>
    </section>
  );
}

const catCol: Record<string, string> = { frontend: R, design: "#FF8A00", backend: "#FFAB00", tools: "#FFD600" };

function V1Skill({ skill, index }: { skill: { name: string; category: string; proficiency: number }; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const col = catCol[skill.category] || R;
  return (
    <div ref={ref} style={{ padding: "1.4rem 2rem", borderBottom: `1px solid ${MUT}25`, borderRight: index % 2 === 0 ? `1px solid ${MUT}25` : "none" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.7rem" }}>
        <span style={{ fontSize: "0.85rem" }}>{skill.name}</span>
        <span style={{ fontSize: "0.68rem", color: col, fontFamily: "var(--v1-mono)" }}>{skill.proficiency}%</span>
      </div>
      <div style={{ height: "1px", background: `${MUT}25`, overflow: "hidden" }}>
        <motion.div style={{ height: "100%", background: col, originX: 0 }} initial={{ scaleX: 0 }} animate={inView ? { scaleX: skill.proficiency / 100 } : {}} transition={{ duration: 1.3, delay: index * 0.04, ease: [0.22, 1, 0.36, 1] }} />
      </div>
    </div>
  );
}

function V1Exp({ exp, index }: { exp: { company: string; role: string; period: string; type: string; bullets: string[] }; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, x: -20 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ delay: index * 0.1, duration: 0.6 }}
      style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: "3rem", padding: "2.5rem 0", borderBottom: `1px solid ${MUT}25` }}>
      <div>
        <p style={{ fontSize: "0.68rem", color: R, letterSpacing: "0.1em", textTransform: "uppercase" }}>{exp.period}</p>
        <p style={{ fontSize: "0.62rem", color: MUT, marginTop: "0.3rem" }}>{exp.type}</p>
      </div>
      <div>
        <h3 style={{ fontFamily: "var(--v1-bebas)", fontSize: "1.55rem", letterSpacing: "0.06em" }}>{exp.role}</h3>
        <p style={{ fontSize: "0.78rem", color: MUT, margin: "0.4rem 0 1rem" }}>{exp.company}</p>
        {exp.bullets.map((b, i) => (
          <p key={i} style={{ fontSize: "0.78rem", color: "#666", lineHeight: 1.8, paddingLeft: "1.5rem", position: "relative", marginBottom: "0.4rem" }}>
            <span style={{ position: "absolute", left: 0, color: R }}>—</span>{b}
          </p>
        ))}
      </div>
    </motion.div>
  );
}

function V1Project({ project, index }: { project: { title: string; description: string; tech: string[] }; index: number }) {
  const [hov, setHov] = useState(false);
  return (
    <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: index * 0.06 }}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ padding: "2.5rem", background: hov ? `${R}0A` : BG, transition: "background 0.3s", cursor: "pointer" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem" }}>
        <span style={{ fontFamily: "var(--v1-bebas)", fontSize: "3.5rem", lineHeight: 1, color: hov ? R : `${FG}08`, transition: "color 0.3s" }}>{String(index + 1).padStart(2, "0")}</span>
        <span style={{ fontSize: "0.6rem", letterSpacing: "0.2em", color: R, opacity: hov ? 1 : 0, transition: "opacity 0.3s", textTransform: "uppercase" }}>View ↗</span>
      </div>
      <h3 style={{ fontFamily: "var(--v1-bebas)", fontSize: "1.35rem", letterSpacing: "0.06em", marginBottom: "0.75rem" }}>{project.title}</h3>
      <p style={{ fontSize: "0.78rem", color: MUT, lineHeight: 1.75, marginBottom: "1.25rem" }}>{project.description}</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
        {project.tech.map(t => <span key={t} style={{ fontSize: "0.58rem", letterSpacing: "0.12em", padding: "0.2rem 0.65rem", border: `1px solid ${MUT}30`, color: MUT, textTransform: "uppercase" }}>{t}</span>)}
      </div>
    </motion.div>
  );
}
