"use client";
import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { Syne, JetBrains_Mono } from "next/font/google";
import { personalInfo, skills, experiences, projects, stats } from "@/lib/constants";

const syne = Syne({ weight: ["400", "600", "700", "800"], subsets: ["latin"], variable: "--v2-syne" });
const jet = JetBrains_Mono({ weight: ["300", "400", "500"], subsets: ["latin"], variable: "--v2-jet" });

const T = "#00FFD4";      // teal neon
const V = "#A855F7";      // violet neon
const BG = "#020A12";     // void black
const BG2 = "#050E1A";
const FG = "#E0F7F4";
const DIM = "#1A3040";

// ─── VOID SIGNAL ─────────────────────────────────────────────────────────────
// Cyberpunk depth × bioluminescent glow × terminal aesthetic
// Syne display | JetBrains Mono body | #00FFD4 teal + #A855F7 violet neons

export default function V2() {
  return (
    <div className={`${syne.variable} ${jet.variable}`}
      style={{ background: BG, color: FG, fontFamily: "var(--v2-jet), monospace", overflowX: "hidden", position: "relative" }}>
      <style dangerouslySetInnerHTML={{ __html: `nav { display: none !important; }` }} />

      {/* Scanline overlay */}
      <div style={{ position: "fixed", inset: 0, zIndex: 1, pointerEvents: "none", backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,255,212,0.012) 3px, rgba(0,255,212,0.012) 4px)` }} />

      {/* Ambient orbs */}
      <div style={{ position: "fixed", top: "20%", left: "10%", width: 600, height: 600, borderRadius: "50%", background: `radial-gradient(circle, ${T}08, transparent 70%)`, pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "fixed", bottom: "10%", right: "5%", width: 500, height: 500, borderRadius: "50%", background: `radial-gradient(circle, ${V}07, transparent 70%)`, pointerEvents: "none", zIndex: 0 }} />

      {/* ── NAV ─────────────────────────────── */}
      <header style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 300, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1.2rem 3rem", background: `${BG}D8`, backdropFilter: "blur(20px)", borderBottom: `1px solid ${T}18` }}>
        <a href="#v2-home" style={{ fontFamily: "var(--v2-syne)", fontSize: "1.2rem", fontWeight: 800, color: T, textDecoration: "none", letterSpacing: "0.12em", textShadow: `0 0 20px ${T}80` }}>AD.EXE</a>
        <div style={{ display: "flex", gap: "2rem" }}>
          {[["ABOUT", "#v2-about"], ["SKILLS", "#v2-skills"], ["WORK", "#v2-exp"], ["PROJECTS", "#v2-projects"], ["CONTACT", "#v2-contact"]].map(([lbl, href]) => (
            <a key={lbl} href={href} style={{ fontSize: "0.6rem", letterSpacing: "0.2em", color: `${FG}60`, textDecoration: "none", transition: "color .2s, text-shadow .2s" }}
              onMouseEnter={e => { e.currentTarget.style.color = T; e.currentTarget.style.textShadow = `0 0 12px ${T}`; }}
              onMouseLeave={e => { e.currentTarget.style.color = `${FG}60`; e.currentTarget.style.textShadow = "none"; }}>{lbl}</a>
          ))}
        </div>
      </header>

      {/* ── HERO ────────────────────────────── */}
      <V2Hero />

      {/* ── ABOUT ───────────────────────────── */}
      <V2Sec id="v2-about" label="> ABOUT.EXE" color={T}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: "4rem", alignItems: "start" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {stats.map(s => (
              <div key={s.label} style={{ padding: "1.5rem", border: `1px solid ${T}25`, background: `${T}05`, position: "relative" }}>
                <div style={{ fontFamily: "var(--v2-syne)", fontSize: "3.5rem", fontWeight: 800, color: T, textShadow: `0 0 30px ${T}`, lineHeight: 1 }}>{s.value}+</div>
                <div style={{ fontSize: "0.62rem", letterSpacing: "0.2em", color: `${FG}60`, textTransform: "uppercase", marginTop: "0.5rem" }}>{s.label}</div>
                <div style={{ position: "absolute", top: 8, right: 10, fontSize: "0.5rem", color: `${T}40` }}>[STAT]</div>
              </div>
            ))}
          </div>
          <div>
            <div style={{ marginBottom: "0.5rem", fontSize: "0.58rem", letterSpacing: "0.3em", color: T }}>// PROFILE_DATA</div>
            <p style={{ fontSize: "0.95rem", lineHeight: 1.9, color: `${FG}BB`, marginBottom: "2rem", borderLeft: `2px solid ${T}40`, paddingLeft: "1.5rem" }}>{personalInfo.bio}</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              {[["location", personalInfo.location], ["email", personalInfo.email], ["github", "dalyDev-js"], ["linkedin", "abdulrhman-eldaly"]].map(([k, v]) => (
                <div key={k} style={{ padding: "0.75rem 1rem", border: `1px solid ${DIM}`, background: `${T}03` }}>
                  <div style={{ fontSize: "0.52rem", color: V, letterSpacing: "0.15em", marginBottom: "0.25rem" }}>{k.toUpperCase()}</div>
                  <div style={{ fontSize: "0.72rem", color: `${FG}AA` }}>{v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </V2Sec>

      {/* ── SKILLS ──────────────────────────── */}
      <V2Sec id="v2-skills" label="> SKILLS.SH" color={V}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1rem" }}>
          {skills.map((sk, i) => <V2Skill key={sk.name} skill={sk} index={i} />)}
        </div>
      </V2Sec>

      {/* ── EXPERIENCE ──────────────────────── */}
      <V2Sec id="v2-exp" label="> WORK_HISTORY.LOG" color={T}>
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {experiences.map((exp, i) => <V2Exp key={exp.company} exp={exp} index={i} />)}
        </div>
      </V2Sec>

      {/* ── PROJECTS ────────────────────────── */}
      <V2Sec id="v2-projects" label="> PORTFOLIO.DIR" color={V}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1.5rem" }}>
          {projects.map((p, i) => <V2Project key={p.title} project={p} index={i} />)}
        </div>
      </V2Sec>

      {/* ── CONTACT ─────────────────────────── */}
      <V2Sec id="v2-contact" label="> CONTACT.INIT" color={T}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem" }}>
          <div>
            <h3 style={{ fontFamily: "var(--v2-syne)", fontSize: "clamp(32px, 4vw, 64px)", fontWeight: 800, lineHeight: 1.1, marginBottom: "2rem", color: T, textShadow: `0 0 40px ${T}60` }}>
              INITIATE<br />CONNECTION
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              {[["EMAIL", personalInfo.email, `mailto:${personalInfo.email}`], ["PHONE", personalInfo.phone, `tel:${personalInfo.phone}`], ["GITHUB", "github.com/dalyDev-js", personalInfo.github], ["LINKEDIN", "abdulrhman-eldaly", personalInfo.linkedin]].map(([k, v, href]) => (
                <a key={k} href={href} target="_blank" rel="noopener noreferrer" style={{ display: "flex", gap: "1rem", alignItems: "center", textDecoration: "none", padding: "0.75rem 1rem", border: `1px solid ${DIM}`, background: `${T}04`, transition: "border-color .2s, background .2s" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = `${T}50`; (e.currentTarget as HTMLElement).style.background = `${T}08`; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = DIM; (e.currentTarget as HTMLElement).style.background = `${T}04`; }}>
                  <span style={{ fontSize: "0.52rem", letterSpacing: "0.2em", color: T, minWidth: 80 }}>[{k}]</span>
                  <span style={{ fontSize: "0.78rem", color: `${FG}AA` }}>{v}</span>
                </a>
              ))}
            </div>
          </div>
          <form onSubmit={e => e.preventDefault()} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {["name", "email"].map(f => (
              <div key={f} style={{ position: "relative" }}>
                <span style={{ position: "absolute", top: "0.9rem", left: "1rem", fontSize: "0.55rem", color: T, letterSpacing: "0.1em" }}>&gt; {f}:_</span>
                <input placeholder={`Enter ${f}...`} type={f === "email" ? "email" : "text"} style={{ width: "100%", background: `${T}04`, border: `1px solid ${T}25`, padding: "0.9rem 1rem 0.75rem 5.5rem", color: FG, fontSize: "0.82rem", fontFamily: "var(--v2-jet)", outline: "none", boxSizing: "border-box", transition: "border-color .2s" }}
                  onFocus={e => (e.currentTarget.style.borderColor = `${T}70`)}
                  onBlur={e => (e.currentTarget.style.borderColor = `${T}25`)} />
              </div>
            ))}
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", top: "0.9rem", left: "1rem", fontSize: "0.55rem", color: T }}>// message:</span>
              <textarea placeholder="Describe your project..." rows={5} style={{ width: "100%", background: `${T}04`, border: `1px solid ${T}25`, padding: "0.9rem 1rem 0.75rem", paddingTop: "2rem", color: FG, fontSize: "0.82rem", fontFamily: "var(--v2-jet)", resize: "none", outline: "none", boxSizing: "border-box" }}
                onFocus={e => (e.currentTarget.style.borderColor = `${T}70`)}
                onBlur={e => (e.currentTarget.style.borderColor = `${T}25`)} />
            </div>
            <button type="submit" style={{ padding: "1rem 2rem", background: "transparent", border: `1px solid ${T}`, color: T, cursor: "pointer", fontSize: "0.65rem", letterSpacing: "0.2em", fontFamily: "var(--v2-jet)", textShadow: `0 0 12px ${T}`, boxShadow: `0 0 20px ${T}20, inset 0 0 20px ${T}08`, transition: "all .3s", alignSelf: "flex-start" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = `${T}15`; (e.currentTarget as HTMLElement).style.boxShadow = `0 0 40px ${T}40, inset 0 0 30px ${T}15`; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.boxShadow = `0 0 20px ${T}20, inset 0 0 20px ${T}08`; }}>
              TRANSMIT_MSG.exe →
            </button>
          </form>
        </div>
      </V2Sec>

      <footer style={{ padding: "1.5rem 3rem", borderTop: `1px solid ${T}15`, display: "flex", justifyContent: "space-between", fontSize: "0.55rem", letterSpacing: "0.2em", color: `${FG}40` }}>
        <span>© 2025 ABDULRHMAN_EL-DALY.EXE</span>
        <span style={{ color: `${T}60` }}>PROCESS_STATUS: AVAILABLE</span>
      </footer>
    </div>
  );
}

/* ── Sub-components ─────────────────────────────────────────────────────────── */

function V2Hero() {
  const [line, setLine] = useState(0);
  const lines = [
    "> INITIALIZING PROFILE...",
    "> LOADING: abdulrhman_eldaly.exe",
    "> ROLE: Senior Frontend Developer",
    "> EXPERTISE: React · Next.js · TypeScript",
    "> STATUS: Available for opportunities",
    "> READY.",
  ];
  useEffect(() => {
    if (line >= lines.length) return;
    const t = setTimeout(() => setLine(l => l + 1), line === 0 ? 400 : 300);
    return () => clearTimeout(t);
  }, [line, lines.length]);

  return (
    <section id="v2-home" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", padding: "8rem 3rem 5rem", position: "relative" }}>
      {/* Corner decorations */}
      <div style={{ position: "absolute", top: "5rem", left: "3rem", fontSize: "0.55rem", color: `${T}40`, lineHeight: 2, letterSpacing: "0.1em", fontFamily: "var(--v2-jet)" }}>
        {["SYS_VER: 5.2", "LANG: TS/JS", "FRAMEWORK: NEXT"].map(l => <div key={l}>{l}</div>)}
      </div>

      <div style={{ maxWidth: "900px" }}>
        {/* Terminal block */}
        <div style={{ marginBottom: "3rem", padding: "1.5rem 2rem", border: `1px solid ${T}30`, background: `${T}04`, fontFamily: "var(--v2-jet)", fontSize: "0.78rem", lineHeight: 2 }}>
          <div style={{ marginBottom: "1rem", display: "flex", gap: "0.5rem" }}>
            {[T, V, "#FFD700"].map((c, i) => <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: c, opacity: 0.7 }} />)}
            <span style={{ fontSize: "0.55rem", color: `${FG}40`, marginLeft: "0.5rem", letterSpacing: "0.1em" }}>TERMINAL — profile.sh</span>
          </div>
          {lines.slice(0, line).map((l, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}
              style={{ color: i === lines.length - 1 ? T : `${FG}80`, textShadow: i === lines.length - 1 ? `0 0 10px ${T}` : "none" }}>{l}</motion.div>
          ))}
          {line < lines.length && <span style={{ color: T, animation: "blink 1s step-end infinite" }}>█</span>}
          <style>{`@keyframes blink{50%{opacity:0}}`}</style>
        </div>

        {/* Main name */}
        <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: line >= 3 ? 1 : 0, y: line >= 3 ? 0 : 40 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{ fontFamily: "var(--v2-syne)", fontSize: "clamp(40px, 5.5vw, 88px)", fontWeight: 800, lineHeight: 1, margin: "0 0 1.5rem", letterSpacing: "-0.02em", whiteSpace: "nowrap" }}>
          <span style={{ color: T, textShadow: `0 0 40px ${T}80`, display: "block" }}>ABDULRHMAN</span>
          <span style={{ color: "transparent", WebkitTextStroke: `1.5px ${T}60`, display: "block" }}>EL-DALY</span>
        </motion.h1>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: line >= 5 ? 1 : 0 }} transition={{ duration: 0.6 }}
          style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <a href="#v2-projects" style={{ padding: "0.9rem 2rem", background: "transparent", border: `1px solid ${T}`, color: T, textDecoration: "none", fontSize: "0.65rem", letterSpacing: "0.2em", fontFamily: "var(--v2-jet)", textShadow: `0 0 12px ${T}`, boxShadow: `0 0 20px ${T}20` }}>
            ./VIEW_PROJECTS
          </a>
          <a href="#v2-contact" style={{ padding: "0.9rem 2rem", background: "transparent", border: `1px solid ${V}60`, color: V, textDecoration: "none", fontSize: "0.65rem", letterSpacing: "0.2em", fontFamily: "var(--v2-jet)", textShadow: `0 0 12px ${V}` }}>
            ./CONTACT
          </a>
        </motion.div>
      </div>

      {/* Scroll hint */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: line >= 6 ? 1 : 0 }} transition={{ delay: 0.5 }}
        style={{ position: "absolute", bottom: "2.5rem", left: "3rem", display: "flex", alignItems: "center", gap: "1rem", fontSize: "0.55rem", letterSpacing: "0.2em", color: `${FG}40` }}>
        <div style={{ width: 24, height: 1, background: `${T}40` }} />
        <span>SCROLL_TO_EXPLORE</span>
      </motion.div>
    </section>
  );
}

function V2Sec({ id, label, color, children }: { id: string; label: string; color: string; children: React.ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <section ref={ref} id={id} style={{ padding: "6rem 3rem", borderTop: `1px solid ${color}15`, position: "relative" }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", marginBottom: "3.5rem" }}>
          <span style={{ fontFamily: "var(--v2-jet)", fontSize: "0.75rem", color, textShadow: `0 0 12px ${color}`, letterSpacing: "0.05em" }}>{label}</span>
          <div style={{ flex: 1, height: "1px", background: `linear-gradient(to right, ${color}40, transparent)` }} />
        </div>
        {children}
      </motion.div>
    </section>
  );
}

const v2CatCol: Record<string, string> = { frontend: T, design: "#00C9FF", backend: V, tools: "#FFB800" };

function V2Skill({ skill, index }: { skill: { name: string; category: string; proficiency: number }; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const col = v2CatCol[skill.category] || T;
  return (
    <div ref={ref} style={{ padding: "1.2rem 1.5rem", border: `1px solid ${col}20`, background: `${col}04`, position: "relative" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem" }}>
        <span style={{ fontFamily: "var(--v2-syne)", fontSize: "0.82rem", fontWeight: 600, color: FG }}>{skill.name}</span>
        <span style={{ fontFamily: "var(--v2-jet)", fontSize: "0.65rem", color: col, textShadow: `0 0 8px ${col}` }}>{skill.proficiency}%</span>
      </div>
      <div style={{ height: "2px", background: `${col}15`, overflow: "hidden" }}>
        <motion.div style={{ height: "100%", background: `linear-gradient(to right, ${col}, ${col}80)`, originX: 0, boxShadow: `0 0 8px ${col}` }} initial={{ scaleX: 0 }} animate={inView ? { scaleX: skill.proficiency / 100 } : {}} transition={{ duration: 1.2, delay: index * 0.04, ease: [0.22, 1, 0.36, 1] }} />
      </div>
    </div>
  );
}

function V2Exp({ exp, index }: { exp: { company: string; role: string; period: string; type: string; bullets: string[] }; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, x: -20 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ delay: index * 0.1, duration: 0.5 }}
      style={{ padding: "2rem", border: `1px solid ${T}18`, background: `${T}03`, display: "grid", gridTemplateColumns: "200px 1fr", gap: "2rem" }}>
      <div>
        <div style={{ fontSize: "0.62rem", color: T, letterSpacing: "0.12em", textShadow: `0 0 8px ${T}`, marginBottom: "0.4rem" }}>{exp.period}</div>
        <div style={{ fontSize: "0.58rem", color: V, letterSpacing: "0.1em", padding: "0.2rem 0.5rem", border: `1px solid ${V}30`, display: "inline-block", textShadow: `0 0 6px ${V}` }}>[{exp.type.toUpperCase()}]</div>
      </div>
      <div>
        <h3 style={{ fontFamily: "var(--v2-syne)", fontSize: "1.1rem", fontWeight: 700, color: FG, marginBottom: "0.3rem" }}>{exp.role}</h3>
        <p style={{ fontSize: "0.72rem", color: T, marginBottom: "1rem", textShadow: `0 0 6px ${T}` }}>{exp.company}</p>
        {exp.bullets.map((b, i) => (
          <p key={i} style={{ fontSize: "0.75rem", color: `${FG}70`, lineHeight: 1.75, paddingLeft: "1.2rem", position: "relative", marginBottom: "0.3rem" }}>
            <span style={{ position: "absolute", left: 0, color: T }}>›</span>{b}
          </p>
        ))}
      </div>
    </motion.div>
  );
}

function V2Project({ project, index }: { project: { title: string; description: string; tech: string[] }; index: number }) {
  const [hov, setHov] = useState(false);
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.07 }}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ padding: "2rem", border: `1px solid ${hov ? T : DIM}`, background: hov ? `${T}06` : `${T}02`, transition: "all 0.3s", cursor: "pointer", position: "relative", overflow: "hidden" }}>
      {hov && <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at 50% 50%, ${T}08, transparent 70%)`, pointerEvents: "none" }} />}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
        <span style={{ fontFamily: "var(--v2-jet)", fontSize: "0.6rem", color: hov ? T : `${FG}30`, transition: "color 0.3s" }}>PROJECT_{String(index + 1).padStart(2, "0")}</span>
        <span style={{ fontSize: "0.6rem", color: T, opacity: hov ? 1 : 0, transition: "opacity .3s" }}>OPEN ↗</span>
      </div>
      <h3 style={{ fontFamily: "var(--v2-syne)", fontSize: "1rem", fontWeight: 700, marginBottom: "0.75rem", color: hov ? T : FG, textShadow: hov ? `0 0 20px ${T}` : "none", transition: "all .3s" }}>{project.title}</h3>
      <p style={{ fontSize: "0.75rem", color: `${FG}65`, lineHeight: 1.75, marginBottom: "1.25rem" }}>{project.description}</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
        {project.tech.map(t => <span key={t} style={{ fontSize: "0.55rem", letterSpacing: "0.1em", padding: "0.2rem 0.5rem", border: `1px solid ${T}25`, color: `${T}80`, textTransform: "uppercase" }}>{t}</span>)}
      </div>
    </motion.div>
  );
}
