import { Audio } from "@remotion/media";
import {
  AbsoluteFill,
  Easing,
  Img,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Background } from "../../shared/components/Background";
import { Caption } from "../../shared/components/Caption";
import { ChevronWipe } from "../../shared/components/ChevronWipe";
import { Grain } from "../../shared/components/Grain";
import { C, EASE, MONO, SANS, SFX, clamp } from "../../shared/theme";
import {
  AgendaAntes,
  AgendaDepois,
  CaixaAntes,
  CaixaDepois,
  MensagensAntes,
  MensagensDepois,
  PlanilhaAntes,
  PlanilhaDepois,
} from "./Screens";
import { AREAS, CUE, MUSICA, N, NARRACAO, SUBS, f } from "./timeline";

const RED = "#E5484D";
const PANEL = { left: 80, top: 360, width: 920, height: 1080 };
const SWAP = 10;

const SCREENS = [
  { antes: AgendaAntes, depois: AgendaDepois },
  { antes: MensagensAntes, depois: MensagensDepois },
  { antes: PlanilhaAntes, depois: PlanilhaDepois },
  { antes: CaixaAntes, depois: CaixaDepois },
];

const chevronClip = (p: number) => {
  // A ">"-shaped reveal that sweeps left to right across the panel.
  const x = interpolate(p, [0, 1], [-60, 160]);
  return `polygon(0% 0%, ${x}% 0%, ${x + 22}% 50%, ${x}% 100%, 0% 100%)`;
};

const Area: React.FC<{ readonly i: number }> = ({ i }) => {
  const frame = useCurrentFrame();
  const a = AREAS[i];
  const { antes: Antes, depois: Depois } = SCREENS[i];
  const start = f(a.start);
  const swap = f(a.swap);
  const end = f(a.end);
  if (frame < start - 2 || frame > end + 10) return null;

  const enter = interpolate(frame, [start, start + 9], [1, 0], { ...clamp, easing: Easing.out(Easing.cubic) });
  const leave = interpolate(frame, [end, end + 9], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });
  const p = interpolate(frame, [swap, swap + SWAP], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const blur = Math.sin(Math.PI * p) * 14;
  const tAntes = frame - start;
  const tDepois = frame - swap;

  let antesStyle: React.CSSProperties = {};
  let depoisStyle: React.CSSProperties = {};
  if (i === 0) {
    antesStyle = { translate: `${-1150 * p}px 0px`, filter: `blur(${blur}px)` };
    depoisStyle = { translate: `${1150 * (1 - p)}px 0px`, filter: `blur(${blur}px)` };
  } else if (i === 1) {
    const half = p < 0.5;
    antesStyle = { transform: `perspective(2200px) rotateY(${interpolate(p, [0, 0.5], [0, 90], clamp)}deg)`, opacity: half ? 1 : 0 };
    depoisStyle = { transform: `perspective(2200px) rotateY(${interpolate(p, [0.5, 1], [-90, 0], clamp)}deg)`, opacity: half ? 0 : 1 };
  } else if (i === 2) {
    antesStyle = { scale: interpolate(p, [0, 1], [1, 4.5]), opacity: interpolate(p, [0, 0.6], [1, 0], clamp), filter: `blur(${p * 18}px)`, transformOrigin: "62% 38%" };
    depoisStyle = { scale: interpolate(p, [0, 1], [0.55, 1]), opacity: interpolate(p, [0.2, 0.7], [0, 1], clamp) };
  } else {
    depoisStyle = { clipPath: chevronClip(p) };
  }

  return (
    <div
      style={{
        position: "absolute",
        ...PANEL,
        translate: `0px ${enter * 900 - leave * 900}px`,
        filter: `blur(${(enter + leave) * 16}px)`,
        opacity: 1 - leave,
      }}
    >
      {p < 1 ? (
        <div style={{ position: "absolute", inset: 0, ...antesStyle }}>
          <Antes t={tAntes} />
        </div>
      ) : null}
      {p > 0 ? (
        <div style={{ position: "absolute", inset: 0, ...depoisStyle }}>
          <Depois t={Math.max(0, tDepois)} />
        </div>
      ) : null}
    </div>
  );
};

