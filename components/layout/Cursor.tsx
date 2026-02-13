"use client";
import { useEffect, useRef, useState } from "react";
import { lerp } from "@/lib/utils";

export default function CustomCursor() {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const outerPos = useRef({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    if ("ontouchstart" in window || navigator.maxTouchPoints > 0) {
      setIsTouchDevice(true);
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
      if (!isVisible) setIsVisible(true);

      if (innerRef.current) {
        innerRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      }
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.closest("a") ||
        target.closest("button") ||
        target.dataset.cursor === "pointer"
      ) {
        setIsHovering(true);
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.closest("a") ||
        target.closest("button") ||
        target.dataset.cursor === "pointer"
      ) {
        setIsHovering(false);
      }
    };

    let animId: number;
    const animate = () => {
      outerPos.current.x = lerp(outerPos.current.x, mouse.current.x, 0.12);
      outerPos.current.y = lerp(outerPos.current.y, mouse.current.y, 0.12);

      if (outerRef.current) {
        outerRef.current.style.transform = `translate(${outerPos.current.x}px, ${outerPos.current.y}px)`;
      }
      animId = requestAnimationFrame(animate);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseout", handleMouseOut);
    animId = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseout", handleMouseOut);
      cancelAnimationFrame(animId);
    };
  }, [isVisible]);

  if (isTouchDevice) return null;

  return (
    <>
      <div
        ref={outerRef}
        className="pointer-events-none fixed top-0 left-0 z-[10000] -translate-x-1/2 -translate-y-1/2 transition-[width,height,opacity] duration-300"
        style={{
          width: isHovering ? 48 : 32,
          height: isHovering ? 48 : 32,
          opacity: isVisible ? 1 : 0,
          border: "1px solid rgba(99, 102, 241, 0.5)",
          borderRadius: "50%",
          marginLeft: isHovering ? -24 : -16,
          marginTop: isHovering ? -24 : -16,
          mixBlendMode: "difference",
        }}
      />
      <div
        ref={innerRef}
        className="pointer-events-none fixed top-0 left-0 z-[10000]"
        style={{
          width: 6,
          height: 6,
          opacity: isVisible && !isHovering ? 1 : 0,
          backgroundColor: "#6366f1",
          borderRadius: "50%",
          marginLeft: -3,
          marginTop: -3,
          transition: "opacity 0.2s",
        }}
      />
      <style jsx global>{`
        * {
          cursor: none !important;
        }
      `}</style>
    </>
  );
}
