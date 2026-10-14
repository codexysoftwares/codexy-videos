import type { ReactNode } from "react";

// A realistic modern iPhone drawn in CSS: titanium frame, black bezel, Dynamic Island, side buttons,
// glass reflection and status bar. Everything scales from `width`. Put the screen UI in children.
// The screen uses iOS points: `u = screenWidth / 390`, so children can size things like a real app.

export const phoneSize = (width: number) => {
  const frame = width * 0.024;
  const bezel = width * 0.02;
  const screenW = width - 2 * (frame + bezel);
  const height = width * 2.05;
  const screenH = height - 2 * (frame + bezel);
  return { frame, bezel, screenW, screenH, height, u: screenW / 390 };
};

const StatusBar = ({ u, time, dark }: { u: number; time: string; dark?: boolean }) => {
  const c = dark ? "#FFFFFF" : "#000000";
  return (
    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 54 * u, display: "flex", alignItems: "center", justifyContent: "space-between", padding: `${14 * u}px ${34 * u}px 0`, zIndex: 20, fontFamily: "-apple-system, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif", color: c }}>
      <span style={{ fontSize: 17 * u, fontWeight: 600, letterSpacing: -0.3 * u, width: 80 * u }}>{time}</span>
      <span style={{ display: "flex", alignItems: "center", gap: 6 * u }}>
        {/* signal */}
        <svg width={18 * u} height={12 * u} viewBox="0 0 18 12">
          {[0, 1, 2, 3].map((i) => (
            <rect key={i} x={i * 4.7} y={9 - i * 3} width={3.2} height={3 + i * 3} rx={0.8} fill={c} />
          ))}
        </svg>
        {/* wifi */}
        <svg width={16 * u} height={12 * u} viewBox="0 0 16 12" fill="none" stroke={c} strokeWidth={2} strokeLinecap="round">
          <path d="M1 4.2a10 10 0 0 1 14 0" />
          <path d="M3.6 7a6.3 6.3 0 0 1 8.8 0" />
          <circle cx="8" cy="10" r="1" fill={c} stroke="none" />
        </svg>
        {/* battery */}
        <svg width={27 * u} height={13 * u} viewBox="0 0 27 13">
          <rect x={0.5} y={0.5} width={23} height={12} rx={3.5} fill="none" stroke={c} strokeOpacity={0.4} />
          <rect x={2} y={2} width={17} height={9} rx={2} fill={c} />
          <rect x={24.5} y={4.5} width={1.6} height={4} rx={0.8} fill={c} fillOpacity={0.4} />
        </svg>
      </span>
    </div>
  );
};

export const Phone = ({
  width,
  time = "22:04",
  darkStatus,
  glow = 0,
  children,
  style,
}: {
  width: number;
  time?: string;
  darkStatus?: boolean;
  glow?: number;
  children: ReactNode;
  style?: React.CSSProperties;
}) => {
  const s = phoneSize(width);
  const outerR = width * 0.165;
  const innerR = outerR - s.frame;
  const screenR = innerR - s.bezel;
  const btn = (side: "l" | "r", top: number, h: number) => (
    <div
      style={{
        position: "absolute",
        [side === "l" ? "left" : "right"]: -width * 0.008,
        top: s.height * top,
        width: width * 0.012,
        height: s.height * h,
        borderRadius: width * 0.006,
        background: "linear-gradient(90deg, #5b5f66, #a9adb4 50%, #4a4e55)",
      }}
    />
  );
  return (
    <div style={{ position: "relative", width, height: s.height, ...style }}>
      {btn("l", 0.17, 0.035)}
      {btn("l", 0.235, 0.065)}
      {btn("l", 0.315, 0.065)}
      {btn("r", 0.26, 0.1)}
      {/* titanium frame */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: outerR,
          background: "linear-gradient(145deg, #9a9ea6 0%, #4b4f56 18%, #2b2e33 50%, #5d6168 82%, #a3a7ae 100%)",
          boxShadow: `0 ${width * 0.05}px ${width * 0.09}px rgba(0,0,0,0.32), inset 0 0 ${width * 0.004}px rgba(255,255,255,0.6)${glow ? `, 0 0 ${width * 0.25 * glow}px rgba(120,170,255,${0.55 * glow})` : ""}`,
        }}
      />
      {/* black bezel */}
      <div style={{ position: "absolute", inset: s.frame, borderRadius: innerR, background: "#050505" }} />
      {/* screen */}
      <div style={{ position: "absolute", inset: s.frame + s.bezel, borderRadius: screenR, overflow: "hidden", background: "#000" }}>
        <StatusBar u={s.u} time={time} dark={darkStatus} />
        {children}
        {/* glass reflection */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(115deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.03) 28%, transparent 42%)", pointerEvents: "none", zIndex: 30 }} />
      </div>
      {/* dynamic island */}
      <div style={{ position: "absolute", top: s.frame + s.bezel + 11 * s.u, left: "50%", width: 124 * s.u, height: 36 * s.u, marginLeft: -62 * s.u, borderRadius: 18 * s.u, background: "#000", zIndex: 40 }} />
    </div>
  );
};
