import { Audio } from "@remotion/media";
import { AbsoluteFill, Easing, Img, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Grain } from "../../shared/components/Grain";
import { C, MONO, SANS, SFX } from "../../shared/theme";
import { CHAOS_HITS, ChaosScene, NOTIF_TIMES } from "./Caos";
import { OrderScene } from "./Ordem";
import { AGORA_WORDS, CTA_WORDS, FPS, HOOK_WORDS, LABELS, MUSICA, N, NARRACAO, T, chaosMinutes, f, hhmm, orderMinutes } from "./timeline";
import { IconChat, K, at, life, lin } from "./Ui";

type Word = { w: string; at: number; accent?: boolean };

// Words appear exactly when they are spoken.
const SpokenWords = ({ t, words, size, color, accent, top, out }: { t: number; words: Word[]; size: number; color: string; accent: string; top: number; out: number }) => {
  const o = at(t, [out - 0.2, out], [1, 0], Easing.in(Easing.cubic));
  if (o <= 0 || t < words[0].at - 0.1) return null;
  return (
    <div style={{ position: "absolute", top, left: 80, right: 80, display: "flex", flexWrap: "wrap", justifyContent: "center", columnGap: size * 0.26, fontFamily: SANS, fontWeight: 800, fontSize: size, lineHeight: 1.08, letterSpacing: -size * 0.03, color, opacity: o, textAlign: "center" }}>
      {words.map((w, i) => {
        if (w.w === "|") return <div key={i} style={{ flexBasis: "100%", height: 0 }} />;
        const p = at(t, [w.at - 0.04, w.at + 0.16], [0, 1]);
        return (
          <span key={i} style={{ display: "inline-block", opacity: p, translate: `0px ${(1 - p) * 26}px`, filter: `blur(${(1 - p) * 10}px)`, color: w.accent ? accent : color }}>
            {w.w}
          </span>
        );
      })}
    </div>
  );
};

const Label = ({ t, text, from, to, tone }: { t: number; text: string; from: number; to: number; tone: "bad" | "good" }) => {
  const o = life(t, from, to, 0.14);
  if (o <= 0) return null;
  const bad = tone === "bad";
  return (
    <div style={{ position: "absolute", top: 1290, left: 80, right: 80, display: "flex", justifyContent: "center", opacity: o, translate: `0px ${(1 - o) * 24}px` }}>
      <div
        style={{
          fontFamily: SANS,
          fontWeight: 800,
          fontSize: 66,
          letterSpacing: -2,
          lineHeight: 1.1,
          textAlign: "center",
          color: bad ? "#FFF4EC" : K.ink,
          padding: "18px 34px",
          borderRadius: 22,
          background: bad ? "rgba(255,59,92,0.16)" : "rgba(31,164,99,0.12)",
          borderLeft: `10px solid ${bad ? K.red : K.green}`,
        }}
      >
        {text}
      </div>
    </div>
  );
};

const Clock = ({ minutes, night, blur }: { minutes: number; night: boolean; blur: number }) => (
  <div style={{ position: "absolute", top: 120, left: 0, right: 0, textAlign: "center", fontFamily: MONO, color: night ? "#F4ECDD" : K.ink, filter: `blur(${blur}px)` }}>
    <div style={{ fontSize: 30, letterSpacing: 10, opacity: 0.6 }}>SEXTA-FEIRA</div>
    <div style={{ fontSize: 120, fontWeight: 600, lineHeight: 1.05, fontVariantNumeric: "tabular-nums" }}>{hhmm(minutes)}</div>
  </div>
);

const RewindFx = ({ t, frame }: { t: number; frame: number }) => {
  const o = life(t, T.rewind, T.rewindEnd, 0.08);
  if (o <= 0) return null;
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: o }}>
      <AbsoluteFill style={{ background: "repeating-linear-gradient(0deg, rgba(0,0,0,0.25) 0px, rgba(0,0,0,0.25) 2px, transparent 2px, transparent 6px)" }} />
      {[0, 1, 2].map((i) => {
        const y = ((frame * (37 + i * 23) + i * 600) % 2100) - 100;
        return <div key={i} style={{ position: "absolute", left: 0, right: 0, top: y, height: 30 + i * 18, background: "rgba(255,255,255,0.10)", filter: "blur(4px)" }} />;
      })}
      <div style={{ position: "absolute", top: 330, left: 80, fontFamily: MONO, fontSize: 44, color: "#F4ECDD", letterSpacing: 6, opacity: Math.floor(frame / 6) % 2 ? 1 : 0.4 }}>◀◀ REBOBINANDO</div>
    </AbsoluteFill>
  );
};

