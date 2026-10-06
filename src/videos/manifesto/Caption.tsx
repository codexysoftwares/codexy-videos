import { interpolate, useCurrentFrame } from "remotion";
import { C, EASE, SANS, clamp } from "../../shared/theme";

type Props = {
  // Words wrapped in *asterisks* get the accent color.
  readonly text: string;
  readonly at: number;
  readonly speechFrames: number;
  readonly accent?: string;
  readonly size?: number;
  readonly top?: number;
  readonly outAt?: number;
  readonly center?: boolean;
};

export const Caption: React.FC<Props> = ({
  text,
  at,
  speechFrames,
  accent = C.glow,
  size = 76,
  top = 1330,
  outAt,
  center = false,
}) => {
  const frame = useCurrentFrame();
  const words = text.split(" ");
  const step = speechFrames / words.length;
  const out = outAt === undefined ? 1 : interpolate(frame, [outAt, outAt + 10], [1, 0], clamp);

  return (
    <div
      style={{
        position: "absolute",
        top,
        left: 80,
        right: 80,
        display: "flex",
        flexWrap: "wrap",
        justifyContent: center ? "center" : "flex-start",
        columnGap: size * 0.28,
        fontFamily: SANS,
        fontSize: size,
        fontWeight: 700,
        lineHeight: 1.12,
        letterSpacing: -size * 0.03,
        color: C.white,
        opacity: out,
      }}
    >
      {words.map((raw, i) => {
        const key = raw.startsWith("*");
        const w = raw.replace(/\*/g, "");
        const s = at + i * step;
        return (
          <span
            key={`${w}-${i}`}
            style={{
              display: "inline-block",
              color: key ? accent : C.white,
              textShadow: key ? `0 0 40px ${accent}88` : "none",
              opacity: interpolate(frame, [s, s + 6], [0, 1], clamp),
              filter: `blur(${interpolate(frame, [s, s + 8], [10, 0], clamp)}px)`,
              translate: `0px ${interpolate(frame, [s, s + 12], [28, 0], { ...clamp, easing: EASE })}px`,
            }}
          >
            {w}
          </span>
        );
      })}
    </div>
  );
};
