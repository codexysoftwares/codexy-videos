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

const NOTIFS = [
  { app: "WHATSAPP", text: "47 mensagens não lidas", color: "#25D366", x: 80, y: 200, rot: -4, at: 0 },
  { app: "EXCEL", text: "planilha_FINAL_v7 (2).xlsx", color: "#21A366", x: 240, y: 440, rot: 3, at: 6 },
  { app: "PEDIDOS", text: "Pedido #1043 duplicado", color: C.red, x: 70, y: 680, rot: -2, at: 12 },
  { app: "E-MAIL", text: "“Alguém vai me responder?”", color: "#F5A524", x: 230, y: 920, rot: 4, at: 18 },
  { app: "FINANCEIRO", text: "Fechamento atrasado", color: C.red, x: 110, y: 1160, rot: -3, at: 24 },
];

const WORDS = ["Sua", "empresa", "ainda", "roda", "no", "improviso?"];

const Notification: React.FC<(typeof NOTIFS)[number] & { i: number }> = ({
  app,
  text,
  color,
  x,
  y,
  rot,
  at,
  i,
}) => {
  const frame = useCurrentFrame();
  const shake = interpolate(frame, [30, 100], [0, 1], clamp);

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: 760,
        display: "flex",
        alignItems: "center",
        gap: 28,
        padding: "30px 36px",
        borderRadius: 32,
        backgroundColor: "rgba(20,24,40,0.88)",
        border: "2px solid rgba(255,255,255,0.10)",
        boxShadow: "0 30px 80px rgba(0,0,0,0.55)",
        opacity: interpolate(frame, [at, at + 6], [0, 1], clamp),
        scale: interpolate(frame, [at, at + 12], [0.6, 1], {
          ...clamp,
          easing: EASE,
          output: "perceptual-scale",
        }),
        translate: `${Math.sin(frame * 1.7 + i * 2) * 7 * shake}px ${interpolate(frame, [at, at + 12], [60, 0], { ...clamp, easing: EASE }) + Math.cos(frame * 2.1 + i) * 5 * shake}px`,
        rotate: `${rot + Math.sin(frame * 0.9 + i) * 1.2 * shake}deg`,
      }}
    >
      <div
        style={{
          width: 76,
          height: 76,
          borderRadius: 22,
          backgroundColor: color,
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: C.white,
          fontFamily: SANS,
          fontWeight: 800,
          fontSize: 40,
        }}
      >
        !
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <div
          style={{
            fontFamily: MONO,
            fontSize: 24,
            letterSpacing: 3,
            color: C.muted,
          }}
        >
          {app} · agora
        </div>
        <div
          style={{
            fontFamily: SANS,
            fontWeight: 700,
            fontSize: 40,
            color: C.white,
            whiteSpace: "nowrap",
          }}
        >
          {text}
        </div>
      </div>
    </div>
  );
};

export const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ fontFamily: SANS }}>
      <Background tone="danger" />
      <AbsoluteFill
        style={{
          scale: interpolate(frame, [0, 105], [1.06, 1], clamp),
        }}
      >
        {NOTIFS.map((n, i) => (
          <Notification key={n.app} {...n} i={i} />
        ))}
      </AbsoluteFill>
      {NOTIFS.map((n) => (
        <Sequence key={n.app} from={n.at} durationInFrames={20} premountFor={fps}>
          <Audio src={staticFile(SFX.notif)} volume={0.18} />
        </Sequence>
      ))}
      <div
        style={{
          position: "absolute",
          left: 80,
          right: 80,
          top: 1440,
          display: "flex",
          flexWrap: "wrap",
          columnGap: 26,
          rowGap: 4,
          fontSize: 112,
          fontWeight: 800,
          lineHeight: 1.05,
          letterSpacing: -3,
          color: C.white,
        }}
      >
        {WORDS.map((w, i) => {
          const start = 30 + i * 5;
          const isKey = i === WORDS.length - 1;
          return (
            <span
              key={w}
              style={{
                display: "inline-block",
                color: isKey ? C.red : C.white,
                textShadow: isKey ? "0 0 40px rgba(255,59,92,0.6)" : "none",
                opacity: interpolate(frame, [start, start + 8], [0, 1], clamp),
                filter: `blur(${interpolate(frame, [start, start + 10], [12, 0], clamp)}px)`,
                translate: `${isKey ? Math.sin(frame * 2.3) * 4 * interpolate(frame, [start + 10, start + 20], [0, 1], clamp) : 0}px ${interpolate(frame, [start, start + 12], [70, 0], { ...clamp, easing: EASE })}px`,
              }}
            >
              {w}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
