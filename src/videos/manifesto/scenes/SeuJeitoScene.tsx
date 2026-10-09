import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { clamp } from "../../../shared/theme";
import { Caption } from "../../../shared/components/Caption";
import { Network } from "../Network";
import { N, SCENE, f } from "../timeline";

const L = (t: number) => f(t - SCENE.seuJeito.from);

// "Feitos do seu jeito.": the original network returns, fully lit.
export const SeuJeitoScene: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      style={{
        opacity:
          interpolate(frame, [0, 8], [0, 1], clamp) *
          interpolate(frame, [L(21.0), L(21.3)], [1, 0], clamp),
      }}
    >
      <AbsoluteFill
        style={{
          scale: interpolate(frame, [0, L(21.3)], [0.92, 1.04], clamp),
          rotate: `${interpolate(frame, [0, L(21.3)], [-3, 2], clamp)}deg`,
        }}
      >
        <Network frame={frame} draw={1} lit={interpolate(frame, [0, 14], [0, 1], clamp)} />
      </AbsoluteFill>
      <Caption
        text="Feitos do *seu* *jeito.*"
        at={L(N.seuJeito + 0.16)}
        speechFrames={f(0.9)}
        size={104}
        top={1380}
      />
    </AbsoluteFill>
  );
};
