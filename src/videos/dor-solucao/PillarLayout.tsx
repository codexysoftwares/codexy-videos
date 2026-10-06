import { Audio } from "@remotion/media";
import {
  AbsoluteFill,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { C, EASE, MONO, SANS, SFX, clamp } from "../../shared/theme";
import { Background } from "../../shared/components/Background";

type Props = {
  readonly index: string;
  readonly tag: string;
  readonly title: string;
  readonly subtitle: string;
  readonly children: React.ReactNode;
};

export const PillarLayout: React.FC<Props> = ({
  index,
  tag,
  title,
  subtitle,
  children,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ fontFamily: SANS, color: C.white }}>
      <Background tone="dark" />
      <Audio src={staticFile(SFX.whoosh)} volume={0.35} premountFor={fps} />
      <div
        style={{
          position: "absolute",
          top: 170,
          left: 80,
          display: "flex",
          alignItems: "center",
          gap: 18,
          padding: "14px 26px",
          borderRadius: 999,
          border: `2px solid ${C.blue}`,
          backgroundColor: "rgba(0,85,255,0.14)",
          fontFamily: MONO,
          fontSize: 30,
          fontWeight: 600,
          letterSpacing: 3,
          color: C.ice,
          opacity: interpolate(frame, [4, 12], [0, 1], clamp),
          translate: `${interpolate(frame, [4, 16], [-40, 0], { ...clamp, easing: EASE })}px 0px`,
        }}
      >
        <span style={{ color: C.glow }}>{index}</span>
        <span>{tag}</span>
      </div>
      <div
        style={{
          position: "absolute",
          top: 270,
          left: 80,
          right: 80,
          fontSize: 100,
          fontWeight: 800,
          lineHeight: 1.04,
          letterSpacing: -3.5,
          whiteSpace: "pre-line",
          opacity: interpolate(frame, [8, 16], [0, 1], clamp),
          translate: `0px ${interpolate(frame, [8, 22], [60, 0], { ...clamp, easing: EASE })}px`,
        }}
      >
        {title}
      </div>
      <div
        style={{
          position: "absolute",
          top: 510,
          left: 80,
          right: 80,
          fontSize: 44,
          fontWeight: 500,
          lineHeight: 1.3,
          color: C.muted,
          opacity: interpolate(frame, [14, 24], [0, 1], clamp),
          translate: `0px ${interpolate(frame, [14, 28], [40, 0], { ...clamp, easing: EASE })}px`,
        }}
      >
        {subtitle}
      </div>
      <div
        style={{
          position: "absolute",
          top: 690,
          left: 80,
          width: 920,
          height: 1080,
          opacity: interpolate(frame, [10, 20], [0, 1], clamp),
          scale: interpolate(frame, [10, 30], [0.9, 1], {
            ...clamp,
            easing: EASE,
            output: "perceptual-scale",
          }),
          translate: `0px ${interpolate(frame, [10, 30], [120, 0], { ...clamp, easing: EASE })}px`,
        }}
      >
        {children}
      </div>
    </AbsoluteFill>
  );
};

export const Panel: React.FC<{
  readonly children: React.ReactNode;
  readonly style?: React.CSSProperties;
}> = ({ children, style }) => (
  <div
    style={{
      width: "100%",
      height: "100%",
      borderRadius: 40,
      backgroundColor: C.panel,
      border: "2px solid rgba(51,119,255,0.35)",
      boxShadow:
        "0 40px 120px rgba(0,0,0,0.6), 0 0 80px rgba(0,85,255,0.18), inset 0 1px 0 rgba(255,255,255,0.08)",
      overflow: "hidden",
      position: "relative",
      ...style,
    }}
  >
    {children}
  </div>
);
