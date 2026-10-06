import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { clamp } from "../../../shared/theme";
import { Caption } from "../Caption";
import { Network } from "../Network";
import { N, SCENE, f } from "../timeline";

const L = (t: number) => f(t - SCENE.entende.from);

// "Primeiro, entende como você trabalha.": the network returns organic and a scan maps each area.
export const EntendeScene: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      style={{
        opacity:
          interpolate(frame, [0, 8], [0, 1], clamp) *
          interpolate(frame, [L(11.45), L(11.75)], [1, 0], clamp),
      }}
    >
      <AbsoluteFill
        style={{
          transform: `perspective(1600px) rotateX(${interpolate(frame, [0, L(11.75)], [28, 6], {
            ...clamp,
            easing: Easing.out(Easing.cubic),
          })}deg)`,
          scale: interpolate(frame, [0, L(11.75)], [1.12, 0.98], clamp),
          transformOrigin: "50% 45%",
        }}
      >
        <Network
          frame={frame}
          draw={interpolate(frame, [0, 18], [0.3, 1], clamp)}
          scan={interpolate(frame, [L(9.55), L(11.2)], [0, 1], {
            ...clamp,
            easing: Easing.inOut(Easing.cubic),
          })}
        />
      </AbsoluteFill>
      <Caption
        text="Primeiro, *entende* como você trabalha."
        at={L(N.entende + 0.14)}
        speechFrames={f(1.6)}
      />
    </AbsoluteFill>
  );
};
