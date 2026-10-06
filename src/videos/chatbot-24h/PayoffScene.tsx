import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Background } from "../../shared/components/Background";
import { C, EASE, MONO, SANS, clamp } from "../../shared/theme";
import { MOMENTS, formatTime } from "./TimelineScene";

export const PayoffScene: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ fontFamily: SANS, color: C.white }}>
      <Background tone="dark" />
      <AbsoluteFill style={{ padding: "0 80px", paddingTop: 400 }}>
        <div
          style={{
            fontSize: 60,
            fontWeight: 500,
            color: C.muted,
            opacity: interpolate(frame, [4, 16], [0, 1], clamp),
            translate: `0px ${interpolate(frame, [4, 24], [30, 0], { ...clamp, easing: EASE })}px`,
          }}
        >
          Enquanto sua equipe descansava,
        </div>
        <div
          style={{
            marginTop: 14,
            fontSize: 108,
            fontWeight: 800,
            letterSpacing: -4,
            lineHeight: 1.04,
            opacity: interpolate(frame, [16, 28], [0, 1], clamp),
            translate: `0px ${interpolate(frame, [16, 36], [50, 0], { ...clamp, easing: EASE })}px`,
          }}
        >
          seu atendimento{" "}
          <span style={{ color: C.glow, textShadow: "0 0 50px rgba(51,119,255,0.6)" }}>
            continuou.
          </span>
        </div>

        <div style={{ marginTop: 110, display: "flex", flexDirection: "column" }}>
          {MOMENTS.map((m, i) => {
            const at = 44 + i * 9;
            return (
              <div
                key={m.minutes}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 40,
                  padding: "30px 0",
                  borderTop: "2px solid rgba(255,255,255,0.08)",
                  opacity: interpolate(frame, [at, at + 10], [0, 1], clamp),
                  translate: `${interpolate(frame, [at, at + 18], [-40, 0], { ...clamp, easing: EASE })}px 0px`,
                }}
              >
                <div style={{ fontFamily: MONO, fontSize: 40, color: C.glow, width: 150 }}>
                  {formatTime(m.minutes)}
                </div>
                <div style={{ fontSize: 46, fontWeight: 700 }}>{m.result}</div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
