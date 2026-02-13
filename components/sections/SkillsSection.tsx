"use client";
import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { skills } from "@/lib/constants";
import SectionHeading from "@/components/ui/SectionHeading";

gsap.registerPlugin(ScrollTrigger);

// Distinct colors per category — clearly different hues
const categoryColors: Record<string, { text: string; glow: string; border: string; rgb: string; label: string }> = {
  frontend: { text: "#f97316", glow: "rgba(249,115,22,0.4)", border: "rgba(249,115,22,0.3)", rgb: "249,115,22", label: "Frontend" },
  design: { text: "#ec4899", glow: "rgba(236,72,153,0.4)", border: "rgba(236,72,153,0.3)", rgb: "236,72,153", label: "UI/UX & Design" },
  backend: { text: "#06b6d4", glow: "rgba(6,182,212,0.4)", border: "rgba(6,182,212,0.3)", rgb: "6,182,212", label: "Backend" },
  tools: { text: "#a855f7", glow: "rgba(168,85,247,0.4)", border: "rgba(168,85,247,0.3)", rgb: "168,85,247", label: "Tools" },
};

// Tree node positions — organic placement on branches
// x/y are percentages of the tree container
const TREE_NODES = [
  // Root level — Tools
  { x: 32, y: 86, skillIdx: 15 },  // Git/GitHub
  // Lower trunk — Backend
  { x: 65, y: 78, skillIdx: 14 },  // MongoDB
  { x: 25, y: 72, skillIdx: 13 },  // Express.js
  { x: 70, y: 68, skillIdx: 12 },  // Node.js
  // Mid level — Design
  { x: 18, y: 60, skillIdx: 11 },  // Material UI
  { x: 55, y: 57, skillIdx: 10 },  // Shadcn UI
  { x: 78, y: 54, skillIdx: 9 },   // Figma
  { x: 35, y: 50, skillIdx: 8 },   // Tailwind CSS
  // Upper mid — Frontend lower
  { x: 12, y: 42, skillIdx: 7 },   // HTML5/CSS3
  { x: 60, y: 39, skillIdx: 6 },   // Framer Motion
  { x: 82, y: 42, skillIdx: 5 },   // React Query
  { x: 38, y: 35, skillIdx: 4 },   // Redux Toolkit
  // Crown — Frontend upper
  { x: 22, y: 27, skillIdx: 3 },   // JavaScript
  { x: 65, y: 24, skillIdx: 2 },   // TypeScript
  { x: 48, y: 18, skillIdx: 1 },   // Next.js
  { x: 45, y: 8, skillIdx: 0 },    // React.js (crown jewel)
];

// Realistic tree SVG paths
const TRUNK_PATHS = [
  // Main trunk — left edge (thick, tapered with knotty wobble)
  "M 43 98 C 43 93, 42.5 88, 43 82 C 43.5 76, 42.8 70, 43.2 64 C 43.5 56, 42.8 48, 43.5 40 C 44 32, 43.5 24, 44 16 C 44.3 12, 44.5 8, 45.5 4",
  // Main trunk — right edge
  "M 53 98 C 53 93, 53.5 88, 53 82 C 52.5 76, 53.2 70, 52.8 64 C 52.5 56, 53.2 48, 52.5 40 C 52 32, 52.5 24, 52 16 C 51.7 12, 51.5 8, 49 4",
  // Center vein
  "M 48 98 C 48 88, 47.8 76, 48 64 C 48.2 52, 47.8 40, 48 28 C 48.1 20, 47.5 12, 47.2 4",
];

