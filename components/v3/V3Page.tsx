"use client";
import { useRef, useState, useEffect } from "react";
import {
  motion,
  useInView,
  useScroll,
  useMotionValueEvent,
  useTransform,
  useMotionValue,
  animate,
  type MotionValue,
} from "framer-motion";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import Image from "next/image";
import AnimatedShaderBackground from "@/components/ui/AnimatedShaderBackground";

function useResponsive() {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const update = () => setWidth(window.innerWidth);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return { isMobile: width > 0 && width < 768, isTablet: width >= 768 && width < 1024 };
}

const sg = Space_Grotesk({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--v3-sg",
});
const jb = JetBrains_Mono({
  weight: ["300", "400", "500"],
  subsets: ["latin"],
  variable: "--v3-jb",
});

type Cat = "frontend" | "design" | "backend" | "db" | "tools";
interface CatStyle {
  c: string;
  rgb: string;
  label: string;
}
export interface V3Palette {
  bg: string;
  s1: string;
  s2: string;
  br: string;
  pri: string;
  priRgb: string;
  sec: string;
  secRgb: string;
  fg: string;
  muted: string;
  cats: Record<Cat, CatStyle>;
}

export const PALETTE_ORANGE: V3Palette = {
  bg: "#07090F",
  s1: "#0C1120",
  s2: "#0F1729",
  br: "#1E293B",
  pri: "#F97316",
  priRgb: "249,115,22",
  sec: "#3B82F6",
  secRgb: "59,130,246",
  fg: "#F1F5F9",
  muted: "#64748B",
  cats: {
    frontend: { c: "#F97316", rgb: "249,115,22", label: "Frontend" },
    design: { c: "#A855F7", rgb: "168,85,247", label: "Design" },
    backend: { c: "#3B82F6", rgb: "59,130,246", label: "Backend" },
    db: { c: "#06B6D4", rgb: "6,182,212", label: "Database" },
    tools: { c: "#22C55E", rgb: "34,197,94", label: "Tools" },
  },
};
export const PALETTE_BLUE: V3Palette = {
  bg: "#070912",
  s1: "#0A0F1E",
  s2: "#0D1428",
  br: "#1A2744",
  pri: "#60A5FA",
  priRgb: "96,165,250",
  sec: "#06B6D4",
  secRgb: "6,182,212",
  fg: "#F1F5F9",
  muted: "#4D6A8A",
  cats: {
    frontend: { c: "#60A5FA", rgb: "96,165,250", label: "Frontend" },
    design: { c: "#818CF8", rgb: "129,140,248", label: "Design" },
    backend: { c: "#06B6D4", rgb: "6,182,212", label: "Backend" },
    db: { c: "#2DD4BF", rgb: "45,212,191", label: "Database" },
    tools: { c: "#22C55E", rgb: "34,197,94", label: "Tools" },
  },
};
export const PALETTE_VIOLET: V3Palette = {
  bg: "#08060F",
  s1: "#0E0A1C",
  s2: "#120D24",
  br: "#2A1A44",
  pri: "#A78BFA",
  priRgb: "167,139,250",
  sec: "#EC4899",
  secRgb: "236,72,153",
  fg: "#F5F0FF",
  muted: "#6B5A80",
  cats: {
    frontend: { c: "#A78BFA", rgb: "167,139,250", label: "Frontend" },
    design: { c: "#EC4899", rgb: "236,72,153", label: "Design" },
    backend: { c: "#818CF8", rgb: "129,140,248", label: "Backend" },
    db: { c: "#C084FC", rgb: "192,132,252", label: "Database" },
    tools: { c: "#2DD4BF", rgb: "45,212,191", label: "Tools" },
  },
};
export const PALETTE_TEAL: V3Palette = {
  bg: "#050E0C",
  s1: "#091612",
  s2: "#0C1D18",
  br: "#153025",
  pri: "#34D399",
  priRgb: "52,211,153",
  sec: "#06B6D4",
  secRgb: "6,182,212",
  fg: "#F0FDF8",
  muted: "#4B7A68",
  cats: {
    frontend: { c: "#34D399", rgb: "52,211,153", label: "Frontend" },
    design: { c: "#06B6D4", rgb: "6,182,212", label: "Design" },
    backend: { c: "#22D3EE", rgb: "34,211,238", label: "Backend" },
    db: { c: "#60A5FA", rgb: "96,165,250", label: "Database" },
    tools: { c: "#A78BFA", rgb: "167,139,250", label: "Tools" },
  },
};
export const PALETTE_WARM: V3Palette = {
  bg: "#0A080C",
  s1: "#120E18",
  s2: "#181220",
  br: "#2E2040",
  pri: "#C9983A",
  priRgb: "201,152,58",
  sec: "#7C5BBF",
  secRgb: "124,91,191",
  fg: "#F5F0E8",
  muted: "#6B5C4A",
  cats: {
    frontend: { c: "#C9983A", rgb: "201,152,58", label: "Frontend" },
    design: { c: "#7C5BBF", rgb: "124,91,191", label: "Design" },
    backend: { c: "#E07B39", rgb: "224,123,57", label: "Backend" },
    db: { c: "#A08050", rgb: "160,128,80", label: "Database" },
    tools: { c: "#9B6FC5", rgb: "155,111,197", label: "Tools" },
  },
};

// ── Skills ────────────────────────────────────────────────────────────────────
const SKILLS: { name: string; cat: Cat; prof: number }[] = [
  { name: "Git/GitHub", cat: "tools", prof: 90 },
  { name: "Docker", cat: "tools", prof: 70 },
  { name: "Jest", cat: "tools", prof: 80 },
  { name: "MongoDB", cat: "db", prof: 70 },
  { name: "Redis", cat: "db", prof: 68 },
  { name: "PostgreSQL", cat: "db", prof: 75 },
  { name: "Express.js", cat: "backend", prof: 75 },
  { name: "Node.js", cat: "backend", prof: 75 },
  { name: "NestJS", cat: "backend", prof: 80 },
  { name: "Spring Boot", cat: "backend", prof: 80 },
  { name: "Figma", cat: "design", prof: 88 },
  { name: "Material UI", cat: "design", prof: 85 },
  { name: "Shadcn UI", cat: "design", prof: 90 },
  { name: "Tailwind CSS", cat: "design", prof: 92 },
  { name: "HTML5/CSS3", cat: "frontend", prof: 95 },
  { name: "Framer Motion", cat: "frontend", prof: 80 },
  { name: "React Query", cat: "frontend", prof: 85 },
  { name: "Redux Toolkit", cat: "frontend", prof: 85 },
  { name: "JavaScript", cat: "frontend", prof: 95 },
  { name: "TypeScript", cat: "frontend", prof: 90 },
  { name: "Next.js", cat: "frontend", prof: 90 },
  { name: "React.js", cat: "frontend", prof: 95 },
  { name: "Java", cat: "backend", prof: 78 },
  { name: "REST API", cat: "backend", prof: 85 },
  { name: "SEO", cat: "tools", prof: 82 },
  { name: "Performance", cat: "tools", prof: 86 },
  { name: "Responsive Design", cat: "design", prof: 92 },
  { name: "Data Visualization", cat: "frontend", prof: 78 },
  { name: "Accessibility", cat: "design", prof: 80 },
];

const FRUITS = [
  { x: 218, y: 468, si: 0 }, // Git/GitHub
  { x: 400, y: 487, si: 1 }, // Docker
  { x: 582, y: 468, si: 2 }, // Jest
  { x: 122, y: 399, si: 3 }, // MongoDB
  { x: 268, y: 385, si: 4 }, // Redis
  { x: 532, y: 385, si: 5 }, // PostgreSQL
  { x: 678, y: 402, si: 9 }, // Spring Boot
  { x: 84, y: 322, si: 6 }, // Express.js
  { x: 228, y: 308, si: 7 }, // Node.js
  { x: 572, y: 308, si: 8 }, // NestJS
  { x: 62, y: 245, si: 10 }, // Figma
  { x: 196, y: 229, si: 11 }, // Material UI
  { x: 548, y: 236, si: 12 }, // Shadcn UI
  { x: 742, y: 286, si: 13 }, // Tailwind CSS
  { x: 88, y: 172, si: 14 }, // HTML5/CSS3
  { x: 214, y: 144, si: 15 }, // Framer Motion
  { x: 596, y: 150, si: 16 }, // React Query
  { x: 712, y: 175, si: 17 }, // Redux Toolkit
  { x: 178, y: 108, si: 18 }, // JavaScript
  { x: 400, y: 91, si: 19 }, // TypeScript
  { x: 668, y: 102, si: 20 }, // Next.js
  { x: 400, y: 38, si: 21 }, // React.js (crown)
  { x: 718, y: 322, si: 22 }, // Java
  { x: 688, y: 468, si: 23 }, // REST API
  { x: 300, y: 86, si: 24 }, // SEO
  { x: 504, y: 112, si: 25 }, // Performance
  { x: 348, y: 190, si: 26 }, // Responsive Design
  { x: 486, y: 198, si: 27 }, // Data Visualization
  { x: 690, y: 214, si: 28 }, // Accessibility
];

// ── Experience ────────────────────────────────────────────────────────────────
const EXPS = [
  {
    company: "World of Systems",
    role: "Senior Frontend Developer",
    period: "Dec 2024 – Present",
    type: "Remote",
    leadership: true,
    location: "Cairo, Egypt",
    bullets: [
      "Mentoring junior frontend developers through structured code reviews and pair programming — improving team delivery speed by 20%.",
      "Established clean-code standards and SOLID review culture across the entire codebase.",
      "Leading design-to-code workflow, transforming complex Figma prototypes into high-performance Shadcn UI components.",
      "Optimised state management and frontend architecture, reducing initial page load times by 30%.",
    ],
  },
  {
    company: "BlackStone eIT",
    role: "Frontend Developer",
    period: "June 2024 – Nov 2024",
    type: "Project Based",
    leadership: false,
    location: "Riyadh, KSA",
    bullets: [
      "Built the GovAcademy Workspace Dashboard using Next.js and Redux with complex data visualisation and Material UI.",
      "Collaborated with the design team to ensure all UI components meet accessibility standards.",
    ],
  },
  {
    company: "AsgaTech",
    role: "Frontend Developer",
    period: "Aug 2022 – Jan 2024",
    type: "Full-time",
    leadership: false,
    location: "Cairo, Egypt",
    bullets: [
      "Optimised data fetching with React Query and Redux, significantly enhancing application performance.",
      "Built a reusable component analysis tool that cut new-feature development time.",
    ],
  },
  {
    company: "Remote & Independent",
    role: "Frontend Developer",
    period: "Feb 2021 – May 2022",
    type: "Freelance",
    leadership: false,
    location: "Remote",
    bullets: [
      "Led frontend development for Cordital marketing platform; cross-browser compatible.",
      "Engineered Qomra — a performance-optimised, SEO-friendly cultural website.",
      "Built multiple e-commerce and corporate platforms with React.js.",
    ],
  },
];

const STATS = [
  { v: "5+", l: "Years Experience" },
  { v: "10+", l: "Projects Shipped" },
  { v: "8+", l: "Juniors Mentored" },
  { v: "4", l: "Companies" },
];

