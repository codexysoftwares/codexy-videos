import { AbsoluteFill, useCurrentFrame } from "remotion";

// Film grain + vignette laid over the whole video. The noise seed changes every 2 frames.
// Light-background videos turn the dark vignette off.
export const Grain: React.FC<{ readonly vignette?: boolean; readonly amount?: number }> = ({
  vignette = true,
  amount = 0.09,
}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <svg width="100%" height="100%" style={{ position: "absolute", opacity: amount, mixBlendMode: "overlay" }}>
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={Math.floor(frame / 2)} />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>
      {vignette ? (
        <AbsoluteFill
          style={{
            background: "radial-gradient(ellipse at 50% 45%, transparent 50%, rgba(0,0,0,0.7))",
          }}
        />
      ) : null}
    </AbsoluteFill>
  );
};
