import { Audio } from "@remotion/media";
import {
  AbsoluteFill,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { SFX, clamp } from "../../shared/theme";
import { Grain } from "../../shared/components/Grain";
import { ConstroiScene } from "./scenes/ConstroiScene";
import { ContrarioScene } from "./scenes/ContrarioScene";
import { EntendeScene } from "./scenes/EntendeScene";
import { LogoScene } from "./scenes/LogoScene";
import { ProvaScene } from "./scenes/ProvaScene";
import { RedeScene } from "./scenes/RedeScene";
import { ServicosScene } from "./scenes/ServicosScene";
import { SeuJeitoScene } from "./scenes/SeuJeitoScene";
import { BEAT, MUSICA, N, NARRACAO, SCENE, f } from "./timeline";

// Gradient-only light leak: the WebGL lightLeak() shader failed to compile on this machine's GPU.
const LightLeak: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const p = interpolate(frame, [0, durationInFrames - 1], [0, 1], clamp);
  const strength = interpolate(p, [0, 0.25, 1], [0, 1, 0], clamp);
  return (
    <AbsoluteFill style={{ mixBlendMode: "screen", opacity: 0.75 * strength, overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          width: 1600,
          height: 1600,
          left: interpolate(p, [0, 1], [-900, 300]),
          top: interpolate(p, [0, 1], [-500, 200]),
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,170,110,0.9), rgba(255,90,60,0.35) 35%, transparent 65%)",
          filter: "blur(40px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 1400,
          height: 1400,
          right: interpolate(p, [0, 1], [-1000, 200]),
          bottom: interpolate(p, [0, 1], [-400, 300]),
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(120,170,255,0.9), rgba(0,85,255,0.35) 40%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />
    </AbsoluteFill>
  );
};

const Ambient: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: "#02060F" }}>
      <div
        style={{
          position: "absolute",
          width: 1400,
          height: 1400,
          left: -160 + Math.sin(frame / 70) * 120,
          top: 120 + Math.cos(frame / 90) * 160,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(0,60,180,0.28), transparent 65%)",
        }}
      />
    </AbsoluteFill>
  );
};

const scene = (s: { from: number; to: number }) => ({
  from: f(s.from),
  durationInFrames: f(s.to - s.from),
});

const narration = (file: string) => staticFile(`${NARRACAO}/${file}`);

export const Manifesto: React.FC = () => {
  const { fps, durationInFrames } = useVideoConfig();

  return (
    <AbsoluteFill>
      <Ambient />

      {/* Music ducks to near-silence for "A gente faz o..." and comes back on the "contrário" hit. */}
      <Audio
        name="Música"
        src={staticFile(MUSICA)}
        volume={(fr) =>
          interpolate(
            fr,
            [0, 6, f(6.5), f(6.9), f(BEAT.contrario) - 2, f(BEAT.contrario), durationInFrames - f(0.8), durationInFrames - 1],
            [0, 0.5, 0.5, 0.08, 0.08, 0.6, 0.6, 0],
            clamp,
          )
        }
        premountFor={fps}
      />

      <Sequence name="Voz 01" from={f(N.jeitoUnico)} premountFor={fps}>
        <Audio src={narration("01-jeito-unico.wav")} />
      </Sequence>
      <Sequence name="Voz 02" from={f(N.molde)} premountFor={fps}>
        <Audio src={narration("02-molde.wav")} />
      </Sequence>
      <Sequence name="Voz 03" from={f(N.contrario)} premountFor={fps}>
        <Audio src={narration("03-contrario.wav")} />
      </Sequence>
      <Sequence name="Voz 04" from={f(N.entende)} premountFor={fps}>
        <Audio src={narration("04-entende.wav")} />
      </Sequence>
      <Sequence name="Voz 05" from={f(N.constroi)} premountFor={fps}>
        <Audio src={narration("05-constroi.wav")} />
      </Sequence>
      {[N.sistemas, N.sites, N.chatbots].map((w, i) => (
        <Sequence
          key={i}
          name={`Voz 06.${i + 1}`}
          from={f(w.at)}
          durationInFrames={f(w.to - w.from)}
          premountFor={fps}
        >
          <Audio src={narration("06-servicos.wav")} trimBefore={f(w.from)} />
        </Sequence>
      ))}
      <Sequence name="Voz 07" from={f(N.seuJeito)} premountFor={fps}>
        <Audio src={narration("07-seu-jeito.wav")} />
      </Sequence>
      <Sequence name="Voz 08" from={f(N.assinatura)} premountFor={fps}>
        <Audio src={narration("08-assinatura.wav")} />
      </Sequence>

      <Sequence name="SFX riser" from={f(BEAT.contrario) - 33} durationInFrames={40} premountFor={fps}>
        <Audio src={staticFile(SFX.softRiser)} volume={0.5} />
      </Sequence>
      <Sequence name="SFX corte" from={f(BEAT.contrario) - 3} durationInFrames={25} premountFor={fps}>
        <Audio src={staticFile(SFX.softWhoosh)} volume={0.6} />
      </Sequence>
      <Sequence name="SFX drop" from={f(BEAT.sistemas)} durationInFrames={50} premountFor={fps}>
        <Audio src={staticFile(SFX.softImpact)} volume={0.55} />
      </Sequence>
      <Sequence name="SFX logo" from={f(BEAT.logo)} durationInFrames={50} premountFor={fps}>
        <Audio src={staticFile(SFX.softImpact)} volume={0.7} />
      </Sequence>
      {BEAT.proofCuts.map((t) => (
        <Sequence key={t} name="SFX corte prova" from={f(t)} durationInFrames={6} premountFor={fps}>
          <Audio src={staticFile(SFX.softTick)} volume={0.35} />
        </Sequence>
      ))}

      <Sequence name="1 · Jeito único / molde" {...scene(SCENE.rede)} premountFor={fps}>
        <RedeScene />
      </Sequence>
      <Sequence name="2 · Contrário" {...scene(SCENE.contrario)} premountFor={fps}>
        <ContrarioScene />
      </Sequence>
      <Sequence name="3 · Entende" {...scene(SCENE.entende)} premountFor={fps}>
        <EntendeScene />
      </Sequence>
      <Sequence name="4 · Constrói" {...scene(SCENE.constroi)} premountFor={fps}>
        <ConstroiScene />
      </Sequence>
      <Sequence name="5 · Prova" {...scene(SCENE.prova)} premountFor={fps}>
        <ProvaScene />
      </Sequence>
      <Sequence name="6 · Sistemas Sites Chatbots" {...scene(SCENE.servicos)} premountFor={fps}>
        <ServicosScene />
      </Sequence>
      <Sequence name="7 · Seu jeito" {...scene(SCENE.seuJeito)} premountFor={fps}>
        <SeuJeitoScene />
      </Sequence>
      <Sequence name="8 · Logo" {...scene(SCENE.logo)} premountFor={fps}>
        <LogoScene />
      </Sequence>

      <Sequence name="Light leak · contrário" from={f(BEAT.contrario)} durationInFrames={36} premountFor={fps}>
        <LightLeak />
      </Sequence>
      <Sequence name="Light leak · drop" from={f(BEAT.sistemas)} durationInFrames={36} premountFor={fps}>
        <LightLeak />
      </Sequence>

      <Grain />
    </AbsoluteFill>
  );
};