const Chips: React.FC = () => {
  const frame = useCurrentFrame();
  const idx = AREAS.findIndex((a) => frame >= f(a.start) && frame < f(a.end) + 6);
  const visible =
    interpolate(frame, [f(CUE.intoAreas), f(CUE.intoAreas) + 8], [0, 1], clamp) *
    interpolate(frame, [f(AREAS[3].end), f(AREAS[3].end) + 8], [1, 0], clamp);
  if (idx < 0 && visible <= 0) return null;
  const a = AREAS[Math.max(0, idx)];
  const depois = frame >= f(a.swap) + SWAP / 2;
  const flip = interpolate(frame, [f(a.swap), f(a.swap) + 8], [1.25, 1], { ...clamp, easing: EASE });
  return (
    <div style={{ opacity: visible }}>
      <div style={{ position: "absolute", top: 150, left: 80, right: 80, display: "flex", gap: 14 }}>
        {AREAS.map((ar, k) => (
          <div key={ar.id} style={{ flex: 1, height: 8, borderRadius: 4, backgroundColor: k <= idx ? C.glow : "rgba(255,255,255,0.14)", boxShadow: k === idx ? `0 0 16px ${C.glow}` : "none" }} />
        ))}
      </div>
      <div style={{ position: "absolute", top: 220, left: 80, right: 80, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontFamily: MONO, fontSize: 34, letterSpacing: 4, color: C.ice }}>
          <span style={{ color: C.glow }}>0{Math.max(0, idx) + 1}</span> · {a.label}
        </div>
        <div
          style={{
            padding: "12px 30px",
            borderRadius: 999,
            backgroundColor: depois ? C.blue : RED,
            color: "#FFFFFF",
            fontFamily: SANS,
            fontSize: 34,
            fontWeight: 800,
            letterSpacing: 2,
            boxShadow: `0 10px 30px ${depois ? C.blue : RED}66`,
            scale: depois ? flip : 1,
          }}
        >
          {depois ? "DEPOIS" : "ANTES"}
        </div>
      </div>
    </div>
  );
};

const Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const out = interpolate(frame, [f(CUE.intoAreas) - 6, f(CUE.intoAreas)], [1, 0], clamp);
  if (out <= 0) return null;
  const lines = [
    { txt: "Mesma empresa.", at: CUE.mesma, color: "#FFFFFF" },
    { txt: "Mesmo time.", at: CUE.time, color: "#FFFFFF" },
    { txt: "Só mudou o sistema.", at: CUE.so, color: C.glow },
  ];
  const split = interpolate(frame, [f(0.2), f(1.2)], [0, 1], { ...clamp, easing: EASE });
  return (
    <AbsoluteFill style={{ opacity: out }}>
      {lines.map((l, k) => (
        <div
          key={l.txt}
          style={{
            position: "absolute",
            top: 190 + k * 110,
            left: 0,
            right: 0,
            textAlign: "center",
            fontFamily: SANS,
            fontSize: 92,
            fontWeight: 800,
            letterSpacing: -3,
            color: l.color,
            textShadow: k === 2 ? "0 0 40px rgba(51,119,255,0.6)" : "none",
            opacity: interpolate(frame, [f(l.at), f(l.at) + 6], [0, 1], clamp),
            translate: `0px ${interpolate(frame, [f(l.at), f(l.at) + 12], [40, 0], { ...clamp, easing: EASE })}px`,
          }}
        >
          {l.txt}
        </div>
      ))}
      {[
        { label: "ANTES", color: RED, x: 80, Screen: MensagensAntes, dir: -1 },
        { label: "DEPOIS", color: C.blue, x: 560, Screen: MensagensDepois, dir: 1 },
      ].map((s) => (
        <div
          key={s.label}
          style={{
            position: "absolute",
            left: s.x,
            top: 600,
            width: 440,
            height: 780,
            translate: `${(1 - split) * s.dir * 600}px 0px`,
          }}
        >
          <div style={{ width: 920, height: 1080, scale: 0.478, transformOrigin: "top left", filter: s.label === "ANTES" ? "saturate(0.7)" : "none" }}>
            <s.Screen t={frame} />
          </div>
          <div style={{ position: "absolute", top: -64, left: 0, padding: "8px 22px", borderRadius: 999, backgroundColor: s.color, color: "#FFFFFF", fontFamily: SANS, fontSize: 30, fontWeight: 800, letterSpacing: 2 }}>
            {s.label}
          </div>
        </div>
      ))}
    </AbsoluteFill>
  );
};