// Main branch paths — thick, organic curves with natural bends
const BRANCH_PATHS = [
  // To Git/GitHub (tools, bottom left) — thick low branch
  "M 43 88 C 41 87.5, 39 87, 37.5 86.5 C 36 86, 35 86, 34 86",
  // To MongoDB (backend, right) — swooping right
  "M 53 80 C 55 79.5, 57 79, 59 78.5 C 61 78, 63 78, 65 78",
  // To Express.js (backend, left) — long left branch
  "M 43 74 C 40 73.5, 37 73, 34 72.5 C 31 72, 28 72, 27 72",
  // To Node.js (backend, right) — curves up slightly
  "M 53 70 C 56 69.5, 59 69, 62 68.5 C 65 68, 67 68, 68 68",
  // To Material UI (design, far left) — long sweeping
  "M 43 62 C 39 61.5, 34 61, 29 60.5 C 24 60, 21 60, 20 60",
  // To Shadcn UI (design, mid-right)
  "M 50 58 C 51 57.5, 52 57, 53 57 C 54 57, 54.5 57, 55 57",
  // To Figma (design, far right) — long with curve
  "M 53 56 C 57 55.5, 61 55, 65 54.5 C 69 54, 73 54, 76 54",
  // To Tailwind CSS (design, mid-left)
  "M 44 52 C 42 51.5, 40 51, 38.5 50.5 C 37.5 50, 37 50, 37 50",
  // To HTML5/CSS3 (frontend, far left) — long sweeping branch
  "M 43 44 C 38 43.5, 32 43, 26 42.5 C 20 42, 16 42, 14 42",
  // To Framer Motion (frontend, right)
  "M 50 40 C 52 39.8, 54 39.5, 56 39.3 C 57 39.2, 58 39, 58 39",
  // To React Query (frontend, far right)
  "M 52 43 C 57 42.5, 62 42, 68 42 C 74 42, 78 42, 80 42",
  // To Redux Toolkit (frontend, mid-left)
  "M 45 36 C 43 35.8, 41.5 35.5, 40 35.3 C 39 35.1, 39 35, 39 35",
  // To JavaScript (frontend, left)
  "M 44 28 C 40 27.5, 35 27, 30 27 C 27 27, 25 27, 24 27",
  // To TypeScript (frontend, right)
  "M 50 25 C 53 24.5, 56 24, 59 24 C 61 24, 63 24, 63 24",
  // To Next.js (frontend, center-top)
  "M 47 19 C 47.2 18.5, 47.5 18.2, 48 18",
  // To React.js (crown, top)
  "M 47 10 C 46.5 9, 46 8.5, 45.5 8",
];

// Secondary sub-branches forking off main branches for realism
const TWIG_PATHS = [
  // Off bottom-left branch
  "M 39 87 C 38 85, 36 83, 34 82",
  "M 37 86.5 C 36 88, 34.5 89, 33 89",
  // Off right branch
  "M 57 79 C 58 77, 59 75, 57 74",
  "M 61 78.5 C 63 80, 64 81, 63 82",
  // Off left branch
  "M 37 73 C 35 71, 33 70, 31 70",
  "M 34 72.5 C 32 74, 30 75, 28 75",
  // Off design branches
  "M 29 60.5 C 27 59, 25 58, 23 58",
  "M 65 54.5 C 67 53, 69 52, 70 51",
  // Off frontend branches
  "M 32 43 C 30 41, 28 40, 26 40",
  "M 68 42 C 70 40.5, 72 39, 73 38",
  "M 35 27 C 33 25.5, 31 25, 29 25.5",
  "M 56 24 C 58 22.5, 60 22, 61 22.5",
  // Crown twigs
  "M 46 14 C 43 12.5, 40 12, 38 13",
  "M 49 12 C 52 10.5, 55 10, 57 11",
  "M 44 7 C 41 5, 38 4, 37 5",
  "M 49 6 C 52 4.5, 55 4, 56 5",
];

