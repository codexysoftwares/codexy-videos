import { Audio } from "@remotion/media";
import { AbsoluteFill, Easing, Img, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Grain } from "../../shared/components/Grain";
import { C, MONO, SANS, SFX } from "../../shared/theme";
import { Objection, Organized, PhoneStory, Reception, Turn, statusFor } from "./Scenes";
import { CTA_WORDS, FPS, HOOK_WORDS, LABELS, MUSIC, MUSICA, N, NARRACAO, T, VIRADA_WORDS, clockMinutes, f, hhmm, type Word } from "./timeline";
import { IconChat, IconMoon, IconSun, Q, at, life, lin } from "./Ui";

const SpokenWords = ({ t, words, size, color, accent, top, from, to }: { t: number; words: Word[]; size: number; color: string; accent: string; top: number; from: number; to: number }) => {
  const o = Math.min(at(t, [from, from + 0.1], [0, 1]), at(t, [to - 0.2, to], [1, 0], Easing.in(Easing.cubic)));
  if (o <= 0) return null;
  return (
    <div style={{ position: "absolute", top, left: 70, right: 70, display: "flex", flexWrap: "wrap", justifyContent: "center", columnGap: size * 0.26, fontFamily: SANS, fontWeight: 800, fontSize: size, lineHeight: 1.08, letterSpacing: -size * 0.03, color, opacity: o, textAlign: "center" }}>
      {words.map((w, i) => {
        if (w.w === "|") return <div key={i} style={{ flexBasis: "100%", height: 0 }} />;
        const p = at(t, [w.at - 0.04, w.at + 0.16], [0, 1]);
        return (
          <span key={i} style={{ display: "inline-block", opacity: p, translate: `0px ${(1 - p) * 26}px`, filter: `blur(${(1 - p) * 10}px)`, color: w.accent ? accent : color, textShadow: w.accent ? `0 0 40px ${accent}66` : "none" }}>
            {w.w}
          </span>
        );
      })}
    </div>
  );
};

const Label = ({ t, text, from, to, tone, dark }: { t: number; text: string; from: number; to: number; tone: "bad" | "good"; dark: boolean }) => {
  const o = life(t, from, to, 0.14);
  if (o <= 0) return null;
  const bad = tone === "bad";
  return (
    <div style={{ position: "absolute", top: 1440, left: 70, right: 70, display: "flex", justifyContent: "center", opacity: o, translate: `0px ${(1 - o) * 24}px` }}>
      <div
        style={{
          fontFamily: SANS,
          fontWeight: 800,
          fontSize: 60,
          letterSpacing: -2,
          lineHeight: 1.1,
          textAlign: "center",
          color: dark ? "#F1F5FF" : Q.ink,
          padding: "16px 32px",
          borderRadius: 22,
          background: bad ? "rgba(255,59,92,0.16)" : dark ? "rgba(20,199,154,0.16)" : "rgba(20,199,154,0.12)",
          borderLeft: `10px solid ${bad ? Q.red : Q.mint}`,
        }}
      >
        {text}
      </div>
    </div>
  );
};

