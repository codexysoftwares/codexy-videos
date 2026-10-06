import { Easing, interpolate, useCurrentFrame } from "remotion";
import { Panel, PillarLayout } from "../components/PillarLayout";
import { C, EASE, MONO, clamp } from "../theme";

const BARS = [38, 52, 44, 66, 58, 80, 96];
const TASKS = [
  "Pedido aprovado automaticamente",
  "Nota fiscal emitida",
  "Estoque atualizado",
];

const countUp = (frame: number, to: number) =>
  Math.round(
    interpolate(frame, [20, 70], [0, to], {
      ...clamp,
      easing: Easing.out(Easing.cubic),
    }),
  );

const Dashboard: React.FC = () => {
  const frame = useCurrentFrame();
  const pending = Math.round(
    interpolate(frame, [20, 75], [37, 0], {
      ...clamp,
      easing: Easing.inOut(Easing.cubic),
    }),
  );

  const kpis = [
    { label: "Pedidos hoje", value: countUp(frame, 1284).toLocaleString("pt-BR"), color: C.white },
    { label: "No prazo", value: `${countUp(frame, 98)}%`, color: C.green },
    { label: "Pendências", value: String(pending), color: pending === 0 ? C.green : "#F5A524" },
  ];

  return (
    <Panel style={{ padding: 48, display: "flex", flexDirection: "column", gap: 36 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: 44, fontWeight: 800 }}>Painel Operacional</div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            fontFamily: MONO,
            fontSize: 24,
            color: C.green,
            letterSpacing: 2,
          }}
        >
          <div
            style={{
              width: 16,
              height: 16,
              borderRadius: 8,
              backgroundColor: C.green,
              opacity: 0.5 + Math.sin(frame / 4) * 0.5,
              boxShadow: `0 0 16px ${C.green}`,
            }}
          />
          AO VIVO
        </div>
      </div>

      <div style={{ display: "flex", gap: 22 }}>
        {kpis.map((k) => (
          <div
            key={k.label}
            style={{
              flex: 1,
              padding: "26px 26px",
              borderRadius: 26,
              backgroundColor: "rgba(255,255,255,0.04)",
              border: "2px solid rgba(255,255,255,0.07)",
            }}
          >
            <div style={{ fontSize: 26, color: C.muted, fontWeight: 500 }}>{k.label}</div>
            <div
              style={{
                fontSize: 64,
                fontWeight: 800,
                color: k.color,
                fontVariantNumeric: "tabular-nums",
                marginTop: 6,
              }}
            >
              {k.value}
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          height: 300,
          display: "flex",
          alignItems: "flex-end",
          gap: 22,
          padding: "0 6px",
          borderBottom: "2px solid rgba(255,255,255,0.08)",
        }}
      >
        {BARS.map((h, i) => {
          const start = 18 + i * 4;
          const last = i === BARS.length - 1;
          return (
            <div
              key={i}
              style={{
                flex: 1,
                height: `${h}%`,
                borderRadius: "16px 16px 6px 6px",
                background: last
                  ? `linear-gradient(180deg, ${C.glow}, ${C.blue})`
                  : "rgba(51,119,255,0.32)",
                boxShadow: last ? "0 0 40px rgba(0,85,255,0.7)" : "none",
                transformOrigin: "bottom center",
                scale: `1 ${interpolate(frame, [start, start + 18], [0, 1], { ...clamp, easing: EASE })}`,
              }}
            />
          );
        })}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        {TASKS.map((t, i) => {
          const start = 40 + i * 12;
          const check = interpolate(frame, [start + 6, start + 14], [0, 1], { ...clamp, easing: EASE });
          return (
            <div
              key={t}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 24,
                padding: "22px 26px",
                borderRadius: 22,
                backgroundColor: "rgba(255,255,255,0.04)",
                fontSize: 36,
                fontWeight: 700,
                opacity: interpolate(frame, [start, start + 8], [0, 1], clamp),
                translate: `${interpolate(frame, [start, start + 14], [60, 0], { ...clamp, easing: EASE })}px 0px`,
              }}
            >
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 26,
                  backgroundColor: C.green,
                  color: C.deep,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 32,
                  fontWeight: 800,
                  scale: check,
                  boxShadow: `0 0 24px rgba(33,208,122,${0.6 * check})`,
                }}
              >
                ✓
              </div>
              {t}
            </div>
          );
        })}
      </div>
    </Panel>
  );
};

export const SystemsScene: React.FC = () => (
  <PillarLayout
    index="01"
    tag="SISTEMAS SOB MEDIDA"
    title={"Seu processo,\ndo seu jeito."}
    subtitle="Sistemas que automatizam o operacional da sua empresa."
  >
    <Dashboard />
  </PillarLayout>
);
