import { Audio } from "@remotion/media";
import { AbsoluteFill, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Caption } from "../../shared/components/Caption";
import { Grain } from "../../shared/components/Grain";
import { SFX, clamp } from "../../shared/theme";
import { CtaMoment, TotalMoment, ViradaMoment } from "./BigMoments";
import { Receipt } from "./Receipt";
import { Vignettes } from "./Vignettes";
import { CUE, MUSICA, MUSIC_AT, N, NARRACAO, PHASE, SUBS, f } from "./timeline";

const Ambient: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: "#02060F" }}>
      <div
        style={{
          position: "absolute",
          width: 1400,
          height: 1400,
          left: -200 + Math.sin(frame / 80) * 140,
          top: -200 + Math.cos(frame / 95) * 160,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(0,60,180,0.3), transparent 65%)",
        }}
      />
    </AbsoluteFill>
  );
};

const PRINTS = [CUE.tear, CUE.linhaTempo, CUE.linhaPessoa, CUE.linhaPedido, CUE.linhaLucro];

export const CustoPlanilha: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const musicLen = durationInFrames - f(MUSIC_AT);

  return (
    <AbsoluteFill>
      <Ambient />

      {/* Music ducks to near-silence for the turn ("A planilha nunca foi de graça"). */}
      <Sequence name="Música" from={f(MUSIC_AT)} premountFor={fps}>
        <Audio
          src={staticFile(MUSICA)}
          volume={(fr) =>
            interpolate(
              fr,
              [0, 8, f(44.6 - MUSIC_AT), f(45.1 - MUSIC_AT), f(49.3 - MUSIC_AT), f(49.8 - MUSIC_AT), musicLen - f(1), musicLen - 1],
              [0, 0.32, 0.32, 0.07, 0.07, 0.38, 0.38, 0],
              clamp,
            )
          }
        />
      </Sequence>

      {N.map((n) => (
        <Sequence key={n.file} name={`Voz ${n.file}`} from={f(n.at)} premountFor={fps}>
          <Audio src={staticFile(`${NARRACAO}/${n.file}`)} />
        </Sequence>
      ))}

      <Sequence name="SFX rasga etiqueta" from={f(CUE.tear) - 2} durationInFrames={25} premountFor={fps}>
        <Audio src={staticFile(SFX.softWhoosh)} volume={0.45} />
      </Sequence>
      {PRINTS.map((t) =>
        [0, 3, 6].map((d) => (
          <Sequence key={`${t}-${d}`} name="SFX impressão" from={f(t) + d} durationInFrames={5} premountFor={fps}>
            <Audio src={staticFile(SFX.softTick)} volume={0.35} />
          </Sequence>
        )),
      )}
      <Sequence name="SFX papel voa" from={f(CUE.papelVoa)} durationInFrames={25} premountFor={fps}>
        <Audio src={staticFile(SFX.softWhoosh)} volume={0.4} />
      </Sequence>
      <Sequence name="SFX riser" from={f(CUE.riser)} durationInFrames={40} premountFor={fps}>
        <Audio src={staticFile(SFX.softRiser)} volume={0.45} />
      </Sequence>
      <Sequence name="SFX por ano" from={f(CUE.ano)} durationInFrames={50} premountFor={fps}>
        <Audio src={staticFile(SFX.softImpact)} volume={0.6} />
      </Sequence>
      <Sequence name="SFX risco" from={f(CUE.risco)} durationInFrames={25} premountFor={fps}>
        <Audio src={staticFile(SFX.softWhoosh)} volume={0.5} playbackRate={1.5} />
      </Sequence>
      <Sequence name="SFX logo" from={f(CUE.codexy)} durationInFrames={50} premountFor={fps}>
        <Audio src={staticFile(SFX.softImpact)} volume={0.7} />
      </Sequence>

      <Sequence name="Vinhetas" from={0} durationInFrames={f(PHASE.vinhetas.to)}>
        <Vignettes />
      </Sequence>
      <Sequence name="Total" from={0} durationInFrames={f(PHASE.total.to)}>
        <TotalMoment />
      </Sequence>
      <Receipt />
      {SUBS.map((s) => (
        <Sequence key={s.from} name="Legenda" from={f(s.from)} durationInFrames={f(s.to - s.from) + 10} premountFor={fps}>
          <Caption
            text={s.text}
            at={0}
            speechFrames={f(s.to - s.from) * 0.85}
            size={58}
            top={880}
            center
            accent={s.accent}
            outAt={f(s.to - s.from)}
          />
        </Sequence>
      ))}
      <ViradaMoment />
      <CtaMoment />

      <AbsoluteFill
        style={{
          backgroundColor: "#000",
          opacity: interpolate(frame, [durationInFrames - 15, durationInFrames - 1], [0, 1], clamp),
        }}
      />
      <Grain />
    </AbsoluteFill>
  );
};