const Hud = ({ t }: { t: number }) => {
  const o = Math.min(at(t, [2.95, 3.35], [0, 1]), at(t, [T.cta - 0.1, T.cta + 0.25], [1, 0]));
  if (o <= 0) return null;
  const s = statusFor(t);
  const spin = t > T.virada && t < T.orb ? 3 : 0;
  const lightBg = t >= T.drop && t < T.cta;
  const ink = lightBg ? Q.ink : "#E8EEFF";
  return (
    <div style={{ position: "absolute", top: 96, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", opacity: o, fontFamily: MONO, color: ink }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        {s.night ? <IconMoon size={34} color={lightBg ? Q.blue : ink} /> : <IconSun size={34} color={Q.amber} />}
        <span style={{ fontSize: 26, letterSpacing: 6, opacity: 0.7 }}>CLÍNICA</span>
        <span style={{ fontSize: 24, letterSpacing: 3, padding: "4px 14px", borderRadius: 999, background: s.color, color: "#fff" }}>{s.label}</span>
      </div>
      <div style={{ fontSize: 112, fontWeight: 600, lineHeight: 1.05, fontVariantNumeric: "tabular-nums", filter: `blur(${spin}px)` }}>{hhmm(clockMinutes(t))}</div>
      {s.online ? (
        <div style={{ marginTop: 2, display: "flex", alignItems: "center", gap: 10, fontSize: 24, letterSpacing: 3, color: Q.mint, opacity: at(t, [T.drop, T.drop + 0.3], [0, 1]) }}>
          <span style={{ width: 12, height: 12, borderRadius: 6, background: Q.mint, boxShadow: `0 0 12px ${Q.mint}` }} />
          ATENDIMENTO 24H ONLINE
        </div>
      ) : null}
    </div>
  );
};

// Faint moving network behind the CTA — the "everything connected" motif.
const NODES = [
  [140, 300], [420, 210], [760, 330], [960, 520], [880, 900], [600, 760], [260, 640], [120, 1100], [420, 1280], [780, 1400], [980, 1220], [560, 1650], [220, 1600],
];
const EDGES = [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 0], [6, 7], [7, 8], [8, 9], [9, 10], [10, 4], [8, 11], [11, 12], [12, 7], [5, 8], [2, 5]];

const Network = ({ t }: { t: number }) => {
  const pos = NODES.map(([x, y], i) => [x + Math.sin(t * 0.6 + i) * 18, y + Math.cos(t * 0.5 + i * 1.3) * 18]);
  return (
    <svg style={{ position: "absolute", inset: 0, width: 1080, height: 1920 }}>
      {EDGES.map(([a, b], i) => {
        const u = (t * 0.45 + i * 0.37) % 1;
        return (
          <g key={i}>
            <line x1={pos[a][0]} y1={pos[a][1]} x2={pos[b][0]} y2={pos[b][1]} stroke={C.glow} strokeOpacity={0.16} strokeWidth={2} />
            <circle cx={pos[a][0] + (pos[b][0] - pos[a][0]) * u} cy={pos[a][1] + (pos[b][1] - pos[a][1]) * u} r={4} fill={C.glow} opacity={0.6 * Math.sin(Math.PI * u)} />
          </g>
        );
      })}
      {pos.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={7} fill={C.glow} opacity={0.35} />
      ))}
    </svg>
  );
};

const Cta = ({ t }: { t: number }) => {
  if (t < T.cta) return null;
  const inP = at(t, [T.cta, T.cta + 0.45], [0, 1]);
  const logo = at(t, [T.ctaLogo, T.ctaLogo + 0.3], [0, 1]);
  const pill = at(t, [T.ctaChama - 0.05, T.ctaChama + 0.3], [0, 1], Easing.out(Easing.back(1.8)));
  const hot = at(t, [T.ctaWhats, T.ctaWhats + 0.2], [0, 1]);
  return (
    <AbsoluteFill style={{ opacity: inP, background: `radial-gradient(ellipse at 50% 40%, #0A2A6E 0%, ${C.navy} 55%, ${C.deep} 100%)` }}>
      <Network t={t} />
      <SpokenWords t={t} words={CTA_WORDS} size={100} color="#FFFFFF" accent={C.glow} top={440} from={T.cta} to={99} />
      <div style={{ position: "absolute", top: 930, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: logo, translate: `0px ${(1 - logo) * 30}px` }}>
        <Img src={staticFile("brand/codexy-logo-light.png")} style={{ width: 540 }} />
      </div>
      <div style={{ position: "absolute", top: 1130, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 22,
            padding: "30px 46px",
            borderRadius: 999,
            background: Q.whats,
            color: "#05210F",
            fontFamily: SANS,
            fontWeight: 800,
            fontSize: 52,
            letterSpacing: -1,
            opacity: Math.min(1, pill * 1.4),
            scale: `${0.7 + pill * 0.3 + hot * Math.sin(Math.min(1, (t - T.ctaWhats) / 0.4) * Math.PI) * 0.06}`,
            boxShadow: `0 0 ${40 + hot * 50}px rgba(37,211,102,${0.25 + hot * 0.3})`,
          }}
        >
          <IconChat size={56} color="#05210F" />
          Diagnóstico gratuito
        </div>
        <div style={{ fontFamily: MONO, fontSize: 36, color: C.ice, letterSpacing: 2, opacity: at(t, [T.ctaWhats, T.ctaWhats + 0.3], [0, 0.85]) }}>no WhatsApp · @codexy.ai</div>
      </div>
    </AbsoluteFill>
  );
};

const at0 = (s: number) => Math.max(0, f(s));

