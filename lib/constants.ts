export const personalInfo = {
  name: "Abdulrhman El-Daly",
  fullName: "Abdulrhman Mahmoud El-Daly",
  title: "Senior Frontend Developer",
  subtitle: "& UI/UX Developer",
  tagline: "Crafting immersive digital experiences with code and design",
  location: "6th of October, Giza, Egypt",
  email: "abdulrhman.eldaly@gmail.com",
  phone: "+201010107050",
  linkedin: "https://linkedin.com/in/abdulrhman-eldaly",
  github: "https://github.com/dalyDev-js",
  bio: "Senior Frontend Developer and UI/UX Developer with over 5 years of experience building high-performance web applications. Expert in React.js and Next.js, specialized in designing intuitive user experiences in Figma and transforming them into pixel-perfect, responsive interfaces. Dedicated to bridging the gap between design aesthetics and robust technical implementation.",
};

export interface Skill {
  name: string;
  category: "frontend" | "design" | "backend" | "tools";
  proficiency: number;
}

export const skills: Skill[] = [
  { name: "React.js", category: "frontend", proficiency: 95 },
  { name: "Next.js", category: "frontend", proficiency: 90 },
  { name: "TypeScript", category: "frontend", proficiency: 90 },
  { name: "JavaScript", category: "frontend", proficiency: 95 },
  { name: "Redux Toolkit", category: "frontend", proficiency: 85 },
  { name: "React Query", category: "frontend", proficiency: 85 },
  { name: "Framer Motion", category: "frontend", proficiency: 80 },
  { name: "HTML5/CSS3", category: "frontend", proficiency: 95 },
  { name: "Tailwind CSS", category: "design", proficiency: 92 },
  { name: "Figma", category: "design", proficiency: 88 },
  { name: "Shadcn UI", category: "design", proficiency: 90 },
  { name: "Material UI", category: "design", proficiency: 85 },
  { name: "Node.js", category: "backend", proficiency: 75 },
  { name: "Express.js", category: "backend", proficiency: 75 },
  { name: "MongoDB", category: "backend", proficiency: 70 },
  { name: "Git/GitHub", category: "tools", proficiency: 90 },
];

export interface Experience {
  company: string;
  role: string;
  period: string;
  type: string;
  bullets: string[];
}

export const experiences: Experience[] = [
  {
    company: "World Of Systems and Software",
    role: "Senior Frontend Developer",
    period: "Dec 2024 – Present",
    type: "Remote",
    bullets: [
      "Mentoring and onboarding junior frontend developers, improving team delivery speed by 20%",
      "Leading design-to-code workflow, transforming Figma prototypes into high-performance Shadcn UI components",
      "Optimized state management and frontend architecture, reducing initial page load times by 30%",
    ],
  },
  {
    company: "BlackStone eIT",
    role: "Frontend Developer",
    period: "June 2024 – Nov 2024",
    type: "Project Based",
    bullets: [
      "Developed the GovAcademy Workspace Dashboard using Next.js and Redux",
      "Focused on complex data visualization and design consistency with Material UI",
      "Ensured all UI components meet accessibility standards",
    ],
  },
  {
    company: "AsgaTech",
    role: "Frontend Developer",
    period: "Aug 2022 – Jan 2024",
    type: "Full-time",
    bullets: [
      "Optimized data fetching with React Query and Redux, enhancing application performance",
      "Developed a reusable component analysis tool, cutting development time for new features",
    ],
  },
  {
    company: "Remote & Independent",
    role: "Frontend Developer",
    period: "Feb 2021 – May 2022",
    type: "Freelance",
    bullets: [
      "Led frontend development for Cordital marketing platform",
      "Engineered Qomra — a performance-optimized, SEO-friendly website",
      "Built multiple e-commerce and corporate platforms using React.js",
    ],
  },
];

export interface Project {
  title: string;
  description: string;
  tech: string[];
  color: string;
  image: string;
}

export const projects: Project[] = [
  {
    title: "Chambers Services Portal",
    description:
      "Government electronic portal for Saudi chambers of commerce. Enables electronic applications, membership management, and certificate issuance.",
    tech: ["Next.js", "TypeScript", "Tailwind CSS", "Redux"],
    color: "#f97316",
    image: "/projects/chambers.png",
  },
  {
    title: "GovAcademy Dashboard",
    description:
      "Comprehensive workspace dashboard for government academy with talent profiles, job management, IDP, and scholarship services.",
    tech: ["Next.js", "Redux", "Material UI", "Data Visualization"],
    color: "#eab308",
    image: "/projects/dge.jpg",
  },
  {
    title: "Wildlife Services",
    description:
      "Official Saudi government platform for wildlife services including import/export permits and the Fitri platform.",
    tech: ["Next.js", "TypeScript", "Responsive Design", "SEO"],
    color: "#f97316",
    image: "/projects/wildlife.png",
  },
  {
    title: "Hemmah",
    description:
      "Housekeeper services platform offering various service packages, order management, and e-services with bilingual support.",
    tech: ["React.js", "Redux", "Responsive Design", "REST API"],
    color: "#eab308",
    image: "/projects/hemmah.png",
  },
  {
    title: "Qomra",
    description:
      "Performance-optimized, SEO-friendly cultural and tourism website showcasing Saudi Arabia through its people's eyes.",
    tech: ["React.js", "SEO", "Performance", "Responsive Design"],
    color: "#f97316",
    image: "/projects/qomra.png",
  },
  {
    title: "Cordital",
    description:
      "B2B full-funnel marketing platform driving sustainable revenue growth with data-driven strategies and cross-browser compatibility.",
    tech: ["React.js", "CSS3", "Responsive Design", "Performance"],
    color: "#eab308",
    image: "/projects/cordital.png",
  },
];

export const stats = [
  { label: "Years Experience", value: 5 },
  { label: "Projects Delivered", value: 6 },
  { label: "Companies", value: 4 },
];

export const navLinks = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
];