const PROJECTS = [
  {
    title: "Rakam",
    description:
      "Multi-tenant SaaS platform for agencies — project & task management, CRM & client pipeline, full finance module (invoices, PDF export, salary), HR & workforce (attendance, leave, resource allocation), and a comprehensive reports hub. Built with isolated tenant data, RBAC, and customizable branding per organization.",
    tech: [
      "Next.js 16",
      "React 19",
      "PostgreSQL",
      "NestJS",
      "RBAC",
      "Redis",
      "Docker",
    ],
    badge: "★ Product Owner",
    featured: true,
    image: "/projects/rakam.png",
  },
  {
    title: "AlBootcamp",
    description:
      "Online coding bootcamp platform with course management, student progress tracking, cohort tools, and community features.",
    tech: ["React.js", "Node.js", "MongoDB", "Redux"],
    badge: "EdTech",
    image: "/projects/albootcamp.png",
  },
  {
    title: "El Matba5",
    description:
      "Food ordering and restaurant management platform with menu management, real-time order tracking, and delivery coordination.",
    tech: ["React.js", "Redux", "REST API", "Responsive"],
    badge: "Food Tech",
    image: "/projects/elmatba5.png",
  },
  {
    title: "Chambers Portal",
    description:
      "Government electronic portal for Saudi chambers of commerce — electronic applications, membership management, and certificate issuance.",
    tech: ["Next.js", "TypeScript", "Tailwind", "Redux"],
    badge: "Gov · Enterprise",
    image: "/projects/chambers.png",
  },
  {
    title: "GovAcademy",
    description:
      "Workspace dashboard for a UAE government academy — talent profiles, job management, IDP, scholarship services, and complex data visualization.",
    tech: ["Next.js", "Material UI", "Redux", "Data Viz"],
    badge: "Gov · Enterprise",
    image: "/projects/dge.jpg",
  },
  {
    title: "Wildlife Services",
    description:
      "Official Saudi government platform for wildlife — import/export permits and the Fitri platform. SEO-optimised, bilingual.",
    tech: ["Next.js", "TypeScript", "SEO", "Responsive"],
    badge: "Gov Platform",
    image: "/projects/wildlife.png",
  },
  {
    title: "Hemmah",
    description:
      "Housekeeper services platform with service packages, order management, e-services, bilingual flows, and REST API integration.",
    tech: ["React.js", "Redux", "REST API", "Responsive"],
    badge: "Services",
    image: "/projects/hemmah.png",
  },
  {
    title: "Qomra",
    description:
      "Performance-optimised cultural and tourism website showcasing Saudi Arabia through its people's eyes with SEO-first delivery.",
    tech: ["React.js", "SEO", "Performance", "Responsive"],
    badge: "Culture",
    image: "/projects/qomra.jpg",
  },
  {
    title: "Cordital",
    description:
      "B2B full-funnel marketing platform focused on sustainable revenue growth, responsive UI, and cross-browser compatibility.",
    tech: ["React.js", "CSS3", "Performance", "Responsive"],
    badge: "B2B",
    image: "/projects/cordital.jpg",
  },
  {
    title: "Handesly",
    description:
      "MERN Stack platform for architectural engineers. Designed the complete UI/UX in Figma and built the full frontend from scratch.",
    tech: ["React.js", "Node.js", "MongoDB", "Figma"],
    badge: "Full-Stack",
  },
  {
    title: "ZeroOne Academy",
    description:
      "Robotics academy website with advanced Framer Motion animations for an immersive, modern learning experience.",
    tech: ["Next.js", "Framer Motion", "Tailwind CSS"],
    badge: "EdTech",
    image: "/projects/zeroone.jpg",
  },
];

