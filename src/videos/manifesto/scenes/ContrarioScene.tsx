import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { C, EASE, SANS, clamp } from "../../../shared/theme";
import { BEAT, N, SCENE, f } from "../timeline";

const L = (t: number) => f(t - SCENE.contrario.from);
const HIT = L(BEAT.contrario);

const CHEVRON_W = 2600;
const CHEVRON_P = 700;

// Near-silence, "A gente faz o..." and on the beat a Codexy chevron slices the screen into "contrário."
export const ContrarioScene: React.FC = () => {
  const frame = useCurrentFrame();
  const after = interpolate(frame, [HIT, HIT + 3], [0, 1], clamp);
  const flash = interpolate(frame, [HIT, HIT + 2, HIT + 9], [0, 0.45, 0], clamp);
  const shake = interpolate(frame, [HIT, HIT + 12], [14, 0], clamp);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#010309",
        fontFamily: SANS,
        color: C.white,
        opacity: interpolate(frame, [L(8.8), L(9.0)], [1, 0], clamp),
        translate: `${Math.sin(frame * 3.1) * shake}px ${Math.cos(frame * 2.7) * shake}px`,
      }}
    >
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at 50% 50%, ${C.blue} 0%, ${C.navy} 45%, #010309 85%)`,
          opacity: after,
        }}
      />

      <div
        style={{
          position: "absolute",
          top: interpolate(after, [0, 1], [880, 720]),
          left: 0,
          right: 0,
          textAlign: "center",
          fontSize: 84,
          fontWeight: 600,
          letterSpacing: -2,
          color: after > 0.5 ? C.ice : C.white,
        }}
      >
        {[
          { w: "A gente", at: L(N.contrario + 0.14) },
          { w: "faz o", at: L(N.contrario + 0.52) },
        ].map((p) => (
          <span
            key={p.w}
            style={{
              display: "inline-block",
              margin: "0 14px",
              opacity: interpolate(frame, [p.at, p.at + 6], [0, 1], clamp),
              filter: `blur(${interpolate(frame, [p.at, p.at + 8], [12, 0], clamp)}px)`,
            }}
          >
            {p.w}
          </span>
        ))}
      </div>

      <div
        style={{
          position: "absolute",
          top: 830,
          left: 0,
          right: 0,
          textAlign: "center",
          fontSize: 168,
          fontWeight: 800,
          letterSpacing: -7,
          textShadow: "0 0 80px rgba(51,119,255,0.9)",
          opacity: after,
          scale: interpolate(frame, [HIT, HIT + 10], [1.45, 1], {
            ...clamp,
            easing: EASE,
            output: "perceptual-scale",
          }),
          filter: `blur(${interpolate(frame, [HIT, HIT + 6], [24, 0], clamp)}px)`,
        }}
      >
        contrário.
      </div>

      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: CHEVRON_W + CHEVRON_P,
          height: "100%",
          background: `linear-gradient(90deg, ${C.navy}, ${C.blue} 70%, ${C.white})`,
          clipPath: `polygon(0 0, ${CHEVRON_W}px 0, ${CHEVRON_W + CHEVRON_P}px 50%, ${CHEVRON_W}px 100%, 0 100%, ${CHEVRON_P}px 50%)`,
          translate: `${interpolate(frame, [HIT - 5, HIT + 4], [-(CHEVRON_W + CHEVRON_P), 1080], clamp)}px 0px`,
        }}
      />
      <AbsoluteFill style={{ backgroundColor: "#9DB8FF", opacity: flash, mixBlendMode: "screen" }} />
    </AbsoluteFill>
  );
};
