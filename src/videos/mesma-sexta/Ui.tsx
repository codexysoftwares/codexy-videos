import { Easing, interpolate } from "remotion";
import { EASE, MONO, SANS } from "../../shared/theme";

export const K = {
  night: "#0E0907",
  nightCard: "#1E1611",
  nightLine: "rgba(255,255,255,0.08)",
  cream: "#F4ECDD",
  paper: "#FFFDF8",
  ink: "#2A1D14",
  inkSoft: "#7A6A5C",
  line: "#E6DACB",
  amber: "#F2B83D",
  red: "#FF3B5C",
  green: "#1FA463",
  whats: "#25D366",
  delivery: "#FF7A1A",
  blue: "#0055FF",
};

const clampOpt = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// interpolate on seconds with clamping and an optional easing
export const at = (t: number, inp: number[], out: number[], easing: (x: number) => number = EASE) =>
  interpolate(t, inp, out, { ...clampOpt, easing });

export const lin = (t: number, inp: number[], out: number[]) => interpolate(t, inp, out, clampOpt);

// In/out envelope for an element living between `from` and `to` (seconds).
export const life = (t: number, from: number, to: number, fade = 0.18) =>
  Math.min(at(t, [from, from + fade], [0, 1]), at(t, [to - fade, to], [1, 0], Easing.in(Easing.cubic)));

// Decaying screen shake triggered at the given times.
export const shake = (t: number, hits: number[], amp = 16) => {
  let x = 0;
  let y = 0;
  for (const h of hits) {
    const d = t - h;
    if (d < 0 || d > 0.3) continue;
    const k = amp * (1 - d / 0.3);
    x += Math.sin(d * 95) * k;
    y += Math.cos(d * 77) * k * 0.6;
  }
  return { x, y };
};

/* ---------- icons (simple strokes, no emoji) ---------- */

export const IconChat = ({ size = 44, color = "#fff" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 8.6 8.6 0 0 1-3.8-.9L3 21l1.9-5.2a8.4 8.4 0 0 1-.9-3.8A8.5 8.5 0 0 1 12.5 3 8.4 8.4 0 0 1 21 11.5z" />
  </svg>
);

export const IconBag = ({ size = 44, color = "#fff" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
    <path d="M3 6h18" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
);

export const IconUser = ({ size = 44, color = "#fff" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21a8 8 0 0 1 16 0" />
  </svg>
);

export const IconBox = ({ size = 44, color = "#fff" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 8 12 3 3 8v8l9 5 9-5z" />
    <path d="m3 8 9 5 9-5" />
    <path d="M12 13v8" />
  </svg>
);

export const IconCheck = ({ size = 40, color = "#fff", stroke = 3 }: { size?: number; color?: string; stroke?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

export const IconX = ({ size = 40, color = "#fff" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={3} strokeLinecap="round">
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
);

/* ---------- building blocks ---------- */

export type Tone = "night" | "day";

export const Panel = ({ tone, children, style }: { tone: Tone; children: React.ReactNode; style?: React.CSSProperties }) => (
  <div
    style={{
      position: "absolute",
      left: 80,
      width: 920,
      borderRadius: 40,
      background: tone === "night" ? K.nightCard : K.paper,
      border: `2px solid ${tone === "night" ? K.nightLine : K.line}`,
      boxShadow: tone === "night" ? "0 40px 90px rgba(0,0,0,0.55)" : "0 30px 70px rgba(70,45,20,0.16)",
      color: tone === "night" ? "#F4ECDD" : K.ink,
      fontFamily: SANS,
      overflow: "hidden",
      ...style,
    }}
  >
    {children}
  </div>
);

export const Stamp = ({ text, color, t, from, rotate = -8 }: { text: string; color: string; t: number; from: number; rotate?: number }) => {
  const p = at(t, [from, from + 0.22], [0, 1], Easing.out(Easing.back(2)));
  if (p <= 0) return null;
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 14,
        padding: "14px 28px",
        borderRadius: 16,
        border: `5px solid ${color}`,
        color,
        fontFamily: MONO,
        fontWeight: 600,
        fontSize: 40,
        letterSpacing: 4,
        rotate: `${rotate}deg`,
        scale: `${2 - p}`,
        opacity: Math.min(1, p * 1.5),
        background: "rgba(0,0,0,0.0)",
      }}
    >
      {text}
    </div>
  );
};

export const AppDot = ({ color, children, size = 84 }: { color: string; children: React.ReactNode; size?: number }) => (
  <div style={{ width: size, height: size, borderRadius: size * 0.28, background: color, display: "grid", placeItems: "center", flexShrink: 0 }}>{children}</div>
);

export const Notif = ({ app, color, icon, title, text, time }: { app: string; color: string; icon: React.ReactNode; title: string; text: string; time: string }) => (
  <div
    style={{
      width: 920,
      padding: "26px 30px",
      borderRadius: 40,
      background: "rgba(38,29,22,0.94)",
      border: `2px solid ${K.nightLine}`,
      boxShadow: "0 24px 50px rgba(0,0,0,0.5)",
      display: "flex",
      gap: 26,
      alignItems: "center",
      fontFamily: SANS,
      color: "#F4ECDD",
    }}
  >
    <AppDot color={color}>{icon}</AppDot>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 28, color: "rgba(244,236,221,0.55)", fontWeight: 600, letterSpacing: 1 }}>
        <span>{app.toUpperCase()}</span>
        <span>{time}</span>
      </div>
      <div style={{ fontSize: 38, fontWeight: 800, marginTop: 4 }}>{title}</div>
      <div style={{ fontSize: 36, fontWeight: 500, color: "rgba(244,236,221,0.85)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{text}</div>
    </div>
  </div>
);

export const Bubble = ({ side, tone, children, time, read }: { side: "in" | "out"; tone: Tone; children: React.ReactNode; time: string; read?: boolean }) => {
  const isIn = side === "in";
  const bg = tone === "night" ? (isIn ? "#2C221B" : "#1F4F3A") : isIn ? "#FFFFFF" : "#DCF7E3";
  return (
    <div style={{ display: "flex", justifyContent: isIn ? "flex-start" : "flex-end" }}>
      <div
        style={{
          maxWidth: 680,
          padding: "20px 26px 14px",
          borderRadius: 30,
          borderTopLeftRadius: isIn ? 8 : 30,
          borderTopRightRadius: isIn ? 30 : 8,
          background: bg,
          border: tone === "day" && isIn ? `2px solid ${K.line}` : "none",
          fontSize: 38,
          lineHeight: 1.3,
        }}
      >
        {children}
        <div style={{ textAlign: "right", fontFamily: MONO, fontSize: 24, opacity: 0.55, marginTop: 6 }}>
          {time}
          {read ? <span style={{ color: "#3B82F6", marginLeft: 8, opacity: 1 }}>✓✓</span> : null}
        </div>
      </div>
    </div>
  );
};
