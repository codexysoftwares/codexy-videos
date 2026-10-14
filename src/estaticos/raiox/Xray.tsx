import { AbsoluteFill, Img, staticFile } from "remotion";
import { MONO, SANS } from "../../shared/theme";

// Visual system of the "Raio-X" series: every carousel looks like an X-ray film / radiology report.
// 1080×1350. Reusable for Raio-X #3, #4…
export const X = {
  bg: "#020A16",
  bg2: "#06182E",
  cyan: "#8DEBFF",
  cyanSoft: "rgba(141,235,255,0.62)",
  cyanFaint: "rgba(141,235,255,0.14)",
  red: "#FF4D6A",
  redGlow: "rgba(255,77,106,0.55)",
  green: "#3EE6A8",
  white: "#F2FBFF",
};
export const M = 72; // safe margin

const glow = (c: string, r = 22) => `0 0 ${r}px ${c}`;

export const XrayBg = ({ children }: { children: React.ReactNode }) => (
  <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 38%, ${X.bg2} 0%, ${X.bg} 72%)`, fontFamily: SANS, color: X.white, overflow: "hidden" }}>
    {/* millimetric grid */}
    <AbsoluteFill
      style={{
        backgroundImage: `linear-gradient(${X.cyanFaint} 1px, transparent 1px), linear-gradient(90deg, ${X.cyanFaint} 1px, transparent 1px), linear-gradient(rgba(141,235,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(141,235,255,0.05) 1px, transparent 1px)`,
        backgroundSize: "108px 108px, 108px 108px, 27px 27px, 27px 27px",
        backgroundPosition: "-1px -1px",
        opacity: 0.55,
      }}
    />
    {children}
    {/* film grain + vignette */}
    <svg width="100%" height="100%" style={{ position: "absolute", inset: 0, opacity: 0.13, mixBlendMode: "screen", pointerEvents: "none" }}>
      <filter id="xgrain">
        <feTurbulence type="fractalNoise" baseFrequency="0.95" numOctaves="2" seed="7" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#xgrain)" />
    </svg>
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, transparent 55%, rgba(0,0,0,0.65) 100%)", pointerEvents: "none" }} />
  </AbsoluteFill>
);

// Film corner registration marks
const Corner = ({ x, y, r }: { x: number; y: number; r: number }) => (
  <div style={{ position: "absolute", left: x, top: y, width: 34, height: 34, borderLeft: `3px solid ${X.cyanSoft}`, borderTop: `3px solid ${X.cyanSoft}`, rotate: `${r}deg` }} />
);

export const Frame = ({ index, total, label, exam = "RAIO-X #1" }: { index: number; total: number; label?: string; exam?: string }) => (
  <>
    <Corner x={34} y={34} r={0} />
    <Corner x={1080 - 68} y={34} r={90} />
    <Corner x={1080 - 68} y={1350 - 68} r={180} />
    <Corner x={34} y={1350 - 68} r={270} />
    {/* header */}
    <div style={{ position: "absolute", left: M, right: M, top: 64, display: "flex", alignItems: "center", justifyContent: "space-between", fontFamily: MONO }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <span style={{ padding: "8px 14px", borderRadius: 8, background: X.cyan, color: X.bg, fontWeight: 600, fontSize: 24, letterSpacing: 2 }}>{exam}</span>
        {label ? <span style={{ fontSize: 22, letterSpacing: 3, color: X.cyanSoft }}>{label}</span> : null}
      </div>
      <span style={{ fontSize: 20, letterSpacing: 2, color: X.cyanSoft, textAlign: "right" }}>PACIENTE: STUDIO BELLA · FICTÍCIO</span>
    </div>
    {/* footer */}
    <div style={{ position: "absolute", left: M, right: M, bottom: 56, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <Img src={staticFile("brand/codexy-logo-light.png")} style={{ height: 30, opacity: 0.92 }} />
      <span style={{ fontFamily: MONO, fontSize: 24, letterSpacing: 2, color: X.cyanSoft }}>
        {String(index).padStart(2, "0")} / {String(total).padStart(2, "0")}
      </span>
    </div>
  </>
);

export const Achado = ({ n, title, top = 150 }: { n: string; title: string; top?: number }) => (
  <div style={{ position: "absolute", left: M, right: M, top }}>
    <div style={{ display: "flex", alignItems: "center", gap: 14, fontFamily: MONO, fontSize: 26, letterSpacing: 4, color: X.red }}>
      <span style={{ width: 14, height: 14, borderRadius: 7, background: X.red, boxShadow: glow(X.redGlow, 14) }} />
      ACHADO {n}
    </div>
    <div style={{ marginTop: 14, fontWeight: 800, fontSize: 76, lineHeight: 1.02, letterSpacing: -2.6, color: X.white, whiteSpace: "pre-line" }}>{title}</div>
  </div>
);

// "Por que acontece" block
export const Why = ({ top, children }: { top: number; children: React.ReactNode }) => (
  <div style={{ position: "absolute", left: M, right: M, top, display: "flex", gap: 22 }}>
    <div style={{ width: 4, borderRadius: 2, background: X.cyan, boxShadow: glow(X.cyanSoft, 10), flexShrink: 0 }} />
    <div>
      <div style={{ fontFamily: MONO, fontSize: 22, letterSpacing: 3, color: X.cyan }}>POR QUE ACONTECE</div>
      <div style={{ marginTop: 10, fontSize: 36, lineHeight: 1.38, color: "rgba(242,251,255,0.9)" }}>{children}</div>
    </div>
  </div>
);

// Red fracture marker: pulsing ring + leader line + label
export const Fracture = ({ x, y, label, dx = 120, dy = -70, size = 40 }: { x: number; y: number; label: string; dx?: number; dy?: number; size?: number }) => {
  const lx = x + dx;
  const ly = y + dy;
  const left = dx >= 0;
  return (
    <>
      <svg style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1350, overflow: "visible", pointerEvents: "none" }}>
        <circle cx={x} cy={y} r={size} fill="none" stroke={X.red} strokeWidth={4} style={{ filter: `drop-shadow(0 0 10px ${X.redGlow})` }} />
        <circle cx={x} cy={y} r={size * 0.28} fill={X.red} />
        <polyline points={`${x + (left ? size * 0.7 : -size * 0.7)},${y + (dy < 0 ? -size * 0.7 : size * 0.7)} ${lx},${ly} ${lx + (left ? 40 : -40)},${ly}`} fill="none" stroke={X.red} strokeWidth={3} />
      </svg>
      <div style={{ position: "absolute", top: ly - 24, left: left ? lx + 48 : undefined, right: left ? undefined : 1080 - lx + 48, padding: "8px 14px", borderRadius: 8, background: X.red, color: "#fff", fontFamily: MONO, fontWeight: 600, fontSize: 22, letterSpacing: 1.5, whiteSpace: "nowrap", boxShadow: glow(X.redGlow, 18) }}>
        {label}
      </div>
    </>
  );
};

export const Tag = ({ children, color = X.cyanSoft }: { children: React.ReactNode; color?: string }) => (
  <span style={{ display: "inline-block", padding: "5px 10px", borderRadius: 6, border: `2px solid ${color}`, color, fontFamily: MONO, fontSize: 18, letterSpacing: 2 }}>{children}</span>
);

export const cyanText = { color: X.cyan, textShadow: glow("rgba(141,235,255,0.55)", 26) };
export const redText = { color: X.red, textShadow: glow(X.redGlow, 26) };
