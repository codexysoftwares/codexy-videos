import { Audio } from "@remotion/media";
import {
  Sequence,
  interpolate,
  interpolateColors,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { C, EASE, EASE_IN_OUT, MONO, SFX, clamp } from "../../shared/theme";

const panel: React.CSSProperties = {
  position: "relative",
  width: "100%",
  height: "100%",
  borderRadius: 44,
  backgroundColor: "rgba(4,14,40,0.75)",
  border: "2px solid rgba(51,119,255,0.3)",
  boxShadow: "0 40px 120px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)",
  overflow: "hidden",
};

const FLOW = ["Pedido chega", "Conferência manual", "Aprovação", "Faturamento"];
const BOTTLENECK = 1;

type VisualProps = { readonly narrated?: boolean };

export const DiagnosticVisual: React.FC<VisualProps> = ({ narrated = false }) => {
  const frame = useCurrentFrame();
  // Narrated: flag lands on the word "gargalos" (~3.0s into 02-diagnostico.wav).
  const flagAt = narrated ? 92 : 52;
  const fixAt = narrated ? 110 : 74;
  const flagged = interpolate(frame, [flagAt, flagAt + 8], [0, 1], clamp);
  const fixed = interpolate(frame, [fixAt, fixAt + 10], [0, 1], clamp);

  return (
    <div style={{ ...panel, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      {FLOW.map((step, i) => {
        const at = 14 + i * 9;
        const isNeck = i === BOTTLENECK;
        const border = isNeck
          ? interpolateColors(fixed, [0, 1], [interpolateColors(flagged, [0, 1], ["rgba(255,255,255,0.18)", C.red]), C.glow])
          : "rgba(255,255,255,0.18)";
        return (
          <div key={step} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            {i > 0 ? (
              <div
                style={{
                  width: 4,
                  height: 64,
                  backgroundColor: "rgba(51,119,255,0.6)",
                  transformOrigin: "top center",
                  scale: `1 ${interpolate(frame, [at - 6, at + 2], [0, 1], { ...clamp, easing: EASE })}`,
                }}
              />
            ) : null}
            <div
              style={{
                position: "relative",
                width: 560,
                padding: "30px 0",
                borderRadius: 26,
                border: `3px solid ${border}`,
                backgroundColor: isNeck
                  ? interpolateColors(fixed, [0, 1], [`rgba(255,59,92,${0.12 * flagged})`, "rgba(0,85,255,0.18)"])
                  : "rgba(255,255,255,0.04)",
                textAlign: "center",
                fontSize: 42,
                fontWeight: 700,
                opacity: interpolate(frame, [at, at + 8], [0, 1], clamp),
                scale: interpolate(frame, [at, at + 14], [0.9, 1], { ...clamp, easing: EASE }),
              }}
            >
              {step}
              {isNeck ? (
                <div
                  style={{
                    position: "absolute",
                    right: -30,
                    top: -26,
                    padding: "8px 18px",
                    borderRadius: 999,
                    backgroundColor: fixed > 0.5 ? C.blue : C.red,
                    fontFamily: MONO,
                    fontSize: 24,
                    fontWeight: 600,
                    letterSpacing: 2,
                    opacity: flagged,
                    scale: interpolate(frame, [flagAt, flagAt + 10], [0.6, 1], { ...clamp, easing: EASE }),
                  }}
                >
                  {fixed > 0.5 ? "AUTOMATIZAR" : "GARGALO"}
                </div>
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export const PrototypeVisual: React.FC<VisualProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const color = interpolate(frame, [36, 60], [0, 1], { ...clamp, easing: EASE_IN_OUT });
  const comment = interpolate(frame, [70, 84], [0, 1], { ...clamp, easing: EASE });

  const block = (fill: string, extra: React.CSSProperties = {}): React.CSSProperties => ({
    borderRadius: 16,
    border: `2px dashed rgba(255,255,255,${0.28 * (1 - color)})`,
    backgroundColor: interpolateColors(color, [0, 1], ["rgba(255,255,255,0.02)", fill]),
    ...extra,
  });

  return (
    <div style={{ ...panel, padding: 40, display: "flex", gap: 24 }}>
      <Sequence from={70} durationInFrames={20} premountFor={fps}>
        <Audio src={staticFile(SFX.softBubble)} volume={0.35} />
      </Sequence>
      <div style={block("rgba(0,85,255,0.35)", { width: 170, display: "flex", flexDirection: "column", gap: 18, padding: 22 })}>
        {[0, 1, 2, 3].map((i) => (
          <div key={i} style={block(i === 0 ? C.glow : "rgba(255,255,255,0.18)", { height: 22, borderRadius: 11 })} />
        ))}
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 24 }}>
        <div style={block("rgba(255,255,255,0.08)", { height: 80 })} />
        <div style={{ display: "flex", gap: 20 }}>
          <div style={block("rgba(0,85,255,0.55)", { flex: 1, height: 150 })} />
          <div style={block("rgba(33,208,122,0.4)", { flex: 1, height: 150 })} />
        </div>
        <div style={block("rgba(255,255,255,0.06)", { flex: 1, padding: 24, display: "flex", flexDirection: "column", gap: 18 })}>
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} style={block("rgba(255,255,255,0.14)", { height: 26, borderRadius: 13, width: `${92 - i * 9}%` })} />
          ))}
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 240,
          bottom: 60,
          display: "flex",
          alignItems: "flex-start",
          gap: 18,
          padding: "24px 28px",
          borderRadius: "28px 28px 28px 8px",
          backgroundColor: C.white,
          color: C.deep,
          boxShadow: "0 30px 80px rgba(0,0,0,0.5)",
          opacity: comment,
          translate: `0px ${interpolate(comment, [0, 1], [30, 0])}px`,
        }}
      >
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: 28,
            backgroundColor: "#F5A524",
            color: C.white,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 28,
            fontWeight: 800,
            flexShrink: 0,
          }}
        >
          M
        </div>
        <div>
          <div style={{ fontSize: 24, fontWeight: 700, color: "#5A6585" }}>Marina · cliente</div>
          <div style={{ fontSize: 36, fontWeight: 700 }}>Ficou ótimo, pode seguir!</div>
        </div>
      </div>
    </div>
  );
};

