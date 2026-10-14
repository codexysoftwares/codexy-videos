import { at } from "./motion";

// Text that appears word by word exactly when each word is spoken (times come from palavras.json).
// Use { w: "|" } for a line break and accent: true to color a word.
export type KWord = { w: string; at: number; accent?: boolean };

export const Kinetic = ({
  t,
  words,
  size,
  color = "#FFFFFF",
  accent = "#3377FF",
  top,
  from,
  to,
  weight = 800,
  font,
  align = "center",
  shadow = true,
}: {
  t: number;
  words: KWord[];
  size: number;
  color?: string;
  accent?: string;
  top: number;
  from: number;
  to: number;
  weight?: number;
  font: string;
  align?: "center" | "left";
  shadow?: boolean;
}) => {
  const o = Math.min(at(t, [from, from + 0.08], [0, 1]), at(t, [to - 0.18, to], [1, 0]));
  if (o <= 0) return null;
  const outBlur = at(t, [to - 0.18, to], [0, 12]);
  return (
    <div
      style={{
        position: "absolute",
        top,
        left: 64,
        right: 64,
        display: "flex",
        flexWrap: "wrap",
        justifyContent: align === "center" ? "center" : "flex-start",
        columnGap: size * 0.25,
        fontFamily: font,
        fontWeight: weight,
        fontSize: size,
        lineHeight: 1.04,
        letterSpacing: -size * 0.035,
        color,
        opacity: o,
        filter: outBlur ? `blur(${outBlur}px)` : undefined,
        textShadow: shadow ? "0 6px 30px rgba(0,0,0,0.45)" : undefined,
      }}
    >
      {words.map((w, i) => {
        if (w.w === "|") return <div key={i} style={{ flexBasis: "100%", height: 0 }} />;
        const p = at(t, [w.at - 0.05, w.at + 0.14], [0, 1]);
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              opacity: p,
              translate: `0px ${(1 - p) * size * 0.35}px`,
              scale: `${0.86 + p * 0.14}`,
              filter: p < 1 ? `blur(${(1 - p) * 10}px)` : undefined,
              color: w.accent ? accent : color,
            }}
          >
            {w.w}
          </span>
        );
      })}
    </div>
  );
};
