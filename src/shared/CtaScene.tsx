import { Audio } from "@remotion/media";
import {
  AbsoluteFill,
  Img,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Background } from "./components/Background";
import { C, EASE, MONO, SANS, SFX, clamp } from "./theme";

type Props = {
  readonly tagline?: string;
  readonly headline?: string;
  readonly impact?: boolean;
  readonly narration?: string;
};

export const CtaScene: React.FC<Props> = ({
  tagline = "SISTEMAS · SITES · CHATBOTS",
  headline = "Software sob medida\npro seu negócio.",
  impact = false,
  narration,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ fontFamily: SANS, color: C.white }}>
      <Background tone="brand" />
      {impact ? (
        <Audio src={staticFile(SFX.softImpact)} volume={narration ? 0.5 : 0.7} premountFor={fps} />
      ) : null}
      {narration ? (
        <Sequence from={4} premountFor={fps}>
          <Audio src={staticFile(narration)} />
        </Sequence>
      ) : null}

      <div
        style={{
          position: "absolute",
          left: 540 - 600,
          top: 640 - 600,
          width: 1200,
          height: 1200,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(0,85,255,0.55), transparent 60%)",
          opacity: interpolate(frame, [0, 20], [0, 1], clamp),
          scale: 1 + Math.sin(frame / 12) * 0.05,
        }}
      />

      <AbsoluteFill style={{ alignItems: "center", paddingTop: 560 }}>
        <Img
          src={staticFile("brand/codexy-logo-light.png")}
          style={{
            width: 820,
            opacity: interpolate(frame, [4, 16], [0, 1], clamp),
            filter: `blur(${interpolate(frame, [4, 22], [24, 0], clamp)}px) drop-shadow(0 0 40px rgba(51,119,255,0.55))`,
            scale: interpolate(frame, [4, 26], [1.3, 1], {
              ...clamp,
              easing: EASE,
              output: "perceptual-scale",
            }),
          }}
        />
        <div
          style={{
            marginTop: 50,
            fontFamily: MONO,
            fontSize: 32,
            fontWeight: 600,
            color: C.glow,
            letterSpacing: interpolate(frame, [20, 40], [24, 8], { ...clamp, easing: EASE }),
            opacity: interpolate(frame, [20, 30], [0, 1], clamp),
          }}
        >
          {tagline}
        </div>

        <div
          style={{
            marginTop: 150,
            textAlign: "center",
            fontSize: 92,
            fontWeight: 800,
            lineHeight: 1.08,
            letterSpacing: -3,
            whiteSpace: "pre-line",
            opacity: interpolate(frame, [32, 42], [0, 1], clamp),
            translate: `0px ${interpolate(frame, [32, 48], [50, 0], { ...clamp, easing: EASE })}px`,
          }}
        >
          {headline}
        </div>

        <div
          style={{
            position: "relative",
            overflow: "hidden",
            marginTop: 90,
            display: "flex",
            alignItems: "center",
            gap: 20,
            padding: "34px 64px",
            borderRadius: 999,
            background: `linear-gradient(135deg, ${C.glow}, ${C.blue})`,
            boxShadow: `0 20px 70px rgba(0,85,255,${0.5 + Math.sin(frame / 8) * 0.15})`,
            fontSize: 58,
            fontWeight: 800,
            opacity: interpolate(frame, [52, 60], [0, 1], clamp),
            scale: interpolate(frame, [52, 66], [0.7, 1], {
              ...clamp,
              easing: EASE,
              output: "perceptual-scale",
            }),
          }}
        >
          codexy.com.br →
          <div
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              width: 160,
              background:
                "linear-gradient(90deg, transparent, rgba(255,255,255,0.55), transparent)",
              rotate: "20deg",
              translate: `${interpolate(frame, [76, 98], [-300, 900], clamp)}px 0px`,
            }}
          />
        </div>

        <div
          style={{
            marginTop: 44,
            display: "flex",
            alignItems: "center",
            gap: 18,
            fontSize: 46,
            fontWeight: 700,
            color: C.ice,
            opacity: interpolate(frame, [62, 72], [0, 1], clamp),
            translate: `0px ${interpolate(frame, [62, 76], [30, 0], { ...clamp, easing: EASE })}px`,
          }}
        >
          <svg width={48} height={48} viewBox="0 0 24 24" fill="none" stroke={C.ice} strokeWidth={2}>
            <rect x={3} y={3} width={18} height={18} rx={5} />
            <circle cx={12} cy={12} r={4} />
            <circle cx={17.3} cy={6.7} r={0.6} fill={C.ice} />
          </svg>
          @codexy.ai
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
