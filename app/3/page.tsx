"use client";
import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Cormorant_Garamond, Crimson_Pro } from "next/font/google";
import { personalInfo, skills, experiences, projects, stats } from "@/lib/constants";

const cormorant = Cormorant_Garamond({
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--v3-cormorant",
});
const crimson = Crimson_Pro({
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--v3-crimson",
});

const BG = "#F5F0E8";        // warm cream
const BG2 = "#EDE8DF";
const INK = "#1C1209";       // deep espresso
const INK2 = "#3D2E1E";
const GOLD = "#B8892A";      // antique gold
const GOLD2 = "#8B6914";     // warm bronze
const MUT = "#7D6A57";

// ─── ATELIER LUMIÈRE ──────────────────────────────────────────────────────────
// Quiet luxury × editorial serif × warm cream light theme
// Cormorant Garamond display | Crimson Pro body | antique gold accents

export default function V3() {
  return (
    <div className={`${cormorant.variable} ${crimson.variable}`}
      style={{ background: BG, color: INK, fontFamily: "var(--v3-crimson), Georgia, serif", overflowX: "hidden" }}>
      <style dangerouslySetInnerHTML={{ __html: `nav { display: none !important; }` }} />

      {/* ── NAV ─────────────────────────────── */}
      <header style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 200, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1.4rem 4rem", background: `${BG}F0`, backdropFilter: "blur(16px)", borderBottom: `1px solid ${GOLD}30` }}>
        <a href="#v3-home" style={{ fontFamily: "var(--v3-cormorant)", fontSize: "1.5rem", fontWeight: 300, fontStyle: "italic", color: INK, textDecoration: "none", letterSpacing: "0.05em" }}>A.D.</a>
        <div style={{ display: "flex", gap: "3rem" }}>
          {[["About", "#v3-about"], ["Skills", "#v3-skills"], ["Experience", "#v3-exp"], ["Projects", "#v3-projects"], ["Contact", "#v3-contact"]].map(([lbl, href]) => (
            <a key={lbl} href={href} style={{ fontSize: "0.68rem", letterSpacing: "0.25em", textTransform: "uppercase", color: MUT, textDecoration: "none", transition: "color .2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = GOLD)}
              onMouseLeave={e => (e.currentTarget.style.color = MUT)}>{lbl}</a>
          ))}
        </div>
      </header>

      {/* ── HERO ────────────────────────────── */}
      <section id="v3-home" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "8rem 4rem 6rem", textAlign: "center", position: "relative" }}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.2 }}
          style={{ width: 80, height: 1, background: GOLD, margin: "0 auto 3rem" }} />

        <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          style={{ fontFamily: "var(--v3-crimson)", fontSize: "0.72rem", letterSpacing: "0.4em", textTransform: "uppercase", color: GOLD, marginBottom: "2.5rem" }}>
          Senior Frontend Developer & UI/UX Designer
        </motion.p>

        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45, duration: 1, ease: [0.22, 1, 0.36, 1] }}
          style={{ fontFamily: "var(--v3-cormorant)", fontSize: "clamp(60px, 10vw, 160px)", fontWeight: 300, lineHeight: 0.9, letterSpacing: "-0.02em", marginBottom: "0.2rem" }}>
          Abdulrhman
        </motion.h1>
        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55, duration: 1, ease: [0.22, 1, 0.36, 1] }}
          style={{ fontFamily: "var(--v3-cormorant)", fontSize: "clamp(60px, 10vw, 160px)", fontWeight: 300, fontStyle: "italic", lineHeight: 0.9, letterSpacing: "-0.02em", color: GOLD, marginBottom: "3rem" }}>
          El-Daly
        </motion.h1>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
          style={{ width: 80, height: 1, background: GOLD, margin: "0 auto 3rem" }} />

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
          style={{ fontFamily: "var(--v3-crimson)", fontSize: "1.05rem", fontStyle: "italic", color: MUT, maxWidth: 440, lineHeight: 1.8, marginBottom: "3rem" }}>
          &ldquo;{personalInfo.tagline}&rdquo;
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }}
          style={{ display: "flex", gap: "1.5rem", justifyContent: "center" }}>
          <a href="#v3-projects" style={{ padding: "0.9rem 2.5rem", background: INK, color: BG, textDecoration: "none", fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", fontFamily: "var(--v3-crimson)", transition: "background .3s" }}
            onMouseEnter={e => (e.currentTarget.style.background = GOLD)}
            onMouseLeave={e => (e.currentTarget.style.background = INK)}>
            View Work
          </a>
          <a href="#v3-contact" style={{ padding: "0.9rem 2.5rem", border: `1px solid ${GOLD}60`, color: INK, textDecoration: "none", fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", fontFamily: "var(--v3-crimson)", transition: "border-color .3s" }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = GOLD)}
            onMouseLeave={e => (e.currentTarget.style.borderColor = `${GOLD}60`)}>
            Get in Touch
          </a>
        </motion.div>

        {/* Location */}
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
          style={{ position: "absolute", bottom: "3rem", left: "50%", transform: "translateX(-50%)", fontSize: "0.62rem", letterSpacing: "0.3em", color: MUT, textTransform: "uppercase" }}>
          Cairo · Egypt
        </motion.p>
      </section>

      {/* ── ABOUT ───────────────────────────── */}
      <V3Sec id="v3-about" num="I" title="About Me" subtitle="A brief introduction">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "6rem", alignItems: "start" }}>
          <div>
            {stats.map((s, i) => (
              <div key={s.label} style={{ paddingBottom: i < stats.length - 1 ? "2.5rem" : 0, marginBottom: i < stats.length - 1 ? "2.5rem" : 0, borderBottom: i < stats.length - 1 ? `1px solid ${GOLD}25` : "none" }}>
                <div style={{ fontFamily: "var(--v3-cormorant)", fontSize: "5rem", fontWeight: 300, lineHeight: 1, color: GOLD }}>{s.value}+</div>
                <div style={{ fontSize: "0.65rem", letterSpacing: "0.25em", textTransform: "uppercase", color: MUT, marginTop: "0.5rem" }}>{s.label}</div>
              </div>
            ))}
            <div style={{ marginTop: "3rem", display: "flex", flexDirection: "column", gap: "0.5rem", fontSize: "0.75rem", color: MUT, borderTop: `1px solid ${GOLD}25`, paddingTop: "2rem" }}>
              <span style={{ letterSpacing: "0.1em" }}>📍 {personalInfo.location}</span>
              <span style={{ letterSpacing: "0.1em" }}>🌍 Arabic · English</span>
            </div>
          </div>
          <div>
            <p style={{ fontFamily: "var(--v3-crimson)", fontSize: "1.15rem", lineHeight: 2, color: INK2, marginBottom: "2.5rem", fontStyle: "italic" }}>
              &ldquo;{personalInfo.bio}&rdquo;
            </p>
            <div style={{ borderTop: `1px solid ${GOLD}25`, paddingTop: "2rem" }}>
              <p style={{ fontSize: "0.75rem", letterSpacing: "0.15em", textTransform: "uppercase", color: MUT, marginBottom: "1rem" }}>Education</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.88rem", color: INK2, lineHeight: 1.7 }}>
                <span>Bachelor's Degree in Engineering — El-Shrouk Academy</span>
                <span>ITI Intensive Code Camp — MERN Stack (2024)</span>
              </div>
            </div>
            <div style={{ marginTop: "2.5rem", display: "flex", gap: "2rem" }}>
              {[["GitHub", personalInfo.github], ["LinkedIn", personalInfo.linkedin]].map(([lbl, href]) => (
                <a key={lbl} href={href} target="_blank" rel="noopener noreferrer" style={{ fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: GOLD, textDecoration: "none", borderBottom: `1px solid ${GOLD}50`, paddingBottom: "2px" }}>{lbl} ↗</a>
              ))}
            </div>
          </div>
        </div>
      </V3Sec>

      {/* ── SKILLS ──────────────────────────── */}
      <V3Sec id="v3-skills" num="II" title="Skills & Expertise" subtitle="Areas of mastery">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "3rem" }}>
          {(["frontend", "design", "backend", "tools"] as const).map(cat => {
            const catSkills = skills.filter(s => s.category === cat);
            const labels: Record<string, string> = { frontend: "Frontend Development", design: "UI/UX & Design", backend: "Backend", tools: "Tools & Workflow" };
            return (
              <div key={cat}>
                <h4 style={{ fontFamily: "var(--v3-cormorant)", fontSize: "1.5rem", fontWeight: 400, fontStyle: "italic", color: GOLD, marginBottom: "1.5rem", borderBottom: `1px solid ${GOLD}25`, paddingBottom: "0.75rem" }}>{labels[cat]}</h4>
                <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
                  {catSkills.map((sk, i) => <V3Skill key={sk.name} skill={sk} index={i} />)}
                </div>
              </div>
            );
          })}
        </div>
      </V3Sec>

      {/* ── EXPERIENCE ──────────────────────── */}
      <V3Sec id="v3-exp" num="III" title="Professional Journey" subtitle="A chronicle of work">
        <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
          {experiences.map((exp, i) => <V3Exp key={exp.company} exp={exp} index={i} total={experiences.length} />)}
        </div>
      </V3Sec>

      {/* ── PROJECTS ────────────────────────── */}
      <V3Sec id="v3-projects" num="IV" title="Selected Work" subtitle="Projects I am proud of">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "2.5rem" }}>
          {projects.map((p, i) => <V3Project key={p.title} project={p} index={i} />)}
        </div>
      </V3Sec>

      {/* ── CONTACT ─────────────────────────── */}
      <V3Sec id="v3-contact" num="V" title="Get in Touch" subtitle="Let's create something beautiful">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6rem" }}>
          <div>
            <h3 style={{ fontFamily: "var(--v3-cormorant)", fontSize: "clamp(40px, 5vw, 80px)", fontWeight: 300, lineHeight: 1.1, marginBottom: "2rem" }}>
              Let&apos;s Build<br /><span style={{ fontStyle: "italic", color: GOLD }}>Something Beautiful</span>
            </h3>
            <p style={{ fontFamily: "var(--v3-crimson)", fontSize: "0.95rem", lineHeight: 1.9, color: MUT, marginBottom: "2.5rem" }}>
              I&apos;m always open to new opportunities and interesting projects. Whether you need a senior frontend developer or a UI/UX designer, feel free to reach out.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              {[["Email", personalInfo.email, `mailto:${personalInfo.email}`], ["Phone", personalInfo.phone, `tel:${personalInfo.phone}`]].map(([lbl, val, href]) => (
                <a key={lbl} href={href} style={{ display: "flex", flexDirection: "column", gap: "0.3rem", textDecoration: "none", paddingBottom: "1.5rem", borderBottom: `1px solid ${GOLD}20` }}>
                  <span style={{ fontSize: "0.6rem", letterSpacing: "0.25em", textTransform: "uppercase", color: GOLD }}>{lbl}</span>
                  <span style={{ fontFamily: "var(--v3-crimson)", fontSize: "1rem", color: INK2 }}>{val}</span>
                </a>
              ))}
            </div>
          </div>
          <form onSubmit={e => e.preventDefault()} style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            {(["Name", "Email"] as const).map(f => (
              <div key={f}>
                <label style={{ display: "block", fontSize: "0.6rem", letterSpacing: "0.25em", textTransform: "uppercase", color: GOLD, marginBottom: "0.6rem" }}>{f}</label>
                <input placeholder={f === "Name" ? "Your full name" : "your@email.com"} type={f === "Email" ? "email" : "text"}
                  style={{ width: "100%", background: "transparent", border: "none", borderBottom: `1px solid ${GOLD}40`, padding: "0.6rem 0", color: INK, fontSize: "0.95rem", fontFamily: "var(--v3-crimson)", outline: "none", boxSizing: "border-box" }}
                  onFocus={e => (e.currentTarget.style.borderBottomColor = GOLD)}
                  onBlur={e => (e.currentTarget.style.borderBottomColor = `${GOLD}40`)} />
              </div>
            ))}
            <div>
              <label style={{ display: "block", fontSize: "0.6rem", letterSpacing: "0.25em", textTransform: "uppercase", color: GOLD, marginBottom: "0.6rem" }}>Message</label>
              <textarea placeholder="Tell me about your project..." rows={5}
                style={{ width: "100%", background: `${GOLD}06`, border: `1px solid ${GOLD}25`, padding: "1rem", color: INK, fontSize: "0.95rem", fontFamily: "var(--v3-crimson)", resize: "none", outline: "none", boxSizing: "border-box" }}
                onFocus={e => (e.currentTarget.style.borderColor = `${GOLD}60`)}
                onBlur={e => (e.currentTarget.style.borderColor = `${GOLD}25`)} />
            </div>
            <button type="submit" style={{ padding: "1rem 2.5rem", background: INK, color: BG, border: "none", cursor: "pointer", fontSize: "0.65rem", letterSpacing: "0.25em", textTransform: "uppercase", fontFamily: "var(--v3-crimson)", alignSelf: "flex-start", transition: "background .3s" }}
              onMouseEnter={e => (e.currentTarget.style.background = GOLD)}
              onMouseLeave={e => (e.currentTarget.style.background = INK)}>
              Send Message
            </button>
          </form>
        </div>
      </V3Sec>

      <footer style={{ padding: "2.5rem 4rem", borderTop: `1px solid ${GOLD}25`, display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.62rem", letterSpacing: "0.2em", color: MUT, textTransform: "uppercase" }}>
        <span style={{ fontFamily: "var(--v3-cormorant)", fontSize: "1rem", fontStyle: "italic", letterSpacing: "0.05em", textTransform: "none", color: INK }}>Abdulrhman El-Daly</span>
        <span>© 2025 · All Rights Reserved</span>
      </footer>
    </div>
  );
}