// Leaf positions: {x, y, rotation, scale, color, delay}
// Leaves are scattered along branches and at tips
const LEAVES: { x: number; y: number; rot: number; s: number; color: string; branchIdx: number }[] = [
  // Bottom branches (warmer, autumn-like)
  { x: 36, y: 84, rot: -30, s: 1, color: "#4ade80", branchIdx: 0 },
  { x: 33, y: 82, rot: 45, s: 0.8, color: "#22c55e", branchIdx: 0 },
  { x: 34, y: 88.5, rot: 120, s: 0.7, color: "#84cc16", branchIdx: 0 },
  { x: 60, y: 77, rot: 20, s: 0.9, color: "#4ade80", branchIdx: 1 },
  { x: 58, y: 75, rot: -40, s: 0.7, color: "#22c55e", branchIdx: 1 },
  { x: 63, y: 81, rot: 80, s: 0.8, color: "#84cc16", branchIdx: 1 },
  // Left/right backend branches
  { x: 34, y: 71, rot: -50, s: 0.9, color: "#4ade80", branchIdx: 2 },
  { x: 31, y: 70, rot: 30, s: 0.7, color: "#22c55e", branchIdx: 2 },
  { x: 30, y: 74.5, rot: 110, s: 0.8, color: "#84cc16", branchIdx: 2 },
  { x: 64, y: 67, rot: 15, s: 0.9, color: "#4ade80", branchIdx: 3 },
  { x: 57, y: 73.5, rot: -25, s: 0.7, color: "#16a34a", branchIdx: 3 },
  // Design level branches
  { x: 27, y: 59, rot: -20, s: 1, color: "#22c55e", branchIdx: 4 },
  { x: 24, y: 58, rot: 55, s: 0.7, color: "#4ade80", branchIdx: 4 },
  { x: 67, y: 53, rot: 10, s: 0.9, color: "#84cc16", branchIdx: 6 },
  { x: 70, y: 51.5, rot: -35, s: 0.7, color: "#22c55e", branchIdx: 6 },
  { x: 69, y: 55, rot: 80, s: 0.8, color: "#4ade80", branchIdx: 6 },
  { x: 39, y: 49, rot: -45, s: 0.8, color: "#16a34a", branchIdx: 7 },
  // Frontend branches
  { x: 30, y: 41, rot: 30, s: 0.9, color: "#4ade80", branchIdx: 8 },
  { x: 27, y: 40, rot: -20, s: 0.7, color: "#22c55e", branchIdx: 8 },
  { x: 26, y: 43, rot: 100, s: 0.8, color: "#84cc16", branchIdx: 8 },
  { x: 70, y: 40.5, rot: -15, s: 0.9, color: "#4ade80", branchIdx: 10 },
  { x: 72, y: 39, rot: 45, s: 0.7, color: "#16a34a", branchIdx: 10 },
  { x: 73, y: 42, rot: 90, s: 0.75, color: "#84cc16", branchIdx: 10 },
  // Upper branches
  { x: 33, y: 25.5, rot: -30, s: 0.9, color: "#4ade80", branchIdx: 12 },
  { x: 30, y: 25, rot: 50, s: 0.7, color: "#22c55e", branchIdx: 12 },
  { x: 29, y: 27, rot: 120, s: 0.75, color: "#84cc16", branchIdx: 12 },
  { x: 58, y: 22.5, rot: 20, s: 0.9, color: "#4ade80", branchIdx: 13 },
  { x: 61, y: 22, rot: -40, s: 0.7, color: "#16a34a", branchIdx: 13 },
  // Crown area — lush
  { x: 42, y: 12, rot: -60, s: 1, color: "#22c55e", branchIdx: 14 },
  { x: 39, y: 13, rot: 35, s: 0.8, color: "#4ade80", branchIdx: 14 },
  { x: 38, y: 11, rot: 90, s: 0.7, color: "#16a34a", branchIdx: 14 },
  { x: 53, y: 10, rot: 25, s: 1, color: "#4ade80", branchIdx: 15 },
  { x: 56, y: 11, rot: -50, s: 0.8, color: "#22c55e", branchIdx: 15 },
  { x: 55, y: 9, rot: 70, s: 0.7, color: "#84cc16", branchIdx: 15 },
  { x: 41, y: 5, rot: -40, s: 0.9, color: "#22c55e", branchIdx: 15 },
  { x: 37, y: 4.5, rot: 60, s: 0.7, color: "#4ade80", branchIdx: 15 },
  { x: 52, y: 4, rot: 15, s: 0.9, color: "#84cc16", branchIdx: 15 },
  { x: 55, y: 5, rot: -70, s: 0.7, color: "#16a34a", branchIdx: 15 },
  { x: 44, y: 3, rot: 0, s: 1.1, color: "#22c55e", branchIdx: 15 },
  { x: 50, y: 2.5, rot: 45, s: 0.9, color: "#4ade80", branchIdx: 15 },
];

