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
import { C, EASE, SANS, SFX, clamp } from "../../shared/theme";

const WORDS = ["demorado.", "arriscado.", "sem suporte."];

// Narrated frames come from the speech timing in 01-objecao.wav (placed at frame 8).
const TIMING = {
  silent: { words: [[30, 42], [50, 62], [70, 82]], answer: 108, fadeOut: 150 },
  narrated: { words: [[77, 99], [103, 129], [133, 163]], answer: 181, fadeOut: 218 },
} as const;

export const NARRATION_OFFSET = 8;

export const ObjectionScene: React.FC<{ readonly narrated?: boolean }> = ({
  narrated = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = narrated ? TIMING.narrated : TIMING.silent;

  return (
    <AbsoluteFill style={{ fontFamily: SANS, color: C.white }}>
      <Background tone="dark" />
      {narrated ? (
        <Sequence from={NARRATION_OFFSET} premountFor={fps}>
          <Audio src={staticFile("narracao/como-trabalhamos/01-objecao.wav")} />
        </Sequence>
      ) : null}
      {t.words.map(([, strike]) => (
        <Sequence key={strike} from={strike} durationInFrames={25} premountFor={fps}>
          <Audio src={staticFile(SFX.softWhoosh)} volume={narrated ? 0.18 : 0.3} playbackRate={1.6} />
        </Sequence>
      ))}
      <Sequence from={t.answer} durationInFrames={50} premountFor={fps}>
        <Audio src={staticFile(SFX.softImpact)} volume={narrated ? 0.35 : 0.45} />
      </Sequence>

      <AbsoluteFill
        style={{
          padding: "0 80px",
          paddingTop: 380,
          opacity: interpolate(frame, [t.fadeOut, t.fadeOut + 14], [1, 0], clamp),
        }}
      >
        <div
          style={{
            fontSize: 64,
            fontWeight: 500,
            color: C.muted,
            lineHeight: 1.2,
            opacity: interpolate(frame, [2, 14], [0, 1], clamp),
            translate: `0px ${interpolate(frame, [2, 22], [30, 0], { ...clamp, easing: EASE })}px`,
          }}
        >
          Software sob medida
          <br />
          tem fama de ser...
        </div>

        <div style={{ marginTop: 70, display: "flex", flexDirection: "column", gap: 10 }}>
          {WORDS.map((w, i) => {
            const [at, strike] = t.words[i];
            return (
              <div
                key={w}
                style={{
                  position: "relative",
                  alignSelf: "flex-start",
                  fontSize: 124,
                  fontWeight: 800,
                  letterSpacing: -4,
                  lineHeight: 1.1,
                  opacity:
                    interpolate(frame, [at, at + 8], [0, 1], clamp) *
                    interpolate(frame, [strike + 2, strike + 14], [1, 0.35], clamp),
                  translate: `0px ${interpolate(frame, [at, at + 16], [50, 0], { ...clamp, easing: EASE })}px`,
                }}
              >
                {w}
                <div
                  style={{
                    position: "absolute",
                    left: -8,
                    right: -8,
                    top: "56%",
                    height: 12,
                    borderRadius: 6,
                    backgroundColor: C.red,
                    transformOrigin: "left center",
                    scale: `${interpolate(frame, [strike, strike + 10], [0, 1], { ...clamp, easing: EASE })} 1`,
                  }}
                />
              </div>
            );
          })}
        </div>

        <div
          style={{
            marginTop: 90,
            fontSize: 112,
            fontWeight: 800,
            letterSpacing: -4,
            color: C.glow,
            textShadow: "0 0 60px rgba(51,119,255,0.6)",
            opacity: interpolate(frame, [t.answer, t.answer + 8], [0, 1], clamp),
            scale: interpolate(frame, [t.answer, t.answer + 20], [1.12, 1], {
              ...clamp,
              easing: EASE,
              output: "perceptual-scale",
            }),
            transformOrigin: "left center",
          }}
        >
          Com a gente, não.
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
