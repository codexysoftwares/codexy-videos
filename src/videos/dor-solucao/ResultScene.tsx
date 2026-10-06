import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Background } from "../../shared/components/Background";
import { C, EASE, SANS, clamp } from "../../shared/theme";

const CHECKS = [
  "Processos automatizados",
  "Clientes atendidos 24h",
  "Decisões com dados reais",
];

export const ResultScene: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ fontFamily: SANS, color: C.white }}>
      <Background tone="dark" />
      <AbsoluteFill style={{ justifyContent: "center", padding: "0 80px", gap: 20 }}>
        <div
          style={{
            position: "relative",
            alignSelf: "flex-start",
            fontSize: 104,
            fontWeight: 800,
            letterSpacing: -3,
            color: C.muted,
            opacity: interpolate(frame, [0, 8], [0, 1], clamp) * interpolate(frame, [22, 34], [1, 0.45], clamp),
            translate: `0px ${interpolate(frame, [0, 14], [50, 0], { ...clamp, easing: EASE })}px`,
          }}
        >
          Menos improviso.
          <div
            style={{
              position: "absolute",
              left: -10,
              right: -10,
              top: "54%",
              height: 12,
              borderRadius: 6,
              backgroundColor: C.red,
              transformOrigin: "left center",
              scale: `${interpolate(frame, [10, 22], [0, 1], { ...clamp, easing: EASE })} 1`,
            }}
          />
        </div>
        <div
          style={{
            fontSize: 136,
            fontWeight: 800,
            letterSpacing: -5,
            lineHeight: 1.05,
            background: `linear-gradient(90deg, ${C.white} 0%, ${C.glow} 100%)`,
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            color: "transparent",
            filter: "drop-shadow(0 0 40px rgba(0,85,255,0.45))",
            opacity: interpolate(frame, [20, 28], [0, 1], clamp),
            translate: `0px ${interpolate(frame, [20, 36], [70, 0], { ...clamp, easing: EASE })}px`,
          }}
        >
          Mais resultado.
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 28, marginTop: 70 }}>
          {CHECKS.map((c, i) => {
            const start = 34 + i * 8;
            return (
              <div
                key={c}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 28,
                  fontSize: 54,
                  fontWeight: 700,
                  opacity: interpolate(frame, [start, start + 8], [0, 1], clamp),
                  translate: `${interpolate(frame, [start, start + 14], [-60, 0], { ...clamp, easing: EASE })}px 0px`,
                }}
              >
                <div
                  style={{
                    width: 68,
                    height: 68,
                    borderRadius: 34,
                    background: `linear-gradient(135deg, ${C.glow}, ${C.blue})`,
                    boxShadow: "0 0 30px rgba(0,85,255,0.6)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 38,
                    fontWeight: 800,
                    scale: interpolate(frame, [start + 2, start + 12], [0, 1], { ...clamp, easing: EASE }),
                  }}
                >
                  ✓
                </div>
                {c}
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
