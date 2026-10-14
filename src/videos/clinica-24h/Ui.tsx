import { Easing, interpolate } from "remotion";
import { EASE, MONO, SANS } from "../../shared/theme";

export const Q = {
  night: "#050B1A",
  night2: "#0B1630",
  nightCard: "#0F1D3A",
  nightLine: "rgba(140,170,255,0.14)",
  day: "#F2F6FB",
  paper: "#FFFFFF",
  ink: "#0E1B33",
  soft: "#6B7A93",
  line: "#DCE5F0",
  blue: "#0055FF",
  glow: "#3377FF",
  mint: "#14C79A",
  red: "#FF3B5C",
  amber: "#F5A524",
  whats: "#25D366",
};

const clampOpt = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const at = (t: number, inp: number[], out: number[], easing: (x: number) => number = EASE) =>
  interpolate(t, inp, out, { ...clampOpt, easing });
export const lin = (t: number, inp: number[], out: number[]) => interpolate(t, inp, out, clampOpt);
export const life = (t: number, from: number, to: number, fade = 0.2) =>
  Math.min(at(t, [from, from + fade], [0, 1]), at(t, [to - fade, to], [1, 0], Easing.in(Easing.cubic)));
export const pop = (t: number, s: number, d = 0.28) => at(t, [s, s + d], [0, 1], Easing.out(Easing.back(1.7)));

/* ---------- icons ---------- */
type IP = { size?: number; color?: string; stroke?: number };
const svg = (size: number, color: string, stroke: number, children: React.ReactNode) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
    {children}
  </svg>
);
export const IconChat = ({ size = 40, color = "#fff", stroke = 2 }: IP) =>
  svg(size, color, stroke, <path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 8.6 8.6 0 0 1-3.8-.9L3 21l1.9-5.2a8.4 8.4 0 0 1-.9-3.8A8.5 8.5 0 0 1 12.5 3 8.4 8.4 0 0 1 21 11.5z" />);
export const IconCalendar = ({ size = 40, color = "#fff", stroke = 2 }: IP) =>
  svg(size, color, stroke, <><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></>);
export const IconUser = ({ size = 40, color = "#fff", stroke = 2 }: IP) =>
  svg(size, color, stroke, <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>);
export const IconCheck = ({ size = 40, color = "#fff", stroke = 3 }: IP) => svg(size, color, stroke, <path d="M20 6 9 17l-5-5" />);
export const IconPlug = ({ size = 40, color = "#fff", stroke = 2 }: IP) =>
  svg(size, color, stroke, <><path d="M12 22v-5M9 8V2M15 8V2" /><path d="M18 8v5a6 6 0 0 1-12 0V8z" /></>);
export const IconMoon = ({ size = 34, color = "#fff", stroke = 2 }: IP) => svg(size, color, stroke, <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z" />);
export const IconSun = ({ size = 34, color = "#fff", stroke = 2 }: IP) =>
  svg(size, color, stroke, <><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></>);
export const IconCross = ({ size = 40, color = "#fff" }: IP) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M9 3h6v6h6v6h-6v6H9v-6H3V9h6z" />
  </svg>
);

/* ---------- pieces ---------- */

export const Avatar = ({ letter, color, size = 64 }: { letter: string; color: string; size?: number }) => (
  <div style={{ width: size, height: size, borderRadius: size / 2, background: color, color: "#fff", display: "grid", placeItems: "center", fontFamily: SANS, fontWeight: 800, fontSize: size * 0.44, flexShrink: 0 }}>
    {letter}
  </div>
);

export const Bubble = ({ side, children, time, dark, p = 1 }: { side: "in" | "out"; children: React.ReactNode; time: string; dark?: boolean; p?: number }) => {
  const isIn = side === "in";
  const bg = dark ? (isIn ? "#16264A" : "#0E4D3A") : isIn ? "#FFFFFF" : "#DDF6EC";
  return (
    <div style={{ display: "flex", justifyContent: isIn ? "flex-start" : "flex-end", opacity: Math.min(1, p * 1.5), translate: `0px ${(1 - p) * 26}px`, scale: `${0.92 + p * 0.08}`, transformOrigin: isIn ? "left bottom" : "right bottom" }}>
      <div
        style={{
          maxWidth: 640,
          padding: "16px 24px 10px",
          borderRadius: 28,
          borderTopLeftRadius: isIn ? 8 : 28,
          borderTopRightRadius: isIn ? 28 : 8,
          background: bg,
          border: !dark && isIn ? `2px solid ${Q.line}` : "none",
          fontFamily: SANS,
          fontSize: 34,
          lineHeight: 1.28,
          color: dark ? "#E8EEFF" : Q.ink,
        }}
      >
        {children}
        <div style={{ textAlign: "right", fontFamily: MONO, fontSize: 21, opacity: 0.5, marginTop: 4 }}>{time}</div>
      </div>
    </div>
  );
};

export const Typing = ({ dark, t }: { dark?: boolean; t: number }) => (
  <div style={{ display: "flex", justifyContent: "flex-end" }}>
    <div style={{ display: "flex", gap: 10, padding: "20px 26px", borderRadius: 28, borderTopRightRadius: 8, background: dark ? "#0E4D3A" : "#DDF6EC" }}>
      {[0, 1, 2].map((i) => (
        <div key={i} style={{ width: 14, height: 14, borderRadius: 7, background: Q.mint, opacity: 0.35 + 0.65 * Math.max(0, Math.sin(t * 12 - i * 0.9)) }} />
      ))}
    </div>
  </div>
);

// A line between two points that draws itself (p: 0..1) and carries glowing packets while `flow` > 0.
export const Wire = ({ x1, y1, x2, y2, p, flow, t, color = Q.blue, curve = 0, packets = 3, both }: { x1: number; y1: number; x2: number; y2: number; p: number; flow: number; t: number; color?: string; curve?: number; packets?: number; both?: boolean }) => {
  const mx = (x1 + x2) / 2 + curve;
  const my = (y1 + y2) / 2;
  const d = `M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`;
  const len = Math.hypot(x2 - x1, y2 - y1) * 1.08;
  const point = (u: number) => {
    const a = (1 - u) * (1 - u);
    const b = 2 * (1 - u) * u;
    const c = u * u;
    return { x: a * x1 + b * mx + c * x2, y: a * y1 + b * my + c * y2 };
  };
  return (
    <svg style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, pointerEvents: "none", overflow: "visible" }}>
      <path d={d} stroke={color} strokeOpacity={0.22} strokeWidth={10} fill="none" strokeDasharray={len} strokeDashoffset={len * (1 - p)} strokeLinecap="round" />
      <path d={d} stroke={color} strokeWidth={4} fill="none" strokeDasharray={len} strokeDashoffset={len * (1 - p)} strokeLinecap="round" />
      {flow > 0
        ? Array.from({ length: packets }).map((_, i) => {
            const u = (t * 0.9 + i / packets) % 1;
            const rev = both && i % 2 === 1;
            const pt = point(rev ? 1 - u : u);
            return <circle key={i} cx={pt.x} cy={pt.y} r={11} fill={color} opacity={flow * Math.sin(Math.PI * u)} style={{ filter: `drop-shadow(0 0 10px ${color})` }} />;
          })
        : null}
    </svg>
  );
};

