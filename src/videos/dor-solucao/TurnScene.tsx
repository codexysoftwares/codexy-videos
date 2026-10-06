import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Background } from "../../shared/components/Background";
import { C, EASE, MONO, SANS, clamp } from "../../shared/theme";

const LINES = [
  { text: "E se tudo isso", at: 4 },
  { text: "funcionasse", at: 10 },
];

export const TurnScene: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ fontFamily: SANS, color: C.white }}>
      <Background tone="brand" />
      <AbsoluteFill
        style={{
          justifyContent: "center",
          padding: "0 80px",
          scale: interpolate(frame, [0, 75], [1, 1.06], clamp),
        }}
      >
        <div
          style={{
            fontFamily: MONO,
            fontSize: 36,
            letterSpacing: 4,
            color: C.glow,
            marginBottom: 40,
            opacity: interpolate(frame, [0, 8], [0, 1], clamp),
          }}
        >
          // e se...
        </div>
        {LINES.map((l) => (
          <div
            key={l.text}
            style={{
              fontSize: 128,
              fontWeight: 800,
              lineHeight: 1.08,
              letterSpacing: -4,
              opacity: interpolate(frame, [l.at, l.at + 8], [0, 1], clamp),
              translate: `0px ${interpolate(frame, [l.at, l.at + 14], [80, 0], { ...clamp, easing: EASE })}px`,
            }}
          >
            {l.text}
          </div>
        ))}
        <div
          style={{
            position: "relative",
            alignSelf: "flex-start",
            marginTop: 18,
            fontSize: 148,
            fontWeight: 800,
            letterSpacing: -5,
            padding: "0 28px 14px",
            opacity: interpolate(frame, [18, 24], [0, 1], clamp),
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: 24,
              backgroundColor: C.blue,
              boxShadow: "0 0 80px rgba(0,85,255,0.7)",
              transformOrigin: "left center",
              scale: `${interpolate(frame, [18, 32], [0, 1], { ...clamp, easing: EASE })} 1`,
            }}
          />
          <span style={{ position: "relative" }}>sozinho?</span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
