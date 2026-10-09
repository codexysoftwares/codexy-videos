import { Audio } from "@remotion/media";
import { ThreeCanvas } from "@remotion/three";
import {
  AbsoluteFill,
  Img,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Caption } from "../../shared/components/Caption";
import { Grain } from "../../shared/components/Grain";
import { EASE, MONO, SANS, SFX, clamp } from "../../shared/theme";
import { CUE, HOPS, HOP_LEN, MUSICA, N, NARRACAO, SUBS, f } from "./timeline";
import { BLUE, STATIONS, World, project, stationGlow, stationTop } from "./World";

const INK = "#0E1A33";
const RED = "#E5484D";

const Chip: React.FC<{
  readonly at: number;
  readonly until: number;
  readonly color: string;
  readonly children: React.ReactNode;
}> = ({ at, until, color, children }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ position: "absolute", top: 330, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
      <div
        style={{
          padding: "18px 34px",
          borderRadius: 999,
          backgroundColor: color,
          color: "#FFFFFF",
          fontFamily: MONO,
          fontSize: 32,
          fontWeight: 600,
          letterSpacing: 3,
          boxShadow: `0 16px 40px ${color}55`,
          opacity: interpolate(frame, [f(at), f(at) + 6, f(until) - 6, f(until)], [0, 1, 1, 0], clamp),
          scale: interpolate(frame, [f(at), f(at) + 12], [0.7, 1], { ...clamp, easing: EASE }),
        }}
      >
        {children}
      </div>
    </div>
  );
};

