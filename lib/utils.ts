export const lerp = (a: number, b: number, t: number) =>
  a + (b - a) * t;

export const clamp = (val: number, min: number, max: number) =>
  Math.min(Math.max(val, min), max);

export const mapRange = (
  val: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
) => ((val - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