// ══════════════════════════════════════════════════════════════════════════════
//  NAV
// ══════════════════════════════════════════════════════════════════════════════
function V3Nav({ p }: { p: V3Palette }) {
  const { isMobile } = useResponsive();
  const links = [
    ["About", "#v3-about"],
    ["Skills", "#v3-skills"],
    ["Experience", "#v3-exp"],
    ["Projects", "#v3-projects"],
    ["Contact", "#v3-contact"],
  ];
  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 300,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: isMobile ? "1rem 1.5rem" : "1.1rem 3rem",
        background: `${p.bg}E8`,
        backdropFilter: "blur(20px)",
        borderBottom: `1px solid ${p.br}`,
      }}>
      <a
        href="#v3-home"
        style={{
          fontFamily: "var(--v3-sg)",
          fontWeight: 700,
          fontSize: "1.1rem",
          color: p.pri,
          textDecoration: "none",
          letterSpacing: "0.04em",
        }}>
        AD<span style={{ color: p.muted }}>.</span>
      </a>
      {!isMobile && (
        <nav style={{ display: "flex", gap: "2rem" }}>
          {links.map(([l, h]) => (
            <a
              key={l}
              href={h}
              style={{
                fontSize: "0.72rem",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: p.muted,
                textDecoration: "none",
                transition: "color .2s",
                fontFamily: "var(--v3-jb)",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = p.fg)}
              onMouseLeave={(e) => (e.currentTarget.style.color = p.muted)}>
              {l}
            </a>
          ))}
        </nav>
      )}
      {isMobile && (
        <nav style={{ display: "flex", gap: "1.2rem" }}>
          {links.slice(0, 3).map(([l, h]) => (
            <a
              key={l}
              href={h}
              style={{
                fontSize: "0.6rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: p.muted,
                textDecoration: "none",
                fontFamily: "var(--v3-jb)",
              }}>
              {l}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
//  HERO
// ══════════════════════════════════════════════════════════════════════════════
const BADGES = [
  { text: "React.js", x: "108%", y: "18%", delay: 1.2 },
  { text: "Next.js", x: "-32%", y: "28%", delay: 1.4 },
  { text: "Spring Boot", x: "110%", y: "54%", delay: 1.6 },
  { text: "TypeScript", x: "-30%", y: "62%", delay: 1.8 },
  { text: "NestJS", x: "105%", y: "78%", delay: 2.0 },
  { text: "PostgreSQL", x: "-28%", y: "80%", delay: 2.2 },
];

function V3Hero({ p }: { p: V3Palette }) {
  const { isMobile } = useResponsive();

  const techStack = [
    { label: "React.js", color: p.cats.frontend.c },
    { label: "Next.js", color: p.cats.frontend.c },
    { label: "TypeScript", color: p.cats.frontend.c },
    { label: "Spring Boot", color: p.cats.backend.c },
    { label: "NestJS", color: p.cats.backend.c },
    { label: "PostgreSQL", color: p.cats.db.c },
  ];

  return (
    <section
      id="v3-home"
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: isMobile ? "7rem 1.5rem 5rem" : "8rem 3rem 5rem",
        position: "relative",
        overflow: "hidden",
        background: p.bg,
      }}>

      {/* Shader aurora — base layer */}
      <AnimatedShaderBackground opacity={0.6} />

      {/* Dark vignette so text stays legible over aurora */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse at center, ${p.bg}55 0%, ${p.bg}CC 55%, ${p.bg}F5 100%)`,
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      {/* Subtle grid overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `linear-gradient(${p.br}33 1px,transparent 1px),linear-gradient(90deg,${p.br}33 1px,transparent 1px)`,
          backgroundSize: "48px 48px",
          opacity: 0.5,
          pointerEvents: "none",
          zIndex: 2,
        }}
      />

      {/* Content */}
      <div
        style={{
          position: "relative",
          zIndex: 3,
          maxWidth: "860px",
          width: "100%",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}>

        {/* Label with side lines */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            marginBottom: isMobile ? "1.5rem" : "2rem",
          }}>
          <div style={{ flex: 1, height: "1px", background: `linear-gradient(to right, transparent, ${p.pri}50)` }} />
          <span style={{
            fontFamily: "var(--v3-jb)",
            fontSize: "0.6rem",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: p.pri,
          }}>
            Senior Frontend Developer · Full-Stack Engineer
          </span>
          <div style={{ flex: 1, height: "1px", background: `linear-gradient(to left, transparent, ${p.pri}50)` }} />
        </motion.div>

        {/* Name */}
        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 1, ease: [0.22, 1, 0.36, 1] }}
          style={{
            fontFamily: "var(--v3-sg)",
            fontSize: isMobile ? "clamp(52px,14vw,72px)" : "clamp(64px,8vw,110px)",
            fontWeight: 700,
            lineHeight: 1.0,
            letterSpacing: "-0.04em",
            marginBottom: "0.1em",
          }}>
          Abdulrhman
        </motion.h1>
        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.48, duration: 1, ease: [0.22, 1, 0.36, 1] }}
          style={{
            fontFamily: "var(--v3-sg)",
            fontSize: isMobile ? "clamp(52px,14vw,72px)" : "clamp(64px,8vw,110px)",
            fontWeight: 700,
            lineHeight: 1.0,
            letterSpacing: "-0.04em",
            color: "transparent",
            WebkitTextStroke: `2px ${p.pri}`,
            marginBottom: isMobile ? "1.5rem" : "2.5rem",
          }}>
          El-Daly
        </motion.h1>

        {/* Bio */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.7 }}
          style={{
            fontFamily: "var(--v3-sg)",
            fontSize: isMobile ? "0.88rem" : "1.05rem",
            lineHeight: 1.8,
            color: `${p.fg}AA`,
            maxWidth: "560px",
            marginBottom: isMobile ? "2rem" : "3rem",
          }}>
          5+ years crafting high-performance web applications — from
          pixel-perfect frontends to scalable Spring Boot &amp; NestJS backends.
          I mentor teams, lead design systems, and ship products that matter.
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.88, duration: 0.5 }}
          style={{
            display: "flex",
            gap: "1rem",
            flexWrap: "wrap",
            justifyContent: "center",
            marginBottom: isMobile ? "2rem" : "3rem",
          }}>
          <a
            href="#v3-projects"
            style={{
              padding: "0.9rem 2.4rem",
              background: p.pri,
              color: p.bg,
              textDecoration: "none",
              fontSize: "0.72rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              fontFamily: "var(--v3-jb)",
              borderRadius: "4px",
              fontWeight: 700,
              transition: "opacity .2s, box-shadow .2s",
              boxShadow: `0 0 24px ${p.pri}40`,
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.opacity = "0.85";
              (e.currentTarget as HTMLElement).style.boxShadow = `0 0 40px ${p.pri}70`;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.opacity = "1";
              (e.currentTarget as HTMLElement).style.boxShadow = `0 0 24px ${p.pri}40`;
            }}>
            View Projects
          </a>
          <a
            href="#v3-contact"
            style={{
              padding: "0.9rem 2.4rem",
              background: `${p.s2}CC`,
              border: `1px solid ${p.br}`,
              color: p.fg,
              textDecoration: "none",
              fontSize: "0.72rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              fontFamily: "var(--v3-jb)",
              borderRadius: "4px",
              backdropFilter: "blur(12px)",
              transition: "border-color .2s, color .2s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = p.pri;
              (e.currentTarget as HTMLElement).style.color = p.pri;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = p.br;
              (e.currentTarget as HTMLElement).style.color = p.fg;
            }}>
            Get in Touch
          </a>
        </motion.div>

        {/* Social links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.05 }}
          style={{ display: "flex", gap: "2rem", marginBottom: isMobile ? "2.5rem" : "3.5rem" }}>
          {[
            ["GitHub", "https://github.com/dalyDev-js"],
            ["LinkedIn", "https://linkedin.com/in/abdulrhman-eldaly"],
          ].map(([l, h]) => (
            <a
              key={l}
              href={h}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: "0.65rem",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: p.muted,
                textDecoration: "none",
                fontFamily: "var(--v3-jb)",
                transition: "color .2s",
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = p.pri)}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = p.muted)}>
              {l} ↗
            </a>
          ))}
        </motion.div>

        {/* Tech stack pills */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.6 }}
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.6rem",
            justifyContent: "center",
          }}>
          {techStack.map(({ label, color }) => (
            <span
              key={label}
              style={{
                fontFamily: "var(--v3-jb)",
                fontSize: "0.6rem",
                letterSpacing: "0.08em",
                color,
                background: `${color}12`,
                border: `1px solid ${color}30`,
                borderRadius: "6px",
                padding: "0.3rem 0.8rem",
                backdropFilter: "blur(8px)",
              }}>
              {label}
            </span>
          ))}
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5 }}
        style={{
          position: "absolute",
          bottom: "2.5rem",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "8px",
        }}>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{
            width: 1,
            height: 48,
            background: `linear-gradient(to bottom,transparent,${p.pri})`,
          }}
        />
        <span
          style={{
            fontFamily: "var(--v3-jb)",
            fontSize: "0.55rem",
            letterSpacing: "0.25em",
            color: p.muted,
            textTransform: "uppercase",
          }}>
          Scroll
        </span>
      </motion.div>
    </section>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
//  ABOUT
// ══════════════════════════════════════════════════════════════════════════════
function V3About({ p }: { p: V3Palette }) {
  const { isMobile } = useResponsive();
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const statColors = [p.pri, p.cats.backend.c, p.cats.design.c, p.cats.db.c];

  return (
    <section
      ref={ref}
      id="v3-about"
      style={{
        background: p.s1,
        padding: isMobile ? "4rem 1.5rem" : "7rem 3rem",
        position: "relative",
        overflow: "hidden",
      }}>
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "1px",
          background: `linear-gradient(to right,transparent,${p.pri}30,transparent)`,
        }}
      />
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              marginBottom: "4rem",
            }}>
            <span
              style={{
                fontFamily: "var(--v3-jb)",
                fontSize: "0.6rem",
                letterSpacing: "0.3em",
                color: p.pri,
              }}>
              01 / ABOUT
            </span>
            <div
              style={{
                flex: 1,
                height: "1px",
                background: `linear-gradient(to right,${p.pri}30,transparent)`,
              }}
            />
          </div>

          {/* Stats */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "repeat(2,1fr)" : "repeat(4,1fr)",
              gap: "1.2rem",
              marginBottom: isMobile ? "3rem" : "5rem",
            }}>
            {STATS.map((s, i) => (
              <motion.div
                key={s.l}
                initial={{ opacity: 0, y: 40 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  delay: i * 0.1,
                  duration: 0.6,
                  ease: [0.22, 1, 0.36, 1],
                }}
                whileHover={{ y: -6, scale: 1.02 }}
                style={{
                  background: p.s2,
                  border: `1px solid ${statColors[i]}25`,
                  borderRadius: "12px",
                  padding: "1.8rem 1.5rem",
                  position: "relative",
                  overflow: "hidden",
                  boxShadow: `0 4px 24px rgba(0,0,0,0.3)`,
                  cursor: "default",
                }}>
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    width: 80,
                    height: 80,
                    background: `radial-gradient(circle at top right,${statColors[i]}15,transparent)`,
                    pointerEvents: "none",
                  }}
                />
                <div
                  style={{
                    fontFamily: "var(--v3-sg)",
                    fontSize: "2.8rem",
                    fontWeight: 700,
                    color: statColors[i],
                    lineHeight: 1,
                    marginBottom: "0.5rem",
                  }}>
                  {s.v}
                </div>
                <div
                  style={{
                    fontFamily: "var(--v3-jb)",
                    fontSize: "0.62rem",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    color: p.muted,
                  }}>
                  {s.l}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Left: bio + leadership | Right: portrait only */}
          {/* alignItems stretch so left column matches portrait height */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
              gap: isMobile ? "2rem" : "4rem",
              alignItems: "stretch",
            }}>
            {/* Left — fills full height, space-between pushes leadership card to bottom */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                gap: "2rem",
              }}>
              <div>
                <h2
                  style={{
                    fontFamily: "var(--v3-sg)",
                    fontSize: "clamp(28px,3vw,44px)",
                    fontWeight: 700,
                    letterSpacing: "-0.02em",
                    marginBottom: "1.5rem",
                    lineHeight: 1.2,
                  }}>
                  Full-Stack Engineer
                  <br />
                  <span style={{ color: p.pri }}>&amp; Design Thinker</span>
                </h2>
                <p
                  style={{
                    fontFamily: "var(--v3-sg)",
                    fontSize: "0.95rem",
                    lineHeight: 1.85,
                    color: p.muted,
                    marginBottom: "1.5rem",
                  }}>
                  Senior Frontend Developer and Full-Stack Engineer with over 5
                  years of experience. Expert in React.js and Next.js with deep
                  backend experience in Java, Spring Boot, NestJS, and
                  PostgreSQL. Proven track record in technical leadership,
                  mentoring junior developers, and building advanced design
                  systems.
                </p>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                    gap: "0.75rem",
                    fontSize: "0.8rem",
                    color: p.muted,
                    fontFamily: "var(--v3-jb)",
                  }}>
                  {[
                    ["🎓", "El-Shrouk Academy · ITI"],
                    ["🌍", "Arabic · English"],
                    ["✉️", "abdulrhman.eldaly@gmail.com"],
                  ].map(([icon, val]) => (
                    <div
                      key={val}
                      style={{
                        display: "flex",
                        gap: "8px",
                        alignItems: "flex-start",
                      }}>
                      <span>{icon}</span>
                      <span style={{ lineHeight: 1.5 }}>{val}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Leadership card */}
              <div
                style={{
                  background: `${p.pri}08`,
                  border: `1px solid ${p.pri}25`,
                  borderRadius: "12px",
                  padding: "1.75rem",
                  position: "relative",
                  overflow: "hidden",
                }}>
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    width: 100,
                    height: 100,
                    background: `radial-gradient(circle at top right,${p.pri}12,transparent)`,
                  }}
                />
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginBottom: "1.2rem",
                  }}>
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: p.pri,
                      boxShadow: `0 0 8px ${p.pri}`,
                    }}
                  />
                  <span
                    style={{
                      fontFamily: "var(--v3-jb)",
                      fontSize: "0.6rem",
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                      color: p.pri,
                    }}>
                    Technical Leadership
                  </span>
                </div>
                <p
                  style={{
                    fontFamily: "var(--v3-sg)",
                    fontSize: "0.88rem",
                    lineHeight: 1.7,
                    color: `${p.fg}BB`,
                    marginBottom: "1.2rem",
                  }}>
                  Leading and mentoring junior developers through structured
                  code reviews, pair programming sessions, and clear technical
                  standards — building teams that ship with confidence.
                </p>
                <div style={{ display: "flex", gap: "1.5rem" }}>
                  {[
                    ["20%", "Faster Delivery"],
                    ["8+", "Devs Mentored"],
                    ["30%", "Load Time Cut"],
                  ].map(([v, l]) => (
                    <div key={l}>
                      <div
                        style={{
                          fontFamily: "var(--v3-sg)",
                          fontSize: "1.4rem",
                          fontWeight: 700,
                          color: p.pri,
                        }}>
                        {v}
                      </div>
                      <div
                        style={{
                          fontFamily: "var(--v3-jb)",
                          fontSize: "0.55rem",
                          letterSpacing: "0.12em",
                          color: p.muted,
                          textTransform: "uppercase",
                        }}>
                        {l}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: portrait — corner brackets are on a tight wrapper matching card size */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{
                delay: 0.3,
                duration: 0.8,
                ease: [0.22, 1, 0.36, 1],
              }}
              style={{
                position: "relative",
                display: "flex",
                justifyContent: "center",
                alignItems: "stretch",
              }}>
              {/* Ambient glow behind portrait */}
              <div
                style={{
                  position: "absolute",
                  inset: "10%",
                  borderRadius: "50%",
                  background: `radial-gradient(circle,rgba(${p.priRgb},0.12) 0%,rgba(${p.secRgb},0.06) 50%,transparent 70%)`,
                  filter: "blur(30px)",
                  pointerEvents: "none",
                }}
              />
              {/* Tight wrapper — corners sit exactly on the card edges */}
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  maxWidth: isMobile ? "300px" : "420px",
                  display: "flex",
                  flexDirection: "column",
                }}>
                {/* Corner top-left — inside tight wrapper */}
                <div
                  style={{
                    position: "absolute",
                    top: -8,
                    left: -8,
                    width: 36,
                    height: 36,
                    borderTop: `2px solid ${p.pri}90`,
                    borderLeft: `2px solid ${p.pri}90`,
                    borderRadius: "5px 0 0 0",
                    zIndex: 2,
                    pointerEvents: "none",
                  }}
                />
                {/* Corner bottom-right */}
                <div
                  style={{
                    position: "absolute",
                    bottom: -8,
                    right: -8,
                    width: 36,
                    height: 36,
                    borderBottom: `2px solid ${p.pri}70`,
                    borderRight: `2px solid ${p.pri}70`,
                    borderRadius: "0 0 5px 0",
                    zIndex: 2,
                    pointerEvents: "none",
                  }}
                />
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  style={{
                    position: "relative",
                    borderRadius: "16px",
                    overflow: "hidden",
                    border: `1px solid ${p.br}`,
                    flex: 1,
                  }}>
                  <Image
                    src="/v3-side.png"
                    alt="Abdulrhman El-Daly"
                    width={420}
                    height={600}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      objectPosition: "center top",
                      background: p.s2,
                      display: "block",
                    }}
                  />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
//  SKILL TREE — natural tree SVG + scroll-revealed skill leaf badges
// ══════════════════════════════════════════════════════════════════════════════
// Positions as % of tree image (x: 10-90%, y: 4-66% for canopy area)
// Derived from FRUITS array mapped to the 1625x1713 tree viewBox canopy zone
const LEAF_NODES = FRUITS.map((f) => ({
  x: 10 + (f.x / 800) * 80,
  y: 4 + (f.y / 560) * 62,
  si: f.si,
}));

function V3SkillTree({ p }: { p: V3Palette }) {
  const { isMobile } = useResponsive();
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: false, margin: "-80px" });

  return (
    <section
      ref={ref}
      id="v3-skills"
      style={{
        background: p.bg,
        padding: "5rem 0 3rem",
        position: "relative",
        overflow: "hidden",
      }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `linear-gradient(${p.br}22 1px,transparent 1px),linear-gradient(90deg,${p.br}22 1px,transparent 1px)`,
          backgroundSize: "40px 40px",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          padding: isMobile ? "0 1.5rem" : "0 3rem",
          maxWidth: "1200px",
          margin: "0 auto 2rem",
        }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            marginBottom: "1rem",
          }}>
          <span
            style={{
              fontFamily: "var(--v3-jb)",
              fontSize: "0.6rem",
              letterSpacing: "0.3em",
              color: p.pri,
            }}>
            02 / SKILLS
          </span>
          <div
            style={{
              flex: 1,
              height: "1px",
              background: `linear-gradient(to right,${p.pri}30,transparent)`,
            }}
          />
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          style={{
            fontFamily: "var(--v3-sg)",
            fontSize: "clamp(28px,3.5vw,52px)",
            fontWeight: 700,
            letterSpacing: "-0.02em",
          }}>
          Full-Stack <span style={{ color: p.pri }}>Skill Tree</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          style={{
            fontFamily: "var(--v3-sg)",
            fontSize: "0.9rem",
            color: p.muted,
            marginTop: "0.5rem",
          }}>
          Every layer of the stack — from roots to crown
        </motion.p>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          maxWidth: "1200px",
          margin: "0 auto",
          padding: isMobile ? "0 1.5rem" : "0 2rem",
          gap: "2rem",
          alignItems: isMobile ? "stretch" : "center",
        }}>
        {/* Natural tree image with skill-badge leaves overlaid */}
        <div
          style={{
            flex: "0 0 auto",
            width: isMobile ? "100%" : "min(620px,66%)",
            position: "relative",
          }}>
          {/* Ambient glow behind tree */}
          <div
            style={{
              position: "absolute",
              inset: "5%",
              borderRadius: "50%",
              background: `radial-gradient(circle,rgba(${p.priRgb},0.07) 0%,rgba(142,218,31,0.05) 50%,transparent 70%)`,
              filter: "blur(24px)",
              pointerEvents: "none",
            }}
          />
          <motion.img
            src="/colorful-tree.svg"
            alt="Skill Tree"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            style={{
              width: "100%",
              height: "auto",
              display: "block",
              position: "relative",
              zIndex: 0,
            }}
          />
          {/* Skill leaf badges — pop in staggered on scroll */}
          {LEAF_NODES.map((node, i) => {
            const skill = SKILLS[node.si];
            const cat = p.cats[skill.cat];
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: `${node.x}%`,
                  top: `${node.y}%`,
                  transform: "translate(-50%,-50%)",
                  zIndex: 2,
                }}>
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={inView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
                  transition={{
                    delay: 0.6 + i * 0.09,
                    type: "spring",
                    stiffness: 340,
                    damping: 16,
                  }}
                  whileHover={{ scale: 1.15, zIndex: 10 }}
                  style={{
                    background: `rgba(${cat.rgb},0.92)`,
                    border: `1.5px solid rgba(255,255,255,0.35)`,
                    borderRadius: "12px",
                    padding: "3px 7px",
                    fontSize: "0.46rem",
                    fontFamily: "var(--v3-jb)",
                    color: "#050a06",
                    fontWeight: 700,
                    whiteSpace: "nowrap",
                    boxShadow: `0 2px 14px rgba(${cat.rgb},0.5),0 0 0 2px rgba(${cat.rgb},0.18)`,
                    cursor: "default",
                    letterSpacing: "0.04em",
                    userSelect: "none",
                  }}>
                  {skill.name}
                </motion.div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: "1.4rem",
            paddingLeft: "1rem",
          }}>
          {(Object.entries(p.cats) as [Cat, CatStyle][]).map(
            ([key, cat], i) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, x: 20 }}
                animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
                transition={{ delay: 1.5 + i * 0.1, duration: 0.5 }}
                style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div
                  style={{
                    width: 9,
                    height: 9,
                    borderRadius: "50%",
                    background: cat.c,
                    boxShadow: `0 0 8px ${cat.c}`,
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontFamily: "var(--v3-jb)",
                    fontSize: "0.62rem",
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: p.muted,
                  }}>
                  {cat.label}
                </span>
              </motion.div>
            ),
          )}
          <div
            style={{
              marginTop: "1.5rem",
              padding: "1.1rem",
              background: p.s1,
              border: `1px solid ${p.br}`,
              borderRadius: "10px",
            }}>
            <p
              style={{
                fontFamily: "var(--v3-jb)",
                fontSize: "0.55rem",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: p.muted,
                marginBottom: "0.7rem",
              }}>
              Working Stack
            </p>
            {[
              [
                "Interface Systems",
                p.cats.frontend.c,
                "React, Next.js, TypeScript, state and motion",
              ],
              [
                "Product Quality",
                p.cats.tools.c,
                "SEO, performance, accessibility and responsive UX",
              ],
              [
                "Data + APIs",
                p.cats.backend.c,
                "REST, Node, NestJS, Spring Boot and databases",
              ],
              [
                "Delivery",
                p.cats.design.c,
                "Figma handoff, testing, GitHub and Docker",
              ],
            ].map(([l, c, desc]) => (
              <div
                key={l as string}
                style={{
                  display: "grid",
                  gridTemplateColumns: "9px 1fr",
                  columnGap: "10px",
                  rowGap: "0.2rem",
                  alignItems: "start",
                  marginBottom: "0.75rem",
                }}>
                <span
                  style={{
                    width: 9,
                    height: 9,
                    borderRadius: "50%",
                    background: c as string,
                    boxShadow: `0 0 10px ${c as string}`,
                    marginTop: "0.32rem",
                  }}
                />
                <span>
                  <span
                    style={{
                      display: "block",
                      fontFamily: "var(--v3-sg)",
                      fontSize: "0.72rem",
                      color: `${p.fg}BB`,
                      marginBottom: "0.1rem",
                    }}>
                    {l}
                  </span>
                  <span
                    style={{
                      display: "block",
                      fontFamily: "var(--v3-jb)",
                      fontSize: "0.56rem",
                      lineHeight: 1.55,
                      color: p.muted,
                    }}>
                    {desc}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
//  EXPERIENCE — Wero-style stacking cards + animated timeline
// ══════════════════════════════════════════════════════════════════════════════
const CARD_ROTATIONS = [-3, 2.5, -2, 3.5];

interface JourneyCardProps {
  exp: (typeof EXPS)[0];
  i: number;
  total: number;
  active: number;
  p: V3Palette;
}

function JourneyCard({ exp, i, total, active, p }: JourneyCardProps) {
  const delta = i - active;
  const d = Math.abs(delta);
  const isFuture = delta > 0;
  const isPast = delta < 0;

  // Solitaire deck: active card at fixed bottom position, past cards peek behind (stacked up), future cards wait below
  const animY = isFuture ? 700 : isPast ? -d * 28 : 0;
  const animScale = isPast ? Math.max(0.82, 1 - d * 0.06) : 1;
  const animOpacity = isFuture ? 0 : isPast ? Math.max(0.35, 1 - d * 0.18) : 1;
  const rot = CARD_ROTATIONS[i % CARD_ROTATIONS.length];
  const zIdx = isFuture ? total - delta : total + 2 - d;

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        paddingBottom: "2.5rem",
        zIndex: zIdx,
        pointerEvents: delta === 0 ? "auto" : "none",
      }}>
      <motion.div
        animate={{
          y: animY,
          scale: animScale,
          opacity: animOpacity,
          rotate: rot,
        }}
        transition={{ type: "spring", stiffness: 220, damping: 28 }}
        style={{
          width: "100%",
          maxWidth: "660px",
          padding: "0 0.5rem",
          transformOrigin: "bottom center",
        }}>
        <div
          style={{
            background: p.s2,
            border: `1px solid ${exp.leadership ? `${p.pri}45` : p.br}`,
            borderRadius: "16px",
            padding: "1.4rem",
            position: "relative",
            overflow: "hidden",
            boxShadow: `0 28px 70px rgba(0,0,0,0.5),0 0 0 1px ${p.pri}10,inset 0 1px 0 rgba(255,255,255,0.04)`,
          }}>
          {exp.leadership && (
            <div
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                width: 200,
                height: 200,
                background: `radial-gradient(circle at top right,${p.pri}10,transparent)`,
                pointerEvents: "none",
              }}
            />
          )}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: "50%",
              transform: "translateX(-50%)",
              height: 3,
              width: 80,
              borderRadius: "0 0 4px 4px",
              background: p.pri,
              boxShadow: `0 0 18px ${p.pri}`,
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "1.5rem",
              right: "2rem",
              fontFamily: "var(--v3-jb)",
              fontSize: "6rem",
              fontWeight: 700,
              color: `${p.pri}07`,
              lineHeight: 1,
              userSelect: "none",
            }}>
            {exp.period.slice(-4)}
          </div>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: "0.6rem",
              marginBottom: "1.4rem",
              marginTop: "0.8rem",
            }}>
            <span
              style={{
                fontFamily: "var(--v3-jb)",
                fontSize: "0.68rem",
                fontWeight: 700,
                letterSpacing: "0.08em",
                padding: "0.25rem 0.85rem",
                borderRadius: "4px",
                background: `${p.pri}18`,
                color: p.pri,
                border: `1px solid ${p.pri}40`,
              }}>
              {exp.period.match(/\d{4}/)?.[0]}
            </span>
            <span
              style={{
                fontFamily: "var(--v3-jb)",
                fontSize: "0.58rem",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                padding: "0.25rem 0.8rem",
                borderRadius: "4px",
                background: exp.leadership ? `${p.pri}15` : `${p.br}80`,
                color: exp.leadership ? p.pri : p.muted,
                border: `1px solid ${exp.leadership ? `${p.pri}30` : p.br}`,
              }}>
              {exp.type}
            </span>
            {exp.leadership && (
              <span
                style={{
                  fontFamily: "var(--v3-jb)",
                  fontSize: "0.58rem",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  padding: "0.25rem 0.8rem",
                  borderRadius: "4px",
                  background: `${p.cats.design.c}15`,
                  color: p.cats.design.c,
                  border: `1px solid ${p.cats.design.c}30`,
                }}>
                🎓 Tech Lead · Mentor
              </span>
            )}
          </div>

          <h3
            style={{
              fontFamily: "var(--v3-sg)",
              fontSize: "1.45rem",
              fontWeight: 700,
              marginBottom: "0.4rem",
              color: p.fg,
            }}>
            {exp.role}
          </h3>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              marginBottom: "1.2rem",
            }}>
            <span
              style={{
                fontFamily: "var(--v3-jb)",
                fontSize: "0.73rem",
                color: p.pri,
                letterSpacing: "0.04em",
              }}>
              {exp.company}
            </span>
            <span
              style={{
                fontFamily: "var(--v3-jb)",
                fontSize: "0.62rem",
                color: p.muted,
              }}>
              {exp.period}
            </span>
          </div>

          <ul
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.65rem",
            }}>
            {exp.bullets.map((b, j) => (
              <li
                key={j}
                style={{
                  display: "flex",
                  gap: "10px",
                  alignItems: "flex-start",
                }}>
                <span
                  style={{
                    color: p.pri,
                    marginTop: "4px",
                    flexShrink: 0,
                    fontSize: "0.6rem",
                  }}>
                  ▹
                </span>
                <span
                  style={{
                    fontFamily: "var(--v3-sg)",
                    fontSize: "0.84rem",
                    color: `${p.fg}99`,
                    lineHeight: 1.65,
                  }}>
                  {b}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </motion.div>
    </div>
  );
}

function V3Experience({ p }: { p: V3Palette }) {
  const { isMobile } = useResponsive();
  const outerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(outerRef, { once: true, margin: "-80px" });
  const { scrollYProgress } = useScroll({
    target: outerRef,
    offset: ["start start", "end end"],
  });
  const [active, setActive] = useState(0);
  const total = EXPS.length;

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setActive(Math.min(Math.floor(v * total), total - 1));
  });

  const pathD =
    "M 80 30 C 40 90,30 150,55 210 C 80 270,130 330,105 390 C 80 450,60 510,80 570";
  const NODES = [
    { x: 80, y: 30 },
    { x: 55, y: 210 },
    { x: 105, y: 390 },
    { x: 80, y: 570 },
  ];

  // Sample midpoints on each cubic bezier segment so the orb follows the curve
  const orbX = useTransform(
    scrollYProgress,
    [0, 1/6, 1/3, 1/2, 2/3, 5/6, 1],
    [80, 43, 55, 99, 105, 76, 80],
  );
  const orbY = useTransform(
    scrollYProgress,
    [0, 1/6, 1/3, 1/2, 2/3, 5/6, 1],
    [30, 120, 210, 300, 390, 480, 570],
  );

  return (
    <div
      ref={outerRef}
      id="v3-exp"
      style={{ height: `${total * 50}vh`, position: "relative" }}>
      <section
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          background: p.s1,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}>
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "1px",
            background: `linear-gradient(to right,transparent,${p.cats.backend.c}30,transparent)`,
          }}
        />

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          style={{ padding: isMobile ? "1.5rem 1.5rem 0.5rem" : "2.5rem 3rem 0.5rem", flexShrink: 0 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              marginBottom: "0.75rem",
            }}>
            <span
              style={{
                fontFamily: "var(--v3-jb)",
                fontSize: "0.6rem",
                letterSpacing: "0.3em",
                color: p.pri,
              }}>
              03 / EXPERIENCE
            </span>
            <div
              style={{
                flex: 1,
                height: "1px",
                background: `linear-gradient(to right,${p.pri}30,transparent)`,
              }}
            />
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: "2rem",
              flexWrap: "wrap",
            }}>
            <h2
              style={{
                fontFamily: "var(--v3-sg)",
                fontSize: "clamp(22px,2.6vw,42px)",
                fontWeight: 700,
                letterSpacing: "-0.02em",
              }}>
              Professional <span style={{ color: p.pri }}>Journey</span>
            </h2>
            <span
              style={{
                fontFamily: "var(--v3-jb)",
                fontSize: "0.58rem",
                letterSpacing: "0.2em",
                color: p.muted,
              }}>
              ↓ SCROLL
            </span>
          </div>
        </motion.div>

        {/* Content row */}
        <div
          style={{
            flex: 1,
            display: "flex",
            overflow: "hidden",
            padding: isMobile ? "0.5rem 1rem" : "0.5rem 1.5rem 0.5rem 2rem",
            gap: "1rem",
          }}>
          {/* Timeline SVG column */}
          {!isMobile && <div style={{ width: "180px", flexShrink: 0, position: "relative" }}>
            <svg
              viewBox="0 0 160 600"
              style={{ width: "100%", height: "100%", display: "block" }}
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="xMidYMid meet">
              <defs>
                <filter
                  id="orbGlow"
                  x="-200%"
                  y="-200%"
                  width="500%"
                  height="500%">
                  <feGaussianBlur stdDeviation="6" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <filter
                  id="nodeGlow"
                  x="-120%"
                  y="-120%"
                  width="340%"
                  height="340%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              <path
                d={pathD}
                fill="none"
                stroke={p.br}
                strokeWidth="2"
                strokeLinecap="round"
                opacity="0.7"
              />
              <motion.path
                d={pathD}
                fill="none"
                stroke={p.pri}
                strokeWidth="2.5"
                strokeLinecap="round"
                style={{ pathLength: scrollYProgress }}
                opacity="0.85"
              />

              {NODES.map((node, i) => {
                const isActive = i === active;
                const labelRight = node.x >= 80;
                return (
                  <g key={i}>
                    {isActive && (
                      <>
                        <motion.circle
                          cx={node.x}
                          cy={node.y}
                          initial={{ r: 10 }}
                          fill={p.pri}
                          animate={{
                            r: [10, 20, 10],
                            opacity: [0.28, 0, 0.28],
                          }}
                          transition={{
                            duration: 1.8,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                          filter="url(#nodeGlow)"
                        />
                        <motion.circle
                          cx={node.x}
                          cy={node.y}
                          initial={{ r: 18 }}
                          fill="none"
                          stroke={p.pri}
                          strokeWidth="1"
                          animate={{
                            r: [18, 30, 18],
                            opacity: [0.14, 0, 0.14],
                          }}
                          transition={{
                            duration: 1.8,
                            repeat: Infinity,
                            delay: 0.35,
                            ease: "easeInOut",
                          }}
                        />
                      </>
                    )}
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={isActive ? 5.5 : 3.5}
                      fill={isActive ? p.pri : p.bg}
                      stroke={isActive ? p.pri : p.muted}
                      strokeWidth="1.5"
                    />
                    <text
                      x={labelRight ? node.x + 14 : node.x - 14}
                      y={node.y + 4}
                      textAnchor={labelRight ? "start" : "end"}
                      fill={isActive ? p.pri : p.muted}
                      fontSize="9.5"
                      fontFamily="var(--v3-jb)">
                      {i === 0
                        ? "Now"
                        : (EXPS[i].period.match(/\d{4}/)?.[0] ?? "")}
                    </text>
                    <text
                      x={labelRight ? node.x + 14 : node.x - 14}
                      y={node.y + 17}
                      textAnchor={labelRight ? "start" : "end"}
                      fill={isActive ? `${p.fg}AA` : `${p.muted}55`}
                      fontSize="7.5"
                      fontFamily="var(--v3-sg)">
                      {i === 0
                        ? "Current"
                        : EXPS[i].company.split(" ").slice(0, 2).join(" ")}
                    </text>
                  </g>
                );
              })}

              <motion.circle
                cx={orbX}
                cy={orbY}
                r="12"
                fill={p.pri}
                opacity="0.2"
                filter="url(#orbGlow)"
              />
              <motion.circle
                cx={orbX}
                cy={orbY}
                initial={{ r: 7 }}
                fill={p.pri}
                animate={{ r: [6, 8, 6], opacity: [0.9, 1, 0.9] }}
                transition={{
                  duration: 1.6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <motion.circle
                cx={orbX}
                cy={orbY}
                r="3"
                fill="white"
                opacity="0.85"
              />
            </svg>
          </div>}

          {/* Solitaire card stack — active card at bottom, past cards peek behind */}
          <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
            {EXPS.map((exp, i) => (
              <JourneyCard
                key={i}
                exp={exp}
                i={i}
                total={total}
                active={active}
                p={p}
              />
            ))}
          </div>
        </div>

        {/* Scroll progress dots */}
        <div
          style={{
            padding: "0.5rem 3rem 1rem",
            flexShrink: 0,
            display: "flex",
            justifyContent: "center",
            gap: "8px",
          }}>
          {EXPS.map((_, i) => (
            <motion.div
              key={i}
              animate={{
                width: i === active ? 28 : 8,
                background: i === active ? p.pri : p.br,
              }}
              transition={{ duration: 0.3 }}
              style={{ height: 6, borderRadius: "3px" }}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
//  PROJECTS — full-screen scroll-driven cinematic gallery
// ══════════════════════════════════════════════════════════════════════════════
const PROJ_ACCENT_COLORS = (p: V3Palette) => [
  p.pri,
  p.cats.backend.c,
  p.cats.design.c,
  p.cats.db.c,
  p.sec,
  p.cats.tools.c,
  p.cats.frontend.c,
];

// Each slide owns its clip-path motion value — no React state in the animation path
function ProjectSlide({
  proj,
  idx,
  total,
  scrollYProgress,
  p,
  accents,
}: {
  proj: (typeof PROJECTS)[0];
  idx: number;
  total: number;
  scrollYProgress: MotionValue<number>;
  p: V3Palette;
  accents: string[];
}) {
  const c = accents[idx % accents.length];
  const { isMobile } = useResponsive();

  // Project 0 is always the base (fully visible).
  // Project i (i ≥ 1) wipes in from right as scroll crosses (i-1)/total → i/total.
  // Reversing scroll un-wipes it — transition tracks position exactly.
  const clipX = useTransform(
    scrollYProgress,
    idx === 0 ? [0, 1] : [(idx - 1) / total, idx / total],
    idx === 0 ? [0, 0] : [100, 0],
    { clamp: true },
  );
  const clipPath = useTransform(clipX, (x) => `inset(0 0 0 ${x}%)`);

  return (
    <motion.div
      style={{
        position: "absolute", inset: 0, clipPath, zIndex: idx, background: p.bg,
        display: isMobile ? "flex" : undefined,
        flexDirection: isMobile ? "column" : undefined,
        overflow: isMobile ? "hidden" : undefined,
      }}>

      {isMobile ? (
        /* ── MOBILE: full-width image in flow, text panel below ── */
        // eslint-disable-next-line @next/next/no-img-element
        "image" in proj && proj.image ? (
          <img
            src={proj.image}
            alt={proj.title}
            style={{
              width: "100%",
              height: "auto",
              display: "block",
              flexShrink: 0,
              marginTop: "3.5rem",
              filter: "saturate(0.95) contrast(1.04)",
            }}
          />
        ) : (
          <div style={{
            height: "220px", flexShrink: 0, marginTop: "3.5rem",
            background: `linear-gradient(135deg,${p.s1},${p.s2})`,
            position: "relative",
          }}>
            <div style={{
              position: "absolute", inset: 0,
              background: `radial-gradient(ellipse at 70% 50%,${c}22 0%,transparent 55%)`,
            }} />
          </div>
        )
      ) : (
        /* ── DESKTOP: full-screen absolute-positioned background ── */
        "image" in proj && proj.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={proj.image}
            alt={proj.title}
            style={{
              position: "absolute",
              top: "64px", left: 0, right: 0, bottom: 0,
              width: "100%", height: "calc(100% - 64px)",
              objectFit: "cover", objectPosition: "center top",
              opacity: 0.9,
              filter: "saturate(0.95) contrast(1.04)",
            }}
          />
        ) : (
          <div style={{ position: "absolute", inset: 0, background: `linear-gradient(135deg,${p.s1},${p.s2})` }}>
            <div style={{
              position: "absolute", inset: 0,
              backgroundImage: `linear-gradient(${c}10 1px,transparent 1px),linear-gradient(90deg,${c}10 1px,transparent 1px)`,
              backgroundSize: "56px 56px",
            }} />
            <div style={{
              position: "absolute", inset: 0,
              background: `radial-gradient(ellipse at 70% 50%,${c}22 0%,transparent 55%)`,
            }} />
            <div style={{
              position: "absolute", bottom: "1.5rem", right: "3rem",
              fontFamily: "var(--v3-jb)", fontSize: "clamp(120px,18vw,240px)",
              fontWeight: 700, color: `${c}08`, lineHeight: 1,
              userSelect: "none", letterSpacing: "-0.04em",
            }}>
              {String(idx + 1).padStart(2, "0")}
            </div>
            <div style={{
              position: "absolute", top: "50%", right: "22%",
              transform: "translateY(-50%)", width: 260, height: 260,
              borderRadius: "50%",
              background: `radial-gradient(circle,${c}28 0%,transparent 70%)`,
              boxShadow: `0 0 120px ${c}30,0 0 240px ${c}12`,
              pointerEvents: "none",
            }} />
          </div>
        )
      )}

      {/* Desktop: gradient overlays */}
      {!isMobile && <>
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: `linear-gradient(to right,${p.bg} 0%,${p.bg}BB 22%,${p.bg}55 40%,transparent 60%)`,
        }} />
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: `linear-gradient(to bottom,transparent 80%,${p.bg}88 100%)`,
        }} />
      </>}

      {/* Text panel */}
      <div style={{
        position: isMobile ? "relative" : "absolute",
        inset: isMobile ? undefined : 0,
        zIndex: 2,
        flex: isMobile ? 1 : undefined,
        background: isMobile ? p.bg : undefined,
        display: "flex", flexDirection: "column",
        justifyContent: isMobile ? "flex-start" : "center",
        padding: isMobile ? "1.2rem 1.5rem 2rem" : "5.5rem 3rem 4rem 3.5rem",
        maxWidth: isMobile ? undefined : "600px",
      }}>
        <div style={{ marginBottom: isMobile ? "0.65rem" : "1.4rem" }}>
          <span style={{
            fontFamily: "var(--v3-jb)", fontSize: "0.57rem",
            letterSpacing: "0.22em", textTransform: "uppercase",
            padding: "0.3rem 0.9rem", borderRadius: "4px",
            background: `${c}22`, color: c, border: `1px solid ${c}40`,
          }}>
            {proj.badge}
          </span>
        </div>

        <h2 style={{
          fontFamily: "var(--v3-sg)",
          fontSize: isMobile ? "clamp(38px,11vw,58px)" : "clamp(36px,5.5vw,80px)",
          fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.03,
          marginBottom: isMobile ? "0.65rem" : "1.4rem", color: p.fg,
        }}>
          {proj.title}<span style={{ color: c }}>.</span>
        </h2>

        <p style={{
          fontFamily: "var(--v3-sg)",
          fontSize: isMobile ? "1rem" : "0.9rem",
          lineHeight: isMobile ? 1.6 : 1.82,
          color: `${p.fg}bb`,
          maxWidth: "440px",
          marginBottom: isMobile ? "0.9rem" : "2rem",
          display: isMobile ? "-webkit-box" : undefined,
          WebkitLineClamp: isMobile ? 3 : undefined,
          WebkitBoxOrient: isMobile ? "vertical" as const : undefined,
          overflow: isMobile ? "hidden" : undefined,
        }}>
          {proj.description}
        </p>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginBottom: isMobile ? "0.9rem" : "2.8rem" }}>
          {proj.tech.map((t) => (
            <span key={t} style={{
              fontFamily: "var(--v3-jb)", fontSize: "0.57rem",
              letterSpacing: "0.1em", padding: "0.28rem 0.65rem",
              borderRadius: "4px", background: `${c}14`,
              color: `${c}DD`, border: `1px solid ${c}28`,
            }}>
              {t}
            </span>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ width: 28, height: 1, background: `${c}60` }} />
          <span style={{
            fontFamily: "var(--v3-jb)", fontSize: "0.55rem",
            letterSpacing: "0.22em", textTransform: "uppercase",
            color: `${p.fg}55`,
          }}>
            SCROLL ↓
          </span>
        </div>
      </div>
    </motion.div>
  );
}

function V3Projects({ p }: { p: V3Palette }) {
  const outerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: outerRef,
    offset: ["start start", "end end"],
  });
  const [activeIdx, setActiveIdx] = useState(0);
  const total = PROJECTS.length;
  const accents = PROJ_ACCENT_COLORS(p);

  // Only drives UI (counter + dots) — animation is scroll-driven via useTransform
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setActiveIdx(Math.min(Math.round(v * total), total - 1));
  });

  const ac = accents[activeIdx % accents.length];

  return (
    <div ref={outerRef} id="v3-projects" style={{ height: `${total * 40}vh`, position: "relative" }}>
      <section style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden", background: p.bg }}>

        {/* Top bar */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, zIndex: 30,
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "1.8rem 3rem",
          background: `linear-gradient(to bottom,${p.bg}EE 60%,transparent)`,
          pointerEvents: "none",
        }}>
          <span style={{ fontFamily: "var(--v3-jb)", fontSize: "0.6rem", letterSpacing: "0.3em", color: p.pri }}>
            04 / PROJECTS
          </span>
          <div style={{ fontFamily: "var(--v3-jb)", fontSize: "0.72rem", letterSpacing: "0.18em" }}>
            <span style={{ color: ac }}>{String(activeIdx + 1).padStart(2, "0")}</span>
            <span style={{ color: p.muted }}> / {String(total).padStart(2, "0")}</span>
          </div>
        </div>

        {/* All slides stacked — each clip-path driven directly by scrollYProgress */}
        {PROJECTS.map((proj, idx) => (
          <ProjectSlide
            key={idx}
            proj={proj}
            idx={idx}
            total={total}
            scrollYProgress={scrollYProgress}
            p={p}
            accents={accents}
          />
        ))}

        {/* Progress dots */}
        <div style={{
          position: "absolute", bottom: "2rem", left: "3.5rem",
          zIndex: 30, display: "flex", alignItems: "center", gap: "5px",
        }}>
          {PROJECTS.map((_, i) => (
            <motion.div
              key={i}
              animate={{
                width: i === activeIdx ? 26 : 5,
                opacity: i === activeIdx ? 1 : 0.3,
                background: i === activeIdx ? accents[activeIdx % accents.length] : p.br,
              }}
              transition={{ duration: 0.28, ease: "easeOut" }}
              style={{ height: 3, borderRadius: "2px", flexShrink: 0 }}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

// ── Sparkle geometry (pre-computed at module level to avoid SSR/client float mismatch) ──
type FistLayer = {
  src: string;
  w: number;
  h: number;
  anchor: [number, number];
  pos: [number, number];
  rotate?: number[];
  rotateAt?: number[];
};

const FIST_PROGRESS = [0, 133.332 / 401, 213.331 / 401, 399.996 / 401];
const IMPACT_PROGRESS = 158 / 401;
const FIST_CANVAS = { w: 2483, h: 900 };

const LEFT_PARENT = {
  x: [-110.5, 911.5, 711.5, -473.5],
  y: [480, 480, 480, 696],
  rotate: [0, 3, -2.25, -31.25],
};

const RIGHT_PARENT = {
  x: [2595.5, 1576.773, 1787.5, 2953.5],
  y: [386, 386, 386, 602],
  rotate: [0, -3, 2.25, 33.25],
};

const LEFT_LAYERS: FistLayer[] = [
  {
    src: "/fistbump/fist_img_6_parent1011.png",
    w: 566,
    h: 473,
    anchor: [283, 236.027],
    pos: [128.032, 65.725],
  },
  {
    src: "/fistbump/fist_img_10_parent1013.png",
    w: 321,
    h: 341,
    anchor: [240.108, 6.138],
    pos: [296.942, -73.265],
    rotateAt: [122.666 / 401, 138.666 / 401, 223.998 / 401],
    rotate: [0, 6, 0],
  },
  {
    src: "/fistbump/fist_img_11_parent1015.png",
    w: 379,
    h: 297,
    anchor: [271.364, 8.019],
    pos: [246.332, -44.619],
    rotateAt: [79.999 / 401, 89.999 / 401, 139.999 / 401],
    rotate: [0, 9, 0],
  },
];

const RIGHT_LAYERS: FistLayer[] = [
  {
    src: "/fistbump/fist_img_7_parent1017.png",
    w: 562,
    h: 468,
    anchor: [280.438, 234],
    pos: [-131.262, 65.725],
  },
  {
    src: "/fistbump/fist_img_8_parent1019.png",
    w: 316,
    h: 337,
    anchor: [69.836, 2.022],
    pos: [-308.177, -75.265],
    rotateAt: [122.666 / 401, 138.666 / 401, 223.998 / 401],
    rotate: [0, -6, 0],
  },
  {
    src: "/fistbump/fist_img_9_parent1021.png",
    w: 375,
    h: 289,
    anchor: [85.125, 0],
    pos: [-269.557, -46.92],
    rotateAt: [127.999 / 401, 143.999 / 401, 223.998 / 401],
    rotate: [0, -9, 0],
  },
];

const BURST_TICK_GROUP = {
  x: 698.427,
  y: 468.386,
  scale: 3.63,
};

const BURST_TICKS = [
  {
    transform: "matrix(1.01943 0 0 0.99923 98.985 -113.524)",
    d: "M22.088 -24.493 24.287 -27.599",
  },
  {
    transform: "translate(147.007 -28.153)",
    d: "M11.182 -3.702 12.695 -4.416",
  },
  {
    transform: "translate(152.525 149.396)",
    d: "M22.437 7.917 24.839 9.752",
  },
  {
    transform: "translate(-152.71 143.144)",
    d: "M-24.654 11.229 -22.145 9.305",
  },
  {
    transform: "translate(-124.942 -109.007)",
    d: "M-30.387 -32.581 -27.395 -28.544",
  },
  {
    transform: "translate(-145.194 -82.953)",
    d: "M-21.067 -12.427 -22.389 -14.793",
  },
];

const BURST_SPARKS = [
  {
    transform: "matrix(0.875809 2.33152 -2.33152 0.875809 644.987 224.943)",
    delay: 0.004,
  },
  {
    transform: "matrix(0.630451 0.914296 -0.914296 0.630451 439.931 734.354)",
    delay: 0.014,
  },
  {
    transform: "matrix(0.59562 0.92339 -0.92339 0.59562 1163.931 556.354)",
    delay: 0.02,
  },
];

const BURST_VISIBLE_LINES = [
  { x1: 496, y1: 236, x2: 406, y2: 118, delay: 0 },
  { x1: 432, y1: 270, x2: 322, y2: 202, delay: 0.006 },
  { x1: 960, y1: 222, x2: 1054, y2: 112, delay: 0.004 },
  { x1: 1064, y1: 388, x2: 1140, y2: 362, delay: 0.012 },
  { x1: 472, y1: 782, x2: 374, y2: 832, delay: 0.018 },
  { x1: 970, y1: 804, x2: 1068, y2: 844, delay: 0.022 },
];

const BURST_SPARK_PATH =
  "M29.96 9.81 30.42 8.25C31.24 5.52 29.93 2.61 27.35 1.4L15.26-4.22c-2.36-1.09-3.68-3.64-3.23-6.2l4.27-24.17c.51-2.87-1.21-5.66-4-6.49-2.79-.84-5.77.55-6.92 3.23l-9.71 22.54c-1.03 2.39-3.53 3.79-6.11 3.41l-13.19-1.94c-2.82-.42-5.52 1.3-6.34 4.03l-.46 1.56c-.82 2.73.49 5.64 3.08 6.85l12.08 5.62c2.36 1.09 3.68 3.64 3.23 6.2l-4.27 24.17c-.51 2.87 1.22 5.66 4 6.49 2.79.84 5.77-.55 6.92-3.23l9.71-22.54c1.03-2.39 3.53-3.79 6.11-3.41l13.19 1.94c2.82.42 5.52-1.3 6.34-4.03Z";

const fn2 = (n: number) => Math.round(n * 100) / 100;
const SPARKLE_LINES = Array.from({ length: 12 }, (_, i) => {
  const angle = (i * 30 * Math.PI) / 180;
  const r2 = i % 2 === 0 ? 76 : 54;
  return {
    x1: fn2(90 + Math.cos(angle) * 20),
    y1: fn2(90 + Math.sin(angle) * 20),
    x2: fn2(90 + Math.cos(angle) * r2),
    y2: fn2(90 + Math.sin(angle) * r2),
    isPri: i % 2 === 0,
    sw: i % 2 === 0 ? "3.5" : "2.5",
  };
});
const SPARKLE_DOTS = [0, 60, 120, 180, 240, 300].map((deg, i) => {
  const rad = (deg * Math.PI) / 180;
  return {
    cx: fn2(90 + Math.cos(rad) * 64),
    cy: fn2(90 + Math.sin(rad) * 64),
    isPri: i % 2 === 0,
  };
});
const SPARKLE_DIAMONDS = [30, 90, 150, 210, 270, 330].map((deg) => {
  const rad = (deg * Math.PI) / 180;
  const cx = fn2(90 + Math.cos(rad) * 80);
  const cy = fn2(90 + Math.sin(rad) * 80);
  return `M${cx},${fn2(cy - 6)} L${fn2(cx + 4)},${cy} L${cx},${fn2(cy + 6)} L${fn2(cx - 4)},${cy} Z`;
});

// ══════════════════════════════════════════════════════════════════════════════
//  FIST BUMP — scroll-driven collaboration CTA
// ══════════════════════════════════════════════════════════════════════════════
function V3FistBump({ p }: { p: V3Palette }) {
  const outerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: outerRef,
    offset: ["start end", "start 0.15"],
  });

  const impactedRef = useRef(false);
  // Per-layer X bounce — body, thumb/wrist, knuckle
  const leftB1 = useMotionValue(0);
  const leftB2 = useMotionValue(0);
  const leftB3 = useMotionValue(0);
  const rightB1 = useMotionValue(0);
  const rightB2 = useMotionValue(0);
  const rightB3 = useMotionValue(0);

  const leftScrollX = useTransform(scrollYProgress, [0, 0.78], [-700, 0]);
  const rightScrollX = useTransform(scrollYProgress, [0, 0.78], [700, 0]);
  const leftX1 = useTransform(() => leftScrollX.get() + leftB1.get());
  const leftX2 = useTransform(() => leftScrollX.get() + leftB2.get());
  const leftX3 = useTransform(() => leftScrollX.get() + leftB3.get());
  const rightX1 = useTransform(() => rightScrollX.get() + rightB1.get());
  const rightX2 = useTransform(() => rightScrollX.get() + rightB2.get());
  const rightX3 = useTransform(() => rightScrollX.get() + rightB3.get());

  const sparkleOpacity = useTransform(scrollYProgress, [0.72, 0.92], [0, 1]);
  const sparkleScale = useTransform(scrollYProgress, [0.72, 1.0], [0.2, 1.15]);
  const bgTextOpacity = useTransform(scrollYProgress, [0.05, 0.5], [0, 0.09]);
  const subtitleOpacity = useTransform(scrollYProgress, [0.68, 0.92], [0, 1]);
  const subtitleY = useTransform(scrollYProgress, [0.68, 0.92], [24, 0]);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (v >= 0.73 && !impactedRef.current) {
      impactedRef.current = true;
      // Body — anchors the shape, moderate recoil, fast settle
      animate(leftB1, -38, { duration: 0.07 }).then(() =>
        animate(leftB1, 0, { type: "spring", stiffness: 260, damping: 16 })
      );
      animate(rightB1, 38, { duration: 0.07 }).then(() =>
        animate(rightB1, 0, { type: "spring", stiffness: 260, damping: 16 })
      );
      // Thumb/wrist — slightly more recoil, 3–4 oscillations
      animate(leftB2, -52, { duration: 0.08 }).then(() =>
        animate(leftB2, 0, { type: "spring", stiffness: 200, damping: 7 })
      );
      animate(rightB2, 52, { duration: 0.08 }).then(() =>
        animate(rightB2, 0, { type: "spring", stiffness: 200, damping: 7 })
      );
      // Knuckle — most recoil, lowest damping = visible multi-oscillation jiggle
      animate(leftB3, -66, { duration: 0.09 }).then(() =>
        animate(leftB3, 0, { type: "spring", stiffness: 150, damping: 5 })
      );
      animate(rightB3, 66, { duration: 0.09 }).then(() =>
        animate(rightB3, 0, { type: "spring", stiffness: 150, damping: 5 })
      );
    }
    if (v < 0.5) impactedRef.current = false;
  });

  return (
    <div ref={outerRef} style={{ height: "180vh", position: "relative" }}>
      <section
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          background: p.bg,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}>
        {/* Subtle grid */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `linear-gradient(${p.br}22 1px,transparent 1px),linear-gradient(90deg,${p.br}22 1px,transparent 1px)`,
            backgroundSize: "48px 48px",
            opacity: 0.35,
            pointerEvents: "none",
          }}
        />
        {/* Ambient glows */}
        <div
          style={{
            position: "absolute",
            left: "15%",
            top: "35%",
            width: 340,
            height: 340,
            borderRadius: "50%",
            background: `radial-gradient(circle,rgba(${p.priRgb},0.12) 0%,transparent 70%)`,
            filter: "blur(48px)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: "15%",
            top: "35%",
            width: 340,
            height: 340,
            borderRadius: "50%",
            background: `radial-gradient(circle,rgba(${p.secRgb},0.12) 0%,transparent 70%)`,
            filter: "blur(48px)",
            pointerEvents: "none",
          }}
        />

        {/* Giant watermark text behind fists */}
        <motion.div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            x: "-50%",
            y: "-60%",
            opacity: bgTextOpacity,
            whiteSpace: "nowrap",
            textAlign: "center",
            pointerEvents: "none",
            zIndex: 0,
          }}>
          <div
            style={{
              fontFamily: "var(--v3-sg)",
              fontSize: "clamp(52px, 10vw, 124px)",
              fontWeight: 900,
              letterSpacing: "-0.04em",
              color: p.fg,
              lineHeight: 1.05,
            }}>
            LET&apos;S BUILD
          </div>
          <div
            style={{
              fontFamily: "var(--v3-sg)",
              fontSize: "clamp(52px, 10vw, 124px)",
              fontWeight: 900,
              letterSpacing: "-0.04em",
              color: p.pri,
              lineHeight: 1.05,
            }}>
            TOGETHER
          </div>
        </motion.div>

        {/* Fists + impact center */}
        <div
          style={{
            position: "relative",
            zIndex: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
          {/* LEFT FIST (purple layers — each moves independently) */}
          <div
            style={{
              position: "relative",
              width: 360,
              height: 310,
              transform: "rotate(-31deg)",
              transformOrigin: "right center",
            }}>
            {/* Body */}
            <motion.div style={{ x: leftX1, position: "absolute", top: 0, left: 0 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/fistbump/fist_img_6_parent1011.png"
                alt=""
                style={{ width: 360, height: "auto", display: "block" }}
              />
            </motion.div>
            {/* Thumb/wrist */}
            <motion.div style={{ x: leftX2, position: "absolute", top: 78, left: 82, zIndex: 2 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/fistbump/fist_img_11_parent1015.png"
                alt=""
                style={{ width: 238, height: "auto", display: "block" }}
              />
            </motion.div>
            {/* Knuckle */}
            <motion.div style={{ x: leftX3, position: "absolute", top: 57, left: 148, zIndex: 3 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/fistbump/fist_img_10_parent1013.png"
                alt=""
                style={{ width: 205, height: "auto", display: "block" }}
              />
            </motion.div>
          </div>

          {/* Impact sparkle at knuckle meeting point */}
          <div
            style={{
              width: 0,
              height: 0,
              position: "relative",
              overflow: "visible",
            }}>
            <motion.div
              style={{
                position: "absolute",
                opacity: sparkleOpacity,
                scale: sparkleScale,
                width: 180,
                height: 180,
                top: "-90px",
                left: "-90px",
              }}>
              <svg
                viewBox="0 0 180 180"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ width: "100%", height: "100%" }}>
                {SPARKLE_LINES.map((l, i) => (
                  <line
                    key={i}
                    x1={l.x1}
                    y1={l.y1}
                    x2={l.x2}
                    y2={l.y2}
                    stroke={l.isPri ? p.pri : p.sec}
                    strokeWidth={l.sw}
                    strokeLinecap="round"
                  />
                ))}
                <circle cx="90" cy="90" r="14" fill={p.pri} opacity="0.95" />
                <circle cx="90" cy="90" r="7" fill="white" opacity="0.9" />
                {SPARKLE_DOTS.map((d, i) => (
                  <circle
                    key={i}
                    cx={d.cx}
                    cy={d.cy}
                    r="4.5"
                    fill={d.isPri ? p.pri : p.sec}
                    opacity="0.88"
                  />
                ))}
                {SPARKLE_DIAMONDS.map((d, i) => (
                  <path key={i} d={d} fill={p.pri} opacity="0.78" />
                ))}
              </svg>
            </motion.div>
          </div>

          {/* RIGHT FIST (orange layers — each moves independently) */}
          <div
            style={{
              position: "relative",
              width: 360,
              height: 310,
              transform: "rotate(33deg)",
              transformOrigin: "left center",
            }}>
            {/* Body */}
            <motion.div style={{ x: rightX1, position: "absolute", top: 0, left: 0 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/fistbump/fist_img_7_parent1017.png"
                alt=""
                style={{ width: 360, height: "auto", display: "block" }}
              />
            </motion.div>
            {/* Thumb/wrist */}
            <motion.div style={{ x: rightX2, position: "absolute", top: 78, left: 22, zIndex: 2 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/fistbump/fist_img_9_parent1021.png"
                alt=""
                style={{ width: 238, height: "auto", display: "block" }}
              />
            </motion.div>
            {/* Knuckle */}
            <motion.div style={{ x: rightX3, position: "absolute", top: 57, left: 8, zIndex: 3 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/fistbump/fist_img_8_parent1019.png"
                alt=""
                style={{ width: 205, height: "auto", display: "block" }}
              />
            </motion.div>
          </div>
        </div>

        {/* Subtitle beneath fists */}
        <motion.div
          style={{
            opacity: subtitleOpacity,
            y: subtitleY,
            textAlign: "center",
            position: "relative",
            zIndex: 2,
            marginTop: "2.5rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.6rem",
          }}>
          <p
            style={{
              fontFamily: "var(--v3-jb)",
              fontSize: "0.65rem",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: p.pri,
            }}>
            Ready to build something great?
          </p>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>
            <div
              style={{
                width: 1,
                height: 40,
                background: `linear-gradient(to bottom,${p.pri},transparent)`,
              }}
            />
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
//  CONTACT
// ══════════════════════════════════════════════════════════════════════════════
void V3FistBump;

function FistLayerImage({
  layer,
  progress,
}: {
  layer: FistLayer;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
}) {
  const rotate = useTransform(
    progress,
    layer.rotateAt ?? [0, 1],
    layer.rotate ?? [0, 0],
  );

  return (
    <motion.image
      href={layer.src}
      width={layer.w}
      height={layer.h}
      x={layer.pos[0] - layer.anchor[0]}
      y={layer.pos[1] - layer.anchor[1]}
      style={{
        rotate,
        transformBox: "fill-box",
        transformOrigin: `${layer.anchor[0]}px ${layer.anchor[1]}px`,
      }}
    />
  );
}

function BurstTick({
  tick,
  progress,
}: {
  tick: (typeof BURST_TICKS)[number];
  progress: ReturnType<typeof useMotionValue<number>>;
}) {
  const start = 0.22;
  const opacity = useTransform(progress, [start - 0.04, start, 0.9], [0, 1, 0]);
  const pathLength = useTransform(progress, [start - 0.04, start + 0.1], [0, 1]);

  return (
    <motion.g style={{ opacity }} transform={tick.transform}>
      <motion.path
        d={tick.d}
        fill="none"
        stroke="#ffffff"
        strokeWidth="2.4"
        strokeLinecap="butt"
        strokeLinejoin="miter"
        strokeMiterlimit="10"
        style={{ pathLength }}
      />
    </motion.g>
  );
}

function BurstSpark({
  spark,
  progress,
  p,
}: {
  spark: (typeof BURST_SPARKS)[number];
  progress: ReturnType<typeof useMotionValue<number>>;
  p: V3Palette;
}) {
  const start = spark.delay;
  const opacity = useTransform(progress, [start, start + 0.08, 0.94], [0, 1, 0]);
  const rotate = useTransform(progress, [start, 0.94], [0, 300]);
  const scale = useTransform(progress, [start, start + 0.12, 0.94], [0.86, 1, 0.9]);

  return (
    <motion.g
      style={{ opacity }}
      transform={spark.transform}>
      <motion.g
        style={{
          rotate,
          scale,
          transformBox: "fill-box",
          transformOrigin: "center",
        }}>
        <path d={BURST_SPARK_PATH} fill="#ffffff" />
        <path
          d={BURST_SPARK_PATH}
          fill="none"
          stroke={p.fg}
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </motion.g>
    </motion.g>
  );
}

function BurstVisibleLine({
  line,
  progress,
}: {
  line: (typeof BURST_VISIBLE_LINES)[number];
  progress: ReturnType<typeof useMotionValue<number>>;
}) {
  const start = 0.2 + line.delay;
  const opacity = useTransform(progress, [start - 0.04, start, 0.9], [0, 1, 0]);
  const pathLength = useTransform(progress, [start - 0.04, start + 0.1], [0, 1]);

  return (
    <motion.line
      x1={line.x1}
      y1={line.y1}
      x2={line.x2}
      y2={line.y2}
      stroke="#ffffff"
      strokeWidth="5"
      strokeLinecap="round"
      style={{
        opacity,
        pathLength,
      }}
    />
  );
}

function ImpactBurstLayer({
  progress,
  p,
}: {
  progress: ReturnType<typeof useMotionValue<number>>;
  p: V3Palette;
}) {
  return (
    <svg
      viewBox="0 0 1400 1000"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        aspectRatio: "1400 / 1000",
        height: "100%",
        width: "auto",
        display: "block",
        overflow: "visible",
      }}>
      <g
        transform={`translate(${BURST_TICK_GROUP.x} ${BURST_TICK_GROUP.y}) scale(${BURST_TICK_GROUP.scale})`}>
        {BURST_TICKS.map((tick) => (
          <BurstTick
            key={tick.d}
            tick={tick}
            progress={progress}
          />
        ))}
      </g>
      {BURST_VISIBLE_LINES.map((line) => (
        <BurstVisibleLine
          key={`${line.x1}-${line.y1}`}
          line={line}
          progress={progress}
        />
      ))}
      {BURST_SPARKS.map((spark) => (
        <BurstSpark
          key={spark.transform}
          spark={spark}
          progress={progress}
          p={p}
        />
      ))}
    </svg>
  );
}

function V3FistBumpExact({ p }: { p: V3Palette }) {
  const ref = useRef<HTMLElement>(null);
  const burstPlayedRef = useRef(false);
  const burstProgress = useMotionValue(0);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 50%", "end 25%"],
  });

  const leftX = useTransform(scrollYProgress, FIST_PROGRESS, LEFT_PARENT.x);
  const leftY = useTransform(scrollYProgress, FIST_PROGRESS, LEFT_PARENT.y);
  const leftRotate = useTransform(
    scrollYProgress,
    FIST_PROGRESS,
    LEFT_PARENT.rotate,
  );
  const rightX = useTransform(scrollYProgress, FIST_PROGRESS, RIGHT_PARENT.x);
  const rightY = useTransform(scrollYProgress, FIST_PROGRESS, RIGHT_PARENT.y);
  const rightRotate = useTransform(
    scrollYProgress,
    FIST_PROGRESS,
    RIGHT_PARENT.rotate,
  );
  const scaleX = useTransform(
    scrollYProgress,
    [121.436 / 401, 138.666 / 401, 170.665 / 401],
    [1, 0.93, 1],
  );
  const scaleY = useTransform(
    scrollYProgress,
    [121.436 / 401, 138.666 / 401, 170.665 / 401],
    [1, 1.1, 1],
  );
  const titleOpacity = useTransform(
    scrollYProgress,
    [0, 0.12, 0.9, 1],
    [0, 1, 1, 0.85],
  );
  const titleY = useTransform(scrollYProgress, [0, 0.25], [30, 0]);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const trigger = 138.666 / 401 - 0.04;

    if (v >= trigger && !burstPlayedRef.current) {
      burstPlayedRef.current = true;
      burstProgress.set(0);
      animate(burstProgress, 1, {
        duration: 0.95,
        ease: "easeOut",
      }).then(() => {
        burstProgress.set(0);
      });
    }

    if (v < trigger - 0.08 || v > trigger + 0.35) {
      burstPlayedRef.current = false;
    }
  });

  return (
    <section
      ref={ref}
      style={{
        minHeight: "80dvh",
        padding: "6.25rem 30px",
        position: "relative",
        overflow: "hidden",
        background: `linear-gradient(121deg,rgba(${p.secRgb},0.18) -20%,${p.bg} 42%,rgba(${p.priRgb},0.18) 116%)`,
      }}>
      <motion.div
        style={{
          minHeight: "calc(80dvh - 12.5rem)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          opacity: titleOpacity,
          y: titleY,
          position: "relative",
          zIndex: 1,
          pointerEvents: "none",
        }}>
        <h2
          style={{
            color: p.fg,
            fontFamily: "var(--v3-sg)",
            fontSize: "clamp(47px,5.37vw + 27px,130px)",
            fontStyle: "normal",
            fontWeight: 800,
            letterSpacing: "-0.047em",
            lineHeight: "85%",
            textAlign: "center",
            textTransform: "uppercase",
            width: "clamp(335px,37.86vw + 193px,920px)",
          }}>
          <span style={{ display: "block" }}>Let&apos;s</span>
          <span style={{ display: "block" }}>Build</span>
          <span style={{ display: "block", color: p.pri }}>Together</span>
        </h2>
      </motion.div>

      <div
        style={{
          left: "50%",
          position: "absolute",
          top: "50%",
          transform: "translate(-50%,-50%)",
          width: "100vw",
          minWidth: 760,
          pointerEvents: "none",
          zIndex: 4,
        }}>
        <svg
          viewBox={`0 0 ${FIST_CANVAS.w} ${FIST_CANVAS.h}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            display: "block",
            width: "100%",
            height: "auto",
            overflow: "visible",
          }}>
          <motion.g
            style={{
              x: leftX,
              y: leftY,
              rotate: leftRotate,
              scaleX,
              scaleY,
              transformBox: "view-box",
              transformOrigin: "0px 0px",
            }}>
            {LEFT_LAYERS.slice(0, 1).map((layer) => (
              <FistLayerImage
                key={layer.src}
                layer={layer}
                progress={scrollYProgress}
              />
            ))}
          </motion.g>

          <motion.g
            style={{
              x: rightX,
              y: rightY,
              rotate: rightRotate,
              scaleX,
              scaleY,
              transformBox: "view-box",
              transformOrigin: "0px 0px",
            }}>
            {RIGHT_LAYERS.map((layer) => (
              <FistLayerImage
                key={layer.src}
                layer={layer}
                progress={scrollYProgress}
              />
            ))}
          </motion.g>

          <motion.g
            style={{
              x: leftX,
              y: leftY,
              rotate: leftRotate,
              scaleX,
              scaleY,
              transformBox: "view-box",
              transformOrigin: "0px 0px",
            }}>
            {LEFT_LAYERS.slice(1).map((layer) => (
              <FistLayerImage
                key={layer.src}
                layer={layer}
                progress={scrollYProgress}
              />
            ))}
          </motion.g>

        </svg>
      </div>

      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%,-50%)",
          height: "min(80dvh, 760px)",
          pointerEvents: "none",
          zIndex: 5,
        }}>
        <ImpactBurstLayer progress={burstProgress} p={p} />
      </div>

      <motion.div
        style={{
          opacity: titleOpacity,
          position: "absolute",
          bottom: "clamp(30px,6vh,72px)",
          left: "50%",
          x: "-50%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0.6rem",
          pointerEvents: "none",
        }}>
        <p
          style={{
            fontFamily: "var(--v3-jb)",
            fontSize: "0.65rem",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: p.pri,
            whiteSpace: "nowrap",
          }}>
          Ready to build something great?
        </p>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>
          <div
            style={{
              width: 1,
              height: 40,
              background: `linear-gradient(to bottom,${p.pri},transparent)`,
            }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}