/* ── Sub-components ─────────────────────────────────────────────────────────── */

function V3Sec({ id, num, title, subtitle, children }: { id: string; num: string; title: string; subtitle: string; children: React.ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <section ref={ref} id={id} style={{ padding: "8rem 4rem", borderTop: `1px solid ${GOLD}20`, background: id.includes("skills") || id.includes("exp") ? BG2 : BG }}>
      <motion.div initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
        <div style={{ textAlign: "center", marginBottom: "5rem" }}>
          <p style={{ fontFamily: "var(--v3-crimson)", fontSize: "0.62rem", letterSpacing: "0.35em", textTransform: "uppercase", color: GOLD, marginBottom: "1rem" }}>{num} — {subtitle}</p>
          <h2 style={{ fontFamily: "var(--v3-cormorant)", fontSize: "clamp(32px, 4.5vw, 72px)", fontWeight: 300, lineHeight: 1.1 }}>{title}</h2>
          <div style={{ width: 50, height: 1, background: GOLD, margin: "1.5rem auto 0" }} />
        </div>
        {children}
      </motion.div>
    </section>
  );
}

function V3Skill({ skill, index }: { skill: { name: string; proficiency: number }; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  return (
    <div ref={ref} style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span style={{ fontSize: "0.88rem", color: INK2 }}>{skill.name}</span>
        <span style={{ fontSize: "0.7rem", color: GOLD }}>{skill.proficiency}%</span>
      </div>
      <div style={{ height: "1px", background: `${GOLD}25`, overflow: "hidden" }}>
        <motion.div style={{ height: "100%", background: GOLD, originX: 0 }} initial={{ scaleX: 0 }} animate={inView ? { scaleX: skill.proficiency / 100 } : {}} transition={{ duration: 1.4, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }} />
      </div>
    </div>
  );
}

function V3Exp({ exp, index, total }: { exp: { company: string; role: string; period: string; type: string; bullets: string[] }; index: number; total: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  return (
    <motion.div ref={ref} initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: index * 0.12, duration: 0.7 }}
      style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: "4rem", padding: "3rem 0", borderBottom: index < total - 1 ? `1px solid ${GOLD}20` : "none" }}>
      <div style={{ paddingTop: "0.5rem" }}>
        <p style={{ fontSize: "1rem", color: GOLD, letterSpacing: "0.12em", fontStyle: "italic", fontFamily: "var(--v3-cormorant)" }}>{exp.period}</p>
        <p style={{ fontSize: "0.62rem", letterSpacing: "0.15em", textTransform: "uppercase", color: MUT, marginTop: "0.5rem" }}>{exp.type}</p>
      </div>
      <div>
        <h3 style={{ fontFamily: "var(--v3-cormorant)", fontSize: "1.6rem", fontWeight: 400, color: INK, marginBottom: "0.3rem" }}>{exp.role}</h3>
        <p style={{ fontFamily: "var(--v3-crimson)", fontSize: "0.82rem", color: GOLD, marginBottom: "1.25rem", fontStyle: "italic" }}>{exp.company}</p>
        {exp.bullets.map((b, i) => (
          <p key={i} style={{ fontFamily: "var(--v3-crimson)", fontSize: "0.88rem", color: MUT, lineHeight: 1.85, paddingLeft: "1.2rem", position: "relative", marginBottom: "0.5rem" }}>
            <span style={{ position: "absolute", left: 0, color: `${GOLD}80` }}>—</span>{b}
          </p>
        ))}
      </div>
    </motion.div>
  );
}

