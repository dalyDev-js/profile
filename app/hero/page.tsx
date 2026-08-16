import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Hero exploration",
  robots: { index: false, follow: false },
};

const VARIANTS = [
  {
    href: "/hero/a",
    key: "A",
    name: "Ink Plate",
    note: "Editorial split. Cream paper plate on the right holds the ink portrait like a mounted gallery print; masthead, role stack and stat strip on the dark left.",
  },
  {
    href: "/hero/a-glow",
    key: "A2",
    name: "Ink Glow",
    note: "Same masthead, no panel. The portrait floats on the dark page with a white halo traced along every ink line plus a cyan bloom behind it.",
  },
  {
    href: "/hero/a-invert",
    key: "A3",
    name: "Ink Invert",
    note: "Same masthead, portrait flipped to light-line-art. Page stays fully dark; the warm browns and creams shift cool.",
  },
  {
    href: "/hero/b",
    key: "B",
    name: "Live System",
    note: "The hero boots. A console types a real session on the left while live telemetry ticks on the right, over a giant outlined name watermark.",
  },
  {
    href: "/hero/c",
    key: "C",
    name: "Type Wall",
    note: "Vertical marquees of outlined skill type scroll behind a centred portrait. The name sandwiches the artwork — one line behind, one in front.",
  },
];

export default function HeroIndexPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#07090F",
        color: "#F1F5F9",
        padding: "7rem 1.5rem 6rem",
        fontFamily: "var(--font-geist-sans), system-ui, sans-serif",
      }}>
      <style
        dangerouslySetInnerHTML={{ __html: "nav { display: none !important; }" }}
      />
      <div style={{ maxWidth: 780, margin: "0 auto" }}>
        <p
          style={{
            fontFamily: "var(--font-geist-mono), monospace",
            fontSize: "0.62rem",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "#22D3EE",
            marginBottom: "1rem",
          }}>
          Hero exploration
        </p>
        <h1
          style={{
            fontSize: "clamp(32px, 6vw, 56px)",
            fontWeight: 700,
            letterSpacing: "-0.04em",
            lineHeight: 1.05,
            marginBottom: "1rem",
          }}>
          Five heroes, one page each.
        </h1>
        <p
          style={{
            color: "#94A3B8",
            lineHeight: 1.7,
            maxWidth: "56ch",
            marginBottom: "3rem",
          }}>
          Each variant is a full-page hero at its own URL. A switcher is pinned to
          the bottom of every one so you can flick between them without coming back
          here. Nothing on the live homepage has changed yet.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
          {VARIANTS.map((v) => (
            <Link
              key={v.href}
              href={v.href}
              style={{
                display: "flex",
                gap: "1.5rem",
                padding: "1.5rem 0",
                borderTop: "1px solid #1E293B",
                textDecoration: "none",
                color: "inherit",
              }}>
              <span
                style={{
                  fontFamily: "var(--font-geist-mono), monospace",
                  fontSize: "0.7rem",
                  color: "#22D3EE",
                  minWidth: "2.5rem",
                  paddingTop: "0.3rem",
                }}>
                {v.key}
              </span>
              <span>
                <span
                  style={{
                    display: "block",
                    fontSize: "1.25rem",
                    fontWeight: 600,
                    letterSpacing: "-0.02em",
                    marginBottom: "0.4rem",
                  }}>
                  {v.name} <span style={{ color: "#64748B" }}>→</span>
                </span>
                <span
                  style={{
                    display: "block",
                    color: "#94A3B8",
                    fontSize: "0.9rem",
                    lineHeight: 1.65,
                  }}>
                  {v.note}
                </span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