// One packet travelling once from A to B between `s` and `s + dur` (an event moving through the system).
export const Packet = ({ x1, y1, x2, y2, s, dur = 0.55, t, color = Q.blue, curve = 0 }: { x1: number; y1: number; x2: number; y2: number; s: number; dur?: number; t: number; color?: string; curve?: number }) => {
  if (t < s || t > s + dur + 0.15) return null;
  const u = at(t, [s, s + dur], [0, 1], Easing.inOut(Easing.cubic));
  const mx = (x1 + x2) / 2 + curve;
  const my = (y1 + y2) / 2;
  const x = (1 - u) * (1 - u) * x1 + 2 * (1 - u) * u * mx + u * u * x2;
  const y = (1 - u) * (1 - u) * y1 + 2 * (1 - u) * u * my + u * u * y2;
  const fade = at(t, [s + dur, s + dur + 0.15], [1, 0]);
  return <div style={{ position: "absolute", left: x - 20, top: y - 20, width: 40, height: 40, borderRadius: 20, background: color, boxShadow: `0 0 30px 8px ${color}`, opacity: fade, scale: `${1 - u * 0.3}` }} />;
};

export const Card = ({ x, y, w, h, dark, children, style }: { x: number; y: number; w: number; h?: number; dark?: boolean; children: React.ReactNode; style?: React.CSSProperties }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: w,
      height: h,
      borderRadius: 36,
      background: dark ? Q.nightCard : Q.paper,
      border: `2px solid ${dark ? Q.nightLine : Q.line}`,
      boxShadow: dark ? "0 30px 80px rgba(0,0,0,0.5)" : "0 26px 60px rgba(14,27,51,0.12)",
      fontFamily: SANS,
      color: dark ? "#E8EEFF" : Q.ink,
      overflow: "hidden",
      ...style,
    }}
  >
    {children}
  </div>
);

export const Kicker = ({ children, color }: { children: React.ReactNode; color: string }) => (
  <div style={{ fontFamily: MONO, fontSize: 24, letterSpacing: 3, color }}>{children}</div>
);