function V3Project({ project, index }: { project: { title: string; description: string; tech: string[] }; index: number }) {
  const [hov, setHov] = useState(false);
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.08, duration: 0.7 }}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ padding: "2.5rem", border: `1px solid ${hov ? GOLD : `${GOLD}25`}`, background: hov ? `${GOLD}05` : "transparent", transition: "all 0.4s ease", cursor: "pointer" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem" }}>
        <span style={{ fontFamily: "var(--v3-cormorant)", fontSize: "3.5rem", fontWeight: 300, lineHeight: 1, color: hov ? GOLD : `${GOLD}25`, transition: "color .4s" }}>{String(index + 1).padStart(2, "0")}</span>
        <span style={{ fontSize: "0.62rem", letterSpacing: "0.2em", color: GOLD, opacity: hov ? 1 : 0, transition: "opacity .4s", textTransform: "uppercase" }}>View ↗</span>
      </div>
      <h3 style={{ fontFamily: "var(--v3-cormorant)", fontSize: "1.4rem", fontWeight: 400, marginBottom: "0.75rem", color: hov ? INK : INK2, transition: "color .3s" }}>{project.title}</h3>
      <p style={{ fontFamily: "var(--v3-crimson)", fontSize: "0.88rem", color: MUT, lineHeight: 1.8, marginBottom: "1.5rem" }}>{project.description}</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
        {project.tech.map(t => <span key={t} style={{ fontSize: "0.6rem", letterSpacing: "0.12em", padding: "0.25rem 0.7rem", border: `1px solid ${GOLD}30`, color: GOLD, textTransform: "uppercase" }}>{t}</span>)}
      </div>
    </motion.div>
  );
}
