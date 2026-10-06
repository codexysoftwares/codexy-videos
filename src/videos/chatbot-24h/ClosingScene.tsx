import { Audio } from "@remotion/media";
import {
  AbsoluteFill,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Background } from "../../shared/components/Background";
import { C, EASE, MONO, SANS, SFX, clamp } from "../../shared/theme";

const LIGHTS_OFF = 62;

export const ClosingScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const dim = interpolate(frame, [LIGHTS_OFF, LIGHTS_OFF + 4], [1, 0.32], clamp);

  return (
    <AbsoluteFill style={{ fontFamily: SANS, color: C.white }}>
      <Background tone="dark" />
      <Sequence from={LIGHTS_OFF} durationInFrames={30} premountFor={fps}>
        <Audio src={staticFile(SFX.pop)} volume={0.5} />
      </Sequence>
      <Sequence from={117} durationInFrames={40} premountFor={fps}>
        <Audio src={staticFile(SFX.softRiser)} volume={0.35} />
      </Sequence>

      <AbsoluteFill
        style={{
          backgroundColor: "#000",
          opacity: interpolate(frame, [LIGHTS_OFF, LIGHTS_OFF + 4], [0, 0.45], clamp),
        }}
      />

      <AbsoluteFill
        style={{
          alignItems: "center",
          paddingTop: 470,
          opacity: interpolate(frame, [122, 136], [1, 0], clamp),
          scale: interpolate(frame, [110, 140], [1, 0.96], clamp),
        }}
      >
        <div
          style={{
            fontFamily: MONO,
            fontSize: 30,
            letterSpacing: 8,
            color: C.muted,
            opacity: interpolate(frame, [4, 16], [0, 1], clamp) * dim,
          }}
        >
          FIM DO EXPEDIENTE
        </div>
        <div
          style={{
            marginTop: 20,
            fontFamily: MONO,
            fontSize: 250,
            fontWeight: 600,
            letterSpacing: -8,
            lineHeight: 1,
            opacity: interpolate(frame, [0, 16], [0, 1], clamp) * dim,
            filter: `blur(${interpolate(frame, [0, 18], [18, 0], clamp)}px)`,
            scale: interpolate(frame, [0, 40], [1.08, 1], {
              ...clamp,
              easing: EASE,
              output: "perceptual-scale",
            }),
          }}
        >
          18:00
        </div>
        <div
          style={{
            marginTop: 70,
            fontSize: 60,
            fontWeight: 500,
            color: C.ice,
            opacity: interpolate(frame, [20, 32], [0, 1], clamp) * dim,
            translate: `0px ${interpolate(frame, [20, 40], [30, 0], { ...clamp, easing: EASE })}px`,
          }}
        >
          Sua equipe foi pra casa.
        </div>

        <div
          style={{
            marginTop: 120,
            fontSize: 128,
            fontWeight: 800,
            letterSpacing: -4,
            lineHeight: 1.05,
            textAlign: "center",
            whiteSpace: "pre-line",
            opacity: interpolate(frame, [76, 90], [0, 1], clamp),
            translate: `0px ${interpolate(frame, [76, 100], [50, 0], { ...clamp, easing: EASE })}px`,
          }}
        >
          {"Seus clientes,\n"}
          <span
            style={{
              color: C.glow,
              textShadow: "0 0 50px rgba(51,119,255,0.7)",
            }}
          >
            não.
          </span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
