import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { C, EASE, SANS, clamp } from "../../../shared/theme";
import { BEAT, SCENE, f } from "../timeline";

const L = (t: number) => f(t - SCENE.servicos.from);

const WORDS = [
  { text: "Sistemas.", hit: L(BEAT.sistemas), top: 640 },
  { text: "Sites.", hit: L(BEAT.sites), top: 860 },
  { text: "Chatbots.", hit: L(BEAT.chatbots), top: 1080 },
];

// The drop: one word slams in on each beat.
export const ServicosScene: React.FC = () => {
  const frame = useCurrentFrame();
  const lastHit = [...WORDS].reverse().find((w) => frame >= w.hit)?.hit ?? WORDS[0].hit;
  const pulse = interpolate(frame - lastHit, [0, 2, 14], [0, 1, 0], clamp);
  const shake = interpolate(frame - lastHit, [0, 10], [10, 0], clamp);
  const allOn = interpolate(frame, [L(18.9), L(19.2)], [0, 1], clamp);

  return (
    <AbsoluteFill
      style={{
        fontFamily: SANS,
        color: C.white,
        opacity:
          interpolate(frame, [0, 3], [0, 1], clamp) *
          interpolate(frame, [L(19.15), L(19.35)], [1, 0], clamp),
      }}
    >
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 48%, rgba(0,85,255,${0.25 + 0.45 * pulse}) 0%, rgba(0,20,61,0.6) 40%, transparent 75%)`,
        }}
      />
      <AbsoluteFill
        style={{ translate: `${Math.sin(frame * 3.3) * shake}px ${Math.cos(frame * 2.9) * shake}px` }}
      >
        {WORDS.map((w, i) => {
          const next = WORDS[i + 1]?.hit ?? Infinity;
          const dim = frame >= next ? 0.32 : 1;
          return (
            <div
              key={w.text}
              style={{
                position: "absolute",
                top: w.top,
                left: 0,
                right: 0,
                textAlign: "center",
                fontSize: 176,
                fontWeight: 800,
                letterSpacing: -7,
                textShadow: "0 0 70px rgba(51,119,255,0.8)",
                opacity:
                  interpolate(frame, [w.hit, w.hit + 2], [0, 1], clamp) *
                  interpolate(allOn, [0, 1], [dim, 1]),
                scale: interpolate(frame, [w.hit, w.hit + 8], [1.6, 1], {
                  ...clamp,
                  easing: EASE,
                  output: "perceptual-scale",
                }),
                filter: `blur(${interpolate(frame, [w.hit, w.hit + 5], [26, 0], clamp)}px)`,
              }}
            >
              {w.text}
            </div>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