const Mosaic: React.FC = () => {
  const frame = useCurrentFrame();
  const from = f(AREAS[3].end);
  if (frame < from || frame > f(CUE.logo) + 4) return null;
  const merge = interpolate(frame, [f(CUE.umSistema), f(CUE.umSistema) + 20], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const out = interpolate(frame, [f(CUE.logo) - 10, f(CUE.logo)], [1, 0], clamp);
  const cells = [AgendaDepois, MensagensDepois, PlanilhaDepois, CaixaDepois];
  return (
    <AbsoluteFill style={{ opacity: out }}>
      {cells.map((Cell, k) => {
        const col = k % 2;
        const row = Math.floor(k / 2);
        const x = 80 + col * 470;
        const y = 380 + row * 560;
        const at = from + k * 3;
        return (
          <div
            key={k}
            style={{
              position: "absolute",
              left: interpolate(merge, [0, 1], [x, 315]),
              top: interpolate(merge, [0, 1], [y, 560]),
              width: 450,
              height: 528,
              rotate: `${interpolate(merge, [0, 1], [0, (k - 1.5) * 8])}deg`,
              opacity: interpolate(frame, [at, at + 6], [0, 1], clamp) * interpolate(merge, [0.6, 1], [1, 0.0], clamp),
              scale: interpolate(frame, [at, at + 10], [0.7, 1], { ...clamp, easing: EASE }) * interpolate(merge, [0, 1], [1, 0.75]),
            }}
          >
            <div style={{ width: 920, height: 1080, scale: 0.489, transformOrigin: "top left" }}>
              <Cell t={frame - at + 40} />
            </div>
          </div>
        );
      })}
      <div
        style={{
          position: "absolute",
          top: 820,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: SANS,
          fontSize: 110,
          fontWeight: 800,
          letterSpacing: -4,
          color: "#FFFFFF",
          textShadow: "0 0 50px rgba(51,119,255,0.7)",
          opacity: interpolate(merge, [0.55, 0.9], [0, 1], clamp),
          scale: interpolate(merge, [0.55, 1], [0.8, 1], clamp),
        }}
      >
        Do <span style={{ color: C.glow }}>seu</span> jeito.
      </div>
    </AbsoluteFill>
  );
};

const LogoEnd: React.FC = () => {
  const frame = useCurrentFrame();
  const at = f(CUE.logo);
  if (frame < at - 2) return null;
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", gap: 46 }}>
      <Img
        src={staticFile("brand/codexy-logo-light.png")}
        style={{
          width: 820,
          opacity: interpolate(frame, [at, at + 6], [0, 1], clamp),
          scale: interpolate(frame, [at, at + 14], [1.3, 1], { ...clamp, easing: EASE, output: "perceptual-scale" }),
          filter: "drop-shadow(0 0 40px rgba(51,119,255,0.6))",
        }}
      />
      <div style={{ fontFamily: SANS, fontSize: 64, fontWeight: 700, color: "#FFFFFF", opacity: interpolate(frame, [f(CUE.software), f(CUE.software) + 8], [0, 1], clamp) }}>
        Software sob <span style={{ color: C.glow }}>medida.</span>
      </div>
      <div style={{ fontFamily: MONO, fontSize: 36, letterSpacing: 2, color: C.ice, opacity: interpolate(frame, [f(CUE.software) + 12, f(CUE.software) + 22], [0, 1], clamp) }}>
        codexy.com.br · @codexy.ai
      </div>
    </AbsoluteFill>
  );
};

export const AntesDepois: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  return (
    <AbsoluteFill style={{ fontFamily: SANS }}>
      <Background tone="dark" />
      <Audio
        name="Música"
        src={staticFile(MUSICA)}
        volume={(fr) => interpolate(fr, [0, 6, durationInFrames - f(1), durationInFrames - 1], [0, 0.34, 0.34, 0], clamp)}
        premountFor={fps}
      />
      {N.map((n) => (
        <Sequence key={n.file} name={`Voz ${n.file}`} from={f(n.at)} premountFor={fps}>
          <Audio src={staticFile(`${NARRACAO}/${n.file}`)} />
        </Sequence>
      ))}
      {AREAS.map((a, k) => (
        <Sequence key={a.id} name={`SFX troca ${a.label}`} from={f(a.swap) - 2} durationInFrames={25} premountFor={fps}>
          <Audio src={staticFile(SFX.softWhoosh)} volume={k === 2 ? 0.7 : 0.5} playbackRate={k === 1 ? 1.3 : 1} />
        </Sequence>
      ))}
      {AREAS.slice(1).map((a) => (
        <Sequence key={a.id} name="SFX entra área" from={f(a.start)} durationInFrames={20} premountFor={fps}>
          <Audio src={staticFile(SFX.softWhoosh)} volume={0.25} playbackRate={1.6} />
        </Sequence>
      ))}
      <Sequence name="SFX drop" from={f(AREAS[2].swap)} durationInFrames={50} premountFor={fps}>
        <Audio src={staticFile(SFX.softImpact)} volume={0.5} />
      </Sequence>
      <Sequence name="SFX junta" from={f(CUE.umSistema)} durationInFrames={40} premountFor={fps}>
        <Audio src={staticFile(SFX.softRiser)} volume={0.3} />
      </Sequence>
      <Sequence name="SFX logo" from={f(CUE.logo)} durationInFrames={50} premountFor={fps}>
        <Audio src={staticFile(SFX.softImpact)} volume={0.65} />
      </Sequence>

      <Intro />
      <Sequence name="Wipe para as áreas" from={f(CUE.intoAreas) - 13} durationInFrames={26} premountFor={fps}>
        <ChevronWipe sound={SFX.softWhoosh} />
      </Sequence>
      {AREAS.map((a, k) => (
        <Area key={a.id} i={k} />
      ))}
      <Chips />
      <Mosaic />
      <LogoEnd />

      {SUBS.map((s) => (
        <Sequence key={s.from} name="Legenda" from={f(s.from)} durationInFrames={f(s.to - s.from) + 10} premountFor={fps}>
          <Caption text={s.text} at={0} speechFrames={f(s.to - s.from) * 0.85} size={54} top={1500} center accent={s.accent} outAt={f(s.to - s.from)} />
        </Sequence>
      ))}

      <AbsoluteFill style={{ backgroundColor: "#000", opacity: interpolate(frame, [durationInFrames - 12, durationInFrames - 1], [0, 1], clamp) }} />
      <Grain amount={0.06} />
    </AbsoluteFill>
  );
};