const Cta = ({ t }: { t: number }) => {
  if (t < T.cta) return null;
  const wipe = at(t, [T.cta, T.cta + 0.4], [1, 0], Easing.inOut(Easing.cubic));
  const logo = at(t, [T.ctaChama, T.ctaChama + 0.3], [0, 1]);
  const pill = at(t, [T.ctaWhats - 0.1, T.ctaWhats + 0.25], [0, 1], Easing.out(Easing.back(1.8)));
  const hot = at(t, [T.ctaDiagnostico, T.ctaDiagnostico + 0.2], [0, 1]);
  return (
    <AbsoluteFill style={{ translate: `0px ${wipe * 1920}px`, background: `radial-gradient(ellipse at 50% 40%, #0A2A6E 0%, ${C.navy} 55%, ${C.deep} 100%)` }}>
      <SpokenWords t={t} words={CTA_WORDS} size={84} color="#FFFFFF" accent={C.glow} top={430} out={99} />
      <div style={{ position: "absolute", top: 850, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: logo, translate: `0px ${(1 - logo) * 30}px` }}>
        <Img src={staticFile("brand/codexy-logo-light.png")} style={{ width: 560 }} />
      </div>
      <div style={{ position: "absolute", top: 1080, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 26 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 22,
            padding: "30px 46px",
            borderRadius: 999,
            background: K.whats,
            color: "#05210F",
            fontFamily: SANS,
            fontWeight: 800,
            fontSize: 52,
            letterSpacing: -1,
            opacity: Math.min(1, pill * 1.4),
            scale: `${0.7 + pill * 0.3 + hot * Math.sin(Math.min(1, (t - T.ctaDiagnostico) / 0.4) * Math.PI) * 0.06}`,
            boxShadow: `0 0 ${40 + hot * 50}px rgba(37,211,102,${0.25 + hot * 0.3})`,
          }}
        >
          <IconChat size={56} color="#05210F" />
          Diagnóstico gratuito
        </div>
        <div style={{ fontFamily: MONO, fontSize: 36, color: C.ice, letterSpacing: 2, opacity: at(t, [T.ctaWhats + 0.2, T.ctaWhats + 0.5], [0, 0.85]) }}>no WhatsApp · @codexy.ai</div>
      </div>
    </AbsoluteFill>
  );
};

const at0 = (s: number) => Math.max(0, f(s));