const COLS = ["A fazer", "Fazendo", "Pronto"];
const CARDS = [
  { title: "Login e permissões", path: [[1, 0, 0], [2, 0, 28]] },
  { title: "Cadastro de clientes", path: [[1, 1, 0], [2, 1, 46]] },
  { title: "Relatórios", path: [[0, 0, 0], [1, 0, 36], [2, 2, 64]] },
  { title: "Integração WhatsApp", path: [[0, 1, 0], [1, 1, 56]] },
] as const;
const COL_W = 262;
const GAP = 20;
const CARD_H = 130;

const cardPos = (path: readonly (readonly [number, number, number])[], frame: number) => {
  let [col, row] = [path[0][0], path[0][1]];
  for (let k = 1; k < path.length; k++) {
    const [nc, nr, at] = path[k];
    const p = interpolate(frame, [at, at + 16], [0, 1], { ...clamp, easing: EASE_IN_OUT });
    col = col + (nc - col) * p;
    row = row + (nr - row) * p;
  }
  return { x: col * (COL_W + GAP), y: row * (CARD_H + GAP), col };
};

export const KanbanVisual: React.FC<VisualProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const done = CARDS.filter((c) => {
    const last = c.path[c.path.length - 1];
    return last[0] === 2 && frame >= last[2] + 16;
  }).length;

  return (
    <div style={{ ...panel, padding: 40 }}>
      {CARDS.flatMap((c) =>
        c.path.slice(1).map(([, , at]) => (
          <Sequence key={`${c.title}-${at}`} from={at} durationInFrames={10} premountFor={fps}>
            <Audio src={staticFile(SFX.softTick)} volume={0.3} />
          </Sequence>
        )),
      )}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 30 }}>
        <div style={{ fontSize: 40, fontWeight: 800 }}>Sprint atual</div>
        <div
          style={{
            padding: "10px 22px",
            borderRadius: 999,
            backgroundColor: "rgba(0,85,255,0.2)",
            border: `2px solid ${C.blue}`,
            fontFamily: MONO,
            fontSize: 24,
            color: C.ice,
          }}
        >
          ENTREGA SEMANAL · {done}/3 PRONTOS
        </div>
      </div>
      <div style={{ position: "relative", display: "flex", gap: GAP }}>
        {COLS.map((col) => (
          <div key={col} style={{ width: COL_W }}>
            <div
              style={{
                fontFamily: MONO,
                fontSize: 24,
                letterSpacing: 2,
                color: col === "Pronto" ? C.green : C.muted,
                marginBottom: 20,
              }}
            >
              {col.toUpperCase()}
            </div>
            <div style={{ height: 3 * CARD_H + 2 * GAP, borderRadius: 22, backgroundColor: "rgba(255,255,255,0.03)" }} />
          </div>
        ))}
        {CARDS.map((c, i) => {
          const pos = cardPos(c.path, frame);
          return (
            <div
              key={c.title}
              style={{
                position: "absolute",
                left: 0,
                top: 64,
                width: COL_W,
                height: CARD_H,
                padding: 22,
                borderRadius: 20,
                backgroundColor: interpolateColors(pos.col, [0, 1, 2], ["#14213F", "#10306E", "#0B4A3A"]),
                border: "2px solid rgba(255,255,255,0.10)",
                boxShadow: "0 16px 40px rgba(0,0,0,0.35)",
                fontSize: 30,
                fontWeight: 700,
                lineHeight: 1.2,
                translate: `${pos.x}px ${pos.y}px`,
                opacity: interpolate(frame, [i * 3, i * 3 + 10], [0, 1], clamp),
              }}
            >
              {c.title}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const CHART = "M0 150 C 80 140, 120 90, 200 100 S 330 40, 420 60 S 560 20, 660 30 S 760 10, 800 14";

export const DeliveryVisual: React.FC<VisualProps> = () => {
  const frame = useCurrentFrame();
  const draw = interpolate(frame, [20, 60], [1, 0], { ...clamp, easing: EASE_IN_OUT });

  const rows = [
    { label: "Treinamento da equipe", status: "concluído", at: 50 },
    { label: "Ajuste no relatório", status: "publicado há 2 min", at: 64 },
  ];

  return (
    <div style={{ ...panel, padding: 44, display: "flex", flexDirection: "column", gap: 30 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontFamily: MONO, fontSize: 28, color: C.ice }}>sistema.suaempresa.com.br</div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, fontFamily: MONO, fontSize: 26, color: C.green }}>
          <div
            style={{
              width: 16,
              height: 16,
              borderRadius: 8,
              backgroundColor: C.green,
              boxShadow: `0 0 ${10 + Math.sin(frame / 5) * 8}px ${C.green}`,
            }}
          />
          ONLINE
        </div>
      </div>
      <div style={{ borderRadius: 26, backgroundColor: "rgba(255,255,255,0.03)", padding: "30px 28px" }}>
        <div style={{ fontSize: 28, color: C.muted, marginBottom: 16 }}>Uso do sistema</div>
        <svg width={770} height={164} viewBox="0 0 800 170">
          <defs>
            <linearGradient id="area" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={C.blue} stopOpacity={0.45} />
              <stop offset="100%" stopColor={C.blue} stopOpacity={0} />
            </linearGradient>
          </defs>
          <path d={`${CHART} L 800 170 L 0 170 Z`} fill="url(#area)" opacity={1 - draw} />
          <path
            d={CHART}
            fill="none"
            stroke={C.glow}
            strokeWidth={6}
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={draw}
          />
        </svg>
      </div>
      {rows.map((r) => (
        <div
          key={r.label}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "26px 28px",
            borderRadius: 22,
            backgroundColor: "rgba(255,255,255,0.04)",
            opacity: interpolate(frame, [r.at, r.at + 10], [0, 1], clamp),
            translate: `${interpolate(frame, [r.at, r.at + 16], [50, 0], { ...clamp, easing: EASE })}px 0px`,
          }}
        >
          <div style={{ fontSize: 36, fontWeight: 700 }}>{r.label}</div>
          <div style={{ fontFamily: MONO, fontSize: 24, color: C.green }}>{r.status}</div>
        </div>
      ))}
    </div>
  );
};
