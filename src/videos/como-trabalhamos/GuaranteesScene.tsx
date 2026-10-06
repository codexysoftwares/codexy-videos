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
import { C, EASE, SANS, clamp } from "../../shared/theme";

const icon = (d: string) => (
  <svg width={52} height={52} viewBox="0 0 24 24" fill="none" stroke={C.white} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const ITEMS = [
  {
    title: "Prazo ágil",
    text: "Entregas rápidas, em etapas curtas.",
    icon: icon("M13 2 L4 14 H12 L11 22 L20 10 H12 Z"),
  },
  {
    title: "Garantia",
    text: "Garantia sobre tudo o que entregamos.",
    icon: icon("M12 2 L20 5 V11 C20 16 16.5 20 12 22 C7.5 20 4 16 4 11 V5 Z M8.5 12 L11 14.5 L15.5 10"),
  },
  {
    title: "Suporte contínuo",
    text: "Seguimos com você depois da entrega.",
    icon: icon("M4 14 V12 A8 8 0 0 1 20 12 V14 M4 14 H7 V19 H5 A1 1 0 0 1 4 18 Z M20 14 H17 V19 H19 A1 1 0 0 0 20 18 Z"),
  },
];

// Narrated frames follow 06-garantias.wav (placed at frame 6): items are spoken first, then the titles.
const TIMING = {
  silent: { titles: [4, 14], items: [36, 48, 60] },
  narrated: { titles: [93, 125], items: [8, 41, 66] },
} as const;

export const GuaranteesScene: React.FC<{ readonly narrated?: boolean }> = ({
  narrated = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = narrated ? TIMING.narrated : TIMING.silent;

  return (
    <AbsoluteFill style={{ fontFamily: SANS, color: C.white }}>
      <Background tone="dark" />
      {narrated ? (
        <Sequence from={6} premountFor={fps}>
          <Audio src={staticFile("narracao/como-trabalhamos/06-garantias.wav")} />
        </Sequence>
      ) : null}
      <AbsoluteFill style={{ padding: "0 80px", paddingTop: 360 }}>
        {["Sem surpresa.", "Sem caixa-preta."].map((line, i) => {
          const at = t.titles[i];
          return (
            <div
              key={line}
              style={{
                fontSize: 112,
                fontWeight: 800,
                letterSpacing: -4,
                lineHeight: 1.06,
                color: i === 1 ? C.glow : C.white,
                textShadow: i === 1 ? "0 0 50px rgba(51,119,255,0.55)" : "none",
                opacity: interpolate(frame, [at, at + 10], [0, 1], clamp),
                translate: `0px ${interpolate(frame, [at, at + 22], [50, 0], { ...clamp, easing: EASE })}px`,
              }}
            >
              {line}
            </div>
          );
        })}

        <div style={{ marginTop: 100, display: "flex", flexDirection: "column", gap: 28 }}>
          {ITEMS.map((it, i) => {
            const at = t.items[i];
            return (
              <div
                key={it.title}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 34,
                  padding: "34px 36px",
                  borderRadius: 32,
                  backgroundColor: "rgba(255,255,255,0.04)",
                  border: "2px solid rgba(51,119,255,0.25)",
                  opacity: interpolate(frame, [at, at + 10], [0, 1], clamp),
                  translate: `0px ${interpolate(frame, [at, at + 20], [50, 0], { ...clamp, easing: EASE })}px`,
                }}
              >
                <div
                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: 28,
                    flexShrink: 0,
                    background: `linear-gradient(135deg, ${C.glow}, ${C.blue})`,
                    boxShadow: "0 12px 40px rgba(0,85,255,0.45)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {it.icon}
                </div>
                <div>
                  <div style={{ fontSize: 50, fontWeight: 800 }}>{it.title}</div>
                  <div style={{ fontSize: 34, fontWeight: 500, color: C.muted, marginTop: 4 }}>{it.text}</div>
                </div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