const Counter: React.FC = () => {
  const frame = useCurrentFrame();
  const landed = HOPS.slice(1).filter((h) => frame >= f(h.at + HOP_LEN)).length;
  const reset = frame >= f(CUE.agora);
  const value = frame >= f(CUE.umaVez) ? 1 : reset ? 0 : landed;
  const lastLand = HOPS.slice(1).map((h) => f(h.at + HOP_LEN)).filter((t) => frame >= t).pop() ?? -100;
  const bump = interpolate(frame - (frame >= f(CUE.umaVez) ? f(CUE.umaVez) : lastLand), [0, 4, 12], [1.25, 1.1, 1], clamp);
  const alarm = !reset && frame >= f(CUE.quatro);
  const color = frame >= f(CUE.umaVez) ? BLUE : alarm ? RED : INK;
  return (
    <div
      style={{
        position: "absolute",
        top: 170,
        left: 80,
        display: "flex",
        alignItems: "center",
        gap: 26,
        opacity:
          interpolate(frame, [f(4.4), f(4.4) + 10], [0, 1], clamp) *
          interpolate(frame, [f(CUE.comenta) - 10, f(CUE.comenta)], [1, 0], clamp),
      }}
    >
      <div
        style={{
          width: 130,
          height: 130,
          borderRadius: 30,
          backgroundColor: "#FFFFFF",
          boxShadow: "0 16px 40px rgba(14,26,51,0.12)",
          border: `3px solid ${color}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: SANS,
          fontSize: 86,
          fontWeight: 800,
          color,
          scale: alarm ? 1 + Math.max(0, Math.sin(frame / 3)) * 0.06 : bump,
        }}
      >
        {value}
      </div>
      <div style={{ fontFamily: MONO, fontSize: 28, letterSpacing: 3, color: INK, lineHeight: 1.4 }}>
        {value === 1 ? "DIGITAÇÃO" : "DIGITAÇÕES"}
        <div style={{ fontSize: 22, opacity: 0.55 }}>DO MESMO PEDIDO</div>
      </div>
    </div>
  );
};

const StationLabels: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const show =
    interpolate(frame, [f(3.8), f(3.8) + 12], [0, 1], clamp) *
    interpolate(frame, [f(CUE.comenta) - 10, f(CUE.comenta)], [1, 0], clamp);
  const problem = frame >= f(CUE.ninguem) && frame < f(CUE.agora);
  return (
    <>
      {STATIONS.map((s, i) => {
        const top = stationTop(i);
        const p = project([top[0], top[1] + (i === 4 ? 1.2 : 0.9), top[2]], frame, width, height);
        const x = project([top[0], top[1] + 1.6, top[2]], frame, width, height);
        const xAt = f(CUE.chances) + i * 4;
        const lit = stationGlow(frame, i);
        return (
          <div key={s.label}>
            <div
              style={{
                position: "absolute",
                left: p.x,
                top: p.y,
                translate: "-50% -100%",
                padding: "8px 16px",
                borderRadius: 999,
                backgroundColor: lit > 0.3 ? BLUE : "rgba(255,255,255,0.92)",
                color: lit > 0.3 ? "#FFFFFF" : INK,
                fontFamily: MONO,
                fontSize: 22,
                fontWeight: 600,
                letterSpacing: 2,
                boxShadow: "0 8px 24px rgba(14,26,51,0.15)",
                opacity: show,
                whiteSpace: "nowrap",
              }}
            >
              {s.label}
            </div>
            {i > 0 && frame >= xAt && frame < f(CUE.agora) ? (
              <div
                style={{
                  position: "absolute",
                  left: x.x,
                  top: x.y - 50,
                  translate: "-50% -50%",
                  width: 64,
                  height: 64,
                  borderRadius: 32,
                  backgroundColor: RED,
                  color: "#FFFFFF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: SANS,
                  fontSize: 40,
                  fontWeight: 800,
                  boxShadow: `0 10px 30px ${RED}66`,
                  scale: interpolate(frame, [xAt, xAt + 8], [0, 1], { ...clamp, easing: EASE }),
                }}
              >
                {problem ? "?" : "✕"}
              </div>
            ) : null}
          </div>
        );
      })}
    </>
  );
};

const LivePanel: React.FC = () => {
  const frame = useCurrentFrame();
  const rows = [
    { id: "#1042", status: "Em produção", color: "#F5A524" },
    { id: "#1043", status: "Nota emitida", color: BLUE },
    { id: "#1044", status: "Saiu para entrega", color: "#21B26B" },
  ];
  return (
    <div
      style={{
        position: "absolute",
        top: 330,
        left: 120,
        right: 120,
        padding: "28px 34px",
        borderRadius: 30,
        backgroundColor: "#FFFFFF",
        boxShadow: "0 24px 60px rgba(14,26,51,0.15)",
        fontFamily: SANS,
        color: INK,
        opacity:
          interpolate(frame, [f(CUE.painel), f(CUE.painel) + 10], [0, 1], clamp) *
          interpolate(frame, [f(CUE.comenta) - 10, f(CUE.comenta)], [1, 0], clamp),
        translate: `0px ${interpolate(frame, [f(CUE.painel), f(CUE.painel) + 16], [-40, 0], { ...clamp, easing: EASE })}px`,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 14, fontFamily: MONO, fontSize: 24, letterSpacing: 3, marginBottom: 14 }}>
        <div style={{ width: 14, height: 14, borderRadius: 7, backgroundColor: "#21B26B", opacity: 0.4 + Math.abs(Math.sin(frame / 6)) * 0.6 }} />
        PEDIDOS AO VIVO
      </div>
      {rows.map((r, i) => (
        <div
          key={r.id}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "14px 0",
            borderTop: i ? "2px solid #EEF1F7" : "none",
            fontSize: 34,
            fontWeight: 700,
            opacity: interpolate(frame, [f(CUE.painel) + 8 + i * 5, f(CUE.painel) + 14 + i * 5], [0, 1], clamp),
          }}
        >
          <span style={{ fontFamily: MONO, fontWeight: 600 }}>{r.id}</span>
          <span style={{ padding: "6px 16px", borderRadius: 999, backgroundColor: `${r.color}22`, color: r.color, fontSize: 28 }}>
            {r.status}
          </span>
        </div>
      ))}
    </div>
  );
};

const CommentIcon = () => (
  <svg width={46} height={46} viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth={2} strokeLinejoin="round">
    <path d="M4 5h16v11H9l-5 4z" />
  </svg>
);

const ComentaCard: React.FC = () => {
  const frame = useCurrentFrame();
  const out = interpolate(frame, [f(CUE.logo) - 8, f(CUE.logo)], [1, 0], clamp);
  return (
    <div style={{ opacity: out }}>
      <Caption
        text="Quantas vezes um pedido é *digitado* *aí?*"
        at={f(CUE.comenta)}
        speechFrames={f(2.2)}
        size={82}
        top={170}
        center
        color={INK}
        accent={BLUE}
      />
      <div style={{ position: "absolute", top: 1430, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            padding: "24px 42px",
            borderRadius: 999,
            background: `linear-gradient(135deg, #3377FF, ${BLUE})`,
            color: "#FFFFFF",
            fontFamily: SANS,
            fontSize: 46,
            fontWeight: 800,
            boxShadow: `0 20px 50px ${BLUE}55`,
            opacity: interpolate(frame, [f(CUE.comentaAqui), f(CUE.comentaAqui) + 6], [0, 1], clamp),
            scale: interpolate(frame, [f(CUE.comentaAqui), f(CUE.comentaAqui) + 12], [0.7, 1], { ...clamp, easing: EASE }),
          }}
        >
          <CommentIcon />
          Comenta aqui
        </div>
      </div>
      <Caption
        text="Cada vez é uma *chance* *de* *erro.*"
        at={f(CUE.chance)}
        speechFrames={f(1.6)}
        size={60}
        top={1580}
        center
        color={INK}
        accent={RED}
      />
    </div>
  );
};

const LogoEnd: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const at = f(CUE.logo);
  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#F7F9FD",
        alignItems: "center",
        justifyContent: "center",
        gap: 40,
        opacity: interpolate(frame, [at, at + 14], [0, 1], clamp),
      }}
    >
      <Img
        src={staticFile("brand/codexy-logo.png")}
        style={{
          width: 780,
          opacity: interpolate(frame, [f(CUE.codexy), f(CUE.codexy) + 6], [0, 1], clamp),
          scale: interpolate(frame, [f(CUE.codexy), f(CUE.codexy) + 14], [1.2, 1], { ...clamp, easing: EASE, output: "perceptual-scale" }),
        }}
      />
      <div
        style={{
          fontFamily: SANS,
          fontSize: 62,
          fontWeight: 700,
          color: INK,
          opacity: interpolate(frame, [f(CUE.software), f(CUE.software) + 8], [0, 1], clamp),
        }}
      >
        Software sob <span style={{ color: BLUE }}>medida.</span>
      </div>
      <div
        style={{
          fontFamily: MONO,
          fontSize: 34,
          letterSpacing: 2,
          color: "#5A6585",
          opacity: interpolate(frame, [f(CUE.software) + 12, f(CUE.software) + 22], [0, 1], clamp),
        }}
      >
        codexy.com.br · @codexy.ai
      </div>
      <AbsoluteFill
        style={{
          backgroundColor: "#F7F9FD",
          opacity: interpolate(frame, [durationInFrames - 12, durationInFrames - 1], [0, 1], clamp),
        }}
      />
    </AbsoluteFill>
  );
};

