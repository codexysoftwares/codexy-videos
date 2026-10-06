import { Audio } from "@remotion/media";
import {
  AbsoluteFill,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { C, EASE_IN_OUT, SFX, clamp } from "../theme";

// Band must be wider than the frame plus the chevron depth so it fully covers the cut point.
const W = 3000;
const P = 520;

const Band: React.FC<{ color: string; offset: number }> = ({
  color,
  offset,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames, width } = useVideoConfig();

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: W + P,
        height: "100%",
        backgroundColor: color,
        clipPath: `polygon(0 0, ${W}px 0, ${W + P}px 50%, ${W}px 100%, 0 100%, ${P}px 50%)`,
        translate: `${interpolate(
          frame,
          [offset, durationInFrames - 1 + offset],
          [-(W + P), width],
          { ...clamp, easing: EASE_IN_OUT },
        )}px 0px`,
      }}
    />
  );
};

export const ChevronWipe: React.FC = () => {
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Audio src={staticFile(SFX.whoosh)} volume={0.6} premountFor={fps} />
      <Band color={C.glow} offset={-3} />
      <Band color={C.navy} offset={3} />
      <Band color={C.blue} offset={0} />
    </AbsoluteFill>
  );
};
