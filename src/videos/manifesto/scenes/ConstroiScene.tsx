import { AbsoluteFill, interpolate, interpolateColors, useCurrentFrame } from "remotion";
import { C, EASE, clamp } from "../../../shared/theme";
import { Caption } from "../Caption";
import { N, SCENE, f } from "../timeline";

const L = (t: number) => f(t - SCENE.constroi.from);

type Block = { x: number; y: number; w: number; h: number; fill: string; at: number };

const PANEL = { x: 160, y: 380, w: 760, h: 900 };
const BLOCKS: Block[] = [
  { x: 0, y: 0, w: 170, h: 900, fill: "rgba(0,85,255,0.30)", at: 6 },
  { x: 200, y: 30, w: 530, h: 70, fill: "rgba(255,255,255,0.10)", at: 9 },
  { x: 200, y: 130, w: 160, h: 140, fill: "rgba(0,85,255,0.55)", at: 12 },
  { x: 385, y: 130, w: 160, h: 140, fill: "rgba(51,119,255,0.40)", at: 14 },
  { x: 570, y: 130, w: 160, h: 140, fill: "rgba(33,208,122,0.35)", at: 16 },
  { x: 200, y: 300, w: 530, h: 300, fill: "rgba(255,255,255,0.05)", at: 18 },
  { x: 200, y: 630, w: 530, h: 60, fill: "rgba(255,255,255,0.07)", at: 22 },
  { x: 200, y: 710, w: 530, h: 60, fill: "rgba(255,255,255,0.07)", at: 24 },
  { x: 200, y: 790, w: 530, h: 60, fill: "rgba(255,255,255,0.07)", at: 26 },
];
const BARS = [0.35, 0.55, 0.45, 0.7, 0.6, 0.85, 1];

// "Depois, constrói exatamente isso.": a wireframe interface draws itself and fills in.
export const ConstroiScene: React.FC = () => {
  const frame = useCurrentFrame();
  const fillIn = interpolate(frame, [L(12.3), L(13.0)], [0, 1], clamp);

  return (
    <AbsoluteFill
      style={{
        opacity:
          interpolate(frame, [0, 6], [0, 1], clamp) *
          interpolate(frame, [L(13.45), L(13.65)], [1, 0], clamp),
      }}
    >
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <g
          transform={`translate(${PANEL.x} ${PANEL.y})`}
          style={{
            scale: interpolate(frame, [0, L(13.65)], [0.94, 1.02], clamp),
            transformOrigin: "380px 450px",
          }}
        >
          <rect
            width={PANEL.w}
            height={PANEL.h}
            rx={36}
            fill={interpolateColors(fillIn, [0, 1], ["rgba(8,23,56,0)", "rgba(8,23,56,0.85)"])}
            stroke={C.glow}
            strokeWidth={3}
            strokeOpacity={0.8}
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={interpolate(frame, [0, 14], [1, 0], { ...clamp, easing: EASE })}
          />
          {BLOCKS.map((b, i) => {
            const draw = interpolate(frame, [b.at, b.at + 10], [1, 0], { ...clamp, easing: EASE });
            return (
              <rect
                key={i}
                x={b.x + 15}
                y={b.y + 15}
                width={b.w - 30 > 0 ? b.w - 30 : b.w}
                height={b.h - 30 > 0 ? b.h - 30 : b.h}
                rx={16}
                fill={interpolateColors(fillIn, [0, 1], ["rgba(0,0,0,0)", b.fill])}
                stroke={C.glow}
                strokeOpacity={interpolate(fillIn, [0, 1], [0.7, 0.15])}
                strokeWidth={2}
                pathLength={1}
                strokeDasharray={1}
                strokeDashoffset={draw}
              />
            );
          })}
          {BARS.map((h, i) => (
            <rect
              key={i}
              x={240 + i * 66}
              y={570 - 240 * h}
              width={42}
              height={240 * h}
              rx={10}
              fill={i === BARS.length - 1 ? C.glow : "rgba(51,119,255,0.45)"}
              style={{
                transformBox: "fill-box",
                transformOrigin: "bottom",
                scale: `1 ${interpolate(frame, [L(12.4) + i * 2, L(12.4) + i * 2 + 12], [0, 1], { ...clamp, easing: EASE })}`,
              }}
            />
          ))}
        </g>
      </svg>
      <Caption
        text="Depois, constrói *exatamente* *isso.*"
        at={L(N.constroi + 0.16)}
        speechFrames={f(1.6)}
        top={1400}
      />
    </AbsoluteFill>
  );
};