export const Clinica24h: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / FPS;

  const light = t >= T.drop && t < T.cta;
  const dawn = at(t, [T.manha - 0.2, T.manha + 0.5], [0, 1]) * at(t, [T.virada, T.virada + 0.5], [1, 0]);
  const flash = at(t, [T.drop - 0.06, T.drop, T.drop + 0.4], [0, 1, 0]);
  const dark = !light;

  return (
    <AbsoluteFill style={{ background: light ? Q.day : Q.night, overflow: "hidden" }}>
      {dark ? (
        <>
          <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 30%, ${Q.night2} 0%, ${Q.night} 70%)` }} />
          {dawn > 0 ? <AbsoluteFill style={{ background: "radial-gradient(ellipse at 15% 0%, rgba(255,170,80,0.45) 0%, transparent 60%)", opacity: dawn }} /> : null}
          {/* stars */}
          {Array.from({ length: 26 }).map((_, i) => (
            <div key={i} style={{ position: "absolute", left: (i * 397) % 1080, top: (i * 233) % 1500, width: 4, height: 4, borderRadius: 2, background: "#B9C8F0", opacity: (0.15 + 0.35 * Math.abs(Math.sin(t * 1.5 + i))) * (1 - dawn) }} />
          ))}
        </>
      ) : (
        <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 15%, #FFFFFF 0%, rgba(255,255,255,0) 60%)" }} />
      )}

      <Reception t={t} />
      <PhoneStory t={t} />
      <Turn t={t} />
      <Organized t={t} />
      <Objection t={t} />
      <Hud t={t} />

      <SpokenWords t={t} words={HOOK_WORDS} size={84} color="#F1F5FF" accent={Q.glow} top={600} from={0} to={3.1} />
      <SpokenWords t={t} words={VIRADA_WORDS} size={92} color="#F1F5FF" accent={Q.glow} top={1110} from={T.orb} to={T.drop + 0.1} />
      {LABELS.map((l) => (
        <Label key={l.text} t={t} {...l} dark={!(t >= T.drop && t < T.cta)} />
      ))}

      {flash > 0 ? <AbsoluteFill style={{ background: "#FFFFFF", opacity: flash * 0.9 }} /> : null}
      <Cta t={t} />
      <Grain vignette={dark} amount={dark ? 0.09 : 0.04} />

      {/* ---------------- sound ---------------- */}
      {MUSIC.map((m, i) => {
        const len = m.trackTo - m.trackFrom;
        return (
          <Sequence key={`mus-${i}`} from={at0(m.from)} durationInFrames={f(len)} premountFor={fps}>
            <Audio
              src={staticFile(MUSICA)}
              trimBefore={f(m.trackFrom)}
              volume={(fr) => {
                const s = fr / FPS;
                const fin = m.fadeIn ? lin(s, [0, m.fadeIn], [0, 1]) : 1;
                const fout = lin(s, [len - m.fadeOut, len], [1, 0]);
                const vt = m.from + s; // video time
                const turnDip = vt > T.virada && vt < T.drop ? 0.75 : 1;
                return 0.95 * fin * fout * turnDip;
              }}
            />
          </Sequence>
        );
      })}
      {N.map((n) => (
        <Sequence key={n.file} from={at0(n.at)} premountFor={fps}>
          <Audio src={staticFile(`${NARRACAO}/${n.file}`)} />
        </Sequence>
      ))}
      {[T.m1, T.m2, T.m3, T.m4, T.m5, T.m6, T.m7].map((s, i) => (
        <Sequence key={`buzz-${i}`} from={at0(s)} premountFor={fps}>
          <Audio src={staticFile("sfx/phone-buzz.wav")} volume={0.22} />
        </Sequence>
      ))}
      <Sequence from={at0(T.phoneOn)} premountFor={fps}>
        <Audio src={staticFile("sfx/phone-buzz.wav")} volume={0.3} />
      </Sequence>
      {[T.lamp1, T.lamp2, T.lamp3].map((s, i) => (
        <Sequence key={`lamp-${i}`} from={at0(s)} premountFor={fps}>
          <Audio src={staticFile(SFX.click)} volume={0.35} />
        </Sequence>
      ))}
      {[T.manha - 0.15, T.virada, T.objecao, T.cta - 0.1].map((s, i) => (
        <Sequence key={`wh-${i}`} from={at0(s)} premountFor={fps}>
          <Audio src={staticFile(SFX.softWhoosh)} volume={0.4} />
        </Sequence>
      ))}
      <Sequence from={at0(T.orb)} premountFor={fps}>
        <Audio src={staticFile(SFX.softImpact)} volume={0.45} />
      </Sequence>
      <Sequence from={at0(T.drop - 0.05)} premountFor={fps}>
        <Audio src={staticFile(SFX.softImpact)} volume={0.6} />
      </Sequence>
      {[T.responde + 0.35, T.agenda, T.recepcao + 0.45, T.conecta + 0.25, T.entrega].map((s, i) => (
        <Sequence key={`tick-${i}`} from={at0(s)} premountFor={fps}>
          <Audio src={staticFile(SFX.softTick)} volume={0.4} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
