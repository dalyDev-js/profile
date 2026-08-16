// Shared choreography for the print → paper plane → portrait handoff.
//
// V4Paper (the 3D sheet) and V4ThenNow (the year counter, and hiding/revealing
// the About portrait) must agree on these. If they drift apart the portrait
// shows through while the paper is still in the air, which is the one thing
// this sequence must never do.

export const FOLD = [0.04, 0.15] as const; // print → folded plane
export const BLANK = [0.15, 0.24] as const; // picture fades off → plain paper
export const REVEAL = [0.78, 0.88] as const; // today's picture appears on the paper
export const ARRIVE = [0.74, 0.92] as const; // flies to the portrait's box
export const UNFOLD = [0.78, 0.92] as const; // plane → flat sheet again
export const LAND = [0.93, 0.995] as const; // sheet dissolves, portrait takes over

// The paper is blank between BLANK[1] and REVEAL[0]. The texture swap from the
// 1997 print to today's portrait happens in there, while nothing is drawn — so
// the young picture can never be caught on screen at the landing.
export const SWAP_AT = 0.5;

export const YEAR = [0.14, 0.86] as const; // counter fades in / out
export const YEAR_RUN = [0.18, 0.76] as const; // 1997 → this year
export const YEAR_FLY = [0.76, 0.93] as const; // counter shrinks up into the NOW label

// The streaks belong to the dark descent. They must be gone before the About
// section scrolls in, or they read as scratches over its content.
export const STREAK_IN = [0.1, 0.2] as const;
export const STREAK_OUT = [0.5, 0.62] as const;

// The page inverts here. It has to finish before About enters (~p 0.55) or the
// light-themed section arrives on a dark page.
export const INVERT = [0.42, 0.54] as const;

export const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const smoothstep = (a: number, b: number, t: number) => {
  const x = clamp01((t - a) / (b - a));
  return x * x * (3 - 2 * x);
};
export const easeInOut = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
