"use client";
import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { personalInfo } from "@/lib/constants";
import SectionHeading from "@/components/ui/SectionHeading";
import GlassCard from "@/components/ui/GlassCard";
import MagneticButton from "@/components/ui/MagneticButton";


gsap.registerPlugin(ScrollTrigger);

const contactLinks = [
  {
    label: "Email",
    value: personalInfo.email,
    href: `mailto:${personalInfo.email}`,
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    label: "Phone",
    value: personalInfo.phone,
    href: `tel:${personalInfo.phone}`,
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    value: "abdulrhman-eldaly",
    href: personalInfo.linkedin,
    icon: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: "GitHub",
    value: "dalyDev-js",
    href: personalInfo.github,
    icon: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
      </svg>
    ),
  },
];

export default function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const decor1Ref = useRef<HTMLDivElement>(null);
  const decor2Ref = useRef<HTMLDivElement>(null);
  const decor3Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Parallax decorative shapes
      [decor1Ref, decor2Ref, decor3Ref].forEach((ref, i) => {
        gsap.to(ref.current, {
          y: (i % 2 === 0 ? -40 : 50) * (i + 1) * 0.5,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      });

      // Left content slides up
      gsap.fromTo(
        ".contact-left",
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            end: "top 40%",
            scrub: 1,
          },
        }
      );

      // Right form slides up with delay
      gsap.fromTo(
        ".contact-right",
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            end: "top 35%",
            scrub: 1,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="contact" className="relative z-10 py-20 overflow-hidden bg-background">
      {/* Floating decorative shapes — parallax */}
      <div
        ref={decor1Ref}
        className="absolute -right-10 top-20 h-24 w-24 rounded-full border border-accent-primary/10"
      />
      <div
        ref={decor2Ref}
        className="absolute left-10 bottom-20 h-16 w-16 rounded-lg border border-accent-secondary/10"
      />
      <div
        ref={decor3Ref}
        className="absolute right-1/4 bottom-1/3 h-8 w-8 rounded-full bg-accent-primary/5"
      />

      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          title="Get in Touch"
          subtitle="Let's work together on something great"
        />

        <div className="grid gap-12 lg:grid-cols-2">
          {/* Left: Contact info */}
          <div className="contact-left space-y-8">
            <h3 className="text-3xl font-bold sm:text-4xl">
              Let&apos;s Build
              <br />
              <span className="gradient-text">Something Amazing</span>
            </h3>

            <p className="text-zinc-400">
              I&apos;m always open to new opportunities and interesting projects.
              Whether you need a senior frontend developer or a UI/UX designer,
              feel free to reach out.
            </p>

            <div className="space-y-4">
              {contactLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 rounded-xl p-3 transition-colors hover:bg-white/3"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-primary/10 text-accent-primary transition-colors group-hover:bg-accent-primary/20">
                    {link.icon}
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500">{link.label}</p>
                    <p className="text-sm text-zinc-300 transition-colors group-hover:text-white">
                      {link.value}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Right: Contact form */}
          <div className="contact-right">
            <GlassCard className="p-8">
              <form
                ref={formRef}
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(formRef.current!);
                  const name = formData.get("name");
                  const email = formData.get("email");
                  const message = formData.get("message");
                  window.location.href = `mailto:${personalInfo.email}?subject=Portfolio Contact from ${name}&body=${message}%0A%0AFrom: ${name} (${email})`;
                }}
                className="space-y-6"
              >
                <div>
                  <label className="mb-2 block text-sm text-zinc-400">Name</label>
                  <input
                    name="name"
                    type="text"
                    required
                    className="w-full rounded-xl border border-white/10 bg-white/3 px-4 py-3 text-sm text-foreground outline-none transition-all focus:border-accent-primary/50 focus:shadow-[0_0_20px_rgba(249,115,22,0.1)]"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm text-zinc-400">Email</label>
                  <input
                    name="email"
                    type="email"
                    required
                    className="w-full rounded-xl border border-white/10 bg-white/3 px-4 py-3 text-sm text-foreground outline-none transition-all focus:border-accent-primary/50 focus:shadow-[0_0_20px_rgba(249,115,22,0.1)]"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm text-zinc-400">Message</label>
                  <textarea
                    name="message"
                    required
                    rows={5}
                    className="w-full resize-none rounded-xl border border-white/10 bg-white/3 px-4 py-3 text-sm text-foreground outline-none transition-all focus:border-accent-primary/50 focus:shadow-[0_0_20px_rgba(249,115,22,0.1)]"
                    placeholder="Tell me about your project..."
                  />
                </div>
                <MagneticButton variant="solid" onClick={() => formRef.current?.requestSubmit()}>
                  Send Message
                </MagneticButton>
              </form>
            </GlassCard>
          </div>
        </div>
      </div>
    </section>
  );
}
