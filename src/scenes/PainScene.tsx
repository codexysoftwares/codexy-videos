import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { Background } from "../components/Background";
import { C, EASE, MONO, SANS, clamp } from "../theme";

const PAINS = ["Retrabalho.", "Erros manuais.", "Cliente esperando."];
const RING = 2 * Math.PI * 250;

export const PainScene: React.FC = () => {
  const frame = useCurrentFrame();
  const hours = Math.floor(
    interpolate(frame, [12, 105], [0, 38], {
      ...clamp,
      easing: Easing.out(Easing.cubic),
    }),
  );

  return (
    <AbsoluteFill style={{ fontFamily: SANS, color: C.white }}>
      <Background tone="danger" />
      <div
        style={{
          position: "absolute",
          top: 210,
          left: 80,
          fontFamily: MONO,
          fontSize: 34,
          letterSpacing: 4,
          color: C.red,
          opacity: interpolate(frame, [0, 8], [0, 1], clamp),
        }}
      >
        // QUANTO ISSO CUSTA?
      </div>
      <div
        style={{
          position: "absolute",
          top: 280,
          left: 80,
          right: 80,
          fontSize: 78,
          fontWeight: 700,
          lineHeight: 1.12,
          letterSpacing: -1.5,
          opacity: interpolate(frame, [2, 12], [0, 1], clamp),
          translate: `0px ${interpolate(frame, [2, 16], [50, 0], { ...clamp, easing: EASE })}px`,
        }}
      >
        Quantas horas por semana sua equipe perde com isso?
      </div>

      <div
        style={{
          position: "absolute",
          top: 640,
          left: 540 - 280,
          width: 560,
          height: 560,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          scale: interpolate(frame, [8, 24], [0.7, 1], {
            ...clamp,
            easing: EASE,
            output: "perceptual-scale",
          }),
          opacity: interpolate(frame, [8, 18], [0, 1], clamp),
        }}
      >
        <svg width={560} height={560} style={{ position: "absolute", rotate: "-90deg" }}>
          <circle cx={280} cy={280} r={250} stroke="rgba(255,255,255,0.08)" strokeWidth={22} fill="none" />
          <circle
            cx={280}
            cy={280}
            r={250}
            stroke={C.red}
            strokeWidth={22}
            strokeLinecap="round"
            fill="none"
            strokeDasharray={RING}
            strokeDashoffset={interpolate(frame, [12, 105], [RING, RING * 0.08], {
              ...clamp,
              easing: Easing.out(Easing.cubic),
            })}
            style={{ filter: "drop-shadow(0 0 18px rgba(255,59,92,0.8))" }}
          />
        </svg>
        <div style={{ display: "flex", alignItems: "baseline" }}>
          <span
            style={{
              fontSize: 260,
              fontWeight: 800,
              letterSpacing: -10,
              fontVariantNumeric: "tabular-nums",
              textShadow: "0 0 60px rgba(255,59,92,0.55)",
            }}
          >
            {hours}
          </span>
          <span style={{ fontSize: 110, fontWeight: 800, color: C.red }}>h</span>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          top: 1320,
          left: 80,
          right: 80,
          display: "flex",
          flexDirection: "column",
          gap: 30,
        }}
      >
        {PAINS.map((p, i) => {
          const start = 40 + i * 12;
          return (
            <div
              key={p}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 30,
                fontSize: 66,
                fontWeight: 700,
                opacity: interpolate(frame, [start, start + 8], [0, 1], clamp),
                translate: `${interpolate(frame, [start, start + 14], [-80, 0], { ...clamp, easing: EASE })}px 0px`,
              }}
            >
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 18,
                  backgroundColor: "rgba(255,59,92,0.16)",
                  border: `3px solid ${C.red}`,
                  color: C.red,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 40,
                  fontWeight: 800,
                }}
              >
                ✕
              </div>
              {p}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
