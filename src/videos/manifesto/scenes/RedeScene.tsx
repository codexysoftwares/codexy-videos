import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { C, clamp } from "../../../shared/theme";
import { Caption } from "../../../shared/components/Caption";
import { Network } from "../Network";
import { N, SCENE, f } from "../timeline";

const L = (t: number) => f(t - SCENE.rede.from);

// "Toda empresa tem um jeito único..." → "...obriga você a mudar o seu": the organic network is forced into a grid.
export const RedeScene: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      style={{
        scale: interpolate(frame, [0, L(6.9)], [1.06, 1], clamp),
        opacity: interpolate(frame, [L(6.55), L(6.9)], [1, 0], clamp),
      }}
    >
      <Network
        frame={frame}
        draw={interpolate(frame, [L(0.2), L(2.6)], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) })}
        molde={interpolate(frame, [L(4.8), L(6.0)], [0, 1], {
          ...clamp,
          easing: Easing.bezier(0.7, 0, 0.2, 1),
        })}
      />
      <Caption
        text="Toda empresa tem um jeito *único* de funcionar."
        at={L(N.jeitoUnico + 0.08)}
        speechFrames={f(1.9)}
        outAt={L(3.25)}
      />
      <Caption
        text="Mas a maioria dos sistemas obriga você a *mudar* *o* *seu.*"
        at={L(N.molde + 0.16)}
        speechFrames={f(2.7)}
        accent={C.red}
      />
    </AbsoluteFill>
  );
};
