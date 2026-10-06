import { Audio } from "@remotion/media";
import {
  AbsoluteFill,
  Sequence,
  interpolate,
  interpolateColors,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { C, EASE, EASE_IN_OUT, MONO, SANS, SFX, clamp } from "../../shared/theme";

export const MOMENT_LEN = 105;
const START_MIN = 18 * 60;
const ROLL = 24;
const USER_AT = 28;
const TYPING_AT = 38;
const BOT_AT = 54;
const RESULT_AT = 70;
const EXIT = 12;

export const MOMENTS = [
  {
    minutes: 23 * 60 + 12,
    label: "Tarde da noite",
    user: "Vocês abrem amanhã cedo? Queria marcar um horário.",
    bot: "Abrimos às 8h! Tenho 8h30 ou 10h livres. Qual prefere?",
    result: "Horário agendado",
  },
  {
    minutes: 24 * 60 + 2 * 60 + 47,
    label: "Madrugada",
    user: "Vocês entregam no Santo Agostinho?",
    bot: "Entregamos sim! Seu pedido chega amanhã até as 14h.",
    result: "Pedido registrado",
  },
  {
    minutes: 24 * 60 + 6 * 60 + 30,
    label: "Antes de abrir",
    user: "Preciso da 2ª via do boleto.",
    bot: "Aqui está! O vencimento é dia 10.",
    attachment: "boleto-outubro.pdf",
    result: "2ª via enviada",
  },
  {
    minutes: 24 * 60 + 12 * 60 + 15,
    label: "Horário de almoço",
    user: "Quero um orçamento para 50 unidades.",
    bot: "Perfeito! Já encaminhei para o comercial, que te retorna ainda hoje.",
    result: "Lead enviado ao comercial",
  },
] as const;

type Moment = (typeof MOMENTS)[number];

export const formatTime = (minutes: number) => {
  const m = Math.floor(minutes) % (24 * 60);
  return `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
};

const minutesAt = (frame: number) => {
  const i = Math.min(MOMENTS.length - 1, Math.floor(frame / MOMENT_LEN));
  const from = i === 0 ? START_MIN : MOMENTS[i - 1].minutes;
  return interpolate(frame - i * MOMENT_LEN, [0, ROLL], [from, MOMENTS[i].minutes], {
    ...clamp,
    easing: EASE_IN_OUT,
  });
};

const Sky: React.FC<{ hour: number }> = ({ hour }) => {
  const frame = useCurrentFrame();
  const base = interpolateColors(
    hour,
    [0, 4.5, 6.5, 9, 12.5, 17, 19.5, 24],
    ["#00081A", "#00081A", "#1A1636", "#06275C", "#0A3A8F", "#06306F", "#0F1A44", "#00081A"],
  );

  return (
    <AbsoluteFill style={{ backgroundColor: base, overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px)",
          backgroundSize: "90px 90px",
          backgroundPosition: `0px ${frame * 0.6}px`,
          maskImage: "radial-gradient(ellipse at 50% 40%, black 20%, transparent 70%)",
          WebkitMaskImage: "radial-gradient(ellipse at 50% 40%, black 20%, transparent 70%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: -300,
          top: -500,
          width: 1700,
          height: 1300,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,150,90,0.55), transparent 65%)",
          opacity: interpolate(hour, [4.5, 6.5, 9], [0, 1, 0], clamp),
        }}
      />
      <div
        style={{
          position: "absolute",
          left: -260,
          top: -460,
          width: 1600,
          height: 1300,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(51,119,255,0.45), transparent 65%)",
          opacity: interpolate(hour, [0, 6, 12.5, 24], [0.5, 0.4, 1, 0.5], clamp),
        }}
      />
      <AbsoluteFill
        style={{
          background: "radial-gradient(ellipse at 50% 50%, transparent 55%, rgba(0,0,0,0.55))",
        }}
      />
    </AbsoluteFill>
  );
};

const SunMoon: React.FC<{ hour: number }> = ({ hour }) => {
  const day = interpolate(hour, [5.5, 7, 17.5, 19], [0, 1, 1, 0], clamp);
  return (
    <div style={{ position: "relative", width: 44, height: 44 }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 22,
          backgroundColor: "#FFC46B",
          boxShadow: "0 0 30px rgba(255,196,107,0.8)",
          opacity: day,
          scale: 0.6 + 0.4 * day,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 22,
          boxShadow: `inset -12px -6px 0 0 ${C.ice}`,
          rotate: "-20deg",
          opacity: 1 - day,
        }}
      />
    </div>
  );
};

const Bubble: React.FC<{
  readonly side: "user" | "bot";
  readonly at: number;
  readonly children: React.ReactNode;
}> = ({ side, at, children }) => {
  const frame = useCurrentFrame();
  if (frame < at) return null;
  const user = side === "user";

  return (
    <div
      style={{
        alignSelf: user ? "flex-end" : "flex-start",
        maxWidth: "82%",
        padding: "28px 34px",
        borderRadius: user ? "34px 34px 10px 34px" : "34px 34px 34px 10px",
        backgroundColor: user ? "rgba(255,255,255,0.12)" : C.blue,
        boxShadow: user ? "none" : "0 16px 50px rgba(0,85,255,0.4)",
        fontSize: 40,
        fontWeight: 600,
        lineHeight: 1.32,
        transformOrigin: user ? "right bottom" : "left bottom",
        opacity: interpolate(frame, [at, at + 8], [0, 1], clamp),
        scale: interpolate(frame, [at, at + 14], [0.85, 1], { ...clamp, easing: EASE }),
        translate: `0px ${interpolate(frame, [at, at + 14], [24, 0], { ...clamp, easing: EASE })}px`,
      }}
    >
      {children}
    </div>
  );
};

const Typing: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame < TYPING_AT || frame >= BOT_AT) return null;
  return (
    <div
      style={{
        alignSelf: "flex-start",
        display: "flex",
        gap: 12,
        padding: "30px 34px",
        borderRadius: "34px 34px 34px 10px",
        backgroundColor: "rgba(51,119,255,0.28)",
      }}
    >
      {[0, 1, 2].map((d) => {
        const wave = Math.max(0, Math.sin((frame - TYPING_AT) / 3.2 - d * 0.9));
        return (
          <div
            key={d}
            style={{
              width: 16,
              height: 16,
              borderRadius: 8,
              backgroundColor: C.ice,
              opacity: 0.35 + 0.65 * wave,
              translate: `0px ${-6 * wave}px`,
            }}
          />
        );
      })}
    </div>
  );
};

const Conversation: React.FC<{ readonly moment: Moment; readonly last: boolean }> = ({
  moment,
  last,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const exit = last
    ? 0
    : interpolate(frame, [MOMENT_LEN, MOMENT_LEN + EXIT], [0, 1], { ...clamp, easing: EASE_IN_OUT });

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        gap: 26,
        padding: "0 40px 44px",
        opacity: 1 - exit,
        translate: `0px ${-90 * exit}px`,
      }}
    >
      <Sequence from={USER_AT} durationInFrames={20} premountFor={fps}>
        <Audio src={staticFile(SFX.softBubble)} volume={0.35} />
      </Sequence>
      <Sequence from={BOT_AT} durationInFrames={20} premountFor={fps}>
        <Audio src={staticFile(SFX.softBubble)} volume={0.35} playbackRate={0.85} />
      </Sequence>
      <Bubble side="user" at={USER_AT}>
        {moment.user}
      </Bubble>
      <Typing />
      <Bubble side="bot" at={BOT_AT}>
        {moment.bot}
        {"attachment" in moment ? (
          <div
            style={{
              marginTop: 20,
              display: "flex",
              alignItems: "center",
              gap: 18,
              padding: "18px 22px",
              borderRadius: 20,
              backgroundColor: "rgba(0,10,31,0.35)",
              fontFamily: MONO,
              fontSize: 28,
              fontWeight: 400,
            }}
          >
            <div
              style={{
                width: 48,
                height: 58,
                borderRadius: 8,
                backgroundColor: C.white,
                color: C.blue,
                fontFamily: SANS,
                fontSize: 16,
                fontWeight: 800,
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "center",
                paddingBottom: 8,
              }}
            >
              PDF
            </div>
            {moment.attachment}
          </div>
        ) : null}
      </Bubble>
    </div>
  );
};

const Result: React.FC<{ readonly moment: Moment; readonly last: boolean }> = ({
  moment,
  last,
}) => {
  const frame = useCurrentFrame();
  const enter = interpolate(frame, [RESULT_AT, RESULT_AT + 16], [0, 1], { ...clamp, easing: EASE });
  const exit = last ? 0 : interpolate(frame, [MOMENT_LEN, MOMENT_LEN + EXIT], [0, 1], clamp);

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        opacity: enter * (1 - exit),
        translate: `0px ${interpolate(enter, [0, 1], [24, 0])}px`,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 20,
          padding: "22px 36px",
          borderRadius: 999,
          backgroundColor: "rgba(255,255,255,0.08)",
          border: "2px solid rgba(255,255,255,0.14)",
          fontSize: 40,
          fontWeight: 700,
        }}
      >
        <svg width={40} height={40} viewBox="0 0 24 24" fill="none">
          <circle cx={12} cy={12} r={11} fill={C.blue} />
          <path
            d="M7 12.5 L10.5 16 L17 9"
            stroke={C.white}
            strokeWidth={2.4}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={16}
            strokeDashoffset={interpolate(frame, [RESULT_AT + 4, RESULT_AT + 16], [16, 0], clamp)}
          />
        </svg>
        {moment.result}
      </div>
    </div>
  );
};

export const TimelineScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const minutes = minutesAt(frame);
  const hour = (minutes % (24 * 60)) / 60;
  const i = Math.min(MOMENTS.length - 1, Math.floor(frame / MOMENT_LEN));
  const local = frame - i * MOMENT_LEN;
  const rolling = interpolate(local, [0, 6, ROLL - 6, ROLL], [0, 1, 1, 0], clamp);

  return (
    <AbsoluteFill style={{ fontFamily: SANS, color: C.white }}>
      <Sky hour={hour} />

      {MOMENTS.map((m, mi) =>
        [3, 7, 11, 15, 19].map((t) => (
          <Sequence
            key={`${m.minutes}-${t}`}
            from={mi * MOMENT_LEN + t}
            durationInFrames={6}
            premountFor={fps}
          >
            <Audio src={staticFile(SFX.softTick)} volume={0.22} />
          </Sequence>
        )),
      )}

      <div
        style={{
          position: "absolute",
          top: 200,
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          opacity: interpolate(frame, [12, 26], [0, 1], clamp),
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
            padding: "14px 30px 14px 22px",
            borderRadius: 999,
            backgroundColor: "rgba(255,255,255,0.07)",
            border: "2px solid rgba(255,255,255,0.10)",
            fontFamily: MONO,
            fontSize: 30,
            letterSpacing: 3,
            color: C.ice,
          }}
        >
          <SunMoon hour={hour} />
          <span
            style={{
              opacity: interpolate(local, [ROLL - 8, ROLL], [0.35, 1], clamp),
            }}
          >
            {MOMENTS[i].label.toUpperCase()}
          </span>
        </div>
        <div
          style={{
            marginTop: 16,
            fontFamily: MONO,
            fontSize: 210,
            fontWeight: 600,
            letterSpacing: -6,
            lineHeight: 1.05,
            fontVariantNumeric: "tabular-nums",
            textShadow: "0 0 60px rgba(51,119,255,0.45)",
            filter: `blur(${rolling * 2.5}px)`,
            scale: 1 - rolling * 0.04,
          }}
        >
          {formatTime(minutes)}
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          top: 640,
          left: 80,
          width: 920,
          height: 740,
          borderRadius: 48,
          backgroundColor: "rgba(4,14,40,0.72)",
          border: "2px solid rgba(51,119,255,0.3)",
          boxShadow: "0 40px 120px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)",
          overflow: "hidden",
          opacity: interpolate(frame, [14, 28], [0, 1], clamp),
          translate: `0px ${interpolate(frame, [14, 38], [80, 0], { ...clamp, easing: EASE })}px`,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 22,
            padding: "30px 36px",
            borderBottom: "2px solid rgba(255,255,255,0.07)",
            backgroundColor: "rgba(255,255,255,0.03)",
          }}
        >
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 36,
              background: `linear-gradient(135deg, ${C.glow}, ${C.blue})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 32,
              fontWeight: 800,
            }}
          >
            IA
          </div>
          <div>
            <div style={{ fontSize: 36, fontWeight: 800 }}>Atendimento · Sua Empresa</div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 26, color: C.green }}>
              <div style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: C.green }} />
              online agora
            </div>
          </div>
        </div>
        <div style={{ position: "absolute", top: 134, left: 0, right: 0, bottom: 0 }}>
          {MOMENTS.map((m, mi) => (
            <Sequence
              key={m.minutes}
              from={mi * MOMENT_LEN}
              durationInFrames={mi === MOMENTS.length - 1 ? undefined : MOMENT_LEN + EXIT}
              layout="none"
            >
              <Conversation moment={m} last={mi === MOMENTS.length - 1} />
            </Sequence>
          ))}
        </div>
      </div>

      <div style={{ position: "absolute", top: 1430, left: 0, right: 0 }}>
        {MOMENTS.map((m, mi) => (
          <Sequence
            key={m.minutes}
            from={mi * MOMENT_LEN}
            durationInFrames={mi === MOMENTS.length - 1 ? undefined : MOMENT_LEN + EXIT}
            layout="none"
          >
            <Result moment={m} last={mi === MOMENTS.length - 1} />
          </Sequence>
        ))}
      </div>
    </AbsoluteFill>
  );
};