export const MesmaSexta: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / FPS;

  // Story time for the chaos layer: forward until the rewind, then played backwards to 0.
  const rewindP = lin(t, [T.rewind, T.rewindEnd], [0, 1]);
  const chaosT = t < T.rewind ? t : T.rewind * (1 - Easing.in(Easing.quad)(rewindP));
  const showChaos = t < T.rewindEnd;
  const night = t < T.drop;
  const flash = at(t, [T.drop - 0.05, T.drop, T.drop + 0.35], [0, 1, 0]);

  let minutes: number;
  if (t < T.rewind) minutes = chaosMinutes(t);
  else if (t < T.rewindEnd) minutes = 26 * 60 + 14 - (26 * 60 + 14 - 18 * 60) * Easing.in(Easing.quad)(rewindP);
  else if (t < T.drop) minutes = 18 * 60;
  else minutes = orderMinutes(t);
  const clockBlur = t > T.rewind && t < T.rewindEnd ? 3 : 0;
  const clockOut = at(t, [T.cta, T.cta + 0.3], [1, 0]);

  const red = CHAOS_HITS.reduce((acc, h) => Math.max(acc, t >= h && t < h + 0.35 ? 1 - (t - h) / 0.35 : 0), 0);
  const jitter = t > T.rewind && t < T.rewindEnd ? Math.sin(frame * 2.3) * 14 : 0;

  return (
    <AbsoluteFill style={{ background: night ? K.night : K.cream, overflow: "hidden" }}>
      {/* ambience */}
      {night ? (
        <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 10%, rgba(242,184,61,${t < T.rewindEnd ? 0.16 : 0.06}) 0%, transparent 55%)` }} />
      ) : (
        <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 20%, rgba(255,255,255,0.8) 0%, transparent 60%)" }} />
      )}
      {night && red > 0 ? <AbsoluteFill style={{ boxShadow: `inset 0 0 220px rgba(255,59,92,${red * 0.45})` }} /> : null}

      {showChaos ? (
        <AbsoluteFill style={{ translate: `${jitter}px 0px`, filter: t > T.rewind ? `contrast(1.15) saturate(0.55) blur(${rewindP * 2}px)` : "none" }}>
          <ChaosScene t={chaosT} />
        </AbsoluteFill>
      ) : null}
      {!night ? <OrderScene t={t} /> : null}

      <div style={{ opacity: clockOut }}>
        <Clock minutes={minutes} night={night} blur={clockBlur} />
      </div>

      {/* hook line, then the "agora, a mesma sexta" beat in the dark */}
      <SpokenWords t={t} words={HOOK_WORDS} size={84} color="#FFF4EC" accent={K.amber} top={1270} out={T.hookEnd + 0.15} />
      <SpokenWords t={t} words={AGORA_WORDS} size={118} color="#FFF4EC" accent={K.amber} top={760} out={T.drop + 0.05} />
      {LABELS.map((l) => (
        <Label key={l.text} t={t} {...l} />
      ))}

      <RewindFx t={t} frame={frame} />
      {flash > 0 ? <AbsoluteFill style={{ background: "#FFFFFF", opacity: flash * 0.85 }} /> : null}
      <Cta t={t} />
      <Grain vignette={night} amount={night ? 0.1 : 0.05} />

      {/* ---------------- sound ---------------- */}
      <Audio
        src={staticFile(MUSICA)}
        volume={(fr) => {
          const s = fr / FPS;
          if (s < T.rewind) return 0.5;
          if (s < T.rewind + 0.25) return 0.5 * (1 - (s - T.rewind) / 0.25);
          if (s < T.drop - 0.12) return 0;
          if (s < T.drop) return 0.5 * ((s - (T.drop - 0.12)) / 0.12);
          if (s < 29) return 0.42;
          if (s < 30.3) return 0.55;
          return Math.max(0, 0.55 * (1 - (s - 30.3) / 0.7));
        }}
      />
      {N.map((n) => (
        <Sequence key={n.file} from={at0(n.at)} premountFor={fps}>
          <Audio src={staticFile(`${NARRACAO}/${n.file}`)} />
        </Sequence>
      ))}
      {NOTIF_TIMES.map((s, i) => (
        <Sequence key={`buzz-${i}`} from={at0(s)} premountFor={fps}>
          <Audio src={staticFile("sfx/phone-buzz.wav")} volume={0.32} />
        </Sequence>
      ))}
      {[T.caosReserva, T.caosPedido, T.caosPreco, T.caosCaixa].map((s, i) => (
        <Sequence key={`sw-${i}`} from={at0(s - 0.12)} premountFor={fps}>
          <Audio src={staticFile(SFX.softWhoosh)} volume={0.35} />
        </Sequence>
      ))}
      {Array.from({ length: 11 }).map((_, i) => (
        <Sequence key={`key-${i}`} from={at0(T.caosPedido + 0.7 + i * 0.14)} premountFor={fps}>
          <Audio src={staticFile(SFX.click)} volume={0.18} />
        </Sequence>
      ))}
      <Sequence from={at0(T.caosNaoBate)} premountFor={fps}>
        <Audio src={staticFile(SFX.softImpact)} volume={0.5} />
      </Sequence>
      <Sequence from={at0(T.rewind)} premountFor={fps}>
        <Audio src={staticFile("sfx/rewind.wav")} volume={0.45} />
      </Sequence>
      <Sequence from={at0(T.drop - 0.05)} premountFor={fps}>
        <Audio src={staticFile(SFX.softImpact)} volume={0.7} />
      </Sequence>
      {[T.sozinha, T.cozinha - 0.2, T.umSo, T.batendo].map((s, i) => (
        <Sequence key={`tick-${i}`} from={at0(s)} premountFor={fps}>
          <Audio src={staticFile(SFX.softTick)} volume={0.4} />
        </Sequence>
      ))}
      {[T.ordemPedido, T.ordemPreco, T.ordemCaixa].map((s, i) => (
        <Sequence key={`ow-${i}`} from={at0(s - 0.12)} premountFor={fps}>
          <Audio src={staticFile(SFX.softWhoosh)} volume={0.28} />
        </Sequence>
      ))}
      <Sequence from={at0(T.cta - 0.1)} premountFor={fps}>
        <Audio src={staticFile(SFX.softWhoosh)} volume={0.45} />
      </Sequence>
    </AbsoluteFill>
  );
};
