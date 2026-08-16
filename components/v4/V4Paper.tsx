"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import * as THREE from "three";
import { V4_PORTRAIT_BG } from "./theme";
import {
  ARRIVE,
  BLANK,
  FOLD,
  INVERT,
  LAND,
  REVEAL,
  STREAK_IN,
  STREAK_OUT,
  SWAP_AT,
  UNFOLD,
  clamp01,
  easeInOut,
  lerp,
  smoothstep,
} from "./paperTiming";

// Sheet half-extents. Matches then.png's 1169×1346 so the flat state lines up
// with the print it hands off from.
const HW = 0.87;
const HH = 1.0;

// Size the plane runs at while it is in the air.
const FLY_SIZE = 1.05;

// The paper opens out into About's portrait slot and STAYS there — it *is* the
// portrait. About's own <img> is hidden (see V4ThenNow), so there is only ever
// one picture on screen and nothing to cross-fade against.
const PORTRAIT_SEL = "#v3-about [data-portrait-slot]";

// Plain stock in the air, but it has to arrive matching the About card's own
// backing (PALETTE_LIGHT.s2) — otherwise the sheet dissolving reads as the
// portrait's background changing colour underneath it.
const PAPER_COL = "#F3F0E8";
const CARD_COL = V4_PORTRAIT_BG;

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function imageTexture(img: HTMLImageElement) {
  const tex = new THREE.Texture(img);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  tex.needsUpdate = true;
  return tex;
}

/**
 * The sheet, as a dart fold.
 *
 * Six corners of a rectangle, each with a flat position and a folded position.
 * Flat, the four triangles tile the whole rectangle, so the sheet shows the
 * entire photo; folded, the top corners collapse onto the centre ridge and the
 * bottom corners become wingtips. Morphing between the two *is* the fold — the
 * paper and the picture are never separate objects.
 */
// Folded: a proper dart. The two top corners meet on a centre ridge that rides
// HIGH at the tail, the bottom corners drop to wingtips below it, and the nose
// sits low and forward — that ridge-plus-dihedral is what reads as a folded
// plane rather than a flat scrap of paper.
const CORNERS = {
  A: { flat: [0, HH, 0], fold: [0, 0.04, 1.42], uv: [0.5, 1] }, // nose
  B: { flat: [-HW, HH, 0], fold: [0, 0.32, -0.58], uv: [0, 1] }, // ridge
  C: { flat: [HW, HH, 0], fold: [0, 0.32, -0.58], uv: [1, 1] }, // ridge
  D: { flat: [-HW, -HH, 0], fold: [-0.84, -0.24, -0.98], uv: [0, 0] }, // tip
  E: { flat: [HW, -HH, 0], fold: [0.84, -0.24, -0.98], uv: [1, 0] }, // tip
  F: { flat: [0, -HH, 0], fold: [0, 0.04, -1.02], uv: [0.5, 0] }, // tail
} as const;

const TRIS: (keyof typeof CORNERS)[][] = [
  ["A", "B", "D"],
  ["A", "D", "F"],
  ["A", "F", "E"],
  ["A", "E", "C"],
];

