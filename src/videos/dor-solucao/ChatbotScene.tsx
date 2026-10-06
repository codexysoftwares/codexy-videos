import { Audio } from "@remotion/media";
import {
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Panel, PillarLayout } from "./PillarLayout";
import { C, EASE, MONO, SFX, clamp } from "../../shared/theme";

const MESSAGES = [
  { from: "user", text: "Oi! Vocês atendem amanhã?", at: 16 },
  { from: "bot", text: "Olá! Atendemos sim. Tenho horário às 9h ou às 14h.", at: 36, typing: 26 },
  { from: "user", text: "9h, por favor!", at: 52 },
  { from: "bot", text: "Pronto! Agendado para amanhã às 9h. ✓", at: 72, typing: 60 },
] as const;

const Typing: React.FC<{ start: number; end: number }> = ({ start, end }) => {
  const frame = useCurrentFrame();
  if (frame < start || frame >= end) return null;
  return (
    <div
      style={{
        alignSelf: "flex-start",
        display: "flex",
        gap: 10,
        padding: "26px 30px",
        borderRadius: "32px 32px 32px 8px",
        backgroundColor: "rgba(51,119,255,0.25)",
      }}
    >
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            width: 16,
            height: 16,
            borderRadius: 8,
            backgroundColor: C.ice,
            opacity: 0.4 + 0.6 * Math.max(0, Math.sin((frame - start) / 3 - i * 0.9)),
            translate: `0px ${-6 * Math.max(0, Math.sin((frame - start) / 3 - i * 0.9))}px`,
          }}
        />
      ))}
    </div>
  );
};

const Chat: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <Panel style={{ display: "flex", flexDirection: "column" }}>
      {MESSAGES.map((m) => (
        <Sequence key={m.at} from={m.at} durationInFrames={30} premountFor={fps}>
          <Audio src={staticFile(SFX.pop)} volume={0.3} />
        </Sequence>
      ))}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 22,
          padding: "30px 36px",
          backgroundColor: "rgba(255,255,255,0.04)",
          borderBottom: "2px solid rgba(255,255,255,0.06)",
        }}
      >
        <div
          style={{
            width: 76,
            height: 76,
            borderRadius: 38,
            background: `linear-gradient(135deg, ${C.glow}, ${C.blue})`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 38,
            fontWeight: 800,
          }}
        >
          AI
        </div>
        <div>
          <div style={{ fontSize: 38, fontWeight: 800 }}>Assistente Virtual</div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 26, color: C.green }}>
            <div style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: C.green }} />
            online agora
          </div>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "center", padding: "30px 0 10px" }}>
        <div
          style={{
            padding: "10px 22px",
            borderRadius: 999,
            backgroundColor: "rgba(255,255,255,0.06)",
            fontFamily: MONO,
            fontSize: 24,
            color: C.muted,
            letterSpacing: 1,
            opacity: interpolate(frame, [8, 16], [0, 1], clamp),
          }}
        >
          23:47 · fora do expediente
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 24, padding: "20px 36px" }}>
        {MESSAGES.map((m) => {
          const user = m.from === "user";
          return (
            <div key={m.at} style={{ display: "contents" }}>
              {"typing" in m ? <Typing start={m.typing} end={m.at} /> : null}
              {frame >= m.at ? (
                <div
                  style={{
                    alignSelf: user ? "flex-end" : "flex-start",
                    maxWidth: "80%",
                    padding: "26px 32px",
                    borderRadius: user ? "32px 32px 8px 32px" : "32px 32px 32px 8px",
                    backgroundColor: user ? "rgba(255,255,255,0.10)" : C.blue,
                    boxShadow: user ? "none" : "0 12px 40px rgba(0,85,255,0.45)",
                    fontSize: 36,
                    fontWeight: 600,
                    lineHeight: 1.3,
                    transformOrigin: user ? "right bottom" : "left bottom",
                    scale: interpolate(frame, [m.at, m.at + 10], [0.6, 1], { ...clamp, easing: EASE }),
                    opacity: interpolate(frame, [m.at, m.at + 6], [0, 1], clamp),
                  }}
                >
                  {m.text}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </Panel>
  );
};

export const ChatbotScene: React.FC = () => (
  <PillarLayout
    index="03"
    tag="CHATBOTS COM IA"
    title={"Atendimento 24h,\nsem fila."}
    subtitle="Chatbots inteligentes no WhatsApp e no seu site."
  >
    <Chat />
  </PillarLayout>
);