export const VidaDeUmPedido: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height, durationInFrames } = useVideoConfig();
  const gray = interpolate(
    frame,
    [f(CUE.ninguem), f(CUE.ninguem) + 15, f(CUE.agora), f(CUE.agora) + 12],
    [0, 0.85, 0.85, 0],
    clamp,
  );
  const hops = HOPS.slice(1).map((h) => h.at + HOP_LEN);

  return (
    <AbsoluteFill style={{ background: "linear-gradient(180deg, #F7F9FD 0%, #E8EDF6 100%)" }}>
      <Audio
        name="Música"
        src={staticFile(MUSICA)}
        volume={(fr) => interpolate(fr, [0, 8, durationInFrames - f(1), durationInFrames - 1], [0, 0.26, 0.26, 0], clamp)}
        premountFor={fps}
      />
      {N.map((n) => (
        <Sequence key={n.file} name={`Voz ${n.file}`} from={f(n.at)} premountFor={fps}>
          <Audio src={staticFile(`${NARRACAO}/${n.file}`)} />
        </Sequence>
      ))}
      {[HOPS[0].at, ...hops, CUE.umaVez].map((t) => (
        <Sequence key={t} name="SFX pedido" from={f(t)} durationInFrames={15} premountFor={fps}>
          <Audio src={staticFile(SFX.softBubble)} volume={0.45} />
        </Sequence>
      ))}
      <Sequence name="SFX revela" from={f(CUE.reveal)} durationInFrames={25} premountFor={fps}>
        <Audio src={staticFile(SFX.softWhoosh)} volume={0.35} />
      </Sequence>
      <Sequence name="SFX perdido" from={f(CUE.lost)} durationInFrames={25} premountFor={fps}>
        <Audio src={staticFile(SFX.softWhoosh)} volume={0.3} playbackRate={0.7} />
      </Sequence>
      {[1, 2, 3, 4].map((i) => (
        <Sequence key={i} name="SFX erro" from={f(CUE.chances) + i * 4} durationInFrames={6} premountFor={fps}>
          <Audio src={staticFile(SFX.softTick)} volume={0.4} />
        </Sequence>
      ))}
      <Sequence name="SFX caixa" from={f(CUE.caixaBate)} durationInFrames={50} premountFor={fps}>
        <Audio src={staticFile(SFX.softImpact)} volume={0.6} />
      </Sequence>
      <Sequence name="SFX trilhos" from={f(CUE.trilhos) - 4} durationInFrames={40} premountFor={fps}>
        <Audio src={staticFile(SFX.softRiser)} volume={0.35} />
      </Sequence>
      <Sequence name="SFX na hora" from={f(CUE.naHora)} durationInFrames={50} premountFor={fps}>
        <Audio src={staticFile(SFX.softImpact)} volume={0.35} />
      </Sequence>
      <Sequence name="SFX logo" from={f(CUE.codexy)} durationInFrames={50} premountFor={fps}>
        <Audio src={staticFile(SFX.softImpact)} volume={0.5} />
      </Sequence>

      <AbsoluteFill style={{ filter: `grayscale(${gray})` }}>
        <ThreeCanvas
          width={width}
          height={height}
          orthographic
          shadows
          flat
          camera={{ position: [10, 11, 10], zoom: 64, near: 0.1, far: 200 }}
        >
          <World />
        </ThreeCanvas>
      </AbsoluteFill>
      <StationLabels />

      <Counter />
      <Chip at={CUE.fita} until={CUE.caixaCai} color="#C99400">MEDINDO O SEU PROCESSO</Chip>
      <Chip at={CUE.caixaBate} until={CUE.caixaSome + 0.8} color={RED}>SISTEMA PADRÃO · NÃO ENCAIXA</Chip>
      <Chip at={CUE.trilhos} until={CUE.umaVez} color={BLUE}>FEITO SOB MEDIDA</Chip>
      <LivePanel />

      {SUBS.map((s) => (
        <Sequence key={s.from} name="Legenda" from={f(s.from)} durationInFrames={f(s.to - s.from) + 10} premountFor={fps}>
          <Caption
            text={s.text}
            at={0}
            speechFrames={f(s.to - s.from) * 0.85}
            size={56}
            top={1440}
            center
            color={INK}
            accent={s.accent ?? BLUE}
            outAt={f(s.to - s.from)}
          />
        </Sequence>
      ))}

      <ComentaCard />
      {frame >= f(CUE.logo) - 1 ? <LogoEnd /> : null}
      <Grain vignette={false} amount={0.05} />
    </AbsoluteFill>
  );
};
