import { Audio } from "@remotion/media";
import { ThreeCanvas } from "@remotion/three";
import {
  AbsoluteFill,
  Easing,
  Img,
  Sequence,
  interpolate,
  interpolateColors,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import * as THREE from "three";
import { Caption } from "../../shared/components/Caption";
import { Grain } from "../../shared/components/Grain";
import { MONO, SANS, SFX, clamp } from "../../shared/theme";
import { City, CityCamera, WARM, type CityState } from "./City";
import { CUE, MUSICA, MUSIC_TRIM, N, NARRACAO, SUBS, f } from "./timeline";

type Key = { t: number; pos: [number, number, number]; tgt: [number, number, number] };

// One continuous camera: each key is a framing; moves between keys are eased.
// Storefront framing: wide enough to keep the glass frame and facade around the tiny reception.
const STORE: Pick<Key, "pos" | "tgt"> = { pos: [-1.15, 1.55, 2.9], tgt: [-1.6, 0.65, -2.6] };
const KEYS: Key[] = [
  { t: 0, pos: [2, 20, 19], tgt: [0, 0, -1] },
  { t: 2.6, pos: [-0.6, 4.6, 9.5], tgt: [-1.6, 1.6, -2.4] },
  { t: 6.9, pos: [0.4, 3.2, 7.2], tgt: [-1.6, 1.4, -2.4] },
  { t: 8.0, ...STORE },
  { t: 12.4, pos: [-1.6, 1.45, 2.5], tgt: [-1.6, 0.6, -2.6] },
  { t: 13.3, pos: [2.5, 8.5, 15], tgt: [-0.5, 2.0, -2.2] },
  { t: 16.3, pos: [2.0, 8.0, 14], tgt: [-0.6, 2.0, -2.2] },
  { t: 18.0, pos: [-0.5, 3.5, 7.5], tgt: [-1.6, 1.4, -2.4] },
  { t: 20.2, ...STORE },
  { t: 21.7, pos: [-1.3, 1.5, 2.6], tgt: [-1.6, 0.6, -2.6] },
  { t: 22.6, pos: [3, 7.5, 13], tgt: [-0.5, 1.2, -0.5] },
  { t: 24.3, pos: [2.6, 7, 12.4], tgt: [-0.5, 1.2, -0.5] },
  { t: 25.0, ...STORE },
  { t: 26.8, pos: [-1.4, 1.5, 2.6], tgt: [-1.6, 0.6, -2.6] },
  { t: 27.8, pos: [0.6, 7.0, 12.5], tgt: [0.6, 2.4, -2.6] },
  { t: 31.3, pos: [0.9, 6.8, 12.0], tgt: [0.6, 2.3, -2.6] },
  { t: 32.2, pos: [6.6, 3.8, 12.0], tgt: [8.6, 1.0, 3.4] },
  { t: 33.6, pos: [6.8, 3.9, 11.6], tgt: [8.6, 1.0, 3.4] },
  { t: 37.0, pos: [8.2, 12.5, 15.5], tgt: [8.2, 0.5, 2.6] },
  { t: 40, pos: [8.2, 13, 16], tgt: [8.2, 0.5, 2.6] },
];

const cameraAt = (frame: number) => {
  const t = frame / 30;
  const i = Math.max(0, KEYS.findIndex((k, idx) => idx < KEYS.length - 1 && t >= k.t && t < KEYS[idx + 1].t));
  const a = KEYS[i];
  const b = KEYS[Math.min(i + 1, KEYS.length - 1)];
  const p = b.t === a.t ? 1 : interpolate(t, [a.t, b.t], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  return {
    pos: new THREE.Vector3(...a.pos).lerp(new THREE.Vector3(...b.pos), p),
    target: new THREE.Vector3(...a.tgt).lerp(new THREE.Vector3(...b.tgt), p),
  };
};

const at = (frame: number, cue: number) => frame >= f(cue);
const ramp = (frame: number, from: number, to: number, a = 0, b = 1) =>
  interpolate(frame, [f(from), f(to)], [a, b], { ...clamp, easing: Easing.inOut(Easing.quad) });

const stateAt = (frame: number): CityState => {
  const t = frame / 30;

  // Days flashing by during "A clínica cresceu": two quick day/night cycles that end at night.
  const flicker = t >= 13.3 && t < 15.2 ? 0.5 - 0.5 * Math.cos(((t - 13.3) / 0.95) * Math.PI * 2) : 0;
  const sunrise = ramp(frame, CUE.construiu, CUE.construiu + 1.6);
  const sunset = ramp(frame, 26.9, 27.7);
  const day = Math.max(flicker, sunrise * (1 - sunset));
  const dusk = sunset * (1 - ramp(frame, CUE.apaga + 0.4, 32.2));

  const nightStart = interpolate(frame, [f(CUE.ultima), f(CUE.dela)], [0.6, 0], clamp);
  const evening = at(frame, 26.9) ? (at(frame, CUE.apaga) ? 0 : 0.9) : 0;
  const lit = t < 13 ? nightStart : t < 15.2 ? 0.6 * (1 - flicker) * (flicker > 0.15 ? 1 : 0) : evening;

  const clinicLight =
    t < CUE.construiu ? 1 : t < 26.9 ? 0.55 : at(frame, CUE.apaga) ? ramp(frame, CUE.apaga, CUE.apaga + 0.15, 1, 0) : 1;

  const hours =
    t < 13.3
      ? 22.3
      : t < 15.2
        ? 22.3 + ((t - 13.3) / 1.9) * 48
        : t < CUE.construiu
          ? 22.4
          : t < 26.9
            ? interpolate(t, [CUE.construiu, CUE.construiu + 1.6, 26.9], [22.4, 33, 41.5], clamp)
            : interpolate(t, [26.9, CUE.seis], [41.5, 42], clamp);

  return {
    lit: at(frame, CUE.apaga) ? 0 : lit,
    houseLit: ramp(frame, CUE.outra, CUE.outra + 0.15),
    lampsOn: 1 - day * 0.9,
    hours,
    day,
    dusk,
    orbs: interpolate(frame, [f(CUE.pacientes), f(CUE.pacientes + 1.8)], [0, 1], clamp),
    clinic: {
      light: clinicLight,
      grow: interpolate(frame, [f(CUE.cresceu), f(CUE.cresceu) + 16], [1, 1.4], { ...clamp, easing: Easing.out(Easing.back(1.8)) }),
      papers: ramp(frame, 7.9, 12.4, 0.15, 1),
      papersFly: ramp(frame, CUE.construiu, CUE.construiu + 1.1),
      screen: t < CUE.construiu + 0.3 ? 0 : t < CUE.caixa ? 1 : 2,
      calendar: ramp(frame, CUE.agenda, CUE.agenda + 1.3),
      phoneBuzz: t >= CUE.whatsapp && t < CUE.whatsapp + 1.3 ? 1 : 0,
      wallHours: t < 12.4 ? interpolate(t, [7.9, 12.1], [18.5, 22], clamp) : interpolate(t, [CUE.construiu, 26.9], [9, 17.9], clamp),
      slump: t < CUE.construiu ? ramp(frame, 7.9, 12.4, 0.05, 0.8) : ramp(frame, CUE.construiu, CUE.construiu + 1, 0.8, 0),
      sweep: t >= CUE.construiu - 0.2 && t <= CUE.construiu + 0.8 ? (t - CUE.construiu + 0.2) : -1,
    },
  };
};

const Stars: React.FC<{ readonly opacity: number }> = ({ opacity }) => (
  <AbsoluteFill style={{ opacity }}>
    {Array.from({ length: 80 }).map((_, i) => {
      const x = (Math.sin(i * 91.7) * 0.5 + 0.5) * 1080;
      const y = (Math.sin(i * 37.3) * 0.5 + 0.5) * 820;
      const s = 2 + (i % 3);
      return <div key={i} style={{ position: "absolute", left: x, top: y, width: s, height: s, borderRadius: s, backgroundColor: "#FFFFFF", opacity: 0.3 + (i % 5) * 0.13 }} />;
    })}
  </AbsoluteFill>
);

const Sky: React.FC<{ readonly day: number; readonly dusk: number }> = ({ day, dusk }) => (
  <AbsoluteFill
    style={{
      background: `linear-gradient(180deg, ${interpolateColors(day, [0, 1], ["#050A1A", "#6FA8FF"])} 0%, ${interpolateColors(day, [0, 1], ["#1A2654", "#D6E8FF"])} 75%)`,
    }}
  >
    <AbsoluteFill style={{ background: "linear-gradient(180deg, #3B2A6B 0%, #F08A5D 55%, #FFC86B 78%)", opacity: dusk }} />
    <Stars opacity={(1 - day) * (1 - dusk)} />
  </AbsoluteFill>
);

const LogoEnd: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ alignItems: "center", paddingTop: 290 }}>
      <Img
        src={staticFile("brand/codexy-logo-light.png")}
        style={{
          width: 720,
          opacity: interpolate(frame, [f(CUE.logo), f(CUE.logo) + 10], [0, 1], clamp),
          filter: `blur(${interpolate(frame, [f(CUE.logo), f(CUE.logo) + 14], [14, 0], clamp)}px) drop-shadow(0 0 30px rgba(255,200,107,0.35))`,
        }}
      />
      <div
        style={{
          marginTop: 40,
          fontFamily: SANS,
          fontSize: 58,
          fontWeight: 700,
          color: "#FFFFFF",
          textAlign: "center",
          lineHeight: 1.25,
          textShadow: "0 4px 30px rgba(0,0,0,0.6)",
          opacity: interpolate(frame, [f(CUE.software), f(CUE.software) + 10], [0, 1], clamp),
        }}
      >
        Software sob medida...
        <br />
        <span style={{ color: WARM, opacity: interpolate(frame, [f(CUE.casa) - 12, f(CUE.casa)], [0, 1], clamp) }}>
          pra você voltar pra casa.
        </span>
      </div>
      <div
        style={{
          marginTop: 30,
          fontFamily: MONO,
          fontSize: 32,
          letterSpacing: 2,
          color: "#C9D3EE",
          opacity: interpolate(frame, [f(CUE.casa) + 10, f(CUE.casa) + 22], [0, 1], clamp),
        }}
      >
        codexy.com.br · @codexy.ai
      </div>
    </AbsoluteFill>
  );
};

