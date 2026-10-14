import { Easing, interpolate, spring } from "remotion";

// Motion helpers that work in SECONDS (independent of fps), shared by every video.
export const EASE_OUT = Easing.bezier(0.16, 1, 0.3, 1);
export const EASE_IN_OUT = Easing.bezier(0.65, 0, 0.35, 1);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** interpolate on seconds, clamped, eased (default: smooth ease-out) */
export const at = (t: number, inp: number[], out: number[], easing: (x: number) => number = EASE_OUT) =>
  interpolate(t, inp, out, { ...clamp, easing });

/** linear interpolate on seconds, clamped */
export const lin = (t: number, inp: number[], out: number[]) => interpolate(t, inp, out, clamp);

/** physical spring starting at `start` seconds; 0 → 1 with a natural settle (overshoot via low damping) */
export const spr = (t: number, start: number, fps: number, opts: { damping?: number; stiffness?: number; mass?: number } = {}) =>
  t < start ? 0 : spring({ frame: (t - start) * fps, fps, config: { damping: opts.damping ?? 15, stiffness: opts.stiffness ?? 140, mass: opts.mass ?? 0.9 } });

/** fade in at `from`, fade out at `to` */
export const life = (t: number, from: number, to: number, fade = 0.18) =>
  Math.min(at(t, [from, from + fade], [0, 1]), at(t, [to - fade, to], [1, 0], Easing.in(Easing.cubic)));

/** 0 → 1 → 0 bump centered on `center` (for flashes, punches) */
export const bump = (t: number, center: number, width = 0.3) => at(t, [center - width / 2, center, center + width / 2], [0, 1, 0], Easing.inOut(Easing.quad));
