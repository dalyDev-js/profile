// ── /v4 "Then / Now" design tokens ────────────────────────────────────────────
// The page runs a dark → light arc: hero and childhood live in DARK, the sphere
// carries us across, projects and contact live in LIGHT.

export const V4 = {
  dark: "#07090F",
  darkS1: "#0C1120",
  darkBr: "rgba(255,255,255,0.08)",
  darkFg: "#F1F5F9",
  darkMuted: "#64748B",

  light: "#F5F3EE",
  lightS1: "#EDEAE3",
  lightBr: "rgba(12,14,20,0.14)",
  lightFg: "#12141A",
  lightMuted: "#71717A",

  cyan: "#22D3EE",
  violet: "#A78BFA",
} as const;

export const NAV_H = 56;

// One tone behind the present-day portrait.
//
// V3About stacks three: the <img> carries its own inline backing (p.s2), the
// section behind it is p.s1, and the page is another shade again. Because the
// ink portrait is a transparent PNG, all of that shows through, and scrolling
// past the boundaries reads as the portrait's background changing. The landed
// paper is matched to this too, so the handoff can't introduce a fourth.
export const V4_PORTRAIT_BG = "#EDEAE3";

export type V4Case = {
  n: string;
  title: string;
  client: string;
  blurb: string;
  tags: string[];
  image: string;
  ink: string;
  device: "laptop";
  // The lid is sized to the capture's own aspect, so the shot fills the screen
  // exactly: nothing cropped, and no letterbox bars to colour-match. Measured
  // from the files — update if an image is replaced.
  aspect: number;
};

// Six featured, not all twelve — each case owns roughly a viewport of scroll.
export const CASES: V4Case[] = [
  {
    n: "01",
    title: "Rakam",
    client: "Product Owner · Multi-tenant SaaS",
    blurb:
      "A five-module business platform — project management, CRM, finance, HR and reporting — built and owned end to end.",
    tags: ["NEXTJS", "NESTJS", "POSTGRES", "REDIS"],
    image: "/projects/rakam.png",
    ink: "#F97316",
    device: "laptop",
    aspect: 1912 / 910,
  },
  {
    n: "02",
    title: "CallStack",
    client: "Interactive Visualisation",
    blurb:
      "A visual explainer for the JavaScript event loop — call stack, queues and rendering, animated frame by frame.",
    tags: ["NEXTJS", "TYPESCRIPT", "FRAMER MOTION"],
    image: "/projects/callstack.png",
    ink: "#22D3EE",
    device: "laptop",
    aspect: 1440 / 900,
  },
  {
    n: "03",
    title: "AlBootcamp",
    client: "EdTech Platform",
    blurb:
      "A coding-bootcamp platform: cohorts, curriculum delivery, student progress and admin tooling in one system.",
    tags: ["REACT", "NODEJS", "MONGODB", "REDUX"],
    image: "/projects/albootcamp.png",
    ink: "#A855F7",
    device: "laptop",
    aspect: 1908 / 907,
  },
  {
    n: "04",
    title: "Chambers Portal",
    client: "Government Enterprise",
    blurb:
      "A public-facing services portal for a national chambers body, built for scale, accessibility and Arabic-first content.",
    tags: ["NEXTJS", "TYPESCRIPT", "TAILWIND"],
    image: "/projects/chambers.png",
    ink: "#3B82F6",
    device: "laptop",
    aspect: 1902 / 911,
  },
  {
    n: "05",
    title: "GovAcademy",
    client: "Enterprise Dashboard",
    blurb:
      "A training-and-analytics dashboard for a government academy — dense data made legible for non-technical staff.",
    tags: ["NEXTJS", "MATERIAL UI", "DATA VIZ"],
    image: "/projects/dge.jpg",
    ink: "#10B981",
    device: "laptop",
    aspect: 1900 / 947,
  },
  {
    n: "06",
    title: "El Matba5",
    client: "Food Tech",
    blurb:
      "An ordering platform with a live menu, cart and checkout flow tuned for speed on low-end mobile connections.",
    tags: ["REACT", "REDUX", "REST API"],
    image: "/projects/elmatba5.png",
    ink: "#EF4444",
    device: "laptop",
    aspect: 1918 / 918,
  },
];