function buildSheet() {
  const flat: number[] = [];
  const fold: number[] = [];
  const uv: number[] = [];
  for (const tri of TRIS) {
    for (const k of tri) {
      flat.push(...CORNERS[k].flat);
      fold.push(...CORNERS[k].fold);
      uv.push(...CORNERS[k].uv);
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute(
    "position",
    new THREE.BufferAttribute(new Float32Array(flat), 3)
  );
  geo.setAttribute("uv", new THREE.BufferAttribute(new Float32Array(uv), 2));
  geo.computeVertexNormals();
  return { geo, flat: new Float32Array(flat), fold: new Float32Array(fold) };
}

/**
 * Speed streaks — the sense that you are dropping fast.
 *
 * Vertical lines that rush *upward* past the camera (falling makes the world
 * rise), with length and speed driven by how fast you are actually scrolling.
 * Colour flips with the page: pale streaks read on the dark half, slate ones on
 * the light half, and the page inverts partway through this very sequence.
 */
const STREAKS = 320;

function SpeedStreaks({ progressRef }: { progressRef: RefObject<number> }) {
  const lines = useRef<THREE.LineSegments>(null);
  const mat = useRef<THREE.LineBasicMaterial>(null);
  const lastP = useRef(0);
  const vel = useRef(0);

  const { geo, seed } = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(STREAKS * 6), 3)
    );
    const s = new Float32Array(STREAKS * 4); // x, y, z, rate
    for (let i = 0; i < STREAKS; i++) {
      s[i * 4] = (Math.random() - 0.5) * 20;
      s[i * 4 + 1] = (Math.random() - 0.5) * 14;
      s[i * 4 + 2] = -8 + Math.random() * 11;
      s[i * 4 + 3] = 0.55 + Math.random() * 0.9;
    }
    return { geo: g, seed: s };
  }, []);
  useEffect(() => () => geo.dispose(), [geo]);

  const col = useMemo(() => new THREE.Color(), []);
  const pale = useMemo(() => new THREE.Color("#CFF3FF"), []);
  const slate = useMemo(() => new THREE.Color("#5B6472"), []);

  useFrame((_state, delta) => {
    const p = clamp01(progressRef.current ?? 0);
    const dt = Math.min(Math.max(delta, 1 / 240), 1 / 20);

    // Scroll speed, smoothed — this is what makes it feel like *you* are moving.
    const dp = Math.abs(p - lastP.current) / dt;
    lastP.current = p;
    vel.current += (dp - vel.current) * 0.1;

    const rush = 1.6 + Math.min(vel.current * 45, 34);
    const show =
      smoothstep(STREAK_IN[0], STREAK_IN[1], p) *
      (1 - smoothstep(STREAK_OUT[0], STREAK_OUT[1], p));

    const ls = lines.current;
    if (!ls) return;
    ls.visible = show > 0.01;
    if (mat.current) {
      mat.current.opacity = show * 0.5;
      // Same inversion curve the page uses, so streaks never vanish into the bg.
      col.copy(pale).lerp(slate, smoothstep(INVERT[0], INVERT[1], p));
      mat.current.color.copy(col);
    }
    if (!ls.visible) return;

    const pos = geo.attributes.position as THREE.BufferAttribute;
    const arr = pos.array as Float32Array;
    for (let i = 0; i < STREAKS; i++) {
      const rate = seed[i * 4 + 3];
      let y = seed[i * 4 + 1] + 0;
      y += rush * rate * dt;
      if (y > 7) y -= 14;
      seed[i * 4 + 1] = y;

      const len = 0.12 + rush * rate * 0.035;
      const x = seed[i * 4];
      const z = seed[i * 4 + 2];
      const o = i * 6;
      arr[o] = x;
      arr[o + 1] = y;
      arr[o + 2] = z;
      arr[o + 3] = x;
      arr[o + 4] = y - len;
      arr[o + 5] = z;
    }
    pos.needsUpdate = true;
  });

  return (
    <lineSegments ref={lines} geometry={geo} frustumCulled={false}>
      <lineBasicMaterial
        ref={mat}
        transparent
        opacity={0}
        depthWrite={false}
        toneMapped={false}
      />
    </lineSegments>
  );
}

/**
 * Cyan/violet rim lights give the paper life in the air, but they must be gone
 * by the time it settles on the About card — otherwise they tint the sheet and
 * the card's background appears to change colour as the paper crosses it.
 */
function Rim({ progressRef }: { progressRef: RefObject<number> }) {
  const cyan = useRef<THREE.PointLight>(null);
  const violet = useRef<THREE.PointLight>(null);
  useFrame(() => {
    const p = clamp01(progressRef.current ?? 0);
    const fade = 1 - smoothstep(ARRIVE[0], ARRIVE[1], p);
    if (cyan.current) cyan.current.intensity = 20 * fade;
    if (violet.current) violet.current.intensity = 12 * fade;
  });
  return (
    <>
      <pointLight ref={cyan} position={[-5, 1.5, 2]} color="#22D3EE" />
      <pointLight ref={violet} position={[5, -2, 3]} color="#A78BFA" />
    </>
  );
}

type Anchor = { x: number; y: number; sx: number; sy: number } | null;