function V3Contact({ p }: { p: V3Palette }) {
  const { isMobile } = useResponsive();
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <section
      ref={ref}
      id="v3-contact"
      style={{
        background: p.s1,
        padding: isMobile ? "4rem 1.5rem" : "7rem 3rem",
        position: "relative",
        overflow: "hidden",
      }}>
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "1px",
          background: `linear-gradient(to right,transparent,${p.cats.db.c}30,transparent)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "10%",
          right: "5%",
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: `radial-gradient(circle,rgba(${p.priRgb},0.06),transparent 70%)`,
          pointerEvents: "none",
        }}
      />
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              marginBottom: "1.5rem",
            }}>
            <span
              style={{
                fontFamily: "var(--v3-jb)",
                fontSize: "0.6rem",
                letterSpacing: "0.3em",
                color: p.pri,
              }}>
              05 / CONTACT
            </span>
            <div
              style={{
                flex: 1,
                height: "1px",
                background: `linear-gradient(to right,${p.pri}30,transparent)`,
              }}
            />
          </div>
          <h2
            style={{
              fontFamily: "var(--v3-sg)",
              fontSize: "clamp(28px,3.5vw,52px)",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              marginBottom: "4rem",
            }}>
            Let&apos;s Build <span style={{ color: p.pri }}>Together</span>
          </h2>
        </motion.div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr 1.2fr",
            gap: isMobile ? "2.5rem" : "5rem",
          }}>
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.7 }}>
            <p
              style={{
                fontFamily: "var(--v3-sg)",
                fontSize: "0.95rem",
                lineHeight: 1.85,
                color: p.muted,
                marginBottom: "2.5rem",
              }}>
              I&apos;m always open to new opportunities, interesting products,
              or just a great conversation about tech and design.
            </p>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1.2rem",
              }}>
              {[
                [
                  "Email",
                  "abdulrhman.eldaly@gmail.com",
                  "mailto:abdulrhman.eldaly@gmail.com",
                ],
                ["Phone", "+20 101 010 7050", "tel:+201010107050"],
                [
                  "GitHub",
                  "github.com/dalyDev-js",
                  "https://github.com/dalyDev-js",
                ],
                [
                  "LinkedIn",
                  "abdulrhman-eldaly",
                  "https://linkedin.com/in/abdulrhman-eldaly",
                ],
              ].map(([lbl, val, href]) => (
                <a
                  key={lbl}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  style={{
                    display: "flex",
                    gap: "1rem",
                    alignItems: "center",
                    textDecoration: "none",
                    padding: "0.9rem 1.2rem",
                    background: p.s2,
                    border: `1px solid ${p.br}`,
                    borderRadius: "10px",
                    transition: "border-color .2s,background .2s",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor =
                      `${p.pri}40`;
                    (e.currentTarget as HTMLElement).style.background =
                      `${p.pri}06`;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = p.br;
                    (e.currentTarget as HTMLElement).style.background = p.s2;
                  }}>
                  <span
                    style={{
                      fontFamily: "var(--v3-jb)",
                      fontSize: "0.58rem",
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      color: p.pri,
                      minWidth: "70px",
                    }}>
                    {lbl}
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--v3-sg)",
                      fontSize: "0.8rem",
                      color: `${p.fg}BB`,
                    }}>
                    {val}
                  </span>
                </a>
              ))}
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.7 }}>
            <div
              style={{
                background: p.s2,
                border: `1px solid ${p.br}`,
                borderRadius: "16px",
                padding: "2.5rem",
              }}>
              <form
                ref={formRef}
                onSubmit={(e) => {
                  e.preventDefault();
                  const fd = new FormData(formRef.current!);
                  window.location.href = `mailto:abdulrhman.eldaly@gmail.com?subject=Portfolio Contact from ${fd.get("name")}&body=${fd.get("message")}%0A%0AFrom: ${fd.get("name")} (${fd.get("email")})`;
                }}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1.4rem",
                }}>
                {[
                  ["name", "text", "Your name"],
                  ["email", "email", "your@email.com"],
                ].map(([name, type, ph]) => (
                  <div key={name}>
                    <label
                      style={{
                        display: "block",
                        fontFamily: "var(--v3-jb)",
                        fontSize: "0.58rem",
                        letterSpacing: "0.2em",
                        textTransform: "uppercase",
                        color: p.pri,
                        marginBottom: "0.5rem",
                      }}>
                      {name}
                    </label>
                    <input
                      name={name}
                      type={type}
                      placeholder={ph}
                      required
                      style={{
                        width: "100%",
                        background: `${p.bg}CC`,
                        border: `1px solid ${p.br}`,
                        borderRadius: "8px",
                        padding: "0.8rem 1rem",
                        color: p.fg,
                        fontSize: "0.88rem",
                        fontFamily: "var(--v3-sg)",
                        outline: "none",
                        boxSizing: "border-box",
                        transition: "border-color .2s",
                      }}
                      onFocus={(e) =>
                        (e.currentTarget.style.borderColor = `${p.pri}60`)
                      }
                      onBlur={(e) => (e.currentTarget.style.borderColor = p.br)}
                    />
                  </div>
                ))}
                <div>
                  <label
                    style={{
                      display: "block",
                      fontFamily: "var(--v3-jb)",
                      fontSize: "0.58rem",
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                      color: p.pri,
                      marginBottom: "0.5rem",
                    }}>
                    message
                  </label>
                  <textarea
                    name="message"
                    rows={5}
                    placeholder="Tell me about your project..."
                    required
                    style={{
                      width: "100%",
                      background: `${p.bg}CC`,
                      border: `1px solid ${p.br}`,
                      borderRadius: "8px",
                      padding: "0.8rem 1rem",
                      color: p.fg,
                      fontSize: "0.88rem",
                      fontFamily: "var(--v3-sg)",
                      outline: "none",
                      resize: "none",
                      boxSizing: "border-box",
                      transition: "border-color .2s",
                    }}
                    onFocus={(e) =>
                      (e.currentTarget.style.borderColor = `${p.pri}60`)
                    }
                    onBlur={(e) => (e.currentTarget.style.borderColor = p.br)}
                  />
                </div>
                <button
                  type="submit"
                  style={{
                    padding: "0.9rem 2.2rem",
                    background: p.pri,
                    color: p.fg,
                    border: "none",
                    cursor: "pointer",
                    fontSize: "0.72rem",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    fontFamily: "var(--v3-jb)",
                    borderRadius: "8px",
                    alignSelf: "flex-start",
                    fontWeight: 500,
                    transition: "opacity .2s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}>
                  Send Message ↗
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
//  ROOT
// ══════════════════════════════════════════════════════════════════════════════
export default function V3Page({
  palette = PALETTE_WARM,
}: {
  palette?: V3Palette;
}) {
  const p = palette;
  const { isMobile } = useResponsive();
  return (
    <div
      className={`${sg.variable} ${jb.variable}`}
      style={{
        background: p.bg,
        color: p.fg,
        fontFamily: "var(--v3-sg),system-ui,sans-serif",
        overflowX: "clip",
      }}>
      <style
        dangerouslySetInnerHTML={{
          __html: `
        nav { display: none !important; }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        button { font-family: var(--v3-jb); }
      `,
        }}
      />
      <V3Nav p={p} />
      <V3Hero p={p} />
      <V3About p={p} />
      <V3SkillTree p={p} />
      <V3Experience p={p} />
      <V3Projects p={p} />
      <V3FistBumpExact p={p} />
      <V3Contact p={p} />
      <footer
        style={{
          padding: isMobile ? "1.5rem" : "2rem 3rem",
          borderTop: `1px solid ${p.br}`,
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          gap: isMobile ? "0.4rem" : undefined,
          justifyContent: "space-between",
          alignItems: "center",
          textAlign: isMobile ? "center" : undefined,
        }}>
        <span
          style={{ fontFamily: "var(--v3-sg)", fontWeight: 600, color: p.pri }}>
          AD.
        </span>
        <span
          style={{
            fontFamily: "var(--v3-jb)",
            fontSize: "0.6rem",
            letterSpacing: "0.15em",
            color: p.muted,
          }}>
          2026 ABDULRHMAN EL-DALY ALL RIGHTS RESERVED
        </span>
        <span
          style={{
            fontFamily: "var(--v3-jb)",
            fontSize: "0.6rem",
            color: p.muted,
          }}>
          Available for opportunities
        </span>
      </footer>
    </div>
  );
}