export const UltimaLuz: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height, durationInFrames } = useVideoConfig();
  const s = stateAt(frame);
  const cam = cameraAt(frame);

  return (
    <AbsoluteFill style={{ backgroundColor: "#050A1A" }}>
      {/* The music drops out for one beat after "O tempo dela, não." */}
      <Audio
        name="Música"
        src={staticFile(MUSICA)}
        trimBefore={f(MUSIC_TRIM)}
        volume={(fr) =>
          interpolate(
            fr,
            [0, 10, f(CUE.silencio), f(CUE.silencio) + 6, f(16.2), f(16.6), durationInFrames - f(1.5), durationInFrames - 1],
            [0, 0.32, 0.32, 0.04, 0.04, 0.34, 0.34, 0],
            clamp,
          )
        }
        premountFor={fps}
      />
      {N.map((n) => (
        <Sequence key={n.file} name={`Voz ${n.file}`} from={f(n.at)} premountFor={fps}>
          <Audio src={staticFile(`${NARRACAO}/${n.file}`)} />
        </Sequence>
      ))}
      {[0, 6, 12].map((d) => (
        <Sequence key={d} name="SFX celular" from={f(CUE.whatsapp) + d} durationInFrames={6} premountFor={fps}>
          <Audio src={staticFile(SFX.softTick)} volume={0.4} />
        </Sequence>
      ))}
      <Sequence name="SFX riser" from={f(CUE.construiu) - 33} durationInFrames={40} premountFor={fps}>
        <Audio src={staticFile(SFX.softRiser)} volume={0.35} />
      </Sequence>
      <Sequence name="SFX virada" from={f(CUE.construiu)} durationInFrames={50} premountFor={fps}>
        <Audio src={staticFile(SFX.softImpact)} volume={0.45} />
      </Sequence>
      {[0, 5, 10, 15, 20, 25].map((d) => (
        <Sequence key={d} name="SFX confirmações" from={f(CUE.pacientes) + 8 + d} durationInFrames={15} premountFor={fps}>
          <Audio src={staticFile(SFX.softBubble)} volume={0.28} />
        </Sequence>
      ))}
      <Sequence name="SFX caixa" from={f(CUE.caixa)} durationInFrames={15} premountFor={fps}>
        <Audio src={staticFile(SFX.softBubble)} volume={0.45} playbackRate={0.8} />
      </Sequence>
      <Sequence name="SFX luzes apagam" from={f(CUE.apaga)} durationInFrames={30} premountFor={fps}>
        <Audio src={staticFile(SFX.pop)} volume={0.5} />
      </Sequence>
      <Sequence name="SFX luz de casa" from={f(CUE.outra)} durationInFrames={30} premountFor={fps}>
        <Audio src={staticFile(SFX.pop)} volume={0.5} playbackRate={1.15} />
      </Sequence>
      <Sequence name="SFX logo" from={f(CUE.logo)} durationInFrames={50} premountFor={fps}>
        <Audio src={staticFile(SFX.softImpact)} volume={0.4} />
      </Sequence>

      <Sky day={s.day} dusk={s.dusk} />
      <ThreeCanvas width={width} height={height} shadows camera={{ fov: 36, position: [2, 20, 19], near: 0.05, far: 200 }}>
        <CityCamera pos={cam.pos} target={cam.target} />
        <City s={s} />
      </ThreeCanvas>
      {frame >= f(CUE.logo) - 2 ? <LogoEnd /> : null}
      <AbsoluteFill
        style={{
          background: "linear-gradient(180deg, transparent 70%, rgba(3,6,16,0.55) 100%)",
          pointerEvents: "none",
        }}
      />

      {SUBS.map((sub) => (
        <Sequence key={sub.from} name="Legenda" from={f(sub.from)} durationInFrames={f(sub.to - sub.from) + 10} premountFor={fps}>
          <Caption
            text={sub.text}
            at={0}
            speechFrames={f(sub.to - sub.from) * 0.85}
            size={56}
            top={1470}
            center
            accent={sub.accent ?? WARM}
            outAt={f(sub.to - sub.from)}
          />
        </Sequence>
      ))}

      <AbsoluteFill
        style={{
          backgroundColor: "#000",
          opacity: interpolate(frame, [durationInFrames - 15, durationInFrames - 1], [0, 1], clamp),
        }}
      />
      <Grain amount={0.06} />
    </AbsoluteFill>
  );
};