function Paper({
  progressRef,
  photoRef,
  thenTex,
  nowTex,
}: {
  progressRef: RefObject<number>;
  photoRef: RefObject<HTMLElement | null>;
  thenTex: THREE.Texture;
  nowTex: THREE.Texture;
}) {
  const grp = useRef<THREE.Group>(null);
  const blankMat = useRef<THREE.MeshStandardMaterial>(null);
  const picMat = useRef<THREE.MeshStandardMaterial>(null);
  const launch = useRef({ x: -1.6, y: 1.6 });
  const portraitEl = useRef<HTMLElement | null>(null);
  const showsNow = useRef(false);

  const sheet = useMemo(() => buildSheet(), []);
  useEffect(() => () => sheet.geo.dispose(), [sheet]);

  const paperCol = useMemo(() => new THREE.Color(PAPER_COL), []);
  const cardCol = useMemo(() => new THREE.Color(CARD_COL), []);

  useFrame((state) => {
    const g = grp.current;
    if (!g) return;
    const p = clamp01(progressRef.current ?? 0);

    const cam = state.camera as THREE.PerspectiveCamera;
    const worldH = 2 * cam.position.z * Math.tan((cam.fov * Math.PI) / 360);
    const worldW = worldH * (state.size.width / state.size.height);
    const pxPerWorld = state.size.height / worldH;

    const anchorOf = (el: HTMLElement | null): Anchor => {
      if (!el) return null;
      const r = el.getBoundingClientRect();
      if (!r.width || !r.height) return null;
      return {
        x: ((r.left + r.width / 2) / state.size.width - 0.5) * worldW,
        y: (0.5 - (r.top + r.height / 2) / state.size.height) * worldH,
        sx: r.width / 2 / pxPerWorld,
        sy: r.height / 2 / pxPerWorld,
      };
    };

    const born = smoothstep(FOLD[0], FOLD[1], p);
    const unfold = smoothstep(UNFOLD[0], UNFOLD[1], p);
    const arrive = smoothstep(ARRIVE[0], ARRIVE[1], p);
    // No dissolve: the landed sheet is the portrait, so it stays.

    // Folded at 1, flat at 0 — and flat at BOTH ends, which is what makes the
    // print become a plane and the plane become the portrait.
    const folded = born * (1 - unfold);

    // ── geometry morph ────────────────────────────────────────────────────
    const pos = sheet.geo.attributes.position as THREE.BufferAttribute;
    const arr = pos.array as Float32Array;
    for (let i = 0; i < arr.length; i++) {
      arr[i] = lerp(sheet.flat[i], sheet.fold[i], folded);
    }
    pos.needsUpdate = true;
    sheet.geo.computeVertexNormals();

    // ── position ──────────────────────────────────────────────────────────
    const photo = anchorOf(photoRef.current);

    // The launch point tracks the print only while the fold is still happening,
    // then freezes. Otherwise the plane stays welded to a DOM element that
    // scrolls off the top of the screen, and flies away with it.
    if (photo && born < 1) {
      launch.current.x = photo.x;
      launch.current.y = photo.y;
    }

    const flight = smoothstep(FOLD[1], ARRIVE[0], p);
    let x =
      lerp(launch.current.x, 0, easeInOut(flight)) +
      Math.sin(flight * Math.PI * 2.1) * 1.35;
    let y = lerp(launch.current.y, -1.4, easeInOut(flight));

    // Opens out into About's portrait slot and stays locked to it. Tracked from
    // the live rect each frame, so it follows the slot as the page scrolls.
    if (!portraitEl.current) {
      portraitEl.current = document.querySelector(PORTRAIT_SEL);
    }
    const slot = anchorOf(portraitEl.current);
    if (slot) {
      x = lerp(x, slot.x, arrive);
      y = lerp(y, slot.y, arrive);
    }
    g.position.set(x, y, 0);

    // ── scale ─────────────────────────────────────────────────────────────
    // Matches the print exactly at the handoff, runs bigger in the air, then
    // opens out to fill the portrait slot.
    let sx = lerp(photo ? photo.sx / HW : 0.5, FLY_SIZE, born);
    let sy = lerp(photo ? photo.sy / HH : 0.5, FLY_SIZE, born);
    if (slot) {
      sx = lerp(sx, slot.sx / HW, unfold);
      sy = lerp(sy, slot.sy / HH, unfold);
    }
    g.scale.set(sx, sy, (sx + sy) / 2);

    // ── attitude ──────────────────────────────────────────────────────────
    // Square to camera at both ends (so it lines up with the print and with the
    // portrait), flying attitude only in between.
    const att = folded;
    g.rotation.x = -0.26 * att;
    g.rotation.y = Math.PI * 0.76 * att;
    g.rotation.z =
      THREE.MathUtils.degToRad(-2.4) * (1 - born) +
      Math.sin(p * 11) * 0.26 * att;

    // ── the picture on the paper ──────────────────────────────────────────
    // The sheet is plain paper for the whole flight. The 1997 print fades off
    // it just after the fold, and today's picture fades on just before it
    // lands. In between it carries nothing — and that blank stretch is exactly
    // where the texture is swapped, so the young picture can never be caught on
    // screen at the landing.
    const alpha = born;
    const pic = clamp01(
      1 - smoothstep(BLANK[0], BLANK[1], p) + smoothstep(REVEAL[0], REVEAL[1], p)
    );

    const wantNow = p > SWAP_AT;
    if (picMat.current && wantNow !== showsNow.current) {
      const t = wantNow ? nowTex : thenTex;
      picMat.current.map = t;
      // emissiveMap has to track map, or the unlit landing shows a blank sheet.
      picMat.current.emissiveMap = t;
      picMat.current.needsUpdate = true;
      showsNow.current = wantNow;
    }

    // As it flattens onto the card, both layers cross over from *lit* to
    // *emissive*. A lit surface's on-screen colour is material × lights, so the
    // sheet picked up the cyan/violet rim lights and read as the portrait's
    // background changing colour underneath it. Driving colour → black and
    // emissive → the target makes the landed sheet render as exactly that
    // colour, independent of lighting, so the dissolve is invisible.
    if (blankMat.current) {
      blankMat.current.opacity = alpha;
      blankMat.current.color.copy(paperCol).multiplyScalar(1 - unfold);
      blankMat.current.emissive.copy(cardCol).multiplyScalar(unfold);
    }
    if (picMat.current) {
      picMat.current.opacity = alpha * pic;
      picMat.current.color.setScalar(1 - unfold);
      picMat.current.emissive.setScalar(unfold);
    }
  });

  const paper = {
    roughness: 0.9,
    metalness: 0,
    flatShading: true,
    side: THREE.DoubleSide,
    transparent: true,
    // R3F enables ACES tone mapping by default, which desaturates and shifts
    // everything it draws. That is why the portrait rendered on the paper never
    // matched the same portrait rendered as a DOM image, and why the card
    // appeared to change tone as the sheet crossed it.
    toneMapped: false,
  } as const;

  return (
    <group ref={grp}>
      {/* Plain stock — this is what you see for the whole flight. */}
      <mesh geometry={sheet.geo} renderOrder={0}>
        <meshStandardMaterial
          ref={blankMat}
          color={PAPER_COL}
          {...paper}
          opacity={0}
        />
      </mesh>
      {/* The picture, printed on top. Separated by a real Z offset, not a
          scale: once the sheet lies flat every vertex is at z=0, so scaling
          leaves the two layers coplanar and they z-fight — which is the flicker
          you see on the portrait while scrolling. renderOrder alone won't do it
          either, since depth testing still decides per fragment. */}
      <mesh geometry={sheet.geo} position={[0, 0, 0.012]} renderOrder={1}>
        <meshStandardMaterial
          ref={picMat}
          map={thenTex}
          emissiveMap={thenTex}
          emissive="#000000"
          {...paper}
          opacity={0}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

export default function V4Paper({
  progressRef,
  photoRef,
  active = true,
}: {
  progressRef: RefObject<number>;
  photoRef: RefObject<HTMLElement | null>;
  active?: boolean;
}) {
  const [tex, setTex] = useState<{
    past: THREE.Texture;
    present: THREE.Texture;
  } | null>(null);

  useEffect(() => {
    let alive = true;
    Promise.all([loadImage("/v4/then.png"), loadImage("/v3-side.png")])
      .then(([a, b]) => {
        if (!alive) return;
        setTex({ past: imageTexture(a), present: imageTexture(b) });
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    return () => {
      tex?.past.dispose();
      tex?.present.dispose();
    };
  }, [tex]);

  if (!tex) return null;

  return (
    <Canvas
      dpr={[1, 1.75]}
      frameloop={active ? "always" : "never"}
      camera={{ position: [0, 0, 10], fov: 38 }}
      gl={{ alpha: true, antialias: true }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={1.15} />
      <directionalLight position={[3, 6, 6]} intensity={2.1} />
      <Rim progressRef={progressRef} />
      <SpeedStreaks progressRef={progressRef} />
      <Paper
        progressRef={progressRef}
        photoRef={photoRef}
        thenTex={tex.past}
        nowTex={tex.present}
      />
    </Canvas>
  );
}
