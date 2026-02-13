"use client";
import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { projects } from "@/lib/constants";
import SectionHeading from "@/components/ui/SectionHeading";

gsap.registerPlugin(ScrollTrigger);

function ProjectCard({
  project,
  index,
}: {
  project: (typeof projects)[0];
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [glare, setGlare] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setTilt({ x: (y - 0.5) * -12, y: (x - 0.5) * 12 });
    setGlare({ x: x * 100, y: y * 100 });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setGlare({ x: 50, y: 50 });
  };

  return (
    <div
      ref={cardRef}
      className="project-card group relative w-[85vw] max-w-[420px] flex-shrink-0 cursor-pointer overflow-hidden rounded-2xl bg-white/[0.03] sm:w-[60vw] md:w-[45vw] lg:w-[30vw]"
      style={{
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: "transform 0.15s ease-out",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Project screenshot */}
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={project.image}
          alt={project.title}
          fill
          className="object-cover object-top transition-transform duration-500"
          style={{ transform: `scale(1.05) translateY(${tilt.x * -0.5}px)` }}
          sizes="(max-width: 640px) 85vw, (max-width: 768px) 60vw, (max-width: 1024px) 45vw, 30vw"
        />
        <div
          className="absolute inset-0"
          style={{ background: `linear-gradient(to top, ${project.color}40 0%, transparent 60%)` }}
        />
        <div
          className="absolute right-4 top-4 font-mono text-5xl font-bold"
          style={{ color: `rgba(255,255,255,0.15)` }}
        >
          {String(index + 1).padStart(2, "0")}
        </div>
      </div>

      {/* Background */}
      <div
        className="absolute inset-0"
        style={{ background: `linear-gradient(135deg, ${project.color}12, ${project.color}05)` }}
      />
      <div className="absolute inset-0 rounded-2xl border border-white/10" />

      {/* Glare */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,0.1) 0%, transparent 60%)` }}
      />

      {/* Content */}
      <div className="relative p-6">
        <h3 className="text-xl font-bold">{project.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-zinc-400 line-clamp-2">
          {project.description}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {project.tech.map((t) => (
            <span
              key={t}
              className="rounded-full px-2.5 py-0.5 text-xs font-medium"
              style={{
                background: `${project.color}15`,
                color: project.color,
                border: `1px solid ${project.color}25`,
              }}
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ProjectsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !trackRef.current) return;

    const track = trackRef.current;
    const scrollWidth = track.scrollWidth - window.innerWidth;

    const ctx = gsap.context(() => {
      // Animate cards staggering in from below
      gsap.fromTo(
        ".project-card",
        { y: 80, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.08,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            end: "top 40%",
            scrub: 1,
          },
        }
      );

      // Horizontal scroll
      gsap.to(track, {
        x: -scrollWidth,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: () => `+=${scrollWidth}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="projects" className="relative z-10 overflow-hidden bg-background">
      <div className="flex h-screen flex-col justify-center">
        <div ref={headingRef} className="px-6 pb-12">
          <SectionHeading title="Projects" subtitle="Selected work I'm proud of" />
        </div>

        <div ref={trackRef} className="flex items-center gap-8 px-6">
          {projects.map((project, i) => (
            <ProjectCard key={project.title} project={project} index={i} />
          ))}
          {/* Spacer so last card has room */}
          <div className="w-[10vw] flex-shrink-0" />
        </div>
      </div>
    </section>
  );
}