export default function SkillsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const spinnerRef = useRef<HTMLDivElement>(null);
  const innerRingRef = useRef<HTMLDivElement>(null);
  const outerRingRef = useRef<HTMLDivElement>(null);
  const velocityRef = useRef(0);
  const lastProgressRef = useRef(0);

  useEffect(() => {
    if (!sectionRef.current) return;

    const totalNodes = TREE_NODES.length;
    const scrollDistance = window.innerHeight * 3.5;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: () => `+=${scrollDistance}`,
        pin: true,
        onUpdate: (self) => {
          const delta = self.progress - lastProgressRef.current;
          velocityRef.current = delta;
          lastProgressRef.current = self.progress;

          const baseRotation = self.progress * 720;
          const velocityBoost = velocityRef.current * 8000;
          const totalRotation = baseRotation + velocityBoost;

          if (spinnerRef.current) spinnerRef.current.style.transform = `rotate(${totalRotation}deg)`;
          if (innerRingRef.current) innerRingRef.current.style.transform = `rotate(${-totalRotation * 0.6}deg)`;
          if (outerRingRef.current) outerRingRef.current.style.transform = `rotate(${totalRotation * 0.3}deg)`;

          const section = sectionRef.current;
          if (!section) return;

          // Grow trunk lines
          const trunks = section.querySelectorAll<SVGPathElement>(".tree-trunk");
          trunks.forEach((trunk) => {
            const len = trunk.getTotalLength();
            const trunkP = Math.min(self.progress * 2.5, 1);
            trunk.style.strokeDashoffset = String(len * (1 - trunkP));
          });

          // Grow decorative twigs
          const twigs = section.querySelectorAll<SVGPathElement>(".tree-twig");
          twigs.forEach((twig, i) => {
            const len = twig.getTotalLength();
            const twigStart = 0.1 + (i / twigs.length) * 0.5;
            const twigEnd = twigStart + 0.1;
            const p = self.progress;
            if (p < twigStart) {
              twig.style.strokeDashoffset = String(len);
            } else if (p >= twigEnd) {
              twig.style.strokeDashoffset = "0";
            } else {
              twig.style.strokeDashoffset = String(len * (1 - (p - twigStart) / (twigEnd - twigStart)));
            }
          });

          // Grow branches and reveal fruit
          const branches = section.querySelectorAll<SVGPathElement>(".tree-branch");
          const fruits = section.querySelectorAll<HTMLElement>(".skill-fruit");
          const labels = section.querySelectorAll<HTMLElement>(".skill-label");
          const leaves = section.querySelectorAll<SVGGElement>(".tree-leaf");

          branches.forEach((branch, i) => {
            const len = branch.getTotalLength();
            const branchStart = 0.06 + (i / totalNodes) * 0.74;
            const branchEnd = branchStart + 0.07;
            const p = self.progress;

            if (p < branchStart) {
              branch.style.strokeDashoffset = String(len);
            } else if (p >= branchEnd) {
              branch.style.strokeDashoffset = "0";
            } else {
              const t = (p - branchStart) / (branchEnd - branchStart);
              branch.style.strokeDashoffset = String(len * (1 - t));
            }

            // Fruit pops in when branch finishes
            const fruitStart = branchEnd - 0.01;
            const fruitEnd = branchEnd + 0.035;
            if (fruits[i]) {
              if (p < fruitStart) {
                fruits[i].style.transform = "scale(0)";
                fruits[i].style.opacity = "0";
              } else if (p >= fruitEnd) {
                fruits[i].style.transform = "scale(1)";
                fruits[i].style.opacity = "1";
              } else {
                const t = (p - fruitStart) / (fruitEnd - fruitStart);
                // Elastic overshoot
                const eased = t < 1
                  ? 1 - Math.pow(2, -10 * t) * Math.cos((t * 10 - 0.75) * (2 * Math.PI / 3))
                  : 1;
                fruits[i].style.transform = `scale(${eased})`;
                fruits[i].style.opacity = String(Math.min(t * 2, 1));
              }
            }

            // Label
            if (labels[i]) {
              const labelStart = fruitEnd;
              const labelEnd = fruitEnd + 0.02;
              if (p < labelStart) {
                labels[i].style.opacity = "0";
                labels[i].style.transform = "translateY(5px)";
              } else if (p >= labelEnd) {
                labels[i].style.opacity = "1";
                labels[i].style.transform = "translateY(0)";
              } else {
                const t = (p - labelStart) / (labelEnd - labelStart);
                labels[i].style.opacity = String(t);
                labels[i].style.transform = `translateY(${5 * (1 - t)}px)`;
              }
            }
          });

          // Animate leaves — each leaf appears when its associated branch grows
          leaves.forEach((leaf, i) => {
            const leafData = LEAVES[i];
            if (!leafData) return;
            const branchIdx = leafData.branchIdx;
            const branchStart = 0.06 + (branchIdx / totalNodes) * 0.74;
            const branchEnd = branchStart + 0.07;
            // Leaf appears after branch is ~60% grown, with staggered delay per leaf
            const leafStart = branchStart + (branchEnd - branchStart) * 0.6 + (i % 3) * 0.008;
            const leafEnd = leafStart + 0.025;
            const p = self.progress;

            if (p < leafStart) {
              leaf.style.opacity = "0";
              leaf.style.transform = `translate(${leafData.x}, ${leafData.y}) rotate(${leafData.rot}) scale(0)`;
            } else if (p >= leafEnd) {
              leaf.style.opacity = "1";
              leaf.style.transform = `translate(${leafData.x}, ${leafData.y}) rotate(${leafData.rot}) scale(${leafData.s})`;
            } else {
              const t = (p - leafStart) / (leafEnd - leafStart);
              // Bounce easing for leaves
              const bounced = t < 0.5
                ? 4 * t * t * t
                : 1 - Math.pow(-2 * t + 2, 3) / 2;
              const scale = bounced * leafData.s;
              leaf.style.opacity = String(Math.min(t * 2.5, 1));
              leaf.style.transform = `translate(${leafData.x}, ${leafData.y}) rotate(${leafData.rot + (1 - bounced) * 30}) scale(${scale})`;
            }
          });
        },
      });

      // Progress bar
      gsap.fromTo(
        ".skills-progress-bar",
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: () => `+=${scrollDistance}`,
            scrub: 0.3,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="skills" className="relative z-10 overflow-hidden bg-background">
      {/* Progress bar */}
      <div className="absolute left-0 right-0 top-0 z-20 h-[2px] bg-white/5">
        <div
          className="skills-progress-bar h-full origin-left"
          style={{
            background: "linear-gradient(90deg, #f97316, #ec4899, #06b6d4, #a855f7)",
            boxShadow: "0 0 12px rgba(249,115,22,0.5)",
          }}
        />
      </div>

      <div className="flex min-h-screen flex-col">
        <div className="px-6 pt-24 pb-4">
          <SectionHeading title="Skills & Expertise" subtitle="Watch the skill tree grow" />
        </div>

        <div className="relative flex flex-1 px-4 pb-8 lg:px-8">
          {/* LEFT: Skill Tree */}
          <div className="relative flex-1 min-h-0">
            {/* SVG tree */}
            <svg
              className="absolute inset-0 h-full w-full"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="trunkFill" x1="0" y1="1" x2="0" y2="0">
                  <stop offset="0%" stopColor="#451a03" />
                  <stop offset="40%" stopColor="#78350f" />
                  <stop offset="100%" stopColor="#92400e" />
                </linearGradient>
                <linearGradient id="trunkStroke" x1="0" y1="1" x2="0" y2="0">
                  <stop offset="0%" stopColor="#78350f" />
                  <stop offset="50%" stopColor="#92400e" />
                  <stop offset="100%" stopColor="#b45309" />
                </linearGradient>
                <linearGradient id="branchStroke" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#92400e" stopOpacity="0.7" />
                  <stop offset="100%" stopColor="#78350f" stopOpacity="0.3" />
                </linearGradient>
              </defs>

              {/* Trunk fill — thick tapered shape with knotty wobble */}
              <path
                d="M 43 98 C 43 93, 42.5 88, 43 82 C 43.5 76, 42.8 70, 43.2 64
                   C 43.5 56, 42.8 48, 43.5 40 C 44 32, 43.5 24, 44 16 C 44.3 12, 44.5 8, 45.5 4
                   L 49 4
                   C 51.5 8, 51.7 12, 52 16 C 52.5 24, 52 32, 52.5 40
                   C 53.2 48, 52.5 56, 52.8 64 C 53.2 70, 52.5 76, 53 82
                   C 53.5 88, 53 93, 53 98 Z"
                fill="url(#trunkFill)"
                opacity="0.15"
              />

              {/* Trunk edge lines — draw on scroll */}
              {TRUNK_PATHS.map((d, i) => (
                <path
                  key={`trunk-${i}`}
                  className="tree-trunk"
                  d={d}
                  fill="none"
                  stroke="url(#trunkStroke)"
                  strokeWidth={i === 2 ? "0.3" : "0.5"}
                  strokeLinecap="round"
                  opacity={i === 2 ? 0.3 : 0.55}
                  style={{ strokeDasharray: 300, strokeDashoffset: 300 }}
                />
              ))}

              {/* Bark texture — knothole marks and grain lines */}
              <path d="M 46 92 C 46.3 88, 47 84, 46.5 80" fill="none" stroke="#78350f" strokeWidth="0.15" opacity="0.2" />
              <path d="M 50 88 C 49.5 82, 50 77, 49.5 72" fill="none" stroke="#78350f" strokeWidth="0.15" opacity="0.15" />
              <path d="M 47 70 C 47.5 64, 47 58, 47.5 52" fill="none" stroke="#78350f" strokeWidth="0.12" opacity="0.15" />
              <path d="M 49 55 C 49.5 48, 49 42, 49.5 36" fill="none" stroke="#78350f" strokeWidth="0.12" opacity="0.12" />
              <path d="M 47.5 38 C 48 32, 47.5 26, 48 20" fill="none" stroke="#78350f" strokeWidth="0.1" opacity="0.1" />
              {/* Knot marks */}
              <ellipse cx="47" cy="75" rx="1.2" ry="1.8" fill="none" stroke="#78350f" strokeWidth="0.15" opacity="0.12" />
              <ellipse cx="49" cy="50" rx="1" ry="1.5" fill="none" stroke="#78350f" strokeWidth="0.12" opacity="0.1" />

              {/* Roots — spreading at base */}
              <path d="M 43 98 C 40 96.5, 35 96, 29 97 C 25 97.5, 22 99, 20 100" fill="none" stroke="#78350f" strokeWidth="0.4" opacity="0.25" strokeLinecap="round" />
              <path d="M 53 98 C 56 96.5, 61 96, 67 97 C 71 97.5, 74 99, 76 100" fill="none" stroke="#78350f" strokeWidth="0.4" opacity="0.25" strokeLinecap="round" />
              <path d="M 45 98 C 43 98.5, 39 99, 34 100" fill="none" stroke="#78350f" strokeWidth="0.25" opacity="0.18" strokeLinecap="round" />
              <path d="M 51 98 C 53 98.5, 57 99, 62 100" fill="none" stroke="#78350f" strokeWidth="0.25" opacity="0.18" strokeLinecap="round" />
              <path d="M 44 98 C 42 99, 38 100, 33 101" fill="none" stroke="#78350f" strokeWidth="0.2" opacity="0.12" strokeLinecap="round" />
              <path d="M 52 98 C 54 99, 59 100, 64 101" fill="none" stroke="#78350f" strokeWidth="0.2" opacity="0.12" strokeLinecap="round" />

              {/* Sub-branches / twigs — draw on scroll */}
              {TWIG_PATHS.map((d, i) => (
                <path
                  key={`twig-${i}`}
                  className="tree-twig"
                  d={d}
                  fill="none"
                  stroke="#78350f"
                  strokeWidth={i < 6 ? "0.25" : "0.2"}
                  strokeLinecap="round"
                  opacity="0.3"
                  style={{ strokeDasharray: 100, strokeDashoffset: 100 }}
                />
              ))}

              {/* Main branches to skill nodes */}
              {BRANCH_PATHS.map((d, i) => (
                <path
                  key={`branch-${i}`}
                  className="tree-branch"
                  d={d}
                  fill="none"
                  stroke="url(#branchStroke)"
                  strokeWidth={i < 4 ? "0.45" : i < 8 ? "0.38" : "0.3"}
                  strokeLinecap="round"
                  style={{ strokeDasharray: 200, strokeDashoffset: 200 }}
                />
              ))}

              {/* Leaves — small leaf shapes scattered along branches */}
              {LEAVES.map((leaf, i) => (
                <g
                  key={`leaf-${i}`}
                  className="tree-leaf"
                  transform={`translate(${leaf.x}, ${leaf.y}) rotate(${leaf.rot}) scale(${leaf.s})`}
                  opacity="0"
                >
                  {/* Leaf shape: pointed oval with midrib */}
                  <path
                    d="M 0,-1.8 C 0.9,-1.2 1.2,0 0,1.8 C -1.2,0 -0.9,-1.2 0,-1.8 Z"
                    fill={leaf.color}
                    opacity="0.5"
                  />
                  <path
                    d="M 0,-1.8 C 0,0 0,0 0,1.8"
                    fill="none"
                    stroke={leaf.color}
                    strokeWidth="0.15"
                    opacity="0.6"
                  />
                </g>
              ))}
            </svg>

            {/* Skill fruit orbs */}
            {TREE_NODES.map((node, i) => {
              const skill = skills[node.skillIdx];
              const colors = categoryColors[skill.category];

              return (
                <div
                  key={skill.name}
                  className="absolute"
                  style={{
                    left: `${node.x}%`,
                    top: `${node.y}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  {/* Fruit orb */}
                  <div
                    className="skill-fruit group relative flex items-center justify-center"
                    style={{
                      width: "clamp(48px, 5vw, 68px)",
                      height: "clamp(48px, 5vw, 68px)",
                      opacity: 0,
                      transform: "scale(0)",
                    }}
                  >
                    {/* Ambient glow */}
                    <div
                      className="absolute inset-0 rounded-full"
                      style={{
                        background: `radial-gradient(circle, rgba(${colors.rgb},0.2) 0%, transparent 70%)`,
                        transform: "scale(2.5)",
                        animation: "pulse 3s ease-in-out infinite",
                      }}
                    />
                    {/* Main orb */}
                    <div
                      className="relative flex h-full w-full items-center justify-center rounded-full border-2 transition-all duration-300 group-hover:scale-110"
                      style={{
                        background: `radial-gradient(circle at 30% 30%, rgba(${colors.rgb},0.35), rgba(${colors.rgb},0.05))`,
                        borderColor: `rgba(${colors.rgb},0.4)`,
                        boxShadow: `0 0 16px rgba(${colors.rgb},0.25), inset 0 0 10px rgba(${colors.rgb},0.1)`,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow = `0 0 30px rgba(${colors.rgb},0.6), inset 0 0 15px rgba(${colors.rgb},0.25)`;
                        e.currentTarget.style.borderColor = colors.text;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = `0 0 16px rgba(${colors.rgb},0.25), inset 0 0 10px rgba(${colors.rgb},0.1)`;
                        e.currentTarget.style.borderColor = `rgba(${colors.rgb},0.4)`;
                      }}
                    >
                      {/* Proficiency ring */}
                      <svg className="absolute inset-1 h-[calc(100%-8px)] w-[calc(100%-8px)] -rotate-90">
                        <circle cx="50%" cy="50%" r="45%" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="2.5" />
                        <circle
                          cx="50%" cy="50%" r="45%" fill="none" stroke={colors.text} strokeWidth="2.5"
                          strokeDasharray={`${(skill.proficiency / 100) * 141} 141`}
                          strokeLinecap="round" opacity="0.5"
                        />
                      </svg>
                      {/* Shine highlight */}
                      <div
                        className="absolute left-[20%] top-[15%] h-[25%] w-[25%] rounded-full"
                        style={{ background: `radial-gradient(circle, rgba(255,255,255,0.15), transparent)` }}
                      />
                      {/* Percentage */}
                      <span className="relative font-mono text-xs font-bold" style={{ color: colors.text }}>
                        {skill.proficiency}
                      </span>
                    </div>
                  </div>

                  {/* Label */}
                  <div className="skill-label mt-1.5 text-center" style={{ opacity: 0, transform: "translateY(5px)" }}>
                    <p className="whitespace-nowrap text-xs font-semibold leading-tight" style={{ color: colors.text }}>
                      {skill.name}
                    </p>
                  </div>
                </div>
              );
            })}

            {/* Ground line */}
            <div
              className="absolute bottom-0 left-[15%] right-[15%] h-px"
              style={{ background: "linear-gradient(90deg, transparent, rgba(120,53,15,0.3), rgba(120,53,15,0.4), rgba(120,53,15,0.3), transparent)" }}
            />
          </div>

          {/* RIGHT: Spinning shape + legend */}
          <div className="relative hidden w-52 flex-shrink-0 items-center justify-center lg:flex xl:w-64">
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              {/* Outer ring */}
              <div
                ref={outerRingRef}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                style={{ transition: "transform 0.1s linear" }}
              >
                <svg width="220" height="220" viewBox="0 0 220 220" className="opacity-10">
                  <circle cx="110" cy="110" r="100" fill="none" stroke="#f97316" strokeWidth="1" strokeDasharray="8 12" />
                  <circle cx="110" cy="110" r="90" fill="none" stroke="#ec4899" strokeWidth="0.5" strokeDasharray="4 8" />
                </svg>
              </div>

              {/* Inner ring */}
              <div
                ref={innerRingRef}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                style={{ transition: "transform 0.1s linear" }}
              >
                <svg width="140" height="140" viewBox="0 0 140 140" className="opacity-15">
                  <polygon points="70,8 132,39 132,101 70,132 8,101 8,39" fill="none" stroke="#06b6d4" strokeWidth="1" />
                  <polygon points="70,24 116,47 116,93 70,116 24,93 24,47" fill="none" stroke="#a855f7" strokeWidth="0.5" />
                </svg>
              </div>

              {/* Core spinner */}
              <div ref={spinnerRef} className="relative" style={{ transition: "transform 0.08s linear" }}>
                <svg width="100" height="100" viewBox="0 0 120 120">
                  <polygon
                    points="60,5 70,40 105,20 80,50 115,60 80,70 105,100 70,80 60,115 50,80 15,100 40,70 5,60 40,50 15,20 50,40"
                    fill="none" stroke="url(#spinGrad2)" strokeWidth="1.5" opacity="0.4"
                  />
                  <polygon points="60,30 80,60 60,90 40,60" fill="none" stroke="url(#spinGrad2)" strokeWidth="1" opacity="0.25" />
                  <circle cx="60" cy="60" r="3" fill="#f97316" opacity="0.6" />
                  <circle cx="60" cy="60" r="8" fill="none" stroke="#f97316" strokeWidth="0.5" opacity="0.3" />
                  <defs>
                    <linearGradient id="spinGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#f97316" />
                      <stop offset="50%" stopColor="#ec4899" />
                      <stop offset="100%" stopColor="#06b6d4" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              {/* Glow */}
              <div
                className="absolute left-1/2 top-1/2 -z-10 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
                style={{ background: "radial-gradient(circle, rgba(249,115,22,0.08) 0%, transparent 70%)" }}
              />

              {/* Category legend */}
              <div className="absolute left-1/2 top-full mt-10 -translate-x-1/2 space-y-3">
                {Object.entries(categoryColors).map(([cat, c]) => (
                  <div key={cat} className="flex items-center gap-2.5 whitespace-nowrap">
                    <div
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ background: c.text, boxShadow: `0 0 8px ${c.glow}` }}
                    />
                    <span className="text-[11px] uppercase tracking-widest text-zinc-500">{c.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
